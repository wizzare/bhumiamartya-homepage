import assert from "node:assert/strict";
import test from "node:test";
import {
  calculatePersonNatal,
  calculateSynastryAspects,
  calculateSynastryCouple,
  getAspectInterpretation,
  synthesizeRelationship,
  angularDistance,
  normalizeLongitude,
  formatDegreeMinute,
  formatOrb,
  PLANET_ORDER
} from "../lib/synastry/calculate.mjs";
import { buildSynastrySvgBiWheel } from "../lib/synastry/chartSvg.mjs";

const FIXTURE_WIDHI = {
  name: "Widhi Wedhaswara",
  birthDate: "1985-05-03",
  birthTime: "23:45",
  birthCity: "Jakarta, Indonesia",
  latitude: -6.2088,
  longitude: 106.8456,
  timezone: "+07:00"
};

const FIXTURE_PARTNER = {
  name: "Ayu Kartika",
  birthDate: "1988-10-17",
  birthTime: "12:00",
  birthCity: "Bandung, Indonesia",
  latitude: -6.9175,
  longitude: 107.6191,
  timezone: "+07:00"
};

test("Synastry: calculatePersonNatal calculates accurate positions for Golden Widhi", () => {
  const chart = calculatePersonNatal(FIXTURE_WIDHI);
  assert.equal(chart.isTimeKnown, true);
  assert.equal(chart.sunSign, "Taurus");
  assert.equal(chart.moonSign, "Libra");
  assert.equal(chart.risingSign, "Aquarius");

  // Verify Sun within 0.1 deg of 43.2 deg
  assert.ok(Math.abs(chart.planets.Sun.longitude - 43.19) <= 0.1, "Sun longitude around 43.19 deg");
  // Verify Moon within 0.1 deg of 207.14 deg
  assert.ok(Math.abs(chart.planets.Moon.longitude - 207.14) <= 0.1, "Moon longitude around 207.14 deg");

  for (const name of PLANET_ORDER) {
    const p = chart.planets[name];
    assert.ok(p, `Planet ${name} exists`);
    assert.ok(Number.isFinite(p.longitude), `${name} longitude is numeric`);
    assert.ok(p.degree >= 0 && p.degree < 30, `${name} degree 0-30`);
    assert.equal(typeof p.retrograde, "boolean", `${name} retrograde is boolean`);
  }
});

test("Synastry: handles unknown birth time without claiming false Ascendant or houses", () => {
  const chart = calculatePersonNatal({
    name: "Rahasia",
    birthDate: "1990-06-15",
    isTimeUnknown: true,
    birthCity: "Surabaya"
  });

  assert.equal(chart.isTimeKnown, false);
  assert.equal(chart.risingSign, null);
  assert.equal(chart.angles, null);
  assert.ok(chart.timePrecisionNote.includes("Jam lahir tidak diketahui"));
  assert.ok(Number.isFinite(chart.planets.Sun.longitude));
  assert.ok(Number.isFinite(chart.planets.Moon.longitude));
});

test("Synastry: angularDistance and normalizeLongitude invariants", () => {
  assert.equal(normalizeLongitude(0), 0);
  assert.equal(normalizeLongitude(360), 0);
  assert.equal(normalizeLongitude(-30), 330);
  assert.equal(normalizeLongitude(750), 30);

  assert.equal(angularDistance(10, 20), 10);
  assert.equal(angularDistance(350, 10), 20);
  assert.equal(angularDistance(10, 350), 20);
  assert.equal(angularDistance(0, 180), 180);
  assert.equal(angularDistance(0, 190), 170);
});

test("Synastry: calculateSynastryCouple generates complete synastry analysis", () => {
  const synastry = calculateSynastryCouple(FIXTURE_WIDHI, FIXTURE_PARTNER);

  assert.equal(synastry.engineVersion, "bhumi-synastry-v1.0.0");
  assert.ok(synastry.aspects.length > 0, "Synastry produces aspects");
  assert.ok(Array.isArray(synastry.aspects));

  for (const a of synastry.aspects) {
    assert.ok(["Conjunction", "Opposition", "Trine", "Square", "Sextile"].includes(a.type));
    assert.ok(a.orb >= 0 && a.orb <= 9, `Orb ${a.orb} is within valid bounds`);
    assert.ok(a.interpretation, "Aspect has interpretation");
    assert.ok(a.interpretation.title, "Interpretation has title");
    assert.ok(a.interpretation.summary, "Interpretation has summary");
    assert.ok(!a.interpretation.summary.includes("undefined"));
  }

  // Verify categories
  assert.ok(synastry.categories.emotional !== undefined);
  assert.ok(synastry.categories.communication !== undefined);
  assert.ok(synastry.categories.attraction !== undefined);
  assert.ok(synastry.categories.growth !== undefined);
  assert.ok(synastry.categories.challenge !== undefined);

  // Verify synthesis
  assert.ok(synastry.synthesis.elementSynergy.description);
  assert.ok(synastry.synthesis.aspectMetrics.harmonyFlowRatio);
  assert.ok(synastry.synthesis.reflectiveConclusion);
});

test("Synastry: buildSynastrySvgBiWheel generates valid and populated SVG", () => {
  const synastry = calculateSynastryCouple(FIXTURE_WIDHI, FIXTURE_PARTNER);
  const svg = buildSynastrySvgBiWheel(synastry, { chartId: "test-wheel" });

  assert.ok(svg.startsWith("<svg"), "Output is SVG element");
  assert.ok(svg.includes("test-wheel"), "Contains chartId");
  assert.ok(svg.includes("person-a-planets"), "Contains Person A planets");
  assert.ok(svg.includes("person-b-planets"), "Contains Person B planets");
  assert.ok(svg.includes("Ari") && svg.includes("Pis"), "Contains Zodiac signs");
  assert.ok(svg.endsWith("</svg>"), "SVG is well-formed");
});
