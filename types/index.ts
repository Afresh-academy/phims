export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  localGov: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginData {
  email: string;
  password: string;
  location?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state?: string;
  localGov?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data?: {
    user: UserProfile;
  };
  user?: UserProfile; // Alternative response structure
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Types for API response
export interface DashboardData {
  totalBookings: number;
  totalPatients: number;
  completedBookings: number;
  totalRevenue: number;
  governmentRevenue: number;
  hospitalRevenue: number;
  recentBookings: any[];
}

export interface ApiResponse {
  success: boolean;
  dashboard: DashboardData;
  message?: string;
}
