'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { FaUsers, FaUserShield, FaUserCog, FaSearch, FaShieldAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getUsers, getUserStats, updateUserRole, User, UserStats } from '@/requests/user';
import { isSuperAdmin, UserRole, getRoleBadgeColor } from '@/utils/permissions';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<UserRole | ''>('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);

    const { user, role } = useSelector((state: RootState) => state.user);
    const userRole = role as UserRole;

    // Check if user is SuperAdmin
    const canManageUsers = isSuperAdmin(userRole);

    useEffect(() => {
        if (!canManageUsers) {
            toast.error('You do not have permission to manage users');
            return;
        }
        loadUsers();
        loadStats();
    }, [canManageUsers, page, roleFilter, searchTerm]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await getUsers({
                page,
                limit: 10,
                role: roleFilter || undefined,
                search: searchTerm || undefined,
            });

            if (response.statusCode === 200) {
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
            }
        } catch (error: any) {
            console.error('Failed to load users:', error);
            toast.error('Failed to load users. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await getUserStats();
            if (response.statusCode === 200) {
                setStats(response.data as UserStats);
            }
        } catch (error: any) {
            console.error('Failed to load user stats:', error);
        }
    };

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        // Prevent SuperAdmin from demoting themselves
        if (userId === user?.id && userRole === 'SUPERADMIN' && newRole !== 'SUPERADMIN') {
            toast.error('You cannot change your own SuperAdmin role');
            return;
        }

        try {
            setIsUpdatingRole(userId);
            const response = await updateUserRole(userId, { role: newRole });

            if (response.statusCode === 200) {
                toast.success('User role updated successfully!');
                await loadUsers();
                await loadStats();
            }
        } catch (error: any) {
            console.error('Failed to update user role:', error);
            toast.error(error.response?.data?.message || 'Failed to update user role.');
        } finally {
            setIsUpdatingRole(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadUsers();
    };

    if (!canManageUsers) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-md mx-auto pt-20">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-6">
                            <FaShieldAlt className="text-2xl text-red-600 dark:text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            SuperAdmin Access Required
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            User management is restricted to SuperAdmin accounts only.
                            You currently have {role} permissions.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Your current role:</span>
                                <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(userRole)}`}>
                                    {role}
                                </span>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                            <p className="mb-2">To access user management, you need:</p>
                            <div className="flex items-center justify-center space-x-2">
                                <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 px-2 py-1 rounded-full text-xs font-medium">
                                    SUPERADMIN
                                </span>
                                <span>permissions</span>
                            </div>
                        </div>

                        <button
                            onClick={() => window.history.back()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        User Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage user accounts and permissions
                    </p>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                                </div>
                                <FaUsers className="text-3xl text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">SuperAdmins</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.usersByRole.SUPERADMIN}</p>
                                </div>
                                <FaUserShield className="text-3xl text-red-600" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Admins</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.usersByRole.ADMIN}</p>
                                </div>
                                <FaUserCog className="text-3xl text-blue-600" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Users</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.usersByRole.USER}</p>
                                </div>
                                <FaUsers className="text-3xl text-gray-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search users by email..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <select
                                value={roleFilter}
                                onChange={(e) => {
                                    setRoleFilter(e.target.value as UserRole | '');
                                    setPage(1);
                                }}
                                title="Filter by role"
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">All Roles</option>
                                <option value="USER">Users</option>
                                <option value="ADMIN">Admins</option>
                                <option value="SUPERADMIN">SuperAdmins</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <FaSearch />
                            <span>Search</span>
                        </button>
                    </form>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-12">
                            <FaUsers className="text-6xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                No users found
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Try adjusting your search criteria
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                User
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {users.map((userData) => (
                                            <tr key={userData.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white font-medium">
                                                                {userData.email.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {userData.email}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                ID: {userData.id.substring(0, 8)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(userData.role)}`}>
                                                        {userData.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                                    {new Date(userData.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {userData.id === user?.id ? (
                                                        <span className="text-sm text-gray-500 italic">Your account</span>
                                                    ) : (
                                                        <select
                                                            value={userData.role}
                                                            onChange={(e) => handleRoleChange(userData.id, e.target.value as UserRole)}
                                                            disabled={isUpdatingRole === userData.id}
                                                            title={`Change role for ${userData.email}`}
                                                            className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                        >
                                                            <option value="USER">User</option>
                                                            <option value="ADMIN">Admin</option>
                                                            <option value="SUPERADMIN">SuperAdmin</option>
                                                        </select>
                                                    )}
                                                    {isUpdatingRole === userData.id && (
                                                        <div className="inline-block ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Page {page} of {totalPages}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setPage(page - 1)}
                                            disabled={page === 1}
                                            className="disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <FaChevronLeft />
                                        </button>
                                        <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                                            {page}
                                        </span>
                                        <button
                                            onClick={() => setPage(page + 1)}
                                            disabled={page === totalPages}
                                            className="disabled:opacity-50 disabled:cursor-not-allowed p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <FaChevronRight />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
