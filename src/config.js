const fs = require("fs");
const path = require("path");

// Load .env from project root if present
//try {
//  const dotenv = require("dotenv");
//  const envPath = path.resolve(process.cwd(), ".env");
//  const result = dotenv.config(fs.existsSync(envPath) ? { path: envPath } : {});
//  if (result && result.error) {
//    console.warn("Warning: .env not loaded:", result.error.message);
//  }
//} catch (e) {
//  console.warn('Warning: "dotenv" not installed; env will only come from the shell.');
//}

// Base URLs
const BASE = "https://leetcode.com";
const LOGIN_URL = `${BASE}/accounts/login/`;
const GRAPHQL_URL = `${BASE}/graphql`;

// Output
const OUTPUT_ROOT = "."; // repo root
const STATE_FILE = "last_sync.json";

// Tuning
const MAX_RECENT = Number(20000);
const SYNC_POLL_SECONDS = Number(process.env.SYNC_POLL_SECONDS || 0);
const SLEEP_BETWEEN_SUBMISSIONS_MS = Number(process.env.SLEEP_BETWEEN_SUBMISSIONS_MS || 1500);

// REST / API
const REST_PAGE_SIZE = Number(process.env.REST_PAGE_SIZE || 20);
const REST_SLEEP_BETWEEN_REQUESTS_MS = Number(process.env.REST_SLEEP_BETWEEN_REQUESTS_MS || 1500);
const REST_SLEEP_BETWEEN_PAGES_MS = Number(process.env.REST_SLEEP_BETWEEN_PAGES_MS || 1500);


// Git
const GIT_REMOTE = process.env.GIT_REMOTE || "origin";
const GIT_BRANCH = process.env.GIT_BRANCH || "main";

// Credentials / Cookies
const USERNAME = process.env.LEETCODE_USERNAME;
const PASSWORD = process.env.LEETCODE_PASSWORD;
const COOKIE_STRING = process.env.LEETCODE_COOKIES;
const COOKIE_SESSION = process.env.LEETCODE_SESSION;
const COOKIE_CSRF = process.env.LEETCODE_CSRFTOKEN || process.env.LEETCODE_CSRF;

// File/Folder naming
const SOLUTIONS_DIR = process.env.SOLUTIONS_DIR || path.join(OUTPUT_ROOT, "solutions"); // where solutions are saved
const README_FILE = process.env.README_FILE || path.join(OUTPUT_ROOT, "README.md");

module.exports = {
  BASE,
  LOGIN_URL,
  GRAPHQL_URL,
  OUTPUT_ROOT,
  STATE_FILE,
  MAX_RECENT,
  SYNC_POLL_SECONDS,
  SLEEP_BETWEEN_SUBMISSIONS_MS,
  GIT_REMOTE,
  GIT_BRANCH,
  USERNAME,
  PASSWORD,
  COOKIE_STRING,
  COOKIE_SESSION,
  COOKIE_CSRF,
  SOLUTIONS_DIR,
  README_FILE,
   REST_PAGE_SIZE,
  REST_SLEEP_BETWEEN_REQUESTS_MS,
  REST_SLEEP_BETWEEN_PAGES_MS
};


