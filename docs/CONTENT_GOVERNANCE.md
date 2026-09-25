# CONTENT GOVERNANCE — Editorial Rules

**Status:** ACTIVE — editorial policy. Must stay consistent with `SOT.md` §9–10.
**Last updated:** 2026-09-25
**Applies to:** all website copy, articles (Morning Brew / Artikel Web pipelines), landing pages, and AI-assisted content.

## 1. Evidence-Based Content

Topics: psychology, wellbeing, neuroscience, behavioral science.
- May state facts as facts, with appropriate reference/framing.
- Must not be conflated with esoteric/traditional systems as if equally "proven."

## 2. Spiritual / Traditional Content

Topics: Weton, BaZi, Vedic Astrology/Jyotish, Tzolkin.
- Present as tradition/practice, with cultural/historical framing.
- Never claim scientific proof for these systems.
- Acceptable framing example: "digunakan untuk mengeksplorasi tema kehidupan dan siklus waktu berdasarkan tradisi Jyotish."

## 3. Contemporary Self-Discovery Content

Topics: Human Design (and similar contemporary frameworks).
- Present as a contemporary system/framework, distinct from both "ancient tradition" and "scientific proof" framing.

## 4. Esoteric / Reflective Content

Topics: Numerology, Destiny Matrix, astrology generally, spiritual reflection.
- Present as reflective/exploratory tools for self-understanding, not as fact-generating instruments.

## 5. Health Content

- Never position Bhumi as: psychological clinic, mental-health diagnosis, therapy, medical treatment, or a replacement for professional mental-health services.
- Prefer: wellbeing, emotional awareness, mindfulness, self-reflection, inner work, personal growth.
- Prohibited advertising claims: "menyembuhkan trauma", "menyembuhkan depresi", "menyembuhkan anxiety", diagnosing a mental condition.
- Educational mental-health content is allowed if correctly framed (informational, not diagnostic/therapeutic).

## 6. Claim Wording

**Prefer:** kenali, eksplorasi, pahami, perspektif, refleksi, pola, kecenderungan, potensi, perjalanan, bertumbuh.

**Avoid:** takdir pasti, prediksi presisi, masa depan pasti, dijamin, jodoh pasti, rezeki pasti, diagnosis, penyembuhan, scientific proof without evidence.

### Worked examples

| Don't | Do |
| --- | --- |
| "Vedic Astrology memprediksi periode hidup secara presisi." | "Vedic Astrology digunakan untuk mengeksplorasi tema kehidupan dan siklus waktu berdasarkan tradisi Jyotish." |
| "Natal Chart memetakan takdir bawaan." | "Natal Chart digunakan untuk mengeksplorasi pola kepribadian dan berbagai tema kehidupan berdasarkan posisi benda langit saat kelahiran." |

## 7. Disclaimer Requirement

Every priority landing page and every calculator result view must carry a disclaimer appropriate to its epistemic category (§1–4), and must link to `/disclaimer/` (existing page — content not audited word-for-word in this pass; verify it matches this policy before next content edit).

## 8. Distinction Between Calculation and Interpretation

Copy must keep two things visibly separate:
1. **Calculation** — a deterministic, reproducible computation (e.g., "tanggal lahir Anda menghasilkan Life Path 7", or the Human Design engine's Type/Profile/Authority/Strategy output). This is fine to state as a direct result of the calculation itself.
2. **Interpretation** — what that calculated result *might mean* for the person. This must use the preferred non-deterministic vocabulary (§6) and must not be presented as a certain, universal truth about the person's life or future.

Example: it is fine to say "Berdasarkan tanggal lahir Anda, tipe Human Design Anda adalah Generator" (calculation). It is not fine to continue with "...yang berarti Anda pasti akan sukses dalam karier ini" (deterministic interpretation).

## 9. AI-Generated Content Review Principles

Applies to the existing Morning Brew and Artikel Web auto-publish pipelines (`docs/MORNING_BREW_AUTOPUBLISH.md`, `docs/ARTICLE_WEB_AUTOPUBLISH.md`), which already push AI/human-authored article content to Firestore and onto `/articles/`:
1. Every auto-published article should be screenable against §1–6 of this document before or shortly after publish (current pipelines do not include an automated claim-governance check — this is a gap to track, not something fixed in this documentation phase).
2. Health and epistemic claims in generated articles must follow §1–5 exactly as they would for hand-written landing-page copy.
3. Any AI-generated claim of certainty, diagnosis, or guaranteed outcome should be treated as a publishing defect, not a stylistic choice.
4. This document does not mandate a specific technical review mechanism (e.g., pre-publish linting) — that is an implementation decision for a future phase; see `TODO.md`.

## 10. Audit Findings (as of 2026-09-25) — existing production copy needing future revision

These were found in `index.html`'s live "11 Sistem Bhumi" section during this documentation audit. **No copy was changed** — this phase is documentation-only. These are flagged for a future content-editing phase:

| System card | Current copy (excerpt) | Issue | Suggested direction |
| --- | --- | --- | --- |
| Vedic Astrology | "...memetakan evolusi karma jiwa dan **prediksi periode hidup secara presisi**." | Directly matches the prohibited deterministic phrasing in `SOT.md` §10 (this is the exact example phrase called out as "JANGAN") | Reframe per the Vedic Astrology worked example in §6 above |
| Natal Chart | "...memetakan potensi psikologis dasar dan **takdir bawaan**." | "Takdir bawaan" is deterministic wording | Reframe per the Natal Chart worked example in §6 above |
| Numerologi | "...untuk memahami **pola takdir** serta fase siklus hidup." | "Pola takdir" leans deterministic even though softened by "pola" | Consider "pola hidup" or "kecenderungan hidup" instead of "pola takdir" |
| Destiny Matrix | "...untuk mengungkap **tugas jiwa**, potensi finansial, dan **tugas karma**." | Esoteric-but-acceptable under §4 as long as framed as reflective, not fact; flagged for review, not a hard violation | Keep exploratory framing; avoid strengthening "tugas" language further |

Track these as `TODO.md` P0 items. This document is the reference for whoever performs that future copy revision.
