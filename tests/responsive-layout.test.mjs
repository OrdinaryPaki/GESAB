import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

import postcss from "postcss";

const responsiveStylesPath = new URL("../app/responsive.css", import.meta.url);

async function responsiveStylesExist() {
  try {
    await access(responsiveStylesPath);
    return true;
  } catch {
    return false;
  }
}

async function readResponsiveBundleSource() {
  const entrySource = await readFile(responsiveStylesPath, "utf8");
  const importedSources = await Promise.all(
    [...entrySource.matchAll(/@import\s+["'](.+?)["'];/g)].map(
      async ([, relativePath]) =>
        readFile(new URL(relativePath, responsiveStylesPath), "utf8"),
    ),
  );

  return [entrySource, ...importedSources].join("\n");
}

test("the root layout loads the responsive layer after the base styles", async () => {
  const layoutSource = await readFile(
    new URL("../app/layout.js", import.meta.url),
    "utf8",
  );
  const baseImportPosition = layoutSource.indexOf('import "./globals.css";');
  const responsiveImportPosition = layoutSource.indexOf(
    'import "./responsive.css";',
  );

  assert.notEqual(baseImportPosition, -1, "the base stylesheet must remain loaded");
  assert.notEqual(
    responsiveImportPosition,
    -1,
    "the shared responsive stylesheet must be loaded by every route",
  );
  assert.ok(
    responsiveImportPosition > baseImportPosition,
    "responsive safeguards must load after the base stylesheet",
  );
});

test("the responsive layer covers every page family and critical viewport range", async () => {
  assert.equal(
    await responsiveStylesExist(),
    true,
    "app/responsive.css must exist before its responsive contracts can be checked",
  );

  const source = await readResponsiveBundleSource();
  const root = postcss.parse(source);
  const mediaQueries = [];

  root.walkAtRules("media", (rule) => mediaQueries.push(rule.params));

  assert.ok(
    mediaQueries.includes("(min-width: 981px) and (max-width: 1248px)"),
    "small laptops need a fluid bridge between mobile and the 1200px desktop layout",
  );
  assert.ok(
    mediaQueries.includes("(min-width: 521px) and (max-width: 980px)"),
    "tablets need layouts wider than the 350px phone snapshot",
  );
  assert.ok(
    mediaQueries.includes("(max-width: 389px)"),
    "narrow phones need protection from the fixed 350px reference layout",
  );

  for (const pageScope of [
    ".home-page",
    "#about-page",
    "contact-page-module",
    "service-page-module",
    "service-detail-page",
    "blog-module",
  ]) {
    assert.match(
      source,
      new RegExp(pageScope.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `${pageScope} must be included in the shared responsive layer`,
    );
  }
});

test("narrow-phone rules constrain fixed-width content to the viewport", async () => {
  assert.equal(
    await responsiveStylesExist(),
    true,
    "app/responsive.css must exist before its narrow-phone rules can be checked",
  );

  const source = await readResponsiveBundleSource();
  const root = postcss.parse(source);
  const narrowPhoneRules = [];

  root.walkAtRules("media", (mediaRule) => {
    if (mediaRule.params !== "(max-width: 389px)") return;
    mediaRule.walkRules((rule) => narrowPhoneRules.push(rule));
  });

  assert.ok(narrowPhoneRules.length > 0, "narrow-phone rules must not be empty");
  assert.ok(
    narrowPhoneRules.some((rule) => {
      const declarations = new Map();
      rule.walkDecls((declaration) => {
        declarations.set(declaration.prop, declaration.value);
      });
      return (
        declarations.get("width") === "100%" &&
        declarations.get("max-width") === "100%"
      );
    }),
    "at least one narrow-phone guard must replace fixed widths with viewport-safe widths",
  );
});
