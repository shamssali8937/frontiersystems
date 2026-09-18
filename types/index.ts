/**
 * Root type re-exports.
 */
export type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  ApiErrorCode,
} from "./api";
export { jsonSuccess, jsonError } from "./api";
export type {
  SanityImage,
  SanitySeo,
  SanitySlug,
  SanitySolution,
  SanityCaseStudy,
  BusinessImpactMetric,
} from "./sanity";
