/*
 * Bhumi Relationship Signals — shared deterministic module (v1)
 * Pure, dependency-free. Used by kalkulator-cinta (website-side).
 * Calculates six identity signals + a 5-category relationship classifier
 * using the calibrated Phase-3 model. No synthesis-text keyword matching.
 *
 * All calc functions are ported verbatim from the Phase-3 calibration harness
 * (design_cinta_model.mjs) so the website and the calibration spec agree.
 *
 * ponytail: tes-kenali-diri still has its own inline copies of these same six
 * calc functions; consolidate onto this module in a separate change (it has an
 * in-progress feature branch with 300+ pending edits — do not entangle here).
 */
(function (global) {
    'use strict';

    // ======== verbatim pure calc functions (Phase-3 calibration source of truth) ========
    const sumDigits = (v) => String(v).split('').reduce((s, d) => s + Number(d), 0);
    const reduceLifePath = (v) => {
        if ([11, 22, 33].includes(v)) return v;
        let t = sumDigits(v);
        while (t > 9) { if ([11, 22, 33].includes(t)) return t; t = sumDigits(t); }
        return t;
    };
    const reduceDestiny = (v) => { if (v > 22) return (v % 10) + Math.floor(v / 10); return v === 0 ? 22 : v; };
    const positiveModulo = (v, d) => ((v % d) + d) % d;
    const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];
    const daysBetween = (date, anchor) => {
        const a = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        const b = Date.UTC(anchor.getFullYear(), anchor.getMonth(), anchor.getDate());
        return Math.round((a - b) / 86400000);
    };
    const wetonName = (dateStr, birthtime) => {
        const effective = new Date(dateStr);
        if (birthtime) { const h = Number(birthtime.split(':')[0]); if (h >= 18) effective.setDate(effective.getDate() + 1); }
        const idx = positiveModulo(daysBetween(effective, new Date(2020, 6, 5)), 5);
        return `${HARI[effective.getDay()]} ${PASARAN[idx]}`;
    };
    const calculateLifePathNumber = (birthdate) => {
        const [y, m, d] = birthdate.split('-');
        return reduceLifePath(reduceLifePath(Number(m)) + reduceLifePath(Number(d)) + reduceLifePath(sumDigits(y)));
    };
    const calculateArcanaCenter = (y, m, d) => {
        const a = reduceDestiny(d); const b = m; const c = reduceDestiny(sumDigits(y));
        return reduceDestiny(a + b + c + reduceDestiny(a + b + c));
    };
    const BAZI_STEMS = [
        { element: 'Kayu' }, { element: 'Kayu' }, { element: 'Api' }, { element: 'Api' },
        { element: 'Tanah' }, { element: 'Tanah' }, { element: 'Logam' }, { element: 'Logam' },
        { element: 'Air' }, { element: 'Air' }
    ];
    const julianDayNumber = (y, m, d) => {
        let yy = y, mm = m; if (mm <= 2) { yy -= 1; mm += 12; }
        const aa = Math.floor(yy / 100); const bb = 2 - aa + Math.floor(aa / 4);
        return Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + bb - 1524;
    };
    const calculateBaziElement = (y, m, d, birthtime) => {
        if (!birthtime) return null;
        const h = Number(birthtime.split(':')[0]);
        const eff = new Date(Date.UTC(y, m - 1, d + (h >= 23 ? 1 : 0)));
        const dc = positiveModulo(julianDayNumber(eff.getUTCFullYear(), eff.getUTCMonth() + 1, eff.getUTCDate()) + 48, 60);
        return BAZI_STEMS[dc % 10].element;
    };
    const sunSign = (m, d) => {
        const z = [['Capricorn', 120], ['Aquarius', 219], ['Pisces', 321], ['Aries', 420], ['Taurus', 521],
            ['Gemini', 621], ['Cancer', 723], ['Leo', 823], ['Virgo', 923], ['Libra', 1023], ['Scorpio', 1122], ['Sagittarius', 1222], ['Capricorn', 1232]];
        return z.find((i) => (m * 100 + d) < i[1])[0];
    };
    const tzolkinIdentity = (birthdate) => {
        const [y, m, d] = birthdate.split('-').map(Number);
        let dy = m < 7 || (m === 7 && d < 26) ? y - 1 : y;
        let base = (34 + (dy - 1987) * 105) % 260; if (base <= 0) base += 260;
        const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        const doy = m === 2 && d === 29 ? monthDays.slice(0, 1).reduce((s, v) => s + v, 0) + 28 : monthDays.slice(0, m - 1).reduce((s, v) => s + v, 0) + d;
        const ds = dy === y ? doy - 207 : 158 + doy;
        return ((base + ds - 1) % 260) + 1; // kin number 1-260
    };

    // ======== shared symbolic tables ========
    const SUN_ELEMENT = { Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire', Taurus: 'Earth', Virgo: 'Earth',
        Capricorn: 'Earth', Gemini: 'Air', Libra: 'Air', Aquarius: 'Air', Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water' };
    const SUN_OPPOSITE = { Aries: 'Libra', Libra: 'Aries', Taurus: 'Scorpio', Scorpio: 'Taurus', Gemini: 'Sagittarius',
        Sagittarius: 'Gemini', Cancer: 'Capricorn', Capricorn: 'Cancer', Leo: 'Aquarius', Aquarius: 'Leo', Virgo: 'Pisces', Pisces: 'Virgo' };
    const WETON_NEPTU = { Legi: 5, Pahing: 9, Pon: 7, Wage: 8, Kliwon: 4 };

    // ======== helper sub-functions ========
    const LP_FRIENDLY = new Set(['1-5', '2-4', '3-6', '5-7', '6-9', '7-11', '8-22', '9-3', '4-22', '2-11']);
    const LP_TENSION = new Set(['1-4', '1-8', '2-5', '3-7', '4-8', '5-9', '6-7']);
    const lpKey = (a, b) => [Math.min(a, b), Math.max(a, b)].join('-');
    const lpClose = (a, b) => a === b || LP_FRIENDLY.has(lpKey(a, b));
    const lpTension = (a, b) => LP_TENSION.has(lpKey(a, b));
    const ELEMENT_CYCLE = ['Kayu', 'Api', 'Tanah', 'Logam', 'Air'];
    const wetonRes = (wA, wB) => {
        const pA = wA.split(' ')[1], pB = wB.split(' ')[1];
        if (pA === pB) return 0.9;
        const s = WETON_NEPTU[pA] + WETON_NEPTU[pB];
        return [9, 18, 27].includes(s) ? 0.6 : ([12, 15, 21].includes(s) ? 0.1 : 0.4);
    };
    const bzRes = (eA, eB) => { if (!eA || !eB) return 0.5; if (eA === eB) return 0.9; const iA = ELEMENT_CYCLE.indexOf(eA), iB = ELEMENT_CYCLE.indexOf(eB); return (iA + 1) % 5 === iB ? 0.7 : ((iA + 2) % 5 === iB || (iB + 2) % 5 === iA) ? 0.3 : 0.5; };
    const bzControl = (eA, eB) => { if (!eA || !eB) return 0.5; if (eA === eB) return 0; const iA = ELEMENT_CYCLE.indexOf(eA), iB = ELEMENT_CYCLE.indexOf(eB); return ((iA + 2) % 5 === iB || ((iB + 2) % 5 === iA)) ? 1 : 0.5; };

    // ======== calibrated sub-scores ========
    const calcR = (sunA, sunB, arcA, arcB, lpA, lpB, wA, wB, bzA, bzB, avail) => {
        const R_sun = sunA === sunB ? 1 : (SUN_ELEMENT[sunA] === SUN_ELEMENT[sunB] ? 0.6 : 0.4);
        const R_arc = 1 - Math.min(Math.abs(arcA - arcB), 21) / 21;
        const R_lp = lpA === lpB ? 0.85 : (lpClose(lpA, lpB) ? 0.75 : (lpTension(lpA, lpB) ? 0.25 : (Math.abs(lpA - lpB) <= 3 ? 0.55 : 0.4)));
        const R_wet = wetonRes(wA, wB);
        const R_bz = bzRes(bzA, bzB);
        const weights = { sun: 0.20, arc: 0.20, lp: 0.25, wet: 0.15, bz: 0.20 };
        let num = 0, den = 0;
        for (const [k, v] of Object.entries(weights)) {
            if (!avail[k]) continue;
            const rv = k === 'sun' ? R_sun : k === 'arc' ? R_arc : k === 'lp' ? R_lp : k === 'wet' ? R_wet : R_bz;
            num += v * rv; den += v;
        }
        return den > 0 ? num / den : 0.5;
    };

    const calcC = (sunA, sunB, wA, wB, bzA, bzB, lpA, lpB, avail) => {
        const sameElement = SUN_ELEMENT[sunA] === SUN_ELEMENT[sunB];
        const C_sun = (sameElement || sunA === sunB) ? 0 : (SUN_OPPOSITE[sunA] === sunB ? 1 : 0.5);
        const wrA = WETON_NEPTU[wA.split(' ')[1]], wrB = WETON_NEPTU[wB.split(' ')[1]];
        const wSum = wrA + wrB;
        const C_wet = [12, 15, 21].includes(wSum) ? 1 : ([9, 18, 27].includes(wSum) ? 0 : (wA === wB ? 0 : 0.5));
        const C_bz = bzControl(bzA, bzB);
        const C_lp = lpTension(lpA, lpB) ? 0.8 : (lpClose(lpA, lpB) ? 0.1 : 0.4);
        const weights = { sun: 0.25, wet: 0.25, bz: 0.25, lp: 0.25 };
        let num = 0, den = 0;
        for (const [k, v] of Object.entries(weights)) {
            if (!avail[k]) continue;
            const cv = k === 'sun' ? C_sun : k === 'wet' ? C_wet : k === 'bz' ? C_bz : C_lp;
            num += v * cv; den += v;
        }
        return den > 0 ? num / den : 0.5;
    };

    const calcI = (lpA, lpB, wA, wB, sunA, sunB, avail) => {
        const parts = [];
        if (avail.wet) parts.push([0.5, wA === wB ? 1 : 0]);
        if (avail.lp) parts.push([0.3, lpA === lpB ? 1 : (([11, 22, 33].includes(lpA) || [11, 22, 33].includes(lpB)) ? 0.6 : 0)]);
        if (avail.sun) parts.push([0.2, SUN_OPPOSITE[sunA] === sunB ? 1 : 0]);
        let num = 0, den = 0;
        for (const [w, v] of parts) { num += w * v; den += w; }
        return den > 0 ? num / den : 0;
    };

    const calcMirror = (lpA, lpB, arcA, arcB, sunA, sunB, bzA, bzB, kinA, kinB, avail) => {
        const sameLP = lpA === lpB ? 1 : (lpClose(lpA, lpB) ? 0.5 : 0);
        const sameArc = arcA === arcB ? 1 : (Math.abs(arcA - arcB) <= 2 ? 0.5 : 0);
        const sameSunEl = SUN_ELEMENT[sunA] === SUN_ELEMENT[sunB] ? 1 : 0;
        const sameBz = bzA === bzB && bzA ? 1 : 0;
        const kinNear = Math.abs(kinA - kinB) <= 10 || Math.abs(kinA - kinB) >= 250 ? 1 : 0;
        let num = 0, den = 0;
        const w = { lp: 0.30, arc: 0.30, sunEl: 0.20, bz: 0.10, kin: 0.10 };
        for (const [k, v] of Object.entries(w)) {
            const sig = k === 'lp' ? sameLP : k === 'arc' ? sameArc : k === 'sunEl' ? sameSunEl : k === 'bz' ? sameBz : kinNear;
            if (!avail[k]) continue;
            num += v * sig; den += v;
        }
        return den > 0 ? num / den : 0;
    };

    const confLabel = (c) => c >= 0.80 ? 'Very Strong Pattern' : c >= 0.65 ? 'Strong Pattern' : c >= 0.50 ? 'Moderate Pattern' : 'Emerging Pattern';

    // ======== public: compute one person's six signals ========
    // person: { birthDate: 'YYYY-MM-DD', birthTime: 'HH:MM' | '' | undefined }
    const computePersonSignals = (person) => {
        const [y, m, d] = String(person.birthDate).split('-').map(Number);
        const t = person.birthTime || '';
        const sun = sunSign(m, d);
        const weton = wetonName(`${y}-${m}-${d}`, t);
        const lifePath = calculateLifePathNumber(`${y}-${m}-${d}`);
        const arcanaCenter = calculateArcanaCenter(y, m, d);
        const bazi = calculateBaziElement(y, m, d, t);
        const tzolkin = tzolkinIdentity(`${y}-${m}-${d}`);
        return { sun, weton, lifePath, arcanaCenter, bazi, tzolkin };
    };

    // ======== public: classify a relationship (pure, deterministic) ========
    // Returns { primary, secondary, conf, confLabel, R, C, I, M, signals, personA, personB }
    const classifyRelationship = (personA, personB) => {
        const a = computePersonSignals(personA);
        const b = computePersonSignals(personB);

        const sunA = a.sun, sunB = b.sun;
        const wA = a.weton, wB = b.weton;
        const lpA = a.lifePath, lpB = b.lifePath;
        const arcA = a.arcanaCenter, arcB = b.arcanaCenter;
        const bzA = a.bazi, bzB = b.bazi;
        const kinA = a.tzolkin, kinB = b.tzolkin;

        const hasAtime = Boolean(personA.birthTime);
        const hasBtime = Boolean(personB.birthTime);
        const avail = { sun: true, arc: true, lp: true, wet: hasAtime && hasBtime, bz: hasAtime && hasBtime, kin: true };
        const signalCount = Object.values(avail).filter(Boolean).length;

        const R = calcR(sunA, sunB, arcA, arcB, lpA, lpB, wA, wB, bzA, bzB, avail);
        const C = calcC(sunA, sunB, wA, wB, bzA, bzB, lpA, lpB, avail);
        const I = calcI(lpA, lpB, wA, wB, sunA, sunB, avail);
        const M = calcMirror(lpA, lpB, arcA, arcB, sunA, sunB, bzA, bzB, kinA, kinB, avail);

        const soul = Math.min(0.85, R * (1 - C) * 1.2);
        const karm = Math.min(0.85, C * (1 - 0.4 * R) * 1.2);
        const inKSband = (R >= 0.30 && R <= 0.88 && C >= 0.20 && C <= 0.72);
        const ksou = inKSband ? Math.min(0.62, R * C * 1.5) : 0;
        const tflame = (R >= 0.50 && C >= 0.40 && I >= 0.30) ? Math.min(0.90, R * C * I * 4.5) : 0;
        const tsoul = (R >= 0.55 && M >= 0.80 && I >= 0.20) ? Math.min(0.95, M * (0.5 + 0.5 * R) * I * 4.5) : 0;

        const cats = { Soulmate: soul, Karmic: karm, 'Karmic Soulmate': ksou, 'Twin Flame': tflame, 'Twin Soul': tsoul };
        const entries = Object.entries(cats).sort((x, y) => y[1] - x[1]);
        const [primary, pScore] = entries[0];
        const [, sScore] = entries[1];

        const scoreMax = Math.max(...Object.values(cats));
        const secondRatio = scoreMax > 0 ? sScore / scoreMax : 0;
        const clarity = 1 - secondRatio;
        const dataFactor = signalCount / 6;
        const rawConf = Math.min(1, scoreMax * 1.5) * (0.65 + 0.35 * clarity) * (0.80 + 0.20 * dataFactor);
        const conf = Math.max(0.35, Math.min(0.95, rawConf));
        const secondary = secondRatio >= 0.45 ? entries[1][0] : null;

        return {
            primary,
            secondary,
            conf: +conf.toFixed(3),
            confLabel: confLabel(conf),
            R: +R.toFixed(2),
            C: +C.toFixed(2),
            I: +I.toFixed(2),
            M: +M.toFixed(2),
            signals: signalCount,
            personA: a,
            personB: b
        };
    };

    global.BhumiRelationship = { computePersonSignals, classifyRelationship, confLabel };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = global.BhumiRelationship;
    }
})(typeof window !== 'undefined' ? window : globalThis);
