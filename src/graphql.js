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

async function fetchRecentAC(limit, username) {
  const query = `
    query recentAcSubmissions($limit: Int!, $username: String!) {
      recentAcSubmissionList(limit: $limit, username: $username) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;
  const data = await graphQL(query, { limit, username });
  return data.recentAcSubmissionList || [];
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


