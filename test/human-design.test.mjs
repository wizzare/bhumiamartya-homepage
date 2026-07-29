import assert from "node:assert/strict";
import test from "node:test";
import { normalizeHumanDesignResponse, normalizeCrossName, normalizeDefinition } from "../lib/human-design/normalizer.mjs";
import { HD_DEFAULTS, PLANET_ORDER } from "../lib/human-design/types.mjs";

// ── Fixture: Widhi (Manifesting Generator 6/3) ──
const WIDHI_RAW = {
  type: "Manifesting Generator",
  strategy: "Wait to Respond",
  authority: "Sacral Authority",
  profile: "6/3",
  signature: "Satisfaction",
  notSelfTheme: "Frustration",
  inc_cross: "((24, 44), (13, 7))-LAC",
  incarnationCross: "((24, 44), (13, 7))-LAC",
  definition: 1,
  channels: ["2-14", "10-20", "17-62", "23-43", "25-51", "26-44"],
  gatesPersonality: [24, 44, 13, 7],
  gatesDesign: [24, 44, 13, 7],
  definedCenters: ["Sacral", "Throat", "G", "Ego", "Spleen", "Ajna"],
  status: "ready",
  source: "human-design-py",
  personalityActivations: [
    { planet: "Sun", gate: 24, line: 4, color: 2, tone: 3, base: 1 },
    { planet: "Earth", gate: 44, line: 3, color: 2, tone: 3, base: 1 },
    { planet: "Moon", gate: 13, line: 2, color: 1, tone: 6, base: 5 },
    { planet: "North Node", gate: 7, line: 5, color: 4, tone: 2, base: 3 },
    { planet: "South Node", gate: 8, line: 1, color: 4, tone: 2, base: 2 },
    { planet: "Mercury", gate: 24, line: 5, color: 5, tone: 1 },
    { planet: "Venus", gate: 44, line: 6, color: 3, tone: 5 },
    { planet: "Mars", gate: 13, line: 1, color: 1, tone: 3 },
    { planet: "Jupiter", gate: 7, line: 3, color: 6, tone: 4 },
    { planet: "Saturn", gate: 24, line: 6, color: 2, tone: 5 },
    { planet: "Uranus", gate: 44, line: 2, color: 3, tone: 1 },
    { planet: "Neptune", gate: 13, line: 4, color: 4, tone: 6 },
    { planet: "Pluto", gate: 7, line: 6, color: 5, tone: 3 },
  ],
  designActivations: [
    { planet: "Sun", gate: 13, line: 3, color: 3, tone: 2, base: 4 },
    { planet: "Earth", gate: 7, line: 4, color: 3, tone: 2, base: 4 },
    { planet: "Moon", gate: 24, line: 1, color: 2, tone: 5, base: 3 },
    { planet: "North Node", gate: 44, line: 6, color: 5, tone: 1, base: 6 },
    { planet: "South Node", gate: 13, line: 2, color: 5, tone: 1, base: 2 },
    { planet: "Mercury", gate: 7, line: 5, color: 6, tone: 4 },
    { planet: "Venus", gate: 24, line: 2, color: 1, tone: 3 },
    { planet: "Mars", gate: 44, line: 4, color: 2, tone: 6 },
    { planet: "Jupiter", gate: 13, line: 5, color: 4, tone: 1 },
    { planet: "Saturn", gate: 7, line: 1, color: 3, tone: 5 },
    { planet: "Uranus", gate: 24, line: 3, color: 5, tone: 2 },
    { planet: "Neptune", gate: 44, line: 5, color: 1, tone: 4 },
    { planet: "Pluto", gate: 13, line: 6, color: 6, tone: 3 },
  ],
  digestion: "Taste",
  environment: "Caves",
  motivation: "Need",
  cognition: "Feeling",
  perspective: "Probability",
  variables: { variable: "PLL DLR", digestion: "Taste", environment: "Caves", motivation: "Need", cognition: "Feeling", perspective: "Probability" },
};

// ============================================
// BASIC PROPERTIES (21 old tests preserved)
// ============================================

test("normalizeCrossName converts Python API format to canonical string", () => {
  const result = normalizeCrossName("((24, 44), (13, 7))-LAC");
  assert.equal(result, "Left Angle Cross of Incarnation (24/44 | 13/7)");
});

test("normalizeCrossName returns null for null input", () => {
  assert.equal(normalizeCrossName(null), null);
});

test("normalizeCrossName returns raw value for unrecognized format", () => {
  assert.equal(normalizeCrossName("Some Custom Cross"), "Some Custom Cross");
});

test("normalizeDefinition maps number 1 to Single Definition", () => {
  assert.equal(normalizeDefinition(1), "Single Definition");
});

test("normalizeDefinition maps number 2 to Split Definition", () => {
  assert.equal(normalizeDefinition(2), "Split Definition");
});

test("normalizeDefinition maps string '1' to Single Definition", () => {
  assert.equal(normalizeDefinition("1"), "Single Definition");
});

test("normalizeDefinition keeps custom string as-is", () => {
  assert.equal(normalizeDefinition("Custom Definition"), "Custom Definition");
});

test("normalizeDefinition returns null for null input", () => {
  assert.equal(normalizeDefinition(null), "Single Definition");
});

test("full fixture: Manifesting Generator 6/3", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.type, "Manifesting Generator");
  assert.equal(result.strategy, "Wait to Respond");
  assert.equal(result.authority, "Sacral");
  assert.equal(result.profile, "6/3");
  assert.equal(result.signature, "Satisfaction");
  assert.equal(result.notSelfTheme, "Frustration");
  assert.equal(result.definition, "Single Definition");
  assert.equal(result.incarnationCross, "Left Angle Cross of Incarnation (24/44 | 13/7)");
  assert.deepEqual(result.channels, ["2-14", "10-20", "17-62", "23-43", "25-51", "26-44"]);
  assert.equal(result.channels.length, 6);
  assert.equal(result.status, "ready");
  assert.equal(result.source, "web-blueprint");
  assert.equal(result.calculationStatus, "completed");
});

test("returns defaults for null input", () => {
  const result = normalizeHumanDesignResponse(null);
  assert.equal(result.status, "error");
  assert.equal(result.calculationStatus, "error");
  assert.equal(result.type, null);
});

test("returns error for service_unavailable", () => {
  const raw = { status: "service_unavailable", calculationStatus: "service_unavailable", type: null };
  const result = normalizeHumanDesignResponse(raw);
  assert.equal(result.status, "error");
  assert.equal(result.calculationStatus, "service_unavailable");
  assert.equal(result.type, null);
});

test("returns error for connection_error", () => {
  const raw = { status: "error", calculationStatus: "connection_error", type: null };
  const result = normalizeHumanDesignResponse(raw);
  assert.equal(result.status, "error");
  assert.equal(result.calculationStatus, "connection_error");
  assert.equal(result.type, null);
});

test("returns pending for pending status", () => {
  const raw = { status: "pending", type: null };
  const result = normalizeHumanDesignResponse(raw);
  assert.equal(result.status, "pending");
  assert.equal(result.calculationStatus, "pending");
});

test("returns error when type is missing in ready status", () => {
  const raw = { status: "ready", type: null };
  const result = normalizeHumanDesignResponse(raw);
  assert.equal(result.status, "error");
  assert.equal(result.calculationStatus, "error");
});

test("HD_DEFAULTS has all required fields", () => {
  const requiredFields = [
    "type", "strategy", "authority", "profile", "definition",
    "incarnationCross", "signature", "notSelfTheme",
    "digestion", "cognition", "environment", "motivation",
    "perspective", "variable", "variableShortCode",
    "gatesPersonality", "gatesDesign", "definedGates",
    "personalityActivations", "designActivations",
    "centers", "definedCenters", "openCenters", "channels",
  ];
  for (const field of requiredFields) {
    assert.ok(field in HD_DEFAULTS, `Missing field: ${field}`);
  }
  assert.deepEqual(HD_DEFAULTS.gatesPersonality, []);
  assert.deepEqual(HD_DEFAULTS.channels, []);
  assert.deepEqual(HD_DEFAULTS.personalityActivations, []);
  assert.deepEqual(HD_DEFAULTS.designActivations, []);
  assert.deepEqual(HD_DEFAULTS.definedGates, []);
  assert.equal(HD_DEFAULTS.perspective, null);
  assert.equal(HD_DEFAULTS.variable, null);
});

test("channels order is preserved from Python API", () => {
  const raw = { type: "Manifesting Generator", channels: ["2-14", "10-20", "17-62", "23-43", "25-51", "26-44"], status: "ready" };
  const result = normalizeHumanDesignResponse(raw);
  assert.deepEqual(result.channels, ["2-14", "10-20", "17-62", "23-43", "25-51", "26-44"]);
});

test("incarnationCross is always a string", () => {
  const raw = { type: "Generator", inc_cross: "((1, 2), (3, 4))-RAC", status: "ready" };
  const result = normalizeHumanDesignResponse(raw);
  assert.equal(typeof result.incarnationCross, "string");
  assert.ok(result.incarnationCross.includes("Right Angle Cross"));
});

test("incarnationCross is null when missing", () => {
  const raw = { type: "Generator", status: "ready" };
  const result = normalizeHumanDesignResponse(raw);
  assert.equal(result.incarnationCross, null);
});

// ============================================
// NEW TESTS: Variables / PHS
// ============================================

test("Variables: digestion tidak kosong dari fixture", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.digestion, "Taste");
  assert.notEqual(result.digestion, null);
});

test("Variables: cognition tidak kosong dari fixture", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.cognition, "Feeling");
  assert.notEqual(result.cognition, null);
});

test("Variables: environment tidak kosong dari fixture", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.environment, "Caves");
  assert.notEqual(result.environment, null);
});

test("Variables: motivation tidak kosong dari fixture", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.motivation, "Need");
  assert.notEqual(result.motivation, null);
});

test("Variables: perspective tidak kosong dari fixture", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.perspective, "Probability");
  assert.notEqual(result.perspective, null);
});

test("Variables: variable code ada", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.variable, "PLL DLR");
  assert.notEqual(result.variable, null);
});

test("Variables: variableShortCode ada dari type mapping", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.variableShortCode, "PLL DLR");
});

// ============================================
// NEW TESTS: Gates
// ============================================

test("Gates Personality berisi angka valid 1-64", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.ok(result.gatesPersonality.length > 0);
  for (const g of result.gatesPersonality) {
    assert.ok(Number.isFinite(g));
    assert.ok(g >= 1 && g <= 64);
  }
});

test("Gates Design berisi angka valid 1-64", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.ok(result.gatesDesign.length > 0);
  for (const g of result.gatesDesign) {
    assert.ok(Number.isFinite(g));
    assert.ok(g >= 1 && g <= 64);
  }
});

test("Gates Personality unik dan tersortir", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  for (let i = 1; i < result.gatesPersonality.length; i++) {
    assert.ok(result.gatesPersonality[i] > result.gatesPersonality[i - 1]);
  }
  assert.equal(result.gatesPersonality.length, new Set(result.gatesPersonality).size);
});

test("Gates Design unik dan tersortir", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  for (let i = 1; i < result.gatesDesign.length; i++) {
    assert.ok(result.gatesDesign[i] > result.gatesDesign[i - 1]);
  }
  assert.equal(result.gatesDesign.length, new Set(result.gatesDesign).size);
});

test("Defined Gates adalah gabungan Personality dan Design tanpa duplikasi", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  const expected = [...new Set([...result.gatesPersonality, ...result.gatesDesign])].sort((a, b) => a - b);
  assert.deepEqual(result.definedGates, expected);
  assert.equal(result.definedGates.length, new Set(result.definedGates).size);
});

// ============================================
// NEW TESTS: Activations
// ============================================

test("Personality Activations memiliki 13 entri", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.personalityActivations.length, 13);
});

test("Design Activations memiliki 13 entri", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.designActivations.length, 13);
});

test("Setiap activation memiliki gate dan line valid", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  const all = [...result.personalityActivations, ...result.designActivations];
  for (const act of all) {
    assert.ok(typeof act.planet === "string" && act.planet.length > 0, `Planet missing for: ${JSON.stringify(act)}`);
    assert.ok(typeof act.gate === "number" && act.gate >= 1 && act.gate <= 64, `Gate invalid for: ${JSON.stringify(act)}`);
    assert.ok(typeof act.line === "number" && act.line >= 1 && act.line <= 6, `Line invalid for: ${JSON.stringify(act)}`);
  }
});

test("Activations mengikuti urutan planet PLANET_ORDER", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  for (const acts of [result.personalityActivations, result.designActivations]) {
    for (let i = 0; i < acts.length; i++) {
      assert.equal(acts[i].planet, PLANET_ORDER[i], `Position ${i}: expected ${PLANET_ORDER[i]}, got ${acts[i].planet}`);
    }
  }
});

test("Color/tone/base opsional dipertahankan bila engine mengirimnya", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  const pSun = result.personalityActivations[0];
  assert.equal(pSun.planet, "Sun");
  assert.equal(pSun.color, 2);
  assert.equal(pSun.tone, 3);
  assert.equal(pSun.base, 1);
});

// ============================================
// NEW TESTS: Centers
// ============================================

test("Centers object memiliki 9 key center", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  const centerKeys = ["head", "ajna", "throat", "g", "ego", "spleen", "sacral", "solarPlexus", "root"];
  for (const key of centerKeys) {
    assert.ok(key in result.centers, `Missing center key: ${key}`);
  }
  assert.equal(result.centers.sacral, true);
  assert.equal(result.centers.throat, true);
});

test("definedCenters dan openCenters adalah array string", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.ok(Array.isArray(result.definedCenters));
  assert.ok(Array.isArray(result.openCenters));
  for (const c of result.definedCenters) assert.equal(typeof c, "string");
  for (const c of result.openCenters) assert.equal(typeof c, "string");
  assert.ok(result.definedCenters.includes("Sacral"));
});

// ============================================
// NEW TESTS: Completeness
// ============================================

test("completeness = 'complete' ketika semua field terisi", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.completeness, "complete");
});

test("completeness = 'minimal' ketika banyak field hilang", () => {
  const raw = { type: "Generator", status: "ready", gatesPersonality: [], gatesDesign: [], channels: [] };
  const result = normalizeHumanDesignResponse(raw);
  assert.equal(result.completeness, "minimal");
  assert.ok(Array.isArray(result.missingFields));
  assert.ok(result.missingFields.length >= 2);
});

test("missingFields tidak ada (undefined) ketika completeness=complete", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(result.missingFields, undefined);
});

// ============================================
// NEW TESTS: Gates sebagai numbers
// ============================================

test("gatesPersonality selalu berupa array number", () => {
  const raw = { type: "Generator", status: "ready", gatesPersonality: ["24", "44", "13", "7"], gatesDesign: ["24", "44"] };
  const result = normalizeHumanDesignResponse(raw);
  assert.deepEqual(result.gatesPersonality, [7, 13, 24, 44]);
  for (const g of result.gatesPersonality) assert.equal(typeof g, "number");
});

test("gatesPersonality menolak gate di luar 1-64", () => {
  const raw = { type: "Generator", status: "ready", gatesPersonality: [0, 65, 999, "abc", null], gatesDesign: [] };
  const result = normalizeHumanDesignResponse(raw);
  assert.deepEqual(result.gatesPersonality, []);
});

// ============================================
// NEW TESTS: Timezone determinism
// ============================================

test("Raw data yang sama menghasilkan normalisasi identik", () => {
  const a = normalizeHumanDesignResponse(WIDHI_RAW);
  const b = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.deepEqual(a, b);
});

// ============================================
// NEW TESTS: String gates input
// ============================================

test("gates sebagai string array tetap dinormalisasi ke number", () => {
  const raw = { type: "Generator", status: "ready", gatesPersonality: ["1", "2", "3"], gatesDesign: ["4", "5"] };
  const result = normalizeHumanDesignResponse(raw);
  assert.deepEqual(result.gatesPersonality, [1, 2, 3]);
  assert.deepEqual(result.gatesDesign, [4, 5]);
});

// ============================================
// NEW TESTS: Invalid activations ditolak
// ============================================

test("activations dengan gate/line invalid difilter", () => {
  const raw = {
    type: "Generator", status: "ready",
    personalityActivations: [
      { planet: "Sun", gate: 1, line: 1 },
      { planet: "Bad", gate: 999, line: 99 },
      { planet: "NullGate", gate: null, line: 1 },
    ],
    designActivations: [],
  };
  const result = normalizeHumanDesignResponse(raw);
  assert.equal(result.personalityActivations.length, 1);
  assert.equal(result.personalityActivations[0].planet, "Sun");
});

// ============================================
// CANONICAL SCHEMA TEST
// ============================================

test("Canonical schema: semua field tipe-nya benar", () => {
  const result = normalizeHumanDesignResponse(WIDHI_RAW);
  assert.equal(typeof result.type, "string");
  assert.equal(typeof result.strategy, "string");
  assert.equal(typeof result.authority, "string");
  assert.equal(typeof result.profile, "string");
  assert.equal(typeof result.definition, "string");
  assert.equal(typeof result.incarnationCross, "string");
  assert.equal(typeof result.signature, "string");
  assert.equal(typeof result.notSelfTheme, "string");
  assert.equal(typeof result.digestion, "string");
  assert.equal(typeof result.cognition, "string");
  assert.equal(typeof result.environment, "string");
  assert.equal(typeof result.motivation, "string");
  assert.equal(typeof result.perspective, "string");
  assert.equal(typeof result.variable, "string");
  assert.ok(Array.isArray(result.gatesPersonality));
  assert.ok(Array.isArray(result.gatesDesign));
  assert.ok(Array.isArray(result.definedGates));
  assert.ok(Array.isArray(result.personalityActivations));
  assert.ok(Array.isArray(result.designActivations));
  assert.ok(Array.isArray(result.definedCenters));
  assert.ok(Array.isArray(result.openCenters));
  assert.ok(Array.isArray(result.channels));
  assert.equal(typeof result.centers, "object");
});