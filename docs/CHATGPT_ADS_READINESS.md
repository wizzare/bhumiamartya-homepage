# ChatGPT Ads Readiness

**Status:** ACTIVE — target readiness plan. Current readiness assessed as **NOT READY / PARTIAL** (see §4).
**Must stay consistent with:** `SOT.md` §11, `GRAND_DESIGN.md` §9.
**Last updated:** 2026-09-25

## 1. Why

Bhumi Amartya may run acquisition via ChatGPT Ads. Ads must land on a page matching the exact intent that triggered them, not the homepage, to keep conversion honest and relevant.

## 2. Priority Order

1. Human Design
2. Life Path
3. Destiny Matrix
4. Natal Chart
5. Personal Blueprint / Self Discovery

## 3. Principle

**One intent → one relevant landing page.** Never route every ad to the homepage.

```
ChatGPT conversation
      ↓
relevant ad
      ↓
free calculator
      ↓
short result
      ↓
Personal Blueprint
      ↓
App / Community
```

## 4. Current Readiness (evidence-based, audited 2026-09-25)

| Priority | System | Dedicated landing page exists? | Engine exists? | Ads-ready? |
| --- | --- | --- | --- | --- |
| 1 | Human Design | Yes — `/kenali-diri/human-design/` | Yes — `lib/human-design/calculate.mjs` (existing, currently calls the app's API per `docs/website-app-isolation-backlog.md`) | **PARTIAL** — page exists but needs claim/CTA/structured-data alignment per `PRD.md` §5.4 before running paid traffic to it |
| 2 | Life Path | **No** — Life Path is currently a field inside `/tes-kenali-diri/`, no standalone page | Calculation exists inline in `/tes-kenali-diri/` (per `FEATURE_PARITY_MATRIX.md`, "Life Path parity: PASS") | **NOT READY** — needs a dedicated landing page before Life Path-specific ads |
| 3 | Destiny Matrix | **No** standalone landing page | Yes — `lib/destiny-matrix/calculate.mjs` | **NOT READY** — engine exists, page does not |
| 4 | Natal Chart | **No** standalone landing page | Yes — `lib/natal-chart/calculate.mjs` | **NOT READY** — engine exists, page does not |
| 5 | Personal Blueprint / Self Discovery | **No** public umbrella page (`/blueprint/` is an internal calculator wrapper, not this) | N/A (umbrella, composes other engines) | **NOT READY** |

**Overall status: NOT READY.** Only Human Design has a public landing page today, and even that page needs an on-page requirement review before it should receive paid traffic. This assessment is based on repository evidence (route presence, `FEATURE_PARITY_MATRIX.md`), not on ad-account configuration, which was not reviewed as part of this task.

## 5. Requirements Before Launch (per priority page)

Each page must satisfy the full checklist in `PRD.md` §5.4 (unique H1/title/meta/canonical, definition, calculator, FAQ, internal links, related content, Personal Blueprint CTA, Community CTA, disclaimer, structured data) before it is used as an ad landing page. See `SEO_AEO_GEO.md` for the structured-data specifics.

## 6. Claim Compliance for Ad Copy

Ad copy and landing-page copy must both follow `CONTENT_GOVERNANCE.md` §6 (claim wording). This matters more for paid acquisition than organic, since ad platforms and AI-assistant surfaces may themselves reject or down-rank deterministic/medical claims. The known current-copy violation (Vedic Astrology "prediksi periode hidup secara presisi" on the homepage) is not on the priority-5 ads list but should be fixed before any Vedic-related paid campaign is considered, and ideally regardless of ads given `CONTENT_GOVERNANCE.md`.

## 7. Not Done in This Phase

- No ad account, campaign, or ChatGPT Ads platform configuration was created or reviewed.
- No landing page was built or modified.
- This document is planning input only.
