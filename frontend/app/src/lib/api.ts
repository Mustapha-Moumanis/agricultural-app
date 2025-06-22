import api from "./axios"
import type { User } from "@/types"

export class ApiError extends Error {
  public status: number;

  constructor(
    status: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
    this.status = status;
  }
}

// Authentication API functions
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Login failed")
    }
  },

  register: async (userData: {
    name: string
    email: string
    password: string
    role: "farmer" | "agronomist"
    location: string
  }) => {
    try {
      const response = await api.post("/auth/register", userData)
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Registration failed")
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("cropalert-refresh-token")
      const response = await api.post("/auth/logout", {
        refresh_token: refreshToken,
      })
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Logout failed")
    }
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      })
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Token refresh failed")
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get("/auth/me")
      return response.data.user || response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Failed to get user data")
    }
  },

  verifyEmail: async (token: string) => {
    try {
      const response = await api.post("/auth/verify-email", { token })
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Email verification failed")
    }
  },

  checkAuthStatus: async (): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem("cropalert-access-token")
      const refreshToken = localStorage.getItem("cropalert-refresh-token")

      if (!accessToken && !refreshToken) {
        return false
      }

      // Try to get current user to verify token validity
      await authApi.getCurrentUser()
      return true
    } catch (error) {
      // If getCurrentUser fails, try to refresh token
      const refreshToken = localStorage.getItem("cropalert-refresh-token")
      if (refreshToken) {
        try {
          await authApi.refreshToken(refreshToken)
          return true
        } catch (refreshError) {
          // Refresh failed, user is not authenticated
          localStorage.removeItem("cropalert-access-token")
          localStorage.removeItem("cropalert-refresh-token")
          localStorage.removeItem("cropalert-user")
          return false
        }
      }
      return false
    }
  },
}

// Other API functions
export const alertsApi = {
  getAlerts: async () => {
    try {
      const response = await api.get("/api/alerts")
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Failed to fetch alerts")
    }
  },

  createAlert: async (alertData: any) => {
    try {
      const response = await api.post("/api/alerts", alertData)
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Failed to create alert")
    }
  },
}

export const userApi = {
  updateProfile: async (userData: Partial<User>) => {
    try {
      const response = await api.put("/api/user/profile", userData)
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Failed to update profile")
    }
  },
}
