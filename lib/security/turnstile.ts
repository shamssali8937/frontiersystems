/**
 * Cloudflare Turnstile token verifier.
 */
export async function verifyTurnstileToken(
  token?: string,
  remoteIp?: string,
): Promise<{ success: boolean; error?: string | undefined }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  // In local development or testing without a key, allow bypass
  if (!secret || secret === "dummy-secret-key" || process.env.NODE_ENV === "development") {
    return { success: true };
  }

  if (!token) {
    return { success: false, error: "Turnstile challenge token is required" };
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    const outcome = (await res.json()) as { success: boolean; "error-codes"?: string[] };
    return {
      success: Boolean(outcome.success),
      error: outcome["error-codes"] ? outcome["error-codes"].join(", ") : undefined,
    };
  } catch (err) {
    console.error("[Turnstile] Verification failed:", err);
    return { success: false, error: "Verification service temporarily unavailable" };
  }
}
