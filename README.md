# Bhumi Amartya — Website

**Production:** https://bhumiamartya.my.id

Bhumi Amartya is a self-discovery, personal-growth, and community ecosystem — Human Design, Life Path, Destiny Matrix, Natal Chart, Weton, BaZi, Vedic Astrology, Tzolkin, and more, unified under one Personal Blueprint, alongside a community (Komunitas Bhumi Amartya / Sobat Mistis) and a companion app. This repository is the marketing/content website, not the app or the calculation-engine source of truth by itself (see `lib/` for engines that live in this repo).

## Start Here

| Doc | What it's for |
| --- | --- |
| [`docs/SOT.md`](docs/SOT.md) | Highest-authority product decisions: positioning, four pillars, journey, guardrails |
| [`docs/GRAND_DESIGN.md`](docs/GRAND_DESIGN.md) | Ecosystem, flywheel, target information architecture |
| [`docs/PRD.md`](docs/PRD.md) | Implementable requirements + acceptance criteria |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Homepage structure, CTA hierarchy, component/visual direction |
| [`docs/TODO.md`](docs/TODO.md) | Prioritized backlog (P0–P3) |
| [`docs/COMMUNITY.md`](docs/COMMUNITY.md) | Komunitas Bhumi Amartya / Sobat Mistis requirements |
| [`docs/CONTENT_GOVERNANCE.md`](docs/CONTENT_GOVERNANCE.md) | Editorial/claim rules, incl. flagged copy issues |
| [`docs/CHATGPT_ADS_READINESS.md`](docs/CHATGPT_ADS_READINESS.md) | Ads landing-page readiness by priority system |
| [`docs/SEO_AEO_GEO.md`](docs/SEO_AEO_GEO.md) | Per-page SEO/AEO/GEO and structured-data requirements |
| [`FEATURE_PARITY_MATRIX.md`](FEATURE_PARITY_MATRIX.md) | Route-by-route current-state parity + Grand Design alignment status |

## Technical Docs

| Doc | Scope |
| --- | --- |
| [`docs/blueprint-engines-api-contract.md`](docs/blueprint-engines-api-contract.md) | `POST /api/blueprint-engines` request/response contract |
| [`docs/blueprint-engines-feasibility.md`](docs/blueprint-engines-feasibility.md) | Original HD/Vedic engine feasibility study — see its Status header, partially superseded by actual implementation |
| [`docs/blueprint-engines-test-plan.md`](docs/blueprint-engines-test-plan.md) | Engine regression fixtures |
| [`docs/website-app-isolation-backlog.md`](docs/website-app-isolation-backlog.md) | Tracks remaining runtime dependencies on `bhumi-amartya-clean.vercel.app` |
| [`docs/MORNING_BREW_AUTOPUBLISH.md`](docs/MORNING_BREW_AUTOPUBLISH.md) | Morning Brew article auto-publish pipeline |
| [`docs/ARTICLE_WEB_AUTOPUBLISH.md`](docs/ARTICLE_WEB_AUTOPUBLISH.md) | Artikel Web auto-publish pipeline |

Run engine tests: `npm install && npm run test:engines`.

## Guardrails

- No deterministic/guaranteed-outcome claims (`docs/CONTENT_GOVERNANCE.md`).
- No mental-health diagnosis/therapy/medical-treatment positioning (`docs/SOT.md` §8).
- Redesign work must not add new runtime dependency on the app, and must not change calculation engines, APIs, database, payment, or auth without a separate, explicit task.
- Current state vs. target state are kept deliberately separate across all `docs/` files — do not treat a "target" as shipped without verifying it in this repository.
