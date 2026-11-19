/**
 * Coffee Taste Archive - Casper™ V1 Engine Core (casper.js)
 * Standalone DOM-independent search, loanword/typo normalization,
 * multi-token & multi-field chosung index, KR/EN/JP producer search,
 * autocomplete suggestions, 4-axis wheel matcher, and smart curation engine.
 * Powered by Casper™ V1 · window.CasperEngine
 */

(function(global) {
  'use strict';

  // 0. XSS 방어용 HTML 이스케이프 (순수 문자열 헬퍼)
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 1. 한글 초성 추출 헬퍼
  const CHOSUNG_LIST = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  function getChosung(str) {
    if (!str) return '';
    return Array.from(String(str)).map(char => {
      const code = char.charCodeAt(0) - 44032;
      return (code >= 0 && code <= 11171) ? CHOSUNG_LIST[Math.floor(code / 588)] : char;
    }).join('');
  }

  // 2. 악센트·발음 기호 제거 (한글 NFC 보존)
  function stripDiacritics(str) {
    if (!str) return '';
    return String(str)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .normalize('NFC')
      .replace(/[ʻ’‘`]/g, "'");
  }

  // 3. 외래어 표기 편차·오타·유사음 정규화 사전
  const LOANWORD_REPLACEMENTS = [
    [/(슈|수|시)프(리|레|래)모/g, '수프레모'],
    [/(예|이르)가체(프|페|피)/g, '예가체프'],
    [/(이|예)디오피아/g, '에티오피아'],
    [/에띠오피아/g, '에티오피아'],
    [/혼두라스/g, '온두라스'],
    [/꼬스따리까/g, '코스타리카'],
    [/안띠구아/g, '안티구아'],
    [/웨웨테낭고|우에웨테낭고/g, '우에우에테낭고'],
    [/따라주|타라수/g, '타라주'],
    [/보께떼/g, '보케테'],
    [/우일라/g, '후일라'],
    [/시다모/g, '시다마'],
    [/만델린/g, '만델링'],
    [/케니아/g, '케냐'],
    [/예맨/g, '예멘'],
    [/파푸아뉴기니아/g, '파푸아뉴기니'],
    [/게이샤/g, '게샤'],
    [/게샤빌리지|게이샤빌리지/g, '게샤빌리지'],
    [/부르봉|부르본|버번/g, '버본'],
    [/까투라/g, '카투라'],
    [/까투아이/g, '카투아이'],
    [/카스티죠|카스티오/g, '카스티요'],
    [/띠피카/g, '티피카'],
    [/빠까마라/g, '파카마라'],
    [/마라고지피/g, '마라고지페'],
    [/워쉬드|워시트/g, '워시드'],
    [/내츄럴|네추럴|네츄럴/g, '내추럴'],
    [/하니(?!문)/g, '허니'],
    [/아내로빅|애너로빅/g, '아나에로빅'],
    [/인푸즈드|인퓨즈(?!드)/g, '인퓨즈드'],
    [/블랜드/g, '블렌드'],
    [/블렌딩|블랜딩/g, '블렌드'],
    [/데카페인/g, '디카페인'],
    [/캐러멜/g, '카라멜'],
    [/초콜렛|초코렛|쵸콜릿|초콜릿트/g, '초콜릿'],
    [/헤이즐럿|헤이즐너트/g, '헤이즐넛'],
    [/래즈베리/g, '라즈베리'],
    [/크렌베리/g, '크랜베리'],
    [/블루배리/g, '블루베리'],
    [/재스민/g, '자스민'],
    [/씨트러스/g, '시트러스'],
    [/베르가모트/g, '베르가못'],
    [/패션후르츠|패션프루츠/g, '패션프루트'],
    [/씨그리/g, '시그리'],
    [/아띠깐|아티깐/g, '아티칸'],
    [/스페샬티/g, '스페셜티'],
    [/아라비까/g, '아라비카'],
    [/로부스따/g, '로부스타'],
    [/벨런스/g, '밸런스'],
    [/엘파라이소/g, '파라이소']
  ];

  // 추가 한국어 모음·구개음 유사음 폴딩 (3음절 이상 외래어 오타 흡수용)
  function phoneticFoldKo(str) {
    if (!str) return '';
    return Array.from(String(str)).map(ch => {
      const code = ch.charCodeAt(0) - 44032;
      if (code < 0 || code > 11171) return ch;
      const cho = Math.floor(code / 588);
      let jung = Math.floor((code % 588) / 28);
      const jong = code % 28;
      // ㅐ(1)->ㅔ(5), ㅒ(3)->ㅖ(7), ㅙ(10)/ㅚ(11)->ㅞ(15)
      if (jung === 1) jung = 5;
      else if (jung === 3) jung = 7;
      else if (jung === 10 || jung === 11) jung = 15;
      // ㅅ(9), ㅆ(10), ㅈ(12), ㅊ(14), ㅍ(17) + ㅠ(17) -> ㅜ(13); ㅅ/ㅆ + ㅟ(16) -> ㅣ(20)
      if ((cho === 9 || cho === 10 || cho === 12 || cho === 14 || cho === 17) && jung === 17) jung = 13;
      else if ((cho === 9 || cho === 10) && jung === 16) jung = 20;
      return String.fromCharCode(44032 + cho * 588 + jung * 28 + jong);
    }).join('');
  }

  function normalizeText(str, stripSpaces = true) {
    if (!str) return '';
    let s = stripDiacritics(String(str)).toLowerCase();
    s = s.replace(/[・·\-_,./()[\]{}"'!?~]+/g, stripSpaces ? '' : ' ');
    if (stripSpaces) {
      s = s.replace(/\s+/g, '');
    } else {
      s = s.replace(/\s+/g, ' ').trim();
    }
    for (let i = 0; i < LOANWORD_REPLACEMENTS.length; i++) {
      const [pattern, replacement] = LOANWORD_REPLACEMENTS[i];
      s = s.replace(pattern, replacement);
    }
    return s;
  }

  // 4. 조작 휠 상태 (산미, 고소함, 바디감: 0=ANY/무관, 1~5단계 | 원산지: 0=ALL, 1~30)
  const ORIGIN_WHEEL_OPTIONS = [
    { key: "ALL", code: "ALL", label: "ALL", kor: "전체", matchTokens: [] },
    { key: "COL", code: "COL", label: "🇨🇴 COL", kor: "콜롬비아", matchTokens: ["COLOMBIA", "COL", "콜롬비아", "후일라", "우일라", "나리뇨", "안티오키아", "카우카"] },
    { key: "ETH", code: "ETH", label: "🇪🇹 ETH", kor: "에티오피아", matchTokens: ["ETHIOPIA", "ETH", "에티오피아", "예가체프", "구지", "시다마", "게뎁"] },
    { key: "BRA", code: "BRA", label: "🇧🇷 BRA", kor: "브라질", matchTokens: ["BRAZIL", "BRA", "브라질", "세라도", "술데미나스", "모지아나"] },
    { key: "KEN", code: "KEN", label: "🇰🇪 KEN", kor: "케냐", matchTokens: ["KENYA", "KEN", "케냐", "니에리", "녜리", "키리냐가", "엠부"] },
    { key: "GTM", code: "GTM", label: "🇬🇹 GTM", kor: "과테말라", matchTokens: ["GUATEMALA", "GTM", "과테말라", "안티구아", "우에우에테낭고", "아카테낭고"] },
    { key: "PAN", code: "PAN", label: "🇵🇦 PAN", kor: "파나마", matchTokens: ["PANAMA", "PAN", "파나마", "보케테", "볼칸"] },
    { key: "CRI", code: "CRI", label: "🇨🇷 CRI", kor: "코스타리카", matchTokens: ["COSTA RICA", "CRI", "코스타리카", "타라주", "따라주", "센트럴밸리"] },
    { key: "IDN", code: "IDN", label: "🇮🇩 IDN", kor: "인도네시아", matchTokens: ["INDONESIA", "IDN", "인도네시아", "만델링", "가요", "토라자", "발리"] },
    { key: "RWA", code: "RWA", label: "🇷🇼 RWA", kor: "르완다", matchTokens: ["RWANDA", "RWA", "르완다", "후예", "기사라", "니아마셰케"] },
    { key: "SLV", code: "SLV", label: "🇸🇻 SLV", kor: "엘살바도르", matchTokens: ["EL SALVADOR", "SALVADOR", "SLV", "엘살바도르", "산타아나", "찰라테낭고"] },
    { key: "HND", code: "HND", label: "🇭🇳 HND", kor: "온두라스", matchTokens: ["HONDURAS", "HND", "온두라스", "혼두라스", "마르칼라", "오팔라카"] },
    { key: "YEM", code: "YEM", label: "🇾🇪 YEM", kor: "예멘", matchTokens: ["YEMEN", "YEM", "예멘", "모카", "마타리", "하라즈", "이사마이"] },
    { key: "JAM", code: "JAM", label: "🇯🇲 JAM", kor: "자메이카", matchTokens: ["JAMAICA", "JAM", "자메이카", "블루마운틴"] },
    { key: "USA", code: "USA", label: "🇺🇸 HAW", kor: "하와이", matchTokens: ["USA", "HAW", "HAWAII", "하와이", "코나", "카우"] },
    { key: "PER", code: "PER", label: "🇵🇪 PER", kor: "페루", matchTokens: ["PERU", "PER", "페루", "카하마르카", "쿠스코", "찬차마요"] },
    { key: "ECU", code: "ECU", label: "🇪🇨 ECU", kor: "에콰도르", matchTokens: ["ECUADOR", "ECU", "에콰도르", "로하", "피친차"] },
    { key: "BOL", code: "BOL", label: "🇧🇴 BOL", kor: "볼리비아", matchTokens: ["BOLIVIA", "BOL", "볼리비아", "카라나비", "융가스"] },
    { key: "NIC", code: "NIC", label: "🇳🇮 NIC", kor: "니카라과", matchTokens: ["NICARAGUA", "NIC", "니카라과", "디필토", "히노테가"] },
    { key: "MEX", code: "MEX", label: "🇲🇽 MEX", kor: "멕시코", matchTokens: ["MEXICO", "MEX", "멕시코", "치아파스", "베라크루스", "오아하카", "오악사카"] },
    { key: "BDI", code: "BDI", label: "🇧🇮 BDI", kor: "부룬디", matchTokens: ["BURUNDI", "BDI", "부룬디", "카얀자", "응고지"] },
    { key: "TZA", code: "TZA", label: "🇹🇿 TZA", kor: "탄자니아", matchTokens: ["TANZANIA", "TZA", "탄자니아", "킬리만자로", "음베야"] },
    { key: "UGA", code: "UGA", label: "🇺🇬 UGA", kor: "우간다", matchTokens: ["UGANDA", "UGA", "우간다", "엘곤", "루웬조리", "르웬조리"] },
    { key: "PNG", code: "PNG", label: "🇵🇬 PNG", kor: "파푸아뉴기니", matchTokens: ["PAPUA NEW GUINEA", "PNG", "PAPUA", "파푸아뉴기니", "하이라인", "지왁카"] },
    { key: "VNM", code: "VNM", label: "🇻🇳 VNM", kor: "베트남", matchTokens: ["VIETNAM", "VNM", "베트남", "달랏", "람동", "부온마투옷"] },
    { key: "CHN", code: "CHN", label: "🇨🇳 CHN", kor: "중국(운남)", matchTokens: ["CHINA", "CHN", "YUNNAN", "중국", "운남", "보산", "푸얼"] },
    { key: "IND", code: "IND", label: "🇮🇳 IND", kor: "인도", matchTokens: ["INDIA", "IND", "인도", "치크마갈루르", "쿠르그", "바바부단기리", "말라바", "아티칸"] },
    { key: "TLS", code: "TLS", label: "🇹🇱 TLS", kor: "동티모르", matchTokens: ["TIMOR", "TIMOR-LESTE", "TLS", "동티모르", "레테포호", "마우베시"] },
    { key: "FER", code: "FER", label: "🧪 FER", kor: "특수발효", categoryType: "FERMENTED_LOT", matchTokens: ["ANAEROBIC", "THERMAL", "CARBONIC", "KOJI", "YEAST"] },
    { key: "FLV", code: "FLV", label: "✨ FLV", kor: "가향/인퓨즈", categoryType: "FLAVORED", matchTokens: ["INFUSED", "BARREL", "FLAVORED", "IN-FUSED"] },
    { key: "BLD", code: "BLD", label: "☕ BLD", kor: "블렌드", categoryType: "HOUSE_BLEND", matchTokens: ["HOUSE BLEND", "BLEND", "블렌드"] }
  ];

  function matchesOriginWheelOption(c, originOpt) {
    if (!originOpt || originOpt.key === "ALL") return true;
    const upOrigin = (c.origin || "").toUpperCase();
    const upProcess = (c.process || "").toUpperCase();
    const kwList = Array.isArray(c.keywords) ? c.keywords : [];

    if (originOpt.categoryType) {
      if (c.categoryType) return c.categoryType === originOpt.categoryType;
      if (originOpt.categoryType === "FERMENTED_LOT") {
        return ["Anaerobic", "Thermal Shock", "Carbonic Maceration"].includes(c.processGroup) ||
          originOpt.matchTokens.some(tok => upProcess.includes(tok)) ||
          kwList.some(k => ["무산소", "특수발효", "열충격", "카보닉", "코지", "효모발효"].includes(k));
      }
      if (originOpt.categoryType === "FLAVORED") {
        return ["Infused", "Barrel Aged", "Flavored"].includes(c.processGroup) ||
          upOrigin.includes("FLAVORED") ||
          upProcess.includes("INFUSED") ||
          upProcess.includes("BARREL") ||
          upProcess.includes("FLAVORED") ||
          kwList.some(k => ["가향", "인퓨즈드"].includes(k));
      }
      if (originOpt.categoryType === "HOUSE_BLEND") {
        return upOrigin.includes("HOUSE BLEND") || (c.name || "").includes("블렌드");
      }
    }

    if (c.countryCode) {
      if (originOpt.code === "USA") {
        return c.countryCode === "USA" || c.countryCode === "HAW";
      }
      return c.countryCode === originOpt.code;
    }
    return originOpt.matchTokens.some(tok => upOrigin.includes(tok));
  }

  function getSourToneClass(val) {
    if (val <= 2) return "sour-low";
    if (val === 3) return "sour-mid";
    return "sour-high";
  }

  function getMatchingCoffees(s, n, b, o, dataset) {
    const data = Array.isArray(dataset) ? dataset : (typeof coffeeData !== "undefined" ? coffeeData : (global.coffeeData || []));
    let sourVal = 2;
    let nuttyVal = 4;
    let bodyVal = 3;
    let originVal = 0;

    if (typeof s === "object" && s !== null) {
      sourVal = typeof s.sour === "number" ? s.sour : 2;
      nuttyVal = typeof s.nutty === "number" ? s.nutty : 4;
      bodyVal = typeof s.body === "number" ? s.body : 3;
      originVal = typeof s.origin === "number" ? s.origin : 0;
    } else if (typeof s === "number") {
      sourVal = s;
      nuttyVal = typeof n === "number" ? n : 4;
      bodyVal = typeof b === "number" ? b : 3;
      originVal = typeof o === "number" ? o : 0;
    }

    const originOpt = ORIGIN_WHEEL_OPTIONS[originVal] || ORIGIN_WHEEL_OPTIONS[0];
    let pool = data;
    if (originVal > 0) {
      const originFiltered = data.filter(c => matchesOriginWheelOption(c, originOpt));
      if (originFiltered.length > 0) pool = originFiltered;
    }

    const scored = pool.map(c => {
      const dSour = sourVal === 0 ? 0 : Math.abs(c.sourDots - sourVal);
      const dNutty = nuttyVal === 0 ? 0 : Math.abs(c.nuttyDots - nuttyVal);
      const dBody = bodyVal === 0 ? 0 : Math.abs(c.bodyDots - bodyVal);
      const manhattan = dSour + dNutty + dBody;
      const euclidean = dSour * dSour + dNutty * dNutty + dBody * dBody;
      const score = manhattan * 10 + euclidean;
      return { item: c, score };
    }).sort((a, b) => a.score - b.score);

    const exactItems = scored.filter(x => x.score === 0).map(x => x.item);
    const closePool = scored.filter(x => x.score > 0).map(x => x.item);
    const minCuration = Math.min(6, pool.length);
    const pickedClose = exactItems.length < minCuration
      ? closePool.slice(0, minCuration - exactItems.length)
      : [];

    return {
      list: [...exactItems, ...pickedClose],
      exactCount: exactItems.length,
      closeCount: pickedClose.length,
      isExact: exactItems.length > 0
    };
  }

  function expandSimilarCoffees(directMatches, minCount = 5, dataset) {
    const data = Array.isArray(dataset) ? dataset : (typeof coffeeData !== "undefined" ? coffeeData : (global.coffeeData || []));
    if (!Array.isArray(directMatches) || directMatches.length === 0 || directMatches.length > 3 || data.length <= directMatches.length) {
      return directMatches;
    }
    const anchor = directMatches[0];
    const anchorFamilies = new Set(Array.isArray(anchor.flavorFamily) ? anchor.flavorFamily : []);
    const usedIds = new Set(directMatches.map(c => c.id));
    const extras = data
      .filter(c => !usedIds.has(c.id))
      .map(c => {
        const tasteDist =
          Math.abs((c.sourDots || 0) - (anchor.sourDots || 0)) +
          Math.abs((c.nuttyDots || 0) - (anchor.nuttyDots || 0)) +
          Math.abs((c.bodyDots || 0) - (anchor.bodyDots || 0));
        const sharedFamilyCount = (Array.isArray(c.flavorFamily) ? c.flavorFamily : [])
          .filter(f => anchorFamilies.has(f)).length;
        return { item: c, simScore: tasteDist * 10 - sharedFamilyCount * 8 };
      })
      .sort((a, b) => a.simScore - b.simScore)
      .slice(0, Math.min(minCount, data.length) - directMatches.length)
      .map(x => x.item);
    return [...directMatches, ...extras];
  }

  // 5. 국가/산지/테마 코드 매핑 (한·영·일 + 초성 + 별칭)
  const COUNTRY_ALIASES = {
    "인도": "IND", "india": "IND", "インド": "IND",
    "인도네시아": "IDN", "인니": "IDN", "indonesia": "IDN", "インドネシア": "IDN",
    "케냐": "KEN", "kenya": "KEN", "ケニア": "KEN",
    "하와이": "USA", "코나": "USA", "hawaii": "USA", "usa": "USA", "haw": "USA", "ハワイ": "USA",
    "자메이카": "JAM", "블루마운틴": "JAM", "jamaica": "JAM", "ジャマイカ": "JAM",
    "파푸아뉴기니": "PNG", "파푸아": "PNG", "papuanewguinea": "PNG", "png": "PNG", "パプアニューギニア": "PNG",
    "중국": "CHN", "운남": "CHN", "중국운남": "CHN", "china": "CHN", "yunnan": "CHN", "中国": "CHN", "中国雲南": "CHN", "雲南": "CHN",
    "온두라스": "HND", "honduras": "HND", "ホンジュラス": "HND",
    "르완다": "RWA", "rwanda": "RWA", "ルワンダ": "RWA",
    "부룬디": "BDI", "burundi": "BDI", "ブルンジ": "BDI",
    "탄자니아": "TZA", "tanzania": "TZA", "タンザニア": "TZA",
    "우간다": "UGA", "uganda": "UGA", "ウガンダ": "UGA",
    "엘살바도르": "SLV", "살바도르": "SLV", "elsalvador": "SLV", "エルサルバドル": "SLV",
    "에티오피아": "ETH", "에티": "ETH", "ethiopia": "ETH", "エチオピア": "ETH",
    "파나마": "PAN", "panama": "PAN", "パナマ": "PAN",
    "코스타리카": "CRI", "코스타": "CRI", "costarica": "CRI", "コスタリカ": "CRI",
    "과테말라": "GTM", "과테": "GTM", "guatemala": "GTM", "グアテマラ": "GTM",
    "니카라과": "NIC", "nicaragua": "NIC", "ニカラグア": "NIC",
    "콜롬비아": "COL", "콜롬": "COL", "colombia": "COL", "コロンビア": "COL",
    "브라질": "BRA", "brazil": "BRA", "ブラジル": "BRA",
    "페루": "PER", "peru": "PER", "ペルー": "PER",
    "에콰도르": "ECU", "ecuador": "ECU", "エクアドル": "ECU",
    "볼리비아": "BOL", "bolivia": "BOL", "ボリビア": "BOL",
    "동티모르": "TLS", "티모르": "TLS", "timorleste": "TLS", "timor": "TLS", "東ティモール": "TLS",
    "베트남": "VNM", "vietnam": "VNM", "ベトナム": "VNM",
    "예멘": "YEM", "yemen": "YEM", "イエメン": "YEM",
    "멕시코": "MEX", "mexico": "MEX", "メキシコ": "MEX",
    "하우스": "BLD", "하우스블렌드": "BLD", "블렌드": "BLD", "houseblend": "BLD", "blend": "BLD", "ハウスブレンド": "BLD", "ブレンド": "BLD"
  };

  function resolveOriginCode(normToken, originList) {
    if (!normToken) return null;
    const isPureChosung = /^[ㄱ-ㅎ]+$/.test(normToken);

    if (COUNTRY_ALIASES[normToken]) {
      return COUNTRY_ALIASES[normToken];
    }

    // originData 내 정확한 국가명/코드/i18n 우선 매칭
    if (Array.isArray(originList)) {
      const exactOrigin = originList.find(o => {
        const normCountry = normalizeText(o.country || "", true);
        const baseCountry = normalizeText((o.country || "").replace(/\([^)]*\)/g, ""), true);
        const normQuery = normalizeText(o.query || "", true);
        const normCode = (o.code || "").toLowerCase();
        const enCountry = o.i18n?.en?.country ? normalizeText(o.i18n.en.country, true) : "";
        const jaCountry = o.i18n?.ja?.country ? normalizeText(o.i18n.ja.country, true) : "";
        return normToken === normQuery || normToken === normCountry ||
          (baseCountry && normToken === baseCountry) ||
          (normCode && normToken === normCode) ||
          (enCountry && normToken === enCountry) ||
          (jaCountry && normToken === jaCountry);
      });
      if (exactOrigin && exactOrigin.code) return exactOrigin.code;
    }

    const wheelExact = ORIGIN_WHEEL_OPTIONS.find(opt => {
      if (opt.key === "ALL") return false;
      const normKor = normalizeText(opt.kor, true);
      return normToken === normKor || normToken === opt.code.toLowerCase();
    });
    if (wheelExact) return wheelExact.code;

    // 순수 초성 국가명 매칭 (2자 이상, 예: ㅋㄹㅂㅇ -> COL)
    if (isPureChosung && normToken.length >= 2) {
      const aliasKey = Object.keys(COUNTRY_ALIASES).find(k => /[가-힣]/.test(k) && getChosung(k) === normToken);
      if (aliasKey) return COUNTRY_ALIASES[aliasKey];
      const originHit = ORIGIN_WHEEL_OPTIONS.find(opt => {
        if (opt.key === "ALL") return false;
        const cleanKor = opt.kor.replace(/[\s()]/g, "");
        return getChosung(cleanKor) === normToken;
      });
      if (originHit) return originHit.code;
    }

    return null;
  }

  // 6. 구어체·감각어·부정어·강도 수식어(약/중/강) 의도(Intent) 규칙 판별기
  function extractIntentFilters(q) {
    const intentFilters = [];
    const MILD_MOD = "(?:약간|살짝|조금|은은한|은은히|약한|약하게|덜|적당한|적당히|마일드|조금만|약간만)";
    const STRONG_MOD = "(?:매우|아주|엄청|엄청나게|완전|진짜|극강|강한|강하게|진한|진하게|최고로|되게|정말|핵|엄청난)";

    // [A] 산미(신맛)
    const noSourPattern = /(안신|안시큼|시지않|신맛없|신맛안|신맛적|신거말고|신거싫|산미없|산미적|산미안|노산미|무산미|lowacid|noacidity|酸味控えめ|酸味なし)/;
    const sourStem = "(?:신거|신것|신맛|신원두|신커피|시큼|새콤|상큼|산미)";
    const mildSourPattern = new RegExp(`(?:${MILD_MOD}[가-힣]{0,2}${sourStem}|산미(?:약|살짝|조금|약간|적당|은은)|신맛(?:약|살짝|조금|약간|은은))`);
    const strongSourPattern = new RegExp(`(?:${STRONG_MOD}[가-힣]{0,2}${sourStem}|화사한산미|산미(?:강|높|최고|폭발|가득))`);
    const highSourPattern = /(신거|신것|신맛|신원두|신커피|시큼|새콤|상큼|산미있|산미강|산미좋|산미높|산미가|톡쏘|시트러스|과즙|쥬시|brightacidity|brightfruity|fruityacid|華やかな酸味)/;

    if (noSourPattern.test(q)) {
      intentFilters.push(item => item.sourDots <= 1);
    } else if (mildSourPattern.test(q)) {
      intentFilters.push(item => item.sourDots === 2 || item.sourDots === 3);
    } else if (strongSourPattern.test(q)) {
      intentFilters.push(item => item.sourDots >= 4);
    } else if (highSourPattern.test(q)) {
      intentFilters.push(item => item.sourDots >= 3);
    }

    // [B] 쓴맛(배전도/자극도)
    const noBitterPattern = /(안쓴|안쓰고|안써|쓰지않|쓴맛없|쓴맛안|쓴맛적|덜쓴|탄맛없|안탄|순한|부드러운|마일드)/;
    const bitterStem = "(?:쓴거|쓴것|쓴맛|쓴원두|쓴커피|씁쓸|쌉싸름|쌉쌀|다크|강배전|탄맛)";
    const mildBitterPattern = new RegExp(`${MILD_MOD}[가-힣]{0,2}${bitterStem}`);
    const strongBitterPattern = new RegExp(`${STRONG_MOD}[가-힣]{0,3}${bitterStem}`);
    const bitterDarkPattern = /(쓴거|쓴것|쓴맛|쓴원두|쓴커피|씁쓸|쌉싸름|쌉쌀|다크로스트|강배전|탄맛|다방|에스프레소용)/;

    if (noBitterPattern.test(q)) {
      intentFilters.push(item => item.roast !== "Dark" && item.roast !== "Medium-Dark" && item.bodyDots <= 3);
    } else if (mildBitterPattern.test(q)) {
      intentFilters.push(item => (item.roast === "Medium" || item.roast === "Medium-Dark") && item.bodyDots >= 2 && item.bodyDots <= 4);
    } else if (strongBitterPattern.test(q)) {
      intentFilters.push(item => item.roast === "Dark" || (item.roast === "Medium-Dark" && item.bodyDots >= 4));
    } else if (bitterDarkPattern.test(q)) {
      intentFilters.push(item => item.roast === "Dark" || item.roast === "Medium-Dark" || (item.bodyDots >= 4 && item.sourDots <= 2));
    }

    // [C] 구수함 / 고소함
    const noNuttyPattern = /(안고소|안구수|고소하지않|구수하지않|고소한거말고|구수한거말고|고소함없|너티없)/;
    const nuttyStem = "(?:구수|고소|꼬숩|꼬수|너티)";
    const mildNuttyPattern = new RegExp(`${MILD_MOD}[가-힣]{0,2}${nuttyStem}`);
    const strongNuttyPattern = new RegExp(`${STRONG_MOD}[가-힣]{0,2}${nuttyStem}`);
    const nuttyPattern = /(구수|고소|꼬숩|꼬수|너티|견과|땅콩|아몬드|헤이즐넛|호두|보리차|숭늉|누룽지|토스트|곡물|nutty|香ばし)/;
    if (noNuttyPattern.test(q)) {
      intentFilters.push(item => item.nuttyDots <= 2);
    } else if (mildNuttyPattern.test(q)) {
      intentFilters.push(item => item.nuttyDots === 2 || item.nuttyDots === 3);
    } else if (strongNuttyPattern.test(q)) {
      intentFilters.push(item => item.nuttyDots >= 4);
    } else if (nuttyPattern.test(q)) {
      intentFilters.push(item => item.nuttyDots >= 3);
    }

    // [D] 바디감 / 농도
    const heavyStem = "(?:묵직|진한|진하고|무거운|무겁|바디감|농밀|걸쭉)";
    const lightStem = "(?:가벼운|가볍|연한|연하고|맑은|깔끔|깨끗|산뜻)";
    const mildHeavyPattern = new RegExp(`${MILD_MOD}[가-힣]{0,2}${heavyStem}`);
    const strongHeavyPattern = new RegExp(`${STRONG_MOD}[가-힣]{0,2}${heavyStem}`);
    const heavyBodyPattern = /(묵직|진한|진하고|무거운|무겁|바디감있|바디감강|바디감높|농밀|걸쭉|스타벅스|heavybody)/;
    const mildLightPattern = new RegExp(`${MILD_MOD}[가-힣]{0,2}${lightStem}`);
    const strongLightPattern = new RegExp(`${STRONG_MOD}[가-힣]{0,2}${lightStem}`);
    const lightBodyPattern = /(가벼운|가볍|연한|연하고|맑은|깔끔|깨끗|산뜻|차같은|티같은|물같은|lightbody)/;

    if (mildHeavyPattern.test(q)) {
      intentFilters.push(item => item.bodyDots === 2 || item.bodyDots === 3);
    } else if (strongHeavyPattern.test(q)) {
      intentFilters.push(item => item.bodyDots >= 4);
    } else if (heavyBodyPattern.test(q)) {
      intentFilters.push(item => item.bodyDots >= 4);
    } else if (mildLightPattern.test(q)) {
      intentFilters.push(item => item.bodyDots === 2 || item.bodyDots === 3);
    } else if (strongLightPattern.test(q)) {
      intentFilters.push(item => item.bodyDots <= 2);
    } else if (lightBodyPattern.test(q)) {
      intentFilters.push(item => item.bodyDots <= 2);
    }

    // [E] 단맛 / 달콤함
    const sweetPattern = /(단거|단것|단맛|달달|달콤|스위트|설탕|꿀|시럽|초코|초콜릿|카라멜|바닐라|잼)/;
    if (sweetPattern.test(q)) {
      intentFilters.push(item => {
        if (typeof item.sweetDots === "number" && item.sweetDots >= 4) return true;
        const hay = `${item.headline} ${item.guide} ${item.sourDesc} ${item.nuttyDesc} ${item.sweetDesc || ''} ${(item.keywords || []).join(' ')}`;
        return /(달콤|단맛|달달|꿀|초콜릿|초코|카라멜|시럽|바닐라|잼|설탕|스위트|메이플)/.test(hay);
      });
    }

    // [F] 디카페인 / 저카페인
    const decafPattern = /(디카페인|저카페인|카페인없|카페인적|로리나|버본포인투|유제니오이데스|밤에|저녁|숙면|임산부|속편한|decaf|lowcaf|デカフェ|カフェインレス)/;
    if (decafPattern.test(q)) {
      intentFilters.push(item =>
        item.caffeine === "DECAF" ||
        item.caffeine === "LOW_CAF" ||
        (item.process || "").toLowerCase().includes("decaf") ||
        (item.keywords || []).includes("디카페인")
      );
    }

    // [G] 바디감 1~5단계 명시
    if (q.includes("1단계") || q.includes("생수") || q.includes("허브티")) intentFilters.push(item => item.bodyStage === "1단계");
    if (q.includes("2단계") || q.includes("주스")) intentFilters.push(item => item.bodyStage === "2단계");
    if (q.includes("3단계") || q.includes("저지방")) intentFilters.push(item => item.bodyStage === "3단계");
    if (q.includes("4단계") || q.includes("우유") || q.includes("핫초코")) intentFilters.push(item => item.bodyStage === "4단계");
    if (q.includes("5단계") || q.includes("생크림")) intentFilters.push(item => item.bodyStage === "5단계");

    return intentFilters;
  }

  // 7. 원두 다중 필드 검색 인덱스 구축 (한/영/일 원두명·산지·품종·가공·향미·생산자·초성)
  function matchesChosungPhrase(rawText, qCho) {
    if (!rawText || !qCho) return false;
    const cleaned = normalizeText(rawText, false);
    if (!cleaned) return false;
    const words = cleaned.split(/\s+/).filter(Boolean);
    const wordChos = words.map(w => getChosung(w));
    for (let i = 0; i < wordChos.length; i++) {
      if (wordChos[i].includes(qCho)) return true;
      // 어절 시작부터 이어붙인 초성 (예: "게샤 빌리지" -> "ㄱㅅㅂㄹㅈ")
      if (qCho.length >= 2) {
        const joinedSuffix = wordChos.slice(i).join('');
        if (joinedSuffix.startsWith(qCho)) return true;
      }
    }
    return false;
  }

  function buildItemSearchIndex(item) {
    const tr = item.traceability || {};
    const i18nKo = item.i18n?.ko || {};
    const i18nEn = item.i18n?.en || {};
    const i18nJa = item.i18n?.ja || {};
    const originMapDict = typeof ORIGIN_I18N_MAP !== "undefined" ? ORIGIN_I18N_MAP : global.ORIGIN_I18N_MAP;
    const originMap = (originMapDict && originMapDict[item.countryCode]) || {};
    const tax = typeof COFFEE_TAXONOMY !== "undefined" ? COFFEE_TAXONOMY : (global.COFFEE_TAXONOMY || null);
    const procTax = tax && tax.processGroup && tax.processGroup[item.processGroup];
    const roastTax = tax && tax.roast && tax.roast[item.roast];
    const famTaxParts = [];
    if (tax && tax.flavorFamily && Array.isArray(item.flavorFamily)) {
      item.flavorFamily.forEach(f => {
        const ft = tax.flavorFamily[f];
        if (ft) famTaxParts.push(ft.ko, ft.en, ft.ja);
      });
    }

    const primaryRawParts = [
      item.name, item.eng, item.origin, item.countryCode,
      originMap.ko, originMap.en, originMap.ja,
      item.region, i18nKo.region, i18nEn.region, i18nJa.region,
      i18nEn.name, i18nJa.name, i18nEn.subName, i18nJa.subName,
      item.varietal, item.varietalCanonical, item.lineage, item.species,
      item.physicalGrade, item.process, item.processGroup,
      procTax?.ko, procTax?.en, procTax?.ja,
      roastTax?.ko, roastTax?.en, roastTax?.ja,
      tr.producerName, tr.estateOrStation,
      tr.tradeSearchQuery?.ko, tr.tradeSearchQuery?.en, tr.tradeSearchQuery?.ja,
      tr.source?.label,
      ...famTaxParts,
      ...(Array.isArray(item.flavorFamily) ? item.flavorFamily : []),
      ...(Array.isArray(item.keywords) ? item.keywords : [])
    ].filter(Boolean);

    const noteRawParts = [
      item.headline, item.sourDesc, item.nuttyDesc, item.bodyDesc, item.sweetDesc, item.guide,
      i18nEn.headline, i18nEn.sourDesc, i18nEn.nuttyDesc, i18nEn.bodyDesc, i18nEn.sweetDesc, i18nEn.guide,
      i18nJa.headline, i18nJa.sourDesc, i18nJa.nuttyDesc, i18nJa.bodyDesc, i18nJa.sweetDesc, i18nJa.guide
    ].filter(Boolean);

    const primaryNorm = primaryRawParts.map(p => normalizeText(p, true)).join('|');
    const noteNorm = noteRawParts.map(p => normalizeText(p, true)).join('|');
    const allNorm = `${primaryNorm}|${noteNorm}`;
    const allPhonetic = phoneticFoldKo(allNorm);

    const producerNorm = [
      tr.producerName, tr.estateOrStation,
      tr.tradeSearchQuery?.ko, tr.tradeSearchQuery?.en, tr.tradeSearchQuery?.ja,
      tr.source?.label
    ].filter(Boolean).map(p => normalizeText(p, true)).join('|');

    const nameNorm = [item.name, item.eng, i18nEn.name, i18nJa.name]
      .filter(Boolean).map(p => normalizeText(p, true)).join('|');

    return {
      primaryRawParts,
      noteRawParts,
      primaryNorm,
      noteNorm,
      allNorm,
      allPhonetic,
      producerNorm,
      nameNorm
    };
  }

  function scoreTokenMatch(item, idx, token, originList) {
    if (!token) return 0;
    const isPureChosung = /^[ㄱ-ㅎ]+$/.test(token);

    // 1) 국가/산지 코드가 토큰과 일치하는지 확인 (예: "에티오피아", "ㅋㄹㅂㅇ", "Colombia", "エチオピア")
    const originCode = resolveOriginCode(token, originList);
    if (originCode) {
      const targetOpt = ORIGIN_WHEEL_OPTIONS.find(opt => opt.code === originCode);
      if (targetOpt) {
        return matchesOriginWheelOption(item, targetOpt) ? 100 : 0;
      }
    }

    // 2) 순수 초성 검색 (어절 경계 보존 다중 필드: 원두명·산지·생산자·향미 노트)
    if (isPureChosung) {
      if (idx.primaryRawParts.some(p => matchesChosungPhrase(p, token))) return 85;
      if (idx.noteRawParts.some(p => matchesChosungPhrase(p, token))) return 65;
      return 0;
    }

    // 3) 원두명·생산자·산지·가공·키워드 등 핵심 필드 매칭 + 다국어 향미 동의어 확장
    const MULTILINGUAL_SYNONYMS = {
      peach: ["복숭아", "피치", "peach"], "桃": ["복숭아", "피치", "peach"], "ピーチ": ["복숭아", "피치", "peach"],
      blueberry: ["블루베리", "blueberry"], "ブルーベリー": ["블루베리", "blueberry"],
      strawberry: ["딸기", "strawberry"], "いちご": ["딸기", "strawberry"], "ストロベリー": ["딸기", "strawberry"],
      chocolate: ["초콜릿", "초코", "카카오", "chocolate"], "チョコ": ["초콜릿", "초코", "카카오", "chocolate"], "チョコレート": ["초콜릿", "초코", "카카오", "chocolate"],
      jasmine: ["자스민", "jasmine"], "ジャスミン": ["자스민", "jasmine"],
      grapefruit: ["자몽", "grapefruit"], "グレープフルーツ": ["자몽", "grapefruit"],
      honey: ["꿀", "허니", "honey"], "蜂蜜": ["꿀", "허니", "honey"],
      hazelnut: ["헤이즐넛", "hazelnut"], "ヘーゼルナッツ": ["헤이즐넛", "hazelnut"],
      almond: ["아몬드", "almond"], "アーモンド": ["아몬드", "almond"],
      caramel: ["카라멜", "caramel"], "キャラメル": ["카라멜", "caramel"],
      wine: ["와인", "wine"], winey: ["와인", "wine"], "ワイン": ["와인", "wine"],
      apple: ["사과", "청사과", "apple"], "りんご": ["사과", "청사과", "apple"],
      orange: ["오렌지", "orange"], "オレンジ": ["오렌지", "orange"],
      lemon: ["레몬", "lemon"], "レモン": ["레몬", "lemon"],
      vanilla: ["바닐라", "vanilla"], "バニラ": ["바닐라", "vanilla"],
      watermelon: ["수박", "워터멜론", "watermelon"], "スイカ": ["수박", "워터멜론", "watermelon"],
      lychee: ["리치", "lychee"], "ライチ": ["리치", "lychee"],
      whisky: ["위스키", "whisky"], whiskey: ["위스키", "whisky"], "ウイスキー": ["위스키", "whisky"],
      grape: ["청포도", "포도", "grape"], greengrape: ["청포도", "포도", "grape"], "マスカット": ["청포도", "포도", "grape"],
      rose: ["장미", "rose"], "バラ": ["장미", "rose"],
      plum: ["자두", "plum"], "プラム": ["자두", "plum"],
      mango: ["망고", "mango"], "マンゴー": ["망고", "mango"],
      cinnamon: ["계피", "시나몬", "cinnamon"], "シナモン": ["계피", "시나몬", "cinnamon"],
      walnut: ["호두", "walnut"], "胡桃": ["호두", "walnut"],
      peanut: ["땅콩", "peanut"], "ピーナッツ": ["땅콩", "peanut"]
    };
    const variants = MULTILINGUAL_SYNONYMS[token] || [token];
    for (let v = 0; v < variants.length; v++) {
      const vt = variants[v];
      if (idx.nameNorm.includes(vt)) return 95;
      if (idx.producerNorm.includes(vt)) return 92;
      if (idx.primaryNorm.includes(vt)) return 80;
      if (idx.noteNorm.includes(vt)) return 55;
    }

    // 4) 3글자 이상 한국어 외래어 유사음 폴백 매칭
    const hangulCount = (token.match(/[가-힣]/g) || []).length;
    if (hangulCount >= 3) {
      const folded = phoneticFoldKo(token);
      if (idx.allPhonetic.includes(folded)) return 45;
    }

    return 0;
  }

  // 8. Casper™ V1 메인 스마트 검색 엔진
  function getSearchFilteredCoffees(rawQuery, dataset, origins, options) {
    const data = Array.isArray(dataset) ? dataset : (typeof coffeeData !== "undefined" ? coffeeData : (global.coffeeData || []));
    const originList = Array.isArray(origins) ? origins : (typeof originData !== "undefined" ? originData : (global.originData || []));
    const trimmedRaw = (rawQuery || "").trim();
    if (!trimmedRaw) return data;

    const q = normalizeText(trimmedRaw, true);
    if (!q) return data;
    const isPureChosung = /^[ㄱ-ㅎ]+$/.test(q);

    // [1] 특수/카테고리 단일 질의 우선 처리 (Phase 1 보증 유지)
    if (/^(블렌|블렌드|블렌딩|블랜드|하우스블렌|하우스블랜드|blend|blending|houseblend|ブレンド|ハウスブレンド)$/.test(q)) {
      const bldOpt = ORIGIN_WHEEL_OPTIONS.find(opt => opt.code === "BLD");
      if (bldOpt) return data.filter(c => matchesOriginWheelOption(c, bldOpt));
    }
    if (/^(특수발효가향|가향특수발효|fermentedinfused|特殊発酵フレーバー)$/.test(q)) {
      return data.filter(c => c.categoryType === "FERMENTED_LOT" || c.categoryType === "FLAVORED");
    }
    if (/^(특수발효|무산소|혐기성|서멀쇼크|열충격|카보닉|코지|효모발효|anaerobic|thermalshock|carbonicmaceration|特殊発酵|嫌気性発酵)$/.test(q)) {
      const ferOpt = ORIGIN_WHEEL_OPTIONS.find(opt => opt.code === "FER");
      if (ferOpt) return data.filter(c => matchesOriginWheelOption(c, ferOpt));
    }
    if (/^(가향|인퓨즈드|인퓨즈|배럴|오크통|향료|infused|flavored|barrelaged|フレーバー|インフューズド)$/.test(q)) {
      const flvOpt = ORIGIN_WHEEL_OPTIONS.find(opt => opt.code === "FLV");
      if (flvOpt) return data.filter(c => matchesOriginWheelOption(c, flvOpt));
    }
    if (/^(균형밸런스|밸런스|균형|smoothbalance|黄金バランス)$/.test(q)) {
      return data.filter(c => c.sourDots >= 2 && c.sourDots <= 3 && c.nuttyDots >= 3 && c.nuttyDots <= 4 && c.bodyDots >= 2 && c.bodyDots <= 4);
    }

    // [2] 단일 국가/산지/초성 국가명 정확한 매칭 ('콜롬비아' vs 'ㅋㄹㅂㅇ' 16종, '인도' 3종 vs '인도네시아' 4종)
    const wholeOriginCode = resolveOriginCode(q, originList);
    if (wholeOriginCode) {
      const targetOpt = ORIGIN_WHEEL_OPTIONS.find(opt => opt.code === wholeOriginCode);
      if (targetOpt) return data.filter(c => matchesOriginWheelOption(c, targetOpt));
    }

    // [3] 공백 토큰 분해 + 산지 + 의도(Intent) 결합 처리
    const rawTokens = trimmedRaw
      .split(/\s+/)
      .map(t => normalizeText(t, true))
      .filter(Boolean);

    const FILLER_TOKENS = new Set(["추천해줘", "추천", "원두커피", "커피원두", "원두", "커피", "beans", "bean", "coffee"]);
    let searchTokens = rawTokens.filter(t => !FILLER_TOKENS.has(t));
    if (searchTokens.length === 0) searchTokens = rawTokens;

    let candidatePool = data;
    const originMatchedCodes = [];
    for (let i = 0; i < searchTokens.length; i++) {
      const oc = resolveOriginCode(searchTokens[i], originList);
      if (oc) originMatchedCodes.push(oc);
    }
    if (originMatchedCodes.length > 0 && searchTokens.length >= 2) {
      candidatePool = data.filter(c =>
        originMatchedCodes.every(code => {
          const opt = ORIGIN_WHEEL_OPTIONS.find(o => o.code === code);
          return opt ? matchesOriginWheelOption(c, opt) : true;
        })
      );
    }

    const intentFilters = extractIntentFilters(q);
    if (intentFilters.length > 0) {
      const intentMatched = candidatePool.filter(item => intentFilters.every(fn => fn(item)));
      if (intentMatched.length > 0) {
        return (options && options.expandSimilar)
          ? expandSimilarCoffees(intentMatched, 5, data)
          : intentMatched;
      }
    }

    // 1개 토큰이면서 접미사('한거', '맛', '원두' 등) 제거 가능한 경우
    if (searchTokens.length === 1 && !isPureChosung) {
      const strippedSingle = searchTokens[0].replace(/(추천해줘|추천|원두커피|커피원두|원두|커피|한거|한것|한맛|인거|거|맛)$/g, '').trim();
      if (strippedSingle && strippedSingle !== searchTokens[0]) {
        const strippedOrigin = resolveOriginCode(strippedSingle, originList);
        if (strippedOrigin) {
          const targetOpt = ORIGIN_WHEEL_OPTIONS.find(opt => opt.code === strippedOrigin);
          if (targetOpt) return data.filter(c => matchesOriginWheelOption(c, targetOpt));
        }
        searchTokens = [strippedSingle];
      }
    }

    const scoredResults = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const idx = buildItemSearchIndex(item);

      // 전체 구문(공백 제거) 직접 매칭 보너스 (예: "Gesha Village" -> "geshavillage")
      const fullPhraseScore = !isPureChosung ? scoreTokenMatch(item, idx, q, originList) : 0;

      let totalScore = 0;
      let allTokensMatched = true;
      for (let t = 0; t < searchTokens.length; t++) {
        const tokScore = scoreTokenMatch(item, idx, searchTokens[t], originList);
        if (tokScore <= 0) {
          allTokensMatched = false;
          break;
        }
        totalScore += tokScore;
      }

      if (allTokensMatched && totalScore > 0) {
        scoredResults.push({ item, score: totalScore + (fullPhraseScore > 0 ? 40 : 0) });
      } else if (fullPhraseScore > 0) {
        scoredResults.push({ item, score: fullPhraseScore });
      }
    }

    scoredResults.sort((a, b) => b.score - a.score);
    const directMatches = scoredResults.map(r => r.item);

    if (options && options.expandSimilar) {
      return expandSimilarCoffees(directMatches, 5, data);
    }
    return directMatches;
  }

  // 9. 실시간 자동완성 추천 엔진 (원두명 · 산지 · 향미 · 생산자, KR/EN/JP 완역)
  const FLAVOR_SUGGESTIONS = [
    { ko: "복숭아", en: "Peach", ja: "桃（ピーチ）", query: { ko: "복숭아", en: "Peach", ja: "桃" } },
    { ko: "블루베리", en: "Blueberry", ja: "ブルーベリー", query: { ko: "블루베리", en: "Blueberry", ja: "ブルーベリー" } },
    { ko: "딸기", en: "Strawberry", ja: "いちご（ストロベリー）", query: { ko: "딸기", en: "Strawberry", ja: "いちご" } },
    { ko: "초콜릿", en: "Chocolate", ja: "チョコレート", query: { ko: "초콜릿", en: "Chocolate", ja: "チョコ" } },
    { ko: "자스민", en: "Jasmine", ja: "ジャスミン", query: { ko: "자스민", en: "Jasmine", ja: "ジャスミン" } },
    { ko: "자몽", en: "Grapefruit", ja: "グレープフルーツ", query: { ko: "자몽", en: "Grapefruit", ja: "グレープフルーツ" } },
    { ko: "아카시아 꿀", en: "Honey", ja: "蜂蜜", query: { ko: "꿀", en: "Honey", ja: "蜂蜜" } },
    { ko: "헤이즐넛", en: "Hazelnut", ja: "ヘーゼルナッツ", query: { ko: "헤이즐넛", en: "Hazelnut", ja: "ヘーゼルナッツ" } },
    { ko: "아몬드", en: "Almond", ja: "アーモンド", query: { ko: "아몬드", en: "Almond", ja: "アーモンド" } },
    { ko: "카라멜", en: "Caramel", ja: "キャラメル", query: { ko: "카라멜", en: "Caramel", ja: "キャラメル" } },
    { ko: "레드와인", en: "Winey", ja: "ワイン", query: { ko: "와인", en: "Wine", ja: "ワイン" } },
    { ko: "사과", en: "Apple", ja: "りんご", query: { ko: "사과", en: "Apple", ja: "りんご" } },
    { ko: "오렌지", en: "Orange", ja: "オレンジ", query: { ko: "오렌지", en: "Orange", ja: "オレンジ" } },
    { ko: "레몬", en: "Lemon", ja: "レモン", query: { ko: "레몬", en: "Lemon", ja: "レモン" } },
    { ko: "바닐라", en: "Vanilla", ja: "バニラ", query: { ko: "바닐라", en: "Vanilla", ja: "バニラ" } },
    { ko: "수박", en: "Watermelon", ja: "スイカ", query: { ko: "수박", en: "Watermelon", ja: "スイカ" } },
    { ko: "리치", en: "Lychee", ja: "ライチ", query: { ko: "리치", en: "Lychee", ja: "ライチ" } },
    { ko: "위스키 배럴", en: "Whisky Barrel", ja: "ウイスキー樽", query: { ko: "위스키", en: "Whisky", ja: "ウイスキー" } },
    { ko: "청포도", en: "Green Grape", ja: "マスカット", query: { ko: "청포도", en: "Grape", ja: "マスカット" } },
    { ko: "무산소 발효", en: "Anaerobic", ja: "嫌気性発酵", query: { ko: "무산소", en: "Anaerobic", ja: "嫌気性" } },
    { ko: "워시드", en: "Washed", ja: "ウォッシュト", query: { ko: "워시드", en: "Washed", ja: "ウォッシュト" } },
    { ko: "내추럴", en: "Natural", ja: "ナチュラル", query: { ko: "내추럴", en: "Natural", ja: "ナチュラル" } },
    { ko: "게이샤", en: "Geisha", ja: "ゲイシャ", query: { ko: "게이샤", en: "Geisha", ja: "ゲイシャ" } },
    { ko: "디카페인", en: "Decaf", ja: "デカフェ", query: { ko: "디카페인", en: "Decaf", ja: "デカフェ" } }
  ];

  function getAutocompleteSuggestions(rawQuery, dataset, origins, lang = 'ko', limit = 8) {
    const data = Array.isArray(dataset) ? dataset : (typeof coffeeData !== "undefined" ? coffeeData : (global.coffeeData || []));
    const originList = Array.isArray(origins) ? origins : (typeof originData !== "undefined" ? originData : (global.originData || []));
    const safeLang = (lang === 'en' || lang === 'ja') ? lang : 'ko';
    const trimmed = (rawQuery || '').trim();
    if (!trimmed) return [];

    const qNorm = normalizeText(trimmed, true);
    if (!qNorm) return [];
    const isPureCho = /^[ㄱ-ㅎ]+$/.test(qNorm);
    const candidates = [];
    const seen = new Set();

    function pushCandidate(type, label, subLabel, query, score, coffeeId = null) {
      const key = `${type}:${String(query).toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);
      candidates.push({ type, label, subLabel, query, score, coffeeId });
    }

    // 1) 산지 추천
    for (let i = 0; i < originList.length; i++) {
      const o = originList[i];
      const locCountry = (o.i18n && o.i18n[safeLang]?.country) || o.country;
      const locFlavor = (o.i18n && o.i18n[safeLang]?.flavor) || o.flavor;
      const targets = [
        locCountry,
        o.country,
        o.code,
        o.i18n?.en?.country,
        o.i18n?.ja?.country
      ].filter(Boolean);

      let matchedScore = 0;
      for (let j = 0; j < targets.length; j++) {
        const tn = normalizeText(targets[j], true);
        if (isPureCho) {
          if (getChosung(tn).startsWith(qNorm)) matchedScore = Math.max(matchedScore, 96);
          else if (getChosung(tn).includes(qNorm)) matchedScore = Math.max(matchedScore, 84);
        } else if (tn === qNorm) {
          matchedScore = Math.max(matchedScore, 100);
        } else if (tn.startsWith(qNorm)) {
          matchedScore = Math.max(matchedScore, 94);
        } else if (tn.includes(qNorm)) {
          matchedScore = Math.max(matchedScore, 80);
        }
      }
      if (matchedScore > 0) {
        pushCandidate('origin', `${o.flag || '🌍'} ${locCountry}`, locFlavor, locCountry, matchedScore);
      }
    }

    // 2) 향미·가공·품종 추천
    for (let i = 0; i < FLAVOR_SUGGESTIONS.length; i++) {
      const f = FLAVOR_SUGGESTIONS[i];
      const label = f[safeLang] || f.ko;
      const qVal = f.query[safeLang] || f.query.ko;
      const targets = [f.ko, f.en, f.ja, f.query.ko, f.query.en, f.query.ja];
      let matchedScore = 0;
      for (let j = 0; j < targets.length; j++) {
        const tn = normalizeText(targets[j], true);
        if (isPureCho) {
          if (getChosung(tn).startsWith(qNorm)) matchedScore = Math.max(matchedScore, 90);
          else if (getChosung(tn).includes(qNorm)) matchedScore = Math.max(matchedScore, 78);
        } else if (tn === qNorm) {
          matchedScore = Math.max(matchedScore, 95);
        } else if (tn.startsWith(qNorm)) {
          matchedScore = Math.max(matchedScore, 88);
        } else if (tn.includes(qNorm)) {
          matchedScore = Math.max(matchedScore, 74);
        }
      }
      if (matchedScore > 0) {
        const subLbl = safeLang === 'en' ? 'Flavor & Note' : (safeLang === 'ja' ? '風味・精製ノート' : '향미 · 가공 노트');
        pushCandidate('flavor', label, subLbl, qVal, matchedScore);
      }
    }

    // 3) 생산자·농장·워싱스테이션 추천 (검증 완료 실명 위주)
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const tr = item.traceability;
      if (!tr || tr.authenticityType !== 'ESTATE_LOT') continue;
      const station = tr.estateOrStation || '';
      const producer = tr.producerName || '';
      const koTrade = tr.tradeSearchQuery?.ko || '';
      const jaTrade = tr.tradeSearchQuery?.ja || '';
      const targets = [station, producer, koTrade, jaTrade].filter(Boolean);

      let matchedScore = 0;
      for (let j = 0; j < targets.length; j++) {
        const tn = normalizeText(targets[j], true);
        if (isPureCho) {
          if (matchesChosungPhrase(targets[j], qNorm)) matchedScore = Math.max(matchedScore, 82);
        } else if (tn.startsWith(qNorm)) {
          matchedScore = Math.max(matchedScore, 93);
        } else if (tn.includes(qNorm)) {
          matchedScore = Math.max(matchedScore, 83);
        }
      }
      if (matchedScore > 0) {
        // 추출된 대표 농장명(괄호 앞부분)을 쿼리로 사용해 정확 매칭
        const cleanStation = station.replace(/\s*\([^)]*\)/g, '').trim() || producer;
        const displayLabel = cleanStation;
        const subLbl = producer && producer !== cleanStation ? producer : ((item.i18n && item.i18n[safeLang]?.originBadge) || item.origin);
        pushCandidate('producer', displayLabel, subLbl, cleanStation, matchedScore, item.id);
      }
    }

    // 4) 원두명 추천
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const loc = (item.i18n && item.i18n[safeLang]) || {};
      const beanName = loc.name || item.name;
      const beanOrigin = loc.originBadge || item.origin;
      const targets = [beanName, item.name, item.eng, item.i18n?.en?.name, item.i18n?.ja?.name].filter(Boolean);

      let matchedScore = 0;
      for (let j = 0; j < targets.length; j++) {
        const tn = normalizeText(targets[j], true);
        if (isPureCho) {
          if (getChosung(tn).startsWith(qNorm)) matchedScore = Math.max(matchedScore, 86);
          else if (matchesChosungPhrase(targets[j], qNorm)) matchedScore = Math.max(matchedScore, 72);
        } else if (tn === qNorm) {
          matchedScore = Math.max(matchedScore, 98);
        } else if (tn.startsWith(qNorm)) {
          matchedScore = Math.max(matchedScore, 89);
        } else if (tn.includes(qNorm)) {
          matchedScore = Math.max(matchedScore, 76);
        }
      }
      if (matchedScore > 0) {
        pushCandidate('bean', beanName, beanOrigin, beanName, matchedScore, item.id);
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    return candidates.slice(0, limit);
  }

  // 10. Phase 2-2B: Today's Pick 바리스타 추천 엔진 (1단계 무API 날짜·계절·시간대 + 2단계 날씨·기온)
  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function hasKoFinalConsonant(str) {
    if (!str) return false;
    const trimmed = String(str).trim();
    for (let i = trimmed.length - 1; i >= 0; i--) {
      const code = trimmed.charCodeAt(i);
      if (code >= 44032 && code <= 55203) {
        return ((code - 44032) % 28) !== 0;
      }
      if (/[0-9A-Za-z]/.test(trimmed[i])) {
        const ch = trimmed[i].toUpperCase();
        return /[136780LMNR]/.test(ch);
      }
    }
    return false;
  }

  function resolveDateContext(context) {
    const ctx = context || {};
    let d;
    if (ctx.date instanceof Date && !isNaN(ctx.date.getTime())) {
      d = ctx.date;
    } else if (typeof ctx.date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(ctx.date.trim())) {
      const parts = ctx.date.trim().slice(0, 10).split('-').map(Number);
      d = new Date(parts[0], parts[1] - 1, parts[2], typeof ctx.hour === 'number' ? ctx.hour : 12, 0, 0);
    } else {
      d = new Date();
    }
    const yyyy = d.getFullYear();
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    const dateKey = `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
    const hour = typeof ctx.hour === 'number' && !isNaN(ctx.hour)
      ? ((Math.floor(ctx.hour) % 24) + 24) % 24
      : d.getHours();

    let timeSlot = 'afternoon';
    if (hour >= 5 && hour <= 10) timeSlot = 'morning';
    else if (hour >= 11 && hour <= 13) timeSlot = 'lunch';
    else if (hour >= 14 && hour <= 17) timeSlot = 'afternoon';
    else timeSlot = 'evening';

    let season = 'autumn';
    if (mm >= 3 && mm <= 5) season = 'spring';
    else if (mm >= 6 && mm <= 8) season = 'summer';
    else if (mm >= 9 && mm <= 11) season = 'autumn';
    else season = 'winter';

    const tempC = (typeof ctx.tempC === 'number' && !isNaN(ctx.tempC)) ? ctx.tempC : null;
    const rawW = ctx.weatherCondition ? String(ctx.weatherCondition).toLowerCase().trim() : '';
    const validWeather = ['clear', 'cloudy', 'rain', 'snow', 'hot', 'cold'];
    let weatherCondition = validWeather.indexOf(rawW) >= 0 ? rawW : null;

    if (!weatherCondition && tempC !== null) {
      if (tempC >= 28) weatherCondition = 'hot';
      else if (tempC <= 4) weatherCondition = 'cold';
    } else if ((weatherCondition === 'clear' || weatherCondition === 'cloudy') && tempC !== null) {
      if (tempC >= 28) weatherCondition = 'hot';
      else if (tempC <= 4) weatherCondition = 'cold';
    }

    return { dateKey, month: mm, hour, timeSlot, season, weatherCondition, tempC };
  }

  function scoreBeanForContext(item, ctxMeta) {
    const { timeSlot, season, weatherCondition } = ctxMeta;
    const sour = Number(item.sourDots || 2);
    const nutty = Number(item.nuttyDots || 2);
    const body = Number(item.bodyDots || 2);
    const sweet = Number(item.sweetDots || 3);
    const fam = Array.isArray(item.flavorFamily) ? item.flavorFamily : [];
    const proc = String(item.processGroup || item.process || '').toUpperCase();
    const roast = String(item.roast || '').toUpperCase();
    const isDecaf = item.caffeine === 'DECAF' || proc.includes('DECAF');
    const isLowCaf = item.caffeine === 'LOW_CAF';
    const isFloralCitrus = fam.includes('FLORAL') || fam.includes('CITRUS') || fam.includes('BERRY') || fam.includes('STONE_FRUIT');
    const isChocoNutty = fam.includes('CHOCOLATE') || fam.includes('NUTTY') || fam.includes('CARAMEL');
    const isEarthySpicy = fam.includes('EARTHY') || fam.includes('SPICY') || fam.includes('HERBAL');
    const isWashed = proc.includes('WASHED');

    let score = 10;

    // 1) 시간대 가중치
    if (timeSlot === 'morning') {
      if (sour >= 3) score += 6;
      if (nutty >= 1 && nutty <= 3) score += 2;
      if (body <= 3) score += 5;
      if (!isDecaf && !isLowCaf) score += 4;
      if (isWashed || isFloralCitrus) score += 4;
      if (isDecaf) score -= 6;
    } else if (timeSlot === 'lunch') {
      if (sour >= 2 && sour <= 4) score += 4;
      if (nutty >= 3 && nutty <= 4) score += 5;
      if (body >= 2 && body <= 4) score += 4;
      if (sweet >= 3) score += 3;
      if (!isDecaf) score += 3;
    } else if (timeSlot === 'afternoon') {
      if (sour >= 2 && sour <= 4) score += 3;
      if (nutty >= 3) score += 5;
      if (body >= 3 && body <= 4) score += 4;
      if (sweet >= 4) score += 5;
      if (isChocoNutty || fam.includes('BERRY')) score += 3;
    } else {
      // evening / night: DECAF & LOW_CAF 최우선
      if (isDecaf) score += 24;
      else if (isLowCaf) score += 18;
      if (sour <= 3) score += 4;
      if (nutty >= 3) score += 4;
      if (body >= 2 && body <= 4) score += 3;
      if (sweet >= 3) score += 3;
    }

    // 2) 계절 가중치
    if (season === 'spring') {
      if (sour >= 3) score += 4;
      if (body <= 3) score += 3;
      if (isFloralCitrus || isWashed) score += 4;
    } else if (season === 'summer') {
      if (sour >= 4) score += 5;
      if (body <= 2) score += 5;
      if (isWashed || fam.includes('CITRUS') || fam.includes('BERRY')) score += 4;
    } else if (season === 'autumn') {
      if (sour >= 2 && sour <= 3) score += 3;
      if (nutty >= 3) score += 5;
      if (body >= 3 && body <= 4) score += 4;
      if (isChocoNutty || proc.includes('HONEY')) score += 3;
    } else {
      if (sour <= 2) score += 3;
      if (nutty >= 4) score += 5;
      if (body >= 4) score += 5;
      if (isChocoNutty || isEarthySpicy || roast.includes('DARK')) score += 4;
    }

    // 3) 날씨·기온 가중치 (2단계 연동 시)
    if (weatherCondition === 'rain') {
      if (body >= 4) score += 9;
      if (sour <= 2) score += 6;
      if (nutty >= 3) score += 5;
      if (item.countryCode === 'IDN') score += 8;
      if (isEarthySpicy || fam.includes('CHOCOLATE')) score += 5;
    } else if (weatherCondition === 'snow') {
      if (body >= 4) score += 8;
      if (nutty >= 4) score += 6;
      if (sweet >= 4) score += 6;
      if (sour <= 2) score += 5;
      if (isChocoNutty || roast.includes('DARK')) score += 5;
    } else if (weatherCondition === 'hot') {
      if (sour >= 4) score += 8;
      if (body <= 2) score += 8;
      if (isWashed || fam.includes('CITRUS') || fam.includes('BERRY') || fam.includes('TROPICAL')) score += 6;
      if (sour <= 1) score -= 4;
    } else if (weatherCondition === 'cold') {
      if (body >= 4) score += 8;
      if (nutty >= 4) score += 7;
      if (sweet >= 4) score += 5;
      if (sour <= 2) score += 5;
      if (isChocoNutty || roast.includes('DARK')) score += 5;
    } else if (weatherCondition === 'cloudy') {
      if (nutty >= 3) score += 6;
      if (body >= 3 && body <= 4) score += 5;
      if (sour >= 2 && sour <= 3) score += 4;
      if (isChocoNutty || proc.includes('HONEY')) score += 4;
    } else if (weatherCondition === 'clear') {
      if (sour >= 3) score += 6;
      if (body <= 3) score += 4;
      if (isFloralCitrus || isWashed) score += 5;
    }

    return score;
  }

  function getLocalizedBeanDisplayName(item, lang) {
    if (!item) return '';
    if (lang === 'en') {
      return (item.i18n && item.i18n.en && item.i18n.en.name) || item.eng || item.name || '';
    }
    if (lang === 'ja') {
      return (item.i18n && item.i18n.ja && item.i18n.ja.name) || item.eng || item.name || '';
    }
    return item.name || '';
  }

  function buildTodaysPickCopy(primary, ctxMeta, lang, cityLabel) {
    const safeLang = (lang === 'en' || lang === 'ja') ? lang : 'ko';
    const beanName = getLocalizedBeanDisplayName(primary, safeLang);
    const { timeSlot, season, weatherCondition, tempC } = ctxMeta;
    const tempSuffix = (tempC !== null) ? ` ${Math.round(tempC)}°C` : '';
    const cityPrefix = cityLabel ? `${cityLabel} · ` : '';

    const timeLabels = {
      ko: { morning: '오전', lunch: '점심', afternoon: '오후', evening: '저녁·야간' },
      en: { morning: 'Morning', lunch: 'Midday', afternoon: 'Afternoon', evening: 'Evening' },
      ja: { morning: '午前', lunch: 'ランチ', afternoon: '午後', evening: '夜' }
    };
    const seasonLabels = {
      ko: { spring: '봄', summer: '여름', autumn: '가을', winter: '겨울' },
      en: { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' },
      ja: { spring: '春', summer: '夏', autumn: '秋', winter: '冬' }
    };
    const weatherBadges = {
      ko: { rain: '🌧️ 비', snow: '❄️ 눈', cloudy: '⛅ 흐림', clear: '☀️ 맑음', hot: '🥵 무더위', cold: '🧣 쌀쌀함' },
      en: { rain: '🌧️ Rainy', snow: '❄️ Snowy', cloudy: '⛅ Cloudy', clear: '☀️ Clear', hot: '🥵 Hot', cold: '🧣 Chilly' },
      ja: { rain: '🌧️ 雨', snow: '❄️ 雪', cloudy: '⛅ くもり', clear: '☀️ 晴れ', hot: '🥵 猛暑', cold: '🧣 寒い日' }
    };

    const reasonBadge = weatherCondition
      ? `${weatherBadges[safeLang][weatherCondition]}${tempSuffix} · ${cityPrefix}${timeLabels[safeLang][timeSlot]}`
      : `☕ ${seasonLabels[safeLang][season]} · ${timeLabels[safeLang][timeSlot]}`;

    let message = '';

    if (safeLang === 'ko') {
      const objParticle = hasKoFinalConsonant(beanName) ? '을' : '를';
      if (timeSlot === 'evening') {
        message = `하루를 마무리하는 밤, 바리스타는 편안한 디카페인·저카페인 ${beanName}${objParticle} 추천해요`;
      } else if (weatherCondition === 'rain') {
        message = `비 오고 흐린 오늘, 바리스타는 묵직한 ${beanName}${objParticle} 추천해요`;
      } else if (weatherCondition === 'snow') {
        message = `눈 내리는 포근한 오늘, 바리스타는 달콤하고 깊은 ${beanName}${objParticle} 추천해요`;
      } else if (weatherCondition === 'hot') {
        message = `무더운 오늘${tempSuffix}, 바리스타는 아이스 드립으로 청량한 ${beanName}${objParticle} 추천해요`;
      } else if (weatherCondition === 'cold') {
        message = `쌀쌀한 오늘${tempSuffix}, 바리스타는 몸을 녹이는 진한 ${beanName}${objParticle} 추천해요`;
      } else if (weatherCondition === 'cloudy') {
        message = `차분하고 흐린 오늘, 바리스타는 부드러운 밸런스의 ${beanName}${objParticle} 추천해요`;
      } else if (weatherCondition === 'clear') {
        message = `맑고 화창한 오늘, 바리스타는 향긋한 산미의 ${beanName}${objParticle} 추천해요`;
      } else if (timeSlot === 'morning') {
        message = `상쾌한 ${seasonLabels.ko[season]} 아침, 바리스타는 깔끔하게 깨워주는 ${beanName}${objParticle} 추천해요`;
      } else if (timeSlot === 'lunch') {
        message = `식후 나른한 점심, 바리스타는 균형 잡힌 ${beanName}${objParticle} 추천해요`;
      } else {
        message = `여유로운 ${seasonLabels.ko[season]} 오후, 바리스타는 달콤하고 향긋한 ${beanName}${objParticle} 추천해요`;
      }
      return { reasonBadge, message };
    }

    if (safeLang === 'en') {
      if (timeSlot === 'evening') {
        message = `For a calm evening cup, our barista recommends gentle ${beanName}.`;
      } else if (weatherCondition === 'rain') {
        message = `On a rainy day like today, our barista recommends rich, full-bodied ${beanName}.`;
      } else if (weatherCondition === 'snow') {
        message = `On a snowy day, our barista recommends cozy, chocolatey ${beanName}.`;
      } else if (weatherCondition === 'hot') {
        message = `For today's heat${tempSuffix}, our barista recommends crisp iced-drip ${beanName}.`;
      } else if (weatherCondition === 'cold') {
        message = `On a chilly day${tempSuffix}, our barista recommends warm, full-bodied ${beanName}.`;
      } else if (weatherCondition === 'cloudy') {
        message = `Under soft cloudy skies, our barista recommends smooth, nutty ${beanName}.`;
      } else if (weatherCondition === 'clear') {
        message = `On a bright clear day, our barista recommends vibrant, aromatic ${beanName}.`;
      } else if (timeSlot === 'morning') {
        message = `For a crisp ${seasonLabels.en[season].toLowerCase()} morning, our barista recommends clean, lively ${beanName}.`;
      } else if (timeSlot === 'lunch') {
        message = `After lunch today, our barista recommends well-balanced ${beanName}.`;
      } else {
        message = `For a relaxed ${seasonLabels.en[season].toLowerCase()} afternoon, our barista recommends sweet, comforting ${beanName}.`;
      }
      return { reasonBadge, message };
    }

    // ja
    if (timeSlot === 'evening') {
      message = `一日の締めくくりに、バリスタはやさしい${beanName}をおすすめします。`;
    } else if (weatherCondition === 'rain') {
      message = `雨の日の今日は、バリスタがコク深い${beanName}をおすすめします。`;
    } else if (weatherCondition === 'snow') {
      message = `雪の降る今日は、バリスタが甘く温まる${beanName}をおすすめします。`;
    } else if (weatherCondition === 'hot') {
      message = `暑い今日${tempSuffix}は、アイスドリップに最適な爽やかな${beanName}をおすすめします。`;
    } else if (weatherCondition === 'cold') {
      message = `肌寒い今日${tempSuffix}は、体を温める重厚な${beanName}をおすすめします。`;
    } else if (weatherCondition === 'cloudy') {
      message = `落ち着いた曇りの日は、バランスよく香ばしい${beanName}をおすすめします。`;
    } else if (weatherCondition === 'clear') {
      message = `晴れ渡る今日は、華やかな香りの${beanName}をおすすめします。`;
    } else if (timeSlot === 'morning') {
      message = `爽やかな${seasonLabels.ja[season]}の朝には、すっきり目覚める${beanName}をおすすめします。`;
    } else if (timeSlot === 'lunch') {
      message = `食後のひとときには、調和のとれた${beanName}をおすすめします。`;
    } else {
      message = `穏やかな${seasonLabels.ja[season]}の午後には、甘み豊かな${beanName}をおすすめします。`;
    }
    return { reasonBadge, message };
  }

  function getTodaysPick(context, data) {
    const list = Array.isArray(data) ? data : [];
    const ctx = context || {};
    const safeLang = (ctx.lang === 'en' || ctx.lang === 'ja') ? ctx.lang : 'ko';
    const limit = Math.max(1, Math.min(3, Number(ctx.limit) || 3));
    const ctxMeta = resolveDateContext(ctx);
    const cityLabel = ctx.cityLabel ? String(ctx.cityLabel) : '';

    if (list.length === 0) {
      return {
        mode: ctxMeta.weatherCondition ? 'weather' : 'time',
        dateKey: ctxMeta.dateKey,
        timeSlot: ctxMeta.timeSlot,
        season: ctxMeta.season,
        weatherCondition: ctxMeta.weatherCondition,
        tempC: ctxMeta.tempC,
        cityLabel,
        primary: null,
        picks: [],
        reasonBadge: '',
        message: '',
        lang: safeLang
      };
    }

    const scored = list.map((item, idx) => ({
      item,
      idx,
      score: scoreBeanForContext(item, ctxMeta)
    }));
    scored.sort((a, b) => (b.score - a.score) || (a.idx - b.idx));

    const topScore = scored[0].score;
    const primaryPool = scored.filter(entry => entry.score >= topScore - 4).slice(0, 6);
    const seedKey = `${ctxMeta.dateKey}|${ctxMeta.timeSlot}|${ctxMeta.weatherCondition || ctxMeta.season}`;
    const seed = hashSeed(seedKey);

    const picks = [];
    const seenIds = new Set();
    const primaryIdx = seed % primaryPool.length;
    const primaryCandidate = primaryPool[primaryIdx].item;
    picks.push(primaryCandidate);
    seenIds.add(primaryCandidate.id);

    // 나머지 추천 슬롯은 상위 풀 우선 -> 차상위 점수 순으로 채워 primary 티어 일관성 보장
    for (let offset = 1; offset < primaryPool.length && picks.length < limit; offset++) {
      const candidate = primaryPool[(primaryIdx + offset) % primaryPool.length].item;
      if (!seenIds.has(candidate.id)) {
        seenIds.add(candidate.id);
        picks.push(candidate);
      }
    }
    for (let i = 0; i < scored.length && picks.length < limit; i++) {
      if (!seenIds.has(scored[i].item.id)) {
        seenIds.add(scored[i].item.id);
        picks.push(scored[i].item);
      }
    }

    const primary = picks[0];
    const { reasonBadge, message } = (() => {
      const built = buildTodaysPickCopy(primary, ctxMeta, safeLang, cityLabel);
      return built;
    })();

    return {
      mode: ctxMeta.weatherCondition ? 'weather' : 'time',
      dateKey: ctxMeta.dateKey,
      timeSlot: ctxMeta.timeSlot,
      season: ctxMeta.season,
      weatherCondition: ctxMeta.weatherCondition,
      tempC: ctxMeta.tempC,
      cityLabel,
      primary,
      picks,
      reasonBadge,
      message,
      lang: safeLang
    };
  }

  // Casper™ V1 Engine Public API
  const CasperEngine = {
    version: "1.2.0",
    name: "Casper™ V1",
    escapeHtml,
    getChosung,
    stripDiacritics,
    normalizeText,
    phoneticFoldKo,
    ORIGIN_WHEEL_OPTIONS,
    matchesOriginWheelOption,
    getSourToneClass,
    getMatchingCoffees,
    expandSimilarCoffees,
    getSearchFilteredCoffees,
    getAutocompleteSuggestions,
    getTodaysPick
  };

  // Expose to window / global
  global.CasperEngine = CasperEngine;
  global.escapeHtml = escapeHtml;
  global.getChosung = getChosung;
  global.ORIGIN_WHEEL_OPTIONS = ORIGIN_WHEEL_OPTIONS;
  global.matchesOriginWheelOption = matchesOriginWheelOption;
  global.getSourToneClass = getSourToneClass;
  global.getMatchingCoffees = getMatchingCoffees;
  global.expandSimilarCoffees = expandSimilarCoffees;
  global.getSearchFilteredCoffees = getSearchFilteredCoffees;
  global.getAutocompleteSuggestions = getAutocompleteSuggestions;
  global.getTodaysPick = getTodaysPick;

})(typeof window !== 'undefined' ? window : globalThis);
