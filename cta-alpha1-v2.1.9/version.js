const APP_VERSION_INFO = {
  projectName: "Coffee Taste Archive - SCA 120종 스페셜",
  projectShortCode: "CTA",
  projectTitleKor: "커피 맛 아카이브",
  engineName: "DispenserV2 ™",
  version: "2.1.9",
  stage: "α1",
  get displayLabel() {
    return `${this.projectShortCode} v${this.version}${this.stage ? ` (${this.stage})` : ""}`;
  },
  updatedAt: "2026-11-18",
  dbCount: 120,
  history: [
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
