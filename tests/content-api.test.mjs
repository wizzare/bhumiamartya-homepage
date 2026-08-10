import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createHandler } from '../api/bhumi-articles.mjs';
import { listPublishedArticles } from '../lib/content/firestore-reader.mjs';

process.env.GCP_PROJECT_ID = 'bhumiamartya-fe85c';

function makeRes() {
  return {
    statusCode: 0,
    body: null,
    writeHead(status) { this.statusCode = status; },
    end(data) { this.body = data; }
  };
}

async function call(req, reader) {
  const handler = createHandler({ reader });
  const res = makeRes();
  await handler(req, res);
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null };
}

const sample = (overrides = {}) => ({
  id: 'abc123',
  title: 'Sehat Mental',
  slug: 'sehat-mental',
  excerpt: 'Ringkasan',
  category: 'Ngopi Ilmu',
  tags: ['refleksi'],
  coverImageUrl: 'https://example.com/x.jpg',
  authorName: 'Bhumi Amartya',
  publishedAt: '2026-08-01T00:00:00.000Z',
  updatedAt: null,
  seoTitle: '',
  seoDescription: '',
  readingTimeMinutes: 5,
  featured: false,
  ...overrides
});

const okReader = async ({ limit }) => [
  sample(),
  sample({ id: 'def', slug: 'kedua', publishedAt: '2026-07-01T00:00:00.000Z' }),
  sample({ id: 'ghi', slug: 'draft-record', status: 'draft' })
].slice(0, limit);

test('GET valid default limit=6', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-articles' }, okReader);
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
  assert.ok(Array.isArray(r.body.articles));
  assert.equal(r.body.articles.length, 3);
});

test('GET limit=6', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-articles?limit=6' }, okReader);
  assert.equal(r.status, 200);
  assert.equal(r.body.articles.length, 3);
});

test('GET limit=1', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-articles?limit=1' }, okReader);
  assert.equal(r.status, 200);
  assert.equal(r.body.articles.length, 1);
});

test('GET limit=12 accepted', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-articles?limit=12' }, okReader);
  assert.equal(r.status, 200);
});

test('GET limit=0 invalid', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-articles?limit=0' }, okReader);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_LIMIT');
});

test('GET limit=13 invalid', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-articles?limit=13' }, okReader);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_LIMIT');
});

test('GET non-integer limit invalid', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-articles?limit=abc' }, okReader);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_LIMIT');
});

test('POST method not allowed', async () => {
  const r = await call({ method: 'POST', url: '/api/bhumi-articles' }, okReader);
  assert.equal(r.status, 405);
  assert.equal(r.body.code, 'METHOD_NOT_ALLOWED');
});

test('Firestore failure sanitized', async () => {
  const failReader = async () => { throw new Error('opaque'); };
  const r = await call({ method: 'GET', url: '/api/bhumi-articles?limit=5' }, failReader);
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'ARTICLE_SERVICE_UNAVAILABLE');
  assert.equal(JSON.stringify(r.body).includes('opaque'), false);
});

test('reader abstraction enforces published+bhumi and sorts desc', async () => {
  const fakeFetch = async () => [
    sample({ publishedAt: '2026-05-01T00:00:00.000Z' }),
    sample({ id: 'x', slug: 'no-date', publishedAt: null }),
    sample({ id: 'y', slug: '', publishedAt: '2026-01-01T00:00:00.000Z' }),
    sample({ id: 'z', slug: 'terbaru', publishedAt: '2026-09-01T00:00:00.000Z' })
  ];
  const out = await listPublishedArticles({ limit: 10, fetchPublished: fakeFetch });
  assert.deepEqual(out.map((a) => a.slug), ['terbaru', 'sehat-mental']);
});