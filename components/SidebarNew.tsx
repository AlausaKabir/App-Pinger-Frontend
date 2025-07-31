"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaServer, FaTimes, FaHome, FaEnvelope, FaCog, FaChartLine, FaPlus } from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: FaHome,
        description: 'Overview & statistics'
    },
    {
        name: 'Services',
        href: '/dashboard/services',
        icon: FaServer,
        description: 'Manage monitored services'
    },
    {
        name: 'Add Service',
        href: '/dashboard/services/add',
        icon: FaPlus,
        description: 'Add new service'
    },
    {
        name: 'Email Settings',
        href: '/dashboard/email',
        icon: FaEnvelope,
        description: 'Notification settings'
    },
    {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: FaChartLine,
        description: 'Performance insights'
    },
    {
        name: 'Settings',
        href: '/dashboard/settings',
        icon: FaCog,
        description: 'Account & preferences'
    }
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:z-30`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <Link
                        href="/dashboard"
                        className="flex items-center text-xl font-bold text-gray-900 dark:text-white"
                    >
                        <FaServer className="h-6 w-6 mr-2 text-blue-600" />
                        Pinger
                    </Link>

                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FaTimes className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => onClose()}
                                className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${isActive
                                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-l-4 border-blue-600'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <Icon
                                    className={`h-5 w-5 mr-3 transition-colors ${isActive
                                            ? 'text-blue-600 dark:text-blue-400'
                                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                        }`}
                                />
                                <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                System Online
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                            Monitoring services since 2025
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
