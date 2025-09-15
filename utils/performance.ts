import { useState, useEffect, useCallback } from "react";

// API response caching utility
class APICache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    // Default 5 minutes
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((item, key) => {
      if (now - item.timestamp > item.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}

// Global cache instance
export const apiCache = new APICache();

// Periodic cleanup every 10 minutes
if (typeof window !== "undefined") {
  setInterval(() => {
    apiCache.cleanup();
  }, 10 * 60 * 1000);
}

// Request deduplication utility
class RequestDeduplicator {
  private pendingRequests = new Map<string, Promise<any>>();

  async dedupe<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    // If request is already pending, return the same promise
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Create new request
    const promise = requestFn().finally(() => {
      // Remove from pending when complete
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }
}

export const requestDeduplicator = new RequestDeduplicator();

// Enhanced API utility with caching and deduplication
export const optimizedApiRequest = async <T>(
  url: string,
  options: RequestInit = {},
  cacheConfig?: {
    enabled?: boolean;
    ttl?: number;
    key?: string;
  }
): Promise<T> => {
  const cacheKey = cacheConfig?.key || `${options.method || "GET"}-${url}`;

  // Try cache first (for GET requests)
  if (cacheConfig?.enabled && (!options.method || options.method === "GET")) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Use request deduplication
  return requestDeduplicator.dedupe(cacheKey, async () => {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Cache successful GET responses
    if (cacheConfig?.enabled && (!options.method || options.method === "GET")) {
      apiCache.set(cacheKey, data, cacheConfig.ttl);
    }

    return data;
  });
};

// Performance monitoring utility
export const withPerformanceMonitoring = <T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T => {
  return ((...args: any[]) => {
    const start = performance.now();
    const result = fn(...args);

    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`🚀 ${name} took ${end - start}ms`);
      });
    } else {
      const end = performance.now();
      console.log(`🚀 ${name} took ${end - start}ms`);
      return result;
    }
  }) as T;
};

// ⚠️ DEPRECATED: Use useSecureAPI from '@/hooks/useSecureAPI' instead
// This hook is kept for backward compatibility but lacks security features
// React hook for optimized API calls

/**
 * @deprecated Use useSecureAPI from '@/hooks/useSecureAPI' instead for secure API calls
 */
export const useOptimizedAPI = <T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  cacheConfig?: { enabled?: boolean; ttl?: number }
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Create cache key from dependencies
      const cacheKey = `useAPI-${JSON.stringify(dependencies)}`;

      let result: T;

      if (cacheConfig?.enabled) {
        const cached = apiCache.get(cacheKey);
        if (cached) {
          setData(cached);
          setLoading(false);
          return;
        }
      }

      result = await apiCall();

      if (cacheConfig?.enabled) {
        apiCache.set(cacheKey, result, cacheConfig.ttl);
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, dependencies);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
