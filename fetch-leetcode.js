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
const { execSync } = require("child_process");

// Load .env if present
try {
  const dotenv = require("dotenv");
  const envPath = path.resolve(process.cwd(), ".env");
  const result = dotenv.config(fs.existsSync(envPath) ? { path: envPath } : {});
  if (result && result.error) {
    console.warn("Warning: .env not loaded:", result.error.message);
  }
} catch (e) {
  console.warn('Warning: "dotenv" not installed; env will only come from the shell.');
}

// Polyfill fetch for older Node versions using undici (if needed)
try {
  if (typeof fetch === "undefined") {
    const undici = require("undici");
    globalThis.fetch = undici.fetch;
    globalThis.Headers = undici.Headers;
    globalThis.Request = undici.Request;
    globalThis.Response = undici.Response;
  }
} catch {}

// --- Config ---
const BASE = "https://leetcode.com";
const LOGIN_URL = `${BASE}/accounts/login/`;
const GRAPHQL_URL = `${BASE}/graphql`;
// Output at repo root using difficulty directories per requirement
const OUTPUT_ROOT = ".";
const STATE_FILE = "last_sync.json";
const MAX_RECENT = Number(process.env.MAX_RECENT || 50); // how many recent ACs to pull each run

// Git config (optional overrides via env)
const GIT_REMOTE = process.env.GIT_REMOTE || "origin";
const GIT_BRANCH = process.env.GIT_BRANCH || "main";
const SYNC_POLL_SECONDS = Number(process.env.SYNC_POLL_SECONDS || 0);

// Env
const USERNAME = process.env.LEETCODE_USERNAME;
const PASSWORD = process.env.LEETCODE_PASSWORD;
const COOKIE_STRING = process.env.LEETCODE_COOKIES; // full Cookie header (optional)
const COOKIE_SESSION = process.env.LEETCODE_SESSION; // value for LEETCODE_SESSION cookie (optional)
const COOKIE_CSRF = process.env.LEETCODE_CSRFTOKEN || process.env.LEETCODE_CSRF; // value for csrftoken (optional)

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

function setCookie(name, value) {
  if (name && typeof value === "string" && value.length > 0) {
    jar[name] = value;
  }
}

function prefillCookiesFromEnv() {
  if (COOKIE_STRING) {
    // Parse k=v; k2=v2; ...
    COOKIE_STRING.split(";").forEach((pair) => {
      const [k, ...rest] = pair.trim().split("=");
      const v = rest.join("=");
      if (k && v) setCookie(k, v);
    });
  }
  if (COOKIE_SESSION) setCookie("LEETCODE_SESSION", COOKIE_SESSION);
  if (COOKIE_CSRF) setCookie("csrftoken", COOKIE_CSRF);
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
  // Use underscores as separators per requirement (e.g., two_sum)
  return String(slug || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_");
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
  // Prefer cookie-based auth if provided
  prefillCookiesFromEnv();
  if (getCookie("LEETCODE_SESSION")) {
    // Verify we can access BASE and have/retain csrftoken
    await httpGet(BASE);
    if (!getCookie("csrftoken")) {
      // Try to fetch a page to obtain csrftoken if missing
      const res = await httpGet(LOGIN_URL);
      if (!getCookie("csrftoken")) {
        throw new Error(
          "Cookie-based auth: missing csrftoken. Provide LEETCODE_CSRFTOKEN or LEETCODE_COOKIES."
        );
      }
    }
    return; // cookie mode OK
  }

  // Fallback to username/password if available
  if (!USERNAME || !PASSWORD) {
    throw new Error(
      "No cookies provided and no credentials present. Set LEETCODE_SESSION and LEETCODE_CSRFTOKEN (or LEETCODE_COOKIES)."
    );
  }

  // Prime cookies & get csrftoken via GET
  await httpGet(BASE);
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

  await httpPost(LOGIN_URL, form, {
    Referer: LOGIN_URL,
    Origin: BASE,
    "Content-Type": "application/x-www-form-urlencoded",
    "X-CSRFToken": csrf,
  });

  // A successful login often 302-redirects; we already captured cookies
  const session = getCookie("LEETCODE_SESSION");
  if (!session) {
    throw new Error(
      "Login failed (no LEETCODE_SESSION). Check credentials / 2FA."
    );
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

// --- 3) Fetch current signed-in user if username is not provided ---
async function fetchSignedInUsername() {
  const query = `
    query globalData {
      userStatus {
        username
        isSignedIn
        userSlug
      }
    }
  `;
  const data = await graphQL(query, {});
  return data?.userStatus?.username || null;
}

// --- 4) Fetch recent AC submissions (ids, slugs, titles, timestamps) ---
async function fetchRecentAC(limit = MAX_RECENT, username) {
  const query = `
    query recentAcSubmissions($limit: Int!, $username: String!) {
      recentAcSubmissionList(limit: $limit, username: $username) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;
  const data = await graphQL(query, { limit, username });
  return data.recentAcSubmissionList || [];
}

// --- 4b) REST fallback: /api/submissions/ for the signed-in user ---
async function fetchRecentAcceptedViaRest(limit = MAX_RECENT) {
  // This endpoint returns the current user's recent submissions
  // Example response includes { submissions_dump: [...], has_next: boolean, last_key: string|null }
  let offset = 0;
  const pageSize = Math.min(50, limit);
  const accepted = [];
  let hasNext = true;
  let lastKey = "";

  while (accepted.length < limit && hasNext !== false) {
    const url = `${BASE}/api/submissions/?offset=${offset}&limit=${pageSize}&lastkey=${encodeURIComponent(
      lastKey || ""
    )}`;
    const res = await httpGet(url, { Referer: BASE });
    if (res.status !== 200) break;
    const data = await res.json();
    const list = Array.isArray(data?.submissions_dump)
      ? data.submissions_dump
      : [];
    list.forEach((s) => {
      if (
        s &&
        (s.status_display === "Accepted" || s.statusDisplay === "Accepted") &&
        typeof s.id !== "undefined"
      ) {
        accepted.push({
          id: String(s.id),
          title: s.title,
          titleSlug: s.title_slug || s.titleSlug,
          timestamp: s.timestamp || s.time || 0,
        });
      }
    });
    hasNext = Boolean(data?.has_next ?? data?.hasNext);
    lastKey = data?.last_key || data?.lastKey || "";
    if (!hasNext) break;
    offset += pageSize;
  }

  // De-dup and slice to limit
  const seen = new Set();
  const unique = accepted.filter((x) =>
    seen.has(x.id) ? false : (seen.add(x.id), true)
  );
  return unique.slice(0, limit);
}

// --- 5) For each id, fetch submission details (code/lang) ---
async function fetchSubmissionDetails(submissionId) {
  const query = `
    query submissionDetails($submissionId: Int!) {
      submissionDetails(submissionId: $submissionId) {
        id
        code
        lang {
          name
        }
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

// --- 5b) REST fallback to fetch specific submission code via problem API ---
async function fetchSubmissionDetailsViaRest(titleSlug, submissionId) {
  let offset = 0;
  const pageSize = 20;
  let lastKey = "";
  while (true) {
    const url = `${BASE}/api/submissions/${titleSlug}/?offset=${offset}&limit=${pageSize}&lastkey=${encodeURIComponent(
      lastKey || ""
    )}`;
    const res = await httpGet(url, {
      Referer: `${BASE}/problems/${titleSlug}/`,
    });
    if (res.status !== 200) return null;
    const data = await res.json();
    const list = Array.isArray(data?.submissions_dump)
      ? data.submissions_dump
      : [];
    const found = list.find((s) => String(s?.id) === String(submissionId));
    if (found) {
      return {
        id: String(found.id),
        code: found.code,
        // normalize: found.lang sometimes like "python3" or "cpp"
        lang: { name: found.lang },
        question: {
          title: found.title,
          titleSlug: titleSlug,
          questionId: found?.qid || found?.question_id || null,
        },
      };
    }
    const hasNext = Boolean(data?.has_next ?? data?.hasNext);
    if (!hasNext) return null;
    lastKey = data?.last_key || data?.lastKey || "";
    offset += pageSize;
  }
}

// --- 6) Fetch question info to get difficulty (and ensure id) ---
async function fetchQuestion(titleSlug) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        difficulty
      }
    }
  `;
  const data = await graphQL(query, { titleSlug });
  return data.question;
}

// --- 7) Write files & README ---
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
      (d) =>
        fs.existsSync(path.join(OUTPUT_ROOT, d)) &&
        fs.statSync(path.join(OUTPUT_ROOT, d)).isDirectory()
    );
  // focus on commonly used difficulties only
  const allowed = new Set(["easy", "medium", "hard"]);
  return all.filter((d) => allowed.has(d.toLowerCase())).sort();
}

function generateReadmeIndex() {
  // Walk difficulty dirs at repo root
  const sections = [];
  const diffs = listDifficultyDirs();

  sections.push(`# LeetCode Solutions\n`);
  sections.push(
    `Auto-synced from LeetCode accepted submissions. Folder structure: \`<difficulty>/<id>_<slug>.<ext>\` (e.g. \`easy/1_two-sum.py\`).\n`
  );

  diffs.sort().forEach((d) => {
    sections.push(`## ${d[0].toUpperCase()}${d.slice(1)}\n`);
    const files = fs
      .readdirSync(path.join(OUTPUT_ROOT, d))
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
        const urlSlug = slug.replace(/_/g, "-");
        const lcLink = `${BASE}/problems/${urlSlug}/`;
        const ghLink = `${d}/${f}`;
        sections.push(
          `| [${id}. ${slug.replace(
            /[-_]/g,
            " "
          )}](${lcLink}) | [${f}](${ghLink}) |\n`
        );
      });
    sections.push("\n");
  });

  fs.writeFileSync("README.md", sections.join(""), "utf8");
}

function tryGit(cmd) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (e) {
    return null;
  }
}

function commitAndPush(newCount) {
  // Ensure inside a git repo
  const inRepo = tryGit("git rev-parse --is-inside-work-tree");
  if (inRepo !== "true") return;

  // Stage changes
  tryGit("git add -A");

  // Commit; if nothing to commit, skip
  const msg = `sync: add ${newCount} LeetCode solution${
    newCount === 1 ? "" : "s"
  }`;
  const commitOut = tryGit(`git commit -m "${msg}"`);
  if (!commitOut) return; // likely nothing to commit

  // Determine branch
  const currentBranch = tryGit("git rev-parse --abbrev-ref HEAD") || GIT_BRANCH;
  const branch = GIT_BRANCH || currentBranch;

  // Push
  tryGit(`git push ${GIT_REMOTE} ${branch}`);
}

// --- Main ---
async function runOnce() {
  console.log("Logging in…");
  await login();
  console.log("OK");

  // Determine username for recent submissions
  let username = USERNAME;
  if (!username) {
    username = await fetchSignedInUsername();
  }
  if (!username) {
    throw new Error(
      "Could not determine username for recent submissions. Set LEETCODE_USERNAME or provide valid cookies."
    );
  }
  console.log(`Using username: ${username}`);

  const state = loadState();
  const processed = new Set(state.processed);

  console.log("Fetching recent AC submissions…");
  let recent = [];
  try {
    recent = await fetchRecentAC(MAX_RECENT, username);
  } catch (e) {
    console.warn(
      "GraphQL recent list failed, falling back to REST:",
      e.message
    );
  }
  if (!Array.isArray(recent) || recent.length === 0) {
    console.log("Falling back to /api/submissions/…");
    recent = await fetchRecentAcceptedViaRest(MAX_RECENT);
  }

  let newCount = 0;

  for (const item of recent) {
    const sid = String(item.id);
    if (processed.has(sid)) continue;

    // Be polite (avoid rate-limits)
    await sleep(500);

    let details = null;
    try {
      details = await fetchSubmissionDetails(sid);
    } catch (e) {
      console.warn(`GraphQL submissionDetails failed for ${sid}:`, e.message);
    }
    if (!details || !details.code) {
      // Fallback via REST problem submissions API
      const rest = await fetchSubmissionDetailsViaRest(item.titleSlug, sid);
      if (!rest || !rest.code) continue;
      details = rest;
    }

    const slug = details.question?.titleSlug || item.titleSlug;
    const q = await fetchQuestion(slug);

    const payload = {
      difficulty: q?.difficulty || "Unknown",
      questionId: q?.questionFrontendId || q?.questionId || "unknown",
      titleSlug: slug,
      code: details.code,
      language: details.language || details.lang?.name || details.lang,
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

  if (newCount > 0) {
    console.log("Committing and pushing changes…");
    commitAndPush(newCount);
  }
}

(async () => {
  if (SYNC_POLL_SECONDS > 0) {
    // Poll loop
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        await runOnce();
      } catch (err) {
        console.error("FAILED:", err.message);
      }
      const delayMs = Math.max(5, SYNC_POLL_SECONDS) * 1000;
      console.log(`Sleeping ${Math.floor(delayMs / 1000)}s…`);
      await sleep(delayMs);
    }
  } else {
    await runOnce();
  }
})().catch((err) => {
  console.error("FAILED:", err.message);
  process.exit(1);
});
