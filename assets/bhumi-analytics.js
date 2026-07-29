(function () {
  "use strict";

  var measurementId = "G-BLNCYH2290";
  var loaded = false;
  var pageViewSent = false;
  var started = {};

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });

  function hasConsent() {
    return Boolean(window.BhumiConsent && window.BhumiConsent.hasAnalyticsConsent());
  }

  function pageType() {
    var path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (path === "/") return "homepage";
    if (path.indexOf("/articles") === 0) return "article";
    if (/weton|aura|human-design|tes-kenali-diri|kalkulator-cinta|kecocokanmatrix/.test(path)) return "tool";
    if (/about|contact|privacy-policy|terms|syarat-ketentuan/.test(path)) return "trust";
    return "content";
  }

  function safeToolName(value) {
    var allowed = ["cek_aura", "human_design", "mbti", "weton", "tes_kenali_diri", "kalkulator_cinta", "compatibility_matrix", "blueprint_reading"];
    return allowed.indexOf(value) >= 0 ? value : "general_tool";
  }

  function normalizeEvent(name, metadata) {
    var tool = String((metadata && (metadata.tool_name || metadata.feature)) || name).replace(/-/g, "_");
    if (/_started$/.test(name)) return { name: "tool_started", tool_name: safeToolName(tool.replace(/_started$/, "")) };
    if (/_submitted$|_completed$|_checked$/.test(name)) return { name: "tool_completed", tool_name: safeToolName(tool.replace(/_(submitted|completed|checked)$/, "")) };
    if (/_pdf_downloaded$/.test(name)) return { name: "pdf_download", tool_name: safeToolName(tool.replace(/_pdf_downloaded$/, "")) };
    if (/app_download/.test(name)) return { name: "app_download_click" };
    if (/whatsapp|contact/.test(name)) return { name: "contact_click" };
    var allowed = ["page_view", "navigation_click", "article_open", "article_source_click", "tool_started", "tool_completed", "pdf_download", "app_download_click", "contact_click", "outbound_click"];
    return allowed.indexOf(name) >= 0 ? { name: name, tool_name: metadata && safeToolName(metadata.tool_name) } : null;
  }

  function safeLocation() {
    return window.location.origin + window.location.pathname;
  }

  function sendPageView() {
    if (!loaded || pageViewSent || !hasConsent()) return;
    pageViewSent = true;
    window.gtag("event", "page_view", {
      page_location: safeLocation(),
      page_path: window.location.pathname,
      page_type: pageType(),
      consent_state: "granted"
    });
  }

  function loadGoogleTag() {
    if (loaded || !hasConsent()) return;
    loaded = true;
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: safeLocation()
    });
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
    sendPageView();
  }

  function track(name, metadata) {
    if (!loaded || !hasConsent()) return;
    var event = normalizeEvent(name, metadata);
    if (!event || event.name === "page_view") return;
    var parameters = { page_type: pageType(), consent_state: "granted" };
    if (event.tool_name) parameters.tool_name = event.tool_name;
    window.gtag("event", event.name, parameters);
  }

  window.BhumiAnalytics = {
    track: track,
    trackOnce: function (name, metadata) {
      if (started[name]) return;
      started[name] = true;
      track(name, metadata);
    }
  };

  window.addEventListener("bhumi:consent", function (event) {
    if (event.detail && event.detail.analytics_storage === "granted") loadGoogleTag();
    else window.gtag("consent", "update", { analytics_storage: "denied" });
  });
  document.addEventListener("DOMContentLoaded", loadGoogleTag);
})();
