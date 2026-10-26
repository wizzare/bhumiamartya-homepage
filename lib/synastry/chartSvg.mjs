/**
 * BHUMI AMARTYA - Synastry Bi-Wheel SVG Generator
 * Generates clean, accessible, vector SVG charts compatible with both web browsers and svg2pdf.js
 */

export const GEOMETRY = {
  viewBox: { width: 1000, height: 1000 },
  centerX: 500,
  centerY: 500,
  outerRadius: 470,
  zodiacInnerRadius: 405,
  zodiacLabelRadius: 436,
  synastry: {
    personBRadius: 365,
    personARadius: 305,
    aspectRadius: 235,
  }
};

export const SIGN_NAMES_SHORT = [
  "Ari", "Tau", "Gem", "Can", "Leo", "Vir",
  "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"
];

export const PLANET_SHORT = {
  Sun: "Su", Moon: "Mo", Mercury: "Me", Venus: "Ve", Mars: "Ma",
  Jupiter: "Ju", Saturn: "Sa", Uranus: "Ur", Neptune: "Ne", Pluto: "Pl",
  Ascendant: "ASC", Midheaven: "MC"
};

const ASPECT_COLORS = {
  Conjunction: "#D4AF37",
  Sextile: "#5FA8B8",
  Square: "#D84242",
  Trine: "#83BE58",
  Opposition: "#4F5E52",
};

const ASPECT_DASH = {
  Conjunction: "",
  Sextile: "6,4",
  Square: "",
  Trine: "4,4",
  Opposition: "8,4",
};

function normalizeLongitude(lon) {
  return ((lon % 360) + 360) % 360;
}

function longitudeToSvgAngle(lon) {
  return 180 - lon;
}

function svgDegToRad(deg) {
  return (deg * Math.PI) / 180;
}

function lonToXY(lon, radius, cx = GEOMETRY.centerX, cy = GEOMETRY.centerY) {
  const angleRad = svgDegToRad(longitudeToSvgAngle(lon));
  return {
    x: Number((cx + radius * Math.cos(angleRad)).toFixed(2)),
    y: Number((cy + radius * Math.sin(angleRad)).toFixed(2)),
  };
}

export function resolveCollisions(planets, radius, minSep = 7, maxShift = 14) {
  if (!planets || planets.length === 0) return [];
  const sorted = [...planets]
    .map(p => ({ ...p, lon: normalizeLongitude(p.longitude) }))
    .sort((a, b) => a.lon - b.lon);

  const clusters = [];
  let current = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const gap = sorted[i].lon - sorted[i - 1].lon;
    const sep = gap < 180 ? gap : 360 - gap;
    if (sep < minSep) {
      current.push(sorted[i]);
    } else {
      clusters.push(current);
      current = [sorted[i]];
    }
  }
  clusters.push(current);

  // Wrap-around 0 degrees
  if (clusters.length > 1) {
    const first = clusters[0];
    const last = clusters[clusters.length - 1];
    const wrapSep = (360 - last[last.length - 1].lon) + first[0].lon;
    if (wrapSep < minSep) {
      last.push(...first);
      clusters.shift();
    }
  }

  const result = [];
  for (const cluster of clusters) {
    const n = cluster.length;
    if (n === 1) {
      const p = cluster[0];
      const xy = lonToXY(p.lon, radius);
      result.push({
        ...p,
        displayLon: p.lon,
        x: xy.x,
        y: xy.y,
        trueXY: xy,
        isShifted: false
      });
      continue;
    }

    const firstLon = cluster[0].lon;
    let span = cluster[n - 1].lon - firstLon;
    if (span < 0) span += 360;
    const centerLon = normalizeLongitude(firstLon + span / 2);
    const halfSpan = Math.min((n * minSep) / 2, maxShift);

    for (let i = 0; i < n; i++) {
      const p = cluster[i];
      const offset = ((i / (n - 1)) * 2 - 1) * halfSpan;
      const displayLon = normalizeLongitude(centerLon + offset);
      const isShifted = Math.abs(offset) > 1.5;
      const xy = lonToXY(displayLon, radius + (isShifted ? (i % 2 === 0 ? 8 : -8) : 0));
      const trueXY = lonToXY(p.lon, radius);

      result.push({
        ...p,
        displayLon,
        x: xy.x,
        y: xy.y,
        trueXY,
        isShifted
      });
    }
  }

  return result;
}

export function buildSynastrySvgBiWheel(synastryResult, options = {}) {
  const { personA, personB, aspects } = synastryResult;
  const chartId = options.chartId || `synastry-${Math.random().toString(36).slice(2, 8)}`;
  const cx = GEOMETRY.centerX;
  const cy = GEOMETRY.centerY;
  const rOuter = GEOMETRY.outerRadius;
  const rZodiacInner = GEOMETRY.zodiacInnerRadius;
  const rPersonB = GEOMETRY.synastry.personBRadius;
  const rPersonA = GEOMETRY.synastry.personARadius;
  const rAspect = GEOMETRY.synastry.aspectRadius;

  const nameA = personA.input.name || "Pasangan 1";
  const nameB = personB.input.name || "Pasangan 2";

  // Planets with collision resolution
  const planetsA = resolveCollisions(Object.values(personA.planets), rPersonA);
  const planetsB = resolveCollisions(Object.values(personB.planets), rPersonB);

  // SVG Header & Defs
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="100%" height="auto" class="synastry-biwheel-svg" id="${chartId}" role="img" aria-label="Bagan Synastry Bi-Wheel ${nameA} & ${nameB}">\n`;
  svg += `  <defs>\n`;
  svg += `    <clipPath id="${chartId}-aspect-clip">\n`;
  svg += `      <circle cx="${cx}" cy="${cy}" r="${rAspect + 4}" />\n`;
  svg += `    </clipPath>\n`;
  svg += `  </defs>\n`;

  // Background circles
  svg += `  <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="#FFFFFF" stroke="#DED7CA" stroke-width="2" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="${rZodiacInner}" fill="#FAF7F0" stroke="#DED7CA" stroke-width="1.5" />\n`;

  // Zodiac Sectors (12 signs)
  SIGN_NAMES_SHORT.forEach((name, i) => {
    const startDeg = i * 30;
    const a0 = 180 - startDeg;
    const a1 = 180 - (startDeg + 30);
    const rad = d => (d * Math.PI) / 180;
    const p0 = { x: (cx + rOuter * Math.cos(rad(a0))).toFixed(2), y: (cy + rOuter * Math.sin(rad(a0))).toFixed(2) };
    const p1 = { x: (cx + rOuter * Math.cos(rad(a1))).toFixed(2), y: (cy + rOuter * Math.sin(rad(a1))).toFixed(2) };
    const pi = { x: (cx + rZodiacInner * Math.cos(rad(a0))).toFixed(2), y: (cy + rZodiacInner * Math.sin(rad(a0))).toFixed(2) };
    const pj = { x: (cx + rZodiacInner * Math.cos(rad(a1))).toFixed(2), y: (cy + rZodiacInner * Math.sin(rad(a1))).toFixed(2) };
    const midXY = lonToXY(startDeg + 15, GEOMETRY.zodiacLabelRadius, cx, cy);
    const fill = i % 2 === 0 ? "#FCFAF5" : "#F5F1E8";

    svg += `  <path d="M ${p0.x} ${p0.y} A ${rOuter} ${rOuter} 0 0 0 ${p1.x} ${p1.y} L ${pj.x} ${pj.y} A ${rZodiacInner} ${rZodiacInner} 0 0 1 ${pi.x} ${pi.y} Z" fill="${fill}" stroke="#DED7CA" stroke-width="0.8" />\n`;
    svg += `  <text x="${midXY.x}" y="${midXY.y}" text-anchor="middle" dominant-baseline="central" fill="#5F6D5E" font-size="14" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600">${name}</text>\n`;
  });

  // Track guides
  svg += `  <circle cx="${cx}" cy="${cy}" r="${rPersonB}" fill="none" stroke="#DED7CA" stroke-width="1" stroke-dasharray="3,3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="${rPersonA}" fill="none" stroke="#DED7CA" stroke-width="1" stroke-dasharray="3,3" />\n`;
  svg += `  <circle cx="${cx}" cy="${cy}" r="${rAspect}" fill="#FFFFFF" stroke="#C5A880" stroke-width="1.5" />\n`;

  // Aspect Lines (inside inner circle)
  svg += `  <g clip-path="url(#${chartId}-aspect-clip)">\n`;
  const drawnAspects = (aspects || []).slice(0, 36); // draw top significant aspects
  for (const a of drawnAspects) {
    const ptA = lonToXY(a.planetALon, rAspect, cx, cy);
    const ptB = lonToXY(a.planetBLon, rAspect, cx, cy);
    const color = ASPECT_COLORS[a.type] || "#888888";
    const dash = ASPECT_DASH[a.type] ? `stroke-dasharray="${ASPECT_DASH[a.type]}"` : "";
    const opacity = Math.max(0.3, 1 - a.orb / 9).toFixed(2);
    svg += `    <line x1="${ptA.x}" y1="${ptA.y}" x2="${ptB.x}" y2="${ptB.y}" stroke="${color}" stroke-width="1.6" opacity="${opacity}" ${dash} />\n`;
  }
  svg += `  </g>\n`;

  // Person A Planets (Inner Ring, Deep Forest Green #2D4B34)
  svg += `  <g id="person-a-planets">\n`;
  for (const p of planetsA) {
    if (p.isShifted) {
      svg += `    <line x1="${p.trueXY.x}" y1="${p.trueXY.y}" x2="${p.x}" y2="${p.y}" stroke="#B8BDB6" stroke-width="1" />\n`;
    }
    svg += `    <circle cx="${p.trueXY.x}" cy="${p.trueXY.y}" r="3.5" fill="#2D4B34" />\n`;
    svg += `    <circle cx="${p.x}" cy="${p.y}" r="11" fill="#FFFFFF" stroke="#2D4B34" stroke-width="1.2" />\n`;
    svg += `    <text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" fill="#2D4B34" font-size="10" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700">${PLANET_SHORT[p.name] || p.name.slice(0, 2)}${p.retrograde ? "℞" : ""}</text>\n`;
  }
  svg += `  </g>\n`;

  // Person B Planets (Outer Ring, Terra Cotta / Rose Gold #9A5F78)
  svg += `  <g id="person-b-planets">\n`;
  for (const p of planetsB) {
    if (p.isShifted) {
      svg += `    <line x1="${p.trueXY.x}" y1="${p.trueXY.y}" x2="${p.x}" y2="${p.y}" stroke="#B8BDB6" stroke-width="1" />\n`;
    }
    svg += `    <circle cx="${p.trueXY.x}" cy="${p.trueXY.y}" r="3.5" fill="#9A5F78" />\n`;
    svg += `    <circle cx="${p.x}" cy="${p.y}" r="11" fill="#FFFFFF" stroke="#9A5F78" stroke-width="1.2" />\n`;
    svg += `    <text x="${p.x}" y="${p.y}" text-anchor="middle" dominant-baseline="central" fill="#9A5F78" font-size="10" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700">${PLANET_SHORT[p.name] || p.name.slice(0, 2)}${p.retrograde ? "℞" : ""}</text>\n`;
  }
  svg += `  </g>\n`;

  // Center Badge
  svg += `  <circle cx="${cx}" cy="${cy}" r="45" fill="#FAF7F0" stroke="#C5A880" stroke-width="1.5" />\n`;
  svg += `  <text x="${cx}" y="${cy - 8}" text-anchor="middle" dominant-baseline="central" fill="#2D4B34" font-size="12" font-family="'Cormorant Garamond', serif" font-weight="700">SYNASTRY</text>\n`;
  svg += `  <text x="${cx}" y="${cy + 10}" text-anchor="middle" dominant-baseline="central" fill="#C5A880" font-size="9" font-family="'Plus Jakarta Sans', sans-serif" font-weight="700">BHUMI</text>\n`;

  svg += `</svg>`;
  return svg;
}
