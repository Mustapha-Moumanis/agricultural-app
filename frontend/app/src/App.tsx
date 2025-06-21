"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { LoginForm } from "./components/auth/login-form"
import { RegisterForm } from "./components/auth/register-form"
import { EmailVerification } from "./components/auth/email-verification"
// import { RegisterForm } from "./components/auth/register-form"
// import { ResetPasswordForm } from "./components/auth/reset-password-form"
import { AgronomistDashboard } from "./components/dashboard/agronomist"
import { FarmerDashboard } from "./components/dashboard/farmer"
import type { User } from "./types"

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("cropalert-user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("cropalert-user")
      }
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData: { name: string; role: "agronomist" | "farmer" }) => {
    // For demo purposes, generate a fake email based on the name
    const email = `${userData.name.replace(/\s+/g, '').toLowerCase()}@example.com`
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email,
      role: userData.role,
      farmLocation:
        userData.role === "farmer"
          ? {
              lat: 40.7128,
              lng: -74.006,
              address: "New York, NY",
            }
          : undefined,
    }
    setUser(newUser)
    localStorage.setItem("cropalert-user", JSON.stringify(newUser))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("cropalert-user")
  }

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("cropalert-user", JSON.stringify(updatedUser))
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginForm onLogin={handleLogin} />}
      />
       <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterForm onRegister={handleLogin} />}
      />
      <Route path="/verify-email" element={user ? <Navigate to="/dashboard" replace /> : <EmailVerification />} />
      {/*<Route path="/reset-password" element={user ? <Navigate to="/dashboard" replace /> : <ResetPasswordForm />} />
      <Route path="/verify-email" element={user ? <Navigate to="/dashboard" replace /> : <EmailVerification />} /> 
      */}
      <Route
        path="/dashboard"
        element={
          user ? (
            user.role === "agronomist" ? (
              <AgronomistDashboard user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
            ) : (
              <FarmerDashboard user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      /> 
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default App
