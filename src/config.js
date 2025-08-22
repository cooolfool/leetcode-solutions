import fs from "fs";
import path from "path";

export const BASE_URL = "https://leetcode.com";
export const LOGIN_URL = `${BASE_URL}/accounts/login/`;
export const SUBMISSIONS_URL = `${BASE_URL}/api/submissions/`;

export const OUTPUT_ROOT = ".";
export const STATE_FILE = "last_sync.json";

export const MAX_RECENT = Number(process.env.MAX_RECENT || 2000);
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 20);
export const SYNC_POLL_SECONDS = Number(process.env.SYNC_POLL_SECONDS || 0);

export const REQUEST_DELAY_MS = Number(process.env.REQUEST_DELAY_MS || 1500);

export const GIT_REMOTE = process.env.GIT_REMOTE || "origin";
export const GIT_BRANCH = process.env.GIT_BRANCH || "main";

export const USERNAME = process.env.LEETCODE_USERNAME;
export const PASSWORD = process.env.LEETCODE_PASSWORD;
export const COOKIE_STRING = process.env.LEETCODE_COOKIES;
export const COOKIE_SESSION = process.env.LEETCODE_SESSION;
export const COOKIE_CSRF = process.env.LEETCODE_CSRFTOKEN || process.env.LEETCODE_CSRF;
