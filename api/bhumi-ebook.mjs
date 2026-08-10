import { getPublishedEbookBySlug } from '../lib/content/firestore-reader.mjs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, status, body) {
  res.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export function createHandler({ reader = getPublishedEbookBySlug } = {}) {
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

    const slug = new URL(req.url, 'http://localhost').searchParams.get('slug') ?? '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 200) {
      json(res, 400, { ok: false, code: 'INVALID_SLUG', message: 'slug tidak valid.' });
      return;
    }

    if (!process.env.GCP_PROJECT_ID) {
      json(res, 503, { ok: false, code: 'EBOOK_SERVICE_UNAVAILABLE', message: 'Ebook belum dapat dimuat saat ini.' });
      return;
    }

    try {
      const ebook = await reader(slug);
      if (!ebook) {
        json(res, 404, { ok: false, code: 'EBOOK_NOT_FOUND', message: 'Ebook tidak ditemukan.' });
        return;
      }
      json(res, 200, { ok: true, ebook });
    } catch {
      json(res, 503, { ok: false, code: 'EBOOK_SERVICE_UNAVAILABLE', message: 'Ebook belum dapat dimuat saat ini.' });
    }
  };
}

export default createHandler();