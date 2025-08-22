const fs = require("fs");
const path = require("path");

// Base URLs
const BASE_URL = "https://leetcode.com";
const LOGIN_URL = `${BASE}/accounts/login/`;
const SUBMISSIONS_URL = `${BASE}/api/submissions/`;

const OUTPUT_ROOT = "."; // repo root
const STATE_FILE = "last_sync.json";

// Tuning
const MAX_RECENT = Number(process.env.MAX_RECENT || 2000);   // max number of submissions to fetch
const PAGE_SIZE = Number(process.env.PAGE_SIZE || 20);       // number of submissions per page
const SYNC_POLL_SECONDS = Number(process.env.SYNC_POLL_SECONDS || 0);

// Request delay
const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 1500); // milliseconds

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
  BASE_URL,
  LOGIN_URL,
  SUBMISSIONS_URL,
  OUTPUT_ROOT,
  STATE_FILE,
  MAX_RECENT,
  PAGE_SIZE,
  SYNC_POLL_SECONDS,
  REQUEST_DELAY_MS,
  GIT_REMOTE,
  GIT_BRANCH,
  USERNAME,
  PASSWORD,
  COOKIE_STRING,
  COOKIE_SESSION,
  COOKIE_CSRF,
};
