(function () {
  "use strict";
  var PRODUCTION_HOSTS = ["www.bhumiamartya.my.id", "bhumiamartya.my.id"];
  var host = window.location.hostname.toLowerCase();
  var isProduction = PRODUCTION_HOSTS.indexOf(host) >= 0;
  if (!isProduction) return;
  var s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0971666335614952";
  document.head.appendChild(s);
})();