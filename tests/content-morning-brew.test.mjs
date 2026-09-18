import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createHandler } from '../api/content/morning-brew.mjs';

process.env.GCP_PROJECT_ID = 'bhumiamartya-fe85c';
process.env.MORNING_BREW_PUBLISH_SECRET = 'test-secret-value';

function makeRes() {
  return { statusCode: 0, body: null, writeHead(s) { this.statusCode = s; }, end(d) { this.body = d; } };
}

async function call(req, writer) {
  const res = makeRes();
  await createHandler({ writer })(req, res);
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null };
}

const validBody = {
  title: 'Ketika Kamu Capek Menjadi Kuat Terus',
  content: 'Isi Morning Brew hari ini yang cukup panjang untuk artikel.',
  date: '2026-09-18',
  source: 'google-drive'
};

const authedReq = (overrides = {}) => ({
  method: 'POST',
  url: '/api/content/morning-brew',
  headers: { authorization: 'Bearer test-secret-value' },
  body: validBody,
  ...overrides
});

test('publish new morning brew -> 201', async () => {
  const writer = async () => ({ status: 'published', slug: 'ketika-kamu-capek-menjadi-kuat-terus', id: 'morning-brew-2026-09-18' });
  const r = await call(authedReq(), writer);
  assert.equal(r.status, 201);
  assert.equal(r.body.success, true);
  assert.equal(r.body.status, 'published');
  assert.equal(r.body.slug, 'ketika-kamu-capek-menjadi-kuat-terus');
  assert.ok(r.body.url.includes('/articles/ketika-kamu-capek-menjadi-kuat-terus/'));
});

test('publish same date twice -> 200 already_published, no duplicate', async () => {
  const writer = async () => ({ status: 'already_published', slug: 'ketika-kamu-capek-menjadi-kuat-terus', id: 'morning-brew-2026-09-18' });
  const r = await call(authedReq(), writer);
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.status, 'already_published');
});

test('wrong secret -> 401', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ headers: { authorization: 'Bearer wrong-secret' } }), writer);
  assert.equal(r.status, 401);
  assert.equal(r.body.success, false);
  assert.equal(r.body.code, 'UNAUTHORIZED');
});

test('missing authorization header -> 401', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ headers: {} }), writer);
  assert.equal(r.status, 401);
  assert.equal(r.body.code, 'UNAUTHORIZED');
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

test('GET method not allowed -> 405', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call({ method: 'GET', url: '/api/content/morning-brew', headers: {} }, writer);
  assert.equal(r.status, 405);
  assert.equal(r.body.code, 'METHOD_NOT_ALLOWED');
});

test('writer failure sanitized -> 503, no internal detail leaked', async () => {
  const writer = async () => { throw new Error('opaque firestore internal detail'); };
  const r = await call(authedReq(), writer);
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'PUBLISH_FAILED');
  assert.equal(JSON.stringify(r.body).includes('opaque'), false);
});

test('dryRun does not call the writer and returns a preview slug', async () => {
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq({ body: { ...validBody, dryRun: true } }), writer);
  assert.equal(r.status, 200);
  assert.equal(r.body.success, true);
  assert.equal(r.body.status, 'dry_run');
  assert.equal(r.body.slug, 'ketika-kamu-capek-menjadi-kuat-terus');
});

test('missing MORNING_BREW_PUBLISH_SECRET config -> 503', async () => {
  const original = process.env.MORNING_BREW_PUBLISH_SECRET;
  delete process.env.MORNING_BREW_PUBLISH_SECRET;
  const writer = async () => { throw new Error('should not be called'); };
  const r = await call(authedReq(), writer);
  process.env.MORNING_BREW_PUBLISH_SECRET = original;
  assert.equal(r.status, 503);
  assert.equal(r.body.code, 'PUBLISH_NOT_CONFIGURED');
});
