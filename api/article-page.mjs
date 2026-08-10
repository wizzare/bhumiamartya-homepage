import { getPublishedArticleBySlug, isValidSlug } from '../lib/content/firestore-reader.mjs';
import { buildArticlePageHtml, buildNotFoundHtml } from '../lib/content/render-article.mjs';

export function createHandler({ reader = getPublishedArticleBySlug, notFound = buildNotFoundHtml } = {}) {
  return async function handler(req, res) {
    const slug = (req.query?.slug ?? new URL(req.url, 'http://localhost').searchParams.get('slug') ?? '').trim();
    if (!isValidSlug(slug) || !process.env.GCP_PROJECT_ID) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(notFound());
      return;
    }
    try {
      const article = await reader(slug);
      if (!article) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(notFound());
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(buildArticlePageHtml(article));
    } catch {
      res.writeHead(503, { 'Content-Type': 'text/plain' });
      res.end('Unavailable.');
    }
  };
}

export default createHandler();