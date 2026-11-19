# Coffee Taste Archive - SCA 120종 스페셜 Changelog

## v2.8.1 (α3) · Schema v3.4 (2026-11-19)
- Phase 2 마무리 3% 보완 패치 (Schema v3.4): 일회성 작업 스크립트 3종 정리, 실명 42종(ESTATE_LOT) 로트별 고유 바리스타 다이얼링 노트(ko/en/ja) 개성화, Cloudflare Workers 즉시 배포 세팅(wrangler.toml·KMA_API_KEY·weather-service.js 런타임 PROXY_URL 오버라이드·README 4단계 가이드) 완결

## v2.8.0 (α3) · Schema v3.3 (2026-11-19)
- Phase 2-2C (DB 검수 & 다이얼링 노트 · Schema v3.3) 및 Gate 2-2 완료: 120종 바리스타 다이얼링 노트(dialingNote: { ko, en, ja }) 필드 및 상세 모달 박스 연동, 실명 42종(ESTATE_LOT) 영·일 카피 현지화 검수, SCA CVA(Descriptive/Affective/Extrinsic) 용어 정교화, 60/60 회귀 통과 및 Gate 2-2 검증 완료

## v2.7.0 (α3) (2026-11-19)
- Phase 2-2B (Today's Pick & 날씨 추천) 완료: 바리스타 추천 기준표(docs/barista_recommendation_rules.md), Casper™ V1 getTodaysPick() 1단계 무API(날짜·계절·시간대) 코어, weather-service.js(도시·구 격자 프리셋·1시간 캐시·3초 타임아웃 자동 폴백·선택형 무저장 GPS) 및 Cloudflare Workers 기상청 프록시(workers/kma-weather-proxy.js), Today's Pick 배너 UI, jsc 회귀 60/60 통과

## v2.6.0 (α3) (2026-11-19)
- Phase 2-2A (Alpha3 UX 확장) 완료: Ui7 첫 진입 간단(3축)/자세히(5축) 온보딩 모드 선택, Ui6 3단계 인터랙티브 튜토리얼(휠→레버→도감) 및 '?' 다시보기, 커피 2종 플로팅 비교 트레이·3축/5축 오버레이 SVG 레이더·스펙 비교 모달 구현

## v2.5.1 (α3) (2026-11-19)
- Phase 2-1 긴급 패치: boot.js를 #disclaimerOverlay 직후로 이동해 0프레임 FOUC 차단 복원, Dispenser v2 잔존 문구 Casper™ V1 통일, GEMINI.md 단계 동기화 및 Git 저장소·v2.5.1-alpha3 태그 초기화

## v2.5.0 (α3) · Schema v3.2 (2026-11-19)
- Phase 2-1 (Alpha3 코어) 완료: Casper™ V1 검색 엔진 분리 및 승격, 인라인 핸들러 0건 & XSS 방어, 공백 복합어·외래어 오타·다중필드 초성·생산자 검색 고도화, 실시간 자동완성·검색기록 연동, jsc 회귀 50/50 통과, Gate 2-1 브라우저 검증 완료

## v2.4.0 (α2) · Schema v3.1 (2026-11-19)
- Phase 1 (Alpha2) 완료: 49종 생산자 3그룹 검증·재분류(실명 42·지역등급 53·검증대기 9·가짜출처 0), EN/JP 한국어 혼입 제거, WCR 품종 정규화, 간단(3축)/자세히(5축+단맛) SVG 레이더 차트, 추출온도·방식 안내, 4대 카테고리 재분류, 시음날짜 영구보존 및 모바일/증기/검색 버그 9건 수정, html2canvas SRI 적용

## v2.3.0 (α1) · Schema v3 (2026-11-18)
- Schema v3 업그레이드, 한·영·일(KR/EN/JP) 다국어 전환 스위치, 120종 생산자·농장·공식 출처(Traceability) 및 실제 유통 원두 검색(Google/Naver) 연동, 스키마 버전 자동 관리 체계 구축

## v2.1.9 (α1) (2026-11-18)
- 카카오톡 인앱 브라우저 티켓 이미지 저장 미리보기 모달 지원, 검색창 카테고리 겹침 해소, 전체 120종 버튼 이모티콘 삭제·효과음 수정 및 상단 소리/원산지 버튼 택타일 디자인 통일

## v2.1.8 (α1) (2026-11-18)
- 상단 타이틀 밸런스 재배치, 음성 검색 제거, 모바일 스크롤 터치 사운드 오작동 차단, 크래프트 박스 초기 노출 순서 및 화면 덜컹거림 개선

## v2.1.7 (α1) (2026-11-18)
- 버전 기록 링크(CTA v2.1.7 (α1))를 powered by DispenserV2 ™ 하단에 적용 및 자동 버전 동기화 오류 수정

## v2.1.6 (α1) (2026-11-18)
- Coffee Taste Archive - SCA 120종 스페셜 브랜드 정립, powered by DispenserV2 ™ 엔진 시그니처 적용 및 자동 버전 기록 시스템 구축

## v2.1.5 (α1) (2026-11-18)
- 상세 도감 탭 스위처에 빈티지 종이 톤 시소(Rocker) 물리 메커니즘 및 로우프로파일 택타일 버튼 시스템 적용

## v2.1.4 (α1) (2026-11-18)
- 도감 요약 카드 4단 다이어트 및 상세 모달 스토리 카드 통합·여백 1.5배 확대

## v2.1.3 (α1) (2026-11-17)
- 원두 이름 3초 자동 해독 칩, 입문자 10초 기초 개념 요약, 마셔본 원두(TASTED) 모아보기 필터 추가

## v2.1.2 (α1) (2026-11-17)
- 상단 커피 이야기 서랍 제거 및 상세 도감 전용 3개 반투명 고스트 '?' 마이크로 가이드 적용

## v2.1.1 (α1) (2026-11-17)
- SCA CVA & WCR 국제 표준 기반 120종 스페셜티 마스터 DB(Schema v2) 확장 및 DispenserV2 최소 6장 스마트 큐레이션 엔진 탑재
