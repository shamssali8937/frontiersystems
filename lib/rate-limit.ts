/**
 * Rate limiter utility providing durable sliding window rate limiting.
 * Powered by Upstash Redis REST protocol with local in-memory fallback.
 */

import { checkRateLimitAsync, RateLimitOptions } from "@/lib/security/rate-limit";

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in the current window. */
  remaining: number;
  /** Unix timestamp (ms) when the window resets. */
  reset: number;
}

/**
 * Check if an identifier (e.g. IP address, user ID) has exceeded the rate limit.
 *
 * @param identifier - A unique key per rate-limit scope (e.g. `"inquiry:${ip}"`).
 * @param options - Optional custom limit and windowMs.
 */
export async function rateLimit(
  identifier: string,
  options?: RateLimitOptions,
): Promise<RateLimitResult> {
  const [namespace, ...rest] = identifier.split(":");
  const id = rest.join(":") || identifier;

  const status = await checkRateLimitAsync(
    namespace || "default",
    id,
    options || { limit: 10, windowMs: 60_000 },
  );

  return {
    success: status.allowed,
    remaining: status.remaining,
    reset: status.resetTime,
  };
}
