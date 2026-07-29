import assert from "node:assert/strict";
import test from "node:test";
import { calculateDestinyMatrix, reduceMatrixValue } from "../lib/destiny-matrix/calculate.mjs";
import blueprintHandler from "../api/blueprint.mjs";

const REF = "2026-07-29";

test("Destiny Matrix Golden: Widhi restores the complete public Blueprint", () => {
  const matrix = calculateDestinyMatrix("1985-05-03", { referenceDate: REF });
  assert.equal(matrix.calculationStatus, "completed");
  assert.equal(matrix.arcanaCenter, 8);
  assert.deepEqual(matrix.commonEnergy, [8, 7, 15]);
  assert.deepEqual(matrix.jalurEkonomi, [5, 18, 13, 20, 7]);
  assert.equal(matrix.angkaDollar, 20);
  assert.deepEqual(matrix.jalurCinta, [7, 10, 21]);
  assert.equal(matrix.angkaHeart, 10);
  assert.deepEqual(matrix.karmicTailLegacy, [21, 7, 13]);
  assert.deepEqual(matrix.karmaAyah, [13, 7, 21]);
  assert.deepEqual(matrix.karmaIbu, [10, 10, 18]);
  assert.deepEqual(matrix.bakatAyah, [8, 5, 15]);
  assert.deepEqual(matrix.bakatIbu, [10, 9, 17]);
  assert.deepEqual(matrix.bakatAgung, [5, 18, 13]);
  assert.deepEqual(matrix.purposes, {
    skypoint: 18, earthpoint: 8, perspurpose: 8, femalepoint: 8,
    malepoint: 8, socialpurpose: 16, generalpurpose: 6, planetarypurpose: 22,
  });
  assert.equal(matrix.totalPhysics, 10);
  assert.equal(matrix.totalEnergy, 18);
  assert.equal(matrix.totalEmotion, 10);
  assert.equal(matrix.currentAge, 41);
  assert.equal(matrix.currentAgeEnergy, 15);
  assert.equal(matrix.activeAgeRange, "41–42 tahun");
  assert.equal(matrix.previous.arcana, 5);
  assert.equal(matrix.next.arcana, 10);
});

test("Destiny Matrix historical descendant graph remains stable for additional birth dates", () => {
  const fixtures = [
    ["2012-06-16", [16, 6, 5, 9, 9, 22, 11, 7, 14, 18, 14, 7, 15, 5, 21, 19, 9, 16, 6, 5, 5, 19, 9, 18, 4, 8, 20, 4, 16, 5, 5, 19]],
    ["1988-10-17", [17, 10, 8, 8, 7, 9, 18, 7, 16, 15, 15, 6, 17, 5, 9, 5, 5, 13, 6, 3, 18, 18, 5, 12, 14, 5, 5, 5, 12, 19, 21, 10]],
    ["1989-01-06", [6, 1, 9, 16, 5, 7, 10, 22, 7, 21, 14, 11, 6, 17, 7, 5, 10, 16, 11, 8, 11, 22, 10, 15, 17, 6, 20, 3, 5, 9, 17, 6]],
  ];
  for (const [birthDate, expected] of fixtures) {
    const actual = Object.values(calculateDestinyMatrix(birthDate, { referenceDate: REF }).rawGraph);
    assert.deepEqual(actual, expected, birthDate);
  }
});

test("Destiny Matrix reducer and dates are calculated, not fixture-dependent", () => {
  assert.equal(reduceMatrixValue(52), 7);
  assert.equal(reduceMatrixValue(154), 10);
  const widhi = calculateDestinyMatrix("1985-05-03", { referenceDate: REF });
  const other = calculateDestinyMatrix("1990-01-01", { referenceDate: REF });
  assert.notDeepEqual(other.rawGraph, widhi.rawGraph);
  assert.ok(other.currentAgeEnergy >= 1 && other.currentAgeEnergy <= 22);
});

test("Blueprint API returns a filled Destiny Matrix without external application calls", async () => {
  const response = { status: null, headers: null, body: null, writeHead(status, headers) { this.status = status; this.headers = headers; }, end(body) { this.body = body; } };
  await blueprintHandler({ method: "POST", body: {
    fullName: "Widhi Wedhaswara", birthDate: "1985-05-03", birthTime: "23:45", birthCity: "Jakarta",
    timezone: "+07:00", referenceDate: REF,
  } }, response);
  const payload = JSON.parse(response.body);
  assert.equal(response.status, 200);
  assert.equal(payload.blueprint.destinyMatrix.calculationStatus, "completed");
  assert.deepEqual(payload.blueprint.destinyMatrix.jalurEkonomi, [5, 18, 13, 20, 7]);
  assert.equal(payload.blueprint.currentAgeEnergy, 15);
  assert.equal(payload.blueprint.activeAgeRange, "41–42 tahun");
});
