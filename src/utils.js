// src/utils.js
const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeSlug(s) {
  if (!s) return "unknown_slug";
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function langToExt(language) {
  const l = String(language || "").toLowerCase();
  if (l.includes("java")) return "java";
  if (l.includes("python")) return "py";
  if (l.includes("c++") || l.includes("cpp")) return "cpp";
  if (/^\s*c\s*$/.test(l)) return "c";
  if (l.includes("javascript") || l === "js" || l === "node") return "js";
  if (l.includes("typescript") || l === "ts") return "ts";
  if (l.includes("golang") || l === "go") return "go";
  if (l.includes("rust")) return "rs";
  if (l.includes("c#") || l.includes("csharp")) return "cs";
  if (l.includes("kotlin")) return "kt";
  if (l.includes("scala")) return "scala";
  if (l.includes("ruby")) return "rb";
  if (l.includes("swift")) return "swift";
  if (l.includes("php")) return "php";
  if (l.includes("sql")) return "sql";
  if (l.includes("bash") || l.includes("shell")) return "sh";
  return "txt";
}

module.exports = { ensureDir, sanitizeSlug, langToExt };
