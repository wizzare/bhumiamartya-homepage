import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));

  console.log("Navigating to live production: https://www.bhumiamartya.my.id/matrixcompability ...");
  const resp = await page.goto("https://www.bhumiamartya.my.id/matrixcompability", { waitUntil: "domcontentloaded", timeout: 30000 });
  console.log("HTTP Status:", resp.status());
  console.log("Title:", await page.title());

  await page.waitForTimeout(2000);

  // Check that NO app update text appears
  const bodyText = await page.innerText("body");
  if (bodyText.includes("Versi Baru Bhumi Tersedia") || bodyText.includes("Minimum Build") || bodyText.includes("Update Sekarang")) {
    errors.push("CRITICAL: Mobile app update screen still present!");
  } else {
    console.log("CONFIRMED: Zero mobile app update or VersionChecker intrusion.");
  }

  // Fill in calculation form
  console.log("Testing live calculation form on production...");
  await page.fill("#male-name", "Male Partner");
  await page.fill("#male-birth", "1985-05-03");
  await page.fill("#female-name", "Female Partner");
  await page.fill("#female-birth", "1988-10-17");

  await page.click('button[type="submit"]');
  await page.waitForSelector("#matrix-results.show", { timeout: 10000 });

  const hero = await page.locator(".matrix-hero-title").innerText();
  console.log("Live Result Center Arcana:", hero);

  const svgCount = await page.locator("svg.compatibility-svg").count();
  console.log("Live Result Octagon SVG rendered:", svgCount === 1);

  const meetingPurpose = await page.locator(".matrix-card:has-text('Tujuan Pertemuan') .zone-code-badge").innerText();
  console.log("Live Meeting Purpose Code:", meetingPurpose);

  const totalHarmony = await page.locator(".highlight-synthesis .synthesis-result strong").innerText();
  console.log("Live Total Harmony Result:", totalHarmony);

  console.log("Console Errors count:", errors.length);
  if (errors.length) console.log("Errors:", errors);

  await browser.close();

  if (errors.length === 0 && hero === "15 · The Devil" && meetingPurpose === "15–20" && totalHarmony === "9 · The Hermit") {
    console.log(">>> PRODUCTION DEPLOYMENT VERIFIED 100% OPERATIONAL & CLEAN! <<<");
    process.exit(0);
  } else {
    console.error("PRODUCTION VERIFICATION FAILED");
    process.exit(1);
  }
}

run();
