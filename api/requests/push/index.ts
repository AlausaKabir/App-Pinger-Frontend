import { API } from "@/api/api.config";
import { mutate } from "swr";

export const apiPush = async (
  url: string,
  method: "POST" | "PATCH" | "PUT",
  data: { [key: string]: any },
  revalidate?: string
) => {
  try {
    const response = await API({
      method: method,
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data,
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
    let errorMessage = "";
    if (error.message) {
      errorMessage =
        error.response.data.message || error.response.data.error || error.response.data;

      if (!errorMessage) {
        errorMessage = "Service failed";
      }
    } else {
      errorMessage = "Service unavailable";
    }
    throw new Error(errorMessage);
  }
};
