import { API } from "@/api";

export interface Service {
  id: string;
  name: string;
  url: string;
  healthStatus: "UP" | "DOWN";
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceRequest {
  name: string;
  url: string;
}

export interface ServiceResponse {
  statusCode: number;
  status: string;
  message: string;
  data: Service | Service[];
}

// Get all services
export const getServices = async (): Promise<ServiceResponse> => {
  try {
    const response = await API.get("/service-check/services");
    return response.data;
  } catch (error) {
    console.error("Get services request failed:", error);
    throw error;
  }
};

// Add a new service
export const addService = async (serviceData: CreateServiceRequest): Promise<ServiceResponse> => {
  try {
    const response = await API.post("/service-check/register", serviceData);
    return response.data;
  } catch (error) {
    console.error("Add service request failed:", error);
    throw error;
  }
};

// Delete a service
export const deleteService = async (serviceId: string): Promise<ServiceResponse> => {
  try {
    const response = await API.delete(`/service-check/delete/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error("Delete service request failed:", error);
    throw error;
  }
};
