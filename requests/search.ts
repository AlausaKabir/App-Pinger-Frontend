import { secureAPI } from "@/utils/secureAPI";
import { InputSanitizer } from "@/utils/security";
import { apiCache } from "@/utils/performance";
import {
  UserSearchParams,
  ServiceSearchParams,
  EmailSearchParams,
  GlobalSearchParams,
  UserWithStats,
  ServiceWithUser,
  NotificationEmail,
  PaginatedResponse,
  GlobalSearchResult,
  QuickSearchResult,
} from "@/types/search.types";

// Helper types for API responses
interface ApiResponse<T> {
  statusCode: number;
  status: string;
  message: string;
  data: T;
  pagination?: any;
}

// Cache keys for search results
const SEARCH_CACHE_KEYS = {
  USER_SEARCH: "user_search",
  SERVICE_SEARCH: "service_search",
  EMAIL_SEARCH: "email_search",
  GLOBAL_SEARCH: "global_search",
  QUICK_SEARCH: "quick_search",
} as const;

// Cache TTL (Time To Live) in milliseconds
const SEARCH_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Helper function to sanitize search params
const sanitizeSearchParams = (params: any) => {
  const sanitized = { ...params };
  if (sanitized.search) {
    sanitized.search = InputSanitizer.sanitizeInput(sanitized.search);
  }
  return sanitized;
};

// ====== USER SEARCH API ======
export const searchUsers = async (
  params: UserSearchParams
): Promise<PaginatedResponse<UserWithStats>> => {
  // Input validation and sanitization
  const sanitizedParams = sanitizeSearchParams(params);

  const queryParams = new URLSearchParams();

  if (sanitizedParams.search) {
    queryParams.set("search", sanitizedParams.search);
  }
  if (sanitizedParams.role) queryParams.set("role", sanitizedParams.role);
  if (sanitizedParams.sortBy) queryParams.set("sortBy", sanitizedParams.sortBy);
  if (sanitizedParams.sortOrder) queryParams.set("sortOrder", sanitizedParams.sortOrder);
  if (sanitizedParams.page) queryParams.set("page", sanitizedParams.page.toString());
  if (sanitizedParams.limit) queryParams.set("limit", sanitizedParams.limit.toString());

  try {
    const response = (await secureAPI.get(
      `/users/search?${queryParams.toString()}`
    )) as ApiResponse<UserWithStats[]>;

    return {
      data: response.data,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error("User search failed:", error);
    throw error;
  }
};

// ====== SERVICE SEARCH API ======
export const searchServices = async (
  params: ServiceSearchParams
): Promise<PaginatedResponse<ServiceWithUser>> => {
  const sanitizedParams = sanitizeSearchParams(params);

  const queryParams = new URLSearchParams();

  if (sanitizedParams.search) {
    queryParams.set("search", sanitizedParams.search);
  }
  if (sanitizedParams.status) queryParams.set("status", sanitizedParams.status);
  if (sanitizedParams.userId) queryParams.set("userId", sanitizedParams.userId);
  if (sanitizedParams.sortBy) queryParams.set("sortBy", sanitizedParams.sortBy);
  if (sanitizedParams.sortOrder) queryParams.set("sortOrder", sanitizedParams.sortOrder);
  if (sanitizedParams.page) queryParams.set("page", sanitizedParams.page.toString());
  if (sanitizedParams.limit) queryParams.set("limit", sanitizedParams.limit.toString());

  try {
    const response = (await secureAPI.get(
      `/service-check/search?${queryParams.toString()}`
    )) as ApiResponse<ServiceWithUser[]>;

    return {
      data: response.data,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error("Service search failed:", error);
    throw error;
  }
};

// ====== EMAIL SEARCH API ======
export const searchEmails = async (
  params: EmailSearchParams
): Promise<PaginatedResponse<NotificationEmail>> => {
  const sanitizedParams = sanitizeSearchParams(params);

  const queryParams = new URLSearchParams();

  if (sanitizedParams.search) {
    queryParams.set("search", sanitizedParams.search);
  }
  if (sanitizedParams.isActive !== undefined)
    queryParams.set("isActive", sanitizedParams.isActive.toString());
  if (sanitizedParams.sortBy) queryParams.set("sortBy", sanitizedParams.sortBy);
  if (sanitizedParams.sortOrder) queryParams.set("sortOrder", sanitizedParams.sortOrder);
  if (sanitizedParams.page) queryParams.set("page", sanitizedParams.page.toString());
  if (sanitizedParams.limit) queryParams.set("limit", sanitizedParams.limit.toString());

  try {
    const response = (await secureAPI.get(
      `/emails/search?${queryParams.toString()}`
    )) as ApiResponse<NotificationEmail[]>;

    return {
      data: response.data,
      pagination: response.pagination,
    };
  } catch (error) {
    console.error("Email search failed:", error);
    throw error;
  }
};

// ====== GLOBAL SEARCH API ======
export const globalSearch = async (params: GlobalSearchParams): Promise<GlobalSearchResult> => {
  // Input validation - search term is required
  if (!params.search || params.search.trim().length < 2) {
    throw new Error("Search term must be at least 2 characters long");
  }

  const sanitizedParams = {
    ...params,
    search: InputSanitizer.sanitizeInput(params.search),
  };

  const queryParams = new URLSearchParams();
  queryParams.set("search", sanitizedParams.search);

  if (sanitizedParams.entities?.length) {
    queryParams.set("entities", sanitizedParams.entities.join(","));
  }
  if (sanitizedParams.page) queryParams.set("page", sanitizedParams.page.toString());
  if (sanitizedParams.limit) queryParams.set("limit", sanitizedParams.limit.toString());

  try {
    const response = (await secureAPI.get(
      `/search/global?${queryParams.toString()}`
    )) as ApiResponse<GlobalSearchResult>;

    return response.data;
  } catch (error) {
    console.error("Global search failed:", error);
    throw error;
  }
};

// ====== QUICK SEARCH API (Auto-complete) ======
export const quickSearch = async (
  searchTerm: string,
  limit: number = 5
): Promise<QuickSearchResult> => {
  // Quick validation for auto-complete
  if (!searchTerm || searchTerm.trim().length < 2) {
    return {
      users: [],
      services: [],
      emails: [],
      totalResults: 0,
    };
  }

  const sanitizedTerm = InputSanitizer.sanitizeInput(searchTerm);
  const queryParams = new URLSearchParams();
  queryParams.set("q", sanitizedTerm);
  queryParams.set("limit", limit.toString());

  try {
    const response = (await secureAPI.get(
      `/search/quick?${queryParams.toString()}`
    )) as ApiResponse<QuickSearchResult>;

    return response.data;
  } catch (error) {
    console.error("Quick search failed:", error);
    // Return empty results on error for auto-complete
    return {
      users: [],
      services: [],
      emails: [],
      totalResults: 0,
    };
  }
};

// ====== SEARCH UTILITIES ======

// Clear search cache
export const clearSearchCache = () => {
  Object.values(SEARCH_CACHE_KEYS).forEach((key) => {
    apiCache.delete(key);
  });
};

// Search suggestions (based on cache and history)
export const getSearchSuggestions = async (searchTerm: string, entity?: string) => {
  // This would typically come from a backend endpoint or local storage
  // For now, return empty array - can be enhanced later
  return [];
};

// Export search cache keys for external use
export { SEARCH_CACHE_KEYS, SEARCH_CACHE_TTL };
