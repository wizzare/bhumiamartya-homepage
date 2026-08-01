# Blueprint Engines API Contract

## Endpoint

```
POST /api/blueprint-engines
```

## Request

```json
{
  "birthDate": "1985-05-03",
  "birthTime": "23:45",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "timezone": "Asia/Jakarta"
}
```

### Required fields

| Field | Type | Validation |
| --- | --- | --- |
| `birthDate` | string (YYYY-MM-DD) | Wajib, format valid, tahun 1900-2100 |
| `birthTime` | string (HH:MM) | Wajib, format valid 24h |
| `latitude` | number | Wajib, -90 to 90 |
| `longitude` | number | Wajib, -180 to 180 |
| `timezone` | string | Wajib, IANA timezone format |

## Response (sukses)

```json
{
  "ok": true,
  "humanDesign": {
    "type": "Manifesting Generator",
    "profile": "6/3",
    "authority": "Sacral",
    "strategy": "To Respond"
  },
  "vedic": {
    "rashi": "Libra",
    "nakshatra": "Chitra",
    "pada": 4,
    "nakshatraLord": "Mars",
    "mahadasha": "Saturn"
  },
  "meta": {
    "engineVersion": "1.0.0",
    "hdEngine": "existing-lib-human-design",
    "vedicEngine": "moon-only-lahiri-ayanamsa",
    "vedicStandard": "Lahiri Chitrapaksha ayanamsa, Vimshottari dasha"
  }
}
```

## Response (error)

```json
{
  "ok": false,
  "code": "INVALID_BIRTH_DATA",
  "message": "Data kelahiran belum lengkap atau tidak valid."
}
```

### Error codes

| Code | HTTP | Kondisi |
| --- | --- | --- |
| `MISSING_FIELDS` | 400 | Field wajib tidak ada |
| `INVALID_BIRTH_DATA` | 400 | Tanggal/jam/koordinat tidak valid |
| `UNSUPPORTED_MEDIA_TYPE` | 415 | Content-Type bukan application/json |
| `PAYLOAD_TOO_LARGE` | 413 | Body > 32KB |
| `ENGINE_CALCULATION_ERROR` | 500 | Gagal menghitung |
| `TIMEOUT` | 504 | Perhitungan melebihi batas waktu |

## Metadata

```json
{
  "engineVersion": "1.0.0",
  "hdEngine": "existing-lib-human-design",
  "vedicEngine": "moon-only-lahiri-ayanamsa",
  "vedicStandard": "Lahiri Chitrapaksha ayanamsa, Vimshottari dasha"
}
```

## Privacy

- Data tidak disimpan
- Data tidak masuk analytics
- Log hanya berisi status code
- Tidak ada third-party transfer
- Payload dibatasi 32KB
- Content-Type divalidasi
- Origin diperiksa sebagai lapisan tambahan
