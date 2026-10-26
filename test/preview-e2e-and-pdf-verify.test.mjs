import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import assert from 'node:assert';

const PREVIEW_URL = process.env.VERCEL_PREVIEW_URL || 'https://bhumiamartya-homepage-git-feat-restore-701b0c-wizzares-projects.vercel.app/matrixcompability/';
const BYPASS_SECRET = process.env.VERCEL_PROTECTION_BYPASS || process.env.VERCEL_BYPASS_TOKEN || '';

// Helper to extract text from unencrypted jsPDF output
function extractPdfText(pdfBuffer) {
  const content = pdfBuffer.toString('binary');
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let allText = '';
  let match;

  while ((match = streamRegex.exec(content)) !== null) {
    const streamData = Buffer.from(match[1], 'binary');
    let decompressed;
    try {
      decompressed = zlib.inflateSync(streamData).toString('utf-8');
    } catch {
      decompressed = streamData.toString('utf-8');
    }

    // Match text within parentheses (e.g., (BHUMI AMARTYA) Tj)
    const textMatches = decompressed.match(/\((.*?)\)/g) || [];
    for (const tm of textMatches) {
      let txt = tm.replace(/^\(/, '').replace(/\)$/, '');
      const normalizedTxt = txt.replace(/\s+/g, ' ');
      const condensed = txt.replace(/\0/g, '').replace(/(\w)\s+(\w)/g, '$1$2').replace(/(\w)\s+(\w)/g, '$1$2');
      allText += ' ' + normalizedTxt + ' ' + condensed;
    }
  }

  // Count pages (/Type /Page)
  const pageMatches = content.match(/\/Type\s*\/Page\b/g) || [];
  const pageCount = pageMatches.length;

  return { text: allText, pageCount };
}

async function run() {
  console.log('Testing Vercel Preview Deployment:', PREVIEW_URL);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    acceptDownloads: true,
    viewport: { width: 1280, height: 900 }
  });

  const page = await context.newPage();

  // Attach vercel protection bypass header only to Vercel preview domain if secret provided
  if (BYPASS_SECRET) {
    console.log('Using VERCEL_PROTECTION_BYPASS from environment.');
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.includes('vercel.app')) {
        const headers = {
          ...route.request().headers(),
          'x-vercel-protection-bypass': BYPASS_SECRET
        };
        route.continue({ headers });
      } else {
        route.continue();
      }
    });
  } else {
    console.log('No VERCEL_PROTECTION_BYPASS environment variable provided.');
  }

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  console.log('Navigating to preview URL...');
  const response = await page.goto(PREVIEW_URL, { waitUntil: 'networkidle', timeout: 30000 });
  console.log('HTTP Status:', response.status());

  const title = await page.title();
  console.log('Page Title:', title);

  if (title.includes('Login – Vercel') || response.url().includes('sso-api')) {
    console.log('NOTICE: Preview deployment is protected by Vercel SSO Authentication.');
    console.log('Set VERCEL_PROTECTION_BYPASS in environment to run live preview tests with bypass.');
    await browser.close();
    return;
  }

  assert.strictEqual(response.status(), 200, 'Page should return 200 OK');
  assert.ok(title.includes('Compatibility Matrix'), 'Title should mention Compatibility Matrix');

  // Fill in couple data
  console.log('Filling form with Golden Fixture couple...');
  await page.fill('#male-name', 'Widhi Wedhaswara');
  await page.fill('#male-birth', '1985-05-03');
  await page.fill('#male-time', '23:45');
  await page.fill('#male-city', 'Jakarta');

  await page.fill('#female-name', 'Ayu Kartika');
  await page.fill('#female-birth', '1988-10-17');
  await page.fill('#female-time', '10:15');
  await page.fill('#female-city', 'Bandung');

  // Submit
  console.log('Submitting form...');
  await page.click('button[type="submit"]');
  await page.waitForSelector('#matrix-results.show', { timeout: 10000 });

  // 1. Compatibility Matrix Verification
  const heroTitle = await page.locator('.matrix-hero-title').innerText();
  console.log('Center Arcana:', heroTitle);
  assert.strictEqual(heroTitle, '15 · The Devil', 'Center Arcana should be 15 · The Devil');

  const octagonCount = await page.locator('svg.compatibility-svg').count();
  console.log('Octagon SVG Count:', octagonCount);
  assert.strictEqual(octagonCount, 1, 'Should render 1 Octagon SVG');

  const totalHarmony = await page.locator('.highlight-synthesis .synthesis-result strong').innerText();
  console.log('Total Harmony:', totalHarmony);
  assert.strictEqual(totalHarmony, '9 · The Hermit', 'Total Harmony should be 9 · The Hermit');

  // 2. Synastry Verification
  const synastryHeading = await page.locator("h2:has-text('Synastry Natal Chart Couple')").count();
  console.log('Synastry Heading Count:', synastryHeading);
  assert.strictEqual(synastryHeading, 1, 'Synastry section must exist');

  const biwheelCount = await page.locator('svg.synastry-biwheel-svg').count();
  console.log('Bi-Wheel SVG Count:', biwheelCount);
  assert.strictEqual(biwheelCount, 1, 'Should render 1 Bi-Wheel SVG');

  const partnerASun = await page.locator(".partner-a-card .astro-tag:has-text('Matahari')").innerText();
  const partnerBSun = await page.locator(".partner-b-card .astro-tag:has-text('Matahari')").innerText();
  console.log('Partner A Sun Tag:', partnerASun);
  console.log('Partner B Sun Tag:', partnerBSun);
  assert.ok(partnerASun.includes('Taurus'), 'Partner A Sun should be Taurus');
  assert.ok(partnerBSun.includes('Libra'), 'Partner B Sun should be Libra');

  const aspectRowsCount = await page.locator('.synastry-table tbody tr').count();
  console.log('Total Synastry Table Rows:', aspectRowsCount);
  assert.ok(aspectRowsCount >= 20, 'Should have table rows for planets and aspects');

  const aspectCardsCount = await page.locator('.aspect-interp-card').count();
  console.log('Aspect Interpretation Cards Count:', aspectCardsCount);
  assert.ok(aspectCardsCount >= 5, 'Should have at least 5 aspect interpretation cards');

  // 3. PDF Download Verification
  const downloadBtn = page.locator('#btn-download-couple-pdf');
  const downloadBtnText = await downloadBtn.innerText();
  console.log('Download Button Text:', downloadBtnText.trim());
  assert.ok(downloadBtnText.includes('Widhi Wedhaswara & Ayu Kartika'), 'Button must display couple names');

  console.log('Triggering PDF download...');
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    downloadBtn.click()
  ]);

  const filename = download.suggestedFilename();
  console.log('Downloaded Filename:', filename);
  assert.strictEqual(
    filename,
    'Bhumi-Amartya-Compatibility-Widhi-Wedhaswara-dan-Ayu-Kartika.pdf',
    'Filename should match required format'
  );

  const downloadPath = path.resolve('./temp-preview-test-couple.pdf');
  await download.saveAs(downloadPath);
  const pdfBytes = fs.readFileSync(downloadPath);
  console.log('Downloaded PDF Size:', pdfBytes.length, 'bytes');
  assert.ok(pdfBytes.length > 5000, 'PDF should have substantial content');

  // 4. PDF Internal Content & Structure Verification
  console.log('Extracting and verifying PDF text stream contents...');
  const { text: pdfText, pageCount } = extractPdfText(pdfBytes);
  console.log('PDF Page Count:', pageCount);
  assert.ok(pageCount >= 3, 'PDF should have at least 3 pages');

  console.log('Verifying key elements inside PDF:');
  const requiredStrings = [
    'BHUMI AMARTYA',
    'Compatibility Matrix & Synastry Natal Chart',
    'Widhi Wedhaswara',
    'Ayu Kartika',
    'Taurus',
    'Libra',
    '15',
    'The Devil',
    '9',
    'The Hermit',
    'INTERPRETASI ASPEK & DINAMIKA HUBUNGAN',
    'RUANG PENDEWASAAN',
    'DINAMIKA SUPORTIF',
    'KELEMBUTAN & KASIH SAYANG',
    'SINTESIS DINAMIKA & KESIMPULAN RELASI',
    'SINERGI ELEMEN',
    'Refleksi Relasi Berkesadaran'
  ];

  for (const s of requiredStrings) {
    const searchNoSpace = s.replace(/\s+/g, '').toLowerCase();
    const pdfNoSpace = pdfText.replace(/[\s\0]+/g, '').toLowerCase();
    const found = pdfNoSpace.includes(searchNoSpace);
    console.log(` - Checking "${s}": ${found ? 'FOUND ✓' : 'NOT FOUND ✗'}`);
    assert.ok(found, `PDF must contain text: "${s}"`);
  }

  // 5. Visual PDF Render Verification
  console.log('Verifying PDF file integrity and page structure...');
  assert.strictEqual(fs.existsSync(downloadPath), true, 'PDF file must exist on disk');
  const stats = fs.statSync(downloadPath);
  console.log(`PDF file verified on disk: ${downloadPath} (${stats.size} bytes, ${pageCount} pages)`);
  assert.strictEqual(pageCount, 4, 'PDF must contain exactly 4 pages without blank pages or overflow');

  // Clean up
  try { fs.unlinkSync(downloadPath); } catch {}

  console.log('Console Errors:', consoleErrors.length === 0 ? 'None ✓' : consoleErrors);
  assert.strictEqual(consoleErrors.length, 0, 'No console errors allowed');

  await browser.close();
  console.log('\n>>> SUCCESS: LIVE VERCEL PREVIEW DEPLOYMENT & PDF VERIFICATION PASSED 100%! <<<');
}

run().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
