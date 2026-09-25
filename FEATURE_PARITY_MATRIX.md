# Feature-Parity Matrix

## Baseline Menu

| Item | Status |
| --- | --- |
| Beranda | Aktif |
| Kenali Diri | Aktif |
| Produk | Aktif |
| Konten | Aktif |
| Tentang | Aktif |
| Kontak | Aktif |

## Fitur

| Fitur | URL | Status Target |
| --- | --- | --- |
| Tes Kenali Diri | `/tes-kenali-diri/` | Aktif |
| Personal Blueprint inline | `/tes-kenali-diri/` | Tampil setelah hasil sukses |
| Blueprint Reading legacy | `/reading/` | Redirect permanen |
| Blueprint product legacy | `/produk/blueprint-reading/` | Redirect permanen |
| Compatibility Reading | `/kalkulator-cinta/` | Aktif |

## Linked Tools

| Tool | URL | Status |
| --- | --- | --- |
| Cek Aura | `/cek-aura/` | Aktif; masih memakai endpoint aplikasi |
| Cek Weton | `/weton/` | Aktif |
| Kalkulator Cinta | `/kalkulator-cinta/` | Aktif; masih memakai endpoint aplikasi |
| Human Design | `/kenali-diri/human-design/` | Aktif; masih memakai endpoint aplikasi |
| MBTI | `/kenali-diri/mbti/` | Aktif |

## Blueprint Engines

| Engine | Status | Feasibility |
| --- | --- | --- |
| Human Design | **Existing lib available** | **GO** |
| Vedic (Moon-only) | **Not implemented** | **CONDITIONAL GO** |
| Human Design + Vedic integration | **Design spike complete** | Pending approval |

## Endpoint

| Endpoint | Method | Status |
| --- | --- | --- |
| `/api/reading` | POST | Aktif |
| `/api/blueprint-engines` | POST | **Design spike complete** |
| `/api/blueprint.mjs` | POST | Existing (HD + Destiny Matrix + Natal) |

## Personal Blueprint / Self-Test Acceptance

| Item | Status |
| --- | --- |
| Runtime isolation `/tes-kenali-diri/` | PASS |
| Runtime request `/tes-kenali-diri/` ke `bhumi-amartya-clean.vercel.app` | 0 |
| Life Path parity | PASS untuk fixture A/B/C terhadap endpoint lama |
| Arcana parity | PASS untuk fixture A/B/C terhadap endpoint lama |
| Sun Sign parity | PASS untuk fixture A/B/C terhadap endpoint lama |
| Weton parity | PASS untuk fixture A/B/C terhadap endpoint lama |
| BaZi parity | PASS secara nilai; label lokal memakai `Air`, baseline API memakai `Water` |
| Tzolkin parity | PASS secara nilai Kin/Tone; baseline API menambahkan nama Maya dalam tanda kurung |
| Human Design calculation | PLACEHOLDER; website belum memiliki engine lokal |
| Vedic calculation | PLACEHOLDER; website belum memiliki engine lokal |
| Kalkulasi lokal | Primary untuk `/tes-kenali-diri/`; bukan fallback |
| Error UX | Inline, non-blocking |
| Google Sheets append | BLOCKED: Preview credential belum tersedia |
| WhatsApp end-to-end | MOCK ONLY sampai append nyata tersedia |
| Global website-app isolation | PARTIAL; `/cek-aura/`, `/kalkulator-cinta/`, dan `/kenali-diri/human-design/` masih bergantung pada aplikasi |
| Human Design engine (website) | **Existing** di `lib/human-design/` |
| Vedic engine (website) | **Not implemented** |

> **Superseded note (2026-09-25):** the two rows above and the "Blueprint Engines" table's Vedic/integration rows near the top of this file describe an earlier state. As of this audit, `lib/vedic/` **exists** (`constants.mjs`, `ayanamsa.mjs`, `rashi.mjs`, `moon-position.mjs`, `calculate.mjs`, `nakshatra.mjs`, `vimshottari.mjs`, `julian.mjs`), and `api/blueprint-engines.mjs` **exists** and has a passing test (`tests/api-blueprint-engines.test.mjs`). This file's older rows are being kept as historical record rather than rewritten in place; treat the "Grand Design Alignment" section below as the current status for these items. See `docs/blueprint-engines-feasibility.md`'s own status header for the same note.

## Grand Design Alignment

Status legend: **EXISTING** (verified present in this repo), **PLANNED** (documented target, not yet built), **PARTIAL** (some but not full implementation), **NEEDS REVIEW** (exists but correctness/compliance not fully verified).

Full detail and evidence: `docs/SOT.md`, `docs/GRAND_DESIGN.md`, `docs/PRD.md`, `docs/CHATGPT_ADS_READINESS.md`, `docs/SEO_AEO_GEO.md`.

| Item | Status | Evidence |
| --- | --- | --- |
| Homepage ecosystem positioning (target section order incl. Community) | PLANNED | Current `index.html` order audited in `docs/DESIGN.md` §2; Community not yet positioned per target |
| Community prominent on homepage | PLANNED | No "Komunitas"/"Sobat Mistis" branded section on homepage; only "Ngopi Ilmu" exists as a section |
| Community page (`/komunitas/`) | PLANNED | No `/komunitas/` route exists in this repository |
| Human Design intent landing (`/kenali-diri/human-design/`) | EXISTING + needs alignment | Page exists; not yet checked against full `docs/PRD.md` §5.4 checklist; 1 known regression test failure (see below) |
| Life Path landing | PLANNED | No dedicated page; Life Path is currently a field inside `/tes-kenali-diri/` only |
| Destiny Matrix landing | PLANNED | Engine exists (`lib/destiny-matrix/calculate.mjs`); no public landing page |
| Natal Chart landing | PLANNED | Engine exists (`lib/natal-chart/calculate.mjs`); no public landing page |
| Personal Blueprint public landing (`/kenali-diri/personal-blueprint/`) | PLANNED | `/blueprint/` exists but is an internal calculator wrapper, not the public umbrella page |
| Vedic engine (`lib/vedic/`) | EXISTING — NEEDS REVIEW | Files present; `POST /api/blueprint-engines` endpoint exists and its test passes; not independently re-validated against `docs/blueprint-engines-test-plan.md` fixtures in this audit |
| Human Design engine regression | NEEDS REVIEW | After `npm install && npm run test:engines` (2026-09-25): 95/96 tests pass; `tests/engines-fixture-a.test.mjs` fails — expected strategy `"To Respond"`, engine returned `"Wait to Respond"`. Not fixed in this documentation-only task; routed to `docs/TODO.md` P0 |
| Methodology alignment (`/methodology/`) | NEEDS REVIEW | Page exists; not yet updated to state the four-category epistemic split from `docs/SOT.md` §9 |
| ChatGPT Ads readiness | NOT READY / PARTIAL | Only Human Design has any landing page among the 5 priority systems; see `docs/CHATGPT_ADS_READINESS.md` §4 |
| SEO/AEO baseline | PARTIAL | Homepage has Organization/WebSite/Person/PostalAddress/WebPage JSON-LD and a working sitemap; missing WebApplication/BreadcrumbList/Article/FAQPage schema; per-page audit not yet done; see `docs/SEO_AEO_GEO.md` |
| Website/app isolation | PARTIAL (unchanged) | `docs/website-app-isolation-backlog.md` still accurate: `/cek-aura/`, `/kalkulator-cinta/`, `/kenali-diri/human-design/`, and `vercel.json` `/_next/`, `/images/`, `/founder/` rewrites still depend on `bhumi-amartya-clean.vercel.app` |
| Claim governance / content compliance | NEEDS REVIEW — violations found | Live homepage copy for Vedic Astrology and Natal Chart uses deterministic wording prohibited by `docs/CONTENT_GOVERNANCE.md` §10; not fixed in this documentation-only task |

This section will go stale the moment any of the above is implemented — update it by re-checking the repository, not by assuming a TODO item was completed.
