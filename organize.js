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

  const difficulty = sub.level.toLowerCase(); // easy, medium, hard
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

console.log("✅ Organized solutions into leetcode_solutions/");
