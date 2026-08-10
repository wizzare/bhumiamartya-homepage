# Feature-Parity Matrix

## Baseline Menu

| Item | Status |
| --- | --- |
| Beranda | Aktif |
| Kenali Diri | Aktif |
| Produk | Aktif |
| Konten | Aktif |
| Tentang | Aktif |
| Kontak | Aktif |

## Fitur

| Fitur | URL | Status Target |
| --- | --- | --- |
| Tes Kenali Diri | `/tes-kenali-diri/` | Aktif |
| Personal Blueprint inline | `/tes-kenali-diri/` | Tampil setelah hasil sukses |
| Blueprint Reading legacy | `/reading/` | Redirect permanen |
| Blueprint product legacy | `/produk/blueprint-reading/` | Redirect permanen |
| Compatibility Reading | `/kalkulator-cinta/` | Aktif |

## Linked Tools

| Tool | URL | Status |
| --- | --- | --- |
| Cek Aura | `/cek-aura/` | Aktif; masih memakai endpoint aplikasi |
| Cek Weton | `/weton/` | Aktif |
| Kalkulator Cinta | `/kalkulator-cinta/` | Aktif; masih memakai endpoint aplikasi |
| Human Design | `/kenali-diri/human-design/` | Aktif; masih memakai endpoint aplikasi |
| MBTI | `/kenali-diri/mbti/` | Aktif |

## Blueprint Engines

| Engine | Status | Feasibility |
| --- | --- | --- |
| Human Design | **Existing lib available** | **GO** |
| Vedic (Moon-only) | **Not implemented** | **CONDITIONAL GO** |
| Human Design + Vedic integration | **Design spike complete** | Pending approval |

## Endpoint

| Endpoint | Method | Status |
| --- | --- | --- |
| `/api/reading` | POST | Aktif |
| `/api/blueprint-engines` | POST | **Design spike complete** |
| `/api/blueprint.mjs` | POST | Existing (HD + Destiny Matrix + Natal) |

## Personal Blueprint / Self-Test Acceptance

| Item | Status |
| --- | --- |
| Runtime isolation `/tes-kenali-diri/` | PASS |
| Runtime request `/tes-kenali-diri/` ke `bhumi-amartya-clean.vercel.app` | 0 |
| Life Path parity | PASS untuk fixture A/B/C terhadap endpoint lama |
| Arcana parity | PASS untuk fixture A/B/C terhadap endpoint lama |
| Sun Sign parity | PASS untuk fixture A/B/C terhadap endpoint lama |
| Weton parity | PASS untuk fixture A/B/C terhadap endpoint lama |
| BaZi parity | PASS secara nilai; label lokal memakai `Air`, baseline API memakai `Water` |
| Tzolkin parity | PASS secara nilai Kin/Tone; baseline API menambahkan nama Maya dalam tanda kurung |
| Human Design calculation | PLACEHOLDER; website belum memiliki engine lokal |
| Vedic calculation | PLACEHOLDER; website belum memiliki engine lokal |
| Kalkulasi lokal | Primary untuk `/tes-kenali-diri/`; bukan fallback |
| Error UX | Inline, non-blocking |
| Google Sheets append | BLOCKED: Preview credential belum tersedia |
| WhatsApp end-to-end | MOCK ONLY sampai append nyata tersedia |
| Global website-app isolation | PARTIAL; `/cek-aura/`, `/kalkulator-cinta/`, dan `/kenali-diri/human-design/` masih bergantung pada aplikasi |
| Human Design engine (website) | **Existing** di `lib/human-design/` |
| Vedic engine (website) | **Not implemented** |
