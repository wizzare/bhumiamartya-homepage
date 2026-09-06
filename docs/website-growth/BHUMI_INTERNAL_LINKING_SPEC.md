# BHUMI INTERNAL LINKING SPECIFICATION

```
PROJECT: Bhumi Amartya Website Growth Engine
DOCUMENT: Contextual Internal Linking & Link Graph Architecture
STATUS: CANONICAL SPECIFICATION
VERSION: 1.0.0
DATE: 2026-09-07
```

---

## 1. Objectives & Principles

Internal linking serves three essential functions in the Bhumi Amartya growth engine:
1. **Search Crawlability & PageRank Distribution**: Ensures search engine bots and AI crawlers can discover and flow ranking authority between newly published articles, pillar pages, and core platform tools.
2. **User Journey & Funnel Acceleration**: Guides readers from high-level educational content directly into interactive tools (`/tes-kenali-diri/`, `/weton/`, `/cek-aura/`), deepening engagement and intent.
3. **Semantic Entity Association**: Solidifies topical authority by signaling to Google and answer engines how core concepts, methodologies, and tools relate to one another.

---

## 2. The 5 Internal Link Archetypes

Every article rendered by the platform must incorporate a balanced combination of five distinct link types:

```
                      ┌─────────────────────────────────────────┐
                      │             ARTICLE DETAIL              │
                      │       (/articles/<article-slug>/)       │
                      └────────────────────┬────────────────────┘
                                           │
         ┌──────────────────┬──────────────┴─────┬──────────────────┐
         │                  │                    │                  │
         ▼                  ▼                    ▼                  ▼
[ Pillar Guide ]   [ Sibling Spoke ]     [ Bhumi Tool ]     [ Service / CTA ]
(/articles/pillar) (/articles/related)  (/weton/, /aura/)  (/tes-kenali-diri/)
```

### 2.1 Type 1: Spoke to Pillar Link (Upward Authority)
- **Role**: Every supporting article must contain at least one prominent contextual link pointing upward to its parent pillar guide.
- **Example**: In `tipe-generator-human-design`:
  > *"Untuk memahami fondasi mekanika tubuh dan sejarah sistem ini, baca panduan komprehensif kami mengenai [apa itu Human Design](/articles/apa-itu-human-design/)."*

### 2.2 Type 2: Pillar to Spoke Link (Downward Authority)
- **Role**: The pillar page must systematically link down to its specialized cluster articles, serving as a comprehensive index of the topic.
- **Example**: In `apa-itu-human-design`:
  > *"Human Design membagi manusia ke dalam lima tipe energi utama: [Generator](/articles/tipe-generator-human-design/), [Manifesting Generator](/articles/tipe-manifesting-generator-human-design/), [Projector](/articles/tipe-projector-human-design/), [Manifestor](/articles/tipe-manifestor-human-design/), dan [Reflector](/articles/tipe-reflector-human-design/)."*

### 2.3 Type 3: Sibling Cross-Cluster Link (Horizontal Lateral)
- **Role**: Articles linking to complementary articles within the same or closely related cluster to extend reading session duration.
- **Example**: Linking from `weton-jodoh-dan-kecocokan` to `seni-membangun-relasi-sadar-dan-kompatibilitas`.

### 2.4 Type 4: Contextual Interactive Tool Link (Utility Transition)
- **Role**: Embedded naturally within the explanation of a system so the user can calculate their personal chart immediately.
- **Rules**:
  - Human Design articles ➔ Link to `/kenali-diri/human-design/`
  - Weton & Primbon articles ➔ Link to `/weton/`
  - Relationship & Love articles ➔ Link to `/kalkulator-cinta/`
  - Aura, Chakra & Energy articles ➔ Link to `/cek-aura/`
  - MBTI & Personality articles ➔ Link to `/kenali-diri/mbti/`

### 2.5 Type 5: Integrated Funnel Anchor (Commercial / Consultation)
- **Role**: Soft in-content callouts and high-intent footer cards pointing to the comprehensive self-discovery service:
  - Universal Link Target: `/tes-kenali-diri/` (Tes Kenali Diri / Blueprint Reading)
  - Ebook Link Target: `/ebooks/`

---

## 3. Algorithmic Safeguards & Constraints

To protect against spam penalties, algorithmic link devaluation, and poor user experience, the internal linking engine enforces strict algorithmic constraints:

### 3.1 Quantitative Guardrails
- **Max Contextual In-Text Links**: Strict limit of **2 to 4 in-text links per 1,000 words**. Over-linked paragraphs dilute link equity and frustrate readers.
- **Max Interactive Tool CTAs**: Exactly **1 soft contextual inline card** and **1 end-of-article summary card**.
- **Max Links to the Same URL**: Never link to the same destination URL more than twice on a single page.

### 3.2 Anchor Text Diversity Rules
Exact-match anchor text stuffing is strictly prohibited. Anchors must vary naturally:
- **Forbidden**: Repeating `human design indonesia` 5 times across 5 articles.
- **Mandatory Anchor Rotation Pattern**:
  - *Branded / Topical*: "kalkulator Human Design Bhumi Amartya"
  - *Concept-based*: "sistem Human Design"
  - *Action-oriented*: "menghitung tipe energi Anda"
  - *Contextual sentence flow*: "...sebagaimana diuraikan dalam panduan dasar Human Design kami."

### 3.3 Strict URL Syntax Standards
- Always use relative paths with enforced trailing slashes: `/articles/<slug>/` or `/weton/`.
- Never use full absolute URLs in internal markdown (avoids broken links across staging and production).
- Never link to redirects (e.g., do not link to `/reading/` or `/ebook/`; link directly to `/tes-kenali-diri/` and `/ebooks/`).

---

## 4. In-Article CTA Component Specifications

For visual elegance and brand consistency, links to tools and products are rendered via standardized HTML components:

### 4.1 Inline Tool Card (Mid-Article)
```html
<div class="bhumi-inline-tool-card">
  <div class="card-badge">Eksplorasi Pribadi</div>
  <h4>Cek Tipe Energi Human Design Anda</h4>
  <p>Ketahui tipe energi, strategi hidup, dan otoritas batin Anda secara akurat menggunakan kalkulator gratis Bhumi.</p>
  <a href="/kenali-diri/human-design/" class="btn-tool">Buka Kalkulator Human Design →</a>
</div>
```

### 4.2 End-of-Article Reflection & Reading Card
```html
<div class="bhumi-article-footer-cta">
  <div class="cta-inner">
    <h3>Ingin Membaca Cetak Biru Diri Anda Secara Menyeluruh?</h3>
    <p>Bhumi Amartya mengintegrasikan Human Design, Weton Jawa, Astrologi Natal, dan Destiny Matrix dalam satu laporan pembacaan mendalam untuk memandu perjalanan pulang ke diri sejati.</p>
    <div class="cta-actions">
      <a href="/tes-kenali-diri/" class="btn-primary">Mulai Tes Kenali Diri</a>
      <a href="/about/" class="btn-secondary">Pelajari Metodologi Kami</a>
    </div>
  </div>
</div>
```
