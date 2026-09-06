# BHUMI WEBSITE GROWTH: IMPLEMENTATION BACKLOG

```
PROJECT: Bhumi Amartya Website Growth Engine
DOCUMENT: Engineering & Growth Implementation Backlog
STATUS: CANONICAL BACKLOG
VERSION: 1.0.0
DATE: 2026-09-07
```

---

## 1. Backlog Overview & Priority Definitions

This backlog defines the precise, granular implementation tasks required to transition the Bhumi Amartya platform from its current state into an automated organic acquisition and monetization engine.

### Priority Hierarchy:
- **P0 (Prerequisite Foundations)**: Must be executed prior to generating or publishing new articles at scale.
- **P1 (Core Growth Engine)**: Automation pipelines, internal linking, and search indexing to scale catalog.
- **P2 (Scale & Optimization)**: Advanced ad monetization, automated content refreshes, and conversion optimizations.

---

## 2. Granular Epic Breakdown

---

### EPIC WG-01: CONTENT FOUNDATION

#### Task WG-01-01: Fix Article SSR Template Shell
- **Priority**: P0
- **Purpose**: Inject Google Analytics 4, consent modal, and AdSense loader scripts into server-rendered article pages.
- **Dependencies**: None
- **Files Likely Affected**: `lib/content/render-article.mjs`, `tests/content-article-detail.test.mjs`
- **Acceptance Criteria**:
  1. `lib/content/render-article.mjs` `<head>` includes `/assets/bhumi-consent.js` and `/assets/bhumi-analytics.js`.
  2. Consent banner displays correctly on direct `/articles/:slug/` visits.
  3. All existing unit tests in `tests/content-article-detail.test.mjs` pass without regressions.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

#### Task WG-01-02: Additive Firestore Article Schema Validation
- **Priority**: P0
- **Purpose**: Upgrade `lib/content/firestore-reader.mjs` normalization helper to support additive growth fields without breaking existing article documents.
- **Dependencies**: None
- **Files Likely Affected**: `lib/content/firestore-reader.mjs`, `tests/content-api.test.mjs`
- **Acceptance Criteria**:
  1. `normalizeArticleDoc` and `normalizeArticleDetail` extract optional additive fields (`topicCluster`, `primaryKeyword`, `editorialStatus`, `qualityScore`, `entities`, `references`).
  2. Missing fields default safely to `null` or empty arrays.
  3. Existing readers query `source == 'bhumi'` and `status == 'published'` untouched.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

---

### EPIC WG-02: ARTICLE AUTOMATION

#### Task WG-02-01: Article Intake & Brief Generation CLI
- **Priority**: P0
- **Purpose**: Create an offline/local CLI script (`scripts/content/generate-brief.mjs`) to generate search briefs from cluster definitions.
- **Dependencies**: WG-01-02
- **Files Likely Affected**: `scripts/content/generate-brief.mjs`
- **Acceptance Criteria**:
  1. Accepts keyword, cluster ID, and target intent.
  2. Outputs structured JSON brief containing H2/H3 outline, required entities, and conversion anchor.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: NO

#### Task WG-02-02: Editorial Review & Publishing Tool
- **Priority**: P0
- **Purpose**: Provide an administrative CLI/script to validate and publish articles to Firestore with strict schema conformity.
- **Dependencies**: WG-01-02, WG-02-01
- **Files Likely Affected**: `scripts/content/publish-article.mjs`
- **Acceptance Criteria**:
  1. Validates article payload against `lib/content/firestore-reader.mjs` requirements.
  2. Enforces `source: 'bhumi'` and `status: 'published'`.
  3. Enforces immutable slug syntax (`^[a-z0-9]+(?:-[a-z0-9]+)*$`).
  4. Requires explicit editor confirmation before executing write.
- **Risk Level**: MEDIUM (Direct database write)
- **Production Mutation Required**: YES (When publishing specific articles)
- **Deploy Required**: NO

---

### EPIC WG-03: SEO ENGINE

#### Task WG-03-01: BreadcrumbList JSON-LD & Visual Breadcrumbs
- **Priority**: P1
- **Purpose**: Render visual breadcrumbs on `/articles/:slug/` and output schema.org `BreadcrumbList` in the SSR `<head>`.
- **Dependencies**: WG-01-01
- **Files Likely Affected**: `lib/content/render-article.mjs`, `tests/content-seo.test.mjs`
- **Acceptance Criteria**:
  1. Visual breadcrumbs display: `Beranda / Artikel / {Article Category} / {Title}`.
  2. JSON-LD `<script>` tag contains valid `BreadcrumbList` schema.
  3. Rich Results Test passes validation.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

#### Task WG-03-02: Dynamic Sitemap Pagination & Index
- **Priority**: P1
- **Purpose**: Extend `api/sitemap.mjs` to support sitemap index or paginated sets when article count exceeds 200.
- **Dependencies**: WG-01-02
- **Files Likely Affected**: `api/sitemap.mjs`, `tests/content-seo.test.mjs`
- **Acceptance Criteria**:
  1. Sitemap generates correctly for 500+ articles without memory or execution timeouts.
  2. All URLs include canonical trailing slashes.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

---

### EPIC WG-04: GEO / AEO ENGINE

#### Task WG-04-01: FAQ Structure & FAQPage Schema Support
- **Priority**: P1
- **Purpose**: Enable optional FAQ parsing in article markdown and output `FAQPage` schema where applicable.
- **Dependencies**: WG-01-01
- **Files Likely Affected**: `lib/content/render-article.mjs`
- **Acceptance Criteria**:
  1. Markdown sections tagged with `## Pertanyaan Umum` parse into distinct accordion/QA cards.
  2. Corresponding `FAQPage` JSON-LD schema added to the page graph.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

#### Task WG-04-02: Quotable Answer Blocks & Epistemic Callouts
- **Priority**: P1
- **Purpose**: Render dedicated styling for BLUF direct answers and epistemic disclaimers (evidence vs tradition).
- **Dependencies**: WG-01-01
- **Files Likely Affected**: `lib/content/render-article.mjs`, `assets/bhumi-design-system.css`
- **Acceptance Criteria**:
  1. Markdown callout syntax (e.g. `> [!NOTE]`) renders with branded styling.
  2. Direct answer paragraphs render with high-readability typography.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

---

### EPIC WG-05: INTERNAL LINKING

#### Task WG-05-01: Contextual Tool CTA Card Injection
- **Priority**: P1
- **Purpose**: Render standardized mid-article interactive tool cards and footer conversion widgets.
- **Dependencies**: WG-01-01
- **Files Likely Affected**: `lib/content/render-article.mjs`, `assets/bhumi-design-system.css`
- **Acceptance Criteria**:
  1. Articles automatically display contextual tool CTAs matched to their category.
  2. CTAs link with proper trailing slashes and trigger analytics tracking.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

#### Task WG-05-02: Automated Sibling Article Linker
- **Priority**: P1
- **Purpose**: Query and display 2 to 3 related articles at the foot of each article page.
- **Dependencies**: WG-01-01, WG-01-02
- **Files Likely Affected**: `lib/content/render-article.mjs`, `lib/content/firestore-reader.mjs`
- **Acceptance Criteria**:
  1. Displays cards for related articles within the same `topicCluster` or `category`.
  2. Excludes the current article from its own recommendations.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

---

### EPIC WG-06: SEARCH INDEXING

#### Task WG-06-01: IndexNow Integration Worker
- **Priority**: P1
- **Purpose**: Automatically submit new published article URLs to Bing, Yandex, and Naver via the IndexNow API.
- **Dependencies**: WG-02-02
- **Files Likely Affected**: `scripts/content/indexnow-push.mjs`, `/{indexnow-key}.txt`
- **Acceptance Criteria**:
  1. HTTP POST dispatched to `api.indexnow.org` on successful article publish.
  2. Returns HTTP 200/202 confirmation.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES (For verification key)

#### Task WG-06-02: Google Search Console Indexing Monitor
- **Priority**: P2
- **Purpose**: Fetch URL inspection data from GSC API to update `indexingStatus` fields in Firestore.
- **Dependencies**: WG-02-02
- **Files Likely Affected**: `scripts/analytics/gsc-audit.mjs`
- **Acceptance Criteria**:
  1. Queries GSC URL Inspection API for newly published URLs.
  2. Logs indexed state and crawl timestamps.
- **Risk Level**: LOW
- **Production Mutation Required**: YES (Read GSC, write status to Firestore)
- **Deploy Required**: NO

---

### EPIC WG-07: ENTITY AUTHORITY

#### Task WG-07-01: Unify Founder & Organization Schema Graph
- **Priority**: P0
- **Purpose**: Standardize `Widhi Wedhaswara` (`Person`) and `Bhumi Amartya` (`Organization`) entity schema graph across all pages.
- **Dependencies**: WG-01-01
- **Files Likely Affected**: `lib/content/render-article.mjs`, `about/index.html`
- **Acceptance Criteria**:
  1. JSON-LD output conforms to the schema in `BHUMI_SEO_GEO_AEO_SPEC.md`.
  2. Entity graph uses stable `@id` URIs.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

---

### EPIC WG-08: ADSENSE MONETIZATION

#### Task WG-08-01: In-Article Ad Container Component
- **Priority**: P2
- **Purpose**: Inject responsive, layout-stable ad containers on eligible long-form articles while respecting zero-ad exclusion zones.
- **Dependencies**: WG-01-01
- **Files Likely Affected**: `lib/content/render-article.mjs`
- **Acceptance Criteria**:
  1. Ads only inject if article word count > 1,200 words and category is not excluded.
  2. Containers enforce `min-height: 280px` to prevent CLS.
  3. Sensitive tags (`Inner Child`, `Mental Health`) completely omit ad units.
- **Risk Level**: MEDIUM (User experience impact)
- **Production Mutation Required**: NO
- **Deploy Required**: YES

---

### EPIC WG-09: ANALYTICS & FUNNEL TRACKING

#### Task WG-09-01: Content Engagement & Scroll Depth Tracker
- **Priority**: P1
- **Purpose**: Track article scroll milestones (50%, 90%) and tool conversion clicks.
- **Dependencies**: WG-01-01
- **Files Likely Affected**: `assets/bhumi-analytics.js`, `lib/content/render-article.mjs`
- **Acceptance Criteria**:
  1. Fires `article_scroll_50` and `article_scroll_90` exactly once per session.
  2. Fires `article_tool_click` when users click tool CTA cards.
- **Risk Level**: LOW
- **Production Mutation Required**: NO
- **Deploy Required**: YES

---

### EPIC WG-10: CONTENT REFRESH ENGINE

#### Task WG-10-01: Content Decay & Stale Content Auditor
- **Priority**: P2
- **Purpose**: Audit articles older than 180 days or with declining search traffic to flag `NEEDS_REFRESH`.
- **Dependencies**: WG-06-02
- **Files Likely Affected**: `scripts/content/audit-decay.mjs`
- **Acceptance Criteria**:
  1. Compares rolling 30-day GSC impressions against previous 90 days.
  2. Flags decaying content in Firestore for editorial review.
- **Risk Level**: LOW
- **Production Mutation Required**: YES (Updates article status)
- **Deploy Required**: NO
