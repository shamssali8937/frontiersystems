/**
 * Centralized Role-Based Access Control (RBAC)
 *
 * Implements server-side permission checks.
 * NEVER relies on client-side state or UI visibility for authorization.
 */

export type Role = "ADMIN" | "OPERATOR" | "AUDITOR";

export type Permission =
  | "inquiries:read"
  | "inquiries:write"
  | "inquiries:delete"
  | "uploads:create"
  | "uploads:read"
  | "system:admin";

export interface AuthenticatedUser {
  id: string;
  role: Role;
  email: string;
}

const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  ADMIN: [
    "inquiries:read",
    "inquiries:write",
    "inquiries:delete",
    "uploads:create",
    "uploads:read",
    "system:admin",
  ],
  OPERATOR: [
    "inquiries:read",
    "inquiries:write",
    "uploads:create",
    "uploads:read",
  ],
  AUDITOR: [
    "inquiries:read",
    "uploads:read",
  ],
};

/**
 * Checks whether a user possesses the requested permission.
 */
export function hasPermission(user: AuthenticatedUser, permission: Permission): boolean {
  if (!user || !user.role) return false;
  const permissions = ROLE_PERMISSIONS[user.role];
  return Boolean(permissions?.includes(permission));
}

/**
 * Enforces permission check, throwing an error or returning false if unauthorized.
 */
export function enforcePermission(
  user: AuthenticatedUser | undefined,
  permission: Permission,
): { authorized: boolean; reason?: string } {
  if (!user) {
    return { authorized: false, reason: "Authentication required" };
  }

  if (!hasPermission(user, permission)) {
    return {
      authorized: false,
      reason: `User role "${user.role}" lacks required permission "${permission}"`,
    };
  }

  return { authorized: true };
}
