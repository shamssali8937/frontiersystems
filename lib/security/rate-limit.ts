export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetTime: number;
  retryAfterSeconds: number;
}

const stores = new Map<string, Map<string, RateLimitStore>>();

// Periodic cleanup of expired stores to prevent memory growth (every 10 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [, store] of stores) {
      for (const [key, entry] of store) {
        if (now > entry.resetTime) {
          store.delete(key);
        }
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

/** Pre-configured enterprise rate limit policies */
export const RateLimitPolicies = {
  INQUIRY_SUBMISSION: { limit: 5, windowMs: 15 * 60 * 1000 },   // 5 per 15 minutes per IP
  FILE_UPLOAD: { limit: 10, windowMs: 10 * 60 * 1000 },          // 10 per 10 minutes per IP
  ADMIN_WRITE: { limit: 30, windowMs: 60 * 1000 },               // 30 per minute
  ADMIN_READ: { limit: 120, windowMs: 60 * 1000 },               // 120 per minute
  AUTH_FAILURE: { limit: 5, windowMs: 15 * 60 * 1000 },          // 5 failures per 15 minutes per IP
} as const;

/**
 * Token bucket rate limiter with sliding expiration window.
 */
export function checkRateLimit(
  namespace: string,
  identifier: string,
  options: RateLimitOptions = RateLimitPolicies.INQUIRY_SUBMISSION,
): RateLimitStatus {
  if (!stores.has(namespace)) {
    stores.set(namespace, new Map());
  }

  const namespaceStore = stores.get(namespace)!;
  const now = Date.now();
  const entry = namespaceStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + options.windowMs;
    namespaceStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: options.limit - 1,
      limit: options.limit,
      resetTime,
      retryAfterSeconds: 0,
    };
  }

  if (entry.count < options.limit) {
    entry.count += 1;
    return {
      allowed: true,
      remaining: options.limit - entry.count,
      limit: options.limit,
      resetTime: entry.resetTime,
      retryAfterSeconds: 0,
    };
  }

  const retryAfterSeconds = Math.max(1, Math.ceil((entry.resetTime - now) / 1000));

  return {
    allowed: false,
    remaining: 0,
    limit: options.limit,
    resetTime: entry.resetTime,
    retryAfterSeconds,
  };
}

/**
 * Checks if an identifier is currently rate limited without incrementing the counter.
 */
export function isRateLimited(
  namespace: string,
  identifier: string,
  options: RateLimitOptions = RateLimitPolicies.INQUIRY_SUBMISSION,
): boolean {
  const namespaceStore = stores.get(namespace);
  if (!namespaceStore) return false;
  const entry = namespaceStore.get(identifier);
  if (!entry) return false;
  const now = Date.now();
  if (now > entry.resetTime) {
    namespaceStore.delete(identifier);
    return false;
  }
  return entry.count >= options.limit;
}

/**
 * Returns standard rate-limiting HTTP headers to attach to response.
 */
export function getRateLimitHeaders(status: RateLimitStatus): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(status.limit),
    "X-RateLimit-Remaining": String(status.remaining),
    "X-RateLimit-Reset": String(Math.ceil(status.resetTime / 1000)),
  };

  if (!status.allowed) {
    headers["Retry-After"] = String(status.retryAfterSeconds);
  }

  return headers;
}
