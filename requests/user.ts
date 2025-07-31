import { API } from "@/api";

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
    const params = new URLSearchParams();
    if (query?.page) params.append("page", query.page.toString());
    if (query?.limit) params.append("limit", query.limit.toString());
    if (query?.role) params.append("role", query.role);
    if (query?.search) params.append("search", query.search);

    const response = await API.get(`/users?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Get users request failed:", error);
    throw error;
  }
};

// Get user statistics (SuperAdmin only)
export const getUserStats = async (): Promise<UserResponse> => {
  try {
    const response = await API.get("/users/stats");
    return response.data;
  } catch (error) {
    console.error("Get user stats request failed:", error);
    throw error;
  }
};

// Get user by ID (SuperAdmin only)
export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get user by ID request failed:", error);
    throw error;
  }
};

// Update user role (SuperAdmin only)
export const updateUserRole = async (
  userId: string,
  roleData: UpdateUserRoleRequest
): Promise<UserResponse> => {
  try {
    const response = await API.patch(`/users/role`, {
      userId,
      ...roleData,
    });
    return response.data;
  } catch (error) {
    console.error("Update user role request failed:", error);
    throw error;
  }
};
