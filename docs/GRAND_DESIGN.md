# Grand Design — Bhumi Amartya Ecosystem

**Status:** ACTIVE — target-state design document.
**Scope:** Vision, ecosystem, journey, flywheel, and information architecture for the website. Product decisions here must trace back to `docs/SOT.md`; if they don't, `SOT.md` wins.
**Last updated:** 2026-09-25

## 1. Vision

Bhumi Amartya is a self-discovery, personal-growth, and community ecosystem — not a single reading-service page. The website's job is to be the **discovery and trust layer** of that ecosystem: it introduces perspectives (Kenali Diri), routes people into deeper practice (Bertumbuh, Menjalani), and connects them to people (Terhubung), then hands off to the app and community channels for ongoing engagement.

## 2. Ecosystem

```
                     ┌─────────────────────────────┐
                     │        WEBSITE (SoT)         │
                     │  discovery · trust · funnel   │
                     └───────────────┬───────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
      ┌───────▼───────┐     ┌────────▼────────┐    ┌────────▼────────┐
      │  Bhumi App      │     │ Komunitas Bhumi  │    │ Content/Article │
      │  (mobile)       │     │ Amartya          │    │ pipelines       │
      │  practice,      │     │ (Sobat Mistis)   │    │ (Morning Brew,  │
      │  journal,       │     │ Ngopi Ilmu,      │    │ Artikel Web)    │
      │  blueprint app  │     │ Ngopi Rasa,      │    │                 │
      │                 │     │ Rabu Bertumbuh,  │    │                 │
      │                 │     │ Kelas, Event     │    │                 │
      └─────────────────┘     └──────────────────┘    └─────────────────┘
```

The website is the **source of truth for positioning and first contact**; the app is where daily practice happens; the community is where retention and social proof happen; content pipelines (already implemented — see `docs/MORNING_BREW_AUTOPUBLISH.md`, `docs/ARTICLE_WEB_AUTOPUBLISH.md`) feed the `/articles/` SEO/AEO surface that drives DISCOVER.

## 3. Customer Journey (detail)

```
DISCOVER  → EXPLORE → UNDERSTAND → DEEP DIVE → PRACTICE → CONNECT → GROW
```

| Stage | What happens | Primary surface (target) | Primary surface (current) |
| --- | --- | --- | --- |
| Discover | User finds Bhumi via Google, ChatGPT/AI search, TikTok, Instagram, YouTube, community, referral | Landing pages per system, `/articles/` | Homepage (`index.html`), `/articles/` (existing) |
| Explore | User tries free tools | `/kenali-diri/human-design/`, `/kenali-diri/life-path/`, `/kenali-diri/destiny-matrix/`, `/kenali-diri/natal-chart/`, `/tes-kenali-diri/` | `/kenali-diri/human-design/`, `/tes-kenali-diri/` (existing) |
| Understand | Short result + related articles | Per-tool result page + article links | Partial — `/tes-kenali-diri/` shows inline result |
| Deep Dive | Personal Blueprint Bhumi | `/kenali-diri/personal-blueprint/` | Not a dedicated public page yet; `/blueprint/` exists as an internal calculator wrapper, not the public Personal Blueprint product page |
| Practice | App, journal, reflection, inner work, Ngopi Ilmu, Ngopi Rasa | App deep link + `/ngopi-ilmu/` + community pages | `/ngopi-ilmu/` exists; Ngopi Rasa page does not exist |
| Connect | Komunitas Bhumi Amartya | `/komunitas/` | Does not exist yet |
| Grow | Classes, events, consultation, programs | `/komunitas/` events section | Does not exist yet |

## 4. Business Flywheel

```
Free tool result (EXPLORE)
        │
        ▼
Trust + curiosity built (UNDERSTAND)
        │
        ▼
Personal Blueprint deep dive (DEEP DIVE) ──► App install / practice (PRACTICE)
        │                                             │
        ▼                                             ▼
Community join (CONNECT) ◄───────────────────────────┘
        │
        ▼
Classes / events / consultation (GROW)
        │
        ▼
Social proof + referral ──────► feeds back into DISCOVER
```

Community is the flywheel's retention hub: it converts one-time visitors (who came for a free calculator) into repeat, referring participants — which is why it must be prominent on the homepage rather than buried in the footer.

## 5. Role of the Website

The website is responsible for:
1. Communicating positioning correctly (ecosystem, not reading-service).
2. Running free self-discovery tools as an acquisition funnel into Personal Blueprint.
3. Making Community visible and joinable, not just linked.
4. Being SEO/AEO/GEO-ready so DISCOVER works organically and via AI search/ads.
5. Respecting health, epistemic, and claim-governance guardrails in all copy.

The website is **not** responsible for: daily practice tooling (app's job), engine calculation correctness (see `docs/blueprint-engines-*.md`), or community real-time chat (external community platform's job — website only surfaces and links to it).

## 6. Relationship: Website ↔ Community ↔ App

- **Website → Community:** website surfaces community programs (Sobat Mistis, Ngopi Ilmu, Ngopi Rasa, Rabu Bertumbuh, Kelas Sobat Mistis, events) and provides join/CTA links. Website does not host community chat itself.
- **Website → App:** website links out to the app (Play Store, per `version.json`) for ongoing practice (journal, inner work, blueprint app). Website must not gain new runtime dependencies on the app's hosted assets/pages beyond what already exists.
- **Existing coupling to be aware of:** `vercel.json` currently rewrites `/_next/:path*`, `/images/:path*`, and `/founder/:path*` to `bhumi-amartya-clean.vercel.app`, and several routes (`/cek-aura/`, `/kalkulator-cinta/`, `/kenali-diri/human-design/`) still call that app's API endpoints for calculation. This is tracked in `docs/website-app-isolation-backlog.md` (status: PARTIAL) and must not be contradicted by this Grand Design. Redesign work must not add *new* dependencies of this kind; reducing existing ones is a separate, already-tracked backlog — not part of this documentation phase.

## 7. Information Architecture (Target)

```
/
├── kenali-diri/
│   ├── human-design/
│   ├── life-path/
│   ├── numerologi/
│   ├── destiny-matrix/
│   ├── natal-chart/
│   ├── weton/
│   ├── bazi/
│   ├── vedic-astrology/
│   ├── tzolkin/
│   └── personal-blueprint/
│
├── komunitas/
├── ngopi-ilmu/
├── methodology/
├── about/
├── disclaimer/
├── privacy-policy/
├── terms/
└── contact/
```

### Current vs Target mapping (evidence from repository, 2026-09-25 audit)

| Target path | Current state |
| --- | --- |
| `/kenali-diri/human-design/` | **EXISTS** (`kenali-diri/human-design/index.html`) — needs copy/claim alignment review |
| `/kenali-diri/life-path/` | Does not exist as a dedicated page. Life Path is currently only a field inside `/tes-kenali-diri/` |
| `/kenali-diri/numerologi/` | Does not exist as a dedicated page. Numerologi is currently a homepage "11 Sistem Bhumi" card only |
| `/kenali-diri/destiny-matrix/` | Does not exist as a dedicated page. Destiny Matrix engine exists (`lib/destiny-matrix/`) but has no public landing page |
| `/kenali-diri/natal-chart/` | Does not exist as a dedicated page. Natal Chart engine exists (`lib/natal-chart/`) but has no public landing page |
| `/kenali-diri/weton/` | Route currently at `/weton/` (not nested under `/kenali-diri/`) — **migration consideration**, see §8 |
| `/kenali-diri/bazi/` | Does not exist as a dedicated page |
| `/kenali-diri/vedic-astrology/` | Does not exist as a dedicated page. Vedic engine exists (`lib/vedic/`) but has no public landing page |
| `/kenali-diri/tzolkin/` | Does not exist as a dedicated page |
| `/kenali-diri/personal-blueprint/` | Does not exist as the public umbrella page. `/blueprint/` exists but is an **internal calculator wrapper** ("Alat internal wrapper kalkulasi Blueprint resmi menggunakan Engine Bhumi"), not a public Personal Blueprint landing page |
| `/komunitas/` | **Does not exist.** No Komunitas/Sobat Mistis/Ngopi Rasa/Rabu Bertumbuh content found anywhere in the repository |
| `/ngopi-ilmu/` | **EXISTS** (`ngopi-ilmu/index.html`) — currently standalone, not yet framed as part of a Komunitas pillar |
| `/methodology/` | **EXISTS** (`methodology/index.html`) |
| `/about/` | **EXISTS** (`about/index.html`) |
| `/disclaimer/` | **EXISTS** (`disclaimer/index.html`) |
| `/privacy-policy/` | **EXISTS** (`privacy-policy/index.html`) |
| `/terms/` | **EXISTS** (`terms/index.html`) |
| `/contact/` | **EXISTS** (`contact/index.html`) |

Routes that exist today but are **not** in the target IA list above, and need an explicit migration decision (not a silent rename):

| Existing route | Note |
| --- | --- |
| `/kenali-diri/mbti/` | MBTI is not part of the four-pillar system list in `SOT.md` §3. Decide: keep as a bonus tool under Kenali Diri, move under a different pillar, or leave as-is pending a future decision. **Not decided in this phase.** |
| `/tes-kenali-diri/` | Active self-test entry point (per `FEATURE_PARITY_MATRIX.md`) producing an inline Personal Blueprint-style result. Relationship to future `/kenali-diri/personal-blueprint/` needs a product decision: merge, redirect, or keep as a separate quick-test funnel step. |
| `/kalkulator-cinta/` | Compatibility calculator; still calls the app's API (isolation backlog). Keep as-is; not part of target IA renaming. |
| `/cek-aura/` | Still calls the app's API (isolation backlog). Keep as-is; not part of target IA renaming. |
| `/produk/blueprint-reading/` | Legacy; already permanently redirected to `/tes-kenali-diri/` in `vercel.json`. No action needed. |
| `/blueprint/` | Internal Blueprint Calculator wrapper (staff/testing tool per its own copy), distinct from the public Personal Blueprint concept. Needs a naming/scope decision so it isn't confused with `/kenali-diri/personal-blueprint/` once that's built. |
| `/ebook/`, `/ebooks/`, `/articles/` | Content surfaces, outside the Kenali Diri IA, unaffected by this reorganization. |

## 8. Migration Considerations

1. **Do not rename or move any existing production route in this phase.** The mapping above is planning input for a future implementation phase.
2. `/weton/` → `/kenali-diri/weton/` is a rename, which requires a permanent redirect (`vercel.json` `redirects`) to preserve SEO equity and any existing backlinks/ads. Plan the redirect before moving, don't move first.
3. New pillar pages (`/kenali-diri/life-path/`, `/numerologi/`, `/destiny-matrix/`, `/natal-chart/`, `/bazi/`, `/vedic-astrology/`, `/tzolkin/`, `/personal-blueprint/`) can be added without breaking anything, since none of those paths are currently in use for other content.
4. `/komunitas/` is a net-new route; no redirect/conflict risk.
5. Any new landing page must reuse the existing calculation engines/APIs where they already exist (Human Design, Destiny Matrix, Natal Chart, Vedic — see `docs/blueprint-engines-*.md` and `lib/`) rather than introducing parallel calculation logic, per the "no engine change" and "no new app dependency" guardrails in `SOT.md` §12.
6. MBTI and `/blueprint/` naming decisions are open questions — see `TODO.md` and `PRD.md` §Open Questions.

## 9. ChatGPT Ads Funnel (summary — detail in `CHATGPT_ADS_READINESS.md`)

```
ChatGPT conversation → relevant ad → free calculator → short result → Personal Blueprint → App / Community
```

Each priority system (Human Design, Life Path, Destiny Matrix, Natal Chart, Personal Blueprint/Self Discovery) needs its own landing page per the IA above — ads must not point at the homepage.
