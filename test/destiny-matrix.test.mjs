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
  assert.ok(payload.blueprint.yearlyForecast);
  assert.equal(payload.blueprint.yearlyForecast.currentYear, 2026);
  assert.equal(payload.blueprint.yearlyForecast.nextYear, 2027);
});

test("Test 1: DOB 03 Mei 1985 produces exact 2026 and 2027 transition periods and energies", () => {
  const result = calculateDestinyMatrix("1985-05-03", { referenceDate: "2026-07-29" });
  const yf = result.yearlyForecast;
  assert.equal(yf.currentYear, 2026);
  assert.equal(yf.nextYear, 2027);

  // 2026: 1 Jan - 2 Mei (age 40, arcana 5), 3 Mei - 31 Des (age 41, arcana 15)
  const p2026 = yf[2026].periods;
  assert.equal(p2026.length, 2);
  assert.equal(p2026[0].startDate, "2026-01-01");
  assert.equal(p2026[0].endDate, "2026-05-02");
  assert.equal(p2026[0].label, "1 Januari – 2 Mei 2026");
  assert.equal(p2026[0].age, 40);
  assert.equal(p2026[0].activeAgeRange, "40–41 tahun");
  assert.equal(p2026[0].energy, 5);

  assert.equal(p2026[1].startDate, "2026-05-03");
  assert.equal(p2026[1].endDate, "2026-12-31");
  assert.equal(p2026[1].label, "3 Mei – 31 Desember 2026");
  assert.equal(p2026[1].age, 41);
  assert.equal(p2026[1].activeAgeRange, "41–42 tahun");
  assert.equal(p2026[1].energy, 15);

  // 2027: 1 Jan - 2 Mei (age 41, arcana 15), 3 Mei - 31 Des (age 42, arcana 10)
  const p2027 = yf[2027].periods;
  assert.equal(p2027.length, 2);
  assert.equal(p2027[0].startDate, "2027-01-01");
  assert.equal(p2027[0].endDate, "2027-05-02");
  assert.equal(p2027[0].label, "1 Januari – 2 Mei 2027");
  assert.equal(p2027[0].age, 41);
  assert.equal(p2027[0].activeAgeRange, "41–42 tahun");
  assert.equal(p2027[0].energy, 15);

  assert.equal(p2027[1].startDate, "2027-05-03");
  assert.equal(p2027[1].endDate, "2027-12-31");
  assert.equal(p2027[1].label, "3 Mei – 31 Desember 2027");
  assert.equal(p2027[1].age, 42);
  assert.equal(p2027[1].activeAgeRange, "42–43 tahun");
  assert.equal(p2027[1].energy, 10);
});

test("Test 2: DOB in January (01 Januari) produces single contiguous period per year", () => {
  const result = calculateDestinyMatrix("1990-01-01", { referenceDate: "2026-07-29" });
  const p2026 = result.yearlyForecast[2026].periods;
  assert.equal(p2026.length, 1);
  assert.equal(p2026[0].startDate, "2026-01-01");
  assert.equal(p2026[0].endDate, "2026-12-31");
  assert.equal(p2026[0].label, "1 Januari – 31 Desember 2026");
  assert.equal(p2026[0].age, 36);

  const p2027 = result.yearlyForecast[2027].periods;
  assert.equal(p2027.length, 1);
  assert.equal(p2027[0].startDate, "2027-01-01");
  assert.equal(p2027[0].endDate, "2027-12-31");
  assert.equal(p2027[0].label, "1 Januari – 31 Desember 2027");
  assert.equal(p2027[0].age, 37);
});

test("Test 3: DOB in December (31 Desember) handles year boundary with exact single-day final period", () => {
  const result = calculateDestinyMatrix("1990-12-31", { referenceDate: "2026-07-29" });
  const p2026 = result.yearlyForecast[2026].periods;
  assert.equal(p2026.length, 2);
  assert.equal(p2026[0].startDate, "2026-01-01");
  assert.equal(p2026[0].endDate, "2026-12-30");
  assert.equal(p2026[0].label, "1 Januari – 30 Desember 2026");
  assert.equal(p2026[0].age, 35);

  assert.equal(p2026[1].startDate, "2026-12-31");
  assert.equal(p2026[1].endDate, "2026-12-31");
  assert.equal(p2026[1].label, "31 Desember 2026");
  assert.equal(p2026[1].age, 36);
});

test("Test 4: DOB 29 Februari (Leap Year) handles non-leap year (28 Feb) and leap year (29 Feb)", () => {
  const result = calculateDestinyMatrix("2000-02-29", { referenceDate: "2026-07-29" });
  // 2026 (non-leap): birthday falls on 28 Feb
  const p2026 = result.yearlyForecast[2026].periods;
  assert.equal(p2026.length, 2);
  assert.equal(p2026[0].startDate, "2026-01-01");
  assert.equal(p2026[0].endDate, "2026-02-27");
  assert.equal(p2026[0].label, "1 Januari – 27 Februari 2026");
  assert.equal(p2026[0].age, 25);
  assert.equal(p2026[1].startDate, "2026-02-28");
  assert.equal(p2026[1].endDate, "2026-12-31");
  assert.equal(p2026[1].label, "28 Februari – 31 Desember 2026");
  assert.equal(p2026[1].age, 26);

  // 2028 (leap year): birthday falls on 29 Feb
  const res2028 = calculateDestinyMatrix("2000-02-29", { referenceDate: "2028-01-15" });
  const p2028 = res2028.yearlyForecast[2028].periods;
  assert.equal(p2028.length, 2);
  assert.equal(p2028[0].startDate, "2028-01-01");
  assert.equal(p2028[0].endDate, "2028-02-28");
  assert.equal(p2028[0].label, "1 Januari – 28 Februari 2028");
  assert.equal(p2028[0].age, 27);
  assert.equal(p2028[1].startDate, "2028-02-29");
  assert.equal(p2028[1].endDate, "2028-12-31");
  assert.equal(p2028[1].label, "29 Februari – 31 Desember 2028");
  assert.equal(p2028[1].age, 28);
});

test("Test 5: Invariant verification: no NaN, no undefined, valid dates, no gaps, no overlaps", () => {
  const dates = ["1985-05-03", "1990-01-01", "1995-12-31", "2000-02-29", "1972-08-15", "2012-06-16"];
  for (const dob of dates) {
    const result = calculateDestinyMatrix(dob, { referenceDate: "2026-07-29" });
    for (const yr of [2026, 2027]) {
      const forecast = result.yearlyForecast[yr];
      assert.ok(forecast, `Forecast for year ${yr} exists for ${dob}`);
      assert.ok(forecast.periods.length >= 1, `At least 1 period for ${dob}`);

      for (let i = 0; i < forecast.periods.length; i++) {
        const p = forecast.periods[i];
        assert.ok(!Number.isNaN(p.age), `Age must not be NaN for ${dob}`);
        assert.ok(!Number.isNaN(p.energy), `Energy must not be NaN for ${dob}`);
        assert.ok(p.energy >= 1 && p.energy <= 22, `Energy must be between 1 and 22 for ${dob}`);
        assert.ok(typeof p.startDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.startDate), "Valid startDate");
        assert.ok(typeof p.endDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(p.endDate), "Valid endDate");
        assert.ok(p.startDate <= p.endDate, `startDate ${p.startDate} must be <= endDate ${p.endDate}`);
        assert.ok(p.label && typeof p.label === "string", "Label exists");

        // Verify continuity with previous period
        if (i > 0) {
          const prev = forecast.periods[i - 1];
          const prevEnd = new Date(prev.endDate + "T00:00:00Z");
          const currStart = new Date(p.startDate + "T00:00:00Z");
          const diffDays = (currStart.getTime() - prevEnd.getTime()) / (1000 * 60 * 60 * 24);
          assert.equal(diffDays, 1, `No gap and no overlap between period ${i-1} and ${i} for ${dob}`);
        }
      }

      // First period must start on Jan 1
      assert.equal(forecast.periods[0].startDate, `${yr}-01-01`);
      // Last period must end on Dec 31
      assert.equal(forecast.periods[forecast.periods.length - 1].endDate, `${yr}-12-31`);
    }
  }
});
