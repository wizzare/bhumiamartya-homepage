# BHUMI WEBSITE GROWTH: OPERATIONAL HANDOFF

```
PROJECT = BHUMI_WEBSITE_GROWTH
REPOSITORY = wizzare/bhumiamartya-homepage
PRODUCTION = https://www.bhumiamartya.my.id
CURRENT_PHASE = DOCUMENTATION_AND_ARCHITECTURE
IMPLEMENTATION_STATUS = NOT_STARTED
PRODUCTION_MUTATION = FORBIDDEN
DEPLOYMENT = FORBIDDEN
DATE = 2026-09-07
```

---

## 1. Executive Handoff Statement

This document constitutes the formal, binding operational handoff for Phase 2 of the Bhumi Amartya growth platform.

All relevant technical assets, edge routing rules, Firestore readers, SSR templates, analytics modules, and monetization scripts have been thoroughly audited and documented without mutating runtime code or altering production infrastructure.

The canonical architecture, topic clusters, epistemic guardrails, state machines, and implementation tasks are now codified within `docs/website-growth/`.

---

## 2. Infrastructure Inventory & Status

### 2.1 Completed Infrastructure (Verified in Repo)
- **Edge Routing & Rewrites**: `vercel.json` maps dynamic paths, including `/sitemap.xml` ➔ `api/sitemap` and `/articles/:slug/` ➔ `api/article-page?slug=:slug`.
- **Content Consumption Pipeline**: `lib/content/firestore-reader.mjs` provides robust, cached reads from Firestore `articles` collection, enforcing `source == 'bhumi'` and `status == 'published'`.
- **Server-Side Article Rendering**: `lib/content/render-article.mjs` generates fast, static HTML for Googlebot and human visitors, complete with core OpenGraph and Article JSON-LD metadata.
- **Dynamic XML Sitemap**: `api/sitemap.mjs` dynamically outputs all static landing pages and published articles with `<lastmod>` timestamps.
- **Client-Side Article Hub**: `/articles/index.html` and `/ngopi-ilmu/index.html` provide functional client-side browsing surfaces.
- **AdSense Baseline Plumbing**: `/ads.txt` and `assets/bhumi-adsense.js` verified with publisher ID `ca-pub-0971666335614952`.

### 2.2 Partially Implemented Infrastructure
- **Article Page SSR Shell**: Currently omits analytics (`bhumi-analytics.js`), consent (`bhumi-consent.js`), and AdSense scripts. Direct organic visitors to `/articles/:slug/` are currently untracked in GA4.
- **Structured Data Graph**: Basic schema.org `Article` exists, but lacks `BreadcrumbList`, connected `Person` (Widhi Wedhaswara), and `Organization` (Bhumi Amartya) graph hierarchy.
- **Consent Mode v2**: Consent modal operates, but leaves advertising storage permanently denied even when analytics is accepted.

### 2.3 Missing Infrastructure
- **Production Article Writer / Publishing Engine**: Zero write, draft, or generation tools exist in the production repository.
- **Automated Internal Linking Engine**: No automated injection of contextual links between articles and Bhumi tools.
- **Proactive Indexing Pipeline**: No IndexNow webhook or Google Search Console API status monitor.
- **Content Quality & Epistemic Filter**: No automated validation against medical or fatalistic claims.

---

## 3. Risks & Mitigations

| Identified Risk | Severity | Mitigation Strategy |
| :--- | :--- | :--- |
| **Silent Schema Rejection** | CRITICAL | The production reader strictly requires `source: 'bhumi'`. Any external or automated writer must explicitly write `source: 'bhumi'` (never `source: 'automation'`). |
| **YMYL Search Demotion** | HIGH | Strict adherence to `BHUMI_CONTENT_QUALITY_GUARDRAILS.md`. AI models are hardcoded to act as drafting copilots; manual editorial review is mandatory. |
| **AdSense Brand Damage** | MEDIUM | Strict enforcement of protected conversion zones. Zero ads allowed on interactive tools (`/tes-kenali-diri/`, `/weton/`, `/cek-aura/`) or sensitive inner child pieces. |
| **Cumulative Layout Shift (CLS)** | MEDIUM | Ad containers must enforce `min-height: 280px` fixed bounding boxes before script execution. |

---

## 4. Current Blockers (Resolved by Documentation)

1. **Lack of Single Source of Truth**: RESOLVED via `BHUMI_WEBSITE_GROWTH_MASTER_SOT.md`.
2. **Ambiguity on Topic Clusters**: RESOLVED via `BHUMI_CONTENT_CLUSTER_MAP.md`.
3. **Absence of Epistemic Boundaries**: RESOLVED via `BHUMI_CONTENT_QUALITY_GUARDRAILS.md`.
4. **Undefined Implementation Sequence**: RESOLVED below.

---

## 5. Recommended Implementation Sequence

Implementation should proceed in the following linear phases:

1. **Sprint 1: Content Foundation & Tracking Remediation (P0)**
   - Fix `lib/content/render-article.mjs` to include GA4 analytics and consent banner.
   - Expand `lib/content/firestore-reader.mjs` normalization to support additive growth fields.
   - Standardize unified JSON-LD entity graph (`Widhi Wedhaswara` + `Bhumi Amartya`).
2. **Sprint 2: Editorial Tooling & State Machine (P0)**
   - Develop local publishing script (`scripts/content/publish-article.mjs`) with strict schema validation.
   - Enforce `MANUAL_REVIEW` gate before any write to Firestore.
3. **Sprint 3: SEO & GEO Content Enrichment (P1)**
   - Add visual breadcrumbs and `BreadcrumbList` schema.
   - Implement BLUF answer blocks and FAQ styling.
4. **Sprint 4: Contextual Internal Linking (P1)**
   - Implement dynamic tool CTA injection (`/kenali-diri/human-design/`, `/weton/`, `/kalkulator-cinta/`).
   - Implement related sibling article recommendations.
5. **Sprint 5: Automated Search Indexing (P1)**
   - Deploy IndexNow key and push notification script.
   - Connect GSC inspection monitoring.
6. **Sprint 6: Monetization & Refresh Scaling (P2)**
   - Deploy non-intrusive in-article AdSense placements with CLS protection.
   - Deploy content decay auditor.

---

## 6. Execution Authority Transition

```
NEXT_PRIMARY_AGENT = CODEX
```
