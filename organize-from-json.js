const fs = require("fs");
const path = require("path");
const { writeSolution, generateReadmeIndex } = require("./src/files");

const INPUT = path.resolve("./submissions.json");
if (!fs.existsSync(INPUT)) {
  console.error("submissions.json not found. Run your fetch step first.");
  process.exit(1);
}

let rows;
try {
  rows = JSON.parse(fs.readFileSync(INPUT, "utf8"));
  if (!Array.isArray(rows)) throw new Error("JSON is not an array");
} catch (e) {
  console.error("Failed to parse submissions.json:", e.message);
  process.exit(1);
}

function normDifficulty(d) {
  if (typeof d === "number") return d === 1 ? "Easy" : d === 2 ? "Medium" : d === 3 ? "Hard" : "Unknown";
  if (typeof d === "string") {
    const s = d.toLowerCase();
    if (s.startsWith("e")) return "Easy";
    if (s.startsWith("m")) return "Medium";
    if (s.startsWith("h")) return "Hard";
  }
  return "Unknown";
}

function isAccepted(s) {
  return (
    s?.status === "Accepted" ||
    s?.status_display === "Accepted" ||
    s?.statusDisplay === "Accepted" ||
    s?.state === "AC"
  );
}

let saved = 0;
for (const sub of rows) {
  if (!isAccepted(sub)) continue;

  const difficulty = normDifficulty(sub.difficulty ?? sub.level);
  const questionId = String(
    sub.questionId ??
    sub.question_id ??
    sub.questionFrontendId ??
    sub.frontendId ??
    sub.qid ??
    sub.frontend_id ??
    sub.id ??
    "unknown"
  );

  const titleSlug =
    sub.titleSlug ??
    sub.title_slug ??
    (sub.title ? sub.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "unknown-slug");

  const language = sub.language ?? sub.lang ?? sub.langName ?? sub.lang_name ?? "text";
  const code = sub.code ?? sub.submissionCode ?? sub.solutionCode ?? "";

  if (!code) continue; // don’t create empty files

  const { fpath } = writeSolution({ difficulty, questionId, titleSlug, code, language });
  console.log(`Saved: ${fpath}`);
  saved++;
}

generateReadmeIndex();
console.log(`\nDone. Organized ${saved} solution(s).`);
