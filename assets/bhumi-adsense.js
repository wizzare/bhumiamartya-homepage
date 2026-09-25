(function () {
  "use strict";
  var PRODUCTION_HOSTS = ["www.bhumiamartya.my.id", "bhumiamartya.my.id"];
  var loaded = false;

  function isProductionHost() {
    var host = window.location.hostname.toLowerCase();
    return PRODUCTION_HOSTS.indexOf(host) >= 0;
  }

  function hasMarketingConsent() {
    return Boolean(window.BhumiConsent && window.BhumiConsent.hasMarketingConsent());
  }

  // Auto Ads readiness only: this loads the AdSense library so Google can
  // decide ad placement (once Auto Ads is enabled for this site in the
  // AdSense dashboard). No ad units are declared or injected here.
  function loadAdSense() {
    if (loaded || !isProductionHost() || !hasMarketingConsent()) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0971666335614952";
    document.head.appendChild(s);
  }

  window.addEventListener("bhumi:consent", function (event) {
    var detail = event.detail || {};
    if (detail.ad_storage === "granted") loadAdSense();
  });

  document.addEventListener("DOMContentLoaded", loadAdSense);
})();
