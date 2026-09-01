type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

// A local safety valve. Production deployments must replace this with a shared Redis/edge limiter.
export function allowAttempt(scope: string, key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucketKey = `${scope}:${key}`;
  const current = buckets.get(bucketKey);
  if (!current || current.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
