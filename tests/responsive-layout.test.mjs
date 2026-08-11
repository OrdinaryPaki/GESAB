import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

import postcss from "postcss";

const appDirectory = new URL("../app/", import.meta.url);
const responsiveEntry = new URL("../app/responsive.css", import.meta.url);

async function exists(fileUrl) {
  try {
    await access(fileUrl);
    return true;
  } catch {
    return false;
  }
}

async function findCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nestedFiles = await Promise.all(
    entries.map((entry) => {
      const entryUrl = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory);
      return entry.isDirectory() ? findCssFiles(entryUrl) : [entryUrl];
    }),
  );

  return nestedFiles.flat().filter((fileUrl) => fileUrl.pathname.endsWith(".css"));
}

test("responsive styles load through their component and route owners", async () => {
  const layoutSource = await readFile(new URL("../app/layout.js", import.meta.url), "utf8");

  assert.match(layoutSource, /import "\.\/globals\.css";/, "the global foundation must remain loaded");
  assert.doesNotMatch(
    layoutSource,
    /responsive\.css/,
    "the root layout must not restore a site-wide responsive override dump",
  );
  assert.equal(
    await exists(responsiveEntry),
    false,
    "app/responsive.css must disappear once responsive rules belong to their owners",
  );
});

test("globals stays a small foundation instead of becoming a page-style dump again", async () => {
  const globalsUrl = new URL("../app/globals.css", import.meta.url);
  const source = await readFile(globalsUrl, "utf8");
  const root = postcss.parse(source, { from: globalsUrl.pathname });
  const classNames = new Set();

  root.walkRules((rule) => {
    for (const match of rule.selector.matchAll(/\.([A-Za-z_][\w-]*)/g)) {
      classNames.add(match[1]);
    }
  });

  assert.deepEqual(
    [...classNames].sort(),
    ["container"],
    "globals.css may contain only the shared container class; components and routes own the rest",
  );
  assert.ok(
    source.split("\n").length <= 150,
    "globals.css must stay small enough to review as a true global foundation",
  );
});

test("route owners contain responsive rules without generated-class substring selectors", async () => {
  const ownerFiles = [
    new URL("../app/components/HomePage.css", import.meta.url),
    new URL("../app/components/HomeHero.css", import.meta.url),
    new URL("../app/components/HomeSupportWhy.css", import.meta.url),
    new URL("../app/components/HomeServices.css", import.meta.url),
    new URL("../app/components/HomeAbout.css", import.meta.url),
    new URL("../app/components/HomeTrustProcess.css", import.meta.url),
    new URL("../app/components/HomeGalleryFaq.css", import.meta.url),
    new URL("../app/about/about-page.module.css", import.meta.url),
    new URL("../app/about/about-story.module.css", import.meta.url),
    new URL("../app/about/about-mission.module.css", import.meta.url),
    new URL("../app/contact/contact-shell.module.css", import.meta.url),
    new URL("../app/contact/contact-hero.module.css", import.meta.url),
    new URL("../app/contact/contact-form.module.css", import.meta.url),
    new URL("../app/contact/contact-info.module.css", import.meta.url),
    new URL("../app/service/service-page.module.css", import.meta.url),
    new URL("../app/service/[slug]/service-detail-shell.module.css", import.meta.url),
    new URL("../app/service/[slug]/service-detail-content.module.css", import.meta.url),
    new URL("../app/service/[slug]/service-detail-faq.module.css", import.meta.url),
    new URL("../app/service/[slug]/service-detail-quote.module.css", import.meta.url),
    new URL("../app/service/[slug]/service-detail-related.module.css", import.meta.url),
  ];

  for (const fileUrl of ownerFiles) {
    const source = await readFile(fileUrl, "utf8");
    const root = postcss.parse(source, { from: fileUrl.pathname });
    const mediaQueries = [];

    root.walkAtRules("media", (rule) => mediaQueries.push(rule.params));

    assert.ok(mediaQueries.length > 0, `${fileUrl.pathname} must own its responsive rules`);
    assert.doesNotMatch(
      source,
      /\[class\*=/,
      `${fileUrl.pathname} must use its real local classes instead of generated-name guesses`,
    );
  }
});

test("no stylesheet reaches CSS modules through generated class-name fragments", async () => {
  for (const fileUrl of await findCssFiles(appDirectory)) {
    const source = await readFile(fileUrl, "utf8");

    assert.doesNotMatch(
      source,
      /\[class\*=/,
      `${fileUrl.pathname} contains a fragile generated-class substring selector`,
    );
  }
});

test("narrow-phone rules keep fixed-width content inside the viewport", async () => {
  const narrowPhoneRules = [];

  for (const fileUrl of await findCssFiles(appDirectory)) {
    const source = await readFile(fileUrl, "utf8");
    const root = postcss.parse(source, { from: fileUrl.pathname });

    root.walkAtRules("media", (mediaRule) => {
      if (mediaRule.params !== "(max-width: 389px)") return;
      mediaRule.walkRules((rule) => narrowPhoneRules.push(rule));
    });
  }

  assert.ok(narrowPhoneRules.length > 0, "narrow-phone rules must not be empty");
  assert.ok(
    narrowPhoneRules.some((rule) => {
      const declarations = new Map();
      rule.walkDecls((declaration) => declarations.set(declaration.prop, declaration.value));

      return declarations.get("width") === "100%" && declarations.get("max-width") === "100%";
    }),
    "at least one narrow-phone guard must replace fixed widths with viewport-safe widths",
  );
});
