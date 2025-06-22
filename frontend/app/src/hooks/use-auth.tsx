"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authApi, ApiError } from "@/lib/api"
import { toast } from "sonner"
import type { User } from "@/types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
  checkAuth: () => Promise<boolean>
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: "farmer" | "agronomist"
  location: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkAuth = async (): Promise<boolean> => {
    try {
      const isAuth = await authApi.checkAuthStatus()
      if (isAuth) {
        const userData = await authApi.getCurrentUser()
        setUser(userData)
        setIsAuthenticated(true)
        return true
      } else {
        setUser(null)
        setIsAuthenticated(false)
        return false
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
      setIsAuthenticated(false)
      return false
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)
      await checkAuth()
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password)

      // Store tokens
      if (response.access_token) {
        localStorage.setItem("cropalert-access-token", response.access_token)
      }
      if (response.refresh_token) {
        localStorage.setItem("cropalert-refresh-token", response.refresh_token)
      }

      // Set user data
      const userData = response.user || response
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("cropalert-user", JSON.stringify(userData))

      toast.success("Welcome back!", {
        description: "You have successfully signed in to CropAlert.",
      })
    } catch (error) {
      console.error("Login error:", error)
      // if (error instanceof ApiError) {
      //   throw new Error(error.message)
      // }
      if (error instanceof Error) {
        throw new Error(error.message)
      }
      throw new Error("Login failed. Please try again.")
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await authApi.register(userData)
      return response
    } catch (error) {
      console.error("Registration error:", error)
      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw new Error("Registration failed. Please try again.")
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
      toast.success("Logged out successfully")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear all auth data
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem("cropalert-access-token")
      localStorage.removeItem("cropalert-refresh-token")
      localStorage.removeItem("cropalert-user")
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
