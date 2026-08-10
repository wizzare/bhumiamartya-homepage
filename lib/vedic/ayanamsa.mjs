// Lahiri Ayanamsa calculation
// Based on the formula: Ayanamsa = (Julian Day - 2423437.334) * (1/71.6) / 360 * 360
// Reference: Lahiri ayanamsa (Chitrapaksha) is the most widely used in Vedic astrology

/**
 * Calculate Lahiri Ayanamsa for a given Julian Day Number
 * Based on the linear approximation used by most Vedic software
 * 
 * @param {number} jd - Julian Day Number
 * @returns {number} Ayanamsa in degrees
 */
export function lahiriAyanamsa(jd) {
  // Lahiri ayanamsa linear approximation
  // Reference epoch: January 1, 2000 = JD 2451544.5
  // Ayanamsa at epoch: ~23°52'32" ≈ 23.8756 degrees
  // Rate: approximately 50.29" per year ≈ 0.01397 degrees per year
  
  const EPOCH_JD = 2451544.5; // J2000.0
  const EPOCH_AYANAMSA = 23.8756; // degrees at J2000.0
  const RATE_PER_DAY = 0.01397 / 365.25; // degrees per day
  
  return EPOCH_AYANAMSA + (jd - EPOCH_JD) * RATE_PER_DAY;
}

/**
 * Convert tropical longitude to sidereal longitude using Lahiri ayanamsa
 * 
 * @param {number} tropicalLon - Tropical ecliptic longitude in degrees
 * @param {number} jd - Julian Day Number for ayanamsa calculation
 * @returns {number} Sidereal longitude in degrees (0-360)
 */
export function tropicalToSidereal(tropicalLon, jd) {
  const ayanamsa = lahiriAyanamsa(jd);
  let sidereal = tropicalLon - ayanamsa;
  // Normalize to 0-360
  return ((sidereal % 360) + 360) % 360;
}
