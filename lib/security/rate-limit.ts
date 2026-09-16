interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const stores = new Map<string, Map<string, RateLimitStore>>();

/**
 * Token bucket rate limiter.
 */
export function checkRateLimit(
  namespace: string,
  identifier: string,
  options: RateLimitOptions = { limit: 5, windowMs: 60 * 1000 },
): { allowed: boolean; remaining: number; resetTime: number } {
  if (!stores.has(namespace)) {
    stores.set(namespace, new Map());
  }

  const namespaceStore = stores.get(namespace)!;
  const now = Date.now();
  const entry = namespaceStore.get(identifier);

  if (!entry || now > entry.resetTime) {
    const resetTime = now + options.windowMs;
    namespaceStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: options.limit - 1, resetTime };
  }

  if (entry.count < options.limit) {
    entry.count += 1;
    return { allowed: true, remaining: options.limit - entry.count, resetTime: entry.resetTime };
  }

  return { allowed: false, remaining: 0, resetTime: entry.resetTime };
}
