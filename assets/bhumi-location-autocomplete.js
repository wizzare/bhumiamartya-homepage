/**
 * BHUMI AMARTYA — CANONICAL LOCATION AUTOCOMPLETE & SSoT SEARCH ENGINE
 * Version: 1.0.0
 * Reference: Kemendagri Master Wilayah No 300.2.2-2138 / BPS 2024-2025
 * All 38 Indonesian Provinces, 514 Kabupaten/Kota & Key Administrative Centers
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BhumiLocationAutocomplete = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let cachedLocations = null;
  let loadingPromise = null;

  // Normalizer: lowercase, strip accents, strip punctuation
  function normalizeText(text) {
    if (!text || typeof text !== 'string') return '';
    return text
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Common spelling and dialect expansions for Indonesian regions
  function expandQueryVariations(rawQuery) {
    const normalized = normalizeText(rawQuery);
    if (!normalized) return [];

    const variations = new Set([normalized]);

    // Strip administrative prefixes
    const stripped = normalized
      .replace(/^(kabupaten|kab|kota|adm|administrasi|kecamatan|kec)\s+/i, '')
      .trim();
    if (stripped && stripped !== normalized) {
      variations.add(stripped);
    }

    if (normalized.includes('tanjung pandan')) {
      variations.add(normalized.replace(/tanjung pandan/g, 'tanjungpandan'));
    }
    if (normalized.includes('tanjungpandan')) {
      variations.add(normalized.replace(/tanjungpandan/g, 'tanjung pandan'));
    }
    if (normalized.includes('mentok')) {
      variations.add(normalized.replace(/mentok/g, 'muntok'));
    }
    if (normalized.includes('muntok')) {
      variations.add(normalized.replace(/muntok/g, 'mentok'));
    }
    if (normalized.includes('pangkal pinang')) {
      variations.add(normalized.replace(/pangkal pinang/g, 'pangkalpinang'));
    }
    if (normalized.includes('pangkalpinang')) {
      variations.add(normalized.replace(/pangkalpinang/g, 'pangkal pinang'));
    }
    if (normalized.includes('sungai liat')) {
      variations.add(normalized.replace(/sungai liat/g, 'sungailiat'));
    }
    if (normalized.includes('sungailiat')) {
      variations.add(normalized.replace(/sungailiat/g, 'sungai liat'));
    }
    if (normalized.includes('solo')) {
      variations.add(normalized.replace(/solo/g, 'surakarta'));
    }
    if (normalized.includes('jogja') || normalized.includes('yogya')) {
      variations.add(normalized.replace(/jogja|yogya/g, 'yogyakarta'));
    }
    if (normalized.includes('ujung pandang') || normalized.includes('ujungpandang')) {
      variations.add(normalized.replace(/ujung\s*pandang/g, 'makassar'));
    }

    return [...variations];
  }

  // Scoring function
  function scoreLocation(loc, searchTokens, queryStr) {
    const normName = normalizeText(loc.name);
    const normDisplayName = normalizeText(loc.displayName);
    const normFormatted = normalizeText(loc.formattedCity || '');
    const aliasesNorm = (loc.aliases || []).map(normalizeText);

    if (normName === queryStr) return 1000;
    if (aliasesNorm.some(a => a === queryStr)) return 950;

    const baseName = normName.replace(/^(kabupaten|kota|administrasi)\s+/i, '').trim();
    if (baseName === queryStr) return 900;

    if (baseName.startsWith(queryStr)) return 800 - (baseName.length - queryStr.length);
    if (normName.startsWith(queryStr)) return 750 - (normName.length - queryStr.length);

    for (const alias of aliasesNorm) {
      if (alias.startsWith(queryStr)) {
        return 700 - (alias.length - queryStr.length);
      }
    }

    const allTokensMatch = searchTokens.every(token =>
      normDisplayName.includes(token) ||
      normFormatted.includes(token) ||
      aliasesNorm.some(a => a.includes(token))
    );

    if (allTokensMatch) {
      let score = 500;
      const words = normDisplayName.split(/\s+/);
      for (const token of searchTokens) {
        if (words.some(w => w.startsWith(token))) score += 50;
      }
      if (loc.adminLevel === 'city' || loc.adminLevel === 'regency') score += 20;
      return score;
    }

    return 0;
  }

  // Fetch or retrieve in-memory locations
  async function loadLocationsData() {
    if (cachedLocations) return cachedLocations;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
      try {
        // Try local static asset first
        const assetUrl = '/assets/data/indonesia-locations.json';
        const res = await fetch(assetUrl);
        if (res.ok) {
          const data = await res.json();
          cachedLocations = data.locations || [];
          return cachedLocations;
        }
      } catch (e) {
        console.warn('[BhumiLocation] Static asset load error, trying API:', e.message);
      }

      try {
        // Fallback to API
        const res = await fetch('/api/locations?q=jakarta&limit=1');
        if (res.ok) {
          // If API works, we can search via API
          cachedLocations = []; // signals to use API
          return cachedLocations;
        }
      } catch (e) {
        console.warn('[BhumiLocation] API load error:', e.message);
      }

      // Hardcoded critical core fallback in case of complete network isolation
      cachedLocations = [
        {
          id: 'id-reg-3171',
          name: 'Kota Administrasi Jakarta Pusat',
          displayName: 'Jakarta Pusat, DKI Jakarta',
          formattedCity: 'Jakarta Pusat, DKI Jakarta, Indonesia',
          latitude: -6.1865, longitude: 106.8341,
          timezone: 'Asia/Jakarta', timezoneOffset: '+07:00',
          country: 'Indonesia', provinceName: 'DKI Jakarta',
          aliases: ['jakarta', 'jakarta pusat', 'dki jakarta']
        },
        {
          id: 'id-reg-3302',
          name: 'Kabupaten Banyumas',
          displayName: 'Kabupaten Banyumas, Jawa Tengah',
          formattedCity: 'Kabupaten Banyumas, Jawa Tengah, Indonesia',
          latitude: -7.4500, longitude: 109.1667,
          timezone: 'Asia/Jakarta', timezoneOffset: '+07:00',
          country: 'Indonesia', provinceName: 'Jawa Tengah',
          aliases: ['banyumas', 'kab banyumas', 'purwokerto']
        },
        {
          id: 'id-dst-3302-purwokerto',
          name: 'Purwokerto',
          displayName: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah',
          formattedCity: 'Purwokerto, Kabupaten Banyumas, Jawa Tengah, Indonesia',
          latitude: -7.4279, longitude: 109.2409,
          timezone: 'Asia/Jakarta', timezoneOffset: '+07:00',
          country: 'Indonesia', provinceName: 'Jawa Tengah',
          aliases: ['purwokerto', 'pwt', 'purwokerto banyumas']
        },
        {
          id: 'id-reg-1971',
          name: 'Kota Pangkalpinang',
          displayName: 'Kota Pangkalpinang, Kepulauan Bangka Belitung',
          formattedCity: 'Kota Pangkalpinang, Kepulauan Bangka Belitung, Indonesia',
          latitude: -2.1333, longitude: 106.1333,
          timezone: 'Asia/Jakarta', timezoneOffset: '+07:00',
          country: 'Indonesia', provinceName: 'Kepulauan Bangka Belitung',
          aliases: ['pangkalpinang', 'pangkal pinang']
        },
        {
          id: 'id-dst-1904-koba',
          name: 'Koba',
          displayName: 'Koba, Kabupaten Bangka Tengah, Kepulauan Bangka Belitung',
          formattedCity: 'Koba, Kabupaten Bangka Tengah, Kepulauan Bangka Belitung, Indonesia',
          latitude: -2.4833, longitude: 106.4000,
          timezone: 'Asia/Jakarta', timezoneOffset: '+07:00',
          country: 'Indonesia', provinceName: 'Kepulauan Bangka Belitung',
          aliases: ['koba', 'koba bangka']
        },
        {
          id: 'id-dst-1902-tanjungpandan',
          name: 'Tanjung Pandan',
          displayName: 'Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung',
          formattedCity: 'Tanjung Pandan, Kabupaten Belitung, Kepulauan Bangka Belitung, Indonesia',
          latitude: -2.7423, longitude: 107.6545,
          timezone: 'Asia/Jakarta', timezoneOffset: '+07:00',
          country: 'Indonesia', provinceName: 'Kepulauan Bangka Belitung',
          aliases: ['tanjung pandan', 'tanjungpandan']
        }
      ];
      return cachedLocations;
    })();

    return loadingPromise;
  }

  // Search function (synchronous when data loaded, or async)
  async function search(query, options = {}) {
    const limit = options.limit || 8;
    const locations = await loadLocationsData();
    const variations = expandQueryVariations(query);
    if (variations.length === 0) return [];

    const scored = [];

    if (locations && locations.length > 0) {
      for (const loc of locations) {
        let bestScore = 0;
        for (const vQuery of variations) {
          const vTokens = vQuery.split(/\s+/).filter(Boolean);
          const score = scoreLocation(loc, vTokens, vQuery);
          if (score > bestScore) bestScore = score;
        }
        if (bestScore > 0) {
          scored.push({ loc, score: bestScore });
        }
      }
      scored.sort((a, b) => b.score - a.score);
      const indonesianMatches = scored.slice(0, limit).map(s => s.loc);

      // If we found solid Indonesian matches, return them immediately
      if (indonesianMatches.length > 0) {
        return indonesianMatches;
      }
    }

    // If no local match and online, try Photon geocoder with intelligent ranking
    try {
      const trimmed = query.trim();
      const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(trimmed)}&limit=10`);
      if (res.ok) {
        const data = await res.json();
        const features = data.features || [];
        const photonResults = features
          .filter(f => {
            const props = f.properties || {};
            // Accept cities, towns, villages, and administrative boundaries (Kabupaten/Kota)
            return (
              (props.osm_key === 'place' && ['city', 'town', 'village', 'municipality', 'suburb'].includes(props.osm_value)) ||
              (props.osm_key === 'boundary' && props.osm_value === 'administrative')
            );
          })
          .map(f => {
            const props = f.properties || {};
            const coords = f.geometry?.coordinates || [0, 0];
            const country = props.country || 'Unknown';
            const state = props.state || '';
            const name = props.name || '';
            const lon = coords[0];
            const lat = coords[1];

            // Timezone determination
            let tz = 'Asia/Jakarta';
            let tzOffset = '+07:00';
            if (country === 'Indonesia') {
              // Check longitude bands for international fallback if state is missing
              if (lon > 125) { tz = 'Asia/Jayapura'; tzOffset = '+09:00'; }
              else if (lon > 115) { tz = 'Asia/Makassar'; tzOffset = '+08:00'; }
            } else {
              const hours = Math.round(lon / 15);
              const sign = hours >= 0 ? '+' : '-';
              tzOffset = `${sign}${String(Math.abs(hours)).padStart(2, '0')}:00`;
              tz = tzOffset;
            }

            return {
              id: `photon-${f.properties.osm_id || Math.random().toString(36).slice(2)}`,
              name,
              displayName: [name, state, country].filter(Boolean).join(', '),
              formattedCity: [name, state, country].filter(Boolean).join(', '),
              latitude: lat,
              longitude: lon,
              timezone: tz,
              timezoneOffset: tzOffset,
              country,
              provinceName: state,
              source: 'OpenStreetMap / Photon Geocoder',
              version: '1.0.0'
            };
          })
          .slice(0, limit);

        if (photonResults.length > 0) return photonResults;
      }
    } catch (e) {
      console.warn('[BhumiLocation] Photon geocoder fallback error:', e.message);
    }

    return [];
  }

  // Quick synchronous fallback resolver for a typed name
  function resolveFallbackSync(query) {
    if (!cachedLocations || cachedLocations.length === 0) return null;
    const variations = expandQueryVariations(query);
    if (variations.length === 0) return null;

    let bestMatch = null;
    let highestScore = 0;

    for (const loc of cachedLocations) {
      for (const vQuery of variations) {
        const vTokens = vQuery.split(/\s+/).filter(Boolean);
        const score = scoreLocation(loc, vTokens, vQuery);
        if (score > highestScore) {
          highestScore = score;
          bestMatch = loc;
        }
      }
    }

    // Require high confidence match
    return highestScore >= 700 ? bestMatch : null;
  }

  /**
   * Attach autocomplete behavior to a DOM input element
   */
  function attach(inputEl, options = {}) {
    if (!inputEl) return null;

    const onSelect = options.onSelect || (() => {});
    const onClear = options.onClear || (() => {});
    const noteEl = options.noteEl || null;

    // Wrap or find suggestions container
    let container = options.suggestionsContainer;
    if (!container) {
      container = document.createElement('div');
      container.className = 'city-suggestions';
      inputEl.parentNode.insertBefore(container, inputEl.nextSibling);
    }

    // Accessibility attributes
    inputEl.setAttribute('role', 'combobox');
    inputEl.setAttribute('aria-autocomplete', 'list');
    inputEl.setAttribute('aria-expanded', 'false');
    inputEl.setAttribute('autocomplete', 'off');
    container.setAttribute('role', 'listbox');

    let debounceTimer = null;
    let currentSuggestions = [];
    let activeIndex = -1;
    let selectedLocation = null;

    function renderSuggestions(suggestions, query) {
      currentSuggestions = suggestions;
      activeIndex = -1;

      if (!suggestions || suggestions.length === 0) {
        if (query && query.trim().length >= 2) {
          container.innerHTML = `
            <div class="city-no-results" style="padding: 10px 14px; font-size: 0.85rem; color: #888;">
              Kota tidak ditemukan. Periksa ejaan atau ketik nama kabupaten/provinsi.
            </div>
          `;
          container.classList.add('show');
          inputEl.setAttribute('aria-expanded', 'true');
        } else {
          container.innerHTML = '';
          container.classList.remove('show');
          inputEl.setAttribute('aria-expanded', 'false');
        }
        return;
      }

      container.innerHTML = suggestions.map((loc, idx) => {
        const badge = loc.adminLevel === 'city' ? '<span class="loc-badge city">Kota</span>'
                    : loc.adminLevel === 'regency' ? '<span class="loc-badge regency">Kabupaten</span>'
                    : loc.adminLevel === 'district' ? '<span class="loc-badge district">Kecamatan</span>'
                    : '';
        return `
          <button class="city-option" type="button" data-index="${idx}" role="option" id="city-opt-${idx}">
            <div style="font-weight: 600; color: #1E293B;">${loc.name} ${badge}</div>
            <div style="font-size: 0.78rem; color: #64748B;">${loc.displayName || loc.formattedCity}</div>
          </button>
        `;
      }).join('');

      container.classList.add('show');
      inputEl.setAttribute('aria-expanded', 'true');

      // Bind click on each option
      container.querySelectorAll('.city-option').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const idx = Number(btn.dataset.index);
          selectOption(currentSuggestions[idx]);
        });
      });
    }

    function selectOption(loc) {
      if (!loc) return;
      selectedLocation = loc;
      inputEl.value = loc.formattedCity || loc.displayName || loc.name;
      container.classList.remove('show');
      inputEl.setAttribute('aria-expanded', 'false');

      if (noteEl) {
        noteEl.textContent = `Kota dipilih: ${loc.displayName || loc.formattedCity} (${loc.timezone || loc.timezoneOffset})`;
      }

      onSelect(loc);
    }

    async function handleInput() {
      const val = inputEl.value.trim();
      selectedLocation = null;

      if (!val) {
        renderSuggestions([], '');
        if (noteEl) noteEl.textContent = 'Ketik kota lahir Anda untuk presisi koordinat.';
        onClear();
        return;
      }

      if (noteEl) noteEl.textContent = 'Mencari lokasi...';

      const results = await search(val, { limit: 8 });
      renderSuggestions(results, val);

      if (noteEl) {
        if (results.length > 0) {
          noteEl.textContent = 'Silakan pilih lokasi dari saran di bawah.';
        } else {
          noteEl.textContent = 'Lokasi tidak ditemukan dalam database.';
        }
      }
    }

    inputEl.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleInput, 250);
    });

    // Keyboard navigation
    inputEl.addEventListener('keydown', (e) => {
      if (!container.classList.contains('show') || currentSuggestions.length === 0) {
        return;
      }

      const optionsList = container.querySelectorAll('.city-option');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % optionsList.length;
        updateActiveOption(optionsList);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + optionsList.length) % optionsList.length;
        updateActiveOption(optionsList);
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0 && activeIndex < currentSuggestions.length) {
          e.preventDefault();
          selectOption(currentSuggestions[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        container.classList.remove('show');
        inputEl.setAttribute('aria-expanded', 'false');
      }
    });

    function updateActiveOption(optionsList) {
      optionsList.forEach((el, idx) => {
        if (idx === activeIndex) {
          el.classList.add('active');
          el.scrollIntoView({ block: 'nearest' });
          inputEl.setAttribute('aria-activedescendant', el.id);
        } else {
          el.classList.remove('active');
        }
      });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (e.target !== inputEl && !container.contains(e.target)) {
        container.classList.remove('show');
        inputEl.setAttribute('aria-expanded', 'false');
      }
    });

    // Preload database on focus
    inputEl.addEventListener('focus', () => {
      loadLocationsData();
    });

    return {
      getSelectedLocation: () => selectedLocation,
      resolveFallback: () => selectedLocation || resolveFallbackSync(inputEl.value.trim()),
      destroy: () => {
        container.remove();
      }
    };
  }

  // Pre-load data in background
  if (typeof window !== 'undefined') {
    setTimeout(loadLocationsData, 500);
  }

  return {
    search,
    loadLocationsData,
    resolveFallback: resolveFallbackSync,
    attach
  };
});
