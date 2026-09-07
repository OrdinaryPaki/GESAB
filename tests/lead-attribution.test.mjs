import test from 'node:test';
import assert from 'node:assert/strict';
import { captureLeadAttribution, readLeadAttribution, clearLeadAttribution, normalizeLeadAttribution } from '../app/tracking/lead-attribution.mjs';
const now = Date.parse('2026-09-07T10:00:00.000Z');
const day = 86400000;
const options = { allowed: true, now };
function browser(search = '?gclid=click_1&campaignid=123', pathname = '/contact') {
  const data = new Map();
  return { location: { search, pathname }, localStorage: {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
    removeItem: key => data.delete(key),
  } };
}
function record(extra = {}) {
  return { gclid: 'click_1', consentGranted: true, consentAt: '2026-09-07T10:00:00.000Z', capturedAt: '2026-09-07T10:00:00.000Z', ...extra };
}
test('requires explicit consent before reading the URL or retaining attribution', () => {
  const win = browser();
  Object.defineProperty(win, 'location', { get() { throw new Error('URL read without consent'); } });
  assert.deepEqual(captureLeadAttribution(win), {});
  assert.deepEqual(readLeadAttribution(win), {});
});
test('captures allowlisted Google click data and safe landing without full URL', () => {
  const win = browser('?gclid=click_1&gbraid=braid-2&wbraid=web_3&campaignid=123&adgroupid=456&creative=789&utm_source=google&utm_campaign=Heating&email=private');
  assert.deepEqual(captureLeadAttribution(win, options), record({ gbraid: 'braid-2', wbraid: 'web_3', campaignid: '123', adgroupid: '456', creative: '789', utm_source: 'google', utm_campaign: 'Heating', landingPage: '/contact' }));
  assert.deepEqual(readLeadAttribution(win, options), captureLeadAttribution(win, options));
});
test('organic and internal navigation preserve click, consent date, and first landing', () => {
  const win = browser();
  const original = captureLeadAttribution(win, options);
  win.location = { search: '?utm_campaign=organic', pathname: '/about' };
  assert.deepEqual(captureLeadAttribution(win, { allowed: true, now: now + day }), original);
});
test('same click on a reload does not extend retention', () => {
  const win = browser();
  const original = captureLeadAttribution(win, options);
  assert.deepEqual(captureLeadAttribution(win, { allowed: true, now: now + day }), original);
});
test('new Google click replaces all prior campaign and landing details', () => {
  const win = browser();
  captureLeadAttribution(win, options);
  win.location = { search: '?wbraid=new_click', pathname: '/about' };
  const latest = captureLeadAttribution(win, { allowed: true, now: now + day });
  assert.equal(latest.wbraid, 'new_click');
  assert.equal(latest.gclid, undefined);
  assert.equal(latest.campaignid, undefined);
  assert.equal(latest.landingPage, '/about');
  assert.equal(latest.capturedAt, '2026-09-08T10:00:00.000Z');
});
test('denial and explicit clearing revoke stored attribution', () => {
  const win = browser();
  captureLeadAttribution(win, options);
  assert.deepEqual(readLeadAttribution(win, { allowed: false, now }), {});
  assert.deepEqual(readLeadAttribution(win, options), {});
  captureLeadAttribution(win, options);
  clearLeadAttribution(win);
  assert.deepEqual(readLeadAttribution(win, options), {});
});
test('records expire at 90 days without extending on read', () => {
  const win = browser();
  captureLeadAttribution(win, options);
  assert.equal(readLeadAttribution(win, { allowed: true, now: now + 90 * day - 1 }).gclid, 'click_1');
  assert.deepEqual(readLeadAttribution(win, { allowed: true, now: now + 90 * day }), {});
});
test('normalization rejects expired, malformed, unconsented, and future records', () => {
  for (const raw of [null, [], {}, record({ consentGranted: false }), record({ consentAt: 'bad' }), record({ capturedAt: 'bad' }), record({ consentAt: new Date(now + 300001).toISOString() }), record({ capturedAt: new Date(now + 300001).toISOString() }), record({ consentAt: new Date(now - 90 * day).toISOString() }), record({ gclid: 'x'.repeat(513) })]) {
    assert.deepEqual(normalizeLeadAttribution(raw, { now }), {});
  }
  assert.equal(normalizeLeadAttribution(record({ capturedAt: new Date(now + 300000).toISOString() }), { now }).gclid, 'click_1');
});
test('strips malformed fields and bounds campaign labels and unsafe landing paths', () => {
  assert.deepEqual(normalizeLeadAttribution(record({ campaignid: '-123', adgroupid: 'x'.repeat(33), creative: 42, gbraid: 'bad%id', utm_source: 'x'.repeat(121), utm_campaign: 'bad\nlabel', landingPage: '/private/customer-email@example.com', url: 'https://private' }), { now }), record({ landingPage: 'other' }));
});
test('storage access and malformed JSON cannot interrupt an enquiry', () => {
  const win = browser();
  Object.defineProperty(win, 'localStorage', { get() { throw new Error('blocked'); } });
  assert.doesNotThrow(() => captureLeadAttribution(win, options));
  assert.deepEqual(readLeadAttribution(win, options), {});
  assert.doesNotThrow(() => clearLeadAttribution(win));
  assert.deepEqual(readLeadAttribution({ localStorage: { getItem: () => '{broken', removeItem() {} } }, options), {});
});
test('campaign-only URLs do not create a Google attribution record', () => {
  assert.deepEqual(captureLeadAttribution(browser('?campaignid=123&utm_source=google'), options), {});
});
test('duplicate click parameters are discarded rather than attributed arbitrarily', () => {
  assert.deepEqual(captureLeadAttribution(browser('?gclid=one&gclid=two'), options), {});
  assert.equal(captureLeadAttribution(browser('?gclid=one&gclid=two&gbraid=valid'), options).gbraid, 'valid');
});
test('valid maximum length IDs survive server normalization', () => {
  const normalized = normalizeLeadAttribution(record({ gclid: 'a'.repeat(512), campaignid: '1'.repeat(32), utm_campaign: 'a'.repeat(120), landingPage: '/contact?email=private' }), { now });
  assert.equal(normalized.gclid.length, 512);
  assert.equal(normalized.campaignid.length, 32);
  assert.equal(normalized.utm_campaign.length, 120);
  assert.equal(normalized.landingPage, '/contact');
});
