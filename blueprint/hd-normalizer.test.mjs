import assert from "node:assert/strict";
import test from "node:test";

// ── normalizeHumanDesign (sama persis dengan definisi di index.html) ──
function normalizeHumanDesign(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      type: '-', strategy: '-', authority: '-', profile: '-',
      signature: '-', notSelfTheme: '-', incarnationCross: '-',
      definition: '-', digestion: '-', environment: '-',
      motivation: '-', cognition: '-', definedChannels: []
    };
  }

  const safeString = (v) => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number') return String(v);
    return null;
  };

  const fallbackDash = '-';

  const type         = safeString(raw.type) ?? fallbackDash;
  const strategy     = safeString(raw.strategy) ?? fallbackDash;
  const authority    = safeString(raw.authority) ?? fallbackDash;
  const profile      = safeString(raw.profile) ?? fallbackDash;
  const signature    = safeString(raw.signature) ?? fallbackDash;
  const notSelfTheme = safeString(raw.notSelfTheme) ?? fallbackDash;
  const definition   = safeString(raw.definition) ?? fallbackDash;

  let incarnationCross = fallbackDash;
  const ic = raw.incarnationCross;
  if (ic) {
    if (typeof ic === 'string') {
      incarnationCross = ic.trim() || fallbackDash;
    } else if (typeof ic === 'object') {
      const name = ic.name;
      if (typeof name === 'string' && name.trim()) {
        incarnationCross = name.trim();
      } else if (typeof ic.title === 'string' && ic.title.trim()) {
        incarnationCross = ic.title.trim();
      } else if (typeof ic.type === 'string') {
        const gatesPart = Array.isArray(ic.gates)
          ? ic.gates.join(', ')
          : '';
        incarnationCross = [ic.type, gatesPart].filter(Boolean).join(' ') || fallbackDash;
      }
    }
  }

  const vars = raw.variables && typeof raw.variables === 'object' ? raw.variables : {};

  const digestion    = safeString(raw.digestion) ?? safeString(vars.digestion) ?? fallbackDash;
  const environment  = safeString(raw.environment) ?? safeString(vars.environment) ?? fallbackDash;
  const motivation   = safeString(raw.motivation) ?? safeString(vars.motivation) ?? fallbackDash;
  const cognition    = safeString(raw.cognition) ?? safeString(vars.cognition) ?? fallbackDash;

  const channels = Array.isArray(raw.channels) ? raw.channels : [];
  const definedChannels = channels
    .filter(function (c) { return c != null; })
    .map(function (c) { return typeof c === 'string' ? c.trim() : String(c); })
    .filter(Boolean);

  return {
    type, strategy, authority, profile, signature, notSelfTheme,
    incarnationCross, definition, digestion, environment,
    motivation, cognition, definedChannels
  };
}

// ── FIXTURES ──

const pendingChart = {
  type: null, strategy: null, authority: null, profile: null,
  signature: null, notSelfTheme: null,
  incarnationCross: { name: null, gates: [] },
  definition: null,
  variables: null,
  digestion: null, environment: null, motivation: null, cognition: null,
  channels: []
};

const successChart = {
  type: "Projector",
  strategy: "Wait for the Invitation",
  authority: "Splenic Authority",
  profile: "2/4: Hermit Opportunist",
  signature: "Success",
  notSelfTheme: "Bitterness",
  incarnationCross: { name: "((38, 39), (48, 21))-RAC", gates: [] },
  definition: "Single Definition",
  variables: {
    digestion: "Appetite",
    environment: "Caves",
    motivation: "Fear",
    cognition: "Smell"
  },
  digestion: "Appetite",
  environment: "Caves",
  motivation: "Fear",
  cognition: "Smell",
  channels: ["38-28", "57-10", "44-26"]
};

const successChartNumericDefinition = {
  ...successChart,
  definition: 1
};

const successChartStringIncarnationCross = {
  ...successChart,
  incarnationCross: "((38, 39), (48, 21))-RAC"
};

const successChartNoVariables = {
  ...successChart,
  variables: null,
  digestion: null, environment: null, motivation: null, cognition: null
};

const emptyInput = null;
const undefinedInput = undefined;
const emptyObject = {};

// ── TESTS ──

test("1. Payload Human Design aktual dapat dinormalisasi — success chart", () => {
  const result = normalizeHumanDesign(successChart);
  assert.equal(result.type, "Projector");
  assert.equal(result.strategy, "Wait for the Invitation");
  assert.equal(result.authority, "Splenic Authority");
  assert.equal(result.profile, "2/4: Hermit Opportunist");
  assert.equal(result.signature, "Success");
  assert.equal(result.notSelfTheme, "Bitterness");
  assert.equal(result.incarnationCross, "((38, 39), (48, 21))-RAC");
});

test("2. Semua field utama muncul sebagai string", () => {
  const result = normalizeHumanDesign(successChart);
  const stringFields = [
    "type", "strategy", "authority", "profile", "signature",
    "notSelfTheme", "incarnationCross", "definition",
    "digestion", "environment", "motivation", "cognition"
  ];
  for (const field of stringFields) {
    assert.equal(typeof result[field], "string",
      `Field "${field}" should be a string, got ${typeof result[field]}`);
  }
});

test("3. Incarnation Cross tidak pernah menjadi [object Object]", () => {
  // Pending chart — sebelumnya [object Object]
  const pending = normalizeHumanDesign(pendingChart);
  assert.equal(pending.incarnationCross, "-");
  assert.notEqual(pending.incarnationCross, "[object Object]");

  // Null input
  const nullResult = normalizeHumanDesign(null);
  assert.equal(nullResult.incarnationCross, "-");
  assert.notEqual(nullResult.incarnationCross, "[object Object]");

  // Object with null name
  const crossNullName = normalizeHumanDesign({
    ...pendingChart,
    incarnationCross: { name: null, gates: [1, 2] }
  });
  assert.equal(crossNullName.incarnationCross, "-");
  assert.notEqual(crossNullName.incarnationCross, "[object Object]");

  // Object with empty string name
  const crossEmptyName = normalizeHumanDesign({
    ...pendingChart,
    incarnationCross: { name: "", gates: [1, 2] }
  });
  assert.equal(crossEmptyName.incarnationCross, "-");
  assert.notEqual(crossEmptyName.incarnationCross, "[object Object]");
});

test("4. Defined Channels tampil apabila tersedia", () => {
  const result = normalizeHumanDesign(successChart);
  assert.deepEqual(result.definedChannels, ["38-28", "57-10", "44-26"]);
  assert.equal(result.definedChannels.length, 3);

  // Pending chart — channels kosong
  const pending = normalizeHumanDesign(pendingChart);
  assert.deepEqual(pending.definedChannels, []);
  assert.equal(pending.definedChannels.length, 0);
});

test("5. Payload lama yang masih didukung tidak mengalami regresi", () => {
  // Payload dengan incarnationCross string langsung (format lama)
  const result = normalizeHumanDesign(successChartStringIncarnationCross);
  assert.equal(result.incarnationCross, "((38, 39), (48, 21))-RAC");
  assert.equal(result.type, "Projector");
  assert.equal(result.definition, "Single Definition");

  // Payload dengan numeric definition
  const numDef = normalizeHumanDesign(successChartNumericDefinition);
  assert.equal(numDef.definition, "1");
});

test("6. Missing optional field tetap menghasilkan fallback aman", () => {
  // Null/undefined input
  assert.deepEqual(normalizeHumanDesign(null).type, "-");
  assert.deepEqual(normalizeHumanDesign(undefined).type, "-");

  // Empty object
  const empty = normalizeHumanDesign({});
  assert.equal(empty.type, "-");
  assert.equal(empty.strategy, "-");
  assert.equal(empty.incarnationCross, "-");
  assert.equal(empty.digestion, "-");

  // Partial object
  const partial = normalizeHumanDesign({ type: "Projector" });
  assert.equal(partial.type, "Projector");
  assert.equal(partial.strategy, "-");
  assert.equal(partial.incarnationCross, "-");
});

test("7. Incarnation Cross dengan struktur title/type juga terdeteksi", () => {
  const withTitle = normalizeHumanDesign({
    ...pendingChart,
    incarnationCross: { title: "Right Angle Cross of Title", gates: [10, 20] }
  });
  assert.equal(withTitle.incarnationCross, "Right Angle Cross of Title");

  const withTypeNoName = normalizeHumanDesign({
    ...pendingChart,
    incarnationCross: { type: "Left Angle Cross", gates: [1, 2, 3, 4] }
  });
  assert.equal(withTypeNoName.incarnationCross, "Left Angle Cross 1, 2, 3, 4");
});

test("8. Variables fallback: root field > variables object > dash", () => {
  // Root field available
  const rootVars = normalizeHumanDesign(successChart);
  assert.equal(rootVars.digestion, "Appetite");
  assert.equal(rootVars.environment, "Caves");

  // Root null, vars object available
  const varsOnly = normalizeHumanDesign({
    ...pendingChart,
    variables: { digestion: "Taste", environment: "Markets" }
  });
  assert.equal(varsOnly.digestion, "Taste");
  assert.equal(varsOnly.environment, "Markets");

  // Both missing → dash
  const noVars = normalizeHumanDesign(successChartNoVariables);
  assert.equal(noVars.digestion, "-");
  assert.equal(noVars.environment, "-");
  assert.equal(noVars.motivation, "-");
  assert.equal(noVars.cognition, "-");
});

test("9. Defined Channels menangani non-array dengan aman", () => {
  const nonArray = normalizeHumanDesign({ ...pendingChart, channels: "38-28" });
  assert.deepEqual(nonArray.definedChannels, []);

  const mixed = normalizeHumanDesign({ ...pendingChart, channels: ["38-28", null, 47] });
  // null gets filtered, 47 stays
  assert.equal(mixed.definedChannels.length, 2);
});

test("10. [object Object] tidak muncul di mana pun", () => {
  const cases = [
    normalizeHumanDesign(successChart),
    normalizeHumanDesign(pendingChart),
    normalizeHumanDesign(null),
    normalizeHumanDesign({}),
    normalizeHumanDesign({ incarnationCross: { name: null, gates: [] } }),
    normalizeHumanDesign({ incarnationCross: "string cross" }),
  ];
  for (const c of cases) {
    for (const [key, val] of Object.entries(c)) {
      if (key === "definedChannels") continue;
      assert.notEqual(val, "[object Object]",
        `Field "${key}" should not be "[object Object]", got "${val}"`);
    }
  }
});
