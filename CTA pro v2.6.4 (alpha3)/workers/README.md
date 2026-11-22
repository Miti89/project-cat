# KMA Short-Term Forecast Proxy (Cloudflare Workers)

Coffee Taste Archive (`CTA`)의 **Today's Pick 2단계(기상청 단기예보 연동)**를 위해 공공데이터포털 API 키를 서버 측에 안전하게 보관하고, 격자(`nx`, `ny`)별로 **1시간 Edge 캐시**를 제공하는 경량 Cloudflare Worker입니다.

## 1. 특징
- **무료 구간 최적화:** Cloudflare Workers 무료 플랜(일 100,000건) + 격자(`nx, ny`)별 1시간 Edge 캐시 + 클라이언트 `localStorage.cta_weather_cache` 1시간 이중 캐시.
- **API 키 보호:** `KMA_API_KEY`는 Cloudflare Secret으로만 보관되며 브라우저에 노출되지 않습니다 (`KMA_SERVICE_KEY` 하위 호환 지원).
- **위치정보법 부담 최소화:** 클라이언트에서 위경도를 전송하지 않고, 10개 주요 도시·구 프리셋의 기상청 공식 격자(`nx`, `ny`)만 조회합니다.
- **자동 폴백:** Worker가 배포되지 않았거나 장애·오프라인·`file://` 실행 시에도 `weather-service.js`가 3초 타임아웃 후 에러 없이 1단계(날짜·계절·시간대) 추천으로 자동 전환합니다.

## 2. 4단계 즉시 배포 가이드 (원라이너)

1. **공공데이터포털 키 발급:** [공공데이터포털](https://www.data.go.kr)에서 `기상청_단기예보 ((구)_동네예보) 조회서비스` 활용신청 후 **일반 인증키(Decoding)** 복사.
2. **Cloudflare Secret 등록:**
   ```bash
   cd workers && npx wrangler secret put KMA_API_KEY
   ```
3. **Worker 배포 (`workers/wrangler.toml` 설정 완료):**
   ```bash
   cd workers && npx wrangler deploy
   ```
4. **클라이언트 `PROXY_URL` 연결** (배포된 `https://cta-kma-weather-proxy.<subdomain>.workers.dev` URL 적용):
   ```js
   // 방법 A: 런타임 전역 오버라이드 (권장, weather-service.js 로드 전 또는 후)
   window.CTA_WEATHER_PROXY_URL = "https://cta-kma-weather-proxy.<subdomain>.workers.dev";
   // 방법 B: WeatherService setter 직접 지정
   WeatherService.PROXY_URL = "https://cta-kma-weather-proxy.<subdomain>.workers.dev";
   ```

## 3. API 요청/응답 형식

- **요청:** `GET /?nx=61&ny=126`
- **응답 예시 (`200 OK`, `Cache-Control: public, max-age=3600`):**
  ```json
  {
    "ok": true,
    "nx": 61,
    "ny": 126,
    "baseDate": "20261119",
    "baseTime": "1600",
    "pty": 0,
    "tempC": 14.2,
    "humidity": 52,
    "condition": "clear",
    "updatedAt": "2026-11-19T07:05:00.000Z"
  }
  ```
