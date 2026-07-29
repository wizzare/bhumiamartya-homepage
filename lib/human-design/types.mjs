export const HD_DEFAULTS = {
  type: null,
  strategy: null,
  authority: null,
  profile: null,
  definition: null,
  incarnationCross: null,
  signature: null,
  notSelfTheme: null,
  digestion: null,
  cognition: null,
  environment: null,
  motivation: null,
  perspective: null,
  variable: null,
  variableShortCode: null,
  gatesPersonality: [],
  gatesDesign: [],
  definedGates: [],
  personalityActivations: [],
  designActivations: [],
  centers: {
    head: null,
    ajna: null,
    throat: null,
    g: null,
    ego: null,
    spleen: null,
    sacral: null,
    solarPlexus: null,
    root: null,
  },
  definedCenters: [],
  openCenters: [],
  channels: [],
};

export const PLANET_ORDER = [
  "Sun", "Earth", "Moon", "North Node", "South Node",
  "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
  "Uranus", "Neptune", "Pluto",
];

export const ALL_CENTERS = [
  "head", "ajna", "throat", "g", "ego",
  "spleen", "sacral", "solarPlexus", "root",
];

export const CENTER_NAME_MAP = {
  head: "Head", ajna: "Ajna", throat: "Throat",
  g: "G", ego: "Ego", spleen: "Spleen",
  sacral: "Sacral", solarPlexus: "Solar Plexus", root: "Root",
};

export const STRATEGY_MAP = {
  Generator: "Wait to Respond",
  "Manifesting Generator": "Wait to Respond",
  Projector: "Wait for Invitation",
  Manifestor: "To Inform",
  Reflector: "Wait Lunar Cycle",
};

export const AUTHORITY_MAP = {
  Generator: "Sacral",
  "Manifesting Generator": "Sacral",
  Projector: "Spleen",
  Manifestor: "Solar Plexus",
  Reflector: "Lunar",
};

export const SIGNATURE_MAP = {
  Generator: "Satisfaction",
  "Manifesting Generator": "Satisfaction",
  Projector: "Success",
  Manifestor: "Peace",
  Reflector: "Surprise",
};

export const NOT_SELF_MAP = {
  Generator: "Frustration",
  "Manifesting Generator": "Frustration",
  Projector: "Bitterness",
  Manifestor: "Anger",
  Reflector: "Disillusionment",
};

export const DEFINITION_LABELS = {
  1: "Single Definition",
  2: "Split Definition",
  3: "Triple Split Definition",
  4: "Quadruple Split Definition",
};

export const CROSS_PREFIXES = {
  LAC: "Left Angle Cross",
  RAC: "Right Angle Cross",
  JXP: "Juxtaposition Cross",
};