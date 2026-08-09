// Rashi (Zodiac Sign) classification from sidereal longitude
import { RASHI_NAMES, RASHI_SHORT } from './constants.mjs';

/**
 * Determine Rashi from sidereal longitude
 * Each Rashi spans 30 degrees
 * 
 * @param {number} siderealLon - Sidereal longitude in degrees (0-360)
 * @returns {{ index: number, name: string, short: string, startDeg: number, endDeg: number }}
 */
export function getRashi(siderealLon) {
  const normalized = ((siderealLon % 360) + 360) % 360;
  const index = Math.floor(normalized / 30);
  const startDeg = index * 30;
  const endDeg = startDeg + 30;
  
  return {
    index,
    name: RASHI_NAMES[index],
    short: RASHI_SHORT[index],
    startDeg,
    endDeg
  };
}
