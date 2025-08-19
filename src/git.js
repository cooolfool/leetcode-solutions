const { execSync } = require("child_process");
const { GIT_BRANCH, GIT_REMOTE } = require("./config");

function tryGit(cmd) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (e) {
    return null;
  }
}

function commitAndPush(newCount) {
  const inRepo = tryGit("git rev-parse --is-inside-work-tree");
  if (inRepo !== "true") return;

  tryGit("git add -A");

  const msg = `sync: add ${newCount} LeetCode solution${newCount === 1 ? "" : "s"}`;
  const commitOut = tryGit(`git commit -m "${msg}"`);
  if (!commitOut) return;

  const currentBranch = tryGit("git rev-parse --abbrev-ref HEAD") || GIT_BRANCH;
  const branch = GIT_BRANCH || currentBranch;
  tryGit(`git push ${GIT_REMOTE} ${branch}`);
}

module.exports = { commitAndPush };


