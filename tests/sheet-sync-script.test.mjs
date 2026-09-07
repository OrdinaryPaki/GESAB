import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function script(overrides = {}) {
  const context = vm.createContext({Date, Set, Utilities: {newBlob: text => ({getBytes: () => Buffer.from(text, 'utf8')})}, ...overrides});
  for (const file of ['Api', 'Rows', 'Outbox', 'PhoneClicks', 'Sync']) vm.runInContext(fs.readFileSync(new URL(`../integrations/google-sheets/${file}.gs`, import.meta.url), 'utf8'), context);
  return context;
}

test('formula-like customer text is escaped; ordinary text is preserved', () => {
  const c = script();
  for (const text of ['=IMPORTXML("x")', '+461234', '-cmd', '@name', ' \t=x', '\nformula']) assert.equal(c.gesabText_(text), "'" + text);
  assert.equal(c.gesabText_('Ada'), 'Ada');
  assert.equal(c.gesabText_(null), '');
});

test('connector sends secret only as bearer header and refuses redirects', () => {
  let request;
  const c = script({PropertiesService: {getScriptProperties: () => ({getProperty: key => key === 'GESAB_API_URL' ? 'https://ges-ab.se/api/lead-sync' : 'private-secret'})}, UrlFetchApp: {fetch: (url, options) => { request = {url, options}; return {getResponseCode: () => 200, getContentText: () => '{"ok":true}'}; }}});
  c.gesabRequest_({action: 'ack', ids: ['a']});
  assert.equal(request.options.headers.Authorization, 'Bearer private-secret');
  assert.equal(request.options.followRedirects, false);
  assert.ok(!request.options.payload.includes('private-secret'));
});

test('arbitrary API hosts are rejected before any request', () => {
  let called = false;
  const c = script({PropertiesService: {getScriptProperties: () => ({getProperty: () => 'https://other.example'})}, UrlFetchApp: {fetch: () => { called = true; }}});
  assert.throws(() => c.gesabRequest_(), /synkinställningarna/);
  assert.equal(called, false);
});

function outboxHarness() {
  const rows = [['e1', 'date', '{"eventId":"e1"}'], ['e2', 'date', '{"eventId":"e2"}']];
  const deleted = [];
  const c = script();
  c.gesabWithLock_ = fn => fn();
  c.gesabOutbox_ = () => ({getLastRow: () => rows.length + 1, getRange: () => ({getValues: () => rows.map(row => [...row])}), deleteRow: index => { deleted.push(index); rows.splice(index - 2, 1); }});
  return {c, rows, deleted};
}

test('HTTP failure preserves durable queue for retry', () => {
  const {c, rows, deleted} = outboxHarness();
  c.gesabRequest_ = () => { throw Error('network'); };
  assert.throws(() => c.gesabSendPending_(), /network/);
  assert.equal(rows.length, 2);
  assert.deepEqual(deleted, []);
});

test('partial acknowledgment removes only confirmed events and keeps unknown IDs', () => {
  const {c, rows, deleted} = outboxHarness();
  c.gesabRequest_ = () => ({ok: true, acceptedEventIds: ['e2', 'unrelated']});
  assert.throws(() => c.gesabSendPending_(), /bekräftelse/);
  assert.deepEqual(deleted, [3]);
  assert.equal(rows[0][0], 'e1');
});

test('replayed acknowledgments safely complete a retried queue', () => {
  const {c, rows} = outboxHarness();
  c.gesabRequest_ = () => ({ok: true, acceptedEventIds: ['e1', 'e2']});
  c.gesabSendPending_();
  assert.equal(rows.length, 0);
});

test('script lock workers leave before HTTP if already running', () => {
  let requested = false;
  const c = script({LockService: {getScriptLock: () => ({tryLock: () => false})}});
  c.gesabRequest_ = () => { requested = true; };
  c.synkaGesab();
  assert.equal(requested, false);
});

test('server-rejected edits are preserved separately and cannot block a corrected edit', () => {
  const {c, rows} = outboxHarness();
  const archived = [];
  c.gesabArchiveRejected_ = events => archived.push(...events);
  c.gesabRequest_ = () => ({ok: true, acceptedEventIds: ['e2'], rejectedEvents: [{eventId: 'e1', error: 'invalid'}]});
  c.gesabSendPending_();
  assert.equal(rows.length, 0);
  assert.equal(archived.length, 1);
  assert.equal(archived[0][0], 'e1');
});

test('next contact uses Stockholm calendar date and generated patches satisfy server contract', async () => {
  const {validateProgressBatch} = await import('../app/lib/leads/progress-validation.mjs');
  const queued = [];
  const sheet = {getName: () => 'Förfrågningar', getLastRow: () => 2, getRange: () => ({getValues: () => [['9e8eb8bf-4968-4008-b40a-3f81e88309ed', '', '', '', '', '', '', 'Kontaktad', new Date('2026-09-06T22:00:00Z'), 'Anna', 'Ring igen', new Date('2026-09-01T12:00:00Z'), 250]]})};
  const c = script({Utilities: {getUuid: () => '8e8eb8bf-4968-4008-b40a-3f81e88309ed', formatDate: (date, zone, pattern) => { assert.equal(zone, 'Europe/Stockholm'); assert.equal(pattern, 'yyyy-MM-dd'); return new Intl.DateTimeFormat('sv-SE', {timeZone: zone}).format(date); }}, SpreadsheetApp: {flush: () => {}}});
  c.gesabWithLock_ = fn => fn();
  c.gesabStatus_ = () => {};
  c.gesabEnsureRows_ = () => {};
  c.gesabOutbox_ = () => ({getLastRow: () => 1, getRange: () => ({setValues: rows => queued.push(...rows)})});
  c.gesabRequest_ = () => { throw Error('edit handler must not send HTTP'); };
  c.gesabOnEdit({range: {getSheet: () => sheet, getColumn: () => 8, getLastColumn: () => 13, getRow: () => 2, getLastRow: () => 2}});
  const patch = JSON.parse(queued[0][2]);
  assert.equal(patch.progress.nextContact, '2026-09-07');
  assert.equal(patch.progress.bookedAt, '2026-09-01T12:00:00.000Z');
  assert.ok(validateProgressBatch([patch], Date.parse('2026-09-07T00:00:00Z')));
});

test('valid multibyte notes are sent in byte-bounded ordered batches', async () => {
  const {validateProgressBatch} = await import('../app/lib/leads/progress-validation.mjs');
  const c = script();
  const patches = Array.from({length: 100}, (_, i) => ({submissionId: '9e8eb8bf-4968-4008-b40a-3f81e88309ed', eventId: `8e8eb8bf-4968-4008-b40a-${String(i).padStart(12, '0')}`, progress: {status: 'Kontaktad', notes: 'å'.repeat(4000)}}));
  assert.ok(validateProgressBatch(patches));
  const rows = patches.map(p => [p.eventId, 'date', JSON.stringify(p)]);
  assert.ok(c.gesabProgressBytes_(rows) > 512 * 1024);
  const first = c.gesabBoundedBatch_(rows);
  assert.ok(first.length > 0 && first.length < 100);
  assert.ok(Buffer.byteLength(JSON.stringify({action: 'progress', patches: first.map(r => JSON.parse(r[2]))}), 'utf8') <= 500 * 1024);
  const second = c.gesabBoundedBatch_(rows.slice(first.length));
  assert.equal(first.length + second.length, 100);
  assert.deepEqual([...first, ...second].map(r => r[0]), rows.map(r => r[0]));
});

test('oversized first event is durably quarantined before removal and later event proceeds', () => {
  const {c, rows} = outboxHarness();
  rows[0][2] = JSON.stringify({eventId: 'e1', progress: {notes: 'å'.repeat(300000)}});
  const order = [];
  c.gesabArchiveRejected_ = events => { if (!events.length) return; assert.equal(rows[0][0], 'e1'); order.push(['archived', events[0][0]]); };
  c.gesabRequest_ = body => { order.push(['sent', body.patches[0].eventId]); return {ok: true, acceptedEventIds: ['e2']}; };
  c.gesabSendPending_();
  assert.deepEqual(order, [['archived', 'e1'], ['sent', 'e2']]);
  assert.equal(rows.length, 0);
});

test('failed quarantine write retains oversized event and does not send later work', () => {
  const {c, rows} = outboxHarness();
  rows[0][2] = JSON.stringify({notes: 'å'.repeat(300000)});
  c.gesabArchiveRejected_ = () => { throw Error('write failed'); };
  c.gesabRequest_ = () => { assert.fail('must not send'); };
  assert.throws(() => c.gesabSendPending_(), /write failed/);
  assert.equal(rows.length, 2);
});

test('phone click append retries keep one row and preserve explicit non-call label', () => {
  const rows = [['headers']];
  const sheet = {getLastRow:()=>rows.length,getMaxRows:()=>100,
    getRange:(row,column,count,width)=>({
      getValues:()=>rows.slice(row-1,row-1+count).map(value=>[value[column-1]]),
      setNumberFormat:()=>{throw Error("You can't set the number format of cells in a typed column");},
      setValues:values=>values.forEach((value,index)=>{rows[row-1+index]=value;}),
    })};
  const c = script({SpreadsheetApp:{getActiveSpreadsheet:()=>({getSheetByName:name=>name==='Telefonklick'?sheet:null})}});
  c.gesabWithLock_ = work=>work();
  const click = {event_id:'click-id',created_at:'2026-09-07T12:00:00Z',page:'/contact',phone:'+46707299633',attribution:{}};
  assert.deepEqual(Array.from(c.gesabAppendPhoneClicks_([click])),['click-id']);
  assert.deepEqual(Array.from(c.gesabAppendPhoneClicks_([click])),['click-id']);
  assert.equal(rows.length,2);
  assert.equal(rows[1].length,17);
  assert.equal(rows[1][4],'Telefonklick (inte bekräftat samtal)');
  assert.equal(rows[1][1].toISOString(),click.created_at.replace('Z','.000Z'));
  assert.equal(rows[1][11],'Nej');
  assert.equal(rows[1][3], "'+46707299633");
});

test('phone sync acknowledges only after sheet append and preserves failures for retry', () => {
  const c = script();
  const calls = [];
  c.gesabRequest_ = (body,kind) => {
    calls.push(body || kind);
    return body ? {ok:true,ids:['id']} : {phoneClicks:[{event_id:'id'}],leaseToken:'lease'};
  };
  c.gesabAppendPhoneClicks_ = () => {throw Error('sheet unavailable');};
  assert.throws(()=>c.gesabSyncPhoneClicks_(),/sheet unavailable/);
  assert.equal(calls.length,1);
  c.gesabAppendPhoneClicks_ = () => ['id'];
  c.gesabSyncPhoneClicks_();
  assert.equal(calls[2].kind,'phone_clicks');
  assert.equal(calls[2].action,'ack');
});


test('lead append works with typed columns and preserves native values and replay edits', () => {
  const rows = [['headers']];
  const sheet = {getLastRow:()=>rows.length,getMaxRows:()=>100001,
    getRange:(row,column,count,width)=>({
      getValues:()=>rows.slice(row-1,row-1+count).map(value=>[value[column-1]]),
      setNumberFormat:()=>{throw Error("You can't set the number format of cells in a typed column");},
      setValues:values=>values.forEach((value,index)=>{rows[row-1+index]=value;}),
    })};
  const c = script({SpreadsheetApp:{getActiveSpreadsheet:()=>({getSheetByName:()=>sheet})}});
  c.gesabWithLock_ = work=>work();
  const lead = {submission_id:'lead-id',created_at:'2026-09-07T12:00:00Z',inquiry:{name:'=unsafe',phone:'+46707299633'},value_sek:123};
  c.gesabAppendLeads_([lead]);
  rows[1][7] = 'Kontaktad';
  c.gesabAppendLeads_([lead]);
  assert.equal(rows.length,2);
  assert.equal(rows[1][2],"'=unsafe");
  assert.equal(rows[1][3],"'+46707299633");
  assert.equal(rows[1][7],'Kontaktad');
  assert.ok(rows[1][1] instanceof Date);
  assert.equal(rows[1][12],123);
});

test('booked edit queues and writes a real date without reformatting typed column', () => {
  const queued = [], booked = [];
  const sheet = {getName:()=> 'Förfrågningar',getLastRow:()=>2,getRange:(row,column)=>({
    getValues:()=>[['id','','','','','','','Bokat jobb','','','', '',100]],
    setValue:value=>{booked.push(value);return {setNumberFormat:()=>{throw Error('typed column');}};},
  })};
  const c = script({Utilities:{getUuid:()=> 'event'},SpreadsheetApp:{flush:()=>{}}});
  c.gesabWithLock_ = work=>work(); c.gesabStatus_ = ()=>{}; c.gesabEnsureRows_ = ()=>{};
  c.gesabOutbox_ = ()=>({getLastRow:()=>1,getRange:()=>({setValues:values=>queued.push(...values)})});
  c.gesabOnEdit({range:{getSheet:()=>sheet,getColumn:()=>8,getLastColumn:()=>8,getRow:()=>2,getLastRow:()=>2}});
  assert.equal(queued.length,1);
  assert.ok(booked[0] instanceof Date);
  assert.equal(JSON.parse(queued[0][2]).progress.bookedAt,booked[0].toISOString());
});


test('visit source is separate from form location and retained Google Ads identifiers', () => {
  const c = script();
  const attribution = {gclid:'prior-ad',consentGranted:true,traffic:{channel:'Organisk sökning (SEO)',source:'google',campaign:''}};
  const row = c.gesabLeadRow_({inquiry:{source:'contact'},attribution});
  assert.equal(row.length,26);
  assert.equal(row[13],'contact');
  assert.equal(row[17],'prior-ad');
  assert.equal(row[23],'Organisk sökning (SEO)');
  assert.equal(row[24],'google');
  const phone = c.gesabPhoneClickRow_({attribution});
  assert.equal(phone[14],'Organisk sökning (SEO)');
  assert.equal(phone[15],'google');
});
