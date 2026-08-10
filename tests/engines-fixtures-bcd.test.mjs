import { strict as assert } from 'node:assert';
import { calculateHumanDesign } from '../lib/human-design/calculate.mjs';
import { calculateVedic } from '../lib/vedic/calculate.mjs';
import { localDateTimeToUtc } from '../lib/timezone.mjs';

const fixtures = [
  {
    name: 'Fixture B',
    input: { birthDate: '2000-02-29', birthTime: '00:00', timezone: 'Asia/Jakarta', latitude: -6.9175, longitude: 107.6191, asOfDate: '2026-08-02' },
    expected: {
      hd: { type: 'Generator', profile: '4/1' },
      vedic: { rashi: 'Sagittarius', nakshatra: 'Mula', pada: 1, mahadasha: 'Sun' }
    }
  },
  {
    name: 'Fixture C',
    input: { birthDate: '1990-12-25', birthTime: '15:30', timezone: 'Asia/Tokyo', latitude: 35.6762, longitude: 139.6503, asOfDate: '2026-08-02' },
    expected: {
      hd: { type: 'Projector', profile: '6/2' },
      vedic: { rashi: 'Pisces', nakshatra: 'Uttara Bhadrapada', pada: 3, mahadasha: 'Venus' }
    }
  },
  {
    name: 'Fixture D (DST Spring)',
    input: { birthDate: '1995-03-26', birthTime: '03:30', timezone: 'Europe/London', latitude: 51.5074, longitude: -0.1278, asOfDate: '2026-08-02' },
    expected: {
      hd: { type: 'Projector', profile: '2/4' },
      vedic: { rashi: 'Capricorn', nakshatra: 'Shravana', pada: 1, mahadasha: 'Rahu' }
    }
  }
];

for (const fixture of fixtures) {
  console.log(`Running ${fixture.name}`);
  const utc = localDateTimeToUtc({ birthDate: fixture.input.birthDate, birthTime: fixture.input.birthTime, timezone: fixture.input.timezone });
  assert.equal(utc.ok, true, `UTC conversion failed for ${fixture.name}`);

  const hd = calculateHumanDesign({ birthDate: fixture.input.birthDate, birthTime: fixture.input.birthTime, timezone: utc.offset });
  assert.equal(hd.type, fixture.expected.hd.type, `${fixture.name}: HD type mismatch`);
  assert.equal(hd.profile, fixture.expected.hd.profile, `${fixture.name}: HD profile mismatch`);

  const vedic = calculateVedic({ birthUtc: utc.utc, asOfDate: new Date(`${fixture.input.asOfDate}T00:00:00Z`) });
  assert.equal(vedic.ok, true, `${fixture.name}: Vedic calc failed`);
  assert.equal(vedic.rashi, fixture.expected.vedic.rashi, `${fixture.name}: Rashi mismatch`);
  assert.equal(vedic.nakshatra, fixture.expected.vedic.nakshatra, `${fixture.name}: Nakshatra mismatch`);
  assert.equal(vedic.pada, fixture.expected.vedic.pada, `${fixture.name}: Pada mismatch`);
  assert.equal(vedic.currentMahadasha.planet, fixture.expected.vedic.mahadasha, `${fixture.name}: Mahadasha mismatch`);
}

console.log('=== FIXTURES B-D PASSED ===');