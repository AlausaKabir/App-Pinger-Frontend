import { secureAPI } from "@/utils/secureAPI";
import { ValidationMiddleware, SecuritySchemas, InputSanitizer } from "@/utils/security";

export interface Email {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailRequest {
  email: string;
}

export interface EmailResponse {
  statusCode: number;
  status?: string;
  message: string;
  data?: Email | Email[] | any;
}

// Register notification email
export const registerEmail = async (emailData: EmailRequest): Promise<EmailResponse> => {
  try {
    // Validate and sanitize email
    const validation = ValidationMiddleware.validateForm(SecuritySchemas.emailConfigSchema, {
      email: emailData.email,
      type: "NOTIFICATION",
      isActive: true,
    });

    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.errors?.join(", ")}`);
    }

    const response = await secureAPI.post<EmailResponse>("/email/config", validation.data);
    return response;
  } catch (error: any) {
    console.error("❌ Secure register email failed:", error.message);
    throw new Error(error.message || "Failed to register email");
  }
};

// Get notification email
export const getNotificationEmail = async (): Promise<EmailResponse> => {
  try {
    const response = await secureAPI.get<EmailResponse>("/email/config");
    return response;
  } catch (error: any) {
    console.error("❌ Get notification email failed:", error.message);
    throw new Error(error.message || "Failed to fetch notification email");
  }
};

// Get all notification emails (Admin only)
export const getAllNotificationEmails = async (): Promise<EmailResponse> => {
  try {
    const response = await secureAPI.get<EmailResponse>("/email/config");
    return response;
  } catch (error: any) {
    console.error("❌ Get all notification emails failed:", error.message);
    throw new Error(error.message || "Failed to fetch notification emails");
  }
};

// Toggle email active status (Admin only)
export const toggleEmailStatus = async (emailId: string): Promise<EmailResponse> => {
  try {
    // Sanitize email ID
    const cleanEmailId = InputSanitizer.removeDangerousChars(emailId);
    if (!cleanEmailId) {
      throw new Error("Invalid email ID");
    }

    const response = await secureAPI.put<EmailResponse>(`/email/config/${cleanEmailId}`, {
      isActive: true, // This would be toggled based on current state
    });
    return response;
  } catch (error: any) {
    console.error("❌ Toggle email status failed:", error.message);
    throw new Error(error.message || "Failed to toggle email status");
  }
};

// Delete a notification email (Admin only)
export const deleteNotificationEmail = async (emailId: string): Promise<EmailResponse> => {
  try {
    // Sanitize email ID
    const cleanEmailId = InputSanitizer.removeDangerousChars(emailId);
    if (!cleanEmailId) {
      throw new Error("Invalid email ID");
    }

    const response = await secureAPI.delete<EmailResponse>(`/email/config/${cleanEmailId}`);
    return response;
  } catch (error: any) {
    console.error("❌ Delete notification email failed:", error.message);
    throw new Error(error.message || "Failed to delete notification email");
  }
};
