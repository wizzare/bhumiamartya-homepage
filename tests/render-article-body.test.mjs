import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { renderArticleBody, stripMetadataBlock } from '../lib/content/render-article.mjs';

test('bold markdown inside a paragraph becomes <strong>', () => {
  const html = renderArticleBody('Ini **penting** untuk diingat.');
  assert.equal(html, '<p>Ini <strong>penting</strong> untuk diingat.</p>');
});

test('bold markdown inside a heading becomes <strong> inside the heading tag', () => {
  const html = renderArticleBody('## **Judul Bagian**');
  assert.equal(html, '<h2><strong>Judul Bagian</strong></h2>');
});

test('all list items are kept even when interior lines carry leading whitespace', () => {
  // Mirrors real Google Docs export text: first line trimmed by the block, later lines
  // in the same block keep their own indentation.
  const content = 'Pertanyaan:\n\n  - Pertama?\n  - Kedua?\n  - Ketiga?\n  - Keempat?';
  const html = renderArticleBody(content);
  assert.equal((html.match(/<li>/g) || []).length, 4);
  assert.ok(html.includes('<li>Pertama?</li>'));
  assert.ok(html.includes('<li>Keempat?</li>'));
});

test('bold markdown inside a list item is converted, item text preserved', () => {
  const html = renderArticleBody('- Ini **contoh** item.');
  assert.ok(html.includes('<li>Ini <strong>contoh</strong> item.</li>'));
});

test('plain content without bold or lists is unaffected', () => {
  const html = renderArticleBody('Paragraf biasa tanpa markdown apa pun.');
  assert.equal(html, '<p>Paragraf biasa tanpa markdown apa pun.</p>');
});

test('html-unsafe characters are still escaped before bold conversion runs', () => {
  const html = renderArticleBody('**<script>alert(1)</script>**');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.startsWith('<p><strong>'));
});

test('stripMetadataBlock strips SEO_TITLE, META_DESCRIPTION, and separators cleanly', () => {
  const raw = `SEO_TITLE: Life Path 1: Seni Berdiri Sendiri
META_DESCRIPTION: Temukan arti sejati di balik Life Path 1.
CATEGORY: Numerologi
TAGS: numerologi, life path 1
SLUG: life-path-1
---
Paragraf pembuka artikel yang sebenarnya.`;
  const cleaned = stripMetadataBlock(raw);
  assert.equal(cleaned, 'Paragraf pembuka artikel yang sebenarnya.');
});

test('renderArticleBody strips SEO metadata block from rendered html', () => {
  const raw = `---
SEO_TITLE: Memutus Beban Ekspektasi
META_DESCRIPTION: Apakah kamu hidup untuk dirimu sendiri?
CATEGORY: Ancestral Healing
TAGS: inner child, mother wound
SLUG: memutus-beban
---
Paragraf artikel tanpa metadata sama sekali.`;
  const html = renderArticleBody(raw);
  assert.ok(!html.includes('SEO_TITLE'));
  assert.ok(!html.includes('META_DESCRIPTION'));
  assert.ok(!html.includes('CATEGORY'));
  assert.equal(html, '<p>Paragraf artikel tanpa metadata sama sekali.</p>');
});
