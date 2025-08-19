const fs = require("fs");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function langToExt(lang) {
  const l = (lang || "").toLowerCase();
  if (l.includes("java")) return "java";
  if (l.includes("python")) return "py";
  if (l.includes("cpp")) return "cpp";
  if (l.includes("c#")) return "cs";
  if (l === "c") return "c";
  if (l.includes("javascript") || l.includes("node")) return "js";
  if (l.includes("typescript")) return "ts";
  if (l.includes("go")) return "go";
  if (l.includes("kotlin")) return "kt";
  if (l.includes("swift")) return "swift";
  if (l.includes("ruby")) return "rb";
  if (l.includes("rust")) return "rs";
  return "txt";
}

function sanitizeSlug(slug) {
  return String(slug || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

module.exports = { sleep, langToExt, sanitizeSlug, ensureDir };


