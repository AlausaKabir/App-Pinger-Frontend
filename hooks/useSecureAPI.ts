import { useState, useCallback, useRef } from "react";
import { secureAPI } from "../utils/secureAPI";
import { ValidationMiddleware, SecuritySchemas } from "../utils/security";
import { z } from "zod";

// 🔐 SECURE API HOOK
export function useSecureAPI<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const execute = useCallback(
    async <R = T>(
      apiCall: () => Promise<R>,
      validationSchema?: z.ZodSchema<any>
    ): Promise<R | null> => {
      try {
        // Cancel any ongoing request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        const result = await apiCall();

        // Validate response if schema provided
        if (validationSchema && result) {
          const validation = ValidationMiddleware.validateForm(validationSchema, result);
          if (!validation.success) {
            throw new Error(`Invalid response: ${validation.errors?.join(", ")}`);
          }
          setData(validation.data as T);
          return validation.data as R;
        }

        setData(result as T);
        return result;
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          const errorMessage = err.message || "An unexpected error occurred";
          setError(errorMessage);
          console.error("Secure API call failed:", err);
        }
        return null;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    []
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    loading,
    error,
    data,
    execute,
    cancel,
    clearError,
  };
}

// 🔐 SPECIFIC SECURE API HOOKS

export function useSecureAuth() {
  const api = useSecureAPI();

  const login = useCallback(
    (credentials: { email: string; password: string }) => {
      return api.execute(
        () => secureAPI.post("/auth/login", credentials),
        SecuritySchemas.loginSchema
      );
    },
    [api]
  );

  const register = useCallback(
    (userData: { email: string; password: string; confirmPassword: string }) => {
      return api.execute(
        () => secureAPI.post("/auth/register", userData),
        SecuritySchemas.registerSchema
      );
    },
    [api]
  );

  const refreshToken = useCallback(() => {
    return api.execute(() => secureAPI.post("/auth/refresh"));
  }, [api]);

  const logout = useCallback(() => {
    return api.execute(() => secureAPI.post("/auth/logout"));
  }, [api]);

  return {
    ...api,
    login,
    register,
    refreshToken,
    logout,
  };
}

export function useSecureUsers() {
  const api = useSecureAPI();

  const getUsers = useCallback(
    (params?: { page?: number; limit?: number; search?: string }) => {
      const searchParams: Record<string, string> = {};

      if (params?.page) searchParams.page = params.page.toString();
      if (params?.limit) searchParams.limit = params.limit.toString();
      if (params?.search) searchParams.search = params.search;

      return api.execute(() => secureAPI.get("/user", searchParams));
    },
    [api]
  );

  const getUserById = useCallback(
    (id: string) => {
      return api.execute(() => secureAPI.get(`/user/${id}`));
    },
    [api]
  );

  const updateUser = useCallback(
    (id: string, userData: any) => {
      return api.execute(() => secureAPI.put(`/user/${id}`, userData));
    },
    [api]
  );

  const deleteUser = useCallback(
    (id: string) => {
      return api.execute(() => secureAPI.delete(`/user/${id}`));
    },
    [api]
  );

  const getUserStats = useCallback(() => {
    return api.execute(() => secureAPI.get("/user/stats"));
  }, [api]);

  return {
    ...api,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserStats,
  };
}

export function useSecureServices() {
  const api = useSecureAPI();

  const getServices = useCallback(() => {
    return api.execute(() => secureAPI.get("/service-check"));
  }, [api]);

  const addService = useCallback(
    (serviceData: { name: string; url: string; description?: string }) => {
      return api.execute(
        () => secureAPI.post("/service-check", serviceData),
        SecuritySchemas.serviceSchema
      );
    },
    [api]
  );

  const updateService = useCallback(
    (id: string, serviceData: any) => {
      return api.execute(
        () => secureAPI.put(`/service-check/${id}`, serviceData),
        SecuritySchemas.serviceSchema
      );
    },
    [api]
  );

  const deleteService = useCallback(
    (id: string) => {
      return api.execute(() => secureAPI.delete(`/service-check/${id}`));
    },
    [api]
  );

  return {
    ...api,
    getServices,
    addService,
    updateService,
    deleteService,
  };
}

export function useSecureEmail() {
  const api = useSecureAPI();

  const getEmailConfig = useCallback(() => {
    return api.execute(() => secureAPI.get("/email/config"));
  }, [api]);

  const updateEmailConfig = useCallback(
    (config: { email: string; type: string; isActive: boolean }) => {
      return api.execute(
        () => secureAPI.put("/email/config", config),
        SecuritySchemas.emailConfigSchema
      );
    },
    [api]
  );

  const testEmail = useCallback(
    (emailData: any) => {
      return api.execute(() => secureAPI.post("/email/test", emailData));
    },
    [api]
  );

  return {
    ...api,
    getEmailConfig,
    updateEmailConfig,
    testEmail,
  };
}

// 🔐 SEARCH HOOK WITH DEBOUNCING
export function useSecureSearch(searchEndpoint: string, debounceMs: number = 500) {
  const api = useSecureAPI();
  const [query, setQuery] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback(
    (searchQuery: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setQuery(searchQuery);

      if (!searchQuery.trim()) {
        api.execute(() => secureAPI.get(searchEndpoint));
        return;
      }

      // Validate search query
      const validation = ValidationMiddleware.validateForm(SecuritySchemas.searchSchema, {
        query: searchQuery,
        page: 1,
        limit: 10,
      });

      if (!validation.success) {
        api.clearError();
        return;
      }

      timeoutRef.current = setTimeout(() => {
        api.execute(() => secureAPI.get(searchEndpoint, { search: validation.data!.query }));
      }, debounceMs);
    },
    [api, searchEndpoint, debounceMs]
  );

  return {
    ...api,
    query,
    search,
  };
}
