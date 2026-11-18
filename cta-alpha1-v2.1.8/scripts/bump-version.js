const fs = require("fs");
const path = require("path");

const summaryArg = process.argv.slice(2).join(" ").trim() || "UI 및 기능 개선 업데이트";

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

if (!verMatch) {
  console.error("version.js에서 현재 버전을 찾을 수 없습니다.");
  process.exit(1);
}

const nextVersion = `${verMatch[1]}.${verMatch[2]}.${Number(verMatch[3]) + 1}`;
const stageStr = stageMatch ? stageMatch[1] : "α1";
const stageSuffix = stageStr ? ` (${stageStr})` : "";

let updatedVersionSrc = versionSrc
  .replace(/version:\s*"\d+\.\d+\.\d+"/, `version: "${nextVersion}"`)
  .replace(/updatedAt:\s*"[^"]*"/, `updatedAt: "${today}"`)
  .replace(
    /history:\s*\[/,
    `history: [\n    {\n      version: "${nextVersion}",\n      stage: "${stageStr}",\n      date: "${today}",\n      summary: ${JSON.stringify(summaryArg)}\n    },`
  );

fs.writeFileSync(versionFilePath, updatedVersionSrc, "utf8");

if (fs.existsSync(indexFilePath)) {
  let indexSrc = fs.readFileSync(indexFilePath, "utf8");
  indexSrc = indexSrc
    .replace(/REVISION:\s*v\d+\.\d+\.\d+(?:\s*\([^)]*\))?/g, `REVISION: v${nextVersion}${stageSuffix}`)
    .replace(/version\.js\?v=[^"']+/g, `version.js?v=${nextVersion}`)
    .replace(/data\.js\?v=[^"']+/g, `data.js?v=${nextVersion}`)
    .replace(/CTA\s+v\d+\.\d+\.\d+(?:\s*\([^<"]*\))?/g, `CTA v${nextVersion}${stageSuffix}`);
  fs.writeFileSync(indexFilePath, indexSrc, "utf8");
}

if (fs.existsSync(changelogFilePath)) {
  const logSrc = fs.readFileSync(changelogFilePath, "utf8");
  const entry = `\n## v${nextVersion}${stageSuffix} (${today})\n- ${summaryArg}\n`;
  const updatedLog = logSrc.replace(/(# [^\n]+\n)/, `$1${entry}`);
  fs.writeFileSync(changelogFilePath, updatedLog, "utf8");
}

console.log(`[Coffee Taste Archive] CTA v${nextVersion}${stageSuffix} (${today}) 업데이트 완료: ${summaryArg}`);
