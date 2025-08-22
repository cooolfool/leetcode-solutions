// const { cookieHeader, setCookiesFromResponse } = require("./cookies");

// // Polyfill fetch for older Node versions using undici (if needed)
// try {
//   if (typeof fetch === "undefined") {
//     const undici = require("undici");
//     globalThis.fetch = undici.fetch;
//     globalThis.Headers = undici.Headers;
//     globalThis.Request = undici.Request;
//     globalThis.Response = undici.Response;
//   }
// } catch {}

// async function httpGet(url, headers = {}) {
//   const res = await fetch(url, {
//     method: "GET",
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
//       Cookie: cookieHeader(),
//       ...headers,
//     },
//     redirect: "manual",
//   });
//   setCookiesFromResponse(res);
//   return res;
// }

// async function httpPost(url, body, headers = {}) {
//   const res = await fetch(url, {
//     method: "POST",
//     headers: {
//       "User-Agent":
//         "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
//       Cookie: cookieHeader(),
//       ...headers,
//     },
//     body,
//     redirect: "manual",
//   });
//   setCookiesFromResponse(res);
//   return res;
// }

// module.exports = { httpGet, httpPost };


const { cookieHeader, setCookiesFromResponse } = require("./cookies");
const { BASE, COOKIE_CSRF } = require("./config");

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

/**
 * HTTP GET with cookies, CSRF, and optional Referer
 */
async function httpGet(url, headers = {}, refererPath = "") {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      Cookie: cookieHeader(),
      "x-csrftoken": COOKIE_CSRF,
      "Referer": refererPath ? `${BASE}/problems/${refererPath}/` : BASE,
      ...headers,
    },
    redirect: "manual",
  });

  setCookiesFromResponse(res);

  if (res.status === 403) {
    throw new Error(`403 Forbidden: Check session/CSRF token. URL: ${url}`);
  }

  return res;
}

/**
 * HTTP POST with cookies, CSRF, and optional Referer
 */
async function httpPost(url, body, headers = {}, refererPath = "") {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
      Cookie: cookieHeader(),
      "x-csrftoken": COOKIE_CSRF,
      "Referer": refererPath ? `${BASE}/problems/${refererPath}/` : BASE,
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });

  setCookiesFromResponse(res);

  if (res.status === 403) {
    throw new Error(`403 Forbidden: Check session/CSRF token. URL: ${url}`);
  }

  return res;
}

module.exports = { httpGet, httpPost };


