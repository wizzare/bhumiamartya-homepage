# Homepage baseline — Phase 0–1 only

## Scope and reproducibility

Captured 2026-09-08 at 10:09:01 UTC from the existing root `index.html`. No homepage/application source, package files, or existing redesign documents were edited. No production requests, mutation APIs, dependency installations, commits, or deployment actions were performed.

- Environment: Windows, Node v24.19.0, Chromium 149.0.7827.55, existing Playwright resolved through Node module lookup. Package declares Node 20.x; this run is not Node 20 compatibility evidence.
- Source SHA-256: `f47841aa7504efee58a899866525802089f105dca1bd10056ffc5557ac9f38d8`.
- Runner: `docs/homepage-redesign/baseline-check.mjs`.
- From the repository root:

```sh
node --check docs/homepage-redesign/baseline-check.mjs
node docs/homepage-redesign/baseline-check.mjs
```

The runner prints JSON evidence to stdout, overwrites the five screenshots, closes Chromium and its server, then exits **1 when findings remain**. Final run: **22 passing checks, 6 failing checks, 28 total**. The exit is intentional baseline defect reporting, not a harness crash. No separate evidence JSON file is generated.

The Node stdlib static server binds to an ephemeral port on `127.0.0.1` only. It permits GET/HEAD, rejects traversal/backslashes/dotfiles/private and API directories, checks real paths against the repository boundary, and does not execute backend code. Raw encoded traversal, private-file/API rejection, and POST rejection assertions passed. Parent directories were checked before artifact creation. All external browser requests and non-read methods are blocked; service workers are disabled.

## DOM inventory

Counts use HTML parsed by Chromium, not regex. Source counts exclude runtime insertions; settled runtime counts include first-visit consent and article failure fallback. CTA means `a.btn,button.btn`, not every actionable element or navigation link.

| Metric | Source HTML | Settled local DOM |
| --- | ---: | ---: |
| Sections | 9 | 10 |
| H1 | 1 | 1 |
| H2 | 8 | 9 |
| H3 | 18 | 18 |
| H4 | 14 | 14 |
| H5 | 1 | 1 |
| H6 | 0 | 0 |
| All headings | 42 | 43 |
| Links with href | 43 | 45 |
| Buttons | 5 | 13 |
| Styled CTAs | 15 | 17 |

Section order: `beranda`, `tentang`, `sistem`, `produk`, `youtube`, `artikel`, `testimoni`, `founder`, `download-cta`; runtime consent adds `.bhumi-consent`.

H1: “Ruang untuk Pulang dan Kenali Diri” (DOM textContent joins the line break as “Pulangdan”). Source H2s: Apa itu Bhumi Amartya?; 11 Sistem Bhumi; Produk Bhumi; Video Terbaru Bhumi; Ngopi Ilmu; Cara Menggunakan Hasil dengan Bijak; Founder dan Pengelola; Ruang untuk Pulang dan Kenali Diri. Runtime adds Pilihan privasi Anda. H2-to-H4 level skips exist; this is inventory, not a full heading accessibility audit.

Source CTA inventory: Download Aplikasi ×2; Tes Kenali Diri; Cek Weton; Cek Aura; Kalkulator Cinta; Human Design; MBTI; Pelajari ×3; Lihat Semua Video; Kunjungi Wedhaswara.my.id; Google Play; Pelajari Lebih Lanjut. Article fallback adds Artikel Bhumi and Wedhaswara. Consent adds three buttons and slider initialization adds five dot buttons.

## Structural checks

- One JSON-LD block parses successfully: `Organization`, `WebSite`, `WebPage` in `@graph` (`index.html:28`). Parsing does not certify schema eligibility or search-engine indexing.
- One executable inline script passes Node VM syntax parsing; zero inline event-handler attributes were found. External script behavior was exercised by Chromium, not independently linted.
- Fourteen same-document anchor occurrences: ten nonempty fragments resolve, four `href="#"` dropdown placeholders are classified separately and accepted as top-of-document links, not missing IDs.
- Seven distinct nonempty targets: `beranda`, `produk`, `youtube`, `artikel`, `testimoni`, `founder`, `tentang`.
- All 24 distinct internal href strings in settled DOM resolve to static files/directory indexes; these include fragments and relative/root-relative duplicates. Normalized page destinations: `/`, `/tes-kenali-diri/`, `/cek-aura/`, `/weton/`, `/kenali-diri/human-design/`, `/kenali-diri/mbti/`, `/kalkulator-cinta/`, `/ebook/`, `/about/`, `/contact/`, `/articles/`.
- Existence is not end-to-end navigation, backend correctness, external link availability, or Vercel rewrite verification.

## Browser interaction evidence

Interactions were exercised at 390 × 900 after screenshot capture. Other widths received layout capture, not a full repeated interaction suite.

| Check | Result |
| --- | --- |
| Mobile menu click opens; Enter opens; Space closes | PASS |
| Menu announces `aria-expanded=true` while open | FAIL: expanded state absent |
| Escape closes mobile menu | FAIL: menu stays open |
| Video card click opens modal | PASS |
| Video trigger focus + Enter opens modal | FAIL: trigger is DIV, tabIndex -1, no role |
| Opening modal moves focus inside | FAIL |
| Modal has dialog role and aria-modal | FAIL |
| First Tab after modal opens remains inside | FAIL: focus outside |
| Escape closes modal and clears iframe src | PASS |
| Close-button click closes modal | PASS |
| Overlay click closes modal | PASS |
| Uncaught browser exceptions | PASS: zero pageerror events |

Relevant existing code: menu `index.html:2993`; modal opening/closing `index.html:3188`; click-only video hooks `index.html:3211`; modal markup `index.html:3516`. These six failures were recorded only; no remediation was made. The one-Tab probe is not an exhaustive focus-cycle test. Actual YouTube playback, iframe keyboard behavior, desktop dropdown navigation, screen-reader output, and all touch gestures remain unverified.

## Consent and local analytics

All checks passed: initial consent denied; rejection stored as `bhumi_consent_v1=rejected`; rejection survives reload with panel replaced by manage button; manage reopens panel; Enter on accept stores `accepted` and reports analytics granted; acceptance survives reload; rejection after acceptance revokes consent locally.

`assets/bhumi-consent.js:16` keeps ad storage, ad user data, and ad personalization denied. `assets/bhumi-analytics.js:8` restricts tracking to the two production hosts. After accepted reload and an explicit generic `navigation_click` track call locally, evidence contains only the default-denied consent dataLayer entry: **no GA config, no event, no Google tag script**. Acceptance updates local consent but does not override the host guard. This does not verify real GA4 delivery, production consent transitions, or reporting. No real analytics events were sent locally.

## Console/network: local limitations, not production failures

- Local `/api/bhumi-articles?limit=6` and `/api/wedhaswara-articles` return 404 by static-server design. Console reports `[articles] Bhumi source failed: Error: Bhumi API 404` and `[articles] Wedhaswara source failed: Error: Wedhaswara API 404`. Settled page shows the existing unavailable-articles fallback and its two links (`index.html:3422`).
- The RSS-to-JSON playlist request is deliberately blocked, producing `Bhumi Amartya YouTube Feed API Error: TypeError: Failed to fetch`; six static video cards remain usable for modal click checks (`index.html:3292`).
- Google Fonts CSS, six YouTube thumbnails, RSS-to-JSON, and the opened YouTube embed are blocked (nine unique external URLs across the run). Chromium emits `net::ERR_BLOCKED_BY_CLIENT.Inspector`; external image/font failures are imposed by this harness.
- Console evidence is deduplicated by message text, so the generic resource-error location represents only one occurrence, not all affected resources. HTTP failure URLs are listed independently by the runner.
- No other local HTTP failures were recorded. No uncaught JS exceptions occurred. Console was **not error-free**.
- This run uses HTTP loopback, not `file://`. File-origin fetch/CORS behavior was not tested. Neither file-origin limitations nor these local static-server/API failures establish a production outage. Production availability was not probed at all.

## Screenshots

Full-page PNGs, viewport height 900, device scale factor 1. Captured with no saved consent choice, consent panel visible, menu/modal closed, local assets only, external fonts unavailable, video thumbnails blocked, article fallback settled. The page is scrolled in steps to trigger existing reveal/lazy-load behavior, returned to top, and captured with screenshot animations disabled; no homepage DOM/style fixes are injected.

| Width | Document height | Horizontal overflow | Repository-relative screenshot |
| ---: | ---: | --- | --- |
| 375 | 17201 | None: scrollWidth 375 | `docs/homepage-redesign/baseline/homepage-375.png` |
| 390 | 16971 | None: scrollWidth 390 | `docs/homepage-redesign/baseline/homepage-390.png` |
| 768 | 14210 | None: scrollWidth 768 | `docs/homepage-redesign/baseline/homepage-768.png` |
| 1024 | 10998 | None: scrollWidth 1024 | `docs/homepage-redesign/baseline/homepage-1024.png` |
| 1440 | 9030 | None: scrollWidth 1440 | `docs/homepage-redesign/baseline/homepage-1440.png` |

These are isolated fallback-state baselines, **not production visual parity references**. Fallback fonts affect wrapping and height. Autoplay slider timing is not frozen, so slide state can vary between reruns. No pixel-diff threshold, mobile device emulation, performance score, or exhaustive visual accessibility certification is implied.

## Existing validation and untouched scope

- `package.json:7` supplies only `test:engines` (`node --test tests/*.test.mjs`). The parent session ran `npm --prefix bhumiamartya-homepage run test:engines` with **52 passed, zero failed**. The browser runner did not repeat that command.
- No lint/typecheck scripts are supplied. `node --check docs/homepage-redesign/baseline-check.mjs` passed; this is syntax validation, not a replacement for a project lint/typecheck suite.
- Lighthouse was not resolvable from the existing environment; skipped without installing dependencies. No Lighthouse/Core Web Vitals claims.
- Existing dirty state (`bhumi-amartya-clean`, untracked `bhumi-amartya-content/`, and redesign docs) was left alone.
- The four pre-existing `HOMEPAGE_REDESIGN_DESIGN.md`, `HOMEPAGE_REDESIGN_PRD.md`, `HOMEPAGE_REDESIGN_SOT.md`, and `HOMEPAGE_REDESIGN_TODO.md` were not edited.
- Created only this report, one runnable check, and five screenshots. No Phase 2+ implementation.
