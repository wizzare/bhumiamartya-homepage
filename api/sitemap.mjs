import { listPublishedArticles } from '../lib/content/firestore-reader.mjs';

const STATIC_URLS = [
  '/',
  '/tes-kenali-diri/',
  '/cek-aura/',
  '/weton/',
  '/kalkulator-cinta/',
  '/kenali-diri/human-design/',
  '/kenali-diri/mbti/',
  '/articles/',
  '/ngopi-ilmu/',
  '/ebooks/',
  '/about/',
  '/contact/',
  '/terms/',
  '/privacy-policy/',
  '/disclaimer/',
  '/methodology/'
];

const HOST = 'https://www.bhumiamartya.my.id';

function escapeXml(value) {
  return String(value ?? '').replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  }[c]));
}

function isoDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function buildSitemapXml({ articles = [], includeStatic = true } = {}) {
  const entries = [];
  const staticList = includeStatic ? STATIC_URLS : [];
  for (const path of staticList) {
    entries.push({ loc: `${HOST}${path}` });
  }
  for (const article of articles) {
    const loc = `${HOST}/articles/${encodeURIComponent(article.slug || article.id)}/`;
    const lastmod = isoDate(article.updatedAt) || isoDate(article.publishedAt) || null;
    entries.push(lastmod ? { loc, lastmod } : { loc });
  }
  const xml = entries
    .map(({ loc, lastmod }) => `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ''}</url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xml}\n</urlset>`;
}

export function createHandler({ reader = listPublishedArticles } = {}) {
  return async function handler(req, res) {
    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'text/plain' });
      res.end('Method not allowed.');
      return;
    }
    if (!process.env.GCP_PROJECT_ID) {
      res.writeHead(503, { 'Content-Type': 'text/plain' });
      res.end('Unavailable.');
      return;
    }
    try {
      const articles = await reader({ limit: 200 });
      const xml = buildSitemapXml({ articles });
      res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
      res.end(xml);
    } catch {
      res.writeHead(503, { 'Content-Type': 'text/plain' });
      res.end('Unavailable.');
    }
  };
}

export default createHandler();