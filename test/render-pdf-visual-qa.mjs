import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

// We will use local static server like browser test to generate the exact PDF via the page
const PORT = 4185;
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  const filePath = path.join(process.cwd(), reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, async () => {
  console.log(`QA Visual Server listening on http://localhost:${PORT}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  console.log('Generating couple report on http://localhost:4185/matrixcompability/ ...');
  await page.goto(`http://localhost:${PORT}/matrixcompability/`, { waitUntil: 'domcontentloaded' });

  // Fill in couple data
  await page.fill('#male-name', 'Widhi Wedhaswara');
  await page.fill('#male-birth', '1985-05-03');
  await page.fill('#male-time', '23:45');
  await page.fill('#male-city', 'Jakarta');

  await page.fill('#female-name', 'Ayu Kartika');
  await page.fill('#female-birth', '1988-10-17');
  await page.fill('#female-time', '10:15');
  await page.fill('#female-city', 'Bandung');

  await page.click('button[type="submit"]');
  await page.waitForSelector('#matrix-results.show', { timeout: 10000 });

  // Trigger PDF download
  console.log('Downloading PDF report...');
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 15000 }),
    page.click('#btn-download-couple-pdf')
  ]);

  const pdfPath = path.resolve('./temp-visual-qa.pdf');
  await download.saveAs(pdfPath);
  const pdfBytes = fs.readFileSync(pdfPath);
  console.log(`PDF downloaded: ${pdfPath} (${pdfBytes.length} bytes)`);

  const outputDir = path.resolve('./test/pdf-visual-qa-output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Now render each page using PDF.js inside a page
  console.log('Rendering all pages as high-resolution images via PDF.js...');
  const renderPage = await context.newPage();
  const pdfBase64 = pdfBytes.toString('base64');

  await renderPage.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
      <style>
        body { margin: 0; background: #222; display: flex; flex-direction: column; align-items: center; gap: 20px; padding: 20px; }
        canvas { background: white; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
      </style>
    </head>
    <body>
      <div id="container"></div>
      <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const pdfData = atob('${pdfBase64}');
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        window.renderAllPages = async function() {
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;
          window.renderedPages = [];
          for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const scale = 2.0; // High-DPI 2x scale
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            canvas.id = 'page-' + pageNum;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            document.getElementById('container').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            window.renderedPages.push({
              pageNum,
              width: viewport.width,
              height: viewport.height
            });
          }
          return { numPages: numPages, pages: window.renderedPages };
        };
      </script>
    </body>
    </html>
  `);

  const renderResult = await renderPage.evaluate(async () => {
    return await window.renderAllPages();
  });

  console.log(`PDF has ${renderResult.numPages} rendered pages.`);

  const renderedImagePaths = [];
  for (let i = 1; i <= renderResult.numPages; i++) {
    const canvasHandle = await renderPage.$(`#page-${i}`);
    const outImgPath = path.join(outputDir, `page-${i}.png`);
    await canvasHandle.screenshot({ path: outImgPath });
    renderedImagePaths.push(outImgPath);
    console.log(`Saved Page ${i} screenshot: ${outImgPath}`);
  }

  // Clean up temp pdf
  try { fs.unlinkSync(pdfPath); } catch {}

  await browser.close();
  server.close();
  console.log('Visual QA rendering complete!');
});
