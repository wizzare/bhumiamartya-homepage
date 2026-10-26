/**
 * Bhumi Compatibility Matrix & Synastry Natal Chart Couple Client Engine & UI
 * Native standalone client for www.bhumiamartya.my.id
 * SOT v1.0.0 Approved & Synastry Natal Chart Couple Integrated
 */

const ARCANA_DICTIONARY = {
  "1": {
    "id": 1,
    "name": "The Magician",
    "coreEssence": "Creation, Manifestation, Individuality",
    "lightSide": "Innovation, Communication, Resourcefulness",
    "shadowSide": "Manipulation, Self-doubt, Egotism",
    "gift": "Turning ideas into reality",
    "challenge": "Overcoming the fear of failure and self-centeredness",
    "lifeLesson": "Realize your potential to shape your own reality",
    "relationshipPattern": "Requires intellectual stimulation and equal partnership",
    "moneyPattern": "Attracts wealth through unique skills and communication",
    "careerPattern": "Entrepreneurship, Communication, Technology",
    "spiritualPattern": "Understanding the power of thought and word",
    "growthDirection": "Focus energy on constructive manifestation",
    "reflectionPrompt": "What unique skills am I hiding from the world?"
  },
  "2": {
    "id": 2,
    "name": "The High Priestess",
    "coreEssence": "Intuition, Mystery, Inner Knowing",
    "lightSide": "Wisdom, Empathy, Spiritual Connection",
    "shadowSide": "Secrecy, Passivity, Disconnection from Reality",
    "gift": "Deep emotional and spiritual insight",
    "challenge": "Trusting one's inner voice above external noise",
    "lifeLesson": "Balance intuition with practical action",
    "relationshipPattern": "Deep, soulful connections requiring high trust",
    "moneyPattern": "Wealth flows when aligned with inner values",
    "careerPattern": "Counseling, Healing, Research, Esoteric fields",
    "spiritualPattern": "Channeling divine wisdom",
    "growthDirection": "Learn to express inner knowing outwardly",
    "reflectionPrompt": "Am I listening to my intuition or ignoring it?"
  },
  "3": {
    "id": 3,
    "name": "The Empress",
    "coreEssence": "Abundance, Nurturing, Creativity",
    "lightSide": "Generosity, Fertility, Beauty, Comfort",
    "shadowSide": "Over-protectiveness, Materialism, Neglect",
    "gift": "Fostering growth and unconditional love",
    "challenge": "Avoiding dependency and controlling behaviors",
    "lifeLesson": "Create abundance while maintaining healthy boundaries",
    "relationshipPattern": "Nurturing and deeply caring, but prone to over-mothering",
    "moneyPattern": "Natural attractor of material wealth and comfort",
    "careerPattern": "Design, Healthcare, Education, Hospitality",
    "spiritualPattern": "Finding the divine in nature and creation",
    "growthDirection": "Practice self-care before caring for others",
    "reflectionPrompt": "How can I nurture myself as much as I nurture others?"
  },
  "4": {
    "id": 4,
    "name": "The Emperor",
    "coreEssence": "Structure, Authority, Stability",
    "lightSide": "Leadership, Discipline, Protection",
    "shadowSide": "Tyranny, Rigidity, Stubbornness",
    "gift": "Building lasting foundations and systems",
    "challenge": "Balancing power with compassion",
    "lifeLesson": "True leadership serves rather than commands",
    "relationshipPattern": "Provides security but may struggle with vulnerability",
    "moneyPattern": "Builds wealth through strategy and discipline",
    "careerPattern": "Management, Law, Architecture, Government",
    "spiritualPattern": "Finding order in the chaos of existence",
    "growthDirection": "Embrace flexibility and emotional openness",
    "reflectionPrompt": "Where am I holding on to control too tightly?"
  },
  "5": {
    "id": 5,
    "name": "The Hierophant",
    "coreEssence": "Tradition, Teaching, Belief Systems",
    "lightSide": "Mentorship, Spiritual Guidance, Community",
    "shadowSide": "Dogma, Intolerance, Blind conformity",
    "gift": "Passing down wisdom and upholding structure",
    "challenge": "Questioning outdated beliefs without losing faith",
    "lifeLesson": "Become your own guru while respecting tradition",
    "relationshipPattern": "Seeks traditional bonds and shared values",
    "moneyPattern": "Earns through institutional roles or specialized knowledge",
    "careerPattern": "Education, Religion, Consulting, Mentorship",
    "spiritualPattern": "Bridging the earthly and divine realms",
    "growthDirection": "Find personal truth beyond established rules",
    "reflectionPrompt": "Which of my beliefs belong to society rather than to me?"
  },
  "6": {
    "id": 6,
    "name": "The Lovers",
    "coreEssence": "Choices, Harmony, Relationships",
    "lightSide": "Love, Alignment, Mutual Support",
    "shadowSide": "Indecision, Dependency, Disharmony",
    "gift": "Creating beauty and connecting deeply with others",
    "challenge": "Making choices aligned with the true self",
    "lifeLesson": "True love begins with inner harmony",
    "relationshipPattern": "Intense desire for partnership and soul connection",
    "moneyPattern": "Financial success through partnerships and passion",
    "careerPattern": "Arts, Counseling, Mediation, Matchmaking",
    "spiritualPattern": "Experiencing the divine through union with another",
    "growthDirection": "Learn to make firm decisions based on personal values",
    "reflectionPrompt": "Am I choosing from a place of love or a place of fear?"
  },
  "7": {
    "id": 7,
    "name": "The Chariot",
    "coreEssence": "Movement, Willpower, Victory",
    "lightSide": "Determination, Focus, Ambition",
    "shadowSide": "Aggression, Lack of direction, Ruthlessness",
    "gift": "Overcoming obstacles through sheer will",
    "challenge": "Controlling opposing forces and emotions",
    "lifeLesson": "Victory requires both inner balance and outer action",
    "relationshipPattern": "Dynamic and fast-paced, needs shared goals",
    "moneyPattern": "Achieves goals through relentless drive",
    "careerPattern": "Transportation, Military, Sports, Entrepreneurship",
    "spiritualPattern": "Mastery of the ego and lower desires",
    "growthDirection": "Direct energy purposely rather than impulsively",
    "reflectionPrompt": "What is driving me forward, and is it sustainable?"
  },
  "8": {
    "id": 8,
    "name": "Justice",
    "coreEssence": "Justice, Balance, Responsibility",
    "lightSide": "Integrity, Leadership, Structure",
    "shadowSide": "Control, Judgment, Rigidity",
    "gift": "Creating order and fairness",
    "challenge": "Carrying too much responsibility",
    "lifeLesson": "Balance responsibility and trust",
    "relationshipPattern": "Acts as protector, seeks absolute fairness",
    "moneyPattern": "Builds wealth through structure and karmic balance",
    "careerPattern": "Management, Governance, Systems, Law",
    "spiritualPattern": "Learning karmic balance and the law of cause and effect",
    "growthDirection": "Lead without controlling others",
    "reflectionPrompt": "Where am I carrying burdens that are not mine?"
  },
  "9": {
    "id": 9,
    "name": "The Hermit",
    "coreEssence": "Introspection, Solitude, Wisdom",
    "lightSide": "Inner Guidance, Depth, Independence",
    "shadowSide": "Isolation, Perfectionism, Arrogance",
    "gift": "Gaining deep insights through reflection",
    "challenge": "Reintegrating wisdom back into society",
    "lifeLesson": "The answers you seek are already within you",
    "relationshipPattern": "Requires significant personal space and depth",
    "moneyPattern": "Unattached to wealth, earns through niche expertise",
    "careerPattern": "Research, Writing, Philosophy, Healing",
    "spiritualPattern": "The journey inward to find the divine light",
    "growthDirection": "Share your gathered wisdom with the world",
    "reflectionPrompt": "Am I isolating myself or genuinely seeking inner truth?"
  },
  "10": {
    "id": 10,
    "name": "Wheel of Fortune",
    "coreEssence": "Cycles, Luck, Destiny",
    "lightSide": "Adaptability, Optimism, Synchronicity",
    "shadowSide": "Fatalism, Instability, Fear of change",
    "gift": "Navigating life's ups and downs with grace",
    "challenge": "Finding a stable center amidst constant change",
    "lifeLesson": "Accepting what cannot be controlled",
    "relationshipPattern": "Karmic connections that bring sudden shifts",
    "moneyPattern": "Fluctuating finances, potential for sudden windfalls",
    "careerPattern": "Investing, Gambling, Travel, Event Management",
    "spiritualPattern": "Understanding the cyclical nature of the universe",
    "growthDirection": "Remain centered when the wheel turns",
    "reflectionPrompt": "How can I find peace amidst unpredictable changes?"
  },
  "11": {
    "id": 11,
    "name": "Strength",
    "coreEssence": "Courage, Compassion, Inner Power",
    "lightSide": "Resilience, Gentle Control, Vitality",
    "shadowSide": "Aggressiveness, Weakness, Self-doubt",
    "gift": "Taming primal instincts through love",
    "challenge": "Overcoming inner fears and doubts",
    "lifeLesson": "True strength is gentle, not forceful",
    "relationshipPattern": "Supportive and deeply accepting of flaws",
    "moneyPattern": "Steady growth through persistent, patient effort",
    "careerPattern": "Animal care, Athletics, Therapy, Leadership",
    "spiritualPattern": "Mastering the lower self to elevate the spirit",
    "growthDirection": "Practice patience with yourself and others",
    "reflectionPrompt": "Where do I need to apply compassion rather than force?"
  },
  "12": {
    "id": 12,
    "name": "The Hanged Man",
    "coreEssence": "Surrender, New Perspectives, Sacrifice",
    "lightSide": "Service, Enlightenment, Acceptance",
    "shadowSide": "Victimhood, Martyrdom, Stagnation",
    "gift": "Seeing the world from a completely different angle",
    "challenge": "Letting go of control and accepting the pause",
    "lifeLesson": "Sacrifice the lower for the higher",
    "relationshipPattern": "Prone to self-sacrifice; needs to maintain self-worth",
    "moneyPattern": "Non-materialistic; wealth comes when attachment is released",
    "careerPattern": "Social Work, Psychology, Art, Non-profits",
    "spiritualPattern": "Achieving enlightenment through surrender",
    "growthDirection": "Serve others without becoming a martyr",
    "reflectionPrompt": "What do I need to let go of to gain a new perspective?"
  },
  "13": {
    "id": 13,
    "name": "Death",
    "coreEssence": "Transformation, Endings, Rebirth",
    "lightSide": "Renewal, Clearing, Profound Change",
    "shadowSide": "Fear of change, Clinging to the past, Destruction",
    "gift": "The ability to completely reinvent oneself",
    "challenge": "Embracing necessary endings",
    "lifeLesson": "Every ending is the seed of a new beginning",
    "relationshipPattern": "Intense relationships that catalyze personal growth",
    "moneyPattern": "Wealth cycles of building, clearing out, and rebuilding",
    "careerPattern": "Crisis Management, Transformation coaching, Surgery",
    "spiritualPattern": "The spiritual death of the ego",
    "growthDirection": "Allow dead weight to fall away naturally",
    "reflectionPrompt": "What am I holding onto that no longer serves me?"
  },
  "14": {
    "id": 14,
    "name": "Temperance",
    "coreEssence": "Balance, Alchemy, Moderation",
    "lightSide": "Harmony, Healing, Synthesis",
    "shadowSide": "Extremism, Imbalance, Impatience",
    "gift": "Blending opposites to create something new",
    "challenge": "Finding the middle path in a world of extremes",
    "lifeLesson": "Healing comes through balance and patience",
    "relationshipPattern": "Peaceful, compromising, and harmonizing",
    "moneyPattern": "Steady, balanced financial growth",
    "careerPattern": "Healing arts, Chemistry, Diplomacy, HR",
    "spiritualPattern": "The integration of light and dark within",
    "growthDirection": "Seek moderation in all things",
    "reflectionPrompt": "Where in my life am I leaning too far to one extreme?"
  },
  "15": {
    "id": 15,
    "name": "The Devil",
    "coreEssence": "Materiality, Temptation, Shadow",
    "lightSide": "Charisma, Passion, Physicality",
    "shadowSide": "Addiction, Obsession, Material bondage",
    "gift": "Harnessing raw earthly power and magnetism",
    "challenge": "Breaking free from self-imposed chains",
    "lifeLesson": "Master the material world without being mastered by it",
    "relationshipPattern": "Intensely magnetic but prone to codependency",
    "moneyPattern": "Strong ability to manifest wealth, risk of greed",
    "careerPattern": "Business, Entertainment, Finance, Psychology",
    "spiritualPattern": "Confronting and integrating the shadow self",
    "growthDirection": "Identify and release unhealthy attachments",
    "reflectionPrompt": "What habits or desires are currently controlling me?"
  },
  "16": {
    "id": 16,
    "name": "The Tower",
    "coreEssence": "Sudden Change, Awakening, Deconstruction",
    "lightSide": "Liberation, Truth, Breaking illusions",
    "shadowSide": "Chaos, Trauma, Refusal to adapt",
    "gift": "Tearing down false foundations to reveal truth",
    "challenge": "Rebuilding after unexpected upheaval",
    "lifeLesson": "Growth often requires the destruction of the old",
    "relationshipPattern": "Prone to sudden shifts; needs radical honesty",
    "moneyPattern": "Volatile; requires building on solid, honest foundations",
    "careerPattern": "Emergency Services, Demolition, Tech disruption, Activism",
    "spiritualPattern": "The sudden flash of divine insight",
    "growthDirection": "Embrace the breakdown as a necessary breakthrough",
    "reflectionPrompt": "What false structures in my life need to fall?"
  },
  "17": {
    "id": 17,
    "name": "The Star",
    "coreEssence": "Hope, Inspiration, Creativity",
    "lightSide": "Healing, Optimism, Star Power",
    "shadowSide": "Naivete, Lack of grounding, Despair",
    "gift": "Shining a light of hope for oneself and others",
    "challenge": "Bringing high ideals down to practical reality",
    "lifeLesson": "Your unique light is needed in the world",
    "relationshipPattern": "Idealistic and highly supportive, seeks a soulmate",
    "moneyPattern": "Wealth flows through creative and authentic expression",
    "careerPattern": "Arts, Astrology, Public Relations, Healing",
    "spiritualPattern": "Direct connection to cosmic consciousness",
    "growthDirection": "Stay grounded while reaching for the stars",
    "reflectionPrompt": "How can I share my authentic light with the world?"
  },
  "18": {
    "id": 18,
    "name": "The Moon",
    "coreEssence": "Illusion, Subconscious, Magic",
    "lightSide": "Deep Intuition, Imagination, Empathy",
    "shadowSide": "Anxiety, Deception, Fear of the unknown",
    "gift": "Navigating the depths of the psyche",
    "challenge": "Distinguishing truth from illusion",
    "lifeLesson": "Face your deepest fears to unlock your magic",
    "relationshipPattern": "Highly emotional, empathetic, but prone to projection",
    "moneyPattern": "Intuitive investments, wealth through creative arts",
    "careerPattern": "Psychology, Arts, Magic, Night-time professions",
    "spiritualPattern": "Exploring the dark night of the soul",
    "growthDirection": "Trust your intuition but verify with reality",
    "reflectionPrompt": "What fears are lurking in my subconscious?"
  },
  "19": {
    "id": 19,
    "name": "The Sun",
    "coreEssence": "Joy, Success, Vitality",
    "lightSide": "Optimism, Leadership, Radiance",
    "shadowSide": "Burnout, Ego, Toxic Positivity",
    "gift": "Bringing warmth and clarity to any situation",
    "challenge": "Maintaining humility amidst great success",
    "lifeLesson": "True joy is a state of being, not a destination",
    "relationshipPattern": "Warm, generous, and highly engaging",
    "moneyPattern": "Natural abundance and clear financial success",
    "careerPattern": "Public Speaking, Leadership, Childcare, Entertainment",
    "spiritualPattern": "The pure, innocent joy of existence",
    "growthDirection": "Share your warmth without burning out",
    "reflectionPrompt": "How can I cultivate more childlike joy in my life?"
  },
  "20": {
    "id": 20,
    "name": "Judgement",
    "coreEssence": "Calling, Rebirth, Family Karma",
    "lightSide": "Awakening, Forgiveness, Purpose",
    "shadowSide": "Self-doubt, Unforgiveness, Ignoring the call",
    "gift": "Healing ancestral lines and answering a higher calling",
    "challenge": "Forgiving the past to move forward",
    "lifeLesson": "You are called to a higher purpose",
    "relationshipPattern": "Deep karmic ties, focusing on mutual evolution",
    "moneyPattern": "Wealth tied to family legacy or fulfilling a life purpose",
    "careerPattern": "Genealogy, Law, Broadcasting, Healing ancestral trauma",
    "spiritualPattern": "The resurrection of the spirit",
    "growthDirection": "Heal your roots to expand your branches",
    "reflectionPrompt": "What higher calling am I currently ignoring?"
  },
  "21": {
    "id": 21,
    "name": "The World",
    "coreEssence": "Completion, Global View, Integration",
    "lightSide": "Fulfillment, Expansion, Harmony",
    "shadowSide": "Incompletion, Narrow-mindedness, Stagnation",
    "gift": "Seeing the big picture and achieving grand goals",
    "challenge": "Taking the final step to finish a cycle",
    "lifeLesson": "Everything is connected; you are a global citizen",
    "relationshipPattern": "Seeks a complete, universally aligned partnership",
    "moneyPattern": "Global opportunities and holistic financial success",
    "careerPattern": "International Business, Travel, Technology, Environmentalism",
    "spiritualPattern": "The integration of the soul with the universe",
    "growthDirection": "Expand your horizons beyond the familiar",
    "reflectionPrompt": "What cycle in my life is ready to be completed?"
  },
  "22": {
    "id": 22,
    "name": "The Fool",
    "coreEssence": "Freedom, Beginnings, Zero",
    "lightSide": "Spontaneity, Trust, Limitless Potential",
    "shadowSide": "Recklessness, Naivete, Irresponsibility",
    "gift": "Stepping into the unknown with absolute faith",
    "challenge": "Balancing freedom with basic responsibilities",
    "lifeLesson": "Life is a journey to be experienced, not controlled",
    "relationshipPattern": "Needs immense freedom, struggles with traditional limits",
    "moneyPattern": "Unpredictable; money is seen as a tool for freedom",
    "careerPattern": "Freelancing, Travel, Innovation, Creative Arts",
    "spiritualPattern": "The pure spirit before entering the material world",
    "growthDirection": "Take the leap, but look where you are landing",
    "reflectionPrompt": "Where in my life do I need to take a leap of faith?"
  }
};

// ==========================================
// 1. DESTINY MATRIX COMPATIBILITY (APPROVED SOT)
// ==========================================

function reduceArcana(value) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error("Nilai Arcana harus berupa bilangan bulat positif.");
  }
  let current = value;
  while (current > 22) {
    current = String(current).split("").reduce((sum, d) => sum + Number(d), 0);
  }
  return current;
}

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) throw new Error("Format tanggal harus YYYY-MM-DD.");
  const [year, month, day] = match.slice(1).map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    throw new Error("Tanggal lahir tidak valid.");
  }
  return { year, month, day };
}

function calculatePersonalMatrix(birthDate) {
  const { year, month, day } = parseDate(birthDate);
  const a = reduceArcana(day);
  const b = reduceArcana(month);
  const yearSum = String(year).split("").reduce((sum, d) => sum + Number(d), 0);
  const c = reduceArcana(yearSum);
  const d = reduceArcana(a + b + c);
  const center = reduceArcana(a + b + c + d);
  const northWest = reduceArcana(a + b);
  const northEast = reduceArcana(b + c);
  const southWest = reduceArcana(d + a);
  const southEast = reduceArcana(c + d);
  return { west: a, north: b, east: c, south: d, center, northWest, northEast, southWest, southEast };
}

function calculateCompatibilityMatrix(input) {
  const male = calculatePersonalMatrix(input.malePartner.birthDate);
  const female = calculatePersonalMatrix(input.femalePartner.birthDate);

  const northOuter = reduceArcana(male.north + female.north);
  const northEastOuter = reduceArcana(male.northEast + female.northEast);
  const eastOuter = reduceArcana(male.east + female.east);
  const southEastOuter = reduceArcana(male.southEast + female.southEast);
  const southOuter = reduceArcana(male.south + female.south);
  const southWestOuter = reduceArcana(male.southWest + female.southWest);
  const westOuter = reduceArcana(male.west + female.west);
  const northWestOuter = reduceArcana(male.northWest + female.northWest);
  const center = reduceArcana(male.center + female.center);

  const northInner = reduceArcana(northOuter + center);
  const northMiddle = reduceArcana(northOuter + northInner);
  const eastInner = reduceArcana(eastOuter + center);
  const eastMiddle = reduceArcana(eastOuter + eastInner);
  const southInner = reduceArcana(southOuter + center);
  const southMiddle = reduceArcana(southOuter + southInner);
  const westInner = reduceArcana(westOuter + center);
  const westMiddle = reduceArcana(westOuter + westInner);

  const loveMoneyJunction = reduceArcana(southInner + eastInner);
  const lovePoint = reduceArcana(southInner + loveMoneyJunction);
  const moneyPoint = reduceArcana(eastInner + loveMoneyJunction);

  const nodes = {
    northOuter, northEastOuter, eastOuter, southEastOuter, southOuter, southWestOuter, westOuter, northWestOuter, center,
    northMiddle, northInner, eastInner, eastMiddle, southInner, southMiddle, westInner, westMiddle,
    lovePoint, loveMoneyJunction, moneyPoint
  };

  const sky = reduceArcana(nodes.northOuter + nodes.southOuter);
  const earth = reduceArcana(nodes.westOuter + nodes.eastOuter);
  const relationships = { sky, earth, result: reduceArcana(sky + earth) };

  const masculineEnergy = reduceArcana(nodes.northWestOuter + nodes.southEastOuter);
  const feminineEnergy = reduceArcana(nodes.northEastOuter + nodes.southWestOuter);
  const merger = { masculineEnergy, feminineEnergy, result: reduceArcana(masculineEnergy + feminineEnergy) };

  const harmony = {
    relationship: relationships.result,
    merger: merger.result,
    result: reduceArcana(relationships.result + merger.result)
  };

  const zones = {
    centerArcana: center,
    meetingPurpose: { spiritualTask: northOuter, materialTask: westOuter, code: [northOuter, westOuter] },
    portraitZone: { publicImage: westOuter, lessonFromChildren: eastInner, parentalTask: westInner, code: [westOuter, eastInner, westInner] },
    talentZone: { inspirationAndCrisisRecovery: northOuter, potentialBreakupTrigger: northMiddle, dailyCoupleBehavior: northInner, code: [northOuter, northMiddle, northInner] },
    karmicTail: { issueTrigger: southOuter, unconsciousPattern: southMiddle, majorInfluence: southInner, code: [southOuter, southMiddle, southInner] },
    loveLine: { karmicEntry: southInner, lovePoint, loveMoneyJunction, code: [southInner, lovePoint, loveMoneyJunction] },
    pathToRelationshipHarmony: [southInner, lovePoint, loveMoneyJunction],
    missingEnergyForHarmony: lovePoint,
    economicLane: { loveMoneyJunction, moneyPoint, financialEntry: eastInner, code: [loveMoneyJunction, moneyPoint, eastInner] },
    financialActionPath: [loveMoneyJunction, moneyPoint, eastInner],
    financialWellbeingZone: { eastInner, eastMiddle, eastOuter, code: [eastInner, eastMiddle, eastOuter] },
    relationshipBehavior: { male: northWestOuter, female: eastInner },
    qualitiesToDevelop: { female: southWestOuter, male: southEastOuter },
    masculineGenerationLine: [northWestOuter, center, southEastOuter],
    feminineGenerationLine: [southWestOuter, center, northEastOuter]
  };

  return {
    input,
    personal: { malePartner: male, femalePartner: female },
    nodes,
    zones,
    relationships,
    merger,
    harmony,
    metadata: {
      canonicalSotVersion: "1.0.0",
      canonicalFormulaVersion: "1.0.0",
      engine: "bhumi-native-matrix-standalone",
      calculatedAt: new Date().toISOString()
    }
  };
}

function generateOctagonSvg(nodes) {
  const coords = {
    northOuter: [250, 40],
    northEastOuter: [398, 102],
    eastOuter: [460, 250],
    southEastOuter: [398, 398],
    southOuter: [250, 460],
    southWestOuter: [102, 398],
    westOuter: [40, 250],
    northWestOuter: [102, 102],
    center: [250, 250],
    northMiddle: [250, 110],
    northInner: [250, 180],
    eastMiddle: [390, 250],
    eastInner: [320, 250],
    southMiddle: [250, 390],
    southInner: [250, 320],
    westMiddle: [110, 250],
    westInner: [180, 250],
    lovePoint: [285, 285],
    loveMoneyJunction: [299, 299],
    moneyPoint: [315, 275]
  };

  let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" class="compatibility-svg" role="img" aria-label="Diagram Octagon Kompatibilitas">';
  svg += '<defs><style>.grid-line{stroke:#B8BDB6;stroke-width:1;fill:none}.masc-line{stroke:#56759A;stroke-width:1.5;stroke-dasharray:4,3}.fem-line{stroke:#9A5F78;stroke-width:1.5;stroke-dasharray:4,3}.channel-line{stroke:#9B704E;stroke-width:1.8}.node-c{fill:#F8F5EE;stroke:#4F5E52;stroke-width:1.5}.node-t{font-family:monospace;font-size:11px;font-weight:700;text-anchor:middle;dominant-baseline:central;fill:#2D4B34}.node-center-c{fill:#2D4B34;stroke:#C5A880;stroke-width:2}.node-center-t{font-family:monospace;font-size:13px;font-weight:800;text-anchor:middle;dominant-baseline:central;fill:#FAF7F0}</style></defs>';

  svg += '<rect x="40" y="40" width="420" height="420" class="grid-line" />';
  svg += '<polygon points="250,40 460,250 250,460 40,250" class="grid-line" />';
  svg += '<line x1="250" y1="40" x2="250" y2="460" class="grid-line" />';
  svg += '<line x1="40" y1="250" x2="460" y2="250" class="grid-line" />';
  svg += '<line x1="102" y1="102" x2="398" y2="398" class="masc-line" />';
  svg += '<line x1="102" y1="398" x2="398" y2="102" class="fem-line" />';
  svg += '<line x1="' + coords.southInner[0] + '" y1="' + coords.southInner[1] + '" x2="' + coords.eastInner[0] + '" y2="' + coords.eastInner[1] + '" class="channel-line" />';

  const list = [
    { k: 'northOuter', r: 12 }, { k: 'northEastOuter', r: 11 }, { k: 'eastOuter', r: 12 },
    { k: 'southEastOuter', r: 11 }, { k: 'southOuter', r: 12 }, { k: 'southWestOuter', r: 11 },
    { k: 'westOuter', r: 12 }, { k: 'northWestOuter', r: 11 },
    { k: 'northMiddle', r: 9 }, { k: 'northInner', r: 9 },
    { k: 'eastMiddle', r: 9 }, { k: 'eastInner', r: 9 },
    { k: 'southMiddle', r: 9 }, { k: 'southInner', r: 9 },
    { k: 'westMiddle', r: 9 }, { k: 'westInner', r: 9 },
    { k: 'lovePoint', r: 9 }, { k: 'loveMoneyJunction', r: 10 }, { k: 'moneyPoint', r: 9 },
    { k: 'center', r: 15, isCenter: true }
  ];

  for (const item of list) {
    const pt = coords[item.k];
    const val = nodes[item.k];
    if (item.isCenter) {
      svg += '<circle cx="' + pt[0] + '" cy="' + pt[1] + '" r="' + item.r + '" class="node-center-c" />';
      svg += '<text x="' + pt[0] + '" y="' + pt[1] + '" class="node-center-t">' + val + '</text>';
    } else {
      svg += '<circle cx="' + pt[0] + '" cy="' + pt[1] + '" r="' + item.r + '" class="node-c" />';
      svg += '<text x="' + pt[0] + '" y="' + pt[1] + '" class="node-t">' + val + '</text>';
    }
  }

  svg += '</svg>';
  return svg;
}

// ==========================================
// 2. SYNASTRY NATAL CHART COUPLE ENGINE
// ==========================================

const SIGNS = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
const SIGN_NAMES_ID = {
  Aries: "Aries", Taurus: "Taurus", Gemini: "Gemini", Cancer: "Cancer",
  Leo: "Leo", Virgo: "Virgo", Libra: "Libra", Scorpio: "Scorpio",
  Sagittarius: "Sagitarius", Capricorn: "Kaprikornus", Aquarius: "Akuarius", Pisces: "Pises"
};

const SIGN_META = {
  Aries: { element: "Fire", modality: "Cardinal", elementId: "Api", modalityId: "Kardinal" },
  Taurus: { element: "Earth", modality: "Fixed", elementId: "Tanah", modalityId: "Tetap" },
  Gemini: { element: "Air", modality: "Mutable", elementId: "Udara", modalityId: "Dinamis" },
  Cancer: { element: "Water", modality: "Cardinal", elementId: "Air", modalityId: "Kardinal" },
  Leo: { element: "Fire", modality: "Fixed", elementId: "Api", modalityId: "Tetap" },
  Virgo: { element: "Earth", modality: "Mutable", elementId: "Tanah", modalityId: "Dinamis" },
  Libra: { element: "Air", modality: "Cardinal", elementId: "Udara", modalityId: "Kardinal" },
  Scorpio: { element: "Water", modality: "Fixed", elementId: "Air", modalityId: "Tetap" },
  Sagittarius: { element: "Fire", modality: "Mutable", elementId: "Api", modalityId: "Dinamis" },
  Capricorn: { element: "Earth", modality: "Cardinal", elementId: "Tanah", modalityId: "Kardinal" },
  Aquarius: { element: "Air", modality: "Fixed", elementId: "Udara", modalityId: "Tetap" },
  Pisces: { element: "Water", modality: "Mutable", elementId: "Air", modalityId: "Dinamis" },
};

const PLANET_ORDER = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
const PLANET_NAMES_ID = {
  Sun: "Matahari", Moon: "Bulan", Mercury: "Merkurius", Venus: "Venus", Mars: "Mars",
  Jupiter: "Yupiter", Saturn: "Saturnus", Uranus: "Uranus", Neptune: "Neptunus", Pluto: "Pluto",
  Ascendant: "Titik Terbit (Ascendant)", Midheaven: "Puncak Langit (MC)"
};

const PLANET_SHORT = {
  Sun: "Su", Moon: "Mo", Mercury: "Me", Venus: "Ve", Mars: "Ma",
  Jupiter: "Ju", Saturn: "Sa", Uranus: "Ur", Neptune: "Ne", Pluto: "Pl",
  Ascendant: "ASC", Midheaven: "MC"
};

const ASPECT_CONFIG = {
  Conjunction: { angle: 0, orb: 8, indonesianName: "Konjungsi", symbol: "☌", nature: "Penyatuan Energi" },
  Opposition: { angle: 180, orb: 8, indonesianName: "Oposisi", symbol: "☍", nature: "Tarik-Menarik & Keseimbangan" },
  Trine: { angle: 120, orb: 8, indonesianName: "Trine", symbol: "△", nature: "Aliran Harmonis & Suportif" },
  Square: { angle: 90, orb: 7, indonesianName: "Square", symbol: "□", nature: "Ketegangan & Pertumbuhan" },
  Sextile: { angle: 60, orb: 5, indonesianName: "Sextile", symbol: "⚹", nature: "Peluang & Sinergi" },
};

function normalizeLongitude(lon) {
  return ((lon % 360) + 360) % 360;
}

function angularDistance(a, b) {
  const diff = Math.abs(normalizeLongitude(a) - normalizeLongitude(b));
  return diff > 180 ? 360 - diff : diff;
}

function signFromLongitude(lon) {
  return SIGNS[Math.floor(normalizeLongitude(lon) / 30)];
}

function degreeInSign(lon) {
  return Number((normalizeLongitude(lon) % 30).toFixed(4));
}

function minuteInSign(lon) {
  return Math.floor((degreeInSign(lon) % 1) * 60);
}

function formatDegreeMinute(lon) {
  const norm = normalizeLongitude(lon);
  const sign = signFromLongitude(norm);
  const deg = Math.floor(norm % 30);
  const min = Math.floor(((norm % 30) - deg) * 60);
  return deg + "° " + (SIGN_NAMES_ID[sign] || sign) + " " + String(min).padStart(2, "0") + "′";
}

function formatOrb(orbValue) {
  const deg = Math.floor(orbValue);
  const min = Math.round((orbValue - deg) * 60);
  return deg + "°" + String(min).padStart(2, "0") + "′";
}

function toUtcDate(birthDate, birthTime, timezone = "+07:00") {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(birthDate || "").trim());
  if (!dateMatch) throw new Error("Format tanggal lahir harus YYYY-MM-DD.");
  const timeStr = String(birthTime || "12:00").trim();
  const timeMatch = /^(\d{1,2}):(\d{2})$/.exec(timeStr);
  const [year, month, day] = dateMatch.slice(1).map(Number);
  const hour = timeMatch ? Number(timeMatch[1]) : 12;
  const minute = timeMatch ? Number(timeMatch[2]) : 0;

  const tzStr = String(timezone || "+07:00").trim();
  let offsetMins = 420; // default WIB (+07:00)
  const offsetMatch = /^([+-])(\d{1,2}):?(\d{2})?$/.exec(tzStr);
  if (offsetMatch) {
    offsetMins = (offsetMatch[1] === "-" ? -1 : 1) * (Number(offsetMatch[2]) * 60 + Number(offsetMatch[3] || 0));
  } else if (tzStr.includes("Jakarta") || tzStr.includes("WIB")) {
    offsetMins = 420;
  } else if (tzStr.includes("Makassar") || tzStr.includes("WITA") || tzStr.includes("Bali")) {
    offsetMins = 480;
  } else if (tzStr.includes("Jayapura") || tzStr.includes("WIT")) {
    offsetMins = 540;
  }

  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute) - offsetMins * 60000);
  if (isNaN(utc.getTime())) throw new Error("Tanggal atau jam lahir tidak valid.");
  return utc;
}

function getAstronomyInstance() {
  if (typeof window !== "undefined" && window.Astronomy) {
    return window.Astronomy;
  }
  if (typeof Astronomy !== "undefined") {
    return Astronomy;
  }
  return null;
}

function meanNorthNode(date) {
  const days = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;
  return normalizeLongitude(125.04452 - 0.0529538083 * days);
}

function longitudeFor(name, date, astro) {
  if (name === "Sun") return astro.SunPosition(date).elon;
  if (name === "Moon") return astro.EclipticGeoMoon(date).lon;
  if (name === "NorthNode") return meanNorthNode(date);
  if (name === "SouthNode") return normalizeLongitude(meanNorthNode(date) + 180);
  return astro.Ecliptic(astro.GeoVector(astro.Body[name], date, true)).elon;
}

function calculateAngles(date, latitude, longitude, astro) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  const armc = normalizeLongitude((astro.SiderealTime(date) + longitude / 15) * 15);
  const obliquity = astro.e_tilt(astro.MakeTime(date)).tobl;
  const rad = d => (d * Math.PI) / 180;
  const deg = r => (r * 180) / Math.PI;

  const armcRad = rad(armc);
  const obRad = rad(obliquity);
  const latRad = rad(latitude);

  const ascendantLongitude = normalizeLongitude(deg(Math.atan2(
    -Math.cos(armcRad),
    Math.sin(armcRad) * Math.cos(obRad) + Math.tan(latRad) * Math.sin(obRad)
  )) + 180);

  const midheavenLongitude = normalizeLongitude(deg(Math.atan2(
    Math.sin(armcRad),
    Math.cos(armcRad) * Math.cos(obRad)
  )));

  return {
    ascendantLongitude: Number(ascendantLongitude.toFixed(4)),
    midheavenLongitude: Number(midheavenLongitude.toFixed(4))
  };
}

function calculatePersonNatal(input) {
  const astro = getAstronomyInstance();
  if (!astro) throw new Error("Astronomy Engine belum siap dimuat di browser.");

  const name = String(input.name || "Partner").trim();
  const birthDate = String(input.birthDate || "").trim();
  const isTimeUnknown = Boolean(input.isTimeUnknown || !input.birthTime);
  const birthTime = isTimeUnknown ? "12:00" : String(input.birthTime).trim();
  const timezone = input.timezone || "+07:00";
  const latitude = Number.isFinite(input.latitude) ? input.latitude : -6.2088;
  const longitude = Number.isFinite(input.longitude) ? input.longitude : 106.8456;
  const birthCity = input.birthCity || "Indonesia";

  const date = toUtcDate(birthDate, birthTime, timezone);
  const yesterday = new Date(date.getTime() - 86400000);

  const planets = {};
  for (const pName of PLANET_ORDER) {
    const lon = normalizeLongitude(longitudeFor(pName, date, astro));
    const lonYest = normalizeLongitude(longitudeFor(pName, yesterday, astro));
    let motion = lon - lonYest;
    if (motion > 180) motion -= 360;
    if (motion < -180) motion += 360;
    const retrograde = !["Sun", "Moon"].includes(pName) && motion < 0;
    const sign = signFromLongitude(lon);
    const degVal = degreeInSign(lon);
    const minVal = minuteInSign(lon);

    planets[pName] = {
      name: pName,
      indonesianName: PLANET_NAMES_ID[pName] || pName,
      short: PLANET_SHORT[pName] || pName.substring(0, 2),
      longitude: Number(lon.toFixed(4)),
      sign,
      signId: SIGN_NAMES_ID[sign] || sign,
      degree: degVal,
      minute: minVal,
      formatted: formatDegreeMinute(lon),
      retrograde
    };
  }

  let angles = null;
  if (!isTimeUnknown) {
    const rawAngles = calculateAngles(date, latitude, longitude, astro);
    if (rawAngles) {
      const ascSign = signFromLongitude(rawAngles.ascendantLongitude);
      const mcSign = signFromLongitude(rawAngles.midheavenLongitude);
      angles = {
        ascendant: {
          name: "Ascendant",
          indonesianName: PLANET_NAMES_ID.Ascendant,
          short: "ASC",
          longitude: rawAngles.ascendantLongitude,
          sign: ascSign,
          signId: SIGN_NAMES_ID[ascSign] || ascSign,
          formatted: formatDegreeMinute(rawAngles.ascendantLongitude)
        },
        midheaven: {
          name: "Midheaven",
          indonesianName: PLANET_NAMES_ID.Midheaven,
          short: "MC",
          longitude: rawAngles.midheavenLongitude,
          sign: mcSign,
          signId: SIGN_NAMES_ID[mcSign] || mcSign,
          formatted: formatDegreeMinute(rawAngles.midheavenLongitude)
        }
      };
    }
  }

  const elements = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modalities = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  const weights = { Sun: 3, Moon: 3, Mercury: 2, Venus: 2, Mars: 2, Jupiter: 1.5, Saturn: 1.5, Uranus: 1, Neptune: 1, Pluto: 1 };

  for (const [pName, pData] of Object.entries(planets)) {
    const meta = SIGN_META[pData.sign];
    if (meta) {
      const w = weights[pName] || 1;
      elements[meta.element] += w;
      modalities[meta.modality] += w;
    }
  }

  const dominantElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0];
  const dominantModality = Object.entries(modalities).sort((a, b) => b[1] - a[1])[0][0];

  return {
    input: { name, birthDate, birthTime, isTimeUnknown, birthCity, latitude, longitude, timezone },
    isTimeKnown: !isTimeUnknown,
    timePrecisionNote: isTimeUnknown
      ? "Jam lahir tidak diketahui: posisi planet dihitung pada pukul 12:00 waktu lokal. Posisi Bulan memiliki toleransi sekitar ±6°. Posisi Ascendant dan rumah astrologi ditiadakan demi akurasi data."
      : "Data kelahiran lengkap dan waktu presisi terverifikasi.",
    sunSign: planets.Sun.sign,
    sunSignId: planets.Sun.signId,
    moonSign: planets.Moon.sign,
    moonSignId: planets.Moon.signId,
    risingSign: angles ? angles.ascendant.sign : null,
    risingSignId: angles ? angles.ascendant.signId : null,
    midheavenSign: angles ? angles.midheaven.sign : null,
    planets,
    angles,
    balances: {
      elements,
      modalities,
      dominantElement,
      dominantModality,
      dominantElementId: SIGN_META[planets.Sun.sign]?.elementId || dominantElement,
      dominantModalityId: SIGN_META[planets.Sun.sign]?.modalityId || dominantModality
    }
  };
}

function detectSynastryAspect(lonA, lonB, planetA, planetB) {
  const dist = angularDistance(lonA, lonB);
  for (const [type, cfg] of Object.entries(ASPECT_CONFIG)) {
    let maxOrb = cfg.orb;
    if (["Sun", "Moon"].includes(planetA) || ["Sun", "Moon"].includes(planetB)) {
      maxOrb += 1;
    }
    const orb = Math.abs(dist - cfg.angle);
    if (orb <= maxOrb) {
      return {
        type,
        angle: cfg.angle,
        indonesianName: cfg.indonesianName,
        symbol: cfg.symbol,
        nature: cfg.nature,
        orb: Number(orb.toFixed(2)),
        exactDistance: Number(dist.toFixed(2))
      };
    }
  }
  return null;
}

function calculateSynastryAspects(planetsA, planetsB) {
  const aspects = [];
  const listA = Object.values(planetsA);
  const listB = Object.values(planetsB);

  for (const pA of listA) {
    for (const pB of listB) {
      const match = detectSynastryAspect(pA.longitude, pB.longitude, pA.name, pB.name);
      if (match) {
        aspects.push({
          planetA: pA.name,
          planetAIndo: pA.indonesianName,
          planetALon: pA.longitude,
          planetASign: pA.signId,
          planetB: pB.name,
          planetBIndo: pB.indonesianName,
          planetBLon: pB.longitude,
          planetBSign: pB.signId,
          type: match.type,
          indonesianName: match.indonesianName,
          symbol: match.symbol,
          nature: match.nature,
          angle: match.angle,
          orb: match.orb,
          formattedOrb: formatOrb(match.orb)
        });
      }
    }
  }
  aspects.sort((a, b) => a.orb - b.orb);
  return aspects;
}

function getAspectInterpretation(aspect, nameA, nameB) {
  const { planetA, planetB, type } = aspect;
  const isHarmonious = ["Trine", "Sextile"].includes(type) || (type === "Conjunction" && !["Saturn", "Pluto", "Mars"].includes(planetA) && !["Saturn", "Pluto", "Mars"].includes(planetB));
  const pairKey = [planetA, planetB].sort().join("-");

  const interpretations = {
    "Moon-Sun": {
      category: "emotional",
      categoryTitle: "Koneksi Jiwa & Emosi Dasar",
      title: (type === "Conjunction" ? "Penyatuan Jiwa" : isHarmonious ? "Resonansi Jiwa Alami" : "Dinamika Penyesuaian Batin") + " (Matahari & Bulan)",
      summary: isHarmonious
        ? "Kehadiran " + nameA + " dan " + nameB + " saling memberi rasa aman batin yang alami. Kebutuhan emosional salah satu pihak secara spontan direspon dan dihargai oleh tujuan hidup pasangan."
        : "Terdapat daya tarik batin yang sangat kuat, namun ritme kebutuhan pribadi dan cara merespons emosi menuntut kesabaran serta saling mendengarkan secara jernih tanpa prasangka."
    },
    "Moon-Moon": {
      category: "emotional",
      categoryTitle: "Kenyamanan Ruang Domestik & Naluri",
      title: (isHarmonious ? "Harmoni Naluri & Empati" : "Perbedaan Bahasa Emosi") + " (Bulan & Bulan)",
      summary: isHarmonious
        ? "Kalian berdua memiliki pemahaman suasana hati yang sangat intuitif. Di ruang privat, kalian mudah merasa seperti 'di rumah sendiri' saat bersama."
        : "Cara kalian memproses perasaan dan mencari rasa aman berbeda. Menghargai cara menenangkan diri masing-masing adalah kunci kedamaian jangka panjang."
    },
    "Moon-Venus": {
      category: "emotional",
      categoryTitle: "Kelembutan & Kasih Sayang",
      title: (isHarmonious ? "Kehangatan Cinta & Kelembutan" : "Penyesuaian Bahasa Cinta") + " (Bulan & Venus)",
      summary: isHarmonious
        ? "Kombinasi cinta yang sangat manis, hangat, dan menenangkan. Perhatian-perhatian kecil dihargai dan dirawat dengan penuh ketulusan."
        : "Kebutuhan rasa aman emosional dan cara mengekspresikan asmara kadang memerlukan penyesuaian agar tidak terjadi salah tafsir atas perhatian pasangan."
    },
    "Mercury-Sun": {
      category: "communication",
      categoryTitle: "Komunikasi & Pola Pikir",
      title: (isHarmonious ? "Aliran Ide & Pemahaman Spontan" : "Klarifikasi Sudut Pandang") + " (Matahari & Merkurius)",
      summary: isHarmonious
        ? "Obrolan terasa mengalir tanpa beban. " + nameA + " dan " + nameB + " mudah memahami gagasan, niat, dan arah pembicaraan satu sama lain."
        : "Terkadang persepsi dan cara berbicara terasa berbeda. Berikan waktu jeda sebelum menyimpulkan maksud pasangan."
    },
    "Mercury-Mercury": {
      category: "communication",
      categoryTitle: "Frekuensi Intelektual",
      title: (isHarmonious ? "Satu Gelombang Pikiran" : "Gaya Komunikasi yang Beragam") + " (Merkurius & Merkurius)",
      summary: isHarmonious
        ? "Kalian memiliki ritme percakapan yang setara dan menyenangkan. Diskusi sehari-hari maupun pertukaran wawasan baru terasa memuaskan rasa ingin tahu."
        : "Cara kalian menyusun logika dan mengambil keputusan memiliki corak berbeda. Perbedaan ini memperkaya alternatif solusi jika dikomunikasikan secara tenang."
    },
    "Mercury-Moon": {
      category: "communication",
      categoryTitle: "Dialog Hati ke Hati",
      title: (isHarmonious ? "Kepekaan Mendengar & Berbicara" : "Keseimbangan Nalar dan Rasa") + " (Merkurius & Bulan)",
      summary: isHarmonious
        ? "Salah satu pihak mampu menamai perasaan dengan kata-kata yang menenangkan, sementara yang lain merasa didengar seutuhnya."
        : "Sering terjadi situasi di mana salah satu berbicara dengan logika murni, sedangkan yang lain merespons dengan rasa. Dengarkan sebelum menganalisis."
    },
    "Mars-Venus": {
      category: "attraction",
      categoryTitle: "Romantika & Daya Tarik",
      title: (isHarmonious ? "Percikan Asmara & Magnetisme Romantis" : "Gairah Intens & Dinamika Emosi") + " (Venus & Mars)",
      summary: isHarmonious
        ? "Aspek klasik daya tarik timbal balik. Terdapat percikan romansa, kehangatan fisik, dan antusiasme asmara yang saling menyalakan daya hidup."
        : "Daya tariknya sangat kuat dan menggugah, namun dapat memicu ego jika salah satu merasa diabaikan. Salurkan energi ini untuk kreasi dan keintiman sehat."
    },
    "Sun-Venus": {
      category: "attraction",
      categoryTitle: "Apresiasi & Kekaguman",
      title: (isHarmonious ? "Rasa Kagum & Kasih Tulus" : "Penyelarasan Nilai Kebahagiaan") + " (Matahari & Venus)",
      summary: isHarmonious
        ? "Kalian saling menyukai kehadiran masing-masing. Ada rasa bangga dan apresiasi yang tulus terhadap karakter serta pesona pasangan."
        : "Ekspektasi tentang romantisme atau prioritas kenyamanan perlu diselaraskan agar tidak menuntut pembuktian yang berlebihan."
    },
    "Jupiter-Sun": {
      category: "growth",
      categoryTitle: "Pertumbuhan & Optimisme",
      title: (isHarmonious ? "Dukungan Moral & Wawasan Luas" : "Pengelolaan Ekspektasi Bersama") + " (Matahari & Yupiter)",
      summary: isHarmonious
        ? "Hubungan ini membawa banyak optimisme, tawa, dan rasa syukur. Kehadiran pasangan memperluas sudut pandang hidup dan memupuk harapan baik."
        : "Antusiasme hubungan sangat besar, namun pastikan janji dan komitmen tetap berpijak pada kemampuan nyata."
    },
    "Saturn-Sun": {
      category: "challenge",
      categoryTitle: "Komitmen & Pendewasaan",
      title: (isHarmonious ? "Fondasi Kokoh & Kesetiaan Nyata" : "Ujian Tanggung Jawab & Ekspektasi") + " (Matahari & Saturnus)",
      summary: isHarmonious
        ? "Ikatan ini dibangun di atas rasa tanggung jawab yang matang. Saling menghormati batas dan bersedia berkomitmen jangka panjang."
        : "Kadang terasa ada beban tuntutan atau kritik yang kaku. Ubah tekanan menjadi apresiasi atas setiap proses perbaikan bertahap."
    },
    "Saturn-Venus": {
      category: "challenge",
      categoryTitle: "Komitmen Relasi Jangka Panjang",
      title: (isHarmonious ? "Cinta yang Teruji Waktu" : "Ketakutan Ditolak atau Dingin") + " (Venus & Saturnus)",
      summary: isHarmonious
        ? "Cinta yang tenang, dapat diandalkan, dan berakar pada dedikasi nyata. Tidak terburu-buru, namun makin indah seiring bertambahnya usia relasi."
        : "Jangan biarkan rutinitas dan rasa takut membuat hubungan kehilangan kehangatan ekspresi kasih sayang harian."
    },
    "Pluto-Venus": {
      category: "challenge",
      categoryTitle: "Transformasi Kedalaman Rasa",
      title: (isHarmonious ? "Kedalaman Cinta yang Transformatif" : "Isu Kontrol & Intensitas Rasa") + " (Venus & Pluto)",
      summary: isHarmonious
        ? "Hubungan ini membuka dimensi cinta yang sangat mendalam dan autentik. Kalian belajar melepaskan kepura-puraan demi kedekatan jiwa murni."
        : "Hindari dorongan mendominasi atau kecemburuan yang tidak berdasar. Kepercayaan adalah fondasi paling esensial dalam ikatan seintens ini."
    }
  };

  if (interpretations[pairKey]) return interpretations[pairKey];

  return {
    category: isHarmonious ? "growth" : "challenge",
    categoryTitle: isHarmonious ? "Dinamika Suportif" : "Ruang Pendewasaan",
    title: aspect.nature + " (" + (PLANET_NAMES_ID[planetA] || planetA) + " & " + (PLANET_NAMES_ID[planetB] || planetB) + ")",
    summary: isHarmonious
      ? "Interaksi antara " + (PLANET_NAMES_ID[planetA] || planetA) + " milik " + nameA + " dan " + (PLANET_NAMES_ID[planetB] || planetB) + " milik " + nameB + " menghadirkan sinergi yang saling memperkuat pemahaman dan langkah hidup bersama."
      : "Interaksi antara " + (PLANET_NAMES_ID[planetA] || planetA) + " dan " + (PLANET_NAMES_ID[planetB] || planetB) + " menghadirkan dinamika yang menantang namun kaya akan pelajaran kedewasaan emosional dan komunikasi terbuka."
  };
}

function synthesizeRelationship(personA, personB, aspects) {
  const elemA = personA.balances.dominantElement;
  const elemB = personB.balances.dominantElement;

  const elementSynergies = {
    "Fire-Fire": "Dua jiwa yang penuh gairah, dinamis, dan saling memicu antusiasme. Perlu menjaga agar api tidak saling membakar saat ego meninggi.",
    "Fire-Air": "Kombinasi yang saling menginspirasi: udara meniupkan ide segar sementara api memberi dorongan aksi yang bersemangat.",
    "Fire-Earth": "Penyatuan antara visi dinamis dan pijakan praktis. Tanah memberi wadah nyata bagi api, sementara api memberi kehangatan bagi tanah.",
    "Fire-Water": "Hubungan yang kaya akan intensitas emosi dan semangat hidup. Membutuhkan kepekaan agar air tidak memadamkan api, dan api tidak mendidihkan air.",
    "Earth-Earth": "Fondasi yang sangat kokoh, stabil, loyal, dan berorientasi pada keamanan masa depan. Tambahkan spontanitas agar tidak monoton.",
    "Earth-Air": "Sinergi antara nalar konseptual dan realitas praktis. Keduanya saling melengkapi dalam merancang strategi hidup yang solid.",
    "Earth-Water": "Kombinasi yang subur, merawat, dan saling menenangkan. Air memberi kelembutan emosi, sementara tanah memberi rasa aman yang nyata.",
    "Air-Air": "Koneksi intelektual yang sangat kaya. Pembicaraan tak pernah habis dan kalian menjadi sahabat bertukar wawasan terbaik satu sama lain.",
    "Air-Water": "Pertemuan antara kedalaman rasa dan kejernihan pikiran. Perlu jembatan komunikasi agar logika dan intuisi saling menghargai.",
    "Water-Water": "Ikatan emosional dan spiritual yang sangat dalam. Saling memahami tanpa kata, namun perlu batasan sehat agar tidak tenggelam dalam drama."
  };

  const pairKey = [elemA, elemB].sort().join("-");
  const elementSummary = elementSynergies[pairKey] || "Kombinasi energi yang saling melengkapi dan memberi warna bagi pertumbuhan relasi.";

  let harmoniousCount = 0;
  let dynamicCount = 0;
  for (const a of aspects) {
    if (["Trine", "Sextile"].includes(a.type)) harmoniousCount++;
    if (["Square", "Opposition"].includes(a.type)) dynamicCount++;
    if (a.type === "Conjunction") {
      if (["Saturn", "Pluto", "Mars"].includes(a.planetA) || ["Saturn", "Pluto", "Mars"].includes(a.planetB)) dynamicCount++;
      else harmoniousCount++;
    }
  }

  const total = harmoniousCount + dynamicCount;
  const harmonyPercent = total > 0 ? Math.round((harmoniousCount / total) * 100) : 50;

  return {
    elementSynergy: {
      partnerAElement: personA.balances.dominantElementId,
      partnerBElement: personB.balances.dominantElementId,
      description: elementSummary
    },
    aspectMetrics: {
      harmoniousAspects: harmoniousCount,
      dynamicAspects: dynamicCount,
      totalSignificantAspects: aspects.length,
      harmonyFlowRatio: harmonyPercent + "% Aliran Harmonis / " + (100 - harmonyPercent) + "% Dinamika Pertumbuhan"
    },
    reflectiveConclusion: harmonyPercent >= 60
      ? "Pola astrologi synastry " + personA.input.name + " & " + personB.input.name + " menunjukkan aliran saling melengkapi yang kuat. Kenyamanan batin dan keselarasan nilai mempermudah perjalanan bersama, asalkan komunikasi terbuka tetap dirawat saat perbedaan sesekali muncul."
      : "Hubungan ini adalah ruang pembelajaran jiwa yang sangat transformatif. Ketegangan dinamis yang ada bukan tanda ketidakcocokan, melainkan undangan untuk mendewasakan ego, merawat batasan sehat, dan menemukan titik temu yang lebih mendalam."
  };
}

function calculateSynastryCouple(inputA, inputB) {
  const personA = calculatePersonNatal(inputA);
  const personB = calculatePersonNatal(inputB);
  const aspects = calculateSynastryAspects(personA.planets, personB.planets);

  const enrichedAspects = aspects.map(asp => ({
    ...asp,
    interpretation: getAspectInterpretation(asp, personA.input.name, personB.input.name)
  }));

  const categories = {
    emotional: enrichedAspects.filter(a => a.interpretation.category === "emotional"),
    communication: enrichedAspects.filter(a => a.interpretation.category === "communication"),
    attraction: enrichedAspects.filter(a => a.interpretation.category === "attraction"),
    growth: enrichedAspects.filter(a => a.interpretation.category === "growth"),
    challenge: enrichedAspects.filter(a => a.interpretation.category === "challenge")
  };

  const synthesis = synthesizeRelationship(personA, personB, aspects);

  return {
    engineVersion: "bhumi-synastry-v1.0.0",
    calculatedAt: new Date().toISOString(),
    personA,
    personB,
    aspects: enrichedAspects,
    categories,
    synthesis
  };
}

// Bi-Wheel SVG Generator
function generateSynastryBiWheelSvg(synastryResult) {
  const cx = 500, cy = 500;
  const rOuter = 470, rZodiacInner = 405;
  const rPersonB = 365, rPersonA = 305, rAspect = 235;
  const { personA, personB, aspects } = synastryResult;

  const signShorts = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];
  const aspectColors = { Conjunction: "#D4AF37", Sextile: "#5FA8B8", Square: "#D84242", Trine: "#83BE58", Opposition: "#4F5E52" };
  const aspectDash = { Conjunction: "", Sextile: "6,4", Square: "", Trine: "4,4", Opposition: "8,4" };

  const rad = d => (d * Math.PI) / 180;
  const lonToXY = (lon, r) => {
    const aRad = rad(180 - lon);
    return { x: cx + r * Math.cos(aRad), y: cy + r * Math.sin(aRad) };
  };

  let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" class="synastry-biwheel-svg" role="img" aria-label="Bagan Synastry Bi-Wheel">';
  svg += '<defs><clipPath id="synastry-clip"><circle cx="500" cy="500" r="240" /></clipPath></defs>';
  svg += '<circle cx="500" cy="500" r="' + rOuter + '" fill="#FFFFFF" stroke="#DED7CA" stroke-width="2" />';
  svg += '<circle cx="500" cy="500" r="' + rZodiacInner + '" fill="#FAF7F0" stroke="#DED7CA" stroke-width="1.5" />';

  signShorts.forEach((name, i) => {
    const a0 = 180 - i * 30;
    const a1 = 180 - (i + 1) * 30;
    const p0 = { x: cx + rOuter * Math.cos(rad(a0)), y: cy + rOuter * Math.sin(rad(a0)) };
    const p1 = { x: cx + rOuter * Math.cos(rad(a1)), y: cy + rOuter * Math.sin(rad(a1)) };
    const pi = { x: cx + rZodiacInner * Math.cos(rad(a0)), y: cy + rZodiacInner * Math.sin(rad(a0)) };
    const pj = { x: cx + rZodiacInner * Math.cos(rad(a1)), y: cy + rZodiacInner * Math.sin(rad(a1)) };
    const mid = lonToXY(i * 30 + 15, 436);
    const fill = i % 2 === 0 ? "#FCFAF5" : "#F5F1E8";

    svg += '<path d="M ' + p0.x.toFixed(1) + ' ' + p0.y.toFixed(1) + ' A ' + rOuter + ' ' + rOuter + ' 0 0 0 ' + p1.x.toFixed(1) + ' ' + p1.y.toFixed(1) + ' L ' + pj.x.toFixed(1) + ' ' + pj.y.toFixed(1) + ' A ' + rZodiacInner + ' ' + rZodiacInner + ' 0 0 1 ' + pi.x.toFixed(1) + ' ' + pi.y.toFixed(1) + ' Z" fill="' + fill + '" stroke="#DED7CA" stroke-width="0.8" />';
    svg += '<text x="' + mid.x.toFixed(1) + '" y="' + mid.y.toFixed(1) + '" text-anchor="middle" dominant-baseline="central" fill="#5F6D5E" font-size="14" font-family="sans-serif" font-weight="600">' + name + '</text>';
  });

  svg += '<circle cx="500" cy="500" r="' + rPersonB + '" fill="none" stroke="#DED7CA" stroke-width="1" stroke-dasharray="3,3" />';
  svg += '<circle cx="500" cy="500" r="' + rPersonA + '" fill="none" stroke="#DED7CA" stroke-width="1" stroke-dasharray="3,3" />';
  svg += '<circle cx="500" cy="500" r="' + rAspect + '" fill="#FFFFFF" stroke="#C5A880" stroke-width="1.5" />';

  svg += '<g clip-path="url(#synastry-clip)">';
  const drawn = (aspects || []).slice(0, 36);
  for (const a of drawn) {
    const ptA = lonToXY(a.planetALon, rAspect);
    const ptB = lonToXY(a.planetBLon, rAspect);
    const col = aspectColors[a.type] || "#888";
    const dash = aspectDash[a.type] ? ' stroke-dasharray="' + aspectDash[a.type] + '"' : '';
    const op = Math.max(0.3, 1 - a.orb / 9).toFixed(2);
    svg += '<line x1="' + ptA.x.toFixed(1) + '" y1="' + ptA.y.toFixed(1) + '" x2="' + ptB.x.toFixed(1) + '" y2="' + ptB.y.toFixed(1) + '" stroke="' + col + '" stroke-width="1.6" opacity="' + op + '"' + dash + ' />';
  }
  svg += '</g>';

  // Planets A (inner, green)
  for (const p of Object.values(personA.planets)) {
    const pt = lonToXY(p.longitude, rPersonA);
    svg += '<circle cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="11" fill="#FFFFFF" stroke="#2D4B34" stroke-width="1.2" />';
    svg += '<text x="' + pt.x.toFixed(1) + '" y="' + pt.y.toFixed(1) + '" text-anchor="middle" dominant-baseline="central" fill="#2D4B34" font-size="10" font-family="sans-serif" font-weight="700">' + (PLANET_SHORT[p.name] || p.name.slice(0, 2)) + (p.retrograde ? "℞" : "") + '</text>';
  }

  // Planets B (outer, rose/terra)
  for (const p of Object.values(personB.planets)) {
    const pt = lonToXY(p.longitude, rPersonB);
    svg += '<circle cx="' + pt.x.toFixed(1) + '" cy="' + pt.y.toFixed(1) + '" r="11" fill="#FFFFFF" stroke="#9A5F78" stroke-width="1.2" />';
    svg += '<text x="' + pt.x.toFixed(1) + '" y="' + pt.y.toFixed(1) + '" text-anchor="middle" dominant-baseline="central" fill="#9A5F78" font-size="10" font-family="sans-serif" font-weight="700">' + (PLANET_SHORT[p.name] || p.name.slice(0, 2)) + (p.retrograde ? "℞" : "") + '</text>';
  }

  svg += '<circle cx="500" cy="500" r="45" fill="#FAF7F0" stroke="#C5A880" stroke-width="1.5" />';
  svg += '<text x="500" y="492" text-anchor="middle" dominant-baseline="central" fill="#2D4B34" font-size="12" font-family="serif" font-weight="700">SYNASTRY</text>';
  svg += '<text x="500" y="510" text-anchor="middle" dominant-baseline="central" fill="#C5A880" font-size="9" font-family="sans-serif" font-weight="700">BHUMI</text>';
  svg += '</svg>';
  return svg;
}

// ==========================================
// 3. PERSONALIZED PDF REPORT GENERATOR
// ==========================================

function formatPartnerName(rawName) {
  if (!rawName || typeof rawName !== "string") return "";
  return rawName
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildCouplePdfFilename(nameA, nameB) {
  const safeA = formatPartnerName(nameA) || "Pasangan-1";
  const safeB = formatPartnerName(nameB) || "Pasangan-2";
  return "Bhumi-Amartya-Compatibility-" + safeA + "-dan-" + safeB + ".pdf";
}

async function ensureJsPdf() {
  if (typeof window !== "undefined" && window.jspdf && window.jspdf.jsPDF) {
    return window.jspdf.jsPDF;
  }
  // Try loading vendor script
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "../assets/vendor/jspdf.umd.min.js";
    s.onload = () => {
      if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
      else reject(new Error("Gagal menginisialisasi pustaka PDF"));
    };
    s.onerror = () => reject(new Error("Tidak dapat memuat modul PDF offline"));
    document.head.appendChild(s);
  });
}

async function exportCouplePdfReport(matrixRes, synastryRes) {
  const JsPDF = await ensureJsPdf();
  const pdf = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });

  const nameA = matrixRes.input.malePartner.name || "Pasangan 1";
  const nameB = matrixRes.input.femalePartner.name || "Pasangan 2";
  const dateA = matrixRes.input.malePartner.birthDate || "-";
  const dateB = matrixRes.input.femalePartner.birthDate || "-";
  const filename = buildCouplePdfFilename(nameA, nameB);

  const pageWidth = 210, pageHeight = 297, margin = 16, contentWidth = 178;
  const colDark = [45, 75, 52];    // #2D4B34
  const colGold = [180, 145, 100]; // #B49164
  const colMuted = [100, 116, 139];
  const colText = [30, 41, 59];

  function drawHeaderFooter(pageNum, totalPages = 4) {
    pdf.setDrawColor(220, 215, 205);
    pdf.setLineWidth(0.3);
    pdf.line(margin, 12, pageWidth - margin, 12);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
    pdf.text("BHUMI AMARTYA — RUANG UNTUK PULANG DAN KENALI DIRI", margin, 9.5);

    pdf.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    pdf.setTextColor(colMuted[0], colMuted[1], colMuted[2]);
    pdf.text("Compatibility Matrix & Synastry Natal Chart Couple", margin, pageHeight - 8);
    pdf.text("Halaman " + pageNum + " dari " + totalPages, pageWidth - margin, pageHeight - 8, { align: "right" });
  }

  // ---------------- PAGE 1: COVER & MATRIX RINGKASAN ----------------
  drawHeaderFooter(1, 4);

  // Brand Eyebrow
  let y = 24;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
  pdf.text("BHUMI AMARTYA", pageWidth / 2, y, { align: "center" });

  y += 7;
  pdf.setFont("times", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
  pdf.text("Compatibility Matrix & Synastry Natal Chart", pageWidth / 2, y, { align: "center" });

  y += 7;
  pdf.setFont("times", "italic");
  pdf.setFontSize(14);
  pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
  pdf.text(nameA + " & " + nameB, pageWidth / 2, y, { align: "center" });

  y += 10;
  // Partner identity card
  pdf.setFillColor(250, 247, 240);
  pdf.roundedRect(margin, y, contentWidth, 24, 3, 3, "F");
  pdf.setDrawColor(220, 215, 205);
  pdf.roundedRect(margin, y, contentWidth, 24, 3, 3, "S");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
  pdf.text("Pasangan 1: " + nameA, margin + 6, y + 7);
  pdf.text("Pasangan 2: " + nameB, margin + 92, y + 7);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(colMuted[0], colMuted[1], colMuted[2]);
  pdf.text("Tanggal Lahir: " + dateA, margin + 6, y + 13);
  pdf.text("Tanggal Lahir: " + dateB, margin + 92, y + 13);

  const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  pdf.text("Tanggal Laporan: " + todayStr + " · Transient Local Privacy Verified", margin + 6, y + 19);

  y += 32;
  // Section 1: Compatibility Matrix
  pdf.setFont("times", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
  pdf.text("I. COMPATIBILITY MATRIX (PETA OKTAGON TAKDIR)", margin, y);

  y += 4;
  pdf.setDrawColor(colGold[0], colGold[1], colGold[2]);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, margin + 50, y);

  y += 7;
  // Hero Center Arcana Box
  const centerIdentity = ARCANA_DICTIONARY[String(matrixRes.zones.centerArcana)] || { name: "The Arcana", meaning: "" };
  pdf.setFillColor(248, 245, 238);
  pdf.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");
  pdf.setDrawColor(colGold[0], colGold[1], colGold[2]);
  pdf.roundedRect(margin, y, contentWidth, 26, 3, 3, "S");

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
  pdf.text("PUSAT RELASI & ESENSI UTAMA (CENTER ARCANA)", margin + 6, y + 7);

  pdf.setFont("times", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
  pdf.text(matrixRes.zones.centerArcana + " · " + centerIdentity.name, margin + 6, y + 14);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(colText[0], colText[1], colText[2]);
  const splitCenterMeaning = pdf.splitTextToSize(centerIdentity.meaning || "Penyatuan energi utama yang menaungi ikatan hubungan.", contentWidth - 12);
  pdf.text(splitCenterMeaning.slice(0, 2), margin + 6, y + 20);

  y += 34;
  // Matrix Zones Table
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
  pdf.text("Zona & Jalur Takdir Relasi", margin, y);

  y += 4;
  const matrixRows = [
    ["Tujuan Pertemuan (Meeting Purpose)", matrixRes.zones.meetingPurpose.code.join("–"), "Tugas spiritual dan material yang dihadirkan bersama."],
    ["Ekor Karma Relasi (Karmic Tail)", matrixRes.zones.karmicTail.code.join("–"), "Pola bawah sadar dan pelajaran karma masa lalu yang perlu diuraikan."],
    ["Jalur Cinta (Love Line)", matrixRes.zones.loveLine.code.join("–"), "Kunci menjaga kemesraan dan ruang pembuka keharmonisan batin."],
    ["Jalur Finansial (Economic Lane)", matrixRes.zones.economicLane.code.join("–"), "Aliran kelimpahan materi dan kerjasama ekonomi pasangan."],
    ["Relationships (Sky & Earth)", "Langit " + matrixRes.relationships.sky + " + Bumi " + matrixRes.relationships.earth + " = " + matrixRes.relationships.result, "Sintesis energi spiritual dan material relasi."],
    ["Merger (Dinamika Energi)", "Maskulin " + matrixRes.merger.masculineEnergy + " + Feminin " + matrixRes.merger.feminineEnergy + " = " + matrixRes.merger.result, "Keseimbangan peran energi aktif dan reseptif."],
    ["Total Harmony (Harmoni Akhir)", matrixRes.harmony.result + " · " + (ARCANA_DICTIONARY[String(matrixRes.harmony.result)]?.name || ""), "Energi puncak yang menaungi keutuhan hubungan."]
  ];

  for (const row of matrixRows) {
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(235, 230, 222);
    pdf.rect(margin, y, contentWidth, 11, "S");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
    pdf.text(row[0], margin + 4, y + 5);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
    pdf.text(row[1], pageWidth - margin - 4, y + 5, { align: "right" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7);
    pdf.setTextColor(colMuted[0], colMuted[1], colMuted[2]);
    pdf.text(row[2], margin + 4, y + 9);

    y += 11;
  }

  // ---------------- PAGE 2: SYNASTRY NATAL POSISI PLANET ----------------
  pdf.addPage();
  drawHeaderFooter(2, 4);

  y = 22;
  pdf.setFont("times", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
  pdf.text("II. SYNASTRY NATAL CHART COUPLE (KIMIAWI ASTROLOGI)", margin, y);

  y += 4;
  pdf.setDrawColor(colGold[0], colGold[1], colGold[2]);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, margin + 50, y);

  y += 7;
  if (!synastryRes) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(9);
    pdf.setTextColor(colMuted[0], colMuted[1], colMuted[2]);
    pdf.text("Data Synastry Natal Chart belum tersedia atau belum lengkap. Compatibility Matrix tetap valid di atas.", margin, y);
  } else {
    // Summary Cards for Both Partners
    const pA = synastryRes.personA;
    const pB = synastryRes.personB;

    pdf.setFillColor(250, 247, 240);
    pdf.roundedRect(margin, y, 86, 32, 2.5, 2.5, "F");
    pdf.setDrawColor(colDark[0], colDark[1], colDark[2]);
    pdf.roundedRect(margin, y, 86, 32, 2.5, 2.5, "S");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
    pdf.text(nameA, margin + 5, y + 6);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(colText[0], colText[1], colText[2]);
    pdf.text("Matahari (Sun): " + pA.sunSignId + " (" + pA.planets.Sun.formatted + ")", margin + 5, y + 12);
    pdf.text("Bulan (Moon): " + pA.moonSignId + " (" + pA.planets.Moon.formatted + ")", margin + 5, y + 17);
    pdf.text("Titik Terbit (Rising): " + (pA.risingSignId || "Perlu jam lahir"), margin + 5, y + 22);
    pdf.text("Elemen Dominan: " + pA.balances.dominantElementId, margin + 5, y + 27);

    // Partner B Card
    pdf.setFillColor(250, 247, 240);
    pdf.roundedRect(margin + 92, y, 86, 32, 2.5, 2.5, "F");
    pdf.setDrawColor(154, 95, 120);
    pdf.roundedRect(margin + 92, y, 86, 32, 2.5, 2.5, "S");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8.5);
    pdf.setTextColor(154, 95, 120);
    pdf.text(nameB, margin + 97, y + 6);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(7.5);
    pdf.setTextColor(colText[0], colText[1], colText[2]);
    pdf.text("Matahari (Sun): " + pB.sunSignId + " (" + pB.planets.Sun.formatted + ")", margin + 97, y + 12);
    pdf.text("Bulan (Moon): " + pB.moonSignId + " (" + pB.planets.Moon.formatted + ")", margin + 97, y + 17);
    pdf.text("Titik Terbit (Rising): " + (pB.risingSignId || "Perlu jam lahir"), margin + 97, y + 22);
    pdf.text("Elemen Dominan: " + pB.balances.dominantElementId, margin + 97, y + 27);

    y += 38;
    // Planetary Positions Table
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
    pdf.text("Tabel Posisi Planet Natal", margin, y);

    y += 4;
    // Header
    pdf.setFillColor(colDark[0], colDark[1], colDark[2]);
    pdf.rect(margin, y, contentWidth, 6, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("Objek / Planet", margin + 4, y + 4.2);
    pdf.text(nameA + " (Pasangan 1)", margin + 65, y + 4.2);
    pdf.text(nameB + " (Pasangan 2)", margin + 125, y + 4.2);

    y += 6;
    for (const pName of PLANET_ORDER) {
      const plA = pA.planets[pName];
      const plB = pB.planets[pName];

      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(235, 230, 222);
      pdf.rect(margin, y, contentWidth, 6, "S");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
      pdf.text(plA.indonesianName + " (" + plA.short + ")", margin + 4, y + 4.2);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(colText[0], colText[1], colText[2]);
      pdf.text(plA.formatted + (plA.retrograde ? " ℞" : ""), margin + 65, y + 4.2);
      pdf.text(plB.formatted + (plB.retrograde ? " ℞" : ""), margin + 125, y + 4.2);

      y += 6;
    }

    y += 6;
    // Inter-planetary Aspects Table
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
    pdf.text("Daftar Aspek Antarplanet Utama (Synastry)", margin, y);

    y += 4;
    pdf.setFillColor(colDark[0], colDark[1], colDark[2]);
    pdf.rect(margin, y, contentWidth, 6, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(255, 255, 255);
    pdf.text("Planet Pasangan 1", margin + 4, y + 4.2);
    pdf.text("Tipe Aspek", margin + 60, y + 4.2);
    pdf.text("Planet Pasangan 2", margin + 105, y + 4.2);
    pdf.text("Toleransi (Orb)", margin + 150, y + 4.2);

    y += 6;
    const topAspects = synastryRes.aspects.slice(0, 14);
    for (const asp of topAspects) {
      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(235, 230, 222);
      pdf.rect(margin, y, contentWidth, 5.5, "S");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
      pdf.text(asp.planetAIndo, margin + 4, y + 4);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(asp.type === "Square" || asp.type === "Opposition" ? 180 : 45, asp.type === "Square" ? 40 : 100, 50);
      pdf.text(asp.symbol + " " + asp.indonesianName, margin + 60, y + 4);

      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(154, 95, 120);
      pdf.text(asp.planetBIndo, margin + 105, y + 4);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(colMuted[0], colMuted[1], colMuted[2]);
      pdf.text(asp.formattedOrb, margin + 150, y + 4);

      y += 5.5;
    }
  }

  // ---------------- PAGE 3: INTERPRETASI ASPEK & RELASI ----------------
  pdf.addPage();
  drawHeaderFooter(3, 4);

  y = 22;
  pdf.setFont("times", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
  pdf.text("III. INTERPRETASI ASPEK & DINAMIKA HUBUNGAN", margin, y);

  y += 4;
  pdf.setDrawColor(colGold[0], colGold[1], colGold[2]);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, margin + 50, y);

  y += 8;
  if (synastryRes && synastryRes.aspects.length > 0) {
    const keyAspects = synastryRes.aspects.slice(0, 5);
    for (const asp of keyAspects) {
      pdf.setFillColor(250, 247, 240);
      pdf.roundedRect(margin, y, contentWidth, 32, 2.5, 2.5, "F");
      pdf.setDrawColor(220, 215, 205);
      pdf.roundedRect(margin, y, contentWidth, 32, 2.5, 2.5, "S");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
      pdf.text(asp.interpretation.categoryTitle.toUpperCase() + " · " + asp.symbol + " " + asp.indonesianName.toUpperCase() + " (" + asp.formattedOrb + ")", margin + 5, y + 6);

      pdf.setFont("times", "bold");
      pdf.setFontSize(10.5);
      pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
      pdf.text(asp.interpretation.title, margin + 5, y + 12);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7.5);
      pdf.setTextColor(colText[0], colText[1], colText[2]);
      const lines = pdf.splitTextToSize(asp.interpretation.summary, contentWidth - 10);
      pdf.text(lines.slice(0, 3), margin + 5, y + 18);

      y += 36;
    }
  }

  // ---------------- PAGE 4: SINTESIS & KESIMPULAN REFLEKTIF ----------------
  pdf.addPage();
  drawHeaderFooter(4, 4);

  y = 22;
  pdf.setFont("times", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
  pdf.text("IV. SINTESIS DINAMIKA & KESIMPULAN RELASI", margin, y);

  y += 4;
  pdf.setDrawColor(colGold[0], colGold[1], colGold[2]);
  pdf.setLineWidth(0.8);
  pdf.line(margin, y, margin + 50, y);

  y += 8;
  if (synastryRes) {
    const synth = synastryRes.synthesis;

    // Sinergi Elemen Card
    pdf.setFillColor(248, 245, 238);
    pdf.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");
    pdf.setDrawColor(colGold[0], colGold[1], colGold[2]);
    pdf.roundedRect(margin, y, contentWidth, 26, 3, 3, "S");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
    pdf.text("SINERGI ELEMEN: " + synth.elementSynergy.partnerAElement.toUpperCase() + " & " + synth.elementSynergy.partnerBElement.toUpperCase(), margin + 6, y + 7);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(colText[0], colText[1], colText[2]);
    const elemLines = pdf.splitTextToSize(synth.elementSynergy.description, contentWidth - 12);
    pdf.text(elemLines.slice(0, 2), margin + 6, y + 14);

    y += 32;
    // Rasio Harmoni Card
    pdf.setFillColor(250, 247, 240);
    pdf.roundedRect(margin, y, contentWidth, 22, 3, 3, "F");
    pdf.setDrawColor(colDark[0], colDark[1], colDark[2]);
    pdf.roundedRect(margin, y, contentWidth, 22, 3, 3, "S");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
    pdf.text("KOMPOSISI ALIRAN ASPEK ASTROLOGI", margin + 6, y + 7);

    pdf.setFont("times", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
    pdf.text(synth.aspectMetrics.harmonyFlowRatio, margin + 6, y + 14);

    y += 28;
    // Kesimpulan Reflektif
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(margin, y, contentWidth, 52, 3, 3, "F");
    pdf.setDrawColor(colGold[0], colGold[1], colGold[2]);
    pdf.setLineWidth(1);
    pdf.roundedRect(margin, y, contentWidth, 52, 3, 3, "S");

    pdf.setFont("times", "bold");
    pdf.setFontSize(11);
    pdf.setTextColor(colDark[0], colDark[1], colDark[2]);
    pdf.text("Refleksi Relasi Berkesadaran", margin + 8, y + 9);

    pdf.setFont("times", "italic");
    pdf.setFontSize(8.5);
    pdf.setTextColor(colText[0], colText[1], colText[2]);
    const refLines = pdf.splitTextToSize(synth.reflectiveConclusion, contentWidth - 16);
    pdf.text(refLines, margin + 8, y + 17);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(colGold[0], colGold[1], colGold[2]);
    pdf.text("“Hubungan bukan ketiadaan gesekan, melainkan ruang aman untuk bertumbuh bersama.”", margin + 8, y + 45);

    y += 60;
  }

  // Legal / Spiritual Disclaimer Box
  pdf.setFillColor(248, 249, 250);
  pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, "F");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(6.8);
  pdf.setTextColor(colMuted[0], colMuted[1], colMuted[2]);
  const discLines = pdf.splitTextToSize("Disclaimer: Laporan Compatibility Matrix dan Synastry Natal Chart Bhumi Amartya adalah sarana refleksi diri dan komunikasi sadar. Hasil ini bukan ramalan mutlak, deterministik, atau pengganti konseling psikologis profesional.", contentWidth - 10);
  pdf.text(discLines, margin + 5, y + 6);

  // Trigger Save / Download Blob
  pdf.save(filename);
}

// ==========================================
// 4. UI RENDERING & DOM INTEGRATION
// ==========================================

function formatArcana(value) {
  const arc = ARCANA_DICTIONARY[String(value)];
  if (!arc) return value;
  return value + " · " + arc.name;
}

function renderCodeList(code) {
  let h = '<ul class="zone-code-list">';
  for (const c of code) {
    const arc = ARCANA_DICTIONARY[String(c)];
    const name = arc ? arc.name : "";
    const essence = arc ? arc.essence : "";
    h += '<li><strong>' + c + ' · ' + name + '</strong><br><span class="zone-essence">' + essence + '</span></li>';
  }
  h += '</ul>';
  return h;
}

function renderResults(matrixRes, synastryRes) {
  const container = document.getElementById("matrix-results");
  if (!container) return;

  const maleName = matrixRes.input.malePartner.name;
  const femaleName = matrixRes.input.femalePartner.name;
  const centerArc = ARCANA_DICTIONARY[String(matrixRes.zones.centerArcana)] || { name: "", meaning: "" };

  let html = '';

  // ---------------- PART A: COMPATIBILITY MATRIX ----------------
  html += '<div class="matrix-part-header">';
  html += '  <span class="part-badge">BAGIAN 1</span>';
  html += '  <h2 class="part-title">Compatibility Matrix (Destiny Matrix Relasi)</h2>';
  html += '  <p class="part-desc">Peta numerologi oktagon takdir yang terbentuk ketika dua tanggal kelahiran dipadukan secara simbolik.</p>';
  html += '</div>';

  html += '<div class="matrix-hero-card">';
  html += '  <div class="matrix-hero-eyebrow">Pusat Ikatan Hubungan (Center Arcana)</div>';
  html += '  <h3 class="matrix-hero-title">' + matrixRes.zones.centerArcana + ' · ' + centerArc.name + '</h3>';
  html += '  <p class="matrix-hero-essence">' + centerArc.essence + '</p>';
  html += '  <p class="matrix-hero-desc">' + centerArc.meaning + '</p>';
  html += '</div>';

  html += '<div class="diagram-wrapper">';
  html += '  <div class="diagram-card">';
  html += generateOctagonSvg(matrixRes.nodes);
  html += '    <div class="diagram-legend">';
  html += '      <span><span class="legend-dot circle-dot"></span> Titik Arcana</span>';
  html += '      <span><span class="legend-line masculine-line"></span> Garis Maskulin</span>';
  html += '      <span><span class="legend-line feminine-line"></span> Garis Feminin</span>';
  html += '      <span><span class="legend-line channel-line"></span> Jalur Cinta & Uang</span>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  html += '<div class="matrix-section-title"><h3>Zona-Zona Inti Relasi</h3></div>';
  html += '<div class="matrix-cards-grid">';

  html += '  <div class="matrix-card">';
  html += '    <h4>Tujuan Pertemuan Pasangan</h4>';
  html += '    <p class="card-subtitle">Misi spiritual dan material yang dihadapi bersama.</p>';
  html += '    <div class="zone-code-badge">' + matrixRes.zones.meetingPurpose.code.join("–") + '</div>';
  html += renderCodeList(matrixRes.zones.meetingPurpose.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Ekor Karma Relasi (Karmic Tail)</h4>';
  html += '    <p class="card-subtitle">Pola bawah sadar dan isu masa lalu yang perlu diuraikan bersama.</p>';
  html += '    <div class="zone-code-badge">' + matrixRes.zones.karmicTail.code.join("–") + '</div>';
  html += renderCodeList(matrixRes.zones.karmicTail.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Jalur Cinta (Love Line)</h4>';
  html += '    <p class="card-subtitle">Kondisi ideal agar asmara berkembang mekar dan harmonis.</p>';
  html += '    <div class="zone-code-badge">' + matrixRes.zones.loveLine.code.join("–") + '</div>';
  html += renderCodeList(matrixRes.zones.loveLine.code);
  html += '    <div class="inner-highlight"><strong>Kunci Harmoni:</strong> ' + formatArcana(matrixRes.zones.missingEnergyForHarmony) + '</div>';
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Jalur Finansial (Economic Lane)</h4>';
  html += '    <p class="card-subtitle">Kesejahteraan bersama dan tindakan penunjang kemakmuran.</p>';
  html += '    <div class="zone-code-badge">' + matrixRes.zones.economicLane.code.join("–") + '</div>';
  html += renderCodeList(matrixRes.zones.economicLane.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Zona Potret Hubungan (Portrait Zone)</h4>';
  html += '    <p class="card-subtitle">Bagaimana hubungan kalian dilihat dunia dan pelajaran bagi generasi berikutnya.</p>';
  html += renderCodeList(matrixRes.zones.portraitZone.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Zona Bakat & Resiliensi (Talent Zone)</h4>';
  html += '    <p class="card-subtitle">Sumber inspirasi dan cara bangkit ketika krisis muncul.</p>';
  html += renderCodeList(matrixRes.zones.talentZone.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Perilaku Pasangan</h4>';
  html += '    <p class="card-subtitle">Ekspresi alami masing-masing dalam interaksi relasi.</p>';
  html += '    <ul class="role-list">';
  html += '      <li><strong>Pria (' + maleName + '):</strong> ' + formatArcana(matrixRes.zones.relationshipBehavior.male) + '</li>';
  html += '      <li><strong>Wanita (' + femaleName + '):</strong> ' + formatArcana(matrixRes.zones.relationshipBehavior.female) + '</li>';
  html += '    </ul>';
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Kualitas yang Perlu Dikembangkan</h4>';
  html += '    <p class="card-subtitle">Ruang pertumbuhan personal demi kelanggengan ikatan.</p>';
  html += '    <ul class="role-list">';
  html += '      <li><strong>Wanita:</strong> ' + formatArcana(matrixRes.zones.qualitiesToDevelop.female) + '</li>';
  html += '      <li><strong>Pria:</strong> ' + formatArcana(matrixRes.zones.qualitiesToDevelop.male) + '</li>';
  html += '    </ul>';
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Garis Generasi Maskulin</h4>';
  html += '    <p class="card-subtitle">Aliran energi garis keturunan maskulin melalui pusat.</p>';
  html += renderCodeList(matrixRes.zones.masculineGenerationLine);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Garis Generasi Feminin</h4>';
  html += '    <p class="card-subtitle">Aliran energi garis keturunan feminin melalui pusat.</p>';
  html += renderCodeList(matrixRes.zones.feminineGenerationLine);
  html += '  </div>';
  html += '</div>';

  html += '<div class="matrix-section-title"><h3>Sintesis Energi & Harmoni Akhir</h3></div>';
  html += '<div class="synthesis-grid">';
  html += '  <div class="synthesis-card">';
  html += '    <h4>Relationships (Spiritual & Material)</h4>';
  html += '    <div class="synthesis-row"><span>Langit (Sky):</span> <strong>' + formatArcana(matrixRes.relationships.sky) + '</strong></div>';
  html += '    <div class="synthesis-row"><span>Bumi (Earth):</span> <strong>' + formatArcana(matrixRes.relationships.earth) + '</strong></div>';
  html += '    <div class="synthesis-row synthesis-result"><span>Hasil Relationship:</span> <strong>' + formatArcana(matrixRes.relationships.result) + '</strong></div>';
  html += '  </div>';

  html += '  <div class="synthesis-card">';
  html += '    <h4>Merger (Dinamika Energi)</h4>';
  html += '    <div class="synthesis-row"><span>Energi Maskulin:</span> <strong>' + formatArcana(matrixRes.merger.masculineEnergy) + '</strong></div>';
  html += '    <div class="synthesis-row"><span>Energi Feminin:</span> <strong>' + formatArcana(matrixRes.merger.feminineEnergy) + '</strong></div>';
  html += '    <div class="synthesis-row synthesis-result"><span>Hasil Merger:</span> <strong>' + formatArcana(matrixRes.merger.result) + '</strong></div>';
  html += '  </div>';

  html += '  <div class="synthesis-card highlight-synthesis">';
  html += '    <h4>Total Harmony (Harmoni Hubungan)</h4>';
  html += '    <div class="synthesis-row"><span>Relationship:</span> <strong>' + formatArcana(matrixRes.harmony.relationship) + '</strong></div>';
  html += '    <div class="synthesis-row"><span>Merger:</span> <strong>' + formatArcana(matrixRes.harmony.merger) + '</strong></div>';
  html += '    <div class="synthesis-row synthesis-result"><span>Harmoni Keseluruhan:</span> <strong>' + formatArcana(matrixRes.harmony.result) + '</strong></div>';
  html += '  </div>';
  html += '</div>';

  // ---------------- PART B: SYNASTRY NATAL CHART COUPLE ----------------
  if (synastryRes) {
    const pA = synastryRes.personA;
    const pB = synastryRes.personB;
    const synth = synastryRes.synthesis;

    html += '<div class="matrix-part-header" style="margin-top: 4.5rem;">';
    html += '  <span class="part-badge" style="background:#EBF3EB; color:#2D4B34;">BAGIAN 2</span>';
    html += '  <h2 class="part-title">Synastry Natal Chart Couple (Astrologi Relasi)</h2>';
    html += '  <p class="part-desc">Interaksi posisi planet natal nyata antara ' + maleName + ' & ' + femaleName + ' yang dihitung menggunakan model astronomi presisi.</p>';
    html += '</div>';

    if (!pA.isTimeKnown || !pB.isTimeKnown) {
      html += '<div class="matrix-notice-box">';
      html += '  <span class="notice-icon">ℹ</span>';
      html += '  <div><strong>Mode Perhitungan Waktu Terbatas:</strong> Jam lahir salah satu atau kedua pasangan tidak diketahui. Posisi planet dihitung pada pukul 12:00 waktu lokal. Posisi Bulan memiliki toleransi sekitar ±6°. Posisi Ascendant dan rumah astrologi ditiadakan demi menjaga kejujuran dan akurasi data.</div>';
      html += '</div>';
    }

    // Astro Identity Summary
    html += '<div class="partner-astro-summary-grid">';
    html += '  <div class="astro-summary-card partner-a-card">';
    html += '    <h4>' + maleName + ' (Pasangan 1)</h4>';
    html += '    <div class="astro-tag-row">';
    html += '      <span class="astro-tag">Matahari: <strong>' + pA.sunSignId + '</strong></span>';
    html += '      <span class="astro-tag">Bulan: <strong>' + pA.moonSignId + '</strong></span>';
    if (pA.risingSignId) html += '      <span class="astro-tag">Ascendant: <strong>' + pA.risingSignId + '</strong></span>';
    html += '      <span class="astro-tag">Elemen: <strong>' + pA.balances.dominantElementId + '</strong></span>';
    html += '    </div>';
    html += '  </div>';

    html += '  <div class="astro-summary-card partner-b-card">';
    html += '    <h4>' + femaleName + ' (Pasangan 2)</h4>';
    html += '    <div class="astro-tag-row">';
    html += '      <span class="astro-tag">Matahari: <strong>' + pB.sunSignId + '</strong></span>';
    html += '      <span class="astro-tag">Bulan: <strong>' + pB.moonSignId + '</strong></span>';
    if (pB.risingSignId) html += '      <span class="astro-tag">Ascendant: <strong>' + pB.risingSignId + '</strong></span>';
    html += '      <span class="astro-tag">Elemen: <strong>' + pB.balances.dominantElementId + '</strong></span>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    // Bi-Wheel SVG Chart
    html += '<div class="diagram-wrapper" style="margin: 2rem auto;">';
    html += '  <div class="diagram-card">';
    html += generateSynastryBiWheelSvg(synastryRes);
    html += '    <div class="diagram-legend">';
    html += '      <span><span class="legend-dot" style="background:#2D4B34;"></span> ' + maleName + ' (Cincin Dalam)</span>';
    html += '      <span><span class="legend-dot" style="background:#9A5F78;"></span> ' + femaleName + ' (Cincin Luar)</span>';
    html += '      <span><span class="legend-line" style="background:#D4AF37;"></span> Konjungsi</span>';
    html += '      <span><span class="legend-line" style="background:#83BE58;"></span> Trine</span>';
    html += '      <span><span class="legend-line" style="background:#5FA8B8;"></span> Sextile</span>';
    html += '      <span><span class="legend-line" style="background:#D84242;"></span> Square</span>';
    html += '      <span><span class="legend-line" style="background:#4F5E52;"></span> Oposisi</span>';
    html += '    </div>';
    html += '  </div>';
    html += '</div>';

    // Planetary Positions Tables
    html += '<div class="matrix-section-title"><h3>Posisi Planet Natal Masing-Masing</h3></div>';
    html += '<div class="partner-inputs-grid">';
    html += '  <div class="table-card">';
    html += '    <h4>' + maleName + ' — Planet Natal</h4>';
    html += '    <table class="synastry-table">';
    html += '      <thead><tr><th>Objek</th><th>Posisi Zodiak</th><th>Derajat</th></tr></thead>';
    html += '      <tbody>';
    for (const pName of PLANET_ORDER) {
      const pl = pA.planets[pName];
      html += '<tr><td><strong>' + pl.indonesianName + '</strong></td><td>' + pl.signId + (pl.retrograde ? ' <span class="badge-rx">℞</span>' : '') + '</td><td>' + pl.formatted + '</td></tr>';
    }
    html += '      </tbody>';
    html += '    </table>';
    html += '  </div>';

    html += '  <div class="table-card">';
    html += '    <h4>' + femaleName + ' — Planet Natal</h4>';
    html += '    <table class="synastry-table">';
    html += '      <thead><tr><th>Objek</th><th>Posisi Zodiak</th><th>Derajat</th></tr></thead>';
    html += '      <tbody>';
    for (const pName of PLANET_ORDER) {
      const pl = pB.planets[pName];
      html += '<tr><td><strong>' + pl.indonesianName + '</strong></td><td>' + pl.signId + (pl.retrograde ? ' <span class="badge-rx">℞</span>' : '') + '</td><td>' + pl.formatted + '</td></tr>';
    }
    html += '      </tbody>';
    html += '    </table>';
    html += '  </div>';
    html += '</div>';

    // Inter-aspects List Table
    html += '<div class="matrix-section-title"><h3>Daftar Aspek Antarplanet (Synastry Inter-Aspects)</h3></div>';
    html += '<div class="table-card" style="margin-bottom: 2rem;">';
    html += '  <table class="synastry-table">';
    html += '    <thead><tr><th>Planet ' + maleName + '</th><th>Aspek</th><th>Planet ' + femaleName + '</th><th>Toleransi (Orb)</th></tr></thead>';
    html += '    <tbody>';
    for (const a of synastryRes.aspects.slice(0, 16)) {
      const isDynamic = ["Square", "Opposition"].includes(a.type);
      html += '<tr>';
      html += '  <td><strong>' + a.planetAIndo + '</strong></td>';
      html += '  <td><span class="aspect-pill ' + (isDynamic ? 'pill-dynamic' : 'pill-harmony') + '">' + a.symbol + ' ' + a.indonesianName + '</span></td>';
      html += '  <td><strong>' + a.planetBIndo + '</strong></td>';
      html += '  <td>' + a.formattedOrb + '</td>';
      html += '</tr>';
    }
    html += '    </tbody>';
    html += '  </table>';
    html += '</div>';

    // Aspect Interpretations Cards
    html += '<div class="matrix-section-title"><h3>Interpretasi Aspek Kunci Relasi</h3></div>';
    html += '<div class="aspect-interpretations-grid">';
    for (const a of synastryRes.aspects.slice(0, 6)) {
      html += '<div class="aspect-interp-card">';
      html += '  <div class="interp-eyebrow">' + a.interpretation.categoryTitle + ' · ' + a.symbol + ' ' + a.indonesianName + ' (' + a.formattedOrb + ')</div>';
      html += '  <h4>' + a.interpretation.title + '</h4>';
      html += '  <p>' + a.interpretation.summary + '</p>';
      html += '</div>';
    }
    html += '</div>';

    // Synthesis Box
    html += '<div class="synastry-synthesis-card" style="margin-top: 2rem;">';
    html += '  <h4>Sintesis Dinamika & Kesimpulan Relasi</h4>';
    html += '  <div class="synthesis-metric-row">';
    html += '    <span>Sinergi Elemen: <strong>' + synth.elementSynergy.partnerAElement + ' & ' + synth.elementSynergy.partnerBElement + '</strong></span>';
    html += '    <span>Komposisi: <strong>' + synth.aspectMetrics.harmonyFlowRatio + '</strong></span>';
    html += '  </div>';
    html += '  <p style="margin: 0.8rem 0; line-height: 1.7; color: var(--text-primary);">' + synth.elementSynergy.description + '</p>';
    html += '  <div class="inner-highlight" style="font-size: 0.95rem; line-height: 1.7;">' + synth.reflectiveConclusion + '</div>';
    html += '</div>';
  }

  // ---------------- ACTIONS BAR & DOWNLOAD BUTTON ----------------
  html += '<div class="matrix-actions-bar">';
  html += '  <button type="button" class="btn btn-primary btn-download-couple-pdf" id="btn-download-couple-pdf">';
  html += '    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:8px; vertical-align:middle;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';
  html += '    Download PDF – ' + maleName + ' & ' + femaleName;
  html += '  </button>';
  html += '  <button type="button" class="btn btn-outline" id="btn-print-matrix">Cetak Halaman</button>';
  html += '  <a class="btn btn-outline" href="https://wa.me/6285810531892?text=Halo%20Bhumi%2C%20saya%20sudah%20hitung%20Compatibility%20Matrix%20kami%20(' + encodeURIComponent(maleName) + '%20%26%20' + encodeURIComponent(femaleName) + ')%2C%20bisa%20konsultasi%20Blueprint%20lebih%20lengkap%3F" target="_blank" rel="noopener">Konsultasi Reading Lebih Lengkap</a>';
  html += '</div>';
  html += '<div id="pdf-download-status" style="text-align:center; font-size:0.85rem; color:#5F6D5E; margin-top:0.75rem;"></div>';

  container.innerHTML = html;
  container.classList.add("show");
  container.scrollIntoView({ behavior: "smooth", block: "start" });

  const printBtn = document.getElementById("btn-print-matrix");
  if (printBtn) {
    printBtn.addEventListener("click", function() {
      window.print();
    });
  }

  const pdfBtn = document.getElementById("btn-download-couple-pdf");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", async function() {
      const statusEl = document.getElementById("pdf-download-status");
      if (statusEl) statusEl.textContent = "Sedang menyiapkan dokumen PDF...";
      pdfBtn.disabled = true;

      try {
        await exportCouplePdfReport(matrixRes, synastryRes);
        if (statusEl) statusEl.textContent = "✓ PDF berhasil diunduh!";
      } catch (err) {
        console.error("PDF generation error:", err);
        if (statusEl) statusEl.textContent = "Terjadi kendala saat mengunduh PDF: " + (err.message || "Gagal");
      } finally {
        pdfBtn.disabled = false;
      }
    });
  }
}

// ==========================================
// 5. FORM INITIALIZATION & AUTOCOMPLETE BINDING
// ==========================================

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("compatibility-form");
  const errorBox = document.getElementById("matrix-error");

  if (!form) return;

  // Toggle unknown birth time
  const maleTime = document.getElementById("male-time");
  const maleTimeUnknown = document.getElementById("male-time-unknown");
  if (maleTime && maleTimeUnknown) {
    maleTimeUnknown.addEventListener("change", function() {
      maleTime.disabled = this.checked;
      if (this.checked) maleTime.value = "";
    });
  }

  const femaleTime = document.getElementById("female-time");
  const femaleTimeUnknown = document.getElementById("female-time-unknown");
  if (femaleTime && femaleTimeUnknown) {
    femaleTimeUnknown.addEventListener("change", function() {
      femaleTime.disabled = this.checked;
      if (this.checked) femaleTime.value = "";
    });
  }

  // Location autocomplete attachment if BhumiLocationAutocomplete available
  let maleResolvedLocation = null;
  let femaleResolvedLocation = null;

  if (typeof window !== "undefined" && window.BhumiLocationAutocomplete) {
    const maleCityInput = document.getElementById("male-city");
    const maleCityBox = document.getElementById("male-city-box");
    if (maleCityInput && maleCityBox) {
      window.BhumiLocationAutocomplete.attach(maleCityInput, {
        container: maleCityBox,
        onSelect: loc => {
          maleResolvedLocation = loc;
          const latEl = document.getElementById("male-lat");
          const lonEl = document.getElementById("male-lon");
          const tzEl = document.getElementById("male-tz");
          if (latEl) latEl.value = loc.latitude;
          if (lonEl) lonEl.value = loc.longitude;
          if (tzEl) tzEl.value = loc.timezone || loc.timezoneOffset || "+07:00";
        },
        onClear: () => { maleResolvedLocation = null; }
      });
    }

    const femaleCityInput = document.getElementById("female-city");
    const femaleCityBox = document.getElementById("female-city-box");
    if (femaleCityInput && femaleCityBox) {
      window.BhumiLocationAutocomplete.attach(femaleCityInput, {
        container: femaleCityBox,
        onSelect: loc => {
          femaleResolvedLocation = loc;
          const latEl = document.getElementById("female-lat");
          const lonEl = document.getElementById("female-lon");
          const tzEl = document.getElementById("female-tz");
          if (latEl) latEl.value = loc.latitude;
          if (lonEl) lonEl.value = loc.longitude;
          if (tzEl) tzEl.value = loc.timezone || loc.timezoneOffset || "+07:00";
        },
        onClear: () => { femaleResolvedLocation = null; }
      });
    }
  }

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (errorBox) {
      errorBox.style.display = "none";
      errorBox.textContent = "";
    }

    try {
      const maleName = (document.getElementById("male-name")?.value || "").trim();
      const maleBirth = document.getElementById("male-birth")?.value;
      const femaleName = (document.getElementById("female-name")?.value || "").trim();
      const femaleBirth = document.getElementById("female-birth")?.value;

      if (!maleName) throw new Error("Silakan masukkan nama Pasangan 1 (Pria).");
      if (!maleBirth) throw new Error("Silakan masukkan tanggal lahir Pasangan 1 (Pria).");
      if (!femaleName) throw new Error("Silakan masukkan nama Pasangan 2 (Wanita).");
      if (!femaleBirth) throw new Error("Silakan masukkan tanggal lahir Pasangan 2 (Wanita).");

      // 1. Calculate Destiny Matrix (Always synchronous, guaranteed)
      const matrixResult = calculateCompatibilityMatrix({
        malePartner: { name: maleName, birthDate: maleBirth },
        femalePartner: { name: femaleName, birthDate: femaleBirth }
      });

      // 2. Calculate Synastry Natal Chart (if astronomy is available)
      let synastryResult = null;
      try {
        const maleTimeVal = document.getElementById("male-time")?.value;
        const maleIsUnknown = document.getElementById("male-time-unknown")?.checked || !maleTimeVal;
        const maleCity = document.getElementById("male-city")?.value || "Jakarta";
        const maleLat = parseFloat(document.getElementById("male-lat")?.value || "") || (maleResolvedLocation ? maleResolvedLocation.latitude : -6.2088);
        const maleLon = parseFloat(document.getElementById("male-lon")?.value || "") || (maleResolvedLocation ? maleResolvedLocation.longitude : 106.8456);
        const maleTz = document.getElementById("male-tz")?.value || (maleResolvedLocation ? maleResolvedLocation.timezone : "+07:00");

        const femaleTimeVal = document.getElementById("female-time")?.value;
        const femaleIsUnknown = document.getElementById("female-time-unknown")?.checked || !femaleTimeVal;
        const femaleCity = document.getElementById("female-city")?.value || "Bandung";
        const femaleLat = parseFloat(document.getElementById("female-lat")?.value || "") || (femaleResolvedLocation ? femaleResolvedLocation.latitude : -6.9175);
        const femaleLon = parseFloat(document.getElementById("female-lon")?.value || "") || (femaleResolvedLocation ? femaleResolvedLocation.longitude : 107.6191);
        const femaleTz = document.getElementById("female-tz")?.value || (femaleResolvedLocation ? femaleResolvedLocation.timezone : "+07:00");

        synastryResult = calculateSynastryCouple(
          {
            name: maleName,
            birthDate: maleBirth,
            birthTime: maleTimeVal,
            isTimeUnknown: maleIsUnknown,
            birthCity: maleCity,
            latitude: maleLat,
            longitude: maleLon,
            timezone: maleTz
          },
          {
            name: femaleName,
            birthDate: femaleBirth,
            birthTime: femaleTimeVal,
            isTimeUnknown: femaleIsUnknown,
            birthCity: femaleCity,
            latitude: femaleLat,
            longitude: femaleLon,
            timezone: femaleTz
          }
        );
      } catch (synErr) {
        console.warn("Synastry calculation notice:", synErr);
      }

      renderResults(matrixResult, synastryResult);
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = err.message || "Terjadi kesalahan saat menghitung matrix.";
        errorBox.style.display = "block";
      }
    }
  });
});
