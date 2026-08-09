export function isValidIanaTimeZone(timezone) {
  if (typeof timezone !== 'string' || !timezone.trim()) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

function getPartsInTimezone(date, timezone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date);

  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second)
  };
}

function offsetMinutesAt(date, timezone) {
  const local = getPartsInTimezone(date, timezone);
  const localAsUtc = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second);
  return Math.round((localAsUtc - date.getTime()) / 60000);
}

export function offsetStringAt(date, timezone) {
  const minutes = offsetMinutesAt(date, timezone);
  const sign = minutes >= 0 ? '+' : '-';
  const abs = Math.abs(minutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${sign}${hh}:${mm}`;
}

export function localDateTimeToUtc({ birthDate, birthTime, timezone }) {
  if (!isValidIanaTimeZone(timezone)) {
    return { ok: false, code: 'INVALID_TIMEZONE' };
  }

  const [year, month, day] = String(birthDate || '').split('-').map(Number);
  const [hour, minute] = String(birthTime || '').split(':').map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    return { ok: false, code: 'INVALID_BIRTH_DATA' };
  }

  const naiveUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  });

  const matches = new Set();
  for (let offset = -1440; offset <= 1440; offset++) {
    const candidateUtc = new Date(naiveUtc - offset * 60000);
    const map = Object.fromEntries(fmt.formatToParts(candidateUtc).map((p) => [p.type, p.value]));
    if (
      Number(map.year) === year &&
      Number(map.month) === month &&
      Number(map.day) === day &&
      Number(map.hour) === hour &&
      Number(map.minute) === minute
    ) {
      matches.add(candidateUtc.getTime());
    }
  }

  if (matches.size === 0) {
    return { ok: false, code: 'INVALID_LOCAL_TIME' };
  }
  if (matches.size > 1) {
    return { ok: false, code: 'AMBIGUOUS_LOCAL_TIME' };
  }

  const utc = new Date([...matches][0]);
  return {
    ok: true,
    utc,
    offset: offsetStringAt(utc, timezone)
  };
}
