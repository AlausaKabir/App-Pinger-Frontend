// 🛡️ SECURITY CONFIGURATION
export const SECURITY_CONFIG = {
  // Content Security Policy
  CSP: {
    directives: {
      "default-src": ["'self'"],
      "script-src": [
        "'self'",
        "'unsafe-inline'", // TODO: Remove in production, use nonces instead
        "'unsafe-eval'", // TODO: Remove in production
        "https://vercel.live",
      ],
      "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      "font-src": ["'self'", "https://fonts.gstatic.com"],
      "img-src": ["'self'", "data:", "https:", "blob:"],
      "connect-src": ["'self'", "http://localhost:3800", "https:", "wss:"],
      "frame-ancestors": ["'none'"],
      "base-uri": ["'self'"],
      "object-src": ["'none'"],
      "media-src": ["'self'"],
      "manifest-src": ["'self'"],
    },
  },

  // Security Headers
  HEADERS: {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=(), payment=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  },

  // Rate Limiting
  RATE_LIMITS: {
    global: {
      requests: 1000,
      window: 15 * 60 * 1000, // 15 minutes
    },
    auth: {
      requests: 5,
      window: 15 * 60 * 1000, // 15 minutes
    },
    api: {
      requests: 100,
      window: 60 * 1000, // 1 minute
    },
  },

  // Input Validation
  VALIDATION: {
    maxStringLength: 1000,
    maxEmailLength: 100,
    maxPasswordLength: 128,
    minPasswordLength: 8,
    allowedFileTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },

  // Session Management
  SESSION: {
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    renewThreshold: 30 * 60 * 1000, // 30 minutes
    cookieOptions: {
      httpOnly: true,
      secure: true,
      sameSite: "strict" as const,
      path: "/",
    },
  },

  // Encryption
  ENCRYPTION: {
    algorithm: "AES-GCM",
    keyLength: 256,
    ivLength: 12,
    tagLength: 16,
  },
};

// 🔐 SECURITY UTILS
export class SecurityUtils {
  /**
   * Generate CSP header string
   */
  static generateCSP(): string {
    const directives = SECURITY_CONFIG.CSP.directives;
    return Object.entries(directives)
      .map(([key, values]) => `${key} ${values.join(" ")}`)
      .join("; ");
  }

  /**
   * Generate security headers object
   */
  static getSecurityHeaders(): Record<string, string> {
    return {
      ...SECURITY_CONFIG.HEADERS,
      "Content-Security-Policy": this.generateCSP(),
    };
  }

  /**
   * Check if environment is production
   */
  static isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }

  /**
   * Check if request is from secure context
   */
  static isSecureContext(): boolean {
    if (typeof window === "undefined") return true; // Server-side
    return window.isSecureContext && window.location.protocol === "https:";
  }

  /**
   * Generate secure random string
   */
  static generateSecureToken(length: number = 32): string {
    if (typeof crypto === "undefined") {
      throw new Error("Crypto API not available");
    }

    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  /**
   * Validate file upload security
   */
  static validateFileUpload(file: File): { valid: boolean; error?: string } {
    const { allowedFileTypes, maxFileSize } = SECURITY_CONFIG.VALIDATION;

    if (!allowedFileTypes.includes(file.type)) {
      return { valid: false, error: "File type not allowed" };
    }

    if (file.size > maxFileSize) {
      return { valid: false, error: "File size too large" };
    }

    return { valid: true };
  }

  /**
   * Sanitize filename for uploads
   */
  static sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/_{2,}/g, "_")
      .replace(/^_+|_+$/g, "")
      .toLowerCase();
  }

  /**
   * Check password strength
   */
  static checkPasswordStrength(password: string): {
    score: number;
    feedback: string[];
    isSecure: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < SECURITY_CONFIG.VALIDATION.minPasswordLength) {
      feedback.push(
        `Password must be at least ${SECURITY_CONFIG.VALIDATION.minPasswordLength} characters`
      );
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push("Add lowercase letters");
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push("Add uppercase letters");
    } else {
      score += 1;
    }

    if (!/[0-9]/.test(password)) {
      feedback.push("Add numbers");
    } else {
      score += 1;
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
      feedback.push("Add special characters");
    } else {
      score += 1;
    }

    const isSecure = score >= 4 && feedback.length === 0;

    return { score, feedback, isSecure };
  }

  /**
   * Log security event
   */
  static logSecurityEvent(event: string, details: Record<string, any> = {}): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      details: {
        ...details,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "server",
        url: typeof window !== "undefined" ? window.location.href : "server",
      },
    };

    console.warn("🚨 Security Event:", logEntry);

    // In production, send to security monitoring service
    if (this.isProduction()) {
      // TODO: Implement security event logging service
      // await fetch('/api/security/log', {
      //   method: 'POST',
      //   body: JSON.stringify(logEntry)
      // });
    }
  }

  /**
   * Detect potential security threats
   */
  static detectThreat(request: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
  }): { threat: boolean; reason?: string } {
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /eval\(/i,
      /\.\.\//, // Path traversal
      /union\s+select/i, // SQL injection
      /drop\s+table/i,
      /insert\s+into/i,
    ];

    const content = JSON.stringify({ url: request.url, body: request.body });

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(content)) {
        return { threat: true, reason: `Suspicious pattern detected: ${pattern.source}` };
      }
    }

    // Check for unusual request frequency
    // This would be implemented with proper rate limiting in production

    return { threat: false };
  }
}

// Export security configuration and utilities
export default {
  config: SECURITY_CONFIG,
  utils: SecurityUtils,
};
