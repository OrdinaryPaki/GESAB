import assert from "node:assert/strict";
import test from "node:test";

import * as tracking from "../app/tracking/google-ads-consent.mjs";

function environment() {
  const values = new Map();
  const scripts = [];
  const removedCookies = [];
  let reloads = 0;
  const document = {
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
    get cookie() { return "_gcl_au=example; necessary=keep"; },
    set cookie(value) { removedCookies.push(value); },
  };
  const window = {
    localStorage: { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: (key) => values.delete(key) },
    location: { hostname: "www.ges-ab.se", reload: () => reloads++ },
  };
  return { window, document, scripts, removedCookies, reloads: () => reloads };
}

test("no choice or refusal never loads Google", () => {
  assert.equal(typeof tracking.createAdsConsentController, "function");
  const env = environment();
  const controller = tracking.createAdsConsentController(env.window, env.document);
  assert.equal(controller.restore(), null);
  controller.choose(false);
  assert.equal(env.scripts.length, 0);
  assert.equal(env.window.dataLayer, undefined);
});

test("acceptance sets consent before configuring the correct tag, once", () => {
  const env = environment();
  const controller = tracking.createAdsConsentController(env.window, env.document);
  controller.choose(true);
  controller.choose(true);
  assert.equal(env.scripts.length, 1);
  assert.equal(env.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=AW-18434262533");
  assert.equal(env.scripts[0].async, true);
  const commands = env.window.dataLayer.map((args) => Array.from(args));
  assert.deepEqual(commands[0].slice(0, 2), ["consent", "default"]);
  assert.equal(commands[0][2].ad_storage, "denied");
  assert.deepEqual(commands[1].slice(0, 2), ["consent", "update"]);
  assert.equal(commands[1][2].ad_storage, "granted");
  assert.equal(commands[1][2].ad_personalization, "denied");
  assert.equal(commands[1][2].analytics_storage, "denied");
  assert.deepEqual(commands[3].slice(0, 2), ["config", "AW-18434262533"]);
});

test("stored choices expire and malformed storage fails closed", () => {
  const env = environment();
  const controller = tracking.createAdsConsentController(env.window, env.document, () => 1000);
  controller.choose(true);
  assert.equal(controller.restore(), true);
  const expired = tracking.createAdsConsentController(env.window, env.document, () => 1000 + 181 * 86400000);
  assert.equal(expired.restore(), null);
  env.window.localStorage.setItem(tracking.CONSENT_KEY, '{"allowed":"true"}');
  assert.equal(controller.restore(), null);
  env.window.localStorage.getItem = () => { throw new Error("blocked"); };
  assert.equal(controller.restore(), null);
});

test("withdrawal denies consent, clears only advertising cookies and reloads", () => {
  const env = environment();
  const controller = tracking.createAdsConsentController(env.window, env.document);
  controller.choose(true);
  controller.choose(false);
  assert.equal(Array.from(env.window.dataLayer.at(-1))[2].ad_storage, "denied");
  assert.equal(env.reloads(), 1);
  assert.ok(env.removedCookies.some((cookie) => cookie.includes("Domain=ges-ab.se")));
  assert.ok(env.removedCookies.every((cookie) => cookie.startsWith("_gcl_au=")));
  assert.equal(controller.restore(), false);
});

test("a failed write on withdrawal cannot restore a previous acceptance", () => {
  const env = environment();
  const controller = tracking.createAdsConsentController(env.window, env.document);
  controller.choose(true);
  env.window.localStorage.setItem = () => { throw new Error("quota"); };
  controller.choose(false);
  const nextPage = tracking.createAdsConsentController(env.window, env.document);
  assert.notEqual(nextPage.restore(), true);
  assert.equal(env.scripts.length, 1);
});

test("locked storage reports failed withdrawal persistence without reloading into a grant", () => {
  const env = environment();
  const controller = tracking.createAdsConsentController(env.window, env.document);
  controller.choose(true);
  env.window.localStorage.removeItem = () => { throw new Error("locked"); };
  env.window.localStorage.setItem = () => { throw new Error("locked"); };
  assert.equal(controller.choose(false), false);
  assert.equal(env.reloads(), 0);
  assert.equal(Array.from(env.window.dataLayer.at(-1))[2].ad_storage, "denied");
});
