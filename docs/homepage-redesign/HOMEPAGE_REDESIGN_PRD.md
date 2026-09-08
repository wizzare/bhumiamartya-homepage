# Homepage redesign — Phase 0/1 PRD

Date: 2026-09-08. Status: FOUNDATION_RECORDED — REVIEW_PENDING, not ratified.
Authority: [SOT](HOMEPAGE_REDESIGN_SOT.md). Evidence: [HOMEPAGE_BASELINE.md](HOMEPAGE_BASELINE.md). Presentation: [DESIGN](HOMEPAGE_REDESIGN_DESIGN.md). Execution gate: [TODO](HOMEPAGE_REDESIGN_TODO.md).

## Scope and requirement registry

Latest user instructions replace prior numbering. These IDs replace the old HOME-REQ/SEO/AEO/A11Y and TODO/AC registries; old IDs are not parallel requirements. Requirements below specify a foundation or future acceptance, not completed implementation.

| ID | Requirement | Acceptance / verification |
| --- | --- | --- |
| HOME-REQ-001 | Evidence-led Phase 0/1, four docs only | Source versus local runtime versus live evidence distinguished; baseline linked; missing September audit explicitly recorded; no July metrics reused; no source, DB, commit, deployment or production config changes |
| HOME-REQ-002 | Hero and final CTA hierarchy | Future hero has one primary `/tes-kenali-diri/`, one secondary exact repository Play URL in SOT; preserve other tools elsewhere; runtime navigation pending |
| HOME-REQ-003 | Static content map and anchor continuity | SOT maps navigation, six tools, eleven systems, actual four products, content/legal; DESIGN assigns target IDs and old aliases; no CMS or frontend migration |
| HOME-REQ-004 | Truthful copy, social proof and founder identity | BLOCKED_FOUNDER_INPUT, Option A: no production social-proof render until approved; no fabricated examples; one founder person, separate concepts; no unverified consensus/app/commercial claims |
| HOME-REQ-005 | Responsible use, legal and SEO preservation | Retain educational/non-diagnostic limits and canonical/OG/JSON-LD identity; planned legal links source-mapped, runtime pending; no speculative FAQ schema |
| HOME-REQ-006 | Seven homepage analytics events, privacy-preserving | Contract below documented; later helper support, consent/host/sanitization/deduplication tests required; no deployed helpers/config changes now |
| HOME-REQ-007 | Existing-token audit, no extraction prerequisite | DESIGN compares inline/external used values and proposes canonical choices; CSS-CONSOLIDATION DEFERRED_UNTIL_VISUAL_BASELINE_STABLE; no new design system |
| HOME-REQ-008 | Source-backed accessibility remediation backlog | DESIGN records actual sources and pending checks; baseline failures linked; future keyboard, focus, motion, semantics, contrast and touch verification, not blanket compliance claim |
| HOME-REQ-009 | Honest performance and business measurement | BASELINE_REQUIRED for absent measures/targets; local screenshots not live parity; CWV good field p75 LCP <= 2.5 s, CLS <= 0.1, INP <= 200 ms; Lighthouse not INP evidence |
| HOME-REQ-010 | Explicit next-phase stop gate | Next exactly Phase 2 — Hero Redesign; approval unresolved; no source implementation until user explicitly authorizes |

## Product intent, not fabricated business goals

Help visitors understand the reflective purpose, choose an initial tool and find app/product information without presenting symbolic models as facts. New visitors, specific-tool seekers and returning visitors are planning audiences, not research-validated personas. Conversion improvement is a hypothesis; no uplift, bounce, scroll, traffic or install target has been approved.

| Measure | Baseline | Target/decision |
| --- | --- | --- |
| Hero primary CTA CTR | BASELINE_REQUIRED | BASELINE_REQUIRED; agree eligible consented homepage-view denominator, window and sample before setting target |
| Free-tool outbound navigation rate | BASELINE_REQUIRED | BASELINE_REQUIRED; not starts/completions |
| Play outbound rate | BASELINE_REQUIRED | BASELINE_REQUIRED; not installs |
| Product/content navigation | BASELINE_REQUIRED | BASELINE_REQUIRED |
| Engagement/bounce/scroll depth | BASELINE_REQUIRED | BASELINE_REQUIRED; no scroll instrumentation added by this contract |
| Lighthouse performance / transfer budget | BASELINE_REQUIRED | BASELINE_REQUIRED; no invented score or mandatory byte budget |
| Field CWV | BASELINE_REQUIRED | Good at p75: LCP <= 2.5 s, CLS <= 0.1, INP <= 200 ms, segmented mobile/desktop |

Use the baseline report for recorded DOM/layout and browser results, not substitute business data. Lighthouse lab LCP/CLS and TBT can diagnose performance; TBT is not INP and Lighthouse cannot establish field p75. Sampling, field data availability, environment and a comparable visual/performance baseline remain pending.

## Analytics contract (HOME-REQ-006)

### Actual helper limitations

`assets/bhumi-analytics.js:8–17` gates loading on production hostname and consent. `46–55` normalizes known names, drops unknown names, and can rename app/download/contact-shaped names. `90–96` sends only page_type, consent_state and optional safe tool_name: arbitrary metadata is discarded. Merely attaching proposed homepage listeners would not implement this contract. The existing MBTI hero event (`index.html:3010–3014`, `mbti_cta_clicked`) is not accepted by that allowlist.

Existing page_view remains helper-owned, once per page load after consent, with query-free page location (`57–87`). Do not add a second page_view or an eighth homepage event. This is gtag loading, not evidence of an independently configured GTM container. No helper changes, deployed helpers, GA4 custom-dimension setup, host bypass or production configuration changes occur here.

Consent contract: default deny; accept/reject/manage and reload persistence use `bhumi_consent_v1` and `bhumi:consent` (`assets/bhumi-consent.js:4–35`, `66–76`). Denied/revoked clicks must not send or queue for later replay. Ads storage/user-data/personalization stay denied. Local host guard stays intact. The separate AdSense loader (`assets/bhumi-adsense.js:3–11`) checks host, not consent; do not claim all third-party requests are consent-gated. Owner review is pending, no change here.

### Exactly seven requested homepage events

Fire once per genuine activation (mouse, touch or keyboard), not on render, visibility, fetch, form start or hover. Primary/secondary means CTA role; app-card/showcase/footer Play links use app event. A more specific event wins over generic navigation so one activation never produces two homepage events. Repeated deliberate clicks may be separate events; do not use trackOnce to suppress all later actions.

| Event | Trigger | item_name / item_type | section allowlist |
| --- | --- | --- | --- |
| `homepage_primary_cta_click` | Primary hero/final link activation | `tes_kenali_diri` / `tool` | `hero`, `final_cta` |
| `homepage_secondary_cta_click` | Secondary hero/final Play activation | `bhumi_app` / `app` | `hero`, `final_cta` |
| `homepage_tool_click` | Tool directory activation | one of six SOT tool keys / `tool` | `free_tools` |
| `homepage_product_click` | Non-app product information activation | `blueprint_reading`, `compatibility_reading`, `reiki_sound_healing`, `ebook` / `product` | `products` |
| `homepage_app_click` | App showcase/card or dedicated non-hero Play link | `bhumi_app` / `app` | `app`, `products`, `navbar`, `footer` |
| `homepage_content_click` | Article navigation, video activation or archive/playlist navigation | approved content key / `article`, `video`, `collection` | `content` |
| `homepage_navigation_click` | Remaining navbar/footer or trust/ethics/founder navigation | approved static navigation key / `navigation` | `navbar`, `footer`, `how_it_works`, `responsible_use`, `founder` |

`homepage_tool_click` is NOT `tool_started`. Actual start belongs to the destination's real user input/start action. Play click is NOT download/install confirmation; video activation is NOT successful playback. Do not auto-map these events to legacy tool_started/app_download events. Existing non-homepage tool reporting must remain compatible when helper changes are later authorized.

### Payload allowlist and destination policy

Only these four custom metadata keys are permitted: `item_name`, `item_type`, `destination`, `section`. Helper-owned `page_type=homepage` and `consent_state=granted` may remain. All values must be validated against explicit approved mappings; never spread a supplied metadata object, infer item names from free text, or capture raw href/location/referrer, textContent, titles or form values.

- `item_name`: the static SOT keys above; navigation keys `home`, `free_tools`, `products`, `content`, `about`, `contact`, `methodology`, `terms`, `privacy_policy`, `disclaimer`, `founder`, `responsible_use`, `ebook`, plus the six tool keys when in navigation. Content collection keys `bhumi_articles`, `wedhaswara_articles`, `youtube_playlist`; curated video keys `sleep_healing`, `emotional_healing`, `warkop_jiwa`, `meditasi_hening`, `penyelarasan_cakra`, `filosofi_berserah`. Dynamic content defaults to an approved collection key/destination; per-item IDs require a reviewed explicit mapping first. No arbitrary titles/slugs enter analytics.
- `item_type`: exactly `tool`, `app`, `product`, `article`, `video`, `collection`, `navigation`, restricted per event table.
- `section`: exactly the event-specific values above; semantic placement, not DOM text. DESIGN maps IDs to section keys.
- `destination`: emit a fixed mapped value, never the original href. Internal allowlist: `/`, the six SOT tool paths, `/ebook/`, `/ebooks/`, `/articles/`, `/about/`, `/contact/`, `/methodology/`, `/terms/`, `/privacy-policy/`, `/disclaimer/`, and approved same-document target fragments in DESIGN. Do not send arbitrary internal paths containing user data.
- External destination allowlist: `https://play.google.com/store/apps/details`, `https://wa.me/6285810531892`, `https://wedhaswara.my.id/`, `https://youtube.com/playlist`, `https://www.youtube.com/embed/`. These are analytics-only normalized values. Preserve the exact navigation Play query and existing playlist/video/WhatsApp href behavior separately. Social links are untracked until a reviewed fixed mapping is approved, rather than expanding to any external host/path.
- Strip query strings from every analytics destination, including Play `id`, playlist `list`, video autoplay and WhatsApp `text`. Permit only the fixed section fragments, never arbitrary fragments; discard credentials and reject unexpected schemes/hosts/ports/paths before mapping. Unknown event/item/type/destination/section tuples fail closed: no event, while navigation still works.
- Never include visitor name/email/phone, birth date/time/place, journal text, answers, reading/results, PDF names, identifiers, query strings or free-form search. The fixed public business WhatsApp destination is not visitor contact data.

### Later implementation verification, currently pending

Before any analytics implementation is accepted: test all seven exact event names and permitted tuples; assert unknown keys/values dropped; test query/PII injection rejection, keyboard/pointer single firing, nested-element bubbling, dynamically loaded content, page_view once, denied/revoked consent with no replay, accepted reload, production/nonproduction host guard and legacy tool events. Use isolated mocks with no production traffic. A separate authorized production delivery/DebugView check is needed; a local host-guard pass is not delivery proof. GA reporting configuration requires separate explicit approval.

## Content and safety acceptance

HOME-REQ-004: founder supplies approved authentic testimonials and permission before social proof can render. Option A omits the production section entirely while blocked; do not expose BLOCKED_FOUNDER_INPUT labels or fake placeholders to visitors. Ethics remains useful independently. App features appearing in current marketing/privacy text are not independently verified; showcase copy must remain neutral until approved evidence. Eleven named systems do not prove consensus, prediction accuracy, medical benefit or complete backend support.

HOME-REQ-005/008: retain native links, meaningful labels, one H1, logical headings and semantic landmarks; decorative assets use appropriate empty alt/hidden semantics, informative images need meaningful alternatives. Preserve canonical/OG/Organization/WebSite/WebPage facts rather than inventing schema claims. Future acceptance needs actual keyboard, focus, touch, zoom, motion and contrast checks. No blanket WCAG certification based on a Lighthouse score.

## Gate

HOME-REQ-010: **UNRESOLVED — STOP before Phase 2 — Hero Redesign**. Record explicit user approval, accepted copy/CTA/anchor plan and disposition of baseline/live gaps first. Social-proof omission is the safe default pending founder input. HOME-REQ-007: **CSS-CONSOLIDATION DEFERRED_UNTIL_VISUAL_BASELINE_STABLE**; no CSS extraction prerequisite and no new design system. Nothing here authorizes source edits or release.
