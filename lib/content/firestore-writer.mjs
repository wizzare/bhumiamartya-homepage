import { getFirestoreClient } from '../gcp-oidc.mjs';
import { slugify } from './slug.mjs';
import { isValidSlug } from './firestore-reader.mjs';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MORNING_BREW_CATEGORY = 'Morning Brew';
const DEFAULT_ARTICLE_CATEGORY = 'Refleksi Diri'; // matches the existing reader's own fallback

function invalid(code) {
  const err = new Error(code);
  err.code = code;
  return err;
}

export function isValidDateString(date) {
  if (typeof date !== 'string' || !DATE_RE.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

// Kept for backward compatibility with existing Morning Brew callers/tests.
export const isValidMorningBrewDate = isValidDateString;

export function plainTextExcerpt(content, max = 160) {
  const text = String(content || '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

export function estimateReadingTimeMinutes(content) {
  const words = String(content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function normalizeTags(tags, fallbackTag) {
  const cleaned = Array.isArray(tags)
    ? tags.map((t) => String(t || '').trim()).filter(Boolean)
    : [];
  return cleaned.length ? cleaned : [fallbackTag];
}

async function resolveUniqueSlug(firestore, baseSlug, dateSuffix) {
  const collection = firestore.collection('articles');
  const candidates = [baseSlug, `${baseSlug}-${dateSuffix}`, `${baseSlug}-${dateSuffix}-2`, `${baseSlug}-${dateSuffix}-3`];
  for (const candidate of candidates) {
    const snapshot = await collection.where('slug', '==', candidate).limit(1).get();
    if (snapshot.empty) return candidate;
  }
  return `${baseSlug}-${Date.now()}`;
}

/**
 * Shared write path for every Drive-sourced article pipeline (Morning Brew, Artikel Web, ...).
 * Anti-duplicate is enforced by using a deterministic `sourceId` as the Firestore document id:
 * the doc is looked up first, and the actual write uses `.create()` (fails instead of
 * overwriting on a race), so a re-send for the same sourceId can never create a duplicate.
 */
async function publishArticleCore({
  sourceId, date, title, content, category, tags, fallbackTag,
  excerpt, seoTitle, seoDescription, slugHint, coverImageUrl, sourceChannel
}, { getClient = getFirestoreClient } = {}) {
  if (typeof title !== 'string' || !title.trim()) throw invalid('INVALID_TITLE');
  if (typeof content !== 'string' || !content.trim()) throw invalid('INVALID_CONTENT');

  const { firestore } = await getClient();
  try {
    const docRef = firestore.collection('articles').doc(sourceId);
    const existing = await docRef.get();
    if (existing.exists) {
      const data = existing.data() || {};
      return { status: 'already_published', slug: data.slug || sourceId, id: sourceId };
    }

    const hintedSlug = typeof slugHint === 'string' && isValidSlug(slugHint) ? slugHint : null;
    const baseSlug = hintedSlug || slugify(title) || 'artikel';
    const slug = await resolveUniqueSlug(firestore, baseSlug, date);

    const trimmedTitle = title.trim().slice(0, 300);
    const trimmedContent = content.trim();
    const finalExcerpt = (typeof excerpt === 'string' && excerpt.trim())
      ? excerpt.trim().slice(0, 200)
      : plainTextExcerpt(trimmedContent);
    const now = new Date();

    const docData = {
      title: trimmedTitle,
      slug,
      excerpt: finalExcerpt,
      content: trimmedContent,
      category: (typeof category === 'string' && category.trim()) || DEFAULT_ARTICLE_CATEGORY,
      tags: normalizeTags(tags, fallbackTag),
      coverImageUrl: typeof coverImageUrl === 'string' ? coverImageUrl.trim() : '',
      authorName: 'Bhumi Amartya',
      status: 'published',
      source: 'bhumi',
      sourceId,
      sourceChannel: typeof sourceChannel === 'string' && sourceChannel.trim() ? sourceChannel.trim() : 'google-drive',
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      seoTitle: (typeof seoTitle === 'string' && seoTitle.trim()) ? seoTitle.trim().slice(0, 300) : trimmedTitle,
      seoDescription: (typeof seoDescription === 'string' && seoDescription.trim()) ? seoDescription.trim().slice(0, 300) : finalExcerpt,
      readingTimeMinutes: estimateReadingTimeMinutes(trimmedContent),
      featured: false
    };

    try {
      await docRef.create(docData);
    } catch (err) {
      if (err && (err.code === 6 || err.code === 'ALREADY_EXISTS')) {
        return { status: 'already_published', slug, id: sourceId };
      }
      throw err;
    }

    return { status: 'published', slug, id: sourceId };
  } finally {
    await firestore.terminate();
  }
}

export async function publishMorningBrewArticle(input, opts = {}) {
  const { title, content, date, excerpt, source, coverImageUrl } = input || {};
  if (!isValidDateString(date)) throw invalid('INVALID_DATE');

  return publishArticleCore({
    sourceId: `morning-brew-${date}`,
    date,
    title,
    content,
    category: MORNING_BREW_CATEGORY,
    tags: ['morning-brew'],
    fallbackTag: 'morning-brew',
    excerpt,
    sourceChannel: source,
    coverImageUrl
  }, opts);
}

export async function publishArticleWebArticle(input, opts = {}) {
  const { title, content, date, seoTitle, seoDescription, category, tags, slug, excerpt, source, coverImageUrl } = input || {};
  if (!isValidDateString(date)) throw invalid('INVALID_DATE');

  return publishArticleCore({
    sourceId: `article-web-${date}`,
    date,
    title,
    content,
    category,
    tags,
    fallbackTag: 'artikel-web',
    excerpt,
    seoTitle,
    seoDescription,
    slugHint: slug,
    sourceChannel: source,
    coverImageUrl
  }, opts);
}
