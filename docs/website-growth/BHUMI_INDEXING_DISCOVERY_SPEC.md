# BHUMI INDEXING & DISCOVERY SPECIFICATION

```
PROJECT: Bhumi Amartya Website Growth Engine
DOCUMENT: Indexing, Sitemap, & Crawl Discovery Specification
STATUS: CANONICAL SPECIFICATION
VERSION: 1.0.0
DATE: 2026-09-07
```

---

## 1. Search Engine Discovery Lifecycle

The journey from content creation to organic search impression follows a linear, multi-stage pipeline:

```
[ Firestore Write ] (status: 'published', source: 'bhumi')
        │
        ▼
[ Dynamic Sitemap Generation ] (/api/sitemap outputs XML with <lastmod>)
        │
        ├──► [ Googlebot Crawl ] ──► [ Indexing Evaluation ] ──► [ Google Search SERP ]
        │                                                              │
        └──► [ IndexNow / Bing ] ──► [ Bingbot Crawl ] ──► [ Bing / Copilot Search ]
                                                                       │
                                                       [ Impressions & Clicks ]
                                                                       │
                                                       [ GSC Performance API ]
```

---

## 2. Comprehensive Audit of Current Indexing Assets

### 2.1 `robots.txt` Audit
- **File Location**: `/robots.txt` (Root static file)
- **Current Content**:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://www.bhumiamartya.my.id/sitemap.xml
  ```
- **Audit Findings**: Fully compliant and open. Correctly points to the canonical sitemap URL (`https://www.bhumiamartya.my.id/sitemap.xml`).

### 2.2 Dynamic Sitemap Audit (`api/sitemap.mjs`)
- **Routing**: `vercel.json` rewrites `/sitemap.xml` and `/sitemap.xml/` to Serverless Function `api/sitemap`.
- **Implementation Mechanism**:
  - Injects 16 core static landing URLs: `/`, `/tes-kenali-diri/`, `/cek-aura/`, `/weton/`, `/kalkulator-cinta/`, `/kenali-diri/human-design/`, `/kenali-diri/mbti/`, `/articles/`, `/ngopi-ilmu/`, `/ebooks/`, `/about/`, `/contact/`, `/terms/`, `/privacy-policy/`, `/disclaimer/`, `/methodology/`.
  - Dynamically queries Firestore collection `articles` via `listPublishedArticles({ limit: 200 })`.
  - Generates `<loc>` with enforced trailing slash: `https://www.bhumiamartya.my.id/articles/${slug}/`.
  - Generates `<lastmod>` based on `isoDate(article.updatedAt) || isoDate(article.publishedAt)`.
- **Identified Scaling Limitations**:
  - The Firestore query limit is hardcoded to `200` articles. When the article catalog exceeds 200 entries, newly published articles will not be included in the sitemap without sitemap pagination or a Sitemap Index (`sitemap-index.xml`).
  - Error state returns HTTP 503 if GCP credentials fail.

### 2.3 Article SSR & HTTP Status Audit (`api/article-page.mjs`)
- **SSR Execution**: `lib/content/render-article.mjs` generates full static HTML on the server. Googlebot receives completely rendered text and meta tags without relying on client-side JavaScript hydration.
- **HTTP Status Boundary**:
  - Found article: HTTP 200 with `Content-Type: text/html; charset=utf-8`.
  - Missing/invalid slug: HTTP 404 with custom branded not-found HTML.
  - Server/database error: HTTP 503 (`Unavailable.`).
  - **Verdict**: Fully compliant with Googlebot crawl standards; prevents soft-404 indexing penalties.

---

## 3. Future Programmatic Indexing Protocols

To accelerate crawl and indexing latency from weeks to hours:

### 3.1 Google Search Console (GSC) URL Inspection API
- **Mechanism**: Use the official Google Search Console API to programmatically request indexing status and inspection metadata.
- **Critical Distinction**: Google's official *Indexing API* is officially restricted by Google to `JobPosting` and `BroadcastEvent` structured data. For general editorial content, URLs are submitted via the dynamic XML sitemap, and their status is audited via the GSC URL Inspection API.

### 3.2 IndexNow Protocol & Bing Webmaster API
- **Supported Search Engines**: **Bing, Yandex, Seznam, Naver**.
- **Crucial Clarification**: **IndexNow does NOT submit URLs directly to Google.** Google does not participate in the IndexNow protocol. IndexNow is strictly utilized for immediate indexing across Microsoft Bing, Copilot, and international search networks.
- **Implementation Plan**:
  - Place verification key file at `/{indexnow-key}.txt`.
  - On article publication, dispatch HTTP POST request to `https://api.indexnow.org/indexnow` with the newly published canonical URL.

---

## 4. Indexing Monitor Specification

To monitor indexation health programmatically, each article document in Firestore will track indexing lifecycle metrics in an additive object:

```json
{
  "indexingStatus": {
    "submittedToGscAt": "2026-09-10T08:05:00.000Z",
    "submittedToIndexNowAt": "2026-09-10T08:05:00.000Z",
    "lastCrawledAt": "2026-09-11T02:14:00.000Z",
    "isIndexed": true,
    "verdict": "PASS",
    "coverageState": "Submitted and indexed",
    "canonicalUrl": "https://www.bhumiamartya.my.id/articles/apa-itu-human-design/",
    "googleCanonical": "https://www.bhumiamartya.my.id/articles/apa-itu-human-design/",
    "performance": {
      "impressions30d": 1420,
      "clicks30d": 84,
      "ctr30d": 0.059,
      "averagePosition": 6.8
    }
  }
}
```

*Note: All indexing API integrations are slated for subsequent implementation phases. No external API credentials or write jobs are to be modified at this time.*
