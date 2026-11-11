export const CATEGORY_CONFIG = {
  jobs: { postCategory: "job", path: "/latestjob.php" },
  results: { postCategory: "result", path: "/result.php" },
  "admit-cards": { postCategory: "admit-card", path: "/admitcard.php" },
  "answer-keys": { postCategory: "answer-key", path: "/answerkey.php" },
  syllabus: { postCategory: "syllabus", path: "/syllabus.php" },
  admission: { postCategory: "admission", path: "/admission.php" },
  important: { postCategory: "important", path: "/important.php" }
};

export const DEFAULT_BASE_URL = "https://www.sarkariresult.com";
export const USER_AGENT =
  "SarkariNaukriBot/1.0 (+https://www.sarkarinaukari.com; polite indexer)";
export const REQUEST_TIMEOUT_MS = 15000;
export const MAX_RETRIES = 3;
export const REQUEST_DELAY_MS = 1500;
export const DEFAULT_CONCURRENCY = 2;
