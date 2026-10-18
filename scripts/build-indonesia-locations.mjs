import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Timezone assignment by official 2-digit province code (Keppres No. 41 Tahun 1987)
const PROVINCE_TIMEZONES = {
  // WIB - Asia/Jakarta (UTC+7)
  '11': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Aceh
  '12': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Sumatera Utara
  '13': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Sumatera Barat
  '14': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Riau
  '15': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Jambi
  '16': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Sumatera Selatan
  '17': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Bengkulu
  '18': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Lampung
  '19': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Kepulauan Bangka Belitung
  '21': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Kepulauan Riau
  '31': { tz: 'Asia/Jakarta', offset: '+07:00' }, // DKI Jakarta
  '32': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Jawa Barat
  '33': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Jawa Tengah
  '34': { tz: 'Asia/Jakarta', offset: '+07:00' }, // DI Yogyakarta
  '35': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Jawa Timur
  '36': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Banten
  '61': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Kalimantan Barat
  '62': { tz: 'Asia/Jakarta', offset: '+07:00' }, // Kalimantan Tengah

  // WITA - Asia/Makassar (UTC+8)
  '51': { tz: 'Asia/Makassar', offset: '+08:00' }, // Bali
  '52': { tz: 'Asia/Makassar', offset: '+08:00' }, // Nusa Tenggara Barat
  '53': { tz: 'Asia/Makassar', offset: '+08:00' }, // Nusa Tenggara Timur
  '63': { tz: 'Asia/Makassar', offset: '+08:00' }, // Kalimantan Selatan
  '64': { tz: 'Asia/Makassar', offset: '+08:00' }, // Kalimantan Timur
  '65': { tz: 'Asia/Makassar', offset: '+08:00' }, // Kalimantan Utara
  '71': { tz: 'Asia/Makassar', offset: '+08:00' }, // Sulawesi Utara
  '72': { tz: 'Asia/Makassar', offset: '+08:00' }, // Sulawesi Tengah
  '73': { tz: 'Asia/Makassar', offset: '+08:00' }, // Sulawesi Selatan
  '74': { tz: 'Asia/Makassar', offset: '+08:00' }, // Sulawesi Tenggara
  '75': { tz: 'Asia/Makassar', offset: '+08:00' }, // Gorontalo
  '76': { tz: 'Asia/Makassar', offset: '+08:00' }, // Sulawesi Barat

  // WIT - Asia/Jayapura (UTC+9)
  '81': { tz: 'Asia/Jayapura', offset: '+09:00' }, // Maluku
  '82': { tz: 'Asia/Jayapura', offset: '+09:00' }, // Maluku Utara
  '91': { tz: 'Asia/Jayapura', offset: '+09:00' }, // Papua
  '92': { tz: 'Asia/Jayapura', offset: '+09:00' }, // Papua Barat
  '93': { tz: 'Asia/Jayapura', offset: '+09:00' }, // Papua Selatan
  '94': { tz: 'Asia/Jayapura', offset: '+09:00' }, // Papua Tengah
  '95': { tz: 'Asia/Jayapura', offset: '+09:00' }, // Papua Pegunungan
  '96': { tz: 'Asia/Jayapura', offset: '+09:00' }, // Papua Barat Daya
};

// Verified coordinates for all 38 Indonesian provinces
const VERIFIED_PROVINCE_COORDINATES = {
  '11': { lat: 4.36855, lon: 97.0253 }, // Aceh
  '12': { lat: 2.19235, lon: 99.38122 }, // Sumatera Utara
  '13': { lat: -1.34225, lon: 100.0761 }, // Sumatera Barat
  '14': { lat: 0.50041, lon: 101.54758 }, // Riau
  '15': { lat: -1.61157, lon: 102.7797 }, // Jambi
  '16': { lat: -3.12668, lon: 104.09306 }, // Sumatera Selatan
  '17': { lat: -3.51868, lon: 102.53598 }, // Bengkulu
  '18': { lat: -4.8555, lon: 105.0273 }, // Lampung
  '19': { lat: -2.75775, lon: 107.58394 }, // Kepulauan Bangka Belitung
  '21': { lat: -0.15478, lon: 104.58037 }, // Kepulauan Riau
  '31': { lat: -6.1754, lon: 106.8272 }, // DKI Jakarta
  '32': { lat: -6.88917, lon: 107.64047 }, // Jawa Barat
  '33': { lat: -7.30324, lon: 110.00441 }, // Jawa Tengah
  '34': { lat: -7.7956, lon: 110.3695 }, // DI Yogyakarta
  '35': { lat: -6.96851, lon: 113.98005 }, // Jawa Timur
  '36': { lat: -6.44538, lon: 106.13756 }, // Banten
  '51': { lat: -8.23566, lon: 115.12239 }, // Bali
  '52': { lat: -8.12179, lon: 117.63696 }, // Nusa Tenggara Barat
  '53': { lat: -8.56568, lon: 120.69786 }, // Nusa Tenggara Timur
  '61': { lat: -0.13224, lon: 111.09689 }, // Kalimantan Barat
  '62': { lat: -1.49958, lon: 113.29033 }, // Kalimantan Tengah
  '63': { lat: -2.94348, lon: 115.37565 }, // Kalimantan Selatan
  '64': { lat: 0.78844, lon: 116.242 }, // Kalimantan Timur
  '65': { lat: 2.72594, lon: 116.911 }, // Kalimantan Utara
  '71': { lat: 0.65557, lon: 124.09015 }, // Sulawesi Utara
  '72': { lat: -1.69378, lon: 120.80886 }, // Sulawesi Tengah
  '73': { lat: -3.64467, lon: 119.94719 }, // Sulawesi Selatan
  '74': { lat: -3.54912, lon: 121.72796 }, // Sulawesi Tenggara
  '75': { lat: 0.71862, lon: 122.45559 }, // Gorontalo
  '76': { lat: -2.49745, lon: 119.3919 }, // Sulawesi Barat
  '81': { lat: -3.11884, lon: 129.42078 }, // Maluku
  '82': { lat: 0.63012, lon: 127.97202 }, // Maluku Utara
  '91': { lat: -2.5337, lon: 140.7181 }, // Papua (Jayapura)
  '92': { lat: -0.8615, lon: 134.0620 }, // Papua Barat (Manokwari)
  '93': { lat: -8.4991, lon: 140.4011 }, // Papua Selatan (Merauke)
  '94': { lat: -3.3667, lon: 135.4833 }, // Papua Tengah (Nabire)
  '95': { lat: -4.0956, lon: 138.9442 }, // Papua Pegunungan (Jayawijaya)
  '96': { lat: -0.8762, lon: 131.2558 }, // Papua Barat Daya (Sorong)
};

// Verified manual coordinates for regencies with historic name changes or complex geometries
const VERIFIED_REGENCY_COORDINATES = {
  '12.12': { lat: 2.3333, lon: 99.0667 }, // Kabupaten Toba (formerly Toba Samosir)
  '12.77': { lat: 1.3736, lon: 99.2731 }, // Kota Padangsidimpuan
  '31.01': { lat: -5.6122, lon: 106.5617 }, // Kabupaten Administrasi Kepulauan Seribu
  '31.71': { lat: -6.1865, lon: 106.8341 }, // Kota Administrasi Jakarta Pusat
  '31.72': { lat: -6.1384, lon: 106.8641 }, // Kota Administrasi Jakarta Utara
  '31.73': { lat: -6.1683, lon: 106.7588 }, // Kota Administrasi Jakarta Barat
  '31.74': { lat: -6.2615, lon: 106.8106 }, // Kota Administrasi Jakarta Selatan
  '31.75': { lat: -6.2250, lon: 106.9004 }, // Kota Administrasi Jakarta Timur
  '64.11': { lat: 0.0573, lon: 115.1187 },  // Kabupaten Mahakam Ulu
  '71.09': { lat: 2.4578, lon: 125.3995 },  // Kabupaten Kepulauan Siau Tagulandang Biaro (Sitaro)
  '76.01': { lat: -1.4167, lon: 119.4667 }, // Kabupaten Pasangkayu (formerly Mamuju Utara)
  '81.03': { lat: -7.5000, lon: 131.5000 }, // Kabupaten Kepulauan Tanimbar (formerly Maluku Tenggara Barat)
};

// Key prominent administrative centers, regency capitals, and commonly searched birthplaces
const KEY_ADMINISTRATIVE_CENTERS = [
  // Jawa Tengah
  {
    id: 'id-dst-3302-purwokerto',
    name: 'Purwokerto',
    displayName: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah',
    formattedCity: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah, Indonesia',
    adminLevel: 'district',
    provinceName: 'Jawa Tengah',
    provinceCode: '33',
    regencyName: 'Kabupaten Banyumas',
    regencyCode: '3302',
    districtName: 'Purwokerto',
    districtCode: '3302.24-27',
    latitude: -7.4279,
    longitude: 109.2409,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['purwokerto', 'pwt', 'kota purwokerto', 'purwokerto banyumas', 'purwokerto jawa tengah', 'banyumas purwokerto'],
    note: 'Pusat pemerintahan Kabupaten Banyumas'
  },
  {
    id: 'id-dst-3302-kec-banyumas',
    name: 'Kecamatan Banyumas',
    displayName: 'Banyumas (Kecamatan), Kabupaten Banyumas, Jawa Tengah',
    formattedCity: 'Banyumas, Kabupaten Banyumas, Jawa Tengah, Indonesia',
    adminLevel: 'district',
    provinceName: 'Jawa Tengah',
    provinceCode: '33',
    regencyName: 'Kabupaten Banyumas',
    regencyCode: '3302',
    districtName: 'Banyumas',
    districtCode: '3302.11',
    latitude: -7.5147,
    longitude: 109.2942,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['kecamatan banyumas', 'kec banyumas', 'kota tua banyumas'],
    note: 'Kecamatan Banyumas bersejarah di Kab. Banyumas'
  },

  // Kepulauan Bangka Belitung
  {
    id: 'id-dst-1901-sungailiat',
    name: 'Sungailiat',
    displayName: 'Sungailiat, Kabupaten Bangka, Kepulauan Bangka Belitung',
    formattedCity: 'Sungailiat, Kabupaten Bangka, Kepulauan Bangka Belitung, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kepulauan Bangka Belitung',
    provinceCode: '19',
    regencyName: 'Kabupaten Bangka',
    regencyCode: '1901',
    districtName: 'Sungailiat',
    districtCode: '1901.01',
    latitude: -1.8477,
    longitude: 106.1192,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['sungailiat', 'sungai liat', 'sungailiat bangka', 'ibu kota bangka'],
    note: 'Ibu kota Kabupaten Bangka'
  },
  {
    id: 'id-dst-1902-tanjungpandan',
    name: 'Tanjung Pandan',
    displayName: 'Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung',
    formattedCity: 'Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kepulauan Bangka Belitung',
    provinceCode: '19',
    regencyName: 'Kabupaten Belitung',
    regencyCode: '1902',
    districtName: 'Tanjungpandan',
    districtCode: '1902.01',
    latitude: -2.7423,
    longitude: 107.6545,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['tanjung pandan', 'tanjungpandan', 'tanjung pandan belitung', 'belitung tanjung pandan', 'ibu kota belitung'],
    note: 'Ibu kota Kabupaten Belitung'
  },
  {
    id: 'id-dst-1903-toboali',
    name: 'Toboali',
    displayName: 'Toboali, Kabupaten Bangka Selatan, Kepulauan Bangka Belitung',
    formattedCity: 'Toboali, Kabupaten Bangka Selatan, Kepulauan Bangka Belitung, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kepulauan Bangka Belitung',
    provinceCode: '19',
    regencyName: 'Kabupaten Bangka Selatan',
    regencyCode: '1903',
    districtName: 'Toboali',
    districtCode: '1903.01',
    latitude: -3.0000,
    longitude: 106.4500,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['toboali', 'toboali bangka', 'toboali bangka selatan', 'ibu kota bangka selatan'],
    note: 'Ibu kota Kabupaten Bangka Selatan'
  },
  {
    id: 'id-dst-1904-koba',
    name: 'Koba',
    displayName: 'Koba, Kabupaten Bangka Tengah, Kepulauan Bangka Belitung',
    formattedCity: 'Koba, Kabupaten Bangka Tengah, Kepulauan Bangka Belitung, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kepulauan Bangka Belitung',
    provinceCode: '19',
    regencyName: 'Kabupaten Bangka Tengah',
    regencyCode: '1904',
    districtName: 'Koba',
    districtCode: '1904.01',
    latitude: -2.4833,
    longitude: 106.4000,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['koba', 'koba bangka', 'koba bangka tengah', 'ibu kota bangka tengah'],
    note: 'Ibu kota Kabupaten Bangka Tengah'
  },
  {
    id: 'id-dst-1905-mentok',
    name: 'Mentok',
    displayName: 'Mentok (Muntok), Kabupaten Bangka Barat, Kepulauan Bangka Belitung',
    formattedCity: 'Mentok, Kabupaten Bangka Barat, Kepulauan Bangka Belitung, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kepulauan Bangka Belitung',
    provinceCode: '19',
    regencyName: 'Kabupaten Bangka Barat',
    regencyCode: '1905',
    districtName: 'Mentok',
    districtCode: '1905.01',
    latitude: -2.0667,
    longitude: 105.1667,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['mentok', 'muntok', 'mentok bangka', 'muntok bangka', 'mentok bangka barat', 'muntok bangka barat', 'ibu kota bangka barat'],
    note: 'Ibu kota Kabupaten Bangka Barat'
  },
  {
    id: 'id-dst-1906-manggar',
    name: 'Manggar',
    displayName: 'Manggar, Kabupaten Belitung Timur, Kepulauan Bangka Belitung',
    formattedCity: 'Manggar, Kabupaten Belitung Timur, Kepulauan Bangka Belitung, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kepulauan Bangka Belitung',
    provinceCode: '19',
    regencyName: 'Kabupaten Belitung Timur',
    regencyCode: '1906',
    districtName: 'Manggar',
    districtCode: '1906.01',
    latitude: -2.7833,
    longitude: 108.2833,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['manggar', 'manggar belitung', 'manggar belitung timur', 'ibu kota belitung timur', 'laskar pelangi manggar'],
    note: 'Ibu kota Kabupaten Belitung Timur'
  },

  // Key Regional Hubs / Birthplaces
  {
    id: 'id-dst-5108-singaraja',
    name: 'Singaraja',
    displayName: 'Singaraja, Kabupaten Buleleng, Bali',
    formattedCity: 'Singaraja, Kabupaten Buleleng, Bali, Indonesia',
    adminLevel: 'district',
    provinceName: 'Bali',
    provinceCode: '51',
    regencyName: 'Kabupaten Buleleng',
    regencyCode: '5108',
    districtName: 'Buleleng',
    districtCode: '5108.05',
    latitude: -8.1120,
    longitude: 115.0882,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['singaraja', 'singaraja bali', 'buleleng singaraja'],
    note: 'Ibu kota Kabupaten Buleleng'
  },
  {
    id: 'id-dst-5104-ubud',
    name: 'Ubud',
    displayName: 'Ubud, Kabupaten Gianyar, Bali',
    formattedCity: 'Ubud, Kabupaten Gianyar, Bali, Indonesia',
    adminLevel: 'district',
    provinceName: 'Bali',
    provinceCode: '51',
    regencyName: 'Kabupaten Gianyar',
    regencyCode: '5104',
    districtName: 'Ubud',
    districtCode: '5104.04',
    latitude: -8.5069,
    longitude: 115.2625,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['ubud', 'ubud bali', 'ubud gianyar'],
    note: 'Kecamatan Ubud, Gianyar'
  },
  {
    id: 'id-dst-5103-kuta',
    name: 'Kuta',
    displayName: 'Kuta, Kabupaten Badung, Bali',
    formattedCity: 'Kuta, Kabupaten Badung, Bali, Indonesia',
    adminLevel: 'district',
    provinceName: 'Bali',
    provinceCode: '51',
    regencyName: 'Kabupaten Badung',
    regencyCode: '5103',
    districtName: 'Kuta',
    districtCode: '5103.01',
    latitude: -8.7233,
    longitude: 115.1725,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['kuta', 'kuta bali', 'kuta badung'],
    note: 'Kecamatan Kuta, Badung'
  },
  {
    id: 'id-dst-5315-labuanbajo',
    name: 'Labuan Bajo',
    displayName: 'Labuan Bajo, Kabupaten Manggarai Barat, Nusa Tenggara Timur',
    formattedCity: 'Labuan Bajo, Kabupaten Manggarai Barat, Nusa Tenggara Timur, Indonesia',
    adminLevel: 'district',
    provinceName: 'Nusa Tenggara Timur',
    provinceCode: '53',
    regencyName: 'Kabupaten Manggarai Barat',
    regencyCode: '5315',
    districtName: 'Komodo',
    districtCode: '5315.01',
    latitude: -8.4964,
    longitude: 119.8877,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['labuan bajo', 'labuanbajo', 'labuan bajo ntt', 'ibu kota manggarai barat'],
    note: 'Ibu kota Kabupaten Manggarai Barat'
  },
  {
    id: 'id-dst-6202-sampit',
    name: 'Sampit',
    displayName: 'Sampit, Kabupaten Kotawaringin Timur, Kalimantan Tengah',
    formattedCity: 'Sampit, Kabupaten Kotawaringin Timur, Kalimantan Tengah, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kalimantan Tengah',
    provinceCode: '62',
    regencyName: 'Kabupaten Kotawaringin Timur',
    regencyCode: '6202',
    districtName: 'Mentawa Baru Ketapang',
    districtCode: '6202.05',
    latitude: -2.5333,
    longitude: 112.9500,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['sampit', 'sampit kalteng', 'ibu kota kotawaringin timur'],
    note: 'Ibu kota Kabupaten Kotawaringin Timur'
  },
  {
    id: 'id-dst-6201-pangkalanbun',
    name: 'Pangkalan Bun',
    displayName: 'Pangkalan Bun, Kabupaten Kotawaringin Barat, Kalimantan Tengah',
    formattedCity: 'Pangkalan Bun, Kabupaten Kotawaringin Barat, Kalimantan Tengah, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kalimantan Tengah',
    provinceCode: '62',
    regencyName: 'Kabupaten Kotawaringin Barat',
    regencyCode: '6201',
    districtName: 'Arut Selatan',
    districtCode: '6201.02',
    latitude: -2.6833,
    longitude: 111.6167,
    timezone: 'Asia/Jakarta',
    timezoneOffset: '+07:00',
    country: 'Indonesia',
    aliases: ['pangkalan bun', 'pangkalanbun', 'ibu kota kotawaringin barat'],
    note: 'Ibu kota Kabupaten Kotawaringin Barat'
  },
  {
    id: 'id-dst-6303-martapura',
    name: 'Martapura',
    displayName: 'Martapura, Kabupaten Banjar, Kalimantan Selatan',
    formattedCity: 'Martapura, Kabupaten Banjar, Kalimantan Selatan, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kalimantan Selatan',
    provinceCode: '63',
    regencyName: 'Kabupaten Banjar',
    regencyCode: '6303',
    districtName: 'Martapura',
    districtCode: '6303.05',
    latitude: -3.4167,
    longitude: 114.8500,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['martapura', 'martapura kalsel', 'martapura banjar', 'ibu kota banjar'],
    note: 'Ibu kota Kabupaten Banjar'
  },
  {
    id: 'id-dst-6402-tenggarong',
    name: 'Tenggarong',
    displayName: 'Tenggarong, Kabupaten Kutai Kartanegara, Kalimantan Timur',
    formattedCity: 'Tenggarong, Kabupaten Kutai Kartanegara, Kalimantan Timur, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kalimantan Timur',
    provinceCode: '64',
    regencyName: 'Kabupaten Kutai Kartanegara',
    regencyCode: '6402',
    districtName: 'Tenggarong',
    districtCode: '6402.06',
    latitude: -0.4167,
    longitude: 116.9833,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['tenggarong', 'tenggarong kukar', 'ibu kota kutai kartanegara'],
    note: 'Ibu kota Kabupaten Kutai Kartanegara'
  },
  {
    id: 'id-dst-6501-tanjungselor',
    name: 'Tanjung Selor',
    displayName: 'Tanjung Selor, Kabupaten Bulungan, Kalimantan Utara',
    formattedCity: 'Tanjung Selor, Kabupaten Bulungan, Kalimantan Utara, Indonesia',
    adminLevel: 'district',
    provinceName: 'Kalimantan Utara',
    provinceCode: '65',
    regencyName: 'Kabupaten Bulungan',
    regencyCode: '6501',
    districtName: 'Tanjung Selor',
    districtCode: '6501.01',
    latitude: 2.8333,
    longitude: 117.3667,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['tanjung selor', 'tanjungselor', 'ibu kota kaltara', 'ibu kota bulungan'],
    note: 'Ibu kota Provinsi Kalimantan Utara & Kab. Bulungan'
  },
  {
    id: 'id-dst-7326-rantepao',
    name: 'Rantepao',
    displayName: 'Rantepao, Kabupaten Toraja Utara, Sulawesi Selatan',
    formattedCity: 'Rantepao, Kabupaten Toraja Utara, Sulawesi Selatan, Indonesia',
    adminLevel: 'district',
    provinceName: 'Sulawesi Selatan',
    provinceCode: '73',
    regencyName: 'Kabupaten Toraja Utara',
    regencyCode: '7326',
    districtName: 'Rantepao',
    districtCode: '7326.01',
    latitude: -2.9667,
    longitude: 119.9000,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['rantepao', 'rantepao toraja', 'toraja utara rantepao', 'ibu kota toraja utara'],
    note: 'Ibu kota Kabupaten Toraja Utara'
  },
  {
    id: 'id-dst-7318-makale',
    name: 'Makale',
    displayName: 'Makale, Kabupaten Tana Toraja, Sulawesi Selatan',
    formattedCity: 'Makale, Kabupaten Tana Toraja, Sulawesi Selatan, Indonesia',
    adminLevel: 'district',
    provinceName: 'Sulawesi Selatan',
    provinceCode: '73',
    regencyName: 'Kabupaten Tana Toraja',
    regencyCode: '7318',
    districtName: 'Makale',
    districtCode: '7318.05',
    latitude: -3.1000,
    longitude: 119.8500,
    timezone: 'Asia/Makassar',
    timezoneOffset: '+08:00',
    country: 'Indonesia',
    aliases: ['makale', 'makale toraja', 'tana toraja makale', 'ibu kota tana toraja'],
    note: 'Ibu kota Kabupaten Tana Toraja'
  },
  {
    id: 'id-dst-9404-timika',
    name: 'Timika',
    displayName: 'Timika, Kabupaten Mimika, Papua Tengah',
    formattedCity: 'Timika, Kabupaten Mimika, Papua Tengah, Indonesia',
    adminLevel: 'district',
    provinceName: 'Papua Tengah',
    provinceCode: '94',
    regencyName: 'Kabupaten Mimika',
    regencyCode: '9404',
    districtName: 'Mimika Baru',
    districtCode: '9404.01',
    latitude: -4.5444,
    longitude: 136.8883,
    timezone: 'Asia/Jayapura',
    timezoneOffset: '+09:00',
    country: 'Indonesia',
    aliases: ['timika', 'timika papua', 'mimika timika', 'ibu kota mimika'],
    note: 'Pusat pemerintahan Kabupaten Mimika'
  },
  {
    id: 'id-dst-9501-wamena',
    name: 'Wamena',
    displayName: 'Wamena, Kabupaten Jayawijaya, Papua Pegunungan',
    formattedCity: 'Wamena, Kabupaten Jayawijaya, Papua Pegunungan, Indonesia',
    adminLevel: 'district',
    provinceName: 'Papua Pegunungan',
    provinceCode: '95',
    regencyName: 'Kabupaten Jayawijaya',
    regencyCode: '9501',
    districtName: 'Wamena',
    districtCode: '9501.01',
    latitude: -4.0983,
    longitude: 138.9439,
    timezone: 'Asia/Jayapura',
    timezoneOffset: '+09:00',
    country: 'Indonesia',
    aliases: ['wamena', 'wamena papua', 'ibu kota jayawijaya', 'ibu kota papua pegunungan'],
    note: 'Ibu kota Provinsi Papua Pegunungan & Kab. Jayawijaya'
  }
];

export async function buildIndonesiaLocations() {
  console.log('[BUILDER] Fetching official Kemendagri Master Wilayah SQL...');
  const sql = await (await fetch('https://raw.githubusercontent.com/cahyadsn/wilayah/master/db/wilayah.sql')).text();
  console.log('[BUILDER] Fetching coordinates dataset...');
  const yRegs = await (await fetch('https://raw.githubusercontent.com/yusufsyaifudin/wilayah-indonesia/master/data/list_of_area/regencies.json')).json();
  const yProvs = await (await fetch('https://raw.githubusercontent.com/yusufsyaifudin/wilayah-indonesia/master/data/list_of_area/provinces.json')).json();

  const lines = sql.split('\n');
  const provincesMap = new Map();
  const regenciesRaw = [];

  for (const line of lines) {
    const match = line.match(/\('([0-9.]+)',\s*'([^']+)'\)/);
    if (!match) continue;
    const [_, code, rawName] = match;
    const name = rawName.trim();
    const parts = code.split('.');
    if (parts.length === 1) {
      provincesMap.set(code, name);
    } else if (parts.length === 2) {
      regenciesRaw.push({ code, name, provCode: parts[0] });
    }
  }

  console.log(`[BUILDER] Extracted ${provincesMap.size} provinces and ${regenciesRaw.length} regencies.`);

  // Coordinate normalizer helper
  const clean = s => s.toLowerCase()
    .replace(/^(kabupaten|kota|administrasi|adm\.)\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

  const coordsMap = new Map();
  for (const r of yRegs) {
    coordsMap.set(clean(r.name), { lat: Number(r.latitude), lon: Number(r.longitude) });
    coordsMap.set(r.id, { lat: Number(r.latitude), lon: Number(r.longitude) });
  }

  // Canonical provinces list
  const canonicalProvinces = [];
  const provCodeToName = new Map();

  for (const [code, officialName] of provincesMap.entries()) {
    const tzInfo = PROVINCE_TIMEZONES[code];
    if (!tzInfo) throw new Error(`Missing timezone mapping for province code ${code}`);

    // Clean common display name (e.g. "Daerah Khusus Ibukota Jakarta" -> "DKI Jakarta")
    let displayName = officialName;
    if (code === '31') displayName = 'DKI Jakarta';
    else if (code === '34') displayName = 'DI Yogyakarta';
    else if (code === '11') displayName = 'Aceh';

    provCodeToName.set(code, displayName);

    // Verified province center coordinates
    const provCoord = VERIFIED_PROVINCE_COORDINATES[code] || (yP ? { lat: Number(yP.latitude), lon: Number(yP.longitude) } : { lat: 0, lon: 0 });

    canonicalProvinces.push({
      id: `id-prv-${code}`,
      code,
      name: displayName,
      officialName,
      displayName,
      adminLevel: 'province',
      provinceName: displayName,
      provinceCode: code,
      latitude: provCoord.lat,
      longitude: provCoord.lon,
      timezone: tzInfo.tz,
      timezoneOffset: tzInfo.offset,
      country: 'Indonesia',
      aliases: [
        displayName.toLowerCase(),
        officialName.toLowerCase(),
        `provinsi ${displayName.toLowerCase()}`,
        `provinsi ${officialName.toLowerCase()}`
      ],
      source: 'Kemendagri No 300.2.2-2138 Tahun 2025 / BPS',
      version: '1.0.0'
    });
  }

  // Canonical regencies list
  const canonicalRegencies = [];

  for (const reg of regenciesRaw) {
    const provName = provCodeToName.get(reg.provCode);
    const tzInfo = PROVINCE_TIMEZONES[reg.provCode];
    if (!provName || !tzInfo) throw new Error(`Missing province mapping for regency ${reg.code}`);

    const isCity = reg.name.startsWith('Kota');
    const adminLevel = isCity ? 'city' : 'regency';

    // Coordinate resolution
    const manual = VERIFIED_REGENCY_COORDINATES[reg.code];
    const fromName = coordsMap.get(clean(reg.name));
    const fromId = coordsMap.get(reg.code.replace('.', ''));
    const coord = manual || fromName || fromId;

    if (!coord || !Number.isFinite(coord.lat) || !Number.isFinite(coord.lon)) {
      throw new Error(`Missing coordinates for regency ${reg.code} (${reg.name})`);
    }

    // Build friendly clean name
    // e.g. "Kota Pangkal Pinang" -> "Kota Pangkalpinang", "Kabupaten Banyumas"
    let cleanOfficialName = reg.name;
    if (reg.code === '19.71') cleanOfficialName = 'Kota Pangkalpinang';

    // Build base name without prefix
    const baseName = cleanOfficialName.replace(/^(Kabupaten|Kota|Kabupaten Administrasi|Kota Administrasi)\s+/i, '');

    const displayName = `${cleanOfficialName}, ${provName}`;
    const formattedCity = `${cleanOfficialName}, ${provName}, Indonesia`;

    // Search aliases
    const aliases = new Set();
    aliases.add(cleanOfficialName.toLowerCase());
    aliases.add(baseName.toLowerCase());
    aliases.add(`${cleanOfficialName.toLowerCase()}, ${provName.toLowerCase()}`);
    aliases.add(`${baseName.toLowerCase()}, ${provName.toLowerCase()}`);
    aliases.add(`${baseName.toLowerCase()} ${provName.toLowerCase()}`);

    // Specific well-known regency aliases
    if (reg.code === '33.02') { // Banyumas
      aliases.add('banyumas');
      aliases.add('kab banyumas');
      aliases.add('kabupaten banyumas');
      aliases.add('banyumas jawa tengah');
      aliases.add('purwokerto'); // Banyumas county seat
      aliases.add('pwt');
    } else if (reg.code === '33.72') { // Kota Surakarta
      aliases.add('solo');
      aliases.add('surakarta');
      aliases.add('kota solo');
    } else if (reg.code === '34.71') { // Kota Yogyakarta
      aliases.add('jogja');
      aliases.add('jogjakarta');
      aliases.add('yogyakarta');
      aliases.add('kota jogja');
    } else if (reg.code === '73.71') { // Kota Makassar
      aliases.add('makassar');
      aliases.add('ujung pandang');
      aliases.add('ujungpandang');
    } else if (reg.code === '19.01') { // Bangka
      aliases.add('bangka');
      aliases.add('kabupaten bangka');
      aliases.add('sungailiat');
    } else if (reg.code === '19.02') { // Belitung
      aliases.add('belitung');
      aliases.add('kabupaten belitung');
      aliases.add('tanjung pandan');
      aliases.add('tanjungpandan');
    } else if (reg.code === '19.03') { // Bangka Selatan
      aliases.add('bangka selatan');
      aliases.add('toboali');
    } else if (reg.code === '19.04') { // Bangka Tengah
      aliases.add('bangka tengah');
      aliases.add('koba');
    } else if (reg.code === '19.05') { // Bangka Barat
      aliases.add('bangka barat');
      aliases.add('mentok');
      aliases.add('muntok');
    } else if (reg.code === '19.06') { // Belitung Timur
      aliases.add('belitung timur');
      aliases.add('manggar');
    } else if (reg.code === '19.71') { // Pangkalpinang
      aliases.add('pangkalpinang');
      aliases.add('pangkal pinang');
      aliases.add('kota pangkalpinang');
    } else if (reg.code === '31.75') { // Jakarta Timur
      aliases.add('jakarta timur');
      aliases.add('jaktim');
    } else if (reg.code === '31.74') { // Jakarta Selatan
      aliases.add('jakarta selatan');
      aliases.add('jaksel');
    } else if (reg.code === '31.73') { // Jakarta Barat
      aliases.add('jakarta barat');
      aliases.add('jakbar');
    } else if (reg.code === '31.72') { // Jakarta Utara
      aliases.add('jakarta utara');
      aliases.add('jakut');
    } else if (reg.code === '31.71') { // Jakarta Pusat
      aliases.add('jakarta pusat');
      aliases.add('jakpus');
    }

    canonicalRegencies.push({
      id: `id-reg-${reg.code.replace('.', '')}`,
      name: cleanOfficialName,
      displayName,
      formattedCity,
      adminLevel,
      provinceName: provName,
      provinceCode: reg.provCode,
      regencyName: cleanOfficialName,
      regencyCode: reg.code,
      districtName: null,
      districtCode: null,
      latitude: Number(coord.lat.toFixed(6)),
      longitude: Number(coord.lon.toFixed(6)),
      timezone: tzInfo.tz,
      timezoneOffset: tzInfo.offset,
      country: 'Indonesia',
      aliases: [...aliases],
      source: 'Kemendagri No 300.2.2-2138 Tahun 2025 / BPS',
      version: '1.0.0'
    });
  }

  // Combine regencies + key administrative centers
  const allLocations = [...canonicalRegencies, ...KEY_ADMINISTRATIVE_CENTERS];

  // Validation integrity checks
  console.log(`[BUILDER] Generated ${canonicalProvinces.length} provinces.`);
  console.log(`[BUILDER] Generated ${canonicalRegencies.length} regencies/cities.`);
  console.log(`[BUILDER] Total searchable locations: ${allLocations.length}.`);

  // Verify mandatory regression cases
  const banyumas = allLocations.find(l => l.name === 'Kabupaten Banyumas');
  if (!banyumas || banyumas.provinceName !== 'Jawa Tengah') {
    throw new Error('REGRESSION FAILURE: Banyumas is not mapped to Jawa Tengah!');
  }

  const purwokerto = allLocations.find(l => l.name === 'Purwokerto');
  if (!purwokerto || purwokerto.regencyName !== 'Kabupaten Banyumas' || purwokerto.provinceName !== 'Jawa Tengah') {
    throw new Error('REGRESSION FAILURE: Purwokerto is not mapped to Kab. Banyumas, Jawa Tengah!');
  }

  const koba = allLocations.find(l => l.name === 'Koba');
  if (!koba || koba.provinceName !== 'Kepulauan Bangka Belitung' || koba.regencyName !== 'Kabupaten Bangka Tengah') {
    throw new Error('REGRESSION FAILURE: Koba is not mapped to Kab. Bangka Tengah!');
  }

  const tjPandan = allLocations.find(l => l.name === 'Tanjung Pandan');
  if (!tjPandan || tjPandan.provinceName !== 'Kepulauan Bangka Belitung' || tjPandan.regencyName !== 'Kabupaten Belitung') {
    throw new Error('REGRESSION FAILURE: Tanjung Pandan is not mapped to Kab. Belitung!');
  }

  const pangkalpinang = allLocations.find(l => l.name === 'Kota Pangkalpinang');
  if (!pangkalpinang || pangkalpinang.provinceName !== 'Kepulauan Bangka Belitung') {
    throw new Error('REGRESSION FAILURE: Pangkalpinang is not mapped to Kepulauan Bangka Belitung!');
  }

  // Write database files
  const libLocationsDir = path.join(rootDir, 'lib', 'locations');
  if (!fs.existsSync(libLocationsDir)) {
    fs.mkdirSync(libLocationsDir, { recursive: true });
  }

  const assetsDataDir = path.join(rootDir, 'assets', 'data');
  if (!fs.existsSync(assetsDataDir)) {
    fs.mkdirSync(assetsDataDir, { recursive: true });
  }

  const payload = {
    metadata: {
      generatedAt: new Date().toISOString(),
      datasetVersion: '1.0.0',
      officialReference: 'Kemendagri (Kepmendagri No 300.2.2-2138 Tahun 2025) / BPS Master Wilayah 2024-2025',
      referenceSource: 'Kemendagri (Kepmendagri No 300.2.2-2138 Tahun 2025) / BPS Master Wilayah 2024-2025',
      provinceCount: canonicalProvinces.length,
      regencyCount: canonicalRegencies.length,
      totalProvinces: canonicalProvinces.length,
      totalRegencies: canonicalRegencies.length,
      totalLocations: allLocations.length,
      timezones: ['Asia/Jakarta', 'Asia/Makassar', 'Asia/Jayapura']
    },
    provinces: canonicalProvinces,
    locations: allLocations
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const minifiedStr = JSON.stringify(payload);

  fs.writeFileSync(path.join(libLocationsDir, 'indonesia-locations.json'), jsonStr, 'utf8');
  fs.writeFileSync(path.join(assetsDataDir, 'indonesia-locations.json'), minifiedStr, 'utf8');

  console.log(`[BUILDER] SUCCESS! Written to lib/locations/indonesia-locations.json (${Math.round(jsonStr.length / 1024)} KB)`);
  console.log(`[BUILDER] SUCCESS! Written to assets/data/indonesia-locations.json (${Math.round(minifiedStr.length / 1024)} KB)`);
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildIndonesiaLocations().catch(err => {
    console.error('[BUILDER ERROR]:', err);
    process.exit(1);
  });
}
