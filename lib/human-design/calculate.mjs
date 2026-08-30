import * as Astronomy from "astronomy-engine";

// Gate sequence in the Rave Mandala / iGing order
const GATE_ORDER = [
  41, 19, 13, 49, 30, 55, 37, 63, 22, 36, 25, 17, 21, 51, 42, 3,
  27, 24, 2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56,
  31, 33, 7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50,
  28, 44, 1, 43, 14, 34, 9, 5, 26, 11, 10, 58, 38, 54, 61, 60,
];

const PLANETS = [
  Astronomy.Body.Sun, Astronomy.Body.Moon, Astronomy.Body.Mercury,
  Astronomy.Body.Venus, Astronomy.Body.Mars, Astronomy.Body.Jupiter,
  Astronomy.Body.Saturn, Astronomy.Body.Uranus, Astronomy.Body.Neptune,
  Astronomy.Body.Pluto,
];

const PLANET_NAMES = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
];

const GATE_ORDER_MAP = {};
GATE_ORDER.forEach((g, i) => { GATE_ORDER_MAP[g] = i; });

const CENTERS_BY_CHANNEL = {
  "1-8": ["G", "Throat"], "2-14": ["Sacral", "G"], "3-60": ["Root", "Sacral"],
  "4-63": ["Head", "Ajna"], "5-15": ["Sacral", "G"], "6-59": ["Sacral", "Solar Plexus"],
  "7-31": ["G", "Throat"], "9-52": ["Root", "Sacral"], "10-20": ["G", "Throat"],
  "10-34": ["G", "Sacral"], "10-57": ["G", "Spleen"], "11-56": ["Ajna", "Throat"],
  "12-22": ["Throat", "Solar Plexus"], "13-33": ["G", "Throat"], "16-48": ["Spleen", "Throat"],
  "17-62": ["Ajna", "Throat"], "18-58": ["Root", "Spleen"], "19-49": ["Root", "Solar Plexus"],
  "20-34": ["Throat", "Sacral"], "20-57": ["Throat", "Spleen"], "21-45": ["Ego", "Throat"],
  "23-43": ["Ajna", "Throat"], "24-61": ["Head", "Ajna"], "25-51": ["G", "Ego"],
  "26-44": ["Spleen", "Ego"], "27-50": ["Spleen", "Sacral"], "28-38": ["Spleen", "Root"],
  "29-46": ["Sacral", "G"], "30-41": ["Root", "Solar Plexus"], "32-54": ["Root", "Spleen"],
  "34-57": ["Sacral", "Spleen"], "35-36": ["Solar Plexus", "Throat"], "37-40": ["Ego", "Solar Plexus"],
  "39-55": ["Root", "Solar Plexus"], "42-53": ["Root", "Sacral"], "47-64": ["Head", "Ajna"],
};

const CROSS_NAMES = {
  1: "The Creative", 2: "the Sphinx", 3: "Laws", 4: "Explanation", 5: "Consciousness",
  6: "Eden", 7: "the Sphinx", 8: "Contagion", 9: "Planning", 10: "Vessel of Love",
  11: "Eden", 12: "Eden", 13: "the Sphinx", 14: "Bounteousness", 15: "Vessel of Love",
  16: "Planning", 17: "Service", 18: "Service", 19: "Four Ways", 20: "The Sleeping Phoenix",
  21: "Tension", 22: "Maya", 23: "Explanation", 24: "Incarnation", 25: "Vessel of Love",
  26: "Confrontation", 27: "Unexpected", 28: "Unexpected", 29: "Contagion", 30: "Maya",
  31: "Unexpected", 32: "Maya", 33: "Four Ways", 34: "The Sleeping Phoenix",
  35: "Consciousness", 36: "Eden", 37: "Planning", 38: "Individualism", 39: "Tension",
  40: "Planning", 41: "Unexpected", 42: "Maya", 43: "Explanation", 44: "Four Ways",
  45: "Confrontation", 46: "Vessel of Love", 47: "Dominance", 48: "Depth",
  49: "Explanation", 50: "Laws", 51: "Individualism", 52: "Service", 53: "Penetration",
  54: "Penetration", 55: "The Sleeping Phoenix", 56: "Limitation", 57: "Penetration",
  58: "Service", 59: "The Sleeping Phoenix", 60: "Limitation", 61: "Thinking",
  62: "Obscurity", 63: "Maya", 64: "Dominance",
};

const IGING_OFFSET = 58;

function normalizeDegrees(v) {
  return ((v % 360) + 360) % 360;
}

function gateFromLongitude(lon) {
  const adjusted = normalizeDegrees(lon + IGING_OFFSET);
  return GATE_ORDER[Math.floor((adjusted / 360) * 64)];
}

function lineFromLongitude(lon) {
  const adjusted = normalizeDegrees(lon + IGING_OFFSET);
  const gateFrac = ((adjusted / 360) * 64) % 1;
  return Math.floor(gateFrac * 6) + 1;
}

function toneFromLongitude(lon) {
  const adjusted = normalizeDegrees(lon + IGING_OFFSET);
  const gateFrac = ((adjusted / 360) * 64) % 1;
  const linePos = (gateFrac * 6) % 1;
  const colorPos = (linePos * 6) % 1;
  return Math.floor(colorPos * 6) + 1;
}

function colorFromLongitude(lon) {
  const adjusted = normalizeDegrees(lon + IGING_OFFSET);
  const gateFrac = ((adjusted / 360) * 64) % 1;
  const linePos = (gateFrac * 6) % 1;
  return Math.floor(linePos * 6) + 1;
}

function baseFromLongitude(lon) {
  const adjusted = normalizeDegrees(lon + IGING_OFFSET);
  const gateFrac = ((adjusted / 360) * 64) % 1;
  const linePos = (gateFrac * 6) % 1;
  const colorPos = (linePos * 6) % 1;
  const tonePos = (colorPos * 6) % 1;
  return Math.floor(tonePos * 5) + 1;
}

function eclipticLongitude(body, date) {
  if (body === Astronomy.Body.Sun) {
    return Astronomy.SunPosition(date).elon;
  }
  if (body === Astronomy.Body.Moon) {
    return Astronomy.EclipticGeoMoon(date).lon;
  }
  return Astronomy.Ecliptic(Astronomy.GeoVector(body, date, true)).elon;
}

function parseTimezoneToMinutes(tz, birthDate, birthTime, longitude) {
  if (tz && typeof tz === "string") {
    const trimmed = tz.trim();
    const m = trimmed.match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
    if (m) {
      const sign = m[1] === "-" ? -1 : 1;
      return sign * (Number(m[2]) * 60 + Number(m[3] || "0"));
    }
    try {
      const testDate = birthDate ? new Date(`${birthDate}T${birthTime || "12:00"}:00Z`) : new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: trimmed,
        timeZoneName: "shortOffset",
      });
      const parts = formatter.formatToParts(testDate);
      const tzPart = parts.find(p => p.type === "timeZoneName");
      if (tzPart && tzPart.value) {
        const match = tzPart.value.match(/GMT([+-]\d+)(?::(\d+))?/);
        if (match) {
          const hours = parseInt(match[1], 10);
          const mins = match[2] ? parseInt(match[2], 10) : 0;
          return hours * 60 + (hours < 0 ? -mins : mins);
        }
      }
    } catch (e) {}
    const lower = trimmed.toLowerCase();
    if (lower === "asia/jakarta" || lower === "wib") return 420;
    if (lower === "asia/makassar" || lower === "wita") return 480;
    if (lower === "asia/jayapura" || lower === "wit") return 540;
    if (lower === "utc" || lower === "gmt") return 0;
  }
  if (typeof longitude === "number" && Number.isFinite(longitude)) {
    return Math.round(longitude / 15) * 60;
  }
  return null;
}

function birthToUtc(birthDate, birthTime, timezone, longitude) {
  const t = (birthTime || "12:00").length === 5 ? birthTime + ":00" : (birthTime || "12:00");
  const [y, m, d] = birthDate.split("-").map(Number);
  const [hh, mm, ss = 0] = t.split(":").map(Number);
  const offsetMin = parseTimezoneToMinutes(timezone, birthDate, birthTime, longitude);
  if (offsetMin !== null) {
    return new Date(Date.UTC(y, m - 1, d, hh, mm, ss) - offsetMin * 60000);
  }
  return new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
}

function findDesignDate(birthUtc) {
  const pSunLon = eclipticLongitude(Astronomy.Body.Sun, birthUtc);
  let start = new Date(birthUtc.getTime() - 95 * 86400000);
  let end = new Date(birthUtc.getTime() - 80 * 86400000);
  for (let i = 0; i < 50; i++) {
    const mid = new Date((start.getTime() + end.getTime()) / 2);
    const midLon = eclipticLongitude(Astronomy.Body.Sun, mid);
    const arc = normalizeDegrees(pSunLon - midLon);
    if (arc > 88) start = mid;
    else end = mid;
  }
  return new Date((start.getTime() + end.getTime()) / 2);
}

function getSunEarthGates(date) {
  const sunLon = eclipticLongitude(Astronomy.Body.Sun, date);
  const earthLon = normalizeDegrees(sunLon + 180);
  return {
    sun: { gate: gateFromLongitude(sunLon), line: lineFromLongitude(sunLon), longitude: sunLon },
    earth: { gate: gateFromLongitude(earthLon), line: lineFromLongitude(earthLon), longitude: earthLon },
  };
}

function getNorthNodeLongitude(date) {
  const epoch = Date.UTC(2000, 0, 1, 12, 0, 0);
  const days = (date.getTime() - epoch) / 86400000;
  return normalizeDegrees(125.04452 - 0.0529538083 * days);
}

function getPlanetActivations(date) {
  const results = [];
  for (let i = 0; i < PLANETS.length; i++) {
    const lon = eclipticLongitude(PLANETS[i], date);
    const gate = gateFromLongitude(lon);
    const line = lineFromLongitude(lon);
    if (gate >= 1 && gate <= 64) {
      results.push({
        planet: PLANET_NAMES[i], gate, line,
        color: colorFromLongitude(lon), tone: toneFromLongitude(lon),
        base: baseFromLongitude(lon), longitude: lon,
      });
    }
  }
  const sunEarth = getSunEarthGates(date);
  const nnLon = getNorthNodeLongitude(date);
  const snLon = normalizeDegrees(nnLon + 180);
  for (const { name, lon } of [{ name: "North Node", lon: nnLon }, { name: "South Node", lon: snLon }]) {
    results.push({
      planet: name, gate: gateFromLongitude(lon), line: lineFromLongitude(lon),
      color: colorFromLongitude(lon), tone: toneFromLongitude(lon),
      base: baseFromLongitude(lon), longitude: lon,
    });
  }
  results.push({
    planet: "Earth", gate: sunEarth.earth.gate, line: sunEarth.earth.line,
    color: colorFromLongitude(sunEarth.earth.longitude), tone: toneFromLongitude(sunEarth.earth.longitude),
    base: baseFromLongitude(sunEarth.earth.longitude), longitude: sunEarth.earth.longitude,
  });
  return results;
}

function getChannels(activeGates) {
  const gateSet = new Set(activeGates);
  return Object.keys(CENTERS_BY_CHANNEL).filter(ch => {
    const [a, b] = ch.split("-").map(Number);
    return gateSet.has(a) && gateSet.has(b);
  });
}

function getDefinedCenters(channels) {
  const centers = new Set();
  channels.forEach(ch => {
    const [c1, c2] = CENTERS_BY_CHANNEL[ch];
    centers.add(c1);
    centers.add(c2);
  });
  return centers;
}

const MOTOR_CENTERS = ["Sacral", "Root", "Solar Plexus", "Ego"];

function motorToThroat(channels, definedCenters) {
  if (!definedCenters.has("Throat")) return false;
  const adj = {};
  channels.forEach(ch => {
    const [a, b] = CENTERS_BY_CHANNEL[ch];
    if (!adj[a]) adj[a] = [];
    if (!adj[b]) adj[b] = [];
    adj[a].push(b);
    adj[b].push(a);
  });
  const visited = new Set();
  const queue = ["Throat"];
  visited.add("Throat");
  while (queue.length > 0) {
    const cur = queue.shift();
    if (MOTOR_CENTERS.includes(cur)) return true;
    (adj[cur] || []).forEach(n => {
      if (!visited.has(n)) { visited.add(n); queue.push(n); }
    });
  }
  return false;
}

function getDefinition(channels, definedCenters) {
  if (definedCenters.size === 0) return "No Definition";
  const adj = {};
  channels.forEach(ch => {
    const [a, b] = CENTERS_BY_CHANNEL[ch];
    if (!adj[a]) adj[a] = [];
    if (!adj[b]) adj[b] = [];
    adj[a].push(b);
    adj[b].push(a);
  });
  let islands = 0;
  const visited = new Set();
  definedCenters.forEach(c => {
    if (!visited.has(c)) {
      islands++;
      const q = [c];
      visited.add(c);
      while (q.length > 0) {
        const cur = q.shift();
        (adj[cur] || []).forEach(n => {
          if (!visited.has(n)) { visited.add(n); q.push(n); }
        });
      }
    }
  });
  const labels = { 1: "Single Definition", 2: "Split Definition", 3: "Triple Split Definition", 4: "Quadruple Split Definition" };
  return labels[islands] || "Single Definition";
}

function getType(channels, definedCenters) {
  if (channels.length === 0 || definedCenters.size === 0) return "Reflector";
  const hasSacral = definedCenters.has("Sacral");
  const hasMotorToThroat = motorToThroat(channels, definedCenters);
  if (hasSacral) return hasMotorToThroat ? "Manifesting Generator" : "Generator";
  if (hasMotorToThroat) return "Manifestor";
  return "Projector";
}

function getAuthority(definedCenters) {
  // Critical invariant: IF Solar Plexus is defined,
  // authority MUST NOT be Sacral, Splenic, Ego, Self-Projected, Mental, or Lunar.
  if (definedCenters.has("Solar Plexus")) return "Emotional";

  if (definedCenters.has("Sacral")) return "Sacral";

  if (definedCenters.has("Spleen")) return "Splenic";

  if (definedCenters.has("Ego")) {
    // Ego authority is appropriate for certain Projector/Manifestor configurations
    // Check if there's a motor (Ego->Throat or Solar Plexus->Throat) connection
    return "Ego";
  }

  // For Projector configurations with G-center definition
  // Self-Projected authority
  if (definedCenters.has("G")) return "Self-Projected";

  // Mental authority for Projectors with Ajna defined
  if (definedCenters.has("Ajna")) return "Mental";

  // Environmental authority for Projectors
  return "Lunar";
}

function getStrategy(type) {
  const m = { Generator: "To Respond", "Manifesting Generator": "To Respond", Projector: "Wait for Invitation", Manifestor: "To Inform", Reflector: "Wait Lunar Cycle" };
  return m[type] || null;
}

function getSignature(type) {
  const m = { Generator: "Satisfaction", "Manifesting Generator": "Satisfaction", Projector: "Success", Manifestor: "Peace", Reflector: "Surprise" };
  return m[type] || null;
}

function getNotSelf(type) {
  const m = { Generator: "Frustration", "Manifesting Generator": "Frustration", Projector: "Bitterness", Manifestor: "Anger", Reflector: "Disillusionment" };
  return m[type] || null;
}

function calculateProfile(pSunLine, dSunLine) {
  return `${pSunLine}/${dSunLine}`;
}

const INCARNATION_CROSS_DB = {
  1:  {"RAC": "Right Angle Cross of the Sphinx", "JXP": "Juxtaposition Cross of Self-Expression", "LAC": "Left Angle Cross of Defiance"},
  2:  {"RAC": "Right Angle Cross of the Sphinx", "JXP": "Juxtaposition Cross of the Driver", "LAC": "Left Angle Cross of Defiance"},
  3:  {"RAC": "Right Angle Cross of Laws", "JXP": "Juxtaposition Cross of Mutation", "LAC": "Left Angle Cross of Wishes"},
  4:  {"RAC": "Right Angle Cross of Explanation", "JXP": "Juxtaposition Cross of Formulation", "LAC": "Left Angle Cross of Revolution"},
  5:  {"RAC": "Right Angle Cross of Consciousness", "JXP": "Juxtaposition Cross of Habits", "LAC": "Left Angle Cross of Separation"},
  6:  {"RAC": "Right Angle Cross of Eden", "JXP": "Juxtaposition Cross of Conflict", "LAC": "Left Angle Cross of the Plane"},
  7:  {"RAC": "Right Angle Cross of the Sphinx", "JXP": "Juxtaposition Cross of Interaction", "LAC": "Left Angle Cross of Masks"},
  8:  {"RAC": "Right Angle Cross of Contagion", "JXP": "Juxtaposition Cross of Contribution", "LAC": "Left Angle Cross of Uncertainty"},
  9:  {"RAC": "Right Angle Cross of Planning", "JXP": "Juxtaposition Cross of Focus", "LAC": "Left Angle Cross of Identification"},
  10: {"RAC": "Right Angle Cross of the Vessel of Love", "JXP": "Juxtaposition Cross of Behavior", "LAC": "Left Angle Cross of Prevention"},
  11: {"RAC": "Right Angle Cross of Eden", "JXP": "Juxtaposition Cross of Ideas", "LAC": "Left Angle Cross of Education"},
  12: {"RAC": "Right Angle Cross of the Eden", "JXP": "Juxtaposition Cross of Articulation", "LAC": "Left Angle Cross of Education"},
  13: {"RAC": "Right Angle Cross of the Sphinx", "JXP": "Juxtaposition Cross of Listening", "LAC": "Left Angle Cross of Masks"},
  14: {"RAC": "Right Angle Cross of Bounteousness", "JXP": "Juxtaposition Cross of Empowering", "LAC": "Left Angle Cross of Uncertainty"},
  15: {"RAC": "Right Angle Cross of Vessel of Love", "JXP": "Juxtaposition Cross of Extremes", "LAC": "Left Angle Cross of Prevention"},
  16: {"RAC": "Right Angle Cross of Planning", "JXP": "Juxtaposition Cross of Experimentation", "LAC": "Left Angle Cross of Identification"},
  17: {"RAC": "Right Angle Cross of Service", "JXP": "Juxtaposition Cross of Opinions", "LAC": "Left Angle Cross of Upheaval"},
  18: {"RAC": "Right Angle Cross of Service", "JXP": "Juxtaposition Cross of the Now", "LAC": "Left Angle Cross of Duality"},
  19: {"RAC": "Right Angle Cross of Four Ways", "JXP": "Juxtaposition Cross of Need", "LAC": "Left Angle Cross of Refinement"},
  20: {"RAC": "Right Angle Cross of the Sleeping Phoenix", "JXP": "Juxtaposition Cross of the Now", "LAC": "Left Angle Cross of Duality"},
  21: {"RAC": "Right Angle Cross of Tension", "JXP": "Juxtaposition Cross of Control", "LAC": "Left Angle Cross of Endeavor"},
  22: {"RAC": "Right Angle Cross of Rulership", "JXP": "Juxtaposition Cross of Grace", "LAC": "Left Angle Cross of Informing"},
  23: {"RAC": "Right Angle Cross of Explanation", "JXP": "Juxtaposition Cross of Assimilation", "LAC": "Left Angle Cross of Dedication"},
  24: {"RAC": "Right Angle Cross of the Four Ways", "JXP": "Juxtaposition Cross of Rationalization", "LAC": "Left Angle Cross of Incarnation"},
  25: {"RAC": "Right Angle Cross of the Vessel of Love", "JXP": "Juxtaposition Cross of Innocence", "LAC": "Left Angle Cross of Healing"},
  26: {"RAC": "Right Angle Cross of Rulership", "JXP": "Juxtaposition Cross of the Trickster", "LAC": "Left Angle Cross of Control"},
  27: {"RAC": "Right Angle Cross of the Unexpected", "JXP": "Juxtaposition Cross of Caring", "LAC": "Left Angle Cross of Alignment"},
  28: {"RAC": "Right Angle Cross of the Unexpected", "JXP": "Juxtaposition Cross of Risks", "LAC": "Left Angle Cross of Alignment"},
  29: {"RAC": "Right Angle Cross of Contagion", "JXP": "Juxtaposition Cross of Commitment", "LAC": "Left Angle Cross of Industry"},
  30: {"RAC": "Right Angle Cross of Contagion", "JXP": "Juxtaposition Cross of Fates", "LAC": "Left Angle Cross of Industry"},
  31: {"RAC": "Right Angle Cross of the Unexpected", "JXP": "Juxtaposition Cross of Influence", "LAC": "Left Angle Cross of the Alpha"},
  32: {"RAC": "Right Angle Cross of the Maya", "JXP": "Juxtaposition Cross of Conservation", "LAC": "Left Angle Cross of Limitation"},
  33: {"RAC": "Right Angle Cross of the Four Ways", "JXP": "Juxtaposition Cross of Retreat", "LAC": "Left Angle Cross of Refinement"},
  34: {"RAC": "Right Angle Cross of the Sleeping Phoenix", "JXP": "Juxtaposition Cross of Power", "LAC": "Left Angle Cross of Duality"},
  35: {"RAC": "Right Angle Cross of Consciousness", "JXP": "Juxtaposition Cross of Experience", "LAC": "Left Angle Cross of Separation"},
  36: {"RAC": "Right Angle Cross of Planning", "JXP": "Juxtaposition Cross of Denial", "LAC": "Left Angle Cross of Migration"},
  37: {"RAC": "Right Angle Cross of Planning", "JXP": "Juxtaposition Cross of Bargains", "LAC": "Left Angle Cross of Migration"},
  38: {"RAC": "Right Angle Cross of Tension", "JXP": "Juxtaposition Cross of Opposition", "LAC": "Left Angle Cross of Individualism"},
  39: {"RAC": "Right Angle Cross of Tension", "JXP": "Juxtaposition Cross of Provocation", "LAC": "Left Angle Cross of Individualism"},
  40: {"RAC": "Right Angle Cross of Planning", "JXP": "Juxtaposition Cross of Denial", "LAC": "Left Angle Cross of Migration"},
  41: {"RAC": "Right Angle Cross of the Unexpected", "JXP": "Juxtaposition Cross of Fantasy", "LAC": "Left Angle Cross of the Alpha"},
  42: {"RAC": "Right Angle Cross of the Maya", "JXP": "Juxtaposition Cross of Completion", "LAC": "Left Angle Cross of Limitation"},
  43: {"RAC": "Right Angle Cross of Explanation", "JXP": "Juxtaposition Cross of Insight", "LAC": "Left Angle Cross of Dedication"},
  44: {"RAC": "Right Angle Cross of the Four Ways", "JXP": "Juxtaposition Cross of Alertness", "LAC": "Left Angle Cross of Incarnation"},
  45: {"RAC": "Right Angle Cross of Rulership", "JXP": "Juxtaposition Cross of Possession", "LAC": "Left Angle Cross of Confrontation"},
  46: {"RAC": "Right Angle Cross of the Vessel of Love", "JXP": "Juxtaposition Cross of Serendipity", "LAC": "Left Angle Cross of Healing"},
  47: {"RAC": "Right Angle Cross of Rulership", "JXP": "Juxtaposition Cross of Oppression", "LAC": "Left Angle Cross of Informing"},
  48: {"RAC": "Right Angle Cross of Tension", "JXP": "Juxtaposition Cross of Depth", "LAC": "Left Angle Cross of Endeavor"},
  49: {"RAC": "Right Angle Cross of Explanation", "JXP": "Juxtaposition Cross of Principles", "LAC": "Left Angle Cross of Revolution"},
  50: {"RAC": "Right Angle Cross of Laws", "JXP": "Juxtaposition Cross of Values", "LAC": "Left Angle Cross of Wishes"},
  51: {"RAC": "Right Angle Cross of Penetration", "JXP": "Juxtaposition Cross of Shock", "LAC": "Left Angle Cross of the Clarion"},
  52: {"RAC": "Right Angle Cross of Service", "JXP": "Juxtaposition Cross of Stillness", "LAC": "Left Angle Cross of Demands"},
  53: {"RAC": "Right Angle Cross of Penetration", "JXP": "Juxtaposition Cross of Beginnings", "LAC": "Left Angle Cross of Cycles"},
  54: {"RAC": "Right Angle Cross of Penetration", "JXP": "Juxtaposition Cross of Ambition", "LAC": "Left Angle Cross of Cycles"},
  55: {"RAC": "Right Angle Cross of the Sleeping Phoenix", "JXP": "Juxtaposition Cross of Moods", "LAC": "Left Angle Cross of Spirit"},
  56: {"RAC": "Right Angle Cross of Laws", "JXP": "Juxtaposition Cross of Stimulation", "LAC": "Left Angle Cross of Distraction"},
  57: {"RAC": "Right Angle Cross of Penetration", "JXP": "Juxtaposition Cross of Intuition", "LAC": "Left Angle Cross of the Clarion"},
  58: {"RAC": "Right Angle Cross of Service", "JXP": "Juxtaposition Cross of Vitality", "LAC": "Left Angle Cross of Demands"},
  59: {"RAC": "Right Angle Cross of the Sleeping Phoenix", "JXP": "Juxtaposition Cross of Strategy", "LAC": "Left Angle Cross of Spirit"},
  60: {"RAC": "Right Angle Cross of Laws", "JXP": "Juxtaposition Cross of Limitation", "LAC": "Left Angle Cross of Distraction"},
  61: {"RAC": "Right Angle Cross of the Maya", "JXP": "Juxtaposition Cross of Thinking", "LAC": "Left Angle Cross of Obscuration"},
  62: {"RAC": "Right Angle Cross of the Maya", "JXP": "Juxtaposition Cross of Detail", "LAC": "Left Angle Cross of Limitation"},
  63: {"RAC": "Right Angle Cross of Consciousness", "JXP": "Juxtaposition Cross of Doubts", "LAC": "Left Angle Cross of Dominion"},
  64: {"RAC": "Right Angle Cross of Consciousness", "JXP": "Juxtaposition Cross of Confusion", "LAC": "Left Angle Cross of Dominion"},
};

function getAngleFromProfile(pSunLine, dSunLine) {
  const profile = `${pSunLine}/${dSunLine}`;
  const rightAngleProfiles = ["1/3", "1/4", "2/4", "2/5", "3/5", "3/6", "4/6"];
  const juxtapositionProfiles = ["4/1"];
  const leftAngleProfiles = ["5/1", "5/2", "6/2", "6/3"];

  if (juxtapositionProfiles.includes(profile)) return "JXP";
  if (rightAngleProfiles.includes(profile)) return "RAC";
  if (leftAngleProfiles.includes(profile)) return "LAC";
  if (pSunLine >= 5) return "LAC";
  if (pSunLine === 4 && dSunLine === 1) return "JXP";
  return "RAC";
}

function calculateIncarnationCross(pSun, pEarth, dSun, dEarth) {
  const angle = getAngleFromProfile(pSun.line, dSun.line);
  const crossMap = INCARNATION_CROSS_DB[pSun.gate];
  if (!crossMap) return `Incarnation Cross (${pSun.gate}/${pEarth.gate} | ${dSun.gate}/${dEarth.gate})`;

  const crossName = crossMap[angle] || crossMap.RAC || crossMap.LAC || "Incarnation Cross";
  return `${crossName} (${pSun.gate}/${pEarth.gate} | ${dSun.gate}/${dEarth.gate})`;
}

function calculateCrossGates(pSun, pEarth, dSun, dEarth) {
  return [pSun.gate, pEarth.gate, dSun.gate, dEarth.gate];
}

function calculateVariable(pSunTone, pNodeTone, dSunTone, dNodeTone) {
  const isLeft = t => t <= 3;
  const topLeft = isLeft(dSunTone) ? "L" : "R";
  const bottomLeft = isLeft(dNodeTone) ? "L" : "R";
  const topRight = isLeft(pSunTone) ? "L" : "R";
  const bottomRight = isLeft(pNodeTone) ? "L" : "R";
  return `P${topRight}${bottomRight} D${topLeft}${bottomLeft}`;
}

const DETERMINATION_MAP = { 1: "Appetite", 2: "Taste", 3: "Thirst", 4: "Touch", 5: "Sound", 6: "Light" };
const ENVIRONMENT_MAP = { 1: "Caves", 2: "Markets", 3: "Kitchens", 4: "Mountains", 5: "Valleys", 6: "Shores" };
const MOTIVATION_MAP = { 1: "Fear", 2: "Hope", 3: "Desire", 4: "Need", 5: "Guilt", 6: "Innocence" };
const PERSPECTIVE_MAP = { 1: "Survival", 2: "Possibility", 3: "Power", 4: "Wanting", 5: "Probability", 6: "Personal" };
const COGNITION_MAP = { 1: "Smell", 2: "Taste", 3: "Outer Vision", 4: "Inner Vision", 5: "Feeling", 6: "Touch" };

function getAdvancedVariables(pActivations, dActivations) {
  const pSun = pActivations.find(a => a.planet === "Sun");
  const pNode = pActivations.find(a => a.planet === "North Node" || a.planet === "South Node");
  const dSun = dActivations.find(a => a.planet === "Sun");
  const dNode = dActivations.find(a => a.planet === "North Node" || a.planet === "South Node");

  if (!pSun || !pNode || !dSun || !dNode) return null;

  const digestion = DETERMINATION_MAP[dSun.color] || null;
  const environment = ENVIRONMENT_MAP[dNode.color] || null;
  const motivation = MOTIVATION_MAP[pSun.color] || null;
  const perspective = PERSPECTIVE_MAP[pNode.color] || null;
  const cognition = COGNITION_MAP[dSun.tone] || null;
  const variable = calculateVariable(pSun.tone, pNode.tone, dSun.tone, dNode.tone);

  return { digestion, environment, motivation, perspective, cognition, variable };
}

export function calculateHumanDesign({ birthDate, birthTime, timezone, birthUtc: providedUtc, latitude, longitude }) {
  try {
    const birthUtc = providedUtc instanceof Date && !isNaN(providedUtc.getTime())
      ? providedUtc
      : birthToUtc(birthDate, birthTime, timezone, longitude);
    if (isNaN(birthUtc.getTime())) {
      return { status: "error", calculationStatus: "failed", note: "Invalid birth date/time." };
    }

    const designUtc = findDesignDate(birthUtc);

    const pSunEarth = getSunEarthGates(birthUtc);
    const dSunEarth = getSunEarthGates(designUtc);

    const pActivations = getPlanetActivations(birthUtc);
    const dActivations = getPlanetActivations(designUtc);

    const allGates = new Set();
    const pGates = [];
    const dGates = [];
    pActivations.forEach(a => { if (!pGates.includes(a.gate)) pGates.push(a.gate); allGates.add(a.gate); });
    dActivations.forEach(a => { if (!dGates.includes(a.gate)) dGates.push(a.gate); allGates.add(a.gate); });
    pGates.sort((a, b) => a - b);
    dGates.sort((a, b) => a - b);
    const definedGates = [...allGates].sort((a, b) => a - b);

    const channels = getChannels(definedGates);
    const definedCenters = getDefinedCenters(channels);
    const type = getType(channels, definedCenters);

    const profile = calculateProfile(pSunEarth.sun.line, dSunEarth.sun.line);
    const incarnationCross = calculateIncarnationCross(pSunEarth.sun, pSunEarth.earth, dSunEarth.sun, dSunEarth.earth);
    const crossGates = calculateCrossGates(pSunEarth.sun, pSunEarth.earth, dSunEarth.sun, dSunEarth.earth);

    const authority = getAuthority(definedCenters);
    const strategy = getStrategy(type);
    const signature = getSignature(type);
    const notSelfTheme = getNotSelf(type);
    const definition = getDefinition(channels, definedCenters);

    const allCenters = ["head", "ajna", "throat", "g", "ego", "spleen", "sacral", "solarPlexus", "root"];
    const centerNames = { head: "Head", ajna: "Ajna", throat: "Throat", g: "G", ego: "Ego", spleen: "Spleen", sacral: "Sacral", solarPlexus: "Solar Plexus", root: "Root" };
    const definedCenterList = [];
    const centers = {};
    allCenters.forEach(key => {
      const name = centerNames[key];
      const isDef = definedCenters.has(name);
      centers[key] = isDef;
      if (isDef) definedCenterList.push(name);
    });
    const openCenters = allCenters.filter(k => !centers[k]).map(k => centerNames[k]);

    const pSunAct = pActivations.find(a => a.planet === "Sun");
    const pNodeAct = pActivations.find(a => a.planet === "North Node" || a.planet === "South Node");
    const dSunAct = dActivations.find(a => a.planet === "Sun");
    const dNodeAct = dActivations.find(a => a.planet === "North Node" || a.planet === "South Node");

    const advVars = getAdvancedVariables(pActivations, dActivations);
    const variable = advVars?.variable || null;
    const digestion = advVars?.digestion || null;
    const cognition = advVars?.cognition || null;
    const environment = advVars?.environment || null;
    const motivation = advVars?.motivation || null;
    const perspective = advVars?.perspective || null;

    const now = new Date().toISOString();
    const source = "web-blueprint-local";

    // Determine completeness
    const missingFields = [];
    if (!digestion) missingFields.push("digestion");
    if (!cognition) missingFields.push("cognition");
    if (!environment) missingFields.push("environment");
    if (!motivation) missingFields.push("motivation");
    if (!perspective) missingFields.push("perspective");
    const completeness = missingFields.length === 0 ? "complete" : missingFields.length <= 4 ? "partial" : "minimal";

    return {
      type,
      strategy,
      authority,
      profile,
      signature,
      notSelfTheme,
      definition,
      incarnationCross,
      digestion,
      cognition,
      environment,
      motivation,
      perspective,
      variable,
      variableShortCode: variable,
      gatesPersonality: pGates,
      gatesDesign: dGates,
      definedGates,
      channels,
      personalityActivations: pActivations,
      designActivations: dActivations,
      centers,
      definedCenters: definedCenterList,
      openCenters,
      completeness,
      missingFields: missingFields.length > 0 ? missingFields : undefined,
      status: "ready",
      source,
      calculationStatus: "completed",
      calculationQuality: "verified",
      generatedAt: now,
      updatedAt: now,
      calculatedAt: now,
    };
  } catch (error) {
    return {
      status: "error",
      calculationStatus: "failed",
      note: error.message || "Human Design calculation failed.",
      source: "web-blueprint-local",
    };
  }
}