'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { hasPermission, UserRole } from '@/utils/permissions';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredPermission?: keyof import('@/utils/permissions').RolePermissions;
    requiredRole?: UserRole;
    fallback?: React.ReactNode;
    showAccessDenied?: boolean;
}

export default function ProtectedRoute({
    children,
    requiredPermission,
    requiredRole,
    fallback,
    showAccessDenied = true
}: ProtectedRouteProps) {
    const { role, loggedIn } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;

    // If not authenticated, show fallback or redirect to login
    if (!loggedIn) {
        return fallback || (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Authentication Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please log in to access this page.
                    </p>
                </div>
            </div>
        );
    }

    // Check role-based access
    if (requiredRole && userRole !== requiredRole) {
        return showAccessDenied ? (
            <AccessDenied requiredRole={requiredRole} />
        ) : (fallback || null);
    }

    // Check permission-based access
    if (requiredPermission && !hasPermission(userRole, requiredPermission)) {
        return showAccessDenied ? (
            <AccessDenied requiredPermission={requiredPermission} />
        ) : (fallback || null);
    }

    return <>{children}</>;
}
