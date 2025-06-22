import axios from "axios"
import { toast } from "sonner"

// Create axios instance with base configuration
const api = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("cropalert-access-token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("cropalert-refresh-token")
        if (!refreshToken) {
          throw new Error("No refresh token available")
        }

        // Try to refresh token
        const refreshResponse = await axios.post(
          `http://localhost:8000/auth/refresh`,
          { refresh_token: refreshToken },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        const { access_token, refresh_token } = refreshResponse.data

        // Store new tokens
        localStorage.setItem("cropalert-access-token", access_token)
        if (refresh_token) {
          localStorage.setItem("cropalert-refresh-token", refresh_token)
        }

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${access_token}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem("cropalert-access-token")
        localStorage.removeItem("cropalert-refresh-token")
        localStorage.removeItem("cropalert-user")
        
        toast.error("Session expired", {
          description: "Please sign in again.",
        })
        
        // Redirect to login page
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api
