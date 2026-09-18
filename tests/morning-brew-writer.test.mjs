import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  publishMorningBrewArticle,
  isValidMorningBrewDate,
  plainTextExcerpt,
  estimateReadingTimeMinutes
} from '../lib/content/firestore-writer.mjs';

function createFakeFirestore(seed = {}) {
  const docs = new Map(Object.entries(seed));
  const firestore = {
    terminated: false,
    async terminate() { firestore.terminated = true; },
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

test('isValidMorningBrewDate accepts real calendar dates only', () => {
  assert.equal(isValidMorningBrewDate('2026-09-18'), true);
  assert.equal(isValidMorningBrewDate('2026-02-30'), false);
  assert.equal(isValidMorningBrewDate('18-09-2026'), false);
  assert.equal(isValidMorningBrewDate(''), false);
  assert.equal(isValidMorningBrewDate(undefined), false);
});

test('plainTextExcerpt strips markdown and truncates around 160 chars', () => {
  const long = `# Judul\n\n${'kata '.repeat(60)}`;
  const excerpt = plainTextExcerpt(long);
  assert.ok(excerpt.length <= 161);
  assert.ok(!excerpt.includes('#'));
});

test('estimateReadingTimeMinutes is at least 1 and scales with word count', () => {
  assert.equal(estimateReadingTimeMinutes('satu dua tiga'), 1);
  assert.equal(estimateReadingTimeMinutes('kata '.repeat(400)), 2);
});

test('publish creates a new article with source=bhumi and category Morning Brew', async () => {
  const { firestore, docs } = createFakeFirestore();
  const getClient = async () => ({ firestore });
  const result = await publishMorningBrewArticle({
    title: 'Ketika Kamu Capek Menjadi Kuat Terus',
    content: 'Isi Morning Brew hari ini.',
    date: '2026-09-18',
    source: 'google-drive'
  }, { getClient });

  assert.equal(result.status, 'published');
  assert.equal(result.slug, 'ketika-kamu-capek-menjadi-kuat-terus');
  assert.equal(result.id, 'morning-brew-2026-09-18');

  const stored = docs.get('morning-brew-2026-09-18');
  assert.equal(stored.source, 'bhumi');
  assert.equal(stored.sourceChannel, 'google-drive');
  assert.equal(stored.category, 'Morning Brew');
  assert.equal(stored.status, 'published');
  assert.equal(stored.sourceId, 'morning-brew-2026-09-18');
  assert.ok(stored.publishedAt instanceof Date);
});

test('publishing the same date twice does not create a duplicate', async () => {
  const { firestore, docs } = createFakeFirestore();
  const getClient = async () => ({ firestore });
  const payload = {
    title: 'Judul Sama',
    content: 'Isi pertama.',
    date: '2026-09-19'
  };

  const first = await publishMorningBrewArticle(payload, { getClient });
  const second = await publishMorningBrewArticle({ ...payload, content: 'Isi berbeda dikirim ulang.' }, { getClient });

  assert.equal(first.status, 'published');
  assert.equal(second.status, 'already_published');
  assert.equal(second.slug, first.slug);
  assert.equal(docs.size, 1);
  assert.equal(docs.get('morning-brew-2026-09-19').content, 'Isi pertama.');
});

test('slug collision across different dates appends the date suffix', async () => {
  const { firestore } = createFakeFirestore({
    'morning-brew-2026-09-01': { slug: 'refleksi-pagi', source: 'bhumi' }
  });
  const getClient = async () => ({ firestore });
  const result = await publishMorningBrewArticle({
    title: 'Refleksi Pagi',
    content: 'Isi berbeda.',
    date: '2026-09-02'
  }, { getClient });

  assert.equal(result.slug, 'refleksi-pagi-2026-09-02');
});

test('invalid payload throws typed errors', async () => {
  const { firestore } = createFakeFirestore();
  const getClient = async () => ({ firestore });
  await assert.rejects(
    publishMorningBrewArticle({ title: '', content: 'x', date: '2026-09-18' }, { getClient }),
    (err) => err.code === 'INVALID_TITLE'
  );
  await assert.rejects(
    publishMorningBrewArticle({ title: 'x', content: '', date: '2026-09-18' }, { getClient }),
    (err) => err.code === 'INVALID_CONTENT'
  );
  await assert.rejects(
    publishMorningBrewArticle({ title: 'x', content: 'x', date: 'not-a-date' }, { getClient }),
    (err) => err.code === 'INVALID_DATE'
  );
});
