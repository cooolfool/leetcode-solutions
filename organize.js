/**
 * LeetCode -> GitHub sync (no CLI).
 * - Logs into leetcode.com using username/password from env.
 * - Fetches recent AC submissions via GraphQL.
 * - For each, fetches submission details (code/lang) + question info (difficulty/id).
 * - Saves to <difficulty>/<id>_<slug>.<ext> (e.g. easy/1_two-sum.py)
 * - Maintains last_sync.json to avoid duplicates.
 * - Generates/updates README.md index.
 * - If there are new solutions, auto-commits and pushes to the configured git remote/branch.
 *
 * NOTE: LeetCode site internals can change. This script reflects the public site flow as of now.
 */


const fs = require("fs");
const path = require("path");

const submissionsFile = "./submissions.json";
const outputDir = "./leetcode_solutions";

if (!fs.existsSync(submissionsFile)) {
  console.error("No submissions.json found");
  process.exit(1);
}

const submissions = JSON.parse(fs.readFileSync(submissionsFile, "utf-8"));

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

submissions.forEach((sub) => {
  if (sub.status !== "Accepted") return;
console.log(`Processing submission: ${sub.id} - ${sub.titleSlug}`);
  const difficulty = sub.level.toLowerCase(); // easy, medium, hard
  console.log(`Difficulty: ${difficulty}`);
  const problemId = sub.id || sub.qid || "unknown";
  const slug = sub.titleSlug.replace(/[^a-z0-9]/gi, "_");
  const ext = sub.lang.toLowerCase().includes("java")
    ? "java"
    : sub.lang.toLowerCase().includes("python")
    ? "py"
    : sub.lang.toLowerCase().includes("cpp")
    ? "cpp"
    : "txt";

  const folder = path.join(outputDir, difficulty);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const filename = `${problemId}_${slug}.${ext}`;
  const filepath = path.join(folder, filename);

  fs.writeFileSync(filepath, sub.code, "utf-8");
});

console.log("Organized solutions into leetcode_solutions/");
