import { listPublishedArticles } from '../lib/content/firestore-reader.mjs';

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
  const search = new URL(req.url, 'http://localhost');
  const raw = search.searchParams.get('limit') ?? '6';
  if (!/^\d+$/.test(raw)) return null;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 12) return null;
  return value;
}

export function createHandler({ reader = listPublishedArticles } = {}) {
  return async function handler(req, res) {
    const requestId = Math.random().toString(36).slice(2, 10);
    const startedAt = Date.now();

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
      json(res, 400, { ok: false, code: 'INVALID_LIMIT', message: 'limit harus bilangan bulat antara 1 dan 12.' });
      return;
    }

    if (!process.env.GCP_PROJECT_ID) {
      json(res, 503, {
        ok: false,
        code: 'CONTENT_AUTH_UNAVAILABLE',
        message: 'Konten belum dapat dimuat saat ini.'
      });
      return;
    }

    try {
      const articles = await reader({ limit });
      json(res, 200, { ok: true, articles });
      console.log(`[bhumi-articles] requestId=${requestId} op=list durationMs=${Date.now() - startedAt} count=${articles.length}`);
    } catch (error) {
      console.log(`[bhumi-articles] requestId=${requestId} op=list durationMs=${Date.now() - startedAt} error=${error && error.code ? error.code : 'UNKNOWN'}`);
      json(res, 503, {
        ok: false,
        code: 'ARTICLE_SERVICE_UNAVAILABLE',
        message: 'Konten belum dapat dimuat saat ini.'
      });
    }
  };
}

export default createHandler();