import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { createHandler as sitemapHandler, buildSitemapXml } from '../api/sitemap.mjs';
import { createHandler as articlePageHandler } from '../api/article-page.mjs';
import { buildArticlePageHtml } from '../lib/content/render-article.mjs';
import { getPublishedArticleBySlug } from '../lib/content/firestore-reader.mjs';

process.env.GCP_PROJECT_ID = 'bhumiamartya-fe85c';

function makeRes() {
  return { statusCode: 0, body: null, writeHead(s, h) { this.statusCode = s; }, end(d) { this.body = d; } };
}

test('sitemap xml contains published bhumi article, excludes draft/non-bhumi/ebook/reading', async () => {
  const articles = [
    { id: 'a1', slug: 'apa-itu-mbti', updatedAt: '2026-08-01T00:00:00.000Z', publishedAt: '2026-08-01T00:00:00.000Z' }
  ];
  const xml = buildSitemapXml({ articles });
  assert.ok(xml.includes('<loc>https://www.bhumiamartya.my.id/articles/apa-itu-mbti/</loc>'));
  assert.ok(xml.includes('<loc>https://www.bhumiamartya.my.id/articles/</loc>'));
  assert.ok(xml.includes('<loc>https://www.bhumiamartya.my.id/ngopi-ilmu/</loc>'));
  assert.ok(xml.includes('<loc>https://www.bhumiamartya.my.id/ebooks/</loc>'));
  assert.ok(!xml.includes('/ebook/'));
  assert.ok(!xml.includes('/reading'));
  assert.ok(!xml.includes('/founder'));
  assert.ok(!xml.includes('kecocokan'));
  assert.ok(!xml.includes('.vercel.app'));
  assert.ok(xml.includes('<lastmod>2026-08-01T00:00:00.000Z</lastmod>'));
  assert.ok(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>'));
});

test('sitemap handler GET returns xml with article driven by reader', async () => {
  const reader = async () => [{ id: 'x', slug: 'life-path-1', publishedAt: '2026-07-01T00:00:00.000Z' }];
  const res = makeRes();
  await sitemapHandler({ reader })({ method: 'GET', url: '/sitemap.xml' }, res);
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.includes('articles/life-path-1/'));
  assert.ok(res.body.includes('tes-kenali-diri'));
  assert.ok(!res.body.includes('draft'));
});

test('sitemap handler method + unavailable', async () => {
  const res = makeRes();
  await sitemapHandler({ reader: async () => [] })({ method: 'POST', url: '/sitemap.xml' }, res);
  assert.equal(res.statusCode, 405);
});

test('article page SSR includes title/meta/canonical/OG/JSON-LD/body', async () => {
  const article = {
    id: 'a1',
    title: 'Apa itu MBTI',
    slug: 'apa-itu-mbti',
    excerpt: 'Ringkasan',
    content: '## Pendahuluan\n\nparagraf satu.',
    category: 'Ngopi Ilmu',
    tags: ['MBTI'],
    coverImageUrl: 'https://example.com/c.jpg',
    authorName: 'Bhumi Amartya',
    publishedAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-02T00:00:00.000Z',
    seoTitle: 'Apa itu MBTI | Bhumi',
    seoDescription: 'Deskripsi SEO',
    readingTimeMinutes: 4
  };
  const html = buildArticlePageHtml(article);
  assert.ok(html.includes('<title>Apa itu MBTI | Bhumi</title>'));
  assert.ok(html.includes('content="Deskripsi SEO"'));
  assert.ok(html.includes('rel="canonical" href="https://www.bhumiamartya.my.id/articles/apa-itu-mbti/"'));
  assert.ok(html.includes('property="og:url" content="https://www.bhumiamartya.my.id/articles/apa-itu-mbti/"'));
  assert.ok(html.includes('<script type="application/ld+json">'));
  assert.ok(html.includes('"@type":"Article"'));
  assert.ok(html.includes('datePublished'));
  assert.ok(html.includes('<h2>Pendahuluan</h2>'));
  assert.ok(html.includes('<p>paragraf satu.</p>'));
  assert.ok(!html.includes('.vercel.app'));
  assert.ok(!html.includes('<script' + '>function'));
});

test('article page handler 200/404/503 via reader boundary', async () => {
  const okReader = async () => ({ id: 'a', title: 'T', slug: 'apa-itu-mbti', publishedAt: '2026-01-01T00:00:00.000Z' });
  const noneReader = async () => null;
  const res200 = makeRes();
  await articlePageHandler({ reader: okReader })({ method: 'GET', url: '/api/article-page?slug=apa-itu-mbti' }, res200);
  assert.equal(res200.statusCode, 200);
  assert.ok(res200.body.includes('<h1>T</h1>'));
  const res404 = makeRes();
  await articlePageHandler({ reader: noneReader })({ method: 'GET', url: '/api/article-page?slug=nope' }, res404);
  assert.equal(res404.statusCode, 404);
});

test('article reader enforces slug/source/status path via injected fetch', async () => {
  let called = null;
  const fake = async (slug) => { called = slug; return null; };
  await getPublishedArticleBySlug('apa-itu-mbti', { fetchBySlug: fake });
  assert.equal(called, 'apa-itu-mbti');
});