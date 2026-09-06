# BHUMI WEBSITE GROWTH: MASTER SOURCE OF TRUTH (SoT)

```
PROJECT: Bhumi Amartya Website Growth Engine
REPOSITORY: wizzare/bhumiamartya-homepage
CANONICAL DOMAIN: https://www.bhumiamartya.my.id
DOCUMENT TYPE: Master Source of Truth (Canonical Architecture)
STATUS: RATIFIED
VERSION: 1.0.0
DATE: 2026-09-07
```

---

## 1. Executive Summary

This document establishes the canonical Source of Truth (SoT) for transforming **Bhumi Amartya** (`www.bhumiamartya.my.id`) from a high-quality product/corporate website into a high-performance, scalable organic acquisition engine, article publishing platform, search indexing system, and sustainable monetization channel.

The website currently possesses solid foundations in frontend design, interactive self-discovery tools, and content consumption plumbing (Firestore reader, dynamic sitemap, server-rendered article pages). However, it operates with a fragmented and incomplete growth pipeline: **there is currently no production article writer, no automated editorial pipeline, no structured internal linking engine, and no proactive indexing mechanism.**

### Maturity Assessment by Functional Area

| Domain | Maturity Status | Existing Evidence | Primary Gap |
| :--- | :--- | :--- | :--- |
| **Corporate / Product Website** | **COMPLETE** | `index.html`, `/about/`, `/contact/`, `/methodology/`, `/tes-kenali-diri/`, `/cek-aura/`, `/weton/`, `/kalkulator-cinta/` | Feature parity established; static landing pages functional. |
| **Technical SEO Plumbing** | **PARTIAL** | `robots.txt`, `api/sitemap.mjs`, `vercel.json` rewrites, SSR meta tags in `lib/content/render-article.mjs` | Missing BreadcrumbList schema, Person entity graph, RSS/Atom feed, dynamic sitemap pagination beyond 200 articles. |
| **Article Platform (Reader)** | **COMPLETE** | `/articles/`, `/articles/:slug/`, `api/article-page.mjs`, `api/bhumi-articles.mjs`, `api/bhumi-article.mjs`, `lib/content/firestore-reader.mjs` | Robust server-side reader for published articles from Firestore. |
| **Article Automation (Writer)** | **MISSING** | Prototyped only in separate sibling repository (`bhumiamartya-content/src/lib/automation`), zero runtime code in `bhumiamartya-homepage` | No scheduled jobs, no API writer, no automated topic intake, schema drift between prototype and homepage reader. |
| **SEO Content Engine** | **MISSING** | Manual article entries only; no automated research or generation | No topic cluster management, search intent modeling, or keyword planning. |
| **GEO / AEO Optimization** | **PARTIAL** | Basic `Article` JSON-LD schema with headline, description, author, publisher | Missing answer-first content blocks, FAQPage schemas, clear epistemic citations, and quotable factual summaries. |
| **Search Indexing System** | **PARTIAL** | Passive dynamic sitemap (`/sitemap.xml` -> `/api/sitemap`), `robots.txt` | No programmatic push via Google Search Console API, Bing Webmaster API, or IndexNow; no indexing monitor. |
| **Analytics & Funnel Tracking**| **PARTIAL** | `assets/bhumi-analytics.js`, `assets/bhumi-consent.js` (GA4: `G-BLNCYH2290`) | SSR articles (`lib/content/render-article.mjs`) completely omit analytics/consent scripts; no scroll-depth or content CTA tracking. |
| **Conversion Funnel** | **PARTIAL** | Direct CTA buttons on static pages to WhatsApp, tools, and reading | Articles lack contextual widgets, related tool cards, lead-capture forms, and reading funnel integrations. |
| **AdSense Monetization** | **PARTIAL** | `ads.txt` (`pub-0971666335614952`), `assets/bhumi-adsense.js`, publisher meta tags | AdSense script is NOT included in SSR article pages; no ad slot placements; ad storage consent remains permanently denied. |

---

## 2. Existing Production Architecture

The current architecture follows a headless and edge-rendered pattern powered by Vercel Serverless Functions, Google Cloud Firestore, and vanilla frontend modules:

```
                                  [ Visitor / Googlebot ]
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       │                                           │
           [ Static HTML Pages ]                           [ Dynamic Paths ]
     (/, /about/, /articles/, etc.)                     (/articles/:slug/, /sitemap.xml)
                       │                                           │
                       │                              [ vercel.json Rewrites ]
                       │                                           │
        ┌──────────────┴──────────────┐               ┌────────────┴────────────┐
        │                             │               │                         │
[ Client-side JS ]             [ API Calls ]    /api/article-page         /api/sitemap
(bhumi-analytics.js,        (/api/bhumi-articles)     │                         │
 bhumi-consent.js,                     │              │                         │
 bhumi-adsense.js)                     │              ▼                         ▼
                                       │        [ SSR Renderer ]       [ XML Builder ]
                                       │    (render-article.mjs)       (sitemap.mjs)
                                       │              │                         │
                                       └──────────────┼─────────────────────────┘
                                                      │
                                                      ▼
                                       [ lib/content/firestore-reader.mjs ]
                                                      │
                                            (GCP OIDC Auth)
                                                      │
                                                      ▼
                                         [ Google Cloud Firestore ]
                                           (collection: 'articles')
```

### Key Repository Assets & File Roles

1. **Routing & Edge Configuration (`vercel.json`)**:
   - Maps `/sitemap.xml` and `/sitemap.xml/` to Serverless Function `api/sitemap`.
   - Rewrites `/articles/:slug` and `/articles/:slug/` to Serverless Function `api/article-page?slug=:slug`.
   - Rewrites `/api/wedhaswara-articles` to external WordPress REST API (`https://wedhaswara.my.id/wp-json/wp/v2/posts?per_page=6&_embed=1`).
   - Rewrites legacy `/reading` routes to `/tes-kenali-diri/` and `/ebook` to `/ebooks/`.

2. **Serverless Content Reader (`lib/content/firestore-reader.mjs`)**:
   - Authenticates to GCP Firestore using Workload Identity/OIDC via `lib/gcp-oidc.mjs`.
   - `listPublishedArticles({ limit })`: Queries Firestore collection `articles` where `source == 'bhumi'` and `status == 'published'`. Capped at 40 in query, sorted by `publishedAt` descending.
   - `getPublishedArticleBySlug(slug)`: Queries `articles` where `slug == slug`, `source == 'bhumi'`, and `status == 'published'`.
   - Normalizes data into canonical article objects with fields: `id`, `title`, `slug`, `excerpt`, `content`, `category`, `tags`, `coverImageUrl`, `authorName`, `publishedAt`, `updatedAt`, `seoTitle`, `seoDescription`, `readingTimeMinutes`, `featured`.

3. **Server-Side HTML Renderer (`lib/content/render-article.mjs`)**:
   - Dynamically builds standalone HTML for `/articles/:slug/`.
   - Embeds SEO meta tags: `canonical`, `og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `twitter:card`.
   - Generates schema.org `Article` JSON-LD with author (`Person`), publisher (`Organization`), and `mainEntityOfPage`.
   - Parses Markdown blocks for headings (`h2`, `h3`), bullet lists, images, and paragraphs.
   - **Critical Vulnerability/Omission**: Currently does not include `bhumi-analytics.js`, `bhumi-consent.js`, or `bhumi-adsense.js`.

4. **Dynamic Sitemap (`api/sitemap.mjs`)**:
   - Generates compliant XML sitemap including 16 static core URLs and dynamic published article URLs (`/articles/:slug/`) with `lastmod`.
   - Enforces trailing slash canonical URL standard.

5. **Monetization & Analytics Assets (`assets/`)**:
   - `bhumi-adsense.js`: Injects Google AdSense script (`ca-pub-0971666335614952`) exclusively on production hostnames (`www.bhumiamartya.my.id`, `bhumiamartya.my.id`).
   - `bhumi-consent.js`: Provides GDPR/PDPA compliant consent banner (`bhumi_consent_v1`). Emits `bhumi:consent` event.
   - `bhumi-analytics.js`: Loads GA4 (`G-BLNCYH2290`) upon receiving consent. Denies ad storage signals by default.

---

## 3. Current Article Architecture & Production Writer Audit

### Content Reader vs. Content Writer Status

| Component | Status | Implementation Details |
| :--- | :--- | :--- |
| **Content Reader** | **CONFIRMED PRODUCTION READY** | Implemented in `lib/content/firestore-reader.mjs`. Tested via unit suites in `tests/content-api.test.mjs`, `tests/content-article-detail.test.mjs`, and `tests/content-seo.test.mjs`. Robust error boundaries (404/503). |
| **Content Writer / Publisher** | **CONFIRMED MISSING IN PRODUCTION REPO** | **There is NO article writer, publisher, or ingestion pipeline in `wizzare/bhumiamartya-homepage`.** |

### Cross-Repository Inspection & Schema Drift

A prototype automation pipeline was discovered in a local sibling repository (`bhumiamartya-content/src/lib/automation`). Inspection reveals critical schema drift that would cause silent failure if connected naively to the production reader:

1. **The `source` Field Trap**:
   - Production Reader (`bhumiamartya-homepage`): Requires `.where('source', '==', 'bhumi')`.
   - Content Prototype (`bhumiamartya-content`): Uses `type ArticleSource = 'bhumi' | 'automation'`. If an automated article is published with `source: 'automation'`, **the production website reader will completely ignore and fail to display it.**
2. **Field Name Mismatches**:
   - Cover Image: Reader expects `coverImageUrl`; Prototype used `featuredImage`.
   - Author: Reader expects `authorName`; Prototype used `author`.
   - Reading Time: Reader expects `readingTimeMinutes`; Prototype used `readingTime`.
   - Featured Flag: Reader expects `featured` (boolean); Prototype omitted this field.

**Architectural Decision**: All future automation tools must conform strictly to the production reader schema, using additive fields only.

---

## 4. Target Growth Architecture

To transform the website into an autonomous, scalable acquisition system, the missing pipeline must be constructed according to the following 15-stage lifecycle:

```
[ 1. TOPIC DISCOVERY ] ──► [ 2. SEARCH INTENT & BRIEF ] ──► [ 3. KNOWLEDGE RETRIEVAL ]
  - GSC Queries             - Keyword mapping                 - Sacred texts / Primbon
  - Cosmic calendar         - Cluster alignment               - Psychological models
  - User Q&A gaps           - Search intent (Info/Commercial) - Blueprint system rules
                                                                      │
[ 6. FACT & EPISTEMIC QA ] ◄── [ 5. CONTENT GENERATION ] ◄────────────┘
  - Evidence vs Tradition   - Multi-persona LLM (Claude/Gemini)
  - Medical/Financial check - Answer-first / BLUF structure
  - Hallucination filter    - Bhumi voice & brand positioning
        │
        ▼
[ 7. SEO & GEO ENRICHMENT ] ──► [ 8. INTERNAL LINKING ] ──► [ 9. EDITORIAL GATE ]
  - Title & Meta tags       - Pillar ↔ Cluster links           - MANUAL_REVIEW (Default)
  - Semantic H2/H3          - Dynamic tool CTAs                - Quality / Fact score
  - FAQ & Entity Schema     - Anchor diversity safeguards      - Editorial sign-off
                                                                      │
[ 12. PROD PUBLISHING ] ◄── [ 11. PUBLISH QUEUE ] ◄───────────────────┘
  - Firestore write         - Scheduled release
  - source: 'bhumi'         - Velocity throttles (1-3/day)
  - status: 'published'
        │
        ├──► [ 13. INDEXING PUSH ] (GSC API + Bing / IndexNow + Sitemap Refresh)
        │
        ├──► [ 14. PERFORMANCE MEASUREMENT ] (GA4 engagement + Search impressions)
        │
        └──► [ 15. REFRESH CYCLE ] (Quarterly fact & ranking audit)
```

---

## 5. Priority Matrix (P0 / P1 / P2)

### P0: Prerequisite Foundation (Required Before Scaling Content)
- **P0-1**: Fix SSR Article Shell in `lib/content/render-article.mjs` to inject `bhumi-analytics.js`, `bhumi-consent.js`, and `bhumi-adsense.js`.
- **P0-2**: Implement additive Firestore article schema supporting editorial states, keyword metadata, and structured references without breaking existing readers.
- **P0-3**: Establish canonical author entity graph (`Widhi Wedhaswara` as `Person`, `Bhumi Amartya` as `Organization`) across JSON-LD schemas.
- **P0-4**: Build the Content Quality & Epistemic Guardrail validator (blocking pseudoscientific medical claims, financial guarantees, or fatalistic relationship advice).
- **P0-5**: Establish manual editorial workflow CLI/script (`MANUAL_REVIEW` mode) with strict validation against the production Firestore schema.

### P1: Scaling & Automated Distribution (Shortly After First Articles)
- **P1-1**: Automated Internal Linking Engine injecting contextual links to tools (`/tes-kenali-diri/`, `/weton/`, `/cek-aura/`) and pillar articles.
- **P1-2**: Indexing Engine pushing newly published URLs to Google Search Console and Bing/IndexNow.
- **P1-3**: Content Cluster Mapping & Generation Orchestration for the first 5 core clusters (Human Design, Weton, MBTI, Astrologi Natal, Destiny Matrix).
- **P1-4**: Dynamic Sitemap pagination / index support to prepare for catalogs exceeding 200 URLs.
- **P1-5**: GA4 Event enrichment for reading engagement (`article_scroll_50`, `article_tool_click`, `whatsapp_click`).

### P2: Optimization & Monetization Scaling
- **P2-1**: In-Article AdSense placement integration with strict layout stability (CLS prevention) and conversion page exclusions.
- **P2-2**: Consent mode v2 optimization to allow compliant advertising personalization when granted.
- **P2-3**: Automated Content Refresh & Decay Monitor tracking drop in GSC impressions or stale information.
- **P2-4**: Dynamic FAQ and Rich Snippet generation based on actual user search questions.

---

## 6. Architectural Policies & Constraints

1. **Canonical Content Hub**: `/articles/` is the sole canonical SEO content hub. `/ngopi-ilmu/` is maintained strictly as an editorial curated view reading from the exact same API/Firestore database (`source == 'bhumi'`).
2. **Canonical Slug Standards**: Slugs must be immutable, lowercase, hyphen-separated, alphanumeric (`^[a-z0-9]+(?:-[a-z0-9]+)*$`), max 200 characters, without date prefixes. URLs end with trailing slash: `https://www.bhumiamartya.my.id/articles/<slug>/`.
3. **Additive-Only Schema**: Any modifications to Firestore documents must maintain 100% backward compatibility with `lib/content/firestore-reader.mjs`.
4. **Safety Against Hallucination**: AI is an editorial assistant, not an unmonitored publisher. The default operating mode is `MANUAL_REVIEW`.
