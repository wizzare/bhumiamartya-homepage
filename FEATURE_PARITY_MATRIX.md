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
| Homepage ecosystem positioning (target section order incl. Community) | **EXISTING (Phase 1, 2026-09-25)** | `index.html` restructured: Hero → Personal Blueprint → Mulai dari Sini (free tools) → Komunitas Bhumi Amartya → Ruang Bertumbuh di Bhumi → Bertumbuh → Ngopi Ilmu → Produk (reframed) → Youtube → Tentang/Testimoni/Founder (trust block) → Download CTA |
| Community prominent on homepage | **EXISTING (Phase 1)** | New `#komunitas` section ("Tidak Harus Bertumbuh Sendirian") placed directly after the free-tools section, with Sobat Mistis / Ngopi Ilmu / Ngopi Rasa cards and CTA row — not footer-only |
| Community page (`/komunitas/`) | PLANNED | Still does not exist; explicitly out of scope for Phase 1 (homepage only) |
| Personal Blueprint homepage section (`Satu Diri. Berbagai Perspektif.`) | **EXISTING (Phase 1)** | Repurposed the former "11 Sistem Bhumi" section: 9 core systems (Human Design, Life Path, Numerologi, Destiny Matrix, Natal Chart, Weton, BaZi, Vedic Astrology, Tzolkin) per `docs/SOT.md` §3 Pilar 1; Whole Sign/Astrokartografi/Zi Wei Dou Shu cards removed from this section (not in SOT's core list) |
| Free self-discovery tools surfaced on homepage | **EXISTING (Phase 1)** | New "Mulai dari Sini" section with Human Design / Life Path / Destiny Matrix / Natal Chart cards; all four link to verified existing calculation flows (see Temporary CTA Mappings in the Phase 1 report) |
| Human Design intent landing (`/kenali-diri/human-design/`) | EXISTING + needs alignment | Page itself unchanged in Phase 1 (homepage-only scope); still not checked against full `docs/PRD.md` §5.4 checklist; 1 known regression test failure (see below) |
| Life Path landing | PLANNED | Still no dedicated page; Life Path is a field inside `/tes-kenali-diri/` only. Homepage now links to it via a "Hitung Life Path" CTA as an interim measure |
| Destiny Matrix landing | PLANNED | Engine exists (`lib/destiny-matrix/calculate.mjs`); still no dedicated public landing page. Homepage links to `/tes-kenali-diri/` (Arcana Center field) as an interim measure |
| Natal Chart landing | PLANNED | Engine exists (`lib/natal-chart/calculate.mjs`); still no dedicated public landing page. Homepage links to `/tes-kenali-diri/` (Sun Natal Chart field) as an interim measure |
| Personal Blueprint public landing (`/kenali-diri/personal-blueprint/`) | PLANNED | `/blueprint/` still exists only as an internal calculator wrapper, not the public umbrella page. Homepage's "Lihat Personal Blueprint" CTA temporarily points to `/tes-kenali-diri/` |
| Vedic engine (`lib/vedic/`) | EXISTING — NEEDS REVIEW | Unchanged in Phase 1. Files present; `POST /api/blueprint-engines` endpoint exists and its test passes; not independently re-validated against `docs/blueprint-engines-test-plan.md` fixtures |
| Human Design engine regression | NEEDS REVIEW — unchanged | Re-ran `npm install && npm run test:engines` on 2026-09-25 during Phase 1: still 95/96 tests pass; `tests/engines-fixture-a.test.mjs` still fails — expected strategy `"To Respond"`, engine returned `"Wait to Respond"`. Not touched in Phase 1 (engine changes explicitly out of scope); still open in `docs/TODO.md` P0 |
| Methodology alignment (`/methodology/`) | NEEDS REVIEW — unchanged | Page not touched in Phase 1 (homepage-only scope) |
| ChatGPT Ads readiness | NOT READY / PARTIAL — unchanged | Only Human Design has any dedicated landing page among the 5 priority systems; see `docs/CHATGPT_ADS_READINESS.md` §4. Phase 1 did not add new landing pages |
| SEO/AEO baseline | PARTIAL — unchanged | Homepage JSON-LD (Organization/WebSite/Person/PostalAddress/WebPage) untouched except the `PostalAddress` location fix below; no schema types added in Phase 1 |
| Website/app isolation | PARTIAL (unchanged) | Phase 1 was homepage-copy-only; no isolation refactor performed. `docs/website-app-isolation-backlog.md` still accurate |
| Claim governance / content compliance (homepage) | **FIXED (Phase 1, homepage only)** | `index.html` copy revised per `docs/CONTENT_GOVERNANCE.md`: removed "prediksi periode hidup secara presisi" (Vedic Astrology), "takdir bawaan" (Natal Chart), softened "pola takdir" (Numerologi), "tugas karma" (Destiny Matrix), "Empat Pilar Takdir" (BaZi), and the "metode ilmiah ... metafisika" scientific-framing claim in the "Tentang Bhumi" section. Other pages (articles, `/methodology/`, etc.) not audited in Phase 1 |
| Business location: Nusa Dua, Bali, Indonesia | **PARTIAL (Phase 1)** | Fixed in `index.html` (visible copy + founder section + footer + `PostalAddress` JSON-LD) and in `about/index.html` / `contact/index.html` footer/contact-info blocks. **Still shows the old "Jakarta Timur, DKI Jakarta, Indonesia" address in `privacy-policy/index.html` (2 occurrences) and `terms/index.html` (1 occurrence)** — these were outside Phase 1's explicit git scope (only `index.html`, `about/index.html`, `contact/index.html` were authorized) and were left unchanged; flagged as a follow-up, not silently fixed |
| Menu / navigation redesign | **Not performed — deferred**, as required | Global nav/menu structure in `index.html` (and other pages) is untouched; Komunitas is reachable only via the new `#komunitas` anchor and CTAs, not a new top-level nav item |

This section will go stale the moment any of the above is implemented — update it by re-checking the repository, not by assuming a TODO item was completed.
