import assert from "node:assert/strict";
import test from "node:test";

import {
  blogPosts,
  getBlogIndexGroups,
  getBlogPostBySlug,
} from "../app/blog/blog-posts.mjs";

test("the blog collection exposes every detected route exactly once", () => {
  assert.equal(blogPosts.length, 9);
  assert.equal(new Set(blogPosts.map((post) => post.slug)).size, 9);
  assert.ok(blogPosts.every((post) => post.slug.length > 0));
});

test("the blog index keeps three featured posts and six article-grid posts", () => {
  const groups = getBlogIndexGroups();

  assert.deepEqual(
    groups.featured.map((post) => post.slug),
    [
      "how-to-solve-10-common-plumbing-problems",
      "how-to-prevent-your-plumbing-disasters-at-home",
      "why-you-should-never-ignore-a-leaky-faucet",
    ],
  );
  assert.equal(groups.articles.length, 6);
});

test("a blog detail slug resolves its article and unknown slugs stay unresolved", () => {
  assert.equal(
    getBlogPostBySlug("how-to-solve-10-common-plumbing-problems")?.title,
    "How to solve 10 Common Plumbing Problems",
  );
  assert.equal(getBlogPostBySlug("not-a-real-post"), undefined);
});
