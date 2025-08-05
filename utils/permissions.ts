export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export interface RolePermissions {
  canManageServices: boolean;
  canManageEmails: boolean;
  canManageUsers: boolean;
  canViewHealthChecks: boolean;
  canDeleteServices: boolean;
  canViewDashboard: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canAccessSuperAdmin: boolean;
}

export const getRolePermissions = (role: UserRole): RolePermissions => {
  switch (role) {
    case "SUPERADMIN":
      return {
        canManageServices: true,
        canManageEmails: true,
        canManageUsers: true,
        canViewHealthChecks: true,
        canDeleteServices: true,
        canViewDashboard: true,
        canViewAnalytics: true,
        canManageSettings: true,
        canAccessSuperAdmin: true,
      };
    case "ADMIN":
      return {
        canManageServices: true,
        canManageEmails: true,
        canManageUsers: false,
        canViewHealthChecks: true,
        canDeleteServices: true,
        canViewDashboard: true,
        canViewAnalytics: true,
        canManageSettings: true,
        canAccessSuperAdmin: false,
      };
    case "USER":
    default:
      return {
        canManageServices: true,
        canManageEmails: false,
        canManageUsers: false,
        canViewHealthChecks: true,
        canDeleteServices: false,
        canViewDashboard: true,
        canViewAnalytics: false,
        canManageSettings: false,
        canAccessSuperAdmin: false,
      };
  }
};

export const hasPermission = (userRole: UserRole, permission: keyof RolePermissions): boolean => {
  const permissions = getRolePermissions(userRole);
  return permissions[permission];
};

export const isAdmin = (role: UserRole): boolean => {
  return role === "ADMIN" || role === "SUPERADMIN";
};

export const isSuperAdmin = (role: UserRole): boolean => {
  return role === "SUPERADMIN";
};

export const getRoleBadgeColor = (role: UserRole): string => {
  switch (role) {
    case "SUPERADMIN":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "ADMIN":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "USER":
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export function getMinimumRoleForPermission(permission: keyof RolePermissions): UserRole[] {
  const rolesWithPermission: UserRole[] = [];

  (["USER", "ADMIN", "SUPERADMIN"] as UserRole[]).forEach((role) => {
    if (getRolePermissions(role)[permission]) {
      rolesWithPermission.push(role);
    }
  });

  return rolesWithPermission;
}
