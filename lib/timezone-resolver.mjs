import { find, preCache } from 'geo-tz';
import { isValidIanaTimeZone } from './timezone.mjs';

export function resolveTimezoneFromCoordinates(latitude, longitude) {
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return { ok: false, code: 'INVALID_COORDINATES' };
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return { ok: false, code: 'INVALID_COORDINATES' };
  }

  const candidates = find(latitude, longitude);
  if (!candidates || candidates.length === 0) {
    return { ok: false, code: 'TIMEZONE_RESOLUTION_FAILED' };
  }

  const zones = candidates.filter((zone) => isValidIanaTimeZone(zone));
  if (zones.length === 0) {
    return { ok: false, code: 'TIMEZONE_RESOLUTION_FAILED' };
  }

  const unique = [...new Set(zones)];
  if (unique.length > 1) {
    return { ok: false, code: 'AMBIGUOUS_TIMEZONE', zones: unique };
  }

  return { ok: true, timezone: unique[0] };
}

export { preCache };