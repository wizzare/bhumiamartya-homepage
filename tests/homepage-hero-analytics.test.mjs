import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/bhumi-analytics.js', import.meta.url), 'utf8');
const primary = 'homepage_primary_cta_click';
const app = 'homepage_app_download_click';
const metadata = {
  [primary]: { section: 'hero', item_name: 'kenali_diri', item_type: 'primary_cta', destination: '/tes-kenali-diri/' },
  [app]: { section: 'hero', item_name: 'android_app', item_type: 'secondary_cta', destination: 'https://play.google.com/store/apps/details?id=com.bhumiamartya.app' }
};

function setup(host = 'bhumiamartya.my.id', consent = false) {
  const listeners = {};
  const scripts = [];
  const window = {
    location: { hostname: host, origin: `https://${host}`, pathname: '/', search: '?email=private@example.com' },
    BhumiConsent: { hasAnalyticsConsent: () => consent },
    addEventListener: (name, handler) => { listeners[name] = handler; }
  };
  const document = {
    createElement: tag => ({ tag }),
    head: { appendChild: script => scripts.push(script) },
    addEventListener: (name, handler) => { listeners[name] = handler; }
  };
  vm.runInNewContext(source, { window, document });
  return {
    window, scripts, listeners,
    track: (name, data) => window.BhumiAnalytics.track(name, data),
    ready: () => listeners.DOMContentLoaded(),
    consent(value) {
      consent = value;
      listeners['bhumi:consent']({ detail: { analytics_storage: value ? 'granted' : 'denied' } });
    },
    events: () => JSON.parse(JSON.stringify(window.dataLayer.filter(call => call[0] === 'event').map(call => Array.from(call))))
  };
}

for (const name of [primary, app]) {
  test(`${name}: exact parameters and one emission`, () => {
    const env = setup('www.bhumiamartya.my.id', true);
    env.ready();
    env.track(name, metadata[name]);
    assert.deepEqual(env.events().slice(1), [['event', name, { page_type: 'homepage', consent_state: 'granted', ...metadata[name] }]]);
    assert.equal(env.events().filter(event => event[1] === 'app_download_click').length, 0);
    assert.equal(env.events()[0][2].page_location, 'https://www.bhumiamartya.my.id/');
  });

  test(`${name}: rejects unknown fields, PII, queries and mismatched metadata`, () => {
    const env = setup('bhumiamartya.my.id', true);
    env.ready();
    const valid = metadata[name];
    const invalid = [undefined, null, [], 'hero', {}, { ...valid, email: 'private@example.com' }, { ...valid, tool_name: 'mbti' }, { ...valid, [Symbol('private')]: 'secret' }, metadata[name === primary ? app : primary]];
    for (const key of Object.keys(valid)) {
      const missing = { ...valid };
      delete missing[key];
      invalid.push(missing);
      for (const value of ['private@example.com', '', null, {}, `${valid[key]}?email=private@example.com`]) invalid.push({ ...valid, [key]: value });
    }
    for (const destination of [valid.destination + '&email=private@example.com', valid.destination + '#private', 'javascript:alert(1)', 'https://play.google.com/store/apps/details?id=other.app', 'https://play.google.com/store/apps/details?id=com.bhumiamartya.app&ref=hero']) invalid.push({ ...valid, destination });
    for (const value of invalid) env.track(name, value);
    assert.equal(env.events().length, 1);
  });
}

test('pre-consent and rejection do not queue; acceptance and revocation gate tracking', () => {
  const env = setup();
  env.ready();
  env.track(primary, metadata[primary]);
  env.consent(false);
  env.track(app, metadata[app]);
  assert.equal(env.events().length, 0);
  assert.equal(env.scripts.length, 0);
  env.consent(true);
  assert.equal(env.events().length, 1);
  env.track(primary, metadata[primary]);
  env.consent(false);
  env.track(primary, metadata[primary]);
  env.track(app, metadata[app]);
  assert.equal(env.events().length, 2);
  assert.equal(env.window.dataLayer.at(-1)[2].analytics_storage, 'denied');
  env.consent(true);
  env.ready();
  env.track(app, metadata[app]);
  assert.equal(env.events().length, 3);
  assert.equal(env.scripts.length, 1);
  assert.equal(env.events().filter(event => event[1] === 'page_view').length, 1);
});

test('only production hosts load or emit, including after a host change', () => {
  for (const host of ['localhost', 'preview.bhumiamartya.my.id', 'bhumiamartya.my.id.evil.test']) {
    const env = setup(host, true);
    env.ready();
    env.consent(true);
    env.track(primary, metadata[primary]);
    env.track(app, metadata[app]);
    assert.equal(env.scripts.length, 0);
    assert.equal(env.events().length, 0);
  }
  const env = setup('bhumiamartya.my.id', true);
  env.ready();
  env.window.location.hostname = 'localhost';
  env.track(primary, metadata[primary]);
  assert.equal(env.events().length, 1);
});

test('unknown homepage names cannot fall through legacy normalization', () => {
  const env = setup('bhumiamartya.my.id', true);
  env.ready();
  for (const name of ['unknown_event', 'homepage_other_click', 'homepage_app_download_other', 'homepage_contact_click', 'homepage_mbti_started', null, {}]) env.track(name, metadata[app]);
  assert.equal(env.events().length, 1);
});

test('legacy events retain normalization, parameter filtering and trackOnce behavior', () => {
  const env = setup('bhumiamartya.my.id', true);
  env.ready();
  const cases = [
    ['mbti_started', 'tool_started', 'mbti'],
    ['weton_submitted', 'tool_completed', 'weton'],
    ['cek_aura_completed', 'tool_completed', 'cek_aura'],
    ['human_design_checked', 'tool_completed', 'human_design'],
    ['mbti_pdf_downloaded', 'pdf_download', 'mbti'],
    ['app_download', 'app_download_click'],
    ['whatsapp_click', 'contact_click'],
    ...['navigation_click', 'article_open', 'article_source_click', 'tool_started', 'tool_completed', 'pdf_download', 'app_download_click', 'contact_click', 'outbound_click'].map(name => [name, name, /app_download|contact/.test(name) ? undefined : 'general_tool'])
  ];
  for (const [input, output, tool] of cases) {
    env.track(input, { email: 'private@example.com', destination: '/?secret=private', tool_name: undefined });
    assert.deepEqual(env.events().at(-1), ['event', output, { page_type: 'homepage', consent_state: 'granted', ...(tool ? { tool_name: tool } : {}) }]);
  }
  env.track('page_view');
  assert.equal(env.events().length, cases.length + 1);
  env.window.BhumiAnalytics.trackOnce('mbti_started');
  env.window.BhumiAnalytics.trackOnce('mbti_started');
  assert.equal(env.events().length, cases.length + 2);
});
