/**
 * Sanity CMS client stub.
 *
 * Replace the placeholder values with real credentials once the Sanity
 * project is created. Use NEXT_PUBLIC_ variables only for non-sensitive
 * identifiers (projectId, dataset); never for API tokens.
 */
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? "2024-01-01";

/** Read-only client — safe to use in Server Components. */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  // Do NOT use `token` here; use an authenticated client for mutations.
});

/** Authenticated client for write operations — server-side only. */
export const sanityAdminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  // Only include token when it is defined (required by exactOptionalPropertyTypes)
  ...(process.env.SANITY_API_TOKEN
    ? { token: process.env.SANITY_API_TOKEN }
    : {}),
  useCdn: false,
});

const builder = imageUrlBuilder(sanityClient);

/** Generates Sanity image URLs with builder pattern. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
