/**
 * Rate limiter stub.
 *
 * Production implementation should use Upstash Redis (`@upstash/ratelimit`)
 * or an equivalent distributed store. This stub provides a safe no-op
 * interface that can be swapped in without changing call sites.
 *
 * USAGE:
 *   import { rateLimit } from "@/lib/rate-limit";
 *   const result = await rateLimit(identifier);
 *   if (!result.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 */

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
 */
export async function rateLimit(identifier: string): Promise<RateLimitResult> {
  // TODO: Replace this stub with Upstash Ratelimit or similar.
  // Example:
  //   import { Ratelimit } from "@upstash/ratelimit";
  //   import { Redis } from "@upstash/redis";
  //   const ratelimit = new Ratelimit({
  //     redis: Redis.fromEnv(),
  //     limiter: Ratelimit.slidingWindow(10, "1 m"),
  //   });
  //   return ratelimit.limit(identifier);

  void identifier; // suppress unused variable warning in stub

  return {
    success: true,
    remaining: 999,
    reset: Date.now() + 60_000,
  };
}
