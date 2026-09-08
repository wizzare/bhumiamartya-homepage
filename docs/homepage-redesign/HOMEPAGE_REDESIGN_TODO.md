# Homepage redesign — Phase 0/1 TODO and unresolved gate

Date: 2026-09-08. Status: FOUNDATION_RECORDED — REVIEW_PENDING; not ratified, not ready for automatic execution.
Authority: [SOT](HOMEPAGE_REDESIGN_SOT.md). Requirements: [PRD](HOMEPAGE_REDESIGN_PRD.md). Presentation/backlog: [DESIGN](HOMEPAGE_REDESIGN_DESIGN.md). Local evidence: [HOMEPAGE_BASELINE.md](HOMEPAGE_BASELINE.md).

Latest user requirements override all prior phase numbering. Phase 0/1 below is documentation/evidence only. A checked box means the stated review/record exists, not that its proposed production implementation passed. Old TODO/AC IDs are retired; HOME-REQ-001 through HOME-REQ-010 in PRD are the sole registry.

## Phase 0 — Existing source and baseline review

- [x] HOME-REQ-001: Read all four owned redesign docs before replacing unsupported material; read actual root index, analytics/consent/AdSense assets, shared CSS, package, README, Vercel config and relevant terms/privacy/disclaimer/methodology files.
- [x] HOME-REQ-001: Read-only Git confirms branch `feat/homepage-redesign-2026`; preserved dirty gitlink `e4a4b38` → `7837911` and child untracked `app/api/verify-db/route.ts`. `git submodule status` reports missing mapping; direct child status/HEAD confirms state. No cleanup or repair attempted.
- [x] HOME-REQ-001: Record requested September audit NOT found; old July audit is not current evidence. Do not use it for metrics or approval.
- [x] HOME-REQ-001/009: Read sibling HOMEPAGE_BASELINE.md, link its DOM/CTA counts, interaction results, screenshots, reproducibility and limits. No independent rerun, screenshot alteration or duplicate invented evidence.
- [x] HOME-REQ-002/003: Confirm exact primary route and Play href in source; distinguish repository/link-existence evidence from live availability. Map six tools, eleven system cards, actual products and navigation.
- [x] HOME-REQ-005: Read actual legal limitations; record unverified app/policy statements and conflicting privacy-page location for owner review.
- [x] HOME-REQ-006: Record helper allowlist/normalization, metadata loss, production host/consent guards, query-free page location and unsupported existing MBTI event. No tracking helper or production config changed.
- [ ] HOME-REQ-001: Obtain original September audit if user still requires reconciliation; its absence is explicitly recorded, not silently substituted.
- [ ] HOME-REQ-002/003/005: Verify production/internal redirects, new proposed legal links, external/social links and Play regional availability when authorized. Baseline local file resolution is not full HTTP/end-to-end link testing.
- [ ] HOME-REQ-008: Complete runtime accessibility checks beyond baseline's limited mobile menu/video/consent suite: desktop dropdowns, full focus cycles/restoration, screen reader, zoom/reflow, reduced motion, no-JS and real iframe controls.
- [ ] HOME-REQ-009: Collect authorized comparable fully loaded visual/performance and field/business baselines. No Lighthouse score, field INP, CTR, installs or conversion uplift verified here.

## Phase 1 — Documentation-only foundation

- [x] HOME-REQ-001/010: Replace ratified/ready-to-execute status with explicit review-pending foundation and STOP gate. Edit only the four owned docs; no source redesign, commit, deployment or DB action.
- [x] HOME-REQ-002: Record primary `/tes-kenali-diri/`, secondary exact existing Play URL and future two-CTA hierarchy, with live availability unknown.
- [x] HOME-REQ-003: Record direct static HTML content map; target section IDs and old anchor aliases in DESIGN. No new CMS, JSON renderer, framework migration or arbitrary route invention.
- [x] HOME-REQ-004: Remove invented testimonial/founder quotations, initials, professions, statistics, product lengths and unverified consensus/app claims. Set **BLOCKED_FOUNDER_INPUT — Option A: no production render until approved**. Existing source remains unchanged.
- [x] HOME-REQ-005: Separate responsible-use guidance from testimonials and founder person from methodology/support concepts; map legal/SEO preservation requirements.
- [x] HOME-REQ-006: Specify exactly seven homepage events and allowlisted item_name/item_type/destination/section, query/PII exclusions, consent/host controls and deduplication. Tool navigation is not tool_started. Contract is not deployed.
- [x] HOME-REQ-007: Audit used inline/external tokens, literal differences and canonical proposals; **CSS-CONSOLIDATION DEFERRED_UNTIL_VISUAL_BASELINE_STABLE**. No CSS extraction prerequisite; no new design system.
- [x] HOME-REQ-008: Create actual-source accessibility backlog with evidence and later acceptance checks, linked to sibling runtime results.
- [x] HOME-REQ-009: Replace fabricated business/performance numbers with BASELINE_REQUIRED; field good p75 LCP <= 2.5 s / CLS <= 0.1 / INP <= 200 ms, not Lighthouse INP.
- [x] HOME-REQ-001/010: Crosscheck four-doc registry references and phase/CTA/social-proof/CSS gate consistency by document review.
- [ ] HOME-REQ-004: Founder supplies approved copy and authentic testimonial source/permission/attribution/service context, or explicitly accepts continued omission. No fake examples while waiting.
- [ ] HOME-REQ-004/005: Founder verifies commercial terms, app feature claims, biography/asset permissions and conflicting legal-page identity details before related copy is used. Do not access DB or app admin to infer approval.
- [ ] HOME-REQ-006: Later authorized helper changes and isolated allowlist/consent/host/deduplication/PII tests. Production GA4 reporting setup and delivery verification require separate approval; neither done nor implied.
- [ ] HOME-REQ-010: User reviews/approves foundation, proposed hero copy, CTA hierarchy and anchor strategy; records disposition of remaining evidence gaps. No automatic gate closure.

## Verification and commands

Read-only Git commands used from parent: `git status --short --branch`, `git diff --submodule=short`, `git submodule status`. From child: `git status --short --untracked-files=all`, `git rev-parse HEAD`. The submodule mapping error is a known inspection limitation, not an instruction to modify Git configuration.

`package.json:7–9` provides only `npm run test:engines` (`node --test tests/*.test.mjs`). Session verification ran `npm --prefix bhumiamartya-homepage run test:engines`: 52 passed, zero failed. Initial `npm --prefix bhumiamartya-homepage test` failed because no `test` script exists; this was corrected by using the declared script. README supplies no other validation command. **Lint and typecheck commands are missing** from the root package; ask user for canonical commands instead of inventing scripts, installing dependencies, borrowing the child Next commands or presenting syntax checks as lint.

The sibling baseline owns the existing runnable check and its results. Reproduction when authorized:

```sh
node --check docs/homepage-redesign/baseline-check.mjs
node docs/homepage-redesign/baseline-check.mjs
```

The second command overwrites sibling screenshots and intentionally exits nonzero while documented defects remain; do not run it during this four-doc ownership pass. Read its report for metrics, conditions and results. Its static server blocks APIs/external requests: fallback console errors are imposed local limitations, not proof of a production outage. Zero uncaught exceptions is not zero console errors. Lighthouse was unavailable in that run; no dependencies installed or performance claims added.

## Phase 2 — Hero Redesign

Status: VERIFIED_WITH_ACTUAL_RESULTS. Evidence report: [HOMEPAGE_PHASE2_REPORT.md](phase2/HOMEPAGE_PHASE2_REPORT.md).
Runner: `docs/homepage-redesign/phase2/phase2-check.mjs`. Screenshots: `docs/homepage-redesign/phase2/homepage-{375,390,768,1024,1440}.png`.

- [x] HOME-REQ-002: Hero two-CTA hierarchy implemented and verified in browser: primary `a#hero-primary-cta` to `/tes-kenali-diri/` ("Kenali Diri Saya") and secondary `a#hero-app-cta` to `https://play.google.com/store/apps/details?id=com.bhumiamartya.app` ("Download Aplikasi"). Touch targets >= 56px height (exceeds 44px minimum).
- [x] HOME-REQ-002/008: Single H1 "Ruang untuk Pulang dan Kenali Diri" verified without line breaks. Mobile responsiveness verified across 375, 390, 768, 1024, 1440 viewports with zero horizontal overflow (`scrollWidth === innerWidth`). CTAs stack vertically full width on mobile viewports.
- [x] HOME-REQ-004: Copy audited and updated to exact user preferred canonical copy: eyebrow tag (`Bhumi Amartya`), supporting text (`Kenali pola dirimu, potensi, hubungan, dan arah pertumbuhanmu dalam satu tempat.`), subheadline paragraph (`Bhumi membantu kamu memahami berbagai peta diri dan menerjemahkannya menjadi insight yang lebih mudah dipahami dan digunakan dalam kehidupan sehari-hari.`), and microcopy (`Gratis untuk mulai • Hasil langsung • Untuk bahan refleksi`). Zero copy deviations.
- [x] HOME-REQ-006: Real analytics helper event hooks verified in isolated mocked production environment (`https://www.bhumiamartya.my.id`) with request interception (zero production calls). Pre-consent and post-revocation clicks emit 0 events; consented clicks emit exact schemas for `homepage_primary_cta_click` and `homepage_app_download_click`. Local host guard blocks tracking on 127.0.0.1. Unit tests pass 8/8 in `tests/homepage-hero-analytics.test.mjs` and 60/60 in `npm run test:engines`.
- [x] HOME-REQ-007/008: Text and CTA contrast ratios verified in browser (7.40:1 to 13.81:1, exceeding WCAG AAA 7.0:1). Focus visible outlines active on CTAs and header elements. Prefers-reduced-motion media query active.
- [x] HOME-REQ-008: Mobile navbar accessibility verified: burger button initial `aria-expanded="false"`, `aria-controls="nav-menu"`, `aria-label="Menu navigasi"`, touch target 44x44px. Escape key closes menu and restores focus to burger button (fixes baseline failure). Menu inert when closed on mobile. Dropdown keyboard navigation (`role="button"`, Space toggle, Escape close + refocus) verified.
- [x] HOME-REQ-001/009: Verified outside hero/navbar scope is identical to HEAD (metadata pre-style, JSON-LD schema, sections about to footer, and post-nav scripts). Legacy baseline video defects (4 modal focus/dialog defects) classified as existing baseline defects outside hero scope. Zero new regressions detected (64 pass, 4 fail: 4 legacy defects only, 0 regressions).

Reproduction commands:

```sh
node --check docs/homepage-redesign/phase2/phase2-check.mjs
node docs/homepage-redesign/phase2/phase2-check.mjs
npm run test:engines
```

LINT=NOT_CONFIGURED, TYPECHECK=NOT_APPLICABLE. Baseline files in `docs/homepage-redesign/baseline/` remain untouched. No commit performed.
