// organize-from-json.js
// Reads submissions.json and writes solutions into easy/medium/hard folders
// using ./src/files (writeSolution + generateReadmeIndex).

const fs = require("fs");
const path = require("path");
const { writeSolution, generateReadmeIndex } = require("./src/files");

const INPUT = path.resolve("./submissions.json");

if (!fs.existsSync(INPUT)) {
  console.error("submissions.json not found. Run your fetch step first (e.g., node fetch-leetcode.js).");
  process.exit(1);
}

let rowsRaw;
try {
  rowsRaw = JSON.parse(fs.readFileSync(INPUT, "utf8"));
} catch (e) {
  console.error("Failed to parse submissions.json:", e.message);
  process.exit(1);
}

// Accept either an array at root or { submissions_dump: [...] }
const rows = Array.isArray(rowsRaw)
  ? rowsRaw
  : Array.isArray(rowsRaw?.submissions_dump)
  ? rowsRaw.submissions_dump
  : (() => {
      console.error("Unsupported JSON shape: expected an array or { submissions_dump: [...] }");
      process.exit(1);
    })();

function isAccepted(s) {
  return (
    s?.status === "Accepted" ||
    s?.status_display === "Accepted" ||
    s?.statusDisplay === "Accepted" ||
    s?.state === "AC"
  );
}

function normDifficulty(d) {
  if (typeof d === "number") {
    if (d === 1) return "Easy";
    if (d === 2) return "Medium";
    if (d === 3) return "Hard";
    return "Unknown";
  }
  if (typeof d === "string") {
    const s = d.trim().toLowerCase();
    if (s.startsWith("e")) return "Easy";
    if (s.startsWith("m")) return "Medium";
    if (s.startsWith("h")) return "Hard";
  }
  return "Unknown";
}

function slugifyTitle(t) {
  return String(t || "unknown-slug").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

let saved = 0;
let skippedNoCode = 0;
let skippedNotAccepted = 0;

for (const sub of rows) {
  if (!isAccepted(sub)) {
    skippedNotAccepted++;
    continue;
  }

  const difficulty = normDifficulty(sub.difficulty ?? sub.level);

  const questionId = String(
    sub.questionId ??
      sub.question_id ??
      sub.questionFrontendId ??
      sub.frontendId ??
      sub.frontend_id ??
      sub.qid ??
      sub.id ??
      "unknown"
  );

  const titleSlug =
    sub.titleSlug ??
    sub.title_slug ??
    slugifyTitle(sub.title);

  const language =
    sub.language ??
    sub.lang_name ??
    sub.langName ??
    sub.lang ??
    "text";

  // Pull code from the most likely fields
  const code =
    sub.code ??
    sub.submissionCode ??
    sub.solutionCode ??
    sub.solution ??
    "";

  if (!code || typeof code !== "string" || code.trim() === "") {
    skippedNoCode++;
    continue;
  }

  try {
    const { fpath } = writeSolution({
      difficulty,
      questionId,
      titleSlug,
      code,
      language,
    });
    console.log(`Saved: ${fpath}`);
    saved++;
  } catch (err) {
    console.error(`Failed to write solution for ${questionId}_${titleSlug}: ${err.message}`);
  }
}

generateReadmeIndex();

console.log("\n--- Summary ---");
console.log(`Saved files: ${saved}`);
console.log(`Skipped (no code): ${skippedNoCode}`);
console.log(`Skipped (not accepted): ${skippedNotAccepted}`);
