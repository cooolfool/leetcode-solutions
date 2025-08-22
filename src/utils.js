const fs = require("fs");
const path = require("path");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeSlug(s) {
  if (!s) return "unknown-slug";
  return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function langToExt(language) {
  const l = String(language || "").toLowerCase();
  if (l.includes("java")) return "java";
  if (l.includes("python")) return "py";
  if (l.includes("cpp") || l.includes("c++")) return "cpp";
  if (l === "c") return "c";
  if (l.includes("javascript") || l === "js" || l === "node")) return "js";
  if (l.includes("typescript") || l === "ts") return "ts";
  if (l.includes("go")) return "go";
  if (l.includes("rust")) return "rs";
  if (l.includes("c#") || l.includes("csharp")) return "cs";
  if (l.includes("kotlin")) return "kt";
  if (l.includes("scala")) return "scala";
  if (l.includes("ruby")) return "rb";
  if (l.includes("swift")) return "swift";
  if (l.includes("php")) return "php";
  if (l.includes("sql") || l.includes("mysql") || l.includes("mssql") || l.includes("oracle")) return "sql";
  if (l.includes("bash") || l.includes("shell")) return "sh";
  return "txt";
}

module.exports = { ensureDir, sanitizeSlug, langToExt };
