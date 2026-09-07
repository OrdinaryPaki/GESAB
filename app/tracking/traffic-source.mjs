// Contact-source metadata only: no identifiers, referrer paths, cookies or browser storage.
const CHANNELS = new Set(['Google Ads', 'Andra annonser', 'Organisk sökning (SEO)', 'Sociala medier', 'E-post', 'Annan webbplats', 'Annan kampanj', 'Direkt/okänd']);
const entries = new WeakMap();
const MAX_VISIT_MS = 30 * 60 * 1000;
const direct = () => ({channel:'Direkt/okänd',source:'',campaign:''});
const label = value => typeof value === 'string' && /^[a-zA-Z0-9åäöÅÄÖ ._-]{1,120}$/.test(value) ? value : '';
const matches = (host, domain) => host === domain || host.endsWith('.' + domain);
const social = host => ['facebook.com','instagram.com','linkedin.com','t.co','twitter.com','x.com','pinterest.com','youtube.com','tiktok.com'].some(domain => matches(host,domain));
function searchEngine(host) {
  if (/^(?:[a-z0-9-]+\.)*google\.(?:com|se|no|dk|fi|de|fr|es|it|nl|co\.uk|com\.au|ca)$/.test(host)) return 'google';
  return ['bing.com','duckduckgo.com','search.yahoo.com','ecosia.org','search.brave.com'].find(domain => matches(host,domain))?.split('.')[0] || '';
}
export function normalizeTrafficSource(raw) {
  if (!raw || !CHANNELS.has(raw.channel)) return {};
  return {channel:raw.channel,source:label(raw.source),campaign:label(raw.campaign)};
}
export function classifyTrafficSource({url,referrer=''} = {}) {
  try {
    const current = new URL(url);
    const params = current.searchParams;
    const get = key => params.getAll(key).length === 1 ? params.get(key) : '';
    const source = label(get('utm_source')).toLowerCase();
    const medium = label(get('utm_medium')).toLowerCase();
    const campaign = label(get('utm_campaign'));
    if (['gclid','gbraid','wbraid'].some(key => /^[A-Za-z0-9_-]{1,512}$/.test(get(key)))) return {channel:'Google Ads',source:'google',campaign};
    if (/^[A-Za-z0-9_-]{1,512}$/.test(get('msclkid'))) return {channel:'Andra annonser',source:'bing',campaign};
    if (source || medium) {
      let channel = 'Annan kampanj';
      if (['cpc','ppc','paid','paid_search','paid_social','paidsocial','display','cpm','retargeting'].includes(medium)) channel = source === 'google' ? 'Google Ads' : 'Andra annonser';
      else if (medium === 'organic') channel = 'Organisk sökning (SEO)';
      else if (['social','social-media','social_media'].includes(medium)) channel = 'Sociala medier';
      else if (medium === 'email') channel = 'E-post';
      else if (medium === 'referral') channel = 'Annan webbplats';
      return {channel,source,campaign};
    }
    if (!referrer) return direct();
    const previous = new URL(referrer);
    if (!['http:','https:'].includes(previous.protocol)) return direct();
    const host = previous.hostname.toLowerCase().replace(/^www\./,'');
    if (host === current.hostname.replace(/^www\./,'') || host === 'ges-ab.se') return direct();
    const engine = searchEngine(host);
    return {channel:engine ? 'Organisk sökning (SEO)' : social(host) ? 'Sociala medier' : 'Annan webbplats',source:label(engine || host),campaign:''};
  } catch { return direct(); }
}
export function captureTrafficSource(windowObject, {now=Date.now()} = {}) {
  if (!windowObject || !Number.isFinite(now)) return direct();
  const saved = entries.get(windowObject);
  if (saved) return now >= saved.time && now - saved.time < MAX_VISIT_MS ? {...saved.traffic} : direct();
  const traffic = classifyTrafficSource({url:windowObject.location?.href,referrer:windowObject.document?.referrer});
  entries.set(windowObject,{traffic,time:now});
  return {...traffic};
}
