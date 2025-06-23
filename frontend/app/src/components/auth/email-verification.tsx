"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Mail, CheckCircle, RefreshCw, ArrowLeft, AlertCircle } from "lucide-react"
import { ThemeToggle } from "../theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { authApi } from "@/lib/api"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const VerificationFormSchema = z.object({
  key: z
    .string()
    .length(6, {
      message: "Verification code must be exactly 6 digits.",
    })
    .regex(/^\d{6}$/, {
      message: "Verification code must contain only numbers.",
    }),
})

export function EmailVerification() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isVerified, setIsVerified] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string>("")

  const email = location.state?.email || ""
  const userData = location.state?.userData

  const form = useForm<z.infer<typeof VerificationFormSchema>>({
    resolver: zodResolver(VerificationFormSchema),
    defaultValues: {
      key: "",
    },
  })

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

  // Helper function to format field errors
  const getFieldError = (fieldName: string) => {
    if (apiErrors[fieldName]) {
      return apiErrors[fieldName].join(", ")
    }
    return undefined
  }

  const handleVerifyEmail = async (data: z.infer<typeof VerificationFormSchema>) => {
    setIsVerifying(true)
    setApiErrors({})
    setGeneralError("")

    try {
      await authApi.verifyEmail(email, data.key)
      setIsVerified(true)
      toast.success("Email verified!", {
        description: "Your account has been successfully verified.",
      })

      // Auto redirect after verification
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (error: any) {
      console.error("Email verification error:", error)
      
      if (error.response?.data) {
        const errorData = error.response.data
        
        // Handle field-specific errors
        if (typeof errorData === "object" && !errorData.detail && !errorData.non_field_errors) {
          setApiErrors(errorData)
          // Set form errors for each field
          Object.keys(errorData).forEach((field) => {
            if (field in form.getValues()) {
              form.setError(field as keyof z.infer<typeof VerificationFormSchema>, {
                type: "server",
                message: errorData[field].join(", "),
              })
            }
          })
        }
        // Handle non-field errors
        else if (errorData.non_field_errors) {
          setGeneralError(errorData.non_field_errors.join(", "))
        }
        // Handle detail error
        else if (errorData.detail) {
          setGeneralError(errorData.detail)
        }
        // Handle other error formats
        else if (typeof errorData === "string") {
          setGeneralError(errorData)
        } else {
          setGeneralError("Email verification failed. Please try again.")
        }
      } else {
        setGeneralError(error.message || "Email verification failed. Please try again.")
      }

      toast.error("Verification failed", {
        description: "Please check the verification code and try again.",
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendEmail = async () => {
    if (!email) return

    setIsResending(true)
    setApiErrors({})
    setGeneralError("")

    try {
      await authApi.resendEmailVerification(email)
      setCountdown(60)
      setCanResend(false)
      toast.success("Verification email sent!", {
        description: "Please check your email for the new verification code.",
      })
    } catch (error: any) {
      console.error("Resend email error:", error)
      
      let errorMessage = "Failed to resend verification email. Please try again."
      
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(", ")
        } else if (typeof errorData === "string") {
          errorMessage = errorData
        }
      }

      setGeneralError(errorMessage)
      toast.error("Resend failed", {
        description: errorMessage,
      })
    } finally {
      setIsResending(false)
    }
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
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleVerifyEmail)} className="space-y-4">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isVerifying}
                        >
                          <InputOTPGroup>
                            {Array.from({ length: 6 }, (_, index) => (
                              <InputOTPSlot key={index} index={index} />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>
                    <FormMessage>{getFieldError("key")}</FormMessage>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                disabled={isVerifying || form.watch("key").length !== 6}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Email
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Enter the 6-digit code from your email.</p>
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
                  Resend Verification Code
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend in {countdown}s
                </>
              )}
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