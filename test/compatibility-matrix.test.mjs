import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCompatibilityMatrix,
  calculatePersonalMatrix,
  reduceArcana,
  METADATA,
} from "../lib/kecocokan-matrix/calculate.mjs";

const goldenCompatibilityInput = {
  malePartner: { name: "Male Partner", birthDate: "1985-05-03" },
  femalePartner: { name: "Female Partner", birthDate: "1988-10-17" },
};

const goldenCompatibilityResult = {
  input: goldenCompatibilityInput,
  personal: {
    malePartner: { west: 3, north: 5, east: 5, south: 13, center: 8, northWest: 8, northEast: 10, southEast: 18, southWest: 16 },
    femalePartner: { west: 17, north: 10, east: 8, south: 8, center: 7, northWest: 9, northEast: 18, southEast: 16, southWest: 7 },
  },
  nodes: {
    northOuter: 15, northEastOuter: 10, eastOuter: 13, southEastOuter: 7, southOuter: 21, southWestOuter: 5, westOuter: 20, northWestOuter: 17, center: 15,
    northMiddle: 18, northInner: 3, eastInner: 10, eastMiddle: 5, southInner: 9, southMiddle: 3, westInner: 8, westMiddle: 10,
    lovePoint: 10, loveMoneyJunction: 19, moneyPoint: 11,
  },
  zones: {
    centerArcana: 15,
    meetingPurpose: { spiritualTask: 15, materialTask: 20, code: [15, 20] },
    portraitZone: { publicImage: 20, lessonFromChildren: 10, parentalTask: 8, code: [20, 10, 8] },
    talentZone: { inspirationAndCrisisRecovery: 15, potentialBreakupTrigger: 18, dailyCoupleBehavior: 3, code: [15, 18, 3] },
    karmicTail: { issueTrigger: 21, unconsciousPattern: 3, majorInfluence: 9, code: [21, 3, 9] },
    loveLine: { karmicEntry: 9, lovePoint: 10, loveMoneyJunction: 19, code: [9, 10, 19] },
    pathToRelationshipHarmony: [9, 10, 19], missingEnergyForHarmony: 10,
    economicLane: { loveMoneyJunction: 19, moneyPoint: 11, financialEntry: 10, code: [19, 11, 10] },
    financialActionPath: [19, 11, 10],
    financialWellbeingZone: { eastInner: 10, eastMiddle: 5, eastOuter: 13, code: [10, 5, 13] },
    relationshipBehavior: { male: 17, female: 10 }, qualitiesToDevelop: { female: 5, male: 7 },
    masculineGenerationLine: [17, 15, 7], feminineGenerationLine: [5, 15, 10],
  },
  relationships: { sky: 9, earth: 6, result: 15 },
  merger: { masculineEnergy: 6, feminineEnergy: 15, result: 21 },
  harmony: { relationship: 15, merger: 21, result: 9 },
  metadata: { ...METADATA },
};

test("Golden Compatibility Matrix calculation matches SOT exactly", () => {
  const result = calculateCompatibilityMatrix(goldenCompatibilityInput);
  assert.deepEqual(result, goldenCompatibilityResult);
});

test("Personal matrix calculates correctly", () => {
  const male = calculatePersonalMatrix("1985-05-03");
  assert.equal(male.west, 3);
  assert.equal(male.north, 5);
  assert.equal(male.east, 5);
  assert.equal(male.south, 13);
  assert.equal(male.center, 8);
});

test("reduceArcana satisfies recursive reduction invariants", () => {
  assert.equal(reduceArcana(22), 22);
  assert.equal(reduceArcana(23), 5); // 2 + 3 = 5
  assert.equal(reduceArcana(52), 7); // 5 + 2 = 7
  assert.equal(reduceArcana(154), 10); // 1 + 5 + 4 = 10
  assert.throws(() => reduceArcana(0));
  assert.throws(() => reduceArcana(-5));
});
