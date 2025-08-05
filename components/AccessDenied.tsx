'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { hasPermission, UserRole, getRoleBadgeColor } from '@/utils/permissions';
import { FaLock, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';

interface AccessDeniedProps {
    requiredPermission?: keyof import('@/utils/permissions').RolePermissions;
    requiredRole?: UserRole;
    message?: string;
    showBackButton?: boolean;
}

export default function AccessDenied({
    requiredPermission,
    requiredRole,
    message,
    showBackButton = true
}: AccessDeniedProps) {
    const { role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;

    const getRequiredRoleText = () => {
        if (requiredRole) return requiredRole;
        if (requiredPermission === 'canManageUsers') return 'SUPERADMIN';
        if (requiredPermission === 'canManageEmails') return 'ADMIN or SUPERADMIN';
        return 'Higher permissions';
    };

    const getIconColor = () => {
        if (requiredPermission === 'canManageUsers') return 'text-red-600 dark:text-red-400';
        return 'text-orange-600 dark:text-orange-400';
    };

    const getBgColor = () => {
        if (requiredPermission === 'canManageUsers') return 'bg-red-100 dark:bg-red-900/20';
        return 'bg-orange-100 dark:bg-orange-900/20';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${getBgColor()} rounded-full mb-6`}>
                        <FaLock className={`text-2xl ${getIconColor()}`} />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Access Restricted
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {message || `This feature requires ${getRequiredRoleText()} permissions to access.`}
                    </p>

                    {/* Current vs Required Role */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Your role:</span>
                            <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(userRole)}`}>
                                {role}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Required:</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {getRequiredRoleText()}
                            </span>
                        </div>
                    </div>

                    {/* Permission Explanation */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
                        <div className="flex items-start">
                            <FaExclamationTriangle className="text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                            <div className="text-left">
                                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
                                    Need higher access?
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Contact your administrator or SuperAdmin to upgrade your permissions.
                                </p>
                            </div>
                        </div>
                    </div>

                    {showBackButton && (
                        <button
                            onClick={() => window.history.back()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                        >
                            Go Back
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
