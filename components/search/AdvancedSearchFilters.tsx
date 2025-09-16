"use client";

import React, { useState, useEffect } from 'react';
import {
    FiFilter,
    FiX,
    FiCalendar,
    FiUsers,
    FiServer,
    FiMail,
    FiSettings,
    FiRefreshCw
} from 'react-icons/fi';
import { SearchFilters, UserRole, ServiceStatus } from '@/types/search.types';

interface AdvancedSearchFiltersProps {
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
    onReset: () => void;
    className?: string;
    isOpen: boolean;
    onToggle: () => void;
}

export const AdvancedSearchFilters: React.FC<AdvancedSearchFiltersProps> = ({
    filters,
    onFiltersChange,
    onReset,
    className = '',
    isOpen,
    onToggle,
}) => {
    const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleFilterChange = (key: keyof SearchFilters, value: any) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onFiltersChange(newFilters);
    };

    const handleArrayFilterChange = (key: keyof SearchFilters, value: string, checked: boolean) => {
        const currentArray = (localFilters[key] as string[]) || [];
        const newArray = checked
            ? [...currentArray, value]
            : currentArray.filter(item => item !== value);

        handleFilterChange(key, newArray);
    };

    const handleReset = () => {
        const resetFilters: SearchFilters = {
            entities: ['users', 'services', 'emails'],
        };
        setLocalFilters(resetFilters);
        onReset();
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (localFilters.userRoles?.length) count++;
        if (localFilters.serviceStatuses?.length) count++;
        if (localFilters.dateFrom || localFilters.dateTo) count++;
        if (localFilters.isActive !== undefined) count++;
        if (localFilters.entities?.length !== 3) count++; // Not all entities selected
        return count;
    };

    return (
        <div className={`relative ${className}`}>
            {/* Filter Toggle Button */}
            <button
                onClick={onToggle}
                className={`
          flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
          ${isOpen
                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }
        `}
            >
                <FiFilter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters</span>
                {getActiveFiltersCount() > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center">
                        {getActiveFiltersCount()}
                    </span>
                )}
            </button>

            {/* Filters Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Search Filters</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <FiRefreshCw className="h-3 w-3" />
                                Reset
                            </button>
                            <button
                                onClick={onToggle}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Search In */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            <FiSettings className="inline h-4 w-4 mr-1" />
                            Search In
                        </label>
                        <div className="space-y-2">
                            {[
                                { key: 'users' as const, label: 'Users', icon: FiUsers },
                                { key: 'services' as const, label: 'Services', icon: FiServer },
                                { key: 'emails' as const, label: 'Notification Emails', icon: FiMail },
                            ].map(({ key, label, icon: Icon }) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={localFilters.entities?.includes(key) ?? false}
                                        onChange={(e) => handleArrayFilterChange('entities', key, e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Icon className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition-colors" />
                                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* User Roles Filter */}
                    {localFilters.entities?.includes('users') && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <FiUsers className="inline h-4 w-4 mr-1" />
                                User Roles
                            </label>
                            <div className="space-y-2">
                                {(['USER', 'ADMIN', 'SUPERADMIN'] as UserRole[]).map((role) => (
                                    <label key={role} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={localFilters.userRoles?.includes(role) ?? false}
                                            onChange={(e) => handleArrayFilterChange('userRoles', role, e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className={`
                      text-xs px-2 py-1 rounded font-medium
                      ${role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' :
                                                role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'}
                    `}>
                                            {role}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Service Status Filter */}
                    {localFilters.entities?.includes('services') && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <FiServer className="inline h-4 w-4 mr-1" />
                                Service Status
                            </label>
                            <div className="space-y-2">
                                {(['UP', 'DOWN', 'UNKNOWN'] as ServiceStatus[]).map((status) => (
                                    <label key={status} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={localFilters.serviceStatuses?.includes(status) ?? false}
                                            onChange={(e) => handleArrayFilterChange('serviceStatuses', status, e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className={`
                      text-xs px-2 py-1 rounded font-medium
                      ${status === 'UP' ? 'bg-green-100 text-green-800' :
                                                status === 'DOWN' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'}
                    `}>
                                            {status}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Email Status Filter */}
                    {localFilters.entities?.includes('emails') && (
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                <FiMail className="inline h-4 w-4 mr-1" />
                                Email Status
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="emailStatus"
                                        value="all"
                                        checked={localFilters.isActive === undefined}
                                        onChange={() => handleFilterChange('isActive', undefined)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">All</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="emailStatus"
                                        value="active"
                                        checked={localFilters.isActive === true}
                                        onChange={() => handleFilterChange('isActive', true)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-green-700">Active</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="emailStatus"
                                        value="inactive"
                                        checked={localFilters.isActive === false}
                                        onChange={() => handleFilterChange('isActive', false)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">Inactive</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Date Range Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            <FiCalendar className="inline h-4 w-4 mr-1" />
                            Date Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1" htmlFor="dateFrom">From</label>
                                <input
                                    id="dateFrom"
                                    type="date"
                                    value={localFilters.dateFrom || ''}
                                    onChange={(e) => handleFilterChange('dateFrom', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    title="Start date for filtering results"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1" htmlFor="dateTo">To</label>
                                <input
                                    id="dateTo"
                                    type="date"
                                    value={localFilters.dateTo || ''}
                                    onChange={(e) => handleFilterChange('dateTo', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    title="End date for filtering results"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Sort By
                        </label>
                        <select
                            value={localFilters.sortBy || 'createdAt'}
                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            title="Select field to sort results by"
                        >
                            <option value="createdAt">Created Date</option>
                            <option value="updatedAt">Updated Date</option>
                            <option value="email">Email/Name</option>
                            <option value="role">Role</option>
                            <option value="status">Status</option>
                        </select>

                        <div className="flex items-center gap-4 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    value="desc"
                                    checked={localFilters.sortOrder !== 'asc'}
                                    onChange={() => handleFilterChange('sortOrder', 'desc')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Newest First</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sortOrder"
                                    value="asc"
                                    checked={localFilters.sortOrder === 'asc'}
                                    onChange={() => handleFilterChange('sortOrder', 'asc')}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Oldest First</span>
                            </label>
                        </div>
                    </div>

                    {/* Quick Filter Presets */}
                    <div className="border-t pt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Quick Presets</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => {
                                    handleFilterChange('userRoles', ['ADMIN', 'SUPERADMIN']);
                                    handleFilterChange('entities', ['users']);
                                }}
                                className="px-3 py-2 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                            >
                                Admin Users
                            </button>
                            <button
                                onClick={() => {
                                    handleFilterChange('serviceStatuses', ['DOWN']);
                                    handleFilterChange('entities', ['services']);
                                }}
                                className="px-3 py-2 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
                            >
                                Down Services
                            </button>
                            <button
                                onClick={() => {
                                    handleFilterChange('isActive', true);
                                    handleFilterChange('entities', ['emails']);
                                }}
                                className="px-3 py-2 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                            >
                                Active Emails
                            </button>
                            <button
                                onClick={() => {
                                    const today = new Date();
                                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                    handleFilterChange('dateFrom', weekAgo.toISOString().split('T')[0]);
                                    handleFilterChange('dateTo', today.toISOString().split('T')[0]);
                                }}
                                className="px-3 py-2 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
                            >
                                Last Week
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
