import { AuthSecurity, APISecurity, ValidationMiddleware } from "./security";

// 🔐 SECURE API CLIENT
export class SecureAPIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3800") {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    };
  }

  /**
   * Make a secure GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(endpoint, this.baseURL);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    return APISecurity.secureRequest<T>(
      url.toString(),
      {
        method: "GET",
        headers: AuthSecurity.getSecureHeaders(this.defaultHeaders),
      },
      `GET:${endpoint}`
    );
  }

  /**
   * Make a secure POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const sanitizedData = data ? ValidationMiddleware.sanitizeApiRequest(data) : undefined;

    return APISecurity.secureRequest<T>(
      `${this.baseURL}${endpoint}`,
      {
        method: "POST",
        headers: AuthSecurity.getSecureHeaders(this.defaultHeaders),
        body: sanitizedData ? JSON.stringify(sanitizedData) : undefined,
      },
      `POST:${endpoint}`
    );
  }

  /**
   * Make a secure PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const sanitizedData = data ? ValidationMiddleware.sanitizeApiRequest(data) : undefined;

    return APISecurity.secureRequest<T>(
      `${this.baseURL}${endpoint}`,
      {
        method: "PUT",
        headers: AuthSecurity.getSecureHeaders(this.defaultHeaders),
        body: sanitizedData ? JSON.stringify(sanitizedData) : undefined,
      },
      `PUT:${endpoint}`
    );
  }

  /**
   * Make a secure DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return APISecurity.secureRequest<T>(
      `${this.baseURL}${endpoint}`,
      {
        method: "DELETE",
        headers: AuthSecurity.getSecureHeaders(this.defaultHeaders),
      },
      `DELETE:${endpoint}`
    );
  }
}

// Export singleton instance
export const secureAPI = new SecureAPIClient();
