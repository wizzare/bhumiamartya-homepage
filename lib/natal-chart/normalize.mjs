const REQUIRED_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

function withoutUndefined(value) {
  if (Array.isArray(value)) return value.map(withoutUndefined);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).filter(([, child]) => child !== undefined).map(([key, child]) => [key, withoutUndefined(child)]));
}

export function normalizeNatalChartResponse(raw) {
  if (!raw || raw.calculationStatus !== "completed") return { calculationStatus: "error", error: "Natal calculation did not complete." };
  for (const name of REQUIRED_PLANETS) {
    const planet = raw.planets?.[name];
    if (!planet || !Number.isFinite(planet.longitude) || !Number.isFinite(planet.degree) || !Number.isInteger(planet.house) || typeof planet.retrograde !== "boolean") throw new Error(`Invalid normalized planet: ${name}`);
  }
  const astrology = withoutUndefined({ ...raw, ascendant: raw.risingSign, placidusHouses: raw.houses });
  return astrology;
}
