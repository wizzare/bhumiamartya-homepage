import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Single Source of Truth: shared Arcana Dictionary JSON
const primaryPath = join(__dirname, "../../bhumi-amartya-clean/lib/data/destinyMatrixArcanaDictionary.json");
const localPath = join(__dirname, "./destinyMatrixArcanaDictionary.json");

const jsonPath = existsSync(primaryPath) ? primaryPath : localPath;

export const destinyMatrixArcanaDictionary = JSON.parse(readFileSync(jsonPath, "utf-8"));

export const ARCANA_NAMES = Object.freeze(
  Object.fromEntries(
    Object.values(destinyMatrixArcanaDictionary).map((entry) => [Number(entry.id), entry.name])
  )
);
