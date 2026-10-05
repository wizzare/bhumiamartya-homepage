/**
 * Website-local Destiny Matrix calculator.
 *
 * This preserves the historical Blueprint arithmetic and compatibility
 * sequences without importing the protected application runtime.
 */

const CHAKRAS = [
  ["sahasrara", "Sahasrara", "a", "b", "f"],
  ["ajna", "Ajna", "o", "p", "op"],
  ["vishudha", "Vishudha", "s", "t", "st"],
  ["anahata", "Anahata", "w", "x", "wx"],
  ["manipura", "Manipura", "e", "e", "ee"],
  ["svadhisthana", "Svadhisthana", "n", "j", "jn"],
  ["muladhara", "Muladhara", "c", "d", "cd"],
];

const SEGMENTS = [
  ["af", "a", "f"], ["fb", "f", "b"], ["bg", "b", "g"], ["gc", "g", "c"],
  ["ci", "c", "i"], ["id", "i", "d"], ["dh", "d", "h"], ["ha", "h", "a"],
];
const POINT_POSITIONS = [0, 1.25, 2.5, 3.75, 5, 6.25, 7.5, 8.75, 10];

export function reduceMatrixValue(value) {
  if (!Number.isInteger(value) || value < 0) throw new Error("Matrix value must be a non-negative integer.");
  if (value <= 22) return value;
  return String(value).split("").reduce((total, digit) => total + Number(digit), 0);
}

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) throw new Error("birthDate must use YYYY-MM-DD.");
  const [year, month, day] = match.slice(1).map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (candidate.getUTCFullYear() !== year || candidate.getUTCMonth() !== month - 1 || candidate.getUTCDate() !== day) {
    throw new Error("birthDate is not a valid calendar date.");
  }
  return { year, month, day };
}

function dateToday() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

function currentAge(birthDate, referenceDate) {
  const birth = parseDate(birthDate);
  const reference = parseDate(referenceDate || dateToday());
  if (Date.UTC(reference.year, reference.month - 1, reference.day) < Date.UTC(birth.year, birth.month - 1, birth.day)) {
    throw new Error("referenceDate cannot precede birthDate.");
  }
  const birthdayDay = birth.month === 2 && birth.day === 29 && !isLeapYear(reference.year) ? 28 : birth.day;
  return reference.year - birth.year - (reference.month < birth.month || (reference.month === birth.month && reference.day < birthdayDay) ? 1 : 0);
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function sum(...values) {
  return reduceMatrixValue(values.reduce((total, value) => total + value, 0));
}

function buildYearPoints(points) {
  const years = {};
  for (const [prefix, leftKey, rightKey] of SEGMENTS) {
    const left = points[leftKey];
    const right = points[rightKey];
    const base = sum(left, right);
    const first = sum(left, base);
    years[`${prefix}point`] = base;
    years[`${prefix}1point`] = first;
    years[`${prefix}2point`] = sum(left, first);
    years[`${prefix}3point`] = sum(base, first);
    years[`${prefix}4point`] = sum(base, right);
    years[`${prefix}5point`] = sum(base, years[`${prefix}4point`]);
    years[`${prefix}6point`] = sum(years[`${prefix}4point`], right);
  }
  return years;
}

function getAgePoint(age, years, points) {
  const normalizedAge = ((age % 80) + 80) % 80;
  const segmentIndex = Math.floor(normalizedAge / 10);
  const remainder = normalizedAge % 10;
  let pointIndex = 0;
  for (let i = 1; i < POINT_POSITIONS.length; i += 1) {
    if (Math.abs(remainder - POINT_POSITIONS[i]) < Math.abs(remainder - POINT_POSITIONS[pointIndex])) pointIndex = i;
  }
  const [segment, from, to] = SEGMENTS[segmentIndex];
  const keys = [from, `${segment}2point`, `${segment}1point`, `${segment}3point`, `${segment}point`, `${segment}5point`, `${segment}4point`, `${segment}6point`, to];
  return { segment, pointIndex, key: keys[pointIndex], arcana: years[keys[pointIndex]] ?? points[keys[pointIndex]] };
}

function getForecast(age, years, points) {
  const active = getAgePoint(age, years, points);
  let previous = null;
  let next = null;
  for (let step = 1; step <= 5 && !previous; step += 1) {
    const candidate = getAgePoint(age - step, years, points);
    if (candidate.pointIndex !== active.pointIndex || candidate.segment !== active.segment) previous = candidate;
  }
  for (let step = 1; step <= 5 && !next; step += 1) {
    const candidate = getAgePoint(age + step, years, points);
    if (candidate.pointIndex !== active.pointIndex || candidate.segment !== active.segment) next = candidate;
  }
  return {
    currentAge: age,
    currentAgeEnergy: active.arcana,
    // Public Blueprint convention is the completed birthday year through the next birthday.
    activeAgeRange: `${age}–${age + 1} tahun`,
    active,
    previous,
    next,
  };
}

export const ARCANA_NAMES = {
  1: "The Magician", 2: "The High Priestess", 3: "The Empress", 4: "The Emperor",
  5: "The Hierophant", 6: "The Lovers", 7: "The Chariot", 8: "Justice",
  9: "The Hermit", 10: "Wheel of Fortune", 11: "Strength", 12: "The Hanged Man",
  13: "Death", 14: "Temperance", 15: "The Devil", 16: "The Tower",
  17: "The Star", 18: "The Moon", 19: "The Sun", 20: "Judgement",
  21: "The World", 22: "The Fool",
};

const INDO_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function formatDateIndo(dateStr, includeYear = true) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const mName = INDO_MONTHS[m - 1];
  return includeYear ? `${d} ${mName} ${y}` : `${d} ${mName}`;
}

export function formatAgeRange(start, end) {
  const startStr = Number.isInteger(start) ? String(start) : String(start).replace(".", ",");
  const endStr = Number.isInteger(end) ? String(end) : String(end).replace(".", ",");
  return `${startStr}–${endStr} tahun`;
}

export function getTransitionDate(birth, age) {
  const totalMonths = Math.round(age * 12);
  const targetYear = birth.year + Math.floor((birth.month - 1 + totalMonths) / 12);
  const targetMonth = ((birth.month - 1 + totalMonths) % 12) + 1;
  const daysInMonth = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  let day = birth.day;
  if (birth.month === 2 && birth.day === 29 && !isLeapYear(targetYear)) {
    day = 28;
  }
  const targetDay = Math.min(day, daysInMonth);
  const iso = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
  return { year: targetYear, month: targetMonth, day: targetDay, iso };
}

export function getIntervalForAge(age) {
  const normalizedAge = ((age % 80) + 80) % 80;
  const intervalIndex = Math.floor(normalizedAge / 1.25);
  const startAge = intervalIndex * 1.25;
  const endAge = (intervalIndex + 1) * 1.25;
  const segIdx = Math.floor(intervalIndex / 8);
  const ptIdx = intervalIndex % 8;
  const [segment, from, to] = SEGMENTS[segIdx];
  const keys = [from, `${segment}2point`, `${segment}1point`, `${segment}3point`, `${segment}point`, `${segment}5point`, `${segment}4point`, `${segment}6point`];
  const key = keys[ptIdx];
  return {
    intervalIndex,
    startAge,
    endAge,
    segment,
    pointIndex: ptIdx,
    key,
  };
}

export function getYearlyForecast(birthDate, targetYear, years, points) {
  const birth = parseDate(birthDate);
  const yearNum = Number(targetYear);
  if (!Number.isInteger(yearNum) || yearNum < birth.year) {
    throw new Error("targetYear must be a valid year greater than or equal to birth year.");
  }
  const startIso = `${yearNum}-01-01`;
  const endIso = `${yearNum}-12-31`;

  const minAge = Math.max(0, yearNum - birth.year - 2);
  const maxAge = yearNum - birth.year + 2;
  const minInterval = Math.floor(minAge / 1.25);
  const maxInterval = Math.ceil(maxAge / 1.25);

  const boundaries = [];
  for (let i = minInterval; i <= maxInterval; i += 1) {
    const boundaryAge = i * 1.25;
    if (boundaryAge <= 0) continue;
    const trans = getTransitionDate(birth, boundaryAge);
    if (trans.iso >= startIso && trans.iso <= endIso) {
      boundaries.push({
        boundaryAge,
        date: trans.iso,
        interval: getIntervalForAge(boundaryAge),
      });
    }
  }

  boundaries.sort((a, b) => a.date.localeCompare(b.date));

  // Determine active interval on Jan 1
  let activeAtStartAge = 0;
  for (let i = 0; i <= maxInterval; i += 1) {
    const bAge = i * 1.25;
    const trans = getTransitionDate(birth, bAge);
    if (trans.iso <= startIso) {
      activeAtStartAge = bAge;
    } else {
      break;
    }
  }
  const initialInterval = getIntervalForAge(activeAtStartAge);

  const rawPeriods = [];
  let currentStartIso = startIso;
  let currentInterval = initialInterval;

  for (let idx = 0; idx < boundaries.length; idx += 1) {
    const b = boundaries[idx];
    if (b.date > currentStartIso) {
      const prevDateObj = new Date(Date.parse(`${b.date}T00:00:00Z`) - 86400000);
      const prevIso = prevDateObj.toISOString().slice(0, 10);
      rawPeriods.push({
        startDate: currentStartIso,
        endDate: prevIso,
        interval: currentInterval,
      });
      currentStartIso = b.date;
      currentInterval = b.interval;
    } else if (b.date === currentStartIso) {
      currentInterval = b.interval;
    }
  }

  rawPeriods.push({
    startDate: currentStartIso,
    endDate: endIso,
    interval: currentInterval,
  });

  const periods = rawPeriods.map((p) => {
    const arcana = years[p.interval.key] ?? points[p.interval.key];
    const ageRange = formatAgeRange(p.interval.startAge, p.interval.endAge);
    const label = (p.startDate === startIso && p.endDate === endIso)
      ? `1 Januari – 31 Desember ${yearNum}`
      : (p.startDate === p.endDate)
        ? formatDateIndo(p.startDate, true)
        : `${formatDateIndo(p.startDate, false)} – ${formatDateIndo(p.endDate, true)}`;

    return {
      startDate: p.startDate,
      endDate: p.endDate,
      label,
      age: Math.floor(p.interval.startAge),
      ageFrom: p.interval.startAge,
      ageTo: p.interval.endAge,
      ageRange,
      activeAgeRange: ageRange,
      energy: arcana,
      arcana,
      arcanaName: ARCANA_NAMES[arcana] || "",
      key: p.interval.key,
      segment: p.interval.segment,
      pointIndex: p.interval.pointIndex,
    };
  });

  return {
    year: yearNum,
    periods,
  };
}

function buildHealth(points) {
  const values = {
    a: points.a, b: points.b, c: points.c, d: points.d, e: points.e, f: points.f,
    o: points.o, p: points.p, s: points.s, t: points.t, w: points.w, x: points.x,
    j: points.j, n: points.n,
  };
  values.op = sum(values.o, values.p);
  values.st = sum(values.s, values.t);
  values.wx = sum(values.w, values.x);
  values.ee = sum(values.e, values.e);
  values.jn = sum(values.j, values.n);
  values.cd = sum(values.c, values.d);

  const healthChart = {};
  const physical = [];
  const energy = [];
  const emotion = [];
  for (const [key, label, physicalKey, energyKey, emotionKey] of CHAKRAS) {
    healthChart[key] = { label, physics: values[physicalKey], energy: values[energyKey], emotion: values[emotionKey] };
    physical.push(values[physicalKey]); energy.push(values[energyKey]); emotion.push(values[emotionKey]);
  }
  return {
    healthChart,
    totalPhysics: sum(...physical),
    totalEnergy: sum(...energy),
    totalEmotion: sum(...emotion),
  };
}

export function calculateDestinyMatrix(birthDate, { referenceDate } = {}) {
  const { year, month, day } = parseDate(birthDate);
  const a = reduceMatrixValue(day);
  const b = month;
  const c = reduceMatrixValue(String(year).split("").reduce((total, digit) => total + Number(digit), 0));
  const d = sum(a, b, c);
  const e = sum(a, b, c, d);
  const f = sum(a, b);
  const g = sum(b, c);
  const h = sum(d, a);
  const i = sum(c, d);
  const j = sum(d, e);
  const n = sum(c, e);
  const s = sum(a, e);
  const t = sum(b, e);
  const o = sum(a, s);
  const p = sum(b, t);
  const q = sum(n, c);
  const r = sum(j, d);
  const w = sum(s, e);
  const x = sum(t, e);
  const l = sum(j, n);
  const k = sum(j, l);
  const m = sum(l, n);
  const u = sum(f, g, h, i);
  const v = sum(e, u);

  // Historical descendant branch: BM25/BM27 are based on the family-square
  // centre (BM23), not the later application replacement using BM05.
  const f2 = sum(f, u); const f1 = sum(f, f2);
  const g2 = sum(g, u); const g1 = sum(g, g2);
  const h2 = sum(h, u); const h1 = sum(h, h2);
  const i2 = sum(i, u); const i1 = sum(i, i2);
  const points = { a, b, c, d, e, f, g, h, i, j, n, s, t, o, p, q, r, w, x, l, k, m, u, v, f2, f1, g2, g1, h2, h1, i2, i1 };
  const rawGraph = Object.fromEntries([
    ["BM01", a], ["BM02", b], ["BM03", c], ["BM04", d], ["BM05", e], ["BM06", f], ["BM07", g], ["BM08", h], ["BM09", i], ["BM10", j],
    ["BM11", n], ["BM12", s], ["BM13", t], ["BM14", o], ["BM15", p], ["BM16", q], ["BM17", r], ["BM18", w], ["BM19", x], ["BM20", l],
    ["BM21", k], ["BM22", m], ["BM23", u], ["BM24", v], ["BM25", f2], ["BM26", f1], ["BM27", g2], ["BM28", g1], ["BM29", h2], ["BM30", h1], ["BM31", i2], ["BM32", i1],
  ]);
  const years = buildYearPoints(points);
  const age = currentAge(birthDate, referenceDate);
  const forecast = getForecast(age, years, points);
  const refDate = parseDate(referenceDate || dateToday());
  const currentYear = refDate.year;
  const nextYear = currentYear + 1;
  const yearlyForecast = {
    currentYear,
    nextYear,
    [currentYear]: getYearlyForecast(birthDate, currentYear, years, points),
    [nextYear]: getYearlyForecast(birthDate, nextYear, years, points),
  };
  const health = buildHealth(points);
  const purposes = {
    skypoint: sum(b, d), earthpoint: sum(a, c),
    perspurpose: null, femalepoint: sum(g, h), malepoint: sum(f, i),
    socialpurpose: null, generalpurpose: null, planetarypurpose: null,
  };
  purposes.perspurpose = sum(purposes.skypoint, purposes.earthpoint);
  purposes.socialpurpose = sum(purposes.femalepoint, purposes.malepoint);
  purposes.generalpurpose = sum(purposes.perspurpose, purposes.socialpurpose);
  purposes.planetarypurpose = sum(purposes.socialpurpose, purposes.generalpurpose);

  const jalurEkonomi = [c, q, n, m, l];
  const jalurCinta = [l, k, j];
  const karmicTail = [d, r, j];
  return {
    calculationStatus: "completed",
    formulaVersion: "website-historical-blueprint-v1",
    rawGraph,
    rawPoints: points,
    arcanaCenter: e,
    center: e,
    commonEnergy: [e, u, v],
    personalQualities: [a, e, b],
    jalurEkonomi,
    moneyLine: jalurEkonomi,
    angkaDollar: m,
    jalurCinta,
    loveLine: jalurCinta,
    angkaHeart: k,
    karmicTail,
    karmicTailLegacy: [j, r, d],
    // Historical compatibility names retained for the public Blueprint response.
    karmaAyah: karmicTail,
    karmaIbu: [g, sum(g, i), i],
    fatherLine: karmicTail,
    motherLine: [g, sum(g, i), i],
    bakatAyah: [f, f1, f2],
    bakatIbu: [g, g1, g2],
    bakatAgung: [b, p, t],
    talentsFather: [f, f1, f2],
    talentsMother: [g, g1, g2],
    talentsGreat: [b, p, t],
    talents: [f1, g1, h1, i1],
    purposes,
    years,
    yearlyForecast,
    ...health,
    ...forecast,
  };
}
