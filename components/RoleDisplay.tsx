'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { UserRole, getRolePermissions, getRoleBadgeColor } from '@/utils/permissions';
import { FaCheck, FaTimes, FaShieldAlt, FaServer, FaEnvelope, FaUsers, FaChartBar, FaCog, FaCrown } from 'react-icons/fa';

interface PermissionDisplayProps {
    permission: string;
    description: string;
    hasAccess: boolean;
    icon: React.ReactNode;
}

function PermissionDisplay({ permission, description, hasAccess, icon }: PermissionDisplayProps) {
    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${hasAccess
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
            }`}>
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${hasAccess
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}>
                    {icon}
                </div>
                <div>
                    <p className={`font-medium ${hasAccess
                            ? 'text-green-900 dark:text-green-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {permission}
                    </p>
                    <p className={`text-sm ${hasAccess
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}>
                        {description}
                    </p>
                </div>
            </div>
            <div className={`p-1 rounded-full ${hasAccess
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                {hasAccess ? (
                    <FaCheck className="text-green-600 dark:text-green-400 h-4 w-4" />
                ) : (
                    <FaTimes className="text-gray-400 dark:text-gray-500 h-4 w-4" />
                )}
            </div>
        </div>
    );
}

export default function RoleDisplay() {
    const { role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;
    const permissions = getRolePermissions(userRole);

    const permissionData = [
        {
            key: 'canViewDashboard',
            name: 'Dashboard Access',
            description: 'View system dashboard and service status',
            icon: <FaServer className="text-blue-600 dark:text-blue-400 h-4 w-4" />
        },
        {
            key: 'canManageEmails',
            name: 'Email Management',
            description: 'Configure email notifications and settings',
            icon: <FaEnvelope className="text-purple-600 dark:text-purple-400 h-4 w-4" />
        },
        {
            key: 'canManageUsers',
            name: 'User Management',
            description: 'Manage user accounts and role assignments',
            icon: <FaUsers className="text-red-600 dark:text-red-400 h-4 w-4" />
        },
        {
            key: 'canViewAnalytics',
            name: 'Analytics Access',
            description: 'View detailed service analytics and reports',
            icon: <FaChartBar className="text-green-600 dark:text-green-400 h-4 w-4" />
        },
        {
            key: 'canManageSettings',
            name: 'System Settings',
            description: 'Configure system-wide settings and preferences',
            icon: <FaCog className="text-orange-600 dark:text-orange-400 h-4 w-4" />
        },
        {
            key: 'canAccessSuperAdmin',
            name: 'SuperAdmin Panel',
            description: 'Access comprehensive administrative controls',
            icon: <FaCrown className="text-yellow-600 dark:text-yellow-400 h-4 w-4" />
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-blue-600 dark:text-blue-400 text-xl" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Your Access Level
                    </h2>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm rounded-full font-medium ${getRoleBadgeColor(userRole)}`}>
                    {role}
                </span>
            </div>

            <div className="space-y-3">
                {permissionData.map((item) => (
                    <PermissionDisplay
                        key={item.key}
                        permission={item.name}
                        description={item.description}
                        hasAccess={permissions[item.key as keyof typeof permissions]}
                        icon={item.icon}
                    />
                ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Need higher access?</strong> Contact your system administrator or SuperAdmin
                    to request role upgrades or additional permissions.
                </p>
            </div>
        </div>
    );
}
