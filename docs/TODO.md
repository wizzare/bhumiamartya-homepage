# TODO — Grand Design Backlog

**Status:** ACTIVE — prioritized backlog. Nothing in this list is done unless explicitly marked; absence of a checkmark means not started.
**Must stay consistent with:** `SOT.md`, `GRAND_DESIGN.md`, `PRD.md`.
**Last updated:** 2026-09-25

Priorities: **P0** governance/compliance/methodology/crawler/trust · **P1** homepage/community/priority landing pages/conversion · **P2** SEO/AEO/GEO/structured data/content cluster/community system · **P3** ChatGPT Ads campaign readiness.

## P0 — Governance, Compliance, Methodology, Crawler, Trust

- [ ] Revise homepage "11 Sistem Bhumi" copy for Vedic Astrology ("...prediksi periode hidup secara presisi") per `CONTENT_GOVERNANCE.md` §10 — this is the exact deterministic phrase the guardrail prohibits.
- [ ] Revise homepage Natal Chart copy ("...takdir bawaan") per `CONTENT_GOVERNANCE.md` §10.
- [ ] Review homepage Numerologi ("pola takdir") and Destiny Matrix ("tugas karma") copy per `CONTENT_GOVERNANCE.md` §10.
- [ ] Update `/methodology/` to explicitly state the four-category epistemic split (`SOT.md` §9).
- [ ] Verify `/disclaimer/` content matches `CONTENT_GOVERNANCE.md` (not audited word-for-word in this pass).
- [ ] Verify production `robots.txt` is actually served as documented and confirm `OAI-AdsBot`/`OAI-SearchBot` are not blocked at any layer outside `robots.txt` (`SEO_AEO_GEO.md` §5). No speculative crawler-policy change.
- [ ] Investigate the one failing regression test found during this audit: `tests/engines-fixture-a.test.mjs` (Human Design strategy field returns "Wait to Respond", fixture expects "To Respond" — see `FEATURE_PARITY_MATRIX.md` → Grand Design Alignment). This is an engine correctness question, not a documentation task — route to whoever owns `lib/human-design/`. **Do not fix as part of a documentation-only task.**
- [ ] Decide ownership/timeline for the copy-revision items above (open question in `PRD.md` §7.5).

## P1 — Homepage, Community, Priority Landing Pages, Conversion

- [ ] Implement target homepage section order (`DESIGN.md` §2), inserting the Community section directly after Free Self-Discovery Tools.
- [ ] Build `/komunitas/` page per `COMMUNITY.md` §7.
- [ ] Build Ngopi Rasa content/section (net-new, does not exist today).
- [ ] Build Rabu Bertumbuh and Kelas Sobat Mistis content (net-new).
- [ ] Implement the structured event data model (`COMMUNITY.md` §9 / `PRD.md` FR-9) for "Ada Apa di Bhumi Minggu Ini?" — must never show a past event as active.
- [ ] Build `/kenali-diri/life-path/` landing page (engine already available inline in `/tes-kenali-diri/`; needs its own page + full checklist per `PRD.md` §5.4).
- [ ] Build `/kenali-diri/destiny-matrix/` landing page (engine exists: `lib/destiny-matrix/calculate.mjs`; no public page yet).
- [ ] Build `/kenali-diri/natal-chart/` landing page (engine exists: `lib/natal-chart/calculate.mjs`; no public page yet).
- [ ] Build `/kenali-diri/personal-blueprint/` as the public umbrella page (distinct from the internal `/blueprint/` calculator wrapper — resolve naming/scope first, see `PRD.md` §7.3).
- [ ] Align `/kenali-diri/human-design/` (existing) with the full landing-page checklist (`PRD.md` §5.4) before treating it as ads-ready.
- [ ] Resolve open question: relationship between `/tes-kenali-diri/` and the future Personal Blueprint page (`PRD.md` §7.1).
- [ ] Resolve open question: MBTI (`/kenali-diri/mbti/`) placement in the target IA (`PRD.md` §7.2).

## P2 — SEO/AEO/GEO, Structured Data, Content Cluster, Community System

- [ ] Add `WebApplication`, `BreadcrumbList`, `Article`, and (where appropriate) `FAQPage` structured data to priority landing pages (`SEO_AEO_GEO.md` §3–4).
- [ ] Audit each existing page's current structured data individually (only the homepage was audited in this pass).
- [ ] Build internal linking between Kenali Diri pages, `/articles/`, and Personal Blueprint once those pages exist.
- [ ] Extend `/methodology/` and per-system pages with FAQ content suited to AEO/GEO extraction (`SEO_AEO_GEO.md` §6).
- [ ] Design the `/komunitas/` join-destination integration (WhatsApp/Discord/Telegram/other — not yet decided, see `COMMUNITY.md` §10).
- [ ] Add a claim-governance screening step to the Morning Brew / Artikel Web auto-publish pipelines (`CONTENT_GOVERNANCE.md` §9) — currently no automated check exists.
- [ ] Continue the website/app isolation backlog (`docs/website-app-isolation-backlog.md`) — status still PARTIAL as of this audit (`/cek-aura/`, `/kalkulator-cinta/`, `/kenali-diri/human-design/`, and `vercel.json`'s `/_next/`, `/images/`, `/founder/` rewrites still depend on `bhumi-amartya-clean.vercel.app`). This is tracked separately from Grand Design redesign work — do not conflate the two.

## P3 — ChatGPT Ads Campaign Readiness

- [ ] Do not launch any ChatGPT Ads campaign until at least Human Design, Life Path, Destiny Matrix, and Natal Chart have compliant landing pages per `CHATGPT_ADS_READINESS.md` §4–5.
- [ ] Define analytics events for the DISCOVER→GROW journey (`PRD.md` FR-14) — current homepage analytics implementation (references an `analytics.js` script) was not characterized in this audit; confirm what it actually does before instrumenting new events.
- [ ] Set up per-system ad campaigns only after §5 checklist compliance, in priority order (`CHATGPT_ADS_READINESS.md` §2).

## Notes

- Every item above is a target, not a completed task. Marking any item as done requires verifying it against the repository, not against this document's intent.
- This backlog does not replace `docs/website-app-isolation-backlog.md`, `docs/blueprint-engines-*.md`, or the autopublish docs — see those for their own tracked items.
