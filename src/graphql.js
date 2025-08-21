const { GRAPHQL_URL, BASE, MAX_RECENT } = require("./config");
const { httpPost, httpGet } = require("./http");
const { getCookie } = require("./cookies");

async function graphQL(query, variables = {}, operationName = undefined) {
  const csrf = getCookie("csrftoken") || "";
  const res = await httpPost(
    GRAPHQL_URL,
    JSON.stringify({ query, variables, operationName }),
    {
      "Content-Type": "application/json",
      "X-CSRFToken": csrf,
      Referer: BASE,
    }
  );
  if (res.status === 403) {
    throw new Error("403 from LeetCode (blocked). Try later or add delays.");
  }
  const data = await res.json();
  if (data.errors) {
    throw new Error("GraphQL errors: " + JSON.stringify(data.errors));
  }
  return data.data;
}

async function fetchSignedInUsername() {
  const query = `
    query globalData {
      userStatus {
        username
        isSignedIn
        userSlug
      }
    }
  `;
  const data = await graphQL(query, {});
  return data?.userStatus?.username || null;
}

async function fetchRecentAC(username, totalLimit = MAX_RECENT, pageSize = 20) {
  let allSubs = [];
  let page = 0;

  while (allSubs.length < totalLimit) {
    const data = await graphQL(
      `
      query recentAcSubmissions($limit: Int!, $skip: Int!, $username: String!) {
        recentAcSubmissionList(limit: $limit, skip: $skip, username: $username) {
          id
          title
          titleSlug
          timestamp
        }
      }
      `,
      { limit: pageSize, skip: page * pageSize, username }
    );

    const subs = data.recentAcSubmissionList || [];
    allSubs.push(...subs);

    if (subs.length < pageSize) break; // no more submissions
    page++;
  }

  return allSubs.slice(0, totalLimit);
}


async function fetchSubmissionDetails(submissionId) {
  const query = `
    query submissionDetails($submissionId: Int!) {
      submissionDetails(submissionId: $submissionId) {
        id
        code
        lang {
          name
        }
        question {
          title
          titleSlug
          questionId
        }
      }
    }
  `;
  const data = await graphQL(query, { submissionId: Number(submissionId) });
  return data.submissionDetails;
}

async function fetchQuestion(titleSlug) {
  const query = `
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        questionFrontendId
        title
        titleSlug
        difficulty
      }
    }
  `;
  const data = await graphQL(query, { titleSlug });
  return data.question;
}

module.exports = {
  graphQL,
  fetchSignedInUsername,
  fetchRecentAC,
  fetchSubmissionDetails,
  fetchQuestion,
};


