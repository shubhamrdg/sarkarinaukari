import axios from "axios";
import {
  MAX_RETRIES,
  REQUEST_DELAY_MS,
  REQUEST_TIMEOUT_MS,
  USER_AGENT
} from "./config.js";

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export function createHttpClient() {
  let nextRequestAt = 0;

  return async function fetchHtml(url) {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
      const waitTime = Math.max(0, nextRequestAt - Date.now());
      if (waitTime > 0) {
        await sleep(waitTime);
      }
      nextRequestAt = Date.now() + REQUEST_DELAY_MS;

      try {
        const response = await axios.get(url, {
          headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
          timeout: REQUEST_TIMEOUT_MS,
          responseType: "text",
          validateStatus: (status) => status >= 200 && status < 400
        });
        return response.data;
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          throw new Error(`Request failed for ${url}: ${error.message}`);
        }
        await sleep(REQUEST_DELAY_MS * attempt);
      }
    }

    throw new Error(`Request failed for ${url}`);
  };
}

export async function mapWithConcurrency(items, concurrency, callback) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await callback(items[index], index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}
