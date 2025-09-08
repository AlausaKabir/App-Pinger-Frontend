'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { FaEnvelope, FaArrowLeft, FaClock, FaBell, FaUsers, FaChartLine, FaCog } from 'react-icons/fa';
import { getRoleBadgeColor, UserRole, hasPermission } from '@/utils/permissions';

export default function EmailPage() {
    const { user, role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;
    const canManageEmails = hasPermission(userRole, 'canManageEmails');

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
                                Email Notifications
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Manage your email preferences and notification settings
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Current User Info */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                            <FaEnvelope className="mr-3 text-blue-600" />
                            Current Email Settings
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Notification Email
                                </label>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className="text-gray-900 dark:text-white">{user?.email}</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Role & Permissions
                                </label>
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(userRole)}`}>
                                        {role}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-6">
                                <FaEnvelope className="text-3xl text-blue-600 dark:text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Email Notification Center
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                                We're building a comprehensive email notification system to keep you informed about your services.
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl p-6 mb-8">
                                <div className="flex items-center justify-center mb-4">
                                    <FaClock className="text-blue-600 dark:text-blue-400 mr-2" />
                                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Coming Soon</span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Smart email notifications for service outages, performance alerts, and status updates.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <div className="text-center p-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg mb-3">
                                        <FaBell className="text-red-600 dark:text-red-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Instant Alerts</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Get notified immediately when services go down
                                    </p>
                                </div>

                                <div className="text-center p-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mb-3">
                                        <FaUsers className="text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Team Notifications</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Share alerts with your team members automatically
                                    </p>
                                </div>

                                <div className="text-center p-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mb-3">
                                        <FaChartLine className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Weekly Reports</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Receive detailed uptime and performance summaries
                                    </p>
                                </div>

                                <div className="text-center p-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg mb-3">
                                        <FaCog className="text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Custom Rules</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Set up personalized notification preferences
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

                                {canManageEmails && (
                                    <Link
                                        href="/admin/emails"
                                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                                    >
                                        <FaEnvelope className="mr-2" />
                                        Email Management
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Feature Preview */}
                    <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
                        <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 mb-3">
                            What to Expect
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-indigo-800 dark:text-indigo-400">
                            <div>
                                <h4 className="font-medium mb-2">Smart Filtering</h4>
                                <ul className="space-y-1 text-sm">
                                    <li>• Prevent notification spam</li>
                                    <li>• Group related alerts</li>
                                    <li>• Escalation rules</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Rich Content</h4>
                                <ul className="space-y-1 text-sm">
                                    <li>• Service status charts</li>
                                    <li>• Response time graphs</li>
                                    <li>• Action buttons</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
