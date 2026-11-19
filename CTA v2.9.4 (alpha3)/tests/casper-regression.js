/**
 * Casper™ V1 Regression Test Suite (60 Cases)
 * Run on macOS JavaScriptCore:
 *   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/casper-regression.js
 */

(function() {
  'use strict';

  function loadRelative(relPath) {
    var candidates = [
      '/Users/iknim/Desktop/Creative Lab/프로젝트 cta/CTA/' + relPath,
      relPath,
      '../' + relPath
    ];
    for (var i = 0; i < candidates.length; i++) {
      try {
        load(candidates[i]);
        return;
      } catch (e) {}
    }
    throw new Error('Failed to load dependency: ' + relPath);
  }

  loadRelative('data.js');
  loadRelative('casper.js');

  var total = 0;
  var passed = 0;
  var failures = [];

  function assert(name, condition, detail) {
    total++;
    if (condition) {
      passed++;
    } else {
      failures.push({ name: name, detail: detail || 'Assertion failed' });
    }
  }

  function idsOf(list) {
    return (list || []).map(function(c) { return c.id; });
  }

  function sameIdSet(a, b) {
    var sa = idsOf(a).slice().sort();
    var sb = idsOf(b).slice().sort();
    if (sa.length !== sb.length) return false;
    for (var i = 0; i < sa.length; i++) {
      if (sa[i] !== sb[i]) return false;
    }
    return true;
  }

  function search(q) {
    return CasperEngine.getSearchFilteredCoffees(q, coffeeData, originData);
  }

  // --- [1] Dataset & Engine Sanity (Cases 1~3) ---
  assert('01. Master DB has 120 coffees and 30 origins',
    Array.isArray(coffeeData) && coffeeData.length === 120 && Array.isArray(originData) && originData.length === 30,
    'coffeeData=' + (coffeeData && coffeeData.length) + ', originData=' + (originData && originData.length));

  assert('02. CasperEngine exposes pure DOM-independent API & 31 wheel options',
    typeof CasperEngine === 'object' &&
    typeof CasperEngine.getSearchFilteredCoffees === 'function' &&
    typeof CasperEngine.getMatchingCoffees === 'function' &&
    typeof CasperEngine.getAutocompleteSuggestions === 'function' &&
    typeof CasperEngine.escapeHtml === 'function' &&
    CasperEngine.ORIGIN_WHEEL_OPTIONS.length === 31);

  assert('03. Empty / whitespace query returns all 120 coffees',
    search('').length === 120 && search('   ').length === 120);

  // --- [2] Phase 1 Guarantees & Origin Disambiguation (Cases 4~10) ---
  var blendRes = search('블렌드');
  assert('04. "블렌드" returns exact 7 house blend coffees',
    blendRes.length === 7 && blendRes.every(function(c) { return c.categoryType === 'HOUSE_BLEND'; }),
    'got ' + blendRes.length);

  assert('05. Blend variants ("블렌", "블랜드", "blend") match exact same 7 items',
    sameIdSet(blendRes, search('블렌')) &&
    sameIdSet(blendRes, search('블랜드')) &&
    sameIdSet(blendRes, search('blend')));

  var colRes = search('콜롬비아');
  assert('06. "콜롬비아" returns exact 16 COL coffees',
    colRes.length === 16 && colRes.every(function(c) { return c.countryCode === 'COL'; }),
    'got ' + colRes.length);

  var colChoRes = search('ㅋㄹㅂㅇ');
  assert('07. "ㅋㄹㅂㅇ" equals "콜롬비아" (16 items identical)',
    colChoRes.length === 16 && sameIdSet(colRes, colChoRes),
    'got ' + colChoRes.length);

  var indRes = search('인도');
  assert('08. "인도" returns exact 3 IND coffees (separated from Indonesia)',
    indRes.length === 3 && indRes.every(function(c) { return c.countryCode === 'IND'; }),
    'got ' + idsOf(indRes).join(','));

  var idnRes = search('인도네시아');
  assert('09. "인도네시아" returns exact 4 IDN coffees',
    idnRes.length === 4 && idnRes.every(function(c) { return c.countryCode === 'IDN'; }),
    'got ' + idsOf(idnRes).join(','));

  var ferRes = search('특수발효');
  var flvRes = search('가향');
  var balRes = search('균형 밸런스');
  assert('10. Special category filters ("특수발효", "가향", "균형 밸런스") match cleanly',
    ferRes.length > 0 && ferRes.every(function(c) { return c.categoryType === 'FERMENTED_LOT'; }) &&
    flvRes.length > 0 && flvRes.every(function(c) { return c.categoryType === 'FLAVORED'; }) &&
    balRes.length > 0 && balRes.every(function(c) { return c.sourDots >= 2 && c.sourDots <= 3; }));

  // --- [3] 2+ Word Compound Token Search (Cases 11~17) ---
  var ethWashed = search('에티오피아 워시드');
  assert('11. "에티오피아 워시드" matches eth-02 & eth-03',
    ethWashed.length === 2 && sameIdSet(ethWashed, [{ id: 'eth-02' }, { id: 'eth-03' }]),
    'got ' + idsOf(ethWashed).join(','));

  var colGeisha = search('콜롬비아 게이샤');
  assert('12. "콜롬비아 게이샤" ranks col-07 first and all matches are COL',
    colGeisha.length >= 1 && colGeisha[0].id === 'col-07' &&
    colGeisha.every(function(c) { return c.countryCode === 'COL'; }),
    'got ' + idsOf(colGeisha).join(','));

  var panGeishaNat = search('파나마 게이샤 내추럴');
  assert('13. 3-token compound "파나마 게이샤 내추럴" matches pan-02',
    panGeishaNat.some(function(c) { return c.id === 'pan-02'; }) &&
    panGeishaNat.every(function(c) { return c.countryCode === 'PAN'; }),
    'got ' + idsOf(panGeishaNat).join(','));

  var criHoney = search('코스타리카 허니');
  assert('14. "코스타리카 허니" matches cos-01 and all CRI',
    criHoney.length >= 1 && criHoney.some(function(c) { return c.id === 'cos-01'; }) &&
    criHoney.every(function(c) { return c.countryCode === 'CRI'; }),
    'got ' + idsOf(criHoney).join(','));

  var gtmPacamara = search('과테말라 파카마라');
  assert('15. "과테말라 파카마라" matches gtm-03',
    gtmPacamara.length >= 1 && gtmPacamara[0].id === 'gtm-03',
    'got ' + idsOf(gtmPacamara).join(','));

  var colDecaf = search('콜롬비아 디카페인');
  assert('16. "콜롬비아 디카페인" matches col-04',
    colDecaf.length >= 1 && colDecaf.some(function(c) { return c.id === 'col-04'; }) &&
    colDecaf.every(function(c) { return c.countryCode === 'COL'; }),
    'got ' + idsOf(colDecaf).join(','));

  assert('17. Trailing filler token ("에티오피아 워시드 원두") matches "에티오피아 워시드"',
    sameIdSet(ethWashed, search('에티오피아 워시드 원두')));

  // --- [4] Loanword Typo & Phonetic Normalization (Cases 18~24) ---
  var sup1 = search('슈프리모');
  var sup2 = search('수프리모');
  var sup3 = search('수프레모');
  assert('18. "슈프리모" <-> "수프리모" <-> "수프레모" equivalent & includes col-05',
    sup1.length > 0 && idsOf(sup1).indexOf('col-05') >= 0 &&
    sameIdSet(sup1, sup2) && sameIdSet(sup1, sup3),
    'sup1=' + idsOf(sup1).join(',') + ', sup2=' + idsOf(sup2).join(','));

  var yir1 = search('예가체프');
  var yir2 = search('예가체페');
  var yir3 = search('이르가체프');
  assert('19. "예가체프" <-> "예가체페" <-> "이르가체프" equivalent & includes eth-02',
    yir1.length > 0 && idsOf(yir1).indexOf('eth-02') >= 0 &&
    sameIdSet(yir1, yir2) && sameIdSet(yir1, yir3),
    'yir1=' + idsOf(yir1).join(',') + ', yir2=' + idsOf(yir2).join(','));

  assert('20. "이디오피아" <-> "에티오피아" equivalent (9 items)',
    search('이디오피아').length === 9 && sameIdSet(search('이디오피아'), search('에티오피아')));

  assert('21. "혼두라스" <-> "온두라스" equivalent (3 items)',
    search('혼두라스').length === 3 && sameIdSet(search('혼두라스'), search('온두라스')));

  assert('22. "워쉬드" <-> "워시드" equivalent',
    search('워쉬드').length > 0 && sameIdSet(search('워쉬드'), search('워시드')));

  assert('23. "내츄럴" <-> "내추럴" equivalent',
    search('내츄럴').length > 0 && sameIdSet(search('내츄럴'), search('내추럴')));

  assert('24. "캐러멜"<->"카라멜" and "초콜렛"<->"초콜릿" equivalent',
    search('캐러멜').length > 0 && sameIdSet(search('캐러멜'), search('카라멜')) &&
    search('초콜렛').length > 0 && sameIdSet(search('초콜렛'), search('초콜릿')));

  // --- [5] Multi-field Chosung Search (Cases 25~30) ---
  var peachCho = search('ㅂㅅㅇ');
  assert('25. "ㅂㅅㅇ" matches peach notes (eth-01, pan-02, col-03, flv-11) without eth-03 false positive',
    idsOf(peachCho).indexOf('eth-01') >= 0 &&
    idsOf(peachCho).indexOf('pan-02') >= 0 &&
    idsOf(peachCho).indexOf('col-03') >= 0 &&
    idsOf(peachCho).indexOf('flv-11') >= 0 &&
    idsOf(peachCho).indexOf('eth-03') === -1,
    'got ' + idsOf(peachCho).join(','));

  var blueCho = search('ㅂㄹㅂㄹ');
  assert('26. "ㅂㄹㅂㄹ" matches blueberry notes (eth-04, col-11, cos-04, ecu-03)',
    idsOf(blueCho).indexOf('eth-04') >= 0 &&
    idsOf(blueCho).indexOf('col-11') >= 0 &&
    idsOf(blueCho).indexOf('cos-04') >= 0 &&
    idsOf(blueCho).indexOf('ecu-03') >= 0,
    'got ' + idsOf(blueCho).join(','));

  assert('27. "ㄱㅅㅂㄹㅈ" matches producer/estate Gesha Village (eth-08)',
    idsOf(search('ㄱㅅㅂㄹㅈ')).indexOf('eth-08') >= 0,
    'got ' + idsOf(search('ㄱㅅㅂㄹㅈ')).join(','));

  assert('28. "ㅈㅅㅁ" matches jasmine notes (eth-01, pan-01, col-07)',
    idsOf(search('ㅈㅅㅁ')).indexOf('eth-01') >= 0 &&
    idsOf(search('ㅈㅅㅁ')).indexOf('pan-01') >= 0 &&
    idsOf(search('ㅈㅅㅁ')).indexOf('col-07') >= 0);

  assert('29. "ㅇㅌㅇㅍㅇ" matches Ethiopia 9 items',
    search('ㅇㅌㅇㅍㅇ').length === 9 && sameIdSet(search('ㅇㅌㅇㅍㅇ'), search('에티오피아')));

  assert('30. Mixed compound "콜롬비아 ㄷㅋㅍㅇ" matches col-04',
    idsOf(search('콜롬비아 ㄷㅋㅍㅇ')).indexOf('col-04') >= 0);

  // --- [6] KR / EN / JP Producer, Estate & Washing Station Search (Cases 31~36) ---
  assert('31. Producer EN "Sigri" matches png-01',
    idsOf(search('Sigri')).indexOf('png-01') >= 0,
    'got ' + idsOf(search('Sigri')).join(','));

  assert('32. Producer KR "시그리" and JP "シグリ" match png-01',
    idsOf(search('시그리')).indexOf('png-01') >= 0 &&
    idsOf(search('シグリ')).indexOf('png-01') >= 0);

  assert('33. Producer KR/EN/JP "Attikan" / "아티칸" / "アティカン" all match ida-01',
    idsOf(search('Attikan')).indexOf('ida-01') >= 0 &&
    idsOf(search('아티칸')).indexOf('ida-01') >= 0 &&
    idsOf(search('アティカン')).indexOf('ida-01') >= 0);

  assert('34. Producer KR/EN/JP "Gesha Village" / "게샤 빌리지" / "ゲシャ・ビレッジ" all match eth-08',
    idsOf(search('Gesha Village')).indexOf('eth-08') >= 0 &&
    idsOf(search('게샤 빌리지')).indexOf('eth-08') >= 0 &&
    idsOf(search('ゲシャ・ビレッジ')).indexOf('eth-08') >= 0);

  assert('35. Diacritic-stripped producer search ("Diego Bermudez", "Sebastian Ramirez") matches col-03 / col-02',
    idsOf(search('Diego Bermudez')).indexOf('col-03') >= 0 &&
    idsOf(search('Sebastian Ramirez')).indexOf('col-02') >= 0);

  assert('36. Estate names ("Hacienda La Esmeralda", "El Injerto", "Las Lajas") match pan-01, gtm-03, cos-02',
    idsOf(search('Hacienda La Esmeralda')).indexOf('pan-01') >= 0 &&
    idsOf(search('El Injerto')).indexOf('gtm-03') >= 0 &&
    idsOf(search('Las Lajas')).indexOf('cos-02') >= 0);

  // --- [7] 4-Axis Wheel Matching (Cases 37~42) ---
  var wheelDefault = CasperEngine.getMatchingCoffees({ sour: 2, nutty: 4, body: 3, origin: 0 }, undefined, undefined, undefined, coffeeData);
  assert('37. Default 4-axis wheel returns >= 6 items with exactCount > 0',
    wheelDefault.list.length >= 6 && wheelDefault.exactCount > 0 && wheelDefault.isExact);

  var wheelWild = CasperEngine.getMatchingCoffees({ sour: 0, nutty: 5, body: 0, origin: 0 }, undefined, undefined, undefined, coffeeData);
  assert('38. Wildcard (ANY=0) axis matches nuttyDots === 5 items',
    wheelWild.exactCount > 0 &&
    wheelWild.list.slice(0, wheelWild.exactCount).every(function(c) { return c.nuttyDots === 5; }));

  var wheelCol = CasperEngine.getMatchingCoffees({ sour: 0, nutty: 0, body: 0, origin: 1 }, undefined, undefined, undefined, coffeeData);
  assert('39. Origin wheel index 1 (COL) restricts all matches to COL',
    wheelCol.list.length === 16 && wheelCol.list.every(function(c) { return c.countryCode === 'COL'; }));

  var ferIdx = CasperEngine.ORIGIN_WHEEL_OPTIONS.findIndex(function(o) { return o.code === 'FER'; });
  var flvIdx = CasperEngine.ORIGIN_WHEEL_OPTIONS.findIndex(function(o) { return o.code === 'FLV'; });
  var bldIdx = CasperEngine.ORIGIN_WHEEL_OPTIONS.findIndex(function(o) { return o.code === 'BLD'; });
  var wheelFer = CasperEngine.getMatchingCoffees({ sour: 0, nutty: 0, body: 0, origin: ferIdx }, undefined, undefined, undefined, coffeeData);
  var wheelFlv = CasperEngine.getMatchingCoffees({ sour: 0, nutty: 0, body: 0, origin: flvIdx }, undefined, undefined, undefined, coffeeData);
  var wheelBld = CasperEngine.getMatchingCoffees({ sour: 0, nutty: 0, body: 0, origin: bldIdx }, undefined, undefined, undefined, coffeeData);
  assert('40. Special theme origin wheels (FER, FLV, BLD) match respective categoryTypes',
    wheelFer.list.every(function(c) { return c.categoryType === 'FERMENTED_LOT'; }) &&
    wheelFlv.list.every(function(c) { return c.categoryType === 'FLAVORED'; }) &&
    wheelBld.list.length === 7 && wheelBld.list.every(function(c) { return c.categoryType === 'HOUSE_BLEND'; }));

  var panIdx = CasperEngine.ORIGIN_WHEEL_OPTIONS.findIndex(function(o) { return o.code === 'PAN'; });
  var wheelMin6 = CasperEngine.getMatchingCoffees({ sour: 5, nutty: 5, body: 5, origin: 0 }, undefined, undefined, undefined, coffeeData);
  var wheelPan = CasperEngine.getMatchingCoffees({ sour: 4, nutty: 1, body: 1, origin: panIdx }, undefined, undefined, undefined, coffeeData);
  assert('41. Smart curation fills minimum 6 cards (or full origin pool) with close matches',
    wheelMin6.list.length >= 6 && wheelPan.list.length === 3);

  assert('42. getSourToneClass maps 1..5 accurately',
    CasperEngine.getSourToneClass(1) === 'sour-low' &&
    CasperEngine.getSourToneClass(2) === 'sour-low' &&
    CasperEngine.getSourToneClass(3) === 'sour-mid' &&
    CasperEngine.getSourToneClass(4) === 'sour-high' &&
    CasperEngine.getSourToneClass(5) === 'sour-high');

  // --- [8] EN/JP Search, Colloquial Intents, Autocomplete & XSS (Cases 43~50) ---
  assert('43. EN origin search ("Ethiopia"=9, "Colombia"=16, "India"=3 != "Indonesia"=4)',
    search('Ethiopia').length === 9 &&
    search('Colombia').length === 16 &&
    search('India').length === 3 &&
    search('Indonesia').length === 4);

  assert('44. JP origin search ("エチオピア"=9, "コロンビア"=16, "インド"=3 != "インドネシア"=4)',
    search('エチオピア').length === 9 &&
    search('コロンビア').length === 16 &&
    search('インド').length === 3 &&
    search('インドネシア').length === 4);

  assert('45. EN/JP compound search ("Ethiopia Washed" & "エチオピア ウォッシュト") match eth-02 & eth-03',
    sameIdSet(search('Ethiopia Washed'), ethWashed) &&
    sameIdSet(search('エチオピア ウォッシュト'), ethWashed));

  assert('46. EN/JP flavor search ("peach"/"桃" & "blueberry"/"ブルーベリー") match expected lots',
    idsOf(search('peach')).indexOf('eth-01') >= 0 &&
    idsOf(search('桃')).indexOf('eth-01') >= 0 &&
    idsOf(search('blueberry')).indexOf('eth-04') >= 0 &&
    idsOf(search('ブルーベリー')).indexOf('eth-04') >= 0);

  var noSour = search('산미 없는 거');
  var decafRes = search('디카페인');
  assert('47. Colloquial negative & decaf intent filters ("산미 없는 거", "디카페인") work accurately',
    noSour.length > 0 && noSour.every(function(c) { return c.sourDots <= 1; }) &&
    decafRes.length > 0 && decafRes.every(function(c) {
      return c.caffeine === 'DECAF' || c.caffeine === 'LOW_CAF' || (c.process || '').toLowerCase().indexOf('decaf') >= 0;
    }));

  var acKo1 = CasperEngine.getAutocompleteSuggestions('ㅂㅅㅇ', coffeeData, originData, 'ko', 8);
  var acKo2 = CasperEngine.getAutocompleteSuggestions('시그리', coffeeData, originData, 'ko', 8);
  assert('48. Autocomplete KO ("ㅂㅅㅇ", "시그리") returns flavor & producer suggestions',
    acKo1.some(function(s) { return s.type === 'flavor' && s.query === '복숭아'; }) &&
    acKo2.some(function(s) { return s.type === 'producer' && s.coffeeId === 'png-01'; }));

  var krRegex = /[가-힣]/;
  var acEn = CasperEngine.getAutocompleteSuggestions('pea', coffeeData, originData, 'en', 8);
  var acJa = CasperEngine.getAutocompleteSuggestions('桃', coffeeData, originData, 'ja', 8);
  assert('49. Autocomplete EN/JP has zero Korean characters',
    acEn.length > 0 && acJa.length > 0 &&
    acEn.every(function(s) { return !krRegex.test(s.label) && !krRegex.test(s.subLabel) && !krRegex.test(s.query); }) &&
    acJa.every(function(s) { return !krRegex.test(s.label) && !krRegex.test(s.subLabel) && !krRegex.test(s.query); }));

  var xssRaw = '<img src=x onerror="alert(\'xss\')">&';
  var xssEsc = CasperEngine.escapeHtml(xssRaw);
  assert('50. escapeHtml escapes &, <, >, ", \' against XSS',
    xssEsc === '&lt;img src=x onerror=&quot;alert(&#39;xss&#39;)&quot;&gt;&amp;',
    'got ' + xssEsc);

  // --- [8] Phase 2-2B Today's Pick & Weather Fallback (Cases 51~60) ---
  var pickMorning = CasperEngine.getTodaysPick({ date: '2026-04-15', hour: 8, lang: 'ko' }, coffeeData);
  assert('51. Today\'s Pick morning (Stage 1) returns 3 distinct picks with bright clean primary',
    pickMorning.mode === 'time' &&
    pickMorning.timeSlot === 'morning' &&
    pickMorning.picks.length === 3 &&
    pickMorning.primary.sourDots >= 3 &&
    pickMorning.primary.bodyDots <= 3 &&
    pickMorning.primary.caffeine !== 'DECAF',
    'got ' + (pickMorning.primary && pickMorning.primary.id));

  var pickNight = CasperEngine.getTodaysPick({ date: '2026-11-19', hour: 21, lang: 'ko' }, coffeeData);
  assert('52. Today\'s Pick evening/night (21:00) prioritizes DECAF or LOW_CAF',
    pickNight.timeSlot === 'evening' &&
    (pickNight.primary.caffeine === 'DECAF' || pickNight.primary.caffeine === 'LOW_CAF'),
    'got ' + (pickNight.primary && pickNight.primary.id + ' (' + pickNight.primary.caffeine + ')'));

  var pickRain = CasperEngine.getTodaysPick({ date: '2026-11-19', hour: 15, weatherCondition: 'rain', tempC: 12, cityLabel: '서울 강남구', lang: 'ko' }, coffeeData);
  assert('53. Today\'s Pick rainy day selects heavy-body low-acid lot with weather copy',
    pickRain.mode === 'weather' &&
    pickRain.weatherCondition === 'rain' &&
    pickRain.primary.bodyDots >= 4 &&
    pickRain.primary.sourDots <= 2 &&
    pickRain.message.indexOf('비') >= 0,
    'got ' + (pickRain.primary && pickRain.primary.id) + ' / ' + pickRain.message);

  var pickHot = CasperEngine.getTodaysPick({ date: '2026-07-20', hour: 14, weatherCondition: 'clear', tempC: 33, lang: 'ko' }, coffeeData);
  assert('54. Today\'s Pick hot day (>=28C) auto-promotes to hot & selects bright light-body lot',
    pickHot.weatherCondition === 'hot' &&
    pickHot.primary.sourDots >= 4 &&
    pickHot.primary.bodyDots <= 2,
    'got ' + (pickHot.primary && pickHot.primary.id) + ' sour=' + pickHot.primary.sourDots + ' body=' + pickHot.primary.bodyDots);

  var pickCold = CasperEngine.getTodaysPick({ date: '2026-01-12', hour: 12, tempC: -2, lang: 'ko' }, coffeeData);
  assert('55. Today\'s Pick cold day (<=4C) auto-promotes to cold & selects rich heavy-body lot',
    pickCold.weatherCondition === 'cold' &&
    pickCold.primary.bodyDots >= 4 &&
    pickCold.primary.nuttyDots >= 4,
    'got ' + (pickCold.primary && pickCold.primary.id));

  var pickRainRepeat = CasperEngine.getTodaysPick({ date: '2026-11-19', hour: 15, weatherCondition: 'rain', tempC: 12, cityLabel: '서울 강남구', lang: 'ko' }, coffeeData);
  assert('56. Today\'s Pick is deterministic for identical date/slot/weather inputs',
    pickRain.picks.map(function(c) { return c.id; }).join(',') ===
    pickRainRepeat.picks.map(function(c) { return c.id; }).join(',') &&
    pickRain.message === pickRainRepeat.message);

  var pickFallback = CasperEngine.getTodaysPick({ date: '2026-11-19', hour: 15, weatherCondition: 'invalid_state', lang: 'ko' }, coffeeData);
  assert('57. Today\'s Pick gracefully falls back to Stage 1 time mode on invalid/null weather',
    pickFallback.mode === 'time' &&
    pickFallback.weatherCondition === null &&
    pickFallback.picks.length === 3 &&
    pickFallback.message.length > 0);

  var pickEnTime = CasperEngine.getTodaysPick({ date: '2026-11-19', hour: 9, lang: 'en' }, coffeeData);
  var pickEnRain = CasperEngine.getTodaysPick({ date: '2026-11-19', hour: 15, weatherCondition: 'rain', tempC: 14, cityLabel: 'Seoul Gangnam', lang: 'en' }, coffeeData);
  assert('58. Today\'s Pick EN copy & badges contain zero Korean characters',
    pickEnTime.message.length > 0 && pickEnRain.message.length > 0 &&
    !krRegex.test(pickEnTime.message) && !krRegex.test(pickEnTime.reasonBadge) &&
    !krRegex.test(pickEnRain.message) && !krRegex.test(pickEnRain.reasonBadge),
    'got ' + pickEnTime.message + ' | ' + pickEnRain.message);

  var pickJaTime = CasperEngine.getTodaysPick({ date: '2026-11-19', hour: 21, lang: 'ja' }, coffeeData);
  var pickJaRain = CasperEngine.getTodaysPick({ date: '2026-11-19', hour: 15, weatherCondition: 'rain', tempC: 14, cityLabel: 'ソウル 江南区', lang: 'ja' }, coffeeData);
  assert('59. Today\'s Pick JP copy & badges contain zero Korean characters',
    pickJaTime.message.length > 0 && pickJaRain.message.length > 0 &&
    !krRegex.test(pickJaTime.message) && !krRegex.test(pickJaTime.reasonBadge) &&
    !krRegex.test(pickJaRain.message) && !krRegex.test(pickJaRain.reasonBadge),
    'got ' + pickJaTime.message + ' | ' + pickJaRain.message);

  loadRelative('weather-service.js');
  var nearestBusan = globalThis.WeatherService.findNearestPreset(35.16, 129.16);
  var wsPresetsClean = globalThis.WeatherService.CITY_PRESETS.every(function(p) {
    return !krRegex.test(p.en) && !krRegex.test(p.ja) && p.nx > 0 && p.ny > 0;
  });
  assert('60. WeatherService loads headless, resolves nearest preset in-memory & has clean EN/JP city names',
    typeof globalThis.WeatherService === 'object' &&
    nearestBusan && nearestBusan.id === 'busan-haeundae' &&
    wsPresetsClean &&
    globalThis.WeatherService.PROXY_URL === '');

  print('=== Casper™ V1 Regression Test Summary ===');
  print('PASS: ' + passed + '/' + total + ' (' + Math.round((passed / total) * 100) + '%)');
  if (failures.length > 0) {
    failures.forEach(function(f) {
      print('FAIL: ' + f.name + ' -> ' + f.detail);
    });
    throw new Error('Regression suite failed: ' + failures.length + ' failure(s)');
  }
})();
