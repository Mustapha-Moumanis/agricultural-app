"use client"
import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, CheckCircle, RefreshCw, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "../theme-toggle"
import type { User } from "@/types"

export function EmailVerification() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isVerified, setIsVerified] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const email = location.state?.email || ""
  const userData = location.state?.userData as Omit<User, "id">

  useEffect(() => {
    if (!email) {
      navigate("/register")
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, navigate])

  const handleResendEmail = async () => {
    setIsResending(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsResending(false)
    setCountdown(60)
    setCanResend(false)
  }

  const handleVerifyEmail = async () => {
    // Simulate email verification
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsVerified(true)

    // Auto redirect after verification
    setTimeout(() => {
      if (userData) {
        // In a real app, you would call the onRegister function here
        navigate("/login")
      }
    }, 2000)
  }

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center p-4 transition-colors">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-300">Email Verified!</CardTitle>
            <CardDescription>
              Your account has been successfully verified. You can now sign in to CropAlert.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">Redirecting you to sign in...</p>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Click the link in your email to verify your account.</p>
            <p>Didn't receive the email? Check your spam folder.</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full"
              disabled={!canResend || isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : canResend ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Verification Email
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend in {countdown}s
                </>
              )}
            </Button>

            {/* Demo button - remove in production */}
            <Button
              onClick={handleVerifyEmail}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Simulate Email Verification
            </Button>
          </div>

          <div className="text-center">
            <Link to="/register">
              <Button variant="link" className="text-green-600 dark:text-green-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Registration
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
