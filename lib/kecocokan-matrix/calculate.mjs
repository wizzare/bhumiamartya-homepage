/**
 * Bhumi Compatibility Matrix Engine (Web Native).
 *
 * Implements approved SOT v1.0.0 calculation rules.
 * All operations are local, transient, and free from external app runtimes.
 */

import { ARCANA_NAMES, destinyMatrixArcanaDictionary } from "../destiny-matrix/arcana-dictionary.mjs";

export { ARCANA_NAMES, destinyMatrixArcanaDictionary };

export const METADATA = Object.freeze({
  name: "Bhumi Compatibility Matrix",
  version: "1.0.0",
  arcanaMappingVersion: "bhumi-arcana-v1",
  reductionMethod: "bhumi-recursive-digit-sum-v1",
  sotVersion: "1.0.0",
});

/**
 * Reduce an integer to an Arcana value between 1 and 22.
 * If value > 22, recursively sum the digits.
 */
export function reduceArcana(value) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("Arcana value must be a positive integer.");
  }
  let current = value;
  while (current > 22) {
    current = String(current)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return current;
}

/**
 * Validate and parse YYYY-MM-DD calendar date.
 */
export function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) throw new Error("birthDate must use YYYY-MM-DD.");
  const [year, month, day] = match.slice(1).map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    throw new Error("birthDate is not a valid calendar date.");
  }
  return { year, month, day };
}

/**
 * Calculate personal Destiny Matrix primary nodes for one partner.
 */
export function calculatePersonalMatrix(birthDate) {
  const { year, month, day } = parseDate(birthDate);
  const a = reduceArcana(day);
  const b = reduceArcana(month);
  const yearSum = String(year)
    .split("")
    .reduce((sum, d) => sum + Number(d), 0);
  const c = reduceArcana(yearSum);
  const d = reduceArcana(a + b + c);
  const center = reduceArcana(a + b + c + d);
  const northWest = reduceArcana(a + b);
  const northEast = reduceArcana(b + c);
  const southWest = reduceArcana(d + a);
  const southEast = reduceArcana(c + d);

  return {
    west: a,
    north: b,
    east: c,
    south: d,
    center,
    northWest,
    northEast,
    southWest,
    southEast,
  };
}

/**
 * Project combined nodes into approved zones.
 */
export function projectCompatibilityZones(nodes) {
  const meetingPurpose = [nodes.northOuter, nodes.westOuter];
  const portrait = [nodes.westOuter, nodes.westMiddle, nodes.westInner];
  const talent = [nodes.northOuter, nodes.northMiddle, nodes.northInner];
  const karmic = [nodes.southOuter, nodes.southMiddle, nodes.southInner];
  const love = [nodes.southInner, nodes.lovePoint, nodes.loveMoneyJunction];
  const economic = [nodes.loveMoneyJunction, nodes.moneyPoint, nodes.eastInner];
  const wellbeing = [nodes.eastInner, nodes.eastMiddle, nodes.eastOuter];

  return {
    centerArcana: nodes.center,
    meetingPurpose: { spiritualTask: meetingPurpose[0], materialTask: meetingPurpose[1], code: meetingPurpose },
    portraitZone: { publicImage: portrait[0], lessonFromChildren: portrait[1], parentalTask: portrait[2], code: portrait },
    talentZone: { inspirationAndCrisisRecovery: talent[0], potentialBreakupTrigger: talent[1], dailyCoupleBehavior: talent[2], code: talent },
    karmicTail: { issueTrigger: karmic[0], unconsciousPattern: karmic[1], majorInfluence: karmic[2], code: karmic },
    loveLine: { karmicEntry: love[0], lovePoint: love[1], loveMoneyJunction: love[2], code: love },
    pathToRelationshipHarmony: [...love],
    missingEnergyForHarmony: nodes.lovePoint,
    economicLane: { loveMoneyJunction: economic[0], moneyPoint: economic[1], financialEntry: economic[2], code: economic },
    financialActionPath: [...economic],
    financialWellbeingZone: { eastInner: wellbeing[0], eastMiddle: wellbeing[1], eastOuter: wellbeing[2], code: wellbeing },
    relationshipBehavior: { male: nodes.northWestOuter, female: nodes.northEastOuter },
    qualitiesToDevelop: { female: nodes.southWestOuter, male: nodes.southEastOuter },
    masculineGenerationLine: [nodes.northWestOuter, nodes.center, nodes.southEastOuter],
    feminineGenerationLine: [nodes.southWestOuter, nodes.center, nodes.northEastOuter],
  };
}

/**
 * Validate input structure.
 */
export function validateCompatibilityInput(input) {
  if (!input || typeof input !== "object") {
    throw new Error("Input must be an object.");
  }
  const { malePartner, femalePartner } = input;
  if (!malePartner || !femalePartner) {
    throw new Error("Both malePartner and femalePartner are required.");
  }
  const cleanMaleName = String(malePartner.name || "").trim();
  const cleanFemaleName = String(femalePartner.name || "").trim();
  if (!cleanMaleName) throw new Error("Nama Pasangan 1 (Pria) wajib diisi.");
  if (!cleanFemaleName) throw new Error("Nama Pasangan 2 (Wanita) wajib diisi.");

  parseDate(malePartner.birthDate);
  parseDate(femalePartner.birthDate);

  return {
    malePartner: { name: cleanMaleName, birthDate: malePartner.birthDate },
    femalePartner: { name: cleanFemaleName, birthDate: femalePartner.birthDate },
  };
}

/**
 * Calculate full Compatibility Matrix from two birth dates.
 */
export function calculateCompatibilityMatrix(input) {
  const normalized = validateCompatibilityInput(input);
  const malePartner = calculatePersonalMatrix(normalized.malePartner.birthDate);
  const femalePartner = calculatePersonalMatrix(normalized.femalePartner.birthDate);

  // Outer ring combination
  const northOuter = reduceArcana(malePartner.north + femalePartner.north);
  const northEastOuter = reduceArcana(malePartner.northEast + femalePartner.northEast);
  const eastOuter = reduceArcana(malePartner.east + femalePartner.east);
  const southEastOuter = reduceArcana(malePartner.southEast + femalePartner.southEast);
  const southOuter = reduceArcana(malePartner.south + femalePartner.south);
  const southWestOuter = reduceArcana(malePartner.southWest + femalePartner.southWest);
  const westOuter = reduceArcana(malePartner.west + femalePartner.west);
  const northWestOuter = reduceArcana(malePartner.northWest + femalePartner.northWest);
  const center = reduceArcana(malePartner.center + femalePartner.center);

  // Inner & middle points
  const northInner = reduceArcana(northOuter + center);
  const northMiddle = reduceArcana(northOuter + northInner);
  const eastInner = reduceArcana(eastOuter + center);
  const eastMiddle = reduceArcana(eastOuter + eastInner);
  const southInner = reduceArcana(southOuter + center);
  const southMiddle = reduceArcana(southOuter + southInner);
  const westInner = reduceArcana(westOuter + center);
  const westMiddle = reduceArcana(westOuter + westInner);

  // Channel points
  const loveMoneyJunction = reduceArcana(southInner + eastInner);
  const lovePoint = reduceArcana(southInner + loveMoneyJunction);
  const moneyPoint = reduceArcana(eastInner + loveMoneyJunction);

  const nodes = {
    northOuter,
    northEastOuter,
    eastOuter,
    southEastOuter,
    southOuter,
    southWestOuter,
    westOuter,
    northWestOuter,
    center,
    northMiddle,
    northInner,
    eastInner,
    eastMiddle,
    southInner,
    southMiddle,
    westInner,
    westMiddle,
    lovePoint,
    loveMoneyJunction,
    moneyPoint,
  };

  // Syntheses
  const sky = reduceArcana(nodes.northOuter + nodes.southOuter);
  const earth = reduceArcana(nodes.westOuter + nodes.eastOuter);
  const relationships = { sky, earth, result: reduceArcana(sky + earth) };

  const masculineEnergy = reduceArcana(nodes.northWestOuter + nodes.southEastOuter);
  const feminineEnergy = reduceArcana(nodes.northEastOuter + nodes.southWestOuter);
  const merger = { masculineEnergy, feminineEnergy, result: reduceArcana(masculineEnergy + feminineEnergy) };

  const harmony = {
    relationship: relationships.result,
    merger: merger.result,
    result: reduceArcana(relationships.result + merger.result),
  };

  return {
    input: normalized,
    personal: { malePartner, femalePartner },
    nodes,
    zones: projectCompatibilityZones(nodes),
    relationships,
    merger,
    harmony,
    metadata: { ...METADATA },
  };
}

export function formatArcana(value) {
  const name = ARCANA_NAMES[value] || `Arcana ${value}`;
  return `${value} · ${name}`;
}
