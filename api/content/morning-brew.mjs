import crypto from 'crypto';
import { publishMorningBrewArticle } from '../../lib/content/firestore-writer.mjs';
import { slugify } from '../../lib/content/slug.mjs';

const HOST = 'https://www.bhumiamartya.my.id';
const MAX_TITLE_LENGTH = 300;
const MAX_CONTENT_LENGTH = 200000;

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function safeTimingEqual(received, expected) {
  const a = Buffer.from(String(received));
  const b = Buffer.from(String(expected));
  if (a.length !== b.length) {
    crypto.timingSafeEqual(b, b);
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function isAuthorized(req) {
  const secret = process.env.MORNING_BREW_PUBLISH_SECRET;
  if (!secret) return false;
  const header = req.headers?.authorization || req.headers?.Authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(String(header).trim());
  if (!match) return false;
  return safeTimingEqual(match[1], secret);
}

function parseBody(req) {
  try {
    return typeof req.body === 'object' && req.body !== null ? req.body : JSON.parse(req.body || '{}');
  } catch {
    return null;
  }
}

export function createHandler({ writer = publishMorningBrewArticle } = {}) {
  return async function handler(req, res) {
    if (req.method !== 'POST') {
      json(res, 405, { success: false, code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' });
      return;
    }

    if (!process.env.GCP_PROJECT_ID) {
      json(res, 503, { success: false, code: 'CONTENT_SERVICE_UNAVAILABLE', message: 'Layanan konten belum dikonfigurasi.' });
      return;
    }

    if (!process.env.MORNING_BREW_PUBLISH_SECRET) {
      json(res, 503, { success: false, code: 'PUBLISH_NOT_CONFIGURED', message: 'Publish secret belum dikonfigurasi.' });
      return;
    }

    if (!isAuthorized(req)) {
      json(res, 401, { success: false, code: 'UNAUTHORIZED', message: 'Unauthorized.' });
      return;
    }

    const body = parseBody(req);
    if (!body || typeof body !== 'object') {
      json(res, 400, { success: false, code: 'INVALID_BODY', message: 'Body tidak valid.' });
      return;
    }

    const { title, content, date, excerpt, source, coverImageUrl } = body;

    if (typeof title !== 'string' || !title.trim() || title.trim().length > MAX_TITLE_LENGTH) {
      json(res, 400, { success: false, code: 'INVALID_TITLE', message: 'title wajib diisi (maks 300 karakter).' });
      return;
    }
    if (typeof content !== 'string' || !content.trim() || content.length > MAX_CONTENT_LENGTH) {
      json(res, 400, { success: false, code: 'INVALID_CONTENT', message: 'content wajib diisi.' });
      return;
    }
    if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      json(res, 400, { success: false, code: 'INVALID_DATE', message: 'date wajib format YYYY-MM-DD.' });
      return;
    }

    if (body.dryRun === true) {
      json(res, 200, {
        success: true,
        status: 'dry_run',
        slug: slugify(title) || null,
        message: 'Payload valid dan secret terverifikasi. Tidak ada artikel yang dibuat.'
      });
      return;
    }

    try {
      const result = await writer({ title, content, date, excerpt, source, coverImageUrl });
      const status = result.status === 'already_published' ? 200 : 201;
      json(res, status, {
        success: true,
        status: result.status,
        slug: result.slug,
        url: `${HOST}/articles/${encodeURIComponent(result.slug)}/`
      });
    } catch (error) {
      const code = error && error.code;
      if (code === 'INVALID_DATE' || code === 'INVALID_TITLE' || code === 'INVALID_CONTENT') {
        json(res, 400, { success: false, code, message: 'Payload tidak valid.' });
        return;
      }
      console.error(`[morning-brew] publish failed: ${code || (error && error.message) || 'UNKNOWN'}`);
      json(res, 503, { success: false, code: 'PUBLISH_FAILED', message: 'Gagal mempublikasikan artikel saat ini.' });
    }
  };
}

export default createHandler();
