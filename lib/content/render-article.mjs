const HOST = 'https://www.bhumiamartya.my.id';

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[c]));
}

function iso(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function renderArticleBody(content) {
  const blocks = String(content || '').split(/\n{2,}/);
  return blocks.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    const img = /^!\[(.*?)\]\((.*?)\)$/.exec(trimmed);
    if (img) return `<img src="${esc(img[2])}" alt="${esc(img[1] || 'Gambar Artikel')}" loading="lazy">`;
    if (/^##\s+/.test(trimmed)) return `<h2>${esc(trimmed.replace(/^##\s+/, ''))}</h2>`;
    if (/^###\s+/.test(trimmed)) return `<h3>${esc(trimmed.replace(/^###\s+/, ''))}</h3>`;
    if (/^#\s+/.test(trimmed)) return `<h2>${esc(trimmed.replace(/^#\s+/, ''))}</h2>`;
    if (/^-\s+/.test(trimmed)) {
      const items = trimmed.split('\n').filter((l) => /^-\s+/.test(l)).map((l) => `<li>${esc(l.replace(/^-\s+/, ''))}</li>`).join('');
      return `<p>${items}</p>`;
    }
    return `<p>${esc(trimmed)}</p>`;
  }).join('');
}

export function buildArticlePageHtml(article) {
  const slug = article.slug || '';
  const canonical = `${HOST}/articles/${encodeURIComponent(slug)}/`;
  const title = article.seoTitle || article.title || 'Artikel';
  const description = article.seoDescription || article.excerpt || '';
  const published = iso(article.publishedAt);
  const updated = iso(article.updatedAt) || published;
  const tags = Array.isArray(article.tags) ? article.tags : [];
  const tagsJson = JSON.stringify(tags).replace(/</g, '\\u003c');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title || 'Artikel',
    description: article.excerpt || '',
    image: article.coverImageUrl || undefined,
    datePublished: published || undefined,
    dateModified: updated || undefined,
    author: { '@type': 'Person', name: article.authorName || 'Bhumi Amartya' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    publisher: { '@type': 'Organization', name: 'Bhumi Amartya', url: `${HOST}/` }
  };
  const jsonLdStr = JSON.stringify(jsonLd).replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(article.coverImageUrl || HOST + '/assets/og-image.jpg')}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(article.coverImageUrl || HOST + '/assets/og-image.jpg')}">
<link rel="icon" href="/favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="/assets/bhumi-design-system.css">
<script type="application/ld+json">${jsonLdStr}</script>
<style>
main{max-width:760px;margin:0 auto;padding:2rem 1rem 4rem}
.article-meta{font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--gold-dark,#a0782d)}
h1{font-size:2.1rem;line-height:1.25;margin:.5rem 0 .75rem;color:var(--text-primary,#2e3f32)}
.byline{font-size:.85rem;color:var(--text-secondary,#5c6b5e);margin-bottom:1.25rem}
img{max-width:100%;height:auto;border-radius:16px;margin:1.25rem auto;display:block}
.body{line-height:1.8;font-size:1.02rem;color:var(--text-primary,#2e3f32)}
.body h2{font-size:1.5rem;margin:1.5rem 0 .5rem}
.body h3{font-size:1.25rem;margin:1.25rem 0 .4rem}
.body p{margin:0 0 .9rem}
.back{display:inline-block;margin-bottom:1.25rem;color:var(--text-secondary,#5c6b5e);text-decoration:none;font-weight:600}
@media(max-width:640px){h1{font-size:1.7rem}}
</style>
</head>
<body>
<main>
<a class="back" href="/articles/">← Semua Artikel</a>
<div class="article-meta">${esc(article.category || 'Artikel')}</div>
<h1>${esc(article.title)}</h1>
<div class="byline">
${esc(article.authorName || 'Bhumi Amartya')}
${published ? ' · ' + new Date(published).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
${article.readingTimeMinutes ? ' · ' + article.readingTimeMinutes + ' menit' : ''}
</div>
${article.coverImageUrl ? `<img src="${esc(article.coverImageUrl)}" alt="${esc(article.title)}">` : ''}
<div class="body">
${renderArticleBody(article.content)}
</div>
${tags.length ? `<p>Tags: ${tags.map((t) => `${esc(t)}`).join(', ')}</p>` : ''}
</main>
</body>
</html>`;
}

export function buildNotFoundHtml() {
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Artikel tidak ditemukan | Bhumi Amartya</title></head>
<body style="font-family:sans-serif;max-width:560px;margin:15vh auto;padding:0 1rem;text-align:center">
<h1>Artikel tidak ditemukan</h1>
<p style="color:#5c6b5e">Artikel mungkin sudah tidak tersedia atau alamatnya berubah.</p>
<a href="/articles/" style="color:#2e3f32;font-weight:600">Lihat Semua Artikel</a>
</body>
</html>`;
}