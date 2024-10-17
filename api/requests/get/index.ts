import { API } from "../../api.config";

export const apiFetch = async (url: string) => {
  try {
    const repesponse = await API.get(url);
    return repesponse.data;
  } catch (error: any) {
    let errorMessage = "";
    if (error.response) {
      errorMessage =
        error.response.data.message || error.response.data.error || error.response.data;

      if (!errorMessage) {
        errorMessage = "Service failed";
      }
    } else {
      errorMessage = "Service unavailable ";
    }
    throw new Error(errorMessage);
  }
};
