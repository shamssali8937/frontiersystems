/**
 * Shared API response types.
 *
 * All Route Handlers must return responses that conform to ApiResponse<T>.
 * This ensures a consistent contract between the server and any client.
 */

/** A successful API response carrying data of type T. */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/** A failed API response with an error message. */
export interface ApiErrorResponse {
  success: false;
  /**
   * A safe, human-readable error message.
   * Must NOT contain stack traces, SQL errors, or internal implementation details.
   */
  error: string;
  /** Optional structured field-level validation errors (e.g. from Zod). */
  fieldErrors?: Record<string, string[]>;
}

/** Discriminated union for all API responses. */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/** Pagination metadata returned alongside list responses. */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Paginated list response. */
export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
