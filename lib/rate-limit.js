const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

export function checkLoginRateLimit(key) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    attempts.set(key, { startedAt: now, count: 1 });
    return { allowed: true, retryAfter: 0 };
  }
  if (current.count >= MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((WINDOW_MS - (now - current.startedAt)) / 1000) };
  }
  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}
