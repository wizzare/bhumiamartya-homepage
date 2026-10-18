import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load canonical database
const dbPath = path.join(__dirname, 'indonesia-locations.json');
let database = null;

function getDatabase() {
  if (!database) {
    const raw = fs.readFileSync(dbPath, 'utf8');
    database = JSON.parse(raw);
  }
  return database;
}

/**
 * Normalize string for search: lowercase, remove accents, strip punctuation.
 */
export function normalizeQuery(query) {
  if (!query || typeof query !== 'string') return '';
  return query
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Standardize search query and expand common Indonesian location aliases
 */
export function expandQueryVariations(rawQuery) {
  const normalized = normalizeQuery(rawQuery);
  if (!normalized) return [];

  const variations = new Set([normalized]);

  // Strip common administrative prefixes
  const stripped = normalized
    .replace(/^(kabupaten|kab|kota|adm|administrasi|kecamatan|kec)\s+/i, '')
    .trim();
  if (stripped && stripped !== normalized) {
    variations.add(stripped);
  }

  // Handle common spelling variations
  if (normalized.includes('tanjung pandan')) {
    variations.add(normalized.replace(/tanjung pandan/g, 'tanjungpandan'));
  }
  if (normalized.includes('tanjungpandan')) {
    variations.add(normalized.replace(/tanjungpandan/g, 'tanjung pandan'));
  }
  if (normalized.includes('mentok')) {
    variations.add(normalized.replace(/mentok/g, 'muntok'));
  }
  if (normalized.includes('muntok')) {
    variations.add(normalized.replace(/muntok/g, 'mentok'));
  }
  if (normalized.includes('pangkal pinang')) {
    variations.add(normalized.replace(/pangkal pinang/g, 'pangkalpinang'));
  }
  if (normalized.includes('pangkalpinang')) {
    variations.add(normalized.replace(/pangkalpinang/g, 'pangkal pinang'));
  }
  if (normalized.includes('sungai liat')) {
    variations.add(normalized.replace(/sungai liat/g, 'sungailiat'));
  }
  if (normalized.includes('sungailiat')) {
    variations.add(normalized.replace(/sungailiat/g, 'sungai liat'));
  }
  if (normalized.includes('solo')) {
    variations.add(normalized.replace(/solo/g, 'surakarta'));
  }
  if (normalized.includes('jogja') || normalized.includes('yogya')) {
    variations.add(normalized.replace(/jogja|yogya/g, 'yogyakarta'));
  }
  if (normalized.includes('ujung pandang') || normalized.includes('ujungpandang')) {
    variations.add(normalized.replace(/ujung\s*pandang/g, 'makassar'));
  }

  return [...variations];
}

/**
 * Score and rank candidate matches
 */
function scoreLocation(loc, searchTokens, queryStr) {
  const normName = normalizeQuery(loc.name);
  const normDisplayName = normalizeQuery(loc.displayName);
  const normFormatted = normalizeQuery(loc.formattedCity || '');
  const aliasesNorm = (loc.aliases || []).map(normalizeQuery);

  // Exact match on location name or direct alias gets top score
  if (normName === queryStr) return 1000;
  if (aliasesNorm.some(a => a === queryStr)) return 950;

  // Name without prefix exact match (e.g. query "Banyumas" matching "Kabupaten Banyumas")
  const baseName = normName.replace(/^(kabupaten|kota|administrasi)\s+/i, '').trim();
  if (baseName === queryStr) return 900;

  // Prefix match on name or baseName
  if (baseName.startsWith(queryStr)) return 800 - (baseName.length - queryStr.length);
  if (normName.startsWith(queryStr)) return 750 - (normName.length - queryStr.length);

  // Prefix match on any alias
  for (const alias of aliasesNorm) {
    if (alias.startsWith(queryStr)) {
      return 700 - (alias.length - queryStr.length);
    }
  }

  // Check if all tokens match anywhere in display name, aliases, or formatted city
  const allTokensMatch = searchTokens.every(token =>
    normDisplayName.includes(token) ||
    normFormatted.includes(token) ||
    aliasesNorm.some(a => a.includes(token))
  );

  if (allTokensMatch) {
    let score = 500;
    // Boost if token matches the start of a word in displayName
    const words = normDisplayName.split(/\s+/);
    for (const token of searchTokens) {
      if (words.some(w => w.startsWith(token))) score += 50;
    }
    // District / Regency hierarchy tiebreaker
    if (loc.adminLevel === 'city' || loc.adminLevel === 'regency') score += 20;
    return score;
  }

  return 0;
}

/**
 * Search Indonesian locations
 * @param {string} query - user input
 * @param {object} [options] - limit, filter
 * @returns {Array<CanonicalLocation>}
 */
export function searchLocations(query, options = {}) {
  const limit = options.limit || 8;
  const db = getDatabase();
  const variations = expandQueryVariations(query);
  if (variations.length === 0) return [];

  const mainQuery = variations[0];
  const tokens = mainQuery.split(/\s+/).filter(Boolean);

  const scoredResults = [];

  for (const loc of db.locations) {
    let bestScore = 0;
    for (const vQuery of variations) {
      const vTokens = vQuery.split(/\s+/).filter(Boolean);
      const score = scoreLocation(loc, vTokens, vQuery);
      if (score > bestScore) bestScore = score;
    }

    if (bestScore > 0) {
      scoredResults.push({ loc, score: bestScore });
    }
  }

  // Sort descending by score
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.slice(0, limit).map(r => r.loc);
}

/**
 * Resolve a location by exact or fallback name.
 * NEVER does silent incorrect fallback. Returns null if no match found.
 */
export function resolveLocationByName(name) {
  if (!name || typeof name !== 'string') return null;
  const results = searchLocations(name, { limit: 1 });
  return results.length > 0 ? results[0] : null;
}

/**
 * Get all 38 provinces
 */
export function getAllProvinces() {
  return getDatabase().provinces;
}

/**
 * Get all locations in database
 */
export function getAllLocations() {
  return getDatabase().locations;
}

/**
 * Get database metadata
 */
export function getMetadata() {
  return getDatabase().metadata;
}
