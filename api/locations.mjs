import { searchLocations, getAllProvinces, getMetadata } from '../lib/locations/location-service.mjs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, body) {
  res.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    json(res, 405, { ok: false, message: 'Method not allowed.' });
    return;
  }

  try {
    const url = new URL(req.url, 'http://localhost');
    const query = url.searchParams.get('q') || '';
    const limit = Math.min(Number(url.searchParams.get('limit')) || 8, 50);
    const metaOnly = url.searchParams.get('meta') === 'true';
    const provOnly = url.searchParams.get('provinces') === 'true';

    if (metaOnly) {
      json(res, 200, { ok: true, metadata: getMetadata() });
      return;
    }

    if (provOnly) {
      json(res, 200, { ok: true, provinces: getAllProvinces() });
      return;
    }

    if (!query.trim()) {
      json(res, 200, { ok: true, locations: [], count: 0 });
      return;
    }

    const results = searchLocations(query, { limit });
    json(res, 200, {
      ok: true,
      query,
      count: results.length,
      locations: results
    });

  } catch (error) {
    console.error('[LOCATIONS API ERROR]:', error);
    json(res, 500, { ok: false, message: 'Failed to search locations.' });
  }
}
