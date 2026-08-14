import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const workspaceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appRoot = path.join(workspaceRoot, "app");
const publicRoot = path.join(workspaceRoot, "public");
const imageRoot = path.join(publicRoot, "images");
const sourceExtensions = new Set([".css", ".js", ".jsx", ".json", ".mjs", ".ts", ".tsx"]);

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function findReferencedImages() {
  const references = new Set();

  for (const sourceFile of listFiles(appRoot)) {
    if (!sourceExtensions.has(path.extname(sourceFile))) continue;

    const source = readFileSync(sourceFile, "utf8");
    for (const match of source.matchAll(/["'`](\/images\/[^"'`?#)\s]+)["'`]/g)) {
      references.add(match[1]);
    }
  }

  return references;
}

test("every published image is referenced and every image reference resolves", () => {
  const references = findReferencedImages();
  const publishedImages = listFiles(imageRoot).map(
    (filePath) => `/${path.relative(publicRoot, filePath).split(path.sep).join("/")}`,
  );

  const unusedImages = publishedImages.filter((imagePath) => !references.has(imagePath));
  const missingImages = [...references].filter(
    (imagePath) => !publishedImages.includes(imagePath),
  );

  assert.deepEqual(unusedImages, [], `Unused images must not be published:\n${unusedImages.join("\n")}`);
  assert.deepEqual(missingImages, [], `Referenced images must exist:\n${missingImages.join("\n")}`);
});

test("published raster images stay within the delivery-size budget", () => {
  const oversizedImages = listFiles(imageRoot)
    .filter((filePath) => /\.(?:jpe?g|png|webp)$/i.test(filePath))
    .filter((filePath) => statSync(filePath).size > 450_000)
    .map((filePath) => ({
      image: `/${path.relative(publicRoot, filePath).split(path.sep).join("/")}`,
      bytes: statSync(filePath).size,
    }));

  assert.deepEqual(
    oversizedImages,
    [],
    `Raster images must stay under 450 KB:\n${JSON.stringify(oversizedImages, null, 2)}`,
  );
});
