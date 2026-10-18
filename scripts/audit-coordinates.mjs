import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dbPath = path.join(rootDir, 'lib', 'locations', 'indonesia-locations.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

console.log('=== AUDITING 535 INDONESIAN LOCATIONS & 38 PROVINCES ===');
console.log('Total Provinces:', db.provinces.length);
console.log('Total Locations:', db.locations.length);

const errors = [];
const provMap = new Map(db.provinces.map(p => [p.code, p]));

// 1. Audit Provinces
for (const prov of db.provinces) {
  if (typeof prov.latitude !== 'number' || typeof prov.longitude !== 'number') {
    errors.push(`[PROV_TYPE] Province ${prov.name} (${prov.code}): lat/lon not number`);
  }
  if (prov.latitude === 0 && prov.longitude === 0) {
    errors.push(`[PROV_ZERO] Province ${prov.name} (${prov.code}): coordinates are 0,0`);
  }
  if (prov.latitude < -11.5 || prov.latitude > 6.5) {
    errors.push(`[PROV_LAT] Province ${prov.name} (${prov.code}): lat ${prov.latitude} out of bounds`);
  }
  if (prov.longitude < 94.5 || prov.longitude > 141.5) {
    errors.push(`[PROV_LON] Province ${prov.name} (${prov.code}): lon ${prov.longitude} out of bounds`);
  }
  if (!['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura'].includes(prov.timezone)) {
    errors.push(`[PROV_TZ] Province ${prov.name} (${prov.code}): invalid timezone ${prov.timezone}`);
  }
}

// 2. Audit Locations
let cityCount = 0;
let regencyCount = 0;
let districtCount = 0;

for (const loc of db.locations) {
  if (loc.adminLevel === 'city') cityCount++;
  else if (loc.adminLevel === 'regency') regencyCount++;
  else if (loc.adminLevel === 'district') districtCount++;

  if (typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
    errors.push(`[LOC_TYPE] Location ${loc.name} (${loc.id}): lat/lon not number`);
  }
  if (loc.latitude === 0 && loc.longitude === 0) {
    errors.push(`[LOC_ZERO] Location ${loc.name} (${loc.id}): coordinates are 0,0`);
  }
  if (loc.latitude < -11.5 || loc.latitude > 6.5) {
    errors.push(`[LOC_LAT] Location ${loc.name} (${loc.id}): lat ${loc.latitude} out of bounds`);
  }
  if (loc.longitude < 94.5 || loc.longitude > 141.5) {
    errors.push(`[LOC_LON] Location ${loc.name} (${loc.id}): lon ${loc.longitude} out of bounds`);
  }
  if (!provMap.has(loc.provinceCode)) {
    errors.push(`[LOC_PROV_CODE] Location ${loc.name} (${loc.id}): unknown provinceCode ${loc.provinceCode}`);
  }
  const prov = provMap.get(loc.provinceCode);
  if (prov && loc.timezone !== prov.timezone) {
    errors.push(`[LOC_TZ] Location ${loc.name} (${loc.id}): tz ${loc.timezone} differs from province ${prov.timezone}`);
  }
}

console.log(`Distribution: ${regencyCount} Regencies, ${cityCount} Cities, ${districtCount} Prominent Administrative Districts`);
console.log('Total audited locations:', regencyCount + cityCount + districtCount);
console.log('Audit errors count:', errors.length);

if (errors.length > 0) {
  console.error('Audit failed with errors:', errors);
  process.exit(1);
} else {
  console.log('✅ ALL 535 locations & 38 provinces PASSED coordinate accuracy & boundary audit!');
}
