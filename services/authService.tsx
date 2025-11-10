import axios, { AxiosError } from "axios";
import { AuthResponse, SignupData, LoginData, User } from "../types";
import { toast } from "sonner";


// VITE: Correct way to access environment variables
const API_URL =
  import.meta.env.VITE_API_URL || "https://phealth-care.onrender.com";

// VITE: Correct way to access environment variables
// const _IM = import.meta as unknown as { env: Record<string, any> };
// const API_URL = _IM.env.VITE_API_URL || "https://phealth-care.onrender.com";

console.log("🔍 authService - API_URL:", API_URL);
// console.log("🔍 authService - Environment:", import.meta.env.MODE);

// Create axios instance with default configs
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // 60 seconds for Render cold starts
});

// State
let token: string | null = null;
let currentUser: User | null = null;

// Initialize auth state
const loadStoredAuth = (): void => {
  try {
    const storedToken = sessionStorage.getItem("authToken");
    const storedUser = sessionStorage.getItem("user");

    console.log("🔍 authService - Loading stored auth:", {
      hasStoredToken: !!storedToken,
      hasStoredUser: !!storedUser,
      tokenPreview: storedToken
        ? `${storedToken.substring(0, 20)}...`
        : "No token",
    });

    if (storedToken && storedUser) {
      token = storedToken;
      currentUser = JSON.parse(storedUser);
      console.log("✅ authService - Successfully loaded stored auth");
    } else {
      console.warn("⚠️ authService - No stored auth found");
    }
  } catch (error) {
    console.error("❌ authService - Error loading stored auth:", error);
  }
};

// Initialize on import
loadStoredAuth();

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🚀 API Request:", {
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      method: config.method,
      data: config.data,
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    console.error("❌ API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

const handleAuthSuccess = (response: AuthResponse): void => {
  try {
    if (response.data) {
      currentUser = response.data.user;
      token = response.data.token;

      console.log("💾 authService - Storing auth data:", {
        tokenLength: token?.length,
        tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
        user: currentUser,
        hasUser: !!currentUser,
      });

      // Store in sessionStorage
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("user", JSON.stringify(currentUser));

      // Verify storage immediately
      const storedToken = sessionStorage.getItem("authToken");
      const storedUser = sessionStorage.getItem("user");

      console.log("✅ authService - Storage verification:", {
        storedTokenLength: storedToken?.length,
        storedTokenExists: !!storedToken,
        storedUserExists: !!storedUser,
        storedUser: storedUser ? JSON.parse(storedUser) : null,
      });

      console.log("🔍 authService - Internal state after storage:", {
        internalToken: token,
        internalUser: currentUser,
      });
    } else {
      console.warn("⚠️ authService - No data in auth response");
    }
  } catch (error) {
    console.error("❌ authService - Error handling auth success:", error);
  }
};

const handleError = (error: unknown): AuthResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<AuthResponse>;

    console.log("🔍 authService - Axios Error details:", {
      status: axiosError.response?.status,
      statusText: axiosError.response?.statusText,
      data: axiosError.response?.data,
      message: axiosError.message,
      code: axiosError.code,
    });

    // Handle specific HTTP status codes
    if (axiosError.response?.status === 423) {
      return {
        success: false,
        message:
          "Your account has been temporarily locked. Please try again later or contact support.",
      };
    }

    if (axiosError.response?.status === 429) {
      return {
        success: false,
        message: "Too many attempts. Please try again later.",
      };
    }

    if (axiosError.response?.status === 500) {
      return {
        success: false,
        message: "Server error. Please try again later.",
      };
    }

    // Handle CORS errors
    if (axiosError.code === "ERR_NETWORK") {
      return {
        success: false,
        message:
          "Network error. Please check your internet connection or try again later.",
      };
    }

    // Return server error response if available
    if (axiosError.response?.data) {
      return axiosError.response.data;
    }

    return {
      success: false,
      message:
        axiosError.message || "Network error. Please check your connection.",
    };
  }

  // Non-axios errors
  console.error("🔍 authService - Non-axios error:", error);
  return {
    success: false,
    message: "An unexpected error occurred. Please try again.",
  };
};

// Dashboard API function
// export const adminDashboard = async (): Promise<any> => {
//   try {
//     console.log("📊 authService - Fetching admin dashboard data...");

//     const response = await axiosInstance.get(
//       "/admin/dashboard"  // Fixed URL - removed /api prefix
//     );

//     console.log("📊 authService - Dashboard response:", response.data);

//     return response.data;
//   } catch (error: any) {
//     console.error("📊 authService - Dashboard error:", error);

//     // Handle dashboard-specific errors
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;

//       console.log("📊 authService - Dashboard Error details:", {
//         status: axiosError.response?.status,
//         data: axiosError.response?.data,
//         message: axiosError.message,
//       });

//       if (axiosError.response?.status === 401) {
//         return {
//           success: false,
//           message: "Unauthorized access. Please login again.",
//         };
//       }

//       if (axiosError.response?.status === 403) {
//         return {
//           success: false,
//           message: "Access denied. Admin privileges required.",
//         };
//       }

//       // Return server error response if available
//       if (axiosError.response?.data) {
//         return axiosError.response.data;
//       }
//     }

//     return {
//       success: false,
//       message: "Failed to load dashboard data. Please try again.",
//     };
//   }
// };

// In your authService.ts - UPDATE the adminDashboard function
export const adminDashboard = async (): Promise<any> => {
  try {
    console.log("📊 authService - Fetching admin dashboard data...");

    // Debug: Check token state before making request
    console.log("🔍 Token state before dashboard request:", {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
      sessionStorageToken: sessionStorage.getItem("authToken"),
    });

    // Make sure we have a token
    if (!token) {
      console.warn("⚠️ No token available for dashboard request");
      // Try to reload from sessionStorage
      loadStoredAuth();
      if (!token) {
        return {
          success: false,
          message: "No authentication token found. Please login again.",
        };
      }
    }

    const response = await axiosInstance.get("/admin/dashboard");

    console.log("📊 authService - Dashboard response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("📊 authService - Dashboard error:", error);

    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("📊 authService - Detailed error analysis:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        url: axiosError.config?.url,
        headers: axiosError.config?.headers,
        hasAuthHeader: !!axiosError.config?.headers?.Authorization,
        data: axiosError.response?.data,
      });

      if (axiosError.response?.status === 401) {
        // Clear invalid token
        logout();
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
      }

      if (axiosError.response?.status === 403) {
        return {
          success: false,
          message: "Access denied. Admin privileges required.",
        };
      }

      // Return server error response if available
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      message: "Failed to load dashboard data. Please try again.",
    };
  }
};

// In your authService.ts - UPDATE the adminDashboard function
export const patientBookingss = async (): Promise<any> => {
  try {
    console.log("📊 authService - Fetching patient booking data...");

    // Debug: Check token state before making request
    console.log("🔍 Token state before booking request:", {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 20)}...` : "No token",
      sessionStorageToken: sessionStorage.getItem("authToken"),
    });

    // Make sure we have a token
    if (!token) {
      console.warn("⚠️ No token available for booking request");
      // Try to reload from sessionStorage
      loadStoredAuth();
      if (!token) {
        return {
          success: false,
          message: "No authentication token found. Please login again.",
        };
      }
    }

    const response = await axiosInstance.get("/booking/hospitals");

    console.log("📊 authService - Patient booking response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("📊 authService - Patient booking error:", error);

    // Enhanced error logging
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("📊 authService - Detailed error analysis:", {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        url: axiosError.config?.url,
        headers: axiosError.config?.headers,
        hasAuthHeader: !!axiosError.config?.headers?.Authorization,
        data: axiosError.response?.data,
      });

      if (axiosError.response?.status === 401) {
        // Clear invalid token
        logout();
        return {
          success: false,
          message: "Session expired. Please login again.",
        };
      }

      if (axiosError.response?.status === 403) {
        return {
          success: false,
          message: "Access denied. Patient privileges required.",
        };
      }

      // Return server error response if available
      if (axiosError.response?.data) {
        return axiosError.response.data;
      }
    }

    return {
      success: false,
      message: "Failed to load dashboard data. Please try again.",
    };
  }
};

export const displayListOfHospitals = async (): Promise<any> => {
  try {
    console.log("📊 authService - Fetching patient booking data...");

    // Enhanced token verification with fallback
    let currentToken = token;
    if (!currentToken) {
      console.log("🔄 No token in memory, checking sessionStorage...");
      currentToken = sessionStorage.getItem("authToken");

      if (!currentToken) {
        console.warn("❌ No token available in any storage");
        return {
          success: false,
          message: "Authentication required. Please login again.",
          redirectToLogin: true, // Add flag for component
        };
      }
      // Update the token in memory
      token = currentToken;
      console.log('User token', token)
    }

    console.log("🔍 Token verification:", {
      hasToken: !!currentToken,
      tokenLength: currentToken.length,
      tokenPreview: `${currentToken.substring(0, 20)}...`,
    });

    const response = await axiosInstance.get("/booking/hospitals");
    console.log("📊 authService - Patient booking response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("📊 authService - Patient booking error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("📊 authService - Error details:", {
        status: axiosError.response?.status,
        message: axiosError.response?.data,
      });

      if (axiosError.response?.status === 401) {
        logout(); // Clear invalid token
        return {
          success: false,
          message: "Session expired. Please login again.",
          redirectToLogin: true,
        };
      }

      // Return server error message
      const errorData = axiosError.response?.data as any;
      return {
        success: false,
        message: errorData?.message || "Failed to load dashboard data",
        redirectToLogin: axiosError.response?.status === 401,
      };
    }

    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

export const patientBooking = async (): Promise<any> => {
  try {
    console.log("📊 authService - Fetching patient booking data...");

    // Enhanced token verification with fallback
    let currentToken = token;
    if (!currentToken) {
      console.log("🔄 No token in memory, checking sessionStorage...");
      currentToken = sessionStorage.getItem("authToken");

      if (!currentToken) {
        console.warn("❌ No token available in any storage");
        return {
          success: false,
          message: "Authentication required. Please login again.",
          redirectToLogin: true, // Add flag for component
        };
      }
      // Update the token in memory
      token = currentToken;

      console.log("🔍 Token loaded from sessionStorage into memory", {token});
    }

    console.log("🔍 Token verification:", {
      hasToken: !!currentToken,
      tokenLength: currentToken.length,
      tokenPreview: `${currentToken.substring(0, 20)}...`,
    });

    const response = await axiosInstance.get("/booking/hospitals");
    console.log("📊 authService - Patient booking response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("📊 authService - Patient booking error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("📊 authService - Error details:", {
        status: axiosError.response?.status,
        message: axiosError.response?.data,
      });

      if (axiosError.response?.status === 401) {
        logout(); // Clear invalid token
        return {
          success: false,
          message: "Session expired. Please login again.",
          redirectToLogin: true,
        };
      }

      // Return server error message
      const errorData = axiosError.response?.data as any;
      return {
        success: false,
        message: errorData?.message || "Failed to load dashboard data",
        redirectToLogin: axiosError.response?.status === 401,
      };
    }

    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  try {
    console.log("🔍 authService - Sending signup data:", {
      ...data,
      password: "[REDACTED]",
    });

    const response = await axiosInstance.post<any>("/auth/register", data); // Changed to 'any' since response structure is different

    console.log("🔍 authService - Signup response:", response.data);

    // FIX: Handle the actual response structure from backend
    if (response.data.success) {
      // Backend returns token and patient at root level, NOT in data object
      const transformedResponse: AuthResponse = {
        success: true,
        message: response.data.message,
        data: {
          user: response.data.patient, // Map patient to user
          token: response.data.token, // Token from root level
        },
      };

      console.log(
        "🔍 authService - Transformed signup response:",
        transformedResponse
      );

      // This will store the token and user
      handleAuthSuccess(transformedResponse);

      // Return the original response for the signup component
      return response.data;
    }

    return response.data;
  } catch (error: any) {
    console.error("🔍 authService - Signup error:", error);
    return handleError(error);
  }
};

export const patientLoginss = async (
  data: LoginData
): Promise<AuthResponse> => {
  try {
    console.log("🔍 authService - Sending login request:", {
      email: data.email,
      location: data.location,
      password: "[REDACTED]",
    });

    const response = await axiosInstance.post<AuthResponse>(
      "/auth/login",
      data
    );

    console.log("🔍 authService - Login response:", response.data);

    if (response.data.success && response.data.data) {
      handleAuthSuccess(response.data);
    }

    return response.data;
  } catch (error) {
    console.error("🔍 authService - Login error:", error);
    return handleError(error);
  }
};

export const patientLogin = async (data: LoginData): Promise<AuthResponse> => {
  try {
    console.log("🔍 authService - Sending login request:", {
      email: data.email,
      location: data.location,
      password: "[REDACTED]",
    });

    const response = await axiosInstance.post<any>("/auth/login", data);

    console.log("🔍 authService - Login response:", response.data);

    // FIX: Handle the actual response structure
    if (response.data.success) {
      const transformedResponse: AuthResponse = {
        success: true,
        message: response.data.message,
        data: {
          user: response.data.patient, // Map patient to user
          token: response.data.token, // Token from root level
        },
      };

      console.log(
        "🔍 authService - Transformed login response:",
        transformedResponse
      );
      handleAuthSuccess(transformedResponse);

      return response.data;
    }

    return response.data;
  } catch (error) {
    console.error("🔍 authService - Login error:", error);
    return handleError(error);
  }
};

export const getUserProfile = async (): Promise<any> => {
  try {
    console.log("🔍 authService - Fetching user profile...");

    // Enhanced token verification with fallback
    let currentToken = token;
    if (!currentToken) {
      console.log("🔄 No token in memory, checking sessionStorage...");
      currentToken = sessionStorage.getItem("authToken");

      if (!currentToken) {
        console.warn("❌ No token available for profile request");
        return {
          success: false,
          message: "Authentication required. Please login again.",
          redirectToLogin: true,
        };
      }
      // Update the token in memory
      token = currentToken;
    }

    console.log("🔍 Token verification for profile request:", {
      hasToken: !!currentToken,
      tokenLength: currentToken.length,
      tokenPreview: `${currentToken.substring(0, 20)}...`,
    });

    const response = await axiosInstance.get("/auth/profile");

    console.log("✅ authService - User profile response:", response.data);

    if (response.data.success) {
      // Update the current user in memory and storage
      currentUser = response.data.data?.user || response.data.user;
      if (currentUser) {
        sessionStorage.setItem("user", JSON.stringify(currentUser));
        console.log("💾 Updated user data in storage:", currentUser);
      }
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ authService - User profile error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("🔍 authService - Profile error details:", {
        status: axiosError.response?.status,
        message: axiosError.response?.data,
        url: axiosError.config?.url,
      });

      if (axiosError.response?.status === 401) {
        logout(); // Clear invalid token
        return {
          success: false,
          message: "Session expired. Please login again.",
          redirectToLogin: true,
        };
      }

      // Return server error message
      const errorData = axiosError.response?.data as any;
      return {
        success: false,
        message: errorData?.message || "Failed to load user profile",
        redirectToLogin: axiosError.response?.status === 401,
      };
    }

    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

export const adminLogin = async (data: LoginData): Promise<AuthResponse> => {
  try {
    console.log("🔍 authService - Sending admin login request:", {
      email: data.email,
      location: data.location,
      password: "[REDACTED]",
    });

    const response = await axiosInstance.post<any>("/admin/auth/login", data);

    console.log("🔍 authService - Admin login raw response:", response.data);

    // Handle the admin-specific response structure
    if (response.data.success) {
      // Backend returns token and admin at root level
      // Transform it to match the expected AuthResponse structure
      const transformedResponse: AuthResponse = {
        success: true,
        message: response.data.message,
        data: {
          user: response.data.admin, // Map admin to user
          token: response.data.token, // Token from root level
        },
      };

      console.log(
        "🔍 authService - Transformed response for handleAuthSuccess:",
        transformedResponse
      );

      // This will store the token and user
      handleAuthSuccess(transformedResponse);

      // Return the original response structure for the login component
      return response.data;
    }

    return response.data;
  } catch (error) {
    console.error("🔍 authService - Admin login error:", error);
    return handleError(error);
  }
};

export const logout = (): void => {
  try {
    token = null;
    currentUser = null;
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    console.log("🔍 authService - Logged out, cleared session");
  } catch (error) {
    console.error("🔍 authService - Error during logout:", error);
  }
  window.location.href = "/login";
};

// export const getToken = (): string | null => {
//   return token;
// };

// export const getCurrentUser = (): User | null => {
//   return currentUser;
// };

// At the top of your authService.tsx - update these functions

export const isAuthenticated = (): boolean => {
  console.log("🔍 Checking authentication:", {
    hasMemoryToken: !!token,
    hasStorageToken: !!sessionStorage.getItem("authToken"),
  });

  if (token !== null) {
    return true;
  }

  const storedToken = sessionStorage.getItem("authToken");
  if (storedToken) {
    loadStoredAuth();
    return token !== null;
  }

  return false;
};

export const getToken = (): string | null => {
  if (token) {
    return token;
  }

  const storedToken = sessionStorage.getItem("authToken");
  if (storedToken) {
    loadStoredAuth();
    return token;
  }

  return null;
};

export const getCurrentUser = (): User | null => {
  if (currentUser) {
    return currentUser;
  }

  const storedUser = sessionStorage.getItem("user");
  if (storedUser) {
    loadStoredAuth();
    return currentUser;
  }

  return null;
};

// Profile Settings API functions
// Fixed updateProfile function in authService.tsx
export const updateProfile = async (profileData: any): Promise<any> => {
  try {
    console.log("🔍 authService - Updating user profile:", profileData);

    // Enhanced token verification
    let currentToken = token;
    if (!currentToken) {
      console.log("🔄 No token in memory, checking sessionStorage...");
      currentToken = sessionStorage.getItem("authToken");

      if (!currentToken) {
        console.warn("❌ No token available for profile update request");
        return {
          success: false,
          message: "Authentication required. Please login again.",
          redirectToLogin: true,
        };
      }
      token = currentToken;
    }

    console.log("🔍 Making PUT request to /auth/profile");
    console.log("📤 Request data:", profileData);

    const response = await axiosInstance.put("/auth/profile", profileData);

    console.log("✅ authService - Profile update response:", response.data);

    if (response.data.success) {
      // Update the current user in memory and storage
      const updatedProfile = response.data.profile;
      if (updatedProfile) {
        currentUser = {
          ...currentUser,
          id: updatedProfile.id,
          email: updatedProfile.email,
          name: `${updatedProfile.personalInfo?.firstName} ${updatedProfile.personalInfo?.lastName}`,
          phone: updatedProfile.personalInfo?.phone
        } as any;
        sessionStorage.setItem("user", JSON.stringify(currentUser));
        console.log("💾 Updated user data in storage");
      }
      
      // DON'T show toast here - let the component handle it
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ authService - Profile update error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("🔍 authService - Profile update error details:", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      if (axiosError.response?.status === 401) {
        logout();
        return {
          success: false,
          message: "Session expired. Please login again.",
          redirectToLogin: true,
        };
      }

      // Return server error message
      const errorData = axiosError.response?.data as any;
      return {
        success: false,
        message: errorData?.message || errorData?.error || "Failed to update profile",
        error: errorData?.error, // Include detailed error
        redirectToLogin: false,
      };
    }

    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<any> => {
  try {
    console.log("🔍 authService - Changing password");

    // Enhanced token verification with fallback
    let currentToken = token;
    if (!currentToken) {
      console.log("🔄 No token in memory, checking sessionStorage...");
      currentToken = sessionStorage.getItem("authToken");

      if (!currentToken) {
        console.warn("❌ No token available for password change request");
        return {
          success: false,
          message: "Authentication required. Please login again.",
          redirectToLogin: true,
        };
      }
      token = currentToken;
    }

    console.log("🔍 Token verification for password change:", {
      hasToken: !!currentToken,
      tokenPreview: `${currentToken.substring(0, 20)}...`,
    });

    const response = await axiosInstance.put("/auth/change-password", passwordData);

    console.log("✅ authService - Password change response:", response.data);

    if (response.data.success) {
      toast.success("Password changed successfully!");
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ authService - Password change error:", error);

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("🔍 authService - Password change error details:", {
        status: axiosError.response?.status,
        message: axiosError.response?.data,
      });

      if (axiosError.response?.status === 401) {
        logout();
        return {
          success: false,
          message: "Session expired. Please login again.",
          redirectToLogin: true,
        };
      }

      const errorData = axiosError.response?.data as any;
      const errorMessage = errorData?.message || "Failed to change password";
      toast.error(errorMessage);
      
      return {
        success: false,
        message: errorMessage,
        redirectToLogin: axiosError.response?.status === 401,
      };
    }

    toast.error("Network error. Please check your connection.");
    return {
      success: false,
      message: "Network error. Please check your connection.",
    };
  }
};

// export const isAuthenticated = (): boolean => {
//   // First check in-memory token
//   if (token !== null) {
//     return true;
//   }

//   // Fallback: check sessionStorage
//   const storedToken = sessionStorage.getItem("authToken");
//   if (storedToken) {
//     // Reload auth state if found in storage
//     loadStoredAuth();
//     return token;
//   }

//   return false;
// };

// Export as default object
const authService = {
  signup,
  patientLogin,
  adminLogin,
  logout,
  getToken,
  getCurrentUser,
  isAuthenticated,
  adminDashboard,
  patientBooking,
  displayListOfHospitals,
  getUserProfile,
   updateProfile,
  changePassword,
};

export default authService;
