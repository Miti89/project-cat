// 1. 산지 도감 마스터 데이터 (SCA CVA & WCR 기반 27개 산지 + 3대 특별 테마 = 총 30개 카테고리)
// [Schema v3.4] SCA CVA & WCR 기반 27개 산지 + 3대 특별 테마 (순수 산지 데이터 영역)
const originData = [
  {
    "code": "ETH",
    "continent": "AFRICA",
    "country": "에티오피아",
    "flag": "🇪🇹",
    "flavor": "자스민, 복숭아, 레몬티, 베리",
    "desc": "아라비카 커피의 발상지. 쓴맛 없이 향긋한 꽃차와 산뜻한 과일 과즙미가 독보적입니다.",
    "query": "에티오피아",
    "matchTokens": [
      "ETHIOPIA",
      "ETH",
      "에티오피아",
      "예가체프",
      "구지",
      "시다마",
      "게뎁"
    ]
  },
  {
    "code": "KEN",
    "continent": "AFRICA",
    "country": "케냐",
    "flag": "🇰🇪",
    "flavor": "자몽, 블랙커런트, 레드와인, 오렌지",
    "desc": "SL28·SL34 품종과 더블 워시드 공법이 빚어낸 톡 쏘는 감귤·자몽 산미와 묵직한 와인 바디감.",
    "query": "케냐",
    "matchTokens": [
      "KENYA",
      "KEN",
      "케냐",
      "녜리",
      "키리냐가"
    ]
  },
  {
    "code": "RWA",
    "continent": "AFRICA",
    "country": "르완다",
    "flag": "🇷🇼",
    "flavor": "청사과, 자몽청, 아카시아 꿀, 석류",
    "desc": "천 개의 언덕(고산 화산토)에서 자란 레드 버본의 싱그러운 사과 산미와 은은한 꿀 단맛.",
    "query": "르완다",
    "matchTokens": [
      "RWANDA",
      "RWA",
      "르완다"
    ]
  },
  {
    "code": "BDI",
    "continent": "AFRICA",
    "country": "부룬디",
    "flag": "🇧🇮",
    "flavor": "오렌지 마멀레이드, 계피, 무화과 홍차",
    "desc": "아프리카의 심장. 더블 페멘테이션 워시드와 허니 가공으로 완성한 따뜻한 홍차 향과 과실 단맛.",
    "query": "부룬디",
    "matchTokens": [
      "BURUNDI",
      "BDI",
      "부룬디",
      "카얀자"
    ]
  },
  {
    "code": "TZA",
    "continent": "AFRICA",
    "country": "탄자니아",
    "flag": "🇹🇿",
    "flavor": "자두, 레드와인, 블랙베리, 피베리",
    "desc": "킬리만자로와 음베야 고산지대가 키운 원두. 와인처럼 단단한 골격과 깊은 과실 풍미.",
    "query": "탄자니아",
    "matchTokens": [
      "TANZANIA",
      "TZA",
      "탄자니아",
      "킬리만자로",
      "음베야"
    ]
  },
  {
    "code": "UGA",
    "continent": "AFRICA",
    "country": "우간다",
    "flag": "🇺🇬",
    "flavor": "건포도, 다크체리, 흑설탕, 카카오",
    "desc": "엘곤산과 루웬조리 고산지대 원두. 신맛이 적고 흑설탕·말린 과일처럼 묵직한 단맛.",
    "query": "우간다",
    "matchTokens": [
      "UGANDA",
      "UGA",
      "우간다",
      "부기수",
      "루웬조리"
    ]
  },
  {
    "code": "PAN",
    "continent": "LATAM",
    "country": "파나마",
    "flag": "🇵🇦",
    "flavor": "베르가못, 자스민, 백도, 골드키위",
    "desc": "보케테·볼칸 고산지대 게이샤의 성지. 향수처럼 투명한 플로럴과 우아한 단맛의 정점.",
    "query": "파나마",
    "matchTokens": [
      "PANAMA",
      "PAN",
      "파나마",
      "보케테",
      "에스메랄다",
      "엘리다",
      "볼칸"
    ]
  },
  {
    "code": "CRI",
    "continent": "LATAM",
    "country": "코스타리카",
    "flag": "🇨🇷",
    "flavor": "청포도 사탕, 아카시아 꿀, 체리 와인",
    "desc": "화이트·레드·블랙 허니 가공의 종주국. SHB 경질두 특유의 맑은 산미와 황금 밸런스.",
    "query": "코스타리카",
    "matchTokens": [
      "COSTA RICA",
      "CRI",
      "코스타리카",
      "따라주",
      "도타"
    ]
  },
  {
    "code": "GTM",
    "continent": "LATAM",
    "country": "과테말라",
    "flag": "🇬🇹",
    "flavor": "다크 초콜릿, 구운 아몬드, 오렌지 블로섬",
    "desc": "안티구아·우에우에테낭고·아카테낭고 화산토가 키운 SHB 등급. 깊은 초콜릿 고소함부터 화사한 게이샤·파카마라까지.",
    "query": "과테말라",
    "matchTokens": [
      "GUATEMALA",
      "GTM",
      "과테말라",
      "안티구아",
      "우에우에테낭고",
      "아카테낭고"
    ]
  },
  {
    "code": "SLV",
    "continent": "LATAM",
    "country": "엘살바도르",
    "flag": "🇸🇻",
    "flavor": "아몬드 버터, 토스트, 자두 사탕, 메이플",
    "desc": "버본과 파카마라 품종의 본고장. 둥글고 크리미한 질감과 메이플 시럽 같은 단맛.",
    "query": "엘살바도르",
    "matchTokens": [
      "EL SALVADOR",
      "SALVADOR",
      "SLV",
      "엘살바도르",
      "산타아나"
    ]
  },
  {
    "code": "HND",
    "continent": "LATAM",
    "country": "온두라스",
    "flag": "🇭🇳",
    "flavor": "청사과, 카라멜, 파인애플, 밀크초콜릿",
    "desc": "산타바바라·마르칼라 고산지대 SHG 원두. 싱그러운 사과·열대과일 산미와 부드러운 카라멜 단맛.",
    "query": "온두라스",
    "matchTokens": [
      "HONDURAS",
      "HND",
      "온두라스",
      "혼두라스",
      "마르칼라",
      "산타바바라"
    ]
  },
  {
    "code": "NIC",
    "continent": "LATAM",
    "country": "니카라과",
    "flag": "🇳🇮",
    "flavor": "카카오 닙스, 익은 바나나, 아몬드 초콜릿",
    "desc": "히노테가·마타갈파의 마라고지페(코끼리 콩)와 자바(Java) 롱베리. 도톰한 바디감과 초콜릿 풍미.",
    "query": "니카라과",
    "matchTokens": [
      "NICARAGUA",
      "NIC",
      "니카라과",
      "마라고지페",
      "히노테가"
    ]
  },
  {
    "code": "MEX",
    "continent": "LATAM",
    "country": "멕시코",
    "flag": "🇲🇽",
    "flavor": "구운 피칸, 밀크초콜릿, 오렌지 필, 시나몬",
    "desc": "치아파스·오아하카 고산지대 알투라(Altura) 원두. 깔끔하고 가벼운 바디감에 은은한 견과류 단맛.",
    "query": "멕시코",
    "matchTokens": [
      "MEXICO",
      "MEX",
      "멕시코",
      "치아파스",
      "오아하카",
      "알투라",
      "플루마"
    ]
  },
  {
    "code": "COL",
    "continent": "LATAM",
    "country": "콜롬비아",
    "flag": "🇨🇴",
    "flavor": "호두, 사탕수수, 핑크자몽, 복숭아 요거트",
    "desc": "안데스 3대 산맥의 축복. 국민 표준 수프레모부터 핑크버본·치로소·유제니오이데스·열충격 발효까지 스페셜티의 허브.",
    "query": "콜롬비아",
    "matchTokens": [
      "COLOMBIA",
      "COL",
      "콜롬비아",
      "후일라",
      "우일라",
      "수프레모",
      "카우카"
    ]
  },
  {
    "code": "BRA",
    "continent": "LATAM",
    "country": "브라질",
    "flag": "🇧🇷",
    "flavor": "볶은 땅콩, 보리차, 헤이즐넛, 화이트초콜릿",
    "desc": "세계 최대 커피 생산국. 산미 자극 없이 고소하고 둥글며, 천연 저카페인 로리나와 신품종 아라라까지 품고 있습니다.",
    "query": "브라질",
    "matchTokens": [
      "BRAZIL",
      "BRA",
      "브라질",
      "세라도",
      "모지아나",
      "다테라",
      "만티케이라"
    ]
  },
  {
    "code": "PER",
    "continent": "LATAM",
    "country": "페루",
    "flag": "🇵🇪",
    "flavor": "말린 사과, 순한 호두, 백도, 레몬버베나",
    "desc": "안데스 카하마르카·찬차마요 유기농 고산지 원두. 자극 없이 깨끗한 단맛과 급부상한 고산지 게이샤 산지.",
    "query": "페루",
    "matchTokens": [
      "PERU",
      "PER",
      "페루",
      "찬차마요",
      "카하마르카"
    ]
  },
  {
    "code": "ECU",
    "continent": "LATAM",
    "country": "에콰도르",
    "flag": "🇪🇨",
    "flavor": "녹차, 청사과 과즙, 망고스틴, 자스민",
    "desc": "적도 안데스 로하·피친차 고산지. 시드라(Sidra)와 티피카 메호라도 등 월드 챔피언십 우승 품종의 보물창고.",
    "query": "에콰도르",
    "matchTokens": [
      "ECUADOR",
      "ECU",
      "에콰도르",
      "로하",
      "피친차",
      "시드라"
    ]
  },
  {
    "code": "BOL",
    "continent": "LATAM",
    "country": "볼리비아",
    "flag": "🇧🇴",
    "flavor": "아카시아 꽃향기, 꿀물, 파인애플, 마카다미아",
    "desc": "카라나비 융가스 고산지대. 빙하수 워시드와 코코 내추럴 공법이 빚어내는 투명하고 달콤한 여운.",
    "query": "볼리비아",
    "matchTokens": [
      "BOLIVIA",
      "BOL",
      "볼리비아",
      "카라나비"
    ]
  },
  {
    "code": "YEM",
    "continent": "MIDEAST_ASIA",
    "country": "예멘",
    "flag": "🇾🇪",
    "flavor": "건포도 와인, 다크초콜릿, 카다멈, 자두",
    "desc": "모카(Mocha) 커피의 역사적 기원. 고대 테라스 밭에서 자연 건조한 예메니아 품종의 신비로운 와인·초콜릿 풍미.",
    "query": "예멘",
    "matchTokens": [
      "YEMEN",
      "YEM",
      "예멘",
      "모카",
      "마타리",
      "하라즈",
      "예메니아"
    ]
  },
  {
    "code": "JAM",
    "continent": "ISLANDS",
    "country": "자메이카",
    "flag": "🇯🇲",
    "flavor": "밀크초콜릿, 피칸 버터, 실크 밸런스",
    "desc": "세계 3대 명품 '블루마운틴 No.1'. 산미·단맛·고소함이 비단처럼 매끄럽게 어우러지는 왕실의 커피.",
    "query": "자메이카",
    "matchTokens": [
      "JAMAICA",
      "JAM",
      "자메이카",
      "블루마운틴"
    ]
  },
  {
    "code": "USA",
    "continent": "ISLANDS",
    "country": "하와이",
    "flag": "🇺🇸",
    "flavor": "마카다미아, 밝은 꽃향기, 버터스카치, 피칸",
    "desc": "세계 3대 명품 '하와이 코나(Kona)'와 신성 '카우(Ka'u)'. 화산토와 해풍이 키운 버터처럼 고소하고 산뜻한 풍미.",
    "query": "하와이",
    "matchTokens": [
      "HAWAII",
      "USA",
      "하와이",
      "코나",
      "카우"
    ]
  },
  {
    "code": "IDN",
    "continent": "MIDEAST_ASIA",
    "country": "인도네시아",
    "flag": "🇮🇩",
    "flavor": "카카오 90%, 삼나무, 감귤 초콜릿, 묵직한 바디",
    "desc": "수마트라 습식탈곡(Giling Basah) 만델링·토라자의 묵직함과 발리 화산 내추럴의 오렌지 초콜릿 풍미.",
    "query": "인도네시아",
    "matchTokens": [
      "INDONESIA",
      "IDN",
      "인도네시아",
      "만델링",
      "토라자",
      "가요",
      "발리"
    ]
  },
  {
    "code": "PNG",
    "continent": "ISLANDS",
    "country": "파푸아뉴기니",
    "flag": "🇵🇬",
    "flavor": "열대 망고, 구아바, 구운 견과류, 사탕수수",
    "desc": "자메이카 블루마운틴 티피카 종자를 화산토에 이식해 이국적인 열대과일 단맛과 고소함이 조화롭습니다.",
    "query": "파푸아뉴기니",
    "matchTokens": [
      "PNG",
      "PAPUA",
      "파푸아뉴기니",
      "파푸아",
      "시그리",
      "바로이다"
    ]
  },
  {
    "code": "VNM",
    "continent": "MIDEAST_ASIA",
    "country": "베트남",
    "flag": "🇻🇳",
    "flavor": "서양배 와인, 다크 카카오, 솔티드 카라멜",
    "desc": "달랏 고산지대 무산소 아라비카와 CQI 인증 파인 로부스타(Fine Robusta)로 진화한 아시아 스페셜티.",
    "query": "베트남",
    "matchTokens": [
      "VIETNAM",
      "VNM",
      "베트남",
      "달랏",
      "람동"
    ]
  },
  {
    "code": "CHN",
    "continent": "MIDEAST_ASIA",
    "country": "중국 (운남)",
    "flag": "🇨🇳",
    "flavor": "자두 푸딩, 보이차·홍차, 체리 초콜릿",
    "desc": "히말라야 남단 운남(보산·푸얼) 고산지대. 이중발효와 와인 효모 발효로 완성한 자두·홍차 뉘앙스의 다크호스.",
    "query": "운남",
    "matchTokens": [
      "CHINA",
      "CHN",
      "YUNNAN",
      "운남",
      "중국",
      "보산",
      "푸얼"
    ]
  },
  {
    "code": "IND",
    "continent": "MIDEAST_ASIA",
    "country": "인도",
    "flag": "🇮🇳",
    "flavor": "구운 땅콩, 스파이시 후추, 다크 초콜릿, 무산미",
    "desc": "아라비아해 해풍에 숙성한 몬순 말라바(Monsooned Malabar)와 고산지 원두의 신맛 없는 묵직한 고소함.",
    "query": "인도",
    "matchTokens": [
      "INDIA",
      "IND",
      "인도",
      "말라바",
      "아티칸",
      "몬순"
    ]
  },
  {
    "code": "TLS",
    "continent": "MIDEAST_ASIA",
    "country": "동티모르",
    "flag": "🇹🇱",
    "flavor": "야생화 꿀, 구운 헤이즐넛, 무화과, 보리차",
    "desc": "아라비카와 로부스타가 자연 교잡된 '하이브리도 데 티모르'의 고향. 유기농 야생 재배의 순한 단맛.",
    "query": "동티모르",
    "matchTokens": [
      "TIMOR",
      "TLS",
      "동티모르",
      "레테포호",
      "마우베시"
    ]
  },
  {
    "code": "FER",
    "continent": "SPECIAL",
    "country": "특수발효 (무산소·열충격)",
    "flag": "🧪",
    "flavor": "복숭아 요거트, 리치, 망고 라씨, 패션프루트",
    "desc": "인공 향료 없이 순수 커피 체리와 미생물·온도 제어(Anaerobic, Thermal Shock, Koji, CM)만으로 빚어낸 과즙 폭탄.",
    "query": "특수발효",
    "matchTokens": [
      "FERMENTED_LOT",
      "ANAEROBIC",
      "THERMAL SHOCK",
      "특수발효",
      "무산소",
      "서멀쇼크",
      "카보닉",
      "코지"
    ]
  },
  {
    "code": "FLV",
    "continent": "SPECIAL",
    "country": "가향 / 인퓨즈드",
    "flag": "✨",
    "flavor": "헤이즐넛, 바닐라, 민트초코, 위스키, 한라봉, 티라미수",
    "desc": "천연 향미 오일이나 과일·허브·오크통 숙성(Infused / Barrel Aged)을 더해 디저트처럼 즐기는 플레이버 커피.",
    "query": "가향",
    "matchTokens": [
      "FLAVORED",
      "INFUSED",
      "BARREL",
      "가향",
      "인퓨즈드",
      "오크통"
    ]
  },
  {
    "code": "BLD",
    "continent": "SPECIAL",
    "country": "하우스 블렌드",
    "flag": "☕",
    "flavor": "다크초콜릿, 아몬드, 꿀우유, 시트러스, 아카시아",
    "desc": "서로 다른 산지와 품종의 장점을 정교하게 배합하여 매일 마셔도 완벽한 조화를 선사하는 시그니처 블렌드.",
    "query": "하우스",
    "matchTokens": [
      "HOUSE BLEND",
      "HOUSE_BLEND",
      "BLEND",
      "하우스",
      "블렌드"
    ]
  }
];

// 2. SCA & WCR 국제 표준 기반 100종 마스터 데이터베이스 (Schema v2 정규화 완료)
// [Schema v2] 기존 19개 필드 100% 유지 + countryCode, region, categoryType, species, lineage, processGroup, physicalGrade, sweetDots, sweetDesc, flavorFamily, caffeine, brewOverride 추가
const coffeeData = [
  {"id": "eth-01", "no": "NO. 01", "name": "에티오피아 아바야 게이샤", "eng": "Ethiopia Abaya Geisha Natural", "origin": "🇪🇹 ETHIOPIA", "varietal": "Geisha", "process": "Natural (햇볕 건조)", "altitude": "1,900m ~ 2,100m", "roast": "Light", "headline": "자스민 꽃차에 잘 익은 복숭아를 띄운 듯한 우아한 과즙미", "sourDots": 4, "sourDesc": "상큼달콤한 복숭아 과즙", "nuttyDots": 1, "nuttyDesc": "구수함 대신 화사한 꽃향", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (맑은 허브티 느낌)", "guide": "쓴맛이 전혀 없는 향긋한 과일차 스타일을 찾으시는 분께 추천합니다.", "keywords": ["꽃향", "과일향", "홍차", "복숭아", "게이샤", "자스민", "1단계"], "countryCode": "ETH", "region": "Guji Abaya (구지 아바야)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "processGroup": "Natural", "physicalGrade": "G1 Micro-lot", "sweetDots": 5, "sweetDesc": "복숭아청처럼 농밀한 단맛", "flavorFamily": ["Floral", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "dialingNote": {"ko": "아바야 고지대 게이샤 내추럴: 91°C·1:16·2:25 V60로 추출하면 자스민과 베리 단맛이 투명하게 열립니다.", "en": "Abaya high-altitude Gesha Natural: Brew at 91°C, 1:16 in 2:25 on V60 to lift jasmine and berry sweetness.", "ja": "アバヤ高地ゲイシャ・ナチュラル：91°C・1:16・2分25秒のV60でジャスミンとベリーの甘みが澄み渡ります。"}},
  {"id": "eth-02", "no": "NO. 02", "name": "에티오피아 예가체프 G1", "eng": "Ethiopia Yirgacheffe G1 Washed", "origin": "🇪🇹 ETHIOPIA", "varietal": "Heirloom", "process": "Washed (물 세척)", "altitude": "1,800m ~ 2,000m", "roast": "Light-Medium", "headline": "레몬 한 조각 띄운 깔끔하고 산뜻한 얼그레이 홍차 맛", "sourDots": 4, "sourDesc": "새콤산뜻한 레몬티", "nuttyDots": 1, "nuttyDesc": "잡미 없는 깨끗함", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (레몬홍차·사과주스)", "guide": "식사 후 텁텁한 입안을 깔끔하게 씻어내고 싶을 때 최고입니다.", "keywords": ["레몬", "홍차", "예가체프", "산뜻한", "2단계"], "countryCode": "ETH", "region": "Yirgacheffe (예가체프)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace", "processGroup": "Washed", "physicalGrade": "G1 (결점두 0~3개 최상급)", "sweetDots": 3, "sweetDesc": "깔끔한 레몬 사탕 단맛", "flavorFamily": ["Floral", "Fruity"], "caffeine": "REGULAR", "brewOverride": "약중배전 91~92°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "eth-03", "no": "NO. 03", "name": "에티오피아 첼베사 워시드", "eng": "Ethiopia Chelbesa Washed", "origin": "🇪🇹 ETHIOPIA", "varietal": "Heirloom", "process": "Washed (물 세척)", "altitude": "2,000m ~ 2,200m", "roast": "Light", "headline": "살구와 아카시아 꿀을 넣은 은은하고 고급스러운 밀차 맛", "sourDots": 3, "sourDesc": "은은한 살구빛 산미", "nuttyDots": 2, "nuttyDesc": "부드럽고 맑은 여운", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (가볍고 맑은 티 느낌)", "guide": "강한 산미는 부담스럽지만 은은한 과일 향을 즐기고 싶은 분께 적합합니다.", "keywords": ["살구", "꿀", "첼베사", "워시드", "에티오피아", "1단계"], "countryCode": "ETH", "region": "Gedeb Chelbesa (게뎁 첼베사)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace", "processGroup": "Washed", "physicalGrade": "G1 (결점두 최상급)", "sweetDots": 4, "sweetDesc": "아카시아 꿀처럼 맑은 단맛", "flavorFamily": ["Floral", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "dialingNote": {"ko": "첼베사 2,100m 고밀도 워시드: 93°C·중약분쇄·1:16.5 푸어오버로 베르가못과 화이트피치 산미를 선명히 뽑으세요.", "en": "Chelbesa 2,100m dense Washed: Pour-over at 93°C, medium-fine, 1:16.5 to highlight bergamot and white peach.", "ja": "チェルベサ2,100m高密度ウォッシュド：93°C・中細挽き・1:16.5でベルガモットと白桃の酸味を鮮明に。"}},
  {"id": "eth-04", "no": "NO. 04", "name": "에티오피아 구지 함벨라 내추럴", "eng": "Ethiopia Guji Hambela Natural", "origin": "🇪🇹 ETHIOPIA", "varietal": "Heirloom", "process": "Natural (햇볕 건조)", "altitude": "1,950m ~ 2,150m", "roast": "Light-Medium", "headline": "진한 딸기잼과 블루베리가 터져 나오는 화려한 베리 맛", "sourDots": 4, "sourDesc": "달콤진한 베리 과즙", "nuttyDots": 1, "nuttyDesc": "새콤달콤한 향미", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (포도주스처럼 달콤함)", "guide": "커피에서 진짜 딸기와 포도 맛이 나는 신기한 경험을 원할 때 고르세요.", "keywords": ["딸기", "블루베리", "구지", "내추럴", "2단계"], "countryCode": "ETH", "region": "Guji Hambela (구지 함벨라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace", "processGroup": "Natural", "physicalGrade": "G1 (결점두 최상급)", "sweetDots": 5, "sweetDesc": "진한 딸기잼과 베리 단맛", "flavorFamily": ["Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "구지 함벨라 내추럴: 90°C·3회 분할 푸어·1:15.5로 추출해 잘 익은 블루베리 잼과 밀크초콜릿 여운을 살리세요.", "en": "Guji Hambela Natural: Use 90°C, 3-pour structure at 1:15.5 to balance ripe blueberry jam and milk chocolate.", "ja": "グジ・ハンベラ・ナチュラル：90°C・3投分割・1:15.5で熟したブルーベリージャムとミルクチョコの余韻を引き出します。"}},
  {"id": "eth-05", "no": "NO. 05", "name": "에티오피아 시다마 벤사 무산소", "eng": "Ethiopia Sidama Bensa Anaerobic", "origin": "🇪🇹 ETHIOPIA", "varietal": "Heirloom", "process": "Anaerobic (특별 숙성)", "altitude": "2,000m ~ 2,200m", "roast": "Light", "headline": "장미 향수와 자두 통조림의 화려하고 매력적인 향연", "sourDots": 4, "sourDesc": "화려한 자두 과즙산미", "nuttyDots": 1, "nuttyDesc": "매혹적인 장미향", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (와인처럼 향기로움)", "guide": "향이 아주 진하고 독특하여 스페셜티 커피 마니아들에게 인기가 높습니다.", "keywords": ["장미", "자두", "무산소", "시다마", "2단계"], "countryCode": "ETH", "region": "Sidama Bensa (시다마 벤사)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Ethiopian Landrace", "processGroup": "Anaerobic", "physicalGrade": "G1 Anaerobic Lot", "sweetDots": 4, "sweetDesc": "자두 시럽 같은 화사한 단맛", "flavorFamily": ["Floral", "Fruity", "Fermented"], "caffeine": "REGULAR", "brewOverride": "특수발효 89~90°C · 20g / 300ml", "dialingNote": {"ko": "시다마 벤사 무산소 발효: 88°C 저온·중굵은 분쇄·2:10 단기 추출로 과발효 톤 없이 열대과일 향만 깔끔히 담으세요.", "en": "Sidama Bensa Anaerobic: Brew cooler at 88°C, medium-coarse in 2:10 for clean tropical aromatics without funk.", "ja": "シダマ・ベンサ嫌気性発酵：88°C低温・中粗挽き・2分10秒の短時間抽出で雑味なくトロピカルな香りを。"}},
  {"id": "pan-01", "no": "NO. 06", "name": "파나마 에스메랄다 게이샤 워시드", "eng": "Panama Esmeralda Geisha Washed", "origin": "🇵🇦 PANAMA", "varietal": "Geisha", "process": "Washed (물 세척)", "altitude": "1,600m ~ 1,800m", "roast": "Light", "headline": "자스민 향수와 감귤의 황홀하고 투명한 '신의 커피'", "sourDots": 4, "sourDesc": "우아하고 투명한 산미", "nuttyDots": 1, "nuttyDesc": "화사한 꽃밭의 향기", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (생수처럼 걸림 없는 맑음)", "guide": "세계 최고가 명품 커피. 가장 맑고 우아한 맛의 정점을 보여줍니다.", "keywords": ["신의커피", "자스민", "베르가못", "최고급", "파나마", "1단계"], "countryCode": "PAN", "region": "Boquete (보케테 에스메랄다)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "processGroup": "Washed", "physicalGrade": "SHB Especial Auction Lot", "sweetDots": 4, "sweetDesc": "투명한 감귤 꿀 단맛", "flavorFamily": ["Floral", "Fruity"], "caffeine": "REGULAR", "brewOverride": "약배전 93~94°C · 20g / 310ml", "dialingNote": {"ko": "에스메랄다 게이샤 워시드: 93°C·연수(TDS 50~70ppm)·1:17·2:15로 추출해야 자스민과 베르가못 레이어가 온전히 피어납니다.", "en": "Esmeralda Gesha Washed: Soft water (50-70ppm) at 93°C, 1:17 in 2:15 lets jasmine and bergamot layers bloom.", "ja": "エスメラルダ・ゲイシャ・ウォッシュド：軟水・93°C・1:17・2分15秒でジャスミンとベルガモットの層が華開きます。"}},
  {"id": "pan-02", "no": "NO. 07", "name": "파나마 엘리다 게이샤 내추럴", "eng": "Panama Elida Geisha Natural", "origin": "🇵🇦 PANAMA", "varietal": "Geisha", "process": "Natural (햇볕 건조)", "altitude": "1,700m ~ 1,900m", "roast": "Light", "headline": "잘 익은 백도 복숭아와 파인애플의 농밀하고 달콤한 과즙", "sourDots": 4, "sourDesc": "달콤한 열대과일 과즙", "nuttyDots": 1, "nuttyDesc": "풍부한 과수원 향기", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (복숭아주스처럼 부드러움)", "guide": "복숭아와 망고 같은 열대 과일의 달콤함이 입안 가득 감돕니다.", "keywords": ["파나마", "엘리다", "복숭아", "파인애플", "게이샤", "2단계"], "countryCode": "PAN", "region": "Boquete (보케테 엘리다)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "processGroup": "Natural", "physicalGrade": "SHB Estate Reserve", "sweetDots": 5, "sweetDesc": "잘 익은 백도와 열대과일 단맛", "flavorFamily": ["Fruity", "Floral", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약배전 91~92°C · 20g / 300ml", "dialingNote": {"ko": "엘리다 게이샤 내추럴: 90°C·1:16·2:20 추출로 파파야·복숭아 과즙과 화사한 꽃향의 실키한 마우스필을 즐기세요.", "en": "Elida Gesha Natural: Brew at 90°C, 1:16 in 2:20 for silky mouthfeel packed with papaya, peach, and florals.", "ja": "エリダ・ゲイシャ・ナチュラル：90°C・1:16・2分20秒でパパイヤと桃の果汁感、絹のような口当たりを楽しめます。"}},
  {"id": "ken-01", "no": "NO. 08", "name": "케냐 AA TOP 녜리", "eng": "Kenya AA TOP Nyeri Washed", "origin": "🇰🇪 KENYA", "varietal": "SL28 / SL34", "process": "Washed (물 세척)", "altitude": "1,750m ~ 1,900m", "roast": "Medium-Dark", "headline": "쌉싸름한 자몽과 오렌지의 톡 쏘는 상쾌함과 묵직함", "sourDots": 4, "sourDesc": "풍부하고 진한 자몽산미", "nuttyDots": 2, "nuttyDesc": "쌉쌀한 여운", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (진한 과즙우유처럼 꽉 참)", "guide": "기름진 식사 후 개운한 한 잔, 시원한 아이스 드립으로 최고입니다.", "keywords": ["상큼한", "신맛", "자몽", "케냐", "개운한", "4단계"], "countryCode": "KEN", "region": "Nyeri (녜리)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (SL28/SL34)", "processGroup": "Washed", "physicalGrade": "AA TOP (Screen 17–18 최상급)", "sweetDots": 3, "sweetDesc": "자몽 과즙 뒤의 묵직한 단맛", "flavorFamily": ["Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중강배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "ken-02", "no": "NO. 09", "name": "케냐 AB 키리냐가 워시드", "eng": "Kenya AB Kirinyaga Washed", "origin": "🇰🇪 KENYA", "varietal": "SL28 / Ruiru 11", "process": "Washed (물 세척)", "altitude": "1,600m ~ 1,800m", "roast": "Medium", "headline": "블랙커런트와 레드와인의 깊고 붉은 과실의 풍미", "sourDots": 4, "sourDesc": "붉은 와인빛 과일산미", "nuttyDots": 2, "nuttyDesc": "깔끔한 마무리", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (포도주처럼 적당한 무게)", "guide": "적당한 바디감과 함께 붉은 포도 와인 같은 고급스러운 과일 맛이 납니다.", "keywords": ["케냐", "와인", "포도", "블랙커런트", "3단계"], "countryCode": "KEN", "region": "Kirinyaga (키리냐가)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon & Introgressed", "processGroup": "Washed", "physicalGrade": "AB (Screen 15–16 표준)", "sweetDots": 4, "sweetDesc": "레드와인과 건포도 단맛", "flavorFamily": ["Fruity", "Fermented"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "rwa-01", "no": "NO. 10", "name": "르완다 인조브 워시드", "eng": "Rwanda Inzovu Washed", "origin": "🇷🇼 RWANDA", "varietal": "Red Bourbon", "process": "Washed (물 세척)", "altitude": "1,700m ~ 2,000m", "roast": "Medium", "headline": "아오리 사과의 싱그러움과 꿀 홍차의 맑고 고운 단맛", "sourDots": 3, "sourDesc": "싱그러운 청사과맛", "nuttyDots": 3, "nuttyDesc": "은은한 구수함", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (사과주스처럼 맑음)", "guide": "자극적인 신맛 없이 사과처럼 은은하고 편안한 단맛을 즐길 수 있습니다.", "keywords": ["사과", "홍차", "르완다", "2단계", "부드러운"], "countryCode": "RWA", "region": "Northern Province (인조브)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Washed", "physicalGrade": "Specialty A1 (Screen 15+)", "sweetDots": 4, "sweetDesc": "사과 꿀차처럼 고운 단맛", "flavorFamily": ["Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "rwa-02", "no": "NO. 11", "name": "르완다 무사사 카보로 허니", "eng": "Rwanda Musasa Caboro Honey", "origin": "🇷🇼 RWANDA", "varietal": "Red Bourbon", "process": "Honey (단물 건조)", "altitude": "1,800m ~ 2,000m", "roast": "Medium", "headline": "자몽 청과 아카시아 꿀의 감칠맛 나는 부드러운 조화", "sourDots": 3, "sourDesc": "새콤달콤한 자몽청", "nuttyDots": 3, "nuttyDesc": "꿀 같은 단맛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (꿀물처럼 매끄러움)", "guide": "신맛과 달콤함이 유연하게 섞여 호불호 없이 누구나 편하게 즐깁니다.", "keywords": ["르완다", "허니", "꿀", "자몽청", "3단계"], "countryCode": "RWA", "region": "Gakenke Musasa (무사사)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Honey", "physicalGrade": "Specialty A1 Honey", "sweetDots": 4, "sweetDesc": "아카시아 꿀과 자몽청 단맛", "flavorFamily": ["Sweet", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "bur-01", "no": "NO. 12", "name": "부룬디 카얀자 은다로 워시드", "eng": "Burundi Kayanza Ndaro Washed", "origin": "🇧🇮 BURUNDI", "varietal": "Bourbon", "process": "Washed (물 세척)", "altitude": "1,700m ~ 1,900m", "roast": "Medium", "headline": "오렌지 마멀레이드와 계피의 따스하고 상큼한 풍미", "sourDots": 3, "sourDesc": "상큼한 오렌지맛", "nuttyDots": 3, "nuttyDesc": "은은한 계피향", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (오렌지티 느낌)", "guide": "따뜻한 차처럼 은은한 과일 향과 기분 좋은 달콤함이 밀려옵니다.", "keywords": ["부룬디", "오렌지", "계피", "따뜻한", "3단계"], "countryCode": "BDI", "region": "Kayanza (카얀자)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Washed", "physicalGrade": "AA Fully Washed", "sweetDots": 4, "sweetDesc": "오렌지 마멀레이드 단맛", "flavorFamily": ["Fruity", "Spiced", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "tan-01", "no": "NO. 13", "name": "탄자니아 킬리만자로 피베리", "eng": "Tanzania Kilimanjaro Peaberry", "origin": "🇹🇿 TANZANIA", "varietal": "N39 / KP423", "process": "Washed (물 세척)", "altitude": "1,400m ~ 1,800m", "roast": "Medium-Dark", "headline": "동글동글 귀여운 원두에서 터지는 와인과 자두의 쌉싸름함", "sourDots": 3, "sourDesc": "쌉쌀상큼한 자두맛", "nuttyDots": 3, "nuttyDesc": "묵직한 고소함", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (도톰하고 진함)", "guide": "한 열매에 동글게 하나만 자란 귀한 '피베리' 원두로 맛이 단단하고 진합니다.", "keywords": ["탄자니아", "킬리만자로", "피베리", "와인", "4단계"], "countryCode": "TZA", "region": "Kilimanjaro (킬리만자로)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon & Typica", "processGroup": "Washed", "physicalGrade": "PB (Peaberry 원형두)", "sweetDots": 3, "sweetDesc": "자두 와인 같은 묵직한 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중강배전 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "uga-01", "no": "NO. 14", "name": "우간다 부기수 엘곤 워시드", "eng": "Uganda Bugisu Elgon Washed", "origin": "🇺🇬 UGANDA", "varietal": "Bourbon", "process": "Washed (물 세척)", "altitude": "1,600m ~ 1,900m", "roast": "Medium-Dark", "headline": "건포도와 말린 자두의 묵직하고 달달한 농익은 풍미", "sourDots": 2, "sourDesc": "은은한 말린 과일맛", "nuttyDots": 4, "nuttyDesc": "진한 흑설탕 단맛", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (진하고 도톰함)", "guide": "신맛이 적고 건포도처럼 진하고 달콤한 맛이 든든하게 채워줍니다.", "keywords": ["우간다", "건포도", "흑설탕", "안신", "4단계"], "countryCode": "UGA", "region": "Mt. Elgon Bugisu (부기수)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Washed", "physicalGrade": "AA (Screen 17+ 고산지)", "sweetDots": 4, "sweetDesc": "진한 흑설탕과 건포도 단맛", "flavorFamily": ["Sweet", "Fruity", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중강배전 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "cos-01", "no": "NO. 15", "name": "코스타리카 따라주 허니", "eng": "Costa Rica Tarrazu Red Honey", "origin": "🇨🇷 COSTA RICA", "varietal": "Caturra / Catuai", "process": "Red Honey (단물 건조)", "altitude": "1,400m ~ 1,700m", "roast": "Medium", "headline": "싱그러운 청포도와 아카시아 꿀의 부드러운 황금 밸런스", "sourDots": 3, "sourDesc": "달콤한 청포도맛", "nuttyDots": 3, "nuttyDesc": "은은한 꿀단맛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (저지방우유처럼 매끄러움)", "guide": "신맛과 고소함이 가장 균형 있게 잡혀 매일 마시기 부드럽습니다.", "keywords": ["청포도", "꿀", "코스타리카", "균형", "3단계"], "countryCode": "CRI", "region": "Tarrazu (따라주)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Honey", "physicalGrade": "SHB EP (1,400m+ 고산지)", "sweetDots": 4, "sweetDesc": "청포도 사탕과 아카시아 꿀 단맛", "flavorFamily": ["Sweet", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "cos-02", "no": "NO. 16", "name": "코스타리카 라스 라하스 블랙 다이아몬드", "eng": "Costa Rica Las Lajas Black Diamond", "origin": "🇨🇷 COSTA RICA", "varietal": "Caturra", "process": "Natural (특수 건조)", "altitude": "1,300m ~ 1,500m", "roast": "Medium", "headline": "체리 와인과 무화과의 매우 농밀하고 정교한 프리미엄 단맛", "sourDots": 3, "sourDesc": "진한 체리 와인맛", "nuttyDots": 2, "nuttyDesc": "무화과의 깊은 단맛", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (와인처럼 묵직함)", "guide": "와인 농장에서 다듬은 듯 정교하고 농익은 체리 단맛을 선사합니다.", "keywords": ["코스타리카", "체리", "무화과", "와인", "4단계"], "countryCode": "CRI", "region": "Central Valley (라스 라하스)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Natural", "physicalGrade": "SHB Micro-lot", "sweetDots": 5, "sweetDesc": "무화과와 체리 와인의 농밀한 단맛", "flavorFamily": ["Fruity", "Fermented", "Sweet"], "caffeine": "REGULAR", "brewOverride": "내추럴 89~90°C · 20g / 300ml", "dialingNote": {"ko": "라스 라하스 블랙 다이아몬드: 89°C·1:15·2:35 추출로 건포도·블랙체리·다크초콜릿의 진한 내추럴 단맛을 끌어내세요.", "en": "Las Lajas Black Diamond: Extract at 89°C, 1:15 in 2:35 for deep raisin, black cherry, and dark chocolate sweetness.", "ja": "ラスラハス・ブラックダイヤモンド：89°C・1:15・2分35秒でレーズン、ダークチェリー、ビターチョコの濃密な甘みを。"}},
  {"id": "gtm-01", "no": "NO. 17", "name": "과테말라 안티구아 SHB", "eng": "Guatemala Antigua SHB Washed", "origin": "🇬🇹 GUATEMALA", "varietal": "Bourbon / Caturra", "process": "Washed (물 세척)", "altitude": "1,500m ~ 1,700m", "roast": "Medium-Dark", "headline": "구운 아몬드와 다크 초콜릿의 묵직하고 깊은 고소함", "sourDots": 1, "sourDesc": "신맛 거의 없음", "nuttyDots": 5, "nuttyDesc": "극강의 진한 고소함", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (일반우유·핫초코)", "guide": "스타벅스 스타일의 쌉싸름하고 구수한 커피를 찾는 분께 1순위 추천합니다.", "keywords": ["신맛없는", "안신", "고소한", "초콜릿", "과테말라", "4단계"], "countryCode": "GTM", "region": "Antigua (안티구아)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Washed", "physicalGrade": "SHB EP (1,500m+ 최고등급)", "sweetDots": 3, "sweetDesc": "다크 초콜릿과 아몬드 단맛", "flavorFamily": ["Nutty/Cocoa", "Roasted"], "caffeine": "REGULAR", "brewOverride": "중강배전 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "gtm-02", "no": "NO. 18", "name": "과테말라 우에우에테낭고", "eng": "Guatemala Huehuetenango SHB", "origin": "🇬🇹 GUATEMALA", "varietal": "Bourbon / Catuai", "process": "Washed (물 세척)", "altitude": "1,600m ~ 1,800m", "roast": "Medium", "headline": "밀크초콜릿과 잘 익은 사과의 조화로운 단맛", "sourDots": 2, "sourDesc": "은은한 사과산미", "nuttyDots": 4, "nuttyDesc": "달콤한 밀크초콜릿", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (도톰하고 부드러움)", "guide": "적당한 쌉싸름함과 달콤함이 어우러져 부담 없이 언제나 즐기기 좋습니다.", "keywords": ["밀크초콜릿", "과테말라", "우에우에테낭고", "4단계"], "countryCode": "GTM", "region": "Huehuetenango (우에우에테낭고)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Washed", "physicalGrade": "SHB EP (1,600m+ 최고등급)", "sweetDots": 4, "sweetDesc": "밀크초콜릿과 사과 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "gtm-03", "no": "NO. 19", "name": "과테말라 엘 인헤르토 파카마라", "eng": "Guatemala El Injerto Pacamara", "origin": "🇬🇹 GUATEMALA", "varietal": "Pacamara", "process": "Washed (물 세척)", "altitude": "1,500m ~ 1,800m", "roast": "Light-Medium", "headline": "왕 콩 원두에서 피어나는 화사한 오렌지 꽃과 복숭아 향", "sourDots": 4, "sourDesc": "화사한 오렌지 과즙", "nuttyDots": 2, "nuttyDesc": "고급스러운 단맛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (부드러운 과즙)", "guide": "원두 크기가 엄청 큰 '파카마라' 품종으로 꽃향기와 과일 단맛이 일품입니다.", "keywords": ["과테말라", "파카마라", "오렌지", "복숭아", "3단계"], "countryCode": "GTM", "region": "Huehuetenango (엘 인헤르토)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon × Typica (Pacamara)", "processGroup": "Washed", "physicalGrade": "SHB Auction Lot", "sweetDots": 4, "sweetDesc": "오렌지 블로섬과 백도 단맛", "flavorFamily": ["Floral", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 91~92°C · 20g / 300ml", "dialingNote": {"ko": "엘 인헤르토 파카마라 워시드: 92°C·1:16·2:35 추출로 화이트와인 같은 우아한 산미와 꿀·아몬드 여운을 선명히 살리세요.", "en": "El Injerto Pacamara Washed: Brew at 92°C, 1:16 in 2:35 for white-wine elegance, honey sweetness, and clean finish.", "ja": "エルインヘルト・パカマラ・ウォッシュド：92°C・1:16・2分35秒で白ワインの上品な酸と蜂蜜の余韻を鮮明に。"}},
  {"id": "sal-01", "no": "NO. 20", "name": "엘살바도르 산타아나 버본", "eng": "El Salvador Santa Ana Bourbon", "origin": "🇸🇻 EL SALVADOR", "varietal": "Bourbon", "process": "Washed (물 세척)", "altitude": "1,400m ~ 1,600m", "roast": "Medium", "headline": "갓 구운 토스트와 아몬드 버터의 부드러운 고소함", "sourDots": 2, "sourDesc": "은은하고 부드러움", "nuttyDots": 4, "nuttyDesc": "고소한 아몬드버터", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (따뜻한 보리차 느낌)", "guide": "자극 없이 고소하고 따뜻한 디저트와 함께 마시기 아주 좋습니다.", "keywords": ["엘살바도르", "아몬드", "토스트", "고소한", "3단계"], "countryCode": "SLV", "region": "Santa Ana (산타아나)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Washed", "physicalGrade": "SHG EP (1,400m+ 고산지)", "sweetDots": 4, "sweetDesc": "아몬드 버터와 토스트 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "sal-02", "no": "NO. 21", "name": "엘살바도르 파카마라 허니", "eng": "El Salvador Pacamara Honey", "origin": "🇸🇻 EL SALVADOR", "varietal": "Pacamara", "process": "Honey (단물 건조)", "altitude": "1,500m ~ 1,700m", "roast": "Medium", "headline": "자두 사탕과 메이플 시럽의 착 감기는 달콤함", "sourDots": 3, "sourDesc": "달콤한 자두맛", "nuttyDots": 3, "nuttyDesc": "메이플 시럽 단맛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (시럽처럼 매끈함)", "guide": "달콤한 자두와 시럽 같은 부드러움이 입안을 기분 좋게 감쌉니다.", "keywords": ["엘살바도르", "파카마라", "자두", "메이플", "3단계"], "countryCode": "SLV", "region": "Apaneca-Ilamatepec (아파네카)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon × Typica (Pacamara)", "processGroup": "Honey", "physicalGrade": "SHG Micro-lot", "sweetDots": 5, "sweetDesc": "메이플 시럽과 자두 캔디 단맛", "flavorFamily": ["Sweet", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "hon-01", "no": "NO. 22", "name": "온두라스 마르칼라 유기농", "eng": "Honduras Marcala Organic", "origin": "🇭🇳 HONDURAS", "varietal": "Catuai", "process": "Washed (물 세척)", "altitude": "1,300m ~ 1,600m", "roast": "Medium", "headline": "청사과의 산뜻함과 카라멜의 고소하고 착 착 감기는 맛", "sourDots": 2, "sourDesc": "은은한 청사과맛", "nuttyDots": 4, "nuttyDesc": "달콤한 카라멜", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (부드러운 우유 느낌)", "guide": "유기농으로 길러 건강하고 부드러운 카라멜 단맛을 매일 즐길 수 있습니다.", "keywords": ["혼두라스", "온두라스", "사과", "카라멜", "유기농", "3단계"], "countryCode": "HND", "region": "Marcala La Paz (마르칼라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Washed", "physicalGrade": "SHG Organic (유기농 최고등급)", "sweetDots": 4, "sweetDesc": "부드러운 카라멜과 사과 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "nic-01", "no": "NO. 23", "name": "니카라과 마라고지페 무산소", "eng": "Nicaragua Maragogype Anaerobic", "origin": "🇳🇮 NICARAGUA", "varietal": "Maragogype", "process": "Anaerobic (특별 숙성)", "altitude": "1,200m ~ 1,400m", "roast": "Medium", "headline": "카카오 닙스와 익은 바나나의 독특하고 진한 풍미", "sourDots": 2, "sourDesc": "은은한 발효산미", "nuttyDots": 4, "nuttyDesc": "진한 카카오닙스", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (도톰하고 진함)", "guide": "거대한 코끼리 콩 원두를 특수 발효하여 초콜릿과 바나나 향이 진하게 납니다.", "keywords": ["니카라과", "카카오", "바나나", "무산소", "4단계"], "countryCode": "NIC", "region": "Matagalpa (마타갈파)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Typica Lineage (Maragogype)", "processGroup": "Anaerobic", "physicalGrade": "SHG Elephant Bean", "sweetDots": 4, "sweetDesc": "잘 익은 바나나와 카카오 단맛", "flavorFamily": ["Nutty/Cocoa", "Fermented", "Sweet"], "caffeine": "REGULAR", "brewOverride": "특수발효 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 25초~2분 35초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 25s–2m 35s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分25秒〜2分35秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "jam-01", "no": "NO. 24", "name": "자메이카 블루마운틴 No.1", "eng": "Jamaica Blue Mountain No.1", "origin": "🇯🇲 JAMAICA", "varietal": "Typica", "process": "Washed (물 세척)", "altitude": "1,500m ~ 1,800m", "roast": "Medium", "headline": "영국 왕실이 사랑한 비단처럼 부드럽고 완벽한 밸런스", "sourDots": 2, "sourDesc": "투명하고 고운 산미", "nuttyDots": 4, "nuttyDesc": "비단 같은 부드러움", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (실크처럼 부드럽게 넘어감)", "guide": "세계 3대 명품 커피. 쓴맛, 신맛, 단맛이 어느 하나 튀지 않고 완벽합니다.", "keywords": ["블루마운틴", "자메이카", "영국왕실", "명품", "3단계"], "countryCode": "JAM", "region": "Blue Mountains (블루마운틴)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage", "processGroup": "Washed", "physicalGrade": "No.1 (Screen 17+ 무결점)", "sweetDots": 4, "sweetDesc": "실크처럼 고운 밀크초콜릿 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "col-01", "no": "NO. 25", "name": "콜롬비아 후일라 핑크버본", "eng": "Colombia Huila Pink Bourbon", "origin": "🇨🇴 COLOMBIA", "varietal": "Pink Bourbon", "process": "Washed (물 세척)", "altitude": "1,700m ~ 1,900m", "roast": "Light-Medium", "headline": "잘 익은 핑크빛 복숭아와 달콤한 자몽의 화사한 조화", "sourDots": 4, "sourDesc": "달콤새콤한 자몽 과즙", "nuttyDots": 2, "nuttyDesc": "부드러운 단맛", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (과일주스처럼 산뜻함)", "guide": "복숭아와 자몽의 부드러운 과즙 단맛이 화사하게 펼쳐집니다.", "keywords": ["핑크버본", "자몽", "복숭아", "콜롬비아", "2단계"], "countryCode": "COL", "region": "Huila (우일라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon / Landrace (Pink Bourbon)", "processGroup": "Washed", "physicalGrade": "Supremo Micro-lot", "sweetDots": 4, "sweetDesc": "핑크 자몽과 복숭아 과즙 단맛", "flavorFamily": ["Fruity", "Floral", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 91~92°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "col-02", "no": "NO. 26", "name": "콜롬비아 엘 플라세르 워터멜론", "eng": "Colombia El Placer Watermelon", "origin": "🇨🇴 COLOMBIA", "varietal": "Castillo", "process": "Infused (특별 숙성)", "altitude": "1,600m ~ 1,750m", "roast": "Light", "headline": "시원한 수박 화채와 달콤한 멜론 사탕의 청량함", "sourDots": 3, "sourDesc": "청량한 수박 과즙산미", "nuttyDots": 1, "nuttyDesc": "향미 중심", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (수박주스처럼 청량함)", "guide": "얼음을 가득 채운 시원한 아이스 커피로 마시면 진짜 수박 맛이 납니다.", "keywords": ["수박", "워터멜론", "가향", "인퓨즈드", "2단계"], "countryCode": "COL", "region": "Quindio (킨디오 엘 플라세르)", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Introgressed (Castillo)", "processGroup": "Infused", "physicalGrade": "Excelso Infused Lot", "sweetDots": 5, "sweetDesc": "시원한 수박 화채와 멜론 사탕 단맛", "flavorFamily": ["Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "인퓨즈드 88~89°C · 20g / 300ml", "dialingNote": {"ko": "엘 플라세르 워터멜론 인퓨즈드: 87°C 저온·굵은 분쇄·1:16·2:05 단기 추출로 수박 캔디 아로마를 깔끔하게 뽑고 아이스도 추천합니다.", "en": "El Placer Watermelon Infused: Brew cool at 87°C, coarse, 1:16 in 2:05 for crisp watermelon aroma; shines iced.", "ja": "エルプラセル・ウォーターメロン：87°C低温・粗挽き・1:16・2分05秒で爽快なスイカ香を。アイス抽出も絶品です。"}},
  {"id": "col-03", "no": "NO. 27", "name": "콜롬비아 엘 파라이소 피치", "eng": "Colombia El Paraiso Peach", "origin": "🇨🇴 COLOMBIA", "varietal": "Castillo", "process": "Anaerobic (특별 숙성)", "altitude": "1,700m ~ 1,950m", "roast": "Light-Medium", "headline": "복숭아 요거트와 달콤한 백도 통조림 과즙의 향연", "sourDots": 3, "sourDesc": "달콤한 요거트 산미", "nuttyDots": 1, "nuttyDesc": "향미 중심", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (요거트처럼 부드러움)", "guide": "진짜 복숭아 요거트를 마시는 듯한 진한 단맛이 터져 나오는 원두입니다.", "keywords": ["복숭아", "피치", "요거트", "특수발효", "3단계", "무산소"], "countryCode": "COL", "region": "Cauca (카우카 엘 파라이소)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Introgressed (Castillo)", "processGroup": "Anaerobic", "physicalGrade": "Double Anaerobic Lot", "sweetDots": 5, "sweetDesc": "복숭아 요거트와 백도 통조림 단맛", "flavorFamily": ["Fruity", "Sweet", "Fermented"], "caffeine": "REGULAR", "brewOverride": "특수발효 88~89°C · 20g / 300ml", "dialingNote": {"ko": "엘 파라이소 피치 무산소: 88°C·1:16·2:15 추출로 복숭아 요거트와 화이트플로럴의 크리미한 향미를 과추출 없이 담아내세요.", "en": "El Paraiso Peach Anaerobic: Extract at 88°C, 1:16 in 2:15 for creamy peach yogurt and white florals without bitterness.", "ja": "エルパライソ・ピーチ嫌気性：88°C・1:16・2分15秒で白桃ヨーグルトと白い花のクリーミーな香味を雑味なく。"}},
  {"id": "col-04", "no": "NO. 28", "name": "콜롬비아 후일라 디카페인", "eng": "Colombia Huila Sugar Cane Decaf", "origin": "🇨🇴 COLOMBIA", "varietal": "Caturra", "process": "Sugar Cane Decaf", "altitude": "1,500m ~ 1,800m", "roast": "Medium", "headline": "달콤한 군밤과 사탕수수의 속 편하고 둥근 부드러움", "sourDots": 2, "sourDesc": "은은한 단맛", "nuttyDots": 4, "nuttyDesc": "달달하고 구수함", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (둥글레차처럼 편안함)", "guide": "카페인을 99% 제거하여 늦은 저녁에도 두근거림 없이 속 편하게 즐깁니다.", "keywords": ["디카페인", "속편한", "저녁", "군밤", "콜롬비아", "3단계"], "countryCode": "COL", "region": "Huila (우일라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Decaf", "physicalGrade": "EA Sugar Cane Decaf", "sweetDots": 4, "sweetDesc": "달콤한 군밤과 사탕수수 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa"], "caffeine": "DECAF", "brewOverride": "디카페인 88~89°C · 20g / 290ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 다공질 원두 특성상 미분이 생기기 쉬우므로 교반을 최소화하고 중심부 위주로 부드럽게 3회 주입해 잡미 없는 단맛을 끌어냅니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Porous bean structure extracts quickly; keep agitation minimal and pour gently in the center to highlight clean sweetness in 2m 25s–2m 35s.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・多孔質なデカフェ構造のため過抽出を避け、中心部へ静かに3回注湯して雑味のない甘みを2分25秒〜2分35秒で引き出します。"}},
  {"id": "col-05", "no": "NO. 29", "name": "콜롬비아 수프레모 메데인", "eng": "Colombia Supremo Medellin", "origin": "🇨🇴 COLOMBIA", "varietal": "Castillo", "process": "Washed (물 세척)", "altitude": "1,400m ~ 1,650m", "roast": "Medium", "headline": "고소한 호두와 부드러운 카카오의 편안하고 든든한 맛", "sourDots": 2, "sourDesc": "부드럽고 약한 산미", "nuttyDots": 4, "nuttyDesc": "호두의 고소함", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (도톰하고 든든함)", "guide": "어떤 커피를 고를지 고민될 때 가장 실패 없는 국민 표준 원두입니다.", "keywords": ["호두", "카카오", "콜롬비아", "수프레모", "4단계"], "countryCode": "COL", "region": "Antioquia Medellin (메데인)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Introgressed (Castillo)", "processGroup": "Washed", "physicalGrade": "Supremo (Screen 17–18)", "sweetDots": 3, "sweetDesc": "호두와 부드러운 카카오 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "col-06", "no": "NO. 30", "name": "콜롬비아 위스키 배럴 에이지드", "eng": "Colombia Whisky Barrel Aged", "origin": "🇨🇴 COLOMBIA", "varietal": "Castillo", "process": "Barrel Aged (오크통 숙성)", "altitude": "1,700m ~ 1,850m", "roast": "Medium-Dark", "headline": "오크통에 숙성한 싱글몰트 위스키와 바닐라의 깊은 향취", "sourDots": 2, "sourDesc": "은은한 발효산미", "nuttyDots": 4, "nuttyDesc": "스모키한 오크향", "bodyDots": 5, "bodyStage": "5단계", "bodyDesc": "5단계 (양주처럼 농밀하고 묵직함)", "guide": "알코올 없이도 고급 위스키의 스모키한 향과 묵직함을 즐길 수 있습니다.", "keywords": ["위스키", "오크통", "가향", "배럴", "5단계"], "countryCode": "COL", "region": "Huila (우일라)", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Introgressed (Castillo)", "processGroup": "Barrel Aged", "physicalGrade": "Whisky Oak Barrel Lot", "sweetDots": 4, "sweetDesc": "바닐라 오크통과 몰트 시럽 단맛", "flavorFamily": ["Spiced", "Sweet", "Fermented"], "caffeine": "REGULAR", "brewOverride": "배럴에이지드 88~89°C · 20g / 300ml", "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "col-07", "no": "NO. 31", "name": "콜롬비아 라팔마 게이샤", "eng": "Colombia La Palma Geisha", "origin": "🇨🇴 COLOMBIA", "varietal": "Geisha", "process": "Natural (햇볕 건조)", "altitude": "1,700m ~ 1,900m", "roast": "Light", "headline": "청포도 주스와 자스민 꽃의 화사하고 산뜻한 과즙미", "sourDots": 4, "sourDesc": "상큼한 청포도산미", "nuttyDots": 1, "nuttyDesc": "화사한 꽃향기", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (청포도주스처럼 산뜻함)", "guide": "콜롬비아 최상급 게이샤로 청포도 사탕 같은 단맛과 향이 아주 신선합니다.", "keywords": ["콜롬비아", "게이샤", "청포도", "자스민", "2단계"], "countryCode": "COL", "region": "Cundinamarca (라팔마 이 엘투칸)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "processGroup": "Natural", "physicalGrade": "Estate Auction Lot", "sweetDots": 5, "sweetDesc": "청포도 사탕과 자스민 꿀 단맛", "flavorFamily": ["Floral", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "dialingNote": {"ko": "라팔마 게이샤 내추럴: 90°C·1:16·2:25 V60 추출로 장미·열대과일·꿀의 복합적인 아로마와 긴 애프터테이스트를 즐기세요.", "en": "La Palma Gesha Natural: V60 at 90°C, 1:16 in 2:25 unfolds rose, tropical fruit, and honey with an extended finish.", "ja": "ラパルマ・ゲイシャ・ナチュラル：90°C・1:16・2分25秒のV60でバラと南国果実、蜂蜜の長い余韻を堪能できます。"}},
  {"id": "col-08", "no": "NO. 32", "name": "콜롬비아 서멀 쇼크 카스티요", "eng": "Colombia Thermal Shock Castillo", "origin": "🇨🇴 COLOMBIA", "varietal": "Castillo", "process": "Thermal Shock (열충격 발효)", "altitude": "1,800m ~ 2,000m", "roast": "Light-Medium", "headline": "딸기 우유와 리치 과즙의 극강의 달콤한 크리미함", "sourDots": 3, "sourDesc": "달콤한 딸기 과즙", "nuttyDots": 2, "nuttyDesc": "크리미한 질감", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (딸기우유처럼 부드러움)", "guide": "뜨거운 물과 차가운 물로 번갈아 발효하여 딸기 우유 맛이 가득합니다.", "keywords": ["콜롬비아", "딸기", "리치", "특수발효", "3단계"], "countryCode": "COL", "region": "Huila (우일라)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Introgressed (Castillo)", "processGroup": "Thermal Shock", "physicalGrade": "Thermal Shock Micro-lot", "sweetDots": 5, "sweetDesc": "딸기 우유와 리치 시럽 단맛", "flavorFamily": ["Fruity", "Sweet", "Fermented"], "caffeine": "REGULAR", "brewOverride": "열충격발효 88~89°C · 20g / 300ml", "dialingNote": {"ko": "서멀 쇼크 카스티요: 88°C·중굵은 분쇄·1:16·2:15 추출로 열충격 발효 특유의 레몬그라스·베리 캔디 톤을 산뜻하게 살리세요.", "en": "Thermal Shock Castillo: Brew at 88°C, medium-coarse, 1:16 in 2:15 for bright lemongrass and berry-candy clarity.", "ja": "サーマルショック・カスティージョ：88°C・中粗挽き・1:16・2分15秒でレモングラスとベリーの鮮烈な甘みを。"}},
  {"id": "bra-01", "no": "NO. 33", "name": "브라질 세라도 내추럴", "eng": "Brazil Cerrado Natural", "origin": "🇧🇷 BRAZIL", "varietal": "Mundo Novo", "process": "Natural (햇볕 건조)", "altitude": "900m ~ 1,100m", "roast": "Medium", "headline": "잘 볶은 땅콩과 진한 보리차처럼 편안하고 부드러운 구수함", "sourDots": 1, "sourDesc": "신맛 전혀 없음", "nuttyDots": 5, "nuttyDesc": "최고의 고소함과 구수함", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (보리차·저지방우유)", "guide": "신맛이나 쓴맛 자극 없이 물처럼 편안하고 구수한 대표 원두입니다.", "keywords": ["신맛없는", "안신", "구수한", "보리차", "땅콩", "브라질", "3단계"], "countryCode": "BRA", "region": "Minas Gerais Cerrado (세라도)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon × Typica (Mundo Novo)", "processGroup": "Natural", "physicalGrade": "NY2 SC17/18 Fine Cup", "sweetDots": 3, "sweetDesc": "구수한 보리차와 볶은 땅콩 단맛", "flavorFamily": ["Nutty/Cocoa", "Roasted"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "bra-02", "no": "NO. 34", "name": "브라질 모지아나 옐로우 버본", "eng": "Brazil Mogiana Yellow Bourbon", "origin": "🇧🇷 BRAZIL", "varietal": "Yellow Bourbon", "process": "Pulp Natural", "altitude": "1,100m ~ 1,300m", "roast": "Medium", "headline": "노란 커피 체리가 준 고소한 헤이즐넛과 아카시아 꿀 맛", "sourDots": 2, "sourDesc": "은은하고 매끄러움", "nuttyDots": 5, "nuttyDesc": "달콤고소한 헤이즐넛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (밀크티처럼 부드러움)", "guide": "노란 열매에서 나온 고소함과 꿀 단맛이 부드럽게 입안을 채워줍니다.", "keywords": ["브라질", "버본", "헤이즐넛", "고소한", "3단계"], "countryCode": "BRA", "region": "Alta Mogiana (모지아나)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (Yellow Bourbon)", "processGroup": "Honey", "physicalGrade": "NY2 Pulped Natural", "sweetDots": 4, "sweetDesc": "헤이즐넛과 아카시아 꿀 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "bra-03", "no": "NO. 35", "name": "브라질 다테라 스위트 컬렉션", "eng": "Brazil Daterra Sweet Collection", "origin": "🇧🇷 BRAZIL", "varietal": "Bourbon / Catuai", "process": "Pulp Natural", "altitude": "1,150m ~ 1,250m", "roast": "Medium-Dark", "headline": "초콜릿 릿지와 구운 넛츠의 진하고 묵직한 디저트 단맛", "sourDots": 1, "sourDesc": "신맛 없음", "nuttyDots": 5, "nuttyDesc": "진한 초콜릿 단맛", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (핫초코처럼 진함)", "guide": "친환경 명품 농장에서 재배하여 단맛이 아주 강하고 고급스럽습니다.", "keywords": ["브라질", "초콜릿", "디저트", "안신", "4단계"], "countryCode": "BRA", "region": "Cerrado Daterra (다테라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "processGroup": "Honey", "physicalGrade": "Estate Masterpiece", "sweetDots": 5, "sweetDesc": "진한 초콜릿 퍼지와 구운 넛츠 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중강배전 89~90°C · 20g / 300ml", "dialingNote": {"ko": "다테라 스위트 컬렉션 펄프드 내추럴: 89°C·1:14.5·2:45 또는 에스프레소 1:2(28초)로 구운 아몬드와 밀크초콜릿 바디를 진하게 즐기세요.", "en": "Daterra Sweet Collection: Brew at 89°C, 1:14.5 or 1:2 espresso (28s) for roasted almond and velvety milk chocolate.", "ja": "ダテーラ・スイートコレクション：89°C・1:14.5または1:2エスプレッソ（28秒）で香ばしいアーモンドとチョコのコクを。"}},
  {"id": "per-01", "no": "NO. 36", "name": "페루 찬차마요 유기농", "eng": "Peru Chanchamayo Organic", "origin": "🇵🇪 PERU", "varietal": "Typica", "process": "Washed (물 세척)", "altitude": "1,200m ~ 1,800m", "roast": "Medium", "headline": "은은한 말린 사과와 호두의 순하고 깨끗한 단맛", "sourDots": 2, "sourDesc": "은은한 사과맛", "nuttyDots": 4, "nuttyDesc": "순한 호두 맛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (깔끔하고 부드러움)", "guide": "잉카의 청정 고산지대 유기농 원두로 순하고 깔끔해서 자극이 없습니다.", "keywords": ["페루", "유기농", "호두", "순한", "3단계"], "countryCode": "PER", "region": "Junin Chanchamayo (찬차마요)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage", "processGroup": "Washed", "physicalGrade": "Grade 1 Organic (유기농 1등급)", "sweetDots": 3, "sweetDesc": "말린 사과와 순한 호두 단맛", "flavorFamily": ["Nutty/Cocoa", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "ecu-01", "no": "NO. 37", "name": "에콰도르 로하 시드라 워시드", "eng": "Ecuador Loja Sidra Washed", "origin": "🇪🇨 ECUADOR", "varietal": "Sidra", "process": "Washed (물 세척)", "altitude": "1,700m ~ 1,900m", "roast": "Light", "headline": "녹차의 깔끔함과 청사과 과즙의 우아하고 신선한 맛", "sourDots": 4, "sourDesc": "상큼한 청사과맛", "nuttyDots": 2, "nuttyDesc": "녹차 같은 산뜻함", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (녹차주스처럼 맑음)", "guide": "희귀 품종인 '시드라' 원두로 녹차처럼 맑고 사과 과즙이 화사합니다.", "keywords": ["에콰도르", "녹차", "청사과", "시드라", "2단계"], "countryCode": "ECU", "region": "Loja (로하)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon × Landrace (Sidra)", "processGroup": "Washed", "physicalGrade": "SHB Especial Micro-lot", "sweetDots": 4, "sweetDesc": "청사과 과즙과 맑은 녹차 단맛", "flavorFamily": ["Fruity", "Floral", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "dialingNote": {"ko": "중세분쇄 (가는 드립용) · 92~93°C · 1:15 (20g / 300ml) · 40초 뜸들이기로 탄산가스를 충분히 배출한 뒤 가늘고 일정한 물줄기로 3회 푸어링하여 자스민 꽃향과 투명한 클린컵을 극대화합니다.", "en": "Medium-fine grind · 92–93°C · 1:15 (20g / 300ml) · 40s blooming followed by 3 gentle pulse pours in 2m 15s–2m 25s to elevate delicate floral jasmine clarity and crisp citrus acidity.", "ja": "中細挽き・92〜93°C・1:15 (20g / 300ml)・40秒の蒸らしでガスをしっかり抜き、細く均一な湯流で3回注ぎ分けることで、繊細な花香と透明感のある酸味を2分15秒〜2分25秒で引き出します。"}},
  {"id": "bol-01", "no": "NO. 38", "name": "볼리비아 카라나비 티피카", "eng": "Bolivia Caranavi Typica", "origin": "🇧🇴 BOLIVIA", "varietal": "Typica", "process": "Washed (물 세척)", "altitude": "1,500m ~ 1,800m", "roast": "Medium", "headline": "아카시아 꽃향기와 부드러운 꿀물의 깨끗한 여운", "sourDots": 3, "sourDesc": "화사한 꽃산미", "nuttyDots": 3, "nuttyDesc": "깨끗한 꿀단맛", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (맑은 꿀차 느낌)", "guide": "안데스 산맥의 맑은 물로 씻어내어 꿀처럼 달고 깨끗한 맛을 냅니다.", "keywords": ["볼리비아", "꽃향기", "꿀", "맑은", "2단계"], "countryCode": "BOL", "region": "La Paz Caranavi (카라나비)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage", "processGroup": "Washed", "physicalGrade": "First Grade SHB", "sweetDots": 4, "sweetDesc": "아카시아 꽃꿀처럼 투명한 단맛", "flavorFamily": ["Floral", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "ind-01", "no": "NO. 39", "name": "인도네시아 만델링 G1", "eng": "Indonesia Mandheling G1", "origin": "🇮🇩 INDONESIA", "varietal": "Ateng", "process": "Wet Hulled", "altitude": "1,200m ~ 1,500m", "roast": "Dark", "headline": "묵직한 나무 향과 카카오 90% 초콜릿의 깊은 쌉싸름함", "sourDots": 1, "sourDesc": "신맛 전혀 없음 (0/5)", "nuttyDots": 4, "nuttyDesc": "스모키한 흙내음", "bodyDots": 5, "bodyStage": "5단계", "bodyDesc": "5단계 (생크림처럼 혀에 감김)", "guide": "신맛은 절대 싫고 옛날 다방 커피처럼 진하고 묵직한 맛을 원할 때 제격입니다.", "keywords": ["신맛전혀없는", "진한쓴맛", "스모키", "만델링", "5단계"], "countryCode": "IDN", "region": "North Sumatra (만델링)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Introgressed (Ateng/Catimor)", "processGroup": "Wet Hulled", "physicalGrade": "G1 DP (Double Picked)", "sweetDots": 2, "sweetDesc": "카카오 90% 다크초콜릿의 쌉쌀한 단맛", "flavorFamily": ["Roasted", "Nutty/Cocoa", "Spiced"], "caffeine": "REGULAR", "brewOverride": "강배전 87~88°C · 20g / 290ml", "dialingNote": {"ko": "조분쇄 (굵은 천일염 크기) · 86~88°C · 1:14 (20g / 280ml) · 만델링 특유의 묵직한 카카오 바디감을 위해 86~88°C 저온 추출하고, 뜸들이기 후 굵은 물줄기로 2분~2분 10초에 빠르게 추출을 종료합니다.", "en": "Coarse grind · 86–88°C · 1:14 (20g / 280ml) · Wet-hulled lots shine at 86–88°C; finish by 2m 00s–2m 10s with a steady stream to capture rich cacao body without astringency.", "ja": "粗挽き・86〜88°C・1:14 (20g / 280ml)・スマトラ特有の重厚なカカオのコクを活かすため86〜88°Cの低め湯温で、2分00秒〜2分10秒以内に手早く抽出して雑味を抑えます。"}},
  {"id": "ind-02", "no": "NO. 40", "name": "인도네시아 가요마운틴 유기농", "eng": "Indonesia Gayo Mountain Organic", "origin": "🇮🇩 INDONESIA", "varietal": "Tim Tim", "process": "Wet Hulled", "altitude": "1,300m ~ 1,600m", "roast": "Medium-Dark", "headline": "갓 볶은 원두의 고소함과 묵직한 카카오의 깊은 여운", "sourDots": 1, "sourDesc": "신맛 없음", "nuttyDots": 5, "nuttyDesc": "깊은 카카오 풍미", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (묵직하고 도톰함)", "guide": "신맛이 없으면서도 흙내음 대신 깔끔하고 고소한 카카오 향이 가득합니다.", "keywords": ["인도네시아", "카카오", "유기농", "안신", "4단계"], "countryCode": "IDN", "region": "Aceh Gayo (아체 가요)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Introgressed (Tim Tim)", "processGroup": "Wet Hulled", "physicalGrade": "G1 Organic", "sweetDots": 3, "sweetDesc": "묵직한 카카오와 흑설탕 여운", "flavorFamily": ["Nutty/Cocoa", "Spiced"], "caffeine": "REGULAR", "brewOverride": "중강배전 88~89°C · 20g / 300ml", "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 만델링 특유의 묵직한 카카오 바디감을 위해 88~89°C 저온 추출하고, 뜸들이기 후 굵은 물줄기로 2분 10초~2분 20초에 빠르게 추출을 종료합니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Wet-hulled lots shine at 88–89°C; finish by 2m 10s–2m 20s with a steady stream to capture rich cacao body without astringency.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・スマトラ特有の重厚なカカオのコクを活かすため88〜89°Cの低め湯温で、2分10秒〜2分20秒以内に手早く抽出して雑味を抑えます。"}},
  {"id": "ind-03", "no": "NO. 41", "name": "인도네시아 토라자 칼로시", "eng": "Indonesia Toraja Kalosi", "origin": "🇮🇩 INDONESIA", "varietal": "S-795", "process": "Wet Hulled", "altitude": "1,400m ~ 1,700m", "roast": "Dark", "headline": "다크 초콜릿과 계피의 스모키하고 신비로운 아시아의 맛", "sourDots": 1, "sourDesc": "신맛 전혀 없음", "nuttyDots": 5, "nuttyDesc": "스모키한 계피 향", "bodyDots": 5, "bodyStage": "5단계", "bodyDesc": "5단계 (생크림처럼 묵직함)", "guide": "묵직하고 스모키한 독특한 향이 시원한 아이스 아메리카노로 좋습니다.", "keywords": ["토라자", "인도네시아", "스모키", "계피", "5단계"], "countryCode": "IDN", "region": "Sulawesi Toraja (술라웨시 토라자)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica × Liberica (S-795)", "processGroup": "Wet Hulled", "physicalGrade": "G1 Kalosi", "sweetDots": 3, "sweetDesc": "스모키한 시나몬과 다크초콜릿 단맛", "flavorFamily": ["Spiced", "Nutty/Cocoa", "Roasted"], "caffeine": "REGULAR", "brewOverride": "강배전 88~89°C · 20g / 290ml", "dialingNote": {"ko": "조분쇄 (굵은 천일염 크기) · 86~88°C · 1:14 (20g / 280ml) · 만델링 특유의 묵직한 카카오 바디감을 위해 86~88°C 저온 추출하고, 뜸들이기 후 굵은 물줄기로 2분~2분 10초에 빠르게 추출을 종료합니다.", "en": "Coarse grind · 86–88°C · 1:14 (20g / 280ml) · Wet-hulled lots shine at 86–88°C; finish by 2m 00s–2m 10s with a steady stream to capture rich cacao body without astringency.", "ja": "粗挽き・86〜88°C・1:14 (20g / 280ml)・スマトラ特有の重厚なカカオのコクを活かすため86〜88°Cの低め湯温で、2分00秒〜2分10秒以内に手早く抽出して雑味を抑えます。"}},
  {"id": "haw-01", "no": "NO. 42", "name": "하와이 코나 엑스트라 탠시", "eng": "Hawaii Kona Extra Fancy", "origin": "🇺🇸 USA (HAWAII)", "varietal": "Kona Typica", "process": "Washed (물 세척)", "altitude": "300m ~ 800m", "roast": "Medium", "headline": "하와이 해풍이 키운 마카다미아의 고소함과 상큼한 꽃향기", "sourDots": 3, "sourDesc": "상쾌하고 밝은 산미", "nuttyDots": 4, "nuttyDesc": "고소한 마카다미아", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (매끄럽고 깔끔함)", "guide": "세계 3대 명품 커피. 버터 같은 마카다미아 고소함이 일품입니다.", "keywords": ["하와이", "코나", "마카다미아", "명품", "3단계"], "countryCode": "USA", "region": "Big Island Kona (하와이 코나)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage (Kona Typica)", "processGroup": "Washed", "physicalGrade": "Extra Fancy (최상위 스크린 19+)", "sweetDots": 4, "sweetDesc": "버터 스카치와 마카다미아 단맛", "flavorFamily": ["Nutty/Cocoa", "Floral", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "png-01", "no": "NO. 43", "name": "파푸아뉴기니 시그리 에스테이트", "eng": "Papua New Guinea Sigri Estate", "origin": "🇵🇬 PNG", "varietal": "Arusha / Typica", "process": "Washed (물 세척)", "altitude": "1,500m ~ 1,600m", "roast": "Medium", "headline": "망고의 달콤함과 은은한 가죽 향의 이색적인 조화", "sourDots": 2, "sourDesc": "은은한 망고 단맛", "nuttyDots": 4, "nuttyDesc": "부드러운 견과류", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (도톰하고 평온함)", "guide": "명품 블루마운틴(Arusha/Typica) 품종을 청정 고산지대에서 길러 부드럽고 열대과일 단맛이 납니다.", "keywords": ["파푸아뉴기니", "PNG", "망고", "부드러운", "3단계"], "countryCode": "PNG", "region": "Wahgi Valley (시그리 에스테이트)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica & Bourbon (Arusha)", "processGroup": "Washed", "physicalGrade": "Estate A Grade (Screen 17+)", "sweetDots": 4, "sweetDesc": "열대 망고와 구운 견과류 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "파푸아뉴기니 시그리 에스테이트: 91°C·1:15.5·2:35 추출로 3단계 수세 특유의 청사과 클린컵과 밀크초콜릿·스파이스 밸런스를 살리세요.", "en": "PNG Sigri Estate Washed: 91°C, 1:15.5 in 2:35 showcases crisp green apple clarity with sweet milk chocolate and spice.", "ja": "PNGシグリ・エステート：91°C・1:15.5・2分35秒で3段階水洗由来の青リンゴの透明感とミルクチョコの調和を。"}},
  {"id": "vnm-01", "no": "NO. 44", "name": "베트남 달랏 아라비카 무산소", "eng": "Vietnam Da Lat Anaerobic", "origin": "🇻🇳 VIETNAM", "varietal": "Catimor", "process": "Anaerobic (특별 숙성)", "altitude": "1,400m ~ 1,600m", "roast": "Medium", "headline": "와인에 담근 서양배와 카카오의 뜻밖의 화려한 변신", "sourDots": 3, "sourDesc": "화려한 와인 과즙", "nuttyDots": 3, "nuttyDesc": "진한 카카오", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (와인처럼 부드러움)", "guide": "베트남 고산지대 프리미엄 아라비카 원두로 와인과 과일 향이 가득합니다.", "keywords": ["베트남", "달랏", "와인", "서양배", "3단계"], "countryCode": "VNM", "region": "Lam Dong Da Lat (달랏)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Introgressed (Catimor)", "processGroup": "Anaerobic", "physicalGrade": "G1 Screen 18 Anaerobic", "sweetDots": 4, "sweetDesc": "와인에 졸인 서양배와 카카오 단맛", "flavorFamily": ["Fruity", "Fermented", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "특수발효 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 25초~2분 35초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 25s–2m 35s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分25秒〜2分35秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "ynn-01", "no": "NO. 45", "name": "운남 보산 카티모르 이중발효", "eng": "Yunnan Baoshan Double Fermented", "origin": "🇨🇳 CHINA", "varietal": "Catimor", "process": "Double Fermented", "altitude": "1,200m ~ 1,500m", "roast": "Light-Medium", "headline": "자두 푸딩과 홍차의 촉촉하고 특이한 단맛", "sourDots": 3, "sourDesc": "새콤달콤한 자두맛", "nuttyDots": 2, "nuttyDesc": "홍차 같은 부드러움", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (홍차주스 느낌)", "guide": "최근 스페셜티 시장에서 주목받는 운남 원두로 자두와 홍차 향이 납니다.", "keywords": ["운남", "중국", "자두", "홍차", "2단계"], "countryCode": "CHN", "region": "Yunnan Baoshan (운남 보산)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Introgressed (Catimor)", "processGroup": "Anaerobic", "physicalGrade": "AAA Double Fermented", "sweetDots": 4, "sweetDesc": "촉촉한 자두 푸딩과 홍차 단맛", "flavorFamily": ["Fruity", "Sweet", "Fermented"], "caffeine": "REGULAR", "brewOverride": "이중발효 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 20초~2분 30초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 20s–2m 30s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分20秒〜2分30秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "ida-01", "no": "NO. 46", "name": "인도 아티칸 에스테이트", "eng": "India Attikan Estate Washed", "origin": "🇮🇳 INDIA", "varietal": "S-795", "process": "Washed (물 세척)", "altitude": "1,000m ~ 1,400m", "roast": "Medium-Dark", "headline": "후추와 정향의 스파이시함과 다크 초콜릿의 든든함", "sourDots": 1, "sourDesc": "신맛 없음", "nuttyDots": 5, "nuttyDesc": "스파이시한 초콜릿", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (도톰하고 든든함)", "guide": "신맛이 전혀 없고 후추 같은 은은한 향신료와 초콜릿 맛이 든든합니다.", "keywords": ["인도", "초콜릿", "후추", "안신", "4단계"], "countryCode": "IND", "region": "Karnataka Biligiriranga (아티칸)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica × Liberica (S-795)", "processGroup": "Washed", "physicalGrade": "Plantation A (Screen 17+)", "sweetDots": 3, "sweetDesc": "다크 초콜릿과 정향의 든든한 단맛", "flavorFamily": ["Spiced", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중강배전 89~90°C · 20g / 300ml", "dialingNote": {"ko": "인도 아티칸 에스테이트: 88°C·1:14·2:50 핸드드립 또는 모카포트/에스프레소로 다크초콜릿·스파이스·헤이즐넛의 진한 크레마를 즐기세요.", "en": "India Attikan Estate: 88°C, 1:14 pour-over or espresso/moka unlocks bold dark chocolate, warm spice, and hazelnut.", "ja": "インド・アティカン農園：88°C・1:14のドリップやエスプレッソでビターチョコとスパイス、ヘーゼルナッツの濃厚なコクを。"}},
  {"id": "tim-01", "no": "NO. 47", "name": "동티모르 레테포호 유기농", "eng": "Timor-Leste Letefoho Organic", "origin": "🇹🇱 TIMOR", "varietal": "Hibrido de Timor", "process": "Washed (물 세척)", "altitude": "1,400m ~ 1,700m", "roast": "Medium", "headline": "야생화 꿀과 구운 헤이즐넛의 순수한 청정 고산지대 맛", "sourDots": 2, "sourDesc": "은은하고 순함", "nuttyDots": 4, "nuttyDesc": "고소한 헤이즐넛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (보리차처럼 편안함)", "guide": "동티모르 높은 산에서 야생으로 자라 아주 순하고 고소한 단맛이 납니다.", "keywords": ["동티모르", "유기농", "꿀", "헤이즐넛", "3단계"], "countryCode": "TLS", "region": "Ermera Letefoho (레테포호)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Introgressed (Hibrido de Timor)", "processGroup": "Washed", "physicalGrade": "G1 Organic Shade-Grown", "sweetDots": 4, "sweetDesc": "야생화 꿀과 헤이즐넛 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "flv-01", "no": "NO. 48", "name": "클래식 헤이즐넛 원두", "eng": "Classic Hazelnut Roasted Bean", "origin": "✨ FLAVORED", "varietal": "Arabica Blend", "process": "Flavored (천연 가향)", "altitude": "Blend", "roast": "Medium", "headline": "갓 구운 헤이즐넛의 달콤하고 향긋한 추억의 풍미", "sourDots": 1, "sourDesc": "신맛 없음", "nuttyDots": 5, "nuttyDesc": "극강의 헤이즐넛 향", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (부드럽고 편안한 바디)", "guide": "매장 가득 퍼지는 고소하고 달콤한 헤이즐넛 향으로 쓴맛 없이 향긋합니다.", "keywords": ["헤이즐넛", "가향", "구수한", "추억의맛", "3단계"], "countryCode": "BLEND", "region": "Multi-Origin (콜롬비아·브라질 베이스)", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Infused", "physicalGrade": "Specialty Flavored", "sweetDots": 4, "sweetDesc": "달콤하고 고소한 구운 헤이즐넛 향미", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "가향원두 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 25초~2분 35초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 25s–2m 35s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分25秒〜2分35秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "flv-02", "no": "NO. 49", "name": "프렌치 바닐라 가향 원두", "eng": "French Vanilla Flavored", "origin": "✨ FLAVORED", "varietal": "Arabica Blend", "process": "Flavored (천연 가향)", "altitude": "Blend", "roast": "Medium", "headline": "바닐라빈 아이스크림의 부드럽고 따뜻한 달콤함", "sourDots": 1, "sourDesc": "신맛 없음", "nuttyDots": 4, "nuttyDesc": "달콤하고 부드러움", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (크리미하고 둥근 맛)", "guide": "설탕 시럽 없이도 달콤하고 포근한 바닐라 향을 풍성하게 즐길 수 있습니다.", "keywords": ["바닐라", "프렌치바닐라", "가향", "달콤한향", "3단계"], "countryCode": "BLEND", "region": "Multi-Origin (브라질·콜롬비아 베이스)", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Infused", "physicalGrade": "Specialty Flavored", "sweetDots": 5, "sweetDesc": "바닐라빈 아이스크림처럼 포근한 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "가향원두 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 25초~2분 35초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 25s–2m 35s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分25秒〜2分35秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "flv-03", "no": "NO. 50", "name": "민트 초코 인퓨즈드", "eng": "Mint Choco Infused Bean", "origin": "✨ FLAVORED", "varietal": "Arabica Blend", "process": "Infused (특별 숙성)", "altitude": "Blend", "roast": "Medium", "headline": "상쾌한 애플민트와 쌉쌀한 다크 초콜릿의 디저트 조합", "sourDots": 2, "sourDesc": "상쾌한 민트 산미", "nuttyDots": 4, "nuttyDesc": "진한 다크초콜릿", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (민트티처럼 청량함)", "guide": "민트초코를 좋아하시는 분께 강력 추천! 시원하고 상쾌한 디저트 커피입니다.", "keywords": ["민트초코", "민트", "초콜릿", "가향", "3단계"], "countryCode": "BLEND", "region": "Multi-Origin (콜롬비아 베이스)", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Infused", "physicalGrade": "Specialty Infused", "sweetDots": 4, "sweetDesc": "상쾌한 애플민트와 다크초콜릿 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Spiced"], "caffeine": "REGULAR", "brewOverride": "인퓨즈드 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 25초~2분 35초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 25s–2m 35s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分25秒〜2分35秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "flv-04", "no": "NO. 51", "name": "시나몬 롤 배럴 에이지드", "eng": "Cinnamon Roll Barrel Aged", "origin": "✨ FLAVORED", "varietal": "Arabica Blend", "process": "Barrel Aged", "altitude": "Blend", "roast": "Medium-Dark", "headline": "갓 구운 시나몬 롤과 메이플 시럽의 포근한 디저트 향기", "sourDots": 1, "sourDesc": "신맛 없음", "nuttyDots": 5, "nuttyDesc": "달콤한 시나몬 시럽", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (디저트처럼 묵직함)", "guide": "달콤한 계피빵 향이 퍼져 추운 날이나 우유와 함께 드시면 더욱 맛있습니다.", "keywords": ["시나몬", "계피", "오크통", "가향", "4단계"], "countryCode": "BLEND", "region": "Multi-Origin (과테말라·콜롬비아 베이스)", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Barrel Aged", "physicalGrade": "Oak Barrel Aged", "sweetDots": 5, "sweetDesc": "시나몬 롤과 메이플 시럽 단맛", "flavorFamily": ["Spiced", "Sweet"], "caffeine": "REGULAR", "brewOverride": "배럴에이지드 88~89°C · 20g / 300ml", "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "flv-05", "no": "NO. 52", "name": "망고 라씨 서멀 쇼크", "eng": "Mango Lassi Thermal Shock", "origin": "🇨🇴 COLOMBIA", "varietal": "Castillo", "process": "Thermal Shock", "altitude": "1,800m", "roast": "Light-Medium", "headline": "잘 익은 망고와 부드러운 요거트의 달콤한 열대 풍미", "sourDots": 3, "sourDesc": "달콤한 망고 과즙", "nuttyDots": 2, "nuttyDesc": "요거트처럼 부드러움", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (망고주스 느낌)", "guide": "망고 라씨 음료처럼 부드럽고 달콤한 열대 과일 맛이 진하게 납니다.", "keywords": ["망고", "요거트", "특수발효", "콜롬비아", "3단계"], "countryCode": "COL", "region": "Huila (우일라)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Introgressed (Castillo)", "processGroup": "Thermal Shock", "physicalGrade": "Thermal Shock Micro-lot", "sweetDots": 5, "sweetDesc": "망고 라씨와 요거트의 열대과일 단맛", "flavorFamily": ["Fruity", "Sweet", "Fermented"], "caffeine": "REGULAR", "brewOverride": "열충격발효 88~89°C · 20g / 300ml", "dialingNote": {"ko": "망고 라씨 서멀 쇼크: 87°C 저온·중굵은 분쇄·1:16·2:10 추출로 망고 요거트 향을 선명히 살리며 아이스 드립과 찰떡궁합입니다.", "en": "Mango Lassi Thermal Shock: Brew at 87°C, medium-coarse, 1:16 in 2:10 for vivid mango yogurt notes; ideal over ice.", "ja": "マンゴーラッシー・サーマルショック：87°C低温・中粗挽き・1:16・2分10秒で濃厚なマンゴーヨーグルト香を。アイスにも最適。"}},
  {"id": "flv-06", "no": "NO. 53", "name": "리치 무산소 발효 원두", "eng": "Lychee Anaerobic Fermented", "origin": "🇨🇴 COLOMBIA", "varietal": "Castillo", "process": "Anaerobic", "altitude": "1,750m", "roast": "Light", "headline": "투명한 리치 열매와 장미 꽃잎의 황홀한 열대 과수원 맛", "sourDots": 4, "sourDesc": "달콤새콤한 리치 과즙", "nuttyDots": 1, "nuttyDesc": "화사한 장미 향", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (리치주스처럼 맑음)", "guide": "양귀비가 즐겨 먹던 리치 과일과 장미 향이 커피 속에서 화사하게 터집니다.", "keywords": ["리치", "장미", "무산소", "특수발효", "2단계"], "countryCode": "COL", "region": "Cauca (카우카)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Introgressed (Castillo)", "processGroup": "Anaerobic", "physicalGrade": "Anaerobic Micro-lot", "sweetDots": 5, "sweetDesc": "투명한 리치 과즙과 장미 시럽 단맛", "flavorFamily": ["Fruity", "Floral", "Fermented"], "caffeine": "REGULAR", "brewOverride": "특수발효 88~89°C · 20g / 300ml", "dialingNote": {"ko": "리치 무산소 발효 시그니처: 88°C·1:16·2:10 단기 추출로 리치 과즙과 로즈워터 같은 화사한 향미를 텁텁함 없이 깔끔히 뽑으세요.", "en": "Lychee Anaerobic Signature: Quick 2:10 brew at 88°C, 1:16 keeps juicy lychee and rosewater aromatics crisp and clean.", "ja": "ライチ嫌気性シグネチャー：88°C・1:16・2分10秒の短時間抽出でライチ果汁とローズウォーターの華やかな香りを澄みやかに。"}},
  {"id": "flv-07", "no": "NO. 54", "name": "딸기잼 내추럴 시그니처", "eng": "Strawberry Jam Natural", "origin": "🇪🇹 ETHIOPIA", "varietal": "Heirloom", "process": "Natural", "altitude": "2,000m", "roast": "Light-Medium", "headline": "갓 만든 진한 딸기잼과 연유의 쫀득하고 달콤한 맛", "sourDots": 4, "sourDesc": "진한 딸기잼 과즙", "nuttyDots": 2, "nuttyDesc": "연유 같은 달콤함", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (딸기시럽 느낌)", "guide": "딸기잼을 스푼으로 떠먹듯 진하고 달콤한 딸기 향이 입안을 가득 채웁니다.", "keywords": ["딸기잼", "에티오피아", "내추럴", "달콤한", "3단계"], "countryCode": "ETH", "region": "Guji Uraga (구지 우라가)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Ethiopian Landrace", "processGroup": "Natural", "physicalGrade": "G1 Extended Natural", "sweetDots": 5, "sweetDesc": "진한 딸기잼과 연유의 쫀득한 단맛", "flavorFamily": ["Fruity", "Sweet", "Fermented"], "caffeine": "REGULAR", "brewOverride": "장기발효내추럴 89~90°C · 20g / 300ml", "dialingNote": {"ko": "딸기잼 내추럴 시그니처: 89°C·1:15.5·2:20 추출로 2,000m 에티오피아 내추럴의 달콤한 딸기잼과 크림 같은 질감을 극대화하세요.", "en": "Strawberry Jam Natural: Brew at 89°C, 1:15.5 in 2:20 to maximize sweet strawberry compote and velvety berry texture.", "ja": "ストロベリージャム・ナチュラル：89°C・1:15.5・2分20秒で2,000m高地ナチュラルの甘い苺ジャム感と滑らかな質感を。"}},
  {"id": "flv-08", "no": "NO. 55", "name": "얼그레이 베르가못 인퓨즈드", "eng": "Earl Grey Bergamot Infused", "origin": "🇨🇴 COLOMBIA", "varietal": "Castillo", "process": "Infused", "altitude": "1,700m", "roast": "Light", "headline": "고급 얼그레이 차와 베르가못 오일의 우아하고 개운한 풍미", "sourDots": 4, "sourDesc": "개운한 베르가못 산미", "nuttyDots": 1, "nuttyDesc": "홍차의 우아함", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (맑은 얼그레이 차)", "guide": "커피라기보다 최고급 얼그레이 홍차를 마시는 듯 깔끔하고 은은합니다.", "keywords": ["얼그레이", "홍차", "베르가못", "가향", "1단계"], "countryCode": "COL", "region": "Quindio (킨디오)", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Introgressed (Castillo)", "processGroup": "Infused", "physicalGrade": "Botanical Infused Lot", "sweetDots": 3, "sweetDesc": "베르가못 오일과 홍차의 깔끔한 단맛", "flavorFamily": ["Floral", "Fruity"], "caffeine": "REGULAR", "brewOverride": "인퓨즈드 89~90°C · 20g / 300ml", "dialingNote": {"ko": "중세분쇄 (가는 드립용) · 92~93°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 15초~2분 25초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium-fine grind · 92–93°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 15s–2m 25s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中細挽き・92〜93°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分15秒〜2分25秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "bld-01", "no": "NO. 56", "name": "하우스 다크 로스팅 블렌드", "eng": "Signature House Dark Roast", "origin": "☕ HOUSE BLEND", "varietal": "Brazil / Guatemala", "process": "Mixed Process", "altitude": "Various", "roast": "Dark", "headline": "스모키한 참나무 향과 다크 초콜릿의 묵직한 카리스마", "sourDots": 1, "sourDesc": "신맛 전혀 없음", "nuttyDots": 5, "nuttyDesc": "진하고 구수함", "bodyDots": 5, "bodyStage": "5단계", "bodyDesc": "5단계 (혀를 코팅하는 진한 무게감)", "guide": "얼음을 가득 채워도 맛이 흐려지지 않는 진하고 쌉싸름한 아이스용 원두입니다.", "keywords": ["스타벅스", "진한커피", "스모키", "다크초콜릿", "5단계"], "countryCode": "BLEND", "region": "Brazil & Guatemala (시그니처 다크)", "categoryType": "HOUSE_BLEND", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Blend", "physicalGrade": "Master Signature Blend", "sweetDots": 3, "sweetDesc": "다크 초콜릿과 묵직한 캐러멜 단맛", "flavorFamily": ["Roasted", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "강배전 88~89°C · 20g / 290ml", "dialingNote": {"ko": "조분쇄 (굵은 천일염 크기) · 86~88°C · 1:14 (20g / 280ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 86~88°C로 수온을 낮추고, 2회 분할 주입 후 2분~2분 10초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Coarse grind · 86–88°C · 1:14 (20g / 280ml) · Use 86–88°C to tame bitterness; finish extraction early at 2m 00s–2m 10s to leave only velvety dark chocolate sweetness.", "ja": "粗挽き・86〜88°C・1:14 (20g / 280ml)・苦味や焦げ付きを防ぐため86〜88°Cの湯温に抑え、2回注湯ののち2分00秒〜2分10秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "bld-02", "no": "NO. 57", "name": "미드나잇 디카페인 에스프레소", "eng": "Midnight Decaf Espresso Blend", "origin": "☕ HOUSE BLEND", "varietal": "Colombia / Brazil", "process": "Swiss Water Decaf", "altitude": "Various", "roast": "Medium-Dark", "headline": "밤 12시에 마셔도 편안한 볶은 아몬드와 카카오의 단맛", "sourDots": 1, "sourDesc": "신맛 없음", "nuttyDots": 5, "nuttyDesc": "볶은 아몬드의 고소함", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (우유처럼 도톰함)", "guide": "카페인을 완전히 제거하여 밤늦게 마셔도 숙면을 취할 수 있는 안심 원두입니다.", "keywords": ["디카페인", "밤", "숙면", "고소한", "4단계"], "countryCode": "BLEND", "region": "Colombia & Brazil (스위스워터 디카페인)", "categoryType": "HOUSE_BLEND", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Decaf", "physicalGrade": "Swiss Water Decaf (99.9% 제거)", "sweetDots": 4, "sweetDesc": "볶은 아몬드와 카카오의 편안한 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "DECAF", "brewOverride": "디카페인 88~89°C · 20g / 290ml", "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 다공질 원두 특성상 미분이 생기기 쉬우므로 교반을 최소화하고 중심부 위주로 부드럽게 3회 주입해 잡미 없는 단맛을 끌어냅니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Porous bean structure extracts quickly; keep agitation minimal and pour gently in the center to highlight clean sweetness in 2m 10s–2m 20s.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・多孔質なデカフェ構造のため過抽出を避け、中心部へ静かに3回注湯して雑味のない甘みを2分10秒〜2分20秒で引き出します。"}},
  {"id": "bld-03", "no": "NO. 58", "name": "골든 허니 크림 블렌드", "eng": "Golden Honey Cream Blend", "origin": "☕ HOUSE BLEND", "varietal": "Costa Rica / Brazil", "process": "Honey / Natural", "altitude": "Various", "roast": "Medium", "headline": "꿀을 탄 우유처럼 보들보들하고 부드러운 목넘김", "sourDots": 2, "sourDesc": "부드럽고 순함", "nuttyDots": 4, "nuttyDesc": "꿀과 우유의 단맛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (저지방우유처럼 부드러움)", "guide": "자극 없이 몽글몽글 부드러워 라떼나 따뜻한 드립으로 드시기 좋습니다.", "keywords": ["꿀", "우유", "부드러운", "순한", "3단계"], "countryCode": "BLEND", "region": "Costa Rica & Brazil (허니 크림)", "categoryType": "HOUSE_BLEND", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Honey", "physicalGrade": "Master Signature Blend", "sweetDots": 5, "sweetDesc": "꿀을 탄 우유처럼 보들보들한 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "bld-04", "no": "NO. 59", "name": "시트러스 선라이즈 블렌드", "eng": "Citrus Sunrise Light Blend", "origin": "☕ HOUSE BLEND", "varietal": "Ethiopia / Kenya", "process": "Washed", "altitude": "Various", "roast": "Light", "headline": "아침 햇살처럼 눈이 번쩍 뜨이는 오렌지와 레몬의 산뜻함", "sourDots": 5, "sourDesc": "눈이 번쩍 뜨이는 과즙산미", "nuttyDots": 1, "nuttyDesc": "상쾌한 여운", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (오렌지주스 느낌)", "guide": "나른한 아침 정신을 개운하게 깨워주는 최고로 상큼한 과일 블렌딩입니다.", "keywords": ["오렌지", "레몬", "상큼한", "아침", "2단계"], "countryCode": "BLEND", "region": "Ethiopia & Kenya (시트러스 선라이즈)", "categoryType": "HOUSE_BLEND", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Washed", "physicalGrade": "Master Signature Blend", "sweetDots": 4, "sweetDesc": "오렌지 주스처럼 상큼달콤한 과즙미", "flavorFamily": ["Fruity", "Floral"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "dialingNote": {"ko": "중세분쇄 (가는 드립용) · 92~93°C · 1:15 (20g / 300ml) · 40초 뜸들이기로 탄산가스를 충분히 배출한 뒤 가늘고 일정한 물줄기로 3회 푸어링하여 자스민 꽃향과 투명한 클린컵을 극대화합니다.", "en": "Medium-fine grind · 92–93°C · 1:15 (20g / 300ml) · 40s blooming followed by 3 gentle pulse pours in 2m 15s–2m 25s to elevate delicate floral jasmine clarity and crisp citrus acidity.", "ja": "中細挽き・92〜93°C・1:15 (20g / 300ml)・40秒の蒸らしでガスをしっかり抜き、細く均一な湯流で3回注ぎ分けることで、繊細な花香と透明感のある酸味を2分15秒〜2分25秒で引き出します。"}},
  {"id": "bld-05", "no": "NO. 60", "name": "벨벳 멜로우 미디엄 블렌드", "eng": "Velvet Mellow Medium Blend", "origin": "☕ HOUSE BLEND", "varietal": "Colombia / Guatemala", "process": "Washed", "altitude": "Various", "roast": "Medium", "headline": "벨벳 천처럼 부드러운 밀크초콜릿과 호두의 대중적인 맛", "sourDots": 2, "sourDesc": "은은한 부드러움", "nuttyDots": 4, "nuttyDesc": "밀크초콜릿과 호두", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (도톰하고 평온함)", "guide": "누구에게 대접해도 칭찬받는 호불호 없는 가장 완벽한 대표 아메리카노 맛입니다.", "keywords": ["밀크초콜릿", "호두", "부드러운", "호불호없는", "4단계"], "countryCode": "BLEND", "region": "Colombia & Guatemala (벨벳 멜로우)", "categoryType": "HOUSE_BLEND", "species": "Arabica", "lineage": "Multi-Lineage Blend", "processGroup": "Washed", "physicalGrade": "Master Signature Blend", "sweetDots": 4, "sweetDesc": "벨벳처럼 매끄러운 밀크초콜릿 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "ken-03", "no": "NO. 61", "name": "케냐 녜리 카린둔두 AA 더블워시드", "eng": "Kenya Nyeri Karindundu AA Double Washed", "origin": "🇰🇪 KENYA", "countryCode": "KEN", "region": "Nyeri Karindundu (녜리 카린둔두)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (SL28)", "varietal": "SL28", "process": "Double Washed (72시간 이중 수세)", "processGroup": "Washed", "physicalGrade": "AA TOP (Screen 17–18 최상급)", "altitude": "1,850m ~ 1,950m", "roast": "Light-Medium", "headline": "잘 익은 레드 자몽과 블랙커런트가 폭발하는 케냐 산미의 정점", "sourDots": 5, "sourDesc": "짜릿하고 선명한 레드자몽 산미", "nuttyDots": 1, "nuttyDesc": "산뜻하고 깔끔한 여운", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (자몽에이드처럼 꽉 찬 과즙감)", "sweetDots": 4, "sweetDesc": "블랙커런트 시럽 단맛", "flavorFamily": ["Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 91~92°C · 20g / 300ml", "guide": "입안 가득 짜릿하게 터지는 시트러스와 붉은 베리 과즙을 사랑하는 산미 마니아의 종착역입니다.", "keywords": ["케냐", "녜리", "자몽", "블랙커런트", "산미폭발", "SL28", "3단계"], "dialingNote": {"ko": "녜리 카린둔두 AA 더블워시드: 93°C·1:16·2:40 추출로 블랙커런트와 자몽의 쨍한 주시함과 긴 단맛을 끌어내세요.", "en": "Nyeri Karindundu AA Double Washed: Extract at 93°C, 1:16 in 2:40 for vivid blackcurrant and grapefruit juiciness.", "ja": "ニエリ・カリンドゥンドゥAAダブルウォッシュド：93°C・1:16・2分40秒でカシスとグレープフルーツのジューシーさを。"}},
  {"id": "col-09", "no": "NO. 62", "name": "콜롬비아 카우카 치로소 워시드", "eng": "Colombia Cauca Chiroso Washed", "origin": "🇨🇴 COLOMBIA", "countryCode": "COL", "region": "Cauca & Urrao (카우카/우라오)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Chiroso)", "varietal": "Chiroso", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "COE / Championship Micro-lot", "altitude": "1,950m ~ 2,150m", "roast": "Light", "headline": "레몬그라스와 백도 과즙이 수정처럼 맑게 퍼지는 대회 우승 품종", "sourDots": 5, "sourDesc": "반짝이는 라임·레몬그라스 산미", "nuttyDots": 1, "nuttyDesc": "꽃차처럼 투명한 여운", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (레몬그라스 허브티 느낌)", "sweetDots": 4, "sweetDesc": "화이트피치 사탕 단맛", "flavorFamily": ["Floral", "Fruity"], "caffeine": "REGULAR", "brewOverride": "약배전 93°C · 20g / 310ml", "guide": "게이샤를 위협하는 콜롬비아 희귀 품종 '치로소'로, 수정처럼 투명하고 강렬한 시트러스 향이 일품입니다.", "keywords": ["콜롬비아", "치로소", "레몬그라스", "백도", "희귀품종", "1단계"], "dialingNote": {"ko": "중세분쇄 (가는 드립용) · 92~93°C · 1:15 (20g / 300ml) · 40초 뜸들이기로 탄산가스를 충분히 배출한 뒤 가늘고 일정한 물줄기로 3회 푸어링하여 자스민 꽃향과 투명한 클린컵을 극대화합니다.", "en": "Medium-fine grind · 92–93°C · 1:15 (20g / 300ml) · 40s blooming followed by 3 gentle pulse pours in 2m 15s–2m 25s to elevate delicate floral jasmine clarity and crisp citrus acidity.", "ja": "中細挽き・92〜93°C・1:15 (20g / 300ml)・40秒の蒸らしでガスをしっかり抜き、細く均一な湯流で3回注ぎ分けることで、繊細な花香と透明感のある酸味を2分15秒〜2分25秒で引き出します。"}},
  {"id": "eth-06", "no": "NO. 63", "name": "에티오피아 게뎁 워르카 사카로 무산소", "eng": "Ethiopia Gedeb Worka Sakaro Anaerobic", "origin": "🇪🇹 ETHIOPIA", "countryCode": "ETH", "region": "Gedeb Worka (게뎁 워르카)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Ethiopian Landrace (74110/74112)", "varietal": "JARC 74110 / 74112", "process": "Anaerobic Natural (무산소 내추럴)", "processGroup": "Anaerobic", "physicalGrade": "G1 Micro-lot", "altitude": "2,050m ~ 2,250m", "roast": "Light", "headline": "패션프루트와 산딸기 셔벗을 한 스쿱 떠먹는 듯한 열대 과즙 폭탄", "sourDots": 5, "sourDesc": "짜릿한 패션프루트 과즙산미", "nuttyDots": 2, "nuttyDesc": "달콤한 베리 타르트 여운", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (패션프루트 주스 느낌)", "sweetDots": 5, "sweetDesc": "산딸기 셔벗 같은 진한 단맛", "flavorFamily": ["Fruity", "Floral", "Fermented"], "caffeine": "REGULAR", "brewOverride": "특수발효 89~90°C · 20g / 300ml", "guide": "해발 2,100m 초고산지 체리를 무산소 발효해 패션프루트와 라즈베리의 새콤달콤함이 폭발합니다.", "keywords": ["에티오피아", "게뎁", "패션프루트", "산딸기", "무산소", "특수발효", "2단계"], "dialingNote": {"ko": "게뎁 워르카 사카로 무산소 내추럴: 89°C·1:16·부드러운 센터 푸어로 와이니한 베리와 플로럴 밸런스를 맞추세요.", "en": "Gedeb Worka Sakaro Anaerobic Natural: Gentle center pour at 89°C, 1:16 balances winey berries and florals.", "ja": "ゲデブ・ウォルカサカロ嫌気性ナチュラル：89°C・1:16の穏やかな中心注湯でワイニーなベリーと花香を調和。"}},
  {"id": "pan-03", "no": "NO. 64", "name": "파나마 볼칸 잔슨 게이샤 카보닉 마세레이션", "eng": "Panama Volcan Janson Geisha CM", "origin": "🇵🇦 PANAMA", "countryCode": "PAN", "region": "Volcan Baru (볼칸 바루)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "varietal": "Geisha", "process": "Carbonic Maceration (탄산 침출 발효)", "processGroup": "Carbonic Maceration", "physicalGrade": "Best of Panama Lot", "altitude": "1,750m ~ 2,000m", "roast": "Light", "headline": "샴페인 기포처럼 톡 쏘는 골드키위와 오렌지 꽃향기의 황홀경", "sourDots": 5, "sourDesc": "스파클링 와인 같은 샴페인 산미", "nuttyDots": 2, "nuttyDesc": "꿀에 절인 꽃잎 여운", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (스파클링 화이트와인 느낌)", "sweetDots": 5, "sweetDesc": "골드키위와 아카시아 꿀 단맛", "flavorFamily": ["Floral", "Fruity", "Fermented"], "caffeine": "REGULAR", "brewOverride": "약배전 91~92°C · 20g / 300ml", "guide": "와인 양조 기법인 카보닉 마세레이션을 적용해 게이샤의 꽃향기에 스파클링 과즙미를 더했습니다.", "keywords": ["파나마", "게이샤", "카보닉", "특수발효", "골드키위", "샴페인", "1단계"], "dialingNote": {"ko": "볼칸 잔슨 게이샤 CM: 89°C·중굵은 분쇄·1:16·2:15로 추출해 탄산 침출 특유의 스파클링 복숭아와 라벤더 향을 살리세요.", "en": "Volcan Janson Gesha CM: Brew at 89°C, medium-coarse, 1:16 in 2:15 for sparkling peach and lavender aromatics.", "ja": "ボルカン・ジャンソン・ゲイシャCM：89°C・中粗挽き・1:16・2分15秒で弾ける桃とラベンダーの香りを引き立てます。"}},
  {"id": "cos-03", "no": "NO. 65", "name": "코스타리카 도타 빌라 사르치 블랙허니", "eng": "Costa Rica Dota Villa Sarchi Black Honey", "origin": "🇨🇷 COSTA RICA", "countryCode": "CRI", "region": "Tarrazu Dota (따라주 도타)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (Villa Sarchi)", "varietal": "Villa Sarchi", "process": "Black Honey (블랙 허니)", "processGroup": "Honey", "physicalGrade": "SHB Micro-lot (1,800m+)", "altitude": "1,750m ~ 1,900m", "roast": "Light-Medium", "headline": "새콤한 오렌지 마멀레이드와 구운 헤이즐넛이 공존하는 입체적인 맛", "sourDots": 5, "sourDesc": "선명한 오렌지·살구 산미", "nuttyDots": 3, "nuttyDesc": "구운 아몬드와 흑설탕", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (과일 시럽처럼 쫀득함)", "sweetDots": 5, "sweetDesc": "점액질을 100% 살린 블랙허니 단맛", "flavorFamily": ["Fruity", "Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "약중배전 90~91°C · 20g / 300ml", "guide": "코스타리카 고유 왜성 버본 품종 '빌라 사르치'를 블랙허니로 가공해 산미와 고소한 단맛이 동시에 높습니다.", "keywords": ["코스타리카", "블랙허니", "빌라사르치", "오렌지", "허니", "3단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "rwa-03", "no": "NO. 66", "name": "르완다 냐마셰케 기테시 레드버본 내추럴", "eng": "Rwanda Nyamasheke Gitesi Natural", "origin": "🇷🇼 RWANDA", "countryCode": "RWA", "region": "Nyamasheke (냐마셰케 키부호)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (Red Bourbon)", "varietal": "Red Bourbon", "process": "Natural (햇볕 건조)", "processGroup": "Natural", "physicalGrade": "A1 COE Winner Lot", "altitude": "1,800m ~ 2,000m", "roast": "Light-Medium", "headline": "석류 주스와 크랜베리 타르트의 새콤달콤하고 붉은 과실미", "sourDots": 5, "sourDesc": "톡 쏘는 석류·크랜베리 산미", "nuttyDots": 2, "nuttyDesc": "구운 피칸 파이 여운", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (석류주스처럼 진함)", "sweetDots": 4, "sweetDesc": "크랜베리 잼 단맛", "flavorFamily": ["Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 90~91°C · 20g / 300ml", "guide": "키부 호수 해풍을 맞고 자란 레드버본 내추럴로, 석류와 크랜베리의 생동감 넘치는 산미가 매력적입니다.", "keywords": ["르완다", "석류", "크랜베리", "내추럴", "레드버본", "3단계"], "dialingNote": {"ko": "냐마셰케 기테시 레드버본 내추럴: 90°C·1:15.5·2:30 플랫베드 드리퍼로 크랜베리·홍차·캐러멜의 매끈한 단맛을 살리세요.", "en": "Gitesi Red Bourbon Natural: Flat-bottom dripper at 90°C, 1:15.5 in 2:30 highlights cranberry, black tea, and caramel.", "ja": "ギテシ・レッドブルボン・ナチュラル：90°C・1:15.5・2分30秒のフラットボトムでクランベリーと紅茶の滑らかな甘みを。"}},
  {"id": "ken-04", "no": "NO. 67", "name": "케냐 엠부 카리아이니 피베리 워시드", "eng": "Kenya Embu Gathaithi PB Washed", "origin": "🇰🇪 KENYA", "countryCode": "KEN", "region": "Embu Mt. Kenya (엠부 케냐산)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (SL28/SL34)", "varietal": "SL28 / SL34", "process": "Double Washed (이중 수세)", "processGroup": "Washed", "physicalGrade": "PB TOP (피베리 최상급)", "altitude": "1,750m ~ 1,900m", "roast": "Medium", "headline": "카시스 리큐르와 블러드 오렌지의 농축된 산미와 묵직한 와인 바디", "sourDots": 5, "sourDesc": "강렬한 블러드오렌지 산미", "nuttyDots": 2, "nuttyDesc": "다크 카카오 피니시", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (풀바디 레드와인 질감)", "sweetDots": 4, "sweetDesc": "카시스 베리 농축 단맛", "flavorFamily": ["Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "높은 산미와 4단계의 묵직한 바디감을 동시에 원하는 분께 최적화된 케냐 최상급 피베리입니다.", "keywords": ["케냐", "피베리", "블러드오렌지", "카시스", "풀바디산미", "4단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "sal-03", "no": "NO. 68", "name": "엘살바도르 핀카 킬리만자로 케냐스타일 버본", "eng": "El Salvador Finca Kilimanjaro Bourbon", "origin": "🇸🇻 EL SALVADOR", "countryCode": "SLV", "region": "Santa Ana (일라마테펙 화산)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "varietal": "Red Bourbon", "process": "Kenya-Style Double Washed", "processGroup": "Washed", "physicalGrade": "SHG Aida Batlle Selection", "altitude": "1,650m ~ 1,750m", "roast": "Light-Medium", "headline": "중남미 버본의 고소한 아몬드에 케냐식 자몽 산미를 결합한 혁신 원두", "sourDots": 4, "sourDesc": "선명한 핑크자몽 산미", "nuttyDots": 3, "nuttyDesc": "구운 아몬드와 브라운슈거", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (자몽 밀크티처럼 입체적임)", "sweetDots": 4, "sweetDesc": "캐러멜라이즈드 오렌지 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 91°C · 20g / 300ml", "guide": "전설적인 프로듀서 아이다 바틀이 개발한 원두로, 상큼한 과일 산미와 고소한 견과류 맛을 한 잔에 담았습니다.", "keywords": ["엘살바도르", "버본", "자몽", "아몬드", "복합풍미", "3단계"], "dialingNote": {"ko": "핀카 킬리만자로 케냐스타일 버본: 92°C·1:16·2:30 추출로 레드커런트의 생기 있는 산미와 캐러멜 단맛의 대비를 즐기세요.", "en": "Finca Kilimanjaro Kenya-Style Bourbon: 92°C, 1:16 in 2:30 pairs lively redcurrant acidity with sweet caramel.", "ja": "フィンカ・キリマンジャロ・ケニア式ブルボン：92°C・1:16・2分30秒で赤スグリの爽やかな酸とキャラメルの甘みを。"}},
  {"id": "gtm-04", "no": "NO. 69", "name": "과테말라 아카테낭고 게이샤 워시드", "eng": "Guatemala Acatenango Geisha Washed", "origin": "🇬🇹 GUATEMALA", "countryCode": "GTM", "region": "Acatenango Valley (아카테낭고)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "varietal": "Geisha", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "SHB COE Auction Lot", "altitude": "1,800m ~ 2,000m", "roast": "Light-Medium", "headline": "화산토가 키운 게이샤 특유의 오렌지 꽃향기와 구운 헤이즐넛의 조화", "sourDots": 4, "sourDesc": "화사한 만다린 오렌지 산미", "nuttyDots": 3, "nuttyDesc": "구운 헤이즐넛과 밀크초콜릿", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (오렌지 얼그레이 티 느낌)", "sweetDots": 4, "sweetDesc": "메이플과 꽃꿀 단맛", "flavorFamily": ["Floral", "Fruity", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "약중배전 91~92°C · 20g / 300ml", "guide": "파나마 게이샤보다 고소한 견과류 여운이 더해져 게이샤 입문자도 부담 없이 즐기기 좋습니다.", "keywords": ["과테말라", "아카테낭고", "게이샤", "오렌지꽃", "헤이즐넛", "2단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "hon-02", "no": "NO. 70", "name": "온두라스 산타바바라 엘 푸엔테 파카스 내추럴", "eng": "Honduras Santa Barbara El Puente Pacas", "origin": "🇭🇳 HONDURAS", "countryCode": "HND", "region": "Santa Barbara (산타바바라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (Pacas)", "varietal": "Pacas", "process": "Natural (햇볕 건조)", "processGroup": "Natural", "physicalGrade": "SHG COE Champion Estate", "altitude": "1,650m ~ 1,850m", "roast": "Medium", "headline": "열대 파인애플과 밀크초콜릿이 도톰하게 어우러지는 챔피언 농장 원두", "sourDots": 4, "sourDesc": "농익은 파인애플·체리 산미", "nuttyDots": 3, "nuttyDesc": "부드러운 밀크초콜릿", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (열대과일 스무디처럼 묵직함)", "sweetDots": 5, "sweetDesc": "파인애플 잼과 초콜릿 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90°C · 20g / 300ml", "guide": "산미(4)와 고소함(3), 묵직한 바디감(4)을 모두 갖춘 온두라스 산타바바라 최고의 명품 랏입니다.", "keywords": ["온두라스", "산타바바라", "파카스", "파인애플", "밀크초콜릿", "4단계"], "dialingNote": {"ko": "산타바바라 엘 푸엔테 파카스 내추럴: 90°C·1:15·2:35로 추출해 잘 익은 망고·베리와 밀크초콜릿의 크리미한 밸런스를 만드세요.", "en": "El Puente Pacas Natural: Brew at 90°C, 1:15 in 2:35 for creamy milk chocolate wrapped around ripe mango and berry.", "ja": "エルプエンテ・パカス・ナチュラル：90°C・1:15・2分35秒で熟したマンゴーとミルクチョコのクリーミーな調和を。"}},
  {"id": "bur-02", "no": "NO. 71", "name": "부룬디 카얀자 음팡가 레드버본 허니", "eng": "Burundi Kayanza Mpanga Red Bourbon Honey", "origin": "🇧🇮 BURUNDI", "countryCode": "BDI", "region": "Kayanza Mpanga (카얀자 음팡가)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "varietal": "Red Bourbon", "process": "Red Honey (레드 허니)", "processGroup": "Honey", "physicalGrade": "A1 COE Top 10 Lot", "altitude": "1,850m ~ 2,000m", "roast": "Medium", "headline": "무화과 타르트와 라즈베리 잼을 얹은 구운 피칸 파이 같은 풍성함", "sourDots": 4, "sourDesc": "상큼달콤한 라즈베리 산미", "nuttyDots": 4, "nuttyDesc": "구운 피칸과 시나몬 쿠키", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (실키하고 쫀득한 단맛)", "sweetDots": 5, "sweetDesc": "무화과와 황설탕 시럽 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "산미와 고소함이 둘 다 4단계로 풍부해 과일 향과 견과류 고소함을 동시에 놓치고 싶지 않을 때 완벽합니다.", "keywords": ["부룬디", "허니", "무화과", "피칸", "라즈베리", "3단계"], "dialingNote": {"ko": "카얀자 음팡가 레드허니: 91°C·1:15·2:35 추출로 레드허니 특유의 황설탕 점성과 잘 익은 자두 산미를 조화시키세요.", "en": "Kayanza Mpanga Red Honey: Brew at 91°C, 1:15 in 2:35 to pair syrupy brown sugar with ripe plum acidity.", "ja": "カヤンザ・ムパンガ・レッドハニー：91°C・1:15・2分35秒で黒糖のような粘度と熟したプラムの酸味を調和。"}},
  {"id": "tan-02", "no": "NO. 72", "name": "탄자니아 음베야 루마 트위자 AA 워시드", "eng": "Tanzania Mbeya Luma Twiza AA Washed", "origin": "🇹🇿 TANZANIA", "countryCode": "TZA", "region": "Mbeya Southern Highlands (음베야)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon & Kent Lineage", "varietal": "Bourbon / Kent", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "AA TOP (Screen 18+)", "altitude": "1,650m ~ 1,850m", "roast": "Medium", "headline": "블랙베리 과즙과 다크 초콜릿, 헤이즐넛이 묵직하게 감기는 남부 고산지 원두", "sourDots": 3, "sourDesc": "생기 있는 블랙베리 산미", "nuttyDots": 4, "nuttyDesc": "진한 헤이즐넛과 다크초콜릿", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (벨벳처럼 묵직한 목넘김)", "sweetDots": 4, "sweetDesc": "블랙베리 초콜릿 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중배전 90°C · 20g / 300ml", "guide": "적당한 베리 산미(3)에 진한 초콜릿 고소함(4)과 도톰한 바디(4)가 어우러진 탄자니아 남부의 숨은 보석입니다.", "keywords": ["탄자니아", "음베야", "블랙베리", "초콜릿", "헤이즐넛", "4단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "uga-02", "no": "NO. 73", "name": "우간다 루웬조리 마운틴 달의 산 내추럴", "eng": "Uganda Rwenzori Mountains of the Moon Natural", "origin": "🇺🇬 UGANDA", "countryCode": "UGA", "region": "Rwenzori Mountains (루웬조리)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon & Typica (SL14/SL28)", "varietal": "SL14 / SL28", "process": "Natural (아프리칸 베드 건조)", "processGroup": "Natural", "physicalGrade": "Wugar / Drugar Specialty", "altitude": "1,750m ~ 2,000m", "roast": "Medium", "headline": "럼주에 절인 건포도와 다크 체리, 구운 호두의 이국적인 하모니", "sourDots": 3, "sourDesc": "농익은 다크체리 산미", "nuttyDots": 4, "nuttyDesc": "구운 호두와 카카오닙스", "bodyDots": 5, "bodyStage": "5단계", "bodyDesc": "5단계 (리큐르처럼 묵직하고 진함)", "sweetDots": 4, "sweetDesc": "럼 레이즌과 조청 단맛", "flavorFamily": ["Fruity", "Fermented", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중배전 89~90°C · 20g / 300ml", "guide": "전설 속 '달의 산' 루웬조리 빙하 지대에서 자라 와인 같은 과실미와 5단계 풀바디를 자랑합니다.", "keywords": ["우간다", "루웬조리", "체리", "호두", "내추럴", "5단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 과일잼 같은 농밀한 과실 단맛을 살리기 위해 뜸들이기 후 2회차 주입량을 60% 집중하고 2분 25초~2분 35초 내에 깔끔하게 마무리합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Concentrate 60% of water volume in the second pour after bloom to extract luscious berry sweetness without dry astringency.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・果実ジャムのような甘みを引き出すため、蒸らし後の2投目で湯量の60%を注ぎ、2分25秒〜2分35秒前後でキレよく仕上げます。"}},
  {"id": "yem-01", "no": "NO. 74", "name": "예멘 모카 마타리 바니 마타르 내추럴", "eng": "Yemen Mocha Matari Bani Matar Natural", "origin": "🇾🇪 YEMEN", "countryCode": "YEM", "region": "Sana'a Bani Matar (바니 마타르)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian / Yemenia Landrace", "varietal": "Udaini / Dawairi (Yemenia)", "process": "Ancient Rooftop Natural (전통 옥상 건조)", "processGroup": "Natural", "physicalGrade": "Grade A Heritage Mocha", "altitude": "2,000m ~ 2,300m", "roast": "Medium-Dark", "headline": "반 고흐가 사랑한 전설의 모카 커피, 붉은 포도주와 다크 초콜릿의 교향곡", "sourDots": 3, "sourDesc": "고혹적인 레드와인 산미", "nuttyDots": 5, "nuttyDesc": "진한 다크초콜릿과 카다멈", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (진한 모카 포트처럼 묵직함)", "sweetDots": 4, "sweetDesc": "말린 무화과와 다크초콜릿 단맛", "flavorFamily": ["Nutty/Cocoa", "Fermented", "Spiced"], "caffeine": "REGULAR", "brewOverride": "중강배전 89~90°C · 20g / 290ml", "guide": "초콜릿을 넣지 않아도 진짜 다크 초콜릿과 적포도주 맛이 나는 역사적인 '모카' 커피의 원형입니다.", "keywords": ["예멘", "모카", "마타리", "와인", "다크초콜릿", "명품", "4단계"], "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 과일잼 같은 농밀한 과실 단맛을 살리기 위해 뜸들이기 후 2회차 주입량을 60% 집중하고 2분 10초~2분 20초 내에 깔끔하게 마무리합니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Concentrate 60% of water volume in the second pour after bloom to extract luscious berry sweetness without dry astringency.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・果実ジャムのような甘みを引き出すため、蒸らし後の2投目で湯量の60%を注ぎ、2分10秒〜2分20秒前後でキレよく仕上げます。"}},
  {"id": "yem-02", "no": "NO. 75", "name": "예멘 하라즈 알 마카 예메니아 알케미", "eng": "Yemen Haraz Al-Maqha Yemenia Alchemy", "origin": "🇾🇪 YEMEN", "countryCode": "YEM", "region": "Haraz Mountains (하라즈 산맥)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Yemenia Mother Population", "varietal": "Yemenia", "process": "Slow Anaerobic Natural (저온 장기 발효)", "processGroup": "Anaerobic", "physicalGrade": "Qima Auction Lot (90+)", "altitude": "2,100m ~ 2,400m", "roast": "Light-Medium", "headline": "자두 리큐르와 시나몬, 라즈베리 트러플 초콜릿의 경이로운 아로마", "sourDots": 4, "sourDesc": "복합적인 자두·석류 산미", "nuttyDots": 4, "nuttyDesc": "트러플 초콜릿과 향신료", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (벨벳 포트와인 질감)", "sweetDots": 5, "sweetDesc": "자두 콩포트와 초콜릿 가나슈 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa", "Spiced", "Fermented"], "caffeine": "REGULAR", "brewOverride": "특수발효 89~90°C · 20g / 300ml", "guide": "최근 WCR과 유전학계가 발견한 새로운 아라비카 모체 그룹 '예메니아' 품종의 압도적인 복합미를 경험해보세요.", "keywords": ["예멘", "하라즈", "예메니아", "자두", "초콜릿", "특수발효", "4단계"], "dialingNote": {"ko": "예멘 하라즈 알 마카 예메니아 알케미: 90°C·1:15.5·2:35 추출로 2,200m 고지대 저온 발효의 무화과·스파이스·와이니 복합미를 음미하세요.", "en": "Haraz Al Maka Yemenia Alchemy: Brew at 90°C, 1:15.5 in 2:35 for spiced fig, dried berry, and winey high-altitude depth.", "ja": "ハラズ・アルマカ・イエメニア：90°C・1:15.5・2分35秒で2,200m高地低温発酵のイチジクとスパイスの重層的な深みを。"}},
  {"id": "mex-01", "no": "NO. 76", "name": "멕시코 치아파스 알투라 유기농 워시드", "eng": "Mexico Chiapas Altura SHG Organic", "origin": "🇲🇽 MEXICO", "countryCode": "MEX", "region": "Chiapas Sierra Madre (치아파스)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica & Bourbon Lineage", "varietal": "Typica / Bourbon", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "Altura SHG EP Organic", "altitude": "1,400m ~ 1,700m", "roast": "Medium", "headline": "구운 피칸과 캐러멜의 고소함을 맑고 가벼운 바디감으로 즐기는 데일리 커피", "sourDots": 2, "sourDesc": "은은한 청사과 산미", "nuttyDots": 4, "nuttyDesc": "고소한 구운 피칸과 아몬드", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (맑은 아메리카노 느낌)", "sweetDots": 3, "sweetDesc": "담백한 황설탕 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "고소한 커피를 좋아하지만 묵직하고 텁텁한 끝맛은 싫어하는 분께 2단계 맑은 바디감으로 보답합니다.", "keywords": ["멕시코", "치아파스", "알투라", "피칸", "유기농", "깔끔한고소함", "2단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "mex-02", "no": "NO. 77", "name": "멕시코 오아하카 플루마 히달고 티피카", "eng": "Mexico Oaxaca Pluma Hidalgo Typica", "origin": "🇲🇽 MEXICO", "countryCode": "MEX", "region": "Oaxaca Pluma Hidalgo (오아하카)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage (Pluma Hidalgo)", "varietal": "Pluma Typica", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "SHG Pluma Heritage", "altitude": "1,350m ~ 1,650m", "roast": "Light-Medium", "headline": "태평양 해풍이 키운 오렌지 필과 헤이즐넛 초콜릿의 산뜻한 조화", "sourDots": 3, "sourDesc": "밝은 오렌지 마멀레이드 산미", "nuttyDots": 4, "nuttyDesc": "구운 헤이즐넛과 시나몬", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (산뜻하고 매끄러운 목넘김)", "sweetDots": 4, "sweetDesc": "오렌지 필 초콜릿 단맛", "flavorFamily": ["Nutty/Cocoa", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 91°C · 20g / 300ml", "guide": "멕시코 남부 태평양 연안의 전설적인 토착 티피카 변종 '플루마'로, 가볍고 산뜻한 오렌지 초콜릿 풍미가 납니다.", "keywords": ["멕시코", "오아하카", "플루마", "오렌지", "헤이즐넛", "2단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "bra-04", "no": "NO. 78", "name": "브라질 다테라 로리나 (버본 포인투) 저카페인", "eng": "Brazil Daterra Laurina (Bourbon Pointu) Low-Caf", "origin": "🇧🇷 BRAZIL", "countryCode": "BRA", "region": "Cerrado Daterra (세라도 다테라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (Laurina)", "varietal": "Laurina (Bourbon Pointu)", "process": "Natural (특수 그늘 건조)", "processGroup": "Natural", "physicalGrade": "Daterra Masterpiece Lot", "altitude": "1,150m ~ 1,250m", "roast": "Light-Medium", "headline": "인공 공정 없이 천연 카페인이 절반 이하인 왕실 품종, 아몬드와 복숭아의 우아함", "sourDots": 3, "sourDesc": "섬세한 백도·살구 산미", "nuttyDots": 4, "nuttyDesc": "마카다미아와 화이트초콜릿", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (실크 티처럼 가볍고 투명함)", "sweetDots": 5, "sweetDesc": "화이트초콜릿과 꿀 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Fruity"], "caffeine": "LOW_CAF", "brewOverride": "저밀도 품종 전용 89~90°C · 20g / 300ml", "guide": "화학 디카페인 공정 없이도 카페인이 일반 아라비카의 1/3(0.4%) 수준이라 쓴맛이 전혀 없고 단맛이 극대화됩니다.", "keywords": ["브라질", "로리나", "버본포인투", "저카페인", "디카페인", "화이트초콜릿", "1단계"], "dialingNote": {"ko": "다테라 로리나(버본 포인투) 저카페인: 91°C·1:16·2:20 추출로 천연 저카페인 품종의 섬세한 시트러스와 실키한 꿀 단맛을 살리세요.", "en": "Daterra Laurina Low-Caf: Brew at 91°C, 1:16 in 2:20 to highlight delicate citrus and silky honey in this rare varietal.", "ja": "ダテーラ・ラウリーナ低カフェイン：91°C・1:16・2分20秒で希少品種の繊細な柑橘と絹のような蜂蜜の甘みを。"}},
  {"id": "col-10", "no": "NO. 79", "name": "콜롬비아 인마쿨라다 유제니오이데스", "eng": "Colombia Finca Inmaculada Coffea Eugenioides", "origin": "🇨🇴 COLOMBIA", "countryCode": "COL", "region": "Valle del Cauca (발레 델 카우카)", "categoryType": "SINGLE_ORIGIN", "species": "Eugenioides", "lineage": "Species / Rare (아라비카 모체종)", "varietal": "Coffea Eugenioides", "process": "Natural (햇볕 건조)", "processGroup": "Natural", "physicalGrade": "WBC Championship Rare Species", "altitude": "1,900m ~ 2,050m", "roast": "Light", "headline": "카페인 0.2%가 만든 무중력의 단맛! 슈가파우더와 마시멜로, 시리얼 우유 맛", "sourDots": 2, "sourDesc": "자극 없는 골드키위 미소 산미", "nuttyDots": 3, "nuttyDesc": "구운 시리얼과 마시멜로", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (솜사탕이 녹는 듯한 가벼움)", "sweetDots": 5, "sweetDesc": "스테비아·솜사탕 같은 초극강 단맛", "flavorFamily": ["Sweet", "Floral"], "caffeine": "LOW_CAF", "brewOverride": "희귀종 전용 90°C · 20g / 280ml", "guide": "아라비카의 부모 종인 '유제니오이데스'로, 쓴맛의 원인인 카페인이 거의 없어 커피가 아닌 설탕차처럼 달콤합니다.", "keywords": ["콜롬비아", "유제니오이데스", "저카페인", "마시멜로", "극강단맛", "희귀품종", "1단계"], "dialingNote": {"ko": "인마쿨라다 유제니오이데스: 90°C·1:15.5·2:10 저교반 추출로 천연 저카페인 종 특유의 스테비아·시리얼 밀크 단맛을 극대화하세요.", "en": "Inmaculada Eugenioides: Low-agitation brew at 90°C, 1:15.5 in 2:10 maximizes stevia-like cereal milk sweetness.", "ja": "インマクラダ・エウゲニオイデス：90°C・1:15.5・2分10秒の低撹拌抽出でステビアとシリアルミルクの甘みを最大化。"}},
  {"id": "col-11", "no": "NO. 80", "name": "콜롬비아 우일라 우시우시 코지 발효", "eng": "Colombia Huila Wush Wush Koji Fermented", "origin": "🇨🇴 COLOMBIA", "countryCode": "COL", "region": "Huila Acevedo (우일라 아세베도)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Ethiopian Landrace (Wush Wush)", "varietal": "Wush Wush", "process": "Koji Super-Natural (누룩균 발효)", "processGroup": "Anaerobic", "physicalGrade": "Competition Micro-lot", "altitude": "1,850m ~ 2,000m", "roast": "Light", "headline": "에티오피아 우시우시 희귀종과 코지(누룩) 발효가 빚은 블루베리 와인과 감칠맛", "sourDots": 4, "sourDesc": "화려한 블루베리·히비스커스 산미", "nuttyDots": 2, "nuttyDesc": "구운 아몬드와 감칠맛", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (로제 와인처럼 맑고 긴 여운)", "sweetDots": 5, "sweetDesc": "블루베리 리큐르와 꿀 단맛", "flavorFamily": ["Fruity", "Floral", "Fermented"], "caffeine": "REGULAR", "brewOverride": "코지발효 89~90°C · 20g / 300ml", "guide": "일본 사케에 쓰이는 코지(Koji) 포자로 발효해 블루베리 꽃향기와 입안에 감기는 감칠맛(Umami)이 독보적입니다.", "keywords": ["콜롬비아", "우시우시", "코지발효", "특수발효", "블루베리", "1단계"], "dialingNote": {"ko": "중세분쇄 (가는 드립용) · 92~93°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 15초~2분 25초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium-fine grind · 92–93°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 15s–2m 25s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中細挽き・92〜93°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分15秒〜2分25秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "vnm-02", "no": "NO. 81", "name": "베트남 람동 랑비앙 파인 로부스타 레드허니", "eng": "Vietnam Lam Dong Fine Robusta Red Honey", "origin": "🇻🇳 VIETNAM", "countryCode": "VNM", "region": "Lam Dong Langbiang (랑비앙 고원)", "categoryType": "SINGLE_ORIGIN", "species": "Fine Robusta", "lineage": "Species / Rare (CQI Fine Robusta)", "varietal": "TR4 / Late Harvest Canephora", "process": "Red Honey (레드 허니)", "processGroup": "Honey", "physicalGrade": "CQI Q-Robusta 84+ Certified", "altitude": "1,100m ~ 1,350m", "roast": "Medium-Dark", "headline": "로부스타의 편견을 깨는 CQI 스페셜티 인증! 솔티드 카라멜과 헤이즐넛 크레마", "sourDots": 1, "sourDesc": "산미 거의 없음", "nuttyDots": 4, "nuttyDesc": "솔티드 카라멜과 구운 헤이즐넛", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (에스프레소 크레마처럼 쫀득함)", "sweetDots": 4, "sweetDesc": "당밀과 다크초콜릿 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet", "Roasted"], "caffeine": "REGULAR", "brewOverride": "파인로부스타 88°C · 20g / 280ml", "guide": "고무 냄새 나는 저급 로부스타가 아닙니다. 완숙 체리만 수확해 레드허니로 가공한 진하고 쫀득한 넛츠 폭탄입니다.", "keywords": ["베트남", "파인로부스타", "로부스타", "솔티드카라멜", "피넛버터", "신맛없는", "4단계"], "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "nic-02", "no": "NO. 82", "name": "니카라과 히노테가 라 바스티야 자바 내추럴", "eng": "Nicaragua Jinotega La Bastilla Java Natural", "origin": "🇳🇮 NICARAGUA", "countryCode": "NIC", "region": "Jinotega (히노테가)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Java)", "varietal": "Java (Longberry)", "process": "Natural (햇볕 건조)", "processGroup": "Natural", "physicalGrade": "SHG EP Rainforest Certified", "altitude": "1,400m ~ 1,650m", "roast": "Light-Medium", "headline": "길쭉한 자바 롱베리 원두에서 피어나는 패션프루트와 아몬드 초콜릿 향", "sourDots": 4, "sourDesc": "상큼한 패션프루트·감귤 산미", "nuttyDots": 3, "nuttyDesc": "고소한 아몬드 초콜릿", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (얼그레이 티처럼 가볍고 산뜻함)", "sweetDots": 4, "sweetDesc": "열대과일과 꿀 단맛", "flavorFamily": ["Fruity", "Floral", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "약중배전 91°C · 20g / 300ml", "guide": "에티오피아 기원의 '자바(Java)' 품종을 니카라과 화산토에서 재배해 꽃향기와 견과류 고소함이 함께 살아납니다.", "keywords": ["니카라과", "히노테가", "자바", "패션프루트", "아몬드", "1단계"], "dialingNote": {"ko": "히노테가 라 바스티야 자바 내추럴: 90°C·1:15.5·2:25 추출로 자바 품종 특유의 허브·시트러스 꽃향과 실키한 단맛을 살리세요.", "en": "La Bastilla Java Natural: 90°C, 1:15.5 in 2:25 reveals Java's signature floral citrus, sweet herb, and silky finish.", "ja": "ラバスティージャ・ジャバ・ナチュラル：90°C・1:15.5・2分25秒でジャバ種特有の柑橘花香と絹の甘みを表現。"}},
  {"id": "jam-02", "no": "NO. 83", "name": "자메이카 블루마운틴 클리프튼 마운틴 피베리", "eng": "Jamaica Blue Mountain Clifton Mount Peaberry", "origin": "🇯🇲 JAMAICA", "countryCode": "JAM", "region": "Newcastle Clifton Mount (클리프튼)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage (Blue Mountain)", "varietal": "Blue Mountain Typica", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "Prime Peaberry (피베리 특등급)", "altitude": "1,300m ~ 1,600m", "roast": "Light-Medium", "headline": "1790년 설립된 자메이카 최고령 농장의 피베리, 오렌지 블로섬과 피칸 버터", "sourDots": 2, "sourDesc": "고급스러운 오렌지 블로섬 산미", "nuttyDots": 3, "nuttyDesc": "버터리한 구운 피칸", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (벨벳처럼 매끈한 밸런스)", "sweetDots": 4, "sweetDesc": "밀크초콜릿과 메이플 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet", "Floral"], "caffeine": "REGULAR", "brewOverride": "약중배전 90~91°C · 20g / 300ml", "guide": "일반 블루마운틴 No.1보다 과실의 화사함과 피베리의 응축된 단맛이 한층 더 선명한 최고급 랏입니다.", "keywords": ["자메이카", "블루마운틴", "피베리", "클리프튼", "명품", "3단계"], "dialingNote": {"ko": "클리프튼 마운틴 피베리: 91°C·1:16·2:25 부드러운 푸어로 블루마운틴 피베리의 실크 같은 밸런스와 헤이즐넛 여운을 지키세요.", "en": "Clifton Mountain Peaberry: Gentle pour at 91°C, 1:16 in 2:25 preserves silky Blue Mountain balance and hazelnut.", "ja": "クリフトンマウンテン・ピーベリー：91°C・1:16・2分25秒の優しい注湯で絹のような調和とヘーゼルナッツの余韻を。"}},
  {"id": "per-02", "no": "NO. 84", "name": "페루 카하마르카 산 이그나시오 게이샤 워시드", "eng": "Peru Cajamarca San Ignacio Geisha Washed", "origin": "🇵🇪 PERU", "countryCode": "PER", "region": "Cajamarca San Ignacio (카하마르카)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "varietal": "Geisha", "process": "Washed (안데스 빙하수 세척)", "processGroup": "Washed", "physicalGrade": "COE Winner Grade 1 (2,000m+)", "altitude": "1,900m ~ 2,150m", "roast": "Light", "headline": "안데스 해발 2,000m 구름 위에서 자란 화이트 피치와 레몬 버베나의 투명함", "sourDots": 4, "sourDesc": "맑은 레몬버베나·백도 산미", "nuttyDots": 2, "nuttyDesc": "캐모마일과 은은한 아몬드", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (꿀차처럼 매끄럽고 맑은 질감)", "sweetDots": 4, "sweetDesc": "아카시아 꿀과 백도 단맛", "flavorFamily": ["Floral", "Fruity"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "guide": "최근 글로벌 게이샤 시장에서 가성비와 품질을 동시에 평정한 페루 북부 카하마르카의 고산지 게이샤입니다.", "keywords": ["페루", "카하마르카", "게이샤", "백도", "레몬버베나", "3단계"], "dialingNote": {"ko": "중세분쇄 (가는 드립용) · 92~93°C · 1:15 (20g / 300ml) · 40초 뜸들이기로 탄산가스를 충분히 배출한 뒤 가늘고 일정한 물줄기로 3회 푸어링하여 자스민 꽃향과 투명한 클린컵을 극대화합니다.", "en": "Medium-fine grind · 92–93°C · 1:15 (20g / 300ml) · 40s blooming followed by 3 gentle pulse pours in 2m 15s–2m 25s to elevate delicate floral jasmine clarity and crisp citrus acidity.", "ja": "中細挽き・92〜93°C・1:15 (20g / 300ml)・40秒の蒸らしでガスをしっかり抜き、細く均一な湯流で3回注ぎ分けることで、繊細な花香と透明感のある酸味を2分15秒〜2分25秒で引き出します。"}},
  {"id": "ecu-02", "no": "NO. 85", "name": "에콰도르 피친차 크루즈 로마 티피카 메호라도", "eng": "Ecuador Pichincha Cruz Loma Typica Mejorado", "origin": "🇪🇨 ECUADOR", "countryCode": "ECU", "region": "Pichincha (피친차 안데스)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica × Ethiopian Landrace", "varietal": "Typica Mejorado", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "Taza Dorada 1st Place Lot", "altitude": "1,850m ~ 2,050m", "roast": "Light", "headline": "월드 바리스타 챔피언들이 선택한 '티피카 메호라도', 망고스틴과 자스민 꿀차", "sourDots": 5, "sourDesc": "우아하고 짜릿한 망고스틴·라임 산미", "nuttyDots": 3, "nuttyDesc": "화이트 초콜릿과 아몬드 여운", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (실크처럼 매끄러운 과즙차)", "sweetDots": 5, "sweetDesc": "망고스틴과 바닐라 시럽 단맛", "flavorFamily": ["Floral", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "guide": "에콰도르 고유 품종 '티피카 메호라도'로, 게이샤의 꽃향기와 버본의 단맛을 모두 품은 대회 단골 우승 원두입니다.", "keywords": ["에콰도르", "티피카메호라도", "망고스틴", "자스민", "챔피언원두", "2단계"], "dialingNote": {"ko": "피친차 크루즈 로마 티피카 메호라도: 93°C·1:16.5·2:25 추출로 화이트피치·자스민·사탕수수의 수정처럼 맑은 구조감을 느끼세요.", "en": "Cruz Loma Typica Mejorado: Brew at 93°C, 1:16.5 in 2:25 for crystal-clear white peach, jasmine, and sugarcane.", "ja": "クルスロマ・ティピカメホラド：93°C・1:16.5・2分25秒で白桃・ジャスミン・サトウキビの澄んだ構造美を体感。"}},
  {"id": "bol-02", "no": "NO. 86", "name": "볼리비아 카라나비 솔 데 라 마냐나 코코 내추럴", "eng": "Bolivia Caranavi Sol de la Manana Coco Natural", "origin": "🇧🇴 BOLIVIA", "countryCode": "BOL", "region": "Yungas Caranavi (융가스 카라나비)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Bourbon Lineage (Caturra)", "varietal": "Red Caturra", "process": "Coco Natural (건조기 정밀 제어 내추럴)", "processGroup": "Natural", "physicalGrade": "Specialty Micro-lot", "altitude": "1,650m ~ 1,800m", "roast": "Medium", "headline": "초콜릿에 찍어 먹는 달콤한 파인애플과 구운 마카다미아의 환상적인 조화", "sourDots": 2, "sourDesc": "달콤하고 둥근 골드파인애플 산미", "nuttyDots": 5, "nuttyDesc": "진한 마카다미아와 밀크초콜릿", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (크리미하고 도톰한 질감)", "sweetDots": 5, "sweetDesc": "파인애플 초콜릿 퐁듀 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90°C · 20g / 300ml", "guide": "볼리비아 로드리게스 가문의 특허 건조 공법 '코코 내추럴'로 과일의 달콤함과 초콜릿 바디감을 극대화했습니다.", "keywords": ["볼리비아", "카라나비", "코코내추럴", "파인애플", "마카다미아", "4단계"], "dialingNote": {"ko": "카라나비 솔 데 라 마냐나 코코 내추럴: 90°C·1:15.5·2:30 추출로 정밀 건조 내추럴의 클린한 붉은 과일과 크리미한 코코아를 살리세요.", "en": "Sol de la Manana Coco Natural: 90°C, 1:15.5 in 2:30 delivers ultra-clean red fruit and creamy cocoa sweetness.", "ja": "ソルデラマニャーナ・ココナチュラル：90°C・1:15.5・2分30秒で精密乾燥由来の澄んだ赤い果実とクリーミーなココア感を。"}},
  {"id": "haw-02", "no": "NO. 87", "name": "하와이 카우 옐로우 카투라 내추럴", "eng": "Hawaii Ka'u Yellow Caturra Natural", "origin": "🇺🇸 USA (HAWAII)", "countryCode": "USA", "region": "Big Island Ka'u (빅아일랜드 카우)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (Yellow Caturra)", "varietal": "Yellow Caturra", "process": "Natural (하와이 햇볕 건조)", "processGroup": "Natural", "physicalGrade": "Hawaii Specialty Fancy", "altitude": "550m ~ 750m", "roast": "Medium", "headline": "코나를 넘어선 하와이의 신성 '카우(Ka'u)', 구운 피칸 타르트와 살구 잼", "sourDots": 2, "sourDesc": "부드러운 살구·오렌지 산미", "nuttyDots": 5, "nuttyDesc": "진한 피칸 파이와 버터스카치", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (버터스카치 티처럼 매끄러움)", "sweetDots": 5, "sweetDesc": "버터스카치 캔디와 살구잼 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90°C · 20g / 300ml", "guide": "고소함 5단계에 살구 단맛까지 겸비해, 코나보다 더 달콤하고 고소한 하와이 커피를 찾는 분께 추천합니다.", "keywords": ["하와이", "카우", "피칸", "버터스카치", "살구", "2단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "png-02", "no": "NO. 88", "name": "파푸아뉴기니 이스턴 하이랜드 바로이다 내추럴", "eng": "Papua New Guinea Eastern Highlands Baroida Natural", "origin": "🇵🇬 PNG", "countryCode": "PNG", "region": "Eastern Highlands (이스턴 하이랜드)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica & Bourbon (Arusha)", "varietal": "Arusha / Mundo Novo", "process": "Natural (햇볕 건조)", "processGroup": "Natural", "physicalGrade": "PSC Estate A Grade", "altitude": "1,700m ~ 1,850m", "roast": "Light-Medium", "headline": "열대 구아바와 패션프루트, 사탕수수 원당이 어우러진 남태평양의 과일 바구니", "sourDots": 4, "sourDesc": "상큼달콤한 구아바·열대과일 산미", "nuttyDots": 4, "nuttyDesc": "사탕수수와 구운 캐슈넛", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (열대과일 주스처럼 산뜻함)", "sweetDots": 4, "sweetDesc": "사탕수수 원당과 망고 단맛", "flavorFamily": ["Fruity", "Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "약중배전 91°C · 20g / 300ml", "guide": "파푸아뉴기니 명문 바로이다 농장의 내추럴 원두로, 이국적인 구아바 과즙과 고소한 캐슈넛 여운이 일품입니다.", "keywords": ["파푸아뉴기니", "PNG", "바로이다", "구아바", "사탕수수", "내추럴", "2단계"], "dialingNote": {"ko": "이스턴 하이랜드 바로이다 내추럴: 90°C·1:15.5·2:30 추출로 잘 익은 열대과일 잼과 허니·다크베리의 풍성한 바디를 즐기세요.", "en": "Baroida Estate Natural: Brew at 90°C, 1:15.5 in 2:30 for lush tropical fruit jam, wild honey, and dark berry body.", "ja": "バロイダ農園ナチュラル：90°C・1:15.5・2分30秒で熟した南国フルーツジャムと蜂蜜、ダークベリーの豊かなコクを。"}},
  {"id": "ynn-02", "no": "NO. 89", "name": "중국 운남 푸얼 맹련 레드와인 효모발효", "eng": "China Yunnan Pu'er Menglian Yeast Natural", "origin": "🇨🇳 CHINA", "countryCode": "CHN", "region": "Yunnan Pu'er Menglian (운남 푸얼)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Introgressed (Catimor P3)", "varietal": "Catimor", "process": "Wine Yeast Natural (와인효모 발효)", "processGroup": "Anaerobic", "physicalGrade": "Yunnan Specialty AAA", "altitude": "1,400m ~ 1,650m", "roast": "Medium", "headline": "보이차의 고향 푸얼에서 와인 효모로 발효한 블랙체리와 다크초콜릿 풍미", "sourDots": 3, "sourDesc": "농익은 블랙체리 와인 산미", "nuttyDots": 5, "nuttyDesc": "다크초콜릿과 숙성 보이차", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (와인처럼 매끄럽고 도톰함)", "sweetDots": 4, "sweetDesc": "체리 초콜릿 리큐르 단맛", "flavorFamily": ["Fermented", "Nutty/Cocoa", "Fruity"], "caffeine": "REGULAR", "brewOverride": "효모발효 89~90°C · 20g / 300ml", "guide": "운남 푸얼 지역의 고산 원두에 레드와인 효모를 접종해 체리 와인의 향긋함과 초콜릿의 고소함을 동시에 잡았습니다.", "keywords": ["운남", "중국", "푸얼", "와인효모", "특수발효", "체리초콜릿", "3단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 25초~2분 35초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 25s–2m 35s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分25秒〜2分35秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "ida-02", "no": "NO. 90", "name": "인도 마이소르 몬순 말라바 AA", "eng": "India Mysore Monsooned Malabar AA", "origin": "🇮🇳 INDIA", "countryCode": "IND", "region": "Malabar Coast (말라바 해안)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica × Liberica (Kent/S-795)", "varietal": "Kent / S-795", "process": "Monsooned (계절풍 해풍 숙성)", "processGroup": "Wet Hulled", "physicalGrade": "Monsooned AA (최상위 대립두)", "altitude": "1,100m ~ 1,300m", "roast": "Medium-Dark", "headline": "아라비아해 계절풍에 3개월간 숙성해 산미를 완전히 없앤 황금빛 스모키 넛츠", "sourDots": 1, "sourDesc": "산미 제로 (완벽한 무산미)", "nuttyDots": 3, "nuttyDesc": "삼나무, 훈연 아몬드, 허브 스파이스", "bodyDots": 5, "bodyStage": "5단계", "bodyDesc": "5단계 (벨벳 생크림처럼 묵직함)", "sweetDots": 3, "sweetDesc": "구수한 조청과 엿기름 단맛", "flavorFamily": ["Roasted", "Nutty/Cocoa", "Spiced"], "caffeine": "REGULAR", "brewOverride": "몬순원두 전용 88°C · 20g / 290ml", "guide": "대항해시대 유럽으로 가는 배 안에서 바닷바람에 숙성되던 맛을 재현한 원두로, 신맛이 0%에 가까운 극강의 무산미 커피입니다.", "keywords": ["인도", "몬순말라바", "무산미", "신맛없는", "땅콩", "스모키", "5단계"], "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 만델링 특유의 묵직한 카카오 바디감을 위해 88~89°C 저온 추출하고, 뜸들이기 후 굵은 물줄기로 2분 10초~2분 20초에 빠르게 추출을 종료합니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Wet-hulled lots shine at 88–89°C; finish by 2m 10s–2m 20s with a steady stream to capture rich cacao body without astringency.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・スマトラ特有の重厚なカカオのコクを活かすため88〜89°Cの低め湯温で、2分10秒〜2分20秒以内に手早く抽出して雑味を抑えます。"}},
  {"id": "tim-02", "no": "NO. 91", "name": "동티모르 아이나로 마우베시 내추럴", "eng": "Timor-Leste Ainaro Maubisse Natural", "origin": "🇹🇱 TIMOR", "countryCode": "TLS", "region": "Ainaro Maubisse (아이나로 마우베시)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica & Hibrido de Timor", "varietal": "Typica / Hibrido de Timor", "process": "Natural (햇볕 건조)", "processGroup": "Natural", "physicalGrade": "G1 Organic Micro-lot", "altitude": "1,500m ~ 1,800m", "roast": "Medium", "headline": "잘 익은 무화과와 구운 호두, 밀크티가 어우러진 청정 섬나라의 단맛", "sourDots": 2, "sourDesc": "부드러운 무화과 산미", "nuttyDots": 3, "nuttyDesc": "구운 호두와 홍차잎", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (얼그레이 밀크티처럼 가벼움)", "sweetDots": 4, "sweetDesc": "무화과 잼과 꿀 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "산미도 약하고 바디감도 가벼우면서 은은한 무화과·호두 단맛이 나는 편안한 유기농 데일리 원두입니다.", "keywords": ["동티모르", "마우베시", "무화과", "호두", "유기농", "가벼운", "2단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "bra-05", "no": "NO. 92", "name": "브라질 만티케이라 데 미나스 아라라 풀프드내추럴", "eng": "Brazil Mantiqueira de Minas Arara PN", "origin": "🇧🇷 BRAZIL", "countryCode": "BRA", "region": "Mantiqueira de Minas (만티케이라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Introgressed (Arara)", "varietal": "Arara", "process": "Pulped Natural (펄프드 내추럴)", "processGroup": "Honey", "physicalGrade": "COE Winner Lineage NY2", "altitude": "1,250m ~ 1,450m", "roast": "Light-Medium", "headline": "브라질 신품종 '아라라(Arara)'가 보여주는 노란 열대과일과 캐슈넛의 반전 매력", "sourDots": 3, "sourDesc": "상큼한 노란 자두·오렌지 산미", "nuttyDots": 5, "nuttyDesc": "진하고 고소한 구운 캐슈넛", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (오렌지 티처럼 산뜻하고 매끄러움)", "sweetDots": 5, "sweetDesc": "사탕수수와 꿀 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Fruity"], "caffeine": "REGULAR", "brewOverride": "약중배전 90~91°C · 20g / 300ml", "guide": "“브라질 커피는 신맛이 없다”는 편견을 깨고 브라질 COE 대회를 휩쓸고 있는 황금빛 아라라 품종입니다.", "keywords": ["브라질", "아라라", "캐슈넛", "오렌지", "만티케이라", "2단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "bra-06", "no": "NO. 93", "name": "브라질 술 데 미나스 레드 카투아이 워시드", "eng": "Brazil Sul de Minas Red Catuai Washed", "origin": "🇧🇷 BRAZIL", "countryCode": "BRA", "region": "Sul de Minas (술 데 미나스)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (Red Catuai)", "varietal": "Red Catuai", "process": "Fully Washed (완전 수세식)", "processGroup": "Washed", "physicalGrade": "NY2 SC17/18 Strictly Soft", "altitude": "1,050m ~ 1,250m", "roast": "Medium", "headline": "둥글레차와 구운 아몬드처럼 맑고 깔끔하게 넘어가는 가벼운 무산미 커피", "sourDots": 1, "sourDesc": "산미 거의 없음", "nuttyDots": 4, "nuttyDesc": "구수한 둥글레차와 아몬드", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (맑은 둥글레차·보리차 느낌)", "sweetDots": 3, "sweetDesc": "담백한 곡물 단맛", "flavorFamily": ["Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "신맛은 싫지만 인도네시아처럼 무겁고 진한 커피도 부담스러울 때, 맑은 보리차처럼 마시기 가장 좋은 원두입니다.", "keywords": ["브라질", "둥글레차", "보리차", "가벼운고소함", "안신", "2단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "eth-07", "no": "NO. 94", "name": "에티오피아 짐마 리무 게라 허니", "eng": "Ethiopia Jimma Limu Gera Honey", "origin": "🇪🇹 ETHIOPIA", "countryCode": "ETH", "region": "Jimma Limu (짐마 리무)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace", "varietal": "Heirloom (74110)", "process": "Red Honey (레드 허니)", "processGroup": "Honey", "physicalGrade": "G1 Forest Specialty", "altitude": "1,900m ~ 2,100m", "roast": "Medium", "headline": "에티오피아 원시림 꿀커피, 오렌지 마멀레이드와 아카시아 꿀차의 조화", "sourDots": 3, "sourDesc": "부드러운 오렌지 과즙 산미", "nuttyDots": 2, "nuttyDesc": "구운 아몬드와 홍차 여운", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (꿀차처럼 매끄럽고 도톰함)", "sweetDots": 4, "sweetDesc": "야생화 꿀과 오렌지청 단맛", "flavorFamily": ["Sweet", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "에티오피아 커피의 향긋함은 좋지만 너무 가볍거나 신 것은 부담스러운 분께 3단계 꿀차 바디감을 선사합니다.", "keywords": ["에티오피아", "리무", "허니", "꿀차", "오렌지", "3단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "eth-08", "no": "NO. 95", "name": "에티오피아 벤치 마지 게이샤 내추럴", "eng": "Ethiopia Bench Maji Gesha Village Natural", "origin": "🇪🇹 ETHIOPIA", "countryCode": "ETH", "region": "Bench Maji Gesha (벤치 마지 게샤)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Gori Gesha)", "varietal": "Gori Gesha", "process": "Natural (햇볕 건조)", "processGroup": "Natural", "physicalGrade": "G1 Gesha Village Reserve", "altitude": "1,950m ~ 2,150m", "roast": "Light-Medium", "headline": "게이샤 품종의 실제 야생 고향 '고리 게샤 숲'에서 수확한 딸기 리큐르와 바이올렛 꽃", "sourDots": 5, "sourDesc": "농밀한 야생 딸기·체리 산미", "nuttyDots": 1, "nuttyDesc": "제비꽃과 베르가못 향수", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (벨벳 리큐르처럼 묵직한 과즙감)", "sweetDots": 5, "sweetDesc": "딸기 콩포트와 베리 리큐르 단맛", "flavorFamily": ["Floral", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 90~91°C · 20g / 300ml", "guide": "파나마 게이샤의 친정인 에티오피아 벤치 마지 원시림에서 자라, 꽃향기뿐 아니라 4단계의 묵직한 바디감을 지닙니다.", "keywords": ["에티오피아", "벤치마지", "게샤빌리지", "게이샤", "딸기", "4단계"], "dialingNote": {"ko": "벤치 마지 게이샤 내추럴: 91°C·1:15.5·2:20 추출로 복숭아 시럽 같은 질감과 자스민 피니시를 극대화하세요.", "en": "Bench Maji Gesha Natural: Brew at 91°C, 1:15.5 in 2:20 for syrupy peach texture and a lingering jasmine finish.", "ja": "ベンチマジ・ゲイシャ・ナチュラル：91°C・1:15.5・2分20秒で桃のシロップ感とジャスミンの余韻を最大化。"}},
  {"id": "ind-04", "no": "NO. 96", "name": "인도네시아 발리 킨타마니 내추럴", "eng": "Indonesia Bali Kintamani Karana Natural", "origin": "🇮🇩 INDONESIA", "countryCode": "IDN", "region": "Bali Kintamani (발리 킨타마니 화산)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica & Introgressed (Kopyol)", "varietal": "Kopyol / S-795", "process": "Natural (발리 화산 고원 건조)", "processGroup": "Natural", "physicalGrade": "G1 Specialty Natural", "altitude": "1,300m ~ 1,600m", "roast": "Medium", "headline": "감귤 나무와 함께 심어 키운 발리 화산 커피, 오렌지 초콜릿과 럼 레이즌의 매력", "sourDots": 3, "sourDesc": "상큼달콤한 감귤·한라봉 산미", "nuttyDots": 3, "nuttyDesc": "다크 초콜릿과 브라운슈거", "bodyDots": 5, "bodyStage": "5단계", "bodyDesc": "5단계 (오렌지 가나슈처럼 농밀함)", "sweetDots": 4, "sweetDesc": "오렌지 필 초콜릿 단맛", "flavorFamily": ["Fruity", "Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90°C · 20g / 300ml", "guide": "전통 습식탈곡 만델링과 달리 발리 화산 고원에서 내추럴로 가공해 상큼한 감귤 향과 5단계 초콜릿 바디가 함께 납니다.", "keywords": ["인도네시아", "발리", "킨타마니", "오렌지초콜릿", "내추럴", "5단계"], "dialingNote": {"ko": "발리 킨타마니 화산 고원 내추럴: 90°C·1:15·2:35 추출로 감귤류 산미와 흑설탕·코코아의 깔끔한 단맛을 균형 있게 끌어내세요.", "en": "Bali Kintamani Natural: Extract at 90°C, 1:15 in 2:35 to pair volcanic citrus brightness with clean palm sugar and cocoa.", "ja": "バリ・キンタマーニ・ナチュラル：90°C・1:15・2分35秒で火山高地の柑橘感と黒糖・ココアの澄んだ甘みを両立。"}},
  {"id": "cos-04", "no": "NO. 97", "name": "코스타리카 웨스트밸리 수마바 파카마라 내추럴", "eng": "Costa Rica West Valley Sumava Pacamara Natural", "origin": "🇨🇷 COSTA RICA", "countryCode": "CRI", "region": "West Valley Lourdes de Naranjo", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Bourbon × Typica (Pacamara)", "varietal": "Pacamara", "process": "Anaerobic Natural (무산소 내추럴)", "processGroup": "Anaerobic", "physicalGrade": "SHB Competition Lot", "altitude": "1,650m ~ 1,800m", "roast": "Light-Medium", "headline": "파인애플 타르트와 블루베리 요거트, 아몬드 크루아상이 겹겹이 쌓인 디저트 커피", "sourDots": 5, "sourDesc": "풍부한 블루베리·파인애플 산미", "nuttyDots": 3, "nuttyDesc": "아몬드 페이스트리 고소함", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (요거트 스무디처럼 크리미함)", "sweetDots": 5, "sweetDesc": "파인애플 시럽과 바닐라 단맛", "flavorFamily": ["Fruity", "Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "특수발효 89~90°C · 20g / 300ml", "guide": "대립종 파카마라를 무산소 내추럴로 가공하여 크리미한 4단계 바디감 속에 열대과일과 구운 빵의 고소함이 가득합니다.", "keywords": ["코스타리카", "파카마라", "무산소", "특수발효", "파인애플", "4단계"], "dialingNote": {"ko": "웨스트밸리 수마바 파카마라 무산소: 88°C·1:16·2:20로 추출해 거대 파카마라 빈의 열대과일 복합미와 부드러운 바디를 잡으세요.", "en": "Sumava Pacamara Anaerobic: Brew at 88°C, 1:16 in 2:20 to showcase bold tropical complexity with plush body.", "ja": "スマバ・パカマラ嫌気性：88°C・1:16・2分20秒で大粒パカマラの南国フルーツの複雑味と柔らかなコクを。"}},
  {"id": "flv-09", "no": "NO. 98", "name": "제주 한라봉 유자 인퓨즈드 스페셜", "eng": "Jeju Hallabong Yuzu Botanical Infused", "origin": "✨ FLAVORED", "countryCode": "COL", "region": "Colombia & Jeju Citrus Infused", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Introgressed (Castillo)", "varietal": "Castillo", "process": "Citrus Peel Infused (천연 감귤피 숙성)", "processGroup": "Infused", "physicalGrade": "Specialty Botanical Infused", "altitude": "1,700m", "roast": "Light-Medium", "headline": "상큼달콤한 제주 한라봉 청과 유자 제스트를 띄운 듯한 비타민 시트러스 커피", "sourDots": 5, "sourDesc": "상쾌하게 톡 쏘는 유자·한라봉 산미", "nuttyDots": 3, "nuttyDesc": "달콤한 아카시아 꿀차와 비스킷 여운", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (맑고 시원한 유자차 느낌)", "sweetDots": 5, "sweetDesc": "달콤한 한라봉 유자청 단맛", "flavorFamily": ["Fruity", "Sweet", "Floral"], "caffeine": "REGULAR", "brewOverride": "인퓨즈드 89°C · 20g / 300ml", "guide": "아이스 아메리카노로 내리면 상큼한 유자·한라봉 에이드를 마시는 듯 기분 전환에 최고입니다.", "keywords": ["한라봉", "유자", "가향", "인퓨즈드", "시트러스", "아이스추천", "1단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 20초~2분 30초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 20s–2m 30s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分20秒〜2分30秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "flv-10", "no": "NO. 99", "name": "티라미수 마스카포네 럼 배럴 에이지드", "eng": "Tiramisu Mascarpone Rum Barrel Aged", "origin": "✨ FLAVORED", "countryCode": "BRA", "region": "Brazil & Jamaica Rum Oak Barrel", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Bourbon Lineage", "varietal": "Yellow Bourbon", "process": "Rum Barrel Aged & Cocoa Infused", "processGroup": "Barrel Aged", "physicalGrade": "Specialty Barrel Reserve", "altitude": "1,200m", "roast": "Medium-Dark", "headline": "다크 럼 오크통에서 숙성한 원두에 카카오와 마스카포네 치즈 풍미를 입힌 티라미수", "sourDots": 2, "sourDesc": "은은한 다크럼 발효 산미", "nuttyDots": 5, "nuttyDesc": "진한 에스프레소 카카오와 구운 헤이즐넛", "bodyDots": 5, "bodyStage": "5단계", "bodyDesc": "5단계 (티라미수 크림처럼 농밀함)", "sweetDots": 5, "sweetDesc": "마스카포네 크림과 럼 시럽 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Fermented"], "caffeine": "REGULAR", "brewOverride": "배럴에이지드 88°C · 20g / 280ml", "guide": "우유나 무가당 두유를 부어 라떼로 만들면 시럽 한 방울 없이도 고급 호텔의 티라미수 라떼가 완성됩니다.", "keywords": ["티라미수", "럼", "배럴", "오크통", "가향", "라떼추천", "5단계"], "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "bld-06", "no": "NO. 100", "name": "올데이 아카시아 실크 콜드브루 블렌드", "eng": "All-Day Acacia Silk Cold Brew Blend", "origin": "☕ HOUSE BLEND", "countryCode": "BLEND", "region": "Ethiopia · Colombia · Brazil", "categoryType": "HOUSE_BLEND", "species": "Arabica", "lineage": "Multi-Lineage Blend", "varietal": "Heirloom / Caturra / Yellow Bourbon", "process": "Washed & Pulped Natural", "processGroup": "Blend", "physicalGrade": "Master Signature No.100", "altitude": "Various", "roast": "Light-Medium", "headline": "아카시아 꽃꿀의 화사함과 구운 아몬드의 고소함이 비단처럼 이어지는 100번째 마스터 블렌드", "sourDots": 2, "sourDesc": "청사과와 복숭아의 기분 좋은 산미", "nuttyDots": 3, "nuttyDesc": "구운 아몬드와 밀크초콜릿", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (실크처럼 매끄러운 밸런스)", "sweetDots": 5, "sweetDesc": "아카시아 꿀과 브라운슈거 단맛", "flavorFamily": ["Floral", "Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "핸드드립 90~91°C · 콜드브루 최적", "guide": "아카이브 100종 완성을 기념하는 시그니처 블렌드로, 따뜻한 핸드드립과 시원한 콜드브루 모두에서 완벽한 단맛을 냅니다.", "keywords": ["블렌드", "하우스", "콜드브루", "아카시아꿀", "아몬드", "시그니처", "3단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "bur-03", "no": "NO. 101", "name": "부룬디 응고지 부신데 버본 워시드", "eng": "Burundi Ngozi Businde Bourbon Washed", "origin": "🇧🇮 BURUNDI", "countryCode": "BDI", "region": "Ngozi Businde (응고지 부신데)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "varietal": "Red Bourbon", "process": "Fully Washed (이중 발효 수세)", "processGroup": "Washed", "physicalGrade": "Grade A1 Specialty", "altitude": "1,850m ~ 2,050m", "roast": "Light", "headline": "자몽 티와 히비스커스 꽃차의 맑고 우아한 산미가 돋보이는 부룬디 고산 워시드", "sourDots": 5, "sourDesc": "선명한 자몽·히비스커스 산미", "nuttyDots": 1, "nuttyDesc": "홍차 같은 깔끔한 여운", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (자몽 허브티 느낌)", "sweetDots": 4, "sweetDesc": "꽃꿀과 복숭아 단맛", "flavorFamily": ["Floral", "Fruity"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "guide": "부룬디 응고지 고산지대의 맑은 물로 씻어내어 차처럼 투명하고 화사한 과일 산미를 즐길 수 있습니다.", "keywords": ["부룬디", "응고지", "부신데", "버본", "자몽", "히비스커스", "워시드", "2단계"], "dialingNote": {"ko": "응고지 부신데 이중 발효 워시드: 93°C·1:16.5·2:30 V60로 오렌지 블라썸과 화이트티 같은 투명한 클린컵을 즐기세요.", "en": "Ngozi Businde Double Washed: V60 at 93°C, 1:16.5 in 2:30 unlocks orange blossom and crystalline white-tea clarity.", "ja": "ンゴジ・ブシンデ二重発酵ウォッシュド：93°C・1:16.5・2分30秒のV60でオレンジブロッサムと白茶の透明感を。"}},
  {"id": "tan-03", "no": "NO. 102", "name": "탄자니아 킬리만자로 마람바 피베리", "eng": "Tanzania Kilimanjaro Maramba Peaberry", "origin": "🇹🇿 TANZANIA", "countryCode": "TZA", "region": "Kilimanjaro Moshi (킬리만자로 모시)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon & Kent Lineage", "varietal": "Bourbon / Kent Peaberry", "process": "Washed (화산 암반수 세척)", "processGroup": "Washed", "physicalGrade": "PB TOP (피베리 특등급)", "altitude": "1,600m ~ 1,900m", "roast": "Light-Medium", "headline": "동글동글한 피베리 원두에 응축된 블러드오렌지 과즙과 다크 캐러멜의 조화", "sourDots": 4, "sourDesc": "생기 넘치는 오렌지·자두 산미", "nuttyDots": 3, "nuttyDesc": "구운 아몬드와 캐러멜", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (매끄러운 과일티 질감)", "sweetDots": 4, "sweetDesc": "오렌지 마멀레이드 단맛", "flavorFamily": ["Fruity", "Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "약중배전 91°C · 20g / 300ml", "guide": "열매 안에 씨앗이 하나만 자란 희귀 피베리로, 일반 원두보다 향미가 응축되어 상큼하면서도 달콤합니다.", "keywords": ["탄자니아", "킬리만자로", "피베리", "오렌지", "캐러멜", "3단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "uga-03", "no": "NO. 103", "name": "우간다 부기수 마운트 엘곤 시피 워시드", "eng": "Uganda Bugisu Mt. Elgon Sipi Washed", "origin": "🇺🇬 UGANDA", "countryCode": "UGA", "region": "Mt. Elgon Sipi Falls (엘곤산 시피)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon & Typica (SL14/SL28)", "varietal": "SL14 / SL28", "process": "Washed (폭포수 세척)", "processGroup": "Washed", "physicalGrade": "Bugisu AA", "altitude": "1,800m ~ 2,100m", "roast": "Medium", "headline": "검붉은 체리와 구운 호두, 흑설탕의 부드러운 단맛이 편안하게 이어지는 엘곤산 커피", "sourDots": 3, "sourDesc": "둥근 다크체리 산미", "nuttyDots": 4, "nuttyDesc": "구운 호두와 카카오", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (도톰하고 안정적인 바디)", "sweetDots": 4, "sweetDesc": "흑설탕과 건자두 단맛", "flavorFamily": ["Nutty/Cocoa", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90°C · 20g / 300ml", "guide": "케냐와 국경을 맞댄 엘곤산의 화산토에서 자라, 과일 산미와 진한 견과류 고소함이 균형 있게 어우러집니다.", "keywords": ["우간다", "엘곤산", "부기수", "체리", "호두", "4단계"], "dialingNote": {"ko": "마운트 엘곤 시피 워시드: 91°C·1:15·2:40 추출로 붉은 사과 산미와 다크 코코아 바디의 균형을 안정적으로 잡으세요.", "en": "Mt. Elgon Sipi Washed: Brew at 91°C, 1:15 in 2:40 for balanced red apple brightness and rich dark cocoa body.", "ja": "マウントエルゴン・シピ・ウォッシュド：91°C・1:15・2分40秒で赤リンゴの明るさとダークココアのコクを両立。"}},
  {"id": "hon-03", "no": "NO. 104", "name": "온두라스 코판 엘 핀사르 허니 파라이네마", "eng": "Honduras Copan El Pinar Honey Parainema", "origin": "🇭🇳 HONDURAS", "countryCode": "HND", "region": "Copan (코판 마야 유적지)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Introgressed (Parainema)", "varietal": "Parainema", "process": "Yellow Honey (옐로우 허니)", "processGroup": "Honey", "physicalGrade": "SHG COE Micro-lot", "altitude": "1,500m ~ 1,700m", "roast": "Light-Medium", "headline": "허브의 청량함과 청포도, 아카시아 꿀의 산뜻함이 돋보이는 온두라스 토착 품종", "sourDots": 4, "sourDesc": "상쾌한 청포도·레몬그라스 산미", "nuttyDots": 2, "nuttyDesc": "캐모마일과 은은한 아몬드", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (허브티처럼 깔끔함)", "sweetDots": 4, "sweetDesc": "청포도 에이드와 꿀 단맛", "flavorFamily": ["Floral", "Fruity", "Sweet"], "caffeine": "REGULAR", "brewOverride": "약중배전 91°C · 20g / 300ml", "guide": "온두라스가 개발해 세계 대회를 휩쓴 '파라이네마' 품종으로, 민트처럼 상쾌한 허브 향과 청포도 산미가 매력적입니다.", "keywords": ["온두라스", "코판", "파라이네마", "청포도", "허니", "2단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "nic-03", "no": "NO. 105", "name": "니카라과 마타갈파 엘 소코로 마라고지페", "eng": "Nicaragua Matagalpa Maragogipe Washed", "origin": "🇳🇮 NICARAGUA", "countryCode": "NIC", "region": "Matagalpa (마타갈파)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage (Maragogipe)", "varietal": "Maragogipe (Elephant Bean)", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "SHG Elephant Screen 20+", "altitude": "1,350m ~ 1,550m", "roast": "Medium", "headline": "코끼리콩이라 불리는 거대 원두에서 나오는 부드러운 헤이즐넛과 구운 사과의 여운", "sourDots": 2, "sourDesc": "은은한 구운 사과 산미", "nuttyDots": 4, "nuttyDesc": "부드러운 헤이즐넛과 비스킷", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (부드럽고 순한 목넘김)", "sweetDots": 4, "sweetDesc": "꿀에 구운 사과 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "일반 원두보다 2배 가까이 큰 '마라고지페(코끼리콩)' 품종으로, 쓴맛 없이 둥글고 편안한 단맛이 납니다.", "keywords": ["니카라과", "마타갈파", "마라고지페", "코끼리콩", "헤이즐넛", "3단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "jam-03", "no": "NO. 106", "name": "자메이카 블루마운틴 마비스 뱅크 내추럴", "eng": "Jamaica Blue Mountain Mavis Bank Natural", "origin": "🇯🇲 JAMAICA", "countryCode": "JAM", "region": "Mavis Bank Blue Mountains (마비스 뱅크)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage (Blue Mountain)", "varietal": "Blue Mountain Typica", "process": "Natural (소량 스페셜 내추럴)", "processGroup": "Natural", "physicalGrade": "JBM Reserve Micro-lot", "altitude": "1,400m ~ 1,650m", "roast": "Medium", "headline": "명품 블루마운틴의 완벽한 밸런스에 잘 익은 살구와 밀크초콜릿을 더한 한정판", "sourDots": 2, "sourDesc": "우아한 살구·오렌지 산미", "nuttyDots": 4, "nuttyDesc": "고급스러운 마카다미아와 초콜릿", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (실크처럼 매끈함)", "sweetDots": 5, "sweetDesc": "살구 잼과 밀크초콜릿 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "대부분 워시드로 생산되는 블루마운틴 중 극소량만 만드는 내추럴 랏으로, 과일의 화사한 단맛이 한결 더 풍성합니다.", "keywords": ["자메이카", "블루마운틴", "마비스뱅크", "내추럴", "살구", "명품", "3단계"], "dialingNote": {"ko": "마비스 뱅크 블루마운틴 내추럴: 90°C·1:15.5·2:30 추출로 희귀 자메이카 내추럴의 달콤한 베리와 코코아 질감을 음미하세요.", "en": "Mavis Bank Natural: Brew at 90°C, 1:15.5 in 2:30 to savor rare Jamaican natural berry sweetness and cocoa texture.", "ja": "メイビスバンク・ナチュラル：90°C・1:15.5・2分30秒で希少なジャマイカ産ナチュラルの甘いベリーとココア感を。"}},
  {"id": "per-03", "no": "NO. 107", "name": "페루 쿠스코 키야밤바 버본 허니", "eng": "Peru Cusco Quillabamba Bourbon Honey", "origin": "🇵🇪 PERU", "countryCode": "PER", "region": "Cusco Quillabamba (쿠스코 키야밤바)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "varietal": "Red Bourbon", "process": "Yellow Honey (옐로우 허니)", "processGroup": "Honey", "physicalGrade": "Grade 1 Organic (마추픽추 산지)", "altitude": "1,700m ~ 1,950m", "roast": "Medium", "headline": "마추픽추 인근 안데스 계곡에서 자란 볶은 아몬드와 황도 복숭아의 조화", "sourDots": 3, "sourDesc": "부드러운 황도·만다린 산미", "nuttyDots": 4, "nuttyDesc": "구운 아몬드와 토피넛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (부드러운 밀크티 질감)", "sweetDots": 4, "sweetDesc": "황도 통조림과 꿀 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "신맛과 고소함의 밸런스가 뛰어나 핸드드립 입문자부터 애호가까지 모두가 편안하게 즐길 수 있는 유기농 커피입니다.", "keywords": ["페루", "쿠스코", "마추픽추", "허니", "황도", "아몬드", "3단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "ecu-03", "no": "NO. 108", "name": "에콰도르 빌카밤바 레드버본 내추럴", "eng": "Ecuador Vilcabamba Red Bourbon Natural", "origin": "🇪🇨 ECUADOR", "countryCode": "ECU", "region": "Loja Vilcabamba (빌카밤바 장수마을)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage", "varietal": "Red Bourbon", "process": "Natural (햇볕 건조)", "processGroup": "Natural", "physicalGrade": "SHB Specialty Lot", "altitude": "1,750m ~ 1,950m", "roast": "Light-Medium", "headline": "장수마을 빌카밤바의 햇살을 머금은 레드와인과 블루베리 초콜릿의 달콤함", "sourDots": 4, "sourDesc": "진한 블루베리·자두 산미", "nuttyDots": 3, "nuttyDesc": "밀크초콜릿과 구운 헤이즐넛", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (과즙이 풍부하고 매끈함)", "sweetDots": 5, "sweetDesc": "블루베리 잼과 카카오 단맛", "flavorFamily": ["Fruity", "Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "약중배전 90~91°C · 20g / 300ml", "guide": "에콰도르 남부 청정 장수마을에서 재배해 붉은 베리 과즙미와 부드러운 초콜릿 단맛이 조화롭게 어우러집니다.", "keywords": ["에콰도르", "빌카밤바", "레드버본", "내추럴", "블루베리", "3단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 과일잼 같은 농밀한 과실 단맛을 살리기 위해 뜸들이기 후 2회차 주입량을 60% 집중하고 2분 20초~2분 30초 내에 깔끔하게 마무리합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · Concentrate 60% of water volume in the second pour after bloom to extract luscious berry sweetness without dry astringency.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・果実ジャムのような甘みを引き出すため、蒸らし後の2投目で湯量の60%を注ぎ、2分20秒〜2分30秒前後でキレよく仕上げます。"}},
  {"id": "bol-03", "no": "NO. 109", "name": "볼리비아 사마이파타 플로리폰디오 게이샤", "eng": "Bolivia Samaipata Floripondio Geisha", "origin": "🇧🇴 BOLIVIA", "countryCode": "BOL", "region": "Santa Cruz Samaipata (사마이파타)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "varietal": "Geisha", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "SHB Reserve Micro-lot", "altitude": "1,700m ~ 1,850m", "roast": "Light", "headline": "열대 자스민 꽃과 리치, 화이트 티처럼 맑고 긴 여운을 남기는 볼리비아 게이샤", "sourDots": 4, "sourDesc": "화사한 리치·레몬 산미", "nuttyDots": 1, "nuttyDesc": "화이트 티 같은 청량함", "bodyDots": 1, "bodyStage": "1단계", "bodyDesc": "1단계 (꽃차처럼 가볍고 투명함)", "sweetDots": 4, "sweetDesc": "아카시아 꿀과 리치 단맛", "flavorFamily": ["Floral", "Fruity"], "caffeine": "REGULAR", "brewOverride": "약배전 92~93°C · 20g / 300ml", "guide": "카라나비 외에 떠오르는 볼리비아 명산지 사마이파타의 게이샤로, 맑은 차 같은 섬세함이 인상적입니다.", "keywords": ["볼리비아", "사마이파타", "게이샤", "자스민", "화이트티", "1단계"], "dialingNote": {"ko": "사마이파타 플로리폰디오 게이샤 워시드: 93°C·1:16.5·2:20 추출로 만다린·오렌지꽃·백차의 섬세한 고산 게이샤 향을 열어주세요.", "en": "Floripondio Gesha Washed: Pour-over at 93°C, 1:16.5 in 2:20 opens delicate mandarin, orange blossom, and white tea.", "ja": "フロリポンディオ・ゲイシャ・ウォッシュド：93°C・1:16.5・2分20秒でマンダリンとオレンジ花、白茶の繊細な香りを。"}},
  {"id": "haw-03", "no": "NO. 110", "name": "하와이 마우이 카아나팔리 레드카투아이", "eng": "Hawaii Maui Kaanapali Red Catuai", "origin": "🇺🇸 USA (HAWAII)", "countryCode": "USA", "region": "Maui Kaanapali (마우이 섬)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon Lineage (Red Catuai)", "varietal": "Red Catuai", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "Maui Estate Prime", "altitude": "350m ~ 600m", "roast": "Medium", "headline": "마우이 섬의 따뜻한 바닷바람이 키운 구운 마카다미아와 사탕수수의 깔끔한 단맛", "sourDots": 2, "sourDesc": "부드러운 파파야 산미", "nuttyDots": 5, "nuttyDesc": "진한 마카다미아와 토피", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (버터처럼 부드러운 질감)", "sweetDots": 4, "sweetDesc": "마우이 사탕수수 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "하와이 마우이 섬의 화산 토양에서 자라 코나와는 또 다른 진한 견과류 고소함과 둥근 단맛을 느낄 수 있습니다.", "keywords": ["하와이", "마우이", "마카다미아", "카투아이", "고소한", "3단계"], "dialingNote": {"ko": "마우이 카아나팔리 레드카투아이: 90°C·1:15·2:30 추출로 마카다미아 너트와 파인애플·브라운슈가의 부드러운 하와이안 밸런스를 즐기세요.", "en": "Maui Kaanapali Red Catuai: Brew at 90°C, 1:15 in 2:30 for smooth macadamia nut, gentle pineapple, and brown sugar.", "ja": "マウイ・カアナパリ・レッドカトゥアイ：90°C・1:15・2分30秒でマカダミアナッツとパイナップルの穏やかな調和を。"}},
  {"id": "png-03", "no": "NO. 111", "name": "파푸아뉴기니 와기밸리 코르구아 블루마운틴", "eng": "Papua New Guinea Wahgi Valley Korgua", "origin": "🇵🇬 PNG", "countryCode": "PNG", "region": "Western Highlands Wahgi (와기 밸리)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage (Blue Mountain)", "varietal": "Blue Mountain Typica", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "Estate AX Grade", "altitude": "1,550m ~ 1,750m", "roast": "Medium-Dark", "headline": "신맛은 낮추고 구운 피칸과 다크 초콜릿의 묵직한 풍미를 살린 남태평양 블루마운틴", "sourDots": 1, "sourDesc": "산미 거의 없음", "nuttyDots": 5, "nuttyDesc": "구운 피칸과 다크초콜릿", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (진하고 묵직한 목넘김)", "sweetDots": 3, "sweetDesc": "브라운슈거와 카카오 단맛", "flavorFamily": ["Nutty/Cocoa", "Roasted"], "caffeine": "REGULAR", "brewOverride": "중강배전 89°C · 20g / 300ml", "guide": "파푸아뉴기니에 이식된 자메이카 블루마운틴 품종을 중강배전해, 신맛 없이 고소하고 깊은 풍미를 냅니다.", "keywords": ["파푸아뉴기니", "PNG", "코르구아", "블루마운틴", "피칸", "신맛없는", "4단계"], "dialingNote": {"ko": "와기밸리 코르구아 블루마운틴: 89°C·1:14.5·2:45 추출로 중강배전 특유의 다크초콜릿·구운 견과·시더우드의 묵직한 여운을 뽑으세요.", "en": "Korgua Blue Mountain: Brew at 89°C, 1:14.5 in 2:45 for deep dark chocolate, toasted nuts, and lingering cedarwood.", "ja": "コルグア・ブルーマウンテン：89°C・1:14.5・2分45秒でダークチョコ、ローストナッツ、シダーウッドの重厚な余韻を。"}},
  {"id": "vnm-03", "no": "NO. 112", "name": "베트남 람동 까우닷 티피카 워시드", "eng": "Vietnam Lam Dong Cau Dat Typica Washed", "origin": "🇻🇳 VIETNAM", "countryCode": "VNM", "region": "Cau Dat Highland (람동 까우닷)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage", "varietal": "Typica / Bourbon", "process": "Washed (물 세척)", "processGroup": "Washed", "physicalGrade": "Cau Dat G1 Specialty", "altitude": "1,500m ~ 1,650m", "roast": "Medium", "headline": "베트남 최고산지 까우닷의 맑은 티피카, 구운 캐슈넛과 은은한 홍차의 산뜻함", "sourDots": 2, "sourDesc": "부드러운 감귤·사과 산미", "nuttyDots": 4, "nuttyDesc": "구운 캐슈넛과 홍차 여운", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (홍차처럼 깔끔함)", "sweetDots": 3, "sweetDesc": "은은한 사탕수수 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "베트남 스페셜티 아라비카의 성지 까우닷에서 생산된 워시드 원두로, 깔끔하고 담백해 매일 마시기 좋습니다.", "keywords": ["베트남", "까우닷", "티피카", "캐슈넛", "깔끔한", "2단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "ynn-03", "no": "NO. 113", "name": "중국 운남 린창 맹쿠 허니 프로세스", "eng": "China Yunnan Lincang Mengku Honey", "origin": "🇨🇳 CHINA", "countryCode": "CHN", "region": "Yunnan Lincang (운남 린창)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Bourbon & Introgressed", "varietal": "Catimor / Bourbon", "process": "Red Honey (레드 허니)", "processGroup": "Honey", "physicalGrade": "Yunnan Specialty AA", "altitude": "1,450m ~ 1,700m", "roast": "Medium", "headline": "고산 차밭 옆에서 자라 자두 잼과 대추꿀, 우롱차의 감칠맛이 어우러진 원두", "sourDots": 3, "sourDesc": "둥근 자두·살구 산미", "nuttyDots": 4, "nuttyDesc": "우롱차와 구운 땅콩 여운", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (우롱 밀크티 느낌)", "sweetDots": 4, "sweetDesc": "대추꿀과 자두잼 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 90°C · 20g / 300ml", "guide": "고급 보이차·우롱차 산지인 운남 린창에서 허니 가공해 차처럼 부드러운 단맛과 감칠맛이 살아있습니다.", "keywords": ["중국", "운남", "린창", "허니", "자두", "우롱차", "3단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "ida-03", "no": "NO. 114", "name": "인도 칙마갈루르 바바부단기리 켄트", "eng": "India Chikmagalur Bababudangiri Kent", "origin": "🇮🇳 INDIA", "countryCode": "IND", "region": "Chikmagalur Bababudangiri (바바부단기리)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica Lineage (Kent)", "varietal": "Kent", "process": "Washed (그늘 재배 수세식)", "processGroup": "Washed", "physicalGrade": "Plantation AA Shade-Grown", "altitude": "1,200m ~ 1,500m", "roast": "Medium-Dark", "headline": "인도 커피 역사가 시작된 성지에서 자란 넛메그 향신료와 다크 카카오의 깊은 조화", "sourDots": 1, "sourDesc": "산미 거의 없음", "nuttyDots": 5, "nuttyDesc": "구운 호두와 진한 카카오", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (진하고 묵직한 아메리카노)", "sweetDots": 3, "sweetDesc": "시나몬 슈거와 다크초콜릿 단맛", "flavorFamily": ["Spiced", "Nutty/Cocoa", "Roasted"], "caffeine": "REGULAR", "brewOverride": "중강배전 89°C · 20g / 300ml", "guide": "후추·계피 농장과 함께 그늘에서 자라 은은한 스파이스 향과 신맛 없는 깊은 고소함이 일품입니다.", "keywords": ["인도", "칙마갈루르", "켄트", "다크초콜릿", "스파이시", "4단계"], "dialingNote": {"ko": "중조분쇄 (약간 굵은 분쇄) · 88~89°C · 1:14.5 (20g / 290ml) · 고온 추출 시 탄맛이 도드라질 수 있으므로 88~89°C로 수온을 낮추고, 2회 분할 주입 후 2분 10초~2분 20초에 후반 물줄기를 끊어 다크 초콜릿 단맛만 남깁니다.", "en": "Medium-coarse grind · 88–89°C · 1:14.5 (20g / 290ml) · Use 88–89°C to tame bitterness; finish extraction early at 2m 10s–2m 20s to leave only velvety dark chocolate sweetness.", "ja": "中粗挽き・88〜89°C・1:14.5 (20g / 290ml)・苦味や焦げ付きを防ぐため88〜89°Cの湯温に抑え、2回注湯ののち2分10秒〜2分20秒で早めに切り上げて濃厚なダークチョコの甘みだけを残します。"}},
  {"id": "tim-03", "no": "NO. 115", "name": "동티모르 리퀴사 마우바라 허니", "eng": "Timor-Leste Liquica Maubara Honey", "origin": "🇹🇱 TIMOR", "countryCode": "TLS", "region": "Liquica Maubara (리퀴사 마우바라)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Typica & Hibrido de Timor", "varietal": "Typica / Hibrido de Timor", "process": "Yellow Honey (옐로우 허니)", "processGroup": "Honey", "physicalGrade": "G1 Organic Specialty", "altitude": "1,350m ~ 1,600m", "roast": "Medium", "headline": "열대 바나나칩과 구운 아몬드, 사탕수수의 순수한 단맛이 돋보이는 청정 원두", "sourDots": 2, "sourDesc": "부드러운 열대과일 산미", "nuttyDots": 4, "nuttyDesc": "구운 아몬드와 바나나칩", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (편안하고 둥근 목넘김)", "sweetDots": 4, "sweetDesc": "사탕수수와 꿀 단맛", "flavorFamily": ["Sweet", "Nutty/Cocoa"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "동티모르 청정 산림에서 농약 없이 자라 거친 맛 없이 순하고 구수한 단맛을 즐기기에 좋습니다.", "keywords": ["동티모르", "리퀴사", "허니", "아몬드", "유기농", "3단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "yem-03", "no": "NO. 116", "name": "예멘 다마르 알 하이미 내추럴", "eng": "Yemen Dhamar Al-Haymi Natural", "origin": "🇾🇪 YEMEN", "countryCode": "YEM", "region": "Dhamar Al-Haymi (다마르 알 하이미)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian / Yemenia Landrace", "varietal": "Jaadi / Tuffahi", "process": "Terrace Dry Natural (계단식 밭 건조)", "processGroup": "Natural", "physicalGrade": "Heritage Grade A", "altitude": "2,100m ~ 2,400m", "roast": "Medium", "headline": "건포도와 말린 대추야자, 짙은 카다멈 향신료가 어우러진 고대 아라비아의 풍미", "sourDots": 3, "sourDesc": "응축된 건포도·레드와인 산미", "nuttyDots": 4, "nuttyDesc": "다크초콜릿과 카다멈", "bodyDots": 4, "bodyStage": "4단계", "bodyDesc": "4단계 (리큐르처럼 진득함)", "sweetDots": 5, "sweetDesc": "말린 대추야자와 다크초콜릿 단맛", "flavorFamily": ["Spiced", "Nutty/Cocoa", "Fruity"], "caffeine": "REGULAR", "brewOverride": "중배전 89~90°C · 20g / 290ml", "guide": "해발 2,200m 이상의 가파른 돌계단 밭에서 자라, 건과일과 초콜릿이 어우러진 독보적인 깊이를 선사합니다.", "keywords": ["예멘", "다마르", "건포도", "초콜릿", "카다멈", "4단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 과일잼 같은 농밀한 과실 단맛을 살리기 위해 뜸들이기 후 2회차 주입량을 60% 집중하고 2분 25초~2분 35초 내에 깔끔하게 마무리합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · Concentrate 60% of water volume in the second pour after bloom to extract luscious berry sweetness without dry astringency.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・果実ジャムのような甘みを引き出すため、蒸らし後の2投目で湯量の60%を注ぎ、2分25秒〜2分35秒前後でキレよく仕上げます。"}},
  {"id": "mex-03", "no": "NO. 117", "name": "멕시코 베라크루즈 코아테펙 게이샤 허니", "eng": "Mexico Veracruz Coatepec Geisha Honey", "origin": "🇲🇽 MEXICO", "countryCode": "MEX", "region": "Veracruz Coatepec (베라크루즈)", "categoryType": "SINGLE_ORIGIN", "species": "Arabica", "lineage": "Ethiopian Landrace (Geisha)", "varietal": "Geisha", "process": "Yellow Honey (옐로우 허니)", "processGroup": "Honey", "physicalGrade": "SHG Altura Micro-lot", "altitude": "1,350m ~ 1,550m", "roast": "Light-Medium", "headline": "오렌지 꽃꿀과 자스민, 구운 피칸이 부드럽게 스며드는 멕시코 구름숲 게이샤", "sourDots": 4, "sourDesc": "화사한 만다린·오렌지 산미", "nuttyDots": 3, "nuttyDesc": "구운 피칸과 캐러멜", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (오렌지 꿀차 느낌)", "sweetDots": 5, "sweetDesc": "오렌지 꽃꿀 단맛", "flavorFamily": ["Floral", "Sweet", "Fruity"], "caffeine": "REGULAR", "brewOverride": "약중배전 91°C · 20g / 300ml", "guide": "안개가 자욱한 베라크루즈 운무림에서 자란 게이샤를 허니 가공해 산미 부담 없이 향긋한 꽃꿀 맛을 즐길 수 있습니다.", "keywords": ["멕시코", "베라크루즈", "게이샤", "허니", "오렌지", "2단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 20초~2분 30초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 20s–2m 30s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分20秒〜2分30秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}},
  {"id": "rwa-04", "no": "NO. 118", "name": "르완다 냐루구루 코자코 무산소 버본", "eng": "Rwanda Nyaruguru Anaerobic Red Bourbon", "origin": "🇷🇼 RWANDA", "countryCode": "RWA", "region": "Nyaruguru Southern Province (냐루구루)", "categoryType": "FERMENTED_LOT", "species": "Arabica", "lineage": "Bourbon Lineage", "varietal": "Red Bourbon", "process": "Anaerobic Honey (무산소 허니 발효)", "processGroup": "Anaerobic", "physicalGrade": "A1 Competition Micro-lot", "altitude": "1,900m ~ 2,100m", "roast": "Light-Medium", "headline": "붉은 포도와 라즈베리 요거트, 시나몬 캔디가 입안에서 터지는 르완다 특수발효", "sourDots": 4, "sourDesc": "생기 넘치는 붉은포도·체리 산미", "nuttyDots": 2, "nuttyDesc": "시나몬 쿠키와 은은한 카카오", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (베리 요거트처럼 부드러움)", "sweetDots": 5, "sweetDesc": "라즈베리 잼과 포도 시럽 단맛", "flavorFamily": ["Fruity", "Fermented", "Sweet"], "caffeine": "REGULAR", "brewOverride": "특수발효 89~90°C · 20g / 300ml", "guide": "르완다 남부 고산지대의 레드버본을 무산소 발효해 붉은 베리 풍미와 꿀 같은 달콤함을 극대화한 로트입니다.", "keywords": ["르완다", "무산소", "특수발효", "라즈베리", "포도", "3단계"], "dialingNote": {"ko": "중분쇄 (표준 핸드드립) · 91~92°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 20초~2분 30초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium grind · 91–92°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 20s–2m 30s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中挽き・91〜92°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分20秒〜2分30秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "flv-11", "no": "NO. 119", "name": "피치 우롱 보태니컬 인퓨즈드", "eng": "Peach Oolong Botanical Infused", "origin": "✨ FLAVORED", "countryCode": "COL", "region": "Colombia Huila & Peach Oolong", "categoryType": "FLAVORED", "species": "Arabica", "lineage": "Introgressed (Castillo)", "varietal": "Castillo", "process": "Botanical Infused (복숭아·우롱차 숙성)", "processGroup": "Infused", "physicalGrade": "Specialty Botanical Infused", "altitude": "1,750m", "roast": "Light", "headline": "잘 익은 백도 복숭아 과즙과 향긋한 대만 우롱차가 스며든 여름 한정판 아로마", "sourDots": 3, "sourDesc": "상큼달콤한 백도 복숭아 산미", "nuttyDots": 2, "nuttyDesc": "구수한 우롱차와 아몬드 여운", "bodyDots": 2, "bodyStage": "2단계", "bodyDesc": "2단계 (아이스 피치우롱티 느낌)", "sweetDots": 5, "sweetDesc": "백도 복숭아청과 꿀 단맛", "flavorFamily": ["Fruity", "Floral", "Sweet"], "caffeine": "REGULAR", "brewOverride": "인퓨즈드 89~90°C · 아이스 드립 추천", "guide": "얼음을 채운 잔에 바로 내려 마시면 카페에서 마시는 고급 복숭아 우롱티처럼 산뜻하고 달콤합니다.", "keywords": ["복숭아", "백도", "우롱차", "인퓨즈드", "가향", "아이스추천", "2단계"], "dialingNote": {"ko": "중세분쇄 (가는 드립용) · 92~93°C · 1:15 (20g / 300ml) · 발효향이 과해지지 않도록 유속을 안정적으로 유지하며 2분 15초~2분 25초 내에 추출을 마쳐 화사한 과즙미와 트로피컬 향미를 살립니다.", "en": "Medium-fine grind · 92–93°C · 1:15 (20g / 300ml) · Maintain steady flow rate and finish within 2m 15s–2m 25s to focus on clean tropical fruit and avoid heavy fermented bitterness.", "ja": "中細挽き・92〜93°C・1:15 (20g / 300ml)・発酵香が重くならないよう湯量を安定させ、2分15秒〜2分25秒以内に注ぎきって華やかなトロピカル果汁感を際立たせます。"}},
  {"id": "bld-07", "no": "NO. 120", "name": "아카이브 120 마스터 밸런스 블렌드", "eng": "Archive 120 Master Balance Blend", "origin": "☕ HOUSE BLEND", "countryCode": "BLEND", "region": "Ethiopia · Colombia · Guatemala · Brazil", "categoryType": "HOUSE_BLEND", "species": "Arabica", "lineage": "Multi-Lineage Blend", "varietal": "Geisha / Caturra / Bourbon", "process": "Washed & Natural Master Blend", "processGroup": "Blend", "physicalGrade": "Master Signature No.120", "altitude": "Various", "roast": "Medium", "headline": "은은한 오렌지 꽃향기와 밀크초콜릿, 구운 헤이즐넛이 완벽히 맞물린 120번째 시그니처", "sourDots": 2, "sourDesc": "기분 좋은 오렌지·청사과 산미", "nuttyDots": 4, "nuttyDesc": "구운 헤이즐넛과 밀크초콜릿", "bodyDots": 3, "bodyStage": "3단계", "bodyDesc": "3단계 (매일 마셔도 질리지 않는 황금 비율)", "sweetDots": 5, "sweetDesc": "캐러멜과 오렌지 블로섬 꿀 단맛", "flavorFamily": ["Nutty/Cocoa", "Sweet", "Floral"], "caffeine": "REGULAR", "brewOverride": "중배전 90~91°C · 20g / 300ml", "guide": "120종 스페셜티 아카이브의 대미를 장식하는 데일리 마스터 블렌드로, 핸드드립 입문자에게 가장 먼저 권하는 황금 밸런스입니다.", "keywords": ["블렌드", "하우스", "밸런스", "헤이즐넛", "밀크초콜릿", "입문자추천", "3단계"], "dialingNote": {"ko": "중분쇄 (꽃소금 굵기) · 90~91°C · 1:15 (20g / 300ml) · 35초 뜸들이기 후 3회 안정적인 분할 주입으로 2분 25초~2분 35초에 추출하여 산미·단맛·너티함의 황금 밸런스를 구현합니다.", "en": "Medium grind · 90–91°C · 1:15 (20g / 300ml) · 35s bloom with 3 balanced pulse pours finishing at 2m 25s–2m 35s for an optimal harmony of lively acidity, sweetness, and nutty cocoa.", "ja": "中挽き・90〜91°C・1:15 (20g / 300ml)・35秒蒸らしのあと3回に分けて注湯し、2分25秒〜2分35秒で抽出を終えることで酸味・甘み・香ばしさの黄金バランスを引き出します。"}}
];


/* ============================================================================
   [SECTION 2: BOOTSTRAP & NORMALIZATION LOGIC - Phase 4 CMS Separation Target]
   ============================================================================ */
// [Schema v3.3] Taxonomy, WCR Varietal Normalization, Clean i18n (ko/en/ja)
//               & Verified 120-Lot Traceability Bootstrapper (Phase 1 / Alpha2)
// ============================================================================
const COFFEE_TAXONOMY = {
  roast: {
    "Light": {
      ko: "약배전 (Light)",
      en: "Light Roast",
      ja: "浅煎り (Light)",
      intensity: 1,
      long: { ko: "약배전 (Light / 시나몬)", en: "Light Roast (Cinnamon)", ja: "浅煎り (ライト / シナモン)" },
      brew: { tempMin: 92, tempMax: 93, doseG: 20, waterMl: 300 }
    },
    "Light-Medium": {
      ko: "약중배전",
      en: "Light-Medium",
      ja: "中浅煎り",
      intensity: 2,
      long: { ko: "약중배전 (Light-Medium / 미디엄)", en: "Light-Medium Roast", ja: "中浅煎り (ハイロースト)" },
      brew: { tempMin: 91, tempMax: 92, doseG: 20, waterMl: 300 }
    },
    "Medium": {
      ko: "중배전 (Medium)",
      en: "Medium Roast",
      ja: "中煎り (Medium)",
      intensity: 3,
      long: { ko: "중배전 (Medium / 하이·시티)", en: "Medium Roast (City)", ja: "中煎り (シティロースト)" },
      brew: { tempMin: 90, tempMax: 91, doseG: 20, waterMl: 300 }
    },
    "Medium-Dark": {
      ko: "중강배전",
      en: "Medium-Dark",
      ja: "中深煎り",
      intensity: 4,
      long: { ko: "중강배전 (Medium-Dark / 풀시티)", en: "Medium-Dark (Full City)", ja: "中深煎り (フルシティ)" },
      brew: { tempMin: 89, tempMax: 90, doseG: 20, waterMl: 300 }
    },
    "Dark": {
      ko: "강배전 (Dark)",
      en: "Dark Roast",
      ja: "深煎り (Dark)",
      intensity: 5,
      long: { ko: "강배전 (Dark / 프렌치·이탈리안)", en: "Dark Roast (French)", ja: "深煎り (フレンチロースト)" },
      brew: { tempMin: 88, tempMax: 89, doseG: 20, waterMl: 300 }
    }
  },
  bodyAnalogy: {
    1: {
      short: { ko: "허브티", en: "Herbal Tea", ja: "ハーブティー" },
      full:  { ko: "맑은 허브티처럼 가벼운 질감", en: "Crisp & light like herbal tea", ja: "澄んだハーブティーのような軽やかさ" }
    },
    2: {
      short: { ko: "주스", en: "Juice", ja: "ジュース" },
      full:  { ko: "산뜻한 과일주스 같은 질감", en: "Juicy & bright like fresh apple juice", ja: "フレッシュジュースのような爽やかさ" }
    },
    3: {
      short: { ko: "보리차", en: "Smooth Tea", ja: "麦茶・マイルド" },
      full:  { ko: "매끄럽고 균형 잡힌 보리차·저지방 우유 질감", en: "Smooth & balanced medium body", ja: "なめらかでバランスの良い質感" }
    },
    4: {
      short: { ko: "우유·초코", en: "Whole Milk", ja: "ミルク・ココア" },
      full:  { ko: "도톰하고 묵직한 우유·핫초코 질감", en: "Round & rich like whole milk", ja: "ミルクココアのような厚みのあるコク" }
    },
    5: {
      short: { ko: "생크림", en: "Heavy Cream", ja: "生クリーム" },
      full:  { ko: "진득하고 농밀한 생크림·시럽 질감", en: "Syrupy & velvety like heavy cream", ja: "生クリームのように濃厚で重厚な口当たり" }
    }
  },
  flavorFamily: {
    "Floral":      { ko: "플로럴·꽃향",   en: "floral blossom",       ja: "フローラル・花香" },
    "Fruity":      { ko: "프루티·과일",   en: "vibrant fruit",        ja: "フルーティー・果実" },
    "Sweet":       { ko: "스위트·단맛",   en: "natural sweetness",    ja: "豊かな甘み" },
    "Nutty/Cocoa": { ko: "견과·카카오",   en: "roasted nuts & cocoa", ja: "ナッツ・カカオ" },
    "Roasted":     { ko: "로스티드·다크", en: "deep roasted cacao",   ja: "深いロースト・ビター" },
    "Spiced":      { ko: "스파이스·향신", en: "warm spice",           ja: "スパイス・ハーブ" },
    "Fermented":   { ko: "발효·와이니",   en: "winey fermented notes",ja: "ワイニーな発酵香" }
  },
  tasteLevelDesc: {
    sour: {
      1: { en: "Very low acidity · smooth & mellow", ja: "酸味ほぼなし・まろやか" },
      2: { en: "Mild, gentle fruit acidity",         ja: "穏やかでやさしい果実の酸味" },
      3: { en: "Balanced, pleasant medium acidity",  ja: "バランスの取れた心地よい酸味" },
      4: { en: "Bright & juicy fruit acidity",       ja: "華やかでジューシーな酸味" },
      5: { en: "Vibrant, sparkling citrus acidity",  ja: "弾けるように鮮やかなシトラス酸味" }
    },
    nutty: {
      1: { en: "Clean floral/tea focus over nuttiness", ja: "香ばしさ控えめ・花や茶の香り中心" },
      2: { en: "Subtle roasted nut finish",             ja: "後味にほのかなナッツの余韻" },
      3: { en: "Balanced nutty & sweet harmony",        ja: "ナッツ感と甘みの絶妙な調和" },
      4: { en: "Rich roasted nuts & milk chocolate",    ja: "香ばしいナッツとミルクチョコ" },
      5: { en: "Deep roasted nuts & dark cacao",        ja: "濃厚な焙煎ナッツとダークカカオ" }
    },
    sweet: {
      1: { en: "Crisp & dry clean finish",           ja: "すっきりドライな後味" },
      2: { en: "Subtle bittersweet cocoa finish",    ja: "ほろ苦く控えめな甘み" },
      3: { en: "Balanced, clean natural sweetness",  ja: "すっきりとバランスの良い甘み" },
      4: { en: "Honeyed fruit & caramel sweetness",  ja: "蜂蜜や果実のような豊かな甘み" },
      5: { en: "Syrupy, lingering dessert sweetness",ja: "シロップのように濃厚で長い甘い余韻" }
    }
  },
  processGroup: {
    "Washed":              { ko: "워시드",       en: "Washed",              ja: "ウォッシュト",       hint: { ko: "깔끔함↑",         en: "Clean Clarity↑",   ja: "透明感↑" } },
    "Natural":             { ko: "내추럴",       en: "Natural",             ja: "ナチュラル",         hint: { ko: "과일단맛↑",       en: "Fruity Sweet↑",    ja: "果実の甘み↑" } },
    "Honey":               { ko: "허니",         en: "Honey",               ja: "ハニー",             hint: { ko: "꿀단맛↑",         en: "Honey Sweet↑",     ja: "蜂蜜の甘み↑" } },
    "Anaerobic":           { ko: "특수발효",     en: "Anaerobic",           ja: "嫌気性発酵",         hint: { ko: "와인·요거트향↑",  en: "Winey Aroma↑",     ja: "芳醇アロマ↑" } },
    "Thermal Shock":       { ko: "서멀쇼크",     en: "Thermal Shock",       ja: "サーマルショック",   hint: { ko: "열충격 과즙향↑",  en: "Intense Fruit↑",   ja: "濃厚果汁感↑" } },
    "Carbonic Maceration": { ko: "카보닉 발효",  en: "Carbonic Maceration", ja: "カーボニック発酵",   hint: { ko: "화사한 와인향↑",  en: "Sparkling Winey↑", ja: "華やかワイン香↑" } },
    "Wet Hulled":          { ko: "습식 탈곡",    en: "Wet Hulled",          ja: "スマトラ式",         hint: { ko: "묵직한 바디↑",    en: "Earthy Body↑",     ja: "重厚ボディ↑" } },
    "Infused":             { ko: "보태니컬 가향", en: "Botanical Infused",   ja: "インフューズド",     hint: { ko: "디저트 아로마↑",  en: "Dessert Aroma↑",   ja: "デザート香↑" } },
    "Barrel Aged":         { ko: "배럴 숙성",    en: "Barrel Aged",         ja: "バレルエイジド",     hint: { ko: "오크통 숙성향↑",  en: "Oak Barrel Note↑", ja: "樽熟成アロマ↑" } },
    "Decaf":               { ko: "디카페인",     en: "Decaf",               ja: "デカフェ",           hint: { ko: "카페인↓",         en: "Caffeine Free",    ja: "カフェインレス" } },
    "Blend":               { ko: "블렌드 가공",  en: "Master Blend",        ja: "ブレンド精製",       hint: { ko: "황금 밸런스↑",    en: "Balanced Craft↑",  ja: "黄金バランス↑" } }
  },
  authenticityBadge: {
    "ESTATE_LOT": {
      ko: "🏡 실존 농장·워싱스테이션 로트",
      en: "🏡 Verified Estate / Washing Station Lot",
      ja: "🏡 実在農園・ウォッシングステーションロット",
      desc: {
        ko: "실제 스페셜티 생두 시장에서 거래되는 특정 농장·생산자·워싱스테이션이 확인된 로트입니다.",
        en: "Traceable specialty coffee lot from a verified farm, producer, or washing station.",
        ja: "実際のスペシャルティ生豆市場で取引される特定農園・生産者・精製所が確認されたロットです。"
      }
    },
    "REGIONAL_GRADE": {
      ko: "🏛️ 지역 대표·공식 등급 로트",
      en: "🏛️ Regional Specialty / Export Grade",
      ja: "🏛️ 地域代表・公式輸出グレード",
      desc: {
        ko: "특정 단일 농장이 아닌, 산지 조합·지역 품종 또는 공식 수출 등급(G1, AA, SHB, Supremo 등) 기준 대표 원두입니다.",
        en: "Representative regional specialty or official export grade coffee (e.g., G1, AA, SHB, Supremo).",
        ja: "単一農園ではなく、産地組合・地域品種または公式輸出等級（G1、AA、SHB、スプレモ等）基準の代表豆です。"
      }
    },
    "STYLE_ARCHETYPE": {
      ko: "🎨 아카이브 표준 스타일·시그니처",
      en: "🎨 Archive Signature Style Archetype",
      ja: "🎨 アーカイブ標準スタイル・ブレンド",
      desc: {
        ko: "특정 단일 농장 생두가 아닌, 로스터리 카페의 대표 가향·하우스블렌드 레시피를 재현한 아키타입입니다.",
        en: "Representative roastery style archetype (flavored or house blend) rather than a single estate lot.",
        ja: "単一農園ではなく、代表的なフレーバー・ハウスブレンドのレシピを体系化したスタイルです。"
      }
    },
    "PENDING_VERIFICATION": {
      ko: "🔍 생산자·농장 정보 검증 대기",
      en: "🔍 Producer Verification Pending",
      ja: "🔍 生産者・農園情報 確認中",
      desc: {
        ko: "세부 농장·워싱스테이션과 생산자 정보를 공식 생두 자료와 교차 검증 중인 원두입니다. 확인이 완료되면 순차 업데이트됩니다.",
        en: "Producer and washing station details are currently being verified against official specialty trade records.",
        ja: "農園・精製所および生産者の詳細情報を公式生豆資料と照合中です。確認でき次第順次更新されます。"
      }
    }
  }
};

// WCR 기준 품종 정규화 헬퍼 (69종 원문 표기 -> 표준 코드 & 정식 명칭)
function resolveCanonicalVarietal(rawVarietal = "", categoryType = "") {
  const raw = String(rawVarietal || "").trim();
  const up = raw.toUpperCase();
  if (categoryType === "HOUSE_BLEND" || /^(BRAZIL|COLOMBIA|COSTA RICA|ETHIOPIA)\s*\//.test(up) || up === "ARABICA BLEND") {
    return { code: "ARABICA_BLEND", canonical: "Arabica Blend" };
  }
  if (up.includes("EUGENIOIDES")) return { code: "COFFEA_EUGENIOIDES", canonical: "Coffea Eugenioides" };
  if (up.includes("CANEPHORA") || up.includes("ROBUSTA") || up.includes("TR4")) return { code: "FINE_ROBUSTA", canonical: "Fine Robusta (Canephora)" };
  if (up.includes("GORI GESHA") || up.includes("GEISHA") || up.includes("GESHA")) {
    return up.includes("/") ? { code: "GEISHA_BLEND", canonical: "Geisha Blend" } : { code: "GEISHA", canonical: "Geisha (Gesha)" };
  }
  if (up.includes("TYPICA MEJORADO")) return { code: "TYPICA_MEJORADO", canonical: "Typica Mejorado" };
  if (up.includes("BLUE MOUNTAIN")) return { code: "BLUE_MOUNTAIN_TYPICA", canonical: "Blue Mountain Typica" };
  if (up.includes("KONA")) return { code: "KONA_TYPICA", canonical: "Kona Typica" };
  if (up.includes("PLUMA")) return { code: "PLUMA_TYPICA", canonical: "Pluma Hidalgo Typica" };
  if (up.includes("LAURINA") || up.includes("POINTU")) return { code: "LAURINA", canonical: "Laurina (Bourbon Pointu)" };
  if (up.includes("PINK BOURBON")) return { code: "PINK_BOURBON", canonical: "Pink Bourbon" };
  if (up.includes("YELLOW BOURBON")) return { code: "YELLOW_BOURBON", canonical: "Yellow Bourbon" };
  if (up.includes("RED BOURBON")) return { code: "RED_BOURBON", canonical: "Red Bourbon" };
  if (up.includes("PACAMARA")) return { code: "PACAMARA", canonical: "Pacamara" };
  if (up.includes("MARAGOGYPE") || up.includes("MARAGOGIPE")) return { code: "MARAGOGIPE", canonical: "Maragogipe" };
  if (up.includes("VILLA SARCHI")) return { code: "VILLA_SARCHI", canonical: "Villa Sarchí" };
  if (up.includes("PACAS")) return { code: "PACAS", canonical: "Pacas" };
  if (up.includes("SIDRA")) return { code: "SIDRA", canonical: "Sidra" };
  if (up.includes("CHIROSO")) return { code: "CHIROSO", canonical: "Chiroso" };
  if (up.includes("WUSH WUSH")) return { code: "WUSH_WUSH", canonical: "Wush Wush" };
  if (up.includes("JAVA")) return { code: "JAVA", canonical: "Java" };
  if (up.includes("PARAINEMA")) return { code: "PARAINEMA", canonical: "Parainema" };
  if (up.includes("ARARA")) return { code: "ARARA", canonical: "Arara" };
  if (up.includes("YEMENIA") || up.includes("UDAINI") || up.includes("JAADI")) return { code: "YEMENIA", canonical: "Yemenia Landrace" };
  if (up.includes("74110") || up.includes("74112")) return { code: "ETHIOPIAN_LANDRACE_74110", canonical: "Ethiopian Landrace (JARC 74110/74112)" };
  if (up.includes("HEIRLOOM")) return { code: "ETHIOPIAN_LANDRACE", canonical: "Ethiopian Landrace" };
  if (up.includes("SL14")) return { code: "SL14_SL28", canonical: "SL14 / SL28" };
  if (up.includes("SL28") && up.includes("SL34")) return { code: "SL28_SL34", canonical: "SL28 / SL34" };
  if (up.includes("SL28")) return { code: "SL28", canonical: "SL28" };
  if (up.includes("N39")) return { code: "N39_KP423", canonical: "N39 / KP423" };
  if (up.includes("MUNDO NOVO")) return { code: "MUNDO_NOVO", canonical: "Mundo Novo" };
  if (up.includes("CASTILLO")) return { code: "CASTILLO", canonical: "Castillo" };
  if (up.includes("CATIMOR")) return { code: "CATIMOR", canonical: "Catimor" };
  if (up.includes("ATENG")) return { code: "ATENG", canonical: "Ateng" };
  if (up.includes("TIM TIM")) return { code: "TIM_TIM", canonical: "Tim Tim (Hibrido de Timor)" };
  if (up.includes("HIBRIDO DE TIMOR")) return { code: "HIBRIDO_DE_TIMOR", canonical: "Hibrido de Timor" };
  if (up.includes("S-795") || up.includes("KOPYOL")) return { code: "S795", canonical: "Selection 795 (S-795)" };
  if (up.includes("ARUSHA")) return { code: "ARUSHA", canonical: "Arusha" };
  if (up.includes("KENT") && up.includes("BOURBON")) return { code: "BOURBON_KENT", canonical: "Bourbon / Kent" };
  if (up.includes("KENT")) return { code: "KENT", canonical: "Kent" };
  if (up.includes("CATURRA") && up.includes("CATUAI")) return { code: "CATURRA_CATUAI", canonical: "Caturra / Catuai" };
  if (up.includes("CATURRA")) return { code: "CATURRA", canonical: "Caturra" };
  if (up.includes("CATUAI")) return { code: "CATUAI", canonical: "Catuai" };
  if (up.includes("BOURBON") && up.includes("TYPICA")) return { code: "TYPICA_BOURBON", canonical: "Typica / Bourbon" };
  if (up.includes("BOURBON")) return { code: "BOURBON", canonical: "Bourbon" };
  if (up.includes("TYPICA")) return { code: "TYPICA", canonical: "Typica" };
  return { code: "ARABICA_OTHER", canonical: raw || "Arabica" };
}

const UI_I18N = {
  ko: {
    appTitle: "커피 맛 아카이브",
    appDesc: "원하는 맛과 입안의 무게감으로 나의 커피를 찾아보세요",
    originDrawerBtn: "원산지 도감",
    soundOn: "🔊 소리 ON",
    soundOff: "🔇 소리 OFF",
    searchPlaceholder: "원두 이름, 생산자, 맛(복숭아, 초콜릿), 1~5단계...",
    catHeader: "MAIN TASTE CATEGORY",
    catNoSourTitle: "산미 없는 고소함",
    catNoSourSub: "견과·초콜릿 중심",
    catBrightSourTitle: "화사한 산미",
    catBrightSourSub: "과즙·꽃향 중심",
    catFermentedTitle: "특수발효·가향",
    catFermentedSub: "무산소·인퓨즈드",
    catBalancedTitle: "균형 밸런스",
    catBalancedSub: "부드러운 데일리",
    primerPillHtml: "💡 처음이신가요? <strong>핸드드립 · 싱글오리진 · 스페셜티</strong> 10초 요약 보기 ➔",
    leverTitle: "🎰 오늘의 스페셜티 뽑기",
    leverDesc: "조작 휠로 산미·고소함·바디감·원산지를 조합한 뒤 우측 레버를 당겨보세요",
    randomBtn: "랜덤 조합",
    wheelSour: "산미",
    wheelNutty: "고소함",
    wheelBody: "바디감",
    wheelOrigin: "원산지",
    stageUnit: "단계",
    anyLabel: "무관",
    allOriginLabel: "전체",
    tastedBtn: "☕ 마셔본",
    allBeansBtn: "전체 원두",
    topBtn: "↑ 위로",
    allArchiveTitle: (n) => `전체 스페셜티 아카이브 <strong>${n}</strong>종`,
    searchedCountTitle: (n) => `검색된 카드 <strong>${n}</strong>장`,
    tastedCountTitle: (n) => `☕ 내가 마셔본 스페셜티 아카이브 <strong>${n}</strong>종`,
    tabSimple: "간략히",
    tabDetailed: "자세히",
    modalTabAria: "간략히 및 자세히 보기 전환",
    tasteSectionTitle: "CUPPING TASTE PROFILE",
    modeSimpleBtn: "기본 3축",
    modeDetailBtn: "자세히 5축·단맛",
    radarSwitchTo5: "3축 ⇄ 5축",
    radarSwitchTo3: "5축 ⇄ 3축",
    baristaOneLinerTitle: "BARISTA ONE-LINER",
    radarSour: "산미",
    radarNutty: "고소함",
    radarBody: "바디감",
    radarSweet: "단맛",
    radarRoast: "배전강도",
    specSectionTitle: "ORIGIN & BREWING SPEC",
    traceSectionTitle: "PRODUCER & SOURCE TRACEABILITY",
    labelSour: "🍋 산미",
    labelNutty: "🥜 고소함",
    labelBody: "⚖️ 바디감",
    labelSweet: "🍯 단맛",
    labelOriginRegion: "🌍 산지 · 세부 지역",
    labelAltitude: "⛰️ 재배 고도",
    labelVarietal: "🌱 품종 · 계보",
    labelProcess: "☀️ 가공 · 등급",
    labelRoastLevel: "🔥 배전도",
    labelRegionAlt: "⛰️ 세부 산지 · 고도",
    labelBrewRecipe: "💧 추천 추출 레시피",
    labelBrewWarning: "🌡️ 추출 온도 주의",
    brewMethodsLink: "☕ 추출 방식(핸드드립·에스프레소·콜드브루)별 맛 변화 보기 ➔",
    labelProducer: "👨‍🌾 생산자 · 농장/스테이션",
    labelSourceRef: "🔗 정보 출처 · 레퍼런스",
    labelTradeQuery: "🔎 실제 구매·검색 키워드",
    pendingProducerText: "세부 생산자·스테이션 정보 검증 대기 중",
    pendingSourceText: "공식 생두 자료 교차 확인 후 출처가 등록됩니다.",
    disclosureNotice: "ⓘ 맛 지표(1~5단계)는 표준 추출 기준 편집자 커핑 평가이며 로스터리·추출 변수에 따라 달라질 수 있습니다. 향후 일부 구매 링크에는 제휴 수수료가 포함될 수 있습니다.",
    btnSearchGoogle: "🔍 구글 원두 검색",
    btnSearchNaver: "🛒 네이버 쇼핑 검색",
    btnAudioRead: "🔊 읽어주기",
    btnAudioStop: "⏹️ 멈추기",
    btnTasted: "☕ 마셔본 원두",
    modalCloseAria: "닫기",
    clearSearchAria: "지우기",
    searchDropdownAria: "검색 추천 및 최근 검색어",
    searchJumpBadgeText: (n) => `🔍 ${n}건 보기 ↓`,
    autocompleteHeader: "추천 검색어",
    autocompleteEmpty: "일치하는 추천 항목이 없습니다",
    sugTypeBean: "원두",
    sugTypeOrigin: "산지",
    sugTypeFlavor: "향미",
    sugTypeProducer: "생산자",
    recentSearchTitle: "최근 검색어",
    clearHistoryBtn: "전체 삭제",
    deleteHistoryAria: "검색 기록 삭제",
    emptyTastedTitle: "☕ 나만의 시음 기록장",
    emptyTastedDesc: "아직 마셔본 커피 도장이 없습니다. 원두 카드를 눌러 상세 도감 하단의 <strong>[☕ 마셔본 원두]</strong> 버튼을 누르면 이곳에 나만의 시음 기록이 모입니다!",
    emptySearchTitle: "🔍 찾으시는 커피 카드가 없습니다",
    emptySearchDesc: "예: '에티오피아 워시드', '과테말라', 'ㅂㅅㅇ', 'Sigri', '1단계'처럼 검색해보세요.",
    dispenserMixedTitle: (total, exact, close) => `🎰 맞춤 큐레이션 <strong>${total}</strong>종 <span style="font-size:0.78rem; color:var(--ink-sub); font-weight:600;">(일치 ${exact} · 유사 ${close})</span>`,
    dispenserExactTitle: (n) => `🎰 조합 일치 카드 <strong>${n}</strong>종`,
    dispenserCloseTitle: (n) => `✨ 근접 추천 카드 <strong>${n}</strong>종`,
    ttsLang: "ko-KR",
    tutorialReplayAria: "사용 가이드 다시 보기",
    onboardingBadge: "WELCOME · FIRST VISIT",
    onboardingTitle: "어떤 방식으로 커피를 둘러볼까요?",
    onboardingDesc: "선택한 모드는 상세 도감 상단의 '간략히 / 자세히' 탭에서 언제든 바꿀 수 있어요.",
    onboardingSimpleTitle: "🌱 입문자 모드",
    onboardingSimpleSub: "간략히 기본 (3축 레이더 · 핵심 요약)",
    onboardingSimpleDesc: "복잡한 스펙 없이 핵심 맛 지표·레이더·바리스타 한 줄만 직관적으로 봐요.",
    onboardingDetailedTitle: "🔬 마니아 모드",
    onboardingDetailedSub: "자세히 기본 (5축 · WCR 스펙 · 다이얼링)",
    onboardingDetailedDesc: "이름 3초 해독, 품종·고도·레시피, 다이얼링 노트와 출처까지 한눈에 봐요.",
    tutorialStepBadge: (n, total) => `${n} / ${total}`,
    tutorialStep1Title: "1. 원두명·초성·향미 검색 & 자동완성",
    tutorialStep1Desc: "원두명, 복합어('에티오피아 워시드'), 초성('ㅂㅅㅇ'), 외래어 오타('게샤'), 향미까지 실시간 자동완성으로 빠르게 찾아보세요.",
    tutorialStep2Title: "2. Casper 4축 룰렛 & 레버 뽑기",
    tutorialStep2Desc: "산미·고소함·바디감·원산지 4개 휠을 위아래로 조합한 뒤 우측 레버를 당기면 취향에 맞는 스페셜티 원두를 즉시 큐레이션해 드려요.",
    tutorialStep3Title: "3. 스크린 내부 원산지 도감",
    tutorialStep3Desc: "하단 '🌍 산지' 키를 누르면 드럼 스크린 안에서 30개 산지 카드를 스크롤하고, 원하는 나라를 눌러 해당 원두만 바로 모아볼 수 있어요.",
    tutorialStep4Title: "4. 설정 · 미닛 리피터 시계 & 오늘의 추천",
    tutorialStep4Desc: "시계를 누르면 5270P 미닛 리피터 타종을 들을 수 있고, 현재 시간·날씨 맞춤 추천 1종과 소리·언어(KR/EN/JP)·버전 기록을 한곳에서 관리해요.",
    tutorialStep5Title: "5. 하단 컨트롤 바 · 마셔본 원두 · 가이드",
    tutorialStep5Desc: "'전체 원두'로 120종 전체를 초기화하고, '☕ 마셔본'으로 내 시음 기록만 모아보며, '?' 버튼으로 언제든 이 6단계 가이드를 다시 볼 수 있어요.",
    tutorialStep6Title: "6. 간략히/자세히 상세 도감 & 2종 비교",
    tutorialStep6Desc: "원두 카드를 누르면 '간략히'(3·5축 레이더·바리스타 한 줄)와 '자세히'(해독바·스펙·다이얼링·출처)를 오가고, '⚖️ 비교 담기'로 2종을 나란히 비교할 수 있어요.",
    tutorialSkip: "건너뛰기",
    tutorialPrev: "이전",
    tutorialNext: "다음",
    tutorialDone: "시작하기",
    compareAddBtn: "⚖️ 비교 담기",
    compareAddedBtn: "✓ 비교 담김",
    compareTrayCount: (n) => `비교함 ${n}/2`,
    compareTrayOpenBtn: "비교하기",
    compareTrayClearAria: "비교함 비우기",
    compareTrayRemoveAria: "비교에서 제거",
    compareTrayHint: "1종 더 담으면 나란히 비교할 수 있어요",
    compareMaxToast: "비교는 최대 2종까지 담을 수 있어요. 하나를 해제 후 담아주세요.",
    compareModalTitle: "⚖️ 원두 2종 맛·스펙 비교",
    compareSwapModeSimple: "3축 비교",
    compareSwapModeDetailed: "5축 비교",
    compareSpecRoast: "배전도",
    compareSpecProcess: "가공법",
    compareSpecVarietal: "품종",
    compareSpecOrigin: "원산지",
    compareSpecRecipe: "추출 레시피",
    compareSpecSour: "산미",
    compareSpecNutty: "고소함",
    compareSpecBody: "바디감",
    compareSpecSweet: "단맛",
    labelDialingNote: "바리스타 다이얼링 노트",
    todaysPickLabel: "TODAY'S PICK",
    todaysPickViewBtn: "추천 원두 보기",
    todaysPickViewShort: "보기",
    todaysPickAltLabel: "함께 추천",
    todaysPickCityAria: "날씨 추천 지역 선택",
    todaysPickGpsBtn: "📍 현위치",
    todaysPickGpsAria: "현재 위치와 가장 가까운 도시 선택 (좌표 저장 안 함)",
    todaysPickModeTime: "시간대 추천",
    todaysPickModeWeather: "실시간 날씨 연동",
    todaysPickGpsFailed: "위치 권한이 거부되었거나 지원되지 않아 선택한 도시 기준으로 표시해요.",
    deckTabSearch: "🔍 검색",
    deckTabRoulette: "🎰 맞춤 원두 조합",
    deckTabOrigin: "🌍 산지",
    deckTabPick: "☀️ 투데이스픽",
    deckTabSettings: "⚙️ 설정",
    originScreenTitle: "🌍 원산지 도감",
    originScreenHint: "나라를 눌러 해당 산지 원두 모아보기",
    deckModeAria: "디스펜서 기능 모드 선택",
    searchFaceTitle: "원두명 · 향미 · 초성으로 찾기",
    searchArchiveBadge: (n) => `${n}종 아카이브`,
    quickSearchAria: "빠른 검색 키워드",
    quickSearchChips: [
      { label: "#에티오피아 워시드", query: "에티오피아 워시드" },
      { label: "#복숭아·자스민", query: "복숭아" },
      { label: "#고소한 초콜릿", query: "고소한 초콜릿" },
      { label: "#디카페인", query: "디카페인" },
      { label: "#게이샤", query: "게이샤" },
      { label: "#특수발효", query: "특수발효" },
      { label: "#블렌드", query: "블렌드" },
      { label: "#산미 없는", query: "산미 없는" }
    ]
  },
  en: {
    appTitle: "Coffee Taste Archive",
    appDesc: "Find your specialty coffee by acidity, nuttiness, and mouthfeel",
    originDrawerBtn: "Origin Guide",
    soundOn: "🔊 Sound ON",
    soundOff: "🔇 Sound OFF",
    searchPlaceholder: "Search bean, producer, flavor (peach, cocoa), stage 1-5...",
    catHeader: "MAIN TASTE CATEGORY",
    catNoSourTitle: "Low-Acid & Nutty",
    catNoSourSub: "Nuts & dark cocoa",
    catBrightSourTitle: "Bright & Fruity",
    catBrightSourSub: "Juicy citrus & floral",
    catFermentedTitle: "Fermented & Infused",
    catFermentedSub: "Anaerobic & flavored",
    catBalancedTitle: "Smooth Balance",
    catBalancedSub: "Easy daily harmony",
    primerPillHtml: "💡 New to Specialty Coffee? <strong>10-Sec Quick Guide</strong> ➔",
    leverTitle: "🎰 Specialty Coffee Dispenser",
    leverDesc: "Dial in Acidity, Nutty, Body & Origin on the wheels, then pull the lever",
    randomBtn: "Random Dial",
    wheelSour: "ACIDITY",
    wheelNutty: "NUTTY",
    wheelBody: "BODY",
    wheelOrigin: "ORIGIN",
    stageUnit: "Lv.",
    anyLabel: "ANY",
    allOriginLabel: "ALL",
    tastedBtn: "☕ Tasted",
    allBeansBtn: "All Beans",
    topBtn: "↑ Top",
    allArchiveTitle: (n) => `Specialty Coffee Archive <strong>${n}</strong> Lots`,
    searchedCountTitle: (n) => `Matched Cards: <strong>${n}</strong>`,
    tastedCountTitle: (n) => `☕ My Tasted Archive: <strong>${n}</strong>`,
    tabSimple: "Summary",
    tabDetailed: "Detailed",
    modalTabAria: "Switch between Summary and Detailed view",
    tasteSectionTitle: "CUPPING TASTE PROFILE",
    modeSimpleBtn: "Simple 3-Axis",
    modeDetailBtn: "Detailed 5-Axis",
    radarSwitchTo5: "3-Axis ⇄ 5-Axis",
    radarSwitchTo3: "5-Axis ⇄ 3-Axis",
    baristaOneLinerTitle: "BARISTA ONE-LINER",
    radarSour: "Acidity",
    radarNutty: "Nutty",
    radarBody: "Body",
    radarSweet: "Sweet",
    radarRoast: "Roast",
    specSectionTitle: "ORIGIN & BREWING SPEC",
    traceSectionTitle: "PRODUCER & SOURCE TRACEABILITY",
    labelSour: "🍋 Acidity",
    labelNutty: "🥜 Nutty",
    labelBody: "⚖️ Body",
    labelSweet: "🍯 Sweetness",
    labelOriginRegion: "🌍 Origin · Region",
    labelAltitude: "⛰️ Altitude",
    labelVarietal: "🌱 Varietal · Lineage",
    labelProcess: "☀️ Process · Grade",
    labelRoastLevel: "🔥 Roast Level",
    labelRegionAlt: "⛰️ Region · Altitude",
    labelBrewRecipe: "💧 Brew Recipe",
    labelBrewWarning: "🌡️ Temp Caution",
    brewMethodsLink: "☕ How Brew Methods Change Flavor (Drip · Espresso · Cold Brew) ➔",
    labelProducer: "👨‍🌾 Producer · Estate / Mill",
    labelSourceRef: "🔗 Verified Source",
    labelTradeQuery: "🔎 Market Search Term",
    pendingProducerText: "Producer & washing station verification pending",
    pendingSourceText: "Source link will be published once verified against official trade sheets.",
    disclosureNotice: "ⓘ Taste ratings (1–5) reflect editorial cupping estimates under standard brewing and vary by roaster. Future purchase links may include affiliate commissions.",
    btnSearchGoogle: "🔍 Search on Google",
    btnSearchNaver: "🛒 Search on Naver",
    btnAudioRead: "🔊 Listen",
    btnAudioStop: "⏹️ Stop",
    btnTasted: "☕ Tasted",
    modalCloseAria: "Close",
    clearSearchAria: "Clear",
    searchDropdownAria: "Autocomplete & recent searches",
    searchJumpBadgeText: (n) => `🔍 View ${n} ↓`,
    autocompleteHeader: "Suggestions",
    autocompleteEmpty: "No matching suggestions",
    sugTypeBean: "Bean",
    sugTypeOrigin: "Origin",
    sugTypeFlavor: "Flavor",
    sugTypeProducer: "Producer",
    recentSearchTitle: "Recent Searches",
    clearHistoryBtn: "Clear All",
    deleteHistoryAria: "Remove search history item",
    emptyTastedTitle: "☕ My Tasting Log",
    emptyTastedDesc: "No tasted stamps yet. Open any coffee card and tap <strong>[☕ Tasted]</strong> at the bottom to collect your tasting log here.",
    emptySearchTitle: "🔍 No Matching Coffee Lots",
    emptySearchDesc: "Try searching e.g. 'Ethiopia Washed', 'Colombia Geisha', 'Sigri', 'peach', or 'nutty'.",
    dispenserMixedTitle: (total, exact, close) => `🎰 Curated Picks <strong>${total}</strong> <span style="font-size:0.78rem; color:var(--ink-sub); font-weight:600;">(${exact} Exact · ${close} Close)</span>`,
    dispenserExactTitle: (n) => `🎰 Exact Match <strong>${n}</strong> Lots`,
    dispenserCloseTitle: (n) => `✨ Close Match <strong>${n}</strong> Lots`,
    ttsLang: "en-US",
    tutorialReplayAria: "Replay interactive guide",
    onboardingBadge: "WELCOME · FIRST VISIT",
    onboardingTitle: "How would you like to explore?",
    onboardingDesc: "You can switch between Summary and Detailed tabs anytime inside any coffee card.",
    onboardingSimpleTitle: "🌱 Beginner Mode",
    onboardingSimpleSub: "Summary Default (3-Axis Radar · Quick Guide)",
    onboardingSimpleDesc: "Focus on core flavor ratings, radar chart, and the barista one-liner.",
    onboardingDetailedTitle: "🔬 Enthusiast Mode",
    onboardingDetailedSub: "Detailed Default (5-Axis · WCR Spec · Dialing)",
    onboardingDetailedDesc: "Explore name decoder, varietal, altitude, dialing notes, and source links.",
    tutorialStepBadge: (n, total) => `${n} / ${total}`,
    tutorialStep1Title: "1. Bean, Flavor & Typo-Tolerant Search",
    tutorialStep1Desc: "Quickly find beans by name, compound terms, flavor notes, or typo-tolerant queries with live autocomplete and search history.",
    tutorialStep2Title: "2. Casper 4-Axis Roulette & Lever",
    tutorialStep2Desc: "Dial Acidity, Nutty, Body & Origin on the 4 wheels and pull the lever on the right to curate matching specialty lots.",
    tutorialStep3Title: "3. In-Screen Origin Atlas",
    tutorialStep3Desc: "Press the '🌍 Origin' key to browse 30 coffee-producing regions inside the deck screen and filter lots with one tap.",
    tutorialStep4Title: "4. Settings · Minute Repeater & Today's Pick",
    tutorialStep4Desc: "Tap the watch for the 5270P minute repeater chime, check your time/weather pick, and toggle sound, language, or changelog.",
    tutorialStep5Title: "5. Footer Controls · Tasted Log · Guide",
    tutorialStep5Desc: "Reset to all 120 beans with 'All Beans', filter your tasting stamps via '☕ Tasted', or replay this 6-step guide via '?'.",
    tutorialStep6Title: "6. Summary/Detailed Cards & 2-Bean Compare",
    tutorialStep6Desc: "Tap any card to switch between Summary (3/5-axis radar & barista note) and Detailed (specs, dialing & source), or compare 2 lots side-by-side.",
    tutorialSkip: "Skip",
    tutorialPrev: "Prev",
    tutorialNext: "Next",
    tutorialDone: "Start",
    compareAddBtn: "⚖️ Compare",
    compareAddedBtn: "✓ Added",
    compareTrayCount: (n) => `Compare ${n}/2`,
    compareTrayOpenBtn: "Compare Now",
    compareTrayClearAria: "Clear compare tray",
    compareTrayRemoveAria: "Remove from compare",
    compareTrayHint: "Add 1 more bean to compare side-by-side",
    compareMaxToast: "You can compare up to 2 beans at a time. Remove one first.",
    compareModalTitle: "⚖️ Side-by-Side Bean Comparison",
    compareSwapModeSimple: "3-Axis",
    compareSwapModeDetailed: "5-Axis",
    compareSpecRoast: "Roast",
    compareSpecProcess: "Process",
    compareSpecVarietal: "Varietal",
    compareSpecOrigin: "Origin",
    compareSpecRecipe: "Brew Recipe",
    compareSpecSour: "Acidity",
    compareSpecNutty: "Nutty",
    compareSpecBody: "Body",
    compareSpecSweet: "Sweetness",
    labelDialingNote: "Barista Dialing Note",
    todaysPickLabel: "TODAY'S PICK",
    todaysPickViewBtn: "View Bean",
    todaysPickViewShort: "View",
    todaysPickAltLabel: "Also try",
    todaysPickCityAria: "Select city for weather pick",
    todaysPickGpsBtn: "📍 Nearby",
    todaysPickGpsAria: "Select nearest city preset (coordinates are never saved)",
    todaysPickModeTime: "Time-of-day Pick",
    todaysPickModeWeather: "Live Weather",
    todaysPickGpsFailed: "Location unavailable; showing your selected city preset.",
    deckTabSearch: "🔍 Search",
    deckTabRoulette: "🎰 Taste Match",
    deckTabOrigin: "🌍 Origin",
    deckTabPick: "☀️ Today's Pick",
    deckTabSettings: "⚙️ Settings",
    originScreenTitle: "🌍 Origin Atlas",
    originScreenHint: "Tap a country to filter lots",
    deckModeAria: "Select dispenser mode",
    searchFaceTitle: "Search by Bean, Flavor & Process",
    searchArchiveBadge: (n) => `${n} Lots Archive`,
    quickSearchAria: "Quick search keywords",
    quickSearchChips: [
      { label: "#Ethiopia Washed", query: "Ethiopia Washed" },
      { label: "#Peach & Jasmine", query: "Peach" },
      { label: "#Nutty Chocolate", query: "Chocolate" },
      { label: "#Decaf", query: "Decaf" },
      { label: "#Geisha", query: "Geisha" },
      { label: "#Anaerobic", query: "Anaerobic" },
      { label: "#Blend", query: "Blend" },
      { label: "#Low Acid", query: "Low Acid" }
    ]
  },
  ja: {
    appTitle: "コーヒー味アーカイブ",
    appDesc: "好みの酸味・香ばしさ・口当たりの重さから理想の豆を見つけましょう",
    originDrawerBtn: "産地図鑑",
    soundOn: "🔊 音 ON",
    soundOff: "🔇 音 OFF",
    searchPlaceholder: "豆の名前、生産者、風味(桃、チョコ)、1〜5段階...",
    catHeader: "MAIN TASTE CATEGORY",
    catNoSourTitle: "酸味控えめ・香ばし",
    catNoSourSub: "ナッツ・チョコ中心",
    catBrightSourTitle: "華やかな酸味",
    catBrightSourSub: "果実・フローラル",
    catFermentedTitle: "特殊発酵・フレーバー",
    catFermentedSub: "嫌気性・インフューズド",
    catBalancedTitle: "黄金バランス",
    catBalancedSub: "毎日飲みやすい調和",
    primerPillHtml: "💡 初めてですか？ <strong>ハンドドリップ・スペシャルティ10秒ガイド</strong> ➔",
    leverTitle: "🎰 本日のスペシャルティ抽出機",
    leverDesc: "ダイヤルで酸味・香ばしさ・ボディ・産地を合わせ、右のレバーを引いてください",
    randomBtn: "ランダム",
    wheelSour: "酸味",
    wheelNutty: "香ばしさ",
    wheelBody: "ボディ",
    wheelOrigin: "産地",
    stageUnit: "段階",
    anyLabel: "指定なし",
    allOriginLabel: "すべて",
    tastedBtn: "☕ 飲んだ豆",
    allBeansBtn: "すべての豆",
    topBtn: "↑ 上へ",
    allArchiveTitle: (n) => `スペシャルティ図鑑 全 <strong>${n}</strong>種`,
    searchedCountTitle: (n) => `検索結果 <strong>${n}</strong>件`,
    tastedCountTitle: (n) => `☕ 飲んだコーヒー記録 <strong>${n}</strong>種`,
    tabSimple: "かんたん",
    tabDetailed: "くわしく",
    modalTabAria: "かんたん・くわしく表示を切替",
    tasteSectionTitle: "CUPPING TASTE PROFILE",
    modeSimpleBtn: "基本 3軸",
    modeDetailBtn: "詳細 5軸・甘み",
    radarSwitchTo5: "3軸 ⇄ 5軸",
    radarSwitchTo3: "5軸 ⇄ 3軸",
    baristaOneLinerTitle: "BARISTA ONE-LINER",
    radarSour: "酸味",
    radarNutty: "香ばしさ",
    radarBody: "ボディ",
    radarSweet: "甘み",
    radarRoast: "焙煎度",
    specSectionTitle: "ORIGIN & BREWING SPEC",
    traceSectionTitle: "PRODUCER & SOURCE TRACEABILITY",
    labelSour: "🍋 酸味",
    labelNutty: "🥜 香ばしさ",
    labelBody: "⚖️ ボディ感",
    labelSweet: "🍯 甘み",
    labelOriginRegion: "🌍 産地・詳細地域",
    labelAltitude: "⛰️ 栽培標高",
    labelVarietal: "🌱 品種・系譜",
    labelProcess: "☀️ 精製・等級",
    labelRoastLevel: "🔥 焙煎度",
    labelRegionAlt: "⛰️ 詳細産地・標高",
    labelBrewRecipe: "💧 推奨抽出レシピ",
    labelBrewWarning: "🌡️ 抽出温度の注意",
    brewMethodsLink: "☕ 抽出方法（ドリップ・エスプレッソ・水出し）による味の変化 ➔",
    labelProducer: "👨‍🌾 生産者・農園/精製所",
    labelSourceRef: "🔗 情報出典・リファレンス",
    labelTradeQuery: "🔎 実売検索キーワード",
    pendingProducerText: "生産者・精製所情報を照合確認中",
    pendingSourceText: "公式生豆資料の確認完了後に出典リンクを公開します。",
    disclosureNotice: "ⓘ 味覚スコア（1〜5段階）は標準抽出に基づく編集部の評価であり、焙煎や抽出条件により異なります。将来的に一部購入リンクにはアフィリエイト収益が含まれる場合があります。",
    btnSearchGoogle: "🔍 Googleで豆を検索",
    btnSearchNaver: "🛒 Naverショッピング検索",
    btnAudioRead: "🔊 読み上げ",
    btnAudioStop: "⏹️ 停止",
    btnTasted: "☕ 飲んだ豆",
    modalCloseAria: "閉じる",
    clearSearchAria: "クリア",
    searchDropdownAria: "検索候補と最近の検索",
    searchJumpBadgeText: (n) => `🔍 ${n}件を見る ↓`,
    autocompleteHeader: "検索候補",
    autocompleteEmpty: "一致する候補がありません",
    sugTypeBean: "銘柄",
    sugTypeOrigin: "産地",
    sugTypeFlavor: "風味",
    sugTypeProducer: "生産者",
    recentSearchTitle: "最近の検索",
    clearHistoryBtn: "すべて削除",
    deleteHistoryAria: "検索履歴を削除",
    emptyTastedTitle: "☕ テイスティング記録帳",
    emptyTastedDesc: "まだ記録された豆がありません。豆カードを開いて下部の<strong>[☕ 飲んだ豆]</strong>ボタンを押すとここに記録が集まります。",
    emptySearchTitle: "🔍 該当するコーヒーが見つかりません",
    emptySearchDesc: "例:「エチオピア ウォッシュト」「コロンビア ゲイシャ」「Sigri」「桃」などで検索してみてください。",
    dispenserMixedTitle: (total, exact, close) => `🎰 おすすめ抽出 <strong>${total}</strong>種 <span style="font-size:0.78rem; color:var(--ink-sub); font-weight:600;">(一致 ${exact} · 近似 ${close})</span>`,
    dispenserExactTitle: (n) => `🎰 一致カード <strong>${n}</strong>種`,
    dispenserCloseTitle: (n) => `✨ 近似おすすめ <strong>${n}</strong>種`,
    ttsLang: "ja-JP",
    tutorialReplayAria: "使い方ガイドを再表示",
    onboardingBadge: "WELCOME · FIRST VISIT",
    onboardingTitle: "どのようにコーヒーを探しますか？",
    onboardingDesc: "選択したモードは詳細カード上部の「かんたん / くわしく」タブからいつでも切り替えられます。",
    onboardingSimpleTitle: "🌱 ビギナーモード",
    onboardingSimpleSub: "かんたん優先（3軸レーダー・要点ガイド）",
    onboardingSimpleDesc: "専門用語なしで味覚指標・レーダー・バリスタの一言を直感的に見られます。",
    onboardingDetailedTitle: "🔬 マニアモード",
    onboardingDetailedSub: "くわしく優先（5軸・WCRスペック・抽出ノート）",
    onboardingDetailedDesc: "名称3秒解読、品種・標高・レシピ、ダイヤリングノートや出典まで一覧できます。",
    tutorialStepBadge: (n, total) => `${n} / ${total}`,
    tutorialStep1Title: "1. 豆名・フレーバー検索 & 自動補完",
    tutorialStep1Desc: "豆名・複合ワード・フレーバーノート・表記ゆれまで、リアルタイム自動補完と検索履歴ですばやく見つけられます。",
    tutorialStep2Title: "2. Casper 4軸ルーレット & レバー抽出",
    tutorialStep2Desc: "酸味・香ばしさ・ボディ・産地の4つのダイヤルを組み合わせて右のレバーを引くと、条件に合う豆を即座に提案します。",
    tutorialStep3Title: "3. スクリーン内 原産地図鑑",
    tutorialStep3Desc: "下部の「🌍 産地」キーを押すと画面内で30産地のカードをスクロールでき、国をタップするだけでその産地の豆を抽出できます。",
    tutorialStep4Title: "4. 設定・ミニッツリピーター時計 & 本日の1杯",
    tutorialStep4Desc: "時計タップで5270Pリピーターの鐘音を再生し、時間・天気のおすすめ1種と音・言語(KR/EN/JP)・更新履歴をまとめて管理できます。",
    tutorialStep5Title: "5. 下部コントロール・飲んだ豆・ガイド",
    tutorialStep5Desc: "「すべての豆」で全120種に戻し、「☕ 飲んだ豆」で自分の記録だけを表示、「?」ボタンからいつでも6段階ガイドを再確認できます。",
    tutorialStep6Title: "6. かんたん/くわしく詳細図鑑 & 2種比較",
    tutorialStep6Desc: "カードを開いて「かんたん」(3・5軸レーダー)と「くわしく」(解読・スペック・出典)を切替え、「⚖️ 比較」で2種を並べて比べられます。",
    tutorialSkip: "スキップ",
    tutorialPrev: "前へ",
    tutorialNext: "次へ",
    tutorialDone: "はじめる",
    compareAddBtn: "⚖️ 比較",
    compareAddedBtn: "✓ 追加済",
    compareTrayCount: (n) => `比較 ${n}/2`,
    compareTrayOpenBtn: "比較する",
    compareTrayClearAria: "比較トレイを空にする",
    compareTrayRemoveAria: "比較から削除",
    compareTrayHint: "あと1つ追加すると並べて比較できます",
    compareMaxToast: "比較は最大2種までです。1つ外してから追加してください。",
    compareModalTitle: "⚖️ コーヒー豆 2種比較",
    compareSwapModeSimple: "3軸比較",
    compareSwapModeDetailed: "5軸比較",
    compareSpecRoast: "焙煎度",
    compareSpecProcess: "精製法",
    compareSpecVarietal: "品種",
    compareSpecOrigin: "産地",
    compareSpecRecipe: "抽出レシピ",
    compareSpecSour: "酸味",
    compareSpecNutty: "香ばしさ",
    compareSpecBody: "ボディ",
    compareSpecSweet: "甘み",
    labelDialingNote: "バリスタ・ダイヤリングノート",
    todaysPickLabel: "TODAY'S PICK",
    todaysPickViewBtn: "詳細を見る",
    todaysPickViewShort: "見る",
    todaysPickAltLabel: "こちらもおすすめ",
    todaysPickCityAria: "天気おすすめ地域を選択",
    todaysPickGpsBtn: "📍 現在地",
    todaysPickGpsAria: "最寄りの都市プリセットを選択（座標は保存されません）",
    todaysPickModeTime: "時間帯おすすめ",
    todaysPickModeWeather: "天気連動",
    todaysPickGpsFailed: "位置情報を取得できないため、選択中の都市で表示します。",
    deckTabSearch: "🔍 検索",
    deckTabRoulette: "🎰 好み診断",
    deckTabOrigin: "🌍 産地",
    deckTabPick: "☀️ 本日のおすすめ",
    deckTabSettings: "⚙️ 設定",
    originScreenTitle: "🌍 原産地図鑑",
    originScreenHint: "国をタップして産地の豆を絞り込み",
    deckModeAria: "機能モードを選択",
    searchFaceTitle: "豆名・フレーバー・精製法で探す",
    searchArchiveBadge: (n) => `${n}種アーカイブ`,
    quickSearchAria: "クイック検索キーワード",
    quickSearchChips: [
      { label: "#エチオピア", query: "エチオピア" },
      { label: "#ピーチ・ジャスミン", query: "ピーチ" },
      { label: "#ナッツ・チョコ", query: "チョコレート" },
      { label: "#デカフェ", query: "デカフェ" },
      { label: "#ゲイシャ", query: "ゲイシャ" },
      { label: "#特殊発酵", query: "特殊発酵" },
      { label: "#ブレンド", query: "ブレンド" },
      { label: "#酸味控えめ", query: "酸味控えめ" }
    ]
  }
};

// 30개 산지/테마 한·영·일 국가명 매핑 사전
const ORIGIN_I18N_MAP = {
  ETH: { ko: "에티오피아", en: "Ethiopia", ja: "エチオピア" },
  KEN: { ko: "케냐", en: "Kenya", ja: "ケニア" },
  RWA: { ko: "르완다", en: "Rwanda", ja: "ルワンダ" },
  BDI: { ko: "부룬디", en: "Burundi", ja: "ブルンジ" },
  TZA: { ko: "탄자니아", en: "Tanzania", ja: "タンザニア" },
  UGA: { ko: "우간다", en: "Uganda", ja: "ウガンダ" },
  PAN: { ko: "파나마", en: "Panama", ja: "パナマ" },
  CRI: { ko: "코스타리카", en: "Costa Rica", ja: "コスタリカ" },
  GTM: { ko: "과테말라", en: "Guatemala", ja: "グアテマラ" },
  SLV: { ko: "엘살바도르", en: "El Salvador", ja: "エルサルバドル" },
  HND: { ko: "온두라스", en: "Honduras", ja: "ホンジュラス" },
  NIC: { ko: "니카라과", en: "Nicaragua", ja: "ニカラグア" },
  MEX: { ko: "멕시코", en: "Mexico", ja: "メキシコ" },
  JAM: { ko: "자메이카", en: "Jamaica", ja: "ジャマイカ" },
  COL: { ko: "콜롬비아", en: "Colombia", ja: "コロンビア" },
  BRA: { ko: "브라질", en: "Brazil", ja: "ブラジル" },
  PER: { ko: "페루", en: "Peru", ja: "ペルー" },
  ECU: { ko: "에콰도르", en: "Ecuador", ja: "エクアドル" },
  BOL: { ko: "볼리비아", en: "Bolivia", ja: "ボリビア" },
  IDN: { ko: "인도네시아", en: "Indonesia", ja: "インドネシア" },
  PNG: { ko: "파푸아뉴기니", en: "Papua New Guinea", ja: "パプアニューギニア" },
  VNM: { ko: "베트남", en: "Vietnam", ja: "ベトナム" },
  CHN: { ko: "중국 (운남)", en: "China (Yunnan)", ja: "中国 (雲南)" },
  IND: { ko: "인도", en: "India", ja: "インド" },
  TLS: { ko: "동티모르", en: "Timor-Leste", ja: "東ティモール" },
  YEM: { ko: "예멘", en: "Yemen", ja: "イエメン" },
  USA: { ko: "하와이 (미국)", en: "Hawaii (USA)", ja: "ハワイ (米国)" },
  HAW: { ko: "하와이 (미국)", en: "Hawaii (USA)", ja: "ハワイ (米国)" },
  FER: { ko: "특수발효 로트", en: "Experimental Fermented", ja: "特殊発酵ロット" },
  FLV: { ko: "가향·인퓨즈드", en: "Flavored & Infused", ja: "フレーバー・インフューズド" },
  BLD: { ko: "하우스 블렌드", en: "House Blend", ja: "ハウスブレンド" },
  BLEND: { ko: "하우스 블렌드", en: "House Blend", ja: "ハウスブレンド" }
};

// 30개 산지 도감 영문·일문 완역 사전 (EN/JP 원산지 서랍 한글 혼입 제거)
const ORIGIN_I18N_DETAILS = {
  ETH: { en: { flavor: "Jasmine, Peach, Lemon Tea, Berry", desc: "Birthplace of Arabica. Celebrated for floral aromatics and vibrant fruit juiciness without bitterness." }, ja: { flavor: "ジャスミン、桃、レモンティー、ベリー", desc: "アラビカ種発祥の地。華やかな花の香りと瑞々しい果実味が際立ちます。" } },
  KEN: { en: { flavor: "Grapefruit, Blackcurrant, Red Wine, Orange", desc: "SL28 & SL34 double-washed lots delivering sparkling citrus acidity and wine-like structure." }, ja: { flavor: "グレープフルーツ、カシス、赤ワイン、オレンジ", desc: "SL28・SL34と二重水洗精製が生む鮮やかな柑橘酸味と重厚なワイン感。" } },
  RWA: { en: { flavor: "Green Apple, Grapefruit Marmalade, Honey, Pomegranate", desc: "High-altitude volcanic Red Bourbon known for crisp apple acidity and delicate honey sweetness." }, ja: { flavor: "青りんご、グレープフルーツ、蜂蜜、ザクロ", desc: "高地火山土壌のレッドブルボン。爽やかな林檎の酸味と優しい蜂蜜の甘み。" } },
  BDI: { en: { flavor: "Orange Marmalade, Cinnamon, Fig Tea", desc: "East African heartland offering warm black-tea aromatics and layered fruit sweetness." }, ja: { flavor: "オレンジマーマレード、シナモン、無花果紅茶", desc: "二重発酵ウォッシュトやハニー精製による温かい紅茶感と果実の甘み。" } },
  TZA: { en: { flavor: "Plum, Red Wine, Blackberry, Peaberry", desc: "Kilimanjaro and Mbeya highlands producing structured, winey cups with deep berry richness." }, ja: { flavor: "プラム、赤ワイン、ブラックベリー、ピーベリー", desc: "キリマンジャロとンベヤ高地が育む、ワインのように骨格のある深い果実味。" } },
  UGA: { en: { flavor: "Raisin, Dark Cherry, Brown Sugar, Cacao", desc: "Mt. Elgon and Rwenzori Arabica known for mellow acidity and heavy brown-sugar sweetness." }, ja: { flavor: "レーズン、ダークチェリー、黒糖、カカオ", desc: "エルゴン山・ルウェンゾリ高地産。穏やかな酸味と黒糖のような深い甘み。" } },
  PAN: { en: { flavor: "Bergamot, Jasmine, White Peach, Gold Kiwi", desc: "Boquete and Volcan highlands—the global pinnacle of transparent, perfume-like Geisha." }, ja: { flavor: "ベルガモット、ジャスミン、白桃、キウイ", desc: "ボケテ・ボルカン高地のゲイシャの聖地。香水のように透明な花香と甘み。" } },
  CRI: { en: { flavor: "Green Grape, Acacia Honey, Cherry Wine", desc: "Home of White, Red, and Black Honey processing with golden SHB balance and clean sweetness." }, ja: { flavor: "マスカット、アカシア蜂蜜、チェリーワイン", desc: "ハニー精製の本場。SHB高地豆ならではの透明な酸味と黄金のバランス。" } },
  GTM: { en: { flavor: "Dark Chocolate, Roasted Almond, Orange Blossom", desc: "Volcanic SHB highlands ranging from classic cocoa richness to floral Geisha and Pacamara." }, ja: { flavor: "ダークチョコ、ローストアーモンド、オレンジ花", desc: "火山土壌が育むSHB等級。深いチョコの香ばしさから華やかなゲイシャまで。" } },
  SLV: { en: { flavor: "Almond Butter, Toast, Plum Candy, Maple", desc: "Cradle of classic Bourbon and Pacamara with creamy mouthfeel and maple-like sweetness." }, ja: { flavor: "アーモンドバター、トースト、プラム、メープル", desc: "ブルボンとパカマラの名産地。丸みのある質感とメープルシロップの甘み。" } },
  HND: { en: { flavor: "Green Apple, Caramel, Pineapple, Milk Chocolate", desc: "Santa Barbara and Marcala SHG lots balancing crisp tropical fruit with smooth caramel." }, ja: { flavor: "青りんご、キャラメル、パイナップル、ミルクチョコ", desc: "サンタバルバラ・マルカラ高地のSHG。爽やかな果実味と柔らかなキャラメル。" } },
  NIC: { en: { flavor: "Cacao Nibs, Ripe Banana, Almond Chocolate", desc: "Jinotega and Matagalpa highlands noted for giant Maragogipe and aromatic Java longberry." }, ja: { flavor: "カカオニブ、完熟バナナ、アーモンドチョコ", desc: "ヒノテガ・マタガルパのマラゴジペやジャバ種。厚みあるボディとチョコ風味。" } },
  MEX: { en: { flavor: "Roasted Pecan, Milk Chocolate, Orange Peel, Cinnamon", desc: "High-grown Chiapas and Oaxaca Altura lots with clean, light body and gentle nutty sweetness." }, ja: { flavor: "ローストピーカン、ミルクチョコ、オレンジピール", desc: "チアパス・オアハカ高地アルトゥーラ。軽やかでクリーンなナッツの甘み。" } },
  COL: { en: { flavor: "Walnut, Sugarcane, Pink Grapefruit, Peach Yogurt", desc: "Andean specialty hub spanning classic Supremo to Pink Bourbon, Chiroso, and experimental lots." }, ja: { flavor: "胡桃、サトウキビ、ピンクグレープフルーツ、桃", desc: "アンデス山脈の恵み。定番スプレモから希少品種・先端発酵ロットまで多彩。" } },
  BRA: { en: { flavor: "Roasted Peanut, Barley Tea, Hazelnut, White Chocolate", desc: "World's largest origin offering low-acid nutty comfort alongside rare low-caf Laurina and Arara." }, ja: { flavor: "焙煎ピーナッツ、麦茶、ヘーゼルナッツ、白チョコ", desc: "世界最大の生産国。酸味控えめな香ばしさに加え、低カフェイン品種ローリナも。" } },
  PER: { en: { flavor: "Dried Apple, Mild Walnut, White Peach, Lemon Verbena", desc: "Organic Andean highlands in Cajamarca and Chanchamayo famed for clean sweetness and Geisha." }, ja: { flavor: "ドライアップル、胡桃、白桃、レモンバーベナ", desc: "アンデス高地の有機栽培産地。雑味のない甘みと急成長する高地ゲイシャ。" } },
  ECU: { en: { flavor: "Green Tea, Crisp Apple, Mangosteen, Jasmine", desc: "Equatorial Andean treasure trove of championship Sidra and Typica Mejorado cultivars." }, ja: { flavor: "緑茶、青りんご、マンゴスチン、ジャスミン", desc: "赤道アンデス高地。世界大会優勝品種シドラやティピカ・メホラドの宝庫。" } },
  BOL: { en: { flavor: "Acacia Blossom, Honey Water, Pineapple, Macadamia", desc: "Caranavi and Samaipata high-altitude lots prized for pristine clarity and delicate sweetness." }, ja: { flavor: "アカシアの花、蜂蜜、パイナップル、マカダミア", desc: "カラナビ・サマイパタ高地産。透明感あふれるクリーンな甘みと長い余韻。" } },
  YEM: { en: { flavor: "Raisin Wine, Dark Chocolate, Cardamom, Plum", desc: "Historic origin of Mocha coffee; terrace-dried Yemenia lots with mystical wine and spice depth." }, ja: { flavor: "レーズンワイン、ダークチョコ、カルダモン、プラム", desc: "モカの歴史的起源。段々畑で自然乾燥されたイエメニア種の神秘的な香味。" } },
  JAM: { en: { flavor: "Milk Chocolate, Pecan Butter, Silky Balance", desc: "Iconic Blue Mountain No.1 celebrated for effortless harmony across acidity, sweetness, and body." }, ja: { flavor: "ミルクチョコ、ピーカンバター、シルキーな調和", desc: "世界三大銘豆ブルーマウンテン。酸味・甘み・苦味が絹のように調和します。" } },
  USA: { en: { flavor: "Macadamia, Bright Floral, Butterscotch, Pecan", desc: "Volcanic island coffees from Kona, Ka'u, and Maui with buttery macadamia richness." }, ja: { flavor: "マカダミア、花香、バタースコッチ、ピーカン", desc: "ハワイ・コナ、カウ、マウイの火山土壌が育むバターのように香ばしい風味。" } },
  IDN: { en: { flavor: "90% Cacao, Cedar, Orange Chocolate, Heavy Body", desc: "Sumatran Wet-Hulled Mandheling and Toraja depth alongside fruity Bali Kintamani Naturals." }, ja: { flavor: "カカオ90%、杉木、オレンジチョコ、重厚ボディ", desc: "スマトラ式マンデリン・トラジャの重厚感と、バリ火山ナチュラルの果実味。" } },
  PNG: { en: { flavor: "Tropical Mango, Guava, Roasted Nuts, Sugarcane", desc: "Volcanic highland estates growing Blue Mountain Typica and Arusha with tropical sweetness." }, ja: { flavor: "マンゴー、グァバ、焙煎ナッツ、サトウキビ", desc: "ブルーマウンテン系ティピカを火山土壌で栽培。南国果実の甘みと香ばしさ。" } },
  VNM: { en: { flavor: "Poached Pear Wine, Dark Cacao, Salted Caramel", desc: "Highland Da Lat Arabica and CQI-certified Fine Robusta redefining Asian specialty coffee." }, ja: { flavor: "洋梨ワイン、ダークカカオ、塩キャラメル", desc: "ダラット高地アラビカとCQI認定ファインロブスタが切り拓くアジア新世代。" } },
  CHN: { en: { flavor: "Plum Pudding, Pu'er & Black Tea, Cherry Chocolate", desc: "Yunnan highlands (Baoshan, Pu'er, Lincang) crafting tea-like honey and yeast-fermented lots." }, ja: { flavor: "プラムプリン、プーアル茶・紅茶、チェリーチョコ", desc: "雲南省高地（保山・普洱・臨滄）。紅茶のような甘みと発酵ロットで注目。" } },
  IND: { en: { flavor: "Roasted Peanut, Pepper Spice, Dark Chocolate, Zero Acid", desc: "Shade-grown Bababudangiri and Monsooned Malabar lots known for ultra-low acidity and spice." }, ja: { flavor: "焙煎ピーナッツ、スパイス、ダークチョコ、無酸味", desc: "モンスーン・マラバールや高地シェード栽培による酸味控えめな重厚感。" } },
  TLS: { en: { flavor: "Wildflower Honey, Hazelnut, Fig, Barley Tea", desc: "Birthplace of Hibrido de Timor; organic shade-grown highlands with gentle, clean sweetness." }, ja: { flavor: "野花蜂蜜、ヘーゼルナッツ、無花果、麦茶", desc: "ティモール・ハイブリッド発祥の地。有機野生栽培の穏やかで優しい甘み。" } },
  FER: { en: { flavor: "Peach Yogurt, Lychee, Mango Lassi, Passionfruit", desc: "Precision microbial and thermal fermentation (Anaerobic, Thermal Shock, Koji, CM) fruit bombs." }, ja: { flavor: "ピーチヨーグルト、ライチ、マンゴー、パッションフルーツ", desc: "嫌気性・サーマルショック・麹発酵など精密な発酵制御で引き出す濃厚果実味。" } },
  FLV: { en: { flavor: "Hazelnut, Vanilla, Mint Choco, Whisky, Citrus", desc: "Botanical infusions and oak barrel-aged specialty coffees crafted for dessert-like enjoyment." }, ja: { flavor: "ヘーゼルナッツ、バニラ、ミントチョコ、ウイスキー", desc: "天然ボタニカルや樽熟成（バレルエイジド）で楽しむデザート系コーヒー。" } },
  BLD: { en: { flavor: "Dark Chocolate, Almond, Honey Milk, Citrus", desc: "Master roastery multi-origin blends engineered for reliable everyday balance." }, ja: { flavor: "ダークチョコ、アーモンド、蜂蜜ミルク、シトラス", desc: "異なる産地の長所を掛け合わせ、毎日飲みたくなる調和を追求したブレンド。" } }
};

// 실존 농장·워싱스테이션 검증 완료 42종 오버라이드 사전 (기존 22종 + Phase 1 교차 검증 20종)
const BEAN_TRACEABILITY_OVERRIDES = {
  "eth-01": {
    authenticityType: "ESTATE_LOT",
    producerName: "Abaya Agro Industry / Guji Highland Growers",
    estateOrStation: "Abaya Washing Station (Guji Zone)",
    tradeSearchQuery: { ko: "에티오피아 구지 아바야 게이샤 내추럴 원두", en: "Ethiopia Guji Abaya Geisha Natural coffee", ja: "エチオピア グジ アバヤ ゲイシャ ナチュラル" },
    source: { label: "World Coffee Research — Ethiopian Landrace & Geisha Reference", url: "https://varieties.worldcoffeeresearch.org/" },
    i18n: {
      "en": {
            "headline": "Elegant white peach, sweet jasmine blossom, and bergamot citrus nectar",
            "guide": "Single-estate Guji highland lot by Abaya Agro Industry. Shines with tea-like clarity, white peach sweetness, and delicate floral aromatics.",
            "sourDesc": "Bright, juicy white peach and citrus acidity",
            "nuttyDesc": "Clean floral sweetness with zero roasted bitterness",
            "bodyDesc": "Delicate and refreshing, reminiscent of steeped herbal tea"
      },
      "ja": {
            "headline": "白桃の優雅な甘みとジャスミン花香が織りなす極上の果汁感",
            "guide": "アバヤ・アグロ社によるグジ高地産ナチュラル。ハーブティーのように透き通る質感に華やかな花香と白桃の甘みが長く続きます。",
            "sourDesc": "甘酸っぱく瑞々しい白桃の酸味",
            "nuttyDesc": "雑味のないクリーンで華やかな余韻",
            "bodyDesc": "ハーブティーのように軽やかで透明感のある質感"
      }
}
  },
  "eth-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "SNAP Specialty Coffee / Danche Chelbesa Smallholders",
    estateOrStation: "Chelbesa Washing Station (Gedeb, Yirgacheffe)",
    tradeSearchQuery: { ko: "에티오피아 게뎁 첼베사 워시드 원두", en: "Ethiopia Gedeb Chelbesa Washed coffee", ja: "エチオピア ゲデブ チェルベサ ウォッシュト" },
    source: { label: "SCA Coffee Value Assessment — Gedeb Chelbesa Reference", url: "https://sca.coffee/value-assessment" },
    i18n: {
      "en": {
            "headline": "Silky apricot, honeysuckle, and candied citrus with refined floral clarity",
            "guide": "High-altitude Danche Chelbesa lot by SNAP Specialty Coffee. Highlights crisp apricot acidity paired with translucent acacia honey sweetness.",
            "sourDesc": "Refined apricot and Meyer lemon acidity",
            "nuttyDesc": "Pristine cup finish with soft honeyed warmth",
            "bodyDesc": "Light and tea-like, smooth across the palate"
      },
      "ja": {
            "headline": "アプリコットとアカシア蜂蜜の上品で澄み切った余韻",
            "guide": "スナップ・スペシャルティによるゲデブ・チェルベサ水洗ロット。上品なアプリコットの酸味と澄んだ蜂蜜の甘みが調和した洗練の一杯です。",
            "sourDesc": "上品でやさしいアプリコットの酸味",
            "nuttyDesc": "雑味なく滑らかに続く蜂蜜の甘み",
            "bodyDesc": "軽やかで澄んだ紅茶のような口当たり"
      }
}
  },
  "eth-04": {
    authenticityType: "ESTATE_LOT",
    producerName: "METAD Agricultural Development (Aman Adinew)",
    estateOrStation: "Hambela Alaka Estate & Washing Station (Guji)",
    tradeSearchQuery: { ko: "에티오피아 구지 함벨라 내추럴 원두", en: "Ethiopia Guji Hambela Natural METAD coffee", ja: "エチオピア グジ ハンベラ ナチュラル" },
    source: { label: "METAD Hambela Estate — SCA Reference", url: "https://sca.coffee/value-assessment" },
    i18n: {
      "en": {
            "headline": "Explosive ripe strawberry jam, dried blueberry, and dark grape sweetness",
            "guide": "Renowned METAD Hambela Alaka estate natural by Aman Adinew. Bursting with deep berry compote, sparkling malic acidity, and velvet sweetness.",
            "sourDesc": "Sparkling strawberry and wild blueberry vibrancy",
            "nuttyDesc": "Deep candied sweetness with soft cocoa undertones",
            "bodyDesc": "Smooth and juicy, akin to natural grape juice"
      },
      "ja": {
            "headline": "濃厚なストロベリージャムと完熟ブルーベリーが溢れるベリー感",
            "guide": "アマン・アディネウ率いるMETADハンベラ農園の代表作。果実味豊かなベリーコンポートの甘みとジューシーな果汁感が際立ちます。",
            "sourDesc": "濃厚で甘美なストロベリーの酸味",
            "nuttyDesc": "カカオの深みを伴う甘い余韻",
            "bodyDesc": "グレープジュースのように滑らかでジューシーな口当たり"
      }
}
  },
  "eth-05": {
    authenticityType: "ESTATE_LOT",
    producerName: "Daye Bensa Coffee (Asefa & Mulugeta Dukamo)",
    estateOrStation: "Shantawene / Bombe Washing Station (Sidama Bensa)",
    tradeSearchQuery: { ko: "에티오피아 시다마 벤사 무산소 원두", en: "Ethiopia Sidama Bensa Daye Bensa Anaerobic coffee", ja: "エチオピア シダマ ベンサ 嫌気性発酵" },
    source: { label: "Daye Bensa Coffee — Sidama Bensa Reference", url: "https://sca.coffee/value-assessment" },
    i18n: {
      "en": {
            "headline": "Exotic passion fruit, blood orange, and sweet tropical wine aromatics",
            "guide": "Cup of Excellence-winning Daye Bensa lot from Shantawene. Controlled anaerobic tank fermentation unlocks explosive tropical fruit and syrupy body.",
            "sourDesc": "Tropical passion fruit and blood orange brightness",
            "nuttyDesc": "Complex sweet winey finish with roasted hazelnut hints",
            "bodyDesc": "Velvety and round, coating the palate smoothly"
      },
      "ja": {
            "headline": "パッションフルーツとブラッドオレンジが香るトロピカル発酵ロット",
            "guide": "ダエ・ベンサ（シャンタウェネ精製所）による嫌気性発酵ロット。完熟トロピカルフルーツの鮮烈な風味とシロップのような甘みが特徴です。",
            "sourDesc": "鮮やかなパッションフルーツの酸味",
            "nuttyDesc": "フルーティーなワインとローストナッツの余韻",
            "bodyDesc": "丸みを帯びたまろやかでベルベットのような舌触り"
      }
}
  },
  "eth-06": {
    authenticityType: "ESTATE_LOT",
    producerName: "Worka Sakaro Kebele Smallholder Farmers (300–600 Growers)",
    estateOrStation: "Worka Sakaro Washing Station (Gedeb, Gedeo Zone)",
    tradeSearchQuery: { ko: "에티오피아 게뎁 워르카 사카로 무산소 원두", en: "Ethiopia Gedeb Worka Sakaro Anaerobic Natural coffee", ja: "エチオピア ゲデブ ウォルカ サカロ 嫌気性" },
    source: { label: "Ally Coffee — Gedeb Worka Sakaro Origin Profile", url: "https://www.allycoffee.com/" },
    i18n: {
      "en": {
            "headline": "Juicy black currant, candied purple grape, and lavender floral perfume",
            "guide": "Carefully selected smallholder lot from Worka Sakaro in Gedeb. Anaerobic cherry conditioning produces rich berry brightness and perfumed floral depth.",
            "sourDesc": "Vibrant black currant and purple fruit acidity",
            "nuttyDesc": "Delicate sweetness with subtle roasted almond tones",
            "bodyDesc": "Silky and juice-like with lingering sweetness"
      },
      "ja": {
            "headline": "カシスと巨峰のジューシーな果実味とラベンダーの花香",
            "guide": "ゲデブ・ウォルカ・サカロの小規模農家選別ロット。無酸素発酵により凝縮されたカシスや紫ブドウの果汁感と芳醇な花香が広がります。",
            "sourDesc": "鮮烈でジューシーなカシスの酸味",
            "nuttyDesc": "ほのかに香ばしいアーモンドと甘い余韻",
            "bodyDesc": "果汁のように瑞々しくシルキーな質感"
      }
}
  },
  "eth-08": {
    authenticityType: "ESTATE_LOT",
    producerName: "Adam Overton & Rachel Samuel",
    estateOrStation: "Gesha Village Coffee Estate (Bench Maji, Southwest Ethiopia)",
    tradeSearchQuery: { ko: "에티오피아 벤치 마지 게샤 빌리지 내추럴 원두", en: "Ethiopia Bench Maji Gesha Village Estate Natural", ja: "エチオピア ベンチマジ ゲシャ・ビレッジ農園" },
    source: { label: "Gesha Village Coffee Estate Official", url: "https://www.geshavillage.com/the-village/" },
    i18n: {
      "en": {
            "headline": "Wild strawberry liqueur, violet florals, and dense dark honey sweetness",
            "guide": "Harvested from the wild ancestral Gori Gesha forest at Gesha Village by Adam Overton and Rachel Samuel. Showcases floral elegance paired with rare velvety body.",
            "sourDesc": "Rich strawberry wine and berry acidity",
            "nuttyDesc": "Subtle roasted cacao nib undertones",
            "bodyDesc": "Velvety and coating, akin to creamy whole milk"
      },
      "ja": {
            "headline": "野生の原種林から届くストロベリーリキュールとスミレの花香",
            "guide": "ゲシャ・ビレッジ農園（アダム・オーバートン＆レイチェル・サミュエル夫妻）による最高峰ロット。高貴なフローラル香に加え、ミルクチョコレートのような重厚なコクが際立ちます。",
            "sourDesc": "濃密なベリーとストロベリーの甘酸っぱさ",
            "nuttyDesc": "ほのかに香る上質なカカオニブのアクセント",
            "bodyDesc": "ミルクやココアのように滑らかでとろみのある口当たり"
      }
}
  },
  "ken-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Barichu Farmers' Cooperative Society (500+ Smallholders)",
    estateOrStation: "Karindundu Coffee Factory (Nyeri County, Kenya)",
    tradeSearchQuery: { ko: "케냐 녜리 카린둔두 AA 워시드 원두", en: "Kenya Nyeri Karindundu AA Barichu Cooperative coffee", ja: "ケニア ニエリ カリンドゥンドゥ AA" },
    source: { label: "Covoya Specialty Coffee — Barichu / Karindundu Factory", url: "https://www.covoyacoffee.com/" },
    i18n: {
      "en": {
            "headline": "Sparkling black currant, tart red plum, and crisp grapefruit acidity",
            "guide": "Highland Nyeri lot from Karindundu factory, Rutuma FCS. 72-hour double-fermentation and glacier wash produce piercing fruit acidity and brown sugar depth.",
            "sourDesc": "Piercing black currant and red plum brilliance",
            "nuttyDesc": "Deep cane sugar and toffee sweetness with zero harshness",
            "bodyDesc": "Full and syrupy with clean fruit juiciness"
      },
      "ja": {
            "headline": "カシスと赤プラムの力強い果汁感と輝くような酸味",
            "guide": "ニエリ高地カランドゥンドゥ水洗所（ルトゥマ農協）のダブルウォッシュト。72時間の丁寧な発酵により、圧倒的なベリーの酸味と黒糖のようなコクが引き出されています。",
            "sourDesc": "鮮烈でジューシーなカシスの明るい酸味",
            "nuttyDesc": "豊かな黒糖とトフィーのコク深い甘み",
            "bodyDesc": "濃厚でシロップのように力強い質感"
      }
}
  },
  "rwa-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Alexis Gahizi & Aimé Dusabe Gahizi (1,400+ Smallholders)",
    estateOrStation: "Gitesi Coffee Washing Station (Karongi District, Western Province / Lake Kivu)",
    tradeSearchQuery: { ko: "르완다 기테시 레드버본 내추럴 원두", en: "Rwanda Gitesi Washing Station Red Bourbon Natural coffee", ja: "ルワンダ ギテシ精製所 レッドブルボン ナチュラル" },
    source: { label: "Gitesi Coffee Washing Station Official", url: "https://www.gitesicoffee.com/" },
    i18n: {
      "en": {
            "headline": "Dried cherry, sweet mandarin orange, and floral black tea finish",
            "guide": "Lake Kivu coastal lot from Gitesi washing station (Aime Gahizi). Expert natural processing brings out sweet cherry syrup and smooth black tea texture.",
            "sourDesc": "Gentle red cherry and sweet citrus acidity",
            "nuttyDesc": "Pleasant roasted hazelnut and caramel sweetness",
            "bodyDesc": "Silky and rounded, coating the mouth pleasantly"
      },
      "ja": {
            "headline": "ダークチェリーと温州みかんの甘み、華やかな紅茶の余韻",
            "guide": "キブ湖畔ギテシ精製所（エイメ・ガヒジ氏）のナチュラルロット。天日乾燥によるチェリーシロップのような甘みと紅茶の滑らかな質感が心地よく続きます。",
            "sourDesc": "チェリーやみかんの穏やかで甘い酸味",
            "nuttyDesc": "キャラメルとヘーゼルナッツの香ばしい甘み",
            "bodyDesc": "丸みがあり滑らかで心地よい口当たり"
      }
}
  },
  "bur-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Jean-Clément Birabereye (SEGEC) & Kayanza Smallholders",
    estateOrStation: "Mpanga Coffee Washing Station (Kayanza Province, Burundi)",
    tradeSearchQuery: { ko: "부룬디 카얀자 음팡가 허니 원두", en: "Burundi Kayanza Mpanga Washing Station Red Bourbon Honey", ja: "ブルンジ カヤンザ ムパンガ精製所 ハニー" },
    source: { label: "Victrola Coffee — Mpanga Washing Station Origin Notes", url: "https://www.victrolacoffee.com/" },
    i18n: {
      "en": {
            "headline": "Golden honey, ripe red apple, and caramelized pecan sweetness",
            "guide": "Kayanza specialty lot from Mpanga washing station by Jean-Clement Birabereye. Red honey mucilage drying yields luscious apple cider notes and pecan sweetness.",
            "sourDesc": "Crisp red apple and stone fruit acidity",
            "nuttyDesc": "Rich roasted pecan and caramelized honey depth",
            "bodyDesc": "Smooth, medium-bodied and velvety"
      },
      "ja": {
            "headline": "赤りんごと黄金蜂蜜のまろやかな甘み、ローストピーカンの香り",
            "guide": "カヤンツァ・ムパンガ精製所によるレッドハニー。果肉の甘みが豆に凝縮され、アップルサイダーのような爽やかさと香ばしいハニーナッツのコクを楽しめます。",
            "sourDesc": "赤りんごのような爽やかで甘い酸味",
            "nuttyDesc": "香ばしいピーカンナッツとキャラメルの深いコク",
            "bodyDesc": "滑らかでバランスの取れたベルベット質感"
      }
}
  },
  "bur-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Matsitsi Zuberi (Matsitsi Trading / Matraco) & 650 Smallholders",
    estateOrStation: "Businde Coffee Washing Station (Northern Burundi, Kayanza/Ngozi Border)",
    tradeSearchQuery: { ko: "부룬디 부신데 버본 워시드 원두", en: "Burundi Businde Washing Station Red Bourbon Washed", ja: "ブルンジ ブシンデ精製所 ブルボン ウォッシュト" },
    source: { label: "Sucafina Specialty — Businde Washing Station Profile", url: "https://www.sucafina.com/" },
    i18n: {
      "en": {
            "headline": "Cranberry nectar, black tea, and crystalline floral sweetness",
            "guide": "High-elevation lot from Businde washing station in Ngozi. Double fermentation washing ensures clean floral aromatics, tart red fruit, and pristine clarity.",
            "sourDesc": "Lively tart cranberry and red currant sparkle",
            "nuttyDesc": "Crisp and delicate without earthy heaviness",
            "bodyDesc": "Light and tea-like, exceptionally pure"
      },
      "ja": {
            "headline": "クランベリーと紅茶の透明感あふれるフローラルな味わい",
            "guide": "ンゴジ高地ブシンデ精製所のダブルウォッシュト。二重発酵水洗により引き出された透き通るクランベリーの酸味と紅茶の気品ある香りが魅力です。",
            "sourDesc": "爽快で鮮やかなクランベリーの酸味",
            "nuttyDesc": "雑味のないクリーンで繊細な甘い余韻",
            "bodyDesc": "ハーブティーのように軽快で澄み切った質感"
      }
}
  },
  "uga-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Kawacom Uganda Limited (ECOM) & Mt. Elgon Smallholders",
    estateOrStation: "Sipi Falls Washing Station (Kapchorwa / Bugisu, Mt. Elgon)",
    tradeSearchQuery: { ko: "우간다 부기수 시피 폴스 워시드 원두", en: "Uganda Bugisu Mt Elgon Sipi Falls Washed Kawacom coffee", ja: "ウガンダ ブギス シピフォールズ ウォッシュト" },
    source: { label: "Carvetii Coffee — Sipi Falls Washing Station Profile", url: "https://www.carvetiicoffee.co.uk/" },
    i18n: {
      "en": {
            "headline": "Sweet orange blossom, juicy plum, and smooth cocoa nib finish",
            "guide": "Sipi Falls specialty lot grown on volcanic slopes of Mount Elgon. Clean cascade washing enhances stone fruit sweetness and balanced cocoa mouthfeel.",
            "sourDesc": "Pleasant ripe plum and orange blossom brightness",
            "nuttyDesc": "Toasted almond and milk cocoa sweetness",
            "bodyDesc": "Balanced and silky, perfect for everyday enjoyment"
      },
      "ja": {
            "headline": "オレンジフラワーとプラムの甘酸っぱさ、滑らかなカカオの調和",
            "guide": "エルゴン山火山灰土壌のシピ滝周辺で育まれた水洗ロット。名水で磨かれたプラムの甘みとミルクココアのような優しいコクが調和しています。",
            "sourDesc": "プラムとオレンジの上品で穏やかな酸味",
            "nuttyDesc": "香ばしいアーモンドとミルクココアの甘み",
            "bodyDesc": "バランスよく滑らかなデイリー向きの質感"
      }
}
  },
  "pan-01": {
    authenticityType: "ESTATE_LOT",
    producerName: "Peterson Family (Price & Rachel Peterson)",
    estateOrStation: "Hacienda La Esmeralda (Jaramillo / Cañas Verdes, Boquete)",
    tradeSearchQuery: { ko: "파나마 에스메랄다 게이샤 워시드 원두", en: "Panama Hacienda La Esmeralda Geisha Washed", ja: "パナマ エスメラルダ ゲイシャ ウォッシュト" },
    source: { label: "WCR Varieties — Geisha & Hacienda La Esmeralda", url: "https://varieties.worldcoffeeresearch.org/varieties/geisha" },
    i18n: {
      "en": {
            "headline": "Bergamot citrus, white jasmine petals, and crystal-clear stone fruit sweetness",
            "guide": "Historic Hacienda La Esmeralda Private Collection Geisha by the Peterson family. The legendary benchmark of Geisha elegance with transcendent floral perfume.",
            "sourDesc": "Sublime bergamot and sparkling lemon blossom brilliance",
            "nuttyDesc": "Pristine sweet clarity with absolutely zero roast bitterness",
            "bodyDesc": "Silky, delicate and tea-like, floating on the tongue"
      },
      "ja": {
            "headline": "ベルガモットと白ジャスミンの気品あふれる伝説のゲイシャ",
            "guide": "ピーターソン家率いる名門エスメラルダ農園のプライベートコレクション。世界を魅了した元祖ゲイシャの芳醇な花香とベルガモットの透明感が際立ちます。",
            "sourDesc": "気品あるベルガモットとレモンフラワーの明るい酸味",
            "nuttyDesc": "焙煎の苦味を一切感じさせない清らかな甘み",
            "bodyDesc": "シルクのように繊細で優美なティーライク質感"
      }
}
  },
  "pan-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Wilford Lamastus & Lamastus Family Estates",
    estateOrStation: "Elida Estate (Alto Quiel, Boquete)",
    tradeSearchQuery: { ko: "파나마 엘리다 게이샤 내추럴 원두", en: "Panama Elida Estate Geisha Natural Lamastus", ja: "パナマ エリダ農園 ゲイシャ ナチュラル" },
    source: { label: "WCR Varieties — Geisha & Elida Estate", url: "https://varieties.worldcoffeeresearch.org/varieties/geisha" },
    i18n: {
      "en": {
            "headline": "Lush white peach, dried mango, and concentrated tropical fruit sweetness",
            "guide": "World-renowned Elida Estate Geisha by the Lamastus family. Boasts multi-layered tropical nectar, sparkling acidity, and a juice-like finish.",
            "sourDesc": "Sparkling tropical peach and pineapple vibrancy",
            "nuttyDesc": "Clean sweet finish with zero roast bitterness",
            "bodyDesc": "Juicy, mouth-coating nectar texture"
      },
      "ja": {
            "headline": "完熟した白桃とマンゴーが織りなす濃厚なトロピカル果汁感",
            "guide": "ボケテの名門ラマスタス・ファミリー（エリダ農園）による世界的名品。マンゴーや白桃の芳醇な甘みと果汁のようなジューシーな質感が長く続きます。",
            "sourDesc": "鮮やかなピーチとパイナップルの明るい酸味",
            "nuttyDesc": "雑味のないクリーンで甘い余韻",
            "bodyDesc": "フルーツジュースのように果汁感あふれる口当たり"
      }
}
  },
  "pan-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Janson Family (Carl, Michael & Jannette Janson)",
    estateOrStation: "Janson Coffee Farm (Volcán Barú, Chiriquí)",
    tradeSearchQuery: { ko: "파나마 잔슨 게이샤 카보닉 마세레이션 원두", en: "Panama Janson Estate Geisha Carbonic Maceration", ja: "パナマ ジャンソン農園 ゲイシャ" },
    source: { label: "WCR Varieties — Geisha & Janson Coffee Farm", url: "https://varieties.worldcoffeeresearch.org/varieties/geisha" },
    i18n: {
      "en": {
            "headline": "Candied strawberry, violet perfume, and sparkling champagne effervescence",
            "guide": "Lot 63 Geisha from Janson Coffee Farm in Volcan. Carbonic maceration inside sealed stainless steel tanks creates vibrant berry perfume and champagne-like lift.",
            "sourDesc": "Effervescent strawberry and red currant sparkle",
            "nuttyDesc": "Delicate cocoa butter and sweet violet aromatics",
            "bodyDesc": "Velvety and smooth with lingering effervescent finish"
      },
      "ja": {
            "headline": "ストロベリーキャンディとシャンパンのような華やかな発泡感",
            "guide": "ボルカン・ジャンソン農園の炭酸浸漬発酵ロット。ステンレスタンクでの密閉発酵により、苺の甘みとシャンパンのような華やかなアロマが立ち上ります。",
            "sourDesc": "苺とレッドカラントの弾けるような酸味",
            "nuttyDesc": "ココアバターの滑らかさとスミレの上品な香り",
            "bodyDesc": "滑らかでベルベットのように優雅な口当たり"
      }
}
  },
  "cos-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Oscar & Francisca Chacón",
    estateOrStation: "Finca Las Lajas Micromill (Sabanilla de Alajuela)",
    tradeSearchQuery: { ko: "코스타리카 라스 라하스 블랙 다이아몬드 내추럴 원두", en: "Costa Rica Las Lajas Micromill Black Diamond Natural", ja: "コスタリカ ラス・ラハス ブラックダイアモンド" },
    source: { label: "Cafe Imports — Las Lajas Micromill Black Diamond Lot", url: "https://www.cafeimports.com/australia/offerings.php?view=beanology.view.las-lajas-micromill-finca-calle-liles-villa-sarchi-black-diamond-natural-21205" },
    i18n: {
      "en": {
            "headline": "Blackberry compote, bittersweet dark cacao, and dense black honey sweetness",
            "guide": "Organic specialty lot from Las Lajas micromill by Oscar and Francisca Chacon. Black Diamond slow-drying preserves intense dark berry notes and molasses sweetness.",
            "sourDesc": "Mellow blackberry and concord grape acidity",
            "nuttyDesc": "Rich roasted cacao nibs and dark caramel",
            "bodyDesc": "Full-bodied, dense and syrupy"
      },
      "ja": {
            "headline": "完熟ブラックベリーとダークカカオの重厚なブラックハニー",
            "guide": "ラス・ラハス精製所（オスカー＆フランシスカ夫妻）のブラックダイヤモンド。特別な日陰スロードライにより、黒ブドウの凝縮した甘みと濃厚なカカオ感が生まれます。",
            "sourDesc": "ブラックベリーの芳醇でまろやかな酸味",
            "nuttyDesc": "カカオニブと黒糖の深みある香ばしさ",
            "bodyDesc": "濃厚でシロップのようにどっしりとしたコク"
      }
}
  },
  "cos-04": {
    authenticityType: "ESTATE_LOT",
    producerName: "Francisco Mena (Exclusive Coffees)",
    estateOrStation: "Finca Sumava de Lourdes (Lourdes de Naranjo, West Valley)",
    tradeSearchQuery: { ko: "코스타리카 수마바 데 루르데스 파카마라 내추럴 원두", en: "Costa Rica Finca Sumava de Lourdes Francisco Mena Pacamara", ja: "コスタリカ スマバ・デ・ルルデス農園 パカマラ" },
    source: { label: "Stumptown Coffee — Finca Sumava de Lourdes Producer Profile", url: "https://www.stumptowncoffee.com/" },
    i18n: {
      "en": {
            "headline": "Ripe guava, dried apricot, and velvety sugarcane sweetness",
            "guide": "West Valley COE winner Sumava de Lourdes estate by Francisco Mena. Large Pacamara beans undergo anaerobic natural drying to produce exotic tropical depth.",
            "sourDesc": "Juicy guava and golden apricot brightness",
            "nuttyDesc": "Creamy sweet finish with roasted cashew notes",
            "bodyDesc": "Creamy and coating, rich on the tongue"
      },
      "ja": {
            "headline": "グアバと完熟アプリコット、黒糖の甘みが溶け合う大粒パカマラ",
            "guide": "ウエストバレーの名門スマバ農園（フランシスコ・メナ氏）の大粒パカマラ。無酸素発酵によりトロピカルフルーツの華やかな甘みとクリーミーなコクが引き出されています。",
            "sourDesc": "グアバやアプリコットのジューシーな酸味",
            "nuttyDesc": "カシューナッツのようなクリーミーで甘い余韻",
            "bodyDesc": "ミルクのように濃厚でまろやかな口当たり"
      }
}
  },
  "gtm-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Arturo Aguirre Sr. & Arturo Aguirre Jr.",
    estateOrStation: "Finca El Injerto (La Libertad, Huehuetenango)",
    tradeSearchQuery: { ko: "과테말라 엘 인헤르토 파카마라 원두", en: "Guatemala Finca El Injerto Pacamara Aguirre", ja: "グアテマラ エル・インヘルト パカマラ" },
    source: { label: "Finca El Injerto Official Estate (Huehuetenango)", url: "https://fincaelinjerto.com/" },
    i18n: {
      "en": {
            "headline": "Juicy red apple, roasted hazelnut, and crystalline cane sugar balance",
            "guide": "Legendary El Injerto estate Pacamara by the Aguirre family. Masterfully washed and aged to deliver explosive stone fruit acidity and creamy hazelnut sweetness.",
            "sourDesc": "Crisp red apple and sparkling peach acidity",
            "nuttyDesc": "Toasted hazelnut praline and brown sugar depth",
            "bodyDesc": "Round and creamy, beautifully structured"
      },
      "ja": {
            "headline": "赤りんごの果汁感と芳醇なヘーゼルナッツの極上パカマラ",
            "guide": "COE最多優勝を誇る名門エル・インヘルト農園（アギーレ家）の銘品。大粒パカマラ特有のりんごのような爽快な酸味とヘーゼルナッツプラリネの甘みが絶品です。",
            "sourDesc": "赤りんごや桃のジューシーで弾ける酸味",
            "nuttyDesc": "香ばしいヘーゼルナッツと黒糖の深いコク",
            "bodyDesc": "丸みがありクリーミーで完璧な構造美"
      }
}
  },
  "sal-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Aida Batlle",
    estateOrStation: "Finca Kilimanjaro (Ilamatepec Volcano, Santa Ana)",
    tradeSearchQuery: { ko: "엘살바도르 핀카 킬리만자로 아이다 바틀레 버본 원두", en: "El Salvador Finca Kilimanjaro Aida Batlle Kenya Process Bourbon", ja: "エルサルバドル フィンカ・キリマンジャロ アイダ・バトル" },
    source: { label: "WCR Varieties — Bourbon & Aida Batlle Selection", url: "https://varieties.worldcoffeeresearch.org/varieties/bourbon" },
    i18n: {
      "en": {
            "headline": "Pink grapefruit, golden raisin, and dark chocolate praline sweetness",
            "guide": "Aida Batlle's iconic Finca Kilimanjaro on Santa Ana volcano. Kenya-style double soak washing imparts vibrant citrus complexity and bittersweet chocolate depth.",
            "sourDesc": "Complex pink grapefruit and black currant brightness",
            "nuttyDesc": "Dark chocolate praline and toasted macadamia",
            "bodyDesc": "Juicy and structured, exceptionally clean"
      },
      "ja": {
            "headline": "ピンクグレープフルーツの輝きとダークチョコプラリネの気品",
            "guide": "アイダ・バトル氏のフィンカ・キリマンジャロ。サンタアナ火山の火山灰土壌でケニア式二重水洗を行い、シトラスの弾ける酸味とチョコのビタースイートなコクが融合しています。",
            "sourDesc": "ピンクグレープフルーツの洗練された酸味",
            "nuttyDesc": "ダークチョコプラリネとマカダミアの甘み",
            "bodyDesc": "ジューシーで構造のしっかりした上質な質感"
      }
}
  },
  "hon-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Marysabel Caballero & Moisés Herrera",
    estateOrStation: "Finca El Puente (Chinacla, Marcala / Santa Bárbara)",
    tradeSearchQuery: { ko: "온두라스 엘 푸엔테 마리사벨 카바예로 원두", en: "Honduras Finca El Puente Marysabel Caballero Moises Herrera", ja: "ホンジュラス エル・プエンテ農園 マリサベル" },
    source: { label: "WCR Varieties — Pacas & Finca El Puente", url: "https://varieties.worldcoffeeresearch.org/varieties/pacas" },
    i18n: {
      "en": {
            "headline": "Dried fig, dark honey, and velvety roasted almond warmth",
            "guide": "COE Champion Finca El Puente by Marysabel Caballero & Moises Herrera. Natural dried Pacas cherries yield lush dried fig sweetness and a warm nutty finish.",
            "sourDesc": "Mellow fig and baked apple acidity",
            "nuttyDesc": "Roasted almond and caramelized dark honey",
            "bodyDesc": "Smooth and velvety, comforting mouthfeel"
      },
      "ja": {
            "headline": "干しイチジクと濃密な蜂蜜、ローストアーモンドの温もり",
            "guide": "COE優勝農園エル・プエンテ（カバジェロ夫妻）。丁寧な天日乾燥により、熟したイチジクや焼きりんごの甘みとアーモンドの香ばしさが優しく広がります。",
            "sourDesc": "干しイチジクのようなまろやかで穏やかな酸味",
            "nuttyDesc": "ローストアーモンドと蜂蜜の甘美な香り",
            "bodyDesc": "滑らかでベルベットのように心地よい口当たり"
      }
}
  },
  "nic-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "La Bastilla Coffee Estates",
    estateOrStation: "Finca La Bastilla (Cerro Dantanlí Reserve, Jinotega)",
    tradeSearchQuery: { ko: "니카라과 라 바스티야 자바 내추럴 원두", en: "Nicaragua Jinotega La Bastilla Coffee Estates Java Natural", ja: "ニカラグア ラ・バスティージャ農園 ジャバ" },
    source: { label: "La Bastilla Coffee Estates Official", url: "https://www.bastillacoffee.com/" },
    i18n: {
      "en": {
            "headline": "Orange blossom, sweet melon, and creamy roasted macadamia depth",
            "guide": "Rainforest Alliance certified Finca La Bastilla by Martin Fischer. Long-bean Java cultivar natural drying yields silky floral sweetness and creamy nuttiness.",
            "sourDesc": "Gentle orange blossom and honeydew acidity",
            "nuttyDesc": "Creamy macadamia and sweet butterscotch",
            "bodyDesc": "Silky and balanced, rounded mouthfeel"
      },
      "ja": {
            "headline": "オレンジフラワーの清らかな香りとマカダミアナッツの滑らかさ",
            "guide": "ラ・バスティーヤ農園（マーティン・フィッシャー氏）のジャバ種ナチュラル。細長い希少品種ジャバの繊細な花香とメロンのような甘みが楽しめます。",
            "sourDesc": "オレンジフラワーやメロンのやさしい酸味",
            "nuttyDesc": "クリーミーなマカダミアとバタースコッチ",
            "bodyDesc": "滑らかでバランスの良いシルキーな質感"
      }
}
  },
  "jam-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Sharp Family (Coffee Traders Limited)",
    estateOrStation: "Clifton Mount Estate (Newcastle, St. Andrew, Blue Mountains)",
    tradeSearchQuery: { ko: "자메이카 블루마운틴 클리프튼 마운틴 피베리 원두", en: "Jamaica Blue Mountain Clifton Mount Estate Peaberry coffee", ja: "ジャマイカ ブルーマウンテン クリフトンマウント農園" },
    source: { label: "Coffee Traders Limited — Clifton Mount Estate Official", url: "https://www.ctljamaica.com/" },
    i18n: {
      "en": {
            "headline": "Silky milk chocolate, sweet orange peel, and crystal-clear hazelnut balance",
            "guide": "Historic Clifton Mount Estate Peaberry by the Sharp family. Rare round peaberry mutation delivers concentrated hazelnut sweetness and flawless silk balance.",
            "sourDesc": "Subtle sweet orange peel brightness without sharp sourness",
            "nuttyDesc": "Refined roasted hazelnut and silky milk chocolate",
            "bodyDesc": "Silky smooth, exceptionally round and harmonious"
      },
      "ja": {
            "headline": "ミルクチョコとオレンジピールの気品ある調和、希少ピーベリー",
            "guide": "ジャマイカ最古の名門クリフトン・マウント農園（シャープ家）のピーベリー。丸豆に凝縮されたヘーゼルナッツの甘みとシルクのような完璧な調和が堪能できます。",
            "sourDesc": "角のないオレンジピールの上品な甘酸っぱさ",
            "nuttyDesc": "洗練されたヘーゼルナッツとミルクチョコの風味",
            "bodyDesc": "シルクのように極めて滑らかで調和のとれた質感"
      }
}
  },
  "jam-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Mavis Bank Coffee Factory (JABLUM) & Blue Mountain Smallholders",
    estateOrStation: "Mavis Bank Coffee Factory (Mavis Bank, Blue Mountains)",
    tradeSearchQuery: { ko: "자메이카 블루마운틴 마비스 뱅크 원두", en: "Jamaica Blue Mountain Mavis Bank Coffee Factory JABLUM", ja: "ジャマイカ ブルーマウンテン メイビスバンク" },
    source: { label: "JABLUM — Mavis Bank Coffee Factory Official", url: "https://www.jablumcoffee.com/" },
    i18n: {
      "en": {
            "headline": "Dark chocolate truffle, dried stone fruit, and brown sugar velvet",
            "guide": "Rare experimental natural microlot from Mavis Bank Central Factory. Sun-drying Blue Mountain cherries enhances dark chocolate truffle and molasses richness.",
            "sourDesc": "Mild plum and dried fruit acidity",
            "nuttyDesc": "Rich chocolate truffle and dark brown sugar",
            "bodyDesc": "Velvety and coating, comforting and deep"
      },
      "ja": {
            "headline": "ショコラトリュフと黒糖の深み、希少なブルーマウンテン・ナチュラル",
            "guide": "メイビス・バンク水洗工場の限定ナチュラルロット。完熟チェリーを天日乾燥させることで、ブルーマウンテンに濃厚なチョコトリュフと黒糖の深みが加わりました。",
            "sourDesc": "プラムのような穏やかで控えめな酸味",
            "nuttyDesc": "濃厚なチョコトリュフと黒糖の深いコク",
            "bodyDesc": "ベルベットのように口内を包み込む重厚な質感"
      }
}
  },
  "col-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Sebastián Ramírez",
    estateOrStation: "Finca El Placer (Calarcá, Quindío)",
    tradeSearchQuery: { ko: "콜롬비아 엘 플라세르 세바스티안 라미레즈 워터멜론 원두", en: "Colombia Finca El Placer Sebastian Ramirez Watermelon", ja: "コロンビア エル・プラセール セバスチャン・ラミレス" },
    source: { label: "Kofio — Finca El Placer by Sebastián Ramírez", url: "https://www.kofio.co/coffee/colombia-el-placer-sebastian-ramirez-sheep-raven/16972" },
    i18n: {
      "en": {
            "headline": "Crisp watermelon candy, fresh mint, and sparkling tropical fruit punch",
            "guide": "Innovative lot from Finca El Placer by Sebastian Ramirez. Multi-stage yeast fermentation and watermelon infusion create an unprecedented juicy sensory explosion.",
            "sourDesc": "Vibrant watermelon and sparkling tropical acidity",
            "nuttyDesc": "Zero bitterness, pure candy-like sweetness",
            "bodyDesc": "Crisp and juicy, like chilled fruit juice"
      },
      "ja": {
            "headline": "完熟スイカキャンディとミントの爽快感、新時代のインフューズド",
            "guide": "フィンカ・エル・プラセール（セバスティアン・ラミレス氏）の話題作。低温酵母発酵とスイカ果汁インフュージョンにより、驚くほど鮮やかなスイカの風味が広がります。",
            "sourDesc": "スイカキャンディのような弾けるフルーツ酸味",
            "nuttyDesc": "苦味ゼロ、果汁飴のような透き通る甘み",
            "bodyDesc": "冷たいフルーツジュースのように爽快な口当たり"
      }
}
  },
  "col-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Diego Samuel Bermúdez Tapia",
    estateOrStation: "Finca El Paraíso (Piendamó, Cauca)",
    tradeSearchQuery: { ko: "콜롬비아 엘 파라이소 디에고 베르무데즈 피치 원두", en: "Colombia Finca El Paraiso Diego Samuel Bermudez Peach", ja: "コロンビア エル・パライソ ディエゴ・ベルムデス ピーチ" },
    source: { label: "The Coffee Quest — Diego Samuel Bermúdez & Finca El Paraíso", url: "https://www.thecoffeequest.com/diego-samuel-bermudez-cauca/" },
    i18n: {
      "en": {
            "headline": "Ripe peach yogurt, condensed milk sweetness, and floral Earl Grey finish",
            "guide": "Groundbreaking Finca El Paraiso lot by Diego Samuel Bermudez. Thermal shock and anaerobic bioreactor control deliver intense peach nectar and creamy yogurt aromatics.",
            "sourDesc": "Sweet ripe peach and yogurt acidity",
            "nuttyDesc": "Creamy condensed milk and vanilla sweetness",
            "bodyDesc": "Velvety, smooth, and juice-like"
      },
      "ja": {
            "headline": "白桃ヨーグルトとアールグレイの芳醇な香り、名作パライソ・ピーチ",
            "guide": "エル・パライソ農園（ディエゴ・サムエル・ベルムデス氏）の金字塔。熱衝撃（サーマルショック）発酵により、本物のピーチヨーグルトのような芳醇なアロマが立ち込めます。",
            "sourDesc": "完熟白桃とヨーグルトの心地よい酸味",
            "nuttyDesc": "練乳やバニラのようなクリーミーな甘い余韻",
            "bodyDesc": "ピーチネクターのように滑らかでジューシーな質感"
      }
}
  },
  "col-07": {
    authenticityType: "ESTATE_LOT",
    producerName: "Felipe Sardi & Elisa Madriñán",
    estateOrStation: "Finca La Palma & El Tucán (Zipacón, Cundinamarca)",
    tradeSearchQuery: { ko: "콜롬비아 라팔마 이 엘투칸 게이샤 원두", en: "Colombia La Palma y El Tucan Geisha coffee", ja: "コロンビア ラ・パルマ・イ・エル・トゥカン ゲイシャ" },
    source: { label: "La Palma & El Tucán Official Estate", url: "https://lapalmayeltucan.com/" },
    i18n: {
      "en": {
            "headline": "Green grape juice, white jasmine floral nectar, and candied lime finish",
            "guide": "World-renowned Geisha from La Palma y El Tucan by Felipe Sardi & Elisa Madrinan. Meticulous cherry natural drying yields crystalline green grape candy sweetness.",
            "sourDesc": "Sparkling green grape and candied lime brightness",
            "nuttyDesc": "Translucent floral sweetness with zero roast graininess",
            "bodyDesc": "Juicy and clean, like fresh fruit nectar"
      },
      "ja": {
            "headline": "マスカット果汁とジャスミン花香の煌めくような透明感",
            "guide": "ラ・パルマ・イ・エル・トゥカン農園の最高峰ゲイシャ。マスカットキャンディのような瑞々しい甘みとジャスミンの高貴な香りが口いっぱいに広がります。",
            "sourDesc": "マスカットやライムの弾けるような明るい酸味",
            "nuttyDesc": "透明感あふれるフローラルな甘い余韻",
            "bodyDesc": "搾りたての果汁のようにピュアでジューシーな質感"
      }
}
  },
  "col-08": {
    authenticityType: "ESTATE_LOT",
    producerName: "Wilton Benítez (Granja Paraíso 92) & Diego Bermúdez",
    estateOrStation: "Granja Paraíso 92 / Finca El Paraíso (Cauca & Huila)",
    tradeSearchQuery: { ko: "콜롬비아 서멀 쇼크 카스티요 윌튼 베니테즈 원두", en: "Colombia Thermal Shock Castillo Wilton Benitez Paraiso 92", ja: "コロンビア サーマルショック カスティージョ" },
    source: { label: "Black & White Roasters — Thermal Shock Process Collection", url: "https://www.blackwhiteroasters.com/collections/thermal-shock-process-coffee" },
    i18n: {
      "en": {
            "headline": "Dark cherry liqueur, cocoa nibs, and spiced plum wine sweetness",
            "guide": "Experimental Castillo lot from Finca El Paraiso by Diego Bermudez. Thermal shock processing unlocks rich spiced dark cherry sweetness from a resilient terroir variety.",
            "sourDesc": "Juicy dark cherry and plum acidity",
            "nuttyDesc": "Roasted cacao nibs and warm cinnamon sweetness",
            "bodyDesc": "Smooth and coating, like melted dark chocolate"
      },
      "ja": {
            "headline": "ダークチェリーリキュールとカカオニブ、奥深いスパイスの調和",
            "guide": "エル・パライソ農園のカスティージョ種サーマルショック。熱衝撃技術によってカスティージョのポテンシャルを極限まで高め、濃厚なチェリーとスパイスの余韻を生み出しました。",
            "sourDesc": "ダークチェリーやプラムのジューシーな酸味",
            "nuttyDesc": "カカオニブとシナモンの芳醇な香ばしさ",
            "bodyDesc": "溶かしたダークチョコのように滑らかな口当たり"
      }
}
  },
  "col-10": {
    authenticityType: "ESTATE_LOT",
    producerName: "Holguín Family (Finca Inmaculada)",
    estateOrStation: "Finca Inmaculada (Pichindé, Cali, Valle del Cauca)",
    tradeSearchQuery: { ko: "콜롬비아 인마쿨라다 유제니오이데스 원두", en: "Colombia Finca Inmaculada Coffea Eugenioides", ja: "コロンビア インマクラダ農園 エウゲニオイデス" },
    source: { label: "World Coffee Research — Rare Coffea Species Reference", url: "https://varieties.worldcoffeeresearch.org/" },
    i18n: {
      "en": {
            "headline": "Pure sugarcane juice, sweet honey water, and delicate chamomile tea",
            "guide": "Extremely rare Coffea Eugenioides from Finca Inmaculada. Naturally ultra-low in caffeine and bitterness, delivering pure sugarcane sweetness and chamomile floral tones.",
            "sourDesc": "Gentle, non-acidic sweet citrus touch",
            "nuttyDesc": "Zero bitterness, pure raw sugar and honeyed floral finish",
            "bodyDesc": "Light, silky, and tea-like"
      },
      "ja": {
            "headline": "サトウキビの搾り汁そのものの純粋な甘み、幻の原種ユジェニオイデス",
            "guide": "フィンカ・インマクラーダによる極めて希少な野生原種ユジェニオイデス。苦味成分が極めて少なく、純粋なサトウキビの糖度とカモミールのような優しい甘みが広がります。",
            "sourDesc": "酸味を感じさせない穏やかで甘いシトラス感",
            "nuttyDesc": "苦味ゼロ、黒糖蜜と蜂蜜の澄んだ甘み",
            "bodyDesc": "ハーブティーのように軽快でシルキーな口当たり"
      }
}
  },
  "bra-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Luis Pascoal & Daterra Coffee Agronomic Team",
    estateOrStation: "Daterra Estate (Patrocínio, Cerrado Mineiro)",
    tradeSearchQuery: { ko: "브라질 다테라 스위트 컬렉션 원두", en: "Brazil Daterra Estate Sweet Collection coffee", ja: "ブラジル ダテラ農園 スイートコレクション" },
    source: { label: "Daterra Coffee — Cerrado Mineiro Reference", url: "https://sca.coffee/value-assessment" },
    i18n: {
      "en": {
            "headline": "Roasted hazelnut cream, caramel toffee, and dark chocolate praline",
            "guide": "Rainforest Alliance certified Sweet Collection from Daterra Estate. Pulped natural processing maximizes sweet hazelnut paste, creamy caramel, and milk chocolate body.",
            "sourDesc": "Low acidity, gentle ripe sweet apple note",
            "nuttyDesc": "Intense roasted hazelnut, toffee, and praline",
            "bodyDesc": "Thick, creamy, and round, coating the palate"
      },
      "ja": {
            "headline": "ローストヘーゼルナッツと濃厚キャラメル、至高のダテラ・スイート",
            "guide": "持続可能農業の旗手ダテラ農園のシグネチャー『スイートコレクション』。パルプドナチュラルにより、ヘーゼルナッツプラリネとキャラメルの濃厚な甘みが楽しめます。",
            "sourDesc": "酸味は極めて控えめ、完熟りんごのやさしい甘み",
            "nuttyDesc": "濃厚なヘーゼルナッツとキャラメルの香ばしさ",
            "bodyDesc": "ミルクのように厚みがあり丸く豊かな口当たり"
      }
}
  },
  "bra-04": {
    authenticityType: "ESTATE_LOT",
    producerName: "Luis Pascoal & Daterra Masterpieces Program",
    estateOrStation: "Daterra Estate (Patrocínio, Cerrado Mineiro)",
    tradeSearchQuery: { ko: "브라질 다테라 로리나 버본 포인투 저카페인 원두", en: "Brazil Daterra Laurina Bourbon Pointu Low Caffeine", ja: "ブラジル ダテラ農園 ローリナ 低カフェイン" },
    source: { label: "WCR Varieties — Laurina (Bourbon Pointu) Low-Caf", url: "https://varieties.worldcoffeeresearch.org/varieties/laurina" },
    i18n: {
      "en": {
            "headline": "Floral lavender, ripe papaya, and silky sweet walnut butter",
            "guide": "Rare Laurina (Bourbon Pointu) natural from Daterra Estate. Pointed-bean heirloom naturally contains 50% less caffeine, highlighting delicate florals and walnut sweetness.",
            "sourDesc": "Gentle papaya and sweet citrus acidity",
            "nuttyDesc": "Sweet walnut butter and caramel depth",
            "bodyDesc": "Silky smooth, gentle on the stomach"
      },
      "ja": {
            "headline": "ラベンダーの香りとパパイヤの甘み、天然低カフェインのロリナ",
            "guide": "ダテラ農園の希少種ロリナ（ブルボン・ポワンチュ）。尖った形状の原種でカフェイン含有量が通常の約半分。夜でも楽しめる繊細な花香とクルミの優しい甘みが特徴です。",
            "sourDesc": "パパイヤのような穏やかで上品な酸味",
            "nuttyDesc": "クルミバターとキャラメルのやさしいコク",
            "bodyDesc": "胃に優しくシルキーで滑らかな質感"
      }
}
  },
  "ecu-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Galo Morales & Family",
    estateOrStation: "Finca Cruz Loma (San José de Minas, Pichincha)",
    tradeSearchQuery: { ko: "에콰도르 크루즈 로마 갈로 모랄레스 티피카 메호라도 원두", en: "Ecuador Finca Cruz Loma Galo Morales Typica Mejorado coffee", ja: "エクアドル クルスロマ農園 ティピカメホラド" },
    source: { label: "Kofio — Finca Cruz Loma by Galo Morales", url: "https://www.kofio.co/" },
    i18n: {
      "en": {
            "headline": "Crisp lemongrass, white peach nectar, and sparkling floral complexity",
            "guide": "COE-winning Cruz Loma estate by Galo Morales in Pichincha. Typica Mejorado cultivar washed processing brings explosive bergamot aromatics and peach sweetness.",
            "sourDesc": "Sparkling lemongrass and white peach vibrancy",
            "nuttyDesc": "Clean floral sweetness with zero harshness",
            "bodyDesc": "Silky, delicate and tea-like"
      },
      "ja": {
            "headline": "レモングラスの清涼感と白桃ネクター、注目のティピカ・メホラード",
            "guide": "ピチンチャの名門クルス・ロマ農園（ガロ・モラレス氏）。ティピカ・メホラード種の特性を活かした水洗により、ベルガモットの爽快感と白桃の甘みが弾けます。",
            "sourDesc": "レモングラスや白桃の弾ける明るい酸味",
            "nuttyDesc": "雑味のない洗練されたフローラルな余韻",
            "bodyDesc": "シルキーで紅茶のように繊細な口当たり"
      }
}
  },
  "bol-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Pedro, Daniela & Pedro Pablo Rodríguez (Agricafé)",
    estateOrStation: "Sol de la Mañana Program (Caranavi, Yungas, Bolivia)",
    tradeSearchQuery: { ko: "볼리비아 솔 데 라 마냐나 아그리카페 코코 내추럴 원두", en: "Bolivia Agricafe Sol de la Manana Coco Natural coffee", ja: "ボリビア アグリカフェ ソル・デ・ラ・マニャーナ" },
    source: { label: "Agricafé Official — Sol de la Mañana Program", url: "https://www.agricafe.com.bo/" },
    i18n: {
      "en": {
            "headline": "Warm cacao, sweet dried plum, and dark brown sugar honey",
            "guide": "Sol de la Manana program lot by Pedro Rodriguez in Caranavi. Controlled Coco natural mechanical drying ensures spotless sweet plum notes and dark chocolate depth.",
            "sourDesc": "Mellow sweet plum and dried raisin note",
            "nuttyDesc": "Rich toasted cacao and dark brown sugar",
            "bodyDesc": "Velvety, syrupy and coating"
      },
      "ja": {
            "headline": "干しプラムの甘酸っぱさと濃厚なカカオ、ボリビアの小農家渾身作",
            "guide": "ペドロ・ロドリゲス氏の『ソル・デ・ラ・マニャーナ』指導プログラムによるカラナビ産。精密な機械乾燥により、干しプラムの凝縮感とカカオの深い甘みが調和しています。",
            "sourDesc": "干しプラムやレーズンのまろやかな甘酸っぱさ",
            "nuttyDesc": "香ばしいカカオと黒糖の奥深い甘み",
            "bodyDesc": "ベルベットのように滑らかでシロップ感のあるコク"
      }
}
  },
  "bol-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Pedro, Daniela & Pedro Pablo Rodríguez (Agricafé / Fincas Los Rodríguez)",
    estateOrStation: "Finca Floripondio (Samaipata, Santa Cruz, Bolivia)",
    tradeSearchQuery: { ko: "볼리비아 플로리폰디오 아그리카페 게이샤 원두", en: "Bolivia Finca Floripondio Agricafe Geisha coffee", ja: "ボリビア フロリポンディオ農園 ゲイシャ" },
    source: { label: "Agricafé Official — Finca Floripondio", url: "https://www.agricafe.com.bo/" },
    i18n: {
      "en": {
            "headline": "White jasmine blossom, bergamot citrus, and crystal-clear peach tea",
            "guide": "High-altitude Samaipata Geisha from Floripondio estate by the Rodriguez family. Washed processing in cool mountain air produces breathtaking jasmine floral clarity.",
            "sourDesc": "Pure bergamot and delicate white peach brilliance",
            "nuttyDesc": "Translucent floral sweetness without roast bitterness",
            "bodyDesc": "Delicate, light and tea-like"
      },
      "ja": {
            "headline": "ジャスミン白花とベルガモット、サマイパタ高地の美しきゲイシャ",
            "guide": "ロドリゲス家がサマイパタの冷涼な高地で育てるフロリポンディオ農園のゲイシャ。澄み切った山の空気の中で水洗され、息をのむほど清らかなジャスミン花香を放ちます。",
            "sourDesc": "ベルガモットや白桃の透き通るような明るい酸味",
            "nuttyDesc": "焙煎の雑味を感じさせない清冽な花香の余韻",
            "bodyDesc": "ハーブティーのように軽快で透明な口当たり"
      }
}
  },
  "yem-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Faris Sheibani (Qima Coffee) & Haraz Smallholders",
    estateOrStation: "Qima Alchemy R&D Program (Haraz Mountains, Yemen)",
    tradeSearchQuery: { ko: "예멘 하라즈 키마 예메니아 알케미 원두", en: "Yemen Qima Coffee Haraz Yemenia Alchemy lot", ja: "イエメン キマコーヒー ハラズ イエメニア" },
    source: { label: "Qima Coffee Official — Yemenia & Alchemy Program", url: "https://www.qimacoffee.com/" },
    i18n: {
      "en": {
            "headline": "Exotic dried cherry, dark spices, sandalwood, and ancient wild honey",
            "guide": "Rare Yemenia mother-cultivar lot from Haraz by Al-Aqeeq / Qima Coffee. Alchemy slow anaerobic drying unlocks intoxicating sandalwood, dried cherry, and wild honey depth.",
            "sourDesc": "Complex dried cherry and pomegranate acidity",
            "nuttyDesc": "Sandalwood, roasted cardamom, and ancient dark honey",
            "bodyDesc": "Dense, viscous, and syrupy"
      },
      "ja": {
            "headline": "干しチェリーと白檀、古代蜂蜜の妖艶な香り、新種イエメニア",
            "guide": "キマ・コーヒーとハラズの農家が発見した新母種『イエメニア』。長期嫌気性発酵により、白檀のオリエンタルな香りと濃厚なドライフルーツの蜜が重なり合います。",
            "sourDesc": "干しチェリーやザクロの複雑で深い酸味",
            "nuttyDesc": "白檀やカルダモン、古代の野生蜜の余韻",
            "bodyDesc": "とろみがあり濃厚でシロップのような質感"
      }
}
  },
  "haw-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "James 'Kimo' Falconer (MauiGrown Coffee, Inc.)",
    estateOrStation: "Kaʻanapali Coffee Farms (West Maui, Lahaina, Hawaii)",
    tradeSearchQuery: { ko: "하와이 마우이 카아나팔리 마우이그로운 레드카투아이 원두", en: "Hawaii MauiGrown Coffee Kaanapali Estate Red Catuai", ja: "ハワイ マウイ島 カアナパリ レッドカトゥアイ" },
    source: { label: "MauiGrown Coffee Official — Kaʻanapali Estate", url: "https://www.mauigrowngreencoffee.com/" },
    i18n: {
      "en": {
            "headline": "Sweet macadamia, orange blossom honey, and toasted brown sugar",
            "guide": "Historical Maui Kaanapali estate Red Catuai. Washed processing enhances sweet macadamia nut, orange blossom honey, and mild Hawaiian island balance.",
            "sourDesc": "Soft orange blossom and ripe apple sweetness",
            "nuttyDesc": "Sweet toasted macadamia nut and brown sugar",
            "bodyDesc": "Smooth, medium-bodied and clean"
      },
      "ja": {
            "headline": "マカダミアナッツとオレンジの花の蜂蜜、マウイ島カアナパリの恵み",
            "guide": "マウイ島カアナパリ農園のレッドカトゥアイ。ハワイの爽やかな貿易風が育てたマカダミアナッツの香ばしさと、オレンジ蜂蜜のような優しい甘みが魅力です。",
            "sourDesc": "オレンジの花や完熟りんごのやさしい酸味",
            "nuttyDesc": "香ばしいマカダミアナッツと黒糖の甘み",
            "bodyDesc": "滑らかでミディアムボディの心地よい質感"
      }
}
  },
  "ind-04": {
    authenticityType: "ESTATE_LOT",
    producerName: "Kadek Edi & Rodney Glick (PT Karana Spesialis Kopi) & Subak Abian Growers",
    estateOrStation: "Karana Processing Mill (Kintamani Highlands & Ubud, Bali)",
    tradeSearchQuery: { ko: "인도네시아 발리 킨타마니 카라나 내추럴 원두", en: "Indonesia Bali Kintamani Karana Natural coffee", ja: "インドネシア バリ キンタマーニ カラナ ナチュラル" },
    source: { label: "Coffee Max Green — Karana Bali Kintamani Producer Profile", url: "https://www.coffeemaxgreen.com/" },
    i18n: {
      "en": {
            "headline": "Ripe banana, dark chocolate, and sweet volcanic spice warmth",
            "guide": "Karana Global specialty natural from Kintamani volcano in Bali. Raised bed sun-drying develops sweet banana cream, baker's chocolate, and mild cinnamon warmth.",
            "sourDesc": "Mellow sweet plum and tropical fruit acidity",
            "nuttyDesc": "Dark baker's chocolate and toasted cinnamon",
            "bodyDesc": "Heavy, creamy and syrupy"
      },
      "ja": {
            "headline": "完熟バナナとダークチョコ、バリ島火山高地の甘美なナチュラル",
            "guide": "バリ島キンタマーニ火山高原（カラナ・グローバル）。高床式ベッドでの丁寧な天日乾燥により、完熟バナナの甘みとダークチョコの濃厚なコクが引き出されています。",
            "sourDesc": "プラムのような穏やかで甘いトロピカル酸味",
            "nuttyDesc": "ビターな製菓用チョコとシナモンの香ばしさ",
            "bodyDesc": "濃厚でクリーミー、シロップのような重厚感"
      }
}
  },
  "png-01": {
    authenticityType: "ESTATE_LOT",
    producerName: "W.R. Carpenter Estates (Founded by Tom Cole)",
    estateOrStation: "Sigri Estate (Wahgi Valley, Jiwaka Province, PNG)",
    tradeSearchQuery: { ko: "파푸아뉴기니 시그리 에스테이트 원두", en: "Papua New Guinea Sigri Estate Wahgi Valley Washed coffee", ja: "パプアニューギニア シグリ農園 コーヒー" },
    source: { label: "Sucafina Specialty — Sigri Estate Origin Profile", url: "https://www.sucafina.com/" },
    i18n: {
      "en": {
            "headline": "Sweet mango, toasted walnut, and gentle leather aroma complexity",
            "guide": "World-famous Sigri Estate lot in Wahgi Valley. Jamaican Typica lineage grown in pristine highlands yields tropical mango sweetness and smooth walnut depth.",
            "sourDesc": "Gentle ripe mango and citrus brightness",
            "nuttyDesc": "Toasted walnut and subtle cedarwood finish",
            "bodyDesc": "Smooth, medium-bodied and velvety"
      },
      "ja": {
            "headline": "マンゴーの甘みと香ばしい胡桃、名門シグリエステートの逸品",
            "guide": "ワギ渓谷の名門シグリ農園。ジャマイカ直系のティピカ種を清らかな高山で育て、トロピカルマンゴーの甘みと胡桃の優しい香ばしさが美しく調和しています。",
            "sourDesc": "完熟マンゴーやシトラスの穏やかな酸味",
            "nuttyDesc": "香ばしい胡桃とシダーウッドの落ち着いた余韻",
            "bodyDesc": "滑らかでベルベットのようにバランスの取れた質感"
      }
}
  },
  "png-02": {
    authenticityType: "ESTATE_LOT",
    producerName: "Ben & Nichol Colbran",
    estateOrStation: "Baroida Estate (Kainantu, Eastern Highlands, PNG)",
    tradeSearchQuery: { ko: "파푸아뉴기니 바로이다 에스테이트 내추럴 원두", en: "Papua New Guinea Baroida Estate Colbran Natural coffee", ja: "パプアニューギニア バロイダ農園 ナチュラル" },
    source: { label: "Sucafina Specialty — Baroida Estate Profile", url: "https://www.sucafina.com/" },
    i18n: {
      "en": {
            "headline": "Wild blackberry, dark grape compote, and rich toffee sweetness",
            "guide": "Baroida Estate natural from Eastern Highlands by the Colbran family. Sun-drying on raised beds produces intense blackberry jam and sweet toffee mouthfeel.",
            "sourDesc": "Juicy blackberry and Concord grape brightness",
            "nuttyDesc": "Roasted toffee and sweet almond paste",
            "bodyDesc": "Full and juicy with coating finish"
      },
      "ja": {
            "headline": "野イチゴと黒ブドウのコンポート、バロイダ農園の濃厚ナチュラル",
            "guide": "東部山岳州バロイダ農園（コルブラン家）。高床式ベッドでの天日乾燥により、完熟したブラックベリージャムとトフィーのような濃厚な甘みが凝縮されています。",
            "sourDesc": "ブラックベリーや黒ブドウのジューシーな酸味",
            "nuttyDesc": "ローストトフィーとアーモンドペーストの甘み",
            "bodyDesc": "フルボディで果汁のように濃厚な口当たり"
      }
}
  },
  "png-03": {
    authenticityType: "ESTATE_LOT",
    producerName: "Brian Leahy (Korgua Estate & Kuta Mill)",
    estateOrStation: "Korgua Estate (Wahgi Valley, Western Highlands, PNG)",
    tradeSearchQuery: { ko: "파푸아뉴기니 와기밸리 코르구아 에스테이트 원두", en: "Papua New Guinea Wahgi Valley Korgua Estate coffee", ja: "パプアニューギニア コルグア農園 コーヒー" },
    source: { label: "Covoya Specialty Coffee — Korgua Estate Profile", url: "https://www.covoyacoffee.com/" },
    i18n: {
      "en": {
            "headline": "Bittersweet dark cacao, cedarwood, and brown sugar cane depth",
            "guide": "Korgua Estate lot from Wahgi Valley. Jamaican Blue Mountain lineage washed in glacial spring water brings balanced dark cacao and sweet cedarwood notes.",
            "sourDesc": "Mild, balanced low acidity",
            "nuttyDesc": "Bittersweet dark cocoa and toasted cedarwood",
            "bodyDesc": "Thick, creamy and hearty"
      },
      "ja": {
            "headline": "ビターカカオとシダーウッド、コルグア農園のブルーマウンテン系譜",
            "guide": "ワギ渓谷コルグア農園。ジャマイカ・ブルーマウンテン直系の品種を湧き水で水洗。ビターなカカオの深みとシダーウッドの上品な香りが調和した一杯です。",
            "sourDesc": "酸味は控えめで落ち着きのあるバランス",
            "nuttyDesc": "ほろ苦いダークカカオと香ばしいスギの香り",
            "bodyDesc": "厚みがありどっしりとした豊かな飲みごたえ"
      }
}
  },
  "ida-01": {
    authenticityType: "ESTATE_LOT",
    producerName: "Sangameshwar Coffee Estates (Appadurai Family)",
    estateOrStation: "Attikan Estate (Biligiriranga Hills, Karnataka, India)",
    tradeSearchQuery: { ko: "인도 아티칸 에스테이트 워시드 원두", en: "India Karnataka Attikan Estate Sangameshwar Washed coffee", ja: "インド アティカン農園 ウォッシュト" },
    source: { label: "Blue Tokai Coffee — Attikan Estate Producer Profile", url: "https://www.bluetokaicoffee.com/" },
    i18n: {
      "en": {
            "headline": "Dark chocolate truffle, roasted cardamom, and velvety brown sugar",
            "guide": "Heritage shade-grown lot from Attikan Estate in Biligirirangana Hills. Rainforest canopy shading yields dark chocolate truffle notes and warm cardamom aromatics.",
            "sourDesc": "Low acidity, gentle spiced warmth",
            "nuttyDesc": "Rich roasted cardamom and dark chocolate truffle",
            "bodyDesc": "Heavy, creamy and velvety"
      },
      "ja": {
            "headline": "ダークチョコトリュフとカルダモン、名門アティカン農園の森林珈琲",
            "guide": "南インドBRヒルズのアティカン農園。原生林の木陰（シェードグロウン）で育まれ、ダークチョコトリュフの濃厚さとカルダモンの温かみあるスパイス感が絶品です。",
            "sourDesc": "酸味は極めて穏やかでスパイシーな温もり",
            "nuttyDesc": "カルダモンと濃厚なチョコトリュフの香ばしさ",
            "bodyDesc": "重厚でクリーミー、ベルベットのような口当たり"
      }
}
  },
  "flv-05": {
    authenticityType: "ESTATE_LOT",
    producerName: "Nestor & Adrian Lasso · Jhoan Vergara",
    estateOrStation: "Finca El Diviso & Las Flores (Pitalito, Huila, Colombia)",
    tradeSearchQuery: { ko: "콜롬비아 엘 디비소 네스토르 라쏘 서멀 쇼크 원두", en: "Colombia Finca El Diviso Nestor Lasso Thermal Shock coffee", ja: "コロンビア エル・ディビソ ネストル・ラッソ サーマルショック" },
    source: { label: "Black & White Roasters — Finca El Diviso by Nestor Lasso", url: "https://www.blackwhiteroasters.com/products/r-nestor-lasso-thermal-shock-sidra" },
    i18n: {
      "en": {
            "headline": "Creamy mango lassi, sweet cardamom, and golden tropical yogurt finish",
            "guide": "Micro-lot conditioned with cultured yogurt and Alphonso mango nectar. Thermal shock fermentation locks in exotic mango lassi and sweet cardamom aromatics.",
            "sourDesc": "Juicy ripe mango and yogurt brightness",
            "nuttyDesc": "Sweet cream and toasted cardamom",
            "bodyDesc": "Smooth, velvety, and yogurt-like"
      },
      "ja": {
            "headline": "完熟マンゴーラッシーと甘いカルダモン、魅惑のサーマルショック",
            "guide": "アルフォンソマンゴーと発酵乳の乳酸菌を用いて熱衝撃（サーマルショック）処理を施した話題作。まるで濃厚なマンゴーラッシーを飲んでいるかのような甘美な体験です。",
            "sourDesc": "完熟マンゴーとヨーグルトの心地よい酸味",
            "nuttyDesc": "スイートクリームとカルダモンの香ばしい余韻",
            "bodyDesc": "ヨーグルトドリンクのように滑らかでとろける質感"
      }
}
  },
  "flv-06": {
    authenticityType: "ESTATE_LOT",
    producerName: "Diego Samuel Bermúdez Tapia",
    estateOrStation: "Finca El Paraíso — Lychee Double Anaerobic Lot (Cauca)",
    tradeSearchQuery: { ko: "콜롬비아 엘 파라이소 리치 무산소 원두", en: "Colombia Finca El Paraiso Lychee Double Anaerobic Diego Bermudez", ja: "コロンビア エル・パライソ ライチ 嫌気性発酵" },
    source: { label: "Hydrangea Coffee — Finca El Paraíso Lychee Lot", url: "https://hydrangea.coffee/products/el-paraiso-lychee" },
    i18n: {
      "en": {
            "headline": "Sweet lychee nectar, rose petals, and sparkling white grape clarity",
            "guide": "Specialty lot co-fermented with fresh lychee fruit inside sealed anaerobic tanks. Showcases crystal-clear lychee sweetness, fresh rose petals, and a sparkling finish.",
            "sourDesc": "Sparkling lychee and white grape vibrancy",
            "nuttyDesc": "Delicate rose petal sweetness with zero bitterness",
            "bodyDesc": "Light, refreshing and juice-like"
      },
      "ja": {
            "headline": "ライチネクターと華やかな薔薇の花びら、芳醇な無酸素発酵ロット",
            "guide": "密閉タンク内で生ライチ果肉とともに嫌気性発酵させた特別ロット。透き通るライチの果汁感と上品なローズペタルの香りが口内いっぱいに広がります。",
            "sourDesc": "ライチや白ブドウの弾ける爽やかな酸味",
            "nuttyDesc": "薔薇の花びらのような優雅で苦味のない甘い余韻",
            "bodyDesc": "ジュースのように軽やかで透明感あふれる質感"
      }
}
  },
  "flv-07": {
    authenticityType: "ESTATE_LOT",
    producerName: "Tabe Burka & Raro Boda Smallholder Producers",
    estateOrStation: "Uraga Raro Boda / Tabe Burka Washing Station (Guji, Ethiopia)",
    tradeSearchQuery: { ko: "에티오피아 구지 우라가 내추럴 딸기향 원두", en: "Ethiopia Guji Uraga Raro Boda Natural G1 strawberry note", ja: "エチオピア グジ ウラガ ナチュラル G1" },
    source: { label: "SCA Value Assessment — Guji Uraga Natural Reference", url: "https://sca.coffee/value-assessment" },
    i18n: {
      "en": {
            "headline": "Sweet strawberry jam, condensed milk, and vanilla wafer cookie sweetness",
            "guide": "Specialty natural lot infused with fresh field strawberry puree. Delivers childhood memories of rich strawberry milk, vanilla wafers, and sweet berry compote.",
            "sourDesc": "Luscious sweet field strawberry brightness",
            "nuttyDesc": "Vanilla wafer and sweet condensed milk warmth",
            "bodyDesc": "Round, syrupy, and dessert-like"
      },
      "ja": {
            "headline": "濃厚な苺ジャムと練乳、バニラウエハースが香るシグネチャー",
            "guide": "朝摘み苺の果汁とともにじっくり寝かせたインフューズド・ナチュラル。濃厚な苺ジャムと練乳の甘みが重なり、まるで上質なデザートのような幸福感を届けます。",
            "sourDesc": "苺ジャムのような甘酸っぱく濃厚な酸味",
            "nuttyDesc": "バニラウエハースと練乳の甘い香ばしさ",
            "bodyDesc": "シロップのようにまろやかでデザートのような質感"
      }
}
  }
};

// REGIONAL_GRADE (기존 33종 + Phase 1 지역·품종 조합 20종 재분류 = 총 53종)
const REGIONAL_GRADE_IDS = new Set([
  // 기존 33종
  "eth-02", "ken-01", "ken-02", "tan-01", "uga-01", "cos-01", "gtm-01", "gtm-02",
  "sal-01", "sal-02", "hon-01", "nic-01", "jam-01", "col-01", "col-04", "col-05",
  "bra-01", "bra-02", "per-01", "ecu-01", "bol-01", "ind-01", "ind-02", "ind-03",
  "haw-01", "vnm-01", "ynn-01", "tim-01", "yem-01", "mex-01", "mex-02", "ida-02", "bra-06",
  // Phase 1 Group ③ 지역 + 품종/가공 조합 20종 재분류
  "col-09", "cos-03", "gtm-04", "uga-02", "col-11", "vnm-02", "per-02", "haw-02",
  "ynn-02", "tim-02", "bra-05", "eth-07", "per-03", "ecu-03", "vnm-03", "ynn-03",
  "ida-03", "tim-03", "yem-03", "mex-03"
]);

function buildBrewTempWarning(item, tempMin, tempMax) {
  if (item.caffeine === "DECAF" || item.caffeine === "LOW_CAF") {
    return {
      ko: `디카페인·저카페인 원두는 조직이 다공성이라 90°C 이상에서 쓴맛이 빠르게 과추출됩니다. ${tempMin}~${tempMax}°C 이하 저온 추출을 권장합니다.`,
      en: `Decaf/low-caf beans extract rapidly due to higher porosity. Keep water at ${tempMin}–${tempMax}°C to avoid bitter over-extraction.`,
      ja: `デカフェ・低カフェイン豆は成分が出やすいため、90°C以上では苦味が出やすくなります。${tempMin}〜${tempMax}°Cでの抽出を推奨します。`
    };
  }
  if (["Anaerobic", "Thermal Shock", "Carbonic Maceration", "Infused", "Barrel Aged"].includes(item.processGroup)) {
    return {
      ko: `특수발효·가향 로트는 용해도가 높아 91°C 이상 고온에서 잡미·발효취가 튈 수 있습니다. ${tempMin}~${tempMax}°C로 차분히 추출하세요.`,
      en: `Fermented/infused lots dissolve quickly; water above 91°C can amplify harsh ferment notes. Brew gently at ${tempMin}–${tempMax}°C.`,
      ja: `特殊発酵・フレーバー豆は溶解度が高く、91°C以上では雑味や発酵臭が強く出ます。${tempMin}〜${tempMax}°Cで穏やかに抽出してください。`
    };
  }
  if (item.roast === "Dark" || item.roast === "Medium-Dark") {
    return {
      ko: `중강·강배전은 90°C 초과 시 탄맛과 떫은맛이 도드라집니다. ${tempMin}~${tempMax}°C의 낮은 수온으로 묵직한 단맛만 뽑아내세요.`,
      en: `Darker roasts turn smoky and astringent above 90°C. Use cooler water (${tempMin}–${tempMax}°C) to highlight cocoa sweetness.`,
      ja: `中深煎り〜深煎りは90°Cを超えると焦げ感や渋みが出やすくなります。${tempMin}〜${tempMax}°Cの低めの湯温が最適です。`
    };
  }
  if (item.roast === "Light") {
    return {
      ko: `약배전은 밀도가 단단해 90°C 미만에서는 꽃향·단맛이 덜 풀리고 신맛만 튈 수 있습니다. ${tempMin}~${tempMax}°C의 충분한 열량을 유지하세요.`,
      en: `Dense light roasts can taste sour and hollow below 90°C. Maintain ${tempMin}–${tempMax}°C to unlock floral aromatics and sweetness.`,
      ja: `浅煎りは豆が硬く90°C未満では酸味だけが目立ちやすくなります。${tempMin}〜${tempMax}°Cの十分な湯温を保ってください。`
    };
  }
  return {
    ko: `표준 중배전 기준 ${tempMin}~${tempMax}°C에서 산미와 단맛의 균형이 가장 안정적입니다. 수온 ±2°C 조절로 취향을 미세 조정하세요.`,
    en: `Balanced extraction peaks around ${tempMin}–${tempMax}°C. Adjust water ±2°C to shift between brighter acidity and deeper sweetness.`,
    ja: `中煎りの標準バランスは${tempMin}〜${tempMax}°Cで最も安定します。湯温±2°Cで酸味と甘みのバランスを微調整できます。`
  };
}

(function bootstrapSchemaV3() {
  // 1) originData 30개에 완역 i18n 주입 (EN/JP 한글 혼입 0건)
  if (Array.isArray(originData)) {
    originData.forEach(o => {
      const names = ORIGIN_I18N_MAP[o.code] || { ko: o.country, en: o.code, ja: o.country };
      const detail = ORIGIN_I18N_DETAILS[o.code] || null;
      o.i18n = {
        ko: { country: o.country, flavor: o.flavor, desc: o.desc },
        en: {
          country: names.en,
          flavor: detail ? detail.en.flavor : names.en,
          desc: detail ? detail.en.desc : `${names.en} specialty coffee origin.`
        },
        ja: {
          country: names.ja,
          flavor: detail ? detail.ja.flavor : names.ja,
          desc: detail ? detail.ja.desc : `${names.ja}のスペシャルティコーヒー産地。`
        }
      };
    });
  }

  // 2) coffeeData 120종에 Schema v3.1 (traceability, varietalCode, updatedAt, brewTempWarning, clean i18n) 자동 주입
  if (!Array.isArray(coffeeData)) return;

  coffeeData.forEach(item => {
    const cCode = item.countryCode || "ETH";
    const countryNames = ORIGIN_I18N_MAP[cCode] || { ko: "스페셜티", en: "Specialty", ja: "スペシャルティ" };
    const regionEng = (item.region || "").replace(/\s*\([^)]*\)/g, "").trim() || countryNames.en;
    const regionKorMatch = (item.region || "").match(/\(([^)]+)\)/);
    const regionKor = regionKorMatch ? regionKorMatch[1].trim() : (item.region || countryNames.ko);

    // Schema v3.1 메타: 업데이트 날짜 & WCR 표준 품종 정규화
    item.updatedAt = item.updatedAt || "2026-11-19";
    const varMeta = resolveCanonicalVarietal(item.varietal, item.categoryType);
    item.varietalCode = varMeta.code;
    item.varietalCanonical = varMeta.canonical;

    // 고도 수치 정규화 (altitudeRange: [min, max])
    const altNums = ((item.altitude || "").match(/[\d,]+/g) || []).map(s => parseInt(s.replace(/,/g, ""), 10)).filter(n => !isNaN(n));
    item.altitudeRange = altNums.length >= 2 ? [altNums[0], altNums[1]] : (altNums.length === 1 ? [altNums[0], altNums[0]] : null);

    // 추출 레시피 수치 정규화 (brewSpec) + 원두별 추출 온도 주의 문구 (안내문 2)
    const roastMeta = COFFEE_TAXONOMY.roast[item.roast] || COFFEE_TAXONOMY.roast["Medium"];
    let tempMin = roastMeta.brew.tempMin;
    let tempMax = roastMeta.brew.tempMax;
    if (item.brewOverride) {
      const tMatches = (item.brewOverride.match(/\d+/g) || []).map(Number);
      if (tMatches.length >= 2 && tMatches[0] >= 80 && tMatches[0] <= 98) {
        tempMin = tMatches[0];
        tempMax = tMatches[1];
      } else if (tMatches.length >= 1 && tMatches[0] >= 80 && tMatches[0] <= 98) {
        tempMin = tMatches[0];
        tempMax = tMatches[0];
      }
    }
    item.brewSpec = {
      tempMinC: tempMin,
      tempMaxC: tempMax,
      doseG: 20,
      waterMl: 300,
      roastIntensity: roastMeta.intensity || 3
    };
    item.brewTempWarning = buildBrewTempWarning(item, tempMin, tempMax);

    // Traceability 구성 (42 Verified Estate · 53 Regional Grade · 16 Style Archetype · 9 Pending Verification)
    const override = BEAN_TRACEABILITY_OVERRIDES[item.id];
    if (override) {
      item.traceability = override;
    } else if (item.categoryType === "HOUSE_BLEND" || item.categoryType === "FLAVORED" || cCode === "BLEND") {
      const cleanKor = item.name.replace(/원두|스페셜|시그니처/g, "").trim();
      item.traceability = {
        authenticityType: "STYLE_ARCHETYPE",
        producerName: item.categoryType === "HOUSE_BLEND"
          ? "Specialty Roastery Multi-Origin Blend Archetype"
          : "Botanical / Oak Barrel Infusion Style Archetype",
        estateOrStation: regionEng,
        tradeSearchQuery: {
          ko: `${cleanKor} 스페셜티 원두`,
          en: `${item.eng} specialty coffee beans`,
          ja: `${item.eng} スペシャルティコーヒー豆`
        },
        source: {
          label: "SCA Coffee Value Assessment (CVA) Reference",
          url: "https://sca.coffee/value-assessment"
        }
      };
    } else if (REGIONAL_GRADE_IDS.has(item.id)) {
      item.traceability = {
        authenticityType: "REGIONAL_GRADE",
        producerName: `${countryNames.en} Regional Smallholder Producers & Cooperatives`,
        estateOrStation: `${regionEng} Specialty Coffee Region`,
        tradeSearchQuery: {
          ko: `${item.name} 스페셜티 원두`,
          en: `${item.eng} specialty coffee beans`,
          ja: `${countryNames.ja} ${item.eng} コーヒー豆`
        },
        source: {
          label: "World Coffee Research (WCR) Regional & Variety Reference",
          url: "https://varieties.worldcoffeeresearch.org/"
        }
      };
    } else {
      // 가짜 자동 생성 문구·링크 전면 금지 → 정직한 검증 대기(PENDING_VERIFICATION) 부여
      item.traceability = {
        authenticityType: "PENDING_VERIFICATION",
        producerName: null,
        estateOrStation: regionEng,
        tradeSearchQuery: {
          ko: `${item.name} 원두`,
          en: `${item.eng} coffee beans`,
          ja: `${countryNames.ja} ${item.eng} コーヒー豆`
        },
        source: null
      };
    }

    // 다국어(i18n: { ko, en, ja }) 블록 생성 — EN/JP 한글 혼입 0건 보장
    const bodyMeta = COFFEE_TAXONOMY.bodyAnalogy[item.bodyDots] || COFFEE_TAXONOMY.bodyAnalogy[3];
    const procMeta = COFFEE_TAXONOMY.processGroup[item.processGroup] || { ko: item.process, en: item.processGroup || "Washed", ja: item.processGroup || "ウォッシュト" };
    const fams = Array.isArray(item.flavorFamily) && item.flavorFamily.length > 0 ? item.flavorFamily : ["Sweet"];
    const famEn = fams.map(f => COFFEE_TAXONOMY.flavorFamily[f]?.en || f.toLowerCase()).join(" and ");
    const famJa = fams.map(f => COFFEE_TAXONOMY.flavorFamily[f]?.ja || f).join("・");
    const sourEn = COFFEE_TAXONOMY.tasteLevelDesc.sour[item.sourDots]?.en || "Balanced acidity";
    const sourJa = COFFEE_TAXONOMY.tasteLevelDesc.sour[item.sourDots]?.ja || "バランスの良い酸味";
    const nuttyEn = COFFEE_TAXONOMY.tasteLevelDesc.nutty[item.nuttyDots]?.en || "Balanced nuttiness";
    const nuttyJa = COFFEE_TAXONOMY.tasteLevelDesc.nutty[item.nuttyDots]?.ja || "バランスの良い香ばしさ";
    const sweetLv = item.sweetDots || 3;
    const sweetEn = COFFEE_TAXONOMY.tasteLevelDesc.sweet[sweetLv]?.en || "Balanced sweetness";
    const sweetJa = COFFEE_TAXONOMY.tasteLevelDesc.sweet[sweetLv]?.ja || "バランスの良い甘み";
    const producerEnText = item.traceability.producerName || `${countryNames.en} (${regionEng})`;
    const producerJaText = item.traceability.producerName || `${countryNames.ja}（${regionEng}）`;
    const cafEnNote = item.caffeine === "DECAF" ? " Caffeine-free decaf lot for evening enjoyment." : (item.caffeine === "LOW_CAF" ? " Naturally low-caffeine cultivar." : "");
    const cafJaNote = item.caffeine === "DECAF" ? " 夜でも安心のカフェインレス（デカフェ）。" : (item.caffeine === "LOW_CAF" ? " 天然低カフェイン希少品種。" : "");

    item.i18n = {
      ko: {
        name: item.name,
        subName: item.eng,
        originBadge: `${(item.origin || "").split(" ")[0] || "☕"} ${countryNames.ko}`,
        region: regionKor,
        headline: item.headline,
        sourDesc: item.sourDesc,
        nuttyDesc: item.nuttyDesc,
        bodyDesc: item.bodyDesc,
        sweetDesc: item.sweetDesc || "균형 잡힌 단맛",
        guide: item.guide,
        dialingNote: (item.dialingNote && item.dialingNote.ko) || "",
        brewText: item.brewOverride || `${roastMeta.ko.split(" ")[0]} ${tempMin}~${tempMax}°C · 20g / 300ml`
      },
      en: {
        name: item.eng,
        subName: `${countryNames.en} · ${regionEng} (${varMeta.canonical})`,
        originBadge: `${(item.origin || "").split(" ")[0] || "☕"} ${countryNames.en.toUpperCase()}`,
        region: regionEng,
        headline: `${procMeta.en} specialty lot from ${regionEng} featuring ${famEn}`,
        sourDesc: `Lv.${item.sourDots}/5 · ${sourEn}`,
        nuttyDesc: `Lv.${item.nuttyDots}/5 · ${nuttyEn}`,
        bodyDesc: bodyMeta.full.en,
        sweetDesc: `Lv.${sweetLv}/5 · ${sweetEn}`,
        guide: `${roastMeta.en} ${varMeta.canonical} (${procMeta.en}) from ${producerEnText}. Delivers ${famEn} with a ${bodyMeta.short.en.toLowerCase()}-like mouthfeel.${cafEnNote}`,
        dialingNote: (item.dialingNote && item.dialingNote.en) || "",
        brewText: `${roastMeta.en} ${tempMin}–${tempMax}°C · 20g / 300ml`
      },
      ja: {
        name: `${countryNames.ja} · ${item.eng}`,
        subName: `${countryNames.ja}・${regionEng}（${varMeta.canonical}）`,
        originBadge: `${(item.origin || "").split(" ")[0] || "☕"} ${countryNames.ja}`,
        region: regionEng,
        headline: `${countryNames.ja}産（${procMeta.ja}）— ${famJa}が際立つ一杯`,
        sourDesc: `${item.sourDots}段階・${sourJa}`,
        nuttyDesc: `${item.nuttyDots}段階・${nuttyJa}`,
        bodyDesc: bodyMeta.full.ja,
        sweetDesc: `${sweetLv}段階・${sweetJa}`,
        guide: `${producerJaText}の${varMeta.canonical}種（${procMeta.ja}・${roastMeta.ja.split(" ")[0]}）。${famJa}の風味と${bodyMeta.short.ja}のような口当たりが特長です。${cafJaNote}`,
        dialingNote: (item.dialingNote && item.dialingNote.ja) || "",
        brewText: `${roastMeta.ja.split(" ")[0]} ${tempMin}〜${tempMax}°C · 20g / 300ml`
      }
    };

    // Schema v3.3: 실명 42종(ESTATE_LOT) 전문 큐레이션 영·일 카피 정밀 오버라이드
    if (override && override.i18n) {
      if (override.i18n.en) {
        if (override.i18n.en.headline) item.i18n.en.headline = override.i18n.en.headline;
        if (override.i18n.en.guide) item.i18n.en.guide = override.i18n.en.guide;
        if (override.i18n.en.sourDesc) item.i18n.en.sourDesc = override.i18n.en.sourDesc;
        if (override.i18n.en.nuttyDesc) item.i18n.en.nuttyDesc = override.i18n.en.nuttyDesc;
        if (override.i18n.en.bodyDesc) item.i18n.en.bodyDesc = override.i18n.en.bodyDesc;
      }
      if (override.i18n.ja) {
        if (override.i18n.ja.headline) item.i18n.ja.headline = override.i18n.ja.headline;
        if (override.i18n.ja.guide) item.i18n.ja.guide = override.i18n.ja.guide;
        if (override.i18n.ja.sourDesc) item.i18n.ja.sourDesc = override.i18n.ja.sourDesc;
        if (override.i18n.ja.nuttyDesc) item.i18n.ja.nuttyDesc = override.i18n.ja.nuttyDesc;
        if (override.i18n.ja.bodyDesc) item.i18n.ja.bodyDesc = override.i18n.ja.bodyDesc;
      }
    }
  });
})();
