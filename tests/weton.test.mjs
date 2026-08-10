import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { hitungWeton } from '../weton/lib/weton.js';

test('Fixture A: 1985-05-03 23:45 => Sabtu Legi', () => {
  const r = hitungWeton('Test', '1985-05-03', '23:45');
  assert.equal(r.weton, 'Sabtu Legi');
  assert.equal(r.hariJawa, 'Sabtu');
  assert.equal(r.pasaran, 'Legi');
  assert.equal(r.totalNeptu, 14);
});

test('anchor: 1945-08-17 => Jumat Legi', () => {
  const r = hitungWeton('Test', '1945-08-17', '12:00');
  assert.equal(r.weton, 'Jumat Legi');
  assert.equal(r.pasaran, 'Legi');
});

test('2024-01-01 => Senin Pahing (wuku Wukir anchor)', () => {
  const r = hitungWeton('Test', '2024-01-01', '00:00');
  assert.equal(r.weton, 'Senin Pahing');
  assert.equal(r.wuku, 'Wukir');
});

test('1990-12-15 08:00 => Sabtu Pahing', () => {
  const r = hitungWeton('Test', '1990-12-15', '08:00');
  assert.equal(r.weton, 'Sabtu Pahing');
});

test('2000-02-29 12:00 => Selasa Kliwon (leap day)', () => {
  const r = hitungWeton('Test', '2000-02-29', '12:00');
  assert.equal(r.weton, 'Selasa Kliwon');
});

test('jam >= 18 shifts day: 1977-08-30 18:30 => Rabu Pon', () => {
  const r = hitungWeton('Test', '1977-08-30', '18:30');
  assert.equal(r.bergeserHari, true);
  assert.equal(r.weton, 'Rabu Pon');
});