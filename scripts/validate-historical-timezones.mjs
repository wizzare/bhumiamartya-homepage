import assert from 'node:assert/strict';
import { localDateTimeToUtc, isValidIanaTimeZone, offsetStringAt } from '../lib/timezone.mjs';

console.log('=== VALIDATING HISTORICAL TIMEZONES ACROSS INDONESIA ===');

const testCases = [
  // 1. Proklamasi Kemerdekaan: 17 Agustus 1945, 10:00 WIB
  {
    desc: 'Historical 1945: Jakarta (Proklamasi)',
    birthDate: '1945-08-17',
    birthTime: '10:00',
    timezone: 'Asia/Jakarta',
  },
  // 2. Pre-Keppres 41/1987 era: 1975 Bali (Denpasar)
  {
    desc: 'Historical 1975: Bali',
    birthDate: '1975-06-15',
    birthTime: '14:30',
    timezone: 'Asia/Makassar',
  },
  // 3. Golden fixture: Widhi 1985-05-03, 23:45 WIB
  {
    desc: 'Canonical 1985: Widhi (Jakarta)',
    birthDate: '1985-05-03',
    birthTime: '23:45',
    timezone: 'Asia/Jakarta',
    expectedOffset: '+07:00',
    expectedUtcIso: '1985-05-03T16:45:00.000Z',
  },
  // 4. Midnight rollover test: 00:15 WIB -> previous day in UTC
  {
    desc: 'Midnight rollover: 1990-01-01 00:15 WIB',
    birthDate: '1990-01-01',
    birthTime: '00:15',
    timezone: 'Asia/Jakarta',
    expectedOffset: '+07:00',
    expectedUtcIso: '1989-12-31T17:15:00.000Z',
  },
  // 5. Leap year: 2000-02-29 12:00 WITA
  {
    desc: 'Leap Year: 2000-02-29 12:00 WITA (Makassar)',
    birthDate: '2000-02-29',
    birthTime: '12:00',
    timezone: 'Asia/Makassar',
    expectedOffset: '+08:00',
    expectedUtcIso: '2000-02-29T04:00:00.000Z',
  },
  // 6. Eastern Indonesia: 2010-10-10 06:00 WIT (Jayapura)
  {
    desc: 'Eastern Indonesia: 2010-10-10 06:00 WIT (Jayapura)',
    birthDate: '2010-10-10',
    birthTime: '06:00',
    timezone: 'Asia/Jayapura',
    expectedOffset: '+09:00',
    expectedUtcIso: '2010-10-09T21:00:00.000Z',
  },
  // 7. Recent date: 2024-08-17 10:00 WIB (IKN / Nusantara)
  {
    desc: 'Modern Era: 2024-08-17 10:00 WITA (Kaltim/IKN)',
    birthDate: '2024-08-17',
    birthTime: '10:00',
    timezone: 'Asia/Makassar',
    expectedOffset: '+08:00',
    expectedUtcIso: '2024-08-17T02:00:00.000Z',
  },
];

for (const tc of testCases) {
  assert.ok(isValidIanaTimeZone(tc.timezone), `${tc.timezone} must be valid IANA timezone`);
  const res = localDateTimeToUtc({
    birthDate: tc.birthDate,
    birthTime: tc.birthTime,
    timezone: tc.timezone
  });

  assert.equal(res.ok, true, `Conversion must succeed for ${tc.desc}`);
  assert.ok(res.utc instanceof Date && !isNaN(res.utc.getTime()), `UTC date must be valid for ${tc.desc}`);
  assert.ok(res.offset && /^[-+]\d{2}:\d{2}$/.test(res.offset), `Offset format must be valid for ${tc.desc}`);

  if (tc.expectedOffset) {
    assert.equal(res.offset, tc.expectedOffset, `Offset mismatch for ${tc.desc}`);
  }
  if (tc.expectedUtcIso) {
    assert.equal(res.utc.toISOString(), tc.expectedUtcIso, `UTC instant mismatch for ${tc.desc}`);
  }

  console.log(`  [PASS] ${tc.desc} -> UTC: ${res.utc.toISOString()}, Offset: ${res.offset}`);
}

console.log('✅ ALL historical timezone conversion test cases PASSED successfully!');
