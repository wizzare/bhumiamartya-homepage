import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { renderArticleBody } from '../lib/content/render-article.mjs';

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
