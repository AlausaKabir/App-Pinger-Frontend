'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaServer, FaEnvelope, FaUsers, FaHome, FaShieldAlt, FaCog, FaChartBar, FaBell, FaCrown, FaUser } from 'react-icons/fa';
import { hasPermission, UserRole } from '@/utils/permissions';
import { ComingSoonButton, ComingSoonFeatures } from './ComingSoon';

interface NavItem {
    href?: string;
    label: string;
    icon: React.ComponentType<any>;
    permission?: keyof import('@/utils/permissions').RolePermissions;
    comingSoon?: boolean;
    comingSoonKey?: keyof typeof ComingSoonFeatures;
}

const navigationItems: NavItem[] = [
    {
        href: '/dashboard',
        label: 'Dashboard',
        icon: FaHome,
    },
    {
        href: '/dashboard/services',
        label: 'Services',
        icon: FaServer,
    },
    {
        label: 'Analytics',
        icon: FaChartBar,
        comingSoon: true,
        comingSoonKey: 'Analytics',
    },
    {
        label: 'Email Notifications',
        icon: FaBell,
        comingSoon: true,
    },
    {
        href: '/admin/emails',
        label: 'Email Management',
        icon: FaEnvelope,
        permission: 'canManageEmails',
    },
    {
        href: '/admin/users',
        label: 'User Management',
        icon: FaUsers,
        permission: 'canManageUsers',
    },
    {
        href: '/admin/superadmin',
        label: 'SuperAdmin Panel',
        icon: FaCrown,
        permission: 'canAccessSuperAdmin',
    },
    {
        label: 'Settings',
        icon: FaCog,
        comingSoon: true,
        comingSoonKey: 'Settings',
    },
];

export default function NavigationBar() {
    const { role, user } = useSelector((state: RootState) => state.user);
    const pathname = usePathname();
    const userRole = role as UserRole;

    const visibleItems = navigationItems.filter(item => {
        if (!item.permission) return true;
        return hasPermission(userRole, item.permission);
    });

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <FaServer className="text-2xl text-blue-600" />
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            Pinger
                        </span>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center space-x-6">
                        {visibleItems.map((item, index) => {
                            const isActive = item.href && pathname === item.href;
                            const Icon = item.icon;

                            const baseClassName = `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`;

                            if (item.comingSoon) {
                                const feature = item.comingSoonKey ? ComingSoonFeatures[item.comingSoonKey] : {
                                    name: item.label,
                                    description: `${item.label} feature is coming soon with enhanced functionality.`,
                                    icon: <Icon className="text-blue-600 dark:text-blue-400 text-2xl" />
                                };

                                return (
                                    <ComingSoonButton
                                        key={index}
                                        featureName={feature.name}
                                        description={feature.description}
                                        icon={feature.icon}
                                        className={baseClassName}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </ComingSoonButton>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href!}
                                    className={baseClassName}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                        <Link
                            href="/profile"
                            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user?.email}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                    <FaShieldAlt className="mr-1" />
                                    {role}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
