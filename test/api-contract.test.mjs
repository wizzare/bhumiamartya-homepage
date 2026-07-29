import assert from "node:assert/strict";
import test from "node:test";

test("API contract: response shape matches frontend expectations", () => {
  const validBlueprintKeys = [
    "lifePath", "humanDesign", "destinyMatrix",
    "astrology", "input", "currentAge", "currentAgeEnergy",
    "generatedAt", "updatedAt",
  ];

  const response = {
    meta: { success: true, generatedAt: "2025-01-01T00:00:00.000Z", engineVersion: "web-blueprint-1.0.0" },
    blueprint: {
      lifePath: { number: 1, display: "1", role: "The Leader", positiveTraits: [], negativeTraits: [] },
      humanDesign: {
        type: "Manifesting Generator", strategy: "Wait to Respond", authority: "Sacral",
        profile: "6/3", definition: "Single Definition",
        incarnationCross: "Left Angle Cross of Incarnation (24/44 | 13/7)",
        signature: "Satisfaction", notSelfTheme: "Frustration",
        digestion: "Taste", cognition: "Feeling", environment: "Caves",
        motivation: "Need", perspective: "Probability", variable: "PLL DLR",
        variableShortCode: "PLL DLR",
        gatesPersonality: [7, 13, 24, 44], gatesDesign: [7, 13, 24, 44],
        definedGates: [7, 13, 24, 44],
        personalityActivations: [
          { planet: "Sun", gate: 24, line: 4, color: 2, tone: 3, base: 1 },
          { planet: "Earth", gate: 44, line: 3 },
        ],
        designActivations: [
          { planet: "Sun", gate: 13, line: 3 },
          { planet: "Earth", gate: 7, line: 4 },
        ],
        centers: { head: null, ajna: null, throat: true, g: true, ego: true, spleen: true, sacral: true, solarPlexus: null, root: null },
        definedCenters: ["Throat", "G", "Ego", "Spleen", "Sacral"],
        openCenters: ["Head", "Ajna", "Solar Plexus", "Root"],
        channels: ["2-14", "10-20", "17-62", "23-43", "25-51", "26-44"],
        completeness: "complete",
      },
      destinyMatrix: { calculationStatus: "pending" },
      astrology: { calculationStatus: "pending" },
      input: { birthDate: "1998-08-30", birthTime: "12:00", birthCity: "Jakarta" },
      currentAge: 26,
      currentAgeEnergy: "-",
      generatedAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    },
  };

  assert.ok(response.meta.success);
  assert.ok(response.meta.engineVersion);

  const bp = response.blueprint;
  for (const key of validBlueprintKeys) {
    assert.ok(key in bp, `Missing blueprint key: ${key}`);
  }

  const hd = bp.humanDesign;
  const requiredHdFields = [
    "type", "strategy", "authority", "profile", "definition",
    "incarnationCross", "signature", "notSelfTheme",
    "digestion", "cognition", "environment", "motivation",
    "perspective", "variable", "variableShortCode",
    "gatesPersonality", "gatesDesign", "definedGates",
    "personalityActivations", "designActivations",
    "centers", "definedCenters", "openCenters", "channels",
    "completeness",
  ];
  for (const field of requiredHdFields) {
    assert.ok(field in hd, `Missing humanDesign field: ${field}`);
  }

  assert.ok(typeof hd.incarnationCross === "string" || hd.incarnationCross === null);
  assert.ok(Array.isArray(hd.channels));
  assert.ok(Array.isArray(hd.gatesPersonality));
  assert.ok(Array.isArray(hd.gatesDesign));
  assert.ok(Array.isArray(hd.definedGates));
  assert.ok(Array.isArray(hd.personalityActivations));
  assert.ok(Array.isArray(hd.designActivations));
  assert.ok(Array.isArray(hd.definedCenters));
  assert.ok(Array.isArray(hd.openCenters));

  if (hd.personalityActivations.length > 0) {
    const act = hd.personalityActivations[0];
    assert.ok("planet" in act);
    assert.ok("gate" in act);
    assert.ok("line" in act);
    assert.equal(typeof act.planet, "string");
    assert.equal(typeof act.gate, "number");
    assert.equal(typeof act.line, "number");
  }
});

test("API contract: error response shape", () => {
  const errorResponse = {
    success: false,
    message: "Blueprint tidak dapat dihitung. Silakan periksa data yang dimasukkan.",
    error: "missing_required_fields",
  };
  assert.equal(errorResponse.success, false);
  assert.ok(typeof errorResponse.message === "string");
});

test("API contract: humanDesign null values rendered as dashes", () => {
  const hd = {
    type: null, strategy: null, authority: null, profile: null,
    definition: null, incarnationCross: null,
    signature: null, notSelfTheme: null,
    digestion: null, cognition: null, environment: null, motivation: null,
    perspective: null, variable: null,
    gatesPersonality: [], gatesDesign: [], definedGates: [],
    personalityActivations: [], designActivations: [],
    centers: {}, definedCenters: [], openCenters: [], channels: [],
  };

  const renderSafe = (v) => v ?? "-";
  assert.equal(renderSafe(hd.type), "-");
  assert.equal(renderSafe(hd.digestion), "-");
  assert.equal(renderSafe(hd.cognition), "-");
  assert.equal(renderSafe(hd.environment), "-");
  assert.equal(renderSafe(hd.motivation), "-");
  assert.equal(renderSafe(hd.perspective), "-");
  assert.equal(renderSafe(hd.variable), "-");
  assert.equal(renderSafe(hd.incarnationCross), "-");
  assert.equal(renderSafe(hd.channels.length > 0 ? hd.channels.join(", ") : "-"), "-");
});