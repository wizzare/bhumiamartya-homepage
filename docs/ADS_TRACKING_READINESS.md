# Ads & Tracking Readiness

**Status:** Repository-level foundation complete. External account/dashboard configuration is tracked separately below and is NOT part of this document's "done" claims.
**Scope:** Google AdSense technical readiness, Consent Mode v2 separation (Analytics vs. Marketing & Ads), Meta Pixel activation, ChatGPT Ads crawler readiness, and the tracking event model. No new landing pages, no campaigns, no engine/API/database/payment/auth changes.
**Last updated:** 2026-09-25

## 1. Consent Architecture v2

`assets/bhumi-consent.js` now stores consent as `bhumi_consent_v2` in `localStorage`: `{ analytics: boolean, marketing: boolean }`, with three independent categories surfaced in the UI:

- **Necessary** — always on, no toggle (required for the site and the consent mechanism itself to function).
- **Analytics** — gates Google Analytics 4 only.
- **Marketing & Ads** — gates Meta Pixel and Google AdSense only.

UI: a compact first-visit banner ("Pilihan Privasi Anda") with **Terima Semua** / **Tolak Opsional** / **Atur Pilihan**, a category panel ("Atur Pilihan Privasi") with a checkbox per category and **Simpan Pilihan** / **Terima Semua**, and a floating **Pilihan Privasi** button to reopen the panel at any time.

Legacy migration: an existing `bhumi_consent_v1` value of `"accepted"` is migrated to `{ analytics: true, marketing: false }` — a legacy accept is privacy-safe by construction and never implies marketing/ads consent. `"rejected"` migrates to `{ analytics: false, marketing: false }`.

Google Consent Mode v2 signals (`analytics_storage`, `ad_storage`, `ad_user_data`, `ad_personalization`) default to `denied` on every page load before any stored choice is read, and are only set to `granted` per-category once the corresponding consent is present.

### Audit finding and fix: analytics consent was silently granting marketing consent

The pre-existing `assets/bhumi-analytics.js` had `loadGoogleTag()` call `loadMetaPixel()` internally, meaning a user who granted analytics consent only was also enrolled into Meta Pixel tracking without ever agreeing to Marketing & Ads. This has been fixed: `loadGoogleTag()` (gated on analytics consent) and `loadMetaPixel()` (gated on marketing consent) are now fully independent, each triggered only by its own category's consent state.

### Audit finding and fix: AdSense script was loading with zero consent gating

`assets/bhumi-adsense.js` was loading `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` unconditionally on production hosts, with no consent check at all. This has been fixed: the script now only loads after Marketing & Ads consent is granted (checked both on `DOMContentLoaded` and on the `bhumi:consent` event).

## 2. Google Analytics 4

- Measurement ID: `G-BLNCYH2290` (unchanged).
- Loads only after Analytics consent is granted, and only on production hosts (`bhumiamartya.my.id`, `www.bhumiamartya.my.id`).
- `send_page_view` is disabled on `gtag('config', ...)`; a manual `page_view` event is sent once per load, after consent, with `page_type` classification and no PII.
- `allow_google_signals` and `allow_ad_personalization_signals` are explicitly disabled — GA4 is used for measurement only, not ads personalization.
- Event names sent: `page_view`, `navigation_click`, `article_open`, `article_source_click`, `tool_started`, `tool_completed`, `pdf_download`, `app_download_click`, `contact_click`, `outbound_click`, `community_join_click`, `personal_blueprint_click`. No name, birthdate, journal content, calculation result, or PDF content is ever sent as an event parameter.

## 3. Meta Pixel

- Pixel ID: `392010474954002` (unchanged).
- Loads only after Marketing & Ads consent is granted, and only on production hosts.
- Sends `PageView` on load, then maps a narrow subset of Bhumi's own events to Meta's vocabulary: `contact_click` → `Lead`; everything else uses `trackCustom` with a plain label (`ToolCompleted`, `PdfDownload`, `AppDownloadClick`, `CommunityJoin`, `PersonalBlueprintClick`). No fabricated `Purchase` event and no revenue/value parameters are sent, since Bhumi does not process payments through this flow.
- **Known technical limitation (documented, not a bug to fix here):** once the Pixel script has executed and sent events, those events cannot be recalled. If a user grants Marketing & Ads consent and later revokes it, revocation only stops *future* dispatch from that browser session — it cannot undo events already transmitted to Meta. This is disclosed in `privacy-policy/index.html` §9.

## 4. Google AdSense

- Publisher ID: `ca-pub-0971666335614952` (unchanged, already present as a `<meta name="google-adsense-account">` tag repo-wide).
- `ads.txt` already correct in production (verified via live fetch): `google.com, pub-0971666335614952, DIRECT, f08c47fec0942fa0`. No change made.
- `assets/bhumi-adsense.js` loads the `adsbygoogle.js` library only after Marketing & Ads consent, on production hosts. This is **Auto Ads readiness only** — no manual ad units are declared, no ad slots are hardcoded, and no ad-unit IDs were invented. Google can begin placing ads via Auto Ads once Auto Ads is enabled for this site in the AdSense dashboard (external step, see §7).
- Script tag changed from `async` to `defer` everywhere it remains, so it reliably runs after `window.BhumiConsent` is defined regardless of script registration order or position in the document — deferred scripts execute in document order, all before `DOMContentLoaded`.
- Loader kept on: `index.html`, `about/index.html`, `ebook/index.html`, `komunitas/index.html` (unchanged from prior state) and added to `ngopi-ilmu/index.html`, `articles/index.html`, `articles/detail.html` (content pages, natural ad-monetization candidates). Removed from `contact/index.html`, `privacy-policy/index.html`, and `weton/index.html` (a transactional/calculator page) — ads are not appropriate on contact, legal, or in-tool-flow pages.
- **Note on filename:** the existing `assets/bhumi-adsense.js` filename was kept rather than introducing a new `bhumi-ads.js`, since 17+ HTML files already reference it by that name and the fix required was behavioral (consent gating), not a rename. This is a deliberate, documented deviation from a "prefer a new filename" default.

### Google-certified CMP boundary (explicit statement)

Bhumi Amartya's own consent banner (`bhumi-consent.js`) is a **first-party consent mechanism**, not a Google-certified Consent Management Platform (CMP) and not an IAB Transparency & Consent Framework (TCF) implementation. For users in the EEA, UK, and Switzerland, Google's own policies require publishers serving personalized ads to use a Google-certified CMP integrated with IAB TCF. This repository does **not** implement TCF and makes **no claim** of certified-CMP compliance. Whether/how to satisfy that requirement (e.g., via AdSense's own Privacy & Messaging feature, or a third-party certified CMP) is an **external AdSense-account configuration decision**, not something resolved by code in this repository. This is disclosed in `privacy-policy/index.html` §9.

## 5. ChatGPT Ads Crawler Readiness

- `robots.txt` updated to explicitly allow `OAI-AdsBot` and `OAI-SearchBot` (OpenAI's advertising and search crawlers), in addition to the existing wildcard `Allow: /`. `GPTBot` was **not** added — per explicit product decision, that remains a separate, un-made decision.
- `ads.txt` unaffected (Google AdSense only; ChatGPT Ads has no equivalent `ads.txt`-style file requirement at this time).
- Verified via live fetch that the 5 priority ChatGPT-Ads landing surfaces return HTTP 200 with no auth wall, JS-only barrier, or redirect loop: `/`, `/kenali-diri/human-design/`, `/tes-kenali-diri/`, `/komunitas/`, `/ngopi-ilmu/`.
- Confirmed no middleware file, no captcha/auth gate, and no bot-blocking `headers` rule exists in `vercel.json` — code-level bot-blocking is ruled out. CDN/WAF-level blocking (if any exists at the Vercel account or DNS-provider level) cannot be verified from within this repository and is called out as an external check in §7.
- **Known caveat (not fixed, out of scope):** `/ngopi-ilmu/` renders its article list client-side via `fetch('/api/bhumi-articles?limit=12')`. A crawler that does not execute JavaScript will only see a "Memuat tulisan..." placeholder, not the actual article list. This is a pre-existing architectural characteristic; fixing it would require an API/rendering change, which is explicitly out of scope for this task.
- **No fabricated OpenAI conversion tracking.** No `OpenAIConversion` object, `ChatGPTPixel` script, `oaTrack()` function, or any other undocumented "ChatGPT Ads pixel/API" was created. If/when OpenAI publishes an official, documented conversion-tracking mechanism for ChatGPT Ads, integrating it is future work, not something simulated here.

## 6. Tracking Event Model

Existing event vocabulary (`page_view`, `navigation_click`, `article_open`, `article_source_click`, `tool_started`, `tool_completed`, `pdf_download`, `app_download_click`, `contact_click`, `outbound_click`) is extended with two new first-class events:

- `community_join_click` — fired from the homepage and `/komunitas/` "Gabung Komunitas" CTAs. Currently these CTAs still resolve to `/contact/` (no canonical community destination exists yet, see `docs/COMMUNITY.md` §10) — the event name reflects user intent, independent of the temporary destination.
- `personal_blueprint_click` — fired from the homepage Personal Blueprint section CTA.

Both events are sent through the existing `window.BhumiAnalytics.track(name, metadata)` path and follow the same consent gating as every other event (require at least one of Analytics/Marketing consent to fire at all; GA4 dispatch requires Analytics consent specifically, Meta Pixel dispatch requires Marketing & Ads consent specifically).

## 7. External Dashboard Work Remaining (NOT part of this repository)

These items require action in third-party account dashboards and are explicitly **not** claimed as done by this document or by any code change in this branch:

**Google AdSense**
- Enable Auto Ads for this site in the AdSense dashboard (code readiness is in place; Auto Ads itself is an account-level toggle).
- Configure Privacy & Messaging (CMP/consent) settings for EEA/UK/Switzerland traffic if/when personalized ads are served to those regions — see §4's CMP boundary statement.
- Verify site ownership/approval status in AdSense if not already approved.

**Meta Events Manager**
- Verify Pixel `392010474954002` is receiving events as expected in Meta Events Manager's test/diagnostics tools.
- Configure any Conversions API (server-side) integration, if desired — not implemented here (client-side Pixel only).
- Review Meta's own data-processing/consent requirements for the target ad regions.

**ChatGPT Ads Manager**
- Confirm `OAI-AdsBot`/`OAI-SearchBot` are not blocked at the CDN/WAF layer (outside `robots.txt`, which this repository controls) — e.g., Vercel firewall rules or any DNS-provider-level bot management, if configured.
- Set up campaigns/landing-page mappings in ChatGPT Ads Manager once campaign strategy is decided (explicitly out of scope for this task — no campaigns were created).
- Monitor whether OpenAI publishes an official conversion-tracking mechanism before attempting to integrate one.

## 8. Explicitly Out of Scope (confirmed unchanged)

- No homepage redesign, no menu/navigation redesign, no new landing pages.
- No Ads campaigns created in any platform.
- No changes to Human Design, Life Path, Destiny Matrix, or Natal Chart engines, or to `/api/**` calculation logic.
- No database, payment, or auth changes.
- No fake IAB TCF implementation, no claim of Google-certified CMP status.
- No home-grown geo-detection or IP geolocation.
- No `GPTBot` addition to `robots.txt`.
- No manual deploy performed as part of this task.
