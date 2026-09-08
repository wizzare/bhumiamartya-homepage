# Homepage redesign — Phase 0/1 design foundation

Date: 2026-09-08. Status: FOUNDATION_RECORDED — REVIEW_PENDING, not ratified.
Authority/evidence: [SOT](HOMEPAGE_REDESIGN_SOT.md), [PRD requirement registry](HOMEPAGE_REDESIGN_PRD.md), [HOMEPAGE_BASELINE.md](HOMEPAGE_BASELINE.md). This is a proposal and source audit, not implemented design.

## Direction (HOME-REQ-002/003/004)

Retain the existing warm cream/forest palette and Cormorant Garamond / Plus Jakarta Sans pairing. Prefer direct static HTML and native CSS over a new component library, CMS or design system. Clarity and responsible reflection are intent, not measured psychological effects.

Proposed hero: existing H1 “Ruang untuk Pulang dan Kenali Diri”; draft supporting copy “Jelajahi berbagai sudut pandang untuk refleksi diri.” Copy requires user review. Primary “Kenali Diri Saya” → `/tes-kenali-diri/`; secondary “Download Aplikasi” → exact existing `https://play.google.com/store/apps/details?id=com.bhumiamartya.app`. Navigation URLs are repository-confirmed, live availability unknown. Use existing green primary/outline secondary styles with accessible focus; mobile stacking must retain hierarchy. Do not add unverified “hasil langsung”, no-registration, privacy guarantee, clinical outcome or app-feature badges.

## Target section IDs and preserved aliases (HOME-REQ-003)

This is the single proposed target map. Navbar/footer are landmarks, not claims about current section counts. The baseline owns actual counts and source order. Existing IDs must continue resolving even when presentation moves. Keep old aliases as unique noninteractive anchor targets at their semantic destination, not duplicate IDs or hidden interactive controls; test direct fragment loads with fixed-header offset and keyboard context. No alias markup is added in Phase 0/1.

| Target order/block | Proposed ID | Existing ID to retain / alias disposition | Analytics section key |
| --- | --- | --- | --- |
| Navbar | `header` | retain `header`; preserve control IDs until JS updates are authorized | `navbar` |
| Hero | `beranda` | retain `beranda` | `hero` |
| Problem recognition | `kegelisahan` | new; brief non-diagnostic framing, copy pending | no new event |
| What you can discover / introduction | `kejelasan` | retain `tentang` alias here for old introduction links | no new event |
| Free tools | `alat-gratis` | new; six static links in SOT | `free_tools` |
| How Bhumi works | `cara-kerja` | retain `sistem` alias for eleven perspectives, no consensus claim | `how_it_works` |
| Social proof, conditional | `cerita-pengguna` | new, reserved only; absent while blocked | no new event |
| Products | `produk` | retain `produk`; actual four-card inventory in SOT | `products` |
| App information | `aplikasi-bhumi` | new; neutral copy until features verified | `app` |
| Content | `konten` | retain `youtube` and `artikel` on their respective subgroups; preserve feed container IDs | `content` |
| Responsible use | `penggunaan-bijak` | retain `testimoni` alias HERE because existing destination is ethical guidance | `responsible_use` |
| Founder and methodology links | `founder` | retain `founder` | `founder` |
| Final CTA | `final-cta` | retain `download-cta` alias | `final_cta` |
| Footer | `kontak` | retain `kontak` | `footer` |

Do not redirect `#testimoni` to a fabricated testimonial section; relabel future navigation to responsible use. Preserve all old section/landmark anchors: `header`, `beranda`, `tentang`, `sistem`, `produk`, `youtube`, `artikel`, `testimoni`, `founder`, `download-cta`, `kontak`. Old script hooks (`nav-menu`, `burger-menu`, article/video containers, slider and modal IDs) are dependencies, not casually renameable anchors.

Narrative proposal: navbar → hero → problem → discovery → tools → method → optional approved social proof → products → app → content → responsible use → founder → final CTA → footer. **BLOCKED_FOUNDER_INPUT — Option A: no production render until approved**, including no reserved-height gap, placeholder carousel, invented quotes/initials or star decoration. Existing ethics will later become plain guidance. Widhi Wedhaswara is the person; methodology and contact are concepts/functions, not team members. No invented founder quote or portrait.

## Token audit matrix (HOME-REQ-007)

**CSS-CONSOLIDATION: DEFERRED_UNTIL_VISUAL_BASELINE_STABLE. NO CSS extraction prerequisite.** Root currently uses inline CSS, not the external shared stylesheet. Canonical proposals below preserve existing values unless accessibility review requires a narrowly scoped change. They are documentation decisions pending review, not a new token system or migration instruction.

| Token / role | Actual inline source and usage | External definition / usage | Canonical proposal |
| --- | --- | --- | --- |
| `--bg-primary` | `#FDFBF7`, index `84`, body `116`, drawer `1836` | same, shared CSS `3`, `23` | keep existing name/value |
| `--bg-secondary` | `#F4EFE6`, `85`, alternate sections `162`, cards `622` | same, CSS `4`, `30`, `73` | keep |
| `--text-primary` | `#1A2F20`, `86`, headings `127`, footer background `1541` | same, CSS `5`, `24`, `125` | keep |
| `--text-secondary` | `#5A524C`, `87`, paragraphs `132` | same, CSS `6`, `25` | keep; verify rendered contrast |
| `--forest-green` | `#2D4B34`, `88`, primary button `210` | same, CSS `7`, `36` | primary action color |
| `--forest-dark` | `#1F3625`, `89`, primary hover `216`, video `925` | same, CSS `8`, `37` | retain hover/dark surface |
| `--forest-light` | `#EAF0EB`, `90`, secondary hover `228` | same, CSS `9`, `39` | retain subtle surface |
| `--earth-gold` | `#D4AF37`, `91`, nav underline `330`, video play `970` | same, CSS `10`, `49` | decorative accent; not automatic text contrast approval |
| `--gold-dark` | `#AA8310`, `92`, section tag `176` | same, CSS `11`, `32` | retain provisionally; check normal text on cream/white |
| `--white` | `#FFFFFF`, `93`, primary text `211`, cards `708` | same, CSS `12`, `36`, `96` | retain |
| `--shadow-sm/md/lg` | `0 4px 12px rgba(45,75,52,.03)` / `0 8px 30px rgba(45,75,52,.05)` / `0 16px 40px rgba(45,75,52,.08)`, `94–96`; header/cards `272`, `557`, `735` | same, CSS `13–15`, `41`, `98` | retain; no extra shadow scale |
| `--transition` | `all 0.4s cubic-bezier(0.16,1,0.3,1)`, `97`, links/buttons `140`, `204` | same, CSS `16`, `26`, `35` | retain baseline value; later scope animated properties/motion support rather than invented .35s normalization |
| `--font-headings` | Cormorant Garamond, Georgia, serif, `98`, headings `125` | same, CSS `17`, `24` | retain existing family/fallback |
| `--font-body` | Plus Jakarta Sans, system-ui, -apple-system, sans-serif, `99`, body `115` | same, CSS `18`, `23` | retain existing family/fallback |
| `--container-width` | `1200px`, `100`, container `151` | same, CSS `19`, `28` | retain fluid container and current 1.5rem gutters |
| Spacing/radii (literal, not tokens) | section 7rem (`157`), mobile 4.5rem (`1751`); button 50px (`199`); cards 20/24px (`709`, `783`) | section 7rem, mobile 5rem (CSS `29`, `199`); button 50px (`35`) | keep inline baseline; no new `space-*` or radius scale |
| Hero typography (literal) | H1 4rem/1.1 (`464`), 3.25rem at 1024 (`1742`), 2.75rem at 768 (`1766`), 2.25rem at 480 (`1996`) | external `.page-hero h1` 3.5rem/1.1 (`65`), not homepage hero | use current sizes as baseline, validate wrapping before choosing changes |
| Untokenized footer colors | `#A3ACA7` (`1561`, `1615`), `#7B8580` (`1653`) | `#A3ACA7` (`131`, `143`) | preserve pending contrast check; no invented token expansion |
| Consent runtime styles | separate JS literal surface `#fffdf8`, text `#304536`, buttons `#31533b`, radius18px, min-height42px (`assets/bhumi-consent.js:46–48`) | not supplied by shared CSS | leave isolated; audit overlap/contrast/targets without conflating palette |

Do not blindly link/extract shared CSS: `.section-header` is 650px inline (`index.html:167`) vs 720px external (`CSS:31`); founder avatar 180px inline (`1378`) vs 120px external (`107`); footer grid two columns (`1549`) vs three (`126`); Play button white inline (`1507`) vs black external (`120`); reveal uses `.reveal-visible` inline (`1725`) vs `.show` external (`151`). Matching root tokens does not imply identical components or safe cascade replacement. Legal pages have their own CSS too. No unused `--gold-light`, border-token layer or invented spacing scale is introduced.

## Accessibility issue backlog (HOME-REQ-008)

These are source findings/proposed checks, not completed remediation or blanket conformance failures. See baseline for the precise locally exercised failures and test limitations; do not extrapolate one mobile interaction suite to all devices.

| Issue | Actual evidence | Later acceptance/check |
| --- | --- | --- |
| Button focus suppression | `.btn` has `outline:none`, `index.html:206`; shared CSS `35` likewise | Visible focus indicator across surfaces; keyboard and forced-colors checks |
| Mobile menu semantics/escape | burger `2165` lacks expanded/controls state; toggle `2998–3008` changes classes/overflow only | State announcement, Escape, focus restoration, closed-menu tab behavior; choose nonmodal disclosure or fully managed modal semantics intentionally |
| Dropdown state mismatch | static `aria-expanded=false` at `2126` etc; visibility via hover/focus-within `365`; JS prevents placeholder navigation `3019` without state update | Native button disclosure/state behavior, keyboard access and no focus trap; desktop runtime pending |
| Video activation | clickable DIV placeholders `2522`, `3267`; click hooks `3218`, `3284` | Native accessible activation, Enter/Space, visible focus |
| Video modal semantics/focus | `3516` only aria-hidden; iframe `3522` lacks title; open/close `3188–3209` do not manage focus | Named dialog and iframe, initial/contained/restored focus, Escape; actual iframe keyboard/playback remains live-dependent |
| Small controls | burger 24×18 (`413–414`), slider dots 10×10 (`1335–1336`), social links 40×40 (`1573–1574`) | Measure hit areas/spacing; WCAG 2.2 AA target-size minimum 24×24 or valid exceptions; aim 44×44 for comfort, not mislabel 44px as AA requirement |
| Motion/autoplay | rotating/floating loops `531`, `542`, `579`; slider timer `3144–3180`; reduced-motion rule `1199` covers only skeleton | Respect reduced motion for all relevant effects; remove ethics carousel rather than build more controls; if retained later, provide pause and keyboard-safe behavior |
| No-JS/reveal visibility | `.reveal` opacity0 `1718`, observer dependency `3057`; article initial skeletons `2649` | Main copy/CTAs readable without JS or observer; meaningful article fallback; no claim of current no-JS support |
| Heading/landmark structure | H2 then H4 about `2241/2255`, video `2513/2532`; footer H4/H5 `2934/2958`; root lacks main/skip link | One H1, logical section/card headings, main landmark and skip navigation; inspect accessibility tree |
| Contrast/focus/zoom | gold tags `176`, video play `970`, muted footer `1653`, fixed header `257` and consent overlay styles | Calculate actual rendered contrast: normal text >=4.5:1, large text >=3:1, relevant UI >=3:1; test focus not obscured, 200%/400% zoom and reflow; no fabricated ratios |
| Decorative images/icons | repeated logo alt `2118/2198/2933`, unhidden SVG ornamentation `2201` etc | Decide decorative versus meaningful alternatives by context, avoid redundant announcements, preserve dimensions |

Trust-boundary follow-up: dynamic YouTube values interpolate into HTML (`index.html:3254–3279`); article links escape HTML but accept upstream URLs (`3380`, `3450`). Future authorized feed work must validate schemes/hosts and avoid unsafe HTML insertion. No security fixes or backend actions in this docs-only phase.

## Baseline and review limits (HOME-REQ-001/009/010)

Read [baseline screenshot table and conditions](HOMEPAGE_BASELINE.md#screenshots) for captures at 375, 390, 768, 1024 and 1440; do not duplicate metrics or claim production fonts/images were rendered. Local external/API blocking means those screenshots do not establish live visual parity, performance, real YouTube playback or valid feed data. Baseline's runnable check belongs to the sibling agent; this edit pass did not rerun it or overwrite images.

Later hero review should compare approved copy/CTA structure against these local references, then establish a comparable fully loaded visual baseline when authorized. Accessibility backlog, field performance, live links and analytics delivery remain unresolved. **STOP: next Phase 2 — Hero Redesign requires explicit user approval.** CSS extraction is not a prerequisite; social proof stays omitted until authentic approval.
