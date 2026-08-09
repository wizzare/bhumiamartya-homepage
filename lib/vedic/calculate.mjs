// Vedic Astrology calculation entry point (Moon-based V1)
import { getMoonTropicalLongitude } from './moon-position.mjs';
import { tropicalToSidereal } from './ayanamsa.mjs';
import { getRashi } from './rashi.mjs';
import { getNakshatra, nakshatraFraction } from './nakshatra.mjs';
import { calculateVimshottariDasha, findCurrentMahadasha } from './vimshottari.mjs';
import { dateToJulianDay } from './julian.mjs';

/**
 * Calculate Vedic Moon-based reading
 *
 * @param {object} params
 * @param {Date} params.birthUtc - Birth datetime in UTC
 * @param {Date} params.asOfDate - Date to evaluate current Mahadasha
 * @returns {object}
 */
export function calculateVedic({ birthUtc, asOfDate }) {
  try {
    if (isNaN(birthUtc.getTime())) {
      return { ok: false, code: 'INVALID_BIRTH_DATE' };
    }
    if (!asOfDate || isNaN(asOfDate.getTime())) {
      return { ok: false, code: 'INVALID_AS_OF_DATE' };
    }

    const jd = dateToJulianDay(birthUtc);

    // Step 1: Get tropical Moon longitude
    const tropicalMoonLon = getMoonTropicalLongitude(birthUtc);

    // Step 2: Convert to sidereal using Lahiri ayanamsa
    const siderealMoonLon = tropicalToSidereal(tropicalMoonLon, jd);

    // Step 3: Determine Rashi
    const rashi = getRashi(siderealMoonLon);

    // Step 4: Determine Nakshatra and Pada
    const nakshatra = getNakshatra(siderealMoonLon);

    // Step 5: Calculate Nakshatra fraction for Vimshottari
    const fraction = nakshatraFraction(siderealMoonLon);

    // Step 6: Calculate Vimshottari Dasha periods
    const periods = calculateVimshottariDasha(nakshatra.lord, fraction, birthUtc);

    // Step 7: Find current Mahadasha for the asOfDate
    const currentMahadasha = findCurrentMahadasha(periods, asOfDate);

    return {
      ok: true,
      scope: 'moon-based-basic',
      tropicalMoonLon,
      siderealMoonLon,
      rashi: rashi.short,
      rashiDetailed: {
        index: rashi.index,
        name: rashi.name,
        longitudeRange: [rashi.startDeg, rashi.endDeg]
      },
      nakshatra: nakshatra.name,
      nakshatraDetailed: {
        index: nakshatra.index,
        lord: nakshatra.lord,
        longitudeRange: [nakshatra.startDeg, nakshatra.endDeg]
      },
      pada: nakshatra.pada,
      nakshatraLord: nakshatra.lord,
      currentMahadasha,
      metadata: {
        engineVersion: '1.0.0',
        zodiac: 'sidereal',
        ayanamsa: 'Lahiri',
        vedicScope: 'moon-based-basic',
        nakshatraSystem: '27',
        dashaSystem: 'Vimshottari',
        calculationStandard: 'Lahiri Chitrapaksha ayanamsa, 27 Nakshatra, 4 Pada per Nakshatra'
      }
    };
  } catch (error) {
    return {
      ok: false,
      code: 'CALCULATION_FAILED',
      message: error.message || 'Vedic calculation failed'
    };
  }
}