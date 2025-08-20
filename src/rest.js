const { BASE } = require("./config");
const { httpGet } = require("./http");

async function fetchRecentAcceptedViaRest(limit) {
  let offset = 0;
  const pageSize = Math.min(50, limit);
  const accepted = [];
  let hasNext = true;
  let lastKey = "";

  while (accepted.length < limit && hasNext !== false) {
    const url = `${BASE}/api/submissions/?offset=${offset}&limit=${pageSize}&lastkey=${encodeURIComponent(
      lastKey || ""
    )}`;
    const res = await httpGet(url, { Referer: BASE });
    if (res.status !== 200) break;
    const data = await res.json();
    const list = Array.isArray(data?.submissions_dump)
      ? data.submissions_dump
      : [];
    list.forEach((s) => {
      if (
        s &&
        (s.status_display === "Accepted" || s.statusDisplay === "Accepted") &&
        typeof s.id !== "undefined"
      ) {
        accepted.push({
          id: String(s.id),
          title: s.title,
          titleSlug: s.title_slug || s.titleSlug,
          timestamp: s.timestamp || s.time || 0,
        });
      }
    });
    hasNext = Boolean(data?.has_next ?? data?.hasNext);
    lastKey = data?.last_key || data?.lastKey || "";
    if (!hasNext) break;
    offset += pageSize;
  }

  const seen = new Set();
  const unique = accepted.filter((x) =>
    seen.has(x.id) ? false : (seen.add(x.id), true)
  );
  return unique.slice(0, limit);
}

async function fetchSubmissionDetailsViaRest(titleSlug, submissionId) {
  let offset = 0;
  const pageSize = 20;
  let lastKey = "";
  while (true) {
    const url = `${BASE}/api/submissions/${titleSlug}/?offset=${offset}&limit=${pageSize}&lastkey=${encodeURIComponent(
      lastKey || ""
    )}`;
    const res = await httpGet(url, { Referer: `${BASE}/problems/${titleSlug}/` });
    if (res.status !== 200) return null;
    const data = await res.json();
    const list = Array.isArray(data?.submissions_dump)
      ? data.submissions_dump
      : [];
    const found = list.find((s) => String(s?.id) === String(submissionId));
    if (found) {
      return {
        id: String(found.id),
        code: found.code,
        lang: { name: found.lang },
        question: {
          title: found.title,
          titleSlug: titleSlug,
          questionId: found?.qid || found?.question_id || null,
        },
      };
    }
    const hasNext = Boolean(data?.has_next ?? data?.hasNext);
    if (!hasNext) return null;
    lastKey = data?.last_key || data?.lastKey || "";
    offset += pageSize;
  }
}

module.exports = { fetchRecentAcceptedViaRest, fetchSubmissionDetailsViaRest };


