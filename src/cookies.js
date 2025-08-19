const { COOKIE_STRING, COOKIE_SESSION, COOKIE_CSRF } = require("./config");

// Simple in-memory cookie jar
const jar = {};

function setCookie(name, value) {
  if (name && typeof value === "string" && value.length > 0) {
    jar[name] = value;
  }
}

function getCookie(name) {
  return jar[name];
}

function cookieHeader() {
  return Object.entries(jar)
    .map(([k, v]) => `${k}=${v}`)
    .join("; ");
}

function setCookiesFromResponse(res) {
  const setCookieHeader = res.headers.get("set-cookie");
  if (!setCookieHeader) return;
  const parts = setCookieHeader.split(/,(?=[^;]+=[^;]+)/g);
  parts.forEach((c) => {
    const [kv] = c.split(";");
    const [k, v] = kv.trim().split("=");
    if (k && v) setCookie(k, v);
  });
}

function prefillCookiesFromEnv() {
  if (COOKIE_STRING) {
    COOKIE_STRING.split(";").forEach((pair) => {
      const [k, ...rest] = pair.trim().split("=");
      const v = rest.join("=");
      if (k && v) setCookie(k, v);
    });
  }
  if (COOKIE_SESSION) setCookie("LEETCODE_SESSION", COOKIE_SESSION);
  if (COOKIE_CSRF) setCookie("csrftoken", COOKIE_CSRF);
}

module.exports = {
  setCookie,
  getCookie,
  cookieHeader,
  setCookiesFromResponse,
  prefillCookiesFromEnv,
};


