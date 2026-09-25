# Artikel Web Auto-Publish

> **Status: TECHNICAL — STILL VALID.** Unrelated to positioning; see `docs/CONTENT_GOVERNANCE.md` §9 for the claim-governance expectations that apply to articles this pipeline publishes.

Second daily content pipeline, sibling to Morning Brew — same architecture, separate
credentials, separate Drive subfolder, does not touch Morning Brew's trigger/folder/secret.

## Architecture

```
Gemini Spark (~11:00 WIB) -> Google Drive (existing root folder, recursive scan)
  -> Google Apps Script, daily trigger ~12:00 WIB
     -> finds TODAY's "Artikel Web" file only (never latest, never yesterday's)
     -> parses SEO_TITLE / META_DESCRIPTION / CATEGORY / TAGS / SLUG metadata block
     -> POST https://www.bhumiamartya.my.id/api/content/article-web
        Authorization: Bearer <ARTICLE_WEB_PUBLISH_SECRET>
  -> writes Firestore `articles` doc (id: article-web-<date>, source: "bhumi") — idempotent
  -> live at /articles/<slug>/, in /articles/, in /sitemap.xml (existing render/SEO pipeline)
```

- Production endpoint: `POST https://www.bhumiamartya.my.id/api/content/article-web` (use
  `www` exactly — same apex-redirect caveat as Morning Brew: `bhumiamartya.my.id` 308s to
  `www`, and `UrlFetchApp` does not reliably preserve `POST` across that hop).
- Drive root (existing, unchanged): `1Vm8kFWCJZuVmERtnHmi3_bleN8QQvNU0`. Real files live at
  `<root>/<year>/<MonthName>/Artikel Web/YYYY-MM-DD - Artikel Web - <Title>`; the script
  scans the tree recursively from the root rather than hardcoding that path, so it keeps
  working across month/year changes.
- Code: `api/content/article-web.mjs`, `lib/content/firestore-writer.mjs`
  (`publishArticleWebArticle`, sharing the same anti-duplicate/slug-collision core as
  Morning Brew's `publishMorningBrewArticle`).
- Apps Script: [`docs/apps-script/ArticleWebPublisher.gs`](./apps-script/ArticleWebPublisher.gs).
- Tests: `tests/content-article-web.test.mjs`, `tests/article-web-writer.test.mjs`,
  `tests/render-article-body.test.mjs`.

## Google Docs metadata format

```
SEO_TITLE:
...

META_DESCRIPTION:
...

CATEGORY:
...

TAGS:
tag1, tag2, tag3

SLUG:
...

# Judul Artikel

Isi artikel...
```

The parser (`parseArticleWebDocument_` in the Apps Script) is written against the **real**
files Gemini Spark produces, not just the spec: it reads each key whether its value is on
the same line or the next paragraph, is case-insensitive on keys, and — importantly — real
files do **not** always include a `---` separator; the parser detects where the metadata run
ends (first paragraph that isn't a recognized `KEY:` line) and treats everything from there
onward as content, so it works with or without the separator. Metadata lines are never
included in the article body. Missing fields fall back safely (see mapping below).

Title priority: `YYYY-MM-DD - Artikel Web - <Title>` parsed from the **file name** first
(most reliable — this is what Gemini Spark actually embeds), then a `#`/`##` heading line at
the top of the content, then a cleaned file name.

## Request / response

```json
POST https://www.bhumiamartya.my.id/api/content/article-web
Authorization: Bearer <secret>
{
  "title": "...", "content": "...", "date": "YYYY-MM-DD",
  "seoTitle": "...", "seoDescription": "...", "category": "...",
  "tags": ["..."], "slug": "...", "source": "google-drive"
}
```

`seoTitle`, `seoDescription`, `category`, `tags`, `slug`, `excerpt`, `coverImageUrl` are all
optional — add `"dryRun": true` to validate without writing. Same response shape/status
codes as Morning Brew (`published` 201, `already_published` 200, `dry_run` 200,
`UNAUTHORIZED` 401, `INVALID_*` 400, `PUBLISH_FAILED`/`PUBLISH_NOT_CONFIGURED` 503).

## Firestore mapping / anti-duplicate

Same collection (`articles`), same required fields as Morning Brew, sharing one write path:
`source: "bhumi"`, `status: "published"`, `publishedAt`/`createdAt`/`updatedAt` server-set,
`sourceId: "article-web-<date>"` (also the Firestore **document id** — the anti-duplicate
mechanism, identical to Morning Brew: `.create()` fails instead of overwriting on a race, a
resend for the same date returns `already_published`, no new doc). Document-provided
`slug`/`category`/`tags`/`seoTitle`/`seoDescription` are used when present and valid;
otherwise: `category` → `"Refleksi Diri"` (matches the existing reader's own default),
`tags` → `["artikel-web"]`, `slug` → generated from `title`, `seoTitle`/`seoDescription` →
derived from `title`/`content` — same fallback pattern as Morning Brew.

## Apps Script setup

1. [script.google.com](https://script.google.com) → paste
   `docs/apps-script/ArticleWebPublisher.gs` in (new project, or as an extra file alongside
   `MorningBrewPublisher.gs` in the same project — function/property names don't collide).
2. Set the secret — Project Settings → Script Properties → add
   `ARTICLE_WEB_PUBLISH_SECRET` = the value from Vercel's env var of the same name.
3. Run `testArticleWebConnection()` → authorize when prompted → check the Executions log.
4. Run `createArticleWebDailyTrigger()` once (creates the ~12:00 WIB daily trigger).

Other functions: `publishArticleWeb()` (what the trigger runs), `removeArticleWebDailyTrigger()`,
`showArticleWebTodayStatus()`, `publishArticleWebTodayNow()` (manual/force re-publish — the
one to use for a real end-to-end test; server-side anti-duplicate still applies).

## Schedule

```
05:00  Morning Brew dibuat (Gemini Spark)
05:30  Morning Brew publish (Apps Script)

11:00  Artikel Web dibuat (Gemini Spark)
12:00  Artikel Web publish (Apps Script)
```

One hour of slack between generation and publish, same reasoning as Morning Brew: if
Spark runs long, the trigger simply won't find today's file yet and exits quietly — it
never falls back to yesterday's article.

## Troubleshooting

Same failure modes/messages as Morning Brew (see `docs/MORNING_BREW_AUTOPUBLISH.md`):
`405` → wrong host (apex vs `www`); `401`/`403` → secret mismatch; `503 PUBLISH_FAILED` →
check Firestore write permission on `GCP_SERVICE_ACCOUNT_EMAIL` first (shared with Morning
Brew — if Morning Brew publishes fine, this isn't the cause for Artikel Web).
