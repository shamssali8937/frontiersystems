/**
 * Cloudflare Turnstile token verifier.
 *
 * SECURITY:
 * - TURNSTILE_SECRET_KEY must NEVER be exposed to the browser.
 * - Call this function server-side only (Route Handler / Server Action).
 * - Always verify before processing any public write request.
 */

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export interface TurnstileVerifyResult {
  success: boolean;
  errorCodes: string[];
}

/**
 * Verifies a Turnstile challenge token submitted by the client.
 *
 * @param token - The `cf-turnstile-response` value from the form submission.
 * @param ip    - Optional: the user's IP address for additional validation.
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string,
): Promise<TurnstileVerifyResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error("[Turnstile] TURNSTILE_SECRET_KEY is not set.");
    return { success: false, errorCodes: ["missing-secret-key"] };
  }

  const body = new URLSearchParams({
    secret: secretKey,
    response: token,
    ...(ip ? { remoteip: ip } : {}),
  });

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
    });

    if (!response.ok) {
      console.error("[Turnstile] Verification API returned non-OK status.");
      return { success: false, errorCodes: ["api-error"] };
    }

    const data = (await response.json()) as {
      success: boolean;
      "error-codes": string[];
    };

    return {
      success: data.success,
      errorCodes: data["error-codes"] ?? [],
    };
  } catch (error) {
    console.error("[Turnstile] Fetch error during verification:", error);
    return { success: false, errorCodes: ["fetch-error"] };
  }
}
