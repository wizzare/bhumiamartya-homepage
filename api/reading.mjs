import crypto from 'crypto';

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
const MAX_BODY_BYTES = 32768;
const MIN_FORM_TIME_MS = 3000;

function isAllowedOrigin(origin) {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    return url.protocol === "https:" && (url.hostname === "bhumiamartya.my.id" || url.hostname === "www.bhumiamartya.my.id" || url.hostname.endsWith(".vercel.app"));
  } catch {
    return false;
  }
}

// In-memory submission fingerprint cache for short window duplicate protection (60 seconds)
const recentSubmissions = new Map();

function cleanOldSubmissions() {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 60000) {
      recentSubmissions.delete(key);
    }
  }
}

// In-memory rate limiting (IP based) - Vercel serverless compatible
const ipRateLimit = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  // Clean up old entries
  for (const [key, timestamp] of ipRateLimit.entries()) {
    if (now - timestamp > 60000) {
      ipRateLimit.delete(key);
    }
  }

  // 5 requests per IP per minute
  if (ipRateLimit.has(ip)) {
    const data = ipRateLimit.get(ip);
    if (now - data.timestamp > 60000) {
      ipRateLimit.set(ip, { count: 1, timestamp: now });
      return true;
    }
    if (data.count >= 5) {
      return false; // Rate limited
    }
    data.count += 1;
    ipRateLimit.set(ip, data);
    return true;
  }
  
  ipRateLimit.set(ip, { count: 1, timestamp: now });
  return true;
}

// Generate Asia/Jakarta timestamp in DD/MM/YYYY HH:mm:ss format
function getJakartaTimestamp() {
  const now = new Date();
  const options = {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  
  const formatter = new Intl.DateTimeFormat("en-GB", options);
  const parts = formatter.formatToParts(now);
  
  let day = "", month = "", year = "", hour = "", minute = "", second = "";
  for (const part of parts) {
    if (part.type === "day") day = part.value;
    if (part.type === "month") month = part.value;
    if (part.type === "year") year = part.value;
    if (part.type === "hour") hour = part.value;
    if (part.type === "minute") minute = part.value;
    if (part.type === "second") second = part.value;
  }

  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

// Helper to format WhatsApp number for wa.me link (628...)
function formatWaForLink(waStr) {
  let cleaned = String(waStr || "").replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.substring(1);
  }
  return cleaned;
}

// Generate RS256 Signed JWT for Google OAuth2
async function getGoogleAccessToken(clientEmail, privateKey) {
  const cryptoModule = await import('crypto');
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600;

  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: expiry,
    iat: now,
  };

  const base64UrlEncode = (str) =>
    Buffer.from(typeof str === "string" ? str : JSON.stringify(str))
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const encodedHeader = base64UrlEncode(header);
  const encodedClaimSet = base64UrlEncode(claimSet);
  const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

  // Handle line breaks in private key string if passed via env var
  const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

  const signer = cryptoModule.createSign("RSA-SHA256");
  signer.update(unsignedToken);
  const signature = signer.sign(formattedPrivateKey, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${unsignedToken}.${signature}`;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }).toString(),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(`Failed to obtain Google access token: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
  }

  return tokenData.access_token;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  const responseHeaders = isAllowedOrigin(origin) ? CORS_HEADERS : { ...CORS_HEADERS, "Access-Control-Allow-Origin": "null" };

  if (req.method === "OPTIONS") {
    res.writeHead(204, responseHeaders);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, code: "METHOD_NOT_ALLOWED", message: "Method not allowed." }));
    return;
  }

  if (!isAllowedOrigin(origin)) {
    res.writeHead(403, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, code: "ORIGIN_NOT_ALLOWED", message: "Request origin is not allowed." }));
    return;
  }

  const contentType = String(req.headers["content-type"] || "").toLowerCase();
  if (!contentType.includes("application/json")) {
    res.writeHead(415, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, code: "UNSUPPORTED_MEDIA_TYPE", message: "Content-Type must be application/json." }));
    return;
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    res.writeHead(413, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, code: "PAYLOAD_TOO_LARGE", message: "Request payload is too large." }));
    return;
  }

  try {
    let body;
    try {
      body = typeof req.body === "object" ? req.body : JSON.parse(req.body || "{}");
    } catch {
      body = null;
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, code: "INVALID_BODY", message: "Invalid request body." }));
      return;
    }

    const serializedBody = JSON.stringify(body);
    if (Buffer.byteLength(serializedBody, "utf8") > MAX_BODY_BYTES) {
      res.writeHead(413, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, code: "PAYLOAD_TOO_LARGE", message: "Request payload is too large." }));
      return;
    }

    // IP Rate Limiting
    const clientIp = req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
    if (clientIp !== "unknown" && !checkRateLimit(clientIp)) {
      res.writeHead(429, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, code: "RATE_LIMITED", message: "Terlalu banyak permintaan. Silakan tunggu 1 menit." }));
      return;
    }

    // Honeypot protection
    if (body.website_hp && String(body.website_hp).trim() !== "") {
      res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, code: "SPAM_DETECTED", message: "Spam request rejected." }));
      return;
    }

    // Extract form fields
    let name = String(body.name || "").trim();
    let email = String(body.email || "").trim().toLowerCase();
    let birthDate = String(body.birthDate || "").trim();
    let birthTime = String(body.birthTime || "").trim();
    let birthCity = String(body.birthCity || "").trim();
    let gender = String(body.gender || "").trim();
    let tiktok = String(body.tiktok || "").trim() || "-";
    let whatsapp = String(body.whatsapp || "").trim();
    let donationAmount = Number(body.donationAmount);
    let consent = body.consent === true || body.consent === "true";
    const submittedAt = Number(body.submittedAt);

    const errors = {};

    if (!name || name.length < 2) {
      errors.name = "Nama lengkap minimal 2 karakter.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.email = "Email wajib diisi dengan format yang valid.";
    }

if (!birthDate) {
      errors.birthDate = "Tanggal lahir wajib diisi.";
    } else {
      const [by, bm, bd] = birthDate.split("-").map(Number);
      if (!by || !bm || !bd || by < 1900 || by > 2100 || bm < 1 || bm > 12 || bd < 1 || bd > 31) {
        errors.birthDate = "Tanggal lahir tidak valid.";
      }
    }
    if (!birthTime) {
      errors.birthTime = "Jam lahir wajib diisi.";
    } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(birthTime)) {
      errors.birthTime = "Jam lahir tidak valid.";
    }

    if (!birthCity || birthCity.length < 2) {
      errors.birthCity = "Kota kelahiran minimal 2 karakter.";
    }

    if (!gender || !["Laki-laki", "Perempuan"].includes(gender)) {
      errors.gender = "Jenis kelamin wajib dipilih.";
    }

    const waDigits = whatsapp.replace(/\D/g, "");
    if (!whatsapp || waDigits.length < 8 || !/^(?:\+62|62|0)\d{7,15}$/.test(whatsapp.replace(/[\s-]/g, ""))) {
      errors.whatsapp = "Nomor WhatsApp wajib terisi dan valid.";
    }

    if (isNaN(donationAmount) || donationAmount < 25000) {
      errors.donationAmount = "Jumlah donasi minimal Rp25.000.";
    }

    if (!Number.isFinite(submittedAt) || submittedAt <= 0 || Date.now() - submittedAt < MIN_FORM_TIME_MS || Date.now() - submittedAt > 86400000) {
      errors.submittedAt = "Waktu pengiriman form tidak valid.";
    }

    if (!consent) {
      errors.consent = "Persetujuan ketentuan wajib dicentang.";
    }

    if (Object.keys(errors).length > 0) {
      res.writeHead(400, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Periksa kembali data yang diisi.",
        fields: errors,
      }));
      return;
    }

    // Duplicate submission suppression (60s window)
    cleanOldSubmissions();
    const submissionKey = crypto.createHash("sha256").update(`${email}|${waDigits}|${birthDate}|${Math.floor(Date.now() / 60000)}`).digest("hex");
    if (recentSubmissions.has(submissionKey)) {
      res.writeHead(429, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        code: "DUPLICATE_SUBMISSION",
        message: "Permintaan pemesanan serupa baru saja dikirim. Silakan tunggu 1 menit.",
      }));
      return;
    }

    // Environment variables
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const spreadsheetId = process.env.GOOGLE_READING_SPREADSHEET_ID || "1hf6eLw8d7NrZxg6wqAx16xSLwanms0E6u-ju_MweRn8";
    const isMockMode = process.env.READING_FORM_MOCK_MODE === "true";

    // Strict non-production mock mode check
    if (!clientEmail || !privateKey) {
      if (isMockMode && process.env.NODE_ENV !== "production") {
        console.warn("[READING FORM API]: Operating in DEV MOCK MODE (no Google credentials required).");
        recentSubmissions.set(submissionKey, Date.now());
        const linkWaNumber = formatWaForLink(whatsapp);
        const prefilledText = `Halo Admin Bhumi Amartya.\n\nSaya sudah mengisi Form Personal Blueprint melalui website.\n\nNama pemesan: ${name}\nNama pengirim donasi:\nJumlah donasi: Rp${donationAmount.toLocaleString('id-ID')}\n\nSaya akan mengirimkan bukti donasi pada pesan berikutnya.\n\nMohon verifikasi agar pesanan dapat masuk ke antrean reading.`;
        const whatsappUrl = `https://wa.me/6285810531892?text=${encodeURIComponent(prefilledText)}`;

        res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
        res.end(JSON.stringify({
          success: true,
          message: "[DEV MOCK] Data berhasil dikirim.",
          requiresDonationProof: true,
          whatsappUrl,
          data: { name, donationAmount },
        }));
        return;
      }

      // PRODUCTION / NO CREDENTIALS FAIL SAFE - NO FAKE SUCCESS!
      console.error("[READING FORM API ERROR]: Google Sheets credentials (GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY) not configured.");
      res.writeHead(503, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        code: "INTEGRATION_NOT_CONFIGURED",
        message: "Data belum berhasil disimpan karena integrasi server belum siap. Silakan hubungi admin.",
      }));
      return;
    }

    // Authenticate with Google API
    let accessToken;
    try {
      accessToken = await getGoogleAccessToken(clientEmail, privateKey);
    } catch (authErr) {
      console.error("[READING FORM API AUTH ERROR]:", authErr.message);
      res.writeHead(500, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        code: "INTEGRATION_ERROR",
        message: "Data belum berhasil disimpan. Silakan coba kembali beberapa saat lagi.",
      }));
      return;
    }

    // Format Timestamp: Asia/Jakarta DD/MM/YYYY HH:mm:ss
    const timestampStr = getJakartaTimestamp();

    // Use valueInputOption=RAW to ensure strings (like WhatsApp) are not parsed as numbers
    // This avoids the need for manual apostrophes while preserving leading zeros
    const waSheetValue = whatsapp; // Sent as Javascript String

    // Append to Google Sheets API v4 (Columns A-K)
    const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Form%20responses%201!A:K:append?valueInputOption=RAW`;
    const appendBody = {
      range: "Form responses 1!A:K",
      majorDimension: "ROWS",
      values: [
        [
          timestampStr,     // A: Timestamp
          email,            // B: Email
          name,             // C: Nama
          birthDate,        // D: Tanggal lahir
          birthTime,        // E: Jam lahir
          birthCity,        // F: Kota kelahiran
          gender,           // G: Jenis kelamin
          tiktok,           // H: Akun TikTok
          "",               // I: Kosong
          waSheetValue,     // J: Nomor WhatsApp (Text string with leading zero)
          donationAmount,   // K: Jumlah donasi (number)
        ],
      ],
    };

    const appendResponse = await fetch(appendUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appendBody),
    });

    const appendData = await appendResponse.json();

    if (!appendResponse.ok || appendData.error) {
      console.error("[READING FORM API SHEETS ERROR]:", appendData.error ? appendData.error.message : "Append failed");
      res.writeHead(500, { ...CORS_HEADERS, "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: false,
        code: "INTEGRATION_ERROR",
        message: "Data belum berhasil disimpan ke spreadsheet. Silakan coba kembali.",
      }));
      return;
    }

    // Success confirmed! Mark submission fingerprint
    recentSubmissions.set(submissionKey, Date.now());

    // Generate WhatsApp Prefill Link
    const prefilledText = `Halo Admin Bhumi Amartya.\n\nSaya sudah mengisi Form Personal Blueprint melalui website.\n\nNama pemesan: ${name}\nNama pengirim donasi:\nJumlah donasi: Rp${donationAmount.toLocaleString('id-ID')}\n\nSaya akan mengirimkan bukti donasi pada pesan berikutnya.\n\nMohon verifikasi agar pesanan dapat masuk ke antrean reading.`;
    const whatsappUrl = `https://wa.me/6285810531892?text=${encodeURIComponent(prefilledText)}`;

    res.writeHead(200, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({
      success: true,
      message: "Data berhasil dikirim.",
      requiresDonationProof: true,
      whatsappUrl,
      data: {
        name,
        donationAmount,
      },
    }));

  } catch (error) {
    console.error("[READING FORM SERVER ERROR]:", error);
    res.writeHead(500, { ...CORS_HEADERS, "Content-Type": "application/json" });
    res.end(JSON.stringify({
      success: false,
      code: "SERVER_ERROR",
      message: "Terjadi kendala pada sistem. Data belum tersimpan.",
    }));
  }
}
