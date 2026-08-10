# Blueprint Engines Feasibility Report

## Baseline

- Branch: `feat/website-blueprint-engines`
- Base commit: `5959099`
- Snapshot: `feat/personal-blueprint-inline-clean` dibekukan

## Arsitektur yang Disarankan

```
tes-kenali-diri/index.html
  └─ 6 kalkulasi lokal (Life Path, Arcana, Sun, Weton, BaZi, Tzolkin)
  └─ POST /api/blueprint-engines (untuk Human Design + Vedic)
        ├─ lib/human-design/calculate.mjs (existing)
        └─ lib/vedic/calculate.mjs (new)
```

Endpoint existing: `POST /api/blueprint.mjs` sudah menghitung HD + Destiny Matrix + Natal, tetapi tidak termasuk kalkulasi 6 field lokal, dan tidak ada Vedic.

## Kondisi Existing

| Komponen | Status | Catatan |
| --- | --- | --- |
| `lib/human-design/calculate.mjs` | **EXISTING (458 lines)** | Menggunakan `astronomy-engine`, sudah menghitung Type, Profile, Authority, Strategy, Gates, Channels |
| `lib/human-design/normalizer.mjs` | **EXISTING** | Normalisasi response HD |
| `lib/natal-chart/calculate.mjs` | **EXISTING** | Sudah menggunakan `astronomy-engine` |
| `lib/vedic/` | **TIDAK ADA** | Belum diimplementasikan |
| `astronomy-engine` | **DEPS EXISTING** | MIT license, v2.1.19, bisa menghitung posisi Bulan |
| `api/blueprint.mjs` | **EXISTING** | Sudah panggil HD engine, maxDuration 30, memory 512 |

## Human Design

### Ketersediaan

Engine sudah lengkap di website: `calculateHumanDesign()`, `getAuthority()`, `getStrategy()`, `calculateProfile()`, design moment calculation, GATE_ORDER mandala 64, CENTERS_BY_CHANNEL.

### Feasibility

`HUMAN DESIGN ENGINE FEASIBILITY: GO`

Engine sudah ada, tidak perlu menulis ulang. Hanya perlu:
1. Buat endpoint tipis `api/blueprint-engines.mjs` atau gunakan `api/blueprint.mjs` existing
2. Panggil `calculateHumanDesign()` dari client-side `/tes-kenali-diri/`
3. Hasil yang dipakai: Type, Profile, Authority, Strategy

### Sumber Algoritma

- `astronomy-engine` (MIT) untuk posisi planet
- `GATE_ORDER` berdasarkan Rave Mandala iGing (sudah diimplementasikan)
- `CENTERS_BY_CHANNEL` mapping sudah ada
- `getAuthority()` dan `getStrategy()` berdasarkan Type

## Vedic

### Ketersediaan

Tidak ada engine Vedic. Namun `astronomy-engine` bisa menghitung:

1. `SearchMoonPhase()` → Moon ecliptic longitude
2. Konversi ke sidereal longitude (Lahiri ayanamsa)
3. Rashi dari sidereal longitude
4. Nakshatra dari sidereal longitude
5. Pada dari subdivisi Nakshatra
6. Nakshatra lord
7. Mahadasha Vimshottari saat lahir (dari Moon longitude)
8. Mahadasha aktif pada tanggal tertentu

### Feasibility

`VEDIC ENGINE FEASIBILITY: CONDITIONAL GO`

**Kondisi:**
- Target output: Moon/Rashi, Nakshatra, Pada, Mahadasha saat lahir
- **TIDAK** menghitung planet lain (Sun, Mars, dll) atau chart penuh
- Hanya menggunakan Moon longitude saja
- Ayanamsa: Lahiri (Chitrapaksha)
- Dasha: Vimshottari (berbasis Moon)
- Mahadasha yang ditampilkan = **Mahadasha saat lahir** (bukan saat ini)

**Mengapa CONDITIONAL GO:**
- Vedic penuh memerlukan posisi 9 planet + Ascendant → belum feasible tanpa engine tambahan
- Dengan hanya Moon, output sangat terbatas dibandingkan API lama yang menampilkan:
  - `Moon/Rashi: Libra. Nakshatra: Chitra (Pada 4). Mahadasha: Saturn.`
- Ayanamsa calculation memerlukan formula matematik (tidak ada di `astronomy-engine`)
- Perlu verifikasi bahwa output Moon-only sama dengan baseline API lama

### Lisensi

`astronomy-engine` → MIT ✅. Tidak ada dependency tambahan.

### Risiko

- Moon-only Vedic sangat terbatas dibandingkan penuh
- Ayanamsa formula perlu divalidasi terhadap baseline
- Mahadasha calculation kompleks (Vimshottari cycle 120 tahun, proporsional berdasarkan Moon-Nakshatra pada kelahiran)
- Output tidak akan identik dengan API lama yang mungkin menghitung chart penuh

## Kandidat Library Tambahan

| Library | Fungsi | Lisensi | Risiko |
| --- | --- | --- | --- |
| `astronomy-engine` (existing) | Posisi Bulan, planet | MIT | ✅ Tidak ada |
| Swiss Ephemeris | Posisi planet sidereal | AGPL / Commercial | ❌ AGPL tidak cocok untuk komersial |

## Estimasi Kompleksitas

| Engine | Estimasi Waktu | Kompleksitas |
| --- | --- | --- |
| Human Design (endpoint tipis) | 1-2 hari | Rendah (sudah ada) |
| Vedic (Moon-only) | 3-5 hari | Sedang |

## Keputusan

```
HUMAN DESIGN ENGINE FEASIBILITY: GO
VEDIC ENGINE FEASIBILITY: CONDITIONAL GO
ENGINE IMPLEMENTATION: NOT STARTED
```

**Menunggu approval Founder:**
1. Apakah Moon-only Vedic cukup atau harus penuh?
2. Mahadasha = saat lahir atau saat ini?
3. Apakah `api/blueprint.mjs` existing akan di-reuse atau endpoint baru?
