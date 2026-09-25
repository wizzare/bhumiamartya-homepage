# Source of Truth (SOT) — Bhumi Amartya Product & Website

**Status:** ACTIVE — highest-authority product decision document.
**Scope:** Product positioning, brand, pillars, journey, and guardrails for `wizzare/bhumiamartya-homepage` (production: https://bhumiamartya.my.id).
**Last updated:** 2026-09-25
**Precedence rule:** If any other document (`GRAND_DESIGN.md`, `PRD.md`, `DESIGN.md`, `TODO.md`, `COMMUNITY.md`, `CONTENT_GOVERNANCE.md`, `CHATGPT_ADS_READINESS.md`, `SEO_AEO_GEO.md`, or any technical doc) conflicts with this file, that conflict must be logged (see `FEATURE_PARITY_MATRIX.md` → "Grand Design Alignment") and this file wins until explicitly revised.

This document captures **decisions**, not implementation detail. It does not change any production code, API, or calculation engine.

---

## 1. Positioning

Bhumi Amartya is **not** a spiritual-reading service website. It is a **self-discovery, personal-growth, and community ecosystem** that helps people recognize their own patterns through multiple Personal Blueprint systems, reflection, learning, and community.

- **Tagline:** Ruang Untuk Pulang dan Kenali Diri
- **Supporting line:** Kenali dirimu. Pahami polamu. Bertumbuh dengan caramu.
- **North-star journey:** Kenali Diri → Pahami Pola → Bertumbuh → Terhubung → Menjalani Hidup Lebih Sadar

Bhumi does not tell someone definitively who they are. Bhumi provides: perspective, reflection tools, Personal Blueprint, content, practice, an app, and a community.

## 2. Brand

- Visual character: earthy + modern + human + warm + digital.
- Avoid: overly occult, overly dark, mystical cliché, overly clinical.
- Spiritual character may remain present, but subtle — never the dominant visual language.
- Voice: invitational, reflective, non-deterministic (see §9 Content Epistemology and §10 Claim Governance).

## 3. Four Pillars

All documentation and product surfaces must stay consistent with these four pillars.

### Pilar 1 — Kenali Diri
Human Design, Life Path, Numerologi, Destiny Matrix, Natal Chart, Weton, BaZi, Vedic Astrology, Tzolkin, and Personal Blueprint. These systems are **perspectives / entry points**, not nine fragmented flagship products.

**Umbrella product:** Personal Blueprint — *Satu Diri. Berbagai Perspektif.*

### Pilar 2 — Bertumbuh
Self Awareness, Emotional Awareness, Inner Work, Mindfulness, Relationship, Career, Finance, Life Skill, Personal Growth, General Wellbeing.

### Pilar 3 — Terhubung
Community is a major pillar, not an accessory or a WhatsApp link.

- Public name: **Komunitas Bhumi Amartya**
- Identity: **Sobat Mistis** — MISTIS = *Meeting Spiritual Tiap Saat*
- Programs: Ngopi Ilmu, Ngopi Rasa, Rabu Bertumbuh, Kelas Sobat Mistis, community events.
- Role: engagement layer, retention layer, social proof, learning space, growth engine.
- Full detail: see `COMMUNITY.md`.

### Pilar 4 — Menjalani
Blueprint insight does not stop at the result. Users are directed toward daily practice, reflection, the Bhumi app, journaling, inner work, wellness, journeys, classes, and community.

## 4. Main Product

**Personal Blueprint — Satu Diri. Berbagai Perspektif.** The umbrella product across all Kenali Diri systems. Individual systems (Human Design, Life Path, etc.) are entry points/perspectives feeding into this umbrella, not competing standalone products.

## 5. Homepage Priority

Homepage sells **trust + curiosity + ecosystem**, not a reading-service sales page.

Target section order (detail in `DESIGN.md`):
1. Hero — "Kenali Dirimu Lebih Dalam"
2. Personal Blueprint — "Satu Diri. Berbagai Perspektif."
3. Free Self-Discovery Tools (Human Design → Life Path → Destiny Matrix → Natal Chart)
4. Community — "Tidak Harus Bertumbuh Sendirian" (must appear high on the page, never footer-only)
5. Community Live — "Ada Apa di Bhumi Minggu Ini?"

## 6. Customer Journey

```
DISCOVER → EXPLORE → UNDERSTAND → DEEP DIVE → PRACTICE → CONNECT → GROW
```

- **DISCOVER**: Google, ChatGPT/AI search, TikTok, Instagram, YouTube, community, referral.
- **EXPLORE**: free tools — Human Design, Life Path, Destiny Matrix, Natal Chart, Tes Kenali Diri.
- **UNDERSTAND**: short result + related articles.
- **DEEP DIVE**: Personal Blueprint Bhumi.
- **PRACTICE**: app, journal, reflection, inner work, Ngopi Ilmu, Ngopi Rasa.
- **CONNECT**: Komunitas Bhumi Amartya.
- **GROW**: classes, events, consultations, programs.

Full detail: `GRAND_DESIGN.md`.

## 7. Community

Community is an explicit pillar (Pilar 3 — Terhubung), must be prominent on the homepage (not footer-only), and is documented fully in `COMMUNITY.md`.

## 8. Health & Mental-Health Guardrail

Bhumi is **not** positioned as a psychological clinic, mental-health diagnosis provider, therapy service, medical treatment, or a replacement for professional mental-health services.

- Prefer: wellbeing, emotional awareness, mindfulness, self-reflection, inner work, personal growth.
- Avoid advertising claims of: healing trauma, healing depression, healing anxiety, diagnosing mental conditions.
- Mental-health *education* content may exist as long as framing stays within the boundaries above.

## 9. Content Epistemology

Documentation and copy must distinguish four categories and never blur them:

| Category | Examples | Rule |
| --- | --- | --- |
| Evidence-based knowledge | Psychology, wellbeing, neuroscience, behavioral science | May cite scientific fact; use appropriate references |
| Traditional systems | Weton, BaZi, Vedic Astrology/Jyotish | Present as tradition, not proven science |
| Contemporary self-discovery systems | Human Design | Present as contemporary system, not proven science |
| Esoteric / reflective systems | Numerology, Destiny Matrix, astrology, spiritual reflection | Present as reflective/exploratory, not proven science |

**Never** state that all Bhumi systems are "terbukti secara ilmiah" or "berbasis ilmiah" when the claim covers non-scientific systems. Prefer "pendekatan multidisiplin" or "berbagai perspektif self-discovery dan refleksi diri."

## 10. Claim Governance (summary — full rules in `CONTENT_GOVERNANCE.md`)

Prefer: kenali, eksplorasi, pahami, perspektif, refleksi, pola, kecenderungan, potensi, perjalanan, bertumbuh.

Avoid unsupported deterministic wording: takdir pasti, prediksi presisi, masa depan pasti, dijamin, jodoh pasti, rezeki pasti, diagnosis, penyembuhan, scientific proof without evidence.

> **Known current-copy violation (found during this audit):** the live homepage "11 Sistem Bhumi" section describes Vedic Astrology as using "prediksi periode hidup secara presisi" — this is the exact deterministic phrasing this SOT prohibits. Natal Chart copy also uses "takdir bawaan." These are flagged in `CONTENT_GOVERNANCE.md` and `TODO.md` (P0) as existing content requiring revision in a future content-editing phase. **No copy was changed in this documentation-only phase.**

## 11. ChatGPT Ads Direction (summary — full detail in `CHATGPT_ADS_READINESS.md`)

Priority order: Human Design → Life Path → Destiny Matrix → Natal Chart → Personal Blueprint / Self Discovery.
Principle: one intent → one relevant landing page. Never route every ad to the homepage.

## 12. Technical Guardrails

- No redesign implementation in this phase; documentation/planning only.
- No deploy.
- No change to calculation engines (Human Design, Life Path, Destiny Matrix, Natal Chart).
- No change to API behavior, database, payment, authentication, or Google Sheets integration.
- Redesign must not add new runtime dependency on the app (`bhumi-amartya-clean.vercel.app`); existing dependency should be reduced over time per `docs/website-app-isolation-backlog.md`. Redesign and engine migration are separate concerns — see `GRAND_DESIGN.md` §Website ↔ App ↔ Community relationship.

## 13. Current vs Target

This SOT describes the **target** product direction. It does not claim any of this is already implemented. See `FEATURE_PARITY_MATRIX.md` → "Grand Design Alignment" for a route-by-route CURRENT vs TARGET status, and `PRD.md` §Non-Goals for what is explicitly out of scope for this phase.
