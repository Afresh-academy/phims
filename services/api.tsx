import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

// API Handler class
class ApiHandler {
  // GET request
  async get<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.get<ApiResponse<T>>(endpoint, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // POST request
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.post<ApiResponse<T>>(endpoint, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PUT request
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.put<ApiResponse<T>>(endpoint, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // PATCH request
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.patch<ApiResponse<T>>(endpoint, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // DELETE request
  async delete<T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await apiClient.delete<ApiResponse<T>>(endpoint, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  // Error handler
  private handleError(error: unknown): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse>;

      console.error("🔍 API Error:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      // Handle specific HTTP status codes
      if (axiosError.response?.status === 400) {
        return axiosError.response.data || {
          success: false,
          message: "Bad request. Please check your input.",
        };
      }

      if (axiosError.response?.status === 404) {
        return {
          success: false,
          message: "Resource not found.",
        };
      }

      if (axiosError.response?.status === 423) {
        return {
          success: false,
          message: "Resource is locked. Please try again later.",
        };
      }

      if (axiosError.response?.status === 429) {
        return {
          success: false,
          message: "Too many requests. Please try again later.",
        };
      }

      if (axiosError.response?.status === 500) {
        return {
          success: false,
          message: "Server error. Please try again later.",
        };
      }

      // Return server error response if available
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }

      return {
        success: false,
        message: axiosError.message || "Network error. Please check your connection.",
      };
    }

    // Non-axios errors
    console.error("🔍 Non-axios error:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// Create and export instance
const api = new ApiHandler();
export default api;