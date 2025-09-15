import { secureAPI } from "@/utils/secureAPI";
import { AuthSecurity, ValidationMiddleware, SecuritySchemas } from "@/utils/security";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  statusCode: number;
  status: string;
  message: string;
  data: {
    token?: string;
    access_token?: string;
    user?: any;
  };
}

export const loginUser = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try {
    // Validate and sanitize input
    const validation = ValidationMiddleware.validateForm(SecuritySchemas.loginSchema, credentials);
    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.errors?.join(", ")}`);
    }

    console.log("🔍 Secure login request to:", "/auth/login");
    console.log("🔍 Sanitized email:", validation.data?.email);

    const response = await secureAPI.post<AuthResponse>("/auth/login", validation.data);

    console.log("✅ Login response status:", response.statusCode);

    // Secure token storage if login successful
    if (response.statusCode === 200 && response.data.token) {
      AuthSecurity.storeToken(response.data.token);
    }

    return response;
  } catch (error: any) {
    console.error("❌ Secure login failed:", error.message);
    throw new Error(error.message || "Login failed");
  }
};

export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    // Validate and sanitize input
    const validation = ValidationMiddleware.validateForm(SecuritySchemas.registerSchema, {
      ...userData,
      confirmPassword: userData.password,
    });

    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.errors?.join(", ")}`);
    }

    console.log("🔍 Secure registration request to:", "/auth/signup");
    console.log("🔍 Sanitized email:", validation.data?.email);

    const response = await secureAPI.post<AuthResponse>("/auth/signup", {
      email: validation.data?.email,
      password: validation.data?.password,
    });

    console.log("✅ Registration response status:", response.statusCode);

    return response;
  } catch (error: any) {
    console.error("❌ Secure registration failed:", error.message);
    throw new Error(error.message || "Registration failed");
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await secureAPI.post("/auth/logout");
    AuthSecurity.clearTokens();
    console.log("✅ User logged out securely");
  } catch (error: any) {
    console.error("❌ Logout failed:", error.message);
    // Clear tokens anyway for security
    AuthSecurity.clearTokens();
  }
};

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const response = await secureAPI.post<AuthResponse>("/auth/refresh");

    if (response.statusCode === 200 && response.data.token) {
      AuthSecurity.storeToken(response.data.token);
    }

    return response;
  } catch (error: any) {
    console.error("❌ Token refresh failed:", error.message);
    AuthSecurity.clearTokens();
    throw new Error("Session expired. Please login again.");
  }
};

// Legacy function for backward compatibility
export async function login(credential: { emailOrPhone: string; password: string }) {
  try {
    const response = await loginUser({
      email: credential.emailOrPhone,
      password: credential.password,
    });

    if (response?.statusCode === 200) {
      return {
        success: true,
        message: response.message,
        token: response.data.token || response.data.access_token,
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.message,
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
