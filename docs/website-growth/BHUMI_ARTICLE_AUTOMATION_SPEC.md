# BHUMI ARTICLE AUTOMATION SPECIFICATION

```
PROJECT: Bhumi Amartya Website Growth Engine
DOCUMENT: Article Automation & Lifecycle Specification
STATUS: CANONICAL SPECIFICATION
VERSION: 1.0.0
DATE: 2026-09-07
```

---

## 1. Objective & Scope

This specification defines the complete automated and assisted article publishing architecture for Bhumi Amartya. The objective is to scale authoritative, reflective, and search-optimized content while strictly maintaining editorial integrity, philosophical consistency, factual accuracy, and technical compatibility with the existing website platform.

**Core Mandates:**
- **No Blind Publishing**: Generative AI models must act as research and drafting copilots, not autonomous publishers.
- **Strict Reader Compatibility**: Firestore writes must seamlessly satisfy all query requirements of `lib/content/firestore-reader.mjs`.
- **No Web Scraping Yet**: Topic discovery relies on verified search queries, internal knowledge bases, and curated editorial backlogs.

---

## 2. Topic Discovery Architecture

Topic discovery identifies high-potential content opportunities where user search intent aligns with Bhumi Amartya's integrative self-discovery ecosystem.

### 2.1 Discovery Channels (Non-Scraping)

1. **Google Search Console (GSC) Query Mining**:
   - Extraction of existing ranking queries with high impressions but sub-optimal click-through rates (positions 8–25).
   - Identification of long-tail question queries (`apa itu...`, `bagaimana cara menghitung...`, `arti garis...`).
2. **Google Trends & Seasonal Cosmic Calendars**:
   - Seasonal transits (e.g., Mercury retrograde, equinoxes, weton cycles, Saka new year).
   - Trending interest in holistic frameworks (e.g., Human Design types, BaZi element balance).
3. **Bhumi Blueprint System Knowledge Bases**:
   - Systematized coverage of archetypes, centers, gates, life path numbers, and trigrams.
   - Comprehensive matrix covering every combination of fundamental elements (e.g., 5 Human Design Types × 12 Profiles).
4. **User & Community Inquiries**:
   - Actual questions submitted via WhatsApp consultations, reading follow-ups, and app feedback.
5. **Content Gap & Keyword Backlog**:
   - Systematic auditing of competitor or global knowledge gaps translated to local Indonesian cultural context.

---

## 3. Initial Core Topic Clusters

Content generation is organized into 16 foundational clusters. Articles must never be generated in isolation; every article belongs to an established cluster tied to an anchor tool or pillar page.

| Cluster ID | Core Topic System | Pillar Anchor / Focus | Associated Interactive Tool / Page |
| :--- | :--- | :--- | :--- |
| **TC-01** | **Human Design** | Pengantar & Mekanika Tubuh Human Design | `/kenali-diri/human-design/` |
| **TC-02** | **Weton & Primbon Jawa** | Filosofi & Perhitungan Weton Nusantara | `/weton/` |
| **TC-03** | **MBTI & Teori Kepribadian** | 16 Tipe Kepribadian & Fungsi Kognitif | `/kenali-diri/mbti/` |
| **TC-04** | **Astrologi Natal (Western)** | Peta Bintang Kelahiran & Simbolisme Zodiak | `/tes-kenali-diri/` |
| **TC-05** | **Destiny Matrix** | Arcanas 22 Kunci & Jalur Kehidupan Jiwa | `/tes-kenali-diri/` |
| **TC-06** | **BaZi (Four Pillars)** | Empat Pilar Nasib & Keseimbangan 5 Elemen | `/tes-kenali-diri/` |
| **TC-07** | **Vedic Astrology (Jyotish)** | Nakshatra, Karma, & Siklus Dasha | `/tes-kenali-diri/` |
| **TC-08** | **Numerologi** | Life Path Numbers & Getaran Karakter | `/tes-kenali-diri/` |
| **TC-09** | **Maya Tzolkin** | Kalender Sakral Maya & Energi Kin | `/tes-kenali-diri/` |
| **TC-10** | **Zi Wei Dou Shu** | Astrologi Bintang Ungu & Istana Kehidupan | `/tes-kenali-diri/` |
| **TC-11** | **Astrokartografi** | Penyelarasan Energi Lokasi & Geografis | `/tes-kenali-diri/` |
| **TC-12** | **Relasi & Kompatibilitas** | Dinamika Hubungan, Attachment & Jodoh | `/kalkulator-cinta/` |
| **TC-13** | **Inner Child & Reparenting** | Memulihkan Luka Pengasuhan & Pola Asuh | `/ebooks/` |
| **TC-14** | **Regulasi Emosi & Somatik** | Mengurai Cemas, Trauma & Grounding Tubuh | `/cek-aura/` |
| **TC-15** | **Kesadaran Diri & Mindfulness** | Seni Pulang dan Mengamati Pikiran | `/about/` |
| **TC-16** | **Integrasi Spiritualitas & Hidup** | Membumikan Spiritualitas dalam Karier & Finansial | `/tes-kenali-diri/` |

---

## 4. Article State Machine & Lifecycle

Every article moves through a formal, deterministic state machine. Automated agents are strictly restricted in which transitions they are allowed to trigger.

```
 [ IDEA ]
    │ (Automation or Editor intake)
    ▼
 [ PLANNED ]
    │ (Brief generation & keyword clustering)
    ▼
 [ DRAFT ]
    │ (AI drafting copilot + Knowledge retrieval)
    ▼
 [ REVIEW_REQUIRED ]
    │
    ├────────────────────────┬────────────────────────┐
    │ (Automated QA Passed)  │ (QA Failed)            │ (Manual Edit)
    ▼                        ▼                        │
 [ EDITORIAL_QA ]       [ REVISION ] ─────────────────┘
    │                        │
    ▼ (Human Sign-off)       ▼
 [ APPROVED ]
    │
    ▼ (Scheduler)
 [ SCHEDULED ]
    │
    ▼ (Cron trigger)
 [ PUBLISHED ] ──► (Sync to Dynamic Sitemap & GSC Indexing)
    │
    ├────────────────────────┐
    ▼ (Annual / Metric drop)  ▼ (Content deprecated)
 [ NEEDS_REFRESH ]       [ ARCHIVED ]
```

### 4.1 State Transition Definitions & Permissions

| Current State | Target State | Triggering Agent / Actor | Safety Level | Conditions / Gate Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `IDEA` | `PLANNED` | Automation / Editor | SAFE | Validated cluster assignment, primary keyword selected. |
| `PLANNED` | `DRAFT` | Automation Pipeline | SAFE | Content brief created; outline contains H2/H3 and answer blocks. |
| `DRAFT` | `REVIEW_REQUIRED` | Automation Pipeline | SAFE | Minimum 1,000 words, epistemic markers applied, internal links mapped. |
| `REVIEW_REQUIRED` | `APPROVED` | Human Editor | **CRITICAL GATE** | Fact-check pass, no medical/diagnostic claims, Bhumi tone verified. |
| `APPROVED` | `SCHEDULED` | Human Editor / System | SAFE | Publication timestamp set; release velocity limit respected (≤ 3/day). |
| `SCHEDULED` | `PUBLISHED` | Scheduled Worker | SAFE | Firestore write executes with `status: 'published'` and `source: 'bhumi'`. |
| `PUBLISHED` | `NEEDS_REFRESH` | Monitor Worker | SAFE | Triggered when GSC rankings drop > 5 positions or after 180 days. |
| `PUBLISHED` | `ARCHIVED` | Human Editor | MANUAL ONLY | Removed from sitemap and list queries (`status: 'archived'`). |

---

## 5. Backward-Compatible Firestore Schema

### 5.1 Critical Production Reader Constraints
Inspection of `lib/content/firestore-reader.mjs` confirms that the production reader enforces the following query filters:
1. `source == 'bhumi'`
2. `status == 'published'`
3. Document fields extracted: `title`, `slug`, `excerpt`, `content`, `category`, `tags`, `coverImageUrl`, `authorName`, `publishedAt`, `updatedAt`, `seoTitle`, `seoDescription`, `readingTimeMinutes`, `featured`.

**Rule**: Any new schema properties must be **additive** and **optional**. Existing reader fields must never be renamed or mutated in format.

### 5.2 Canonical Firestore Document Schema (`articles` Collection)

```json
{
  "id": "apa-itu-human-design",
  
  "// --- EXISTING READER MANDATORY FIELDS --- //": "",
  "source": "bhumi",
  "status": "published",
  "title": "Apa Itu Human Design? Mengenal Peta Energi Tubuh dan Cara Kerjanya",
  "slug": "apa-itu-human-design",
  "excerpt": "Panduan mendasar tentang Human Design: perpaduan astrologi, I-Ching, chakra, Kabbalah, dan fisika kuantum untuk memahami cara alami Anda mengambil keputusan.",
  "content": "## Apa Itu Human Design?\n\nHuman Design adalah sebuah sistem peta energi...",
  "category": "Human Design",
  "tags": ["Human Design", "Mengenal Diri", "Tipe Energi", "Bodygraph"],
  "coverImageUrl": "https://www.bhumiamartya.my.id/assets/articles/human-design-intro.jpg",
  "authorName": "Widhi Wedhaswara",
  "publishedAt": "2026-09-10T08:00:00.000Z",
  "updatedAt": "2026-09-10T08:00:00.000Z",
  "seoTitle": "Apa Itu Human Design? Panduan Lengkap Tipe & Strategi | Bhumi Amartya",
  "seoDescription": "Pelajari sistem Human Design dari dasar. Pahami 5 tipe energi, strategi hidup, dan cara mengambil keputusan selaras dengan cetak biru tubuh Anda.",
  "readingTimeMinutes": 7,
  "featured": true,

  "// --- ADDITIVE GROWTH & AUTOMATION FIELDS (BACKWARD COMPATIBLE) --- //": "",
  "searchIntent": "informational",
  "primaryKeyword": "apa itu human design",
  "secondaryKeywords": [
    "cara membaca human design",
    "5 tipe human design",
    "bodygraph human design indonesia"
  ],
  "topicCluster": "TC-01",
  "entities": [
    { "name": "Human Design", "type": "System" },
    { "name": "Ra Uru Hu", "type": "Person" },
    { "name": "I-Ching", "type": "Tradition" }
  ],
  "references": [
    {
      "source": "The Definitive Book of Human Design",
      "author": "Ra Uru Hu & Lynda Bunnell",
      "type": "literature"
    }
  ],
  "epistemicClassification": "metaphysical_interpretation",
  "internalLinks": [
    { "anchor": "Tes Human Design", "targetUrl": "/kenali-diri/human-design/" },
    { "anchor": "Tes Kenali Diri Lengkap", "targetUrl": "/tes-kenali-diri/" }
  ],
  "relatedArticles": [
    "5-tipe-energi-human-design",
    "strategi-dan-otoritas-human-design"
  ],
  "editorialStatus": "approved",
  "generatedBy": "claude-3-7-sonnet",
  "reviewedBy": "Widhi Wedhaswara",
  "qualityScore": 96,
  "seoScore": 94,
  "geoScore": 92,
  "factCheckStatus": "verified",
  "lastReviewedAt": "2026-09-10T07:30:00.000Z",
  "reviewDueAt": "2027-03-10T00:00:00.000Z",
  "contentVersion": 1,
  "indexingStatus": {
    "submittedToGscAt": null,
    "submittedToBingAt": null,
    "lastIndexedAt": null,
    "isIndexed": false
  }
}
```

---

## 6. Publication Modes & Editorial Gates

The publishing engine supports three operating modes. To protect domain reputation and brand equity, the system must be hard-coded to `MANUAL_REVIEW` until stability is demonstrated.

### 6.1 Mode Definitions

1. **`MANUAL_REVIEW` (Default / Canonical Initial Mode)**:
   - AI drafts the content, gathers references, structures headings, embeds schema, and maps internal links.
   - Status stops at `REVIEW_REQUIRED`.
   - Cannot transition to `APPROVED` or `PUBLISHED` without manual editorial sign-off via CLI or admin dashboard.
2. **`SEMI_AUTOMATIC` (Future Expansion Phase)**:
   - High-confidence evergreen definitions (e.g., glossary terms, basic numerology calculations) that achieve `qualityScore >= 95` and pass all automated guardrails may transition to `APPROVED`.
   - Requires 1-click batch approval by the human editor before queueing.
3. **`AUTO_PUBLISH_LOW_RISK` (Reserved for Low-Risk Lexicon Only)**:
   - Strictly limited to purely objective reference pages (e.g., calendar conversions, astronomical ephemeris charts).
   - Forbidden for psychological, inner child, relationship advice, or metaphysical interpretations.

---

## 7. Execution Architecture & Scheduler

The publishing scheduler must operate asynchronously from the frontend website:

1. **Decoupled Workflow**:
   - The article generator and publisher will run as scheduled GitHub Actions or isolated Vercel Cron jobs.
   - It connects directly to Firestore using Service Account credentials.
2. **Rate Limiting & Release Velocity**:
   - Max release rate: 1 to 3 articles per calendar day.
   - Random jitter applied between releases to ensure natural publishing cadence.
3. **Immediate Notification & Audit Trail**:
   - Whenever an article enters `REVIEW_REQUIRED` or `PUBLISHED`, a webhook payload (Telegram or Discord) notifies the editorial team with the review preview link.
