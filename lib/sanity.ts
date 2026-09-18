import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "frontiersystems";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01";

/** Read-only Sanity client — safe in Server Components. */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

/** Authenticated Sanity client for write operations — server-side only. */
export const sanityAdminClient = createClient({
  projectId,
  dataset,
  apiVersion,
  ...(process.env.SANITY_API_TOKEN ? { token: process.env.SANITY_API_TOKEN } : {}),
  useCdn: false,
});

const builder = createImageUrlBuilder(sanityClient);

/** Generates Sanity image URLs. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
