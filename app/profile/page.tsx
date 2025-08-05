'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import RoleDisplay from '@/components/RoleDisplay';
import { FaUser, FaEnvelope, FaCalendar, FaShieldAlt } from 'react-icons/fa';

export default function ProfilePage() {
    const { user, role } = useSelector((state: RootState) => state.user);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Manage your account settings and view your access permissions
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Information */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-xl font-bold">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {user?.name || 'User'}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <FaEnvelope className="text-gray-600 dark:text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <FaShieldAlt className="text-gray-600 dark:text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Role</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{role}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <FaCalendar className="text-gray-600 dark:text-gray-400" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Member Since</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role and Permissions */}
                    <RoleDisplay />
                </div>
            </div>
        </div>
    );
}
