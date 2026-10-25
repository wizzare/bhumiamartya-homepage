// Canonical Ephemeris & Live Planetary Calculation for Bhumi Amartya
// Uses astronomy-engine (VSOP87 / ELP2000-82B) and Lahiri Chitrapaksha Ayanamsa

import * as Astronomy from 'astronomy-engine';
import { dateToJulianDay } from '../vedic/julian.mjs';
import { tropicalToSidereal, lahiriAyanamsa } from '../vedic/ayanamsa.mjs';
import { getRashi } from '../vedic/rashi.mjs';
import { getNakshatra } from '../vedic/nakshatra.mjs';
import { NAKSHATRA_LORDS, RASHI_NAMES } from '../vedic/constants.mjs';

const SANSKRIT_PLANET_NAMES = {
  Sun: { id: 'Matahari', sanskrit: 'Surya' },
  Moon: { id: 'Bulan', sanskrit: 'Chandra' },
  Mercury: { id: 'Merkurius', sanskrit: 'Budha' },
  Venus: { id: 'Venus', sanskrit: 'Shukra' },
  Mars: { id: 'Mars', sanskrit: 'Mangala' },
  Jupiter: { id: 'Yupiter', sanskrit: 'Guru / Brihaspati' },
  Saturn: { id: 'Saturnus', sanskrit: 'Shani' },
  Uranus: { id: 'Uranus', sanskrit: 'Uranus' },
  Neptune: { id: 'Neptunus', sanskrit: 'Neptunus' },
  Pluto: { id: 'Pluto', sanskrit: 'Pluto' },
  Rahu: { id: 'Rahu (Simpul Utara)', sanskrit: 'Rahu' },
  Ketu: { id: 'Ketu (Simpul Selatan)', sanskrit: 'Ketu' }
};

export const RETROGRADE_CAPABLE_PLANETS = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

/**
 * Normalize an angle into [0, 360)
 */
export function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

/**
 * Get geocentric ecliptic longitude (tropical) for a planetary body
 */
export function getTropicalLongitude(bodyName, date) {
  if (bodyName === 'Sun') {
    return normalizeDegrees(Astronomy.SunPosition(date).elon);
  }
  if (bodyName === 'Moon') {
    return normalizeDegrees(Astronomy.EclipticGeoMoon(date).lon);
  }
  if (bodyName === 'Rahu' || bodyName === 'NorthNode') {
    const days = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;
    return normalizeDegrees(125.04452 - 0.0529538083 * days);
  }
  if (bodyName === 'Ketu' || bodyName === 'SouthNode') {
    const nn = getTropicalLongitude('Rahu', date);
    return normalizeDegrees(nn + 180);
  }
  const vector = Astronomy.GeoVector(Astronomy.Body[bodyName], date, true);
  return normalizeDegrees(Astronomy.Ecliptic(vector).elon);
}

/**
 * Get instantaneous daily motion (speed in degrees/day) for a planet
 */
export function getPlanetarySpeed(bodyName, date) {
  if (bodyName === 'Rahu' || bodyName === 'NorthNode') {
    return -0.05295; // Mean node continuous retrograde rate
  }
  if (bodyName === 'Ketu' || bodyName === 'SouthNode') {
    return -0.05295;
  }
  const dtMs = 0.5 * 86400000; // 12 hours forward and backward
  const l1 = getTropicalLongitude(bodyName, new Date(date.getTime() - dtMs));
  const l2 = getTropicalLongitude(bodyName, new Date(date.getTime() + dtMs));
  let speed = l2 - l1;
  if (speed > 180) speed -= 360;
  if (speed < -180) speed += 360;
  return speed;
}

/**
 * Determine motion status: 'direct' | 'retrograde' | 'stationary'
 */
export function getMotionStatus(bodyName, speed) {
  if (bodyName === 'Sun' || bodyName === 'Moon') return 'direct';
  if (bodyName === 'Rahu' || bodyName === 'Ketu') return 'retrograde';
  if (Math.abs(speed) < 0.005) return 'stationary';
  return speed < 0 ? 'retrograde' : 'direct';
}

/**
 * For a planet that is currently retrograde, find the start and end dates of the retrograde phase
 */
export function findCurrentRetrogradeWindow(bodyName, date) {
  const currentSpeed = getPlanetarySpeed(bodyName, date);
  if (currentSpeed >= 0) return null;

  // Search backward for station retrograde
  let tStart = date.getTime();
  let maxBackward = 180;
  while (maxBackward-- > 0 && getPlanetarySpeed(bodyName, new Date(tStart)) < 0) {
    tStart -= 86400000;
  }
  let tA = tStart, tB = tStart + 86400000;
  for (let i = 0; i < 22; i++) {
    const mid = (tA + tB) / 2;
    if (getPlanetarySpeed(bodyName, new Date(mid)) < 0) tB = mid;
    else tA = mid;
  }
  const startDate = new Date((tA + tB) / 2);

  // Search forward for station direct
  let tEnd = date.getTime();
  let maxForward = 180;
  while (maxForward-- > 0 && getPlanetarySpeed(bodyName, new Date(tEnd)) < 0) {
    tEnd += 86400000;
  }
  let tC = tEnd - 86400000, tD = tEnd;
  for (let i = 0; i < 22; i++) {
    const mid = (tC + tD) / 2;
    if (getPlanetarySpeed(bodyName, new Date(mid)) < 0) tC = mid;
    else tD = mid;
  }
  const endDate = new Date((tC + tD) / 2);

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString()
  };
}

/**
 * For a planet currently direct, find the next upcoming retrograde window
 */
export function findUpcomingRetrogradeWindow(bodyName, date, maxSearchDays = 365) {
  const currentSpeed = getPlanetarySpeed(bodyName, date);
  if (currentSpeed < 0) return null;

  let t = date.getTime();
  let found = false;
  for (let d = 1; d <= maxSearchDays; d += 2) {
    const cur = t + d * 86400000;
    if (getPlanetarySpeed(bodyName, new Date(cur)) < 0) {
      t = cur;
      found = true;
      break;
    }
  }
  if (!found) return null;

  let tA = t - 2 * 86400000, tB = t;
  for (let i = 0; i < 22; i++) {
    const mid = (tA + tB) / 2;
    if (getPlanetarySpeed(bodyName, new Date(mid)) < 0) tB = mid;
    else tA = mid;
  }
  const startDate = new Date((tA + tB) / 2);

  let tEnd = t;
  while (getPlanetarySpeed(bodyName, new Date(tEnd)) < 0) {
    tEnd += 86400000;
  }
  let tC = tEnd - 86400000, tD = tEnd;
  for (let i = 0; i < 22; i++) {
    const mid = (tC + tD) / 2;
    if (getPlanetarySpeed(bodyName, new Date(mid)) < 0) tC = mid;
    else tD = mid;
  }
  const endDate = new Date((tC + tD) / 2);

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString()
  };
}

/**
 * Calculate complete canonical Current Sky for a given date/time
 *
 * @param {Date} [calculationDate=new Date()]
 * @param {object} [options={}]
 * @returns {object}
 */
export function calculateCurrentSky(calculationDate = new Date(), options = {}) {
  const date = calculationDate instanceof Date ? calculationDate : new Date(calculationDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid calculation date provided to calculateCurrentSky');
  }

  const jd = dateToJulianDay(date);
  const ayanamsaVal = lahiriAyanamsa(jd);

  // 1. Calculate Moon
  const moonTrop = getTropicalLongitude('Moon', date);
  const moonSid = tropicalToSidereal(moonTrop, jd);
  const moonRashi = getRashi(moonSid);
  const moonNak = getNakshatra(moonSid);
  const moonSpeed = getPlanetarySpeed('Moon', date);

  // 2. Calculate Sun
  const sunTrop = getTropicalLongitude('Sun', date);
  const sunSid = tropicalToSidereal(sunTrop, jd);
  const sunRashi = getRashi(sunSid);
  const sunNak = getNakshatra(sunSid);
  const sunSpeed = getPlanetarySpeed('Sun', date);

  // 3. Calculate Planets
  const planetNames = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];
  const planets = planetNames.map((name) => {
    const trop = getTropicalLongitude(name, date);
    const sid = tropicalToSidereal(trop, jd);
    const rashi = getRashi(sid);
    const nak = getNakshatra(sid);
    const speed = getPlanetarySpeed(name, date);
    const motion = getMotionStatus(name, speed);
    const isRetrograde = motion === 'retrograde';

    let retrogradeWindow = null;
    let upcomingRetrograde = null;

    if (isRetrograde) {
      retrogradeWindow = findCurrentRetrogradeWindow(name, date);
    } else {
      upcomingRetrograde = findUpcomingRetrogradeWindow(name, date);
    }

    return {
      name,
      indonesianName: SANSKRIT_PLANET_NAMES[name]?.id || name,
      sanskritName: SANSKRIT_PLANET_NAMES[name]?.sanskrit || name,
      tropicalLongitude: Number(trop.toFixed(4)),
      siderealLongitude: Number(sid.toFixed(4)),
      degreeInSign: Number((sid % 30).toFixed(2)),
      rashi: {
        index: rashi.index,
        name: rashi.name,
        short: rashi.short
      },
      nakshatra: {
        index: nak.index,
        name: nak.name,
        lord: nak.lord,
        pada: nak.pada
      },
      dailySpeed: Number(speed.toFixed(4)),
      motion,
      isRetrograde,
      retrogradeWindow,
      upcomingRetrograde
    };
  });

  // 4. Calculate Lunar Nodes (Rahu & Ketu)
  const rahuTrop = getTropicalLongitude('Rahu', date);
  const rahuSid = tropicalToSidereal(rahuTrop, jd);
  const rahuRashi = getRashi(rahuSid);
  const rahuNak = getNakshatra(rahuSid);

  const ketuTrop = getTropicalLongitude('Ketu', date);
  const ketuSid = tropicalToSidereal(ketuTrop, jd);
  const ketuRashi = getRashi(ketuSid);
  const ketuNak = getNakshatra(ketuSid);

  const nodes = {
    rahu: {
      name: 'Rahu',
      indonesianName: 'Rahu (Simpul Utara)',
      sanskritName: 'Rahu',
      type: 'lunar_node',
      motion: 'continuous_retrograde',
      tropicalLongitude: Number(rahuTrop.toFixed(4)),
      siderealLongitude: Number(rahuSid.toFixed(4)),
      degreeInSign: Number((rahuSid % 30).toFixed(2)),
      rashi: { index: rahuRashi.index, name: rahuRashi.name, short: rahuRashi.short },
      nakshatra: { index: rahuNak.index, name: rahuNak.name, lord: rahuNak.lord, pada: rahuNak.pada }
    },
    ketu: {
      name: 'Ketu',
      indonesianName: 'Ketu (Simpul Selatan)',
      sanskritName: 'Ketu',
      type: 'lunar_node',
      motion: 'continuous_retrograde',
      tropicalLongitude: Number(ketuTrop.toFixed(4)),
      siderealLongitude: Number(ketuSid.toFixed(4)),
      degreeInSign: Number((ketuSid % 30).toFixed(2)),
      rashi: { index: ketuRashi.index, name: ketuRashi.name, short: ketuRashi.short },
      nakshatra: { index: ketuNak.index, name: ketuNak.name, lord: ketuNak.lord, pada: ketuNak.pada }
    }
  };

  // 5. Filter active retrogrades for quick consumption
  const activeRetrogrades = planets.filter((p) => p.isRetrograde);

  return {
    calculationTime: date.toISOString(),
    julianDay: Number(jd.toFixed(5)),
    ayanamsa: {
      system: 'Lahiri Chitrapaksha',
      valueDegrees: Number(ayanamsaVal.toFixed(4))
    },
    zodiacSystem: 'sidereal',
    ephemerisSource: 'astronomy-engine (VSOP87 / ELP2000-82B)',
    moon: {
      name: 'Moon',
      indonesianName: 'Bulan',
      sanskritName: 'Chandra',
      tropicalLongitude: Number(moonTrop.toFixed(4)),
      siderealLongitude: Number(moonSid.toFixed(4)),
      degreeInSign: Number((moonSid % 30).toFixed(2)),
      rashi: { index: moonRashi.index, name: moonRashi.name, short: moonRashi.short },
      nakshatra: { index: moonNak.index, name: moonNak.name, lord: moonNak.lord, pada: moonNak.pada },
      dailySpeed: Number(moonSpeed.toFixed(4)),
      motion: 'direct'
    },
    sun: {
      name: 'Sun',
      indonesianName: 'Matahari',
      sanskritName: 'Surya',
      tropicalLongitude: Number(sunTrop.toFixed(4)),
      siderealLongitude: Number(sunSid.toFixed(4)),
      degreeInSign: Number((sunSid % 30).toFixed(2)),
      rashi: { index: sunRashi.index, name: sunRashi.name, short: sunRashi.short },
      nakshatra: { index: sunNak.index, name: sunNak.name, lord: sunNak.lord, pada: sunNak.pada },
      dailySpeed: Number(sunSpeed.toFixed(4)),
      motion: 'direct'
    },
    planets,
    nodes,
    activeRetrogrades
  };
}
