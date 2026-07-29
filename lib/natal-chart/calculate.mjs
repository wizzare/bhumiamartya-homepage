import * as Astronomy from "astronomy-engine";

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_META = {
  Aries: ["Fire", "Cardinal", "Masculine"], Taurus: ["Earth", "Fixed", "Feminine"], Gemini: ["Air", "Mutable", "Masculine"],
  Cancer: ["Water", "Cardinal", "Feminine"], Leo: ["Fire", "Fixed", "Masculine"], Virgo: ["Earth", "Mutable", "Feminine"],
  Libra: ["Air", "Cardinal", "Masculine"], Scorpio: ["Water", "Fixed", "Feminine"], Sagittarius: ["Fire", "Mutable", "Masculine"],
  Capricorn: ["Earth", "Cardinal", "Feminine"], Aquarius: ["Air", "Fixed", "Masculine"], Pisces: ["Water", "Mutable", "Feminine"],
};
const WEIGHTS = { Sun: 3, Moon: 3, Mercury: 2, Venus: 2, Mars: 2, Jupiter: 1.5, Saturn: 1.5, Uranus: 1, Neptune: 1, Pluto: 1, NorthNode: 1, SouthNode: 1, Chiron: 1 };
const PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "NorthNode", "SouthNode", "Chiron"];
const CITY_FALLBACKS = {
  jakarta: { latitude: -6.2088, longitude: 106.8456, timezone: "+07:00" }, bandung: { latitude: -6.9175, longitude: 107.6191, timezone: "+07:00" },
  surabaya: { latitude: -7.2575, longitude: 112.7521, timezone: "+07:00" }, yogyakarta: { latitude: -7.7956, longitude: 110.3695, timezone: "+07:00" },
  denpasar: { latitude: -8.65, longitude: 115.2167, timezone: "+08:00" }, singapore: { latitude: 1.3521, longitude: 103.8198, timezone: "+08:00" },
};

const normalizeLongitude = value => ((value % 360) + 360) % 360;
const signFromLongitude = value => SIGNS[Math.floor(normalizeLongitude(value) / 30)];
const degreeInSign = value => Number((normalizeLongitude(value) % 30).toFixed(4));
const minuteInSign = value => Math.floor((degreeInSign(value) % 1) * 60);
const numeric = value => Number(Number(value).toFixed(4));

function resolveLocation({ latitude, longitude, timezone, birthCity }) {
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) return { latitude, longitude, timezone };
  const city = String(birthCity || "").toLowerCase();
  const key = Object.keys(CITY_FALLBACKS).find(candidate => city.includes(candidate));
  return key ? CITY_FALLBACKS[key] : null;
}

function parseOffset(timezone) {
  const match = /^([+-])(\d{1,2}):?(\d{2})?$/.exec(String(timezone || "").trim());
  if (!match) throw new Error("timezone must be an explicit UTC offset such as +07:00.");
  return (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] || 0));
}

function toUtcDate(birthDate, birthTime, timezone) {
  const date = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate || "");
  const time = /^(\d{2}):(\d{2})$/.exec(birthTime || "");
  if (!date || !time) throw new Error("birthDate and birthTime must use ISO formats.");
  const [year, month, day] = date.slice(1).map(Number);
  const [hour, minute] = time.slice(1).map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute) - parseOffset(timezone) * 60_000);
  if (utc.getTime() !== utc.getTime()) throw new Error("Invalid birth date/time.");
  return utc;
}

function meanNorthNode(date) {
  const days = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86_400_000;
  return normalizeLongitude(125.04452 - 0.0529538083 * days);
}

function approximateChiron(date) {
  const days = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86_400_000;
  return normalizeLongitude(251.35 + days * 0.019777);
}

function longitudeFor(name, date) {
  if (name === "Sun") return Astronomy.SunPosition(date).elon;
  if (name === "Moon") return Astronomy.EclipticGeoMoon(date).lon;
  if (name === "NorthNode") return meanNorthNode(date);
  if (name === "SouthNode") return meanNorthNode(date) + 180;
  if (name === "Chiron") return approximateChiron(date);
  return Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body[name], date, true)).elon;
}

const radians = value => value * Math.PI / 180;
const degrees = value => value * 180 / Math.PI;
const signedAngle = value => ((value + 180) % 360 + 360) % 360 - 180;

function angleContext(date, latitude, longitude) {
  const armc = normalizeLongitude((Astronomy.SiderealTime(date) + longitude / 15) * 15);
  const obliquity = Astronomy.e_tilt(Astronomy.MakeTime(date)).tobl;
  return { armc, latitude: radians(latitude), obliquity: radians(obliquity) };
}

// Tropical ASC and MC from local apparent sidereal time and obliquity of date.
function verifiedAngles(date, latitude, longitude) {
  const context = angleContext(date, latitude, longitude);
  const armc = radians(context.armc);
  const ascendantLongitude = normalizeLongitude(degrees(Math.atan2(
    -Math.cos(armc),
    Math.sin(armc) * Math.cos(context.obliquity) + Math.tan(context.latitude) * Math.sin(context.obliquity),
  )) + 180);
  const midheavenLongitude = normalizeLongitude(degrees(Math.atan2(
    Math.sin(armc), Math.cos(armc) * Math.cos(context.obliquity),
  )));
  return { ...context, ascendantLongitude, midheavenLongitude };
}

function rightAscension(longitude, obliquity) {
  return normalizeLongitude(degrees(Math.atan2(
    Math.sin(radians(longitude)) * Math.cos(obliquity), Math.cos(radians(longitude)),
  )));
}

function semiDiurnalArc(longitude, latitude, obliquity) {
  const declination = Math.asin(Math.sin(obliquity) * Math.sin(radians(longitude)));
  const cosine = Math.max(-1, Math.min(1, -Math.tan(latitude) * Math.tan(declination)));
  return degrees(Math.acos(cosine));
}

function solvePlacidusCusp(lower, upper, direction, fraction, context) {
  let low = lower; let high = upper;
  while (high <= low) high += 360;
  const residual = longitude => signedAngle(rightAscension(longitude, context.obliquity) - context.armc) - direction * fraction * semiDiurnalArc(longitude, context.latitude, context.obliquity);
  let lowResidual = residual(low);
  const highResidual = residual(high);
  if (lowResidual === 0) return low;
  if (highResidual === 0) return high;
  if (Math.sign(lowResidual) === Math.sign(highResidual)) throw new Error("Placidus cusp could not be bracketed for this latitude.");
  for (let iteration = 0; iteration < 64; iteration += 1) {
    const midpoint = (low + high) / 2;
    const midpointResidual = residual(midpoint);
    if (Math.abs(midpointResidual) < 1e-10) return midpoint;
    if (Math.sign(midpointResidual) === Math.sign(lowResidual)) { low = midpoint; lowResidual = midpointResidual; } else high = midpoint;
  }
  return (low + high) / 2;
}

function buildHouses(date, latitude, longitude) {
  const context = verifiedAngles(date, latitude, longitude);
  const descendant = normalizeLongitude(context.ascendantLongitude + 180);
  const ic = normalizeLongitude(context.midheavenLongitude + 180);
  const cusps = {
    1: context.ascendantLongitude,
    4: ic,
    7: descendant,
    10: context.midheavenLongitude,
    11: solvePlacidusCusp(context.midheavenLongitude, context.ascendantLongitude, 1, 1 / 3, context),
    12: solvePlacidusCusp(context.midheavenLongitude, context.ascendantLongitude, 1, 2 / 3, context),
    9: solvePlacidusCusp(descendant, context.midheavenLongitude, -1, 1 / 3, context),
    8: solvePlacidusCusp(descendant, context.midheavenLongitude, -1, 2 / 3, context),
  };
  cusps[2] = normalizeLongitude(cusps[8] + 180); cusps[3] = normalizeLongitude(cusps[9] + 180);
  cusps[5] = normalizeLongitude(cusps[11] + 180); cusps[6] = normalizeLongitude(cusps[12] + 180);
  return {
    angles: { ascendantLongitude: numeric(context.ascendantLongitude), midheavenLongitude: numeric(context.midheavenLongitude) },
    houses: Object.fromEntries(Object.entries(cusps).map(([house, cuspLongitude]) => {
      const cusp = numeric(normalizeLongitude(cuspLongitude));
      return [house, { house: Number(house), longitude: cusp, sign: signFromLongitude(cusp), degree: degreeInSign(cusp), minute: minuteInSign(cusp) }];
    })),
  };
}

function houseFor(longitude, houses) {
  const cusps = Object.values(houses);
  const value = normalizeLongitude(longitude);
  for (let index = 0; index < cusps.length; index += 1) {
    const current = cusps[index]; const next = cusps[(index + 1) % cusps.length];
    if (current.longitude <= next.longitude ? value >= current.longitude && value < next.longitude : value >= current.longitude || value < next.longitude) return current.house;
  }
  throw new Error("Unable to determine a Placidus house.");
}

function calculatePlanets(date, houses) {
  const yesterday = new Date(date.getTime() - 86_400_000);
  return Object.fromEntries(PLANETS.map(name => {
    const longitude = normalizeLongitude(longitudeFor(name, date));
    let motion = longitude - normalizeLongitude(longitudeFor(name, yesterday));
    if (motion > 180) motion -= 360;
    if (motion < -180) motion += 360;
    const retrograde = name === "SouthNode" ? true : !["Sun", "Moon"].includes(name) && motion < 0;
    return [name, { name, longitude: numeric(longitude), sign: signFromLongitude(longitude), degree: degreeInSign(longitude), minute: minuteInSign(longitude), house: houseFor(longitude, houses), retrograde }];
  }));
}

function angularDistance(a, b) { const diff = Math.abs(normalizeLongitude(a) - normalizeLongitude(b)); return diff > 180 ? 360 - diff : diff; }
function calculateAspects(planets) {
  const definitions = [["Conjunction", 0, 8], ["Sextile", 60, 5], ["Square", 90, 7], ["Trine", 120, 7], ["Opposition", 180, 8]];
  const entries = Object.values(planets); const aspects = [];
  for (let i = 0; i < entries.length; i += 1) for (let j = i + 1; j < entries.length; j += 1) {
    if ((entries[i].name === "NorthNode" && entries[j].name === "SouthNode") || (entries[i].name === "SouthNode" && entries[j].name === "NorthNode")) continue;
    const distance = angularDistance(entries[i].longitude, entries[j].longitude);
    const definition = definitions.find(([, angle, orb]) => Math.abs(distance - angle) <= orb);
    if (definition) aspects.push({ planet1: entries[i].name, planet2: entries[j].name, type: definition[0], angle: definition[1], orb: Number(Math.abs(distance - definition[1]).toFixed(2)) });
  }
  return aspects.sort((a, b) => a.orb - b.orb);
}

function balances(planets) {
  const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 }; const modalities = { Cardinal: 0, Fixed: 0, Mutable: 0 }; const polarities = { Masculine: 0, Feminine: 0 };
  for (const planet of Object.values(planets)) {
    const [element, modality, polarity] = SIGN_META[planet.sign]; const weight = WEIGHTS[planet.name] || 1;
    elements[element] += weight; modalities[modality] += weight; polarities[polarity] += weight;
  }
  const dominant = values => Object.entries(values).sort((a, b) => b[1] - a[1])[0][0];
  return { elements, modalities, polarities, dominantElement: dominant(elements), dominantModality: dominant(modalities), dominantPolarity: dominant(polarities) };
}

export function calculateNatalChart(input) {
  const location = resolveLocation(input);
  if (!location) throw new Error("Natal Chart requires latitude and longitude, or a supported city fallback.");
  const timezone = input.timezone || location.timezone;
  const date = toUtcDate(input.birthDate, input.birthTime, timezone);
  const { angles, houses } = buildHouses(date, location.latitude, location.longitude);
  const planets = calculatePlanets(date, houses);
  const balance = balances(planets);
  return {
    calculationStatus: "completed", zodiacSystem: "Tropical", houseSystem: "Placidus", source: "bhumi-local-verified-placidus-v1",
    sunSign: planets.Sun.sign, moonSign: planets.Moon.sign, risingSign: signFromLongitude(angles.ascendantLongitude), midheaven: signFromLongitude(angles.midheavenLongitude),
    ...angles, planets, houses, aspects: calculateAspects(planets), ...balance,
  };
}
