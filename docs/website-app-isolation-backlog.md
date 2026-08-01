# Website-App Isolation Backlog

## Status: PARTIAL

### Route /cek-aura/

| Dependency | Fungsi | Risiko | Target |
| --- | --- | --- | --- |
| `bhumi-amartya-clean.vercel.app/api/tes-kenali-diri` | Kalkulasi hasil aura | High: runtime dependency | Engine website atau engine lokal |
| Tindakan: | Buat branch terpisah | | |

### Route /kalkulator-cinta/

| Dependency | Fungsi | Risiko | Target |
| --- | --- | --- | --- |
| `bhumi-amartya-clean.vercel.app/api/tes-kenali-diri` | Kalkulasi kecocokan | High: runtime dependency | Engine website atau engine lokal |
| Tindakan: | Buat branch terpisah | | |

### Route /kenali-diri/human-design/

| Dependency | Fungsi | Risiko | Target |
| --- | --- | --- | --- |
| `bhumi-amartya-clean.vercel.app/api/human-design-test` | Kalkulasi chart HD | High: runtime dependency | Engine website atau engine lokal |
| Tindakan: | Gunakan engine website yang sudah ada | | |

### vercel.json

| Source | Destination | Risiko |
| --- | --- | --- |
| `/_next/:path*` | `bhumi-amartya-clean.vercel.app/_next/:path*` | High: runtime dependency |
| `/images/:path*` | `bhumi-amartya-clean.vercel.app/images/:path*` | Medium: aset statis |
| `/kecocokanmatrix` | `bhumi-amartya-clean.vercel.app/kecocokan-matrix` | High: runtime dependency |
| `/articles` | `bhumi-amartya-clean.vercel.app/articles` | High: runtime dependency |
| `/ebooks` | `bhumi-amartya-clean.vercel.app/ebooks` | High: runtime dependency |
| `/founder` | `bhumi-amartya-clean.vercel.app/founder` | High: runtime dependency |
| `/ngopi-ilmu` | `bhumi-amartya-clean.vercel.app/konten/ngopi-ilmu` | High: runtime dependency |
| `/api/bhumi-articles` | `bhumi-amartya-clean.vercel.app/api/articles` | High: runtime dependency |
| `/api/wedhaswara-articles` | `wedhaswara.my.id/wp-json/wp/v2/posts` | Low: external WordPress |

## Rekomendasi

1. Prioritas tinggi: isolasi `/tes-kenali-diri/` (selesai)
2. Prioritas sedang: isolasi `/cek-aura/` dan `/kalkulator-cinta/`
3. Prioritas rendah: isolasi `/kenali-diri/human-design/`
4. Rewrite: jangan hapus secara massal, pertahankan yang diperlukan
5. Aset: pertahankan `/images/` rewrite
6. WordPress: pertahankan wedhaswara-articles rewrite

## Checklist

- [ ] /tes-kenali-diri/ isolation: PASS
- [ ] /cek-aura/ isolation: FAIL
- [ ] /kalkulator-cinta/ isolation: FAIL
- [ ] /kenali-diri/human-design/ isolation: FAIL
- [ ] vercel.json rewrites: PARTIAL
