import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import postcss from "postcss";

const appDirectory = new URL("../app/", import.meta.url);

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

test("navigation styles do not create a separate logo mark", async () => {
  const visibleLogoMarks = [];

  for (const fileUrl of await findCssFiles(appDirectory)) {
    const root = postcss.parse(await readFile(fileUrl, "utf8"), { from: fileUrl.pathname });

    root.walkRules((rule) => {
      if (!rule.selector.includes(".logo") || !rule.selector.includes("::before")) return;

      rule.walkDecls("content", (declaration) => {
        if (!["none", "normal", '""', "''"].includes(declaration.value)) {
          visibleLogoMarks.push(`${fileUrl.pathname}: ${rule.selector}`);
        }
      });
    });
  }

  assert.deepEqual(
    visibleLogoMarks,
    [],
    `navigation CSS must not draw a separate logo mark:\n${visibleLogoMarks.join("\n")}`,
  );
});
