'use client';

import { useSelector } from 'react-redux';
import Link from 'next/link';
import { RootState } from '@/lib/redux/store';
import { hasPermission, UserRole } from '@/utils/permissions';
import { FaEnvelope, FaUsers, FaShieldAlt, FaArrowRight, FaServer, FaChartBar } from 'react-icons/fa';

export default function AdminDashboard() {
    const { user, role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;

    const adminCards = [
        {
            title: 'Email Management',
            description: 'Manage notification emails for service alerts',
            href: '/admin/emails',
            icon: FaEnvelope,
            color: 'blue',
            permission: 'canManageEmails' as const,
            stats: 'Configure alert recipients',
        },
        {
            title: 'User Management',
            description: 'Manage user accounts and permissions',
            href: '/admin/users',
            icon: FaUsers,
            color: 'green',
            permission: 'canManageUsers' as const,
            stats: 'Handle user access',
        },
        {
            title: 'Super Admin',
            description: 'Advanced system configuration and controls',
            href: '/admin/superadmin',
            icon: FaShieldAlt,
            color: 'purple',
            permission: 'canAccessSuperAdmin' as const,
            stats: 'System-wide settings',
        },
    ];

    const quickActions = [
        {
            title: 'View Services',
            description: 'Monitor all registered services',
            href: '/dashboard/services',
            icon: FaServer,
        },
        {
            title: 'Analytics',
            description: 'View system analytics and reports',
            href: '/dashboard/analytics',
            icon: FaChartBar,
        },
    ];

    const getColorClasses = (color: string) => {
        const colors = {
            blue: {
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                icon: 'text-blue-600 dark:text-blue-400',
                button: 'bg-blue-600 hover:bg-blue-700',
                border: 'border-blue-200 dark:border-blue-800',
            },
            green: {
                bg: 'bg-green-50 dark:bg-green-900/20',
                icon: 'text-green-600 dark:text-green-400',
                button: 'bg-green-600 hover:bg-green-700',
                border: 'border-green-200 dark:border-green-800',
            },
            purple: {
                bg: 'bg-purple-50 dark:bg-purple-900/20',
                icon: 'text-purple-600 dark:text-purple-400',
                button: 'bg-purple-600 hover:bg-purple-700',
                border: 'border-purple-200 dark:border-purple-800',
            },
        };
        return colors[color as keyof typeof colors] || colors.blue;
    };

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome to Admin Dashboard
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage your Pinger application settings, users, and notifications from this central location.
                </p>
            </div>

            {/* Admin Cards */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Administration Tools
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminCards
                        .filter(card => hasPermission(userRole, card.permission))
                        .map((card) => {
                            const Icon = card.icon;
                            const colors = getColorClasses(card.color);

                            return (
                                <div
                                    key={card.href}
                                    className={`${colors.bg} ${colors.border} border rounded-lg p-6 transition-all duration-200 hover:shadow-md`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${colors.bg}`}>
                                            <Icon className={`h-6 w-6 ${colors.icon}`} />
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        {card.title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {card.description}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                                        {card.stats}
                                    </p>

                                    <Link
                                        href={card.href}
                                        className={`${colors.button} text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors w-full`}
                                    >
                                        <span>Open</span>
                                        <FaArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            );
                        })}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quickActions.map((action) => {
                        const Icon = action.icon;

                        return (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600 group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                        <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {action.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {action.description}
                                        </p>
                                    </div>
                                    <FaArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ml-auto" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* System Info */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    System Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {userRole}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Your Role</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            Active
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">System Status</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            v1.0
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">App Version</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
