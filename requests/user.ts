import { secureAPI } from "@/utils/secureAPI";
import { ValidationMiddleware, InputSanitizer } from "@/utils/security";
import { optimizedApiRequest, apiCache } from "@/utils/performance";

export interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  totalUsers: number;
  usersByRole: {
    USER: number;
    ADMIN: number;
    SUPERADMIN: number;
  };
}

export interface UpdateUserRoleRequest {
  role: "USER" | "ADMIN" | "SUPERADMIN";
}

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  role?: "USER" | "ADMIN" | "SUPERADMIN";
  search?: string;
}

export interface UserResponse {
  statusCode: number;
  status: string;
  message: string;
  data: User | User[] | UserStats;
}

export interface PaginatedUserResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Get all users (SuperAdmin only)
export const getUsers = async (query?: GetUsersQuery): Promise<PaginatedUserResponse> => {
  try {
    const searchParams: Record<string, string> = {};

    if (query?.page) searchParams.page = query.page.toString();
    if (query?.limit) searchParams.limit = query.limit.toString();
    if (query?.role) searchParams.role = query.role;
    if (query?.search) {
      // Sanitize search input
      searchParams.search = InputSanitizer.sanitizeInput(query.search);
    }

    const response = await secureAPI.get<PaginatedUserResponse>("/user", searchParams);
    return response;
  } catch (error: any) {
    console.error("❌ Secure get users failed:", error.message);
    throw new Error(error.message || "Failed to fetch users");
  }
};

// Get user statistics (SuperAdmin only) - Cached for 2 minutes
export const getUserStats = async (): Promise<UserResponse> => {
  try {
    const response = await optimizedApiRequest<UserResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/user/stats`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
        },
      },
      {
        enabled: true,
        ttl: 2 * 60 * 1000, // Cache for 2 minutes
        key: "user-stats",
      }
    );
    return response;
  } catch (error: any) {
    console.error("❌ Get user stats failed:", error.message);
    throw new Error(error.message || "Failed to fetch user statistics");
  }
};

// Get user by ID (SuperAdmin only)
export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    // Sanitize user ID
    const cleanUserId = InputSanitizer.removeDangerousChars(userId);
    if (!cleanUserId) {
      throw new Error("Invalid user ID");
    }

    const response = await secureAPI.get<UserResponse>(`/user/${cleanUserId}`);
    return response;
  } catch (error: any) {
    console.error("❌ Get user by ID failed:", error.message);
    throw new Error(error.message || "Failed to fetch user");
  }
};

// Update user role (SuperAdmin only)
export const updateUserRole = async (
  userId: string,
  roleData: UpdateUserRoleRequest
): Promise<UserResponse> => {
  try {
    // Sanitize inputs
    const cleanUserId = InputSanitizer.removeDangerousChars(userId);
    if (!cleanUserId) {
      throw new Error("Invalid user ID");
    }

    // Validate role
    if (!["USER", "ADMIN", "SUPERADMIN"].includes(roleData.role)) {
      throw new Error("Invalid role specified");
    }

    const sanitizedData = ValidationMiddleware.sanitizeApiRequest({
      userId: cleanUserId,
      ...roleData,
    });

    const response = await secureAPI.put<UserResponse>(`/user/role`, sanitizedData);

    // Clear user stats cache after role update
    apiCache.delete("user-stats");

    return response;
  } catch (error: any) {
    console.error("❌ Update user role failed:", error.message);
    throw new Error(error.message || "Failed to update user role");
  }
};

// Delete user (SuperAdmin only)
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // Sanitize user ID
    const cleanUserId = InputSanitizer.removeDangerousChars(userId);
    if (!cleanUserId) {
      throw new Error("Invalid user ID");
    }

    await secureAPI.delete(`/user/${cleanUserId}`);

    // Clear user stats cache after deletion
    apiCache.delete("user-stats");

    console.log("✅ User deleted successfully");
  } catch (error: any) {
    console.error("❌ Delete user failed:", error.message);
    throw new Error(error.message || "Failed to delete user");
  }
};
