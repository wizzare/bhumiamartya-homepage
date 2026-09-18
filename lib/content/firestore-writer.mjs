import { getFirestoreClient } from '../gcp-oidc.mjs';
import { slugify } from './slug.mjs';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MORNING_BREW_CATEGORY = 'Morning Brew';

function invalid(code) {
  const err = new Error(code);
  err.code = code;
  return err;
}

export function isValidMorningBrewDate(date) {
  if (typeof date !== 'string' || !DATE_RE.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

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

async function resolveUniqueSlug(firestore, baseSlug, dateSuffix) {
  const collection = firestore.collection('articles');
  const candidates = [baseSlug, `${baseSlug}-${dateSuffix}`, `${baseSlug}-${dateSuffix}-2`, `${baseSlug}-${dateSuffix}-3`];
  for (const candidate of candidates) {
    const snapshot = await collection.where('slug', '==', candidate).limit(1).get();
    if (snapshot.empty) return candidate;
  }
  return `${baseSlug}-${Date.now()}`;
}

export async function publishMorningBrewArticle(input, { getClient = getFirestoreClient } = {}) {
  const { title, content, date, excerpt, source, coverImageUrl } = input || {};

  if (!isValidMorningBrewDate(date)) throw invalid('INVALID_DATE');
  if (typeof title !== 'string' || !title.trim()) throw invalid('INVALID_TITLE');
  if (typeof content !== 'string' || !content.trim()) throw invalid('INVALID_CONTENT');

  const sourceId = `morning-brew-${date}`;
  const { firestore } = await getClient();
  try {
    const docRef = firestore.collection('articles').doc(sourceId);
    const existing = await docRef.get();
    if (existing.exists) {
      const data = existing.data() || {};
      return { status: 'already_published', slug: data.slug || sourceId, id: sourceId };
    }

    const baseSlug = slugify(title) || 'morning-brew';
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
      category: MORNING_BREW_CATEGORY,
      tags: ['morning-brew'],
      coverImageUrl: typeof coverImageUrl === 'string' ? coverImageUrl.trim() : '',
      authorName: 'Bhumi Amartya',
      status: 'published',
      source: 'bhumi',
      sourceId,
      sourceChannel: typeof source === 'string' && source.trim() ? source.trim() : 'google-drive',
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      seoTitle: trimmedTitle,
      seoDescription: finalExcerpt,
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
