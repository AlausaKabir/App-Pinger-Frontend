'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import {
    FaUsers,
    FaShieldAlt,
    FaChartBar,
    FaCrown,
    FaUserShield,
    FaUserCog,
    FaServer,
    FaEnvelope,
    FaArrowLeft,
    FaLock,
    FaKey,
    FaDatabase,
    FaCheck
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { getUserStats, UserStats } from '@/requests/user';
import { getServices } from '@/requests/services';
import { isSuperAdmin, UserRole, getRoleBadgeColor } from '@/utils/permissions';
import NavigationBar from '@/components/NavigationBar';

export default function SuperAdminDashboard() {
    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [serviceCount, setServiceCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { user, role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;
    const canAccess = isSuperAdmin(userRole);

    useEffect(() => {
        if (canAccess) {
            loadDashboardData();
        } else {
            setIsLoading(false);
        }
    }, [canAccess]);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);

            // Load user statistics
            const statsResponse = await getUserStats();
            if (statsResponse.statusCode === 200) {
                setUserStats(statsResponse.data as UserStats);
            }

            // Load service count
            const servicesResponse = await getServices();
            if (servicesResponse.statusCode === 200) {
                const services = Array.isArray(servicesResponse.data)
                    ? servicesResponse.data
                    : [servicesResponse.data];
                setServiceCount(services.filter(Boolean).length);
            }
        } catch (error: any) {
            console.error('Failed to load dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    };

    if (!canAccess) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <NavigationBar />

                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center max-w-md mx-auto p-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
                            <FaLock className="text-3xl text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            SuperAdmin Access Required
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            This area is restricted to SuperAdmin users only. You currently have {role} access.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-center space-x-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Your current role:</span>
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(userRole)}`}>
                                    {role}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Contact your SuperAdmin to upgrade your permissions.
                            </p>
                        </div>
                        <div className="mt-8">
                            <Link
                                href="/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                            >
                                <FaArrowLeft className="mr-2" />
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <NavigationBar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading SuperAdmin dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavigationBar />

            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <div className="flex items-center space-x-3">
                                <FaCrown className="text-2xl text-yellow-500" />
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    SuperAdmin Control Panel
                                </h1>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                System-wide administration and user management
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                {/* System Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <FaUsers className="text-blue-600 dark:text-blue-400 text-2xl" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {userStats?.totalUsers || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <FaShieldAlt className="text-green-600 dark:text-green-400 text-2xl" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Admins</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {userStats ? (userStats.usersByRole.ADMIN + userStats.usersByRole.SUPERADMIN) : 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <FaServer className="text-purple-600 dark:text-purple-400 text-2xl" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Services</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {serviceCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                            <FaCheck className="text-green-600 dark:text-green-400 text-2xl" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Status</p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    Online
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Management */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                    <FaUsers className="mr-3 text-blue-600" />
                                    User Management
                                </h2>
                                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                                    SuperAdmin Only
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Regular Users</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {userStats ? userStats.usersByRole.USER : 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Administrators</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {userStats ? userStats.usersByRole.ADMIN : 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">SuperAdmins</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {userStats ? userStats.usersByRole.SUPERADMIN : 0}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/admin/users"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    <FaUserCog className="mr-2" />
                                    Manage Users & Roles
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* System Overview */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                    <FaChartBar className="mr-3 text-green-600" />
                                    System Overview
                                </h2>
                                <span className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                                    Live Data
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Monitored Services</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {serviceCount}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total System Users</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {userStats?.totalUsers || 0}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Admin Level Users</span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {userStats ? (userStats.usersByRole.ADMIN + userStats.usersByRole.SUPERADMIN) : 0}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <Link
                                    href="/dashboard/services"
                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                >
                                    <FaServer className="mr-1" />
                                    Services
                                </Link>
                                <Link
                                    href="/admin/emails"
                                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                                >
                                    <FaEnvelope className="mr-1" />
                                    Emails
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exclusive Features Notice */}
                <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start">
                        <FaKey className="text-yellow-600 dark:text-yellow-400 mt-1 mr-3" />
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                                SuperAdmin Exclusive Features
                            </h3>
                            <ul className="space-y-1 text-yellow-800 dark:text-yellow-400 text-sm">
                                <li>• View and manage all user accounts</li>
                                <li>• Change user roles (promote/demote users)</li>
                                <li>• Access system-wide statistics</li>
                                <li>• Full administrative control over the platform</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
