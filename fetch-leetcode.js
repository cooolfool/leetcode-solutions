import fs from "fs";
import "dotenv/config";
import { writeSolution, generateReadmeIndex } from "./src/writer.js";
import {
  BASE_URL,
  SUBMISSIONS_URL,
  PAGE_SIZE,
  MAX_RECENT,
  OUTPUT_ROOT,
  REQUEST_DELAY_MS,
  COOKIE_SESSION,
} from "./src/config.js";


const OUTPUT_FILE = `${OUTPUT_ROOT}/submissions.json`;

// -----------------------------------------
if (!COOKIE_SESSION) {
  console.error("Missing LEETCODE_SESSION in .env file");
  process.exit(1);
}

async function fetchSubmissions() {
  let all = [];
  let offset = 0;
  let page = 1;

  console.log(
    `Fetching recent accepted submissions (limit: ${MAX_RECENT}, pageSize: ${PAGE_SIZE})…`
  );

  while (true) {
    const url = `${SUBMISSIONS_URL}?offset=${offset}&limit=${PAGE_SIZE}&lastkey=`;
    console.log(`Page ${page}: offset=${offset}`);

    const res = await fetch(url, {
      headers: {
        Cookie: `LEETCODE_SESSION=${COOKIE_SESSION};`,
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (res.status === 403) {
      console.error("403 Forbidden – check if LEETCODE_SESSION is valid");
      process.exit(1);
    }

    const data = await res.json();

    // filter only Accepted
    const accepted = data.submissions_dump.filter(
      (s) => s.status_display === "Accepted"
    );
    all.push(...accepted);

    if (!data.has_next || all.length >= MAX_RECENT) break;

    offset += PAGE_SIZE;
    page++;
    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
  }

  console.log(`Done. Total accepted submissions fetched: ${all.length}`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(all, null, 2));
  console.log(`Saved to ${OUTPUT_FILE}`);
  console.log("Organizing solutions into folders…");

for (const s of all) {
  try {
    writeSolution({
  difficulty: s?.meta?.difficulty || s?.difficulty || "Unknown",
  questionId: s?.id || s?.question_id,
  titleSlug: s?.title_slug || s?.titleSlug,
  code: s?.code,
  language: s?.lang,
});
  } catch (err) {
    console.error("Failed to write solution:", s?.title_slug, err.message);
  }
}

generateReadmeIndex();
console.log("README.md updated with index");
}

fetchSubmissions().catch((err) => {
  console.error("Error fetching submissions:", err.message);
  process.exit(1);
});
