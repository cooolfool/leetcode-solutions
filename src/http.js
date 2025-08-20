const { cookieHeader, setCookiesFromResponse } = require("./cookies");

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

module.exports = { httpGet, httpPost };


