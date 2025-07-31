import { API } from "@/api";

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
    const response = await API.post("/email/register", emailData);
    return response.data;
  } catch (error) {
    console.error("Register email request failed:", error);
    throw error;
  }
};

// Get notification email
export const getNotificationEmail = async (): Promise<EmailResponse> => {
  try {
    const response = await API.get("/email/notification-email");
    return response.data;
  } catch (error) {
    console.error("Get notification email request failed:", error);
    throw error;
  }
};

// Get all notification emails (Admin only)
export const getAllNotificationEmails = async (): Promise<EmailResponse> => {
  try {
    const response = await API.get("/email/emails");
    return response.data;
  } catch (error) {
    console.error("Get all notification emails request failed:", error);
    throw error;
  }
};

// Toggle email active status (Admin only)
export const toggleEmailStatus = async (emailId: string): Promise<EmailResponse> => {
  try {
    const response = await API.patch(`/email/toggle/${emailId}`);
    return response.data;
  } catch (error) {
    console.error("Toggle email status request failed:", error);
    throw error;
  }
};

// Delete a notification email (Admin only)
export const deleteNotificationEmail = async (emailId: string): Promise<EmailResponse> => {
  try {
    const response = await API.delete(`/email/delete/${emailId}`);
    return response.data;
  } catch (error) {
    console.error("Delete notification email request failed:", error);
    throw error;
  }
};
