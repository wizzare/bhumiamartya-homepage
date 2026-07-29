import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import blueprintHandler from "../api/blueprint.mjs";
import { calculateNatalChart } from "../lib/natal-chart/calculate.mjs";
import { normalizeNatalChartResponse } from "../lib/natal-chart/normalize.mjs";

const WIDHI = { fullName: "Widhi Wedhaswara", birthDate: "1985-05-03", birthTime: "23:45", birthCity: "Jakarta, Indonesia", latitude: -6.2088, longitude: 106.8456, timezone: "+07:00" };
const MAIN_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const run = input => calculateNatalChart(input);
const sum = object => Object.values(object).reduce((total, value) => total + value, 0);

function noUndefined(value) {
  if (Array.isArray(value)) return value.every(noUndefined);
  if (!value || typeof value !== "object") return value !== undefined;
  return Object.values(value).every(noUndefined);
}

test("Natal Golden Widhi: verified Tropical/Placidus chart restores the required signs and houses", () => {
  const chart = run(WIDHI);
  assert.equal(chart.calculationStatus, "completed");
  assert.equal(chart.zodiacSystem, "Tropical");
  assert.equal(chart.houseSystem, "Placidus");
  assert.deepEqual([chart.sunSign, chart.moonSign, chart.risingSign, chart.midheaven], ["Taurus", "Libra", "Aquarius", "Scorpio"]);
  const expected = {
    Sun: ["Taurus", 4, false], Moon: ["Libra", 9, false], Mercury: ["Aries", 3, false], Venus: ["Aries", 2, false], Mars: ["Gemini", 4, false],
    Jupiter: ["Aquarius", 1, false], Saturn: ["Scorpio", 10, true], Uranus: ["Sagittarius", 11, true], Neptune: ["Capricorn", 11, true], Pluto: ["Scorpio", 9, true],
  };
  for (const [name, [sign, house, retrograde]] of Object.entries(expected)) assert.deepEqual([chart.planets[name].sign, chart.planets[name].house, chart.planets[name].retrograde], [sign, house, retrograde], name);
  assert.ok(Math.abs(chart.planets.Sun.longitude - 43.2) <= 0.1, "Sun must stay within the stated 0.10 degree tolerance");
});

test("Natal Golden Widhi: verified Placidus angles use the exact 23:45 WIB input", () => {
  const chart = run(WIDHI);
  assert.ok(Math.abs(chart.ascendantLongitude - 309.2) <= 0.1, "ASC Aquarius about 9 degrees 12 minutes");
  assert.ok(Math.abs(chart.midheavenLongitude - 222.05) <= 0.1, "MC Scorpio about 12 degrees 03 minutes");
  assert.notEqual(chart.ascendantLongitude, 312.8647, "the retired historical zenith formula must not be used");
});

test("Natal: four additional cross-date fixtures remain deterministic", () => {
  const fixtures = [
    [{ birthDate: "1990-01-01", birthTime: "12:00", latitude: -6.2088, longitude: 106.8456, timezone: "+07:00" }, ["Capricorn", "Aquarius", "Aries", "Capricorn"]],
    [{ birthDate: "1992-06-15", birthTime: "08:30", latitude: -6.9175, longitude: 107.6191, timezone: "+07:00" }, ["Gemini", "Sagittarius", "Cancer", "Taurus"]],
    [{ birthDate: "1988-10-17", birthTime: "12:00", latitude: -6.2088, longitude: 106.8456, timezone: "+07:00" }, ["Libra", "Capricorn", "Capricorn", "Libra"]],
    [{ birthDate: "2000-12-31", birthTime: "23:30", latitude: 1.3521, longitude: 103.8198, timezone: "+08:00" }, ["Capricorn", "Pisces", "Virgo", "Gemini"]],
  ];
  for (const [input, expected] of fixtures) {
    const chart = run(input);
    assert.deepEqual([chart.sunSign, chart.moonSign, chart.risingSign, chart.midheaven], expected, input.birthDate);
    assert.equal(Object.keys(chart.planets).length, 13);
  }
});

test("Natal: all planet, house, aspect, and balance contracts are numeric and complete", () => {
  const chart = run(WIDHI);
  for (const name of MAIN_PLANETS) {
    const planet = chart.planets[name];
    assert.ok(Number.isFinite(planet.longitude), `${name} longitude`);
    assert.ok(planet.degree >= 0 && planet.degree < 30, `${name} degree`);
    assert.ok(Number.isInteger(planet.house) && planet.house >= 1 && planet.house <= 12, `${name} house`);
    assert.equal(typeof planet.retrograde, "boolean", `${name} retrograde`);
  }
  assert.equal(Object.keys(chart.houses).length, 12);
  const expectedCusps = [309.205, 338.6063, 10.3068, 42.0617, 71.9735, 100.4692, 129.205, 158.6063, 190.3068, 222.0617, 251.9735, 280.4692];
  for (let house = 1; house <= 12; house += 1) {
    const cusp = chart.houses[house]; const opposite = chart.houses[((house + 5) % 12) + 1];
    assert.ok(Number.isFinite(cusp.longitude) && cusp.degree >= 0 && cusp.degree < 30);
    assert.ok(Math.abs(cusp.longitude - expectedCusps[house - 1]) <= 0.1, `verified Placidus cusp ${house}`);
    assert.ok(Math.abs((((opposite.longitude - cusp.longitude) % 360) + 360) % 360 - 180) < 0.0001, `opposite cusp ${house}`);
  }
  const seenPairs = new Set();
  for (const aspect of chart.aspects) {
    assert.ok(["Conjunction", "Opposition", "Trine", "Square", "Sextile"].includes(aspect.type));
    const pair = [aspect.planet1, aspect.planet2].sort().join("/");
    assert.ok(!seenPairs.has(pair), `duplicate aspect ${pair}`); seenPairs.add(pair);
  }
  assert.equal(sum(chart.elements), 21); assert.equal(sum(chart.modalities), 21); assert.equal(sum(chart.polarities), 21);
  assert.ok(chart.dominantElement && chart.dominantModality && chart.dominantPolarity);
});

test("Natal angles react to the supplied time without a fixture-specific offset", () => {
  const at2345 = run(WIDHI);
  const at2347 = run({ ...WIDHI, birthTime: "23:47" });
  assert.notEqual(at2345.ascendantLongitude, at2347.ascendantLongitude);
  assert.notEqual(at2345.midheavenLongitude, at2347.midheavenLongitude);
});

test("Natal normalizer preserves the canonical completed response without undefined or required nulls", () => {
  const chart = normalizeNatalChartResponse(run(WIDHI));
  assert.equal(chart.calculationStatus, "completed");
  assert.deepEqual(chart.placidusHouses, chart.houses);
  assert.ok(noUndefined(chart));
  for (const name of MAIN_PLANETS) assert.notEqual(chart.planets[name], null);
  assert.ok(!JSON.stringify(chart).includes("[object Object]"));
});

test("Blueprint API exposes one normalized Natal result while leaving Golden systems unchanged", async () => {
  const response = { status: null, body: null, writeHead(status) { this.status = status; }, end(body) { this.body = body; } };
  await blueprintHandler({ method: "POST", body: WIDHI }, response);
  const payload = JSON.parse(response.body); const blueprint = payload.blueprint;
  assert.equal(response.status, 200);
  assert.equal(payload.meta.systems.astrology, "ready");
  assert.equal(blueprint.astrology.calculationStatus, "completed");
  assert.deepEqual(blueprint.astrology, blueprint.natalChart);
  assert.equal(blueprint.lifePath.number, 4);
  assert.equal(blueprint.humanDesign.type, "Manifesting Generator");
  assert.equal(blueprint.humanDesign.profile, "6/3");
  assert.equal(blueprint.destinyMatrix.arcanaCenter, 8);
  assert.deepEqual([blueprint.destinyMatrix.totalPhysics, blueprint.destinyMatrix.totalEnergy, blueprint.destinyMatrix.totalEmotion], [10, 18, 10]);
});

test("Natal renderer contains dynamic canonical fields and no application-domain dependency", async () => {
  const [renderer, api] = await Promise.all([readFile(new URL("../blueprint/index.html", import.meta.url), "utf8"), readFile(new URL("../api/blueprint.mjs", import.meta.url), "utf8")]);
  for (const id of ["res-natal-sun", "res-natal-moon", "res-natal-rising", "res-natal-mc", "natal-planets-body", "natal-houses-body", "res-natal-aspects", "res-natal-elements", "res-natal-modalities", "natal-wheel-canvas"]) assert.ok(renderer.includes(id), id);
  assert.ok(renderer.includes("Number(planet.longitude)"));
  assert.ok(!api.includes("bhumi-amartya-clean"));
  assert.ok(!api.includes("HUMAN_DESIGN_SERVICE_URL"));
});
