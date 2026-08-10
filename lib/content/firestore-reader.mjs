import { getFirestoreClient } from '../gcp-oidc.mjs';

const LIST_FETCH_CAP = 40;

function toIso(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value.toDate === 'function') return value.toDate().toISOString();
  return null;
}

export function normalizeArticleDoc(id, data) {
  return {
    id,
    title: data.title || 'Artikel Bhumi',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    category: data.category || 'Refleksi Diri',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    coverImageUrl: data.coverImageUrl || '',
    authorName: data.authorName || 'Bhumi Amartya',
    publishedAt: toIso(data.publishedAt),
    updatedAt: toIso(data.updatedAt),
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    readingTimeMinutes: Number.isFinite(Number(data.readingTimeMinutes)) ? Number(data.readingTimeMinutes) : 0,
    featured: Boolean(data.featured)
  };
}

async function queryPublished({ limit }) {
  const { firestore } = await getFirestoreClient();
  try {
    const snapshot = await firestore
      .collection('articles')
      .where('source', '==', 'bhumi')
      .where('status', '==', 'published')
      .limit(LIST_FETCH_CAP)
      .get();
    return snapshot.docs.map((doc) => normalizeArticleDoc(doc.id, doc.data()));
  } finally {
    await firestore.terminate();
  }
}

export async function listPublishedArticles({ limit = 6, fetchPublished = queryPublished } = {}) {
  const docs = await fetchPublished({ limit: LIST_FETCH_CAP });
  return docs
    .filter((a) => a.slug && a.publishedAt)
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .slice(0, limit);
}

export function normalizeArticleDetail(id, data) {
  return {
    ...normalizeArticleDoc(id, data),
    content: data.content || ''
  };
}

async function queryBySlug(slug) {
  const { firestore } = await getFirestoreClient();
  try {
    const snapshot = await firestore
      .collection('articles')
      .where('slug', '==', slug)
      .where('source', '==', 'bhumi')
      .where('status', '==', 'published')
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return normalizeArticleDetail(snapshot.docs[0].id, snapshot.docs[0].data());
  } finally {
    await firestore.terminate();
  }
}

export function isValidSlug(slug) {
  return typeof slug === 'string' && slug.length >= 1 && slug.length <= 200 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function getPublishedArticleBySlug(slug, { fetchBySlug = queryBySlug } = {}) {
  if (!isValidSlug(slug)) return null;
  return fetchBySlug(slug);
}

export function normalizeEbookDoc(id, data) {
  return {
    id,
    title: data.title || 'Ebook Bhumi',
    slug: data.slug || '',
    description: data.description || '',
    category: data.category || 'Bhumi Ebook',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    coverImageUrl: data.coverImageUrl || '',
    authorName: data.authorName || 'Bhumi Amartya',
    publishedAt: toIso(data.publishedAt),
    updatedAt: toIso(data.updatedAt),
    seoTitle: data.seoTitle || '',
    seoDescription: data.seoDescription || '',
    pdfFileName: data.pdfFileName || '',
    pdfFileSize: Number.isFinite(Number(data.pdfFileSize)) ? Number(data.pdfFileSize) : 0
  };
}

export function safePdfUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

export function normalizeEbookDetail(id, data) {
  const base = normalizeEbookDoc(id, data);
  return { ...base, pdfFileUrl: safePdfUrl(data.pdfFileUrl) };
}

async function queryPublishedEbooks({ limit }) {
  const { firestore } = await getFirestoreClient();
  try {
    const snapshot = await firestore
      .collection('ebooks')
      .where('source', '==', 'bhumi')
      .where('status', '==', 'published')
      .limit(limit)
      .get();
    return snapshot.docs.map((doc) => normalizeEbookDoc(doc.id, doc.data()));
  } finally {
    await firestore.terminate();
  }
}

async function queryEbookBySlug(slug) {
  const { firestore } = await getFirestoreClient();
  try {
    const snapshot = await firestore
      .collection('ebooks')
      .where('slug', '==', slug)
      .where('source', '==', 'bhumi')
      .where('status', '==', 'published')
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    return normalizeEbookDetail(snapshot.docs[0].id, snapshot.docs[0].data());
  } finally {
    await firestore.terminate();
  }
}

export async function getPublishedEbooks({ limit = 12, fetchEbooks = queryPublishedEbooks } = {}) {
  const docs = await fetchEbooks({ limit });
  return docs
    .filter((e) => e.slug)
    .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
    .slice(0, limit);
}

export async function getPublishedEbookBySlug(slug, { fetchBySlug = queryEbookBySlug } = {}) {
  if (!isValidSlug(slug)) return null;
  return fetchBySlug(slug);
}