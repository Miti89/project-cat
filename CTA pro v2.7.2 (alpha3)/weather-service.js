/**
 * Coffee Taste Archive - Weather Service (weather-service.js)
 * Stage 2 KMA Short-Term Forecast Proxy Client + 1-Hour Cache + Automatic Stage 1 Fallback.
 * Privacy-first: City/District preset selection is default; optional GPS maps in-memory
 * to the nearest city preset and NEVER stores or transmits latitude/longitude coordinates.
 */

(function(global) {
  'use strict';

  const CITY_STORAGE_KEY = 'cta_weather_city';
  const CACHE_STORAGE_KEY = 'cta_weather_cache';
  const CACHE_TTL_MS = 60 * 60 * 1000; // 1시간 캐시
  const FETCH_TIMEOUT_MS = 3000; // 3초 타임아웃 후 무API 1단계 폴백

  // 기상청 단기예보 공식 격자(nx, ny) 기반 주요 도시·구 프리셋
  const CITY_PRESETS = [
    { id: 'seoul-gangnam',  nx: 61, ny: 126, lat: 37.5172, lon: 127.0473, ko: '서울 강남구',   en: 'Seoul Gangnam',    ja: 'ソウル 江南区' },
    { id: 'seoul-jongno',   nx: 60, ny: 127, lat: 37.5730, lon: 126.9794, ko: '서울 종로구',   en: 'Seoul Jongno',     ja: 'ソウル 鍾路区' },
    { id: 'seoul-mapo',     nx: 59, ny: 126, lat: 37.5663, lon: 126.9019, ko: '서울 마포구',   en: 'Seoul Mapo',       ja: 'ソウル 麻浦区' },
    { id: 'incheon-yeonsu', nx: 55, ny: 124, lat: 37.4102, lon: 126.6783, ko: '인천 연수구',   en: 'Incheon Yeonsu',   ja: '仁川 延寿区' },
    { id: 'busan-haeundae', nx: 99, ny: 75,  lat: 35.1631, lon: 129.1635, ko: '부산 해운대구', en: 'Busan Haeundae',   ja: '釜山 海雲台区' },
    { id: 'daegu-jung',     nx: 89, ny: 90,  lat: 35.8693, lon: 128.6062, ko: '대구 중구',     en: 'Daegu Jung-gu',    ja: '大邱 中区' },
    { id: 'gwangju-seo',    nx: 58, ny: 74,  lat: 35.1520, lon: 126.8895, ko: '광주 서구',     en: 'Gwangju Seo-gu',   ja: '光州 西区' },
    { id: 'daejeon-seo',    nx: 67, ny: 100, lat: 36.3554, lon: 127.3838, ko: '대전 서구',     en: 'Daejeon Seo-gu',   ja: '大田 西区' },
    { id: 'ulsan-nam',      nx: 102, ny: 84, lat: 35.5438, lon: 129.3301, ko: '울산 남구',     en: 'Ulsan Nam-gu',     ja: '蔚山 南区' },
    { id: 'jeju-city',      nx: 53, ny: 38,  lat: 33.4996, lon: 126.5312, ko: '제주시',        en: 'Jeju City',        ja: '済州市' }
  ];

  // Cloudflare Workers 프록시 엔드포인트 (미설정 시 1단계 무API 날짜·계절·시간대 추천으로 자동 폴백)
  const DEFAULT_PROXY_URL = '';
  let proxyUrl = DEFAULT_PROXY_URL;

  function resolveProxyUrl() {
    try {
      if (typeof global.CTA_WEATHER_PROXY_URL === 'string' && global.CTA_WEATHER_PROXY_URL.trim()) {
        return global.CTA_WEATHER_PROXY_URL.trim();
      }
    } catch (e) {}
    return proxyUrl;
  }

  function getCityById(cityId) {
    return CITY_PRESETS.find(c => c.id === cityId) || CITY_PRESETS[0];
  }

  function getCityLabel(city, lang) {
    const safeLang = (lang === 'en' || lang === 'ja') ? lang : 'ko';
    const target = typeof city === 'string' ? getCityById(city) : (city || CITY_PRESETS[0]);
    return target[safeLang] || target.ko;
  }

  function getSelectedCityId() {
    try {
      const saved = global.localStorage && global.localStorage.getItem(CITY_STORAGE_KEY);
      if (saved && CITY_PRESETS.some(c => c.id === saved)) return saved;
    } catch (e) {}
    return CITY_PRESETS[0].id;
  }

  function setSelectedCityId(cityId) {
    const city = getCityById(cityId);
    try {
      if (global.localStorage) global.localStorage.setItem(CITY_STORAGE_KEY, city.id);
    } catch (e) {}
    return city;
  }

  function readWeatherCache(cityId) {
    try {
      if (!global.localStorage) return null;
      const raw = global.localStorage.getItem(CACHE_STORAGE_KEY);
      if (!raw) return null;
      const map = JSON.parse(raw);
      if (!map || typeof map !== 'object') return null;
      const entry = map[cityId];
      if (!entry || typeof entry !== 'object') return null;
      if ((Date.now() - Number(entry.fetchedAt || 0)) > CACHE_TTL_MS) return null;
      return entry;
    } catch (e) {
      return null;
    }
  }

  function writeWeatherCache(cityId, payload) {
    try {
      if (!global.localStorage) return;
      let map = {};
      try {
        const prev = JSON.parse(global.localStorage.getItem(CACHE_STORAGE_KEY) || '{}');
        if (prev && typeof prev === 'object' && !Array.isArray(prev)) map = prev;
      } catch (e) {
        map = {};
      }
      map[cityId] = {
        cityId,
        condition: payload.condition || null,
        tempC: (typeof payload.tempC === 'number' && !isNaN(payload.tempC)) ? payload.tempC : null,
        fetchedAt: Date.now()
      };
      global.localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(map));
    } catch (e) {}
  }

  function mapKmaToCondition(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const valid = ['clear', 'cloudy', 'rain', 'snow', 'hot', 'cold'];
    if (typeof raw.condition === 'string' && valid.indexOf(raw.condition.toLowerCase()) >= 0) {
      return raw.condition.toLowerCase();
    }
    const pty = Number(raw.pty || 0);
    if (pty === 3 || pty === 7) return 'snow';
    if (pty > 0) return 'rain';
    const sky = Number(raw.sky || 1);
    if (sky >= 3) return 'cloudy';
    return 'clear';
  }

  function isFileProtocol() {
    try {
      return Boolean(global.location && global.location.protocol === 'file:');
    } catch (e) {
      return false;
    }
  }

  function isOffline() {
    try {
      return Boolean(global.navigator && global.navigator.onLine === false);
    } catch (e) {
      return false;
    }
  }

  function makeFallbackResult(city, reason) {
    return {
      ok: false,
      source: 'fallback',
      reason: reason || 'no_proxy',
      city,
      condition: null,
      tempC: null
    };
  }

  function fetchWeatherForCity(cityId) {
    const city = getCityById(cityId || getSelectedCityId());
    const cached = readWeatherCache(city.id);
    if (cached && cached.condition) {
      return Promise.resolve({
        ok: true,
        source: 'cache',
        city,
        condition: cached.condition,
        tempC: cached.tempC
      });
    }

    const activeProxy = resolveProxyUrl();

    if (!activeProxy || isFileProtocol() || isOffline() || typeof global.fetch !== 'function') {
      return Promise.resolve(makeFallbackResult(city, !activeProxy ? 'no_proxy' : 'offline_or_file'));
    }

    const sep = activeProxy.indexOf('?') >= 0 ? '&' : '?';
    const reqUrl = `${activeProxy}${sep}nx=${encodeURIComponent(city.nx)}&ny=${encodeURIComponent(city.ny)}`;

    let controller = null;
    let timerId = null;
    const fetchOpts = { method: 'GET', mode: 'cors', credentials: 'omit' };
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      fetchOpts.signal = controller.signal;
      timerId = setTimeout(() => {
        try { controller.abort(); } catch (e) {}
      }, FETCH_TIMEOUT_MS);
    }

    return global.fetch(reqUrl, fetchOpts)
      .then(res => {
        if (timerId) clearTimeout(timerId);
        if (!res || !res.ok) return makeFallbackResult(city, 'http_error');
        return res.json().then(json => {
          const condition = mapKmaToCondition(json);
          const tempC = (json && typeof json.tempC === 'number' && !isNaN(json.tempC))
            ? json.tempC
            : (json && json.t1h !== undefined && !isNaN(Number(json.t1h)) ? Number(json.t1h) : null);
          if (!condition) return makeFallbackResult(city, 'invalid_payload');
          writeWeatherCache(city.id, { condition, tempC });
          return {
            ok: true,
            source: 'proxy',
            city,
            condition,
            tempC
          };
        }).catch(() => makeFallbackResult(city, 'parse_error'));
      })
      .catch(() => {
        if (timerId) clearTimeout(timerId);
        return makeFallbackResult(city, 'network_or_timeout');
      });
  }

  // 명시적 버튼 클릭 시에만 실행: 좌표를 메모리에서 최근접 도시 프리셋으로 즉시 변환 후 폐기
  function findNearestPreset(lat, lon) {
    let best = CITY_PRESETS[0];
    let bestDistSq = Infinity;
    for (let i = 0; i < CITY_PRESETS.length; i++) {
      const p = CITY_PRESETS[i];
      const dLat = lat - p.lat;
      const dLon = lon - p.lon;
      const distSq = (dLat * dLat) + (dLon * dLon);
      if (distSq < bestDistSq) {
        bestDistSq = distSq;
        best = p;
      }
    }
    return best;
  }

  function detectNearestPresetByGps() {
    return new Promise((resolve) => {
      if (!global.navigator || !global.navigator.geolocation) {
        resolve({ ok: false, reason: 'unsupported', city: getCityById(getSelectedCityId()) });
        return;
      }
      global.navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos && pos.coords ? Number(pos.coords.latitude) : NaN;
          const lon = pos && pos.coords ? Number(pos.coords.longitude) : NaN;
          if (isNaN(lat) || isNaN(lon)) {
            resolve({ ok: false, reason: 'invalid_coords', city: getCityById(getSelectedCityId()) });
            return;
          }
          // 위경도는 여기서 즉시 가장 가까운 도시 프리셋 ID로만 변환되며 저장/전송하지 않음
          const nearest = findNearestPreset(lat, lon);
          setSelectedCityId(nearest.id);
          resolve({ ok: true, city: nearest });
        },
        () => {
          resolve({ ok: false, reason: 'denied_or_timeout', city: getCityById(getSelectedCityId()) });
        },
        { enableHighAccuracy: false, timeout: 4000, maximumAge: 600000 }
      );
    });
  }

  const WeatherService = {
    version: '1.0.0',
    get PROXY_URL() { return resolveProxyUrl(); },
    set PROXY_URL(val) { proxyUrl = typeof val === 'string' ? val.trim() : ''; },
    CITY_PRESETS,
    CACHE_TTL_MS,
    FETCH_TIMEOUT_MS,
    getCityById,
    getCityLabel,
    getSelectedCityId,
    setSelectedCityId,
    fetchWeatherForCity,
    detectNearestPresetByGps,
    findNearestPreset
  };

  global.WeatherService = WeatherService;
})(typeof window !== 'undefined' ? window : globalThis);
