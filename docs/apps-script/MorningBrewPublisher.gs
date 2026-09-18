/**
 * Morning Brew Auto-Publisher — Google Apps Script
 *
 * Flow: Gemini Spark (05:00 WIB) -> Google Drive -> this script (~05:30 WIB)
 *       -> POST https://bhumiamartya.my.id/api/content/morning-brew -> published article.
 *
 * SETUP (one time):
 *   1. Open script.google.com, create a new standalone project, paste this file in.
 *   2. Run `setupSecret_()` once (see instructions right above that function).
 *   3. Run `testConnection()` from the editor to verify the secret + API are wired up
 *      (it sends dryRun:true — no article is created).
 *   4. Run `createDailyTrigger()` once to install the ~05:30 WIB daily trigger.
 *   5. On first run, Apps Script will ask you to authorize Drive + UrlFetch access — accept it.
 *
 * All configuration lives in CONFIG below. Nothing here is a secret except the one-time
 * setupSecret_() step, which stores the value in PropertiesService (never in source).
 */

const CONFIG = {
  FOLDER_ID: '1Vm8kFWCJZuVmERtnHmi3_bleN8QQvNU0',
  API_URL: 'https://bhumiamartya.my.id/api/content/morning-brew',
  TIMEZONE: 'Asia/Jakarta',
  // Expected file name pattern: "Morning Brew - YYYY-MM-DD". Title detection also falls
  // back to the first heading inside the doc, and file lookup also falls back to scanning
  // the folder for a YYYY-MM-DD date match if the exact name isn't found.
  FILE_NAME_PREFIX: 'Morning Brew - ',
  SOURCE_LABEL: 'google-drive',
  TRIGGER_HOUR: 5,
  TRIGGER_MINUTE: 30
};

const SECRET_PROPERTY_KEY = 'MORNING_BREW_PUBLISH_SECRET';

/**
 * ONE-TIME SETUP: paste your real secret value below (the same value you set in Vercel as
 * MORNING_BREW_PUBLISH_SECRET), run this function once from the Apps Script editor
 * (select setupSecret_ in the function dropdown -> Run), then IMMEDIATELY delete the
 * literal value from this line and save. The secret then lives only in Script Properties.
 */
function setupSecret_() {
  const secretValue = 'PASTE_YOUR_MORNING_BREW_PUBLISH_SECRET_HERE';
  if (secretValue === 'PASTE_YOUR_MORNING_BREW_PUBLISH_SECRET_HERE') {
    throw new Error('Ganti secretValue dengan secret asli sebelum menjalankan setupSecret_().');
  }
  PropertiesService.getScriptProperties().setProperty(SECRET_PROPERTY_KEY, secretValue);
  Logger.log('Secret tersimpan di Script Properties. Sekarang hapus nilai literal di atas.');
}

function getPublishSecret_() {
  const secret = PropertiesService.getScriptProperties().getProperty(SECRET_PROPERTY_KEY);
  if (!secret) {
    throw new Error('MORNING_BREW_PUBLISH_SECRET belum di-set. Jalankan setupSecret_() dulu.');
  }
  return secret;
}

function todayJakartaDateString_() {
  return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd');
}

function publishedPropertyKey_(dateString) {
  return `PUBLISHED_MORNING_BREW_${dateString.replace(/-/g, '_')}`;
}

/**
 * Finds today's Morning Brew file in the configured Drive folder.
 * 1) Fast path: exact name match "Morning Brew - YYYY-MM-DD".
 * 2) Fallback: scan all files in the folder for one whose name contains today's
 *    YYYY-MM-DD date, in case Gemini Spark's naming drifts slightly.
 * Never falls back to "the latest file" — if today's date isn't found, returns null.
 */
function findTodaysFile_(dateString) {
  const folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
  const expectedName = `${CONFIG.FILE_NAME_PREFIX}${dateString}`;

  const exact = folder.getFilesByName(expectedName);
  if (exact.hasNext()) return exact.next();

  const all = folder.getFiles();
  while (all.hasNext()) {
    const file = all.next();
    if (file.getName().indexOf(dateString) !== -1) return file;
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
 * Title priority: first non-empty heading-style paragraph in the Doc body, then the file
 * name with the "Morning Brew - YYYY-MM-DD" prefix stripped, then the raw file name.
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
    }
  }
  const name = file.getName();
  const strippedPrefix = `${CONFIG.FILE_NAME_PREFIX}${dateString}`;
  if (name === strippedPrefix) return `Morning Brew ${dateString}`;
  return name.replace(/^Morning Brew\s*-\s*/i, '').trim() || name;
}

function postToApi_(payload) {
  const response = UrlFetchApp.fetch(CONFIG.API_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${getPublishSecret_()}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  const bodyText = response.getContentText();
  let parsed = null;
  try {
    parsed = JSON.parse(bodyText);
  } catch (err) {
    // leave parsed as null; raw body is still logged below
  }
  return { status, bodyText, parsed };
}

/**
 * Manual connectivity/auth test — sends dryRun:true so the API validates the secret and
 * payload WITHOUT creating a Firestore document. Safe to run any time.
 */
function testConnection() {
  const dateString = todayJakartaDateString_();
  const { status, bodyText } = postToApi_({
    title: 'Test Koneksi Morning Brew',
    content: 'Ini hanya tes koneksi, tidak akan dipublish.',
    date: dateString,
    source: CONFIG.SOURCE_LABEL,
    dryRun: true
  });
  Logger.log(`[testConnection] status=${status} body=${bodyText}`);
}

/**
 * Main entry point — run manually to test the real flow, or via the daily trigger.
 * Never publishes yesterday's content: if today's file isn't found, it logs and exits.
 */
function publishMorningBrew() {
  const dateString = todayJakartaDateString_();
  const propKey = publishedPropertyKey_(dateString);
  const props = PropertiesService.getScriptProperties();

  if (props.getProperty(propKey) === 'true') {
    Logger.log(`Morning Brew ${dateString} sudah ditandai published sebelumnya. Skip.`);
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
    Logger.log(`Morning Brew ${dateString} ditemukan tapi isinya kosong. Skip, tidak dipublish.`);
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
    props.setProperty(propKey, 'true');
    Logger.log(`Morning Brew ${dateString} publish OK. status=${parsed.status} slug=${parsed.slug}`);
    return;
  }

  Logger.log(`Morning Brew ${dateString} publish GAGAL. httpStatus=${status} response=${bodyText}`);
  // Intentionally NOT marking as published and NOT touching the Drive file, so the daily
  // trigger (or a manual re-run) can retry safely.
}

/** Installs the ~05:30 WIB daily trigger. Safe to re-run — it removes prior triggers for
 * this function first, so you never end up with duplicates. */
function createDailyTrigger() {
  removeExistingTriggers_();
  ScriptApp.newTrigger('publishMorningBrew')
    .timeBased()
    .atHour(CONFIG.TRIGGER_HOUR)
    .nearMinute(CONFIG.TRIGGER_MINUTE)
    .everyDays(1)
    .inTimezone(CONFIG.TIMEZONE)
    .create();
  Logger.log(`Trigger harian dibuat: ~${CONFIG.TRIGGER_HOUR}:${CONFIG.TRIGGER_MINUTE} ${CONFIG.TIMEZONE}.`);
}

function removeExistingTriggers_() {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'publishMorningBrew')
    .forEach((t) => ScriptApp.deleteTrigger(t));
}
