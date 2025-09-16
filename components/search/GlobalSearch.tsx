"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAutoSearch } from '@/hooks/useAutoSearch';
import { useSearchContext } from '@/contexts/SearchContext';
import {
    FiSearch,
    FiX,
    FiSettings,
    FiUsers,
    FiServer,
    FiMail,
    FiFilter,
    FiClock,
    FiTrendingUp
} from 'react-icons/fi';
import { QuickSearchResult, GlobalSearchResult } from '@/types/search.types';

interface GlobalSearchProps {
    className?: string;
    placeholder?: string;
    onResultClick?: (result: any, type: 'user' | 'service' | 'email') => void;
    showAdvancedFilters?: boolean;
    showSearchHistory?: boolean;
    enableKeyboardShortcuts?: boolean;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
    className = '',
    placeholder = '🔍 Search anything... (5 chars triggers auto-search, spacebar for full search)',
    onResultClick,
    showAdvancedFilters = true,
    showSearchHistory = true,
    enableKeyboardShortcuts = true,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedEntities, setSelectedEntities] = useState(['users', 'services', 'emails']);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        searchState,
        setQuickSearchResults,
        setGlobalSearchResults,
        addToHistory,
        searchHistory,
    } = useSearchContext();

    const {
        searchTerm,
        isSearching,
        quickResults,
        globalResults,
        hasTriggered,
        handleInputChange,
        handleKeyDown,
        triggerSearch,
        clearResults,
        resetSearch,
        config,
        characterCount,
    } = useAutoSearch({
        config: {
            triggerLength: 5,
            debounceMs: 300,
            enableSpacebarTrigger: true,
            enableQuickSearch: true,
            maxQuickResults: 8,
        },
        onSearchTrigger: (term) => {
            addToHistory(term);
        },
        onResults: (results) => {
            if ('totalResults' in results && results.users !== undefined) {
                // It's a QuickSearchResult
                setQuickSearchResults(results as QuickSearchResult);
            } else {
                // It's a GlobalSearchResult
                setGlobalSearchResults(results as GlobalSearchResult);
            }
        },
    });

    // Keyboard shortcuts
    useEffect(() => {
        if (!enableKeyboardShortcuts) return;

        const handleGlobalKeyDown = (event: KeyboardEvent) => {
            // Ctrl/Cmd + K to focus search
            if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
                event.preventDefault();
                searchInputRef.current?.focus();
                setIsOpen(true);
            }

            // Escape to close
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false);
                clearResults();
            }
        };

        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, [enableKeyboardShortcuts, isOpen, clearResults]);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !searchInputRef.current?.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleClear = () => {
        resetSearch();
        setIsOpen(false);
        searchInputRef.current?.focus();
    };

    const handleResultClick = (result: any, type: 'user' | 'service' | 'email') => {
        if (onResultClick) {
            onResultClick(result, type);
        }
        setIsOpen(false);
        addToHistory(searchTerm);
    };

    const handleHistoryClick = (term: string) => {
        handleInputChange(term);
        triggerSearch(term, { entities: selectedEntities as any });
    };

    const handleEntityToggle = (entity: string) => {
        setSelectedEntities(prev =>
            prev.includes(entity)
                ? prev.filter(e => e !== entity)
                : [...prev, entity]
        );
    };

    const getTotalResults = () => {
        if (quickResults) return quickResults.totalResults;
        if (globalResults) return globalResults.totalResults;
        return 0;
    };

    const hasResults = () => {
        return (quickResults && quickResults.totalResults > 0) ||
            (globalResults && globalResults.totalResults > 0);
    };

    const getSearchStatus = () => {
        if (isSearching) return '🔄 Searching...';
        if (characterCount < config.triggerLength) {
            return `⌨️ Type ${config.triggerLength - characterCount} more characters to trigger auto-search`;
        }
        if (hasTriggered && hasResults()) {
            return `✅ Found ${getTotalResults()} results`;
        }
        if (hasTriggered && !hasResults()) {
            return '❌ No results found';
        }
        return '💡 Press spacebar for full search';
    };

    return (
        <div className={`relative ${className}`}>
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                </div>

                <input
                    ref={searchInputRef}
                    type="text"
                    className={`
            w-full pl-10 pr-12 py-3 border-2 rounded-lg text-sm
            transition-all duration-200 ease-in-out
            ${isOpen || searchTerm
                            ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                            : 'border-gray-300 hover:border-gray-400'
                        }
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            ${hasTriggered ? 'bg-blue-50' : 'bg-white'}
          `}
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={handleInputFocus}
                />

                {/* Clear Button */}
                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="absolute inset-y-0 right-8 flex items-center pr-2 hover:text-red-500 transition-colors"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                )}

                {/* Settings/Filter Button */}
                {showAdvancedFilters && (
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`
              absolute inset-y-0 right-2 flex items-center pr-2 transition-colors
              ${showFilters ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}
            `}
                    >
                        <FiSettings className="h-4 w-4" />
                    </button>
                )}

                {/* Loading Indicator */}
                {isSearching && (
                    <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                )}
            </div>

            {/* Search Status */}
            <div className="text-xs text-gray-500 mt-1 px-2">
                {getSearchStatus()}
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 p-4">
                    <h3 className="font-medium text-gray-700 mb-3">Search Filters</h3>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Search In:</label>
                        <div className="flex gap-4">
                            {[
                                { key: 'users', label: 'Users', icon: FiUsers },
                                { key: 'services', label: 'Services', icon: FiServer },
                                { key: 'emails', label: 'Emails', icon: FiMail },
                            ].map(({ key, label, icon: Icon }) => (
                                <label key={key} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedEntities.includes(key)}
                                        onChange={() => handleEntityToggle(key)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <Icon className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Search Results Dropdown */}
            {isOpen && (searchTerm || searchHistory.length > 0) && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-40 max-h-96 overflow-y-auto"
                >
                    {/* Search History */}
                    {showSearchHistory && searchHistory.length > 0 && !searchTerm && (
                        <div className="p-3 border-b">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <FiClock className="h-4 w-4" />
                                Recent Searches
                            </h3>
                            <div className="space-y-1">
                                {searchHistory.slice(0, 5).map((term, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleHistoryClick(term)}
                                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Results */}
                    {(quickResults || globalResults) && (
                        <div className="p-3">
                            {/* Users */}
                            {(quickResults?.users?.length || globalResults?.users?.length) && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FiUsers className="h-4 w-4" />
                                        Users ({(quickResults?.users || globalResults?.users || []).length})
                                    </h3>
                                    <div className="space-y-1">
                                        {(quickResults?.users || globalResults?.users || []).map((user) => (
                                            <button
                                                key={user.id}
                                                onClick={() => handleResultClick(user, 'user')}
                                                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{user.email}</div>
                                                        <div className="text-xs text-gray-500">{user.role}</div>
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {user._count?.services} services
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Services */}
                            {(quickResults?.services?.length || globalResults?.services?.length) && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FiServer className="h-4 w-4" />
                                        Services ({(quickResults?.services || globalResults?.services || []).length})
                                    </h3>
                                    <div className="space-y-1">
                                        {(quickResults?.services || globalResults?.services || []).map((service) => (
                                            <button
                                                key={service.id}
                                                onClick={() => handleResultClick(service, 'service')}
                                                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                                        <div className="text-xs text-gray-500 truncate">{service.url}</div>
                                                    </div>
                                                    <div className={`text-xs px-2 py-1 rounded ${service.healthStatus === 'UP'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {service.healthStatus}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Emails */}
                            {(quickResults?.emails?.length || globalResults?.emails?.length) && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <FiMail className="h-4 w-4" />
                                        Notification Emails ({(quickResults?.emails || globalResults?.emails || []).length})
                                    </h3>
                                    <div className="space-y-1">
                                        {(quickResults?.emails || globalResults?.emails || []).map((email) => (
                                            <button
                                                key={email.id}
                                                onClick={() => handleResultClick(email, 'email')}
                                                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium text-gray-900">{email.email}</div>
                                                    <div className={`text-xs px-2 py-1 rounded ${email.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {email.isActive ? 'Active' : 'Inactive'}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Results */}
                            {hasTriggered && !hasResults() && (
                                <div className="text-center py-8 text-gray-500">
                                    <FiSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No results found for "{searchTerm}"</p>
                                    <p className="text-xs mt-1">Try different search terms or check your filters</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Keyboard Shortcuts */}
                    {enableKeyboardShortcuts && (
                        <div className="border-t px-3 py-2 bg-gray-50">
                            <div className="text-xs text-gray-500 flex items-center justify-between">
                                <span>💡 Tip: Type 5+ characters for auto-search, spacebar for full search</span>
                                <span>⌘K to focus • ESC to close</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
