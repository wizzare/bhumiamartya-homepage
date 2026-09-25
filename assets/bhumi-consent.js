(function () {
  "use strict";

  var storageKeyV2 = "bhumi_consent_v2";
  var storageKeyV1 = "bhumi_consent_v1";
  var current = null;

  function readV1() {
    try {
      var value = window.localStorage.getItem(storageKeyV1);
      return value === "accepted" || value === "rejected" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function readV2() {
    try {
      var raw = window.localStorage.getItem(storageKeyV2);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
        return { analytics: parsed.analytics, marketing: parsed.marketing };
      }
      return null;
    } catch (_) {
      return null;
    }
  }

  function writeV2(state) {
    try {
      window.localStorage.setItem(storageKeyV2, JSON.stringify(state));
    } catch (_) {}
  }

  // Privacy-safe migration: a legacy "accepted" only ever meant analytics.
  // It must never be interpreted as marketing/ads consent.
  function migrateV1(choice) {
    var migrated = choice === "accepted"
      ? { analytics: true, marketing: false }
      : { analytics: false, marketing: false };
    writeV2(migrated);
    return migrated;
  }

  function readState() {
    var v2 = readV2();
    if (v2) return v2;
    var v1 = readV1();
    if (v1) return migrateV1(v1);
    return null;
  }

  function consentDetail(state) {
    return {
      analytics: state.analytics,
      marketing: state.marketing,
      analytics_storage: state.analytics ? "granted" : "denied",
      ad_storage: state.marketing ? "granted" : "denied",
      ad_user_data: state.marketing ? "granted" : "denied",
      ad_personalization: state.marketing ? "granted" : "denied"
    };
  }

  function notify(state) {
    current = consentDetail(state);
    window.dispatchEvent(new CustomEvent("bhumi:consent", { detail: current }));
  }

  function save(state) {
    var previous = readState();
    var marketingRevoked = Boolean(previous && previous.marketing) && !state.marketing;

    writeV2(state);
    notify(state);

    if (marketingRevoked) {
      // Meta Pixel and the Google AdSense loader cannot be safely unloaded
      // once injected — there is no supported Meta/Google API to "undo" an
      // already-running third-party script. Consent is persisted above
      // first, then the page is reloaded so the fresh load re-reads consent
      // and simply never requests either script. Analytics is unaffected —
      // it still activates independently based on its own stored value.
      // Granting marketing again does not need a reload: both scripts
      // activate live via the bhumi:consent event handled in
      // bhumi-analytics.js / bhumi-adsense.js.
      window.location.reload();
      return;
    }

    render("manage");
  }

  function styles() {
    return '<style>' +
      '.bhumi-consent{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:560px;margin:auto;padding:20px;border:1px solid rgba(212,175,55,.35);border-radius:18px;background:#fffdf8;color:#304536;box-shadow:0 14px 40px rgba(34,53,39,.18);font:14px/1.55 "Plus Jakarta Sans",sans-serif;max-height:calc(100vh - 32px);overflow-y:auto}' +
      '.bhumi-consent h2{margin:0 0 8px;font:600 20px/1.25 "Cormorant Garamond",serif}' +
      '.bhumi-consent p{margin:0 0 12px}' +
      '.bhumi-consent-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}' +
      '.bhumi-consent button{min-height:42px;padding:9px 16px;border-radius:999px;border:1px solid #31533b;background:#fff;color:#31533b;font:600 13px inherit;cursor:pointer;flex:1 1 auto}' +
      '.bhumi-consent .primary{background:#31533b;color:#fff}' +
      '.bhumi-consent-category{border-top:1px solid rgba(48,69,54,.12);padding:12px 0}' +
      '.bhumi-consent-category:first-of-type{border-top:none;padding-top:4px}' +
      '.bhumi-consent-category-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:4px}' +
      '.bhumi-consent-category-name{font-weight:600;font-size:14px}' +
      '.bhumi-consent-category-status{font-size:12px;font-weight:600;color:#8a8072;text-transform:uppercase;letter-spacing:.04em}' +
      '.bhumi-consent-category p{margin:0;font-size:13px;color:#5a5248}' +
      '.bhumi-consent-toggle{width:20px;height:20px;flex-shrink:0;accent-color:#31533b;cursor:pointer}' +
      '.bhumi-consent-manage{position:fixed;z-index:2147482999;left:14px;bottom:14px;border:1px solid rgba(212,175,55,.45);border-radius:999px;background:#fffdf8;color:#31533b;padding:9px 13px;font:600 12px "Plus Jakarta Sans",sans-serif;cursor:pointer;box-shadow:0 5px 18px rgba(34,53,39,.14)}' +
      '@media(max-width:480px){.bhumi-consent{left:10px;right:10px;bottom:10px;padding:16px}.bhumi-consent button{flex:1 1 120px}}' +
      '</style>';
  }

  function initialPanelHtml() {
    return '<section class="bhumi-consent" role="dialog" aria-modal="false" aria-labelledby="bhumi-consent-title">' +
      '<h2 id="bhumi-consent-title">Pilihan Privasi Anda</h2>' +
      '<p>Bhumi menggunakan analytics untuk memahami penggunaan website dan teknologi advertising untuk mendukung pengukuran serta monetisasi. Kamu dapat memilih kategori yang ingin diaktifkan.</p>' +
      '<div class="bhumi-consent-actions">' +
      '<button type="button" class="primary" data-action="accept-all">Terima Semua</button>' +
      '<button type="button" data-action="reject-optional">Tolak Opsional</button>' +
      '<button type="button" data-action="open-preferences">Atur Pilihan</button>' +
      '</div></section>';
  }

  function preferencesPanelHtml(state) {
    var analyticsChecked = state.analytics ? " checked" : "";
    var marketingChecked = state.marketing ? " checked" : "";
    return '<section class="bhumi-consent" role="dialog" aria-modal="false" aria-labelledby="bhumi-consent-title">' +
      '<h2 id="bhumi-consent-title">Atur Pilihan Privasi</h2>' +
      '<div class="bhumi-consent-category">' +
      '<div class="bhumi-consent-category-head">' +
      '<span class="bhumi-consent-category-name">Necessary</span>' +
      '<span class="bhumi-consent-category-status">Selalu aktif</span>' +
      '</div>' +
      '<p>Dibutuhkan agar website dan pilihan privasi dapat berfungsi.</p>' +
      '</div>' +
      '<div class="bhumi-consent-category">' +
      '<div class="bhumi-consent-category-head">' +
      '<label class="bhumi-consent-category-name" for="bhumi-consent-analytics">Analytics</label>' +
      '<input type="checkbox" class="bhumi-consent-toggle" id="bhumi-consent-analytics" data-category="analytics"' + analyticsChecked + '>' +
      '</div>' +
      '<p>Membantu Bhumi memahami penggunaan halaman secara umum melalui analytics.</p>' +
      '</div>' +
      '<div class="bhumi-consent-category">' +
      '<div class="bhumi-consent-category-head">' +
      '<label class="bhumi-consent-category-name" for="bhumi-consent-marketing">Marketing &amp; Ads</label>' +
      '<input type="checkbox" class="bhumi-consent-toggle" id="bhumi-consent-marketing" data-category="marketing"' + marketingChecked + '>' +
      '</div>' +
      '<p>Digunakan untuk pengukuran kampanye, Meta Pixel, dan teknologi advertising/monetisasi yang diaktifkan Bhumi.</p>' +
      '</div>' +
      '<div class="bhumi-consent-actions">' +
      '<button type="button" class="primary" data-action="save">Simpan Pilihan</button>' +
      '<button type="button" data-action="accept-all">Terima Semua</button>' +
      '</div></section>';
  }

  function manageButtonHtml() {
    return '<button type="button" class="bhumi-consent-manage" aria-label="Ubah pilihan privasi">Pilihan Privasi</button>';
  }

  // mode: "initial" (first-visit compact dialog), "preferences" (category panel), "manage" (floating reopen button)
  function render(mode) {
    var existing = document.getElementById("bhumi-consent-root");
    if (existing) existing.remove();

    var root = document.createElement("div");
    root.id = "bhumi-consent-root";
    root.innerHTML = styles();

    if (mode === "preferences") {
      var state = readState() || { analytics: false, marketing: false };
      root.innerHTML += preferencesPanelHtml(state);
    } else if (mode === "manage") {
      root.innerHTML += manageButtonHtml();
    } else {
      root.innerHTML += initialPanelHtml();
    }

    document.body.appendChild(root);

    var acceptAllBtns = root.querySelectorAll('[data-action="accept-all"]');
    acceptAllBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        save({ analytics: true, marketing: true });
      });
    });

    var rejectBtn = root.querySelector('[data-action="reject-optional"]');
    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        save({ analytics: false, marketing: false });
      });
    }

    var openPrefsBtn = root.querySelector('[data-action="open-preferences"]');
    if (openPrefsBtn) {
      openPrefsBtn.addEventListener("click", function () { render("preferences"); });
    }

    var saveBtn = root.querySelector('[data-action="save"]');
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var analyticsInput = root.querySelector("#bhumi-consent-analytics");
        var marketingInput = root.querySelector("#bhumi-consent-marketing");
        save({
          analytics: Boolean(analyticsInput && analyticsInput.checked),
          marketing: Boolean(marketingInput && marketingInput.checked)
        });
      });
    }

    var manageBtn = root.querySelector(".bhumi-consent-manage");
    if (manageBtn) {
      manageBtn.addEventListener("click", function () { render("preferences"); });
    }

    var firstFocusable = root.querySelector("button, input");
    if ((mode === "preferences" || mode === "initial") && firstFocusable && document.activeElement !== document.body) {
      firstFocusable.focus();
    }
  }

  window.BhumiConsent = {
    get: function () { return current || consentDetail(readState() || { analytics: false, marketing: false }); },
    getState: function () { return readState() || { analytics: false, marketing: false }; },
    hasAnalyticsConsent: function () { var s = readState(); return Boolean(s && s.analytics); },
    hasMarketingConsent: function () { var s = readState(); return Boolean(s && s.marketing); },
    open: function () { render("preferences"); }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var state = readState();
    render(state ? "manage" : "initial");
    if (state) notify(state);
  });
})();
