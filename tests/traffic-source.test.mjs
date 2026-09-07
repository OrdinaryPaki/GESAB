import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyTrafficSource, captureTrafficSource, normalizeTrafficSource } from '../app/tracking/traffic-source.mjs';
import { normalizeContactAttribution } from '../app/tracking/contact-attribution.mjs';
const classify = (url = 'https://ges-ab.se/contact', referrer = '') => classifyTrafficSource({url, referrer});
test('organic search, social and external referrals are distinguished', () => {
  assert.equal(classify(undefined,'https://www.google.se/search?q=private').channel,'Organisk sökning (SEO)');
  assert.equal(classify(undefined,'https://www.bing.com/').source,'bing');
  assert.equal(classify(undefined,'https://l.facebook.com/x').channel,'Sociala medier');
  assert.equal(classify(undefined,'https://partner.se/private?email=secret').source,'partner.se');
  assert.equal(classify(undefined,'https://google.com.evil.se/').channel,'Annan webbplats');
});
test('missing or internal referrers are direct/unknown, never assumed organic', () => {
  for(const ref of ['', 'https://ges-ab.se/service', 'https://www.ges-ab.se/', 'garbage']) assert.equal(classify(undefined,ref).channel,'Direkt/okänd');
});
test('paid IDs take precedence over organic referrer, without retaining IDs', () => {
  const value=classify('https://ges-ab.se/?gclid=private','https://google.com/');
  assert.equal(value.channel,'Google Ads');
  assert.ok(!JSON.stringify(value).includes('private'));
  assert.equal(classify('https://ges-ab.se/?msclkid=private').channel,'Andra annonser');
  assert.equal(classify('https://ges-ab.se/?fbclid=abc','https://facebook.com/').channel,'Sociala medier');
});
test('UTM sources work without a Google click ID and paid social stays paid', () => {
  assert.deepEqual(classify('https://ges-ab.se/?utm_source=facebook&utm_medium=paid_social&utm_campaign=badrum'),{channel:'Andra annonser',source:'facebook',campaign:'badrum'});
  assert.equal(classify('https://ges-ab.se/?utm_source=brev&utm_medium=email').channel,'E-post');
  assert.equal(classify('https://ges-ab.se/?utm_source=google&utm_medium=organic').channel,'Organisk sökning (SEO)');
});
test('current document entry survives SPA navigation; no storage or network is required', () => {
  const w={location:{href:'https://ges-ab.se/?utm_source=brev&utm_medium=email'},document:{referrer:''}};
  const first=captureTrafficSource(w,{now:1000});
  w.location.href='https://ges-ab.se/contact';
  assert.deepEqual(captureTrafficSource(w,{now:2000}),first);
  assert.equal(captureTrafficSource(w,{now:1801001}).channel,'Direkt/okänd');
});
test('untrusted metadata is bounded and cannot add tracking or private fields', () => {
  assert.deepEqual(normalizeTrafficSource({channel:'invented',source:'secret'}),{});
  assert.deepEqual(normalizeTrafficSource({channel:'E-post',source:'x@y.se',campaign:'=IMPORTXML(x)',email:'private'}),{channel:'E-post',source:'',campaign:''});
});
test('non-ad traffic is accepted separately while Ads consent remains mandatory', () => {
  const result=normalizeContactAttribution({traffic:classify(undefined,'https://google.com/'),gclid:'bad',consentGranted:false});
  assert.equal(result.traffic.channel,'Organisk sökning (SEO)');
  assert.equal(result.gclid,undefined);
  assert.deepEqual(normalizeContactAttribution({}),{});
});
