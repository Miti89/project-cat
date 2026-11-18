const fs = require("fs");
const path = require("path");

// 사용법:
//   node scripts/bump-version.js "수정 요약"
//   node scripts/bump-version.js --minor "신규 기능 요약"
//   node scripts/bump-version.js --schema "스키마 필드/매핑 보완 요약"         (schemaVersion: v3 -> v3.1)
//   node scripts/bump-version.js --schema-major "스키마 대규모 업그레이드 요약"  (schemaVersion: v3 -> v4, minor +1)
const rawArgs = process.argv.slice(2);
let bumpMinor = false;
let bumpSchemaMinor = false;
let bumpSchemaMajor = false;
const summaryParts = [];

for (const arg of rawArgs) {
  if (arg === "--minor") bumpMinor = true;
  else if (arg === "--schema") bumpSchemaMinor = true;
  else if (arg === "--schema-major") {
    bumpSchemaMajor = true;
    bumpMinor = true;
  } else {
    summaryParts.push(arg);
  }
}

const summaryArg = summaryParts.join(" ").trim() || "UI 및 기능 개선 업데이트";

// 한국 표준시(KST, UTC+9) 기준 YYYY-MM-DD 산출
const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
const today = kstNow.toISOString().slice(0, 10);

// 스크립트가 프로젝트 루트에 있거나 scripts/ 하위 폴더에 있어도 자동 탐색
const rootDir = fs.existsSync(path.join(__dirname, "version.js"))
  ? __dirname
  : path.join(__dirname, "..");

const versionFilePath = path.join(rootDir, "version.js");
const indexFilePath = path.join(rootDir, "index.html");
const changelogFilePath = path.join(rootDir, "CHANGELOG.md");

const versionSrc = fs.readFileSync(versionFilePath, "utf8");
const verMatch = versionSrc.match(/version:\s*"(\d+)\.(\d+)\.(\d+)"/);
const stageMatch = versionSrc.match(/stage:\s*"([^"]*)"/);
const schemaMatch = versionSrc.match(/schemaVersion:\s*"v(\d+)(?:\.(\d+))?"/);

if (!verMatch) {
  console.error("version.js에서 현재 버전을 찾을 수 없습니다.");
  process.exit(1);
}

const nextVersion = bumpMinor
  ? `${verMatch[1]}.${Number(verMatch[2]) + 1}.0`
  : `${verMatch[1]}.${verMatch[2]}.${Number(verMatch[3]) + 1}`;
const stageStr = stageMatch ? stageMatch[1] : "α1";
const stageSuffix = stageStr ? ` (${stageStr})` : "";

const curSchemaMajor = schemaMatch ? Number(schemaMatch[1]) : 3;
const curSchemaMinor = schemaMatch && schemaMatch[2] !== undefined ? Number(schemaMatch[2]) : 0;
let nextSchemaVersion = schemaMatch
  ? (schemaMatch[2] !== undefined ? `v${curSchemaMajor}.${curSchemaMinor}` : `v${curSchemaMajor}`)
  : "v3";
const schemaChanged = bumpSchemaMinor || bumpSchemaMajor;

if (bumpSchemaMajor) {
  nextSchemaVersion = `v${curSchemaMajor + 1}`;
} else if (bumpSchemaMinor) {
  nextSchemaVersion = `v${curSchemaMajor}.${curSchemaMinor + 1}`;
}

const schemaHistoryLine = schemaChanged ? `\n      schemaVersion: "${nextSchemaVersion}",` : "";

let updatedVersionSrc = versionSrc
  .replace(/version:\s*"\d+\.\d+\.\d+"/, `version: "${nextVersion}"`)
  .replace(/updatedAt:\s*"[^"]*"/, `updatedAt: "${today}"`)
  .replace(
    /history:\s*\[/,
    `history: [\n    {\n      version: "${nextVersion}",\n      stage: "${stageStr}",${schemaHistoryLine}\n      date: "${today}",\n      summary: ${JSON.stringify(summaryArg)}\n    },`
  );

if (schemaChanged) {
  if (/schemaVersion:\s*"[^"]*"/.test(updatedVersionSrc)) {
    updatedVersionSrc = updatedVersionSrc.replace(
      /schemaVersion:\s*"[^"]*"/,
      `schemaVersion: "${nextSchemaVersion}"`
    );
  } else {
    updatedVersionSrc = updatedVersionSrc.replace(
      /(stage:\s*"[^"]*",)/,
      `$1\n  schemaVersion: "${nextSchemaVersion}",`
    );
  }
}

fs.writeFileSync(versionFilePath, updatedVersionSrc, "utf8");

if (fs.existsSync(indexFilePath)) {
  let indexSrc = fs.readFileSync(indexFilePath, "utf8");
  indexSrc = indexSrc
    .replace(/REVISION:\s*v\d+\.\d+\.\d+(?:\s*\([^)]*\))?/g, `REVISION: v${nextVersion}${stageSuffix}`)
    .replace(/version\.js\?v=[^"']+/g, `version.js?v=${nextVersion}`)
    .replace(/data\.js\?v=[^"']+/g, `data.js?v=${nextVersion}`)
    .replace(/CTA\s+v\d+\.\d+\.\d+(?:\s*\([^<"]*\))?/g, `CTA v${nextVersion}${stageSuffix}`);
  if (schemaChanged) {
    indexSrc = indexSrc.replace(
      /(APP_VERSION_INFO\.schemaVersion\s*\?\s*APP_VERSION_INFO\.schemaVersion\s*:\s*)"[^"]*"/,
      `$1"${nextSchemaVersion}"`
    );
  }
  fs.writeFileSync(indexFilePath, indexSrc, "utf8");
}

if (fs.existsSync(changelogFilePath)) {
  const logSrc = fs.readFileSync(changelogFilePath, "utf8");
  const schemaHeaderTag = schemaChanged ? ` · Schema ${nextSchemaVersion}` : "";
  const entry = `\n## v${nextVersion}${stageSuffix}${schemaHeaderTag} (${today})\n- ${summaryArg}\n`;
  const updatedLog = logSrc.replace(/(# [^\n]+\n)/, `$1${entry}`);
  fs.writeFileSync(changelogFilePath, updatedLog, "utf8");
}

console.log(
  `[Coffee Taste Archive] CTA v${nextVersion}${stageSuffix}${schemaChanged ? ` · Schema ${nextSchemaVersion}` : ""} (${today}) 업데이트 완료: ${summaryArg}`
);
