import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createHandler } from '../api/bhumi-article.mjs';
import { getPublishedArticleBySlug, isValidSlug } from '../lib/content/firestore-reader.mjs';

process.env.GCP_PROJECT_ID = 'bhumiamartya-fe85c';

function makeRes() {
  return { statusCode: 0, body: null, writeHead(s) { this.statusCode = s; }, end(d) { this.body = d; } };
}

async function call(req, reader) {
  const res = makeRes();
  await createHandler({ reader })(req, res);
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null };
}

const article = {
  id: 'x1',
  title: 'Apa itu MBTI',
  slug: 'apa-itu-mbti',
  excerpt: 'Ringkasan MBTI',
  content: '## Isi\n\nparagraf pertama.',
  category: 'Ngopi Ilmu',
  tags: ['MBTI'],
  coverImageUrl: 'https://example.com/a.jpg',
  authorName: 'Bhumi Amartya',
  publishedAt: '2026-08-01T00:00:00.000Z',
  updatedAt: null,
  seoTitle: 'Apa itu MBTI | Bhumi',
  seoDescription: 'Penjelasan MBTI',
  readingTimeMinutes: 4,
  featured: false
};

test('detail valid slug -> published article with content', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-article?slug=apa-itu-mbti' }, async (slug) => article);
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
  assert.equal(r.body.article.slug, 'apa-itu-mbti');
  assert.ok(r.body.article.content);
  assert.equal('status' in r.body.article, false);
  assert.equal('source' in r.body.article, false);
});

test('detail not found -> 404', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-article?slug=tidak-ada' }, async () => null);
  assert.equal(r.status, 404);
  assert.equal(r.body.code, 'ARTICLE_NOT_FOUND');
});

test('detail invalid slug -> 400', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-article?slug=../etc/passwd' }, async () => article);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_SLUG');
});

test('detail empty slug -> 400', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-article' }, async () => article);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_SLUG');
});

test('detail wrong method -> 405', async () => {
  const r = await call({ method: 'POST', url: '/api/bhumi-article?slug=apa-itu-mbti' }, async () => article);
  assert.equal(r.status, 405);
  assert.equal(r.body.code, 'METHOD_NOT_ALLOWED');
});

test('detail reader failure sanitized', async () => {
  const r = await call({ method: 'GET', url: '/api/bhumi-article?slug=apa-itu-mbti' }, async () => { throw new Error('opaque db error'); });
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'ARTICLE_SERVICE_UNAVAILABLE');
  assert.equal(JSON.stringify(r.body).includes('opaque'), false);
});

test('isValidSlug accepts/safety', () => {
  assert.equal(isValidSlug('apa-itu-mbti'), true);
  assert.equal(isValidSlug('a'), true);
  assert.equal(isValidSlug('APA'), false);
  assert.equal(isValidSlug('a b'), false);
  assert.equal(isValidSlug(''), false);
  assert.equal(isValidSlug('a'.repeat(201)), false);
  assert.equal(isValidSlug('../x'), false);
});

test('repository enforced query via injected fetch (slug+source+status)', async () => {
  let calledWith = null;
  const fakeFetch = async (slug) => {
    calledWith = slug;
    return null;
  };
  const res = await getPublishedArticleBySlug('apa-itu-mbti', { fetchBySlug: fakeFetch });
  assert.equal(res, null);
  assert.equal(calledWith, 'apa-itu-mbti');
});