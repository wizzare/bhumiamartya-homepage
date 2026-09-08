# Homepage Redesign — Phase 2 Verification Report

## Scope and Reproducibility

Captured 2026-09-08 from `feat/homepage-redesign-2026` branch at `C:/Users/shein/bhumiamartya.my.id/bhumiamartya-homepage`.
No baseline files in `docs/homepage-redesign/baseline/` were overwritten. No production requests, mutation APIs, dependency installations, commits, or deployment actions were performed.

- **Environment**: Windows, Node v24.19.0, Chromium 149.0.7827.55, Playwright module lookup.
- **Source SHA-256 (`index.html`)**: `16b0ea7fd3c32b064da3348647e1eb6cf1a03b0ae13367e0ed94b93baadb2146`.
- **Runner**: `docs/homepage-redesign/phase2/phase2-check.mjs`.
- **Execution commands**:

```sh
node --check docs/homepage-redesign/phase2/phase2-check.mjs
node docs/homepage-redesign/phase2/phase2-check.mjs
```

The runner exercises the homepage using a Node stdlib static loopback server (`127.0.0.1`) with path traversal guards, blocks all external network traffic, and validates the real analytics helper using request interception in an isolated mocked production hostname environment (`https://www.bhumiamartya.my.id`).

## Summary of Results

| Suite / Check Area | Total Checks | Passed | Failed / Findings | Notes |
| --- | ---: | ---: | ---: | --- |
| **Phase 2 Hero & Structural** | 10 | 10 | 0 | Canonical copy, single H1, exact 2 CTA routes verified |
| **Contrast & Focus** | 6 | 6 | 0 | All text and button ratios exceed WCAG AA/AAA (7.4:1 – 13.8:1) |
| **Mobile Responsiveness (5 viewports)** | 13 | 13 | 0 | Zero horizontal overflow across 375, 390, 768, 1024, 1440; CTAs stack vertically on mobile |
| **Navbar & Mobile Menu A11y** | 15 | 15 | 0 | `aria-expanded`, Escape close + focus restore, Enter/Space, inert, dropdowns all pass |
| **Consent & Analytics (Local Guard)** | 6 | 6 | 0 | Local host guard blocks all GA scripts, events, and config calls |
| **Analytics Event Hooks (Mocked Prod)** | 5 | 5 | 0 | Exact schema verification for primary/secondary CTAs, pre-consent gating & revocation |
| **Git & Scope Parity to HEAD** | 5 | 5 | 0 | Pre-style metadata, JSON-LD, sections from about to footer, and post-nav scripts identical to HEAD |
| **Legacy Baseline Video Defects** | 8 | 4 | 4 | 4 known baseline modal defects outside hero/navbar scope (retained as legacy defects) |
| **Total Browser Runner Checks** | **68** | **64** | **4** | 4 legacy baseline video defects only; 0 new regressions |
| **Unit Tests (`npm run test:engines`)** | **60** | **60** | **0** | Includes 8/8 tests in `tests/homepage-hero-analytics.test.mjs` |

## Hero Structural & CTA Verification

- **Headline (H1)**: Exactly 1 H1 element found. Exact text content: `"Ruang untuk Pulang dan Kenali Diri"`. The prior `<br>` line break was removed in source for clean semantic flow.
- **Primary CTA (`#hero-primary-cta`)**:
  - Element: `<a href="/tes-kenali-diri/" class="btn btn-primary" id="hero-primary-cta">Kenali Diri Saya</a>`
  - Exact destination: `/tes-kenali-diri/`
  - Target height: 56.69px (exceeds 44px touch target minimum).
- **Secondary CTA (`#hero-app-cta`)**:
  - Element: `<a href="https://play.google.com/store/apps/details?id=com.bhumiamartya.app" class="btn btn-secondary" id="hero-app-cta">Download Aplikasi</a>`
  - Exact destination: `https://play.google.com/store/apps/details?id=com.bhumiamartya.app`
  - Target height: 56.69px (exceeds 44px touch target minimum).
- **Visual & Layout Simplification**: The legacy mandala decorative structure and seven competing tool buttons in the hero section were removed from hero source. The free tools remain discoverable via the Kenali Diri navigation dropdown and dedicated sections.

## Copy Comparison and Deviations

Per instructions, actual source copy was checked against user preferred canonical support copy:

| Field | User Preferred Canonical Copy | Actual Source Copy (`index.html`) | Verification Status |
| --- | --- | --- | --- |
| **Eyebrow Tag** (`.hero-tag`) | `Bhumi Amartya` | `Bhumi Amartya` | **PASS** — Subtle eyebrow tag present above H1 |
| **Supporting Copy** (`.hero-supporting`) | `Kenali pola dirimu, potensi, hubungan, dan arah pertumbuhanmu dalam satu tempat.` | `Kenali pola dirimu, potensi, hubungan, dan arah pertumbuhanmu dalam satu tempat.` | **PASS** — Exact match with canonical copy |
| **Paragraph / Subheadline** (`.hero-subheadline`) | `Bhumi membantu kamu memahami berbagai peta diri dan menerjemahkannya menjadi insight yang lebih mudah dipahami dan digunakan dalam kehidupan sehari-hari.` | `Bhumi membantu kamu memahami berbagai peta diri dan menerjemahkannya menjadi insight yang lebih mudah dipahami dan digunakan dalam kehidupan sehari-hari.` | **PASS** — Exact match with canonical copy |
| **Microcopy** (`.hero-microcopy`) | `Gratis untuk mulai • Hasil langsung • Untuk bahan refleksi` | `Gratis untuk mulai • Hasil langsung • Untuk bahan refleksi` | **PASS** — Exact match with canonical microcopy |

## Contrast and Accessibility Verification

Computed color contrast ratios against background (`rgb(253, 251, 247)`):

| Element | Foreground Color | Background Color | Computed Ratio | WCAG Compliance |
| --- | --- | --- | ---: | --- |
| **Hero Headline** | `rgb(26, 47, 32)` | `rgb(253, 251, 247)` | **13.81:1** | Exceeds AAA (>= 7.0:1) |
| **Supporting Text** | `rgb(45, 75, 52)` | `rgb(253, 251, 247)` | **9.37:1** | Exceeds AAA (>= 7.0:1) |
| **Subheadline** | `rgb(90, 82, 76)` | `rgb(253, 251, 247)` | **7.40:1** | Exceeds AAA (>= 7.0:1) |
| **Primary CTA Button** | `rgb(255, 255, 255)` | `rgb(45, 75, 52)` | **9.69:1** | Exceeds AAA (>= 7.0:1) |
| **Secondary CTA Button** | `rgb(45, 75, 52)` | `rgb(253, 251, 247)` | **9.37:1** | Exceeds AAA (>= 7.0:1) |

- **Focus Outlines**: `outline: 3px solid var(--forest-dark)` with `outline-offset: 4px` is declared for `.hero-section .btn:focus-visible`, `.header a:focus-visible`, and `.header button:focus-visible`. Computed outline confirmed active on keyboard focus.
- **Reduced Motion**: `@media (prefers-reduced-motion: reduce)` disables button and header transitions and hover transforms.

## Mobile Responsiveness & Viewports

Five viewports tested with full-page PNG captures saved to `docs/homepage-redesign/phase2/`:

| Viewport Width | Height | Scroll Width | Horizontal Overflow | CTA Layout & Reachability | Screenshot Path |
| ---: | ---: | ---: | --- | --- | --- |
| **375px** | 900px | 375px | **None** (`scrollWidth === 375`) | Stacked vertically, 327px wide each, 56.69px tall | `docs/homepage-redesign/phase2/homepage-375.png` |
| **390px** | 900px | 390px | **None** (`scrollWidth === 390`) | Stacked vertically, 342px wide each, 56.69px tall | `docs/homepage-redesign/phase2/homepage-390.png` |
| **768px** | 900px | 768px | **None** (`scrollWidth === 768`) | Stacked vertically, 420px wide each, 56.69px tall | `docs/homepage-redesign/phase2/homepage-768.png` |
| **1024px** | 900px | 1024px | **None** (`scrollWidth === 1024`) | Side-by-side inline, centered, reachable | `docs/homepage-redesign/phase2/homepage-1024.png` |
| **1440px** | 900px | 1440px | **None** (`scrollWidth === 1440`) | Side-by-side inline, centered, reachable | `docs/homepage-redesign/phase2/homepage-1440.png` |

## Navbar & Mobile Menu Improvements (vs Baseline)

Phase 2 fixed two prominent baseline accessibility failures:

1. **`aria-expanded` state synchronization**:
   - Baseline: FAILED (`aria-expanded` absent on burger button).
   - Phase 2: **PASS**. Initial `aria-expanded="false"`, switches to `"true"` on open, returns to `"false"` on close.
2. **Escape key handling & focus restoration**:
   - Baseline: FAILED (menu stayed open on Escape).
   - Phase 2: **PASS**. Pressing Escape closes the menu and immediately restores keyboard focus to `#burger-menu`.
3. **Touch Target Size**: `#burger-menu` touch target increased from 24x18px to 44x44px (`padding: 13px 10px`).
4. **Submenu inertness**: `#nav-menu` receives `inert="true"` when closed on mobile screens (<= 768px).
5. **Dropdown keyboard accessibility**:
   - Dropdown toggles have `role="button"` and `aria-controls="nav-dropdown-*"`.
   - Space key toggles dropdown; Escape closes dropdown and refocuses toggle; focusout closes open dropdowns.

## Analytics & Real Helper Verification

Tested with `assets/bhumi-analytics.js` in two isolated environments:

1. **Local Origin (`127.0.0.1`)**:
   - Even when consent is accepted locally, the host guard `isProductionHost()` strictly blocks GA4 script injection and event dispatch.
   - `dataLayer` contains only the initial default-denied consent call; zero `event` or `config` items exist.
2. **Isolated Mocked Production Hostname (`https://www.bhumiamartya.my.id`)**:
   - All network traffic intercepted locally (zero production calls).
   - **Pre-consent**: Primary CTA click emits 0 events.
   - **Rejection**: CTA clicks emit 0 events; no GA4 script loaded.
   - **Acceptance**: Consent state set to granted; `page_view` dispatched once.
   - **Primary CTA click**: Dispatches `homepage_primary_cta_click` with exact schema:
     ```json
     {
       "page_type": "homepage",
       "consent_state": "granted",
       "section": "hero",
       "item_name": "kenali_diri",
       "item_type": "primary_cta",
       "destination": "/tes-kenali-diri/"
     }
     ```
   - **Secondary CTA click**: Dispatches `homepage_app_download_click` with exact schema:
     ```json
     {
       "page_type": "homepage",
       "consent_state": "granted",
       "section": "hero",
       "item_name": "android_app",
       "item_type": "secondary_cta",
       "destination": "https://play.google.com/store/apps/details?id=com.bhumiamartya.app"
     }
     ```
   - **Revocation**: Managing consent and selecting reject immediately gates tracking. Subsequent CTA clicks emit zero events.

## Scope Parity and Baseline Classification

- **Sections outside hero/navbar**: Byte-for-byte identical to `HEAD:index.html` from `<section class="about-section"` through footer, and JavaScript controllers outside hamburger/hero CTA handlers.
- **Metadata & JSON-LD**: `<head>` metadata prior to `<style>` and JSON-LD schema (`Organization`, `WebSite`, `WebPage`) are 100% identical to HEAD.
- **Legacy Video Modal Defects**:
  - The 4 baseline video modal defects (`video trigger keyboard Enter`, `modal focus moves inside`, `modal dialog semantics`, `modal Tab remains inside`) continue to fail because the video section is outside Phase 2 scope.
  - These are confirmed **existing legacy baseline defects**, not regressions.
- **Regressions**: **ZERO** new regressions introduced.

## Verification Checklist

- [x] Baseline files in `docs/homepage-redesign/baseline/` preserved intact.
- [x] Phase 2 runner created: `docs/homepage-redesign/phase2/phase2-check.mjs`.
- [x] Phase 2 report created: `docs/homepage-redesign/phase2/HOMEPAGE_PHASE2_REPORT.md`.
- [x] 5 viewport screenshots captured in `docs/homepage-redesign/phase2/`.
- [x] Copy deviations reported without touching main source.
- [x] Unit test suites pass (`node --test tests/homepage-hero-analytics.test.mjs`, `npm run test:engines`).
