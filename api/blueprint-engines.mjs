import { calculateHumanDesign } from '../lib/human-design/calculate.mjs';
import { normalizeHumanDesignResponse } from '../lib/human-design/normalizer.mjs';
import { calculateVedic } from '../lib/vedic/calculate.mjs';
import { isValidIanaTimeZone, localDateTimeToUtc } from '../lib/timezone.mjs';
import { resolveTimezoneFromCoordinates } from '../lib/timezone-resolver.mjs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const MAX_BODY_BYTES = 32768;

function json(res, status, body) {
  res.writeHead(status, { ...CORS_HEADERS, 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function parseJsonBody(req) {
  if (typeof req.body === 'object' && req.body !== null) return req.body;
  try {
    return JSON.parse(req.body || '{}');
  } catch {
    return null;
  }
}

function validateDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function validateTime(value) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value || ''));
}

function validateAsOfDate(value) {
  return validateDate(value);
}

export default async function handler(req, res) {
  const startedAt = Date.now();
  const requestId = Math.random().toString(36).slice(2, 10);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    json(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' });
    return;
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  if (!contentType.includes('application/json')) {
    json(res, 415, { ok: false, code: 'UNSUPPORTED_CONTENT_TYPE', message: 'Content-Type must be application/json.' });
    return;
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > MAX_BODY_BYTES) {
    json(res, 413, { ok: false, code: 'PAYLOAD_TOO_LARGE', message: 'Request payload is too large.' });
    return;
  }

  const body = parseJsonBody(req);
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    json(res, 400, { ok: false, code: 'INVALID_JSON', message: 'Invalid JSON body.' });
    return;
  }

  const serializedBody = JSON.stringify(body);
  if (Buffer.byteLength(serializedBody, 'utf8') > MAX_BODY_BYTES) {
    json(res, 413, { ok: false, code: 'PAYLOAD_TOO_LARGE', message: 'Request payload is too large.' });
    return;
  }

  const {
    birthDate,
    birthTime,
    birthCity,
    latitude,
    longitude,
    timezone,
    asOfDate
  } = body;

  if (!birthDate) return json(res, 400, { ok: false, code: 'BIRTH_DATE_REQUIRED', message: 'Tanggal lahir diperlukan.' });
  if (!birthTime) return json(res, 400, { ok: false, code: 'BIRTH_TIME_REQUIRED', message: 'Jam lahir diperlukan untuk menghitung Human Design dan Vedic Astrology.' });
  if (!validateDate(birthDate)) return json(res, 400, { ok: false, code: 'INVALID_BIRTH_DATE', message: 'Tanggal lahir tidak valid.' });
  if (!validateTime(birthTime)) return json(res, 400, { ok: false, code: 'INVALID_BIRTH_TIME', message: 'Jam lahir tidak valid.' });
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90 || !Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return json(res, 400, { ok: false, code: 'INVALID_COORDINATES', message: 'Koordinat tidak valid.' });
  }

  let resolvedTimezone = null;
  if (timezone) {
    if (!isValidIanaTimeZone(timezone)) {
      return json(res, 400, { ok: false, code: 'INVALID_TIMEZONE', message: 'Timezone IANA valid diperlukan.' });
    }
    resolvedTimezone = timezone;
  } else {
    const tzResult = resolveTimezoneFromCoordinates(latitude, longitude);
    if (!tzResult.ok) {
      const code = tzResult.code === 'AMBIGUOUS_TIMEZONE' ? 'AMBIGUOUS_TIMEZONE' : 'INVALID_TIMEZONE';
      const message = tzResult.code === 'AMBIGUOUS_TIMEZONE'
        ? 'Lokasi memiliki beberapa timezone yang berbeda. Berikan timezone IANA secara eksplisit.'
        : 'Timezone tidak dapat diresolusi dari koordinat. Berikan timezone IANA secara eksplisit.';
      return json(res, 400, { ok: false, code, message, zones: tzResult.zones });
    }
    resolvedTimezone = tzResult.timezone;
  }

  const effectiveAsOfDate = asOfDate || new Date().toISOString().slice(0, 10);
  if (!validateAsOfDate(effectiveAsOfDate)) {
    return json(res, 400, { ok: false, code: 'INVALID_AS_OF_DATE', message: 'asOfDate tidak valid.' });
  }

  const utcResult = localDateTimeToUtc({ birthDate, birthTime, timezone: resolvedTimezone });
  if (!utcResult.ok) {
    const code = utcResult.code === 'INVALID_LOCAL_TIME' ? 'INVALID_BIRTH_TIME' : 'INVALID_TIMEZONE';
    const message = utcResult.code === 'INVALID_LOCAL_TIME'
      ? 'Waktu lokal ambigu atau tidak valid untuk timezone yang dipilih.'
      : 'Timezone IANA valid diperlukan.';
    return json(res, 400, { ok: false, code, message });
  }

  const birthUtc = utcResult.utc;
  const hdRaw = calculateHumanDesign({ birthUtc });
  const humanDesign = normalizeHumanDesignResponse(hdRaw);
  const vedic = calculateVedic({ birthUtc, asOfDate: new Date(`${effectiveAsOfDate}T00:00:00Z`) });

  if (humanDesign.status !== 'ready') {
    return json(res, 500, { ok: false, code: 'CALCULATION_FAILED', message: 'Human Design calculation failed.' });
  }
  if (!vedic.ok) {
    return json(res, 500, { ok: false, code: vedic.code || 'CALCULATION_FAILED', message: vedic.message || 'Vedic calculation failed.' });
  }

const durationMs = Date.now() - startedAt;
  const response = {
    ok: true,
    humanDesign: {
      type: humanDesign.type,
      profile: humanDesign.profile,
      authority: humanDesign.authority,
      strategy: humanDesign.strategy,
      signature: humanDesign.signature,
      notSelfTheme: humanDesign.notSelfTheme,
      definition: humanDesign.definition,
      incarnationCross: humanDesign.incarnationCross,
      variable: humanDesign.variable || humanDesign.variableShortCode,
      gatesPersonality: humanDesign.gatesPersonality,
      gatesDesign: humanDesign.gatesDesign,
      definedGates: humanDesign.definedGates,
      channels: humanDesign.channels,
      personalityActivations: humanDesign.personalityActivations,
      designActivations: humanDesign.designActivations,
      centers: humanDesign.centers,
      definedCenters: humanDesign.definedCenters,
      openCenters: humanDesign.openCenters
    },
    vedic: {
      scope: 'moon-based-basic',
      rashi: vedic.rashi,
      nakshatra: vedic.nakshatra,
      pada: vedic.pada,
      nakshatraLord: vedic.nakshatraLord,
      currentMahadasha: vedic.currentMahadasha
    },
      metadata: {
      requestId,
      durationMs,
      engineVersion: '1.0.0',
      zodiac: 'sidereal',
      ayanamsa: 'Lahiri',
      vedicScope: 'moon-based-basic',
      nakshatraSystem: '27',
      dashaSystem: 'Vimshottari',
      asOfDate: effectiveAsOfDate,
      resolvedTimezone,
      birthUtc: birthUtc.toISOString()
    }
  };

  json(res, 200, response);
}
