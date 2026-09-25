# Blueprint Engines Test Plan

> **Status: TECHNICAL — STILL VALID, WITH A KNOWN OPEN FAILURE (verified 2026-09-25).** Running `npm install && npm run test:engines` shows `tests/engines-fixture-a.test.mjs` failing (Human Design strategy: expected "To Respond", got "Wait to Respond") against Fixture A below. Tracked in `docs/TODO.md` P0 and `FEATURE_PARITY_MATRIX.md` → "Grand Design Alignment". Not fixed as part of the 2026-09-25 documentation-only pass (no engine changes permitted in that task).

## Fixture A (Baseline)

```json
{
  "input": {
    "birthDate": "1985-05-03",
    "birthTime": "23:45",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "timezone": "Asia/Jakarta"
  },
  "expected": {
    "humanDesign": {
      "type": "Manifesting Generator",
      "profile": "6/3"
    },
    "vedic": {
      "rashi": "Libra",
      "nakshatra": "Chitra",
      "pada": 4,
      "mahadasha": "Saturn"
    }
  },
  "baselineSource": "legacy-api-read-only",
  "baselineCapturedAt": "2026-08-01T00:00:00Z"
}
```

## Fixture B (Leap year, jam 00:00)

```json
{
  "input": {
    "birthDate": "2000-02-29",
    "birthTime": "00:00",
    "latitude": -6.9175,
    "longitude": 107.6191,
    "timezone": "Asia/Jakarta"
  },
  "expected": {
    "humanDesign": {
      "type": "Generator",
      "profile": "4/1"
    },
    "vedic": {
      "rashi": "Sagittarius",
      "nakshatra": "Mula",
      "pada": 1,
      "mahadasha": "Sun"
    }
  },
  "baselineSource": "legacy-api-read-only",
  "baselineCapturedAt": "2026-08-01T00:00:00Z"
}
```

## Fixture C (Luar Indonesia, timezone DST)

```json
{
  "input": {
    "birthDate": "1990-12-25",
    "birthTime": "15:30",
    "latitude": 35.6762,
    "longitude": 139.6503,
    "timezone": "Asia/Tokyo"
  },
  "expected": {
    "humanDesign": {
      "type": "Projector",
      "profile": "6/2"
    },
    "vedic": {
      "rashi": "Pisces",
      "nakshatra": "Uttara Bhadrapada",
      "pada": 3,
      "mahadasha": "Venus"
    }
  },
  "baselineSource": "legacy-api-read-only",
  "baselineCapturedAt": "2026-08-01T00:00:00Z"
}
```

## Fixture D (Longitude negatif)

```json
{
  "input": {
    "birthDate": "1995-07-14",
    "birthTime": "08:15",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "timezone": "Europe/London"
  },
  "expected": {},
  "baselineSource": "manual-calculation",
  "baselineCapturedAt": "TBD"
}
```

## Boundary Tests

1. Jam lahir 23:45 (dekat tengah malam)
2. Jam lahir 00:00
3. Tanggal 29 Feb (leap year)
4. Timezone DST
5. Longitude negatif
6. Latitude negatif

## Regression

- Jalankan fixture A/B/C setiap kali ada perubahan `lib/human-design/` atau `lib/vedic/`
- Bandingkan output dengan baseline API lama
- Simpan expected values sebagai test fixtures
- Jalankan sebelum commit
