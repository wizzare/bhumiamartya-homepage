import assert from 'node:assert/strict';
import { createServer, get } from 'node:http';
import { readFile, realpath, stat, mkdir } from 'node:fs/promises';
import { resolve, relative, sep, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { Script } from 'node:vm';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = await realpath(resolve(dirname(fileURLToPath(import.meta.url)), '../../..'));
const output = resolve(root, 'docs/homepage-redesign/phase2');
assert((await stat(dirname(output))).isDirectory());
await mkdir(output, { recursive: true });
assert.equal(await realpath(output), output);

const inside = path => {
  const rel = relative(root, path);
  return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !resolve(path).startsWith('\\\\'));
};

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

async function locate(url) {
  const path = decodeURIComponent(url.split('?')[0]);
  if (!path.startsWith('/') || /[\\\x00:]/.test(path) || path.split('/').some(x => x === '..' || x.startsWith('.')) || /^\/(api|node_modules|lib|tests?|docs)(\/|$)/.test(path)) {
    throw Error('Denied');
  }
  let file = resolve(root, `.${path}`);
  if (!inside(file)) throw Error('Denied');
  if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
  file = await realpath(file);
  if (!inside(file) || !(await stat(file)).isFile()) throw Error('Denied');
  return file;
}

const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405).end();
    return;
  }
  try {
    const file = await locate(req.url);
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not available on baseline static server');
  }
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const evidence = {
  capturedAt: new Date().toISOString(),
  phase: 'Phase 2 — Hero Redesign',
  node: process.version,
  sourceSha256: createHash('sha256').update(await readFile(resolve(root, 'index.html'))).digest('hex'),
  checks: [],
  copyAnalysis: {},
  contrastChecks: {},
  gitComparison: {},
  console: [],
  pageErrors: [],
  failures: [],
  blockedExternal: [],
  viewports: []
};

const check = (name, passed, detail, category = 'phase2') => {
  evidence.checks.push({ name, passed: Boolean(passed), detail, category });
};

let browser;
try {
  // 1. Static server guard checks
  for (const path of ['/%2e%2e/package.json', '/..%5cpackage.json', '/.env.local', '/api/bhumi-articles']) {
    assert.equal(await new Promise((resolve, reject) => get(origin, { path }, res => { res.resume(); resolve(res.statusCode); }).on('error', reject)), 404);
  }
  assert.equal((await fetch(origin, { method: 'POST' })).status, 405);
  check('Server traversal/private/API/mutation guards', true, { origin });

  // 2. Git comparison outside hero/navbar to HEAD
  const headIndex = execSync('git show HEAD:index.html', { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
  const currentIndex = (await readFile(resolve(root, 'index.html'), 'utf8')).replace(/\r\n/g, '\n');

  const extractJsonLd = html => {
    const start = html.indexOf('<script type="application/ld+json">');
    const end = html.indexOf('</script>', start);
    return html.slice(start, end + 9);
  };
  const headLd = extractJsonLd(headIndex);
  const currentLd = extractJsonLd(currentIndex);
  const jsonLdIdentical = headLd === currentLd;
  check('Metadata JSON-LD identical to HEAD', jsonLdIdentical, { headLdLength: headLd.length, currentLdLength: currentLd.length });

  const extractHeadPreStyle = html => {
    const start = html.indexOf('<head>');
    const end = html.indexOf('<style>');
    return html.slice(start, end);
  };
  const preStyleIdentical = extractHeadPreStyle(headIndex) === extractHeadPreStyle(currentIndex);
  check('Head metadata prior to style identical to HEAD', preStyleIdentical);

  const aboutStartHead = headIndex.indexOf('<section class="about-section"');
  const scriptStartHead = headIndex.indexOf('<script>\n        // --- DATA & STATE MANAGEMENT ---');
  const aboutStartCurr = currentIndex.indexOf('<section class="about-section"');
  const scriptStartCurr = currentIndex.indexOf('<script>\n        // --- DATA & STATE MANAGEMENT ---');
  const sectionsIdentical = headIndex.slice(aboutStartHead, scriptStartHead) === currentIndex.slice(aboutStartCurr, scriptStartCurr);
  check('Sections from about to footer markup identical to HEAD', sectionsIdentical);

  const menuCommentHead = headIndex.indexOf('// --- HAMBURGER MENU ---');
  const menuCommentCurr = currentIndex.indexOf('// --- HAMBURGER MENU ---');
  const preMenuScriptIdentical = headIndex.slice(scriptStartHead, menuCommentHead) === currentIndex.slice(scriptStartCurr, menuCommentCurr);
  check('Scripts prior to hamburger menu identical to HEAD', preMenuScriptIdentical);

  const afterNavHead = headIndex.indexOf('// --- RIPPLE EFFECT ON BUTTONS ---');
  const afterNavCurr = currentIndex.indexOf('// --- RIPPLE EFFECT ON BUTTONS ---');
  const postNavScriptIdentical = headIndex.slice(afterNavHead) === currentIndex.slice(afterNavCurr);
  check('Scripts from ripple effect to end identical to HEAD', postNavScriptIdentical);

  evidence.gitComparison = {
    jsonLdIdentical,
    preStyleIdentical,
    sectionsIdentical,
    preMenuScriptIdentical,
    postNavScriptIdentical
  };

  // Launch Chromium
  browser = await chromium.launch({ headless: true });
  evidence.chromium = browser.version();

  const context = await browser.newContext({
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 1,
    serviceWorkers: 'block'
  });

  await context.route('**/*', route => {
    const request = route.request();
    if (new URL(request.url()).origin !== origin || !['GET', 'HEAD'].includes(request.method())) {
      evidence.blockedExternal.push({ url: request.url(), method: request.method() });
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });

  const page = await context.newPage();
  page.on('console', msg => {
    if (['error', 'warning'].includes(msg.type())) {
      evidence.console.push({ type: msg.type(), text: msg.text(), location: msg.location() });
    }
  });
  page.on('pageerror', error => evidence.pageErrors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) {
      evidence.failures.push({ url: response.url(), status: response.status() });
    }
  });

  await page.goto(origin, { waitUntil: 'networkidle' });
  await page.locator('#article-container').getByText('Artikel terbaru sedang belum dapat dimuat.', { exact: false }).waitFor();

  // 3. DOM & Hero Structural Verification
  evidence.sourceDom = await page.evaluate(html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return {
      sections: doc.querySelectorAll('section').length,
      headings: [...doc.querySelectorAll('h1,h2,h3,h4,h5,h6')].reduce((a, h) => (a[h.tagName] = (a[h.tagName] || 0) + 1, a), {}),
      links: doc.querySelectorAll('a[href]').length,
      buttons: doc.querySelectorAll('button').length,
      ctas: doc.querySelectorAll('a.btn,button.btn').length
    };
  }, await readFile(resolve(root, 'index.html'), 'utf8'));

  const h1Elements = await page.locator('h1').all();
  const h1Count = h1Elements.length;
  const h1Text = h1Count > 0 ? (await h1Elements[0].textContent()).trim() : '';
  check('Exactly one H1 element', h1Count === 1, { h1Count, h1Text });
  check('H1 text exact match "Ruang untuk Pulang dan Kenali Diri"', h1Text === 'Ruang untuk Pulang dan Kenali Diri', { h1Text });

  // Hero CTAs verification
  const primaryCta = page.locator('#hero-primary-cta');
  const appCta = page.locator('#hero-app-cta');

  const primaryCtaInfo = await primaryCta.evaluate(el => ({
    tag: el.tagName,
    href: el.getAttribute('href'),
    text: el.textContent.trim(),
    classes: [...el.classList],
    id: el.id,
    box: el.getBoundingClientRect()
  }));

  const appCtaInfo = await appCta.evaluate(el => ({
    tag: el.tagName,
    href: el.getAttribute('href'),
    text: el.textContent.trim(),
    classes: [...el.classList],
    id: el.id,
    box: el.getBoundingClientRect()
  }));

  check('Hero primary CTA exists with exact route "/tes-kenali-diri/"',
    primaryCtaInfo.tag === 'A' &&
    primaryCtaInfo.href === '/tes-kenali-diri/' &&
    primaryCtaInfo.text === 'Kenali Diri Saya' &&
    primaryCtaInfo.classes.includes('btn-primary'),
    primaryCtaInfo
  );

  check('Hero secondary CTA exists with exact Play URL',
    appCtaInfo.tag === 'A' &&
    appCtaInfo.href === 'https://play.google.com/store/apps/details?id=com.bhumiamartya.app' &&
    appCtaInfo.text === 'Download Aplikasi' &&
    appCtaInfo.classes.includes('btn-secondary'),
    appCtaInfo
  );

  // Copy text analysis and deviation reporting
  const heroCopy = await page.evaluate(() => {
    const supporting = document.querySelector('.hero-section .hero-supporting')?.textContent.trim() || '';
    const subheadline = document.querySelector('.hero-section .hero-subheadline')?.textContent.trim() || '';
    return { supporting, subheadline };
  });

  const preferredCopy = {
    supporting: 'Kenali pola dirimu, potensi, hubungan, dan arah pertumbuhanmu dalam satu tempat.',
    paragraph: 'Bhumi membantu kamu memahami berbagai peta diri dan menerjemahkannya menjadi insight yang lebih mudah dipahami dan digunakan dalam kehidupan sehari-hari.'
  };

  const copyDeviations = {
    preferred: preferredCopy,
    actual: heroCopy,
    supportingMatchesPreferred: heroCopy.supporting === preferredCopy.supporting,
    paragraphMatchesPreferred: heroCopy.subheadline === preferredCopy.paragraph,
    deviations: []
  };

  if (!copyDeviations.supportingMatchesPreferred) {
    copyDeviations.deviations.push({
      field: 'hero-supporting',
      preferred: preferredCopy.supporting,
      actual: heroCopy.supporting,
      difference: 'Actual source retains placeholder "Jelajahi berbagai sudut pandang untuk refleksi diri." instead of canonical value proposition.'
    });
  }
  if (!copyDeviations.paragraphMatchesPreferred) {
    copyDeviations.deviations.push({
      field: 'hero-subheadline',
      preferred: preferredCopy.paragraph,
      actual: heroCopy.subheadline,
      difference: 'Actual source retains legacy text containing "spiritualitas modern, dan teknologi..." instead of canonical insight/daily-life translation copy.'
    });
  }
  evidence.copyAnalysis = copyDeviations;
  // Report deviation as an informative check (reported, not masked)
  check('Hero copy reflects requested user canonical copy', copyDeviations.supportingMatchesPreferred && copyDeviations.paragraphMatchesPreferred, copyDeviations);

  // Text contrast calculations
  function parseRgb(colorStr) {
    const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return [0, 0, 0];
    return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
  }
  function relLuminance([r, g, b]) {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
  function contrastRatio(c1, c2) {
    const l1 = relLuminance(c1);
    const l2 = relLuminance(c2);
    const bright = Math.max(l1, l2);
    const dark = Math.min(l1, l2);
    return (bright + 0.05) / (dark + 0.05);
  }

  const contrastData = await page.evaluate(() => {
    const getBg = el => {
      let cur = el;
      while (cur && cur !== document.body) {
        const bg = getComputedStyle(cur).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
        cur = cur.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor || 'rgb(250, 248, 245)';
    };
    const headline = document.querySelector('.hero-headline');
    const supporting = document.querySelector('.hero-supporting');
    const subheadline = document.querySelector('.hero-subheadline');
    const btnPrimary = document.querySelector('#hero-primary-cta');
    const btnSecondary = document.querySelector('#hero-app-cta');

    return {
      headline: { color: getComputedStyle(headline).color, bg: getBg(headline) },
      supporting: { color: getComputedStyle(supporting).color, bg: getBg(supporting) },
      subheadline: { color: getComputedStyle(subheadline).color, bg: getBg(subheadline) },
      btnPrimary: { color: getComputedStyle(btnPrimary).color, bg: getComputedStyle(btnPrimary).backgroundColor },
      btnSecondary: { color: getComputedStyle(btnSecondary).color, bg: getBg(btnSecondary), border: getComputedStyle(btnSecondary).borderColor }
    };
  });

  const contrastResults = {
    headline: contrastRatio(parseRgb(contrastData.headline.color), parseRgb(contrastData.headline.bg)),
    supporting: contrastRatio(parseRgb(contrastData.supporting.color), parseRgb(contrastData.supporting.bg)),
    subheadline: contrastRatio(parseRgb(contrastData.subheadline.color), parseRgb(contrastData.subheadline.bg)),
    btnPrimary: contrastRatio(parseRgb(contrastData.btnPrimary.color), parseRgb(contrastData.btnPrimary.bg)),
    btnSecondary: contrastRatio(parseRgb(contrastData.btnSecondary.color), parseRgb(contrastData.btnSecondary.bg))
  };
  evidence.contrastChecks = { contrastData, contrastResults };

  check('Hero headline contrast >= 4.5:1 (WCAG AA)', contrastResults.headline >= 4.5, { ratio: contrastResults.headline.toFixed(2) });
  check('Hero supporting contrast >= 4.5:1 (WCAG AA)', contrastResults.supporting >= 4.5, { ratio: contrastResults.supporting.toFixed(2) });
  check('Hero subheadline contrast >= 4.5:1 (WCAG AA)', contrastResults.subheadline >= 4.5, { ratio: contrastResults.subheadline.toFixed(2) });
  check('Primary CTA button contrast >= 4.5:1 (WCAG AA)', contrastResults.btnPrimary >= 4.5, { ratio: contrastResults.btnPrimary.toFixed(2) });
  check('Secondary CTA button contrast >= 4.5:1 (WCAG AA)', contrastResults.btnSecondary >= 4.5, { ratio: contrastResults.btnSecondary.toFixed(2) });

  // Focus visible styles
  const focusVisibleChecks = await page.evaluate(() => {
    const btn = document.querySelector('#hero-primary-cta');
    btn.focus();
    const computed = getComputedStyle(btn);
    return {
      outlineWidth: computed.outlineWidth,
      outlineStyle: computed.outlineStyle,
      outlineColor: computed.outlineColor,
      outlineOffset: computed.outlineOffset
    };
  });
  check('Hero CTA focus outline configured', focusVisibleChecks.outlineWidth !== '0px' && focusVisibleChecks.outlineStyle !== 'none', focusVisibleChecks);

  // Same-document anchors & Static internal links
  evidence.anchors = await page.locator('a[href]').evaluateAll(nodes => nodes.map(x => ({ href: x.getAttribute('href'), text: x.textContent.trim() })).filter(x => x.href.startsWith('#')).map(x => ({ ...x, exists: x.href === '#' || Boolean(document.getElementById(decodeURIComponent(x.href.slice(1)))) })));
  check('Same-document anchor targets', evidence.anchors.every(x => x.exists), evidence.anchors);

  const links = await page.locator('a[href]').evaluateAll(nodes => [...new Set(nodes.map(x => x.getAttribute('href')))]);
  evidence.internalLinks = [];
  for (const href of links) {
    const url = new URL(href, origin);
    if (![new URL(origin).hostname, 'bhumiamartya.my.id', 'www.bhumiamartya.my.id'].includes(url.hostname) || !['http:', 'https:'].includes(url.protocol)) continue;
    try {
      await locate(url.pathname);
      evidence.internalLinks.push({ href, exists: true });
    } catch {
      evidence.internalLinks.push({ href, exists: false });
    }
  }
  check('Static internal link existence (no deployment rewrites)', evidence.internalLinks.every(x => x.exists), evidence.internalLinks.filter(x => !x.exists));

  // 4. Viewport captures and responsiveness checks (375, 390, 768, 1024, 1440)
  for (const width of [375, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (let y = 0; y < await page.evaluate(() => document.documentElement.scrollHeight); y += 650) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    const screenshotPath = resolve(output, `homepage-${width}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true, animations: 'disabled' });

    const vpInfo = await page.evaluate(() => {
      const pCta = document.querySelector('#hero-primary-cta');
      const sCta = document.querySelector('#hero-app-cta');
      const pRect = pCta ? pCta.getBoundingClientRect() : null;
      const sRect = sCta ? sCta.getBoundingClientRect() : null;
      return {
        width: innerWidth,
        height: innerHeight,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        hasHorizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        primaryCtaHeight: pRect ? pRect.height : 0,
        primaryCtaWidth: pRect ? pRect.width : 0,
        secondaryCtaHeight: sRect ? sRect.height : 0,
        secondaryCtaWidth: sRect ? sRect.width : 0,
        ctaStackedVertically: pRect && sRect ? sRect.top >= pRect.bottom - 2 : false
      };
    });
    evidence.viewports.push(vpInfo);

    check(`Viewport ${width}px: zero horizontal overflow`, !vpInfo.hasHorizontalOverflow, { scrollWidth: vpInfo.scrollWidth, innerWidth: vpInfo.width });
    check(`Viewport ${width}px: CTA touch targets >= 44px height`, vpInfo.primaryCtaHeight >= 44 && vpInfo.secondaryCtaHeight >= 44, { pHeight: vpInfo.primaryCtaHeight, sHeight: vpInfo.secondaryCtaHeight });
    if (width <= 480) {
      check(`Viewport ${width}px: mobile CTAs stack vertically full width`, vpInfo.ctaStackedVertically && vpInfo.primaryCtaWidth >= width * 0.8, { pWidth: vpInfo.primaryCtaWidth, stacked: vpInfo.ctaStackedVertically });
    }
  }

  // 5. Navbar and Mobile Menu Accessibility Checks
  await page.setViewportSize({ width: 390, height: 900 });
  const menu = page.locator('#burger-menu');
  const navMenu = page.locator('#nav-menu');

  // Initial burger state
  const initialBurger = await menu.evaluate(el => ({
    ariaExpanded: el.getAttribute('aria-expanded'),
    ariaControls: el.getAttribute('aria-controls'),
    ariaLabel: el.getAttribute('aria-label'),
    type: el.getAttribute('type'),
    rect: el.getBoundingClientRect()
  }));

  check('Burger button has aria-expanded="false" initially', initialBurger.ariaExpanded === 'false', initialBurger);
  check('Burger button has aria-controls="nav-menu"', initialBurger.ariaControls === 'nav-menu', initialBurger);
  check('Burger button has aria-label="Menu navigasi"', initialBurger.ariaLabel === 'Menu navigasi', initialBurger);
  check('Burger button has type="button"', initialBurger.type === 'button', initialBurger);
  check('Burger button touch target >= 44x44px', initialBurger.rect.width >= 44 && initialBurger.rect.height >= 44, initialBurger.rect);

  // Click opens menu
  await menu.click();
  check('Menu click opens nav-menu', await navMenu.evaluate(x => x.classList.contains('open')));
  check('Burger button exposes aria-expanded="true" when open', await menu.getAttribute('aria-expanded') === 'true');

  // Escape closes menu and restores focus
  await page.keyboard.press('Escape');
  check('Escape key closes mobile menu', await navMenu.evaluate(x => !x.classList.contains('open')));
  check('Burger button exposes aria-expanded="false" after Escape', await menu.getAttribute('aria-expanded') === 'false');
  check('Escape restores focus to burger button', await page.evaluate(() => document.activeElement.id === 'burger-menu'));

  // Enter opens menu
  await menu.focus();
  await page.keyboard.press('Enter');
  check('Menu Enter key opens nav-menu', await navMenu.evaluate(x => x.classList.contains('open')));
  check('Burger button aria-expanded="true" after Enter', await menu.getAttribute('aria-expanded') === 'true');

  // Space closes menu
  await menu.press('Space');
  check('Menu Space key closes nav-menu', await navMenu.evaluate(x => !x.classList.contains('open')));
  check('Burger button aria-expanded="false" after Space', await menu.getAttribute('aria-expanded') === 'false');

  // Check nav-menu inert when closed on mobile
  check('Nav menu inert when closed on mobile', await navMenu.evaluate(x => x.inert === true));

  // Dropdown keyboard and ARIA checks
  const dropdownToggle = page.locator('.dropdown-toggle').first();
  const dropdownMenuId = await dropdownToggle.getAttribute('aria-controls');
  const dropdownRole = await dropdownToggle.getAttribute('role');
  check('Dropdown toggle has aria-controls matching submenu id', Boolean(dropdownMenuId && await page.locator(`#${dropdownMenuId}`).count() > 0), { dropdownMenuId });
  check('Dropdown toggle has role="button"', dropdownRole === 'button');

  // Open menu then toggle dropdown with Space
  await menu.click();
  await dropdownToggle.focus();
  await page.keyboard.press('Space');
  check('Dropdown Space toggles aria-expanded="true"', await dropdownToggle.getAttribute('aria-expanded') === 'true');

  // Escape closes dropdown and refocuses toggle
  await page.keyboard.press('Escape');
  check('Dropdown Escape closes aria-expanded to "false"', await dropdownToggle.getAttribute('aria-expanded') === 'false');
  check('Dropdown Escape restores focus to toggle', await page.evaluate(toggleId => document.activeElement.getAttribute('aria-controls') === toggleId, dropdownMenuId));

  // Close nav menu for subsequent checks
  await page.keyboard.press('Escape');

  // 6. Consent & Local GA4 Guard on Local Origin (127.0.0.1)
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

  // Trigger hero CTA on local origin: REAL helper host guard must block config/events/scripts
  await page.evaluate(() => window.addEventListener('click', e => e.preventDefault(), true));
  await page.locator('#hero-primary-cta').click();
  evidence.localAnalytics = await page.evaluate(() => ({
    dataLayer: window.dataLayer ? window.dataLayer.map(x => [...x]) : [],
    googleScripts: [...document.scripts].filter(x => /googletagmanager/.test(x.src)).map(x => x.src)
  }));
  check('Local origin host guard: no config/events/scripts',
    !evidence.localAnalytics.googleScripts.length &&
    evidence.localAnalytics.dataLayer.every(x => !['event', 'config'].includes(x[0])),
    evidence.localAnalytics
  );

  // 7. REAL helper in isolated mocked production hostname environment
  const prodContext = await browser.newContext({
    viewport: { width: 390, height: 900 },
    deviceScaleFactor: 1,
    serviceWorkers: 'block'
  });

  const interceptedAnalyticsEvents = [];
  const blockedGtagRequests = [];

  // Route production domain to local static server and intercept gtag
  await prodContext.route('**/*', async route => {
    const req = route.request();
    const url = new URL(req.url());

    if (url.hostname === 'www.googletagmanager.com' || url.hostname === 'region1.google-analytics.com') {
      blockedGtagRequests.push({ url: req.url(), method: req.method() });
      return route.fulfill({
        status: 200,
        contentType: 'text/javascript',
        body: 'window.__gtag_mock_loaded = true;'
      });
    }

    if (['bhumiamartya.my.id', 'www.bhumiamartya.my.id'].includes(url.hostname)) {
      try {
        const filePath = await locate(url.pathname);
        const body = await readFile(filePath);
        return route.fulfill({
          status: 200,
          contentType: types[extname(filePath)] || 'application/octet-stream',
          body
        });
      } catch {
        return route.fulfill({ status: 404, contentType: 'text/plain', body: 'Not found' });
      }
    }

    // All other external requests blocked
    return route.abort('blockedbyclient');
  });

  const prodPage = await prodContext.newPage();
  await prodPage.goto('https://www.bhumiamartya.my.id/', { waitUntil: 'networkidle' });
  // Prevent actual navigation during click testing while allowing event handlers to fire
  await prodPage.evaluate(() => window.addEventListener('click', e => e.preventDefault(), true));

  // A. Pre-consent state: CTA clicks must not emit events
  await prodPage.locator('#hero-primary-cta').click();
  const preConsentEvents = await prodPage.evaluate(() => (window.dataLayer || []).filter(x => x[0] === 'event'));
  check('Mocked prod: Pre-consent CTA click emits zero events', preConsentEvents.length === 0, { preConsentEvents });

  // B. Rejection state: Reject consent -> CTA clicks must not emit events
  await prodPage.locator('[data-choice="rejected"]').first().click();
  await prodPage.locator('#hero-primary-cta').click();
  await prodPage.locator('#hero-app-cta').click();
  const rejectedEvents = await prodPage.evaluate(() => (window.dataLayer || []).filter(x => x[0] === 'event'));
  check('Mocked prod: Rejected consent CTA clicks emit zero events', rejectedEvents.length === 0, { rejectedEvents });

  // C. Acceptance state: Manage consent -> Accept
  await prodPage.locator('.bhumi-consent-manage').click();
  await prodPage.locator('[data-choice="accepted"]').click();
  await prodPage.waitForTimeout(100);

  // Click primary CTA
  await prodPage.locator('#hero-primary-cta').click();

  // Click secondary CTA
  await prodPage.locator('#hero-app-cta').click();

  const acceptedEvents = await prodPage.evaluate(() => (window.dataLayer || []).filter(x => x[0] === 'event').map(x => [...x]));
  const primaryEvent = acceptedEvents.find(x => x[1] === 'homepage_primary_cta_click');
  const appEvent = acceptedEvents.find(x => x[1] === 'homepage_app_download_click');

  check('Mocked prod: Primary CTA click emits homepage_primary_cta_click with exact schema',
    Boolean(primaryEvent &&
      primaryEvent[2]?.section === 'hero' &&
      primaryEvent[2]?.item_name === 'kenali_diri' &&
      primaryEvent[2]?.item_type === 'primary_cta' &&
      primaryEvent[2]?.destination === '/tes-kenali-diri/' &&
      primaryEvent[2]?.consent_state === 'granted' &&
      primaryEvent[2]?.page_type === 'homepage'
    ),
    primaryEvent
  );

  check('Mocked prod: Secondary CTA click emits homepage_app_download_click with exact schema',
    Boolean(appEvent &&
      appEvent[2]?.section === 'hero' &&
      appEvent[2]?.item_name === 'android_app' &&
      appEvent[2]?.item_type === 'secondary_cta' &&
      appEvent[2]?.destination === 'https://play.google.com/store/apps/details?id=com.bhumiamartya.app' &&
      appEvent[2]?.consent_state === 'granted' &&
      appEvent[2]?.page_type === 'homepage'
    ),
    appEvent
  );

  // D. Revocation state: Revoke consent -> CTA clicks must stop emitting
  await prodPage.locator('.bhumi-consent-manage').click();
  await prodPage.locator('[data-choice="rejected"]').first().click();

  const eventCountAtRevocation = (await prodPage.evaluate(() => (window.dataLayer || []).filter(x => x[0] === 'event'))).length;
  await prodPage.locator('#hero-primary-cta').click();
  await prodPage.locator('#hero-app-cta').click();
  const eventCountAfterClicks = (await prodPage.evaluate(() => (window.dataLayer || []).filter(x => x[0] === 'event'))).length;

  check('Mocked prod: Revoked consent stops subsequent CTA tracking',
    eventCountAfterClicks === eventCountAtRevocation,
    { eventCountAtRevocation, eventCountAfterClicks }
  );

  await prodContext.close();

  // 8. Legacy Baseline Video Modal Checks (Classified as Existing Baseline Defects)
  const trigger = page.locator('.video-card .video-placeholder').first();
  await trigger.scrollIntoViewIfNeeded();
  evidence.videoTrigger = await trigger.evaluate(x => ({ tag: x.tagName, tabindex: x.tabIndex, role: x.getAttribute('role') }));

  await page.evaluate(() => document.activeElement.blur());
  await trigger.evaluate(x => x.focus());
  await page.keyboard.press('Enter');
  const videoKeyboardOpens = await page.locator('#video-modal').evaluate(x => x.classList.contains('open'));
  check('Video trigger keyboard opens modal [LEGACY BASELINE DEFECT]', videoKeyboardOpens, evidence.videoTrigger, 'legacy_defect');

  await trigger.click();
  check('Video click opens modal', await page.locator('#video-modal').getAttribute('aria-hidden') === 'false');

  const focusInsideModal = await page.evaluate(() => document.querySelector('#video-modal').contains(document.activeElement));
  check('Modal focus moves inside [LEGACY BASELINE DEFECT]', focusInsideModal, { activeElement: await page.evaluate(() => document.activeElement.tagName) }, 'legacy_defect');

  const modalSemantics = await page.locator('#video-modal').getAttribute('role') === 'dialog' && await page.locator('#video-modal').getAttribute('aria-modal') === 'true';
  check('Modal dialog semantics [LEGACY BASELINE DEFECT]', modalSemantics, {}, 'legacy_defect');

  await page.keyboard.press('Tab');
  const tabRemainsInside = await page.evaluate(() => document.querySelector('#video-modal').contains(document.activeElement));
  check('Modal Tab remains inside [LEGACY BASELINE DEFECT]', tabRemainsInside, {}, 'legacy_defect');

  await page.keyboard.press('Escape');
  check('Modal Escape closes and clears iframe',
    await page.locator('#video-modal').getAttribute('aria-hidden') === 'true' &&
    await page.locator('#video-modal-iframe').getAttribute('src') === ''
  );

  await trigger.click();
  await page.locator('#video-modal-close').click();
  check('Modal close button click', await page.locator('#video-modal').getAttribute('aria-hidden') === 'true');

  await trigger.click();
  await page.locator('#video-modal-overlay').click({ position: { x: 5, y: 5 } });
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
