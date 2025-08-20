const { BASE, LOGIN_URL, USERNAME, PASSWORD } = require("./config");
const { httpGet, httpPost } = require("./http");
const { getCookie, setCookie, prefillCookiesFromEnv } = require("./cookies");

async function login() {
  // Prefer cookie-based auth if provided
  prefillCookiesFromEnv();
  if (getCookie("LEETCODE_SESSION")) {
    // Ensure we have csrftoken as well
    await httpGet(BASE);
    if (!getCookie("csrftoken")) {
      await httpGet(LOGIN_URL);
      if (!getCookie("csrftoken")) {
        throw new Error(
          "Cookie-based auth: missing csrftoken. Provide LEETCODE_CSRFTOKEN or LEETCODE_COOKIES."
        );
      }
    }
    return;
  }

  // Fallback to username/password if available
  if (!USERNAME || !PASSWORD) {
    throw new Error(
      "No cookies provided and no credentials present. Set LEETCODE_SESSION and LEETCODE_CSRFTOKEN (or LEETCODE_COOKIES)."
    );
  }

  // Priming for csrftoken
  await httpGet(BASE);
  const csrf = getCookie("csrftoken");
  if (!csrf) {
    throw new Error("Could not get csrftoken.");
  }

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

  const session = getCookie("LEETCODE_SESSION");
  if (!session) {
    throw new Error("Login failed (no LEETCODE_SESSION). Check credentials / 2FA.");
  }
}

module.exports = { login };


