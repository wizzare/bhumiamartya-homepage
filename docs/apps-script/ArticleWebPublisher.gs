/**
 * Artikel Web Auto-Publisher — Google Apps Script (production)
 *
 * Flow: Gemini Spark (~11:00 WIB) -> Google Drive -> this script (~12:00 WIB)
 *       -> POST https://www.bhumiamartya.my.id/api/content/article-web -> published article.
 *
 * Sibling automation to MorningBrewPublisher.gs (different Drive subfolder, different
 * endpoint, different secret) — this script does not touch Morning Brew's trigger, folder,
 * or Script Properties in any way. Safe to paste into the same Apps Script project as
 * MorningBrewPublisher.gs (function/property names are namespaced) or a separate one.
 *
 * SETUP (one time, ~5 steps):
 *   1. script.google.com -> New project (or add as a new file to the existing Morning Brew
 *      project) -> paste this whole file in.
 *   2. Set the secret via Script Properties (see "SETUP SECRET" below) — never hardcode it.
 *   3. Run `testArticleWebConnection()` once (sends dryRun:true — no article is created).
 *      Accept the Drive + external-request authorization prompt the first time.
 *   4. Run `createArticleWebDailyTrigger()` once to install the ~12:00 WIB daily trigger.
 *   5. (Optional) Run `showArticleWebTodayStatus()` any time to sanity-check configuration.
 */

const CONFIG = {
  ROOT_FOLDER_ID: '1Vm8kFWCJZuVmERtnHmi3_bleN8QQvNU0',
  // Canonical www host used directly and deliberately: the apex bhumiamartya.my.id
  // 308-redirects to www, and UrlFetchApp does not reliably preserve POST across that
  // redirect (confirmed with Morning Brew — it can arrive at the handler as GET). www has
  // no redirect, so pointing here avoids the hop entirely.
  API_URL: 'https://www.bhumiamartya.my.id/api/content/article-web',
  TIMEZONE: 'Asia/Jakarta',
  FILE_NAME_MARKER: 'artikel web',
  SOURCE_LABEL: 'google-drive',
  SECRET_PROP_KEY: 'ARTICLE_WEB_PUBLISH_SECRET',
  TRIGGER_HOUR: 12,
  TRIGGER_MINUTE: 0
};

// ---------------------------------------------------------------------------
// SETUP SECRET
// ---------------------------------------------------------------------------
// Preferred method: Apps Script editor -> Project Settings (gear icon) -> Script
// Properties -> "Add script property" -> name ARTICLE_WEB_PUBLISH_SECRET, value = the
// secret from Vercel's ARTICLE_WEB_PUBLISH_SECRET env var. This never puts the secret in
// source at all.
//
// Alternative (if you'd rather run a function): paste the secret into secretValue below,
// run setArticleWebPublishSecretOnce() once, then IMMEDIATELY delete the literal value
// from this line and save again.
function setArticleWebPublishSecretOnce() {
  const secretValue = 'PASTE_SECRET_TEMPORARILY_HERE';
  if (secretValue === 'PASTE_SECRET_TEMPORARILY_HERE') {
    throw new Error('Ganti secretValue dengan secret asli sebelum menjalankan setArticleWebPublishSecretOnce().');
  }
  PropertiesService.getScriptProperties().setProperty(CONFIG.SECRET_PROP_KEY, secretValue);
  Logger.log('Secret tersimpan di Script Properties. Sekarang hapus nilai literal di atas dan save ulang.');
}

function getArticleWebSecret_() {
  return PropertiesService.getScriptProperties().getProperty(CONFIG.SECRET_PROP_KEY);
}

function requireArticleWebSecret_() {
  const secret = getArticleWebSecret_();
  if (!secret) {
    throw new Error(`${CONFIG.SECRET_PROP_KEY} belum di-set. Isi lewat Script Properties atau jalankan setArticleWebPublishSecretOnce().`);
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
  return `PUBLISHED_ARTICLE_WEB_${dateString.replace(/-/g, '_')}`;
}

function isMarkedPublished_(dateString) {
  return PropertiesService.getScriptProperties().getProperty(publishedPropertyKey_(dateString)) === 'true';
}

function markPublished_(dateString) {
  PropertiesService.getScriptProperties().setProperty(publishedPropertyKey_(dateString), 'true');
}

// ---------------------------------------------------------------------------
// File discovery — recursive from ROOT_FOLDER_ID, TODAY only, never "latest file".
// ---------------------------------------------------------------------------

const MAX_FOLDERS_TO_SCAN = 500; // safety cap, never an infinite/runaway scan

/**
 * Recursively scans ROOT_FOLDER_ID and its subfolders (the real layout is
 * "<ROOT_FOLDER_ID>/<year>/<MonthName>/Artikel Web/...", but this does not hardcode that
 * shape so it keeps working across month/year changes) for TODAY's Artikel Web file only.
 *
 * A file only ever matches if its name contains BOTH "artikel web" and today's exact
 * YYYY-MM-DD date (case-insensitive) — this never falls back to yesterday's file or "the
 * newest file in the folder". A name matching the exact
 * "YYYY-MM-DD - Artikel Web - <title>" pattern is preferred over any other same-date match.
 */
function findTodaysArticleWebFile_(dateString) {
  const queue = [DriveApp.getFolderById(CONFIG.ROOT_FOLDER_ID)];
  let scanned = 0;
  let fallbackMatch = null;
  const exactPattern = new RegExp(`^${dateString}\\s*-\\s*artikel web\\s*-\\s*.+$`, 'i');

  while (queue.length > 0 && scanned < MAX_FOLDERS_TO_SCAN) {
    const folder = queue.shift();
    scanned += 1;

    const files = folder.getFiles();
    while (files.hasNext()) {
      const file = files.next();
      const name = file.getName();
      const nameLower = name.toLowerCase();
      if (nameLower.indexOf(dateString) === -1 || nameLower.indexOf(CONFIG.FILE_NAME_MARKER) === -1) continue;
      if (exactPattern.test(name)) return file;
      if (!fallbackMatch) fallbackMatch = file;
    }

    const subfolders = folder.getFolders();
    while (subfolders.hasNext()) {
      queue.push(subfolders.next());
    }
  }

  return fallbackMatch;
}

// ---------------------------------------------------------------------------
// Metadata parser
// ---------------------------------------------------------------------------

const METADATA_KEYS = ['SEO_TITLE', 'META_DESCRIPTION', 'CATEGORY', 'TAGS', 'SLUG'];
const METADATA_KEY_RE = new RegExp(`^(${METADATA_KEYS.join('|')})\\s*:\\s*(.*)$`, 'i');

/**
 * Parses the metadata block at the top of an Artikel Web Google Doc:
 *
 *   SEO_TITLE:
 *   ...
 *   META_DESCRIPTION:
 *   ...
 *   CATEGORY:
 *   ...
 *   TAGS:
 *   tag1, tag2, tag3
 *   SLUG:
 *   ...
 *   (optional "---" separator)
 *   <article content>
 *
 * Robust to both "KEY: value" on one line and "KEY:" with the value on the next
 * paragraph (the real format seen from Gemini Spark), and to documents that omit the
 * "---" separator entirely (also seen from Gemini Spark — the article content simply
 * starts right after the SLUG value). Metadata lines are never included in the returned
 * content. Keys are matched case-insensitively; unknown/empty fields are left empty for
 * the caller to fall back on safely.
 */
function parseArticleWebDocument_(doc) {
  const paragraphs = doc.getBody().getParagraphs().map((p) => p.getText());
  const meta = {};
  let i = 0;

  while (i < paragraphs.length) {
    const line = paragraphs[i].trim();
    if (!line) { i += 1; continue; }
    const match = METADATA_KEY_RE.exec(line);
    if (!match) break; // first non-metadata, non-blank paragraph -> metadata block ends here

    const key = match[1].toUpperCase();
    let value = match[2].trim();
    let consumed = 1;
    if (!value) {
      let j = i + 1;
      while (j < paragraphs.length && !paragraphs[j].trim()) j += 1;
      if (j < paragraphs.length && !METADATA_KEY_RE.test(paragraphs[j].trim())) {
        value = paragraphs[j].trim();
        consumed = (j - i) + 1;
      }
    }
    meta[key] = value;
    i += consumed;
  }

  // Skip a literal "---" separator (if present) and any blank paragraphs right after the
  // metadata run, before content starts.
  while (i < paragraphs.length && (!paragraphs[i].trim() || /^-{3,}$/.test(paragraphs[i].trim()))) {
    i += 1;
  }

  const content = paragraphs.slice(i).join('\n').trim();
  const tags = meta.TAGS ? meta.TAGS.split(',').map((t) => t.trim()).filter(Boolean) : [];

  return {
    seoTitle: meta.SEO_TITLE || '',
    seoDescription: meta.META_DESCRIPTION || '',
    category: meta.CATEGORY || '',
    tags,
    slug: meta.SLUG || '',
    content
  };
}

/**
 * Title priority: file name pattern "YYYY-MM-DD - Artikel Web - <Title>" (primary, most
 * reliable), then the first "# Heading" style line at the top of the parsed content,
 * then the file name with known prefixes stripped.
 */
function resolveArticleWebTitle_(file, content, dateString) {
  const fromName = new RegExp(`^${dateString}\\s*-\\s*artikel web\\s*-\\s*(.+)$`, 'i').exec(file.getName());
  if (fromName && fromName[1].trim()) return fromName[1].trim();

  const firstLine = String(content || '').split('\n').map((l) => l.trim()).find((l) => l.length > 0);
  if (firstLine) {
    const headingMatch = /^#{1,3}\s+(.+)$/.exec(firstLine);
    if (headingMatch) return headingMatch[1].replace(/\*\*/g, '').trim();
  }

  const cleaned = file.getName()
    .replace(new RegExp(`^${dateString}\\s*-\\s*`), '')
    .replace(/^Artikel Web\s*-\s*/i, '')
    .trim();
  return cleaned || file.getName();
}

// ---------------------------------------------------------------------------
// API call
// ---------------------------------------------------------------------------

function postToArticleWebApi_(payload) {
  const response = UrlFetchApp.fetch(CONFIG.API_URL, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: `Bearer ${requireArticleWebSecret_()}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
    followRedirects: false
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

function describeArticleWebFailure_(status, bodyText) {
  if (status >= 300 && status < 400) {
    return `Redirect tak terduga (HTTP ${status}) — CONFIG.API_URL kemungkinan menunjuk ke apex domain. Set ke https://www.bhumiamartya.my.id/api/content/article-web. Response: ${bodyText}`;
  }
  if (status === 405) {
    return `Method Not Allowed (HTTP 405) — request kemungkinan sampai sebagai GET. Cek CONFIG.API_URL memakai www. Response: ${bodyText}`;
  }
  if (status === 401 || status === 403) {
    return `Auth ditolak (HTTP ${status}) — secret salah atau belum dipasang di Script Properties / Vercel. Response: ${bodyText}`;
  }
  if (status === 503) {
    return `Server unavailable (HTTP 503) — kemungkinan masalah permission Firestore atau konfigurasi GCP env var. Response: ${bodyText}`;
  }
  if (status === 400) {
    return `Payload ditolak (HTTP 400) — cek title/content/date/metadata. Response: ${bodyText}`;
  }
  return `Publish gagal (HTTP ${status}). Response: ${bodyText}`;
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

/**
 * Manual connectivity/auth test — sends dryRun:true so the API validates the secret and
 * payload WITHOUT creating a Firestore document. Safe to run any time.
 */
function testArticleWebConnection() {
  const dateString = todayJakartaDateString_();
  const { status, bodyText, parsed } = postToArticleWebApi_({
    title: 'Artikel Web Connection Test',
    content: 'Connection test only.',
    date: dateString,
    source: CONFIG.SOURCE_LABEL,
    dryRun: true
  });

  if (status === 200 && parsed && parsed.success) {
    Logger.log(`[testArticleWebConnection] OK. status=${status} response=${bodyText}`);
    return;
  }
  Logger.log(`[testArticleWebConnection] FAILED. ${describeArticleWebFailure_(status, bodyText)}`);
  throw new Error(describeArticleWebFailure_(status, bodyText));
}

/**
 * Main entry point — run manually or via the daily trigger. Never publishes yesterday's
 * content: if today's file isn't found, it logs and exits WITHOUT throwing (expected,
 * non-error state most days before Spark's file lands). A real API failure DOES throw,
 * after logging full detail, so it isn't marked published and the trigger's failure is
 * visible.
 */
function publishArticleWeb() {
  const dateString = todayJakartaDateString_();

  if (isMarkedPublished_(dateString)) {
    Logger.log(`Artikel Web ${dateString} sudah ditandai published sebelumnya. Skip. (Gunakan publishArticleWebTodayNow() untuk memaksa publish ulang.)`);
    return;
  }

  const file = findTodaysArticleWebFile_(dateString);
  if (!file) {
    Logger.log(`Artikel Web ${dateString} belum ditemukan.`);
    return;
  }

  const doc = DocumentApp.openById(file.getId());
  const parsed = parseArticleWebDocument_(doc);
  const content = (parsed.content || '').trim();
  if (!content) {
    Logger.log(`Artikel Web ${dateString} ditemukan (file: "${file.getName()}") tapi isinya kosong setelah metadata di-parse. Skip, tidak dipublish.`);
    return;
  }

  const title = resolveArticleWebTitle_(file, content, dateString);

  const { status, bodyText, parsed: apiResult } = postToArticleWebApi_({
    title,
    content,
    date: dateString,
    seoTitle: parsed.seoTitle,
    seoDescription: parsed.seoDescription,
    category: parsed.category,
    tags: parsed.tags,
    slug: parsed.slug,
    source: CONFIG.SOURCE_LABEL
  });

  if ((status === 200 || status === 201) && apiResult && apiResult.success) {
    markPublished_(dateString);
    Logger.log(`Artikel Web ${dateString} publish OK. file="${file.getName()}" apiStatus=${apiResult.status} slug=${apiResult.slug}`);
    return;
  }

  const message = describeArticleWebFailure_(status, bodyText);
  Logger.log(`Artikel Web ${dateString} publish GAGAL. file="${file.getName()}" ${message}`);
  throw new Error(message);
}

/**
 * Forces a re-publish attempt for today even if already marked published locally. The
 * website's own anti-duplicate (doc id = article-web-<date>) is still authoritative: if
 * the article already exists there, the API returns "already_published" and nothing is
 * duplicated. Also the function to run manually for a real, non-dryRun publish test.
 */
function publishArticleWebTodayNow() {
  const dateString = todayJakartaDateString_();
  PropertiesService.getScriptProperties().deleteProperty(publishedPropertyKey_(dateString));
  Logger.log(`Local publish flag untuk ${dateString} direset. Menjalankan publishArticleWeb()...`);
  publishArticleWeb();
}

/** Installs the ~12:00 WIB daily trigger. Safe to re-run — removes any prior trigger for
 * this function first. Uses .inTimezone(), which sets the trigger's firing timezone
 * explicitly — the Apps Script project's own default timezone does not need to change. */
function createArticleWebDailyTrigger() {
  removeArticleWebDailyTrigger();
  ScriptApp.newTrigger('publishArticleWeb')
    .timeBased()
    .atHour(CONFIG.TRIGGER_HOUR)
    .nearMinute(CONFIG.TRIGGER_MINUTE)
    .everyDays(1)
    .inTimezone(CONFIG.TIMEZONE)
    .create();
  Logger.log(`Trigger harian dibuat: ~${CONFIG.TRIGGER_HOUR}:${String(CONFIG.TRIGGER_MINUTE).padStart(2, '0')} ${CONFIG.TIMEZONE}.`);
}

/** Removes any existing daily trigger(s) for publishArticleWeb. Safe to call even if none exist. */
function removeArticleWebDailyTrigger() {
  const existing = ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === 'publishArticleWeb');
  existing.forEach((t) => ScriptApp.deleteTrigger(t));
  Logger.log(`${existing.length} trigger publishArticleWeb dihapus.`);
}

/**
 * Read-only status check — safe to run any time, never publishes anything, never prints
 * the secret value (only whether one is configured).
 */
function showArticleWebTodayStatus() {
  const dateString = todayJakartaDateString_();
  const file = findTodaysArticleWebFile_(dateString);
  const triggerCount = ScriptApp.getProjectTriggers().filter((t) => t.getHandlerFunction() === 'publishArticleWeb').length;

  const lines = [
    `Tanggal WIB hari ini: ${dateString}`,
    `File Artikel Web ditemukan: ${file ? 'YA' : 'TIDAK'}`,
    `Nama file: ${file ? file.getName() : '-'}`,
    `Status publish lokal (Script Properties): ${isMarkedPublished_(dateString) ? 'sudah published' : 'belum'}`,
    `API URL: ${CONFIG.API_URL}`,
    `Secret configured: ${getArticleWebSecret_() ? 'YES' : 'NO'}`,
    `Daily trigger terpasang: ${triggerCount > 0 ? `YA (${triggerCount})` : 'TIDAK'}`
  ];
  const report = lines.join('\n');
  Logger.log(report);
  return report;
}
