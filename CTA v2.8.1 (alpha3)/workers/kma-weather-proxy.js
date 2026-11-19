/**
 * Cloudflare Workers Proxy for Korea Meteorological Administration (KMA) Short-Term Forecast
 * - Protects KMA_SERVICE_KEY as a Cloudflare Worker secret (never exposed in client JS)
 * - Caches normalized weather payload per DFS grid (nx, ny) for 1 hour in Cloudflare Edge Cache
 * - Returns CORS headers so static sites (Cloudflare Pages / GitHub Pages) can fetch safely
 */

const KMA_ULTRA_SRT_NCST_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
const CACHE_TTL_SECONDS = 3600;

function corsHeaders(extra) {
  return Object.assign({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=utf-8'
  }, extra || {});
}

function getKstBaseDateTime(nowDate) {
  // KST = UTC + 9h; 초단기실황은 매시 정각 기준 생성 후 약 40분 이후 안정 제공되므로 45분 이전이면 직전 시각 사용
  const kstMs = nowDate.getTime() + (9 * 60 * 60 * 1000);
  const kst = new Date(kstMs);
  if (kst.getUTCMinutes() < 45) {
    kst.setUTCHours(kst.getUTCHours() - 1);
  }
  const yyyy = kst.getUTCFullYear();
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(kst.getUTCDate()).padStart(2, '0');
  const hh = String(kst.getUTCHours()).padStart(2, '0');
  return {
    baseDate: `${yyyy}${mm}${dd}`,
    baseTime: `${hh}00`
  };
}

function normalizeCondition(pty, tempC) {
  if (pty === 3 || pty === 7) return 'snow';
  if (pty > 0) return 'rain';
  if (typeof tempC === 'number' && !isNaN(tempC)) {
    if (tempC >= 28) return 'hot';
    if (tempC <= 4) return 'cold';
  }
  return 'clear';
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
        status: 405,
        headers: corsHeaders()
      });
    }

    const url = new URL(request.url);
    const nx = parseInt(url.searchParams.get('nx') || '', 10);
    const ny = parseInt(url.searchParams.get('ny') || '', 10);
    if (!Number.isInteger(nx) || !Number.isInteger(ny) || nx < 1 || nx > 149 || ny < 1 || ny > 253) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_grid' }), {
        status: 400,
        headers: corsHeaders()
      });
    }

    const kmaKey = env && (env.KMA_API_KEY || env.KMA_SERVICE_KEY);
    if (!kmaKey) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_kma_key' }), {
        status: 503,
        headers: corsHeaders()
      });
    }

    // 격자(nx, ny) 단위 Edge 1시간 캐시
    const cacheKeyUrl = new URL(request.url);
    cacheKeyUrl.search = `?nx=${nx}&ny=${ny}`;
    const cacheKey = new Request(cacheKeyUrl.toString(), { method: 'GET' });
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) {
      return cached;
    }

    const { baseDate, baseTime } = getKstBaseDateTime(new Date());
    const upstreamUrl = `${KMA_ULTRA_SRT_NCST_URL}?serviceKey=${encodeURIComponent(kmaKey)}&pageNo=1&numOfRows=20&dataType=JSON&base_date=${baseDate}&base_time=${baseTime}&nx=${nx}&ny=${ny}`;

    try {
      const upstreamRes = await fetch(upstreamUrl, { cf: { cacheTtl: CACHE_TTL_SECONDS } });
      if (!upstreamRes.ok) {
        return new Response(JSON.stringify({ ok: false, error: 'upstream_http_error' }), {
          status: 502,
          headers: corsHeaders()
        });
      }

      const data = await upstreamRes.json();
      const items = data?.response?.body?.items?.item;
      if (!Array.isArray(items) || items.length === 0) {
        return new Response(JSON.stringify({ ok: false, error: 'empty_forecast' }), {
          status: 502,
          headers: corsHeaders()
        });
      }

      let pty = 0;
      let tempC = null;
      let reh = null;

      for (const row of items) {
        if (row.category === 'PTY') pty = Number(row.obsrValue || 0);
        else if (row.category === 'T1H') {
          const v = Number(row.obsrValue);
          if (!isNaN(v)) tempC = v;
        } else if (row.category === 'REH') {
          const v = Number(row.obsrValue);
          if (!isNaN(v)) reh = v;
        }
      }

      const payload = {
        ok: true,
        nx,
        ny,
        baseDate,
        baseTime,
        pty,
        tempC,
        humidity: reh,
        condition: normalizeCondition(pty, tempC),
        updatedAt: new Date().toISOString()
      };

      const response = new Response(JSON.stringify(payload), {
        status: 200,
        headers: corsHeaders({
          'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`
        })
      });

      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: 'upstream_fetch_failed' }), {
        status: 502,
        headers: corsHeaders()
      });
    }
  }
};
