"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
    SearchState,
    UserWithStats,
    ServiceWithUser,
    NotificationEmail,
    GlobalSearchResult,
    QuickSearchResult,
    SearchPagination,
    AutoSearchConfig,
    DEFAULT_AUTO_SEARCH_CONFIG,
} from '@/types/search.types';

// Search Action Types
type SearchAction =
    | { type: 'SEARCH_START'; payload: { searchTerm: string; entity?: string } }
    | { type: 'SEARCH_SUCCESS'; payload: { results: any[]; pagination?: SearchPagination; entity: string } }
    | { type: 'SEARCH_ERROR'; payload: { error: string } }
    | { type: 'QUICK_SEARCH_SUCCESS'; payload: { results: QuickSearchResult } }
    | { type: 'GLOBAL_SEARCH_SUCCESS'; payload: { results: GlobalSearchResult } }
    | { type: 'CLEAR_RESULTS' }
    | { type: 'SET_SEARCH_TERM'; payload: { searchTerm: string } }
    | { type: 'SET_FILTERS'; payload: { filters: Record<string, any> } }
    | { type: 'RESET_SEARCH' };

// Initial Search State
const initialSearchState: SearchState = {
    isSearching: false,
    hasSearched: false,
    searchTerm: '',
    filters: {},
    results: [],
    pagination: undefined,
    error: undefined,
};

// Search Reducer
const searchReducer = (state: SearchState, action: SearchAction): SearchState => {
    switch (action.type) {
        case 'SEARCH_START':
            return {
                ...state,
                isSearching: true,
                searchTerm: action.payload.searchTerm,
                error: undefined,
            };

        case 'SEARCH_SUCCESS':
            return {
                ...state,
                isSearching: false,
                hasSearched: true,
                results: action.payload.results,
                pagination: action.payload.pagination,
                error: undefined,
            };

        case 'SEARCH_ERROR':
            return {
                ...state,
                isSearching: false,
                error: action.payload.error,
                results: [],
            };

        case 'QUICK_SEARCH_SUCCESS':
            return {
                ...state,
                isSearching: false,
                hasSearched: true,
                results: [
                    ...action.payload.results.users,
                    ...action.payload.results.services,
                    ...action.payload.results.emails,
                ],
                error: undefined,
            };

        case 'GLOBAL_SEARCH_SUCCESS':
            return {
                ...state,
                isSearching: false,
                hasSearched: true,
                results: [
                    ...(action.payload.results.users || []),
                    ...(action.payload.results.services || []),
                    ...(action.payload.results.emails || []),
                ],
                error: undefined,
            };

        case 'CLEAR_RESULTS':
            return {
                ...state,
                results: [],
                pagination: undefined,
                error: undefined,
                hasSearched: false,
            };

        case 'SET_SEARCH_TERM':
            return {
                ...state,
                searchTerm: action.payload.searchTerm,
            };

        case 'SET_FILTERS':
            return {
                ...state,
                filters: { ...state.filters, ...action.payload.filters },
            };

        case 'RESET_SEARCH':
            return initialSearchState;

        default:
            return state;
    }
};

// Search Context Type
interface SearchContextType {
    // State
    searchState: SearchState;
    autoSearchConfig: AutoSearchConfig;

    // Quick search results (for auto-complete)
    quickResults: QuickSearchResult | null;

    // Global search results
    globalResults: GlobalSearchResult | null;

    // Actions
    startSearch: (searchTerm: string, entity?: string) => void;
    setSearchResults: (results: any[], pagination?: SearchPagination, entity?: string) => void;
    setQuickSearchResults: (results: QuickSearchResult) => void;
    setGlobalSearchResults: (results: GlobalSearchResult) => void;
    setSearchError: (error: string) => void;
    clearResults: () => void;
    setSearchTerm: (searchTerm: string) => void;
    setFilters: (filters: Record<string, any>) => void;
    resetSearch: () => void;

    // Utilities
    updateAutoSearchConfig: (config: Partial<AutoSearchConfig>) => void;

    // Search History
    searchHistory: string[];
    addToHistory: (term: string) => void;
    clearHistory: () => void;
}

// Create Search Context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Search Provider Props
interface SearchProviderProps {
    children: ReactNode;
    config?: Partial<AutoSearchConfig>;
}

// Search Context Provider
export const SearchProvider: React.FC<SearchProviderProps> = ({
    children,
    config = {}
}) => {
    const [searchState, dispatch] = useReducer(searchReducer, initialSearchState);
    const [autoSearchConfig, setAutoSearchConfig] = React.useState<AutoSearchConfig>({
        ...DEFAULT_AUTO_SEARCH_CONFIG,
        ...config,
    });
    const [quickResults, setQuickResults] = React.useState<QuickSearchResult | null>(null);
    const [globalResults, setGlobalResults] = React.useState<GlobalSearchResult | null>(null);
    const [searchHistory, setSearchHistory] = React.useState<string[]>([]);

    // Search Actions
    const startSearch = React.useCallback((searchTerm: string, entity?: string) => {
        dispatch({ type: 'SEARCH_START', payload: { searchTerm, entity } });
    }, []);

    const setSearchResults = React.useCallback((
        results: any[],
        pagination?: SearchPagination,
        entity: string = 'mixed'
    ) => {
        dispatch({
            type: 'SEARCH_SUCCESS',
            payload: { results, pagination, entity }
        });
    }, []);

    const setQuickSearchResults = React.useCallback((results: QuickSearchResult) => {
        setQuickResults(results);
        dispatch({ type: 'QUICK_SEARCH_SUCCESS', payload: { results } });
    }, []);

    const setGlobalSearchResults = React.useCallback((results: GlobalSearchResult) => {
        setGlobalResults(results);
        dispatch({ type: 'GLOBAL_SEARCH_SUCCESS', payload: { results } });
    }, []);

    const setSearchError = React.useCallback((error: string) => {
        dispatch({ type: 'SEARCH_ERROR', payload: { error } });
    }, []);

    const clearResults = React.useCallback(() => {
        setQuickResults(null);
        setGlobalResults(null);
        dispatch({ type: 'CLEAR_RESULTS' });
    }, []);

    const setSearchTerm = React.useCallback((searchTerm: string) => {
        dispatch({ type: 'SET_SEARCH_TERM', payload: { searchTerm } });
    }, []);

    const setFilters = React.useCallback((filters: Record<string, any>) => {
        dispatch({ type: 'SET_FILTERS', payload: { filters } });
    }, []);

    const resetSearch = React.useCallback(() => {
        setQuickResults(null);
        setGlobalResults(null);
        dispatch({ type: 'RESET_SEARCH' });
    }, []);

    // Auto-search config update
    const updateAutoSearchConfig = React.useCallback((newConfig: Partial<AutoSearchConfig>) => {
        setAutoSearchConfig(prev => ({ ...prev, ...newConfig }));
    }, []);

    // Search history management
    const addToHistory = React.useCallback((term: string) => {
        if (term.trim() && !searchHistory.includes(term)) {
            setSearchHistory(prev => [term, ...prev.slice(0, 9)]); // Keep last 10
        }
    }, [searchHistory]);

    const clearHistory = React.useCallback(() => {
        setSearchHistory([]);
    }, []);

    const contextValue: SearchContextType = {
        // State
        searchState,
        autoSearchConfig,
        quickResults,
        globalResults,

        // Actions
        startSearch,
        setSearchResults,
        setQuickSearchResults,
        setGlobalSearchResults,
        setSearchError,
        clearResults,
        setSearchTerm,
        setFilters,
        resetSearch,

        // Utilities
        updateAutoSearchConfig,

        // Search History
        searchHistory,
        addToHistory,
        clearHistory,
    };

    return (
        <SearchContext.Provider value={contextValue}>
            {children}
        </SearchContext.Provider>
    );
};

// Hook to use Search Context
export const useSearchContext = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchProvider');
    }
    return context;
};

// Individual hooks for specific search types
export const useUserSearch = () => {
    const context = useSearchContext();
    return {
        users: context.globalResults?.users || context.quickResults?.users || [],
        isSearching: context.searchState.isSearching,
        error: context.searchState.error,
    };
};

export const useServiceSearch = () => {
    const context = useSearchContext();
    return {
        services: context.globalResults?.services || context.quickResults?.services || [],
        isSearching: context.searchState.isSearching,
        error: context.searchState.error,
    };
};

export const useEmailSearch = () => {
    const context = useSearchContext();
    return {
        emails: context.globalResults?.emails || context.quickResults?.emails || [],
        isSearching: context.searchState.isSearching,
        error: context.searchState.error,
    };
};
