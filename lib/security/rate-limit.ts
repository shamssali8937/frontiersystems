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
  INQUIRY_SUBMISSION: { limit: 5, windowMs: 15 * 60 * 1000 },      // 5 per 15 minutes per IP
  FILE_UPLOAD: { limit: 10, windowMs: 10 * 60 * 1000 },             // 10 per 10 minutes per IP
  ADMIN_WRITE: { limit: 30, windowMs: 60 * 1000 },                  // 30 per minute
  ADMIN_READ: { limit: 120, windowMs: 60 * 1000 },                  // 120 per minute
  ADMIN_LOGIN: { limit: 5, windowMs: 15 * 60 * 1000 },              // 5 login attempts per 15 minutes per IP
  AUTH_FAILURE: { limit: 5, windowMs: 15 * 60 * 1000 },             // 5 failures per 15 minutes per IP
  PORTAL_MAGIC_LINK_EMAIL: { limit: 3, windowMs: 15 * 60 * 1000 },  // 3 magic link requests per 15 mins per email
  PORTAL_MAGIC_LINK_IP: { limit: 10, windowMs: 15 * 60 * 1000 },    // 10 magic link requests per 15 mins per IP
  PORTAL_VERIFY: { limit: 10, windowMs: 15 * 60 * 1000 },           // 10 verification attempts per 15 mins per IP
} as const;

/**
 * Check if Upstash Redis credentials are configured.
 */
function getUpstashCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token || url.includes("your-upstash-redis-url")) {
    return null;
  }
  return { url: url.replace(/\/$/, ""), token };
}

/**
 * Execute atomic Redis sliding-window algorithm over REST protocol.
 */
async function checkUpstashRateLimit(
  key: string,
  options: RateLimitOptions,
): Promise<RateLimitStatus | null> {
  const creds = getUpstashCredentials();
  if (!creds) return null;

  const now = Date.now();
  const clearBefore = now - options.windowMs;
  const ttlSeconds = Math.ceil(options.windowMs / 1000);

  try {
    // Pipeline: 1. Clean old entries, 2. Count current, 3. Refresh expiry
    const pipelineReq = [
      ["ZREMRANGEBYSCORE", key, "0", String(clearBefore)],
      ["ZCARD", key],
      ["EXPIRE", key, String(ttlSeconds)],
    ];

    const res = await fetch(`${creds.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipelineReq),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as Array<{ result: unknown }>;
    const currentCount = typeof data[1]?.result === "number" ? data[1].result : 0;

    if (currentCount >= options.limit) {
      const retryAfterSeconds = Math.max(1, Math.ceil(options.windowMs / 1000));
      return {
        allowed: false,
        remaining: 0,
        limit: options.limit,
        resetTime: now + options.windowMs,
        retryAfterSeconds,
      };
    }

    // Add member to sorted set
    const member = `${now}-${Math.random().toString(36).substring(2, 9)}`;
    await fetch(`${creds.url}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["ZADD", key, String(now), member],
        ["EXPIRE", key, String(ttlSeconds)],
      ]),
      cache: "no-store",
    });

    return {
      allowed: true,
      remaining: Math.max(0, options.limit - (currentCount + 1)),
      limit: options.limit,
      resetTime: now + options.windowMs,
      retryAfterSeconds: 0,
    };
  } catch {
    // If Upstash fails, return null to gracefully fallback to in-memory limiter
    return null;
  }
}

/**
 * Token bucket rate limiter with sliding expiration window (synchronous local).
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
 * Durable, serverless-compatible rate limit check.
 * Uses Upstash Redis if available; falls back to synchronous in-memory store.
 */
export async function checkRateLimitAsync(
  namespace: string,
  identifier: string,
  options: RateLimitOptions = RateLimitPolicies.INQUIRY_SUBMISSION,
): Promise<RateLimitStatus> {
  const redisKey = `ratelimit:${namespace}:${identifier}`;
  const upstashResult = await checkUpstashRateLimit(redisKey, options);

  if (upstashResult !== null) {
    return upstashResult;
  }

  return checkRateLimit(namespace, identifier, options);
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

/**
 * Resets in-memory rate-limit stores (used for testing teardown).
 */
export function resetRateLimits(): void {
  stores.clear();
}
