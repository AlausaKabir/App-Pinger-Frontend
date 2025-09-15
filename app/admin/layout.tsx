'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RootState } from '@/lib/redux/store';
import { hasPermission, UserRole } from '@/utils/permissions';
import { FaEnvelope, FaUsers, FaShieldAlt, FaCog, FaChartBar, FaUserCircle } from 'react-icons/fa';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const { user, role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;

    // Define permissions first
    const permissions = {
        canManageEmails: hasPermission(userRole, 'canManageEmails'),
        canManageUsers: hasPermission(userRole, 'canManageUsers'),
        canAccessSuperAdmin: hasPermission(userRole, 'canAccessSuperAdmin'),
    };

    // Admin navigation items
    const navigationItems = [
        {
            href: '/admin/emails',
            label: 'Email Management',
            icon: FaEnvelope,
            permission: 'canManageEmails' as keyof typeof permissions,
        },
        {
            href: '/admin/users',
            label: 'User Management',
            icon: FaUsers,
            permission: 'canManageUsers' as keyof typeof permissions,
        },
        {
            href: '/admin/superadmin',
            label: 'Super Admin',
            icon: FaShieldAlt,
            permission: 'canAccessSuperAdmin' as keyof typeof permissions,
        },
    ];

    // Filter navigation items based on permissions
    const allowedNavItems = navigationItems.filter(item => permissions[item.permission]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Manage your Pinger application
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                              <FaUserCircle className="h-6 w-6 text-gray-500 dark:text-gray-300" />

                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Welcome, {user?.name ?? "User"}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${userRole === 'USER'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                }`}>
                                {userRole}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex space-x-8">
                    {/* Sidebar Navigation */}
                    <div className="w-64 flex-shrink-0">
                        <nav className="space-y-2">
                            {allowedNavItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500 dark:bg-blue-900 dark:text-blue-300'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                                            }`}
                                    >
                                        <Icon className="h-5 w-5 mr-3" />
                                        {item.label}
                                    </Link>
                                );
                            })}

                            {/* Quick Stats */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                    Quick Access
                                </h3>
                                <Link
                                    href="/dashboard"
                                    className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white rounded-lg transition-colors"
                                >
                                    <FaChartBar className="h-4 w-4 mr-3" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/dashboard/services"
                                    className="w-full flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white rounded-lg transition-colors"
                                >
                                    <FaCog className="h-4 w-4 mr-3" />
                                    Services
                                </Link>
                            </div>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
