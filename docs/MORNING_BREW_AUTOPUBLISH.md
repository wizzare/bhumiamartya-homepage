# Morning Brew Auto-Publish

Scope: **Morning Brew only.** No new database, CMS, worker, or scheduler — reuses the
site's existing Firestore `articles` collection and its existing WIF-based Firestore client.

## Architecture

```
Gemini Spark (05:00 WIB) -> Google Drive folder (existing)
  -> Google Apps Script, daily trigger ~05:30 WIB
     -> finds TODAY's file only (never latest, never yesterday's)
     -> POST https://www.bhumiamartya.my.id/api/content/morning-brew
        Authorization: Bearer <MORNING_BREW_PUBLISH_SECRET>
  -> writes Firestore `articles` doc (id: morning-brew-<date>, source: "bhumi",
     category: "Morning Brew", status: "published") — idempotent, no duplicates
  -> live at /articles/<slug>/, in /articles/, in /sitemap.xml (existing render/SEO pipeline)
```

- Production endpoint: `POST https://www.bhumiamartya.my.id/api/content/morning-brew` — use
  the `www` host exactly. The apex `bhumiamartya.my.id` 308-redirects to `www` (existing
  site-wide canonicalization), and Google Apps Script's `UrlFetchApp` does not reliably
  preserve `POST` across that redirect — it can arrive at the handler as `GET`, which is
  exactly what caused the `405` seen in testing. `www` has no redirect, so no hop happens.
- Drive folder (existing, unchanged): ID `1Vm8kFWCJZuVmERtnHmi3_bleN8QQvNU0`. Real layout is
  nested — `<folder>/<year>/<MonthName>/YYYY-MM-DD - Morning Brew - <Title>` — the script
  scans the folder tree recursively rather than assuming files sit directly in the root, and
  parses the real title straight out of that file name.
- Code: `api/content/morning-brew.mjs`, `lib/content/firestore-writer.mjs`, `lib/content/slug.mjs`
- Tests: `tests/content-morning-brew.test.mjs`, `tests/morning-brew-writer.test.mjs`

## Request / response

```json
POST https://www.bhumiamartya.my.id/api/content/morning-brew
Authorization: Bearer <secret>
{ "title": "...", "content": "...", "date": "YYYY-MM-DD", "source": "google-drive" }
```

Add `"dryRun": true` to validate secret + payload without writing anything.

| case | status | body |
|---|---|---|
| published | 201 | `{"success":true,"status":"published","slug":"...","url":"..."}` |
| same date again | 200 | `{"success":true,"status":"already_published", ...}` |
| dry run | 200 | `{"success":true,"status":"dry_run", ...}` |
| bad/missing secret | 401 | `{"success":false,"code":"UNAUTHORIZED"}` |
| bad payload | 400 | `{"success":false,"code":"INVALID_TITLE"/"INVALID_CONTENT"/"INVALID_DATE"}` |
| server/Firestore issue | 503 | `{"success":false,"code":"PUBLISH_FAILED"}` |

Anti-duplicate is enforced **by the server** (Firestore doc id = `morning-brew-<date>`,
written with `.create()`), regardless of what the Apps Script does — that's the source of
truth. The Apps Script keeps its own local flag too, just to avoid unnecessary calls.

## Apps Script setup

Script: [`docs/apps-script/MorningBrewPublisher.gs`](./apps-script/MorningBrewPublisher.gs) — copy-paste ready, nothing to edit except the secret.

1. [script.google.com](https://script.google.com) → **New project** → paste the file in.
2. Set the secret — **preferred**: Project Settings (gear icon) → Script Properties → Add
   property `MORNING_BREW_PUBLISH_SECRET` = the value from Vercel's env var of the same
   name. (Alternative: use `setPublishSecretOnce()` in the script — paste the secret in
   temporarily, run once, delete it, save.)
3. Run `testConnection()` → authorize Drive + network access when prompted → check
   **Executions** log for `[testConnection] OK`.
4. Run `createDailyTrigger()` once.

That's it — no project timezone change needed; the trigger is created with
`.inTimezone('Asia/Jakarta')` explicitly.

Other functions: `publishMorningBrew()` (what the trigger runs), `removeDailyTrigger()`,
`showTodayStatus()` (date, file found?, file name, local publish flag, secret configured
YES/NO — never prints the secret itself), `forcePublishMorningBrew()` (manual re-publish;
still protected by the server's own anti-duplicate).

## Troubleshooting

- **`405 METHOD_NOT_ALLOWED` even on a `dryRun` POST** — `CONFIG.API_URL` is pointed at the
  apex domain (`bhumiamartya.my.id`) instead of `www`. The apex 308-redirects to `www`, and
  `UrlFetchApp` can silently turn the POST into a GET across that redirect (confirmed via
  Vercel runtime logs: the request that reached the handler was logged as `GET`, not `POST`).
  Fix: set `CONFIG.API_URL` to `https://www.bhumiamartya.my.id/api/content/morning-brew`
  exactly (already the default in the script) and re-run.
- **`Morning Brew YYYY-MM-DD belum ditemukan.`** — file not in the Drive folder yet, or
  name doesn't contain `Morning Brew` + today's date. Not an error — trigger/manual rerun
  will pick it up once the file exists. Never falls back to an older file.
- **401/403** — secret mismatch. Re-check Script Properties against Vercel's
  `MORNING_BREW_PUBLISH_SECRET`.
- **503 `PUBLISH_FAILED`** — check Vercel function logs (`[morning-brew] publish failed: ...`).
  Most likely cause: the GCP service account behind `GCP_SERVICE_ACCOUNT_EMAIL` doesn't
  have Firestore **write** permission yet (this is the first write path added to this repo —
  it was only used for reads before). Grant it `roles/datastore.user` in GCP IAM if so.
- **Trigger not firing** — Apps Script editor → Triggers (clock icon) → confirm
  `publishMorningBrew` has an active trigger; re-run `createDailyTrigger()` if not.
- **Cosmetic**: real Morning Brew docs open with a masthead line ("🌿 MORNING BREW"), an
  Indonesian date line, then the title line, before the actual greeting/body. The script
  sends the full doc text as `content` unchanged (never trims the first paragraph), so those
  three lines appear at the top of the rendered article body in addition to the page's own
  H1 title. Not a bug — a deliberate conservative choice over risking losing real content.
