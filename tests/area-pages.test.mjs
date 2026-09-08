import assert from "node:assert/strict";
import test from "node:test";
import { siteUrl } from "./helpers/site-url.mjs";
const services = ["badrumsrenovering", "altanbygge", "tvattstugsrenovering", "koksrenovering", "totalentreprenad", "rivningsarbeten", "golvlaggning", "koksmontering", "snickeri"];
test("all 18 local service pages have unique metadata, the correct service form and local schema", async () => {
 const titles = new Set();
 for (const slug of services) for (const area of ["boras", "kungsbacka"]) {
  const path = `/service/${slug}/${area}`;
  const response = await fetch(siteUrl + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title && !titles.has(title), path); titles.add(title);
  assert.equal((html.match(/<h1[ >]/g) ?? []).length, 1, path);
  assert.ok(html.includes(`rel="canonical" href="https://ges-ab.se${path}"`), path);
  assert.ok(html.includes(`data-service-quote="${slug}"`), path);
  assert.match(html, /id="boka"/);
  assert.match(html, /data-local-service-context/);
  assert.ok(html.includes(`href="/service/${slug}"`), path);
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].flatMap(m => { const d=JSON.parse(m[1]);return d['@graph']??[d]; });
  const schema = graphs.find(d=>d['@type']==='Service');
  assert.equal(schema.url, `https://ges-ab.se${path}`);
  assert.equal(schema.areaServed, area==='boras'?'Borås':'Kungsbacka');
 }
});
test("local pages are linked from their service and included in sitemap without an area overview", async () => {
 const xml = await fetch(siteUrl+'/sitemap.xml').then(r=>r.text());
 for(const slug of services){
  const html=await fetch(siteUrl+'/service/'+slug).then(r=>r.text());
  for(const area of ['boras','kungsbacka']){
   const path=`/service/${slug}/${area}`;
   assert.ok(html.includes(`href="${path}"`));
   assert.ok(xml.includes(`https://ges-ab.se${path}`));
  }
  assert.ok(!html.includes('href="/omraden"'));
 }
 for(const path of ['/omraden','/omraden/boras','/service/badrumsrenovering/okand','/service/okand/boras']) assert.equal((await fetch(siteUrl+path)).status,404,path);
});
