import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { resolveTimezoneFromCoordinates } from '../lib/timezone-resolver.mjs';

test('resolver: Jakarta', () => {
  const r = resolveTimezoneFromCoordinates(-6.2088, 106.8456);
  assert.equal(r.ok, true);
  assert.equal(r.timezone, 'Asia/Jakarta');
});

test('resolver: Tokyo', () => {
  const r = resolveTimezoneFromCoordinates(35.6762, 139.6503);
  assert.equal(r.ok, true);
  assert.equal(r.timezone, 'Asia/Tokyo');
});

test('resolver: London', () => {
  const r = resolveTimezoneFromCoordinates(51.5074, -0.1278);
  assert.equal(r.ok, true);
  assert.equal(r.timezone, 'Europe/London');
});

test('resolver: invalid latitude', () => {
  const r1 = resolveTimezoneFromCoordinates(-91, 0);
  const r2 = resolveTimezoneFromCoordinates(91, 0);
  assert.equal(r1.ok, false);
  assert.equal(r1.code, 'INVALID_COORDINATES');
  assert.equal(r2.ok, false);
  assert.equal(r2.code, 'INVALID_COORDINATES');
});

test('resolver: invalid longitude', () => {
  const r1 = resolveTimezoneFromCoordinates(0, -181);
  const r2 = resolveTimezoneFromCoordinates(0, 181);
  assert.equal(r1.ok, false);
  assert.equal(r1.code, 'INVALID_COORDINATES');
  assert.equal(r2.ok, false);
  assert.equal(r2.code, 'INVALID_COORDINATES');
});

test('resolver: boundary Niagara River (New York side)', () => {
  const r = resolveTimezoneFromCoordinates(43.09, -79.067);
  assert.equal(r.ok, true);
  assert.equal(r.timezone, 'America/New_York');
});
