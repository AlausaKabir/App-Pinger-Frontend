"use client";

import React, { useState } from 'react';
import {
    FiUsers,
    FiServer,
    FiMail,
    FiChevronRight,
    FiExternalLink,
    FiClock,
    FiUser,
    FiShield,
    FiActivity,
    FiCheckCircle,
    FiXCircle,
    FiAlertCircle,
    FiEye,
    FiEdit,
    FiTrash2,
    FiMoreVertical
} from 'react-icons/fi';
import { GlobalSearchResult, QuickSearchResult } from '@/types/search.types';

interface SearchResultsDisplayProps {
    results: GlobalSearchResult | QuickSearchResult | null;
    onResultClick?: (result: any, type: 'user' | 'service' | 'email') => void;
    onUserAction?: (action: string, userId: string) => void;
    onServiceAction?: (action: string, serviceId: string) => void;
    onEmailAction?: (action: string, emailId: string) => void;
    className?: string;
    showActions?: boolean;
    compact?: boolean;
}

export const SearchResultsDisplay: React.FC<SearchResultsDisplayProps> = ({
    results,
    onResultClick,
    onUserAction,
    onServiceAction,
    onEmailAction,
    className = '',
    showActions = true,
    compact = false,
}) => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['users', 'services', 'emails']));
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    if (!results) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-gray-400 mb-4">
                    <FiUsers className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg">No search performed yet</p>
                    <p className="text-sm">Start typing to search across users, services, and emails</p>
                </div>
            </div>
        );
    }

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleActionClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setActionMenuOpen(actionMenuOpen === id ? null : id);
    };

    const handleAction = (action: string, id: string, type: 'user' | 'service' | 'email') => {
        setActionMenuOpen(null);
        if (type === 'user' && onUserAction) onUserAction(action, id);
        if (type === 'service' && onServiceAction) onServiceAction(action, id);
        if (type === 'email' && onEmailAction) onEmailAction(action, id);
    };

    const getTotalResults = () => {
        if (results && 'totalResults' in results) return results.totalResults;
        const globalResults = results as GlobalSearchResult;
        return (globalResults?.users?.length || 0) + (globalResults?.services?.length || 0) + (globalResults?.emails?.length || 0);
    };

    const hasResults = getTotalResults() > 0;

    if (!hasResults) {
        return (
            <div className={`text-center py-12 ${className}`}>
                <div className="text-gray-400 mb-4">
                    <FiUsers className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-lg">No results found</p>
                    <p className="text-sm">Try adjusting your search terms or filters</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Results Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FiActivity className="h-5 w-5 text-blue-600" />
                        <h3 className="font-medium text-blue-900">Search Results</h3>
                    </div>
                    <div className="text-sm text-blue-700">
                        {getTotalResults()} total results
                    </div>
                </div>
                <div className="mt-2 flex gap-6 text-sm text-blue-600">
                    {results.users && results.users.length > 0 && (
                        <span>{results.users.length} users</span>
                    )}
                    {results.services && results.services.length > 0 && (
                        <span>{results.services.length} services</span>
                    )}
                    {results.emails && results.emails.length > 0 && (
                        <span>{results.emails.length} emails</span>
                    )}
                </div>
            </div>

            {/* Users Section */}
            {results.users && results.users.length > 0 && (
                <div className="bg-white border rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('users')}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FiUsers className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium text-gray-900">Users</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {results.users.length}
                            </span>
                        </div>
                        <FiChevronRight
                            className={`h-4 w-4 transition-transform ${expandedSections.has('users') ? 'rotate-90' : ''
                                }`}
                        />
                    </button>

                    {expandedSections.has('users') && (
                        <div className="divide-y divide-gray-200">
                            {results.users.map((user) => (
                                <div
                                    key={user.id}
                                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => onResultClick?.(user, 'user')}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FiUser className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{user.email}</span>
                                                <span className={`
                          text-xs px-2 py-1 rounded font-medium
                          ${user.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-800' :
                                                        user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-gray-100 text-gray-800'}
                        `}>
                                                    {user.role}
                                                </span>
                                                {user.role === 'SUPERADMIN' && (
                                                    <FiShield className="h-4 w-4 text-purple-600" title="Super Admin" />
                                                )}
                                            </div>

                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <FiClock className="h-3 w-3" />
                                                        Created: {formatDate(user.createdAt)}
                                                    </span>
                                                    {user._count?.services !== undefined && (
                                                        <span>{user._count.services} services</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {showActions && (
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => handleActionClick(e, user.id)}
                                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                    title="User actions"
                                                >
                                                    <FiMoreVertical className="h-4 w-4" />
                                                </button>

                                                {actionMenuOpen === user.id && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
                                                        <button
                                                            onClick={() => handleAction('view', user.id, 'user')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                        >
                                                            <FiEye className="h-3 w-3" /> View
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('edit', user.id, 'user')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                        >
                                                            <FiEdit className="h-3 w-3" /> Edit
                                                        </button>
                                                        {user.role !== 'SUPERADMIN' && (
                                                            <button
                                                                onClick={() => handleAction('delete', user.id, 'user')}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                                            >
                                                                <FiTrash2 className="h-3 w-3" /> Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Services Section */}
            {results.services && results.services.length > 0 && (
                <div className="bg-white border rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('services')}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FiServer className="h-5 w-5 text-green-600" />
                            <h3 className="font-medium text-gray-900">Services</h3>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {results.services.length}
                            </span>
                        </div>
                        <FiChevronRight
                            className={`h-4 w-4 transition-transform ${expandedSections.has('services') ? 'rotate-90' : ''
                                }`}
                        />
                    </button>

                    {expandedSections.has('services') && (
                        <div className="divide-y divide-gray-200">
                            {results.services.map((service) => (
                                <div
                                    key={service.id}
                                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => onResultClick?.(service, 'service')}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FiServer className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{service.name}</span>
                                                <span className={`
                          text-xs px-2 py-1 rounded font-medium flex items-center gap-1
                          ${service.healthStatus === 'UP' ? 'bg-green-100 text-green-800' :
                                                        service.healthStatus === 'DOWN' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'}
                        `}>
                                                    {service.healthStatus === 'UP' && <FiCheckCircle className="h-3 w-3" />}
                                                    {service.healthStatus === 'DOWN' && <FiXCircle className="h-3 w-3" />}
                                                    {service.healthStatus === 'UNKNOWN' && <FiAlertCircle className="h-3 w-3" />}
                                                    {service.healthStatus}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        window.open(service.url, '_blank');
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                                    title="Open service URL"
                                                >
                                                    <FiExternalLink className="h-4 w-4" />
                                                </button>
                                            </div>

                                            <div className="text-sm text-gray-600 space-y-1">
                                                <div className="truncate">{service.url}</div>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <FiClock className="h-3 w-3" />
                                                        Created: {formatDate(service.createdAt)}
                                                    </span>
                                                    {(service as any).checkInterval && (
                                                        <span>Check: {(service as any).checkInterval}s</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {showActions && (
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => handleActionClick(e, service.id)}
                                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                    title="Service actions"
                                                >
                                                    <FiMoreVertical className="h-4 w-4" />
                                                </button>

                                                {actionMenuOpen === service.id && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
                                                        <button
                                                            onClick={() => handleAction('view', service.id, 'service')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                        >
                                                            <FiEye className="h-3 w-3" /> View
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('edit', service.id, 'service')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                        >
                                                            <FiEdit className="h-3 w-3" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('check', service.id, 'service')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                        >
                                                            <FiActivity className="h-3 w-3" /> Check Now
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('delete', service.id, 'service')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                                        >
                                                            <FiTrash2 className="h-3 w-3" /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Emails Section */}
            {results.emails && results.emails.length > 0 && (
                <div className="bg-white border rounded-lg overflow-hidden">
                    <button
                        onClick={() => toggleSection('emails')}
                        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <FiMail className="h-5 w-5 text-purple-600" />
                            <h3 className="font-medium text-gray-900">Notification Emails</h3>
                            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                {results.emails.length}
                            </span>
                        </div>
                        <FiChevronRight
                            className={`h-4 w-4 transition-transform ${expandedSections.has('emails') ? 'rotate-90' : ''
                                }`}
                        />
                    </button>

                    {expandedSections.has('emails') && (
                        <div className="divide-y divide-gray-200">
                            {results.emails.map((email) => (
                                <div
                                    key={email.id}
                                    className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => onResultClick?.(email, 'email')}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <FiMail className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium text-gray-900">{email.email}</span>
                                                <span className={`
                          text-xs px-2 py-1 rounded font-medium
                          ${email.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        `}>
                                                    {email.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-600">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <FiClock className="h-3 w-3" />
                                                        Created: {formatDate(email.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {showActions && (
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => handleActionClick(e, email.id)}
                                                    className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                    title="Email actions"
                                                >
                                                    <FiMoreVertical className="h-4 w-4" />
                                                </button>

                                                {actionMenuOpen === email.id && (
                                                    <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-32">
                                                        <button
                                                            onClick={() => handleAction('view', email.id, 'email')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                        >
                                                            <FiEye className="h-3 w-3" /> View
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('edit', email.id, 'email')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                        >
                                                            <FiEdit className="h-3 w-3" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(email.isActive ? 'deactivate' : 'activate', email.id, 'email')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                                                        >
                                                            {email.isActive ? <FiXCircle className="h-3 w-3" /> : <FiCheckCircle className="h-3 w-3" />}
                                                            {email.isActive ? 'Deactivate' : 'Activate'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction('delete', email.id, 'email')}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
                                                        >
                                                            <FiTrash2 className="h-3 w-3" /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
