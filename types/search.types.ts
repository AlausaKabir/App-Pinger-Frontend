// Advanced Search Types
export interface SearchPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: SearchPagination;
}

// User Search Types
export interface UserSearchParams {
  search?: string;
  role?: "USER" | "ADMIN" | "SUPERADMIN";
  sortBy?: "email" | "role" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface UserWithStats {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt: string;
  _count: {
    services: number;
  };
}

// Service Search Types
export interface ServiceSearchParams {
  search?: string;
  status?: "UP" | "DOWN";
  userId?: string;
  sortBy?: "name" | "url" | "healthStatus" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

// Service interfaces
export interface Service {
  id: string;
  name: string;
  url: string;
  healthStatus: "UP" | "DOWN" | "UNKNOWN";
  createdAt: string;
  updatedAt: string;
  checkInterval?: number;
}

export interface ServiceWithUser extends Service {
  user: {
    id: string;
    email: string;
  };
}

// Email Search Types
export interface EmailSearchParams {
  search?: string;
  isActive?: boolean;
  sortBy?: "email" | "isActive" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface NotificationEmail {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Global Search Types
export interface GlobalSearchOptions {
  entities?: ("users" | "services" | "emails")[];
  page?: number;
  limit?: number;
}

export interface GlobalSearchParams {
  search: string;
  entities?: ("users" | "services" | "emails")[];
  page?: number;
  limit?: number;
}

// Enum types
export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";
export type ServiceStatus = "UP" | "DOWN" | "UNKNOWN";

// Search filters interface
export interface SearchFilters {
  entities?: ("users" | "services" | "emails")[];
  userRoles?: UserRole[];
  serviceStatuses?: ServiceStatus[];
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GlobalSearchResult {
  users?: UserWithStats[];
  services?: ServiceWithUser[];
  emails?: NotificationEmail[];
  totalResults: number;
}

// Quick Search Types (for auto-complete)
export interface QuickSearchResult {
  users: UserWithStats[];
  services: ServiceWithUser[];
  emails: NotificationEmail[];
  totalResults: number;
}

// Search Response Types
export interface SearchResponse<T> {
  statusCode: number;
  status: string;
  message: string;
  data: T[];
  pagination: SearchPagination;
}

export interface GlobalSearchResponse {
  statusCode: number;
  status: string;
  message: string;
  data: GlobalSearchResult;
}

export interface QuickSearchResponse {
  statusCode: number;
  status: string;
  message: string;
  data: QuickSearchResult;
}

// Search Filter Options
export interface SearchFilterOptions {
  roles: Array<{ value: string; label: string }>;
  statuses: Array<{ value: string; label: string }>;
  sortOptions: Array<{ value: string; label: string }>;
  entities: Array<{ value: string; label: string }>;
}

// Search State for Context
export interface SearchState {
  isSearching: boolean;
  hasSearched: boolean;
  searchTerm: string;
  filters: Record<string, any>;
  results: any[];
  pagination?: SearchPagination;
  error?: string;
}

// Auto-Search Configuration
export interface AutoSearchConfig {
  triggerLength: number; // 5 characters
  debounceMs: number; // 300ms
  enableSpacebarTrigger: boolean;
  enableQuickSearch: boolean;
  maxQuickResults: number;
}

export const DEFAULT_AUTO_SEARCH_CONFIG: AutoSearchConfig = {
  triggerLength: 5,
  debounceMs: 300,
  enableSpacebarTrigger: true,
  enableQuickSearch: true,
  maxQuickResults: 5,
};

// Search History Types
export interface SearchHistoryItem {
  id: string;
  searchTerm: string;
  entity: string;
  timestamp: string;
  resultCount: number;
}

export interface SearchSuggestion {
  text: string;
  type: "recent" | "popular" | "suggestion";
  count?: number;
}
