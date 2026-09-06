# BHUMI SEO, GEO, & AEO SPECIFICATION

```
PROJECT: Bhumi Amartya Website Growth Engine
DOCUMENT: Search, Answer Engine, & Generative Discovery Specification
STATUS: CANONICAL SPECIFICATION
VERSION: 1.0.0
DATE: 2026-09-07
```

---

## 1. Discovery Architecture Overview

Organic discovery for Bhumi Amartya operates across three distinct yet complementary paradigms:

1. **Traditional SEO (Search Engine Optimization)**: Optimizing for Google, Bing, and traditional search engine crawlers through crawlability, site architecture, semantic HTML, mobile-friendliness, Core Web Vitals, and keyword-intent alignment.
2. **AEO (Answer Engine Optimization)**: Structuring content so search engine "answer boxes" (Google Featured Snippets, People Also Ask, Knowledge Panels) can extract direct, authoritative answers.
3. **GEO (Generative Engine Optimization)**: Formatting text, data structures, entity relationships, and citations so large language models and generative search engines (Perplexity, ChatGPT Search, Google AI Overviews, Gemini) cite Bhumi Amartya as a credible source of truth. *Note: GEO improves citation probability; it does not offer guaranteed inclusion.*

---

## 2. Technical SEO Standards

### 2.1 URL Architecture & Canonicalization
- **Canonical Article URL Format**: `https://www.bhumiamartya.my.id/articles/<slug>/`
  - Protocol: Strictly HTTPS.
  - Subdomain: Strictly `www.bhumiamartya.my.id`.
  - Trailing Slash: Strictly enforced across all canonical links and sitemaps.
  - Immutability: Once published, slugs never change, even if titles are updated.
  - Slugs must match regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` (max 200 characters).

### 2.2 Semantic HTML & Document Hierarchy
Every article page rendered by `lib/content/render-article.mjs` must maintain strict semantic structure:
- Exactly one `<h1>` per page containing the primary keyword.
- Sectional headings structured strictly hierarchically (`<h2>` followed by `<h3>`). Never skip levels.
- Image assets must include descriptive, contextual `alt` attributes (`alt="Diagram 5 Tipe Energi Human Design - Bhumi Amartya"`).
- Core navigation breadcrumbs rendered visually and marked up in JSON-LD.

### 2.3 Metadata Standards
- **Title Tag**: `<title>{seoTitle || title} | Bhumi Amartya</title>` (Target length: 50–60 characters).
- **Meta Description**: `<meta name="description" content="{seoDescription || excerpt}">` (Target length: 140–160 characters; actionable and intent-aligned).
- **Social Graph OpenGraph / Twitter**:
  - `og:type`: `article`
  - `og:title`, `og:description`, `og:url` (canonical)
  - `og:image`: High-resolution card (minimum 1200×630 px)
  - `twitter:card`: `summary_large_image`

---

## 3. Schema.org Entity Graph & Structured Data

To establish entity authority, article pages must output a unified JSON-LD graph connecting the publisher, author, web page, breadcrumbs, and article content.

### 3.1 Canonical Entity Graph Specification

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.bhumiamartya.my.id/#organization",
      "name": "Bhumi Amartya",
      "url": "https://www.bhumiamartya.my.id/",
      "logo": {
        "@type": "ImageObject",
        "@id": "https://www.bhumiamartya.my.id/#logo",
        "url": "https://www.bhumiamartya.my.id/assets/logo-1024.png",
        "caption": "Bhumi Amartya Logo"
      },
      "founder": {
        "@id": "https://www.bhumiamartya.my.id/#founder"
      },
      "sameAs": [
        "https://www.instagram.com/bhumiamartya/",
        "https://www.youtube.com/@bhumiamartya"
      ]
    },
    {
      "@type": "Person",
      "@id": "https://www.bhumiamartya.my.id/#founder",
      "name": "Widhi Wedhaswara",
      "url": "https://www.bhumiamartya.my.id/about/",
      "jobTitle": "Founder & Lead Self-Discovery Practitioner",
      "worksFor": {
        "@id": "https://www.bhumiamartya.my.id/#organization"
      },
      "description": "Praktisi pengembangan diri integratif, peneliti sistem cetak biru kepribadian (Human Design, Weton Jawa, Astrologi), dan founder Bhumi Amartya."
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.bhumiamartya.my.id/articles/apa-itu-human-design/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Beranda",
          "item": "https://www.bhumiamartya.my.id/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Artikel",
          "item": "https://www.bhumiamartya.my.id/articles/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Apa Itu Human Design?",
          "item": "https://www.bhumiamartya.my.id/articles/apa-itu-human-design/"
        }
      ]
    },
    {
      "@type": "Article",
      "@id": "https://www.bhumiamartya.my.id/articles/apa-itu-human-design/#article",
      "isPartOf": {
        "@type": "WebPage",
        "@id": "https://www.bhumiamartya.my.id/articles/apa-itu-human-design/"
      },
      "headline": "Apa Itu Human Design? Mengenal Peta Energi Tubuh dan Cara Kerjanya",
      "description": "Panduan mendasar tentang Human Design: perpaduan astrologi, I-Ching, chakra, Kabbalah, dan fisika kuantum.",
      "image": "https://www.bhumiamartya.my.id/assets/articles/human-design-intro.jpg",
      "datePublished": "2026-09-10T08:00:00.000Z",
      "dateModified": "2026-09-10T08:00:00.000Z",
      "author": {
        "@id": "https://www.bhumiamartya.my.id/#founder"
      },
      "publisher": {
        "@id": "https://www.bhumiamartya.my.id/#organization"
      },
      "inLanguage": "id-ID",
      "mainEntityOfPage": "https://www.bhumiamartya.my.id/articles/apa-itu-human-design/"
    }
  ]
}
```

---

## 4. AEO & Answer Engine Optimization Standards

Answer engines look for concise, definitive paragraph answers immediately following question-based headers.

### 4.1 Answer-First Writing Pattern (BLUF)
Every major article section addressing a core query must adhere to the **Bottom Line Up Front (BLUF)** formula:
1. **Direct Answer (40–60 words)**: The first paragraph immediately after an `<h2>` or `<h3>` must answer the query directly, without conversational pleasantries.
2. **Contextual Elaboration (100–250 words)**: Provide nuances, historical context, or system mechanics.
3. **Structured Breakdown (Bullet points / Table)**: Provide categorized lists, attributes, or comparison metrics.

*Example:*
> **H2: Apa Itu Human Design?**  
> **Human Design** adalah sistem pemetaan diri integratif yang menggabungkan astrologi Barat, I-Ching Tiongkok, sistem chakra Hindu-Brahmana, pohon kehidupan Kabbalah, dan fisika kuantum untuk memetakan bagaimana tubuh Anda secara alami mengelola energi dan mengambil keputusan. Sistem ini diperkenalkan oleh Ra Uru Hu pada tahun 1987.

### 4.2 Natural FAQ Structure
Where genuine user questions exist, include a dedicated FAQ block at the bottom of the article. Articles should use the `FAQPage` schema only when the FAQs represent genuine user inquiries.

---

## 5. GEO & Generative Engine Optimization Standards

To be cited as a trusted source by Perplexity, Gemini, ChatGPT Search, and Claude:

### 5.1 The 5-Layer Epistemic Distinction
Because Bhumi Amartya explores both empirical psychology and spiritual/metaphysical systems, **it is paramount that LLM crawlers do not categorize Bhumi content as deceptive pseudoscience or medical misinformation.**

Content must systematically delineate claims across 5 explicit categories:
1. **Scientific & Empirical Evidence**: Peer-reviewed psychology, neuroscience, cognitive science (e.g., Carl Jung's psychological types, trauma theory).
2. **Tradition-Based Knowledge**: Sacred, cultural, and historical systems with established cultural lineage (e.g., Primbon Jawa, Weton, Vedic Jyotish, BaZi).
3. **Metaphysical & Archetypal Systems**: Holistic models designed as self-reflection frameworks rather than physical sciences (e.g., Human Design, Western Astrology, Destiny Matrix, Tarot archetypes).
4. **Bhumi Integrative Methodology**: Bhumi's proprietary synthesis combining multiple tools to identify behavioral blind spots.
5. **Personal Reflective Experience**: Individual experiential narratives and meditation observations.

### 5.2 Explicit Source Attributions
Never present metaphysical mechanics as universal physical laws.
- **Unfavorable Writing**: "Planet Mars berada di rumah ke-7, yang menyebabkan Anda selalu bertengkar dengan pasangan."
- **Authoritative GEO Writing**: "Dalam tradisi astrologi, transit planet Mars pada rumah ketujuh sering diinterpretasikan secara simbolis sebagai pemicu ketegasan atau gesekan dalam relasi. Namun, dari sudut pandang psikologis, dinamika relasi sangat dipengaruhi oleh pola komunikasi dan gaya keterikatan (attachment style) masing-masing individu."

---

## 6. AI Crawler Discoverability Audit

### 6.1 Existing Crawler Policy (`robots.txt`)
Inspection of production `robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://www.bhumiamartya.my.id/sitemap.xml
```

### 6.2 Audit Findings
- **Status**: Permissive. All search engine and AI crawlers are currently allowed complete access to the root directory `/`.
- **Known AI Bots Permitted**:
  - `GPTBot` (OpenAI training)
  - `OAI-SearchBot` / `ChatGPT-User` (ChatGPT Search)
  - `PerplexityBot` (Perplexity AI)
  - `ClaudeBot` (Anthropic)
  - `Google-Extended` (Gemini training)
  - `Googlebot` (Google search indexing)
- **Recommendation**: Maintain full openness for now to maximize AI indexing and knowledge grounding. No robots.txt restrictions should be deployed at this stage.
