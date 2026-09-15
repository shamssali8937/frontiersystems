/**
 * Sanity CMS configuration stub.
 *
 * Full schema types and content models will be defined in a later phase
 * when the Sanity Studio is set up.
 */

export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.SANITY_API_VERSION ?? "2024-01-01",
} as const;

export type SanityConfig = typeof sanityConfig;
