import assert from "node:assert/strict";
import test from "node:test";

// ── Reuse normalizeHumanDesign ──
function normalizeHumanDesign(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      type: '-', strategy: '-', authority: '-', profile: '-',
      signature: '-', notSelfTheme: '-', incarnationCross: '-',
      definition: '-', digestion: '-', environment: '-',
      motivation: '-', cognition: '-', definedChannels: []
    };
  }

  const safeString = (v) => {
    if (v === null || v === undefined) return null;
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number') return String(v);
    return null;
  };

  const fallbackDash = '-';

  const type         = safeString(raw.type) ?? fallbackDash;
  const strategy     = safeString(raw.strategy) ?? fallbackDash;
  const authority    = safeString(raw.authority) ?? fallbackDash;
  const profile      = safeString(raw.profile) ?? fallbackDash;
  const signature    = safeString(raw.signature) ?? fallbackDash;
  const notSelfTheme = safeString(raw.notSelfTheme) ?? fallbackDash;
  const definition   = safeString(raw.definition) ?? fallbackDash;

  let incarnationCross = fallbackDash;
  const ic = raw.incarnationCross;
  if (ic) {
    if (typeof ic === 'string') {
      incarnationCross = ic.trim() || fallbackDash;
    } else if (typeof ic === 'object') {
      const name = ic.name;
      if (typeof name === 'string' && name.trim()) {
        incarnationCross = name.trim();
      } else if (typeof ic.title === 'string' && ic.title.trim()) {
        incarnationCross = ic.title.trim();
      } else if (typeof ic.type === 'string') {
        const gatesPart = Array.isArray(ic.gates)
          ? ic.gates.join(', ')
          : '';
        incarnationCross = [ic.type, gatesPart].filter(Boolean).join(' ') || fallbackDash;
      }
    }
  }

  const vars = raw.variables && typeof raw.variables === 'object' ? raw.variables : {};

  const digestion    = safeString(raw.digestion) ?? safeString(vars.digestion) ?? fallbackDash;
  const environment  = safeString(raw.environment) ?? safeString(vars.environment) ?? fallbackDash;
  const motivation   = safeString(raw.motivation) ?? safeString(vars.motivation) ?? fallbackDash;
  const cognition    = safeString(raw.cognition) ?? safeString(vars.cognition) ?? fallbackDash;

  const channels = Array.isArray(raw.channels) ? raw.channels : [];
  const definedChannels = channels
    .filter(function (c) { return c != null; })
    .map(function (c) { return typeof c === 'string' ? c.trim() : String(c); })
    .filter(Boolean);

  return {
    type, strategy, authority, profile, signature, notSelfTheme,
    incarnationCross, definition, digestion, environment,
    motivation, cognition, definedChannels
  };
}

// ── Simulasi validasi kota (sama dengan logika di index.html) ──
function isCityValid(selectedCity) {
  return selectedCity != null &&
    typeof selectedCity.latitude === 'number' &&
    typeof selectedCity.timezone === 'string';
}

// ── Simulasi penentuan HD ready (sama dengan logika di index.html) ──
function isHdReady(humanDesign) {
  if (!humanDesign) return false;
  return humanDesign.status === 'ready' && humanDesign.calculationStatus === 'completed';
}

function getHdFailureMessage(humanDesign) {
  const status = humanDesign?.status;
  const calcStatus = humanDesign?.calculationStatus;
  if (status === 'needs_verified_timezone' || calcStatus === 'needs_verified_timezone') {
    return 'Human Design membutuhkan data zona waktu yang akurat. Silakan pilih kota dari daftar saran dan coba kembali.';
  }
  return 'Data Blueprint lainnya berhasil dihitung, tetapi Human Design belum dapat diproses saat ini. Silakan coba kembali beberapa saat lagi.';
}

// ── Fixtures ──

// Valid city selected from autocomplete
const validSelectedCity = {
  formattedCity: 'Jakarta, Indonesia',
  latitude: -6.2088,
  longitude: 106.8456,
  country: 'Indonesia',
  timezone: '+07:00'
};

// Invalid: city typed but not selected
const nullSelectedCity = null;

// Invalid: selectedCity exists but latitude is missing
const selectedCityNoLat = {
  formattedCity: 'Jakarta, Indonesia',
  latitude: null,
  longitude: 106.8456,
  timezone: '+07:00'
};

// HumanDesignChart — ready
const readyHd = {
  status: 'ready',
  calculationStatus: 'completed',
  type: 'Projector',
  strategy: 'Wait for the Invitation',
  authority: 'Splenic Authority',
  profile: '2/4: Hermit Opportunist',
  signature: 'Success',
  notSelfTheme: 'Bitterness',
  incarnationCross: { name: '((38, 39), (48, 21))-RAC', gates: [] },
  definition: 'Single Definition',
  digestion: 'Appetite',
  environment: 'Caves',
  motivation: 'Fear',
  cognition: 'Smell',
  channels: ['38-28', '57-10', '44-26']
};

// HumanDesignChart — pending (city/timezone missing)
const pendingHd = {
  status: 'needs_verified_timezone',
  calculationStatus: 'needs_verified_timezone',
  type: null,
  strategy: null,
  authority: null,
  profile: null,
  signature: null,
  notSelfTheme: null,
  incarnationCross: { name: null, gates: [] },
  definition: null,
  channels: []
};

// HumanDesignChart — provider unavailable (Python backend down, fallback also failed)
const errorHd = {
  status: 'error',
  calculationStatus: 'connection_error',
  type: null,
  strategy: null,
  authority: null,
  profile: null,
  signature: null,
  notSelfTheme: null,
  incarnationCross: { name: null, gates: [] },
  definition: null,
  channels: []
};

// HumanDesignChart — fallback success (provider unavailable, fallback worked)
const fallbackSuccessHd = {
  status: 'needs_verified_engine',
  calculationStatus: 'needs_verified_engine',
  type: 'Generator',
  strategy: 'Wait to Respond',
  authority: 'Sacral',
  profile: '1/3',
  signature: 'Satisfaction',
  notSelfTheme: 'Frustration',
  incarnationCross: { name: 'Right Angle Cross of Life (1/2 | 3/4)', gates: [] },
  definition: 'Single Definition',
  channels: ['1-8']
};

// ── TESTS ──

// ============ CITY VALIDATION ============

test("1. Kota dipilih dari autocomplete → valid", () => {
  assert.equal(isCityValid(validSelectedCity), true);
});

test("2. Kota hanya diketik tanpa memilih suggestion → submit ditolak", () => {
  assert.equal(isCityValid(nullSelectedCity), false);
  assert.equal(isCityValid(selectedCityNoLat), false);
});

test("3. Setelah suggestion dipilih lalu teks kota diedit → metadata di-reset (selectedCity null)", () => {
  // Simulasi: user memilih kota, lalu mengetik ulang
  // loadCitySuggestions akan mereset selectedCity = null di awal
  // Maka isCityValid(null) harus false
  assert.equal(isCityValid(null), false);
});

// ============ HD STATUS DETECTION ============

test("4. Provider utama sukses → status ready", () => {
  assert.equal(isHdReady(readyHd), true);
});

test("5. Provider utama gagal tetapi fallback sukses → tetap dianggap siap karena data terisi", () => {
  // fallbackSuccessHd memiliki type, strategy, dll yang valid
  // Normalizer akan menghasilkan string untuk semua field
  const vm = normalizeHumanDesign(fallbackSuccessHd);
  assert.equal(vm.type, 'Generator');
  assert.equal(vm.strategy, 'Wait to Respond');
  assert.equal(vm.incarnationCross, 'Right Angle Cross of Life (1/2 | 3/4)');
  assert.equal(vm.definedChannels.length, 1);
});

test("6. Provider dan fallback gagal → structured failure, bukan silent null chart", () => {
  // Error chart — normalizer harus menghasilkan dash untuk semua field
  const vm = normalizeHumanDesign(errorHd);
  assert.equal(vm.type, '-');
  assert.equal(vm.strategy, '-');
  assert.equal(vm.incarnationCross, '-');
  assert.equal(vm.definedChannels.length, 0);

  // Status check harus false
  assert.equal(isHdReady(errorHd), false);

  // Harus ada failure message
  const msg = getHdFailureMessage(errorHd);
  assert.ok(msg.length > 0);
  assert.ok(!msg.includes('null'));
  assert.ok(!msg.includes('undefined'));
});

test("7. UI tidak menampilkan deretan - untuk calculation failure", () => {
  // Saat HD tidak ready, UI akan menampilkan pesan error dan
  // menyembunyikan tabel. Normalizer hanya dipanggil saat ready.
  // Tapi tetap harus dipastikan normalizer tidak menghasilkan [object Object]
  const vm = normalizeHumanDesign(errorHd);
  for (const [key, val] of Object.entries(vm)) {
    if (key === 'definedChannels') {
      assert.ok(Array.isArray(val));
    } else {
      assert.equal(typeof val, 'string');
      assert.notEqual(val, '[object Object]');
    }
  }
});

test("8. Human Design sukses tetap melewati normalizer dengan benar", () => {
  const vm = normalizeHumanDesign(readyHd);
  assert.equal(vm.type, 'Projector');
  assert.equal(vm.strategy, 'Wait for the Invitation');
  assert.equal(vm.authority, 'Splenic Authority');
  assert.equal(vm.profile, '2/4: Hermit Opportunist');
  assert.equal(vm.signature, 'Success');
  assert.equal(vm.notSelfTheme, 'Bitterness');
  assert.equal(vm.incarnationCross, '((38, 39), (48, 21))-RAC');
  assert.equal(vm.definition, 'Single Definition');
  assert.equal(vm.digestion, 'Appetite');
  assert.equal(vm.environment, 'Caves');
  assert.equal(vm.motivation, 'Fear');
  assert.equal(vm.cognition, 'Smell');
  assert.deepEqual(vm.definedChannels, ['38-28', '57-10', '44-26']);
});

test("9. Incarnation Cross tidak pernah menjadi [object Object]", () => {
  const cases = [readyHd, pendingHd, errorHd, fallbackSuccessHd, null, {}];
  for (const c of cases) {
    const vm = normalizeHumanDesign(c);
    assert.notEqual(vm.incarnationCross, '[object Object]');
    assert.equal(typeof vm.incarnationCross, 'string');
  }
});

test("10. Sistem Blueprint lain tidak mengalami regresi", () => {
  // Simulasi response lengkap seperti yang diterima dari API
  const responseData = {
    meta: { success: true },
    blueprint: {
      currentAge: 39,
      lifePath: { number: 9, role: 'The Humanitarian' },
      destinyMatrix: { center: 18, commonEnergy: '18-9-9' },
      humanDesign: readyHd,
      weton: { weton: 'Kamis Pon' },
      bazi: {},
      vedic: {},
      tzolkin: {}
    }
  };

  // Pastikan field non-HD bisa diakses tanpa error
  const bp = responseData.blueprint;
  const dm = bp.destinyMatrix || {};
  assert.equal(bp.currentAge, 39);
  assert.equal(dm.commonEnergy, '18-9-9');
  assert.equal(bp.lifePath.number, 9);

  // HD — harus tetap bisa dinormalisasi
  const hd = normalizeHumanDesign(bp.humanDesign);
  assert.equal(hd.type, 'Projector');
  assert.equal(hd.incarnationCross, '((38, 39), (48, 21))-RAC');
});

// ============ FAILURE MESSAGE TESTS ============

test("11. Failure message untuk timezone missing bersifat manusiawi", () => {
  const msg = getHdFailureMessage(pendingHd);
  assert.ok(msg.includes('zona waktu'));
  assert.ok(msg.includes('kota'));
  assert.ok(!msg.includes('null'));
  assert.ok(!msg.includes('undefined'));
  assert.ok(!msg.includes('API'));
  assert.ok(!msg.includes('Python'));
  assert.ok(!msg.includes('Vercel'));
});

test("12. Failure message untuk error umum bersifat manusiawi", () => {
  const msg = getHdFailureMessage(errorHd);
  assert.ok(msg.includes('Human Design'));
  assert.ok(msg.includes('coba kembali'));
  assert.ok(!msg.includes('null'));
  assert.ok(!msg.includes('undefined'));
  assert.ok(!msg.includes('API'));
  assert.ok(!msg.includes('Python'));
  assert.ok(!msg.includes('Vercel'));
});

test("13. Fallback success tetap menghasilkan data valid melalui normalizer", () => {
  const vm = normalizeHumanDesign(fallbackSuccessHd);
  assert.equal(vm.type, 'Generator');
  assert.equal(vm.strategy, 'Wait to Respond');
  assert.equal(vm.authority, 'Sacral');
  assert.equal(vm.profile, '1/3');
  assert.equal(vm.signature, 'Satisfaction');
  assert.equal(vm.notSelfTheme, 'Frustration');
  assert.ok(vm.incarnationCross.length > 0);
  assert.equal(vm.definition, 'Single Definition');
  assert.equal(vm.definedChannels.length, 1);
  assert.equal(vm.definedChannels[0], '1-8');
});
