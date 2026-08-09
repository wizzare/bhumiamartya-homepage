// Nakshatra and Pada classification from sidereal longitude
import { NAKSHATRA_NAMES, NAKSHATRA_LORDS, NAKSHATRA_SPAN, PADA_SPAN } from './constants.mjs';

/**
 * Determine Nakshatra and Pada from sidereal longitude
 * 
 * @param {number} siderealLon - Sidereal longitude in degrees (0-360)
 * @returns {{ index: number, name: string, lord: string, pada: number, startDeg: number, endDeg: number }}
 */
export function getNakshatra(siderealLon) {
  const normalized = ((siderealLon % 360) + 360) % 360;
  const nakshatraIndex = Math.floor(normalized / NAKSHATRA_SPAN);
  const startDeg = nakshatraIndex * NAKSHATRA_SPAN;
  const endDeg = startDeg + NAKSHATRA_SPAN;
  
  // Determine Pada (1-4)
  const positionInNakshatra = normalized - startDeg;
  const pada = Math.min(4, Math.floor(positionInNakshatra / PADA_SPAN) + 1);
  
  return {
    index: nakshatraIndex,
    name: NAKSHATRA_NAMES[nakshatraIndex],
    lord: NAKSHATRA_LORDS[nakshatraIndex],
    pada,
    startDeg,
    endDeg
  };
}

/**
 * Calculate the fraction of Nakshatra traversed at birth
 * Used for Vimshottari Dasha calculation
 * 
 * @param {number} siderealLon - Sidereal longitude in degrees (0-360)
 * @returns {number} Fraction traversed (0-1)
 */
export function nakshatraFraction(siderealLon) {
  const normalized = ((siderealLon % 360) + 360) % 360;
  const positionInNakshatra = normalized % NAKSHATRA_SPAN;
  return positionInNakshatra / NAKSHATRA_SPAN;
}
