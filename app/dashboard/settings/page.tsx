'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { FaCog, FaArrowLeft, FaClock, FaUser, FaBell, FaLock, FaPalette } from 'react-icons/fa';
import { getRoleBadgeColor, UserRole } from '@/utils/permissions';

export default function SettingsPage() {
    const { user, role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Settings
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage your account and application preferences
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Current User Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FaUser className="mr-3 text-blue-600" />
                            Account Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address
                                </label>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-900 dark:text-white">{user?.email}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role
                                </label>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(userRole)}`}>
                                        {role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Settings */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                                <FaCog className="text-3xl text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Settings Panel
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                We're working on comprehensive settings to give you full control over your monitoring experience.
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <FaClock className="text-blue-600 dark:text-blue-400 mr-2" />
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Coming Soon</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Advanced settings for notifications, themes, account management, and more will be available here.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="text-center p-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-3">
                                        <FaBell className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notifications</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Customize alert preferences and notification methods
                                    </p>
                                </div>

                                <div className="text-center p-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-3">
                                        <FaLock className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Security</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Password management and security settings
                                    </p>
                                </div>

                                <div className="text-center p-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-3">
                                        <FaPalette className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Appearance</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Theme preferences and UI customization
                                    </p>
                                </div>

                                <div className="text-center p-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg mb-3">
                                        <FaCog className="text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">General</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        General application settings and preferences
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/dashboard"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Back to Dashboard
                                </Link>
                                <Link
                                    href="/admin/emails"
                                    className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                                >
                                    Email Settings
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
