import test from 'node:test';
import assert from 'node:assert/strict';
import { recordPhoneClick } from '../app/tracking/phone-clicks.mjs';
import { handlePhoneClick } from '../app/lib/phone-clicks/handler.mjs';
import { contactInfo } from '../app/site-config.js';

const id = '11111111-1111-4111-8111-111111111111';
const payload = {eventId:id, phone:contactInfo.phonePrimaryInternational, page:'/contact'};
test('phone measurement never blocks dialing and sends a bounded keepalive request', async () => {
  let request;
  await recordPhoneClick({href:contactInfo.phonePrimaryHref,page:'/contact?email=private'}, {
    createId:()=>id, getAttribution:()=>({}), fetchImpl:async (url,options)=>{request={url,...options};},
  });
  assert.equal(request.keepalive,true);
  assert.equal(request.url,'/api/phone-clicks');
  assert.deepEqual(JSON.parse(request.body),payload);
  await recordPhoneClick({href:contactInfo.phonePrimaryHref,page:'/'}, {getAttribution:()=>{throw Error('storage');},fetchImpl:async()=>{throw Error('offline');}});
});
test('only business phone links produce records', async () => {
  let calls=0;
  for (const href of ['tel:+461234567','mailto:example@example.com']) {
    await recordPhoneClick({href,page:'/'},{fetchImpl:async()=>{calls++;}});
  }
  assert.equal(calls,0);
});
function request(body=payload,origin='https://www.ges-ab.se') {
  return new Request('https://www.ges-ab.se/api/phone-clicks',{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(body)});
}
test('server stamps receipt time and does not accept arbitrary numbers or customer details', async () => {
  let saved;
  const store={registerPhoneClick:async value=>{saved=value;}};
  const result=await handlePhoneClick(request({...payload,name:'private',clickedAt:'1999-01-01',attribution:{gclid:'fake'}}),store);
  assert.equal(result.status,202);
  assert.deepEqual(saved,{...payload,attribution:{}});
  assert.equal((await handlePhoneClick(request({...payload,phone:'+461234'}),store)).status,400);
  assert.equal((await handlePhoneClick(request(payload,'https://other.example'),store)).status,403);
  assert.equal((await handlePhoneClick(request({...payload,eventId:'bad'}),store)).status,400);
});

test('endpoint bounds streamed input and rejects unknown paths without saving', async () => {
  const store = {registerPhoneClick:()=>assert.fail('must not save')};
  for (const page of ['/private/customer','/contact?name=private','other']) {
    assert.equal((await handlePhoneClick(request({...payload,page}),store)).status,400);
  }
  assert.equal((await handlePhoneClick(request({...payload,extra:'x'.repeat(9000)}),store)).status,400);
  assert.equal((await handlePhoneClick(request(payload),{registerPhoneClick:()=>{throw Error('SQL secret');}})).status,503);
});

test('Postgres keeps the first click timestamp, deduplicates retries and safely leases sheet delivery', async () => {
  const {PGlite} = await import('@electric-sql/pglite');
  const {readFile} = await import('node:fs/promises');
  const {createPhoneClickStore} = await import('../app/lib/phone-clicks/store.mjs');
  const db = new PGlite();
  try {
    await db.exec(await readFile(new URL('../migrations/003_phone_clicks.sql',import.meta.url),'utf8'));
    const sql = async (strings,...values) => (await db.query(strings.reduce((text,part,i)=>text+(i?`$${i}`:'')+part,''),values)).rows;
    sql.query = async (query,values) => (await db.query(query,values)).rows;
    const store = createPhoneClickStore(sql);
    // Storage constrains format; site-config owns the changing business-number allowlist.
    await db.query('INSERT INTO public.gesab_phone_clicks (event_id,phone,page) VALUES ($1,$2,$3)',
      ['44444444-4444-4444-8444-444444444444','+46311234567','/']);
    await db.query('DELETE FROM public.gesab_phone_clicks WHERE event_id = $1', ['44444444-4444-4444-8444-444444444444']);
    assert.equal((await handlePhoneClick(request({...payload,phone:'+46311234567'}),
      {registerPhoneClick:()=>assert.fail('unlisted number must not reach storage')})).status,400);
    const first = await store.registerPhoneClick({...payload,attribution:{}});
    const retry = await store.registerPhoneClick({...payload,attribution:{gclid:'later'}});
    assert.deepEqual(first,retry);
    await assert.rejects(store.registerPhoneClick({...payload,page:'/'}),{name:'PhoneClickConflictError'});
    const leaseToken = '22222222-2222-4222-8222-222222222222';
    const next = '33333333-3333-4333-8333-333333333333';
    assert.equal((await store.claimSheetPhoneClicks({leaseToken})).length,1);
    assert.deepEqual(await store.claimSheetPhoneClicks({leaseToken:next}),[]);
    assert.deepEqual(await store.acknowledgeSheetPhoneClicks({leaseToken:next,ids:[id]}),[]);
    await db.exec("UPDATE public.gesab_phone_clicks SET sheet_lease_expires_at = now() - interval '1 second'");
    assert.equal((await store.claimSheetPhoneClicks({leaseToken:next})).length,1);
    assert.deepEqual(await store.acknowledgeSheetPhoneClicks({leaseToken,ids:[id]}),[]);
    assert.equal((await store.acknowledgeSheetPhoneClicks({leaseToken:next,ids:[id]})).length,1);
    assert.deepEqual(await store.claimSheetPhoneClicks({leaseToken}),[]);
  } finally { await db.close(); }
});

test('phone sync requires existing secret and exports only click fields', async () => {
  const {handleLeadSync} = await import('../app/lib/leads/sync-handler.mjs');
  const secret = 's'.repeat(40);
  const store = {claimSheetPhoneClicks:async()=>[{event_id:id,created_at:'2026-09-07T12:00:00Z',phone:payload.phone,page:'/contact',attribution:{},sheet_lease_token:'internal'}],acknowledgeSheetPhoneClicks:async()=>[{event_id:id}]};
  const url = 'https://ges-ab.se/api/lead-sync?kind=phone_clicks';
  assert.equal((await handleLeadSync(new Request(url),{secret,store})).status,401);
  const result = await handleLeadSync(new Request(url,{headers:{authorization:`Bearer ${secret}`}}),{secret,store});
  const body = await result.json();
  assert.equal(body.phoneClicks.length,1);
  assert.equal('sheet_lease_token' in body.phoneClicks[0],false);
  const ack = await handleLeadSync(new Request(url,{method:'POST',headers:{authorization:`Bearer ${secret}`,'content-type':'application/json'},body:JSON.stringify({action:'ack',kind:'phone_clicks',leaseToken:id,ids:[id]})}),{secret,store});
  assert.deepEqual((await ack.json()).ids,[id]);
});
