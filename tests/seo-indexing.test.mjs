import assert from 'node:assert/strict';
import test from 'node:test';
import { siteUrl } from './helpers/site-url.mjs';

const origin = 'https://ges-ab.se';
const serviceSlugs = ['badrumsrenovering', 'altanbygge', 'tvattstugsrenovering', 'koksrenovering', 'totalentreprenad', 'rivningsarbeten', 'golvlaggning', 'koksmontering', 'snickeri'];
const paths = ['/', '/about', '/service', '/galleri', '/contact', '/cookies', ...serviceSlugs.map(slug => `/service/${slug}`), ...serviceSlugs.flatMap(slug => ['boras', 'kungsbacka'].map(area => `/service/${slug}/${area}`))];

test('every public page has its own canonical, unique metadata, and one main heading', async () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const path of paths) {
    const response = await fetch(`${siteUrl}${path}`);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal(new URL(html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]).href, new URL(path, origin).href, path);
    assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, path);
    const title = html.match(/<title>(.*?)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title && !titles.has(title), `Unique title: ${path}`);
    assert.ok(description && !descriptions.has(description), `Unique description: ${path}`);
    titles.add(title); descriptions.add(description);
    assert.doesNotMatch(html, /<meta name="robots" content="[^"]*noindex/, path);
    const socialUrl = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1];
    assert.equal(new URL(socialUrl).href, new URL(path, origin).href, path);
  }
});

test('sitemap contains every public canonical and excludes obsolete and internal routes', async () => {
  const response = await fetch(`${siteUrl}/sitemap.xml`);
  assert.equal(response.status, 200);
  const xml = await response.text();
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls.sort(), paths.filter(path => !/^\/service\/[^/]+\/[^/]+$/.test(path)).map(path => new URL(path, origin).href).sort());
  const robots = await fetch(`${siteUrl}/robots.txt`).then(response => response.text());
  assert.match(robots, /Allow: \/\n/);
  assert.match(robots, /Sitemap: https:\/\/ges-ab.se\/sitemap.xml/);
});

test('service structured data identifies the canonical page and its business', async () => {
  for (const slug of serviceSlugs) {
    const url = `${origin}/service/${slug}`;
    const html = await fetch(`${siteUrl}/service/${slug}`).then(response => response.text());
    const entities = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)]
      .flatMap(match => { const data = JSON.parse(match[1]); return data['@graph'] ?? [data]; });
    const service = entities.find(entity => entity['@type'] === 'Service');
    assert.equal(service.url, url);
    assert.equal(service['@id'], `${url}#service`);
    assert.equal(service.provider['@id'], `${origin}/#business`);
  }
});

test('old service URLs redirect and nonexistent services return an actual 404', async () => {
  const old = await fetch(`${siteUrl}/service/bygg`, { redirect: 'manual' });
  assert.equal(old.status, 308);
  assert.equal(new URL(old.headers.get('location'), siteUrl).pathname, '/service/snickeri');
  const missing = await fetch(`${siteUrl}/service/nonexistent-seo-check`);
  assert.equal(missing.status, 404);
});
