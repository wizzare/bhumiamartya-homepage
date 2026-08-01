# Feature-Parity Matrix

## Baseline Menu

| Item       | Status     |
| ---------- | ---------- |
| Beranda    | Aktif      |
| Kenali Diri | Aktif     |
| Produk     | Aktif      |
| Konten     | Aktif      |
| Tentang    | Aktif      |
| Kontak     | Aktif      |

## Fitur

| Fitur                     | URL                          | Status Target               |
| ------------------------- | ---------------------------- | --------------------------- |
| Tes Kenali Diri           | `/tes-kenali-diri/`          | Aktif                       |
| Personal Blueprint inline | `/tes-kenali-diri/`          | Tampil setelah hasil sukses |
| Blueprint Reading legacy  | `/reading/`                  | Redirect permanen           |
| Blueprint product legacy  | `/produk/blueprint-reading/` | Redirect permanen           |
| Compatibility Reading     | `/kalkulator-cinta/`         | Aktif                       |

## Linked Tools

| Tool            | URL                     | Status |
| --------------- | ----------------------- | ------ |
| Cek Aura        | `/cek-aura/`            | Aktif  |
| Cek Weton       | `/weton/`               | Aktif  |
| Kalkulator Cinta| `/kalkulator-cinta/`    | Aktif  |
| Human Design    | `/kenali-diri/human-design/` | Aktif |
| MBTI            | `/kenali-diri/mbti/`    | Aktif  |

## Endpoint

| Endpoint       | Method | Status     |
| -------------- | ------ | ---------- |
| `/api/reading` | POST   | Aktif      |