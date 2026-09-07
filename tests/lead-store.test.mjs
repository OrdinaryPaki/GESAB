import assert from 'node:assert/strict';
import test from 'node:test';

const inquiry = { submissionId: 'c4c3884b-882e-4adb-91e1-098cb3f6db98', source: 'footer', name: 'Anna', email: 'anna@example.com', phone: '0701234567', service: '', message: 'Hej' };
const token = 'f81a5f05-b215-4faf-90e3-b684533df821';
const storeModule = await import('../app/lib/leads/store.mjs');

test('lead store implementation is available', () => {
  assert.equal(typeof storeModule.createLeadStore, 'function');
});

test('registration freezes the canonical inquiry and ignores attribution changes on retries', async () => {
  let saved;
  const sql = async (strings, ...values) => {
    const [id, payload, hash, attribution] = values;
    saved ??= { submission_id: id, inquiry: JSON.parse(payload), payload_hash: hash, attribution: JSON.parse(attribution) };
    return [saved];
  };
  const store = storeModule.createLeadStore(sql);
  const first = await store.registerLead(inquiry, { utmSource: 'first' });
  const retry = await store.registerLead({ message: 'Hej', ...inquiry }, { utmSource: 'second' });
  assert.deepEqual(retry, first);
  assert.deepEqual(retry.attribution, { utmSource: 'first' });
  await assert.rejects(store.registerLead({ ...inquiry, message: 'Changed' }, {}), storeModule.LeadConflictError);
});

test('untrusted text is passed as query parameters, never interpolated SQL', async () => {
  let query, parameters;
  const store = storeModule.createLeadStore(async (strings, ...values) => {
    query = strings.join('?'); parameters = values;
    return [{ payload_hash: values[2] }];
  });
  const message = "'); DROP TABLE public.gesab_leads; --";
  await store.registerLead({ ...inquiry, message }, {});
  assert.equal(query.includes(message), false);
  assert.equal(JSON.parse(parameters[1]).message, message);
});

test('invalid batch sizes and IDs never reach the database', async () => {
  const store = storeModule.createLeadStore(async () => { assert.fail('must not query'); });
  for (const limit of [0, 101, -1, 1.5]) {
    await assert.rejects(store.claimSheetLeads({ limit, leaseToken: token }), RangeError);
  }
  await assert.rejects(store.claimSheetLeads({ leaseToken: 'invalid' }), TypeError);
  await assert.rejects(store.acknowledgeSheetLeads({ leaseToken: token, ids: Array(101).fill(inquiry.submissionId) }), RangeError);
  await assert.rejects(store.acknowledgeSheetLeads({ leaseToken: token, ids: ['invalid'] }), TypeError);
  assert.deepEqual(await store.acknowledgeSheetLeads({ leaseToken: token, ids: [] }), []);
});

test('progress rejects unknown fields instead of reporting a silent successful update', async () => {
  const store = storeModule.createLeadStore(async () => { assert.fail('must not query'); });
  await assert.rejects(store.updateLeadProgress(inquiry.submissionId, { unexpected: true }), TypeError);
});

test('Postgres enforces immutable registration, exclusive leases, stale acknowledgements, and booking deduplication', async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const { readFile } = await import('node:fs/promises');
  const database = new PGlite();
  try {
    await database.exec(await readFile(new URL('../migrations/001_leads.sql', import.meta.url), 'utf8'));
    await database.exec(await readFile(new URL('../migrations/002_lead_progress_events.sql', import.meta.url), 'utf8'));
    const sql = async (strings, ...values) => {
      const query = strings.reduce((text, part, i) => text + (i ? `$${i}` : '') + part, '');
      return (await database.query(query, values)).rows;
    };
    sql.query = async (query, values) => (await database.query(query, values)).rows;
    const store = storeModule.createLeadStore(sql);
    const original = await store.registerLead(inquiry, { campaign: 'original' });
    const retry = await store.registerLead(inquiry, { campaign: 'changed' });
    assert.deepEqual(retry.attribution, { campaign: 'original' });
    await assert.rejects(store.registerLead({ ...inquiry, email: 'different@example.com' }), storeModule.LeadConflictError);
    const claimed = await store.claimSheetLeads({ limit: 1, leaseToken: token });
    assert.equal(claimed.length, 1);
    assert.equal(claimed[0].email_sent_at, null, 'email failures must still appear in the Sheet');
    const token2 = '8e8eb8bf-4968-4008-b40a-3f81e88309ed';
    assert.deepEqual(await store.claimSheetLeads({ limit: 1, leaseToken: token2 }), []);
    assert.deepEqual(await store.acknowledgeSheetLeads({ leaseToken: token2, ids: [inquiry.submissionId] }), []);
    await database.exec("UPDATE public.gesab_leads SET sheet_lease_expires_at = now() - interval '1 second'");
    assert.equal((await store.claimSheetLeads({ limit: 1, leaseToken: token2 })).length, 1);
    assert.deepEqual(await store.acknowledgeSheetLeads({ leaseToken: token, ids: [inquiry.submissionId] }), []);
    assert.equal((await store.acknowledgeSheetLeads({ leaseToken: token2, ids: [inquiry.submissionId] })).length, 1);
    assert.deepEqual(await store.claimSheetLeads({ limit: 1, leaseToken: token }), []);
    const sent = await store.markLeadEmailSent(inquiry.submissionId);
    assert.ok(sent.email_sent_at);
    assert.deepEqual((await store.markLeadEmailSent(inquiry.submissionId)).email_sent_at, sent.email_sent_at);
    const booked = await store.updateLeadProgress(inquiry.submissionId, { status: 'Bokat jobb', valueSek: 5000, owner: 'Anna' });
    assert.ok(booked.booked_at);
    assert.equal(Number(booked.value_sek), 5000);
    const reopened = await store.updateLeadProgress(inquiry.submissionId, { status: 'Kontaktad', notes: 'Call again', nextContact: '2026-10-01' });
    const rebooked = await store.updateLeadProgress(inquiry.submissionId, { status: 'Bokat jobb', bookedAt: '2027-01-01T00:00:00Z' });
    assert.deepEqual(rebooked.booked_at, booked.booked_at);
    assert.equal(reopened.owner, 'Anna');
    assert.deepEqual(rebooked.inquiry, original.inquiry);
    await assert.rejects(store.updateLeadProgress(inquiry.submissionId, { status: 'Invalid' }));
    await assert.rejects(store.updateLeadProgress(inquiry.submissionId, { valueSek: -1 }));
    await assert.rejects(store.updateLeadProgress(inquiry.submissionId, { owner: 'x'.repeat(121) }));
  } finally {
    await database.close();
  }
});

test('durable progress event receipts prevent an old retry from reverting newer edits', async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const { readFile } = await import('node:fs/promises');
  const database = new PGlite();
  try {
    for (const name of ['001_leads.sql', '002_lead_progress_events.sql']) {
      await database.exec(await readFile(new URL(`../migrations/${name}`, import.meta.url), 'utf8'));
    }
    const sql = async (strings, ...values) => (await database.query(strings.reduce((text, part, i) => text + (i ? `$${i}` : '') + part, ''), values)).rows;
    sql.query = async (query, values) => (await database.query(query, values)).rows;
    const store = storeModule.createLeadStore(sql);
    await store.registerLead(inquiry);
    const old = { submissionId: inquiry.submissionId, eventId: token, progress: { status: 'Kontaktad', owner: 'Anna' } };
    assert.equal((await store.updateLeadProgressBatch([old])).leads[0].status, 'Kontaktad');
    const latest = { ...old, eventId: '8e8eb8bf-4968-4008-b40a-3f81e88309ed', progress: { status: 'Bokat jobb', valueSek: 42000 } };
    assert.equal((await store.updateLeadProgressBatch([latest])).leads[0].status, 'Bokat jobb');
    assert.deepEqual(await store.updateLeadProgressBatch([old]), { acceptedEventIds: [token], leads: [] });
    const unknown = { ...old, eventId: '710ecad8-9c72-48b8-a3d3-6822dc021870', submissionId: 'eec19f85-f555-47ec-9be9-91de3a61ba0e' };
    assert.deepEqual(await store.updateLeadProgressBatch([unknown]), { acceptedEventIds: [], leads: [] });
    assert.deepEqual(await store.updateLeadProgressBatch([{ ...old, progress: { status: 'Ny' } }]), { acceptedEventIds: [], leads: [] });
    const row = (await database.query('SELECT * FROM public.gesab_leads')).rows[0];
    assert.equal(row.status, 'Bokat jobb');
    assert.equal(row.owner, 'Anna');
    assert.ok(row.booked_at);
    const event3 = '3cff6b76-bc69-4b1f-bd79-4f3950523ca9';
    const event4 = 'f7317ce7-dcc8-4ad5-9e1b-6e3a9851f4e4';
    const merged = await store.updateLeadProgressBatch([
      { ...old, eventId: event3, progress: { owner: 'Erik', notes: 'First' } },
      { ...old, eventId: event4, progress: { notes: 'Last' } },
    ]);
    assert.equal(merged.leads[0].owner, 'Erik');
    assert.equal(merged.leads[0].notes, 'Last');
    assert.equal(merged.acceptedEventIds.length, 2);
    const event5 = '2e13993c-e16b-4021-887a-1edbf25b05c2';
    await assert.rejects(store.updateLeadProgressBatch([{ ...old, eventId: event5, progress: { valueSek: -1 } }]));
    const repaired = await store.updateLeadProgressBatch([{ ...old, eventId: event5, progress: { valueSek: 500 } }]);
    assert.deepEqual(repaired.acceptedEventIds, [event5], 'failed writes must roll back their receipt');
    assert.deepEqual(await store.updateLeadProgressBatch([]), { acceptedEventIds: [], leads: [] });
    await assert.rejects(store.updateLeadProgressBatch(Array(101).fill(old)), RangeError);
  } finally { await database.close(); }
});
