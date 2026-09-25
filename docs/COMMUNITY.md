# COMMUNITY — Komunitas Bhumi Amartya

**Status:** ACTIVE — target-state documentation. The described page/section does not exist in production yet (audited 2026-09-25: no `/komunitas/` route, and no "Sobat Mistis" / "Ngopi Rasa" / "Rabu Bertumbuh" content found anywhere in the repository).
**Must stay consistent with:** `SOT.md` §3 (Pilar 3 — Terhubung), `GRAND_DESIGN.md`, `DESIGN.md` §5.

## 1. Purpose

Community is Pilar 3 of the four-pillar product (Terhubung) and functions as the ecosystem's:
- engagement layer
- retention layer
- social proof
- learning space
- growth engine

It is not an accessory, and not merely a WhatsApp link.

## 2. Community Positioning

Public name: **Komunitas Bhumi Amartya**. It sits between the free self-discovery tools (EXPLORE/UNDERSTAND) and the deeper Personal Blueprint/app journey (DEEP DIVE/PRACTICE) in the customer journey, and is the primary destination for the CONNECT stage.

## 3. Sobat Mistis Definition

- Identity of community members: **Sobat Mistis**.
- MISTIS = **M**eeting **S**piritual **T**iap **S**aat (note: acronym letters map loosely to the phrase per the brand definition provided; treat "Sobat Mistis" as the fixed brand term, not a literal acronym expansion to re-derive).
- Sobat Mistis is the umbrella identity under which all community programs run.

## 4. Ngopi Ilmu

- Topic scope: kehidupan, self-discovery, psikologi, spiritualitas, skill hidup, karier, hubungan, finansial.
- **Current state:** `/ngopi-ilmu/` already exists in production (`ngopi-ilmu/index.html`, title "Ngopi Ilmu | Bhumi Amartya") and is already featured as a homepage section (`<h2>Ngopi Ilmu</h2>` in `index.html`). It is not yet framed as part of a branded "Komunitas Bhumi Amartya" / "Sobat Mistis" pillar — that framing/cross-linking is target work, not yet done.

## 5. Ngopi Rasa

- Purpose: refleksi, meditasi, mengenali rasa, kembali hadir kepada diri sendiri.
- **Current state:** does not exist anywhere in the repository. This is entirely new content/page work for a future phase.
- Framing guardrail: Ngopi Rasa touches emotional/reflective territory — copy must follow the health guardrail (`SOT.md` §8): wellbeing/mindfulness framing, never therapy or clinical framing.

## 6. Classes / Events

- **Kelas Sobat Mistis** — recurring/periodic classes for the community.
- **Rabu Bertumbuh** — recurring program (implied weekly, "Rabu" = Wednesday).
- **Event/kegiatan komunitas** — ad hoc community events.
- **Current state:** none of these exist in the repository today. All are net-new.

## 7. Community Page Requirements (`/komunitas/`, target)

The page must cover, at minimum:
1. Purpose and positioning (this file, §1–2).
2. Sobat Mistis identity explanation.
3. Ngopi Ilmu — description, cadence, how to join, link to `/ngopi-ilmu/`.
4. Ngopi Rasa — description, cadence, how to join.
5. Rabu Bertumbuh — description, cadence.
6. Kelas Sobat Mistis — description, how classes are scheduled/announced.
7. Events — list driven by the event data model (§9 below), not hardcoded.
8. Primary CTA: "Gabung Komunitas Bhumi". Secondary: "Lihat Kegiatan Komunitas".
9. Community guidelines (behavior expectations, safety, moderation contact) — content to be authored in a future phase; not fabricated here.
10. Social proof (testimonials/member count/highlights) — only real, sourced content; do not fabricate numbers or quotes when implemented.
11. Structured data and SEO basics consistent with `SEO_AEO_GEO.md` (this page is not in the ChatGPT Ads priority-5 list, but should still meet baseline on-page SEO).

## 8. Homepage Integration

Per `DESIGN.md` §2 and §5:
- A full "Tidak Harus Bertumbuh Sendirian" section must appear on the homepage, positioned directly after the Free Self-Discovery Tools section — not relegated to the footer.
- A "Ada Apa di Bhumi Minggu Ini?" live-activity section must follow it, using the event data model (§9).
- Copy direction: "Bhumi bukan hanya tempat membaca blueprint. Ada ruang untuk ngobrol, belajar, bertanya, berefleksi, dan bertumbuh bersama."

## 9. Event Status Model

Every community/event listing (homepage "Ada Apa di Bhumi Minggu Ini?" and the `/komunitas/` events list) must use a structured record, not hardcoded HTML:

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | e.g., "Rabu Bertumbuh: Mengenal Pola Emosi" |
| `description` | string | short summary |
| `date` | ISO date/time | start date/time of the event |
| `status` | enum: `upcoming` \| `live` \| `past` | derived from `date` vs. current time, not manually hardcoded as "active" |
| `cta` | object (optional) | `{ label, url }` — omitted if no registration/action is available |

**Hard rule (per `SOT.md`/task guardrails):** never hardcode a past event as if it were currently active. Implementation should compute `status` from `date`, or require an explicit, reviewed update each time content changes.

## 10. Join CTA

- Primary: "Gabung Komunitas Bhumi" (homepage + `/komunitas/`).
- Secondary: "Lihat Kegiatan Komunitas".
- Destination (WhatsApp group, Discord, Telegram, or other channel) is not specified in this document — to be confirmed with the product/community owner before implementation. Do not assume a specific external platform.

## 11. Community Guidelines

Not yet authored. This is a placeholder requirement: before `/komunitas/` ships, a short code-of-conduct-style guidelines block (respectful behavior, no medical/diagnostic claims by members, moderation contact) should be written and reviewed against `CONTENT_GOVERNANCE.md`.

## 12. Social Proof

Use only genuine testimonials/metrics when available. The current homepage already has a "Founder dan Pengelola" section and (per `FEATURE_PARITY_MATRIX.md`) a "Testimoni" nav entry exists in at least one page (`blueprint/index.html`) — reuse/verify that existing testimonial source rather than fabricating new social proof content.

## 13. Analytics / Events

Future-phase instrumentation should track, at minimum:
- `community_section_view` (homepage section impression)
- `community_join_click`
- `community_events_view_click`
- `community_event_cta_click` (per event, with event id)
- `komunitas_page_view`

No analytics implementation exists for these yet; this is a requirement list for the next implementation phase, not a claim of current tracking.
