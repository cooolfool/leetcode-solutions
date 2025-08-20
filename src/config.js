const fs = require("fs");
const path = require("path");

// Load .env from project root if present
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

// Base URLs
const BASE = "https://leetcode.com";
const LOGIN_URL = `${BASE}/accounts/login/`;
const GRAPHQL_URL = `${BASE}/graphql`;

// Output
const OUTPUT_ROOT = "."; // repo root
const STATE_FILE = "last_sync.json";

// Tuning
const MAX_RECENT = Number(process.env.MAX_RECENT || 100);
const SYNC_POLL_SECONDS = Number(process.env.SYNC_POLL_SECONDS || 0);

// Git
const GIT_REMOTE = process.env.GIT_REMOTE || "origin";
const GIT_BRANCH = process.env.GIT_BRANCH || "main";

// Credentials / Cookies
const USERNAME = process.env.LEETCODE_USERNAME;
const PASSWORD = process.env.LEETCODE_PASSWORD;
const COOKIE_STRING = process.env.LEETCODE_COOKIES;
const COOKIE_SESSION = process.env.LEETCODE_SESSION;
const COOKIE_CSRF = process.env.LEETCODE_CSRFTOKEN || process.env.LEETCODE_CSRF;

module.exports = {
  BASE,
  LOGIN_URL,
  GRAPHQL_URL,
  OUTPUT_ROOT,
  STATE_FILE,
  MAX_RECENT,
  SYNC_POLL_SECONDS,
  GIT_REMOTE,
  GIT_BRANCH,
  USERNAME,
  PASSWORD,
  COOKIE_STRING,
  COOKIE_SESSION,
  COOKIE_CSRF,
};


