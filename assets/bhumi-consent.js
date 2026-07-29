(function () {
  "use strict";

  var storageKey = "bhumi_consent_v1";
  var current = null;

  function readChoice() {
    try {
      var value = window.localStorage.getItem(storageKey);
      return value === "accepted" || value === "rejected" ? value : null;
    } catch (_) {
      return null;
    }
  }

  function consentDetail(choice) {
    var granted = choice === "accepted";
    return {
      choice: choice,
      analytics_storage: granted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    };
  }

  function notify(choice) {
    current = consentDetail(choice);
    window.dispatchEvent(new CustomEvent("bhumi:consent", { detail: current }));
  }

  function save(choice) {
    try { window.localStorage.setItem(storageKey, choice); } catch (_) {}
    notify(choice);
    render(false);
  }

  function render(showPanel) {
    var existing = document.getElementById("bhumi-consent-root");
    if (existing) existing.remove();

    var choice = readChoice();
    var root = document.createElement("div");
    root.id = "bhumi-consent-root";
    root.innerHTML = '<style>' +
      '.bhumi-consent{position:fixed;z-index:2147483000;left:16px;right:16px;bottom:16px;max-width:680px;margin:auto;padding:18px;border:1px solid rgba(212,175,55,.35);border-radius:18px;background:#fffdf8;color:#304536;box-shadow:0 14px 40px rgba(34,53,39,.18);font:14px/1.55 "Plus Jakarta Sans",sans-serif}' +
      '.bhumi-consent h2{margin:0 0 6px;font:600 20px/1.25 "Cormorant Garamond",serif}.bhumi-consent p{margin:0 0 12px}.bhumi-consent-actions{display:flex;gap:8px;flex-wrap:wrap}.bhumi-consent button{min-height:42px;padding:9px 16px;border-radius:999px;border:1px solid #31533b;background:#fff;color:#31533b;font:600 13px inherit;cursor:pointer}.bhumi-consent .primary{background:#31533b;color:#fff}.bhumi-consent-manage{position:fixed;z-index:2147482999;left:14px;bottom:14px;border:1px solid rgba(212,175,55,.45);border-radius:999px;background:#fffdf8;color:#31533b;padding:9px 13px;font:600 12px "Plus Jakarta Sans",sans-serif;cursor:pointer;box-shadow:0 5px 18px rgba(34,53,39,.14)}' +
      '@media(max-width:480px){.bhumi-consent{left:10px;right:10px;bottom:10px;padding:15px}.bhumi-consent-actions button{flex:1 1 120px}}' +
      '</style>';

    if (!choice || showPanel) {
      root.innerHTML += '<section class="bhumi-consent" role="dialog" aria-modal="false" aria-labelledby="bhumi-consent-title"><h2 id="bhumi-consent-title">Pilihan privasi Anda</h2><p>Bhumi menggunakan analytics opsional untuk memahami penggunaan halaman secara umum. Analytics hanya aktif setelah Anda menyetujuinya. Penyimpanan iklan dan personalisasi tetap dinonaktifkan.</p><div class="bhumi-consent-actions"><button type="button" class="primary" data-choice="accepted">Terima analytics</button><button type="button" data-choice="rejected">Tolak</button><button type="button" data-choice="rejected">Hanya yang diperlukan</button></div></section>';
    } else {
      root.innerHTML += '<button type="button" class="bhumi-consent-manage" aria-label="Ubah pilihan privasi">Pilihan privasi</button>';
    }
    document.body.appendChild(root);
    root.querySelectorAll("[data-choice]").forEach(function (button) {
      button.addEventListener("click", function () { save(button.getAttribute("data-choice")); });
    });
    var manage = root.querySelector(".bhumi-consent-manage");
    if (manage) manage.addEventListener("click", function () { render(true); });
    var first = root.querySelector("[data-choice]");
    if (showPanel && first) first.focus();
  }

  window.BhumiConsent = {
    get: function () { return current || consentDetail(readChoice() || "rejected"); },
    hasAnalyticsConsent: function () { return readChoice() === "accepted"; },
    open: function () { render(true); }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var choice = readChoice();
    render(false);
    if (choice) notify(choice);
  });
})();
