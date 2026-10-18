import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getAllProvinces,
  getAllLocations,
  getMetadata,
  searchLocations,
  resolveLocationByName,
  normalizeQuery,
  expandQueryVariations
} from '../lib/locations/location-service.mjs';
import { localDateTimeToUtc, isValidIanaTimeZone } from '../lib/timezone.mjs';
import { calculateNatalChart } from '../lib/natal-chart/calculate.mjs';

test('Location Database: Metadata and official version standards', () => {
  const metadata = getMetadata();
  assert.ok(metadata, 'Metadata must exist');
  assert.equal(metadata.totalProvinces, 38, 'Must have exactly 38 provinces');
  assert.equal(metadata.totalRegencies, 514, 'Must have exactly 514 regencies/cities');
  assert.ok(metadata.totalLocations >= 535, 'Must contain regencies plus major administrative centers');
  assert.ok(metadata.referenceSource.includes('Kemendagri'), 'Reference must be Kemendagri Master Wilayah');
});

test('Location Database: All 38 Indonesian provinces integrity', () => {
  const provinces = getAllProvinces();
  assert.equal(provinces.length, 38, 'Must contain 38 provinces');

  const validTimezones = new Set(['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura']);
  const codes = new Set();

  for (const prov of provinces) {
    assert.ok(prov.code, `Province ${prov.name} must have a code`);
    assert.ok(!codes.has(prov.code), `Duplicate province code: ${prov.code}`);
    codes.add(prov.code);

    assert.ok(prov.name, 'Province must have a name');
    assert.ok(validTimezones.has(prov.timezone), `Province ${prov.name} has invalid timezone: ${prov.timezone}`);
    assert.ok(isValidIanaTimeZone(prov.timezone), `Province ${prov.name} timezone must be valid IANA identifier`);

    // Coordinate bounds check
    assert.ok(prov.latitude >= -11.5 && prov.latitude <= 6.5, `Province ${prov.name} lat ${prov.latitude} out of bounds`);
    assert.ok(prov.longitude >= 94.5 && prov.longitude <= 141.5, `Province ${prov.name} lon ${prov.longitude} out of bounds`);
  }
});

test('Location Database: All 514 kabupaten/kota integrity and mapping', () => {
  const locations = getAllLocations();
  const provinces = getAllProvinces();
  const provMap = new Map(provinces.map(p => [p.code, p]));

  const regencies = locations.filter(l => l.adminLevel === 'regency' || l.adminLevel === 'city');
  assert.equal(regencies.length, 514, 'Must have exactly 514 official kabupaten and kota');

  const idSet = new Set();

  for (const loc of locations) {
    assert.ok(loc.id, 'Location must have ID');
    assert.ok(!idSet.has(loc.id), `Duplicate location ID: ${loc.id}`);
    idSet.add(loc.id);

    assert.ok(loc.name, `Location ${loc.id} must have a name`);
    assert.ok(loc.displayName, `Location ${loc.id} must have a displayName`);
    assert.ok(provMap.has(loc.provinceCode), `Location ${loc.name} has invalid provinceCode: ${loc.provinceCode}`);

    const prov = provMap.get(loc.provinceCode);
    assert.equal(loc.provinceName, prov.name, `Location ${loc.name} provinceName mismatch`);
    assert.equal(loc.timezone, prov.timezone, `Location ${loc.name} timezone mismatch with province`);

    // Coordinate bounds check
    assert.ok(
      loc.latitude >= -11.5 && loc.latitude <= 6.5,
      `Location ${loc.name} latitude ${loc.latitude} out of bounds`
    );
    assert.ok(
      loc.longitude >= 94.5 && loc.longitude <= 141.5,
      `Location ${loc.name} longitude ${loc.longitude} out of bounds`
    );
    assert.ok(loc.formattedCity, `Location ${loc.name} must have formattedCity`);
  }
});

test('Location Database: Mandatory regression case - Banyumas -> Jawa Tengah (NOT Jawa Timur)', () => {
  const results = searchLocations('Banyumas');
  assert.ok(results.length > 0, 'Banyumas must return results');
  const top = results[0];

  assert.equal(top.provinceName, 'Jawa Tengah', 'Banyumas must be in Jawa Tengah');
  assert.notEqual(top.provinceName, 'Jawa Timur', 'Banyumas must NEVER be in Jawa Timur');
  assert.equal(top.regencyName, 'Kabupaten Banyumas');
  assert.equal(top.timezone, 'Asia/Jakarta');
});

test('Location Database: Mandatory regression case - Purwokerto -> Kabupaten Banyumas, Jawa Tengah', () => {
  const results = searchLocations('Purwokerto');
  assert.ok(results.length > 0, 'Purwokerto must return results');
  const top = results[0];

  assert.equal(top.name, 'Purwokerto');
  assert.equal(top.regencyName, 'Kabupaten Banyumas');
  assert.equal(top.provinceName, 'Jawa Tengah');
  assert.equal(top.timezone, 'Asia/Jakarta');
});

test('Location Database: Mandatory regression cases - Bangka Belitung birthplaces', () => {
  const cases = [
    { query: 'Pangkalpinang', expectedRegency: 'Kota Pangkalpinang', expectedProv: 'Kepulauan Bangka Belitung' },
    { query: 'Sungailiat', expectedRegency: 'Kabupaten Bangka', expectedProv: 'Kepulauan Bangka Belitung' },
    { query: 'Koba', expectedRegency: 'Kabupaten Bangka Tengah', expectedProv: 'Kepulauan Bangka Belitung' },
    { query: 'Toboali', expectedRegency: 'Kabupaten Bangka Selatan', expectedProv: 'Kepulauan Bangka Belitung' },
    { query: 'Mentok', expectedRegency: 'Kabupaten Bangka Barat', expectedProv: 'Kepulauan Bangka Belitung' },
    { query: 'Muntok', expectedRegency: 'Kabupaten Bangka Barat', expectedProv: 'Kepulauan Bangka Belitung' },
    { query: 'Tanjung Pandan', expectedRegency: 'Kabupaten Belitung', expectedProv: 'Kepulauan Bangka Belitung' },
    { query: 'Tanjungpandan', expectedRegency: 'Kabupaten Belitung', expectedProv: 'Kepulauan Bangka Belitung' },
    { query: 'Manggar', expectedRegency: 'Kabupaten Belitung Timur', expectedProv: 'Kepulauan Bangka Belitung' },
  ];

  for (const { query, expectedRegency, expectedProv } of cases) {
    const results = searchLocations(query);
    assert.ok(results.length > 0, `Query "${query}" must return results`);
    const top = results[0];
    assert.equal(top.provinceName, expectedProv, `Query "${query}" province must be ${expectedProv}`);
    assert.equal(top.regencyName, expectedRegency, `Query "${query}" regency must be ${expectedRegency}`);
    assert.equal(top.timezone, 'Asia/Jakarta', `Query "${query}" timezone must be Asia/Jakarta`);
  }
});

test('Location Database: Mandatory regression cases - Cilacap, Tasikmalaya, Jakarta Timur', () => {
  const cilacap = searchLocations('Cilacap')[0];
  assert.ok(cilacap);
  assert.equal(cilacap.provinceName, 'Jawa Tengah');

  const tasikmalaya = searchLocations('Tasikmalaya')[0];
  assert.ok(tasikmalaya);
  assert.equal(tasikmalaya.provinceName, 'Jawa Barat');

  const jaktim = searchLocations('Jakarta Timur')[0];
  assert.ok(jaktim);
  assert.equal(jaktim.provinceName, 'DKI Jakarta');
});

test('Location Database: Search normalization, case insensitivity, and aliases', () => {
  // Case insensitivity
  const mixedCase = searchLocations('bAnYuMaS')[0];
  assert.equal(mixedCase.name, 'Kabupaten Banyumas');

  // Strip prefix 'Kabupaten'
  const strippedKab = searchLocations('Kabupaten Banyumas')[0];
  assert.equal(strippedKab.name, 'Kabupaten Banyumas');

  // Prefix matching
  const prefixMatch = searchLocations('Sungaili')[0];
  assert.equal(prefixMatch.name, 'Sungailiat');

  // Spelling alias (Jogja -> Yogyakarta)
  const jogja = searchLocations('Jogja')[0];
  assert.ok(jogja.displayName.includes('Yogyakarta'));

  // Spelling alias (Solo -> Surakarta)
  const solo = searchLocations('Solo')[0];
  assert.ok(solo.displayName.includes('Surakarta'));

  // Non-existent location returns empty array, never silent fallback
  const nonExistent = searchLocations('Atlantis Underwater City');
  assert.deepEqual(nonExistent, [], 'Non-existent location must return empty array');
});

test('Location Database: Disambiguation between Kota and Kabupaten of same name', () => {
  const pairs = [
    { kota: 'Kota Bandung', kab: 'Kabupaten Bandung' },
    { kota: 'Kota Bekasi', kab: 'Kabupaten Bekasi' },
    { kota: 'Kota Bogor', kab: 'Kabupaten Bogor' },
    { kota: 'Kota Malang', kab: 'Kabupaten Malang' },
    { kota: 'Kota Cirebon', kab: 'Kabupaten Cirebon' },
    { kota: 'Kota Semarang', kab: 'Kabupaten Semarang' },
  ];

  for (const { kota, kab } of pairs) {
    const resKota = searchLocations(kota);
    const resKab = searchLocations(kab);

    assert.ok(resKota.length > 0, `Search for ${kota} must return results`);
    assert.ok(resKab.length > 0, `Search for ${kab} must return results`);

    assert.equal(resKota[0].name, kota);
    assert.equal(resKab[0].name, kab);
    assert.notEqual(resKota[0].id, resKab[0].id, `${kota} and ${kab} must have distinct IDs`);
  }
});

test('Location Database: Payload resolution and Blueprint Engine integration', () => {
  const loc = resolveLocationByName('Koba');
  assert.ok(loc, 'Koba must resolve');
  assert.equal(loc.name, 'Koba');
  assert.equal(loc.regencyName, 'Kabupaten Bangka Tengah');
  assert.equal(loc.provinceName, 'Kepulauan Bangka Belitung');
  assert.equal(loc.timezone, 'Asia/Jakarta');
  assert.equal(typeof loc.latitude, 'number');
  assert.equal(typeof loc.longitude, 'number');

  // Resolve with non-existent name returns null
  assert.equal(resolveLocationByName('Invalid City 999'), null);
});

test('Location Database: Historical date timezone conversion (localDateTimeToUtc)', () => {
  // Test Asia/Jakarta (WIB: UTC+7)
  const wib = localDateTimeToUtc({
    birthDate: '1985-05-03',
    birthTime: '23:45',
    timezone: 'Asia/Jakarta'
  });
  assert.equal(wib.ok, true);
  assert.equal(wib.offset, '+07:00');
  assert.equal(wib.utc.toISOString(), '1985-05-03T16:45:00.000Z');

  // Test Asia/Makassar (WITA: UTC+8)
  const wita = localDateTimeToUtc({
    birthDate: '1990-08-17',
    birthTime: '10:00',
    timezone: 'Asia/Makassar'
  });
  assert.equal(wita.ok, true);
  assert.equal(wita.offset, '+08:00');
  assert.equal(wita.utc.toISOString(), '1990-08-17T02:00:00.000Z');

  // Test Asia/Jayapura (WIT: UTC+9)
  const wit = localDateTimeToUtc({
    birthDate: '2000-01-01',
    birthTime: '06:00',
    timezone: 'Asia/Jayapura'
  });
  assert.equal(wit.ok, true);
  assert.equal(wit.offset, '+09:00');
  assert.equal(wit.utc.toISOString(), '1999-12-31T21:00:00.000Z');
});

test('Location Database: Natal chart engine accepts canonical IANA timezone and executes accurately', () => {
  const chart = calculateNatalChart({
    fullName: 'Test User',
    birthDate: '1995-10-25',
    birthTime: '14:30',
    birthCity: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah',
    latitude: -7.4243,
    longitude: 109.2303,
    timezone: 'Asia/Jakarta'
  });

  assert.equal(chart.calculationStatus, 'completed');
  assert.equal(chart.sunSign, 'Scorpio');
  assert.ok(chart.planets && chart.planets.Sun);
  assert.ok(typeof chart.ascendantLongitude === 'number');
});
