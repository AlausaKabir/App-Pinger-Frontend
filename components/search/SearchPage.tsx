"use client";

import React, { useState, useEffect } from 'react';
import { SearchProvider, useSearchContext } from '@/contexts/SearchContext';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { AdvancedSearchFilters } from '@/components/search/AdvancedSearchFilters';
import { SearchResultsDisplay } from '@/components/search/SearchResultsDisplay';
import {
    FiSearch,
    FiFilter,
    FiRefreshCw,
    FiDownload,
    FiTrendingUp,
    FiBookmark,
    FiClock,
    FiZap
} from 'react-icons/fi';
import { SearchFilters } from '@/types/search.types';

// Search Page Component that uses the context
const SearchPageContent: React.FC = () => {
    const {
        searchState,
        quickResults,
        globalResults,
        searchHistory,
        setFilters: setSearchFilters,
        clearHistory,
        addToHistory,
    } = useSearchContext();

    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>({
        entities: ['users', 'services', 'emails'],
    });
    const [savedSearches, setSavedSearches] = useState<Array<{
        id: string;
        name: string;
        query: string;
        filters: SearchFilters;
        createdAt: string;
    }>>([]);

    // Load saved searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('pinger-saved-searches');
        if (saved) {
            try {
                setSavedSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Failed to load saved searches:', error);
            }
        }
    }, []);

    const handleResultClick = (result: any, type: 'user' | 'service' | 'email') => {
        console.log('Result clicked:', { result, type });
        // Here you can implement navigation or modal opening
        // For example: router.push(`/${type}s/${result.id}`);
    };

    const handleUserAction = (action: string, userId: string) => {
        console.log('User action:', { action, userId });
        // Implement user actions like view, edit, delete
    };

    const handleServiceAction = (action: string, serviceId: string) => {
        console.log('Service action:', { action, serviceId });
        // Implement service actions like view, edit, check, delete
    };

    const handleEmailAction = (action: string, emailId: string) => {
        console.log('Email action:', { action, emailId });
        // Implement email actions like view, edit, activate, delete
    };

    const handleFiltersChange = (newFilters: SearchFilters) => {
        setFilters(newFilters);
    };

    const handleFiltersReset = () => {
        const defaultFilters: SearchFilters = {
            entities: ['users', 'services', 'emails'],
        };
        setFilters(defaultFilters);
    };

    const handleSaveSearch = (query: string) => {
        if (!query.trim()) return;

        const searchToSave = {
            id: Date.now().toString(),
            name: query,
            query,
            filters,
            createdAt: new Date().toISOString(),
        };

        const newSaved = [searchToSave, ...savedSearches.slice(0, 9)]; // Keep only 10
        setSavedSearches(newSaved);
        localStorage.setItem('pinger-saved-searches', JSON.stringify(newSaved));
    };

    const handleLoadSavedSearch = (saved: typeof savedSearches[0]) => {
        setFilters(saved.filters);
        // Trigger search with saved query and filters
        addToHistory(saved.query);
    };

    const handleExportResults = () => {
        const currentResults = globalResults || quickResults;
        if (!currentResults) return;

        const exportData = {
            searchQuery: searchHistory[0] || 'Unknown',
            filters,
            timestamp: new Date().toISOString(),
            results: currentResults,
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `search-results-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getCurrentResults = () => {
        return globalResults || quickResults;
    };

    const getResultsCount = () => {
        const results = getCurrentResults();
        if (!results) return 0;

        if ('totalResults' in results) return results.totalResults;
        const globalRes = results as any;
        return (globalRes.users?.length || 0) + (globalRes.services?.length || 0) + (globalRes.emails?.length || 0);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <FiSearch className="h-8 w-8 text-blue-600" />
                                Advanced Search
                            </h1>
                            <p className="mt-2 text-gray-600">
                                Search across users, services, and notification emails with powerful filters and auto-search
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {getCurrentResults() && (
                                <button
                                    onClick={handleExportResults}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <FiDownload className="h-4 w-4" />
                                    Export Results
                                </button>
                            )}

                            <button
                                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FiFilter className="h-4 w-4" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Search Stats */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FiZap className="h-5 w-5 text-yellow-500" />
                                <div>
                                    <div className="text-sm text-gray-500">Quick Searches</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {searchHistory.filter(h => h.length >= 5).length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FiTrendingUp className="h-5 w-5 text-blue-500" />
                                <div>
                                    <div className="text-sm text-gray-500">Results Found</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {getResultsCount()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FiClock className="h-5 w-5 text-green-500" />
                                <div>
                                    <div className="text-sm text-gray-500">Search History</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {searchHistory.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center gap-3">
                                <FiBookmark className="h-5 w-5 text-purple-500" />
                                <div>
                                    <div className="text-sm text-gray-500">Saved Searches</div>
                                    <div className="text-xl font-semibold text-gray-900">
                                        {savedSearches.length}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-1">
                            <GlobalSearch
                                className="w-full"
                                onResultClick={handleResultClick}
                                showAdvancedFilters={false}
                                enableKeyboardShortcuts={true}
                            />
                        </div>

                        <div className="lg:w-auto">
                            <AdvancedSearchFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onReset={handleFiltersReset}
                                isOpen={isFiltersOpen}
                                onToggle={() => setIsFiltersOpen(!isFiltersOpen)}
                            />
                        </div>
                    </div>

                    {/* Search Tips */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-medium text-blue-900 mb-2">💡 Search Tips</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                            <div>• Type 5+ characters for automatic search</div>
                            <div>• Press spacebar to trigger full search</div>
                            <div>• Use Ctrl/⌘ + K to focus search anytime</div>
                            <div>• Press Escape to close search results</div>
                        </div>
                    </div>
                </div>

                {/* Saved Searches & History */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Saved Searches */}
                    {savedSearches.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FiBookmark className="h-5 w-5 text-purple-600" />
                                    Saved Searches
                                </h3>
                                <span className="text-sm text-gray-500">{savedSearches.length}/10</span>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {savedSearches.map((saved) => (
                                    <button
                                        key={saved.id}
                                        onClick={() => handleLoadSavedSearch(saved)}
                                        className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors border"
                                    >
                                        <div className="font-medium text-gray-900 truncate">{saved.name}</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {new Date(saved.createdAt).toLocaleDateString()}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Search History */}
                    {searchHistory.length > 0 && (
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FiClock className="h-5 w-5 text-green-600" />
                                    Recent Searches
                                </h3>
                                <button
                                    onClick={clearHistory}
                                    className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {searchHistory.slice(0, 10).map((term, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        <span className="text-gray-900 truncate flex-1">{term}</span>
                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleSaveSearch(term)}
                                                className="text-purple-600 hover:text-purple-800 transition-colors"
                                                title="Save this search"
                                            >
                                                <FiBookmark className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => addToHistory(term)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors"
                                                title="Search again"
                                            >
                                                <FiRefreshCw className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Results */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <SearchResultsDisplay
                        results={getCurrentResults()}
                        onResultClick={handleResultClick}
                        onUserAction={handleUserAction}
                        onServiceAction={handleServiceAction}
                        onEmailAction={handleEmailAction}
                        className="p-6"
                        showActions={true}
                    />
                </div>
            </div>
        </div>
    );
};

// Main Search Page with Provider
export const SearchPage: React.FC = () => {
    return (
        <SearchProvider>
            <SearchPageContent />
        </SearchProvider>
    );
};

export default SearchPage;
