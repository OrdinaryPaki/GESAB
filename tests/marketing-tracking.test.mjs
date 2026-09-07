import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarketingTracker } from '../app/tracking/marketing-events.mjs';
import { createInquirySubmissionSession } from '../app/lib/inquiries/submit-inquiry.mjs';
import { CONSENT_KEY, createAdsConsentController, hasAdsConsent } from '../app/tracking/google-ads-consent.mjs';

const payload = { source: 'service', service: 'badrumsrenovering', email: 'private@example.com', message: 'private message' };

test('form start is counted once until reset, independently of edits', () => {
  const starts=[];
  const session=createInquirySubmissionSession({ onStart: p=>starts.push(p) });
  session.start(payload); session.invalidate(); session.start(payload);
  assert.deepEqual(starts,[{source:'service',service:'badrumsrenovering'}]);
  session.reset(); session.start(payload);
  assert.equal(starts.length,2);
});

test('only successful submissions count, retries deduplicate, tracking failure never breaks delivery', async () => {
  let fail=true; const events=[];
  const session=createInquirySubmissionSession({createId:()=> 'test-id', submitImpl: async()=> {if(fail) throw Error('delivery'); return {ok:true};}, onSuccess: p=>{events.push(p); throw Error('blocked analytics');}});
  await assert.rejects(session.submit(payload)); assert.equal(events.length,0);
  fail=false;
  assert.deepEqual(await session.submit(payload),{ok:true});
  await session.submit(payload);
  assert.deepEqual(events,[{source:'service',service:'badrumsrenovering',submissionId:'test-id'}]);
});

test('events contain only allowed context and Google receives only configured consented leads', () => {
  const events=[]; const ads=[]; let consent=false;
  const tracker=createMarketingTracker({track:(...args)=>events.push(args), gtag:(...args)=>ads.push(args), hasConsent:()=>consent, conversionTarget:'AW-18434262533/test-label'});
  tracker.formStarted(payload);
  tracker.inquirySubmitted({...payload,submissionId:'lead-1'});
  tracker.contactClicked({kind:'phone',page:'/service/koksrenovering?email=private@example.com',email:'private@example.com'});
  assert.equal(ads.length,0);
  consent=true;
  tracker.inquirySubmitted({...payload,submissionId:'lead-2'});
  assert.deepEqual(ads,[['event','conversion',{send_to:'AW-18434262533/test-label',transaction_id:'lead-2'}]]);
  assert(!JSON.stringify(events).includes('private'));
  assert(!JSON.stringify(events).includes('lead-'));
  assert.equal(events[2][0],'phone_click');
  tracker.contactClicked({kind:'email',page:'/contact'});
  assert.equal(events.at(-1)[0],'email_click');
});

test('unknown field values are discarded and missing target does not send a fake conversion', () => {
  const events=[]; const ads=[];
  const tracker=createMarketingTracker({track:(...args)=>events.push(args),gtag:(...args)=>ads.push(args),hasConsent:()=>true});
  tracker.inquirySubmitted({source:'private@example.com',service:'personal information',submissionId:'lead'});
  assert.deepEqual(events,[['inquiry_submitted',{form:'unknown',service:'unspecified'}]]);
  assert.equal(ads.length,0);
});

test('Vercel failure does not prevent Google conversion', () => {
  const ads=[];
  const tracker=createMarketingTracker({track:()=>{throw Error('blocked');},gtag:(...x)=>ads.push(x),hasConsent:()=>true,conversionTarget:'AW-18434262533/test'});
  tracker.inquirySubmitted({...payload,submissionId:'lead'});
  assert.equal(ads.length,1);
});

test('withdrawn consent blocks conversions even if previous acceptance remains in locked storage', () => {
  const values=new Map();
  const w={localStorage:{getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},location:{hostname:'ges-ab.se',reload(){}}};
  const d={cookie:'',createElement:()=>({}),head:{appendChild(){}}};
  const controller=createAdsConsentController(w,d);
  assert.equal(hasAdsConsent(w),false);
  controller.choose(true); assert.equal(hasAdsConsent(w),true);
  w.localStorage.removeItem=()=>{throw Error('locked');}; w.localStorage.setItem=()=>{throw Error('locked');};
  controller.choose(false);
  assert(JSON.parse(values.get(CONSENT_KEY)).allowed);
  assert.equal(hasAdsConsent(w),false);
});
