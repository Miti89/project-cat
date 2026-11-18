# Project Identity & Mandatory Auto-Versioning Rule

## 1. 프로젝트 및 검색 엔진 명칭 원칙
- 프로젝트 공식 명칭: Coffee Taste Archive - SCA 120종 스페셜 (약칭: CTA, 한글명: 커피 맛 아카이브)
- 검색·추천 엔진 명칭: Dispenser (DispenserV2 ™)
- 화면 버전 표기 위치: 디스펜서 위젯 우측 하단 `powered by DispenserV2 ™` 바로 아래에 `CTA vX.Y.Z (α1)` 형태로 표시하며 클릭 시 `version_log` 팝오버를 엽니다.

## 2. 코드 수정 시 자동 버전 업 및 변경 문구 기록 (필수 강제 규칙)
사용자의 요청으로 index.html, data.js 등 프로젝트 코드를 수정할 때마다, 작업을 마무리하기 전에 반드시 아래 3단계를 자동으로 수행해야 합니다:

1. version.js 버전 번호 자동 증가:
   - UI/스타일/문구/버그 수정 시: APP_VERSION_INFO.version의 세 번째 자리(Patch)를 +1 올립니다 (예: 2.1.7 -> 2.1.8).
   - 신규 기능 추가 또는 DB 확장 시: 두 번째 자리(Minor)를 +1 올리고 세 번째 자리를 0으로 초기화합니다 (예: 2.1.8 -> 2.2.0).
   - 별도 지시가 없으면 stage("α1")는 그대로 유지하고, APP_VERSION_INFO.updatedAt을 한국 시간(KST) 기준 당일 날짜(YYYY-MM-DD)로 갱신합니다.
2. version.js 및 CHANGELOG.md에 수정 요약 문구 자동 추가:
   - APP_VERSION_INFO.history 배열의 맨 앞(index 0)에 아래 형식으로 이번 수정 내역을 한 줄 요약해 삽입합니다:
     { version: "새버전", stage: "α1", date: "YYYY-MM-DD", summary: "이번에 수정한 내용을 명확하고 간결하게 요약한 한국어 문구" }
   - CHANGELOG.md 파일 상단에도 동일한 버전·날짜·수정 요약 문구를 누적 기록합니다.
3. index.html 상단 주석, 하단 버튼 기본값 및 캐시 쿼리 동기화:
   - index.html 최상단 주석의 REVISION: vX.Y.Z (α1), #dispenserVersionBtn 텍스트(CTA vX.Y.Z (α1)), 그리고 version.js?v=X.Y.Z 및 data.js?v=X.Y.Z의 버전 쿼리를 새 버전으로 함께 맞춰줍니다.
