# BHUMI ANALYTICS & CONVERSION FUNNEL SPECIFICATION

```
PROJECT: Bhumi Amartya Website Growth Engine
DOCUMENT: Analytics, Event Taxonomy, & Conversion Funnel Specification
STATUS: CANONICAL SPECIFICATION
VERSION: 1.0.0
DATE: 2026-09-07
```

---

## 1. Audit of Existing Analytics & Consent Architecture

### 1.1 Verified Repository Components

| File | Key Variables / Configuration | Verified Functionality |
| :--- | :--- | :--- |
| `assets/bhumi-analytics.js` | GA4 Measurement ID: `G-BLNCYH2290` | Loads `googletagmanager.com/gtag/js?id=G-BLNCYH2290` dynamically upon consent. Dispatches `page_view` with parameters `page_type`, `page_location`, `consent_state`. |
| `assets/bhumi-consent.js` | Storage Key: `bhumi_consent_v1` | Displays modal banner. Provides `window.BhumiConsent.hasAnalyticsConsent()`. Fires `bhumi:consent` event. |
| Production Guard | `PRODUCTION_HOSTS`: `["www.bhumiamartya.my.id", "bhumiamartya.my.id"]` | Both scripts automatically disable tracking in localhost and preview/staging environments. |

### 1.2 Identified Architectural Omissions
- **Article SSR Omission**: Just as with AdSense, `lib/content/render-article.mjs` **does NOT include `bhumi-consent.js` or `bhumi-analytics.js`**. Article visits at `/articles/:slug/` are currently **completely untracked** in Google Analytics 4.
- **Missing Engagement Triggers**: While `bhumi-analytics.js` defines normalizers for `tool_started`, `tool_completed`, and `pdf_download`, it lacks handlers for scroll depth (e.g., 50%, 90%), internal CTA clicks, and WhatsApp consultations.

---

## 2. Organic Conversion Funnel Design

The website acquisition funnel is architected to transition cold informational search visitors into committed consultation and blueprint reading clients:

```
[ STAGE 1: ORGANIC SEARCH (Google / Bing / AI Engines) ]
                          │
                          ▼
[ STAGE 2: ARTICLE LANDING (/articles/:slug/) ]
     (Consumes deep, authoritative content; builds brand trust)
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼
[ STAGE 3A: RELATED ARTICLE ]   [ STAGE 3B: INTERACTIVE TOOL ]
   (Deepens session duration)      (/weton/, /kenali-diri/*)
            │                           │
            └─────────────┬─────────────┘
                          │
                          ▼
[ STAGE 4: HIGH-INTENT ACTION ]
   (Initiates /tes-kenali-diri/ or clicks WhatsApp Consultation)
                          │
                          ▼
[ STAGE 5: LEAD GENERATION ]
   (Submits birth data for Blueprint Reading or reaches WhatsApp)
                          │
                          ▼
[ STAGE 6: MONETIZATION / APP ADOPTION ]
   (Completes Blueprint Reading consultation, buys Ebook, downloads App)
```

---

## 3. Standardized Event Taxonomy

All frontend tracking events must adhere to this standardized, immutable schema across web and server endpoints:

| Event Name | Trigger Condition | Parameters | Funnel Stage |
| :--- | :--- | :--- | :--- |
| `page_view` | Initial page load (with consent) | `page_type`, `page_path`, `page_location` | Discovery |
| `article_view` | Article detail page rendered | `article_slug`, `category`, `author`, `reading_time` | Consideration |
| `article_scroll_50` | User scrolls past 50% of article body | `article_slug`, `time_on_page` | Engagement |
| `article_scroll_90` | User scrolls past 90% of article body | `article_slug`, `time_on_page` | High Engagement |
| `article_related_click`| User clicks a sibling/related article link | `source_slug`, `target_slug`, `cluster_id` | Navigation |
| `article_tool_click` | User clicks an in-article tool CTA | `article_slug`, `tool_name`, `cta_position` | Intent |
| `blueprint_start` | User initiates the questionnaire on `/tes-kenali-diri/` | `source_path`, `tool_name` | High Intent |
| `blueprint_complete` | User completes calculation / form submission | `tool_name`, `system_type` | Soft Conversion |
| `lead` | User submits contact details for Blueprint Reading | `lead_type`, `value`, `currency` | Core Conversion |
| `whatsapp_click` | User clicks any WhatsApp consultation button | `source_page`, `inquiry_type` | Direct Lead |
| `app_download_click` | User clicks link to download Bhumi App | `source_page`, `device_platform` | Retention |
| `ebook_download_click`| User initiates an ebook download or purchase | `ebook_slug`, `ebook_title` | Monetization |

---

## 4. Technical Implementation Plan for Article SSR

To rectify the article tracking gap, `lib/content/render-article.mjs` must be updated during Phase 1 implementation to inject:

```html
<!-- Inside <head> of lib/content/render-article.mjs -->
<script src="/assets/bhumi-consent.js" defer></script>
<script src="/assets/bhumi-analytics.js" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.BhumiAnalytics) {
      window.BhumiAnalytics.track('article_view', {
        article_slug: '{{article.slug}}',
        category: '{{article.category}}'
      });
    }
  });
</script>
```

*Note: No modifications to production JavaScript or templates are permitted during the current documentation phase.*
