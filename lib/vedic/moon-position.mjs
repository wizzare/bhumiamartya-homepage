// Moon position calculation using astronomy-engine
import * as Astronomy from 'astronomy-engine';

/**
 * Get the geocentric ecliptic longitude of the Moon
 * 
 * @param {Date} date - JavaScript Date object
 * @returns {number} Tropical ecliptic longitude in degrees (0-360)
 */
export function getMoonTropicalLongitude(date) {
  // Use EclipticGeoMoon for precise geocentric Moon longitude
  const pos = Astronomy.EclipticGeoMoon(date);
  return ((pos.lon % 360) + 360) % 360;
}

/**
 * Get the geocentric ecliptic latitude of the Moon
 * 
 * @param {Date} date - JavaScript Date object
 * @returns {number} Ecliptic latitude in degrees
 */
export function getMoonLatitude(date) {
  const pos = Astronomy.EclipticGeoMoon(date);
  return pos.lat;
}
