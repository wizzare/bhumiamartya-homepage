import { strict as assert } from 'node:assert';
import handler from '../api/blueprint-engines.mjs';

function makeRes() {
  const chunks = [];
  return {
    statusCode: 0,
    headers: {},
    body: null,
    writeHead(status, headers) { this.statusCode = status; this.headers = headers || {}; },
    end(data) { this.body = data; chunks.push(data); }
  };
}

function makeReq(method, headers, body) {
  return { method, headers, body: typeof body === 'string' ? body : JSON.stringify(body || {}) };
}

async function call(req) {
  const res = makeRes();
  await handler(req, res);
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null };
}

const FIXTURE_A = { birthDate: '1985-05-03', birthTime: '23:45', birthCity: 'Jakarta', latitude: -6.2088, longitude: 106.8456, timezone: 'Asia/Jakarta', asOfDate: '2026-08-02' };

console.log('API test: Fixture A');
const rA = await call(makeReq('POST', { 'content-type': 'application/json' }, FIXTURE_A));
assert.equal(rA.status, 200);
assert.equal(rA.body.ok, true);
assert.equal(rA.body.humanDesign.type, 'Manifesting Generator');
assert.equal(rA.body.humanDesign.profile, '6/3');
assert.equal(rA.body.humanDesign.authority, 'Sacral');
assert.equal(rA.body.vedic.rashi, 'Libra');
assert.equal(rA.body.vedic.nakshatra, 'Chitra');
assert.equal(rA.body.vedic.pada, 4);
assert.equal(rA.body.vedic.currentMahadasha.planet, 'Saturn');
console.log('  PASS');

console.log('API test: GET 405');
const rGet = await call(makeReq('GET', { 'content-type': 'application/json' }, {}));
assert.equal(rGet.status, 405);
assert.equal(rGet.body.code, 'METHOD_NOT_ALLOWED');
console.log('  PASS');

console.log('API test: wrong content-type 415');
const rCT = await call(makeReq('POST', { 'content-type': 'text/plain' }, '{}'));
assert.equal(rCT.status, 415);
assert.equal(rCT.body.code, 'UNSUPPORTED_CONTENT_TYPE');
console.log('  PASS');

console.log('API test: missing birthTime 400');
const rBT = await call(makeReq('POST', { 'content-type': 'application/json' }, { birthDate: '2000-01-01', timezone: 'Asia/Jakarta' }));
assert.equal(rBT.status, 400);
assert.equal(rBT.body.code, 'BIRTH_TIME_REQUIRED');
console.log('  PASS');

console.log('API test: invalid timezone 400');
const rTZ = await call(makeReq('POST', { 'content-type': 'application/json' }, { ...FIXTURE_A, timezone: 'Asia/Invalid' }));
assert.equal(rTZ.status, 400);
assert.equal(rTZ.body.code, 'INVALID_TIMEZONE');
console.log('  PASS');

console.log('API test: invalid lat 400');
const rLat = await call(makeReq('POST', { 'content-type': 'application/json' }, { ...FIXTURE_A, latitude: 100 }));
assert.equal(rLat.status, 400);
assert.equal(rLat.body.code, 'INVALID_COORDINATES');
console.log('  PASS');

console.log('API test: invalid asOfDate 400');
const rAs = await call(makeReq('POST', { 'content-type': 'application/json' }, { ...FIXTURE_A, asOfDate: '2026-13-01' }));
assert.equal(rAs.status, 400);
assert.equal(rAs.body.code, 'INVALID_AS_OF_DATE');
console.log('  PASS');

console.log('API test: oversized payload 413');
const big = 'x'.repeat(40000);
const rBig = await call(makeReq('POST', { 'content-type': 'application/json', 'content-length': '40000' }, { data: big }));
assert.equal(rBig.status, 413);
assert.equal(rBig.body.code, 'PAYLOAD_TOO_LARGE');
console.log('  PASS');

console.log('=== ALL API TESTS PASSED ===');
