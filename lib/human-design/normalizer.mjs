import {
  HD_DEFAULTS, STRATEGY_MAP, AUTHORITY_MAP, SIGNATURE_MAP,
  NOT_SELF_MAP, DEFINITION_LABELS, CROSS_PREFIXES,
  PLANET_ORDER, ALL_CENTERS, CENTER_NAME_MAP,
} from './types.mjs';

function ensureString(value) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function ensureNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

// Sort gates numerically ascending, remove duplicates
function normalizeGatesArray(raw) {
  const arr = ensureArray(raw);
  const nums = arr
    .map(v => {
      if (typeof v === "number" && Number.isFinite(v)) return v;
      if (typeof v === "string") {
        const n = Number(v);
        if (Number.isFinite(n)) return n;
      }
      return null;
    })
    .filter(v => v !== null && v >= 1 && v <= 64);
  return [...new Set(nums)].sort((a, b) => a - b);
}

export function normalizeCrossName(raw) {
  if (!raw) return null;
  const match = raw.match(/\(\((\d+),\s*(\d+)\),\s*\((\d+),\s*(\d+)\)\)-(LAC|RAC|JXP)/);
  if (match) {
    const prefix = CROSS_PREFIXES[match[5]] || match[5];
    return `${prefix} of Incarnation (${match[1]}/${match[2]} | ${match[3]}/${match[4]})`;
  }
  return raw;
}

export function normalizeDefinition(value) {
  if (typeof value === "string" && value.trim()) {
    const trimmed = value.trim();
    if (trimmed === "No Definition") return "No Definition";
    const asNumber = Number(trimmed);
    if (Number.isFinite(asNumber) && DEFINITION_LABELS[asNumber]) {
      return DEFINITION_LABELS[asNumber];
    }
    return trimmed;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return DEFINITION_LABELS[value] || "Single Definition";
  }
  return "Single Definition";
}

function normalizeActivations(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map(item => {
      if (!item || typeof item !== "object") return null;
      const gate = ensureNumber(item.gate);
      const line = ensureNumber(item.line);
      if (gate === null || line === null) return null;
      if (gate < 1 || gate > 64) return null;
      if (line < 1 || line > 6) return null;
      return {
        planet: String(item.planet || ""),
        gate,
        line,
        color: item.color != null ? ensureNumber(item.color) : null,
        tone: item.tone != null ? ensureNumber(item.tone) : null,
        base: item.base != null ? ensureNumber(item.base) : null,
        longitude: item.longitude != null ? ensureNumber(item.longitude) : null,
      };
    })
    .filter(a => a !== null);
}

function normalizeCenters(rawDefinedCenters) {
  const raw = ensureArray(rawDefinedCenters).map(c => String(c).toLowerCase().replace(/[^a-z]/g, ""));
  const centers = {};
  const centerAliases = {
    head: ["head"],
    ajna: ["ajna"],
    throat: ["throat"],
    g: ["g", "gcenter"],
    ego: ["ego", "heart"],
    spleen: ["spleen", "splenic"],
    sacral: ["sacral"],
    solarPlexus: ["solarplexus", "solar plexus"],
    root: ["root"],
  };
  const definedCenters = [];
  for (const [key, aliases] of Object.entries(centerAliases)) {
    const defined = aliases.some(a => raw.includes(a));
    centers[key] = defined;
    if (defined) definedCenters.push(CENTER_NAME_MAP[key] || key);
  }
  const openCenters = ALL_CENTERS
    .filter(c => !centers[c])
    .map(c => CENTER_NAME_MAP[c] || c);
  return { centers, definedCenters, openCenters };
}

function deriveVariableShortCode(type) {
  if (!type) return null;
  const map = {
    Generator: "PLL DLR",
    "Manifesting Generator": "PLL DLR",
    Projector: "PRR DLL",
    Manifestor: "PRL DLR",
    Reflector: "PLL DLR",
  };
  return map[type] || null;
}

export function normalizeHumanDesignResponse(raw) {
  if (!raw || typeof raw !== "object") {
    return { ...HD_DEFAULTS, status: "error", calculationStatus: "error", note: "Invalid response from engine." };
  }

  if (
    raw.status === "service_unavailable" ||
    raw.calculationStatus === "service_unavailable" ||
    raw.calculationStatus === "timeout" ||
    raw.calculationStatus === "connection_error"
  ) {
    return {
      ...HD_DEFAULTS,
      status: "error",
      calculationStatus: raw.calculationStatus || "service_unavailable",
      note: raw.note || "Human Design service is not reachable.",
      source: "web-blueprint",
    };
  }

  if (raw.status !== "ready") {
    return {
      ...HD_DEFAULTS,
      status: "pending",
      calculationStatus: "pending",
      note: raw.note || "Human Design sedang diproses.",
      source: "web-blueprint",
    };
  }

  const type = ensureString(raw.type);
  if (!type) {
    return {
      ...HD_DEFAULTS,
      status: "error",
      calculationStatus: "error",
      note: "Human Design type not available from engine.",
      source: "web-blueprint",
    };
  }

  const strategy = ensureString(raw.strategy) || STRATEGY_MAP[type] || null;
  const authority = ensureString(raw.authority) ? String(raw.authority).replace(/ Authority$/, "") : (AUTHORITY_MAP[type] || null);
  const profile = ensureString(raw.profile) ? String(raw.profile).replace(/:.*$/, "") : null;
  const definition = normalizeDefinition(raw.definition);
  const signature = ensureString(raw.signature) ? String(raw.signature).replace(/ & .*$/, "") : (SIGNATURE_MAP[type] || null);
  const notSelfTheme = ensureString(raw.notSelfTheme) ? String(raw.notSelfTheme).replace(/ & .*$/, "") : (NOT_SELF_MAP[type] || null);
  const incarnationCross = normalizeCrossName(raw.inc_cross || raw.incarnationCross);

  const gatesPersonality = normalizeGatesArray(raw.gatesPersonality || raw.gates_personality);
  const gatesDesign = normalizeGatesArray(raw.gatesDesign || raw.gates_design);
  const definedGates = [...new Set([...gatesPersonality, ...gatesDesign])].sort((a, b) => a - b);

  const channels = ensureArray(raw.channels || raw.definedChannels || raw.defined_channels);

  const rawPersonalityActivations = raw.personalityActivations || raw.diagnostic?.raw_personality_gates || null;
  const rawDesignActivations = raw.designActivations || raw.diagnostic?.raw_design_gates || null;
  const personalityActivations = normalizeActivations(rawPersonalityActivations);
  const designActivations = normalizeActivations(rawDesignActivations);

  const { centers, definedCenters, openCenters } = normalizeCenters(raw.definedCenters);
  const { centers: _, ...rest } = { centers, definedCenters, openCenters };

  const rawVariables = raw.variables && typeof raw.variables === "object" ? raw.variables : null;

  const digestion = ensureString(raw.digestion) || (rawVariables ? ensureString(rawVariables.digestion) : null) || null;
  const environment = ensureString(raw.environment) || (rawVariables ? ensureString(rawVariables.environment) : null) || null;
  const motivation = ensureString(raw.motivation) || (rawVariables ? ensureString(rawVariables.motivation) : null) || null;
  const cognition = ensureString(raw.cognition) || (rawVariables ? ensureString(rawVariables.cognition) : null) || null;
  const perspective = ensureString(raw.perspective) || (rawVariables ? ensureString(rawVariables.perspective) : null) || null;
  const variable = ensureString(raw.variable) || ensureString(rawVariables?.variable) || null;
  const variableShortCode = deriveVariableShortCode(type);

  const now = new Date().toISOString();

  const missingFields = [];
  if (!digestion) missingFields.push("digestion");
  if (!cognition) missingFields.push("cognition");
  if (!environment) missingFields.push("environment");
  if (!motivation) missingFields.push("motivation");
  if (!perspective) missingFields.push("perspective");
  if (!personalityActivations.length) missingFields.push("personalityActivations");
  if (!designActivations.length) missingFields.push("designActivations");
  if (!gatesPersonality.length) missingFields.push("gatesPersonality");
  if (!gatesDesign.length) missingFields.push("gatesDesign");

  const completeness = missingFields.length === 0 ? "complete" : missingFields.length <= 4 ? "partial" : "minimal";

  return {
    type,
    strategy,
    authority,
    profile,
    definition,
    incarnationCross,
    signature,
    notSelfTheme,
    digestion,
    cognition,
    environment,
    motivation,
    perspective,
    variable,
    variableShortCode,
    gatesPersonality,
    gatesDesign,
    definedGates,
    personalityActivations,
    designActivations,
    centers,
    definedCenters,
    openCenters,
    channels,
    completeness,
    missingFields: missingFields.length > 0 ? missingFields : undefined,
    status: "ready",
    source: "web-blueprint",
    calculationStatus: "completed",
    calculationQuality: "verified",
    generatedAt: now,
    updatedAt: now,
    calculatedAt: now,
  };
}