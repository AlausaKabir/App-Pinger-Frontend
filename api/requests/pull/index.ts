import { API } from "@/api/api.config";
import { mutate } from "swr";

export const apiDelete = async (url: string, revalidate?: string) => {
  try {
    const response = await API({
      method: "DELETE",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (revalidate) {
      try {
        mutate(revalidate);
      } catch {
        null;
      }
    }

    return response.data;
  } catch (error: any) {
    handleApiError(error);
  }
};

// Centralized error handling function
const handleApiError = (error: any) => {
  let errorMessage = "";
  if (error.message) {
    errorMessage = error.response.data.message || error.response.data.error || error.response.data;

    if (!errorMessage) {
      errorMessage = "Service failed";
    }
  } else {
    errorMessage = "Service unavailable";
  }
  throw new Error(errorMessage);
};
