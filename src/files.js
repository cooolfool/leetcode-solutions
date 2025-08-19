const fs = require("fs");
const path = require("path");
const { OUTPUT_ROOT, BASE } = require("./config");
const { ensureDir, langToExt, sanitizeSlug } = require("./utils");

function writeSolution({ difficulty, questionId, titleSlug, code, language }) {
  const diff = (difficulty || "Unknown").toLowerCase();
  const dir = path.join(OUTPUT_ROOT, diff);
  ensureDir(dir);

  const safeSlug = sanitizeSlug(titleSlug);
  const ext = langToExt(language);
  const fname = `${questionId || "unknown"}_${safeSlug}.${ext}`;
  const fpath = path.join(dir, fname);

  fs.writeFileSync(fpath, code, "utf8");
  return { fpath };
}

function listDifficultyDirs() {
  const all = fs
    .readdirSync(OUTPUT_ROOT)
    .filter(
      (d) => fs.existsSync(path.join(OUTPUT_ROOT, d)) && fs.statSync(path.join(OUTPUT_ROOT, d)).isDirectory()
    );
  const allowed = new Set(["easy", "medium", "hard"]);
  return all.filter((d) => allowed.has(d.toLowerCase())).sort();
}

function generateReadmeIndex() {
  const sections = [];
  const diffs = listDifficultyDirs();

  sections.push(`# LeetCode Solutions\n`);
  sections.push(
    `Auto-synced from LeetCode accepted submissions. Folder structure: \`<difficulty>/<id>_<slug>.<ext>\` (e.g. \`easy/1_two-sum.py\`).\n`
  );

  diffs.sort().forEach((d) => {
    sections.push(`## ${d[0].toUpperCase()}${d.slice(1)}\n`);
    const files = fs.readdirSync(path.join(OUTPUT_ROOT, d)).filter((f) => f.includes("_"));
    if (files.length === 0) {
      sections.push("_No solutions yet._\n");
      return;
    }
    sections.push(`| Problem | File |\n|---|---|\n`);
    files
      .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
      .forEach((f) => {
        const [id, rest] = f.split("_", 2);
        const slug = rest.replace(/\.[^.]+$/, "");
        const urlSlug = slug.replace(/_/g, "-");
        const lcLink = `${BASE}/problems/${urlSlug}/`;
        const ghLink = `${d}/${f}`;
        sections.push(`| [${id}. ${slug.replace(/[-_]/g, " ")}](${lcLink}) | [${f}](${ghLink}) |\n`);
      });
    sections.push("\n");
  });

  fs.writeFileSync("README.md", sections.join(""), "utf8");
}

module.exports = { writeSolution, generateReadmeIndex };


