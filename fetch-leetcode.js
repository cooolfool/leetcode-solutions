const { SYNC_POLL_SECONDS, MAX_RECENT, USERNAME } = require("./src/config");
const { login } = require("./src/login");
const { fetchSignedInUsername, fetchRecentAC, fetchSubmissionDetails, fetchQuestion } = require("./src/graphql");
const { fetchRecentAcceptedViaRest, fetchSubmissionDetailsViaRest } = require("./src/rest");
const { loadState, saveState } = require("./src/state");
const { writeSolution, generateReadmeIndex } = require("./src/files");
const { commitAndPush } = require("./src/git");
const { sleep } = require("./src/utils");

async function runOnce() {
  console.log("Logging in…");
  await login();
  console.log("OK");

  let username = USERNAME;
  if (!username) {
    username = await fetchSignedInUsername();
  }
  if (!username) {
    throw new Error("Could not determine username for recent submissions. Set LEETCODE_USERNAME or provide valid cookies.");
  }
  console.log(`Using username: ${username}`);

  const state = loadState();
  const processed = new Set(state.processed);

  console.log("Fetching recent AC submissions…");
  let recent = [];
  try {
    recent = await fetchRecentAC(MAX_RECENT, username);
  } catch (e) {
    console.log("GraphQL recent list failed, falling back to REST:", e.message);
  }
  if (!Array.isArray(recent) || recent.length === 0) {
    console.log("Falling back to /api/submissions/…");
    recent = await fetchRecentAcceptedViaRest(MAX_RECENT);
  }

  let newCount = 0;

  for (const item of recent) {
    const sid = String(item.id);
    if (processed.has(sid)) continue;
    await sleep(500);

    let details = null;
    try {
      details = await fetchSubmissionDetails(sid);
    } catch (e) {
      console.warn(`GraphQL submissionDetails failed for ${sid}:`, e.message);
    }
    if (!details || !details.code) {
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
