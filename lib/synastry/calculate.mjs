import * as Astronomy from "astronomy-engine";
import { isValidIanaTimeZone, localDateTimeToUtc } from "../timezone.mjs";
import { resolveLocationByName } from "../locations/location-service.mjs";

export const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const SIGN_NAMES_ID = {
  Aries: "Aries", Taurus: "Taurus", Gemini: "Gemini", Cancer: "Cancer",
  Leo: "Leo", Virgo: "Virgo", Libra: "Libra", Scorpio: "Scorpio",
  Sagittarius: "Sagitarius", Capricorn: "Kaprikornus", Aquarius: "Akuarius", Pisces: "Pises"
};

export const SIGN_META = {
  Aries: { element: "Fire", modality: "Cardinal", elementId: "Api", modalityId: "Kardinal" },
  Taurus: { element: "Earth", modality: "Fixed", elementId: "Tanah", modalityId: "Tetap" },
  Gemini: { element: "Air", modality: "Mutable", elementId: "Udara", modalityId: "Dinamis" },
  Cancer: { element: "Water", modality: "Cardinal", elementId: "Air", modalityId: "Kardinal" },
  Leo: { element: "Fire", modality: "Fixed", elementId: "Api", modalityId: "Tetap" },
  Virgo: { element: "Earth", modality: "Mutable", elementId: "Tanah", modalityId: "Dinamis" },
  Libra: { element: "Air", modality: "Cardinal", elementId: "Udara", modalityId: "Kardinal" },
  Scorpio: { element: "Water", modality: "Fixed", elementId: "Air", modalityId: "Tetap" },
  Sagittarius: { element: "Fire", modality: "Mutable", elementId: "Api", modalityId: "Dinamis" },
  Capricorn: { element: "Earth", modality: "Cardinal", elementId: "Tanah", modalityId: "Kardinal" },
  Aquarius: { element: "Air", modality: "Fixed", elementId: "Udara", modalityId: "Tetap" },
  Pisces: { element: "Water", modality: "Mutable", elementId: "Air", modalityId: "Dinamis" },
};

export const PLANET_ORDER = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"
];

export const PLANET_NAMES_ID = {
  Sun: "Matahari", Moon: "Bulan", Mercury: "Merkurius", Venus: "Venus", Mars: "Mars",
  Jupiter: "Yupiter", Saturn: "Saturnus", Uranus: "Uranus", Neptune: "Neptunus", Pluto: "Pluto",
  Ascendant: "Titik Terbit (Ascendant)", Midheaven: "Puncak Langit (MC)"
};

export const PLANET_SHORT = {
  Sun: "Su", Moon: "Mo", Mercury: "Me", Venus: "Ve", Mars: "Ma",
  Jupiter: "Ju", Saturn: "Sa", Uranus: "Ur", Neptune: "Ne", Pluto: "Pl",
  Ascendant: "ASC", Midheaven: "MC"
};

export const ASPECT_CONFIG = {
  Conjunction: { angle: 0, orb: 8, indonesianName: "Konjungsi", symbol: "☌", nature: "Penyatuan Energi" },
  Opposition: { angle: 180, orb: 8, indonesianName: "Oposisi", symbol: "☍", nature: "Tarik-Menarik & Keseimbangan" },
  Trine: { angle: 120, orb: 8, indonesianName: "Trine", symbol: "△", nature: "Aliran Harmonis & Suportif" },
  Square: { angle: 90, orb: 7, indonesianName: "Square", symbol: "□", nature: "Ketegangan & Pertumbuhan" },
  Sextile: { angle: 60, orb: 5, indonesianName: "Sextile", symbol: "⚹", nature: "Peluang & Sinergi" },
};

export function normalizeLongitude(lon) {
  return ((lon % 360) + 360) % 360;
}

export function angularDistance(a, b) {
  const diff = Math.abs(normalizeLongitude(a) - normalizeLongitude(b));
  return diff > 180 ? 360 - diff : diff;
}

export function signFromLongitude(lon) {
  return SIGNS[Math.floor(normalizeLongitude(lon) / 30)];
}

export function degreeInSign(lon) {
  return Number((normalizeLongitude(lon) % 30).toFixed(4));
}

export function minuteInSign(lon) {
  return Math.floor((degreeInSign(lon) % 1) * 60);
}

export function formatDegreeMinute(lon) {
  const norm = normalizeLongitude(lon);
  const sign = signFromLongitude(norm);
  const deg = Math.floor(norm % 30);
  const min = Math.floor(((norm % 30) - deg) * 60);
  return `${deg}° ${SIGN_NAMES_ID[sign] || sign} ${String(min).padStart(2, "0")}′`;
}

export function formatOrb(orbValue) {
  const deg = Math.floor(orbValue);
  const min = Math.round((orbValue - deg) * 60);
  return `${deg}°${String(min).padStart(2, "0")}′`;
}

function parseOffset(timezone) {
  const match = /^([+-])(\d{1,2}):?(\d{2})?$/.exec(String(timezone || "").trim());
  if (!match) throw new Error("Timezone must be UTC offset (+07:00) or valid IANA timezone.");
  return (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] || 0));
}

export function toUtcDate(birthDate, birthTime, timezone = "+07:00") {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthDate || "").trim());
  if (!dateMatch) throw new Error("Format tanggal lahir harus YYYY-MM-DD.");
  const timeStr = String(birthTime || "12:00").trim();
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(timeStr);
  const [year, month, day] = dateMatch.slice(1).map(Number);
  const hour = timeMatch ? Number(timeMatch[1]) : 12;
  const minute = timeMatch ? Number(timeMatch[2]) : 0;

  const tzStr = String(timezone || "").trim();
  if (tzStr && isValidIanaTimeZone && isValidIanaTimeZone(tzStr)) {
    const res = localDateTimeToUtc({ birthDate, birthTime: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`, timezone: tzStr });
    if (res.ok) return res.utc;
  }

  const offsetMatch = /^([+-])(\d{1,2}):?(\d{2})?$/.exec(tzStr);
  const offsetMins = offsetMatch
    ? (offsetMatch[1] === "-" ? -1 : 1) * (Number(offsetMatch[2]) * 60 + Number(offsetMatch[3] || 0))
    : parseOffset(tzStr || "+07:00");

  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute) - offsetMins * 60_000);
  if (isNaN(utc.getTime())) throw new Error("Tanggal atau jam lahir tidak valid.");
  return utc;
}

export function meanNorthNode(date) {
  const days = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86_400_000;
  return normalizeLongitude(125.04452 - 0.0529538083 * days);
}

export function approximateChiron(date) {
  const days = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86_400_000;
  return normalizeLongitude(251.35 + days * 0.019777);
}

export function longitudeFor(name, date, astro = Astronomy) {
  if (name === "Sun") return astro.SunPosition(date).elon;
  if (name === "Moon") return astro.EclipticGeoMoon(date).lon;
  if (name === "NorthNode") return meanNorthNode(date);
  if (name === "SouthNode") return normalizeLongitude(meanNorthNode(date) + 180);
  if (name === "Chiron") return approximateChiron(date);
  return astro.Ecliptic(astro.GeoVector(astro.Body[name], date, true)).elon;
}

function radians(deg) { return (deg * Math.PI) / 180; }
function degrees(rad) { return (rad * 180) / Math.PI; }

export function calculateAngles(date, latitude, longitude, astro = Astronomy) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const armc = normalizeLongitude((astro.SiderealTime(date) + longitude / 15) * 15);
  const obliquity = astro.e_tilt(astro.MakeTime(date)).tobl;
  const armcRad = radians(armc);
  const obRad = radians(obliquity);
  const latRad = radians(latitude);

  const ascendantLongitude = normalizeLongitude(degrees(Math.atan2(
    -Math.cos(armcRad),
    Math.sin(armcRad) * Math.cos(obRad) + Math.tan(latRad) * Math.sin(obRad)
  )) + 180);

  const midheavenLongitude = normalizeLongitude(degrees(Math.atan2(
    Math.sin(armcRad),
    Math.cos(armcRad) * Math.cos(obRad)
  )));

  return {
    ascendantLongitude: Number(ascendantLongitude.toFixed(4)),
    midheavenLongitude: Number(midheavenLongitude.toFixed(4))
  };
}

export function calculatePersonNatal(input, astro = Astronomy) {
  const name = String(input.name || "Partner").trim();
  const birthDate = String(input.birthDate || "").trim();
  const isTimeUnknown = Boolean(input.isTimeUnknown || !input.birthTime);
  const birthTime = isTimeUnknown ? "12:00" : String(input.birthTime).trim();
  let timezone = input.timezone;
  let latitude = input.latitude;
  let longitude = input.longitude;
  let birthCity = input.birthCity || "";

  // Attempt resolving city if coordinates missing
  if ((!Number.isFinite(latitude) || !Number.isFinite(longitude)) && birthCity) {
    const resolved = resolveLocationByName(birthCity);
    if (resolved) {
      latitude = resolved.latitude;
      longitude = resolved.longitude;
      timezone = timezone || resolved.timezone;
      birthCity = resolved.formattedCity || resolved.displayName || birthCity;
    }
  }

  // Fallback coordinates (Jakarta) if none available
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    latitude = -6.2088;
    longitude = 106.8456;
    timezone = timezone || "+07:00";
    if (!birthCity) birthCity = "Jakarta (perkiraan lokasi)";
  } else {
    timezone = timezone || "+07:00";
  }

  const date = toUtcDate(birthDate, birthTime, timezone);
  const yesterday = new Date(date.getTime() - 86_400_000);

  const planets = {};
  for (const pName of PLANET_ORDER) {
    const lon = normalizeLongitude(longitudeFor(pName, date, astro));
    const lonYest = normalizeLongitude(longitudeFor(pName, yesterday, astro));
    let motion = lon - lonYest;
    if (motion > 180) motion -= 360;
    if (motion < -180) motion += 360;
    const retrograde = !["Sun", "Moon"].includes(pName) && motion < 0;
    const sign = signFromLongitude(lon);
    const deg = degreeInSign(lon);
    const min = minuteInSign(lon);

    planets[pName] = {
      name: pName,
      indonesianName: PLANET_NAMES_ID[pName] || pName,
      short: PLANET_SHORT[pName] || pName.substring(0, 2),
      longitude: Number(lon.toFixed(4)),
      sign,
      signId: SIGN_NAMES_ID[sign] || sign,
      degree: deg,
      minute: min,
      formatted: formatDegreeMinute(lon),
      retrograde
    };
  }

  // Angles only if exact time is known
  let angles = null;
  if (!isTimeUnknown) {
    const rawAngles = calculateAngles(date, latitude, longitude, astro);
    if (rawAngles) {
      const ascSign = signFromLongitude(rawAngles.ascendantLongitude);
      const mcSign = signFromLongitude(rawAngles.midheavenLongitude);
      angles = {
        ascendant: {
          name: "Ascendant",
          indonesianName: PLANET_NAMES_ID.Ascendant,
          short: "ASC",
          longitude: rawAngles.ascendantLongitude,
          sign: ascSign,
          signId: SIGN_NAMES_ID[ascSign] || ascSign,
          formatted: formatDegreeMinute(rawAngles.ascendantLongitude)
        },
        midheaven: {
          name: "Midheaven",
          indonesianName: PLANET_NAMES_ID.Midheaven,
          short: "MC",
          longitude: rawAngles.midheavenLongitude,
          sign: mcSign,
          signId: SIGN_NAMES_ID[mcSign] || mcSign,
          formatted: formatDegreeMinute(rawAngles.midheavenLongitude)
        }
      };
    }
  }

  // Calculate Element & Modality balance
  const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modalities = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  const weights = { Sun: 3, Moon: 3, Mercury: 2, Venus: 2, Mars: 2, Jupiter: 1.5, Saturn: 1.5, Uranus: 1, Neptune: 1, Pluto: 1 };

  for (const [pName, pData] of Object.entries(planets)) {
    const meta = SIGN_META[pData.sign];
    if (meta) {
      const w = weights[pName] || 1;
      elements[meta.element] += w;
      modalities[meta.modality] += w;
    }
  }

  const dominantElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0];
  const dominantModality = Object.entries(modalities).sort((a, b) => b[1] - a[1])[0][0];

  return {
    input: {
      name,
      birthDate,
      birthTime,
      isTimeUnknown,
      birthCity,
      latitude,
      longitude,
      timezone
    },
    isTimeKnown: !isTimeUnknown,
    timePrecisionNote: isTimeUnknown
      ? "Jam lahir tidak diketahui: posisi planet dihitung pada pukul 12:00 waktu lokal. Posisi Bulan memiliki toleransi sekitar ±6°. Posisi Ascendant dan rumah astrologi tidak disertakan."
      : "Data kelahiran lengkap dan waktu presisi terverifikasi.",
    sunSign: planets.Sun.sign,
    sunSignId: planets.Sun.signId,
    moonSign: planets.Moon.sign,
    moonSignId: planets.Moon.signId,
    risingSign: angles ? angles.ascendant.sign : null,
    risingSignId: angles ? angles.ascendant.signId : null,
    midheavenSign: angles ? angles.midheaven.sign : null,
    planets,
    angles,
    balances: {
      elements,
      modalities,
      dominantElement,
      dominantModality,
      dominantElementId: SIGN_META[planets.Sun.sign]?.elementId || dominantElement,
      dominantModalityId: SIGN_META[planets.Sun.sign]?.modalityId || dominantModality
    }
  };
}

export function detectSynastryAspect(lonA, lonB, planetA, planetB) {
  const dist = angularDistance(lonA, lonB);
  for (const [type, cfg] of Object.entries(ASPECT_CONFIG)) {
    let maxOrb = cfg.orb;
    // Allow +1 degree orb if Sun or Moon is involved
    if (["Sun", "Moon"].includes(planetA) || ["Sun", "Moon"].includes(planetB)) {
      maxOrb += 1;
    }
    const orb = Math.abs(dist - cfg.angle);
    if (orb <= maxOrb) {
      return {
        type,
        angle: cfg.angle,
        indonesianName: cfg.indonesianName,
        symbol: cfg.symbol,
        nature: cfg.nature,
        orb: Number(orb.toFixed(2)),
        exactDistance: Number(dist.toFixed(2))
      };
    }
  }
  return null;
}

export function calculateSynastryAspects(planetsA, planetsB) {
  const aspects = [];
  const listA = Object.values(planetsA);
  const listB = Object.values(planetsB);

  for (const pA of listA) {
    for (const pB of listB) {
      const match = detectSynastryAspect(pA.longitude, pB.longitude, pA.name, pB.name);
      if (match) {
        aspects.push({
          planetA: pA.name,
          planetAIndo: pA.indonesianName,
          planetALon: pA.longitude,
          planetASign: pA.signId,
          planetB: pB.name,
          planetBIndo: pB.indonesianName,
          planetBLon: pB.longitude,
          planetBSign: pB.signId,
          type: match.type,
          indonesianName: match.indonesianName,
          symbol: match.symbol,
          nature: match.nature,
          angle: match.angle,
          orb: match.orb,
          formattedOrb: formatOrb(match.orb)
        });
      }
    }
  }

  // Sort by tightness of orb (most exact aspects first)
  aspects.sort((a, b) => a.orb - b.orb);
  return aspects;
}

// Astrological interpretations generator for relationship themes
export function getAspectInterpretation(aspect, nameA = "Pasangan 1", nameB = "Pasangan 2") {
  const { planetA, planetB, type } = aspect;
  const isHarmonious = ["Trine", "Sextile"].includes(type) || (type === "Conjunction" && !["Saturn", "Pluto", "Mars"].includes(planetA) && !["Saturn", "Pluto", "Mars"].includes(planetB));
  const isTension = ["Square", "Opposition"].includes(type);

  // Group pairs neutrally
  const pairKey = [planetA, planetB].sort().join("-");

  const interpretations = {
    "Moon-Sun": {
      category: "emotional",
      categoryTitle: "Koneksi Jiwa & Emosi Dasar",
      title: `${type === "Conjunction" ? "Penyatuan Jiwa" : isHarmonious ? "Resonansi Jiwa Alami" : "Dinamika Penyesuaian Batin"} (Matahari & Bulan)`,
      summary: isHarmonious
        ? `Kehadiran ${nameA} dan ${nameB} saling memberi rasa aman batin yang alami. Kebutuhan emosional salah satu pihak secara spontan direspon dan dihargai oleh tujuan hidup pasangan.`
        : `Terdapat daya tarik batin yang sangat kuat, namun ritme kebutuhan pribadi dan cara merespons emosi menuntut kesabaran serta saling mendengarkan secara jernih tanpa prasangka.`
    },
    "Moon-Moon": {
      category: "emotional",
      categoryTitle: "Kenyamanan Ruang Domestik & Naluri",
      title: `${isHarmonious ? "Harmoni Naluri & Empati" : "Perbedaan Bahasa Emosi"} (Bulan & Bulan)`,
      summary: isHarmonious
        ? `Kalian berdua memiliki pemahaman suasana hati yang sangat intuitif. Di ruang privat, kalian mudah merasa seperti "di rumah sendiri" saat bersama.`
        : `Cara kalian memproses perasaan dan mencari rasa aman berbeda. Menghargai cara menenangkan diri masing-masing adalah kunci kedamaian jangka panjang.`
    },
    "Moon-Venus": {
      category: "emotional",
      categoryTitle: "Kelembutan & Kasih Sayang",
      title: `${isHarmonious ? "Kehangatan Cinta & Kelembutan" : "Penyesuaian Bahasa Cinta"} (Bulan & Venus)`,
      summary: isHarmonious
        ? `Kombinasi cinta yang sangat manis, hangat, dan menenangkan. Perhatian-perhatian kecil dihargai dan dirawat dengan penuh ketulusan.`
        : `Kebutuhan rasa aman emosional dan cara mengekspresikan asmara kadang memerlukan penyesuaian agar tidak terjadi salah tafsir atas perhatian pasangan.`
    },
    "Mercury-Sun": {
      category: "communication",
      categoryTitle: "Komunikasi & Pola Pikir",
      title: `${isHarmonious ? "Aliran Ide & Pemahaman Spontan" : "Klarifikasi Sudut Pandang"} (Matahari & Merkurius)`,
      summary: isHarmonious
        ? `Obrolan terasa mengalir tanpa beban. ${nameA} dan ${nameB} mudah memahami gagasan, niat, dan arah pembicaraan satu sama lain.`
        : `Terkadang persepsi dan cara berbicara terasa berbeda. Berikan waktu jeda sebelum menyimpulkan maksud pasangan.`
    },
    "Mercury-Mercury": {
      category: "communication",
      categoryTitle: "Frekuensi Intelektual",
      title: `${isHarmonious ? "Satu Gelombang Pikiran" : "Gaya Komunikasi yang Beragam"} (Merkurius & Merkurius)`,
      summary: isHarmonious
        ? `Kalian memiliki ritme percakapan yang setara dan menyenangkan. Diskusi sehari-hari maupun pertukaran wawasan baru terasa memuaskan rasa ingin tahu.`
        : `Cara kalian menyusun logika dan mengambil keputusan memiliki corak berbeda. Perbedaan ini memperkaya alternatif solusi jika dikomunikasikan secara tenang.`
    },
    "Mercury-Moon": {
      category: "communication",
      categoryTitle: "Dialog Hati ke Hati",
      title: `${isHarmonious ? "Kepekaan Mendengar & Berbicara" : "Keseimbangan Nalar dan Rasa"} (Merkurius & Bulan)`,
      summary: isHarmonious
        ? `Salah satu pihak mampu menamai perasaan dengan kata-kata yang menenangkan, sementara yang lain merasa didengar seutuhnya.`
        : `Sering terjadi situasi di mana salah satu berbicara dengan logika murni, sedangkan yang lain merespons dengan rasa. Dengarkan sebelum menganalisis.`
    },
    "Mars-Venus": {
      category: "attraction",
      categoryTitle: "Romantika & Daya Tarik",
      title: `${isHarmonious ? "Percikan Asmara & Magnetisme Romantis" : "Gairah Intens & Dinamika Emosi"} (Venus & Mars)`,
      summary: isHarmonious
        ? `Aspek klasik daya tarik timbal balik. Terdapat percikan romansa, kehangatan fisik, dan antusiasme asmara yang saling menyalakan daya hidup.`
        : `Daya tariknya sangat kuat dan menggugah, namun dapat memicu ego jika salah satu merasa diabaikan. Salurkan energi ini untuk kreasi dan keintiman sehat.`
    },
    "Sun-Venus": {
      category: "attraction",
      categoryTitle: "Apresiasi & Kekaguman",
      title: `${isHarmonious ? "Rasa Kagum & Kasih Tulus" : "Penyelarasan Nilai Kebahagiaan"} (Matahari & Venus)`,
      summary: isHarmonious
        ? `Kalian saling menyukai kehadiran masing-masing. Ada rasa bangga dan apresiasi yang tulus terhadap karakter serta pesona pasangan.`
        : `Ekspektasi tentang romantisme atau prioritas kenyamanan perlu diselaraskan agar tidak menuntut pembuktian yang berlebihan.`
    },
    "Mars-Mars": {
      category: "attraction",
      categoryTitle: "Energi Tindakan & Inisiatif",
      title: `${isHarmonious ? "Sinergi Aksi & Kerjasama Dinamis" : "Penyelarasan Tempo Bertindak"} (Mars & Mars)`,
      summary: isHarmonious
        ? `Kalian memiliki dorongan bertindak yang seirama. Rencana bersama mudah dieksekusi tanpa saling menahan langkah.`
        : `Terkadang muncul kompetisi halus atau gesekan saat menentukan arah. Belajarlah berbagi kepemimpinan dalam berbagai urusan.`
    },
    "Jupiter-Sun": {
      category: "growth",
      categoryTitle: "Pertumbuhan & Optimisme",
      title: `${isHarmonious ? "Dukungan Moral & Wawasan Luas" : "Pengelolaan Ekspektasi Bersama"} (Matahari & Yupiter)`,
      summary: isHarmonious
        ? `Hubungan ini membawa banyak optimisme, tawa, dan rasa syukur. Kehadiran pasangan memperluas sudut pandang hidup dan memupuk harapan baik.`
        : `Antusiasme hubungan sangat besar, namun pastikan janji dan komitmen tetap berpijak pada kemampuan nyata.`
    },
    "Jupiter-Moon": {
      category: "growth",
      categoryTitle: "Penerimaan Emosional",
      title: `${isHarmonious ? "Keluasan Batin & Kemurahan Hati" : "Ruang Kebebasan Emosi"} (Bulan & Yupiter)`,
      summary: isHarmonious
        ? `Kalian mudah saling memaafkan dan melihat kebaikan di balik kerapuhan pasangan. Suasana batin menjadi riang dan saling menenangkan.`
        : `Hindari mengabaikan masalah emosional kecil dengan dalih selalu positif. Tetap sediakan ruang untuk kejujuran rasa apa adanya.`
    },
    "Jupiter-Venus": {
      category: "growth",
      categoryTitle: "Keberlimpahan Cinta & Gaya Hidup",
      title: `${isHarmonious ? "Keberkahan & Kebahagiaan Berbagi" : "Keseimbangan Menikmati Hidup"} (Venus & Yupiter)`,
      summary: isHarmonious
        ? `Saling memanjakan dengan kebaikan, apresiasi, dan pengalaman yang memperkaya batin. Hubungan terasa murah hati dan menyenangkan.`
        : `Jaga batas finansial dan kesepakatan gaya hidup agar rasa ingin menikmati hidup berdua tetap terukur dan seimbang.`
    },
    "Saturn-Sun": {
      category: "challenge",
      categoryTitle: "Komitmen & Pendewasaan",
      title: `${isHarmonious ? "Fondasi Kokoh & Kesetiaan Nyata" : "Ujian Tanggung Jawab & Ekspektasi"} (Matahari & Saturnus)`,
      summary: isHarmonious
        ? `Ikatan ini dibangun di atas rasa tanggung jawab yang matang. Saling menghormati batas dan bersedia berkomitmen jangka panjang.`
        : `Kadang terasa ada beban tuntutan atau kritik yang kaku. Ubah tekanan menjadi apresiasi atas setiap proses perbaikan bertahap.`
    },
    "Saturn-Moon": {
      category: "challenge",
      categoryTitle: "Keamanan Batin & Batasan",
      title: `${isHarmonious ? "Kesetiaan Melindungi & Kestabilan" : "Kepekaan Kerentanan Emosional"} (Bulan & Saturnus)`,
      summary: isHarmonious
        ? `Kehadiran pasangan menjadi jangkar penenang saat menghadapi badai hidup. Kesetiaan dibuktikan melalui tindakan konsisten, bukan sekadar kata.`
        : `Hati-hati terhadap sikap dingin atau menutup diri saat terluka. Kerentanan emosional membutuhkan rasa aman agar mau terbuka kembali.`
    },
    "Saturn-Venus": {
      category: "challenge",
      categoryTitle: "Komitmen Relasi Jangka Panjang",
      title: `${isHarmonious ? "Cinta yang Teruji Waktu" : "Ketakutan Ditolak atau Dingin"} (Venus & Saturnus)`,
      summary: isHarmonious
        ? `Cinta yang tenang, dapat diandalkan, dan berakar pada dedikasi nyata. Tidak terburu-buru, namun makin indah seiring bertambahnya usia relasi.`
        : `Jangan biarkan rutinitas dan rasa takut membuat hubungan kehilangan kehangatan ekspresi kasih sayang harian.`
    },
    "Pluto-Venus": {
      category: "challenge",
      categoryTitle: "Transformasi Kedalaman Rasa",
      title: `${isHarmonious ? "Kedalaman Cinta yang Transformatif" : "Isu Kontrol & Intensitas Rasa"} (Venus & Pluto)`,
      summary: isHarmonious
        ? `Hubungan ini membuka dimensi cinta yang sangat mendalam dan autentik. Kalian belajar melepaskan kepura-puraan demi kedekatan jiwa murni.`
        : `Hindari dorongan mendominasi atau kecemburuan yang tidak berdasar. Kepercayaan adalah fondasi paling esensial dalam ikatan seintens ini.`
    },
    "Uranus-Venus": {
      category: "growth",
      categoryTitle: "Kebebasan & Kesegaran Cinta",
      title: `${isHarmonious ? "Koneksi Unik & Menyenangkan" : "Penyelarasan Ritme Jarak & Dekat"} (Venus & Uranus)`,
      summary: isHarmonious
        ? `Hubungan yang bebas dari kebosanan. Masing-masing merasa leluasa menjadi diri sendiri tanpa kehilangan rasa cinta yang segar.`
        : `Terkadang salah satu membutuhkan ruang sendiri sementara yang lain menginginkan kedekatan. Hormati ritme jeda tanpa merasa ditinggalkan.`
    },
    "Neptune-Venus": {
      category: "growth",
      categoryTitle: "Romantisme Spiritual & Kelembutan",
      title: `${isHarmonious ? "Cinta Puitis & Empati Tanpa Batas" : "Kejelasan Realitas Asmara"} (Venus & Neptunus)`,
      summary: isHarmonious
        ? `Ada sentuhan magis dan kasih tanpa pamrih dalam relasi ini. Saling melihat keindahan jiwa dan terhubung dalam dimensi spiritual yang lembut.`
        : `Cintailah manusia nyatanya, bukan sekadar bayangan ideal yang kalian bangun di kepala. Kejelasan komunikasi mencegah kekecewaan.`
    }
  };

  if (interpretations[pairKey]) {
    return interpretations[pairKey];
  }

  // Fallback for other interplanetary aspect pairs
  return {
    category: isHarmonious ? "growth" : "challenge",
    categoryTitle: isHarmonious ? "Dinamika Suportif" : "Ruang Pendewasaan",
    title: `${aspect.nature} (${PLANET_NAMES_ID[planetA] || planetA} & ${PLANET_NAMES_ID[planetB] || planetB})`,
    summary: isHarmonious
      ? `Interaksi antara ${PLANET_NAMES_ID[planetA] || planetA} milik ${nameA} dan ${PLANET_NAMES_ID[planetB] || planetB} milik ${nameB} menghadirkan sinergi yang saling memperkuat pemahaman dan langkah hidup bersama.`
      : `Interaksi antara ${PLANET_NAMES_ID[planetA] || planetA} dan ${PLANET_NAMES_ID[planetB] || planetB} menghadirkan dinamika yang menantang namun kaya akan pelajaran kedewasaan emosional dan komunikasi terbuka.`
  };
}

export function synthesizeRelationship(personA, personB, aspects) {
  const elemA = personA.balances.dominantElement;
  const elemB = personB.balances.dominantElement;

  const elementSynergies = {
    "Fire-Fire": "Dua jiwa yang penuh gairah, dinamis, dan saling memicu antusiasme. Perlu menjaga agar api tidak saling membakar saat ego meninggi.",
    "Fire-Air": "Kombinasi yang saling menginspirasi: udara meniupkan ide segar sementara api memberi dorongan aksi yang bersemangat.",
    "Fire-Earth": "Penyatuan antara visi dinamis dan pijakan praktis. Tanah memberi wadah nyata bagi api, sementara api memberi kehangatan bagi tanah.",
    "Fire-Water": "Hubungan yang kaya akan intensitas emosi dan semangat hidup. Membutuhkan kepekaan agar air tidak memadamkan api, dan api tidak mendidihkan air.",
    "Earth-Earth": "Fondasi yang sangat kokoh, stabil, loyal, dan berorientasi pada keamanan masa depan. Tambahkan spontanitas agar tidak monoton.",
    "Earth-Air": "Sinergi antara nalar konseptual dan realitas praktis. Keduanya saling melengkapi dalam merancang strategi hidup yang solid.",
    "Earth-Water": "Kombinasi yang subur, merawat, dan saling menenangkan. Air memberi kelembutan emosi, sementara tanah memberi rasa aman yang nyata.",
    "Air-Air": "Koneksi intelektual yang sangat kaya. Pembicaraan tak pernah habis dan kalian menjadi sahabat bertukar wawasan terbaik satu sama lain.",
    "Air-Water": "Pertemuan antara kedalaman rasa dan kejernihan pikiran. Perlu jembatan komunikasi agar logika dan intuisi saling menghargai.",
    "Water-Water": "Ikatan emosional dan spiritual yang sangat dalam. Saling memahami tanpa kata, namun perlu batasan sehat agar tidak tenggelam dalam drama."
  };

  const pairKey = [elemA, elemB].sort().join("-");
  const elementSummary = elementSynergies[pairKey] || "Kombinasi energi yang saling melengkapi dan memberi warna bagi pertumbuhan relasi.";

  // Count aspect types
  let harmoniousCount = 0;
  let dynamicCount = 0;
  for (const a of aspects) {
    if (["Trine", "Sextile"].includes(a.type)) harmoniousCount++;
    if (["Square", "Opposition"].includes(a.type)) dynamicCount++;
    if (a.type === "Conjunction") {
      if (["Saturn", "Pluto", "Mars"].includes(a.planetA) || ["Saturn", "Pluto", "Mars"].includes(a.planetB)) {
        dynamicCount++;
      } else {
        harmoniousCount++;
      }
    }
  }

  const totalEvaluated = harmoniousCount + dynamicCount;
  const harmonyPercent = totalEvaluated > 0 ? Math.round((harmoniousCount / totalEvaluated) * 100) : 50;

  return {
    elementSynergy: {
      partnerAElement: personA.balances.dominantElementId,
      partnerBElement: personB.balances.dominantElementId,
      description: elementSummary
    },
    aspectMetrics: {
      harmoniousAspects: harmoniousCount,
      dynamicAspects: dynamicCount,
      totalSignificantAspects: aspects.length,
      harmonyFlowRatio: `${harmonyPercent}% Aliran Harmonis / ${100 - harmonyPercent}% Dinamika Pertumbuhan`
    },
    reflectiveConclusion: harmonyPercent >= 60
      ? `Pola astrologi synastry ${personA.input.name} & ${personB.input.name} menunjukkan aliran saling melengkapi yang kuat. Kenyamanan batin dan keselarasan nilai mempermudah perjalanan bersama, asalkan komunikasi terbuka tetap dirawat saat perbedaan sesekali muncul.`
      : `Hubungan ini adalah ruang pembelajaran jiwa yang sangat transformatif. Ketegangan dinamis yang ada bukan tanda ketidakcocokan, melainkan undangan untuk mendewasakan ego, merawat batasan sehat, dan menemukan titik temu yang lebih mendalam.`
  };
}

export function calculateSynastryCouple(inputA, inputB, astro = Astronomy) {
  const personA = calculatePersonNatal(inputA, astro);
  const personB = calculatePersonNatal(inputB, astro);
  const aspects = calculateSynastryAspects(personA.planets, personB.planets);

  // Categorize aspects and enrich with interpretations
  const enrichedAspects = aspects.map(asp => {
    const interp = getAspectInterpretation(asp, personA.input.name, personB.input.name);
    return { ...asp, interpretation: interp };
  });

  const categories = {
    emotional: enrichedAspects.filter(a => a.interpretation.category === "emotional"),
    communication: enrichedAspects.filter(a => a.interpretation.category === "communication"),
    attraction: enrichedAspects.filter(a => a.interpretation.category === "attraction"),
    growth: enrichedAspects.filter(a => a.interpretation.category === "growth"),
    challenge: enrichedAspects.filter(a => a.interpretation.category === "challenge")
  };

  const synthesis = synthesizeRelationship(personA, personB, aspects);

  return {
    engineVersion: "bhumi-synastry-v1.0.0",
    calculatedAt: new Date().toISOString(),
    personA,
    personB,
    aspects: enrichedAspects,
    categories,
    synthesis
  };
}
