# Project Identity & Mandatory Auto-Versioning Rule

## 1. 프로젝트, 검색 엔진 및 스키마 명칭 원칙
- 프로젝트 공식 명칭: Coffee Taste Archive - SCA 120종 스페셜 (약칭: CTA, 한글명: 커피 맛 아카이브)
- 검색·추천 엔진 명칭: Dispenser (DispenserV2 ™)
- 데이터 스키마 버전: `APP_VERSION_INFO.schemaVersion` (현재 `v3.1`)으로 관리하며, `version_log` 팝오버 상단 요약 박스에 `현재 빌드`, `검색 엔진`과 동일한 형식으로 `스키마 버전: vX`를 함께 표시합니다.
- 화면 버전 표기 위치: 디스펜서 위젯 우측 하단 `powered by DispenserV2 ™` 바로 아래에 `CTA vX.Y.Z (α2)` 형태로 표시하며 클릭 시 `version_log` 팝오버를 엽니다.
- 릴리즈 단계(`stage`) 전환 기준: `α1`(MVP) → `α2`(Phase 1 데이터 신뢰도·Alpha2 완료) → `α3`(Phase 2 엔진 분리·날씨 추천) → `β1`(Phase 3 공개 런칭) → `β2`(로그인·MY 맛 도감) → `β3`(커머스·안정화) → 정식 `CTA-V1` (`stage: ""`). 단계 변경 시 `scripts/bump-version.js --stage <단계>`를 사용합니다.

## 2. 코드 및 스키마 수정 시 자동 버전 업 및 변경 문구 기록 (필수 강제 규칙)
사용자의 요청으로 `index.html`, `data.js` 등 프로젝트 코드를 수정할 때마다(사용자가 명시적으로 버전 업 생략을 요청한 경우 제외), 작업을 마무리하기 전에 반드시 아래 4단계를 자동으로 수행해야 합니다:

1. `version.js` 앱 버전 번호 자동 증가:
   - UI/스타일/문구/버그 수정 시: `APP_VERSION_INFO.version`의 세 번째 자리(Patch)를 +1 올립니다 (예: `2.3.0 -> 2.3.1`).
   - 신규 기능 추가 또는 DB·스키마 확장 시: 두 번째 자리(Minor)를 +1 올리고 세 번째 자리를 0으로 초기화합니다 (예: `2.3.0 -> 2.4.0`).
   - 별도 지시가 없으면 현재 `stage`(현재 `"α2"`)는 그대로 유지하고, Phase 완료로 단계가 전환될 때만 `--stage` 옵션으로 갱신합니다. `APP_VERSION_INFO.updatedAt`은 한국 시간(KST) 기준 당일 날짜(`YYYY-MM-DD`)로 갱신합니다.
2. `data.js` 스키마 업데이트/수정 시 스키마 버전(`schemaVersion`) 자동 증가:
   - `data.js`의 스키마 구조, 데이터 필드, `COFFEE_TAXONOMY`, 다국어 사전(`UI_I18N`, `ORIGIN_I18N_MAP`), 추적성(`traceability`, `BEAN_TRACEABILITY_OVERRIDES`) 등이 수정·업데이트될 때마다 `APP_VERSION_INFO.schemaVersion`도 반드시 함께 증가시킵니다.
     - 스키마 필드 보완·데이터/번역/출처 매핑 등 소규모 스키마 수정 시: 소수점 버전을 +0.1 올립니다 (예: `v3 -> v3.1`, `v3.1 -> v3.2`).
     - 스키마 구조 전면 개편·신규 데이터 모델 도입 등 메이저 업그레이드 시: 정수 버전을 +1 올립니다 (예: `v3 -> v4`, `v3.2 -> v4`).
   - 스키마 버전이 변경된 경우 `APP_VERSION_INFO.history[0]`에 `schemaVersion: "새스키마버전"` 속성을 기록하고, `index.html`의 `version_log` 폴백 기본값(`schemaVer`)에도 새 스키마 버전을 동기화합니다.
3. `version.js` 및 `CHANGELOG.md`에 수정 요약 문구 자동 추가:
   - `APP_VERSION_INFO.history` 배열의 맨 앞(index 0)에 아래 형식으로 이번 수정 내역을 한 줄 요약해 삽입합니다:
     `{ version: "새버전", stage: "α1", ...(스키마 변경 시 schemaVersion: "새스키마버전"), date: "YYYY-MM-DD", summary: "이번에 수정한 내용을 명확하고 간결하게 요약한 한국어 문구" }`
   - `CHANGELOG.md` 파일 상단에도 동일한 버전·스키마 버전(변경 시)·날짜·수정 요약 문구를 누적 기록합니다.
4. `index.html` 상단 주석, 하단 버튼 기본값 및 캐시 쿼리 동기화:
   - `index.html` 최상단 주석의 `REVISION: vX.Y.Z (α1)`, `#dispenserVersionBtn` 텍스트(`CTA vX.Y.Z (α1)`), `version_log`의 기본 버전·스키마 폴백, 그리고 `version.js?v=X.Y.Z` 및 `data.js?v=X.Y.Z`의 버전 쿼리를 새 버전으로 함께 맞춰줍니다.
