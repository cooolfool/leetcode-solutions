import fetch from "node-fetch";
import fs from "fs";
import "dotenv/config";
import { LEETCODE_SESSION, PAGE_SIZE, MAX_FETCH, OUTPUT_FILE, BASE_URL, REQUEST_DELAY_MS } from "./config.js";

// -----------------------------------------
if (!LEETCODE_SESSION) {
  console.error("Missing LEETCODE_SESSION in .env file");
  process.exit(1);
}

async function fetchSubmissions() {
  let all = [];
  let offset = 0;
  let page = 1;

  console.log(`Fetching recent accepted submissions (limit: ${MAX_FETCH}, pageSize: ${PAGE_SIZE})…`);

  while (true) {
    const url = `${BASE_URL}?offset=${offset}&limit=${PAGE_SIZE}&lastkey=`;
    console.log(`Page ${page}: offset=${offset}`);

    const res = await fetch(url, {
      headers: {
        Cookie: `LEETCODE_SESSION=${LEETCODE_SESSION};`,
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (res.status === 403) {
      console.error("403 Forbidden – check if LEETCODE_SESSION is valid");
      process.exit(1);
    }

    const data = await res.json();

    // filter only Accepted
    const accepted = data.submissions_dump.filter((s) => s.status_display === "Accepted");
    all.push(...accepted);

    if (!data.has_next || all.length >= MAX_FETCH) break;

    offset += PAGE_SIZE;
    page++;
    await new Promise((r) => setTimeout(r, REQUEST_DELAY_MS));
  }

  console.log(`Done. Total accepted submissions fetched: ${all.length}`);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(all, null, 2));
  console.log(`Saved to ${OUTPUT_FILE}`);
}

fetchSubmissions().catch((err) => {
  console.error("Error fetching submissions:", err.message);
  process.exit(1);
});
