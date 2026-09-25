# PRD — Bhumi Amartya Website Grand Design

**Status:** ACTIVE — implementable requirements. Must stay consistent with `SOT.md` (if it doesn't, `SOT.md` wins) and `GRAND_DESIGN.md`.
**Last updated:** 2026-09-25
**Phase covered by this PRD:** documentation/planning only. See §Non-Goals — no implementation happens under this PRD's authoring session.

## 1. Problem

The current website (`bhumiamartya.my.id`) reads as a collection of standalone reading/calculator tools rather than as one coherent self-discovery ecosystem. Community (Ngopi Ilmu, and the not-yet-built Sobat Mistis identity) is not visible on the homepage. There is no per-system landing page structure suited to ChatGPT Ads or AEO. Some existing copy uses deterministic claim language ("prediksi periode hidup secara presisi" for Vedic Astrology, "takdir bawaan" for Natal Chart) that conflicts with the claim-governance direction this PRD is built on. Documentation was fragmented and did not clearly separate current production state from target design, risking a future coding agent guessing requirements or overwriting working systems.

## 2. Goals

1. Establish one source of truth (`SOT.md`) for positioning, pillars, and guardrails.
2. Make Community (Pilar 3 — Terhubung) an explicit, homepage-prominent pillar.
3. Define a target information architecture that supports one-intent-one-landing-page ChatGPT Ads readiness.
4. Define SEO/AEO/GEO requirements per priority landing page.
5. Define content/claim governance rules distinguishing evidence-based, traditional, contemporary, and esoteric systems.
6. Give the next coding agent enough detail (homepage section order, CTA hierarchy, component requirements, acceptance criteria) to implement without guessing.
7. Leave an accurate, evidence-based CURRENT vs TARGET state so no feature is mistaken as shipped when it is only planned.

## 3. Non-Goals (this phase)

- No redesign implementation.
- No deploy.
- No change to calculation engines (Human Design, Life Path, Destiny Matrix, Natal Chart, Vedic).
- No change to API behavior, database, payment, authentication, or Google Sheets integration.
- No refactor of production code beyond what is strictly required for documentation tooling (target: zero production code changes).
- No route renames/migrations executed now — only documented as target + migration considerations (`GRAND_DESIGN.md` §8).
- No resolution of open product questions (MBTI placement, `/blueprint/` vs `/kenali-diri/personal-blueprint/` naming, relationship between `/tes-kenali-diri/` and the future Personal Blueprint page) — logged as open questions, not decided here.

## 4. Personas (draft — for design orientation, not exhaustive market research)

1. **Curious Explorer** — arrives via a free calculator (Human Design/Life Path/etc.) from search or social; wants a quick, low-commitment answer; low trust in "spiritual" branding; needs epistemic honesty and non-deterministic language to stay engaged.
2. **Self-Growth Seeker** — already believes in self-discovery tools; wants to go deeper (Personal Blueprint, app, journaling); receptive to community invitation.
3. **Community Belonger** — motivated primarily by connection/social learning; discovered Bhumi through a friend or existing Sobat Mistis member; homepage community section and `/komunitas/` page are their primary entry points.
4. **ChatGPT/AI-Search Visitor** — arrives from an AI assistant conversation about a specific system (e.g., "what is Human Design"); needs a landing page matching that exact intent, not a generic homepage.

## 5. Functional Requirements

### 5.1 Homepage
- FR-1: Homepage must not read as a reading-service sales page (no engine/behavior implication — copy/structure only).
- FR-2: Homepage section order must follow `DESIGN.md` §Homepage Section Order.
- FR-3: Homepage must include a Community section positioned no lower than immediately after the free-tools section (never footer-only). See `DESIGN.md` and `COMMUNITY.md`.
- FR-4: Homepage must include a "Ada Apa di Bhumi Minggu Ini?" community-live section driven by structured event data (title, date, status, description, CTA) — see FR-9 (event data model). It must never hardcode a past event as if it were currently active.
- FR-5: Homepage CTAs: primary "Mulai Kenali Diri", secondary "Gabung Komunitas" in the hero; "Lihat Personal Blueprint" in the Personal Blueprint section; per-tool CTAs ("Hitung Human Design", "Hitung Life Path", "Lihat Destiny Matrix", "Buat Natal Chart") in the free-tools section; "Gabung Komunitas Bhumi" + secondary "Lihat Kegiatan Komunitas" in the community section.

### 5.2 Community
- FR-6: A dedicated `/komunitas/` page must exist (target — currently does not exist) covering: purpose, Sobat Mistis identity, Ngopi Ilmu, Ngopi Rasa, Kelas Sobat Mistis, Rabu Bertumbuh, events, join CTA, guidelines, and social proof. Full requirements: `COMMUNITY.md`.
- FR-7: `/ngopi-ilmu/` (existing) must be reachable from and consistent with the Komunitas pillar framing once `/komunitas/` exists (cross-linking, not necessarily a structural merge).

### 5.3 Priority Landing Pages (Kenali Diri)
- FR-8: Each priority system (Human Design, Life Path, Destiny Matrix, Natal Chart, Personal Blueprint) must have its own landing page at the target IA path (`GRAND_DESIGN.md` §7), each satisfying the on-page requirement checklist in §5.4 below.
- FR-9: Event data model for any community/live-event listing must include: `title`, `description`, `date` (ISO), `status` (`upcoming` | `live` | `past`), and optional `cta` (label + url). No event may be displayed as `upcoming`/`live` past its date without an update. Content and rendering implementation are out of scope for this PRD's phase; this is a requirement for the next implementation phase.

### 5.4 Per-Landing-Page Requirement Checklist (applies to each priority page in FR-8)
Every priority landing page must have:
- Unique `<h1>`, unique `<title>`, meta description, canonical URL.
- A clear, jargon-appropriate definition of the system consistent with its epistemic category (`SOT.md` §9).
- A calculator/tool where one is technically available (reuse existing engine — no new engine work).
- FAQ section.
- Internal linking to related systems and to Personal Blueprint.
- Related content links (`/articles/`).
- Personal Blueprint CTA.
- Community CTA.
- Disclaimer appropriate to its epistemic category.
- Structured data per `SEO_AEO_GEO.md` priority list.

### 5.5 Methodology
- FR-10: `/methodology/` (existing) must be updated (future phase) to explicitly state the four-category epistemic split (`SOT.md` §9) and link to `/disclaimer/`. Not changed in this documentation phase.

### 5.6 Compliance
- FR-11: No page may state or imply psychological diagnosis, therapy, medical treatment, or guaranteed/deterministic outcomes. See `CONTENT_GOVERNANCE.md`.
- FR-12: `/disclaimer/`, `/privacy-policy/`, `/terms/` (all existing) must remain accurate to actual data handling; any copy change is a future-phase content task, reviewed against `CONTENT_GOVERNANCE.md`.

### 5.7 SEO/AEO/GEO
- FR-13: Structured data priority order and `robots.txt`/AI-crawler verification requirements: see `SEO_AEO_GEO.md`. No speculative crawler-policy change in this phase.

### 5.8 Analytics
- FR-14: Each CTA and journey stage transition (DISCOVER→EXPLORE→...→GROW) should be instrumentable as a distinct analytics event in a future implementation phase (e.g., `cta_click_mulai_kenali_diri`, `community_join_click`, `tool_result_viewed`). This PRD does not mandate a specific analytics vendor/implementation; current homepage analytics wiring (a script referencing `analytics.js`) was found in the audit but not characterized further — instrumentation design is future-phase work.

## 6. Acceptance Criteria (for this documentation phase)

- [x] `docs/SOT.md` exists and captures positioning, four pillars, main product, homepage priority, journey, community, health guardrail, epistemology, ChatGPT Ads direction, technical guardrails.
- [x] `docs/GRAND_DESIGN.md` exists and is consistent with `SOT.md`.
- [x] `docs/PRD.md` (this file) is consistent with `SOT.md` and `GRAND_DESIGN.md`.
- [x] `docs/DESIGN.md` is consistent with this PRD.
- [x] `docs/TODO.md` reflects Grand Design priorities (P0–P3) and does not mark targets as done.
- [x] `docs/COMMUNITY.md` fully documents the Terhubung pillar.
- [x] `docs/CONTENT_GOVERNANCE.md` documents claim/epistemic rules including the current-copy violations found in this audit.
- [x] `docs/CHATGPT_ADS_READINESS.md` documents priority/funnel/one-intent-one-page requirements.
- [x] `docs/SEO_AEO_GEO.md` documents per-page and structured-data requirements.
- [x] `README.md` points a new developer to all of the above without becoming a long document.
- [x] `FEATURE_PARITY_MATRIX.md` retains its existing parity data and gains a "Grand Design Alignment" section reflecting verified (not assumed) status.
- [x] Existing technical docs (`website-app-isolation-backlog.md`, `blueprint-engines-*.md`, `*_AUTOPUBLISH.md`) are not deleted or contradicted; superseded content is flagged in place.
- [x] Zero production code changes; no deploy; no engine changes.

## 7. Open Questions

1. Should `/tes-kenali-diri/` be merged into the future `/kenali-diri/personal-blueprint/` page, redirected, or kept as a separate "quick test" funnel step ahead of the full Personal Blueprint page?
2. Where does MBTI (`/kenali-diri/mbti/`, existing) belong once the four-pillar IA is implemented — kept as a bonus Kenali Diri tool, moved elsewhere, or deprecated?
3. Should the internal `/blueprint/` calculator wrapper be renamed/relocated to avoid confusion with the new public `/kenali-diri/personal-blueprint/` page, or kept as an internal-only tool with `noindex`?
4. What is the actual current analytics implementation (the homepage references an `analytics.js` script) — is it GA4, a custom event pipe, or something else? Needed before FR-14 instrumentation can be scoped precisely.
5. Who owns the copy rewrite for the flagged claim-governance violations (Vedic Astrology "prediksi ... presisi", Natal Chart "takdir bawaan") — content team or the next coding agent, and on what timeline?
