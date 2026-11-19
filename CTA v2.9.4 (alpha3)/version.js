const APP_VERSION_INFO = {
  projectName: "Coffee Taste Archive - SCA 120종 스페셜",
  projectShortCode: "CTA",
  projectTitleKor: "커피 맛 아카이브",
  engineName: "Casper™ V1",
  version: "2.9.4",
  stage: "α3",
  schemaVersion: "v3.4",
  get displayLabel() {
    return `${this.projectShortCode} v${this.version}${this.stage ? ` (${this.stage})` : ""}`;
  },
  updatedAt: "2026-11-20",
  dbCount: 120,
  history: [
    {
      version: "2.9.4",
      stage: "α3",
      schemaVersion: "v3.4",
      date: "2026-11-20",
      summary: "Phase 2.5A 보완 패치 4: 메인 4키 바(.workman-piano-bar)와 상세 도감 탭(.modal-segment-tabs)을 빈티지 종이 시소(Rocker) + 하단 얇은 선 인디케이터(::after)로 통일(LED 점 제거), 영수증 티켓·프린터 및 html2canvas 완전 제거, 상세 도감 '간략히(이름→지표 위·3/5축 레이더 아래→바리스타 한 줄) / 자세히(해독바·스펙·다이얼링·출처)' 전면 개편 및 하단 균형 3열 액션 바(읽어주기·마셔본 원두·비교 담기) 재편, Ui6 6단계 상세 인터랙티브 튜토리얼 업그레이드"
    },
    {
      version: "2.9.3",
      stage: "α3",
      schemaVersion: "v3.4",
      date: "2026-11-20",
      summary: "Phase 2.5A 보완 패치 3: 상단 고정바(.top-nav-bar) 완전 제거 및 드럼 화살표 호버·클릭·nudge 제거, 하단 4연동 피아노키(2fr 2fr 1fr 1fr: 룰렛·검색·산지·설정) 확장 및 인스크린 원산지 도감 면(#drumFaceOrigin) 신설, 설정 면 하단 3열 컨트롤(소리·언어·버전) 통합, 어두운 갈색 통합 푸터 바(powered by Casper™ V1·전체 원두·마셔본·?) 및 도감 스크롤 우측 플로팅 '↑' FAB(비교 트레이 자동 오프셋) 구현"
    },
    {
      version: "2.9.2",
      stage: "α3",
      schemaVersion: "v3.4",
      date: "2026-11-20",
      summary: "Phase 2.5A 보완 패치 2: 드럼 3면 순서 개편(좌 🎰 룰렛 · 중 🔍 검색 기본 활성 · 우 ⚙️ 설정), 상단바 슬림화(원산지 도감·🌐 KR·? 3개), 우측 설정 면에 통합 타임피스-추천 카드(블루스틸 초시계·도시/GPS·시간→커피 1줄 추천) 및 하단 2열 유틸리티 컨트롤(🔊 소리·📋 버전) 통합, 하단 명판 powered by Casper™ V1 단일 시그니처 중앙 정렬"
    },
    {
      version: "2.9.1",
      stage: "α3",
      schemaVersion: "v3.4",
      date: "2026-11-19",
      summary: "Phase 2.5A UI 완성 보완 패치: 드럼 하우징 CSS Grid 물리 분리(화살표·톱니·창 겹침 0) 및 내부 이중 보더 제거, --drum-face-height 단일 고정 높이 락(3면 전환 시 높이 변동 0px), 검색 2×2 카테고리 상시 노출·Today's Pick 3단 풀-밸런스 보강, powered by Casper™ V1·버전 배지 하단 명판 푸터 바 독립 배치"
    },
    {
      version: "2.9.0",
      stage: "α3",
      schemaVersion: "v3.4",
      date: "2026-11-19",
      summary: "Phase 2.5A UI/UX 대개편: '?' 버튼 스크롤 숨김 동기화, 상세 도감·영수증 티켓·버튼 3단계 명도 계층 및 고대비(WCAG AA 4.5:1+) 가독성 개선, 검색·Casper 룰렛·Today's Pick을 워크맨 3연동 물리 피아노키 + 단일 수직 드럼 데크로 통합(톱니 롤러·호버 까딱 예고·드롭다운 overflow 자동 복원·Ui6/다국어 완역)"
    },
    {
      version: "2.8.1",
      stage: "α3",
      schemaVersion: "v3.4",
      date: "2026-11-19",
      summary: "Phase 2 마무리 3% 보완 패치 (Schema v3.4): 일회성 작업 스크립트 3종 정리, 실명 42종(ESTATE_LOT) 로트별 고유 바리스타 다이얼링 노트(ko/en/ja) 개성화, Cloudflare Workers 즉시 배포 세팅(wrangler.toml·KMA_API_KEY·weather-service.js 런타임 PROXY_URL 오버라이드·README 4단계 가이드) 완결"
    },
    {
      version: "2.8.0",
      stage: "α3",
      schemaVersion: "v3.3",
      date: "2026-11-19",
      summary: "Phase 2-2C (DB 검수 & 다이얼링 노트 · Schema v3.3) 및 Gate 2-2 완료: 120종 바리스타 다이얼링 노트(dialingNote: { ko, en, ja }) 필드 및 상세 모달 박스 연동, 실명 42종(ESTATE_LOT) 영·일 카피 현지화 검수, SCA CVA(Descriptive/Affective/Extrinsic) 용어 정교화, 60/60 회귀 통과 및 Gate 2-2 검증 완료"
    },
    {
      version: "2.7.0",
      stage: "α3",
      date: "2026-11-19",
      summary: "Phase 2-2B (Today's Pick & 날씨 추천) 완료: 바리스타 추천 기준표(docs/barista_recommendation_rules.md), Casper™ V1 getTodaysPick() 1단계 무API(날짜·계절·시간대) 코어, weather-service.js(도시·구 격자 프리셋·1시간 캐시·3초 타임아웃 자동 폴백·선택형 무저장 GPS) 및 Cloudflare Workers 기상청 프록시(workers/kma-weather-proxy.js), Today's Pick 배너 UI, jsc 회귀 60/60 통과"
    },
    {
      version: "2.6.0",
      stage: "α3",
      date: "2026-11-19",
      summary: "Phase 2-2A (Alpha3 UX 확장) 완료: Ui7 첫 진입 간단(3축)/자세히(5축) 온보딩 모드 선택, Ui6 3단계 인터랙티브 튜토리얼(휠→레버→도감) 및 '?' 다시보기, 커피 2종 플로팅 비교 트레이·3축/5축 오버레이 SVG 레이더·스펙 비교 모달 구현"
    },
    {
      version: "2.5.1",
      stage: "α3",
      date: "2026-11-19",
      summary: "Phase 2-1 긴급 패치: boot.js를 #disclaimerOverlay 직후로 이동해 0프레임 FOUC 차단 복원, Dispenser v2 잔존 문구 Casper™ V1 통일, GEMINI.md 단계 동기화 및 Git 저장소·v2.5.1-alpha3 태그 초기화"
    },
    {
      version: "2.5.0",
      stage: "α3",
      schemaVersion: "v3.2",
      date: "2026-11-19",
      summary: "Phase 2-1 (Alpha3 코어) 완료: Casper™ V1 검색 엔진 분리 및 승격, 인라인 핸들러 0건 & XSS 방어, 공백 복합어·외래어 오타·다중필드 초성·생산자 검색 고도화, 실시간 자동완성·검색기록 연동, jsc 회귀 50/50 통과, Gate 2-1 브라우저 검증 완료"
    },
    {
      version: "2.4.0",
      stage: "α2",
      schemaVersion: "v3.1",
      date: "2026-11-19",
      summary: "Phase 1 (Alpha2) 완료: 49종 생산자 3그룹 검증·재분류(실명 42·지역등급 53·검증대기 9·가짜출처 0), EN/JP 한국어 혼입 제거, WCR 품종 정규화, 간단(3축)/자세히(5축+단맛) SVG 레이더 차트, 추출온도·방식 안내, 4대 카테고리 재분류, 시음날짜 영구보존 및 모바일/증기/검색 버그 9건 수정, html2canvas SRI 적용"
    },
    {
      version: "2.3.0",
      stage: "α1",
      schemaVersion: "v3",
      date: "2026-11-18",
      summary: "Schema v3 업그레이드, 한·영·일(KR/EN/JP) 다국어 전환 스위치, 120종 생산자·농장·공식 출처(Traceability) 및 실제 유통 원두 검색(Google/Naver) 연동, 스키마 버전 자동 관리 체계 구축"
    },
    {
      version: "2.1.9",
      stage: "α1",
      date: "2026-11-18",
      summary: "카카오톡 인앱 브라우저 티켓 이미지 저장 미리보기 모달 지원, 검색창 카테고리 겹침 해소, 전체 120종 버튼 이모티콘 삭제·효과음 수정 및 상단 소리/원산지 버튼 택타일 디자인 통일"
    },
    {
      version: "2.1.8",
      stage: "α1",
      date: "2026-11-18",
      summary: "상단 타이틀 밸런스 재배치, 음성 검색 제거, 모바일 스크롤 터치 사운드 오작동 차단, 크래프트 박스 초기 노출 순서 및 화면 덜컹거림 개선"
    },
    {
      version: "2.1.7",
      stage: "α1",
      date: "2026-11-18",
      summary: "버전 기록 링크(CTA v2.1.7 (α1))를 powered by DispenserV2 ™ 하단에 적용 및 자동 버전 동기화 오류 수정"
    },
    {
      version: "2.1.6",
      stage: "α1",
      date: "2026-11-18",
      summary: "Coffee Taste Archive - SCA 120종 스페셜 브랜드 정립, powered by DispenserV2 ™ 엔진 시그니처 적용 및 자동 버전 기록 시스템 구축"
    },
    {
      version: "2.1.5",
      stage: "α1",
      date: "2026-11-18",
      summary: "상세 도감 탭 스위처에 빈티지 종이 톤 시소(Rocker) 물리 메커니즘 및 로우프로파일 택타일 버튼 시스템 적용"
    },
    {
      version: "2.1.4",
      stage: "α1",
      date: "2026-11-18",
      summary: "도감 요약 카드 4단 다이어트 및 상세 모달 스토리 카드 통합·여백 1.5배 확대"
    },
    {
      version: "2.1.3",
      stage: "α1",
      date: "2026-11-17",
      summary: "원두 이름 3초 자동 해독 칩, 입문자 10초 기초 개념 요약, 마셔본 원두(TASTED) 모아보기 필터 추가"
    },
    {
      version: "2.1.2",
      stage: "α1",
      date: "2026-11-17",
      summary: "상단 커피 이야기 서랍 제거 및 상세 도감 전용 3개 반투명 고스트 '?' 마이크로 가이드 적용"
    },
    {
      version: "2.1.1",
      stage: "α1",
      date: "2026-11-17",
      summary: "SCA CVA & WCR 국제 표준 기반 120종 스페셜티 마스터 DB(Schema v2) 확장 및 DispenserV2 최소 6장 스마트 큐레이션 엔진 탑재"
    }
  ]
};
