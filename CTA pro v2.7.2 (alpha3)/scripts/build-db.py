#!/usr/bin/env python3
"""
Coffee Taste Archive — Schema v4 2-Tier DB Builder
Reads domestic roastery CSV / JSONL inputs, validates Schema v4 constraints,
and emits:
  - Tier 1 lightweight search/wheel index: <out-dir>/beans-index.json
  - Tier 2 detail chunks (500 items each): <out-dir>/chunks/chunk-XX.json

Usage:
  python3 scripts/build-db.py --input docs/roastery_import_template.csv --dry-run
  python3 scripts/build-db.py --input docs/roastery_import_template.csv --out-dir data --chunk-size 500
"""

import argparse
import csv
import datetime
import json
import os
import sys

VALID_BEAN_TYPES = {"SINGLE_ORIGIN", "BLEND", "DECAF", "SPECIAL_LOT"}
VALID_AVAILABILITY = {"ACTIVE", "SEASONAL", "SOLD_OUT"}
VALID_RECORD_TYPES = {"MASTER_ARCHETYPE", "ROASTERY_PRODUCT"}
BODY_STAGE_MAP = {1: "1단계", 2: "2단계", 3: "3단계", 4: "4단계", 5: "5단계"}


def parse_pipe_list(val):
    if isinstance(val, list):
        return [str(x).strip() for x in val if str(x).strip()]
    if not val:
        return []
    return [x.strip() for x in str(val).split("|") if x.strip()]


def parse_axis_int(val, field_name, row_idx, required=True):
    if val is None or str(val).strip() == "":
        if required:
            raise ValueError(f"Row {row_idx}: missing required axis '{field_name}'")
        return None
    try:
        num = int(float(str(val).strip()))
    except (ValueError, TypeError) as exc:
        raise ValueError(f"Row {row_idx}: '{field_name}' must be an integer (got {val!r})") from exc
    if num < 1 or num > 5:
        raise ValueError(f"Row {row_idx}: '{field_name}' must be in range 1..5 (got {num})")
    return num


def parse_optional_int(val):
    if val is None or str(val).strip() == "":
        return None
    try:
        return int(float(str(val).strip()))
    except (ValueError, TypeError):
        return None


def load_rows(input_path):
    ext = os.path.splitext(input_path)[1].lower()
    if ext == ".jsonl":
        rows = []
        with open(input_path, "r", encoding="utf-8-sig") as f:
            for line_no, line in enumerate(f, start=1):
                line = line.strip()
                if not line:
                    continue
                rows.append((line_no, json.loads(line)))
        return rows

    with open(input_path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        return [(idx, row) for idx, row in enumerate(reader, start=2)]


def normalize_record(row_idx, raw):
    bean_id = str(raw.get("id") or "").strip()
    name = str(raw.get("name") or "").strip()
    roast = str(raw.get("roast") or "").strip()
    if not bean_id:
        raise ValueError(f"Row {row_idx}: missing required 'id'")
    if not name:
        raise ValueError(f"Row {row_idx} ({bean_id}): missing required 'name'")
    if not roast:
        raise ValueError(f"Row {row_idx} ({bean_id}): missing required 'roast'")

    record_type = str(raw.get("recordType") or "ROASTERY_PRODUCT").strip().upper()
    if record_type not in VALID_RECORD_TYPES:
        raise ValueError(f"Row {row_idx} ({bean_id}): invalid recordType {record_type!r}")

    bean_type = str(raw.get("beanType") or "").strip().upper()
    if bean_type not in VALID_BEAN_TYPES:
        raise ValueError(f"Row {row_idx} ({bean_id}): invalid beanType {bean_type!r} (allowed: {sorted(VALID_BEAN_TYPES)})")

    availability = str(raw.get("availability") or "ACTIVE").strip().upper()
    if availability not in VALID_AVAILABILITY:
        raise ValueError(f"Row {row_idx} ({bean_id}): invalid availability {availability!r} (allowed: {sorted(VALID_AVAILABILITY)})")

    sour_dots = parse_axis_int(raw.get("sourDots"), "sourDots", row_idx, required=True)
    nutty_dots = parse_axis_int(raw.get("nuttyDots"), "nuttyDots", row_idx, required=True)
    body_dots = parse_axis_int(raw.get("bodyDots"), "bodyDots", row_idx, required=True)
    sweet_dots = parse_axis_int(raw.get("sweetDots"), "sweetDots", row_idx, required=False) or 3

    roastery_obj = raw.get("roastery")
    if not isinstance(roastery_obj, dict):
        r_id = str(raw.get("roasteryId") or "").strip()
        r_ko = str(raw.get("roasteryNameKo") or "").strip()
        r_en = str(raw.get("roasteryNameEn") or "").strip()
        r_reg = str(raw.get("roasteryRegion") or "").strip()
        r_url = str(raw.get("roasteryUrl") or "").strip()
        if record_type == "ROASTERY_PRODUCT" and not (r_id or r_ko):
            raise ValueError(f"Row {row_idx} ({bean_id}): ROASTERY_PRODUCT requires roasteryId/roasteryNameKo")
        roastery_obj = {
            "id": r_id or bean_id.split("-")[0],
            "nameKo": r_ko,
            "nameEn": r_en or r_ko,
            "region": r_reg,
            "url": r_url,
        } if (r_id or r_ko) else None

    pack_obj = raw.get("pack")
    if not isinstance(pack_obj, dict):
        grams = parse_optional_int(raw.get("grams"))
        price_krw = parse_optional_int(raw.get("priceKrw"))
        price_per_100g = parse_optional_int(raw.get("pricePer100g"))
        if price_per_100g is None and grams and price_krw and grams > 0:
            price_per_100g = round((price_krw / grams) * 100)
        purchase_url = str(raw.get("purchaseUrl") or "").strip()
        pack_obj = {
            "grams": grams,
            "priceKrw": price_krw,
            "pricePer100g": price_per_100g,
            "purchaseUrl": purchase_url,
        } if (grams or price_krw or purchase_url) else None

    country_code = str(raw.get("countryCode") or "").strip().upper()
    if country_code == "BLEND":
        country_code = "BLD"

    caffeine = str(raw.get("caffeine") or ("DECAF" if bean_type == "DECAF" else "REGULAR")).strip().upper()
    today_iso = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).strftime("%Y-%m-%d")

    full_record = {
        "id": bean_id,
        "no": str(raw.get("no") or bean_id.upper()).strip(),
        "recordType": record_type,
        "beanType": bean_type,
        "availability": availability,
        "lastCheckedAt": str(raw.get("lastCheckedAt") or today_iso).strip(),
        "name": name,
        "eng": str(raw.get("eng") or name).strip(),
        "origin": str(raw.get("origin") or "☕ BLEND").strip(),
        "countryCode": country_code or "BLD",
        "region": str(raw.get("region") or "").strip(),
        "categoryType": str(raw.get("categoryType") or ("HOUSE_BLEND" if bean_type == "BLEND" else "SINGLE_ORIGIN")).strip(),
        "roast": roast,
        "varietal": str(raw.get("varietal") or "Arabica Blend").strip(),
        "process": str(raw.get("process") or "Washed").strip(),
        "processGroup": str(raw.get("processGroup") or "Washed").strip(),
        "altitude": str(raw.get("altitude") or "Various").strip(),
        "caffeine": caffeine,
        "sourDots": sour_dots,
        "nuttyDots": nutty_dots,
        "bodyDots": body_dots,
        "sweetDots": sweet_dots,
        "bodyStage": str(raw.get("bodyStage") or BODY_STAGE_MAP.get(body_dots, "3단계")).strip(),
        "headline": str(raw.get("headline") or "").strip(),
        "guide": str(raw.get("guide") or "").strip(),
        "keywords": parse_pipe_list(raw.get("keywords")),
        "flavorFamily": parse_pipe_list(raw.get("flavorFamily")),
        "roastery": roastery_obj,
        "pack": pack_obj,
        "baseArchetypeId": str(raw.get("baseArchetypeId") or "").strip() or None,
    }
    return full_record


def split_tiers(records, chunk_size):
    tier1_items = []
    chunks = []
    for idx, rec in enumerate(records):
        chunk_num = idx // chunk_size
        chunk_id = f"chunk-{chunk_num:02d}"
        while len(chunks) <= chunk_num:
            chunks.append({"chunkId": f"chunk-{len(chunks):02d}", "items": []})

        tier1_items.append({
            "id": rec["id"],
            "no": rec["no"],
            "recordType": rec["recordType"],
            "beanType": rec["beanType"],
            "availability": rec["availability"],
            "lastCheckedAt": rec["lastCheckedAt"],
            "name": rec["name"],
            "eng": rec["eng"],
            "origin": rec["origin"],
            "countryCode": rec["countryCode"],
            "region": rec["region"],
            "categoryType": rec["categoryType"],
            "roast": rec["roast"],
            "varietal": rec["varietal"],
            "process": rec["process"],
            "processGroup": rec["processGroup"],
            "caffeine": rec["caffeine"],
            "sourDots": rec["sourDots"],
            "nuttyDots": rec["nuttyDots"],
            "bodyDots": rec["bodyDots"],
            "sweetDots": rec["sweetDots"],
            "bodyStage": rec["bodyStage"],
            "headline": rec["headline"],
            "keywords": rec["keywords"],
            "flavorFamily": rec["flavorFamily"],
            "roastery": rec["roastery"],
            "pack": rec["pack"],
            "baseArchetypeId": rec["baseArchetypeId"],
            "chunkId": chunk_id,
        })

        chunks[chunk_num]["items"].append({
            "id": rec["id"],
            "altitude": rec["altitude"],
            "guide": rec["guide"],
            "sourDesc": rec.get("sourDesc", ""),
            "nuttyDesc": rec.get("nuttyDesc", ""),
            "bodyDesc": rec.get("bodyDesc", ""),
            "sweetDesc": rec.get("sweetDesc", ""),
            "dialingNote": rec.get("dialingNote", None),
            "traceability": rec.get("traceability", None),
        })

    return tier1_items, chunks


def main():
    parser = argparse.ArgumentParser(description="Build Schema v4 2-Tier coffee database")
    parser.add_argument("--input", default="docs/roastery_import_template.csv", help="Input CSV or JSONL path")
    parser.add_argument("--out-dir", default="data", help="Output directory for beans-index.json and chunks/")
    parser.add_argument("--chunk-size", type=int, default=500, help="Records per Tier 2 chunk (default: 500)")
    parser.add_argument("--dry-run", action="store_true", help="Validate and report stats without writing files")
    args = parser.parse_args()

    if args.chunk_size < 1:
        raise SystemExit("Error: --chunk-size must be >= 1")
    if not os.path.exists(args.input):
        raise SystemExit(f"Error: input file not found: {args.input}")

    raw_rows = load_rows(args.input)
    seen_ids = set()
    validated = []
    errors = []

    for row_idx, raw in raw_rows:
        try:
            rec = normalize_record(row_idx, raw)
            if rec["id"] in seen_ids:
                raise ValueError(f"Row {row_idx}: duplicate id {rec['id']!r}")
            seen_ids.add(rec["id"])
            validated.append(rec)
        except ValueError as err:
            errors.append(str(err))

    if errors:
        print("Validation failed:", file=sys.stderr)
        for e in errors:
            print(f"  - {e}", file=sys.stderr)
        sys.exit(1)

    tier1_items, chunks = split_tiers(validated, args.chunk_size)
    today_iso = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=9))).strftime("%Y-%m-%d")

    index_payload = {
        "schemaVersion": "v4",
        "chunkSize": args.chunk_size,
        "totalRecords": len(tier1_items),
        "builtAt": today_iso,
        "items": tier1_items,
    }

    if args.dry_run:
        print(
            f"[DRY-RUN PASS] Validated {len(validated)} records from '{args.input}' "
            f"-> Tier 1 index ({len(tier1_items)} items), Tier 2 chunks ({len(chunks)} file(s) @ {args.chunk_size}/chunk)."
        )
        return

    chunks_dir = os.path.join(args.out_dir, "chunks")
    os.makedirs(chunks_dir, exist_ok=True)

    index_path = os.path.join(args.out_dir, "beans-index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index_payload, f, ensure_ascii=False, separators=(",", ":"))

    for chunk in chunks:
        chunk_path = os.path.join(chunks_dir, f"{chunk['chunkId']}.json")
        with open(chunk_path, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "schemaVersion": "v4",
                    "chunkId": chunk["chunkId"],
                    "count": len(chunk["items"]),
                    "items": chunk["items"],
                },
                f,
                ensure_ascii=False,
                separators=(",", ":"),
            )

    print(
        f"[BUILD OK] Wrote {index_path} ({len(tier1_items)} items) and "
        f"{len(chunks)} chunk file(s) under {chunks_dir}."
    )


if __name__ == "__main__":
    main()
