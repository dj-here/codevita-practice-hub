interface RateLimitRecord {
  lastRequestTime: number;
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      if (now - record.lastRequestTime > 120000) {
        rateLimitStore.delete(key);
      }
    });
  }, 300000);
}

export interface RateLimitOptions {
  intervalMs?: number; // Minimum cooldown between consecutive requests (default: 2000ms)
  maxPerWindow?: number; // Max requests per window (default: 20)
  windowMs?: number; // Window size (default: 60000ms)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { allowed: boolean; remainingCooldownMs?: number; retryAfterSec?: number } {
  const {
    intervalMs = 2000,
    maxPerWindow = 30,
    windowMs = 60000,
  } = options;

  const now = Date.now();
  let record = rateLimitStore.get(identifier);

  if (!record) {
    record = { lastRequestTime: now, timestamps: [now] };
    rateLimitStore.set(identifier, record);
    return { allowed: true };
  }

  // 1. Cooldown check (prevent rapid button spamming)
  const timeSinceLast = now - record.lastRequestTime;
  if (timeSinceLast < intervalMs) {
    const remainingCooldownMs = intervalMs - timeSinceLast;
    return {
      allowed: false,
      remainingCooldownMs,
      retryAfterSec: Math.ceil(remainingCooldownMs / 1000),
    };
  }

  // 2. Window count check
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (record.timestamps.length >= maxPerWindow) {
    const oldest = record.timestamps[0];
    const retryAfterSec = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      retryAfterSec: Math.max(1, retryAfterSec),
    };
  }

  // Update record
  record.lastRequestTime = now;
  record.timestamps.push(now);
  return { allowed: true };
}
