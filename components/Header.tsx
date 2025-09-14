"use client";
import { useTheme } from "./ThemeProvider"
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { FaBars, FaServer, FaBell, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/redux/store';
import { logout } from '@/lib/redux/reducers/user';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from "next/link";
import { CiUser } from "react-icons/ci";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const { user, emailOrPhone } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/auth/login');
    };

    return (
        <header className="sticky top-0 inset-x-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3">
                {/* Left side - Menu button & Logo */}
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-3"
                    >
                        <FaBars className="h-5 w-5" />
                    </button>

                    <Link
                        className="flex items-center text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        href="/dashboard"
                        aria-label="Pinger"
                    >
                        <FaServer className="h-6 w-6 mr-2 text-blue-600" />
                        <span className="hidden sm:block">Pinger1111111</span>
                    </Link>
                </div>

                {/* Right side - Theme toggle, notifications, user menu */}
                <div className="flex items-center space-x-3">
                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                    >
                        {theme === 'light' ? (
                            <MdOutlineDarkMode className="h-5 w-5" />
                        ) : (
                            <MdOutlineLightMode className="h-5 w-5" />
                        )}
                    </button>

                    {/* Notifications */}
                    <button
                        type="button"
                        className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                        title="Notifications"
                    >
                        <FaBell className="h-5 w-5" />
                        {/* Notification badge */}
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                            2
                        </span>
                    </button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <FaUser className="h-5 w-5" />
                            <span className="hidden md:block ml-2 text-sm font-medium">
                                {emailOrPhone || 'User'}
                            </span>
                        </button>

                        {/* User Dropdown Menu */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Signed in as
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {emailOrPhone || 'user@example.com'}
                                    </p>
                                </div>

                                <div className="py-1">
                                    <Link
                                        href="/dashboard/settings"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <FaUser className="h-4 w-4 mr-2" />
                                        Settings
                                    </Link>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <FaSignOutAlt className="h-4 w-4 mr-2" />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside to close user menu */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    );
}
<div className="mt-2 py-2 first:pt-0 last:pb-0">
    <Link
        className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
        href="#"
    >
        <CiUser size={20} />
        Profile
    </Link>
</div>
