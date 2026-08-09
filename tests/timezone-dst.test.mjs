import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { localDateTimeToUtc } from '../lib/timezone.mjs';

test('London normal datetime', () => {
  const r = localDateTimeToUtc({ birthDate: '2026-01-15', birthTime: '12:00', timezone: 'Europe/London' });
  assert.equal(r.ok, true);
  assert.equal(r.offset, '+00:00');
});

test('London spring-forward nonexistent time (2026-03-29 01:30)', () => {
  const r = localDateTimeToUtc({ birthDate: '2026-03-29', birthTime: '01:30', timezone: 'Europe/London' });
  console.log('spring-forward result:', JSON.stringify(r));
});

test('London fall-back ambiguous time (2026-10-25 01:30)', () => {
  const r = localDateTimeToUtc({ birthDate: '2026-10-25', birthTime: '01:30', timezone: 'Europe/London' });
  console.log('fall-back result:', JSON.stringify(r));
});