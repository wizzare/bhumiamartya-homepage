import { strict as assert } from 'node:assert';
import { calculateHumanDesign } from '../lib/human-design/calculate.mjs';
import { calculateVedic } from '../lib/vedic/calculate.mjs';
import { localDateTimeToUtc } from '../lib/timezone.mjs';

// Fixture A: TEST WIDHI
const fixtureA = { birthDate: '1985-05-03', birthTime: '23:45', timezone: 'Asia/Jakarta', latitude: -6.2088, longitude: 106.8456, asOfDate: '2026-08-02' };

console.log('Fixture A: TEST WIDHI');
const utcA = localDateTimeToUtc({ birthDate: fixtureA.birthDate, birthTime: fixtureA.birthTime, timezone: fixtureA.timezone });
assert.equal(utcA.ok, true, 'UTC conversion failed for fixture A');
const hdA = calculateHumanDesign({ birthDate: fixtureA.birthDate, birthTime: fixtureA.birthTime, timezone: utcA.offset });
assert.equal(hdA.type, 'Manifesting Generator', `Expected Manifesting Generator, got ${hdA.type}`);
assert.equal(hdA.profile, '6/3', `Expected 6/3, got ${hdA.profile}`);
assert.equal(hdA.authority, 'Sacral', `Expected Sacral, got ${hdA.authority}`);
assert.equal(hdA.strategy, 'To Respond', `Expected To Respond, got ${hdA.strategy}`);
console.log('  Human Design: PASS');

const vedicA = calculateVedic({ birthUtc: utcA.utc, asOfDate: new Date(`${fixtureA.asOfDate}T00:00:00Z`) });
assert.equal(vedicA.ok, true);
assert.equal(vedicA.rashi, 'Libra', `Expected Libra, got ${vedicA.rashi}`);
assert.equal(vedicA.nakshatra, 'Chitra', `Expected Chitra, got ${vedicA.nakshatra}`);
assert.equal(vedicA.pada, 4, `Expected 4, got ${vedicA.pada}`);
assert.equal(vedicA.nakshatraLord, 'Mars', `Expected Mars, got ${vedicA.nakshatraLord}`);
assert.equal(vedicA.currentMahadasha.planet, 'Saturn', `Expected Saturn, got ${vedicA.currentMahadasha.planet}`);
assert.equal(vedicA.currentMahadasha.asOfDate, fixtureA.asOfDate);
console.log('  Vedic: PASS');

console.log('=== ALL FIXTURE A TESTS PASSED ===');