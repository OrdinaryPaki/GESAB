import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import postcss from "postcss";

const baseStylesPath = new URL("../app/globals.css", import.meta.url);
const responsiveStylesPath = new URL(
  "../app/responsive/footer.css",
  import.meta.url,
);

function getDeclarations(root, selector, mediaQuery = null) {
  const declarations = new Map();

  root.walkRules(selector, (rule) => {
    const parentMedia = rule.parent?.type === "atrule" ? rule.parent.params : null;
    if (parentMedia !== mediaQuery) return;

    rule.walkDecls((declaration) => {
      declarations.set(declaration.prop, declaration.value);
    });
  });

  return declarations;
}

test("the footer follows the reference layout while preserving the GESAB palette", async () => {
  const baseRoot = postcss.parse(await readFile(baseStylesPath, "utf8"));
  const responsiveRoot = postcss.parse(
    await readFile(responsiveStylesPath, "utf8"),
  );

  const footer = getDeclarations(baseRoot, ".footer");
  const desktopGrid = getDeclarations(baseRoot, ".footer-grid");
  const desktopBottom = getDeclarations(baseRoot, ".footer-bottom");
  const heading = getDeclarations(baseRoot, ".footer-list span");
  const link = getDeclarations(baseRoot, ".footer-list a");
  const contactButton = getDeclarations(baseRoot, ".socials a");
  const tabletGrid = getDeclarations(
    responsiveRoot,
    ".footer-grid",
    "(max-width: 980px)",
  );
  const phoneGrid = getDeclarations(
    responsiveRoot,
    ".footer-grid",
    "(max-width: 680px)",
  );

  assert.equal(footer.get("background"), "white");
  assert.equal(heading.get("color"), "var(--text)");
  assert.equal(link.get("color"), "var(--text)");
  assert.equal(contactButton.get("background"), "var(--yellow)");

  assert.equal(desktopGrid.get("display"), "grid");
  assert.match(
    desktopGrid.get("grid-template-columns") ?? "",
    /repeat\(3, minmax\(0, 1fr\)\)/,
  );
  assert.equal(desktopBottom.get("display"), "flex");
  assert.equal(
    tabletGrid.get("grid-template-columns"),
    "repeat(2, minmax(0, 1fr))",
  );
  assert.equal(phoneGrid.get("grid-template-columns"), "1fr");
});
