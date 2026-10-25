import { strict as assert } from 'node:assert';
import blueprintEnginesHandler from '../api/blueprint-engines.mjs';
import { calculateCurrentSky, findCurrentRetrogradeWindow, getPlanetarySpeed } from '../lib/sky-transit/ephemeris.mjs';
import { calculatePersonalTransits, getBhavaDistance } from '../lib/sky-transit/personal-transit.mjs';
import { composeHumanizedReading } from '../lib/narrative/humanized-composer.mjs';
import { handleSkyTransit } from '../lib/sky-transit/service.mjs';

function makeRes() {
  return {
    statusCode: 0,
    headers: {},
    body: null,
    writeHead(status, headers) { this.statusCode = status; this.headers = headers || {}; },
    end(data) { this.body = data; }
  };
}

function makeReq(method, headers, body, url = '/api/blueprint-engines?mode=sky') {
  return { method, headers, url, body: typeof body === 'string' ? body : JSON.stringify(body || {}) };
}

async function call(req) {
  const res = makeRes();
  await blueprintEnginesHandler(req, res);
  return { status: res.statusCode, body: res.body ? JSON.parse(res.body) : null };
}

console.log('--- 1. Ephemeris & Live Calculation Tests ---');
const testDate = new Date('2026-10-25T12:00:00Z');
const sky = calculateCurrentSky(testDate);

assert.equal(sky.zodiacSystem, 'sidereal');
assert.equal(sky.ayanamsa.system, 'Lahiri Chitrapaksha');
assert.ok(sky.moon.siderealLongitude >= 0 && sky.moon.siderealLongitude < 360);
assert.ok(sky.sun.siderealLongitude >= 0 && sky.sun.siderealLongitude < 360);
assert.equal(sky.moon.rashi.name, 'Meena (Pisces)');
assert.equal(sky.moon.nakshatra.name, 'Revati');

// Check Retrogrades on 25 Oct 2026
const mercury = sky.planets.find((p) => p.name === 'Mercury');
const venus = sky.planets.find((p) => p.name === 'Venus');
const saturn = sky.planets.find((p) => p.name === 'Saturn');
const mars = sky.planets.find((p) => p.name === 'Mars');

assert.equal(mercury.motion, 'retrograde', 'Mercury must be retrograde on Oct 25, 2026');
assert.equal(venus.motion, 'retrograde', 'Venus must be retrograde on Oct 25, 2026');
assert.equal(saturn.motion, 'retrograde', 'Saturn must be retrograde on Oct 25, 2026');
assert.equal(mars.motion, 'direct', 'Mars must be direct on Oct 25, 2026');

// Station dates validation
assert.ok(mercury.retrogradeWindow?.startDate);
assert.ok(mercury.retrogradeWindow?.endDate);
console.log('  Ephemeris calculations: PASS');

console.log('--- 2. Vedic Bhava & Gochara Distance Tests ---');
assert.equal(getBhavaDistance(6, 6), 1, 'Same sign should be 1st house');
assert.equal(getBhavaDistance(6, 7), 2, 'Next sign should be 2nd house');
assert.equal(getBhavaDistance(6, 5), 12, 'Previous sign should be 12th house');
assert.equal(getBhavaDistance(6, 11), 6, 'Pisces from Libra should be 6th house');
console.log('  Vedic Bhava Distance: PASS');

console.log('--- 3. Personal Transit Engine Tests ---');
const natalMoon = {
  siderealLongitude: 185.5,
  rashi: { index: 6, name: 'Tula (Libra)', short: 'Libra' },
  nakshatra: { index: 13, name: 'Chitra', lord: 'Mars', pada: 4 }
};
const natalSun = {
  siderealLongitude: 45.0,
  rashi: { index: 1, name: 'Vrishabha (Taurus)', short: 'Taurus' },
  nakshatra: { index: 3, name: 'Rohini', lord: 'Moon', pada: 2 }
};

const transits = calculatePersonalTransits(sky, { natalMoon, natalSun, isPartial: false });
assert.ok(transits.totalTransitsCalculated > 0);
assert.ok(transits.primaryTransits.length <= 3);
assert.ok(transits.primaryTransits.length > 0);
console.log('  Personal Transits: PASS');

console.log('--- 4. Humanized Narrative Composer Tests ---');
const narrative = composeHumanizedReading({
  nickname: 'Tara',
  lifePath: 7,
  arcanaName: 'The Hermit',
  sunSign: 'Taurus',
  weton: 'Sabtu Pahing',
  baziElement: 'Kayu',
  humanDesign: { type: 'Projector', profile: '2/4', authority: 'Splenic' },
  vedic: { nakshatra: 'Chitra', rashi: 'Libra' },
  currentSky: sky,
  personalTransits: transits,
  isPartial: false
});

// Check personalization & tone
assert.ok(narrative.sections.greeting.title.includes('Tara'));
assert.ok(narrative.sections.patterns.paragraphs.length >= 2);
assert.ok(narrative.sections.dailyLife.items.length === 3);
assert.ok(narrative.sections.currentSky.transits.length > 0);
assert.ok(narrative.sections.closing.text.length > 20);

// Validate 6 Core Categories & Paragraph Depth Requirements
assert.ok(narrative.categories.secaraUmum);
assert.ok(narrative.categories.secaraUmum.paragraphs.length >= 3 && narrative.categories.secaraUmum.paragraphs.length <= 4, 'Secara Umum must have 3-4 paragraphs');
assert.ok(narrative.categories.ekonomiKarier);
assert.ok(narrative.categories.ekonomiKarier.paragraphs.length >= 3 && narrative.categories.ekonomiKarier.paragraphs.length <= 4, 'Ekonomi & Karier must have 3-4 paragraphs');
assert.ok(narrative.categories.asmara);
assert.ok(narrative.categories.asmara.single.length >= 2 && narrative.categories.asmara.single.length <= 3, 'Asmara Single must have 2-3 paragraphs');
assert.ok(narrative.categories.asmara.couple.length >= 2 && narrative.categories.asmara.couple.length <= 3, 'Asmara Pasangan must have 2-3 paragraphs');
assert.ok(narrative.categories.kesehatan);
assert.ok(narrative.categories.kesehatan.paragraphs.length >= 2 && narrative.categories.kesehatan.paragraphs.length <= 3, 'Kesehatan must have 2-3 paragraphs');
assert.ok(narrative.categories.spiritual);
assert.ok(narrative.categories.spiritual.paragraphs.length >= 3 && narrative.categories.spiritual.paragraphs.length <= 4, 'Spiritual must have 3-4 paragraphs');
assert.ok(narrative.categories.tantangan);
assert.ok(narrative.categories.tantangan.paragraphs.length >= 3 && narrative.categories.tantangan.paragraphs.length <= 4, 'Tantangan must have 3-4 paragraphs');

// Check absence of forbidden AI clichés
const fullText = JSON.stringify(narrative).toLowerCase();
const forbiddenClichés = [
  'dalam perjalanan kehidupanmu',
  'energi semesta mengajakmu',
  'ini bukan sekadar',
  'membuka potensi optimal',
  'portal kosmik',
  'pintu gerbang spiritual'
];
for (const cliché of forbiddenClichés) {
  assert.ok(!fullText.includes(cliché), `Found forbidden cliché: "${cliché}"`);
}
console.log('  Humanized Narrative Composer: PASS');

console.log('--- 5. API /api/sky-transit Integration Tests ---');
// GET current sky
const rGet = await call(makeReq('GET', {}, {}));
assert.equal(rGet.status, 200);
assert.equal(rGet.body.ok, true);
assert.equal(rGet.body.zodiac_system, 'sidereal');
assert.ok(rGet.body.current_sky.moon);
console.log('  GET /api/sky-transit: PASS');

// POST with partial data (birthDate only)
const rPartial = await call(makeReq('POST', { 'content-type': 'application/json' }, {
  birthDate: '1995-10-15',
  nickname: 'Budi',
  lifePath: 4,
  arcanaName: 'The Emperor'
}));
assert.equal(rPartial.status, 200);
assert.equal(rPartial.body.ok, true);
assert.equal(rPartial.body.natal_data_completeness, 'partial');
assert.ok(rPartial.body.personal_transits.length > 0);
assert.ok(rPartial.body.narrative.currentSky.precisionNote.includes('jam atau kota lahir tidak dicantumkan'));
console.log('  POST /api/sky-transit (partial): PASS');

// POST with full birth data
const rFull = await call(makeReq('POST', { 'content-type': 'application/json' }, {
  birthDate: '1985-05-03',
  birthTime: '23:45',
  latitude: -6.2088,
  longitude: 106.8456,
  timezone: 'Asia/Jakarta',
  nickname: 'Widhi',
  lifePath: 9,
  arcanaName: 'The Hermit',
  weton: 'Sabtu Legi',
  asOfDate: '2026-10-25'
}));
assert.equal(rFull.status, 200);
assert.equal(rFull.body.ok, true);
assert.equal(rFull.body.natal_data_completeness, 'full');
assert.ok(rFull.body.personal_transits.length > 0);
console.log('  POST /api/sky-transit (full): PASS');

console.log('=== ALL SKY-TRANSIT TESTS PASSED ===');
