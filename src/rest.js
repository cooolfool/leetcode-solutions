const { BASE } = require("./config");
const { httpGet } = require("./http");

async function fetchRecentAcceptedViaRest(limit = 200, pageSize = 20) {
  if (limit <= 0) return [];

  const accepted = [];
  let lastKey = "";
  let hasNext = true;

  const seenSubmissionIds = new Set(); 
  const seenPageKeys = new Set();     

  while (accepted.length < limit && hasNext) {
    const url = `${BASE}/api/submissions/?offset=0&limit=${pageSize}&lastkey=${encodeURIComponent(lastKey)}`;
    const res = await httpGet(url, { Referer: BASE });

    if (!res.ok) {
      throw new Error(`Failed to fetch submissions: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const list = Array.isArray(data?.submissions_dump) ? data.submissions_dump : [];

    for (const s of list) {
      const isAC = s?.status_display === "Accepted" || s?.statusDisplay === "Accepted";
      if (isAC && s?.id != null) {
        const id = String(s.id);
        if (!seenSubmissionIds.has(id)) {
          accepted.push({
            id,
            title: s.title,
            titleSlug: s.title_slug || s.titleSlug,
            timestamp: Number(s.timestamp || s.time || 0),
          });
          seenSubmissionIds.add(id);
          if (accepted.length >= limit) break;
        }
      }
    }

    hasNext = Boolean(data?.has_next ?? data?.hasNext);
    const nextKey = data?.last_key || data?.lastKey || "";

    if (!hasNext || !nextKey || seenPageKeys.has(nextKey)) break;

    seenPageKeys.add(nextKey);
    lastKey = nextKey;

   
    await new Promise(r => setTimeout(r, 150));
  }

  return accepted.slice(0, limit);
}


async function fetchSubmissionDetailsViaRest(titleSlug, submissionId, pageSize = 20) {
  let lastKey = "";
  const seenKeys = new Set();

  while (true) {
    const url = `${BASE}/api/submissions/${titleSlug}/?offset=0&limit=${pageSize}&lastkey=${encodeURIComponent(lastKey)}`;
    const res = await httpGet(url, { Referer: `${BASE}/problems/${titleSlug}/` });

    if (!res.ok) {
      throw new Error(`Failed to fetch submission ${submissionId}: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const list = Array.isArray(data?.submissions_dump) ? data.submissions_dump : [];

   
    const found = list.find((s) => String(s?.id) === String(submissionId));
    if (found) {
      return {
        id: String(found.id),
        code: found.code,
        lang: { name: found.lang },
        question: {
          title: found.title,
          titleSlug,
          questionId: found.qid || found.question_id || null,
        },
      };
    }

  
    const hasNext = Boolean(data?.has_next ?? data?.hasNext);
    const nextKey = data?.last_key || data?.lastKey || "";

    if (!hasNext || !nextKey || seenKeys.has(nextKey)) {
      return null; 
    }

    seenKeys.add(nextKey);
    lastKey = nextKey;

    await new Promise((r) => setTimeout(r, 150)); // avoid rate limits
  }
}


module.exports = { fetchRecentAcceptedViaRest, fetchSubmissionDetailsViaRest };


