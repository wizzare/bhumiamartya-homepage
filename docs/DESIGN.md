# DESIGN — Bhumi Amartya Website

**Status:** ACTIVE — target design direction. Must stay consistent with `PRD.md` and `SOT.md`.
**Last updated:** 2026-09-25
**Note:** This is a design specification for a future implementation phase. No visual or code change was made in this documentation phase.

## 1. Design Principles

1. **Ecosystem over service.** Every section should reinforce "platform," not "jasa reading."
2. **Trust and curiosity over sales pressure.** No countdowns, no "limited slots," no deterministic promises.
3. **Community is structural, not decorative.** It gets a full homepage section with its own visual weight, not a footer line.
4. **Earthy + modern + human + warm + digital.** Avoid dark/occult/mystical-cliché or overly clinical extremes (`SOT.md` §2).
5. **One intent, one page.** Landing pages are built for a single system/intent, not a generic catch-all.
6. **Epistemically honest visuals.** Iconography/imagery must not imply lab-tested scientific certainty for traditional/esoteric systems, nor overly mystical imagery for evidence-based wellbeing content.

## 2. Homepage Section Order (target)

1. **Hero** — Headline "Kenali Dirimu Lebih Dalam"; supporting copy naming Human Design, Life Path, Destiny Matrix, Natal Chart, and "berbagai perspektif self-discovery"; primary CTA "Mulai Kenali Diri"; secondary CTA "Gabung Komunitas"; microcopy: "Bukan untuk menentukan siapa kamu. Tetapi membantu kamu melihat pola yang mungkin selama ini belum kamu sadari."
2. **Personal Blueprint** — Headline "Satu Diri. Berbagai Perspektif."; system chips (Human Design, Life Path, Destiny Matrix, Natal Chart, Weton, BaZi, Vedic Astrology, Tzolkin); CTA "Lihat Personal Blueprint".
3. **Free Self-Discovery Tools** — Human Design ("Hitung Human Design"), Life Path ("Hitung Life Path"), Destiny Matrix ("Lihat Destiny Matrix"), Natal Chart ("Buat Natal Chart"). This section is the acquisition funnel into Personal Blueprint.
4. **Community — "Tidak Harus Bertumbuh Sendirian"** — introduces Sobat Mistis, Ngopi Ilmu, Ngopi Rasa; CTA "Gabung Komunitas Bhumi", secondary "Lihat Kegiatan Komunitas". Must appear here — directly after the free tools — not after all other content and not only in the footer.
5. **Community Live — "Ada Apa di Bhumi Minggu Ini?"** — Rabu Bertumbuh, Ngopi Rasa, Kelas Sobat Mistis, latest community activity, driven by the event data model in `PRD.md` FR-9.
6. Remaining existing sections (About/"Apa itu Bhumi Amartya?", methodology/"Cara Menggunakan Hasil dengan Bijak", founder, video/content) may follow after the above, reordered as needed in implementation — their relative order among themselves is not prescribed by this design, but they must not precede the Community section.

> Current homepage (`index.html`) order for reference (audited 2026-09-25): Hero → Apa itu Bhumi Amartya? → 11 Sistem Bhumi → Produk Bhumi → Video Terbaru Bhumi → Ngopi Ilmu → Cara Menggunakan Hasil dengan Bijak → Founder dan Pengelola → closing CTA. Community (Ngopi Ilmu) currently sits after four other sections and is not branded as "Komunitas Bhumi Amartya" / "Sobat Mistis" — this is the gap the target order above closes.

## 3. Navigation

- Primary nav should reflect the four pillars conceptually: Kenali Diri (with the nine systems + Personal Blueprint as a dropdown/menu), Bertumbuh (content/practice), Komunitas, Menjalani (app/practice), About/Contact.
- Existing nav (audited from `blueprint/index.html`) currently lists: Beranda, Kenali Diri (Tes Kenali Diri, Cek Aura, Cek Weton, Kalkulator Cinta, Human Design), Produk (Aplikasi Bhumi, Blueprint Reading, Reiki dan Sound Healing, Ebook), Konten (Youtube, Ngopi Ilmu), Testimoni, Tentang (Tentang Bhumi, Our Team, Founder), Kontak. This should evolve toward the target IA (`GRAND_DESIGN.md` §7) in a future phase — not renamed now.
- Komunitas must be a **top-level** nav item once `/komunitas/` exists, not nested under Konten.

## 4. CTA Hierarchy

1. **Primary (highest weight):** "Mulai Kenali Diri" (hero), "Lihat Personal Blueprint" (Blueprint section).
2. **Secondary:** "Gabung Komunitas" / "Gabung Komunitas Bhumi".
3. **Tertiary:** per-tool CTAs ("Hitung Human Design", "Hitung Life Path", "Lihat Destiny Matrix", "Buat Natal Chart"), "Lihat Kegiatan Komunitas".
4. **Utility:** in-page links (FAQ anchors, related articles, disclaimer link).

No CTA copy may use deterministic/guarantee language (`CONTENT_GOVERNANCE.md`).

## 5. Community Placement

- Homepage: full section (see §2 item 4–5), not a footer link.
- Global footer: keep a Komunitas link, but it is additive, not the only placement.
- Every priority landing page (`PRD.md` §5.4): must include a Community CTA.
- `/komunitas/`: full page per `COMMUNITY.md`.

## 6. Component Behavior

- **System card (Personal Blueprint / 11-systems-style grid):** name, one-sentence non-deterministic description, icon, links to that system's landing page once it exists (currently several target pages don't exist yet — component must degrade gracefully, e.g., link to the relevant homepage anchor or `/tes-kenali-diri/` until the dedicated page ships).
- **Free tool CTA button:** label + link to the tool; must not imply the result is scientifically certain.
- **Community event card:** title, date, status badge (`upcoming`/`live`/`past`), description, optional CTA. Must be data-driven (see `PRD.md` FR-9), never hardcoded as evergreen.
- **FAQ accordion:** used on priority landing pages; each Q/A should reflect the epistemic category of that system.
- **Disclaimer strip/footnote:** present on every priority landing page and every calculator result view.

## 7. Responsive Considerations

- Section grids (system cards, free-tool cards, community program cards) must collapse to a single column on mobile; current homepage uses CSS grid with fixed 4-column layouts (`system-grid`, `product-grid`) that will need responsive breakpoints when these sections are extended with Community content — not evaluated for correctness in this documentation phase, flagged for implementation review.
- CTAs must remain thumb-reachable (bottom-anchored or full-width on mobile) given ChatGPT Ads traffic is expected to be heavily mobile.

## 8. Accessibility

- Maintain color-contrast for the earthy palette (forest green / gold accents observed in current CSS) against text, especially in card hover states.
- All CTA buttons need discernible accessible names (not icon-only).
- Event status badges (`upcoming`/`live`/`past`) must not rely on color alone — include text.
- Structured data and semantic heading order (`h1` → `h2` → `h3`) must be correct per page — required for both accessibility and AEO (`SEO_AEO_GEO.md`).

## 9. Visual Direction

Earthy + modern + human + warm + digital, consistent with the forest-green/gold accent system already present in `index.html`'s CSS custom properties. Community section should feel warm/social (people, conversation cues) rather than mystical, to reinforce "Terhubung" as a human pillar rather than an occult one. Avoid introducing new dark/occult visual motifs; avoid making the site feel clinical when presenting wellbeing/evidence-based content.
