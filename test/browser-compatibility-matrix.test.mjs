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

server.listen(4183, async () => {
  console.log("Test server listening on http://localhost:4183");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  console.log("Loading http://localhost:4183/matrixcompability/ ...");
  await page.goto("http://localhost:4183/matrixcompability/", { waitUntil: "domcontentloaded" });

  console.log("Page title:", await page.title());

  // Check for app update intrusion
  const bodyText = await page.innerText("body");
  if (bodyText.includes("Versi Baru Bhumi Tersedia") || bodyText.includes("Minimum Build")) {
    errors.push("CRITICAL: App update text detected on web page!");
  }

  // Fill form with Golden Fixture
  console.log("Filling form...");
  await page.fill("#male-name", "Male Partner");
  await page.fill("#male-birth", "1985-05-03");
  await page.fill("#female-name", "Female Partner");
  await page.fill("#female-birth", "1988-10-17");

  console.log("Submitting form...");
  await page.click('button[type="submit"]');

  await page.waitForSelector("#matrix-results.show", { timeout: 5000 });

  const heroTitle = await page.locator(".matrix-hero-title").innerText();
  console.log("Center Arcana Hero:", heroTitle);

  const svgExists = await page.locator("svg.compatibility-svg").count();
  console.log("SVG count:", svgExists);

  const meetingPurpose = await page.locator(".matrix-card:has-text('Tujuan Pertemuan') .zone-code-badge").innerText();
  console.log("Meeting Purpose Code:", meetingPurpose);

  const karmicTail = await page.locator(".matrix-card:has-text('Ekor Karma Relasi') .zone-code-badge").innerText();
  console.log("Karmic Tail Code:", karmicTail);

  const loveLine = await page.locator(".matrix-card:has-text('Jalur Cinta') .zone-code-badge").innerText();
  console.log("Love Line Code:", loveLine);

  const economicLane = await page.locator(".matrix-card:has-text('Jalur Finansial') .zone-code-badge").innerText();
  console.log("Economic Lane Code:", economicLane);

  const totalHarmony = await page.locator(".highlight-synthesis .synthesis-result strong").innerText();
  console.log("Total Harmony Result:", totalHarmony);

  console.log("Console errors:", errors.length === 0 ? "None" : errors);

  await browser.close();
  server.close();

  if (
    errors.length > 0 ||
    heroTitle !== "15 · The Devil" ||
    meetingPurpose !== "15–20" ||
    karmicTail !== "21–3–9" ||
    loveLine !== "9–10–19" ||
    economicLane !== "19–11–10" ||
    totalHarmony !== "9 · The Hermit"
  ) {
    console.error("TEST FAILED: Result does not match approved SOT golden fixture!");
    process.exit(1);
  } else {
    console.log(">>> SUCCESS: 100% SOT GOLDEN FIXTURE AND ZERO ERRORS! <<<");
    process.exit(0);
  }
});
