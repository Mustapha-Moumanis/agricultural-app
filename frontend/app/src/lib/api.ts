import api from "./axios"
import type { User } from "@/types"

export class ApiError extends Error {
  public response?: any

  constructor(
    public status: number,
    message: string,
    response?: any,
  ) {
    super(message)
    this.name = "ApiError"
    this.response = response
  }
}

// Authentication API functions
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || "Login failed",
        error.response,
      )
    }
  },

  register: async (userData: {
    username: string
    email: string
    password1: string
    password2: string
    role: "Farmer" | "Agronomist"
  }) => {
    try {
      const response = await api.post("/auth/registration/", userData)
      return response.data
    } catch (error: any) {
      const apiError = new ApiError(
        error.response?.status || 500,
        error.response?.data?.detail || error.response?.data?.non_field_errors?.[0] || "Registration failed",
        error.response,
      )
      throw apiError
    }
  },

  logout: async () => {
    try {
      const response = await api.post("/auth/logout/")
      return response.data
    } catch (error: any) {
      throw new ApiError(error.response?.status || 500, error.response?.data?.detail || "Logout failed", error.response)
    }
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const response = await api.post("/auth/token/refresh/", {
        refresh: refreshToken,
      })
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.detail || "Token refresh failed",
        error.response,
      )
    }
  },

  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get("/auth/user/")
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to get user data",
        error.response,
      )
    }
  },

  verifyEmail: async (email: string, key: string) => {
    try {
      const response = await api.post("/auth/verify-email/", {
        email,
        key,
      })
      return response.data
    } catch (error: any) {
      console.log(error)
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.detail || "Email verification failed",
        error.response
      )
    }
  },

  resendEmailVerification: async (email: string) => {
    try {
      const response = await api.post("/auth/registration/resend-email/", { email })
      return response.data
    } catch (error: any) {
      throw new ApiError(
        error.response?.status || 500,
        error.response?.data?.detail || "Failed to resend verification email",
        error.response,
      )
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
      // await authApi.getCurrentUser()
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

// // Other API functions
// export const alertsApi = {
//   getAlerts: async () => {
//     try {
//       const response = await api.get("/api/alerts")
//       return response.data
//     } catch (error: any) {
//       throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Failed to fetch alerts")
//     }
//   },

//   createAlert: async (alertData: any) => {
//     try {
//       const response = await api.post("/api/alerts", alertData)
//       return response.data
//     } catch (error: any) {
//       throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Failed to create alert")
//     }
//   },
// }

// export const userApi = {
//   updateProfile: async (userData: Partial<User>) => {
//     try {
//       const response = await api.put("/api/user", userData)
//       return response.data
//     } catch (error: any) {
//       throw new ApiError(error.response?.status || 500, error.response?.data?.message || "Failed to update profile")
//     }
//   },
// }


