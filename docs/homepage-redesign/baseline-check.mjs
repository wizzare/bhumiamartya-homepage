import assert from 'node:assert/strict';
import { createServer, get } from 'node:http';
import { readFile, realpath, stat, mkdir } from 'node:fs/promises';
import { resolve, relative, sep, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Script } from 'node:vm';
import { createHash } from 'node:crypto';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '../..'));
const output = resolve(root, 'docs/homepage-redesign/baseline');
assert((await stat(dirname(output))).isDirectory());
await mkdir(output, { recursive: true });
assert.equal(await realpath(output), output);
const inside = path => { const rel = relative(root, path); return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !resolve(path).startsWith('\\\\')); };
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff2': 'font/woff2' };
async function locate(url) {
  const path = decodeURIComponent(url.split('?')[0]);
  if (!path.startsWith('/') || /[\\\x00:]/.test(path) || path.split('/').some(x => x === '..' || x.startsWith('.')) || /^\/(api|node_modules|lib|tests?|docs)(\/|$)/.test(path)) throw Error('Denied');
  let file = resolve(root, `.${path}`);
  if (!inside(file)) throw Error('Denied');
  if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
  file = await realpath(file);
  if (!inside(file) || !(await stat(file)).isFile()) throw Error('Denied');
  return file;
}
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
  try {
    const file = await locate(req.url);
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not available on baseline static server'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const evidence = { capturedAt: new Date().toISOString(), node: process.version, sourceSha256: createHash('sha256').update(await readFile(resolve(root, 'index.html'))).digest('hex'), checks: [], console: [], pageErrors: [], failures: [], blockedExternal: [], viewports: [] };
const check = (name, passed, detail) => evidence.checks.push({ name, passed: Boolean(passed), detail });
let browser;
try {
  for (const path of ['/%2e%2e/package.json', '/..%5cpackage.json', '/.env.local', '/api/bhumi-articles']) assert.equal(await new Promise((resolve, reject) => get(origin, { path }, res => { res.resume(); resolve(res.statusCode); }).on('error', reject)), 404);
  assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
  check('Server traversal/private/API/mutation guards', true);
  browser = await chromium.launch({ headless: true });
  evidence.chromium = browser.version();
  const context = await browser.newContext({ viewport: { width: 390, height: 900 }, deviceScaleFactor: 1, serviceWorkers: 'block' });
  await context.route('**/*', route => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin || !['GET', 'HEAD'].includes(request.method())) {
      evidence.blockedExternal.push({ url: request.url(), method: request.method() });
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });
  const page = await context.newPage();
  page.on('console', msg => { if (['error', 'warning'].includes(msg.type())) evidence.console.push({ type: msg.type(), text: msg.text(), location: msg.location() }); });
  page.on('pageerror', error => evidence.pageErrors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) evidence.failures.push({ url: response.url(), status: response.status() }); });
  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.locator('#article-container').getByText('Artikel terbaru sedang belum dapat dimuat.', { exact: false }).waitFor();
  evidence.dom = await page.evaluate(() => {
    const source = new DOMParser().parseFromString(document.documentElement.outerHTML, 'text/html');
    const summarize = doc => ({ sections: [...doc.querySelectorAll('section')].map(x => x.id || x.className), headings: [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(x => ({ level: x.tagName, text: x.textContent.trim() })), links: doc.querySelectorAll('a[href]').length, buttons: doc.querySelectorAll('button').length, ctas: [...doc.querySelectorAll('a.btn,button.btn')].map(x => ({ text: x.textContent.trim(), href: x.getAttribute('href') })) });
    return summarize(source);
  });
  evidence.sourceDom = await page.evaluate(html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return { sections: doc.querySelectorAll('section').length, headings: [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].reduce((a, h) => (a[h.tagName] = (a[h.tagName] || 0) + 1, a), {}), links: doc.querySelectorAll('a[href]').length, buttons: doc.querySelectorAll('button').length, ctas: doc.querySelectorAll('a.btn,button.btn').length };
  }, await readFile(resolve(root, 'index.html'), 'utf8'));
  check('Exactly one source H1', evidence.sourceDom.headings.H1 === 1, evidence.sourceDom);
  const scripts = await page.locator('script:not([src])').evaluateAll(nodes => nodes.map(x => ({ type: x.type, text: x.textContent })));
  for (const [i, script] of scripts.entries()) {
    try { if (script.type === 'application/ld+json') { const json = JSON.parse(script.text); check(`JSON-LD ${i}`, true, json['@graph']?.map(x => x['@type'])); } else { new Script(script.text); check(`Inline JS syntax ${i}`, true); } } catch (error) { check(`Script ${i}`, false, error.message); }
  }
  const handlers = await page.locator('*').evaluateAll(nodes => nodes.flatMap(x => [...x.attributes].filter(a => a.name.startsWith('on')).map(a => a.value)));
  for (const handler of handlers) new Script(`(function(event){${handler}\n})`);
  check('Inline handler syntax', true, { count: handlers.length });
  evidence.anchors = await page.locator('a[href]').evaluateAll(nodes => nodes.map(x => ({ href: x.getAttribute('href'), text: x.textContent.trim() })).filter(x => x.href.startsWith('#')).map(x => ({ ...x, exists: x.href === '#' || Boolean(document.getElementById(decodeURIComponent(x.href.slice(1)))) })));
  check('Same-document anchor targets', evidence.anchors.every(x => x.exists), evidence.anchors);
  const links = await page.locator('a[href]').evaluateAll(nodes => [...new Set(nodes.map(x => x.getAttribute('href')))]);
  evidence.internalLinks = [];
  for (const href of links) {
    const url = new URL(href, origin);
    if (![new URL(origin).hostname, 'bhumiamartya.my.id', 'www.bhumiamartya.my.id'].includes(url.hostname) || !['http:', 'https:'].includes(url.protocol)) continue;
    try { await locate(url.pathname); evidence.internalLinks.push({ href, exists: true }); } catch { evidence.internalLinks.push({ href, exists: false }); }
  }
  check('Static internal link existence (no deployment rewrites)', evidence.internalLinks.every(x => x.exists), evidence.internalLinks.filter(x => !x.exists));
  for (const width of [375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 650) { await page.evaluate(y => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: resolve(output, `homepage-${width}.png`), fullPage: true, animations: 'disabled' });
    evidence.viewports.push(await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, consentVisible: Boolean(document.querySelector('.bhumi-consent')) })));
  }
  await page.setViewportSize({ width: 390, height: 900 });
  check('Consent initially denied', await page.evaluate(() => !BhumiConsent.hasAnalyticsConsent()));
  await page.locator('[data-choice="rejected"]').first().click();
  check('Consent denied persisted', await page.evaluate(() => localStorage.getItem('bhumi_consent_v1') === 'rejected' && BhumiConsent.get().analytics_storage === 'denied'));
  await page.reload({ waitUntil: 'networkidle' });
  check('Denied survives reload', await page.evaluate(() => !BhumiConsent.hasAnalyticsConsent() && !document.querySelector('.bhumi-consent')));
  await page.locator('.bhumi-consent-manage').click();
  await page.locator('[data-choice="accepted"]').press('Enter');
  check('Consent accepted via keyboard', await page.evaluate(() => localStorage.getItem('bhumi_consent_v1') === 'accepted' && BhumiConsent.get().analytics_storage === 'granted'));
  await page.reload({ waitUntil: 'networkidle' });
  check('Accepted survives reload', await page.evaluate(() => BhumiConsent.hasAnalyticsConsent() && !document.querySelector('.bhumi-consent')));
  await page.evaluate(() => BhumiAnalytics.track('navigation_click'));
  evidence.analytics = await page.evaluate(() => ({ dataLayer: dataLayer.map(x => [...x]), googleScripts: [...document.scripts].filter(x => /googletagmanager/.test(x.src)).map(x => x.src) }));
  check('Local GA4 guard: no config/events/scripts', !evidence.analytics.googleScripts.length && evidence.analytics.dataLayer.every(x => !['event', 'config'].includes(x[0])));
  await page.locator('.bhumi-consent-manage').click();
  await page.locator('[data-choice="rejected"]').first().click();
  check('Consent can be revoked', await page.evaluate(() => !BhumiConsent.hasAnalyticsConsent()));
  const menu = page.locator('#burger-menu');
  await menu.click();
  check('Menu click opens', await page.locator('#nav-menu').evaluate(x => x.classList.contains('open')));
  check('Menu exposes expanded state', await menu.getAttribute('aria-expanded') === 'true');
  await page.keyboard.press('Escape');
  check('Menu Escape closes', await page.locator('#nav-menu').evaluate(x => !x.classList.contains('open')));
  if (await page.locator('#nav-menu').evaluate(x => x.classList.contains('open'))) await menu.click();
  await menu.focus(); await menu.press('Enter');
  check('Menu Enter opens', await page.locator('#nav-menu').evaluate(x => x.classList.contains('open')));
  await menu.press('Space');
  check('Menu Space closes', await page.locator('#nav-menu').evaluate(x => !x.classList.contains('open')));
  const trigger = page.locator('.video-card .video-placeholder').first();
  await trigger.scrollIntoViewIfNeeded();
  evidence.videoTrigger = await trigger.evaluate(x => ({ tag: x.tagName, tabindex: x.tabIndex, role: x.getAttribute('role') }));
  await page.evaluate(() => document.activeElement.blur());
  await trigger.evaluate(x => x.focus()); await page.keyboard.press('Enter');
  check('Video trigger keyboard opens modal', await page.locator('#video-modal').evaluate(x => x.classList.contains('open')), evidence.videoTrigger);
  await trigger.click();
  check('Video click opens modal', await page.locator('#video-modal').getAttribute('aria-hidden') === 'false');
  check('Modal focus moves inside', await page.evaluate(() => document.querySelector('#video-modal').contains(document.activeElement)));
  check('Modal dialog semantics', await page.locator('#video-modal').getAttribute('role') === 'dialog' && await page.locator('#video-modal').getAttribute('aria-modal') === 'true');
  await page.keyboard.press('Tab');
  check('Modal Tab remains inside', await page.evaluate(() => document.querySelector('#video-modal').contains(document.activeElement)));
  await page.keyboard.press('Escape');
  check('Modal Escape closes and clears iframe', await page.locator('#video-modal').getAttribute('aria-hidden') === 'true' && await page.locator('#video-modal-iframe').getAttribute('src') === '');
  await trigger.click(); await page.locator('#video-modal-close').click();
  check('Modal close button click', await page.locator('#video-modal').getAttribute('aria-hidden') === 'true');
  await trigger.click(); await page.locator('#video-modal-overlay').click({ position: { x: 5, y: 5 } });
  check('Modal overlay click', await page.locator('#video-modal').getAttribute('aria-hidden') === 'true');
  check('No uncaught browser exceptions', !evidence.pageErrors.length, evidence.pageErrors);
  evidence.console = [...new Map(evidence.console.map(x => [x.text, x])).values()];
  evidence.failures = [...new Map(evidence.failures.map(x => [x.url, x])).values()];
  evidence.blockedExternal = [...new Map(evidence.blockedExternal.map(x => [x.url, x])).values()];
  console.log(JSON.stringify(evidence, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
assert(evidence.checks.every(x => x.passed), 'Baseline findings detected; review reported checks (source intentionally unchanged).');
