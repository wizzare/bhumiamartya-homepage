// Canonical Personal Transit (Gochara) Engine for Bhumi Amartya
// Calculates planetary transits relative to natal Moon (Chandra Lagna), natal Sun (Surya Lagna), and Ascendant (Lagna)

import { normalizeDegrees } from './ephemeris.mjs';

/**
 * Calculate Vedic house distance from point A to point B (1-indexed, 1 to 12)
 *
 * @param {number} rashiIndexFrom - Starting rashi index (0 = Mesha/Aries .. 11 = Meena/Pisces)
 * @param {number} rashiIndexTo - Target rashi index (0 .. 11)
 * @returns {number} 1 to 12
 */
export function getBhavaDistance(rashiIndexFrom, rashiIndexTo) {
  return (((rashiIndexTo - rashiIndexFrom) % 12 + 12) % 12) + 1;
}

/**
 * Calculate shortest angular distance between two longitudes
 */
export function angularDistance(deg1, deg2) {
  const diff = Math.abs(normalizeDegrees(deg1) - normalizeDegrees(deg2));
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Identify aspect relationship between transit longitude and natal longitude
 */
export function detectAspect(transitLon, natalLon) {
  const dist = angularDistance(transitLon, natalLon);
  const definitions = [
    { type: 'Konjungsi (Yuti)', angle: 0, maxOrb: 8, tone: 'Penyatuan energi dan fokus langsung' },
    { type: 'Oposisi (Saptama)', angle: 180, maxOrb: 8, tone: 'Kebutuhan mencari titik temu dan keseimbangan' },
    { type: 'Trine (Trikona)', angle: 120, maxOrb: 7, tone: 'Aliran energi yang harmonis dan mendukung pemahaman' },
    { type: 'Square (Kendra)', angle: 90, maxOrb: 6, tone: 'Dorongan untuk bertindak dan mengatasi hambatan kecil' },
    { type: 'Sextile', angle: 60, maxOrb: 5, tone: 'Peluang untuk belajar dan komunikasi yang terbuka' }
  ];

  for (const def of definitions) {
    const orb = Math.abs(dist - def.angle);
    if (orb <= def.maxOrb) {
      return {
        type: def.type,
        nominalAngle: def.angle,
        exactDistance: Number(dist.toFixed(2)),
        orb: Number(orb.toFixed(2)),
        tone: def.tone
      };
    }
  }
  return null;
}

/**
 * Calculate all personal transits and rank the most meaningful ones
 *
 * @param {object} currentSky - Output from calculateCurrentSky()
 * @param {object} natalPoints - { natalMoon, natalSun, natalAscendant, isPartial, missingReason }
 * @returns {object} Structured transit analysis
 */
export function calculatePersonalTransits(currentSky, natalPoints = {}) {
  const { natalMoon, natalSun, natalAscendant, isPartial = false } = natalPoints;
  const transits = [];

  const allTransitPlanets = [
    ...currentSky.planets,
    currentSky.nodes.rahu,
    currentSky.nodes.ketu
  ];

  // ==========================================
  // 1. TRANSITS TO NATAL MOON (CHANDRA LAGNA)
  // ==========================================
  if (natalMoon && typeof natalMoon.rashi?.index === 'number') {
    const moonRashi = natalMoon.rashi.index;

    for (const p of allTransitPlanets) {
      const pRashi = p.rashi.index;
      const houseFromMoon = getBhavaDistance(moonRashi, pRashi);
      const aspect = natalMoon.siderealLongitude != null
        ? detectAspect(p.siderealLongitude, natalMoon.siderealLongitude)
        : null;

      let score = 20;
      let tag = 'Gochara Umum';
      let title = '';
      let reflection = '';

      // Specific Saturn (Shani) Gochara from Moon
      if (p.name === 'Saturn') {
        if ([12, 1, 2].includes(houseFromMoon)) {
          score = 100;
          tag = 'Sade Sati';
          const phaseName = houseFromMoon === 12 ? 'awal (fase pembuka)' : houseFromMoon === 1 ? 'puncak (fase inti)' : 'akhir (fase penataan)';
          title = `Transit Saturnus: Refleksi Sade Sati (${phaseName})`;
          reflection = `Saturnus berada di rashi ke-${houseFromMoon} dari Bulan kelahiranmu. Ini menandai fase pematangan pribadi yang mengajakmu membangun kebiasaan yang lebih bertanggung jawab, menyederhanakan prioritas hidup, dan tidak memaksakan hal-hal yang di luar kendalimu.`;
        } else if (houseFromMoon === 4) {
          score = 90;
          tag = 'Kantaka Shani';
          title = `Transit Saturnus: Evaluasi Kenyamanan Batin & Akar`;
          reflection = `Saturnus berada di rashi ke-4 dari Bulan kelahiranmu. Suasana ini sering mengajakmu memeriksa kembali rasa aman di dalam diri, hubungan dengan keluarga, dan bagaimana kamu merawat waktu istirahat di tengah kesibukan.`;
        } else if (houseFromMoon === 8) {
          score = 92;
          tag = 'Ashtama Shani';
          title = `Transit Saturnus: Transformasi dan Kesabaran`;
          reflection = `Saturnus melintas di rashi ke-8 dari Bulan kelahiranmu. Periode ini menekankan pentingnya kesabaran, merawat ketenangan pikiran, dan membiarkan hal-hal yang sudah selesai berlalu tanpa memaksakan hasil instan.`;
        } else if ([3, 6, 11].includes(houseFromMoon)) {
          score = 82;
          tag = 'Gochara Membangun';
          title = `Transit Saturnus: Disiplin yang Menghasilkan Ketahanan`;
          reflection = `Saturnus di rashi ke-${houseFromMoon} dari Bulan kelahiranmu memberikan dukungan untuk ketekunan sehari-hari. Ini adalah waktu yang baik untuk menyelesaikan tugas-tugas terstruktur satu demi satu.`;
        } else {
          score = 65;
          title = `Transit Saturnus di Rashi ke-${houseFromMoon} dari Bulan`;
          reflection = `Mendorong penataan ritme emosional dengan keteguhan hati.`;
        }
      }

      // Specific Jupiter (Guru) Gochara from Moon
      else if (p.name === 'Jupiter') {
        if (houseFromMoon === 1) {
          score = 95;
          tag = 'Guru Chandra Yuti';
          title = `Transit Yupiter Bersama Bulan Kelahiranmu`;
          reflection = `Yupiter melintasi rashi tempat Bulan kelahiranmu berada. Kehadirannya sering membuka kejernihan pandangan, rasa syukur, serta dorongan untuk belajar dan memperluas pemahaman hidup.`;
        } else if ([5, 9].includes(houseFromMoon)) {
          score = 93;
          tag = 'Guru Drishti';
          title = `Dukungan Yupiter untuk Ketenangan Batin`;
          reflection = `Yupiter berada di rashi ke-${houseFromMoon} dari Bulan kelahiranmu dan memancarkan aspek harmonis ke pikiranmu. Ini adalah periode yang baik untuk merenung, menimba ilmu baru, atau mengambil keputusan dengan hati yang tenang.`;
        } else if ([2, 7, 11].includes(houseFromMoon)) {
          score = 86;
          tag = 'Gochara Positif';
          title = `Peluang Pertumbuhan & Hubungan yang Sehat`;
          reflection = `Yupiter di rashi ke-${houseFromMoon} dari Bulan kelahiranmu mendukung perluasan jejaring, komunikasi yang bersahabat, dan rasa optimisme yang membumi.`;
        } else {
          score = 70;
          title = `Transit Yupiter di Rashi ke-${houseFromMoon} dari Bulan`;
          reflection = `Membawa ruang untuk introspeksi nilai hidup dan pengembangan kebijaksanaan diri.`;
        }
      }

      // Specific Rahu / Ketu from Moon
      else if (p.name === 'Rahu' || p.name === 'Ketu') {
        if ([1, 7].includes(houseFromMoon)) {
          score = 88;
          tag = 'Nodal Axis';
          title = `Transit ${p.indonesianName}: Menata Kepekaan & Batas Diri`;
          reflection = `${p.name} melintasi poros ke-${houseFromMoon} dari Bulan kelahiranmu. Fase ini sering memunculkan pertanyaan tentang batas antara kebutuhan pribadimu dan harapan orang lain. Kuncinya ada pada kejujuran pada diri sendiri.`;
        } else {
          score = 60;
          title = `Transit ${p.indonesianName} di Rashi ke-${houseFromMoon}`;
          reflection = `Mengajakmu memperhatikan pola keterikatan dan cara melepaskan hal-hal yang tidak lagi selaras.`;
        }
      }

      // Retrograde planets aspecting or conjunct Moon
      if (p.isRetrograde && aspect && aspect.orb <= 6) {
        score += 15;
        tag = `Retrograde & Aspek`;
        title = `${p.indonesianName} Retrograde Menyelaraskan Bulan Kelahiranmu`;
        reflection = `${p.indonesianName} yang sedang retrograde membentuk hubungan ${aspect.type.toLowerCase()} dengan Bulan kelahiranmu. Ini memberi jeda yang tepat untuk merasakan kembali apa yang benar-benar kamu butuhkan saat ini tanpa tergesa-gesa.`;
      }

      transits.push({
        target: 'Moon',
        targetLabel: 'Bulan Kelahiran (Chandra)',
        planetName: p.name,
        indonesianName: p.indonesianName,
        sanskritName: p.sanskritName,
        isRetrograde: Boolean(p.isRetrograde),
        transitRashi: p.rashi,
        natalRashi: natalMoon.rashi,
        houseFromTarget: houseFromMoon,
        aspect,
        score,
        tag,
        title: title || `Transit ${p.indonesianName} di Rashi ke-${houseFromMoon} dari Bulan`,
        reflection
      });
    }
  }

  // ==========================================
  // 2. TRANSITS TO NATAL SUN (SURYA LAGNA)
  // ==========================================
  if (natalSun && typeof natalSun.rashi?.index === 'number') {
    const sunRashi = natalSun.rashi.index;

    for (const p of allTransitPlanets) {
      const pRashi = p.rashi.index;
      const houseFromSun = getBhavaDistance(sunRashi, pRashi);
      const aspect = natalSun.siderealLongitude != null
        ? detectAspect(p.siderealLongitude, natalSun.siderealLongitude)
        : null;

      let score = 15;
      let tag = 'Transit Matahari';
      let title = '';
      let reflection = '';

      // Major conjunction / opposition with Sun
      if (aspect && aspect.type.includes('Konjungsi')) {
        score = 85;
        tag = 'Konjungsi Matahari';
        title = `Penyatuan Energi: ${p.indonesianName} Melintasi Matahari Kelahiranmu`;
        reflection = `Transit ${p.indonesianName} bertemu langsung dengan posisi Matahari kelahiranmu di rashi ${natalSun.rashi.name}. Fokus energimu sedang terarah kuat pada tema ${p.indonesianName.toLowerCase()}: kejujuran berekspresi, tujuan karya, dan vitalitas diri.`;
      } else if (aspect && aspect.type.includes('Oposisi')) {
        score = 80;
        tag = 'Titik Temu';
        title = `Dialog Energi: ${p.indonesianName} Berseberangan dengan Matahari`;
        reflection = `${p.indonesianName} berada tepat di seberang posisi Matahari kelahiranmu. Ini adalah ajakan untuk melihat hal-hal dari sudut pandang yang berbeda dan menemukan kompromi yang sehat antara kehendakmu dan keadaan luar.`;
      } else if (aspect && aspect.type.includes('Trine')) {
        score = 75;
        tag = 'Aliran Harmonis';
        title = `Aliran Selaras: ${p.indonesianName} Mendukung Matahari Kelahiranmu`;
        reflection = `Hubungan trine antara ${p.indonesianName} dan Mataharimu menghadirkan rasa percaya diri yang tenang. Langkah-langkah yang kamu ambil cenderung terasa lebih mengalir dan diterima dengan baik.`;
      } else if (p.name === 'Jupiter' && [1, 5, 9].includes(houseFromSun)) {
        score = 83;
        tag = 'Ekspansi Tujuan';
        title = `Yupiter Menerangi Arah dan Vitalitas Diri`;
        reflection = `Yupiter berada di posisi harmonis terhadap Matahari kelahiranmu, mengundangmu melihat kembali visi jangka panjang dengan rasa optimisme yang terukur.`;
      } else if (p.name === 'Saturn' && [1, 7, 10].includes(houseFromSun)) {
        score = 81;
        tag = 'Kedewasaan Bertindak';
        title = `Saturnus Mengajak Menata Komitmen dan Tanggung Jawab`;
        reflection = `Transit Saturnus yang terhubung dengan Mataharimu menekankan pentingnya integritas, fokus menyelesaikan apa yang telah dimulai, dan keteguhan menghadapi dinamika kerja.`;
      }

      if (p.isRetrograde && aspect && aspect.orb <= 5) {
        score += 10;
        title = `${p.indonesianName} Retrograde Meninjau Arah Matahari Kelahiranmu`;
        reflection = `Fase retrograde ${p.indonesianName} yang menyentuh Mataharimu mengajakmu mengevaluasi rencana penting sebelum melangkah ke tahap berikutnya.`;
      }

      if (title) {
        transits.push({
          target: 'Sun',
          targetLabel: 'Matahari Kelahiran (Surya)',
          planetName: p.name,
          indonesianName: p.indonesianName,
          sanskritName: p.sanskritName,
          isRetrograde: Boolean(p.isRetrograde),
          transitRashi: p.rashi,
          natalRashi: natalSun.rashi,
          houseFromTarget: houseFromSun,
          aspect,
          score,
          tag,
          title,
          reflection
        });
      }
    }
  }

  // ==========================================
  // 3. TRANSITS TO ASCENDANT (LAGNA) IF PRESENT
  // ==========================================
  if (natalAscendant && typeof natalAscendant.rashi?.index === 'number') {
    const ascRashi = natalAscendant.rashi.index;

    for (const p of allTransitPlanets) {
      const houseFromAsc = getBhavaDistance(ascRashi, p.rashi.index);
      const aspect = natalAscendant.siderealLongitude != null
        ? detectAspect(p.siderealLongitude, natalAscendant.siderealLongitude)
        : null;

      if ([1, 7, 10].includes(houseFromAsc) || (aspect && aspect.orb <= 5)) {
        let score = 84;
        let title = `Transit ${p.indonesianName} di Titik Terbit (Lagna)`;
        let reflection = `Pergerakan ${p.indonesianName} di sekitar rumah ke-${houseFromAsc} memengaruhi cara kamu menampilkan diri, berinteraksi dengan lingkungan luar, dan memimpin langkahmu sehari-hari.`;

        transits.push({
          target: 'Ascendant',
          targetLabel: 'Titik Terbit (Ascendant / Lagna)',
          planetName: p.name,
          indonesianName: p.indonesianName,
          sanskritName: p.sanskritName,
          isRetrograde: Boolean(p.isRetrograde),
          transitRashi: p.rashi,
          natalRashi: natalAscendant.rashi,
          houseFromTarget: houseFromAsc,
          aspect,
          score,
          tag: 'Transit Ascendant',
          title,
          reflection
        });
      }
    }
  }

  // Sort by relevance score descending
  transits.sort((a, b) => b.score - a.score);

  // Pick top 2-3 unique planet transits for primary narrative
  const seenPlanets = new Set();
  const primaryTransits = [];
  for (const t of transits) {
    if (!seenPlanets.has(t.planetName)) {
      seenPlanets.add(t.planetName);
      primaryTransits.push(t);
      if (primaryTransits.length >= 3) break;
    }
  }

  // Fallback transit if none scored high (e.g. partial date without exact moon)
  if (primaryTransits.length === 0 && currentSky.planets.length > 0) {
    const jupiter = currentSky.planets.find((p) => p.name === 'Jupiter') || currentSky.planets[0];
    const saturn = currentSky.planets.find((p) => p.name === 'Saturn') || currentSky.planets[1];
    primaryTransits.push({
      target: 'General',
      targetLabel: 'Langit Umum',
      planetName: jupiter.name,
      indonesianName: jupiter.indonesianName,
      sanskritName: jupiter.sanskritName,
      isRetrograde: jupiter.isRetrograde,
      transitRashi: jupiter.rashi,
      score: 50,
      tag: 'Kondisi Langit',
      title: `Transit ${jupiter.indonesianName} di Rashi ${jupiter.rashi.name}`,
      reflection: `Yupiter sedang melintas di rashi ${jupiter.rashi.name}. Secara simbolis, ini menandai atmosfer yang mendukung pembelajaran, kebijaksanaan, dan pembaruan sudut pandang.`
    });
    if (saturn) {
      primaryTransits.push({
        target: 'General',
        targetLabel: 'Langit Umum',
        planetName: saturn.name,
        indonesianName: saturn.indonesianName,
        sanskritName: saturn.sanskritName,
        isRetrograde: saturn.isRetrograde,
        transitRashi: saturn.rashi,
        score: 45,
        tag: 'Kondisi Langit',
        title: `Transit ${saturn.indonesianName} di Rashi ${saturn.rashi.name}`,
        reflection: `Saturnus di rashi ${saturn.rashi.name} mengingatkan pentingnya keteguhan hati, merawat disiplin sederhana, dan membiarkan proses bertumbuh berlangsung secara wajar.`
      });
    }
  }

  return {
    isPartial,
    totalTransitsCalculated: transits.length,
    primaryTransits,
    allTransits: transits
  };
}
