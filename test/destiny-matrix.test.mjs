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

test("Test 1: DOB 03 Mei 1985 produces exact 2026 and 2027 fractional transition periods and energies", () => {
  const result = calculateDestinyMatrix("1985-05-03", { referenceDate: "2026-07-29" });
  const yf = result.yearlyForecast;
  assert.equal(yf.currentYear, 2026);
  assert.equal(yf.nextYear, 2027);

  // 2026:
  // Age 40 (c): 1985-05-03 + 40y = 2025-05-03
  // Age 41.25 (ci2point): 1985-05-03 + 41y 3m = 2026-08-03
  // Period 1: 1 Jan - 2 Agu 2026 (age 40–41.25, arcana 5 - The Hierophant, key 'c')
  // Period 2: 3 Agu - 31 Des 2026 (age 41.25–42.5, arcana 15 - The Devil, key 'ci2point')
  const p2026 = yf[2026].periods;
  assert.equal(p2026.length, 2);
  assert.equal(p2026[0].startDate, "2026-01-01");
  assert.equal(p2026[0].endDate, "2026-08-02");
  assert.equal(p2026[0].label, "1 Januari – 2 Agustus 2026");
  assert.equal(p2026[0].ageFrom, 40);
  assert.equal(p2026[0].ageTo, 41.25);
  assert.equal(p2026[0].activeAgeRange, "40–41,25 tahun");
  assert.equal(p2026[0].energy, 5);
  assert.equal(p2026[0].arcanaName, "The Hierophant");
  assert.equal(p2026[0].key, "c");

  assert.equal(p2026[1].startDate, "2026-08-03");
  assert.equal(p2026[1].endDate, "2026-12-31");
  assert.equal(p2026[1].label, "3 Agustus – 31 Desember 2026");
  assert.equal(p2026[1].ageFrom, 41.25);
  assert.equal(p2026[1].ageTo, 42.5);
  assert.equal(p2026[1].activeAgeRange, "41,25–42,5 tahun");
  assert.equal(p2026[1].energy, 15);
  assert.equal(p2026[1].arcanaName, "The Devil");
  assert.equal(p2026[1].key, "ci2point");

  // 2027:
  // Age 42.5 (ci1point): 1985-05-03 + 42y 6m = 2027-11-03
  // Period 1: 1 Jan - 2 Nov 2027 (age 41.25–42.5, arcana 15 - The Devil, key 'ci2point')
  // Period 2: 3 Nov - 31 Des 2027 (age 42.5–43.75, arcana 10 - Wheel of Fortune, key 'ci1point')
  const p2027 = yf[2027].periods;
  assert.equal(p2027.length, 2);
  assert.equal(p2027[0].startDate, "2027-01-01");
  assert.equal(p2027[0].endDate, "2027-11-02");
  assert.equal(p2027[0].label, "1 Januari – 2 November 2027");
  assert.equal(p2027[0].ageFrom, 41.25);
  assert.equal(p2027[0].ageTo, 42.5);
  assert.equal(p2027[0].activeAgeRange, "41,25–42,5 tahun");
  assert.equal(p2027[0].energy, 15);
  assert.equal(p2027[0].arcanaName, "The Devil");
  assert.equal(p2027[0].key, "ci2point");

  assert.equal(p2027[1].startDate, "2027-11-03");
  assert.equal(p2027[1].endDate, "2027-12-31");
  assert.equal(p2027[1].label, "3 November – 31 Desember 2027");
  assert.equal(p2027[1].ageFrom, 42.5);
  assert.equal(p2027[1].ageTo, 43.75);
  assert.equal(p2027[1].activeAgeRange, "42,5–43,75 tahun");
  assert.equal(p2027[1].energy, 10);
  assert.equal(p2027[1].arcanaName, "Wheel of Fortune");
  assert.equal(p2027[1].key, "ci1point");
});

test("Test 2: Mid-year boundary transitions accurately trigger on exact days", () => {
  // Widhi DOB 1985-05-03:
  // 41.25 boundary is 2026-08-03
  // 2026-08-02 is in period 1 (age 40–41.25, arcana 5)
  // 2026-08-03 is in period 2 (age 41.25–42.5, arcana 15)
  const result2026 = calculateDestinyMatrix("1985-05-03", { referenceDate: "2026-08-03" });
  const p2026 = result2026.yearlyForecast[2026].periods;
  assert.equal(p2026[0].endDate, "2026-08-02");
  assert.equal(p2026[0].energy, 5);
  assert.equal(p2026[1].startDate, "2026-08-03");
  assert.equal(p2026[1].energy, 15);

  // 42.5 boundary is 2027-11-03
  // 2027-11-02 is in period 1 (age 41.25–42.5, arcana 15)
  // 2027-11-03 is in period 2 (age 42.5–43.75, arcana 10)
  const p2027 = result2026.yearlyForecast[2027].periods;
  assert.equal(p2027[0].endDate, "2027-11-02");
  assert.equal(p2027[0].energy, 15);
  assert.equal(p2027[1].startDate, "2027-11-03");
  assert.equal(p2027[1].energy, 10);
});

test("Test 3: Year spanning a single interval produces single contiguous period", () => {
  // DOB 1990-12-31:
  // 35.00 (+5y 0m) = 2025-12-31
  // 36.25 (+6y 3m) = 2027-03-31
  // Entire 2026 calendar year lies within [35.0, 36.25) -> single period!
  const result = calculateDestinyMatrix("1990-12-31", { referenceDate: "2026-07-29" });
  const p2026 = result.yearlyForecast[2026].periods;
  assert.equal(p2026.length, 1);
  assert.equal(p2026[0].startDate, "2026-01-01");
  assert.equal(p2026[0].endDate, "2026-12-31");
  assert.equal(p2026[0].label, "1 Januari – 31 Desember 2026");
  assert.equal(p2026[0].activeAgeRange, "35–36,25 tahun");
});

test("Test 4: DOB 29 Februari (Leap Year) handles non-leap and leap year boundaries deterministically", () => {
  // DOB 2000-02-29:
  // 25.00 (+5y 0m) = 2025-02-28
  // 26.25 (+6y 3m) = 2026-05-29
  const result = calculateDestinyMatrix("2000-02-29", { referenceDate: "2026-07-29" });
  const p2026 = result.yearlyForecast[2026].periods;
  assert.equal(p2026.length, 2);
  assert.equal(p2026[0].startDate, "2026-01-01");
  assert.equal(p2026[0].endDate, "2026-05-27");
  assert.equal(p2026[0].label, "1 Januari – 27 Mei 2026");
  assert.equal(p2026[0].activeAgeRange, "25–26,25 tahun");
  assert.equal(p2026[1].startDate, "2026-05-28");
  assert.equal(p2026[1].endDate, "2026-12-31");
  assert.equal(p2026[1].label, "28 Mei – 31 Desember 2026");
  assert.equal(p2026[1].activeAgeRange, "26,25–27,5 tahun");

  // In 2028 (leap year), boundary 28.75 (+8y 9m) falls on 2028-11-29
  const res2028 = calculateDestinyMatrix("2000-02-29", { referenceDate: "2028-01-15" });
  const p2028 = res2028.yearlyForecast[2028].periods;
  assert.equal(p2028.length, 2);
  assert.equal(p2028[0].startDate, "2028-01-01");
  assert.equal(p2028[0].endDate, "2028-11-28");
  assert.equal(p2028[0].activeAgeRange, "27,5–28,75 tahun");
  assert.equal(p2028[1].startDate, "2028-11-29");
  assert.equal(p2028[1].endDate, "2028-12-31");
  assert.equal(p2028[1].activeAgeRange, "28,75–30 tahun");
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
