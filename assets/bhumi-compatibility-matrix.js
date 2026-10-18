/**
 * Bhumi Compatibility Matrix Client Engine & UI
 * Native standalone client for www.bhumiamartya.my.id
 * SOT v1.0.0 Approved
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

  const meetingPurpose = [nodes.northOuter, nodes.westOuter];
  const portrait = [nodes.westOuter, nodes.westMiddle, nodes.westInner];
  const talent = [nodes.northOuter, nodes.northMiddle, nodes.northInner];
  const karmic = [nodes.southOuter, nodes.southMiddle, nodes.southInner];
  const love = [nodes.southInner, nodes.lovePoint, nodes.loveMoneyJunction];
  const economic = [nodes.loveMoneyJunction, nodes.moneyPoint, nodes.eastInner];
  const wellbeing = [nodes.eastInner, nodes.eastMiddle, nodes.eastOuter];

  const zones = {
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
    feminineGenerationLine: [nodes.southWestOuter, nodes.center, nodes.northEastOuter]
  };

  return { input, personal: { malePartner: male, femalePartner: female }, nodes, zones, relationships, merger, harmony };
}

function formatArcana(value) {
  const item = ARCANA_DICTIONARY[String(value)];
  const name = item ? item.name : "Arcana " + value;
  return value + " · " + name;
}

function formatCode(arr) {
  return arr.join("–");
}

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, function(char) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char];
  });
}

function renderOctagonSvg(nodes) {
  const DIAGRAM_NODES = [
    { id: "north-outer", label: "North outer", key: "northOuter", x: 400, y: 70, tier: "outer" },
    { id: "north-middle", label: "North middle", key: "northMiddle", x: 400, y: 170, tier: "middle" },
    { id: "north-inner", label: "North inner", key: "northInner", x: 400, y: 270, tier: "inner" },
    { id: "north-east-outer", label: "North-east outer", key: "northEastOuter", x: 635, y: 165, tier: "outer" },
    { id: "east-outer", label: "East outer", key: "eastOuter", x: 730, y: 400, tier: "outer" },
    { id: "east-middle", label: "East middle", key: "eastMiddle", x: 630, y: 400, tier: "middle" },
    { id: "east-inner", label: "East inner", key: "eastInner", x: 530, y: 400, tier: "inner" },
    { id: "south-east-outer", label: "South-east outer", key: "southEastOuter", x: 635, y: 635, tier: "outer" },
    { id: "south-outer", label: "South outer", key: "southOuter", x: 400, y: 730, tier: "outer" },
    { id: "south-middle", label: "South middle", key: "southMiddle", x: 400, y: 630, tier: "middle" },
    { id: "south-inner", label: "South inner", key: "southInner", x: 400, y: 530, tier: "inner" },
    { id: "south-west-outer", label: "South-west outer", key: "southWestOuter", x: 165, y: 635, tier: "outer" },
    { id: "west-outer", label: "West outer", key: "westOuter", x: 70, y: 400, tier: "outer" },
    { id: "west-middle", label: "West middle", key: "westMiddle", x: 170, y: 400, tier: "middle" },
    { id: "west-inner", label: "West inner", key: "westInner", x: 270, y: 400, tier: "inner" },
    { id: "north-west-outer", label: "North-west outer", key: "northWestOuter", x: 165, y: 165, tier: "outer" }
  ];

  const CHANNEL_NODES = [
    { id: "love-point", label: "Love point", key: "lovePoint", x: 432, y: 498, marker: "♥" },
    { id: "love-money-junction", label: "Love-money junction", key: "loveMoneyJunction", x: 465, y: 465, marker: "J" },
    { id: "money-point", label: "Money point", key: "moneyPoint", x: 498, y: 432, marker: "$" }
  ];

  let svg = '<svg viewBox="0 0 800 800" class="compatibility-svg" role="img" aria-label="Diagram Oktagon Compatibility Matrix" preserveAspectRatio="xMidYMid meet">' +
    '<polygon points="400,70 635,165 730,400 635,635 400,730 165,635 70,400 165,165" fill="none" stroke="#7D977B" stroke-width="4" />' +
    '<line x1="400" y1="70" x2="400" y2="730" stroke="#C7B98B" stroke-width="2" stroke-dasharray="8 8" />' +
    '<line x1="70" y1="400" x2="730" y2="400" stroke="#C7B98B" stroke-width="2" stroke-dasharray="8 8" />' +
    '<line x1="165" y1="165" x2="635" y2="635" stroke="#56759A" stroke-width="5" />' +
    '<line x1="165" y1="635" x2="635" y2="165" stroke="#9A5F78" stroke-width="5" stroke-dasharray="13 8" />' +
    '<polyline points="400,530 432,498 465,465 498,432 530,400" fill="none" stroke="#9B704E" stroke-width="7" stroke-linecap="round" />';

  for (const node of DIAGRAM_NODES) {
    const val = nodes[node.key];
    const common = 'fill="#F8F5EE" stroke="#4F5E52" stroke-width="3"';
    svg += '<g id="' + node.id + '">';
    if (node.tier === "outer") {
      svg += '<circle cx="' + node.x + '" cy="' + node.y + '" r="31" ' + common + ' />';
    } else if (node.tier === "middle") {
      svg += '<rect x="' + (node.x - 26) + '" y="' + (node.y - 26) + '" width="52" height="52" rx="9" ' + common + ' />';
    } else if (node.tier === "inner") {
      svg += '<rect x="' + (node.x - 22) + '" y="' + (node.y - 22) + '" width="44" height="44" rx="7" transform="rotate(45 ' + node.x + ' ' + node.y + ')" ' + common + ' />';
    }
    svg += '<text x="' + node.x + '" y="' + node.y + '" text-anchor="middle" dominant-baseline="central" font-size="21" font-weight="700" fill="#35453B">' + val + '</text>';
    svg += '<text x="' + node.x + '" y="' + (node.y + 45) + '" text-anchor="middle" font-size="12" font-weight="700" fill="#4F5E52">' + node.tier.toUpperCase() + '</text>';
    svg += '</g>';
  }

  svg += '<g id="center">' +
    '<circle cx="400" cy="400" r="55" fill="#D6B36A" stroke="#35453B" stroke-width="5" />' +
    '<circle cx="400" cy="400" r="43" fill="none" stroke="#35453B" stroke-width="2" />' +
    '<text x="400" y="400" text-anchor="middle" dominant-baseline="central" font-size="29" font-weight="800" fill="#26372D">' + nodes.center + '</text>' +
    '<text x="400" y="470" text-anchor="middle" font-size="13" font-weight="800" fill="#35453B">CENTER</text>' +
    '</g>';

  for (const node of CHANNEL_NODES) {
    const val = nodes[node.key];
    svg += '<g id="' + node.id + '">' +
      '<circle cx="' + node.x + '" cy="' + node.y + '" r="22" fill="#FFFDF8" stroke="#704B36" stroke-width="3" />' +
      '<text x="' + node.x + '" y="' + node.y + '" text-anchor="middle" dominant-baseline="central" font-size="17" font-weight="800" fill="#563727">' + val + '</text>' +
      '<text x="' + (node.x + (node.id === "love-point" ? -31 : 30)) + '" y="' + (node.y + (node.id === "love-point" ? 28 : -24)) + '" text-anchor="middle" font-size="20" font-weight="800" fill="#704B36">' + node.marker + '</text>' +
      '</g>';
  }

  svg += '</svg>';
  return svg;
}

function renderCodeList(values) {
  return '<p class="zone-code-badge">' + formatCode(values) + '</p>' +
    '<ul class="zone-code-list">' +
    values.map(function(v, idx) {
      const item = ARCANA_DICTIONARY[String(v)];
      const essence = item ? item.coreEssence : "";
      return '<li><strong>' + (idx + 1) + '. ' + formatArcana(v) + '</strong>' +
        (essence ? '<span class="zone-essence"> (' + escapeHtml(essence) + ')</span>' : '') +
        '</li>';
    }).join("") +
    '</ul>';
}

function renderResults(res) {
  const container = document.getElementById("matrix-results");
  if (!container) return;

  const maleName = escapeHtml(res.input.malePartner.name);
  const femaleName = escapeHtml(res.input.femalePartner.name);
  const centerItem = ARCANA_DICTIONARY[String(res.zones.centerArcana)] || {};

  let html = '';
  html += '<div class="matrix-hero-card">';
  html += '  <div class="matrix-hero-eyebrow">Energi Pusat Pasangan</div>';
  html += '  <h2 class="matrix-hero-title">' + formatArcana(res.zones.centerArcana) + '</h2>';
  if (centerItem.coreEssence) {
    html += '  <p class="matrix-hero-essence">' + escapeHtml(centerItem.coreEssence) + '</p>';
  }
  if (centerItem.relationshipPattern) {
    html += '  <p class="matrix-hero-desc"><strong>Dinamika Relasi:</strong> ' + escapeHtml(centerItem.relationshipPattern) + '</p>';
  }
  html += '</div>';

  html += '<div class="diagram-wrapper">';
  html += '  <div class="diagram-card">';
  html += renderOctagonSvg(res.nodes);
  html += '    <div class="diagram-legend">';
  html += '      <span><span class="legend-dot circle-dot"></span> Node Luar (Lingkaran)</span>';
  html += '      <span><span class="legend-dot square-dot"></span> Node Tengah (Persegi)</span>';
  html += '      <span><span class="legend-dot diamond-dot"></span> Node Dalam (Wajik)</span>';
  html += '      <span><span class="legend-line masculine-line"></span> Garis Maskulin</span>';
  html += '      <span><span class="legend-line feminine-line"></span> Garis Feminin</span>';
  html += '      <span><span class="legend-line channel-line"></span> Love–Money Channel</span>';
  html += '    </div>';
  html += '  </div>';
  html += '</div>';

  html += '<div class="matrix-section-title"><h3>Hasil Utama & Arah Pertemuan</h3></div>';
  html += '<div class="matrix-cards-grid">';
  html += '  <div class="matrix-card">';
  html += '    <h4>Tujuan Pertemuan (Meeting Purpose)</h4>';
  html += '    <p class="card-subtitle">Energi spiritual dan material yang mempertemukan kalian.</p>';
  html += renderCodeList(res.zones.meetingPurpose.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Ekor Karma Relasi (Karmic Tail)</h4>';
  html += '    <p class="card-subtitle">Pola bawah sadar dan isu masa lalu yang perlu diselaraskan bersama.</p>';
  html += renderCodeList(res.zones.karmicTail.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Jalur Cinta & Harmoni (Love Line)</h4>';
  html += '    <p class="card-subtitle">Kunci keterbukaan hati dan keharmonisan hubungan.</p>';
  html += renderCodeList(res.zones.loveLine.code);
  html += '    <div class="inner-highlight"><strong>Energi Kunci Harmoni:</strong> ' + formatArcana(res.zones.missingEnergyForHarmony) + '</div>';
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Jalur Finansial Bersama (Economic Lane)</h4>';
  html += '    <p class="card-subtitle">Bagaimana relasi kalian mengalirkan rezeki dan kemakmuran.</p>';
  html += renderCodeList(res.zones.economicLane.code);
  html += '    <div class="inner-highlight"><strong>Titik Uang (Money Point):</strong> ' + formatArcana(res.nodes.moneyPoint) + '</div>';
  html += '  </div>';
  html += '</div>';

  html += '<div class="matrix-section-title"><h3>Zona Hubungan & Karakteristik</h3></div>';
  html += '<div class="matrix-cards-grid">';
  html += '  <div class="matrix-card">';
  html += '    <h4>Citra & Warisan (Portrait Zone)</h4>';
  html += '    <p class="card-subtitle">Bagaimana hubungan kalian dilihat dunia dan pelajaran bagi generasi berikutnya.</p>';
  html += renderCodeList(res.zones.portraitZone.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Zona Bakat & Resiliensi (Talent Zone)</h4>';
  html += '    <p class="card-subtitle">Sumber inspirasi dan cara bangkit ketika krisis muncul.</p>';
  html += renderCodeList(res.zones.talentZone.code);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Perilaku Pasangan</h4>';
  html += '    <p class="card-subtitle">Ekspresi alami masing-masing dalam interaksi relasi.</p>';
  html += '    <ul class="role-list">';
  html += '      <li><strong>Pria (' + maleName + '):</strong> ' + formatArcana(res.zones.relationshipBehavior.male) + '</li>';
  html += '      <li><strong>Wanita (' + femaleName + '):</strong> ' + formatArcana(res.zones.relationshipBehavior.female) + '</li>';
  html += '    </ul>';
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Kualitas yang Perlu Dikembangkan</h4>';
  html += '    <p class="card-subtitle">Ruang pertumbuhan personal demi kelanggengan ikatan.</p>';
  html += '    <ul class="role-list">';
  html += '      <li><strong>Wanita:</strong> ' + formatArcana(res.zones.qualitiesToDevelop.female) + '</li>';
  html += '      <li><strong>Pria:</strong> ' + formatArcana(res.zones.qualitiesToDevelop.male) + '</li>';
  html += '    </ul>';
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Garis Generasi Maskulin</h4>';
  html += '    <p class="card-subtitle">Aliran energi garis keturunan maskulin melalui pusat.</p>';
  html += renderCodeList(res.zones.masculineGenerationLine);
  html += '  </div>';

  html += '  <div class="matrix-card">';
  html += '    <h4>Garis Generasi Feminin</h4>';
  html += '    <p class="card-subtitle">Aliran energi garis keturunan feminin melalui pusat.</p>';
  html += renderCodeList(res.zones.feminineGenerationLine);
  html += '  </div>';
  html += '</div>';

  html += '<div class="matrix-section-title"><h3>Sintesis Energi & Harmoni Akhir</h3></div>';
  html += '<div class="synthesis-grid">';
  html += '  <div class="synthesis-card">';
  html += '    <h4>Relationships (Spiritual & Material)</h4>';
  html += '    <div class="synthesis-row"><span>Langit (Sky):</span> <strong>' + formatArcana(res.relationships.sky) + '</strong></div>';
  html += '    <div class="synthesis-row"><span>Bumi (Earth):</span> <strong>' + formatArcana(res.relationships.earth) + '</strong></div>';
  html += '    <div class="synthesis-row synthesis-result"><span>Hasil Relationship:</span> <strong>' + formatArcana(res.relationships.result) + '</strong></div>';
  html += '  </div>';

  html += '  <div class="synthesis-card">';
  html += '    <h4>Merger (Dinamika Energi)</h4>';
  html += '    <div class="synthesis-row"><span>Energi Maskulin:</span> <strong>' + formatArcana(res.merger.masculineEnergy) + '</strong></div>';
  html += '    <div class="synthesis-row"><span>Energi Feminin:</span> <strong>' + formatArcana(res.merger.feminineEnergy) + '</strong></div>';
  html += '    <div class="synthesis-row synthesis-result"><span>Hasil Merger:</span> <strong>' + formatArcana(res.merger.result) + '</strong></div>';
  html += '  </div>';

  html += '  <div class="synthesis-card highlight-synthesis">';
  html += '    <h4>Total Harmony (Harmoni Hubungan)</h4>';
  html += '    <div class="synthesis-row"><span>Relationship:</span> <strong>' + formatArcana(res.harmony.relationship) + '</strong></div>';
  html += '    <div class="synthesis-row"><span>Merger:</span> <strong>' + formatArcana(res.harmony.merger) + '</strong></div>';
  html += '    <div class="synthesis-row synthesis-result"><span>Harmoni Keseluruhan:</span> <strong>' + formatArcana(res.harmony.result) + '</strong></div>';
  html += '  </div>';
  html += '</div>';

  html += '<div class="matrix-actions-bar">';
  html += '  <button type="button" class="btn btn-outline" id="btn-print-matrix">Cetak / Simpan PDF</button>';
  html += '  <a class="btn btn-primary" href="https://wa.me/6285810531892?text=Halo%20Bhumi%2C%20saya%20sudah%20hitung%20Compatibility%20Matrix%20kami%20(' + encodeURIComponent(res.input.malePartner.name) + '%20%26%20' + encodeURIComponent(res.input.femalePartner.name) + ')%2C%20bisa%20konsultasi%20Blueprint%20lebih%20lengkap%3F" target="_blank" rel="noopener">Konsultasi Reading Lebih Lengkap</a>';
  html += '</div>';

  container.innerHTML = html;
  container.classList.add("show");
  container.scrollIntoView({ behavior: "smooth", block: "start" });

  const printBtn = document.getElementById("btn-print-matrix");
  if (printBtn) {
    printBtn.addEventListener("click", function() {
      window.print();
    });
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("compatibility-form");
  const errorBox = document.getElementById("matrix-error");
  const resultsContainer = document.getElementById("matrix-results");

  if (!form) return;

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (errorBox) {
      errorBox.style.display = "none";
      errorBox.textContent = "";
    }

    try {
      const maleName = document.getElementById("male-name").value.trim();
      const maleBirth = document.getElementById("male-birth").value;
      const femaleName = document.getElementById("female-name").value.trim();
      const femaleBirth = document.getElementById("female-birth").value;

      if (!maleName) throw new Error("Silakan masukkan nama Pasangan 1 (Pria).");
      if (!maleBirth) throw new Error("Silakan masukkan tanggal lahir Pasangan 1 (Pria).");
      if (!femaleName) throw new Error("Silakan masukkan nama Pasangan 2 (Wanita).");
      if (!femaleBirth) throw new Error("Silakan masukkan tanggal lahir Pasangan 2 (Wanita).");

      const res = calculateCompatibilityMatrix({
        malePartner: { name: maleName, birthDate: maleBirth },
        femalePartner: { name: femaleName, birthDate: femaleBirth }
      });

      renderResults(res);
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = err.message || "Terjadi kesalahan saat menghitung matrix.";
        errorBox.style.display = "block";
      }
    }
  });
});
