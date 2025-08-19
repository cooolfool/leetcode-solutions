/**
 * LeetCode -> GitHub sync (no CLI).
 * - Logs into leetcode.com using username/password from env.
 * - Fetches recent AC submissions via GraphQL.
 * - For each, fetches submission details (code/lang) + question info (difficulty/id).
 * - Saves to leetcode_solutions/<difficulty>/<id>_<slug>.<ext>
 * - Maintains last_sync.json to avoid duplicates.
 * - Generates/updates README.md index.
 *
 * NOTE: LeetCode site internals can change. This script reflects the public site flow as of now.
 */

const fs = require("fs");
const path = require("path");

// --- Config ---
const BASE = "https://leetcode.com";
const LOGIN_URL = `${BASE}/accounts/login/`;
const GRAPHQL_URL = `${BASE}/graphql`;
const OUTPUT_DIR = "leetcode_solutions";
const STATE_FILE = "last_sync.json";
const MAX_RECENT = 50; // how many recent ACs to pull each run

// Env
const USERNAME = process.env.LEETCODE_USERNAME;
const PASSWORD = process.env.LEETCODE_PASSWORD;

if (!USERNAME || !PASSWORD) {
  console.error("Missing LEETCODE_USERNAME or LEETCODE_PASSWORD env vars.");
  process.exit(1);
}

// --- Simple cookie jar (no deps) ---
const jar = {};
function setCookiesFromResponse(res) {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return;
  // Handle multiple Set-Cookie headers concatenated
  const parts = setCookie.split(/,(?=[^;]+=[^;]+)/g);
  parts.forEach((c) => {
    const [kv, ..._] = c.split(";");
    const [k, v] = kv.trim().split("=");
    if (k && v) jar[k] = v;
  });
}
function cookieHeader() {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}
function getCookie(name) {
  return jar[name];
}

// --- Helpers ---
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
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
  return String(slug || "unknown").toLowerCase().replace(/[^a-z0-9\-]+/g, "_");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function loadState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
    } catch {}
  }
  return { processed: [] };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function httpGet(url, headers = {}) {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      Cookie: cookieHeader(),
      ...headers,
    },
    redirect: "manual",
  });
  setCookiesFromResponse(res);
  return res;
}

async function httpPost(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      Cookie: cookieHeader(),
      ...headers,
    },
    body,
    redirect: "manual",
  });
  setCookiesFromResponse(res);
  return res;
}

// --- 1) Get CSRF cookie then login like the site form ---
async function login() {
  // Prime cookies & get csrftoken
  const res1 = await httpGet(BASE);
  const csrf = getCookie("csrftoken");
  if (!csrf) {
    throw new Error("Could not get csrftoken.");
  }

  // Form login (same as website)
  const form = new URLSearchParams();
  form.set("login", USERNAME);
  form.set("password", PASSWORD);
  form.set("csrfmiddlewaretoken", csrf);
  form.set("next", "/");

  const res2 = await httpPost(LOGIN_URL, form, {
    Referer: LOGIN_URL,
    Origin: BASE,
    "Content-Type": "application/x-www-form-urlencoded",
    "X-CSRFToken": csrf,
  });

  // A successful login often 302-redirects; we already captured cookies
  const session = getCookie("LEETCODE_SESSION");
  if (!session) {
    throw new Error("Login failed (no LEETCODE_SESSION). Check credentials / 2FA.");
  }
}

// --- 2) GraphQL helper ---
async function graphQL(query, variables = {}, operationName = undefined) {
  const csrf = getCookie("csrftoken") || "";
  const res = await httpPost(
    GRAPHQL_URL,
    JSON.stringify({ query, variables, operationName }),
    {
      "Content-Type": "application/json",
      "X-CSRFToken": csrf,
      Referer: BASE,
    }
  );
  if (res.status === 403) {
    throw new Error("403 from LeetCode (blocked). Try later or add delays.");
  }
  const data = await res.json();
  if (data.errors) {
    throw new Error("GraphQL errors: " + JSON.stringify(data.errors));
  }
  return data.data;
}

// --- 3) Fetch recent AC submissions (ids, slugs, titles, timestamps) ---
async function fetchRecentAC(limit = MAX_RECENT) {
  const query = `
    query recentAcSubmissions($limit: Int!) {
      recentAcSubmissionList(limit: $limit) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;
  const data = await graphQL(query, { limit });
  return data.recentAcSubmissionList || [];
}

// --- 4) For each id, fetch submission details (code/lang) ---
async function fetchSubmissionDetails(submissionId) {
  const query = `
    query submissionDetails($submissionId: Int!) {
      submissionDetails(submissionId: $submissionId) {
        id
        code
        language
        question {
          title
          titleSlug
          questionId
        }
      }
    }
  `;
  const data = await graphQL(query, { submissionId: Number(submissionId) });
  return data.submissionDetails;
}

// --- 5) Fetch question info to get difficulty (and ensure id) ---
async function fetchQuestion(titleSlug) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        titleSlug
        difficulty
      }
    }
  `;
  const data = await graphQL(query, { titleSlug });
  return data.question;
}

// --- 6) Write files & README ---
function writeSolution({ difficulty, questionId, titleSlug, code, language }) {
  const diff = (difficulty || "Unknown").toLowerCase();
  const dir = path.join(OUTPUT_DIR, diff);
  ensureDir(dir);

  const safeSlug = sanitizeSlug(titleSlug);
  const ext = langToExt(language);
  const fname = `${questionId || "unknown"}_${safeSlug}.${ext}`;
  const fpath = path.join(dir, fname);

  fs.writeFileSync(fpath, code, "utf8");
  return { fpath };
}

function generateReadmeIndex() {
  // Walk OUTPUT_DIR
  const sections = [];
  if (!fs.existsSync(OUTPUT_DIR)) return;

  const diffs = fs.readdirSync(OUTPUT_DIR).filter((d) =>
    fs.statSync(path.join(OUTPUT_DIR, d)).isDirectory()
  );

  sections.push(`# LeetCode Solutions\n`);
  sections.push(`Auto-synced from LeetCode accepted submissions. Folder structure: \`${OUTPUT_DIR}/<difficulty>/<id>_<slug>.<ext>\`\n`);

  diffs.sort().forEach((d) => {
    sections.push(`## ${d[0].toUpperCase()}${d.slice(1)}\n`);
    const files = fs
      .readdirSync(path.join(OUTPUT_DIR, d))
      .filter((f) => f.includes("_"));
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
        const lcLink = `${BASE}/problems/${slug}/`;
        const ghLink = `${OUTPUT_DIR}/${d}/${f}`;
        sections.push(`| [${id}. ${slug.replace(/-/g, " ")}](${lcLink}) | [${f}](${ghLink}) |\n`);
      });
    sections.push("\n");
  });

  fs.writeFileSync("README.md", sections.join(""), "utf8");
}

// --- Main ---
(async () => {
  console.log("Logging in…");
  await login();
  console.log("OK");

  const state = loadState();
  const processed = new Set(state.processed);

  console.log("Fetching recent AC submissions…");
  const recent = await fetchRecentAC(MAX_RECENT);

  let newCount = 0;

  for (const item of recent) {
    const sid = String(item.id);
    if (processed.has(sid)) continue;

    // Be polite (avoid rate-limits)
    await sleep(500);

    const details = await fetchSubmissionDetails(sid);
    if (!details || !details.code) continue;

    const slug = details.question?.titleSlug || item.titleSlug;
    const q = await fetchQuestion(slug);

    const payload = {
      difficulty: q?.difficulty || "Unknown",
      questionId: q?.questionId || "unknown",
      titleSlug: slug,
      code: details.code,
      language: details.language,
    };

    const { fpath } = writeSolution(payload);
    console.log("Saved:", fpath);

    processed.add(sid);
    newCount++;
  }

  // Save updated state & README
  saveState({ processed: Array.from(processed) });
  generateReadmeIndex();

  console.log(`Done. New solutions this run: ${newCount}`);
})().catch((err) => {
  console.error("FAILED:", err.message);
  process.exit(1);
});
