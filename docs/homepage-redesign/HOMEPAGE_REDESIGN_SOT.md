# Homepage redesign — authoritative Phase 0/1 foundation (SOT)

Date: 2026-09-08. Status: FOUNDATION_RECORDED — REVIEW_PENDING; not ratified or implementation approval.
Repository: `C:/Users/shein/bhumiamartya.my.id/bhumiamartya-homepage`.
Verified branch: `feat/homepage-redesign-2026`.
Baseline HEAD: `cde1747b7b0fd7306a03c0849a721fb114a201b0`.
CANONICAL_DOCS_PATH=`C:/Users/shein/bhumiamartya.my.id/bhumiamartya-homepage/docs/homepage-redesign/`.
Outside-repository duplicates in `../docs/` are preserved historical copies with SUPERSEDED banners and explicit links here; do not edit those copies as parallel specifications.
Branch was created from the existing HEAD while the unrelated child was dirty; no reset/stash/discard occurred. This preserved work but did not satisfy the requested report-before-branch sequence; no further Git mutation is authorized.

## Authority and scope

The latest user requirements override all prior phase numbering and instructions in these four documents. This SOT owns evidence boundaries and content mapping; [PRD](HOMEPAGE_REDESIGN_PRD.md) owns requirement IDs and analytics; [DESIGN](HOMEPAGE_REDESIGN_DESIGN.md) owns proposed presentation/token mapping; [TODO](HOMEPAGE_REDESIGN_TODO.md) owns checked work and gates. Older copies outside this directory are not authoritative for this task.

Phase 0 = existing-source and baseline review. Phase 1 = documentation-only foundation. Next is exactly **Phase 2 — Hero Redesign**, STOP gated by explicit user approval. No source redesign, commits, deployment, DB access, helper deployment, or production configuration changes in Phase 0/1. Only the four `HOMEPAGE_REDESIGN_{SOT,PRD,DESIGN,TODO}.md` files are owned for editing here; sibling baseline artifacts are read-only.

Read-only Git inspection confirms preserved dirty child gitlink `e4a4b3872c59ab7dbeda6cad229e1f3bc222e603` → `783791117255ff2d8bc2e1b0d8d595a055d2c6ad`, with child untracked `app/api/verify-db/route.ts`. Parent also has untracked content/docs. No reset, cleanup, staging, or child edits. `git submodule status` fails because `.gitmodules` has no mapping; direct child status/HEAD inspection confirms the state without repairing it.

## Evidence boundary (HOME-REQ-001)

- Requested `AUDIT_HOMEPAGE_BHUMI_AMARTYA_2026-09-08.md` was NOT found in the searched workspace. It has not been read. The old July audit is not current evidence and supplies no present metrics or conclusions.
- Current source was read directly: root `index.html`, analytics, consent, AdSense and shared CSS assets, `package.json`, README, `vercel.json`, and terms/privacy/disclaimer/methodology pages.
- [HOMEPAGE_BASELINE.md](HOMEPAGE_BASELINE.md) is the sibling agent's authoritative local DOM, interaction, metrics and screenshot report. Consult its source hash, reproduction commands, tables and limitations rather than treating this record as an independent run. Its screenshots are isolated fallback-state references, not production visual parity.
- Repository-confirmed means source text, file existence or configuration, NOT working production navigation, app installation, backend output or delivered analytics. User confusion and conversion impact are hypotheses, not measured findings.
- Prior invented testimonials, founder quotation, report-page counts, user statistics, percentage uplifts, Lighthouse score, mandatory byte budget and ratified status are withdrawn, not evidence.

## Verified architecture

`index.html` is a static HTML homepage with hardcoded editorial/navigation content, inline CSS (`index.html:81–2108`) and a DOMContentLoaded vanilla-JS controller (`index.html:2990–3513`). There is no homepage React/Next rendering or bundler requirement. The shared `assets/bhumi-design-system.css` exists but is NOT linked by root index; privacy policy links it at `privacy-policy/index.html:26`.

Dynamic exceptions: article slots request BOTH `/api/bhumi-articles?limit=6` and `/api/wedhaswara-articles` concurrently with `Promise.allSettled` (`index.html:3471`), interleave sources (`3385`), and render an empty/error fallback (`3422`). Wedhaswara is not merely a sequential fallback. YouTube requests an RSS-to-JSON playlist, with six static fallback cards and a JS modal (`2518`, `3227`). No database-backed homepage content-map migration is needed.

`package.json:4–16` declares Node 20.x, ES modules, only `test:engines`, and existing Firestore/OIDC/astronomy/geo/auth dependencies. `vercel.json` configures serverless function limits, ebook/reading redirects, article/ebook detail rewrites, remote founder and Next asset proxies, and a WordPress article proxy. Those remote proxies do not make the root homepage Next.js. Root canonical metadata is `https://www.bhumiamartya.my.id/` (`index.html:12`); apex redirect behavior is not verified by this config or locally. JSON-LD contains Organization, WebSite and WebPage (`28`); no new FAQ schema is required.

## CTA decision (HOME-REQ-002)

| Role | Planned label | Exact navigation destination | Evidence/status |
| --- | --- | --- | --- |
| Primary | Kenali Diri Saya | `/tes-kenali-diri/` | Existing href `index.html:2184`; local existence in baseline; live availability unknown |
| Secondary | Download Aplikasi | `https://play.google.com/store/apps/details?id=com.bhumiamartya.app` | Exact existing href `index.html:2183`, `2501`, `2917`; package ID repository-confirmed; live listing, regional availability and installation unknown |

Hero currently has seven primary-styled links (`2182–2189`). Target is two hierarchical CTAs, not seven competing primary styles. Preserve access to the other tools via navigation and the planned static directory. Do not promise instant results, no registration, app features, price or installation success without verification. Analytics destination is query-free and is NOT the literal Play href (PRD contract).

## Hardcoded static HTML content map (HOME-REQ-003)

This is a documentation map for later direct HTML edits, not a new JSON registry, CMS, component layer or runtime renderer.

| Existing block/source | Actual content/destinations | Foundation disposition |
| --- | --- | --- |
| Navigation `2115–2171` | Beranda `#beranda`; Kenali Diri dropdown: six tools below; Produk: Aplikasi `#produk`, Blueprint `/tes-kenali-diri/`, Reiki `#produk`, Ebook `ebook/`; Konten `#youtube`, `#artikel`, `#testimoni`; Tentang `about/`, Our Team/Founder `#founder`; Kontak `contact/` | Preserve routes; relabel ethics/team accurately; four `href="#"` dropdown controls are placeholders, not missing pages |
| Hero `2174–2223` | H1 Ruang untuk Pulang dan Kenali Diri, platform introduction, seven links, logo/mandala | Two-CTA decision above; copy/visual approval pending |
| About `2226–2271` | Philosophy and platform description; two feature blocks | Preserve useful introduction, remove unverified scientific/outcome promises in later approved copy |
| Systems `2274–2431` | Numerologi; Human Design; Natal Chart; Destiny Matrix; Weton Jawa; BaZi; Vedic Astrology; Tzolkin Maya; Whole Sign; Astrokartografi; Zi Wei Dou Shu | Eleven source cards, not proof of eleven working engines, consensus or scientific validation |
| Products `2434–2506` | Blueprint Reading → `/tes-kenali-diri/`; Compatibility Reading → `/kalkulator-cinta/`; Reiki dan Sound Healing → existing WhatsApp href with prefilled text at `2485`; Bhumi App → exact Play URL | Actual fourth card is App, not Ebook. Preserve link intent; commercial terms and claims await founder evidence; never send WhatsApp query to analytics |
| YouTube `2509–2632` | Playlist link and six fallback video cards | Preserve dynamic/fallback distinction; accessibility backlog in DESIGN |
| Articles `2637–2711`, `3299–3506` | Two-source feed, skeletons and fallback links `/articles/`, `https://wedhaswara.my.id/` | Preserve safe empty/error navigation; live feed/backend unknown |
| Ethics `2714–2835` | Baca Perlahan; Periksa Konteks; Coba Secara Bertahap; Kenali Batasnya; Tinjau Kembali | These are guidelines, NOT testimonials, despite quote/star styling and `#testimoni` |
| Founder `2838–2909` | Widhi Wedhaswara, founder; external bio `https://wedhaswara.my.id`; Metodologi Transparan; Hubungi Pengelola | One person versus two concepts/support functions; do not invent additional people, credentials or founder quotation |
| Final CTA `2912–2926` | Play link plus `#tentang` | Planned primary/secondary hierarchy follows hero |
| Footer `2929–2980` | Social links, contact text, copyright, creator link; no legal nav | Add legal/trust routes in later authorized work; external/social availability remains unknown |

### Free tools directory map

| Static item key | Label | Existing route |
| --- | --- | --- |
| tes_kenali_diri | Tes Kenali Diri | `/tes-kenali-diri/` |
| weton | Cek Weton | `/weton/` |
| cek_aura | Cek Aura | `/cek-aura/` |
| kalkulator_cinta | Kalkulator Cinta | `/kalkulator-cinta/` |
| human_design | Human Design | `/kenali-diri/human-design/` |
| mbti | MBTI | `/kenali-diri/mbti/` |

Source: `index.html:2128–2133`, `2184–2189`; baseline verifies local file resolution only. A tool click is navigation, not `tool_started` or completion.

### Legal and trust map (HOME-REQ-005)

Proposed footer destinations: `/about/`, `/contact/`, `/methodology/`, `/terms/`, `/privacy-policy/`, `/disclaimer/`. Legal source files exist; baseline's existing homepage-link results do not independently certify all newly proposed links or production responses. Ebook navigation currently uses `/ebook/`; `vercel.json:34–41` declares redirect to `/ebooks/`, not runtime proof.

`methodology/index.html:16–20` distinguishes input, calculation, interpretation and facts; consistent calculations do not establish scientific truth. `disclaimer/index.html:16–20` excludes diagnosis, therapy, guaranteed outcomes and professional advice. `terms/index.html:19` defers commercial promises until verified. `privacy-policy/index.html:209–214` requires consent and generic events without names, birth data, journals, results or PDFs. Its app/cloud/encryption claims (`124–144`) are policy text, not independently verified functionality. Its footer Bali location (`282`) conflicts with its Jakarta operator description (`217`); flag for owner review, do not silently certify cross-page consensus.

## Unverified claims and blocked material (HOME-REQ-004)

Social proof: **BLOCKED_FOUNDER_INPUT — Option A**. No production render until approved. No example quotes, initials, professions, stars, usage counts or empty testimonial carousel. Founder must supply authentic source, exact approved quotation, attribution/privacy permission, service context and publication approval. Existing ethics should later become plain responsible-use guidance, not reviews. This docs-only task does not remove current production/source styling.

Cross-system consensus, automatic synthesis, identity graph, synced history, daily app features, clinical benefits, accuracy, popularity, report length, pricing and guarantees remain unverified; none is a ratified capability or roadmap commitment. Neutral descriptions may describe reflective perspectives, not mutual confirmation or proven outcomes.

## Foundation gate

**UNRESOLVED — STOP.** User review/approval is required before **Phase 2 — Hero Redesign**. Founder-dependent material stays blocked; omission under Option A can be explicitly accepted without fabricating proof. Runtime/live/link/performance gaps must be resolved or explicitly accepted with scope before proceeding; approval is not inferred from this record. **CSS-CONSOLIDATION: DEFERRED_UNTIL_VISUAL_BASELINE_STABLE**; CSS extraction is NOT a prerequisite for hero work. No new design system.
