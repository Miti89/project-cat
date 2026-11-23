/**
 * Casper™ V1 10,000-Bean Performance Benchmark (Schema v4)
 * Run on macOS JavaScriptCore:
 *   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/casper-benchmark-10k.js
 */
(function() {
  'use strict';

  function loadRelative(relPath) {
    var candidates = [relPath, '../' + relPath];
    for (var i = 0; i < candidates.length; i++) {
      try {
        load(candidates[i]);
        return;
      } catch (e) {}
    }
    throw new Error('Failed to load dependency: ' + relPath);
  }

  function nowMs() {
    if (typeof preciseTime === 'function') return preciseTime() * 1000;
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') return performance.now();
    return Date.now();
  }

  loadRelative('data.js');
  loadRelative('data-loader.js');
  loadRelative('casper.js');

  var ROASTERIES = [
    { id: 'momos', nameKo: '모모스 커피', nameEn: 'Momos Coffee', region: '부산 영도', url: 'https://www.momos.co.kr' },
    { id: 'fritz', nameKo: '프릳츠 커피 컴퍼니', nameEn: 'Fritz Coffee Company', region: '서울 마포', url: 'https://fritz.co.kr' },
    { id: 'libre', nameKo: '커피리브레', nameEn: 'Coffee Libre', region: '서울 연남', url: 'https://coffeelibre.kr' },
    { id: 'terarosa', nameKo: '테라로사', nameEn: 'Terarosa Coffee', region: '강원 강릉', url: 'https://www.terarosa.com' },
    { id: 'anthracite', nameKo: '앤트러사이트', nameEn: 'Anthracite Coffee', region: '서울 합정', url: 'https://anthracitecoffee.com' },
    { id: 'deepblue', nameKo: '딥블루레이크', nameEn: 'Deep Blue Lake', region: '서울 망원', url: 'https://deepbluelake.kr' },
    { id: 'lowkey', nameKo: '로우키 커피', nameEn: 'Lowkey Coffee', region: '서울 성수', url: 'https://lowkeycoffee.com' },
    { id: 'felt', nameKo: '펠트 커피', nameEn: 'Felt Coffee', region: '서울 창전', url: 'https://feltcoffee.com' },
    { id: 'namusairo', nameKo: '나무사이로', nameEn: 'Namusairo Coffee', region: '서울 사직', url: 'https://namusairo.com' },
    { id: 'kong', nameKo: '콩볶는사람들', nameEn: 'Bean Roasters', region: '서울 종로', url: 'https://example.com' }
  ];

  var BEAN_TYPES = ['SINGLE_ORIGIN', 'BLEND', 'DECAF', 'SPECIAL_LOT'];
  var AVAILS = ['ACTIVE', 'ACTIVE', 'ACTIVE', 'SEASONAL', 'SOLD_OUT'];

  // 메모리에서 10,000종 국내 로스터리 데이터 생성
  var TARGET_COUNT = 10000;
  var dataset = [];
  for (var i = 0; i < TARGET_COUNT; i++) {
    var base = coffeeData[i % coffeeData.length];
    var r = ROASTERIES[i % ROASTERIES.length];
    var lotNum = Math.floor(i / coffeeData.length) + 1;
    var beanType = base.caffeine === 'DECAF'
      ? 'DECAF'
      : (base.categoryType === 'HOUSE_BLEND' ? 'BLEND' : BEAN_TYPES[i % 4]);
    dataset.push({
      id: 'bench-' + r.id + '-' + (i + 1),
      no: 'KR-' + String(i + 1).padStart(5, '0'),
      recordType: 'ROASTERY_PRODUCT',
      roastery: r,
      beanType: beanType,
      availability: AVAILS[i % AVAILS.length],
      lastCheckedAt: '2026-11-23',
      pack: { grams: 200, priceKrw: 16000 + (i % 8) * 1500, pricePer100g: 8000 + (i % 8) * 750, purchaseUrl: r.url },
      baseArchetypeId: base.id,
      name: r.nameKo.split(' ')[0] + ' ' + base.name + ' #' + lotNum,
      eng: r.nameEn + ' ' + base.eng + ' Lot ' + lotNum,
      origin: base.origin,
      countryCode: base.countryCode,
      region: base.region,
      categoryType: base.categoryType,
      varietal: base.varietal,
      varietalCanonical: base.varietalCanonical,
      process: base.process,
      processGroup: base.processGroup,
      roast: base.roast,
      caffeine: base.caffeine,
      sourDots: base.sourDots,
      nuttyDots: base.nuttyDots,
      bodyDots: base.bodyDots,
      sweetDots: base.sweetDots,
      bodyStage: base.bodyStage,
      headline: base.headline,
      keywords: base.keywords,
      flavorFamily: base.flavorFamily
    });
  }

  // 1) 사전 색인 시간 실측
  var t0 = nowMs();
  var idxMeta = CasperEngine.buildIndex(dataset);
  var indexMs = nowMs() - t0;

  function measureQuery(label, fn) {
    // 워밍업 1회
    fn();
    var minMs = Infinity;
    var lastRes = null;
    for (var k = 0; k < 3; k++) {
      var s = nowMs();
      lastRes = fn();
      var elapsed = nowMs() - s;
      if (elapsed < minMs) minMs = elapsed;
    }
    return { label: label, ms: minMs, res: lastRes };
  }

  // 2) 복합어 검색 (< 15ms)
  var mCompound = measureQuery('Compound ("에티오피아 워시드")', function() {
    return CasperEngine.getSearchFilteredCoffees('에티오피아 워시드', dataset, originData);
  });

  // 3) 초성 검색 (< 15ms)
  var mChosungFlavor = measureQuery('Chosung Flavor ("ㅂㅅㅇ")', function() {
    return CasperEngine.getSearchFilteredCoffees('ㅂㅅㅇ', dataset, originData);
  });

  // 4) 국내 로스터리명 & 초성 검색 (< 15ms)
  var mRoasteryName = measureQuery('Roastery Name ("모모스")', function() {
    return CasperEngine.getSearchFilteredCoffees('모모스', dataset, originData);
  });
  var mRoasteryCho1 = measureQuery('Roastery Chosung ("ㅁㅁㅅ")', function() {
    return CasperEngine.getSearchFilteredCoffees('ㅁㅁㅅ', dataset, originData);
  });
  var mRoasteryCho2 = measureQuery('Roastery Chosung ("ㅍㄹㅊ")', function() {
    return CasperEngine.getSearchFilteredCoffees('ㅍㄹㅊ', dataset, originData);
  });
  var mRoasteryCompound = measureQuery('Roastery Compound ("ㅁㅁㅅ 게이샤")', function() {
    return CasperEngine.getSearchFilteredCoffees('ㅁㅁㅅ 게이샤', dataset, originData);
  });

  // 5) 4축 휠 매칭 (< 5ms)
  var mWheelAll = measureQuery('4-Axis Wheel (All Origins)', function() {
    return CasperEngine.getMatchingCoffees({ sour: 2, nutty: 4, body: 3, origin: 0 }, undefined, undefined, undefined, dataset);
  });
  var mWheelEth = measureQuery('4-Axis Wheel (ETH Origin)', function() {
    return CasperEngine.getMatchingCoffees({ sour: 4, nutty: 1, body: 2, origin: 2 }, undefined, undefined, undefined, dataset);
  });

  // 6) 자동완성 (< 15ms)
  var mAuto = measureQuery('Autocomplete ("ㅁㅁㅅ")', function() {
    return CasperEngine.getAutocompleteSuggestions('ㅁㅁㅅ', dataset, originData, 'ko', 8);
  });

  print('=== Casper™ V1 10,000-Bean Performance Benchmark ===');
  print('Dataset Size     : ' + dataset.length + ' ROASTERY_PRODUCT records (buckets: 125)');
  print('Index Build Time : ' + indexMs.toFixed(2) + ' ms');
  [mCompound, mChosungFlavor, mRoasteryName, mRoasteryCho1, mRoasteryCho2, mRoasteryCompound, mWheelAll, mWheelEth, mAuto].forEach(function(m) {
    var count = Array.isArray(m.res) ? m.res.length : (m.res && Array.isArray(m.res.list) ? m.res.list.length : 0);
    print(m.label + ' : ' + m.ms.toFixed(2) + ' ms (hits=' + count + ')');
  });

  // 정합성 및 성능 목표 검증
  var errs = [];
  if (idxMeta.length !== 10000) errs.push('Expected 10000 indexed entries, got ' + idxMeta.length);
  if (mCompound.res.length === 0 || mCompound.ms >= 15) errs.push('Compound failed: hits=' + mCompound.res.length + ', ms=' + mCompound.ms.toFixed(2));
  if (mChosungFlavor.res.length === 0 || mChosungFlavor.ms >= 15) errs.push('Chosung failed: hits=' + mChosungFlavor.res.length + ', ms=' + mChosungFlavor.ms.toFixed(2));
  if (mRoasteryName.res.length !== 1000 || mRoasteryName.ms >= 15) errs.push('Roastery name failed: hits=' + mRoasteryName.res.length + ', ms=' + mRoasteryName.ms.toFixed(2));
  if (mRoasteryCho1.res.length !== 1000 || mRoasteryCho1.ms >= 15) errs.push('Roastery chosung ㅁㅁㅅ failed: hits=' + mRoasteryCho1.res.length + ', ms=' + mRoasteryCho1.ms.toFixed(2));
  if (mRoasteryCho2.res.length !== 1000 || mRoasteryCho2.ms >= 15) errs.push('Roastery chosung ㅍㄹㅊ failed: hits=' + mRoasteryCho2.res.length + ', ms=' + mRoasteryCho2.ms.toFixed(2));
  if (mRoasteryCompound.res.length === 0 || mRoasteryCompound.ms >= 15) errs.push('Roastery compound failed: hits=' + mRoasteryCompound.res.length + ', ms=' + mRoasteryCompound.ms.toFixed(2));
  if (!mWheelAll.res.isExact || mWheelAll.res.list.length === 0 || mWheelAll.ms >= 5) errs.push('Wheel All failed: exact=' + mWheelAll.res.exactCount + ', ms=' + mWheelAll.ms.toFixed(2));
  if (!mWheelEth.res.isExact || mWheelEth.res.list.length === 0 || mWheelEth.ms >= 5) errs.push('Wheel ETH failed: exact=' + mWheelEth.res.exactCount + ', ms=' + mWheelEth.ms.toFixed(2));
  if (!mAuto.res.some(function(s) { return s.query === '모모스 커피'; }) || mAuto.ms >= 15) errs.push('Autocomplete ㅁㅁㅅ failed: ms=' + mAuto.ms.toFixed(2));

  if (errs.length > 0) {
    throw new Error('Benchmark validation failed:\n' + errs.join('\n'));
  }
  print('BENCHMARK_PASS: All 10k search (<15ms) and 4-axis wheel (<5ms) targets met!');
})();
