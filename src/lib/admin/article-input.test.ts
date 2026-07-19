import assert from "node:assert/strict";
import test from "node:test";
import { parseArticleInput } from "./article-input";

function validForm() {
  const form = new FormData();
  form.set("blog", "pb");
  form.set("title", "A useful article");
  form.set("slug", "a-useful-article");
  form.set("summary", "A short summary.");
  form.set("tags", "Next.js, Security, Next.js");
  form.set(
    "bodyHtml",
    '<p onclick="alert(1)">Safe body</p><script>alert(1)</script>',
  );
  form.set("intent", "publish");
  return form;
}

test("parses, normalizes, and sanitizes valid article input", () => {
  const result = parseArticleInput(validForm());
  assert.equal(result.success, true);

  if (result.success) {
    assert.deepEqual(result.data.tags, ["Next.js", "Security"]);
    assert.equal(result.data.intent, "publish");
    assert.equal(result.data.bodyHtml, "<p>Safe body</p>");
  }
});

test("returns field errors for invalid article input", () => {
  const form = validForm();
  form.set("blog", "unknown");
  form.set("title", "");
  form.set("slug", "Bad Slug");
  form.set("summary", "");
  form.set("bodyHtml", "<script>alert(1)</script>");

  const result = parseArticleInput(form);
  assert.equal(result.success, false);

  if (!result.success) {
    assert.deepEqual(Object.keys(result.state.fieldErrors ?? {}).sort(), [
      "blog",
      "bodyHtml",
      "slug",
      "summary",
      "title",
    ]);
  }
});
