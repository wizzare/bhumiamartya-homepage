# BHUMI ADSENSE MONETIZATION SPECIFICATION

```
PROJECT: Bhumi Amartya Website Growth Engine
DOCUMENT: Google AdSense Monetization & Ad Experience Specification
STATUS: CANONICAL SPECIFICATION
VERSION: 1.0.0
DATE: 2026-09-07
```

---

## 1. Technical Audit of Current AdSense Infrastructure

### 1.1 Verified Repository Assets

| Asset / Component | Location | Current Implementation Details | Verification Status |
| :--- | :--- | :--- | :--- |
| **Publisher ID** | Meta tags & scripts | `ca-pub-0971666335614952` | **VERIFIED** |
| **Authorized Sellers (`ads.txt`)** | `/ads.txt` | `google.com, pub-0971666335614952, DIRECT, f08c47fec0942fa0` | **VERIFIED** |
| **AdSense Loader Script** | `assets/bhumi-adsense.js` | Injects `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0971666335614952`. Enforces hostname check (`www.bhumiamartya.my.id` or `bhumiamartya.my.id`). | **VERIFIED** |
| **Verification Meta Tag** | `index.html`, `articles/index.html`, `ngopi-ilmu/index.html` | `<meta name="google-adsense-account" content="ca-pub-0971666335614952">` | **VERIFIED** |
| **Manual Ad Units (`<ins>`)** | Codebase wide | Zero manual ad units (`<ins class="adsbygoogle">`) exist in any template. | **VERIFIED (NONE)** |

### 1.2 Critical Flaws & Disconnections Found in Audit

1. **The Article SSR Blackout**:
   - `lib/content/render-article.mjs` (which generates all dynamic article pages at `/articles/:slug/`) **does NOT load `bhumi-adsense.js` or the AdSense meta tag**.
   - Consequently, **zero ads can currently render on individual article reading pages**, which represent the primary organic landing surface for search traffic.
2. **The Consent Mode Block**:
   - `assets/bhumi-consent.js` defaults `ad_storage`, `ad_user_data`, and `ad_personalization` to `"denied"`.
   - When a user accepts the privacy banner ("Terima analytics"), the script only updates `analytics_storage: "granted"`, while keeping advertising storage permanently `"denied"`.
   - As a result, AdSense operates in restricted non-personalized mode without cookies.

---

## 2. Technical Integration vs. Monetization Readiness

- **Technical Integration Level**: **PARTIAL (PLUMBING ONLY)**. The account ID and script exist, but they are completely absent from the article rendering pipeline.
- **Monetization Readiness**: **NOT READY**. Displaying ads prematurely without defined ad boundaries would disrupt user trust, damage Core Web Vitals, and cannibalize high-margin consultation leads.

---

## 3. Recommended Monetization Strategy

Advertising is strictly a **secondary revenue stream** for Bhumi Amartya. The primary business engine remains:

$$\text{Organic Traffic} \longrightarrow \text{Brand Trust} \longrightarrow \text{Interactive Self-Discovery Tools} \longrightarrow \text{Blueprint Reading / Consultations / Ebooks}$$

Intrusive or sensationalist advertising would destroy the serene, sacred aesthetic ("Ruang Untuk Pulang dan Kenali Diri") of the platform.

### 3.1 Monetization Principles
1. **Zero Ads on Conversion Flows**: Never display ads on interactive tools, calculators, forms, checkout paths, or consultation inquiry pages.
2. **Page Experience & CLS Protection**: Every ad slot must have reserved layout space (`min-height: 280px`) with fixed aspect ratios to prevent Cumulative Layout Shift (CLS).
3. **Conservative Ad Density**: Maximum of **2 ad placements** on long-form articles (> 1,200 words); maximum of **1 ad placement** on shorter articles.

---

## 4. Page-Level Advertising Policy & Protected Zones

| Page / Route Category | Target URLs | Allowed Ad Placements | Rationale |
| :--- | :--- | :--- | :--- |
| **Protected Conversion Tools** | `/tes-kenali-diri/`, `/cek-aura/`, `/weton/`, `/kalkulator-cinta/`, `/kenali-diri/*` | **STRICTLY ZERO ADS** | Protect interactive calculations, user privacy, and conversion rate to full Blueprint Reading. |
| **Brand & Trust Pages** | `/about/`, `/contact/`, `/methodology/`, `/terms/`, `/privacy-policy/`, `/disclaimer/` | **STRICTLY ZERO ADS** | Maintain high editorial and organizational credibility. |
| **Sensitive Wellbeing Content** | Articles tagged `Inner Child`, `Trauma`, `Duka`, `Kesehatan Mental` | **STRICTLY ZERO ADS** | Ethical imperative; intrusive display ads during vulnerable psychological reflection damage user safety and trust. |
| **General Article Hubs** | `/articles/`, `/ngopi-ilmu/` | **1 In-Feed Banner** (Native format) | Low-intrusion card integrated within the article grid. |
| **Standard Long-Form Articles** | `/articles/:slug/` (General educational topics: Human Design, Astrology, BaZi, etc.) | **Max 2 Placements**: <br>1. Mid-content (after 4th paragraph)<br>2. Post-article footer | High organic readership allows non-intrusive ad monetization. |

---

## 5. In-Article Ad Slot Technical Specifications

When implemented, in-article ads must be wrapped inside a responsive, reserved container:

```html
<!-- Mid-Article Reserved Ad Unit -->
<div class="bhumi-ad-wrapper" style="min-height: 280px; text-align: center; margin: 2rem 0; background: rgba(0,0,0,0.02); border-radius: 8px; overflow: hidden;">
  <span style="font-size: 10px; color: #8c9b8e; letter-spacing: 0.05em; display: block; padding: 4px 0;">ADVERTISEMENT</span>
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-0971666335614952"
       data-ad-slot="1234567890"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>
```

*Note: No ad slots or runtime script modifications are to be deployed during the current documentation phase.*
