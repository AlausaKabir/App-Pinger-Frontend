import { secureAPI } from "@/utils/secureAPI";
import { ValidationMiddleware, SecuritySchemas, InputSanitizer } from "@/utils/security";

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
  method?: string;
  timeout?: number;
  interval?: number;
  expectedStatus?: number;
  description?: string;
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
    const response = await secureAPI.get<ServiceResponse>("/service-check");
    return response;
  } catch (error: any) {
    console.error("❌ Secure get services failed:", error.message);
    throw new Error(error.message || "Failed to fetch services");
  }
};

// Add a new service
export const addService = async (serviceData: CreateServiceRequest): Promise<ServiceResponse> => {
  try {
    // Validate and sanitize input
    const validation = ValidationMiddleware.validateForm(SecuritySchemas.serviceSchema, {
      name: serviceData.name,
      url: serviceData.url,
      description: serviceData.description,
    });

    if (!validation.success) {
      throw new Error(`Validation failed: ${validation.errors?.join(", ")}`);
    }

    console.log("🔍 Adding service with secure validation:", validation.data?.name);
    const response = await secureAPI.post<ServiceResponse>("/service-check", validation.data);
    return response;
  } catch (error: any) {
    console.error("❌ Secure add service failed:", error.message);
    throw new Error(error.message || "Failed to add service");
  }
};

// Delete a service
export const deleteService = async (serviceId: string): Promise<ServiceResponse> => {
  try {
    // Sanitize service ID
    const cleanServiceId = InputSanitizer.removeDangerousChars(serviceId);
    if (!cleanServiceId) {
      throw new Error("Invalid service ID");
    }

    const response = await secureAPI.delete<ServiceResponse>(`/service-check/${cleanServiceId}`);
    return response;
  } catch (error: any) {
    console.error("❌ Secure delete service failed:", error.message);
    throw new Error(error.message || "Failed to delete service");
  }
};
