import test from 'node:test';
import assert from 'node:assert/strict';
import { handleLeadSync } from '../app/lib/leads/sync-handler.mjs';
import { saveAndDeliverLead } from '../app/lib/leads/intake.mjs';

const secret = 'test-only-secret-not-used-in-production-1234';
const id = '11111111-1111-4111-8111-111111111111';
const eventId = '22222222-2222-4222-8222-222222222222';
const req = (body, token = secret) => new Request('https://example.test/api/lead-sync', {
  method: body === undefined ? 'GET' : 'POST',
  headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  ...(body === undefined ? {} : {body: JSON.stringify(body)}),
});

test('sync denies unauthenticated requests before accessing storage', async () => {
  const store = new Proxy({}, {get() { throw new Error('must not query'); }});
  assert.equal((await handleLeadSync(req(undefined, 'wrong'), {secret,store})).status, 401);
  assert.equal((await handleLeadSync(req(), {secret:undefined,store})).status, 503);
});

test('claimed batch excludes internal hashes and lease details', async () => {
  const store = {async claimSheetLeads(options) {
    assert.equal(options.limit,100);
    return [{submission_id:id, inquiry:{name:'Example'}, payload_hash:'private', sheet_lease_token:'private'}];
  }};
  const response = await handleLeadSync(req(), {secret,store});
  const body = await response.json();
  assert.equal(body.leads[0].submission_id,id);
  assert.equal(body.leads[0].payload_hash,undefined);
  assert.equal(response.headers.get('cache-control'),'no-store');
});

test('progress is bounded, rejects bad dates and preserves explicit zero', async () => {
  let calls = 0;
  const store = {async updateLeadProgressBatch(patches) {
    calls++;
    assert.equal(patches[0].progress.valueSek,0);
    return {acceptedEventIds:[eventId],leads:[]};
  }};
  for (const progress of [{status:'Invented'}, {valueSek:-1}, {nextContact:'2026-02-30'}, {notes:'x'.repeat(4001)}]) {
    const result = await handleLeadSync(req({action:'progress',patches:[{submissionId:id,eventId,progress}]}),{secret,store});
    assert.equal(result.status,200);
    assert.equal((await result.json()).rejectedEvents[0].eventId,eventId);
  }
  assert.equal(calls,0);
  const result = await handleLeadSync(req({action:'progress',patches:[{submissionId:id,eventId,progress:{status:'Bokat jobb',valueSek:0}}]}),{secret,store});
  assert.deepEqual((await result.json()).acceptedEventIds,[eventId]);
  assert.equal(calls,1);
});

test('ack validates lease and ID bounds, then returns only acknowledged IDs', async () => {
  const store = {async acknowledgeSheetLeads(input) {
    assert.deepEqual(input,{leaseToken:eventId,ids:[id]});
    return [{submission_id:id}];
  }};
  assert.equal((await handleLeadSync(req({action:'ack',leaseToken:'bad',ids:[id]}),{secret,store})).status,400);
  const response = await handleLeadSync(req({action:'ack',leaseToken:eventId,ids:[id]}),{secret,store});
  assert.deepEqual((await response.json()).ids,[id]);
});

test('saved lead survives email failure and delivered retries do not resend', async () => {
  const steps=[];
  const store={async registerLead(){steps.push('save');return {};},async markLeadEmailSent(){steps.push('mark');}};
  await assert.rejects(saveAndDeliverLead({submissionId:id},{},{store,deliver:async()=>{steps.push('email');throw Error('offline');}}));
  assert.deepEqual(steps,['save','email']);
  await saveAndDeliverLead({submissionId:id},{},{store:{...store,registerLead:async()=>({email_sent_at:'saved'})},deliver:async()=>assert.fail('duplicate')});
});
