import assert from "node:assert/strict";
import test from "node:test";
import { transformArticleHtml } from "./html-transform";
import { sanitizeArticleHtml } from "./sanitize";

test("sanitizeArticleHtml preserves editor markup and strips executable HTML", () => {
  const result = sanitizeArticleHtml(`
    <script>alert(1)</script>
    <p onclick="alert(1)" style="text-align: center; position: fixed">Safe</p>
    <a href="javascript:alert(1)" target="_blank">Bad link</a>
    <img src="https://media.example.com/image.webp" data-caption="Caption" onerror="alert(1)">
    <span class="article-ref-anchor evil" data-ref-id="1" data-ref-url="https://example.com" data-ref-label="Example" data-ref-title="Title"><sup class="article-ref-num">1</sup></span>
  `);

  assert.doesNotMatch(result, /<script|onclick|onerror|javascript:|position:/);
  assert.match(result, /style="text-align:center"/);
  assert.match(result, /loading="lazy" decoding="async"/);
  assert.match(result, /class="article-ref-anchor"/);
  assert.doesNotMatch(result, /class="[^"]*evil/);
});

test("transformArticleHtml adds stable headings, captions, and unique references", () => {
  const result = transformArticleHtml(`
    <h2>Résumé tips</h2><h3>Résumé tips</h3>
    <img src="/image.webp" alt="Example" data-caption="A caption">
    <p><span data-ref-id="2" data-ref-url="https://example.com" data-ref-label="Example (2026)" data-ref-title="Example"><sup>2</sup></span></p>
    <span data-ref-id="2" data-ref-url="https://example.com" data-ref-label="Duplicate"><sup>2</sup></span>
  `);

  assert.deepEqual(result.headings, [
    { id: "resume-tips", level: 2, text: "Résumé tips" },
    { id: "resume-tips-2", level: 3, text: "Résumé tips" },
  ]);
  assert.match(
    result.html,
    /<figure><img[^>]+><figcaption>A caption<\/figcaption><\/figure>/,
  );
  assert.match(result.html, /href="#ref-2" aria-label="Reference 2">2<\/a>/);
  assert.deepEqual(result.references, [
    {
      id: 2,
      url: "https://example.com",
      label: "Example (2026)",
      title: "Example",
    },
  ]);
});

test("math nodes survive sanitization and render as accessible KaTeX", () => {
  const sanitized = sanitizeArticleHtml(`
    <p>Energy: <span data-type="inline-math" data-latex="E = mc^2"></span></p>
    <div data-type="block-math" data-latex="\\frac{a}{b}"></div>
  `);
  const result = transformArticleHtml(sanitized);

  assert.match(sanitized, /data-type="inline-math" data-latex="E = mc\^2"/);
  assert.match(
    sanitized,
    /data-type="block-math" data-latex="\\frac\{a\}\{b\}"/,
  );
  assert.match(result.html, /class="article-math-inline"/);
  assert.match(result.html, /class="article-math-block"/);
  assert.match(result.html, /class="katex-mathml"/);
});
