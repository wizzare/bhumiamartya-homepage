import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createHandler } from '../api/content/article-web.mjs';

process.env.GCP_PROJECT_ID = 'bhumiamartya-fe85c';
process.env.ARTICLE_WEB_PUBLISH_SECRET = 'test-article-web-secret';

function makeRes() {
  return { statusCode: 0, body: null, writeHead(s) { this.statusCode = s; }, end(d) { this.body = d; } };
}

async function call(req, writer) {
  const res = makeRes();
  await createHandler({ writer })(req, res);
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null };
}

const validBody = {
  title: 'Kenapa Kita Kerap Tertarik pada Seseorang yang Belum Selesai dengan Dirinya Sendiri',
  content: 'Isi artikel yang cukup panjang untuk lolos validasi.',
  date: '2026-09-18',
  seoTitle: 'Kenapa Kita Kerap Tertarik pada yang Belum Selesai?',
  seoDescription: 'Ringkasan meta description artikel.',
  category: 'Relationship',
  tags: ['pola hubungan', 'inner child'],
  slug: 'kenapa-kita-kerap-tertarik-pada-seseorang-yang-belum-selesai-dengan-dirinya-sendiri',
  source: 'google-drive'
};

const authedReq = (overrides = {}) => ({
  method: 'POST',
  url: '/api/content/article-web',
  headers: { authorization: 'Bearer test-article-web-secret' },
  body: validBody,
  ...overrides
});

test('publish new article-web -> 201', async () => {
  const writer = async () => ({ status: 'published', slug: validBody.slug, id: 'article-web-2026-09-18' });
  const r = await call(authedReq(), writer);
  assert.equal(r.status, 201);
  assert.equal(r.body.success, true);
  assert.equal(r.body.status, 'published');
  assert.equal(r.body.slug, validBody.slug);
});

test('same date twice -> 200 already_published', async () => {
  const writer = async () => ({ status: 'already_published', slug: validBody.slug, id: 'article-web-2026-09-18' });
  const r = await call(authedReq(), writer);
  assert.equal(r.status, 200);
  assert.equal(r.body.status, 'already_published');
});

test('wrong secret -> 401', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ headers: { authorization: 'Bearer wrong-secret' } }), writer);
  assert.equal(r.status, 401);
  assert.equal(r.body.code, 'UNAUTHORIZED');
});

test('morning-brew secret does not authorize article-web endpoint (separate credentials)', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ headers: { authorization: 'Bearer some-morning-brew-secret' } }), writer);
  assert.equal(r.status, 401);
});

test('missing title -> 400', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ body: { ...validBody, title: '' } }), writer);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_TITLE');
});

test('missing content -> 400', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ body: { ...validBody, content: '' } }), writer);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_CONTENT');
});

test('invalid date -> 400', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ body: { ...validBody, date: '18-09-2026' } }), writer);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_DATE');
});

test('invalid slug in payload -> 400', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ body: { ...validBody, slug: 'Not A Valid Slug!!' } }), writer);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_SLUG');
});

test('non-array tags -> 400', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ body: { ...validBody, tags: 'not-an-array' } }), writer);
  assert.equal(r.status, 400);
  assert.equal(r.body.code, 'INVALID_TAGS');
});

test('works fine with only title/content/date (metadata all optional)', async () => {
  const writer = async () => ({ status: 'published', slug: 'judul-minimal', id: 'article-web-2026-09-18' });
  const r = await call(authedReq({ body: { title: 'Judul Minimal', content: 'Isi minimal tanpa metadata.', date: '2026-09-18' } }), writer);
  assert.equal(r.status, 201);
  assert.equal(r.body.success, true);
});

test('GET method not allowed -> 405', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call({ method: 'GET', url: '/api/content/article-web', headers: {} }, writer);
  assert.equal(r.status, 405);
  assert.equal(r.body.code, 'METHOD_NOT_ALLOWED');
});

test('dryRun does not call the writer and previews the provided slug', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ body: { ...validBody, dryRun: true } }), writer);
  assert.equal(r.status, 200);
  assert.equal(r.body.status, 'dry_run');
  assert.equal(r.body.slug, validBody.slug);
});

test('dryRun without a slug previews a slug derived from the title', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const { slug, ...withoutSlug } = validBody;
  const r = await call(authedReq({ body: { ...withoutSlug, dryRun: true } }), writer);
  assert.equal(r.status, 200);
  assert.equal(r.body.slug, 'kenapa-kita-kerap-tertarik-pada-seseorang-yang-belum-selesai-dengan-dirinya-sendiri');
});

test('writer failure sanitized -> 503, no internal detail leaked', async () => {
  const writer = async () => { throw new Error('opaque firestore internal detail'); };
  const r = await call(authedReq(), writer);
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'PUBLISH_FAILED');
  assert.equal(JSON.stringify(r.body).includes('opaque'), false);
});

test('missing ARTICLE_WEB_PUBLISH_SECRET config -> 503', async () => {
  const original = process.env.ARTICLE_WEB_PUBLISH_SECRET;
  delete process.env.ARTICLE_WEB_PUBLISH_SECRET;
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq(), writer);
  process.env.ARTICLE_WEB_PUBLISH_SECRET = original;
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'PUBLISH_NOT_CONFIGURED');
});
