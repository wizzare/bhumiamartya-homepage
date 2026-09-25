# SEO / AEO / GEO Requirements

**Status:** ACTIVE — target requirements. Current baseline assessed as **PARTIAL** (see §4).
**Must stay consistent with:** `SOT.md` §12, `PRD.md` §5.4/5.7.
**Last updated:** 2026-09-25

## 1. Scope

SEO (search engine optimization), AEO (answer engine optimization — AI assistants citing/answering from the page), and GEO (generative engine optimization) requirements for priority landing pages and, where applicable, the homepage.

## 2. Per Priority Landing Page Requirements

Every priority landing page (`CHATGPT_ADS_READINESS.md` §2 list, plus any future Kenali Diri page) must have:

- Unique `<h1>`
- Unique `<title>`
- Meta description
- Canonical URL
- Clear, epistemically-correct definition of the system (`SOT.md` §9)
- Calculator/tool, where technically available, reusing existing engines
- FAQ section
- Internal linking to related systems
- Related content (`/articles/`)
- Personal Blueprint CTA
- Community CTA
- Disclaimer
- Structured data (see §3)

## 3. Structured Data Priority

1. Organization
2. WebSite
3. WebApplication
4. BreadcrumbList
5. Article
6. Person
7. FAQPage (only if it meets search-engine policy at implementation time — do not force it if the page's Q&A doesn't qualify)

## 4. Current Baseline (audited 2026-09-25)

Homepage (`index.html`) already includes JSON-LD for: `Organization`, `WebSite`, `Person`, `PostalAddress`, `WebPage`. It does **not** currently include `WebApplication`, `BreadcrumbList`, `Article`, or `FAQPage` schema. Priority landing pages (`/kenali-diri/human-design/`, etc.) were not individually audited for structured data in this pass — that audit is a prerequisite before implementation.

`robots.txt` (current, verified against repository):
```
User-agent: *
Allow: /

Sitemap: https://www.bhumiamartya.my.id/sitemap.xml
```
This matches the documented baseline exactly. Sitemap generation exists via `api/sitemap.mjs` (rewritten from `/sitemap.xml`, per `vercel.json`).

**Overall SEO/AEO baseline: PARTIAL** — basic organization/site schema and sitemap exist; per-page richer schema, FAQ schema, and dedicated priority landing pages for Life Path/Destiny Matrix/Natal Chart/Personal Blueprint do not exist yet.

## 5. AI Crawlers

`robots.txt`'s current `User-agent: *` / `Allow: /` rule does not explicitly name `OAI-AdsBot` or `OAI-SearchBot`, but a wildcard allow should already permit both. **This has not been verified against production** (this task did not fetch production `robots.txt` responses or test actual crawler behavior — the local repository file was read, not the live endpoint).

**Requirement (not yet executed):** before relying on AI-search/ChatGPT-Ads acquisition, verify in production that:
1. `https://www.bhumiamartya.my.id/robots.txt` serves the same wildcard-allow rule.
2. Neither `OAI-AdsBot` nor `OAI-SearchBot` is blocked by any edge/CDN-level rule outside of `robots.txt` (e.g., Vercel firewall/WAF rules, which are not visible from this repository).

**Do not change crawler policy speculatively.** If a change is needed after verification, document the change and rationale before applying it.

## 6. GEO (Generative Engine Optimization) Notes

- Content should be structured so an LLM can extract a clean, quotable definition and FAQ answer without needing to parse marketing copy — this is why the FAQ + clear-definition requirements in §2 exist.
- Avoid the deterministic claim language flagged in `CONTENT_GOVERNANCE.md` §10 — AI assistants are more likely to flag or refuse to relay claims that sound like guaranteed predictions or medical claims, which would hurt AEO/GEO visibility as well as compliance.

## 7. Not Done in This Phase

- No production `robots.txt` fetch/verification was performed (no live network check against `bhumiamartya.my.id` was run as part of this documentation task).
- No structured data was added or modified.
- No sitemap change was made.
