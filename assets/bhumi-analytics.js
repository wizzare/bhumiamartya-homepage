(function () {
  "use strict";

  var endpoint = "https://bhumi-amartya-clean.vercel.app/api/web-analytics";
  var storageKey = "bhumi_analytics_session_id";
  var startedEvents = {};

  function createSessionId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return "bhumi-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }

  function getSessionId() {
    try {
      var existing = window.localStorage.getItem(storageKey);
      if (existing) return existing;

      var sessionId = createSessionId();
      window.localStorage.setItem(storageKey, sessionId);
      return sessionId;
    } catch (error) {
      return createSessionId();
    }
  }

  function getDeviceType() {
    var width = window.innerWidth || 0;
    var ua = navigator.userAgent || "";

    if (/ipad|tablet|playbook|silk/i.test(ua) || (width >= 768 && width <= 1024 && /mobile/i.test(ua))) {
      return "tablet";
    }
    if (/mobi|android|iphone|ipod/i.test(ua) || width < 768) return "mobile";
    if (width >= 1024) return "desktop";
    return "unknown";
  }

  function sanitizeMetadata(metadata) {
    var allowedKeys = {
      feature: true,
      status: true,
      resultOk: true,
      hasBirthTime: true,
      hasBirthCity: true,
      ebookSlug: true,
      ebookTitle: true,
      ctaType: true
    };
    var safe = {};

    if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return safe;

    Object.keys(metadata).forEach(function (key) {
      var value = metadata[key];
      if (!allowedKeys[key]) return;

      if (typeof value === "boolean") safe[key] = value;
      if (typeof value === "number" && isFinite(value)) safe[key] = value;
      if (typeof value === "string") safe[key] = value.slice(0, 80);
    });

    return safe;
  }

  function track(eventName, metadata) {
    if (!eventName || typeof eventName !== "string") return;

    var payload = {
      eventName: eventName,
      pagePath: window.location.pathname,
      pageUrl: window.location.href,
      referrer: document.referrer || "",
      sessionId: getSessionId(),
      deviceType: getDeviceType(),
      metadata: sanitizeMetadata(metadata)
    };

    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        var blob = new Blob([body], { type: "application/json" });
        if (navigator.sendBeacon(endpoint, blob)) return;
      }

      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        keepalive: true
      }).catch(function () {});
    } catch (error) {
      if (window.location.hostname === "localhost") {
        console.warn("[BhumiAnalytics] Tracking skipped", error);
      }
    }
  }

  function trackOnce(eventName, metadata) {
    if (startedEvents[eventName]) return;
    startedEvents[eventName] = true;
    track(eventName, metadata);
  }

  function closestLink(target) {
    if (!target || typeof target.closest !== "function") return null;
    return target.closest("a[href]");
  }

  window.BhumiAnalytics = {
    track: track,
    trackOnce: trackOnce
  };

  document.addEventListener("DOMContentLoaded", function () {
    track("page_view");

    if (window.location.pathname.replace(/\/$/, "") === "/ebook") {
      track("ebook_viewed", { ebookSlug: "hello-darkside", ebookTitle: "Hello Darkside" });
    }

    document.addEventListener("click", function (event) {
      var link = closestLink(event.target);
      if (!link) return;

      var href = link.getAttribute("href") || "";
      var label = (link.textContent || "").trim().toLowerCase();

      if (href.indexOf("wa.me/") !== -1 || href.indexOf("api.whatsapp.com") !== -1) {
        track("whatsapp_clicked", { ctaType: "whatsapp" });
      }

      if (href.indexOf("play.google.com/store/apps/details") !== -1 || label.indexOf("download aplikasi") !== -1) {
        track("app_download_clicked", { ctaType: "download_app" });
      }

      if (window.location.pathname.replace(/\/$/, "") === "/ebook" && /download|unduh/i.test(label + " " + href)) {
        track("ebook_download_clicked", { ebookSlug: "hello-darkside", ebookTitle: "Hello Darkside" });
      }
    });
  });
})();
