/**
 * Coffee Taste Archive - 2-Tier Hybrid Data Loader (data-loader.js)
 * Schema v4: Supports zero-build file:// fallback (embedded 120 MASTER_ARCHETYPE)
 * and HTTP 2-Tier progressive loading:
 *   - Tier 1: data/beans-index.json (lightweight index for search & wheel)
 *   - Tier 2: data/chunks/chunk-XX.json (500-item detail chunks lazy-loaded on demand)
 */
(function(global) {
  'use strict';

  var loadedChunks = new Set();
  var inFlightChunks = new Map();
  var masterById = new Map();
  var beanById = new Map();
  var indexPromise = null;

  function getDataset() {
    if (typeof coffeeData !== 'undefined' && Array.isArray(coffeeData)) return coffeeData;
    if (Array.isArray(global.coffeeData)) return global.coffeeData;
    return [];
  }

  function rebuildMaps() {
    var list = getDataset();
    masterById.clear();
    beanById.clear();
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      if (!item || !item.id) continue;
      beanById.set(item.id, item);
      if (!item.recordType || item.recordType === 'MASTER_ARCHETYPE') {
        masterById.set(item.id, item);
      }
    }
  }

  function deriveBeanType(item) {
    if (item.beanType) return item.beanType;
    if (item.caffeine === 'DECAF') return 'DECAF';
    if (item.categoryType === 'HOUSE_BLEND') return 'BLEND';
    if (item.categoryType === 'FERMENTED_LOT' || item.categoryType === 'FLAVORED') return 'SPECIAL_LOT';
    return 'SINGLE_ORIGIN';
  }

  function applyArchetypeInheritance(item) {
    if (!item) return item;
    if (!item.recordType) item.recordType = 'MASTER_ARCHETYPE';
    if (!item.beanType) item.beanType = deriveBeanType(item);
    if (!item.availability) item.availability = 'ACTIVE';

    if (item.baseArchetypeId) {
      var parent = masterById.get(item.baseArchetypeId);
      if (parent) {
        if (!item.guide && parent.guide) item.guide = parent.guide;
        if (!item.dialingNote && parent.dialingNote) item.dialingNote = parent.dialingNote;
        if (!item.brewTempWarning && parent.brewTempWarning) item.brewTempWarning = parent.brewTempWarning;
        if (!item.brewSpec && parent.brewSpec) item.brewSpec = parent.brewSpec;
        if (!item.brewOverride && parent.brewOverride) item.brewOverride = parent.brewOverride;
        if (!item.sourDesc && parent.sourDesc) item.sourDesc = parent.sourDesc;
        if (!item.nuttyDesc && parent.nuttyDesc) item.nuttyDesc = parent.nuttyDesc;
        if (!item.bodyDesc && parent.bodyDesc) item.bodyDesc = parent.bodyDesc;
        if (!item.sweetDesc && parent.sweetDesc) item.sweetDesc = parent.sweetDesc;
        if (!item.altitude && parent.altitude) item.altitude = parent.altitude;
        if (!item.altitudeRange && parent.altitudeRange) item.altitudeRange = parent.altitudeRange;
        if (!item.physicalGrade && parent.physicalGrade) item.physicalGrade = parent.physicalGrade;
        if (!item.lineage && parent.lineage) item.lineage = parent.lineage;
        if (!item.traceability && parent.traceability) item.traceability = parent.traceability;

        if (!item.i18n) {
          var roasteryEn = (item.roastery && item.roastery.nameEn) ? item.roastery.nameEn : '';
          var pEn = (parent.i18n && parent.i18n.en) || {};
          var pJa = (parent.i18n && parent.i18n.ja) || {};
          var pKo = (parent.i18n && parent.i18n.ko) || {};
          item.i18n = {
            ko: {
              name: item.name,
              subName: item.eng || pKo.subName || '',
              originBadge: item.origin || pKo.originBadge || '',
              region: item.region || pKo.region || '',
              headline: item.headline || pKo.headline || '',
              sourDesc: item.sourDesc || pKo.sourDesc || '',
              nuttyDesc: item.nuttyDesc || pKo.nuttyDesc || '',
              bodyDesc: item.bodyDesc || pKo.bodyDesc || '',
              sweetDesc: item.sweetDesc || pKo.sweetDesc || '',
              guide: item.guide || pKo.guide || '',
              dialingNote: (item.dialingNote && item.dialingNote.ko) || pKo.dialingNote || '',
              brewText: item.brewOverride || pKo.brewText || ''
            },
            en: {
              name: item.eng || item.name,
              subName: roasteryEn ? (roasteryEn + ' · ' + (pEn.subName || item.varietal || '')) : (pEn.subName || item.varietal || ''),
              originBadge: pEn.originBadge || item.origin || '',
              region: pEn.region || item.countryCode || '',
              headline: pEn.headline || item.eng || '',
              sourDesc: pEn.sourDesc || '',
              nuttyDesc: pEn.nuttyDesc || '',
              bodyDesc: pEn.bodyDesc || '',
              sweetDesc: pEn.sweetDesc || '',
              guide: pEn.guide || '',
              dialingNote: (item.dialingNote && item.dialingNote.en) || pEn.dialingNote || '',
              brewText: pEn.brewText || ''
            },
            ja: {
              name: item.eng || item.name,
              subName: roasteryEn ? (roasteryEn + ' · ' + (pJa.subName || item.varietal || '')) : (pJa.subName || item.varietal || ''),
              originBadge: pJa.originBadge || item.origin || '',
              region: pJa.region || item.countryCode || '',
              headline: pJa.headline || item.eng || '',
              sourDesc: pJa.sourDesc || '',
              nuttyDesc: pJa.nuttyDesc || '',
              bodyDesc: pJa.bodyDesc || '',
              sweetDesc: pJa.sweetDesc || '',
              guide: pJa.guide || '',
              dialingNote: (item.dialingNote && item.dialingNote.ja) || pJa.dialingNote || '',
              brewText: pJa.brewText || ''
            }
          };
        }
      }
    }
    return item;
  }

  function mergeRecords(records) {
    rebuildMaps();
    if (!Array.isArray(records) || records.length === 0) return 0;
    var list = getDataset();
    var added = 0;

    for (var i = 0; i < records.length; i++) {
      var rec = records[i];
      if (!rec || !rec.id) continue;
      if (!rec.recordType) rec.recordType = 'ROASTERY_PRODUCT';
      rec._tier2Loaded = !rec.chunkId;

      var existing = beanById.get(rec.id);
      if (existing) {
        Object.assign(existing, rec);
        applyArchetypeInheritance(existing);
      } else {
        applyArchetypeInheritance(rec);
        list.push(rec);
        beanById.set(rec.id, rec);
        if (rec.recordType === 'MASTER_ARCHETYPE') {
          masterById.set(rec.id, rec);
        }
        added++;
      }
    }
    return added;
  }

  function isFileProtocol() {
    try {
      return typeof global.location === 'object' && global.location && global.location.protocol === 'file:';
    } catch (e) {
      return true;
    }
  }

  function loadIndex(options) {
    rebuildMaps();
    if (indexPromise && !(options && options.force)) return indexPromise;

    var opts = options || {};
    var indexUrl = opts.indexUrl || 'data/beans-index.json';

    if (isFileProtocol() || typeof global.fetch !== 'function') {
      indexPromise = Promise.resolve({
        items: getDataset(),
        addedCount: 0,
        source: 'embedded'
      });
      return indexPromise;
    }

    indexPromise = global.fetch(indexUrl, { cache: 'default' })
      .then(function(res) {
        if (!res || !res.ok) return null;
        return res.json();
      })
      .then(function(payload) {
        var list = payload && Array.isArray(payload.items) ? payload.items : (Array.isArray(payload) ? payload : []);
        var added = mergeRecords(list);
        if (added > 0 && typeof global.CasperEngine !== 'undefined' && typeof global.CasperEngine.buildIndex === 'function') {
          global.CasperEngine.buildIndex(getDataset());
        }
        return {
          items: getDataset(),
          addedCount: added,
          source: list.length > 0 ? 'hybrid' : 'embedded'
        };
      })
      .catch(function() {
        return {
          items: getDataset(),
          addedCount: 0,
          source: 'embedded'
        };
      });

    return indexPromise;
  }

  function applyChunkItems(chunkPayload) {
    var items = [];
    if (Array.isArray(chunkPayload)) {
      items = chunkPayload;
    } else if (chunkPayload && Array.isArray(chunkPayload.items)) {
      items = chunkPayload.items;
    } else if (chunkPayload && chunkPayload.items && typeof chunkPayload.items === 'object') {
      Object.keys(chunkPayload.items).forEach(function(k) {
        var entry = Object.assign({ id: k }, chunkPayload.items[k]);
        items.push(entry);
      });
    }

    for (var i = 0; i < items.length; i++) {
      var detail = items[i];
      if (!detail || !detail.id) continue;
      var target = beanById.get(detail.id);
      if (target) {
        Object.keys(detail).forEach(function(key) {
          if (detail[key] !== null && detail[key] !== undefined && detail[key] !== '') {
            target[key] = detail[key];
          }
        });
        target._tier2Loaded = true;
        applyArchetypeInheritance(target);
      }
    }
  }

  function loadChunk(chunkId, chunkBaseUrl) {
    if (!chunkId) return Promise.resolve(false);
    if (loadedChunks.has(chunkId)) return Promise.resolve(true);
    if (inFlightChunks.has(chunkId)) return inFlightChunks.get(chunkId);

    if (isFileProtocol() || typeof global.fetch !== 'function') {
      loadedChunks.add(chunkId);
      return Promise.resolve(true);
    }

    var base = chunkBaseUrl || 'data/chunks';
    var url = base.replace(/\/$/, '') + '/' + encodeURIComponent(chunkId) + '.json';

    var req = global.fetch(url, { cache: 'force-cache' })
      .then(function(res) {
        if (!res || !res.ok) return null;
        return res.json();
      })
      .then(function(payload) {
        if (payload) applyChunkItems(payload);
        loadedChunks.add(chunkId);
        inFlightChunks.delete(chunkId);
        return true;
      })
      .catch(function() {
        inFlightChunks.delete(chunkId);
        return false;
      });

    inFlightChunks.set(chunkId, req);
    return req;
  }

  function getBeanById(coffeeId) {
    if (!coffeeId) return null;
    if (beanById.size === 0) rebuildMaps();
    return beanById.get(coffeeId) || null;
  }

  function ensureBeanDetail(coffeeId) {
    var item = getBeanById(coffeeId);
    if (!item) return Promise.resolve(null);
    if (!item.chunkId || item._tier2Loaded || loadedChunks.has(item.chunkId)) {
      applyArchetypeInheritance(item);
      return Promise.resolve(item);
    }
    return loadChunk(item.chunkId).then(function() {
      applyArchetypeInheritance(item);
      return item;
    });
  }

  function ensureBeansDetail(coffeeIds) {
    var ids = Array.isArray(coffeeIds) ? coffeeIds : [];
    return Promise.all(ids.map(ensureBeanDetail));
  }

  function getStats() {
    var list = getDataset();
    var masterCount = 0;
    var roasteryCount = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].recordType === 'ROASTERY_PRODUCT') roasteryCount++;
      else masterCount++;
    }
    return {
      totalCount: list.length,
      masterCount: masterCount,
      roasteryCount: roasteryCount,
      loadedChunksCount: loadedChunks.size
    };
  }

  rebuildMaps();

  global.CTADataLoader = {
    schemaVersion: 'v4',
    loadIndex: loadIndex,
    loadChunk: loadChunk,
    mergeRecords: mergeRecords,
    ensureBeanDetail: ensureBeanDetail,
    ensureBeansDetail: ensureBeansDetail,
    applyArchetypeInheritance: applyArchetypeInheritance,
    getBeanById: getBeanById,
    getStats: getStats,
    rebuildMaps: rebuildMaps
  };
})(typeof window !== 'undefined' ? window : globalThis);
