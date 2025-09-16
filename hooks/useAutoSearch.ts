"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { quickSearch, globalSearch } from "@/requests/search";
import {
  QuickSearchResult,
  GlobalSearchResult,
  GlobalSearchParams,
  AutoSearchConfig,
  DEFAULT_AUTO_SEARCH_CONFIG,
} from "@/types/search.types";
import { useDebounce } from "@/hooks/useDebounce";

interface UseAutoSearchOptions {
  config?: Partial<AutoSearchConfig>;
  onSearchTrigger?: (searchTerm: string) => void;
  onResults?: (results: QuickSearchResult | GlobalSearchResult) => void;
}

export const useAutoSearch = (options: UseAutoSearchOptions = {}) => {
  const config = { ...DEFAULT_AUTO_SEARCH_CONFIG, ...options.config };

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [quickResults, setQuickResults] = useState<QuickSearchResult | null>(null);
  const [globalResults, setGlobalResults] = useState<GlobalSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Track character count and spacebar presses
  const characterCountRef = useRef(0);
  const lastSpacebarTimeRef = useRef<number>(0);

  // Debounced search term for API calls
  const debouncedSearchTerm = useDebounce(searchTerm, config.debounceMs);

  // Quick search for auto-complete (triggered by character count)
  const performQuickSearch = useCallback(
    async (term: string) => {
      if (!config.enableQuickSearch || term.length < 2) {
        setQuickResults(null);
        return;
      }

      try {
        setIsSearching(true);
        setError(null);

        const results = await quickSearch(term, config.maxQuickResults);
        setQuickResults(results);

        if (options.onResults) {
          options.onResults(results);
        }

        if (options.onSearchTrigger && !hasTriggered) {
          options.onSearchTrigger(term);
          setHasTriggered(true);
        }
      } catch (err) {
        console.error("Quick search failed:", err);
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setIsSearching(false);
      }
    },
    [config.enableQuickSearch, config.maxQuickResults, options, hasTriggered]
  );

  // Global search for full results (triggered by spacebar + condition)
  const performGlobalSearch = useCallback(
    async (term: string, params?: Partial<GlobalSearchParams>) => {
      if (term.length < 2) return;

      try {
        setIsSearching(true);
        setError(null);

        const searchParams: GlobalSearchParams = {
          search: term,
          entities: ["users", "services", "emails"],
          ...params,
        };

        const results = await globalSearch(searchParams);
        setGlobalResults(results);

        if (options.onResults) {
          options.onResults(results);
        }

        if (options.onSearchTrigger && !hasTriggered) {
          options.onSearchTrigger(term);
          setHasTriggered(true);
        }
      } catch (err) {
        console.error("Global search failed:", err);
        setError(err instanceof Error ? err.message : "Search failed");
      } finally {
        setIsSearching(false);
      }
    },
    [options, hasTriggered]
  );

  // Effect to handle debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length >= config.triggerLength) {
      performQuickSearch(debouncedSearchTerm);
    } else {
      setQuickResults(null);
    }
  }, [debouncedSearchTerm, config.triggerLength, performQuickSearch]);

  // Handle input change with auto-trigger logic
  const handleInputChange = useCallback((value: string) => {
    setSearchTerm(value);
    characterCountRef.current = value.length;

    // Reset trigger state when term is cleared
    if (value.length === 0) {
      setHasTriggered(false);
      setQuickResults(null);
      setGlobalResults(null);
    }
  }, []);

  // Handle spacebar press for enhanced search trigger
  const handleSpacebarPress = useCallback(() => {
    if (!config.enableSpacebarTrigger) return;

    const currentTime = Date.now();
    lastSpacebarTimeRef.current = currentTime;

    const currentTerm = searchTerm.trim();

    // Trigger global search on spacebar if conditions are met
    if (currentTerm.length >= config.triggerLength) {
      performGlobalSearch(currentTerm);
    }
  }, [config.enableSpacebarTrigger, config.triggerLength, searchTerm, performGlobalSearch]);

  // Keyboard event handler for the input
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === " " && searchTerm.trim()) {
        handleSpacebarPress();
      }

      // Handle Enter key for immediate search
      if (event.key === "Enter") {
        const currentTerm = searchTerm.trim();
        if (currentTerm.length >= 2) {
          performGlobalSearch(currentTerm);
        }
      }

      // Handle Escape to clear results
      if (event.key === "Escape") {
        clearResults();
      }
    },
    [searchTerm, handleSpacebarPress, performGlobalSearch]
  );

  // Manual search trigger
  const triggerSearch = useCallback(
    (term?: string, params?: Partial<GlobalSearchParams>) => {
      const searchString = term || searchTerm;
      if (searchString.trim().length >= 2) {
        performGlobalSearch(searchString.trim(), params);
      }
    },
    [searchTerm, performGlobalSearch]
  );

  // Clear all results
  const clearResults = useCallback(() => {
    setQuickResults(null);
    setGlobalResults(null);
    setError(null);
    setHasTriggered(false);
  }, []);

  // Reset search state
  const resetSearch = useCallback(() => {
    setSearchTerm("");
    clearResults();
    characterCountRef.current = 0;
  }, [clearResults]);

  // Check if auto-search should trigger based on current conditions
  const shouldAutoTrigger = useCallback(() => {
    const currentLength = characterCountRef.current;
    return currentLength >= config.triggerLength && !hasTriggered;
  }, [config.triggerLength, hasTriggered]);

  return {
    // State
    searchTerm,
    isSearching,
    quickResults,
    globalResults,
    error,
    hasTriggered,

    // Actions
    handleInputChange,
    handleKeyDown,
    handleSpacebarPress,
    triggerSearch,
    clearResults,
    resetSearch,

    // Utilities
    shouldAutoTrigger,
    config,

    // Statistics
    characterCount: characterCountRef.current,
    isQuickSearchEnabled: config.enableQuickSearch,
    isSpacebarTriggerEnabled: config.enableSpacebarTrigger,
  };
};

// Separate hook for advanced search functionality
export const useAdvancedSearch = () => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  // Add to search history
  const addToHistory = useCallback(
    (term: string) => {
      if (term.trim() && !searchHistory.includes(term)) {
        setSearchHistory((prev) => [term, ...prev.slice(0, 9)]); // Keep last 10
      }
    },
    [searchHistory]
  );

  // Toggle advanced mode
  const toggleAdvancedMode = useCallback(() => {
    setIsAdvancedMode((prev) => !prev);
  }, []);

  // Generate suggestions based on history
  const generateSuggestions = useCallback(
    (currentTerm: string) => {
      if (currentTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      const filtered = searchHistory.filter(
        (term) => term.toLowerCase().includes(currentTerm.toLowerCase()) && term !== currentTerm
      );

      setSuggestions(filtered.slice(0, 5));
    },
    [searchHistory]
  );

  return {
    searchHistory,
    suggestions,
    isAdvancedMode,
    addToHistory,
    toggleAdvancedMode,
    generateSuggestions,
  };
};
