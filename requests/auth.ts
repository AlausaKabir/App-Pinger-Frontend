import { API } from "@/api";
import { storeToken } from "@/api/crypto";

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
    console.log("🔍 API Base URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("🔍 Login request to:", "/auth/login");
    console.log("🔍 Credentials:", { email: credentials.email, password: "***" });

    const response = await API.post("/auth/login", credentials);

    console.log("✅ Login response:", response.data);

    // Store token if login successful
    if (response.data.statusCode === 200 && response.data.data.token) {
      storeToken(response.data.data.token);
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ Login request failed:", error);
    console.error("❌ Error response:", error.response?.data);
    throw error;
  }
};

export const registerUser = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await API.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Registration request failed:", error);
    throw error;
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
