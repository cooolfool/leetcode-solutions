const { BASE } = require("./config");
const { httpGet } = require("./http");

async function fetchRecentAcceptedViaRest(limit = 200, pageSize = 20) {
  console.log(`Fetching recent accepted submissions via REST (limit: ${limit}, pageSize: ${pageSize})…`);

  const accepted = [];
  const seenSubmissionIds = new Set();

  let url = `${BASE}/api/submissions/?offset=0&limit=${pageSize}`;
  let lastKey = null;

  while (accepted.length < limit && url) {
    console.log(`Requesting ${url}`);
    const res = await httpGet(url, { Referer: BASE });
    if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

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

    // update next page URL
    lastKey = data?.last_key || data?.lastKey || null;
    if (lastKey) {
      url = `${BASE}/api/submissions/?lastkey=${encodeURIComponent(lastKey)}&limit=${pageSize}`;
    } else {
      url = null; // no more pages
    }

    await new Promise(r => setTimeout(r, 300)); // be polite
  }

  return accepted.slice(0, limit);
}


async function fetchSubmissionDetailsViaRest(titleSlug, submissionId, pageSize = 20) {
  console.log(`Fetching submission details for ${submissionId} (${titleSlug}) via REST…`);
  let lastKey = "";
  const seenKeys = new Set();

  while (true) {
    const url = `${BASE}/api/submissions/${titleSlug}/?offset=0&limit=${pageSize}&lastkey=${encodeURIComponent(lastKey)}`;
    const res = await httpGet(url, { Referer: `${BASE}/problems/${titleSlug}/` });
    console.log(`Requesting ${url}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch submission ${submissionId}: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const list = Array.isArray(data?.submissions_dump) ? data.submissions_dump : [];

   
    const found = list.find((s) => String(s?.id) === String(submissionId));
    if (found) {
      console.log(`Found submission ${submissionId} (${titleSlug}) via REST.`);
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
    console.log(`No submission ${submissionId} found, trying next page…`);
    await new Promise((r) => setTimeout(r, 150)); // avoid rate limits
  }
}


module.exports = { fetchRecentAcceptedViaRest, fetchSubmissionDetailsViaRest };


