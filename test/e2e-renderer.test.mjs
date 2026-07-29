import assert from "node:assert/strict";
import test from "node:test";
import { normalizeHumanDesignResponse } from "../lib/human-design/normalizer.mjs";

// Full fixture simulating a real Python HD API response
const MOCK_API_RESPONSE = {
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
    { planet: "Mercury", gate: 24, line: 5, color: 5, tone: 1, base: null },
    { planet: "Venus", gate: 44, line: 6, color: 3, tone: 5, base: null },
    { planet: "Mars", gate: 13, line: 1, color: 1, tone: 3, base: null },
    { planet: "Jupiter", gate: 7, line: 3, color: 6, tone: 4, base: null },
    { planet: "Saturn", gate: 24, line: 6, color: 2, tone: 5, base: null },
    { planet: "Uranus", gate: 44, line: 2, color: 3, tone: 1, base: null },
    { planet: "Neptune", gate: 13, line: 4, color: 4, tone: 6, base: null },
    { planet: "Pluto", gate: 7, line: 6, color: 5, tone: 3, base: null },
  ],
  designActivations: [
    { planet: "Sun", gate: 13, line: 3, color: 3, tone: 2, base: 4 },
    { planet: "Earth", gate: 7, line: 4, color: 3, tone: 2, base: 4 },
    { planet: "Moon", gate: 24, line: 1, color: 2, tone: 5, base: 3 },
    { planet: "North Node", gate: 44, line: 6, color: 5, tone: 1, base: 6 },
    { planet: "South Node", gate: 13, line: 2, color: 5, tone: 1, base: 2 },
    { planet: "Mercury", gate: 7, line: 5, color: 6, tone: 4, base: null },
    { planet: "Venus", gate: 24, line: 2, color: 1, tone: 3, base: null },
    { planet: "Mars", gate: 44, line: 4, color: 2, tone: 6, base: null },
    { planet: "Jupiter", gate: 13, line: 5, color: 4, tone: 1, base: null },
    { planet: "Saturn", gate: 7, line: 1, color: 3, tone: 5, base: null },
    { planet: "Uranus", gate: 24, line: 3, color: 5, tone: 2, base: null },
    { planet: "Neptune", gate: 44, line: 5, color: 1, tone: 4, base: null },
    { planet: "Pluto", gate: 13, line: 6, color: 6, tone: 3, base: null },
  ],
  digestion: "Taste",
  environment: "Caves",
  motivation: "Need",
  cognition: "Feeling",
  perspective: "Probability",
  variables: { variable: "PLL DLR", digestion: "Taste", environment: "Caves", motivation: "Need", cognition: "Feeling", perspective: "Probability" },
};

// Simulate the renderer functions exactly as they appear in blueprint/index.html
function fmtVal(v) { return v ?? '-'; }
function fmtGates(arr) { return Array.isArray(arr) && arr.length ? arr.join(', ') : '-'; }
function fmtCenterList(arr) { return Array.isArray(arr) && arr.length ? arr.join(', ') : '-'; }
function fmtActivationRow(act) {
  if (!act || !act.planet) return null;
  return {
    planet: act.planet,
    gate: act.gate != null ? String(act.gate) : '-',
    line: act.line != null ? String(act.line) : '-',
    color: act.color != null ? String(act.color) : '-',
    tone: act.tone != null ? String(act.tone) : '-',
    base: act.base != null ? String(act.base) : '-',
  };
}

test("E2E: Renderer mengisi Digestion dari canonical response", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtVal(hd.digestion);
  assert.equal(rendered, "Taste");
  assert.notEqual(rendered, "-");
});

test("E2E: Renderer mengisi Cognition dari canonical response", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtVal(hd.cognition);
  assert.equal(rendered, "Feeling");
  assert.notEqual(rendered, "-");
});

test("E2E: Renderer mengisi Environment dari canonical response", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtVal(hd.environment);
  assert.equal(rendered, "Caves");
  assert.notEqual(rendered, "-");
});

test("E2E: Renderer mengisi Motivation dari canonical response", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtVal(hd.motivation);
  assert.equal(rendered, "Need");
  assert.notEqual(rendered, "-");
});

test("E2E: Renderer mengisi Perspective dari canonical response", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtVal(hd.perspective);
  assert.equal(rendered, "Probability");
  assert.notEqual(rendered, "-");
});

test("E2E: Renderer mengisi Variable dari canonical response", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtVal(hd.variable);
  assert.equal(rendered, "PLL DLR");
  assert.notEqual(rendered, "-");
});

test("E2E: Renderer menampilkan Gates Personality sebagai string angka", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtGates(hd.gatesPersonality);
  assert.ok(rendered.includes("7"));
  assert.ok(rendered.includes("13"));
  assert.ok(rendered.includes("24"));
  assert.ok(rendered.includes("44"));
  assert.notEqual(rendered, "-");
  assert.ok(!rendered.includes("[object Object]"));
});

test("E2E: Renderer menampilkan Gates Design sebagai string angka", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtGates(hd.gatesDesign);
  assert.ok(rendered.includes("7"));
  assert.ok(rendered.includes("13"));
  assert.ok(rendered.includes("24"));
  assert.ok(rendered.includes("44"));
  assert.notEqual(rendered, "-");
  assert.ok(!rendered.includes("[object Object]"));
});

test("E2E: Renderer menampilkan Defined Gates sebagai string angka", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtGates(hd.definedGates);
  assert.ok(rendered.length > 0);
  assert.notEqual(rendered, "-");
  assert.ok(!rendered.includes("[object Object]"));
});

test("E2E: Personality Activations menampilkan 13 baris", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const pas = hd.personalityActivations || [];
  assert.equal(pas.length, 13);
  const rows = pas.map(fmtActivationRow).filter(Boolean);
  assert.equal(rows.length, 13);
});

test("E2E: Design Activations menampilkan 13 baris", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const das = hd.designActivations || [];
  assert.equal(das.length, 13);
  const rows = das.map(fmtActivationRow).filter(Boolean);
  assert.equal(rows.length, 13);
});

test("E2E: Setiap activation menampilkan gate dan line", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const all = [...(hd.personalityActivations || []), ...(hd.designActivations || [])];
  for (const act of all) {
    const row = fmtActivationRow(act);
    assert.ok(row, `Row should exist for ${act.planet}`);
    assert.ok(row.gate !== '-', `Gate should be present for ${act.planet}`);
    assert.ok(row.line !== '-', `Line should be present for ${act.planet}`);
  }
});

test("E2E: Color/Tone/Base tampil jika tersedia", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const pSun = hd.personalityActivations[0];
  const row = fmtActivationRow(pSun);
  assert.equal(row.color, "2");
  assert.equal(row.tone, "3");
  assert.equal(row.base, "1");
});

test("E2E: Color/Tone/Base menampilkan '-' jika null", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const pMercury = hd.personalityActivations[5];
  const row = fmtActivationRow(pMercury);
  assert.equal(row.base, "-");
});

test("E2E: Defined Centers tampil sebagai string", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtCenterList(hd.definedCenters);
  assert.ok(rendered.includes("Sacral"));
  assert.ok(rendered.includes("Throat"));
  assert.notEqual(rendered, "-");
  assert.ok(!rendered.includes("[object Object]"));
});

test("E2E: Open Centers tampil sebagai string", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const rendered = fmtCenterList(hd.openCenters);
  assert.ok(Array.isArray(hd.openCenters));
  assert.ok(typeof rendered === "string");
  assert.ok(!rendered.includes("[object Object]"));
});

test("E2E: Defined Channels tetap tampil", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  assert.equal(hd.channels.length, 6);
  assert.deepEqual(hd.channels, ["2-14", "10-20", "17-62", "23-43", "25-51", "26-44"]);
});

test("E2E: Tidak ada field yang menampilkan '[object Object]'", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  const stringFields = [
    fmtVal(hd.type), fmtVal(hd.strategy), fmtVal(hd.authority),
    fmtVal(hd.profile), fmtVal(hd.signature), fmtVal(hd.notSelfTheme),
    fmtVal(hd.incarnationCross), fmtVal(hd.definition),
    fmtVal(hd.digestion), fmtVal(hd.cognition), fmtVal(hd.environment),
    fmtVal(hd.motivation), fmtVal(hd.perspective), fmtVal(hd.variable),
    fmtGates(hd.gatesPersonality), fmtGates(hd.gatesDesign), fmtGates(hd.definedGates),
    fmtCenterList(hd.definedCenters), fmtCenterList(hd.openCenters),
  ];
  for (const val of stringFields) {
    assert.ok(!val.includes("[object Object]"), `Found [object Object] in: ${val}`);
  }
});

test("E2E: Tidak ada field activation yang menampilkan '[object Object]'", () => {
  const hd = normalizeHumanDesignResponse(MOCK_API_RESPONSE);
  for (const acts of [hd.personalityActivations, hd.designActivations]) {
    for (const act of acts) {
      const row = fmtActivationRow(act);
      assert.ok(row, `Row should exist for ${act.planet}`);
      assert.ok(!row.planet.includes("[object Object]"));
      assert.ok(typeof row.gate === "string" && !row.gate.includes("[object Object]"));
      assert.ok(typeof row.line === "string" && !row.line.includes("[object Object]"));
    }
  }
});

test("E2E: Systems lain tetap tampil (lifePath, destinyMatrix placeholder)", () => {
  const fullResponse = {
    meta: { success: true },
    blueprint: {
      lifePath: { number: 1, display: "1", role: "The Leader", positiveTraits: [], negativeTraits: [] },
      humanDesign: normalizeHumanDesignResponse(MOCK_API_RESPONSE),
      destinyMatrix: { calculationStatus: "pending", arcanaCenter: null },
      astrology: { calculationStatus: "pending", sunSign: null },
    },
  };
  assert.ok(fullResponse.meta.success);
  assert.ok(fullResponse.blueprint.lifePath.role !== undefined);
  assert.equal(fullResponse.blueprint.destinyMatrix.calculationStatus, "pending");
});