// Vimshottari Dasha calculation
import { DASHA_DURATIONS, DASHA_SEQUENCE, NAKSHATRA_LORDS } from './constants.mjs';

/**
 * Calculate Vimshottari Dasha periods
 * 
 * @param {string} nakshatraLord - Lord of the birth Nakshatra
 * @param {number} nakshatraFraction - Fraction of Nakshatra traversed at birth (0-1)
 * @param {Date} birthDate - Birth date
 * @returns {{ currentDasha: object, allPeriods: object[] }}
 */
export function calculateVimshottariDasha(nakshatraLord, nakshatraFraction, birthDate) {
  // Find the starting position in the Dasha sequence
  const startLordIndex = DASHA_SEQUENCE.indexOf(nakshatraLord);
  if (startLordIndex === -1) {
    throw new Error(`Invalid Nakshatra Lord: ${nakshatraLord}`);
  }
  
  // Calculate remaining portion of first Dasha at birth
  const firstLord = DASHA_SEQUENCE[startLordIndex];
  const firstDashaYears = DASHA_DURATIONS[firstLord];
  const firstDashaRemaining = firstDashaYears * (1 - nakshatraFraction);
  
  // Generate all Dasha periods
  const periods = [];
  let currentDate = new Date(birthDate);
  
  // First period (partial)
  const firstEnd = new Date(currentDate);
  firstEnd.setFullYear(firstEnd.getFullYear() + Math.floor(firstDashaRemaining));
  firstEnd.setMonth(firstEnd.getMonth() + Math.round((firstDashaRemaining % 1) * 12));
  
  periods.push({
    planet: firstLord,
    start: new Date(currentDate),
    end: new Date(firstEnd),
    years: firstDashaRemaining
  });
  
  currentDate = new Date(firstEnd);
  
  // Remaining periods
  for (let i = 1; i < DASHA_SEQUENCE.length; i++) {
    const lordIndex = (startLordIndex + i) % DASHA_SEQUENCE.length;
    const lord = DASHA_SEQUENCE[lordIndex];
    const years = DASHA_DURATIONS[lord];
    
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + years);
    
    periods.push({
      planet: lord,
      start: new Date(currentDate),
      end: new Date(endDate),
      years
    });
    
    currentDate = new Date(endDate);
  }
  
  return periods;
}

/**
 * Find the current Mahadasha for a given date
 * 
 * @param {object[]} periods - Array of Dasha periods
 * @param {Date} asOfDate - Date to evaluate
 * @returns {object|null} Current Dasha period
 */
export function findCurrentMahadasha(periods, asOfDate) {
  const targetTime = asOfDate.getTime();
  
  for (const period of periods) {
    if (targetTime >= period.start.getTime() && targetTime < period.end.getTime()) {
      return {
        planet: period.planet,
        start: period.start.toISOString(),
        end: period.end.toISOString(),
        asOfDate: asOfDate.toISOString().split('T')[0]
      };
    }
  }
  
  // If not found in generated periods, extend search
  // This handles dates far in the future
  return null;
}
