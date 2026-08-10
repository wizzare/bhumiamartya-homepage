import { getPublishedEbooks } from '../lib/content/firestore-reader.mjs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, body) {
  res.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function parseLimit(req) {
  const raw = new URL(req.url, 'http://localhost').searchParams.get('limit') ?? '12';
  if (!/^\d+$/.test(raw)) return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 20) return null;
  return value;
}

export function createHandler({ reader = getPublishedEbooks } = {}) {
  return async function handler(req, res) {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, CORS_HEADERS);
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      json(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' });
      return;
    }

    const limit = parseLimit(req);
    if (limit === null) {
      json(res, 400, { ok: false, code: 'INVALID_LIMIT', message: 'limit harus bilangan bulat antara 1 dan 20.' });
      return;
    }

    if (!process.env.GCP_PROJECT_ID) {
      json(res, 503, { ok: false, code: 'EBOOK_SERVICE_UNAVAILABLE', message: 'Ebook belum dapat dimuat saat ini.' });
      return;
    }

    try {
      const ebooks = await reader({ limit });
      json(res, 200, { ok: true, ebooks });
    } catch {
      json(res, 503, { ok: false, code: 'EBOOK_SERVICE_UNAVAILABLE', message: 'Ebook belum dapat dimuat saat ini.' });
    }
  };
}

export default createHandler();