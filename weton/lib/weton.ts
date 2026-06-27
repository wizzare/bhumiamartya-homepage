// =====================================================================
// Mesin perhitungan Weton Jawa
// =====================================================================
// Referensi kalibrasi:
//  - 17 Agustus 1945 = Jumat Legi (anchor pasaran)
//  - 1 Januari 2024  = Wuku Wukir (anchor wuku / pawukon)
// =====================================================================

export type WetonResult = {
  nama: string
  tanggalMasehi: string
  jamLahir: string
  bergeserHari: boolean
  hariJawa: string
  pasaran: string
  weton: string
  neptuHari: number
  neptuPasaran: number
  totalNeptu: number
  wuku: string
  pranataMangsa: { nama: string; periode: string; deskripsi: string }
  khodam: {
    nama: string
    jenisHewan: string
    warnaEnergi: string
    arketipe: string
    pesan: string
  }
  makna: string
}

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]

const NEPTU_HARI: Record<string, number> = {
  Minggu: 5,
  Senin: 4,
  Selasa: 3,
  Rabu: 7,
  Kamis: 8,
  Jumat: 6,
  Sabtu: 9,
}

// urutan pancawara mulai dari Legi (sesuai anchor 17 Agustus 1945)
const PASARAN = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"]

const NEPTU_PASARAN: Record<string, number> = {
  Legi: 5,
  Pahing: 9,
  Pon: 7,
  Wage: 4,
  Kliwon: 8,
}

const WUKU = [
  "Sinta",
  "Landep",
  "Wukir",
  "Kurantil",
  "Tolu",
  "Gumbreg",
  "Warigalit",
  "Warigagung",
  "Julungwangi",
  "Sungsang",
  "Galungan",
  "Kuningan",
  "Langkir",
  "Mandasiya",
  "Julungpujut",
  "Pahang",
  "Kuruwelut",
  "Marakeh",
  "Tambir",
  "Medangkungan",
  "Maktal",
  "Wuye",
  "Manahil",
  "Prangbakat",
  "Bala",
  "Wugu",
  "Wayang",
  "Kulawu",
  "Dukut",
  "Watugunung",
]

const KHODAM_POOL = [
  "Harimau Hitam", "Macan Putih", "Naga Biru", "Garuda Emas", "Kijang Putih",
  "Kura-Kura Tua", "Elang Jawa", "Serigala Abu", "Rusa Cokelat", "Kucing Hutan",
  "Burung Hantu", "Banteng Merah", "Ular Hijau", "Gajah Bumi", "Merak Emas",
  "Rajawali Perak", "Kuda Cokelat", "Ikan Koi Emas", "Kerbau Hitam", "Angsa Putih",
]

const JENIS_HEWAN = [
  "Hewan Penjaga", "Hewan Penuntun", "Hewan Penyembuh", "Hewan Pelindung", "Hewan Pembuka Jalan",
  "Hewan Penyeimbang", "Hewan Pembaca Tanda", "Hewan Penjaga Akar", "Hewan Transformasi", "Hewan Pembawa Pesan",
]

const WARNA_ENERGI = [
  "Hitam Emas", "Putih Perak", "Hijau Bumi", "Biru Malam", "Merah Tanah",
  "Cokelat Akar", "Ungu Dalam", "Emas Hangat", "Jingga Senja", "Abu Kabut",
  "Hijau Lumut", "Biru Laut", "Kuning Padi", "Merah Bata", "Perak Bulan",
]

const ARKETIPE_LELUHUR = [
  "Sang Penjaga Gerbang", "Sang Penenun Nasib", "Sang Pembuka Jalan", "Sang Perawat Luka", "Sang Guru Sunyi",
  "Sang Penjaga Api", "Sang Peneduh Rumah", "Sang Pengelana Batin", "Sang Pemanggul Cahaya", "Sang Penjaga Akar",
  "Sang Penyembuh Rasa", "Sang Panglima Tenang", "Sang Penjaga Mata Air", "Sang Pembaca Tanda", "Sang Penjaga Hutan",
  "Sang Penjaga Padi", "Sang Penjaga Malam", "Sang Penabuh Langit", "Sang Penjaga Rasa", "Sang Penuntun Pulang",
]

const KHODAM_OVERRIDES: Record<string, WetonResult["khodam"]> = {
  "Sabtu Legi": {
    nama: "Harimau Hitam",
    jenisHewan: "Hewan Penjaga",
    warnaEnergi: "Hitam Emas",
    arketipe: "Sang Penjaga Gerbang",
    pesan: "Secara simbolik, Harimau Hitam menggambarkan ketahanan, batas diri, dan keberanian yang tidak perlu banyak suara. Sosok Sang Penjaga Gerbang hadir sebagai arketipe untuk mengingatkanmu agar tidak mengecilkan kekuatan diri.",
  },
  "Jumat Kliwon": {
    nama: "Naga Biru",
    jenisHewan: "Hewan Transformasi",
    warnaEnergi: "Biru Malam",
    arketipe: "Sang Pengelana Batin",
    pesan: "Secara simbolik, Naga Biru menggambarkan kedalaman rasa, intuisi, dan kemampuan membaca suasana yang tidak selalu terlihat. Sosok Sang Pengelana Batin mengingatkanmu untuk mengolah perubahan dengan tenang.",
  },
  "Rabu Wage": {
    nama: "Kijang Putih",
    jenisHewan: "Hewan Penyembuh",
    warnaEnergi: "Putih Perak",
    arketipe: "Sang Perawat Luka",
    pesan: "Secara simbolik, Kijang Putih menggambarkan kelembutan, kepekaan, dan kemampuan menenangkan ruang yang sedang gaduh. Sosok Sang Perawat Luka mengingatkanmu menjaga hati tanpa kehilangan batas.",
  },
  "Minggu Pon": {
    nama: "Garuda Emas",
    jenisHewan: "Hewan Pembuka Jalan",
    warnaEnergi: "Emas Hangat",
    arketipe: "Sang Pembuka Jalan",
    pesan: "Secara simbolik, Garuda Emas menggambarkan keberanian tampil, visi, dan dorongan untuk membawa arah baru. Sosok Sang Pembuka Jalan mengingatkanmu memakai keberanian dengan hati yang jernih.",
  },
  "Senin Pahing": {
    nama: "Kura-Kura Tua",
    jenisHewan: "Hewan Penjaga Akar",
    warnaEnergi: "Cokelat Akar",
    arketipe: "Sang Penjaga Akar",
    pesan: "Secara simbolik, Kura-Kura Tua menggambarkan kesabaran, daya tahan, dan kemampuan merawat sesuatu sampai matang. Sosok Sang Penjaga Akar mengingatkanmu bahwa langkah pelan tetap bisa membawa hasil.",
  },
}

const PRANATA_MANGSA = [
  { nama: "Kasa", periode: "22 Jun – 1 Agu", deskripsi: "Musim kemarau dimulai, daun-daun mulai berguguran." },
  { nama: "Karo", periode: "2 Agu – 24 Agu", deskripsi: "Tanah merekah kering, masa istirahat bagi bumi." },
  { nama: "Katelu", periode: "25 Agu – 17 Sep", deskripsi: "Tanaman umbi mulai tumbuh, angin bertiup kencang." },
  { nama: "Kapat", periode: "18 Sep – 12 Okt", deskripsi: "Sumber air menyusut, burung-burung mulai bersarang." },
  { nama: "Kalima", periode: "13 Okt – 8 Nov", deskripsi: "Hujan pertama turun, bumi kembali menghijau." },
  { nama: "Kanem", periode: "9 Nov – 21 Des", deskripsi: "Musim buah tiba, hujan semakin sering mengguyur." },
  { nama: "Kapitu", periode: "22 Des – 2 Feb", deskripsi: "Puncak musim hujan, sungai meluap dan banjir mengintai." },
  { nama: "Kawolu", periode: "3 Feb – 28 Feb", deskripsi: "Masa padi bunting, hama mulai bermunculan." },
  { nama: "Kasanga", periode: "1 Mar – 25 Mar", deskripsi: "Padi mulai menguning, jangkrik bernyanyi di malam hari." },
  { nama: "Kadasa", periode: "26 Mar – 18 Apr", deskripsi: "Masa panen tiba, udara mulai menghangat kembali." },
  { nama: "Desta", periode: "19 Apr – 11 Mei", deskripsi: "Burung memberi makan anaknya, suasana penuh kasih." },
  { nama: "Sada", periode: "12 Mei – 21 Jun", deskripsi: "Embun pagi turun dingin, peralihan menuju kemarau." },
]

function maknaWeton(neptu: number, weton: string): string {
  if (neptu <= 9) {
    return `Dengan total neptu ${neptu}, pemilik weton ${weton} dikenal berhati lembut, sederhana, dan mudah bergaul. Anda cenderung mengalah demi keharmonisan, namun di balik kelembutan itu tersimpan ketulusan yang menjadi kekuatan sejati.`
  }
  if (neptu <= 12) {
    return `Total neptu ${neptu} pada weton ${weton} mencerminkan pribadi yang seimbang antara perasaan dan logika. Anda pandai menyesuaikan diri, setia pada hubungan, dan kerap menjadi penengah yang bijak di tengah perbedaan.`
  }
  if (neptu <= 15) {
    return `Weton ${weton} dengan neptu ${neptu} menandakan jiwa yang teguh, mandiri, dan penuh tanggung jawab. Anda memiliki tekad kuat untuk mencapai tujuan dan tidak mudah goyah oleh godaan maupun rintangan.`
  }
  return `Neptu ${neptu} yang tinggi pada weton ${weton} melambangkan kharisma, kepemimpinan, dan ambisi besar. Anda terlahir dengan daya juang luar biasa serta kemampuan memengaruhi dan mengayomi orang di sekitar Anda.`
}

// Selisih hari penuh antara dua tanggal (berbasis UTC, mengabaikan jam).
function selisihHari(a: Date, b: Date): number {
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((utcA - utcB) / 86400000)
}

function hitungPasaran(d: Date): string {
  // anchor: 17 Agustus 1945 = Legi (index 0)
  const anchor = new Date(1945, 7, 17)
  const diff = selisihHari(d, anchor)
  const idx = ((diff % 5) + 5) % 5
  return PASARAN[idx]
}

function hitungWuku(d: Date): string {
  // anchor: minggu pembuka pekan yang memuat 1 Jan 2024 (yaitu 31 Des 2023) = Wukir (index 2)
  const anchorSunday = new Date(2023, 11, 31)
  // mundur ke hari Minggu pembuka pekan dari tanggal d
  const sunday = new Date(d)
  sunday.setDate(d.getDate() - d.getDay())
  const diffDays = selisihHari(sunday, anchorSunday)
  const weeks = Math.round(diffDays / 7)
  const idx = (((2 + weeks) % 30) + 30) % 30
  return WUKU[idx]
}

function hitungPranataMangsa(d: Date) {
  const m = d.getMonth() + 1
  const day = d.getDate()
  const v = m * 100 + day // bentuk MMDD untuk perbandingan
  const ranges: { start: number; end: number; idx: number }[] = [
    { start: 622, end: 801, idx: 0 }, // Kasa
    { start: 802, end: 824, idx: 1 }, // Karo
    { start: 825, end: 917, idx: 2 }, // Katelu
    { start: 918, end: 1012, idx: 3 }, // Kapat
    { start: 1013, end: 1108, idx: 4 }, // Kalima
    { start: 1109, end: 1221, idx: 5 }, // Kanem
    { start: 1222, end: 1231, idx: 6 }, // Kapitu (akhir tahun)
    { start: 101, end: 202, idx: 6 }, // Kapitu (awal tahun)
    { start: 203, end: 229, idx: 7 }, // Kawolu
    { start: 301, end: 325, idx: 8 }, // Kasanga
    { start: 326, end: 418, idx: 9 }, // Kadasa
    { start: 419, end: 511, idx: 10 }, // Desta
    { start: 512, end: 621, idx: 11 }, // Sada
  ]
  for (const r of ranges) {
    if (v >= r.start && v <= r.end) return PRANATA_MANGSA[r.idx]
  }
  return PRANATA_MANGSA[6] // fallback Kapitu
}

function hitungKhodam(totalNeptu: number, pasaranIdx: number, hariIdx: number, weton: string): WetonResult["khodam"] {
  if (KHODAM_OVERRIDES[weton]) return KHODAM_OVERRIDES[weton]
  const seed = totalNeptu * 3 + pasaranIdx * 7 + hariIdx * 5
  const nama = KHODAM_POOL[seed % KHODAM_POOL.length]
  const jenisHewan = JENIS_HEWAN[(seed + totalNeptu) % JENIS_HEWAN.length]
  const warnaEnergi = WARNA_ENERGI[(seed + pasaranIdx) % WARNA_ENERGI.length]
  const arketipe = ARKETIPE_LELUHUR[(seed + hariIdx) % ARKETIPE_LELUHUR.length]
  return {
    nama,
    jenisHewan,
    warnaEnergi,
    arketipe,
    pesan: `Secara simbolik, ${nama} menggambarkan energi pendamping yang cenderung membantu membaca karakter, menjaga ritme, dan mengenali kekuatan batin. Sosok ${arketipe} hadir sebagai arketipe reflektif untuk mengingatkanmu merawat arah diri dengan lebih sadar.`,
  }
}

export function hitungWeton(nama: string, tanggal: string, jam: string): WetonResult {
  // tanggal: "YYYY-MM-DD", jam: "HH:MM"
  const [tahun, bulan, hariTgl] = tanggal.split("-").map(Number)
  const [jamH, jamM] = jam.split(":").map(Number)

  const base = new Date(tahun, bulan - 1, hariTgl)

  // Aturan: jam >= 18:00 -> hari Jawa dihitung sebagai hari berikutnya
  const bergeser = jamH >= 18
  const efektif = new Date(base)
  if (bergeser) efektif.setDate(efektif.getDate() + 1)

  const hariIdx = efektif.getDay()
  const hariJawa = HARI[hariIdx]
  const pasaran = hitungPasaran(efektif)
  const pasaranIdx = PASARAN.indexOf(pasaran)

  const neptuHari = NEPTU_HARI[hariJawa]
  const neptuPasaran = NEPTU_PASARAN[pasaran]
  const totalNeptu = neptuHari + neptuPasaran
  const weton = `${hariJawa} ${pasaran}`
  const wuku = hitungWuku(efektif)
  const pranataMangsa = hitungPranataMangsa(base) // mangsa berdasarkan tanggal masehi asli
  const khodam = hitungKhodam(totalNeptu, pasaranIdx, hariIdx, weton)

  const tanggalFmt = base.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return {
    nama: nama.trim() || "Sahabat",
    tanggalMasehi: tanggalFmt,
    jamLahir: jam,
    bergeserHari: bergeser,
    hariJawa,
    pasaran,
    weton,
    neptuHari,
    neptuPasaran,
    totalNeptu,
    wuku,
    pranataMangsa,
    khodam,
    makna: maknaWeton(totalNeptu, weton),
  }
}
