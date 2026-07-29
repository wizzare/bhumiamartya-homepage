import { normalizeHumanDesignResponse } from '../lib/human-design/normalizer.mjs';

const HD_API_URL = "https://bhumi-human-design-api.vercel.app/calculate";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, message: "Method not allowed." }));
    return;
  }

  try {
    let body;
    try {
      body = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    } catch {
      body = null;
    }

    if (!body || typeof body !== "object") {
      res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Invalid request body." }));
      return;
    }

    const { fullName, birthDate, birthTime, birthCity, latitude, longitude, timezone } = body;

    if (!fullName || !birthDate || !birthCity) {
      res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Missing required fields: fullName, birthDate, birthCity." }));
      return;
    }

    const parts = birthDate.split('-');
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[2]);

    let hour = 12, minute = 0, second = 0;
    if (birthTime) {
      const timeParts = birthTime.split(':');
      hour = parseInt(timeParts[0]);
      minute = parseInt(timeParts[1]);
      second = timeParts[2] ? parseInt(timeParts[2]) : 0;
    }

    let hdData;
    try {
      const hdResponse = await fetch(HD_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year, month, day, hour, minute, second,
          timezone: timezone || null,
          birthDate,
          birthTime: birthTime || "12:00",
          birthCity,
        }),
        signal: AbortSignal.timeout(15000),
      });
      hdData = await hdResponse.json();
    } catch (fetchError) {
      hdData = {
        status: "service_unavailable",
        calculationStatus: "connection_error",
        note: fetchError.message || "Human Design engine unreachable.",
        type: null,
      };
    }

    const humanDesign = normalizeHumanDesignResponse(hdData);
    const lifePath = calculateLifePath(birthDate);
    const age = calculateAge(birthDate);

    const response = {
      meta: {
        success: humanDesign.status === "ready",
        generatedAt: new Date().toISOString(),
        engineVersion: "web-blueprint-1.0.0",
      },
      blueprint: {
        lifePath,
        humanDesign,
        currentAge: age,
        currentAgeEnergy: "-",
        destinyMatrix: {
          calculationStatus: "pending",
          arcanaCenter: null, commonEnergy: null, personalQualities: null,
          jalurEkonomi: null, angkaDollar: null,
          jalurCinta: null, angkaHeart: null,
          karmicTailLegacy: null, karmaAyah: null, karmaIbu: null,
          bakatAyah: null, bakatIbu: null, bakatAgung: null,
          healthChart: {},
          totalPhysics: null, totalEnergy: null, totalEmotion: null,
        },
        astrology: {
          calculationStatus: "pending",
          sunSign: null, moonSign: null, risingSign: null,
          planets: {}, houses: {}, elements: {}, modalities: {},
        },
        input: {
          birthDate,
          birthTime: birthTime || "12:00",
          birthCity,
          latitude: latitude ?? null,
          longitude: longitude ?? null,
          timezone: timezone ?? null,
        },
        generatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify(response));

  } catch (error) {
    console.error("[WEB BLUEPRINT API ERROR]:", error);
    res.writeHead(500, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({
      success: false,
      message: "Blueprint tidak dapat dihitung. Silakan periksa data yang dimasukkan.",
      error: error.message,
    }));
  }
}

function calculateLifePath(birthDate) {
  if (!birthDate) return { number: 0, display: "-", role: "-", positiveTraits: [], negativeTraits: [] };

  const [year, month, day] = birthDate.split('-').map(Number);

  const reduceSum = (num) => {
    if (num === 11 || num === 22 || num === 33) return num;
    let sum = String(num).split('').reduce((a, d) => a + parseInt(d), 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = String(sum).split('').reduce((a, d) => a + parseInt(d), 0);
    }
    return sum;
  };

  const dNum = reduceSum(day);
  const mNum = reduceSum(month);
  const yNum = reduceSum(String(year).split('').reduce((a, d) => a + parseInt(d), 0));
  const total = dNum + mNum + yNum;
  const number = reduceSum(total);

  const roles = {
    1: "The Leader", 2: "The Diplomat", 3: "The Communicator",
    4: "The Builder", 5: "The Traveler", 6: "The Nurturer",
    7: "The Seeker", 8: "The Powerhouse", 9: "The Humanitarian",
    11: "The Visionary", 22: "The Master Builder", 33: "The Teacher",
  };

  const posTraits = {
    1: ["Leadership", "Independent", "Creative"],
    2: ["Cooperative", "Diplomatic", "Intuitive"],
    3: ["Expressive", "Optimistic", "Social"],
    4: ["Practical", "Reliable", "Hardworking"],
    5: ["Adaptable", "Freedom-loving", "Progressive"],
    6: ["Responsible", "Nurturing", "Compassionate"],
    7: ["Analytical", "Knowledgeable", "Spiritual"],
    8: ["Ambitious", "Efficient", "Authoritative"],
    9: ["Compassionate", "Generous", "Artistic"],
    11: ["Inspired", "Enlightened", "Intuitive"],
    22: ["Visionary", "Practical", "Masterful"],
    33: ["Compassionate", "Inspirational", "Selfless"],
  };

  const negTraits = {
    1: ["Aggressive", "Egocentric", "Domineering"],
    2: ["Dependent", "Oversensitive", "Passive"],
    3: ["Scattered", "Superficial", "Criticizing"],
    4: ["Stubborn", "Lazy", "Rigid"],
    5: ["Irresponsible", "Inconsistent", "Restless"],
    6: ["Worrisome", "Self-sacrificing", "Martyr-like"],
    7: ["Distant", "Sarcastic", "Secretive"],
    8: ["Materialistic", "Intimidating", "Workaholic"],
    9: ["Unrealistic", "Giving to receive", "Dire"],
    11: ["Impractical", "Overly idealistic", "Detached"],
    22: ["Overwhelmed by vision", "Impatient", "Controlling"],
    33: ["Overbearing", "Self-sacrificing", "Emotional burden"],
  };

  return {
    number,
    display: number.toString(),
    role: roles[number] || "-",
    positiveTraits: posTraits[number] || [],
    negativeTraits: negTraits[number] || [],
  };
}

function calculateAge(birthDateStr) {
  if (!birthDateStr) return 0;
  const birth = new Date(birthDateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}