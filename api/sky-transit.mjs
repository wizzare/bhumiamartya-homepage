// Canonical Sky & Personal Transit API Endpoint for Bhumi Amartya
// Combines Live Current Sky, Ephemeris Retrogrades, Personal Transits (Gochara), and Humanized Narrative

import { calculateCurrentSky } from '../lib/sky-transit/ephemeris.mjs';
import { calculatePersonalTransits } from '../lib/sky-transit/personal-transit.mjs';
import { composeHumanizedReading } from '../lib/narrative/humanized-composer.mjs';
import { calculateVedic } from '../lib/vedic/calculate.mjs';
import { getTropicalLongitude, normalizeDegrees } from '../lib/sky-transit/ephemeris.mjs';
import { dateToJulianDay } from '../lib/vedic/julian.mjs';
import { tropicalToSidereal } from '../lib/vedic/ayanamsa.mjs';
import { getRashi } from '../lib/vedic/rashi.mjs';
import { getNakshatra } from '../lib/vedic/nakshatra.mjs';
import { isValidIanaTimeZone, localDateTimeToUtc } from '../lib/timezone.mjs';
import { resolveTimezoneFromCoordinates } from '../lib/timezone-resolver.mjs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return json(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed.' });
  }

  let body = {};
  if (req.method === 'POST') {
    const contentType = String(req.headers['content-type'] || '').toLowerCase();
    if (!contentType.includes('application/json')) {
      return json(res, 415, { ok: false, code: 'UNSUPPORTED_CONTENT_TYPE', message: 'Content-Type must be application/json.' });
    }
    const contentLength = Number(req.headers['content-length'] || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return json(res, 413, { ok: false, code: 'PAYLOAD_TOO_LARGE', message: 'Request payload is too large.' });
    }
    body = parseJsonBody(req);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return json(res, 400, { ok: false, code: 'INVALID_JSON', message: 'Invalid JSON body.' });
    }
  }

  try {
    const {
      birthDate,
      birthTime,
      birthCity,
      latitude,
      longitude,
      timezone,
      asOfDate,
      nickname,
      lifePath,
      arcanaName,
      weton,
      baziElement
    } = body;

    // 1. Determine asOfDate (current real-time live date)
    const now = new Date();
    let effectiveDate = now;
    if (asOfDate) {
      if (!validateDate(asOfDate)) {
        return json(res, 400, { ok: false, code: 'INVALID_AS_OF_DATE', message: 'asOfDate tidak valid.' });
      }
      effectiveDate = new Date(`${asOfDate}T12:00:00Z`);
    }

    // 2. Compute canonical Current Sky
    const currentSky = calculateCurrentSky(effectiveDate);

    // 3. Process natal points if birthDate is provided
    let natalDataCompleteness = 'none';
    let natalPoints = {};
    const calculationWarnings = [];

    if (birthDate) {
      if (!validateDate(birthDate)) {
        return json(res, 400, { ok: false, code: 'INVALID_BIRTH_DATE', message: 'Tanggal lahir tidak valid.' });
      }

      const hasBirthTime = Boolean(birthTime && validateTime(birthTime));
      const hasCoords = Number.isFinite(latitude) && Number.isFinite(longitude);

      let resolvedTimezone = 'Asia/Jakarta';
      if (timezone && isValidIanaTimeZone(timezone)) {
        resolvedTimezone = timezone;
      } else if (hasCoords) {
        const tzRes = resolveTimezoneFromCoordinates(latitude, longitude);
        if (tzRes.ok) resolvedTimezone = tzRes.timezone;
      }

      if (hasBirthTime && hasCoords) {
        natalDataCompleteness = 'full';
        const utcRes = localDateTimeToUtc({ birthDate, birthTime, timezone: resolvedTimezone });
        if (utcRes.ok) {
          const birthUtc = utcRes.utc;
          const birthJd = dateToJulianDay(birthUtc);

          // Natal Sun
          const sunTrop = getTropicalLongitude('Sun', birthUtc);
          const sunSid = tropicalToSidereal(sunTrop, birthJd);
          const sunRashi = getRashi(sunSid);
          const sunNak = getNakshatra(sunSid);

          // Natal Moon via Vedic engine
          const vedicRes = calculateVedic({ birthUtc, asOfDate: effectiveDate });
          let natalMoon = null;
          if (vedicRes.ok) {
            natalMoon = {
              siderealLongitude: vedicRes.siderealMoonLon,
              rashi: { index: vedicRes.rashiDetailed.index, name: vedicRes.rashiDetailed.name, short: vedicRes.rashi },
              nakshatra: { index: vedicRes.nakshatraDetailed.index, name: vedicRes.nakshatra, lord: vedicRes.nakshatraLord, pada: vedicRes.pada }
            };
          }

          natalPoints = {
            natalMoon,
            natalSun: {
              siderealLongitude: sunSid,
              rashi: { index: sunRashi.index, name: sunRashi.name, short: sunRashi.short },
              nakshatra: { index: sunNak.index, name: sunNak.name, lord: sunNak.lord, pada: sunNak.pada }
            },
            isPartial: false
          };
        } else {
          calculationWarnings.push('Gagal mengonversi jam lahir lokal ke UTC; beralih ke pembacaan parsial.');
          natalDataCompleteness = 'partial';
        }
      } else {
        natalDataCompleteness = 'partial';
        calculationWarnings.push('Jam atau koordinat kota lahir tidak diisi; posisi Ascendant dan rumah astrologi tidak dihitung.');

        // Midday approximation for natal Sun
        const [y, m, d] = birthDate.split('-').map(Number);
        const approxBirthUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
        const birthJd = dateToJulianDay(approxBirthUtc);
        const sunTrop = getTropicalLongitude('Sun', approxBirthUtc);
        const sunSid = tropicalToSidereal(sunTrop, birthJd);
        const sunRashi = getRashi(sunSid);
        const sunNak = getNakshatra(sunSid);

        natalPoints = {
          natalSun: {
            siderealLongitude: sunSid,
            rashi: { index: sunRashi.index, name: sunRashi.name, short: sunRashi.short },
            nakshatra: { index: sunNak.index, name: sunNak.name, lord: sunNak.lord, pada: sunNak.pada }
          },
          isPartial: true
        };
      }
    }

    // 4. Calculate Personal Transits (Gochara)
    const personalTransits = calculatePersonalTransits(currentSky, natalPoints);

    // 5. Compose Humanized Narrative
    const narrative = composeHumanizedReading({
      nickname: nickname || 'Kawan',
      lifePath: Number(lifePath) || 9,
      arcanaName: arcanaName || 'The Sun',
      sunSign: natalPoints.natalSun?.rashi?.short || 'Aries',
      weton,
      baziElement,
      currentSky,
      personalTransits,
      isPartial: natalDataCompleteness !== 'full'
    });

    const response = {
      ok: true,
      calculation_time: currentSky.calculationTime,
      timezone: 'Asia/Jakarta',
      zodiac_system: 'sidereal',
      ayanamsa: 'lahiri',
      ephemeris_source: 'astronomy-engine (VSOP87 / ELP2000-82B)',
      natal_data_completeness: natalDataCompleteness,
      current_sky: currentSky,
      retrograde_planets: currentSky.activeRetrogrades,
      personal_transits: personalTransits.primaryTransits,
      all_transits: personalTransits.allTransits,
      narrative: narrative.sections,
      calculation_warnings: calculationWarnings
    };

    return json(res, 200, response);
  } catch (error) {
    console.error('[API SKY-TRANSIT ERROR]', error);
    return json(res, 500, {
      ok: false,
      code: 'INTERNAL_ERROR',
      message: 'Gagal menghitung posisi langit saat ini.',
      detail: error.message
    });
  }
}
