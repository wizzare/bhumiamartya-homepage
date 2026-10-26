import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  if (reqPath.endsWith("/")) reqPath += "index.html";
  if (!path.extname(reqPath)) reqPath += "/index.html";
  const filePath = path.join(root, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".css": "text/css",
      ".json": "application/json",
      ".png": "image/png",
      ".svg": "image/svg+xml",
    }[ext] || "text/plain";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end("Not found: " + reqPath);
  }
});

server.listen(4184, async () => {
  console.log("Test server listening on http://localhost:4184");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  console.log("Loading http://localhost:4184/matrixcompability/ ...");
  await page.goto("http://localhost:4184/matrixcompability/", { waitUntil: "domcontentloaded" });

  // TEST 1: Golden Fixture Couple with birth times and locations
  console.log("\n--- TEST 1: Widhi Wedhaswara & Ayu Kartika ---");
  await page.fill("#male-name", "Widhi Wedhaswara");
  await page.fill("#male-birth", "1985-05-03");
  await page.fill("#male-time", "23:45");
  await page.fill("#male-city", "Jakarta");

  await page.fill("#female-name", "Ayu Kartika");
  await page.fill("#female-birth", "1988-10-17");
  await page.fill("#female-time", "10:15");
  await page.fill("#female-city", "Bandung");

  console.log("Submitting form...");
  await page.click('button[type="submit"]');

  await page.waitForSelector("#matrix-results.show", { timeout: 5000 });

  // 1. Verify Compatibility Matrix (Destiny Matrix)
  const heroTitle = await page.locator(".matrix-hero-title").innerText();
  console.log("Center Arcana:", heroTitle);
  const octagonSvgCount = await page.locator("svg.compatibility-svg").count();
  console.log("Octagon SVG count:", octagonSvgCount);
  const totalHarmony = await page.locator(".highlight-synthesis .synthesis-result strong").innerText();
  console.log("Total Harmony:", totalHarmony);

  if (heroTitle !== "15 · The Devil" || octagonSvgCount !== 1 || totalHarmony !== "9 · The Hermit") {
    console.error("FAILED: Compatibility matrix values do not match SOT!");
    process.exit(1);
  }

  // 2. Verify Synastry Natal Chart Couple
  const synastryHeading = await page.locator("h2:has-text('Synastry Natal Chart Couple')").count();
  console.log("Synastry Section exists:", synastryHeading === 1);

  const biwheelSvgCount = await page.locator("svg.synastry-biwheel-svg").count();
  console.log("Bi-Wheel SVG count:", biwheelSvgCount);

  const partnerASun = await page.locator(".partner-a-card .astro-tag:has-text('Matahari')").innerText();
  console.log("Partner A Sun Tag:", partnerASun);
  const partnerBSun = await page.locator(".partner-b-card .astro-tag:has-text('Matahari')").innerText();
  console.log("Partner B Sun Tag:", partnerBSun);

  const aspectRowsCount = await page.locator(".synastry-table tbody tr").count();
  console.log("Total Synastry table rows (planets + aspects):", aspectRowsCount);

  const aspectCardsCount = await page.locator(".aspect-interp-card").count();
  console.log("Aspect interpretation cards count:", aspectCardsCount);

  if (synastryHeading !== 1 || biwheelSvgCount !== 1 || aspectCardsCount < 4) {
    console.error("FAILED: Synastry Natal Chart elements not properly rendered!");
    process.exit(1);
  }

  // 3. Verify Download PDF Button & Filename
  const downloadBtn = page.locator("#btn-download-couple-pdf");
  const downloadBtnText = await downloadBtn.innerText();
  console.log("Download Button Text:", downloadBtnText.trim());

  if (!downloadBtnText.includes("Download PDF – Widhi Wedhaswara & Ayu Kartika")) {
    console.error("FAILED: Download button text does not contain personalized couple names!");
    process.exit(1);
  }

  console.log("Clicking Download PDF button...");
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 10000 }),
    downloadBtn.click()
  ]);

  const downloadedFilename = download.suggestedFilename();
  console.log("Downloaded Filename:", downloadedFilename);

  const expectedFilename = "Bhumi-Amartya-Compatibility-Widhi-Wedhaswara-dan-Ayu-Kartika.pdf";
  if (downloadedFilename !== expectedFilename) {
    console.error(`FAILED: Expected filename '${expectedFilename}', got '${downloadedFilename}'`);
    process.exit(1);
  }

  // Save downloaded file and check size > 0
  const tempPath = path.join(root, "temp_test_couple.pdf");
  await download.saveAs(tempPath);
  const fileSize = fs.statSync(tempPath).size;
  console.log("Downloaded PDF File Size:", fileSize, "bytes");
  fs.unlinkSync(tempPath);

  if (fileSize < 5000) {
    console.error("FAILED: Downloaded PDF file size is suspiciously small!");
    process.exit(1);
  }

  // TEST 2: Unknown Birth Time Mode
  console.log("\n--- TEST 2: Unknown Birth Time (Limited Mode) ---");
  await page.check("#male-time-unknown");
  await page.check("#female-time-unknown");

  console.log("Submitting with unknown times...");
  await page.click('button[type="submit"]');

  await page.waitForTimeout(500);
  const noticeBox = await page.locator(".matrix-notice-box").innerText();
  console.log("Notice box text:", noticeBox.slice(0, 80) + "...");
  if (!noticeBox.includes("Mode Perhitungan Waktu Terbatas") || !noticeBox.includes("tidak diketahui")) {
    console.error("FAILED: Limited mode notice not displayed!");
    process.exit(1);
  }

  // TEST 3: Names with special characters
  console.log("\n--- TEST 3: Special Characters in Names ---");
  await page.fill("#male-name", "Joko (Anwar) & Partner");
  await page.fill("#female-name", "Siti / Nurhaliza!");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(500);

  const [downloadSpecial] = await Promise.all([
    page.waitForEvent("download", { timeout: 10000 }),
    page.click("#btn-download-couple-pdf")
  ]);

  const specialFilename = downloadSpecial.suggestedFilename();
  console.log("Special Filename:", specialFilename);
  const expectedSpecial = "Bhumi-Amartya-Compatibility-Joko-Anwar-Partner-dan-Siti-Nurhaliza.pdf";
  if (specialFilename !== expectedSpecial) {
    console.error(`FAILED: Expected '${expectedSpecial}', got '${specialFilename}'`);
    process.exit(1);
  }

  console.log("Console errors:", errors.length === 0 ? "None" : errors);
  if (errors.length > 0) {
    console.error("FAILED: Unhandled console errors occurred:", errors);
    process.exit(1);
  }

  await browser.close();
  server.close();
  console.log("\n>>> SUCCESS: ALL BROWSER SYNASTRY AND PDF TESTS PASSED 100%! <<<");
  process.exit(0);
});
