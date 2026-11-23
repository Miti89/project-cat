# Coffee Taste Archive — Schema v4 Specification

- **Build Baseline:** `CTA v2.7.0 (α3)` · `Casper™ V1`
- **Status:** Active (100% backward-compatible with Schema v2 / v3.4 master beans)
- **Scale Target:** 120 Master Archetypes + 4,000–10,000+ Korean Domestic Roastery Products (`ROASTERY_PRODUCT`)

---

## 1. 레코드 유형 (`recordType`)

`coffeeData` 배열의 모든 항목은 Schema v4 표준 모델을 따르며, `recordType` 필드로 원형(Archetype)과 국내 로스터리 실판매 상품을 구분합니다.

| `recordType` | 설명 | 저장 위치 |
| --- | --- | --- |
| `"MASTER_ARCHETYPE"` | 아카이브 기본 내장 120종 SCA·WCR 대표 원두 (오프라인/`file://` 무손실 기본값) | `data.js` (내장) |
| `"ROASTERY_PRODUCT"` | 국내 로스터리에서 실제 판매·유통 중인 개별 원두 상품 | `data/beans-index.json` + `data/chunks/chunk-XX.json` |

> `data.js` 부트스트랩(`bootstrapSchemaV4`)에서 기존 120종 원두에 `recordType: "MASTER_ARCHETYPE"` 및 파생 `beanType`, `availability` 기본값을 자동 주입하므로 기존 Schema v2~v3.4 코드는 수정 없이 100% 호환됩니다.

---

## 2. Schema v4 확장 필드 정의

### 2.1 신규 표준 필드 (Schema v4)

| 필드명 | 타입 | 필수 | 설명 및 허용 값 |
| --- | --- | --- | --- |
| `recordType` | `string` | Y | `"MASTER_ARCHETYPE"` \| `"ROASTERY_PRODUCT"` |
| `roastery` | `object \| null` | 조건부 | 국내 로스터리 정보 (`ROASTERY_PRODUCT` 시 필수): `{ id, nameKo, nameEn, region, url }` |
| `beanType` | `string` | Y | `"SINGLE_ORIGIN"` \| `"BLEND"` \| `"DECAF"` \| `"SPECIAL_LOT"` |
| `availability` | `string` | Y | 유통 상태: `"ACTIVE"` \| `"SEASONAL"` \| `"SOLD_OUT"` |
| `lastCheckedAt` | `string` | 권장 | 판매 상태·가격 최종 확인일 (`YYYY-MM-DD`, ISO-8601) |
| `pack` | `object \| null` | 권장 | 판매 규격·가격·구매처: `{ grams, priceKrw, pricePer100g, purchaseUrl }` |
| `baseArchetypeId` | `string \| null` | 권장 | 대표 마스터 원두 ID (예: `"eth-01"`). `guide`·`dialingNote`·`brewTempWarning` 등 자동 상속 |
| `chunkId` | `string \| null` | 시스템 | Tier 2 상세 청크 ID (예: `"chunk-00"`). `scripts/build-db.py`가 500종 단위로 자동 부여 |

#### `roastery` 하위 스키마
```json
{
  "id": "momos",
  "nameKo": "모모스 커피",
  "nameEn": "Momos Coffee",
  "region": "부산 영도",
  "url": "https://www.momos.co.kr"
}
```

#### `pack` 하위 스키마
```json
{
  "grams": 200,
  "priceKrw": 18000,
  "pricePer100g": 9000,
  "purchaseUrl": "https://www.momos.co.kr/product/example"
}
```
> `pricePer100g`가 입력되지 않으면 `scripts/build-db.py`가 `round(priceKrw / grams * 100)`으로 자동 산출합니다.

### 2.2 기존 마스터 원두 호환 필드 (Schema v2 ~ v3.4 유지)

- **식별·기본:** `id`, `no`, `name`, `eng`, `origin`, `countryCode`, `region`, `categoryType`
- **4축 지표:** `sourDots` (`1..5`), `nuttyDots` (`1..5`), `bodyDots` (`1..5`), `sweetDots` (`1..5`), `bodyStage`, `roast`
- **품종·가공:** `varietal`, `varietalCode`, `varietalCanonical`, `species`, `lineage`, `process`, `processGroup`, `physicalGrade`, `altitude`, `altitudeRange`, `caffeine`, `flavorFamily`, `keywords`
- **추출·스토리·추적성:** `headline`, `sourDesc`, `nuttyDesc`, `bodyDesc`, `sweetDesc`, `guide`, `brewOverride`, `brewSpec`, `brewTempWarning`, `dialingNote`, `traceability`, `i18n` (`ko`/`en`/`ja`), `updatedAt`

---

## 3. 2-Tier 데이터 분할 & 하이브리드 로딩 아키텍처

4,000~10,000종 적재 시에도 초기 로딩 속도와 `file://` Zero-Build 호환을 동시에 만족하기 위해 데이터를 2계층으로 분리합니다.

1. **Tier 1 (`data/beans-index.json`) — 경량 검색·목록 인덱스**
   - 초기 부팅 시 HTTP 환경에서 1회 비동기 로드 (`window.CTADataLoader`).
   - 카드 목록 렌더, `CasperEngine` 다국어/초성/로스터리 검색, 4축 썸휠 매칭, 원산지 카운트에 필요한 경량 필드만 수록 (`~150–250B/건` 수준, gzip 시 수백 KB).
   - `baseArchetypeId` 참조 및 `chunkId` 포인터 포함.
2. **Tier 2 (`data/chunks/chunk-XX.json`) — 500종 단위 상세 청크**
   - `guide`, `dialingNote`, `brewTempWarning`, `traceability`, 전체 `i18n` 등 장문/상세 데이터를 500종씩 분할 (`chunk-00.json`, `chunk-01.json`, ...).
   - 사용자가 원두 상세 모달 또는 2종 비교 모달을 열 때 해당 `chunkId`만 지연 로드(`fetch`) 후 메모리 캐시(`chunkCache`)에 보관.
3. **`file://` 로컬 실행 폴백**
   - `file://` 프로토콜이거나 외부 인덱스 부재 시 `data.js` 내장 `coffeeData`(120종 `MASTER_ARCHETYPE`)만으로 100% 무손실 동작.

---

## 4. `baseArchetypeId` 자동 상속 규칙

`ROASTERY_PRODUCT` 레코드가 `baseArchetypeId`를 보유하고 있고 개별 필드(`guide`, `dialingNote`, `brewTempWarning`, `brewSpec`, `sourDesc`, `nuttyDesc`, `bodyDesc`, `sweetDesc`, `traceability`)가 비어 있을 경우, `CTADataLoader`가 해당 ID의 `MASTER_ARCHETYPE`에서 자동으로 값을 상속합니다.

---

## 5. 빌드·검증 파이프라인 (`scripts/build-db.py`)

```bash
# 입력 템플릿 검증 (파일 미생성 dry-run)
python3 scripts/build-db.py --input docs/roastery_import_template.csv --dry-run

# Tier 1 + Tier 2 분할 빌드 생성
python3 scripts/build-db.py --input docs/roastery_import_template.csv --out-dir data --chunk-size 500
```

- 검증 항목: 중복 `id` 차단, 필수 필드 확인, 4축(`sourDots`, `nuttyDots`, `bodyDots`, `sweetDots`) `1..5` 정수 범위 검증, `beanType` · `availability` 열거형 검증.
