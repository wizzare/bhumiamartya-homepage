import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { publishArticleWebArticle } from '../lib/content/firestore-writer.mjs';

function createFakeFirestore(seed = {}) {
  const docs = new Map(Object.entries(seed));
  const firestore = {
    async terminate() {},
    collection(name) {
      assert.equal(name, 'articles');
      return {
        doc(id) {
          return {
            async get() {
              const data = docs.get(id);
              return { exists: !!data, data: () => data, id };
            },
            async create(data) {
              if (docs.has(id)) {
                const err = new Error('already exists');
                err.code = 6;
                throw err;
              }
              docs.set(id, data);
            }
          };
        },
        where(field, op, value) {
          return {
            limit() {
              return {
                async get() {
                  const matches = [...docs.entries()].filter(([, d]) => d[field] === value);
                  return { empty: matches.length === 0, docs: matches.map(([id, d]) => ({ id, data: () => d })) };
                }
              };
            }
          };
        }
      };
    }
  };
  return { firestore, docs };
}

const basePayload = {
  title: 'Kenapa Kita Kerap Tertarik pada Seseorang yang Belum Selesai dengan Dirinya Sendiri',
  content: 'Pernah nggak, kamu duduk sendirian...',
  date: '2026-09-18',
  seoTitle: 'Kenapa Kita Kerap Tertarik pada yang Belum Selesai?',
  seoDescription: 'Pernah merasa lelah karena selalu menarik pasangan yang butuh diselamatkan?',
  category: 'Relationship',
  tags: ['pola hubungan', 'inner child', 'attachment'],
  slug: 'kenapa-kita-kerap-tertarik-pada-seseorang-yang-belum-selesai-dengan-dirinya-sendiri',
  source: 'google-drive'
};

test('publishes with document-provided SEO metadata, slug, category and tags', async () => {
  const { firestore, docs } = createFakeFirestore();
  const getClient = async () => ({ firestore });
  const result = await publishArticleWebArticle(basePayload, { getClient });

  assert.equal(result.status, 'published');
  assert.equal(result.slug, basePayload.slug);
  assert.equal(result.id, 'article-web-2026-09-18');

  const stored = docs.get('article-web-2026-09-18');
  assert.equal(stored.source, 'bhumi');
  assert.equal(stored.sourceChannel, 'google-drive');
  assert.equal(stored.sourceId, 'article-web-2026-09-18');
  assert.equal(stored.status, 'published');
  assert.equal(stored.category, 'Relationship');
  assert.deepEqual(stored.tags, ['pola hubungan', 'inner child', 'attachment']);
  assert.equal(stored.seoTitle, basePayload.seoTitle);
  assert.equal(stored.seoDescription, basePayload.seoDescription);
  assert.equal(stored.slug, basePayload.slug);
});

test('missing metadata falls back safely (category, tags, seoTitle, seoDescription, slug)', async () => {
  const { firestore, docs } = createFakeFirestore();
  const getClient = async () => ({ firestore });
  const result = await publishArticleWebArticle({
    title: 'Judul Tanpa Metadata',
    content: 'Isi artikel tanpa metadata tambahan sama sekali.',
    date: '2026-09-19'
  }, { getClient });

  assert.equal(result.status, 'published');
  const stored = docs.get('article-web-2026-09-19');
  assert.equal(stored.category, 'Refleksi Diri');
  assert.deepEqual(stored.tags, ['artikel-web']);
  assert.equal(stored.seoTitle, 'Judul Tanpa Metadata');
  assert.ok(stored.seoDescription.length > 0);
  assert.equal(stored.slug, 'judul-tanpa-metadata');
});

test('an invalid slug hint is ignored in favor of a slug generated from the title', async () => {
  const { firestore, docs } = createFakeFirestore();
  const getClient = async () => ({ firestore });
  const result = await publishArticleWebArticle({
    ...basePayload,
    date: '2026-09-20',
    slug: 'Not A Valid Slug !!'
  }, { getClient });

  assert.notEqual(result.slug, 'Not A Valid Slug !!');
  assert.ok(docs.get('article-web-2026-09-20').slug.length > 0);
});

test('publishing the same date twice does not create a duplicate', async () => {
  const { firestore, docs } = createFakeFirestore();
  const getClient = async () => ({ firestore });

  const first = await publishArticleWebArticle({ ...basePayload, date: '2026-09-21' }, { getClient });
  const second = await publishArticleWebArticle({ ...basePayload, date: '2026-09-21', title: 'Judul Berbeda' }, { getClient });

  assert.equal(first.status, 'published');
  assert.equal(second.status, 'already_published');
  assert.equal(second.slug, first.slug);
  assert.equal(docs.size, 1);
});

test('article-web and morning-brew sourceIds never collide for the same date', async () => {
  const { firestore, docs } = createFakeFirestore({
    'morning-brew-2026-09-22': { slug: 'morning-brew-slug', source: 'bhumi' }
  });
  const getClient = async () => ({ firestore });
  const result = await publishArticleWebArticle({ ...basePayload, date: '2026-09-22' }, { getClient });

  assert.equal(result.status, 'published');
  assert.equal(docs.size, 2);
  assert.ok(docs.has('article-web-2026-09-22'));
  assert.ok(docs.has('morning-brew-2026-09-22'));
});
