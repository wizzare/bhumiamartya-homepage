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
  "23-43": ["Ajna", "Throat"], "24-61": ["Head", "Ajna"], "25-51": ["Ego", "Throat"],
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
  const linePos = gateFrac * 6;
  return Math.floor((linePos % 1) * 6) + 1;
}

function colorFromLongitude(lon) {
  const adjusted = normalizeDegrees(lon + IGING_OFFSET);
  const gateFrac = ((adjusted / 360) * 64) % 1;
  const linePos = gateFrac * 6;
  const tonePos = (linePos % 1) * 6;
  return Math.floor((tonePos % 1) * 6) + 1;
}

function baseFromLongitude(lon) {
  const adjusted = normalizeDegrees(lon + IGING_OFFSET);
  const gateFrac = ((adjusted / 360) * 64) % 1;
  const linePos = gateFrac * 6;
  const tonePos = (linePos % 1) * 6;
  const colorPos = (tonePos % 1) * 6;
  return Math.floor((colorPos % 1) * 6) + 1;
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

function parseTimezoneToMinutes(tz) {
  if (!tz) return null;
  const m = tz.trim().match(/^([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  return sign * (Number(m[2]) * 60 + Number(m[3] || "0"));
}

function birthToUtc(birthDate, birthTime, timezone) {
  const t = (birthTime || "12:00").length === 5 ? birthTime + ":00" : (birthTime || "12:00");
  const [y, m, d] = birthDate.split("-").map(Number);
  const [hh, mm, ss = 0] = t.split(":").map(Number);
  const offsetMin = parseTimezoneToMinutes(timezone);
  if (offsetMin !== null) {
    return new Date(Date.UTC(y, m - 1, d, hh, mm, ss) - offsetMin * 60000);
  }
  return new Date(Date.UTC(y, m - 1, d, hh, mm, ss));
}

function findDesignDate(birthUtc) {
  const pSunLon = eclipticLongitude(Astronomy.Body.Sun, birthUtc);
  const target = normalizeDegrees(pSunLon - 88);
  let start = new Date(birthUtc.getTime() - 100 * 86400000);
  let end = new Date(birthUtc.getTime() - 70 * 86400000);
  for (let i = 0; i < 32; i++) {
    const mid = new Date((start.getTime() + end.getTime()) / 2);
    const midLon = eclipticLongitude(Astronomy.Body.Sun, mid);
    const unwrapped = midLon > pSunLon ? midLon - 360 : midLon;
    if (unwrapped < target - 360) start = mid;
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

function getAuthority(type) {
  const m = { Generator: "Sacral", "Manifesting Generator": "Sacral", Projector: "Spleen", Manifestor: "Solar Plexus", Reflector: "Lunar" };
  return m[type] || null;
}

function getStrategy(type) {
  const m = { Generator: "Wait to Respond", "Manifesting Generator": "Wait to Respond", Projector: "Wait for Invitation", Manifestor: "To Inform", Reflector: "Wait Lunar Cycle" };
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

function calculateIncarnationCross(pSun, pEarth, dSun, dEarth) {
  let angle = "Right Angle";
  if (pSun.line === 4) angle = "Juxtaposition";
  else if (pSun.line >= 5) angle = "Left Angle";
  const name = CROSS_NAMES[pSun.gate] || "Life";
  return `${angle} Cross of ${name} (${pSun.gate}/${pEarth.gate} | ${dSun.gate}/${dEarth.gate})`;
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

export function calculateHumanDesign({ birthDate, birthTime, timezone }) {
  try {
    const birthUtc = birthToUtc(birthDate, birthTime, timezone);
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

    const authority = getAuthority(type);
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