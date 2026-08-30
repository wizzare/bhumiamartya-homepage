import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { calculateHumanDesign } from '../lib/human-design/calculate.mjs';
import { normalizeHumanDesignResponse } from '../lib/human-design/normalizer.mjs';
import { localDateTimeToUtc } from '../lib/timezone.mjs';
import { resolveTimezoneFromCoordinates } from '../lib/timezone-resolver.mjs';

// =========================================================================
// PRODUCTION FIXTURES
// =========================================================================

const FIXTURES = {
  hira: {
    fullName: 'Hira Murty Wardhani',
    birthDate: '1979-02-23',
    birthTime: '21:00',
    birthCity: 'Bandung, Jawa Barat, Indonesia',
    latitude: -6.9175,
    longitude: 107.6191,
    timezone: 'Asia/Jakarta',
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Emotional',
      profile: '5/1',
      definition: 'Split Definition',
      incarnationCross: 'Left Angle Cross of Spirit (55/59 | 9/16)',
      definedCenters: ['Ajna', 'Head', 'Sacral', 'Solar Plexus'],
      openCenters: ['Ego', 'G', 'Root', 'Spleen', 'Throat'],
      channels: ['6-59', '47-64'],
      personalitySun: { gate: 55, line: 5 },
      personalityEarth: { gate: 59, line: 5 },
      designSun: { gate: 9, line: 1 },
      designEarth: { gate: 16, line: 1 }
    }
  },
  fitriani: {
    fullName: 'Fitriani Mahardika',
    birthDate: '1979-08-17',
    birthTime: '06:00',
    birthCity: 'Bandung, Jawa Barat, Indonesia',
    latitude: -6.9175,
    longitude: 107.6191,
    timezone: 'Asia/Jakarta',
    expected: {
      type: 'Generator',
      strategy: 'Wait to Respond',
      authority: 'Emotional',
      profile: '5/2',
      definition: 'Quadruple Split Definition',
      incarnationCross: 'Left Angle Cross of Revolution (4/49 | 8/14)',
      definedCenters: ['Ajna', 'Ego', 'G', 'Head', 'Root', 'Sacral', 'Solar Plexus', 'Throat'],
      openCenters: ['Spleen'],
      channels: ['1-8', '3-60', '4-63', '37-40'],
      personalitySun: { gate: 4, line: 5 },
      personalityEarth: { gate: 49, line: 5 },
      designSun: { gate: 8, line: 2 },
      designEarth: { gate: 14, line: 2 }
    }
  },
  widhi: {
    fullName: 'Widhi Wedhaswara',
    birthDate: '1985-05-03',
    birthTime: '23:45',
    birthCity: 'Jakarta, Indonesia',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
    expected: {
      type: 'Manifesting Generator',
      strategy: 'Wait to Respond',
      authority: 'Sacral',
      profile: '6/3',
      definition: 'Single Definition',
      incarnationCross: 'Left Angle Cross of Incarnation (24/44 | 13/7)',
      definedCenters: ['Ajna', 'Ego', 'G', 'Sacral', 'Spleen', 'Throat'],
      openCenters: ['Head', 'Root', 'Solar Plexus'],
      channels: ['2-14', '10-20', '17-62', '23-43', '25-51', '26-44'],
      personalitySun: { gate: 24, line: 6 },
      personalityEarth: { gate: 44, line: 6 },
      designSun: { gate: 13, line: 3 },
      designEarth: { gate: 7, line: 3 }
    }
  }
};

// =========================================================================
// 1. PRODUCTION FIXTURE REGRESSIONS
// =========================================================================

test('READING / PDF QA: Hira Murty Wardhani canonical HD synchronization', () => {
  const f = FIXTURES.hira;
  const tzRes = resolveTimezoneFromCoordinates(f.latitude, f.longitude);
  const utcRes = localDateTimeToUtc({ birthDate: f.birthDate, birthTime: f.birthTime, timezone: f.timezone || tzRes.timezone });
  assert.equal(utcRes.ok, true);

  const hd = calculateHumanDesign({ birthDate: f.birthDate, birthTime: f.birthTime, timezone: utcRes.offset });
  const norm = normalizeHumanDesignResponse(hd);

  // Exact HD properties
  assert.equal(norm.type, f.expected.type);
  assert.equal(norm.strategy, f.expected.strategy);
  assert.equal(norm.authority, f.expected.authority, 'Hira MUST have Emotional Authority because Solar Plexus is defined');
  assert.notEqual(norm.authority, 'Sacral', 'Hira MUST NOT have Sacral Authority');
  assert.equal(norm.profile, f.expected.profile);
  assert.equal(norm.definition, f.expected.definition);
  assert.equal(norm.incarnationCross, f.expected.incarnationCross);
  assert.ok(!norm.incarnationCross.includes('Sleeping Phoenix'), 'Hira MUST NOT have Sleeping Phoenix cross');

  // Defined & Open Centers (set equivalence)
  assert.deepEqual([...norm.definedCenters].sort(), [...f.expected.definedCenters].sort());
  assert.deepEqual([...norm.openCenters].sort(), [...f.expected.openCenters].sort());

  // Channels
  f.expected.channels.forEach(ch => {
    assert.ok(norm.channels.includes(ch), `Expected channel ${ch} to be active in Hira's chart`);
  });

  // Sun / Earth activations
  const pSun = norm.personalityActivations.find(a => a.planet === 'Sun');
  const pEarth = norm.personalityActivations.find(a => a.planet === 'Earth');
  const dSun = norm.designActivations.find(a => a.planet === 'Sun');
  const dEarth = norm.designActivations.find(a => a.planet === 'Earth');

  assert.equal(pSun.gate, f.expected.personalitySun.gate);
  assert.equal(pSun.line, f.expected.personalitySun.line);
  assert.equal(pEarth.gate, f.expected.personalityEarth.gate);
  assert.equal(pEarth.line, f.expected.personalityEarth.line);
  assert.equal(dSun.gate, f.expected.designSun.gate);
  assert.equal(dSun.line, f.expected.designSun.line);
  assert.equal(dEarth.gate, f.expected.designEarth.gate);
  assert.equal(dEarth.line, f.expected.designEarth.line);
});

test('READING / PDF QA: Fitriani Mahardika canonical HD synchronization', () => {
  const f = FIXTURES.fitriani;
  const tzRes = resolveTimezoneFromCoordinates(f.latitude, f.longitude);
  const utcRes = localDateTimeToUtc({ birthDate: f.birthDate, birthTime: f.birthTime, timezone: f.timezone || tzRes.timezone });
  assert.equal(utcRes.ok, true);

  const hd = calculateHumanDesign({ birthDate: f.birthDate, birthTime: f.birthTime, timezone: utcRes.offset });
  const norm = normalizeHumanDesignResponse(hd);

  assert.equal(norm.type, f.expected.type);
  assert.equal(norm.strategy, f.expected.strategy);
  assert.equal(norm.authority, f.expected.authority, 'Fitriani MUST have Emotional Authority');
  assert.notEqual(norm.authority, 'Sacral', 'Fitriani MUST NOT have Sacral Authority');
  assert.equal(norm.profile, f.expected.profile);
  assert.equal(norm.definition, f.expected.definition);
  assert.equal(norm.incarnationCross, f.expected.incarnationCross);

  assert.deepEqual([...norm.definedCenters].sort(), [...f.expected.definedCenters].sort());
  assert.deepEqual([...norm.openCenters].sort(), [...f.expected.openCenters].sort());

  f.expected.channels.forEach(ch => {
    assert.ok(norm.channels.includes(ch), `Expected channel ${ch} in Fitriani chart`);
  });
});

test('READING / PDF QA: Widhi Wedhaswara canonical HD synchronization', () => {
  const f = FIXTURES.widhi;
  const utcRes = localDateTimeToUtc({ birthDate: f.birthDate, birthTime: f.birthTime, timezone: f.timezone });
  assert.equal(utcRes.ok, true);

  const hd = calculateHumanDesign({ birthDate: f.birthDate, birthTime: f.birthTime, timezone: utcRes.offset });
  const norm = normalizeHumanDesignResponse(hd);

  assert.equal(norm.type, f.expected.type);
  assert.equal(norm.strategy, f.expected.strategy);
  assert.equal(norm.authority, f.expected.authority);
  assert.equal(norm.profile, f.expected.profile);
  assert.equal(norm.definition, f.expected.definition);
  assert.equal(norm.incarnationCross, f.expected.incarnationCross);

  assert.deepEqual([...norm.definedCenters].sort(), [...f.expected.definedCenters].sort());
  assert.deepEqual([...norm.openCenters].sort(), [...f.expected.openCenters].sort());
});

// =========================================================================
// 2. CANONICAL INVARIANT CHECKS
// =========================================================================

test('INVARIANT: Solar Plexus Defined => Emotional Authority ALWAYS', () => {
  const dates = [
    { birthDate: '1979-02-23', birthTime: '21:00', timezone: '+07:00' },
    { birthDate: '1979-08-17', birthTime: '06:00', timezone: '+07:00' },
    { birthDate: '1995-11-20', birthTime: '14:30', timezone: '+07:00' },
    { birthDate: '2001-04-12', birthTime: '09:15', timezone: '+07:00' }
  ];

  for (const d of dates) {
    const hd = calculateHumanDesign(d);
    if (hd.definedCenters.includes('Solar Plexus')) {
      assert.equal(hd.authority, 'Emotional', `Date ${d.birthDate} has Solar Plexus defined, authority MUST be Emotional`);
    }
  }
});

test('INVARIANT: Profile line matching (Personality Sun line / Design Sun line)', () => {
  for (const key of Object.keys(FIXTURES)) {
    const f = FIXTURES[key];
    const hd = calculateHumanDesign({ birthDate: f.birthDate, birthTime: f.birthTime, timezone: '+07:00' });
    const pSunLine = hd.personalityActivations.find(a => a.planet === 'Sun').line;
    const dSunLine = hd.designActivations.find(a => a.planet === 'Sun').line;
    assert.equal(hd.profile, `${pSunLine}/${dSunLine}`);
  }
});

// =========================================================================
// 3. READING / PDF TEXT SANITIZATION & NO LEAKAGE QA
// =========================================================================

test('PDF / READING TEXT QA: No null, undefined, NaN, or [object Object] in rendered reading fields', () => {
  for (const key of Object.keys(FIXTURES)) {
    const f = FIXTURES[key];
    const hd = calculateHumanDesign({ birthDate: f.birthDate, birthTime: f.birthTime, timezone: '+07:00' });
    const norm = normalizeHumanDesignResponse(hd);

    // Check all top-level string/numeric fields
    const criticalFields = [
      'type', 'strategy', 'signature', 'notSelfTheme', 'authority',
      'definition', 'profile', 'incarnationCross', 'digestion',
      'cognition', 'environment', 'motivation', 'perspective',
      'variable', 'variableShortCode'
    ];

    criticalFields.forEach(field => {
      const val = norm[field];
      assert.notEqual(val, undefined, `Field ${field} must not be undefined for ${f.fullName}`);
      assert.notEqual(val, null, `Field ${field} must not be null for ${f.fullName}`);
      assert.notEqual(String(val), '[object Object]', `Field ${field} must not be [object Object] for ${f.fullName}`);
      assert.notEqual(String(val), 'NaN', `Field ${field} must not be NaN for ${f.fullName}`);
      assert.notEqual(String(val), 'undefined', `Field ${field} must not be string "undefined" for ${f.fullName}`);
      assert.notEqual(String(val), 'null', `Field ${field} must not be string "null" for ${f.fullName}`);
    });

    // Check activations array
    assert.equal(norm.personalityActivations.length, 13);
    assert.equal(norm.designActivations.length, 13);

    [...norm.personalityActivations, ...norm.designActivations].forEach(act => {
      assert.ok(act.gate >= 1 && act.gate <= 64);
      assert.ok(act.line >= 1 && act.line <= 6);
      assert.notEqual(String(act.planet), 'undefined');
    });

    // Check center arrays
    assert.ok(norm.definedCenters.length > 0);
    assert.ok(norm.openCenters.length > 0);
    assert.equal(norm.definedCenters.length + norm.openCenters.length, 9);
  }
});
