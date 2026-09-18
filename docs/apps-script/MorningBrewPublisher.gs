/**
 * Morning Brew Auto-Publisher — Google Apps Script (production)
 *
 * Flow: Gemini Spark (05:00 WIB) -> Google Drive -> this script (~05:30 WIB)
 *       -> POST https://bhumiamartya.my.id/api/content/morning-brew -> published article.
 *
 * SETUP (one time, ~5 steps):
 *   1. script.google.com -> New project -> paste this whole file in, replacing the default.
 *   2. Set the secret via Script Properties (see "SETUP SECRET" section below for the two
 *      ways to do this) — never hardcode it in source.
 *   3. Run `testConnection()` once from the editor toolbar (sends dryRun:true — no article
 *      is created). Accept the Drive + external-request authorization prompt the first time.
 *   4. Run `createDailyTrigger()` once to install the ~05:30 WIB daily trigger.
 *   5. (Optional) Run `showTodayStatus()` any time to sanity-check configuration.
 *
 * Everything needed is in CONFIG below. Nothing here is a secret except the one-time
 * secret-setup step, which stores the value in PropertiesService (never in source, never
 * logged, never printed by showTodayStatus()).
 */

const CONFIG = {
  FOLDER_ID: '1Vm8kFWCJZuVmERtnHmi3_bleN8QQvNU0',
  API_URL: 'https://bhumiamartya.my.id/api/content/morning-brew',
  TIMEZONE: 'Asia/Jakarta',
  // Expected file name: "Morning Brew - YYYY-MM-DD". File lookup also has a conservative
  // fallback (see findTodaysFile_) for slightly different naming from Gemini Spark.
  FILE_NAME_PREFIX: 'Morning Brew - ',
  FILE_NAME_MARKER: 'morning brew',
  SOURCE_LABEL: 'google-drive',
  TRIGGER_HOUR: 5,
  TRIGGER_MINUTE: 30
};

const SECRET_PROPERTY_KEY = 'MORNING_BREW_PUBLISH_SECRET';

// ---------------------------------------------------------------------------
// SETUP SECRET
// ---------------------------------------------------------------------------
// Preferred method: Apps Script editor -> Project Settings (gear icon) -> Script
// Properties -> "Add script property" -> name MORNING_BREW_PUBLISH_SECRET, value =
// the secret from Vercel's MORNING_BREW_PUBLISH_SECRET env var. This never puts the
// secret in source at all.
//
// Alternative (if you'd rather run a function): paste the secret into secretValue
// below, run setPublishSecretOnce() once from the function picker, then IMMEDIATELY
// delete the literal value from this line and save again.
function setPublishSecretOnce() {
  const secretValue = 'PASTE_SECRET_TEMPORARILY_HERE';
  if (secretValue === 'PASTE_SECRET_TEMPORARILY_HERE') {
    throw new Error('Ganti secretValue dengan secret asli sebelum menjalankan setPublishSecretOnce().');
  }
  PropertiesService.getScriptProperties().setProperty(SECRET_PROPERTY_KEY, secretValue);
  Logger.log('Secret tersimpan di Script Properties. Sekarang hapus nilai literal di atas dan save ulang.');
}

function getPublishSecret_() {
  return PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY_KEY);
}

function requirePublishSecret_() {
  const secret = getPublishSecret_();
  if (!secret) {
    throw new Error('MORNING_BREW_PUBLISH_SECRET belum di-set. Isi lewat Script Properties atau jalankan setPublishSecretOnce().');
  }
  return secret;
}

// ---------------------------------------------------------------------------
// Date / property helpers
// ---------------------------------------------------------------------------

function todayJakartaDateString_() {
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd');
}

function publishedPropertyKey_(dateString) {
  return `PUBLISHED_MORNING_BREW_${dateString.replace(/-/g, '_')}`;
}

function isMarkedPublished_(dateString) {
  return PropertiesService.getScriptProperties().getProperty(publishedPropertyKey_(dateString)) === 'true';
}

function markPublished_(dateString) {
  PropertiesService.getScriptProperties().setProperty(publishedPropertyKey_(dateString), 'true');
}

// ---------------------------------------------------------------------------
// File discovery — TODAY only, never "latest file", never yesterday's.
// ---------------------------------------------------------------------------

/**
 * 1) Fast path: exact name match "Morning Brew - YYYY-MM-DD".
 * 2) Conservative fallback: scan the folder for a file whose name contains BOTH the
 *    "morning brew" marker AND today's exact YYYY-MM-DD date (case-insensitive), in case
 *    Gemini Spark's naming drifts slightly. Requiring both avoids matching an unrelated
 *    file that merely happens to contain today's date.
 * If neither matches, returns null — never falls back to yesterday's or "the newest" file.
 */
function findTodaysFile_(dateString) {
  const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
  const expectedName = `${CONFIG.FILE_NAME_PREFIX}${dateString}`;

  const exact = folder.getFilesByName(expectedName);
  if (exact.hasNext()) return exact.next();

  const all = folder.getFiles();
  while (all.hasNext()) {
    const file = all.next();
    const nameLower = file.getName().toLowerCase();
    if (nameLower.indexOf(CONFIG.FILE_NAME_MARKER) !== -1 && nameLower.indexOf(dateString) !== -1) {
      return file;
    }
  }
  return null;
}

/** Reads a Drive file's text content. Prioritizes Google Docs; falls back to plain text/blob. */
function readFileContent_(file) {
  if (file.getMimeType() === MimeType.GOOGLE_DOCS) {
    const doc = DocumentApp.openById(file.getId());
    return { text: doc.getBody().getText(), doc };
  }
  try {
    return { text: file.getBlob().getDataAsString('UTF-8'), doc: null };
  } catch (err) {
    throw new Error(`Tidak bisa membaca isi file "${file.getName()}": ${err}`);
  }
}

/**
 * Title priority (conservative — never removes anything from the content that gets sent):
 *   1. First heading-style paragraph (Title/Heading 1/Heading 2) in the Google Doc, if any.
 *   2. If the very first paragraph is plain text, short (<=100 chars), doesn't end with
 *      sentence punctuation (. ! ?), and the doc has more than one paragraph, treat it as a
 *      conservative title candidate (looks like a title, not a sentence).
 *   3. File name with the "Morning Brew - YYYY-MM-DD" prefix stripped.
 *   4. Raw file name.
 * The full document text is always sent as `content` unchanged — title detection never
 * trims or removes the first paragraph from it.
 */
function resolveTitle_(file, doc, dateString) {
  if (doc) {
    const paragraphs = doc.getBody().getParagraphs();
    for (const p of paragraphs) {
      const heading = p.getHeading();
      const text = p.getText().trim();
      if (!text) continue;
      const isHeading = heading === DocumentApp.ParagraphHeading.TITLE
        || heading === DocumentApp.ParagraphHeading.HEADING1
        || heading === DocumentApp.ParagraphHeading.HEADING2;
      if (isHeading) return text;
      break; // only the first non-empty paragraph is eligible for the heuristics below
    }

    const firstParagraphText = paragraphs.map((p) => p.getText().trim()).find((t) => t.length > 0);
    if (firstParagraphText && paragraphs.length > 1 && firstParagraphText.length <= 100
      && !/[.!?]$/.test(firstParagraphText)) {
      return firstParagraphText;
    }
  }

  const name = file.getName();
  const exactPrefixedName = `${CONFIG.FILE_NAME_PREFIX}${dateString}`;
  if (name === exactPrefixedName) return `Morning Brew ${dateString}`;
  const stripped = name.replace(/^Morning Brew\s*-\s*/i, '').trim();
  return stripped || name;
}

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------

function postToApi_(payload) {
  const response = UrlFetchApp.fetch(CONFIG.API_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${requirePublishSecret_()}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  const bodyText = response.getContentText();
  let parsed = null;
  try {
    parsed = JSON.parse(bodyText);
  } catch (err) {
    // leave parsed as null; raw body is still logged/thrown below
  }
  return { status, bodyText, parsed };
}

function describeFailure_(status, bodyText) {
  if (status === 401 || status === 403) {
    return `Auth ditolak (HTTP ${status}) — secret salah atau belum dipasang di Script Properties / Vercel. Response: ${bodyText}`;
  }
  if (status === 503) {
    return `Server unavailable (HTTP 503) — kemungkinan masalah permission Firestore (service account belum punya write access) atau konfigurasi GCP env var. Response: ${bodyText}`;
  }
  if (status === 400) {
    return `Payload ditolak (HTTP 400) — cek title/content/date. Response: ${bodyText}`;
  }
  return `Publish gagal (HTTP ${status}). Response: ${bodyText}`;
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

/**
 * Manual connectivity/auth test — sends dryRun:true so the API validates the secret and
 * payload WITHOUT creating a Firestore document. Safe to run any time. Throws on failure
 * so the Apps Script execution log clearly shows red/failed.
 */
function testConnection() {
  const dateString = todayJakartaDateString_();
  const { status, bodyText, parsed } = postToApi_({
    title: 'Morning Brew Connection Test',
    content: 'Connection test only.',
    date: dateString,
    source: CONFIG.SOURCE_LABEL,
    dryRun: true
  });

  if (status === 200 && parsed && parsed.success) {
    Logger.log(`[testConnection] OK. status=${status} response=${bodyText}`);
    return;
  }
  Logger.log(`[testConnection] FAILED. ${describeFailure_(status, bodyText)}`);
  throw new Error(describeFailure_(status, bodyText));
}

/**
 * Main entry point — run manually or via the daily trigger.
 * Never publishes yesterday's content: if today's file isn't found, it logs and exits
 * WITHOUT throwing (this is an expected, non-error state most mornings before the file
 * lands). Any real API failure DOES throw, after logging full detail, so it doesn't get
 * marked published and the trigger's failure is visible.
 */
function publishMorningBrew() {
  const dateString = todayJakartaDateString_();

  if (isMarkedPublished_(dateString)) {
    Logger.log(`Morning Brew ${dateString} sudah ditandai published sebelumnya. Skip. (Gunakan forcePublishMorningBrew() untuk memaksa publish ulang.)`);
    return;
  }

  const file = findTodaysFile_(dateString);
  if (!file) {
    Logger.log(`Morning Brew ${dateString} belum ditemukan.`);
    return;
  }

  const { text, doc } = readFileContent_(file);
  const content = (text || '').trim();
  if (!content) {
    Logger.log(`Morning Brew ${dateString} ditemukan (file: "${file.getName()}") tapi isinya kosong. Skip, tidak dipublish.`);
    return;
  }

  const title = resolveTitle_(file, doc, dateString);

  const { status, bodyText, parsed } = postToApi_({
    title,
    content,
    date: dateString,
    source: CONFIG.SOURCE_LABEL
  });

  if ((status === 200 || status === 201) && parsed && parsed.success) {
    markPublished_(dateString);
    Logger.log(`Morning Brew ${dateString} publish OK. file="${file.getName()}" apiStatus=${parsed.status} slug=${parsed.slug}`);
    return;
  }

  // Not marked published, Drive file untouched — safe to retry (trigger or manual rerun).
  const message = describeFailure_(status, bodyText);
  Logger.log(`Morning Brew ${dateString} publish GAGAL. file="${file.getName()}" ${message}`);
  throw new Error(message);
}

/**
 * Forces a re-publish attempt for today even if already marked published locally
 * (e.g. after fixing a bad title/content upstream). The website's own anti-duplicate
 * (doc id = morning-brew-<date>) is still authoritative: if the article already exists
 * there, the API returns "already_published" and nothing is duplicated.
 */
function forcePublishMorningBrew() {
  const dateString = todayJakartaDateString_();
  PropertiesService.getScriptProperties().deleteProperty(publishedPropertyKey_(dateString));
  Logger.log(`Local publish flag untuk ${dateString} direset. Menjalankan publishMorningBrew()...`);
  publishMorningBrew();
}

/** Installs the ~05:30 WIB daily trigger. Safe to re-run — removes any prior trigger for
 * this function first, so you never end up with duplicates. Uses .inTimezone(), which sets
 * the trigger's firing timezone explicitly — the Apps Script project's own default timezone
 * does not need to be changed for this to fire at the right Jakarta time. */
function createDailyTrigger() {
  removeDailyTrigger();
  ScriptApp.newTrigger('publishMorningBrew')
    .timeBased()
    .atHour(CONFIG.TRIGGER_HOUR)
    .nearMinute(CONFIG.TRIGGER_MINUTE)
    .everyDays(1)
    .inTimezone(CONFIG.TIMEZONE)
    .create();
  Logger.log(`Trigger harian dibuat: ~${CONFIG.TRIGGER_HOUR}:${CONFIG.TRIGGER_MINUTE} ${CONFIG.TIMEZONE}.`);
}

/** Removes any existing daily trigger(s) for publishMorningBrew. Safe to call even if none exist. */
function removeDailyTrigger() {
  const existing = ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === 'publishMorningBrew');
  existing.forEach((t) => ScriptApp.deleteTrigger(t));
  Logger.log(`${existing.length} trigger publishMorningBrew dihapus.`);
}

/**
 * Read-only status check — safe to run any time, never publishes anything, never prints
 * the secret value (only whether one is configured).
 */
function showTodayStatus() {
  const dateString = todayJakartaDateString_();
  const file = findTodaysFile_(dateString);
  const triggerCount = ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === 'publishMorningBrew').length;

  const lines = [
    `Tanggal WIB hari ini: ${dateString}`,
    `File Morning Brew ditemukan: ${file ? 'YA' : 'TIDAK'}`,
    `Nama file: ${file ? file.getName() : '-'}`,
    `Status publish lokal (Script Properties): ${isMarkedPublished_(dateString) ? 'sudah published' : 'belum'}`,
    `API URL: ${CONFIG.API_URL}`,
    `Secret configured: ${getPublishSecret_() ? 'YES' : 'NO'}`,
    `Daily trigger terpasang: ${triggerCount > 0 ? `YA (${triggerCount})` : 'TIDAK'}`
  ];
  const report = lines.join('\n');
  Logger.log(report);
  return report;
}
