import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createHandler as listHandler } from '../api/bhumi-ebooks.mjs';
import { createHandler as detailHandler } from '../api/bhumi-ebook.mjs';
import { getPublishedEbooks, getPublishedEbookBySlug, safePdfUrl, isValidSlug } from '../lib/content/firestore-reader.mjs';

process.env.GCP_PROJECT_ID = 'bhumiamartya-fe85c';

function makeRes() {
  return { statusCode: 0, body: null, writeHead(s) { this.statusCode = s; }, end(d) { this.body = d; } };
}

async function call(handler, req) {
  const res = makeRes();
  await handler(req, res);
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null };
}

const ebook = {
  id: 'e1',
  title: 'Inner Child',
  slug: 'inner-child',
  description: 'Panduan mengenal anak kecil dalam tubuh dewasa.',
  category: 'Bhumi Ebook',
  tags: ['inner child'],
  coverImageUrl: 'https://example.com/c.jpg',
  authorName: 'Bhumi Amartya',
  publishedAt: '2026-08-01T00:00:00.000Z',
  updatedAt: null,
  seoTitle: 'Inner Child | Bhumi',
  seoDescription: 'Panduan Inner Child',
  pdfFileName: 'inner-child.pdf',
  pdfFileSize: 2457600,
  pdfFileUrl: 'https://storage.example.com/inner-child.pdf'
};

const ebookList = {
  id: 'e1',
  title: 'Inner Child',
  slug: 'inner-child',
  description: 'Panduan mengenal anak kecil dalam tubuh dewasa.',
  category: 'Bhumi Ebook',
  tags: ['inner child'],
  coverImageUrl: 'https://example.com/c.jpg',
  authorName: 'Bhumi Amartya',
  publishedAt: '2026-08-01T00:00:00.000Z',
  updatedAt: null,
  seoTitle: 'Inner Child | Bhumi',
  seoDescription: 'Panduan Inner Child',
  pdfFileName: 'inner-child.pdf',
  pdfFileSize: 2457600
};

test('ebooks list valid default', async () => {
  const r = await call(listHandler({ reader: async ({ limit }) => [ebookList] }), { method: 'GET', url: '/api/bhumi-ebooks' });
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
  assert.equal(r.body.ebooks.length, 1);
  assert.equal('pdfFileUrl' in r.body.ebooks[0], false);
  assert.equal('status' in r.body.ebooks[0], false);
  assert.equal('source' in r.body.ebooks[0], false);
});

test('ebooks list limit bounds', async () => {
  assert.equal((await call(listHandler({ reader: async () => [] }), { method: 'GET', url: '/api/bhumi-ebooks?limit=1' })).status, 200);
  assert.equal((await call(listHandler({ reader: async () => [] }), { method: 'GET', url: '/api/bhumi-ebooks?limit=20' })).status, 200);
  assert.equal((await call(listHandler({ reader: async () => [] }), { method: 'GET', url: '/api/bhumi-ebooks?limit=0' })).body.code, 'INVALID_LIMIT');
  assert.equal((await call(listHandler({ reader: async () => [] }), { method: 'GET', url: '/api/bhumi-ebooks?limit=21' })).body.code, 'INVALID_LIMIT');
  assert.equal((await call(listHandler({ reader: async () => [] }), { method: 'GET', url: '/api/bhumi-ebooks?limit=abc' })).body.code, 'INVALID_LIMIT');
});

test('ebooks list method + sanitized failure', async () => {
  assert.equal((await call(listHandler({ reader: async () => [] }), { method: 'POST', url: '/api/bhumi-ebooks' })).body.code, 'METHOD_NOT_ALLOWED');
  const r = await call(listHandler({ reader: async () => { throw new Error('opaque'); } }), { method: 'GET', url: '/api/bhumi-ebooks' });
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'EBOOK_SERVICE_UNAVAILABLE');
  assert.equal(JSON.stringify(r.body).includes('opaque'), false);
});

test('ebook list source/status enforced via injected repo', async () => {
  const reader = async ({ limit }) => [ebookList, { ...ebookList, id: 'draft', slug: 'draft-book' }].slice(0, limit);
  const { getPublishedEbooks: gpe } = { getPublishedEbooks };
  assert.ok(typeof gpe === 'function');
  let called = null;
  const fake = async ({ limit }) => { called = true; return [ebookList]; };
  await getPublishedEbooks({ limit: 5, fetchEbooks: fake });
  assert.equal(called, true);
});

test('ebook detail valid published', async () => {
  const r = await call(detailHandler({ reader: async (slug) => ebook }), { method: 'GET', url: '/api/bhumi-ebook?slug=inner-child' });
  assert.equal(r.status, 200);
  assert.equal(r.body.ebook.slug, 'inner-child');
  assert.equal(r.body.ebook.pdfFileUrl, 'https://storage.example.com/inner-child.pdf');
  assert.equal('status' in r.body.ebook, false);
});

test('ebook detail not found / invalid / missing / method', async () => {
  assert.equal((await call(detailHandler({ reader: async () => null }), { method: 'GET', url: '/api/bhumi-ebook?slug=x' })).body.code, 'EBOOK_NOT_FOUND');
  assert.equal((await call(detailHandler({ reader: async (s) => ebook }), { method: 'GET', url: '/api/bhumi-ebook?slug=../x' })).body.code, 'INVALID_SLUG');
  assert.equal((await call(detailHandler({ reader: async (s) => ebook }), { method: 'GET', url: '/api/bhumi-ebook' })).body.code, 'INVALID_SLUG');
  assert.equal((await call(detailHandler({ reader: async (s) => ebook }), { method: 'POST', url: '/api/bhumi-ebook?slug=inner-child' })).body.code, 'METHOD_NOT_ALLOWED');
});

test('ebook detail sanitized failure', async () => {
  const r = await call(detailHandler({ reader: async () => { throw new Error('opaque'); } }), { method: 'GET', url: '/api/bhumi-ebook?slug=inner-child' });
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'EBOOK_SERVICE_UNAVAILABLE');
});

test('safePdfUrl allows https only', () => {
  assert.equal(safePdfUrl('https://storage.example.com/a.pdf'), 'https://storage.example.com/a.pdf');
  assert.equal(safePdfUrl('javascript:alert(1)'), null);
  assert.equal(safePdfUrl('data:text/html,x'), null);
  assert.equal(safePdfUrl('http://insecure.example.com/a.pdf'), null);
  assert.equal(safePdfUrl(''), null);
});

test('ebook slug validation', () => {
  assert.equal(isValidSlug('inner-child'), true);
  assert.equal(isValidSlug('../x'), false);
});

test('ebook detail query enforces slug via injected fetch', async () => {
  let called = null;
  const fake = async (slug) => { called = slug; return null; };
  const res = await getPublishedEbookBySlug('inner-child', { fetchBySlug: fake });
  assert.equal(res, null);
  assert.equal(called, 'inner-child');
});