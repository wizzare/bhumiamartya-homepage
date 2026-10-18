import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { chromium, devices } from 'playwright';
import blueprintHandler from '../api/blueprint.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function createTestServer() {
  const capturedPayloads = [];

  const server = http.createServer(async (req, res) => {
    let reqPath = req.url.split('?')[0];

    // Handle POST /api/blueprint
    if (req.method === 'POST' && reqPath === '/api/blueprint') {
      let bodyStr = '';
      req.on('data', chunk => { bodyStr += chunk; });
      req.on('end', async () => {
        try {
          const body = JSON.parse(bodyStr);
          capturedPayloads.push(body);

          const mockReq = { method: 'POST', body };
          await blueprintHandler(mockReq, res);
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: e.message }));
        }
      });
      return;
    }

    if (reqPath === '/' || reqPath === '/blueprint' || reqPath === '/blueprint/') {
      reqPath = '/blueprint/index.html';
    }

    const filePath = path.join(rootDir, reqPath);
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found: ' + reqPath);
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port, capturedPayloads });
    });
  });
}

test('Browser E2E: Blueprint birthplace search, autocomplete, and payload validation (Desktop & Mobile)', async () => {
  const { server, port, capturedPayloads } = await createTestServer();
  const baseUrl = `http://127.0.0.1:${port}/blueprint/index.html`;

  const browser = await chromium.launch({ headless: true });

  try {
    for (const mode of ['desktop', 'mobile']) {
      const isMobile = mode === 'mobile';
      const context = await browser.newContext(
        isMobile
          ? devices['iPhone 13']
          : { viewport: { width: 1280, height: 900 } }
      );
      const page = await context.newPage();

      const pageErrors = [];
      page.on('pageerror', (err) => pageErrors.push(err.message));

      console.log(`\n=== BROWSER [${mode.toUpperCase()}] TESTING ===`);
      console.log(`[${mode}] Navigating to ${baseUrl} ...`);
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

      const nameInput = page.locator('#fullName');
      const dateInput = page.locator('#birthDate');
      const timeInput = page.locator('#birthTime');
      const cityInput = page.locator('#birthCity');
      const suggestions = page.locator('#city-suggestions');
      const submitBtn = page.locator('#submitBtn');
      const resultsWrapper = page.locator('#results-wrapper');

      await cityInput.waitFor({ state: 'visible', timeout: 5000 });

      // Populate valid base credentials
      await nameInput.fill('Widhi Wedhaswara');
      await dateInput.fill('1985-05-03');
      await timeInput.fill('23:45');

      // 1. SCENARIO: Search "Banyumas" and verify "Jawa Tengah" (NOT Jawa Timur)
      console.log(`[${mode}] Scenario 1: Search "Banyumas"`);
      await cityInput.fill('');
      await cityInput.pressSequentially('Banyumas', { delay: 60 });

      await suggestions.locator('.city-option').first().waitFor({ state: 'visible', timeout: 6000 });

      const banyumasOptions = await suggestions.locator('.city-option').allTextContents();
      console.log(`[${mode}] Banyumas suggestions:`, banyumasOptions);

      const topBanyumas = banyumasOptions[0];
      assert.ok(topBanyumas.includes('Jawa Tengah'), 'Banyumas result must state Jawa Tengah');
      assert.ok(!topBanyumas.includes('Jawa Timur'), 'Banyumas result must NEVER state Jawa Timur');

      // Click the top option
      await suggestions.locator('.city-option').first().click();

      // Submit and verify payload received by API
      capturedPayloads.length = 0;
      await submitBtn.click();
      await resultsWrapper.waitFor({ state: 'visible', timeout: 15000 });

      assert.equal(capturedPayloads.length, 1, 'API must have received 1 calculation payload');
      const banyumasPayload = capturedPayloads[0];
      console.log(`[${mode}] Banyumas payload sent to Engine:`, banyumasPayload);

      assert.ok(banyumasPayload.birthCity.includes('Jawa Tengah'));
      assert.ok(!banyumasPayload.birthCity.includes('Jawa Timur'));
      assert.equal(banyumasPayload.timezone, 'Asia/Jakarta');
      assert.ok(banyumasPayload.latitude < -7.0 && banyumasPayload.latitude > -8.0);
      assert.ok(banyumasPayload.longitude > 108.5 && banyumasPayload.longitude < 110.0);

      // 2. SCENARIO: Search "Koba" -> Bangka Tengah, Kepulauan Bangka Belitung
      console.log(`[${mode}] Scenario 2: Search "Koba"`);
      await cityInput.fill('');
      await cityInput.pressSequentially('Koba', { delay: 60 });

      await suggestions.locator('.city-option').first().waitFor({ state: 'visible', timeout: 6000 });
      const kobaOptions = await suggestions.locator('.city-option').allTextContents();
      console.log(`[${mode}] Koba suggestions:`, kobaOptions);

      const topKoba = kobaOptions[0];
      assert.ok(topKoba.includes('Bangka Tengah'), 'Koba must be mapped to Bangka Tengah');
      assert.ok(topKoba.includes('Bangka Belitung'), 'Koba must be mapped to Bangka Belitung');

      await suggestions.locator('.city-option').first().click();

      capturedPayloads.length = 0;
      await submitBtn.click();
      await resultsWrapper.waitFor({ state: 'visible', timeout: 15000 });

      assert.equal(capturedPayloads.length, 1);
      const kobaPayload = capturedPayloads[0];
      console.log(`[${mode}] Koba payload sent to Engine:`, kobaPayload);
      assert.ok(kobaPayload.birthCity.includes('Bangka Tengah'));
      assert.ok(kobaPayload.birthCity.includes('Bangka Belitung'));
      assert.equal(kobaPayload.timezone, 'Asia/Jakarta');

      // 3. SCENARIO: Search "Tanjungpandan" (alias without space) -> Belitung
      console.log(`[${mode}] Scenario 3: Search "Tanjungpandan"`);
      await cityInput.fill('');
      await cityInput.pressSequentially('Tanjungpandan', { delay: 60 });

      await suggestions.locator('.city-option').first().waitFor({ state: 'visible', timeout: 6000 });
      const tjOptions = await suggestions.locator('.city-option').allTextContents();
      console.log(`[${mode}] Tanjungpandan suggestions:`, tjOptions);

      const topTj = tjOptions[0];
      assert.ok(topTj.includes('Belitung'), 'Tanjungpandan must match Belitung');

      await suggestions.locator('.city-option').first().click();

      capturedPayloads.length = 0;
      await submitBtn.click();
      await resultsWrapper.waitFor({ state: 'visible', timeout: 15000 });

      assert.equal(capturedPayloads.length, 1);
      const tjPayload = capturedPayloads[0];
      console.log(`[${mode}] Tanjung Pandan payload sent to Engine:`, tjPayload);
      assert.ok(tjPayload.birthCity.includes('Belitung'));
      assert.ok(tjPayload.birthCity.includes('Bangka Belitung'));
      assert.equal(tjPayload.timezone, 'Asia/Jakarta');

      // 4. SCENARIO: Search non-existent location -> No silent fallback
      console.log(`[${mode}] Scenario 4: Search non-existent "Kota Atlantis Fiktif"`);
      await cityInput.fill('');
      await cityInput.pressSequentially('Kota Atlantis Fiktif', { delay: 60 });

      const noResults = suggestions.locator('.city-no-results');
      await noResults.waitFor({ state: 'visible', timeout: 6000 });
      const noResText = await noResults.textContent();
      console.log(`[${mode}] Empty state message:`, noResText);

      assert.ok(noResText.includes('tidak ditemukan'), 'Clear not found message must be shown');

      assert.equal(pageErrors.length, 0, `Page errors: ${pageErrors.join(', ')}`);
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
});
