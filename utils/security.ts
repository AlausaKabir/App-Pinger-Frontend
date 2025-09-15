import DOMPurify from "dompurify";
import validator from "validator";
import { z, ZodError } from "zod";

// 🛡️ INPUT SANITIZATION UTILITIES
class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  static sanitizeHtml(dirty: string): string {
    if (typeof window === "undefined") {
      // Server-side: basic HTML escaping
      return dirty
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;");
    }

    // Client-side: Use DOMPurify for comprehensive sanitization
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
    });
  }

  /**
   * Sanitize user input for database storage
   */
  static sanitizeInput(input: string): string {
    return validator.escape(validator.trim(input));
  }

  /**
   * Remove potentially dangerous characters
   */
  static removeDangerousChars(input: string): string {
    return input.replace(/[<>'"&%$#@!`~\{\}\[\]\\]/g, "");
  }

  /**
   * Sanitize email addresses
   */
  static sanitizeEmail(email: string): string {
    return validator.normalizeEmail(validator.trim(email.toLowerCase())) || "";
  }

  /**
   * Sanitize URLs
   */
  static sanitizeUrl(url: string): string {
    const trimmed = validator.trim(url);
    if (!validator.isURL(trimmed, { protocols: ["http", "https"], require_protocol: true })) {
      return "";
    }
    return trimmed;
  }
}

// 🔍 INPUT VALIDATION SCHEMAS
const SecuritySchemas = {
  // User authentication
  loginSchema: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .min(5, "Email must be at least 5 characters")
      .max(100, "Email must not exceed 100 characters")
      .transform((email) => validator.normalizeEmail(email) || ""),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
  }),

  // User registration
  registerSchema: z
    .object({
      email: z
        .string()
        .email("Invalid email format")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email must not exceed 100 characters")
        .transform((email) => validator.normalizeEmail(email) || ""),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must not exceed 128 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Password must contain uppercase, lowercase, number, and special character"
        ),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),

  // Email configuration
  emailConfigSchema: z.object({
    email: z
      .string()
      .email("Invalid email format")
      .transform((email) => validator.normalizeEmail(email) || ""),
    type: z.enum(["NOTIFICATION", "ALERT", "SYSTEM"]),
    isActive: z.boolean(),
  }),

  // Service monitoring
  serviceSchema: z.object({
    name: z
      .string()
      .min(1, "Service name is required")
      .max(100, "Service name must not exceed 100 characters")
      .regex(/^[a-zA-Z0-9\s\-_]+$/, "Service name contains invalid characters"),
    url: z
      .string()
      .url("Invalid URL format")
      .refine(
        (url) => validator.isURL(url, { protocols: ["http", "https"], require_protocol: true }),
        "URL must use HTTP or HTTPS protocol"
      ),
    description: z
      .string()
      .max(500, "Description must not exceed 500 characters")
      .optional()
      .transform((desc) => (desc ? InputSanitizer.sanitizeHtml(desc) : undefined)),
  }),

  // Search query validation
  searchSchema: z.object({
    query: z
      .string()
      .min(1, "Search query cannot be empty")
      .max(100, "Search query must not exceed 100 characters")
      .transform((query) => InputSanitizer.removeDangerousChars(query)),
    page: z.number().min(1).max(1000).default(1),
    limit: z.number().min(1).max(100).default(10),
  }),
};

// 🔐 AUTHENTICATION SECURITY UTILITIES
class AuthSecurity {
  private static readonly TOKEN_PREFIX = "Bearer ";
  private static readonly TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes

  /**
   * Validate JWT token format (basic client-side check)
   */
  static isValidTokenFormat(token: string): boolean {
    if (!token || typeof token !== "string") return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    try {
      // Decode header and payload (don't verify signature client-side)
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      return header.alg && header.typ === "JWT" && payload.exp && payload.iat;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if token is expired (client-side check only)
   */
  static isTokenExpired(token: string): boolean {
    if (!this.isValidTokenFormat(token)) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp <= now + this.TOKEN_EXPIRY_BUFFER / 1000;
    } catch (error) {
      return true;
    }
  }

  /**
   * Secure token storage
   */
  static storeToken(token: string): void {
    if (!this.isValidTokenFormat(token)) {
      throw new Error("Invalid token format");
    }

    if (typeof window !== "undefined") {
      // Use sessionStorage for sensitive data (cleared on tab close)
      sessionStorage.setItem("auth_token", token);

      // Store expiry time separately
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        localStorage.setItem("token_exp", payload.exp.toString());
      } catch (error) {
        console.error("Failed to parse token expiry:", error);
      }
    }
  }

  /**
   * Secure token retrieval
   */
  static getToken(): string | null {
    if (typeof window === "undefined") return null;

    const token = sessionStorage.getItem("auth_token");
    if (!token || this.isTokenExpired(token)) {
      this.clearTokens();
      return null;
    }

    return token;
  }

  /**
   * Clear all authentication data
   */
  static clearTokens(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("auth_token");
      localStorage.removeItem("token_exp");
      localStorage.removeItem("user_permissions");

      // Clear any persisted Redux state
      localStorage.removeItem("persist:user");
    }
  }

  /**
   * Generate secure headers for API requests
   */
  static getSecureHeaders(additionalHeaders: Record<string, string> = {}): HeadersInit {
    const token = this.getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      ...additionalHeaders,
    };

    if (token) {
      headers["Authorization"] = `${this.TOKEN_PREFIX}${token}`;
    }

    return headers;
  }
}

// 🚨 XSS PROTECTION UTILITIES
class XSSProtection {
  /**
   * Content Security Policy configuration
   */
  static getCSPHeader(): string {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Note: Remove unsafe-* in production
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' http://localhost:3800 https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; ");
  }

  /**
   * Sanitize user-generated content before rendering
   */
  static sanitizeUserContent(content: string): string {
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "ol", "ul", "li"],
      ALLOWED_ATTR: ["class"],
      KEEP_CONTENT: true,
      ALLOW_DATA_ATTR: false,
    });
  }

  /**
   * Prevent DOM-based XSS in URLs
   */
  static sanitizeUrlParams(params: URLSearchParams): URLSearchParams {
    const sanitized = new URLSearchParams();

    params.forEach((value, key) => {
      const cleanKey = InputSanitizer.removeDangerousChars(key);
      const cleanValue = InputSanitizer.sanitizeInput(value);

      if (cleanKey && cleanValue) {
        sanitized.set(cleanKey, cleanValue);
      }
    });

    return sanitized;
  }
}

// 🔒 API SECURITY UTILITIES
class APISecurity {
  private static requestCounts = new Map<string, { count: number; resetTime: number }>();
  private static readonly RATE_LIMIT = 100; // requests per window
  private static readonly RATE_WINDOW = 15 * 60 * 1000; // 15 minutes

  /**
   * Client-side rate limiting (basic protection)
   */
  static checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const record = this.requestCounts.get(identifier);

    if (!record || now > record.resetTime) {
      this.requestCounts.set(identifier, { count: 1, resetTime: now + this.RATE_WINDOW });
      return true;
    }

    if (record.count >= this.RATE_LIMIT) {
      return false;
    }

    record.count++;
    return true;
  }

  /**
   * Secure API request wrapper
   */
  static async secureRequest<T>(
    url: string,
    options: RequestInit = {},
    rateLimitKey?: string
  ): Promise<T> {
    // Rate limiting check
    if (rateLimitKey && !this.checkRateLimit(rateLimitKey)) {
      throw new Error("Rate limit exceeded. Please try again later.");
    }

    // Validate URL
    if (!validator.isURL(url, { protocols: ["http", "https"], require_protocol: true })) {
      throw new Error("Invalid API endpoint URL");
    }

    // Secure headers
    const secureHeaders = AuthSecurity.getSecureHeaders(options.headers as Record<string, string>);

    // Add request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(url, {
        ...options,
        headers: secureHeaders,
        signal: controller.signal,
        credentials: "same-origin", // Prevent CSRF
        mode: "cors",
        cache: "no-store", // Prevent sensitive data caching
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }

      throw error;
    }
  }

  /**
   * Generate CSRF token (client-side)
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
}

// 🛡️ VALIDATION MIDDLEWARE
class ValidationMiddleware {
  /**
   * Validate form data against schema
   */
  static validateForm<T>(
    schema: z.ZodSchema<T>,
    data: unknown
  ): { success: boolean; data?: T; errors?: string[] } {
    try {
      const validData = schema.parse(data);
      return { success: true, data: validData };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err: any) => `${err.path.join(".")}: ${err.message}`);
        return { success: false, errors };
      }
      return { success: false, errors: ["Validation failed"] };
    }
  }

  /**
   * Sanitize and validate API request data
   */
  static sanitizeApiRequest(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      const cleanKey = InputSanitizer.removeDangerousChars(key);

      if (typeof value === "string") {
        sanitized[cleanKey] = InputSanitizer.sanitizeInput(value);
      } else if (typeof value === "object" && value !== null) {
        sanitized[cleanKey] = this.sanitizeApiRequest(value);
      } else {
        sanitized[cleanKey] = value;
      }
    }

    return sanitized;
  }
}

// 🔐 SESSION SECURITY
class SessionSecurity {
  private static readonly SESSION_KEY = "app_session";
  private static readonly MAX_SESSION_AGE = 8 * 60 * 60 * 1000; // 8 hours

  /**
   * Create secure session data
   */
  static createSession(userData: any): void {
    if (typeof window === "undefined") return;

    const sessionData = {
      user: userData,
      timestamp: Date.now(),
      csrfToken: APISecurity.generateCSRFToken(),
    };

    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
  }

  /**
   * Validate and retrieve session
   */
  static getSession(): any | null {
    if (typeof window === "undefined") return null;

    try {
      const sessionStr = sessionStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return null;

      const session = JSON.parse(sessionStr);
      const now = Date.now();

      // Check session age
      if (now - session.timestamp > this.MAX_SESSION_AGE) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      this.clearSession();
      return null;
    }
  }

  /**
   * Clear session data
   */
  static clearSession(): void {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(this.SESSION_KEY);
    AuthSecurity.clearTokens();
  }
}

// Export all security utilities
export {
  InputSanitizer,
  SecuritySchemas,
  AuthSecurity,
  XSSProtection,
  APISecurity,
  ValidationMiddleware,
  SessionSecurity,
};
