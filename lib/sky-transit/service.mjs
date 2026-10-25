// Canonical Sky Transit Service for Bhumi Amartya
// Encapsulates current sky ephemeris, retrograde detection, personal transit, and humanized narrative

import { calculateCurrentSky, getTropicalLongitude } from './ephemeris.mjs';
import { calculatePersonalTransits } from './personal-transit.mjs';
import { composeHumanizedReading } from '../narrative/humanized-composer.mjs';
import { calculateVedic } from '../vedic/calculate.mjs';
import { dateToJulianDay } from '../vedic/julian.mjs';
import { tropicalToSidereal } from '../vedic/ayanamsa.mjs';
import { getRashi } from '../vedic/rashi.mjs';
import { getNakshatra } from '../vedic/nakshatra.mjs';
import { isValidIanaTimeZone, localDateTimeToUtc } from '../timezone.mjs';
import { resolveTimezoneFromCoordinates } from '../timezone-resolver.mjs';

function validateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function validateTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ''));
}

export function handleSkyTransit(body = {}) {
  const {
    birthDate,
    birthTime,
    birthCity,
    latitude,
    longitude,
    timezone,
    asOfDate,
    nickname,
    lifePath,
    arcanaName,
    weton,
    baziElement
  } = body;

  const now = new Date();
  let effectiveDate = now;
  if (asOfDate) {
    if (!validateDate(asOfDate)) {
      return { status: 400, data: { ok: false, code: 'INVALID_AS_OF_DATE', message: 'asOfDate tidak valid.' } };
    }
    effectiveDate = new Date(`${asOfDate}T12:00:00Z`);
  }

  const currentSky = calculateCurrentSky(effectiveDate);

  let natalDataCompleteness = 'none';
  let natalPoints = {};
  const calculationWarnings = [];

  if (birthDate) {
    if (!validateDate(birthDate)) {
      return { status: 400, data: { ok: false, code: 'INVALID_BIRTH_DATE', message: 'Tanggal lahir tidak valid.' } };
    }

    const hasBirthTime = Boolean(birthTime && validateTime(birthTime));
    const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude);

    let resolvedTimezone = 'Asia/Jakarta';
    if (timezone && isValidIanaTimeZone(timezone)) {
      resolvedTimezone = timezone;
    } else if (hasCoords) {
      const tzRes = resolveTimezoneFromCoordinates(latitude, longitude);
      if (tzRes.ok) resolvedTimezone = tzRes.timezone;
    }

    if (hasBirthTime && hasCoords) {
      natalDataCompleteness = 'full';
      const utcRes = localDateTimeToUtc({ birthDate, birthTime, timezone: resolvedTimezone });
      if (utcRes.ok) {
        const birthUtc = utcRes.utc;
        const birthJd = dateToJulianDay(birthUtc);

        const sunTrop = getTropicalLongitude('Sun', birthUtc);
        const sunSid = tropicalToSidereal(sunTrop, birthJd);
        const sunRashi = getRashi(sunSid);
        const sunNak = getNakshatra(sunSid);

        const vedicRes = calculateVedic({ birthUtc, asOfDate: effectiveDate });
        let natalMoon = null;
        if (vedicRes.ok) {
          natalMoon = {
            siderealLongitude: vedicRes.siderealMoonLon,
            rashi: { index: vedicRes.rashiDetailed.index, name: vedicRes.rashiDetailed.name, short: vedicRes.rashi },
            nakshatra: { index: vedicRes.nakshatraDetailed.index, name: vedicRes.nakshatra, lord: vedicRes.nakshatraLord, pada: vedicRes.pada }
          };
        }

        natalPoints = {
          natalMoon,
          natalSun: {
            siderealLongitude: sunSid,
            rashi: { index: sunRashi.index, name: sunRashi.name, short: sunRashi.short },
            nakshatra: { index: sunNak.index, name: sunNak.name, lord: sunNak.lord, pada: sunNak.pada }
          },
          isPartial: false
        };
      } else {
        calculationWarnings.push('Gagal mengonversi jam lahir lokal ke UTC; beralih ke pembacaan parsial.');
        natalDataCompleteness = 'partial';
      }
    } else {
      natalDataCompleteness = 'partial';
      calculationWarnings.push('Jam atau koordinat kota lahir tidak diisi; posisi Ascendant dan rumah astrologi tidak dihitung.');

      const [y, m, d] = birthDate.split('-').map(Number);
      const approxBirthUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
      const birthJd = dateToJulianDay(approxBirthUtc);
      const sunTrop = getTropicalLongitude('Sun', approxBirthUtc);
      const sunSid = tropicalToSidereal(sunTrop, birthJd);
      const sunRashi = getRashi(sunSid);
      const sunNak = getNakshatra(sunSid);

      natalPoints = {
        natalSun: {
          siderealLongitude: sunSid,
          rashi: { index: sunRashi.index, name: sunRashi.name, short: sunRashi.short },
          nakshatra: { index: sunNak.index, name: sunNak.name, lord: sunNak.lord, pada: sunNak.pada }
        },
        isPartial: true
      };
    }
  }

  const personalTransits = calculatePersonalTransits(currentSky, natalPoints);

  const narrative = composeHumanizedReading({
    nickname: nickname || 'Kawan',
    lifePath: Number(lifePath) || 9,
    arcanaName: arcanaName || 'The Sun',
    sunSign: natalPoints.natalSun?.rashi?.short || 'Aries',
    weton,
    baziElement,
    currentSky,
    personalTransits,
    isPartial: natalDataCompleteness !== 'full'
  });

  return {
    status: 200,
    data: {
      ok: true,
      calculation_time: currentSky.calculationTime,
      timezone: 'Asia/Jakarta',
      zodiac_system: 'sidereal',
      ayanamsa: 'lahiri',
      ephemeris_source: 'astronomy-engine (VSOP87 / ELP2000-82B)',
      natal_data_completeness: natalDataCompleteness,
      current_sky: currentSky,
      retrograde_planets: currentSky.activeRetrogrades,
      personal_transits: personalTransits.primaryTransits,
      all_transits: personalTransits.allTransits,
      narrative: narrative,
      humanized_reading: narrative,
      calculation_warnings: calculationWarnings
    }
  };
}
