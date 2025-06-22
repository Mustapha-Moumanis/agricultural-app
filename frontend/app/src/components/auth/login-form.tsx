"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Sprout, Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "../theme-toggle"
import { useAuth } from "@/hooks/use-auth.tsx"

const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    setIsLoading(true)

    try {
      await login(data.email, data.password)
    } catch (error) {
      toast.error("Sign in failed", {
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center p-4 transition-colors">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
            <Sprout className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            CropAlert
          </CardTitle>
          <CardDescription>Connect agronomists and farmers for real-time agricultural insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 space-y-2 text-center">
            <Link to="/register">
              Don't have an account?
              <Button variant="link" className="text-green-600 dark:text-green-400 p-1">
                Sign up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


// "use client"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"
// import { z } from "zod"
// import { useState } from "react"
// import { Link } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Sprout, Eye, EyeOff } from "lucide-react"
// import { ThemeToggle } from "../theme-toggle"
// import type { User } from "@/types"

// const LoginFormSchema = z.object({
//   email: z.string().email({
//     message: "Please enter a valid email address.",
//   }),
//   password: z.string().min(6, {
//     message: "Password must be at least 6 characters.",
//   }),
// })

// interface LoginFormProps {
//   onLogin: (userData: Omit<User, "id">) => void
// }

// export function LoginForm({ onLogin }: LoginFormProps) {
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const form = useForm<z.infer<typeof LoginFormSchema>>({
//     resolver: zodResolver(LoginFormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   })

//   async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
//     setIsLoading(true)

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       onLogin({
//         name: data.email.split("@")[0],
//         email: data.email,
//         location: "New York, NY",
//         role: "agronomist"
//       })

//       toast.success("Welcome back!", {
//         description: "You have successfully signed in to CropAlert.",
//       })
//     } catch (error) {
//       toast.error("Sign in failed", {
//         description: "Please check your credentials and try again.",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center p-4 transition-colors">
//       <div className="absolute top-4 right-4">
//         <ThemeToggle />
//       </div>

//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader className="text-center">
//           <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
//             <Sprout className="w-8 h-8 text-white" />
//           </div>
//           <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
//             CropAlert
//           </CardTitle>
//           <CardDescription>Connect agronomists and farmers for real-time agricultural insights</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input type="email" placeholder="Enter your email" disabled={isLoading} {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <div className="relative">
//                         <Input
//                           type={showPassword ? "text" : "password"}
//                           placeholder="Enter your password"
//                           disabled={isLoading}
//                           {...field}
//                         />
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                           onClick={() => setShowPassword(!showPassword)}
//                           disabled={isLoading}
//                         >
//                           {showPassword ? (
//                             <EyeOff className="h-4 w-4 text-muted-foreground" />
//                           ) : (
//                             <Eye className="h-4 w-4 text-muted-foreground" />
//                           )}
//                         </Button>
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                     {/* TODO:  */}
//                     {/* <Link to="/reset-password">
//                       <div className="text-right">
//                         <Button variant="link" className="text-green-600 dark:text-green-400 p-0">
//                           Forgot your password?
//                         </Button>
//                       </div>
//                     </Link> */}
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Signing in..." : "Sign In"}
//               </Button>
//             </form>
//           </Form>

//           <div className="mt-4 space-y-2 text-center">
//             <Link to="/register">
//                 Don't have an account?
//               <Button variant="link" className="text-green-600 dark:text-green-400 p-1">
//                 Sign up
//               </Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
