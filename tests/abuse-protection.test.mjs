import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {createAbuseGuard, clientNetwork, recipientIdentity} from '../app/lib/abuse/guard.mjs';
import {createAbuseStore} from '../app/lib/abuse/store.mjs';

const request = ip => new Request('https://ges-ab.se/api/inquiries',{headers:{'x-vercel-forwarded-for':ip,'x-forwarded-for':'spoofed'}});
test('uses platform header and groups IPv6 networks and recipient aliases',()=>{
 assert.equal(clientNetwork(request('1.2.3.4'),true),'1.2.3.4');
 assert.equal(clientNetwork(request('2001:db8:1:2::1'),true),clientNetwork(request('2001:db8:1:2::abcd'),true));
 assert.equal(clientNetwork(request('::ffff:1.2.3.4'),true),'1.2.3.4');
 assert.equal(clientNetwork(request('fake, 1.2.3.4'),true),'unknown');
 assert.equal(clientNetwork(request('1.2.3.4'),false),'local');
 assert.equal(recipientIdentity(' PERSON@Example.COM '),'person@example.com');
 assert.equal(recipientIdentity('sales+one@example.com'),'sales+one@example.com');
 assert.equal(recipientIdentity('P.er.son+one@googlemail.com'),'person@gmail.com');
 assert.equal(recipientIdentity('p.er.son@company.com'),'p.er.son@company.com');
});
test('guard hashes identities, shares limits across requests and fails closed',async()=>{
 let params;
 const guard=createAbuseGuard({secret:'x'.repeat(40),onVercel:true,store:{admit:async value=>{params=value;return {allowed:false,retry_after:60};}}});
 await assert.rejects(guard(request('1.2.3.4'),'inquiry',{submissionId:randomUUID(),email:'person@example.com'}),e=>e.name==='AbuseLimitError'&&e.retryAfter===60);
 assert.ok(!JSON.stringify(params).includes('person@example.com'));
 assert.ok(!JSON.stringify(params).includes('1.2.3.4'));
 await assert.rejects(createAbuseGuard({secret:'',store:{admit:()=>assert.fail()}})(request('1.2.3.4'),'inquiry',{}));
});
test('Postgres admissions atomically constrain fresh IDs, preserve retries and bound attempts',async()=>{
 const db=new PGlite();
 try {
  await db.exec(await readFile(new URL('../migrations/004_abuse_protection.sql',import.meta.url),'utf8'));
  const sql=async(strings,...values)=>(await db.query(strings.reduce((text,part,i)=>text+(i?`$${i}`:'')+part,''),values)).rows;
  const store=createAbuseStore(sql);
  const kind='inquiry', eventId=randomUUID(), fingerprint='a'.repeat(64);
  const budgets=[{key:'global',limit:2,seconds:3600},{key:'recipient',limit:1,seconds:3600}];
  const attempts=[{key:'attempts',limit:5,seconds:3600}];
  const submit=(id=eventId,hash=fingerprint,b=budgets)=>store.admit({kind,eventId:id,fingerprint:hash,budgets:b,attempts});
  assert.equal((await submit()).allowed,true);
  assert.equal((await submit()).allowed,true); // same logical submission, no extra delivery budget
  assert.equal((await submit(eventId,'b'.repeat(64))).conflict,true);
  assert.equal((await submit(randomUUID())).allowed,false); // recipient cap
  assert.equal((await submit(randomUUID(),fingerprint,[budgets[0],{key:'recipient2',limit:1,seconds:3600}])).allowed,true); // rejected request did not consume global budget
  assert.equal((await submit()).allowed,false); // attempt cap also covers retries
  assert.equal((await db.query('select count(*)::int as count from gesab_abuse_admissions')).rows[0].count,2);
 } finally {await db.close();}
});

test('real handlers stop side effects at recipient and phone limits; ordinary retries still succeed',async()=>{
 const {handleInquiryRequest}=await import('../app/lib/inquiries/handler.mjs');
 const {handlePhoneClick}=await import('../app/lib/phone-clicks/handler.mjs');
 const {createLeadStore}=await import('../app/lib/leads/store.mjs');
 const {createPhoneClickStore}=await import('../app/lib/phone-clicks/store.mjs');
 const {saveAndDeliverLead}=await import('../app/lib/leads/intake.mjs');
 const db=new PGlite();
 try {
  for(const file of ['001_leads.sql','002_lead_progress_events.sql','003_phone_clicks.sql','004_abuse_protection.sql']) await db.exec(await readFile(new URL('../migrations/'+file,import.meta.url),'utf8'));
  const sql=async(strings,...values)=>(await db.query(strings.reduce((text,part,i)=>text+(i?`$${i}`:'')+part,''),values)).rows;
  const guard=createAbuseGuard({secret:'x'.repeat(40),onVercel:true,store:createAbuseStore(sql)});
  const leadStore=createLeadStore(sql), phoneStore=createPhoneClickStore(sql);
  let deliveries=0;
  const body={source:'footer',submissionId:randomUUID(),name:'Test',email:'test@example.com',phone:'0700000000',service:'',message:'Test'};
  async function inquiry(value,deliver=async()=>{deliveries++;}) {
   const req=new Request('https://ges-ab.se/api/inquiries',{method:'POST',headers:{'content-type':'application/json','x-vercel-forwarded-for':'1.2.3.4'},body:JSON.stringify(value)});
   return handleInquiryRequest(req,async(data,attribution)=>{await guard(req,'inquiry',data);await saveAndDeliverLead(data,attribution,{store:leadStore,deliver});});
  }
  assert.equal((await inquiry(body)).status,200);
  assert.equal((await inquiry({...body,submissionId:body.submissionId.toUpperCase()})).status,200);
  assert.equal(deliveries,1);
  assert.equal((await inquiry({...body,submissionId:randomUUID()})).status,200);
  const failedId=randomUUID();
  assert.equal((await inquiry({...body,submissionId:failedId},async()=>{throw Error('provider unavailable');})).status,503);
  assert.equal((await inquiry({...body,submissionId:failedId})).status,200); // reservation preserves retry at quota
  const denied=await inquiry({...body,submissionId:randomUUID()});
  assert.equal(denied.status,429);
  assert.ok(Number(denied.headers.get('retry-after'))>0);
  assert.equal(deliveries,3);
  assert.equal((await db.query('select count(*)::int as n from gesab_leads')).rows[0].n,3);
  assert.equal((await inquiry({...body,message:'different'})).status,409);
  async function phone(id) {
   const req=new Request('https://ges-ab.se/api/phone-clicks',{method:'POST',headers:{'content-type':'application/json',origin:'https://ges-ab.se','x-vercel-forwarded-for':'2.3.4.5'},body:JSON.stringify({eventId:id,phone:'+46736728814',page:'/'})});
   return handlePhoneClick(req,{registerPhoneClick:async value=>{await guard(req,'phone',value);return phoneStore.registerPhoneClick(value);}});
  }
  const firstPhone=randomUUID();
  assert.equal((await phone(firstPhone)).status,202);
  for(let i=1;i<20;i++) assert.equal((await phone(randomUUID())).status,202);
  assert.equal((await phone(randomUUID())).status,429);
  assert.equal((await phone(firstPhone)).status,202);
  assert.equal((await db.query('select count(*)::int as n from gesab_phone_clicks')).rows[0].n,20);
 } finally {await db.close();}
});

test('previous-day retries reserve current budgets and database failure cannot reach delivery',async()=>{
 const db=new PGlite();
 try {
  await db.exec(await readFile(new URL('../migrations/004_abuse_protection.sql',import.meta.url),'utf8'));
  const sql=async(strings,...values)=>(await db.query(strings.reduce((text,part,i)=>text+(i?`$${i}`:'')+part,''),values)).rows;
  const store=createAbuseStore(sql), eventId=randomUUID();
  const args={kind:'inquiry',eventId,fingerprint:'a'.repeat(64),attempts:[{key:'attempt',limit:10,seconds:3600}],budgets:[{key:'day',limit:1,seconds:86400}]};
  assert.equal((await store.admit(args)).allowed,true);
  await db.query("update gesab_abuse_admissions set budget_day=budget_day-1 where event_id=$1",[eventId]);
  assert.equal((await store.admit(args)).allowed,false);
  await db.exec('update gesab_abuse_buckets set used=0');
  assert.equal((await store.admit(args)).allowed,true);
  assert.equal((await store.admit(args)).allowed,true);
 } finally {await db.close();}
 const {handleInquiryRequest}=await import('../app/lib/inquiries/handler.mjs');
 const guard=createAbuseGuard({secret:'x'.repeat(40),store:{admit:async()=>{throw Error('private database detail');}}});
 const body={source:'footer',submissionId:randomUUID(),name:'Test',email:'test@example.com',phone:'0700000000',message:'Test'};
 const req=new Request('https://ges-ab.se/api/inquiries',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 const result=await handleInquiryRequest(req,async value=>{await guard(req,'inquiry',value);assert.fail('must not reach mail or storage');});
 assert.equal(result.status,503);
 assert.ok(!(await result.text()).includes('private database detail'));
});
