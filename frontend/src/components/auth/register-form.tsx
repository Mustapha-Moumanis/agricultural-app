// "use client"

// import type React from "react"
// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Sprout, Users, Eye, EyeOff } from "lucide-react"
// import { ThemeToggle } from "@/components/theme-toggle"
// import type { User } from "@/types"

// interface RegisterFormProps {
//   onRegister: (userData: Omit<User, "id">) => void
// }

// export function RegisterForm({ onRegister }: RegisterFormProps) {
//   const navigate = useNavigate()
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "farmer" as "agronomist" | "farmer",
//     location: "",
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match")
//       return
//     }

//     setIsLoading(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     // Navigate to email verification
//     navigate("/verify-email", {
//       state: {
//         email: formData.email,
//         userData: {
//           name: formData.name,
//           email: formData.email,
//           role: formData.role,
//           location: formData.location,
//         },
//       },
//     })

//     setIsLoading(false)
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
//             Join CropAlert
//           </CardTitle>
//           <CardDescription>Create your account to start receiving agricultural alerts</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 placeholder="Enter your full name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="space-y-3">
//               <Label>I am a...</Label>
//               <div className="grid grid-cols-2 gap-3">
//                 <Button
//                   type="button"
//                   variant={formData.role === "farmer" ? "default" : "outline"}
//                   className="h-auto p-4 flex flex-col gap-2"
//                   onClick={() => setFormData({ ...formData, role: "farmer" })}
//                   disabled={isLoading}
//                 >
//                   <Users className="w-5 h-5" />
//                   <span>Farmer</span>
//                 </Button>
//                 <Button
//                   type="button"
//                   variant={formData.role === "agronomist" ? "default" : "outline"}
//                   className="h-auto p-4 flex flex-col gap-2"
//                   onClick={() => setFormData({ ...formData, role: "agronomist" })}
//                   disabled={isLoading}
//                 >
//                   <Sprout className="w-5 h-5" />
//                   <span>Agronomist</span>
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="location">Location</Label>
//               <Input
//                 id="location"
//                 placeholder="City, State/Province"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Create a password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                   disabled={isLoading}
//                 />
//                 <Button
//                   type="button"
//                   variant="ghost"
//                   size="icon"
//                   className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={isLoading}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4 text-muted-foreground" />
//                   ) : (
//                     <Eye className="h-4 w-4 text-muted-foreground" />
//                   )}
//                 </Button>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <Input
//                 id="confirmPassword"
//                 type="password"
//                 placeholder="Confirm your password"
//                 value={formData.confirmPassword}
//                 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                 required
//                 disabled={isLoading}
//               />
//             </div>

//             <Button
//               type="submit"
//               className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//               disabled={isLoading}
//             >
//               {isLoading ? "Creating Account..." : "Create Account"}
//             </Button>
//           </form>

//           <div className="mt-4 text-center">
//             <Link to="/login">
//               <Button variant="link" className="text-green-600 dark:text-green-400">
//                 Already have an account? Sign in
//               </Button>
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }


"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sprout, Users, Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "../theme-toggle"
import type { User } from "@/types"

const RegisterFormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
    role: z.enum(["farmer", "agronomist"], {
      required_error: "Please select your role.",
    }),
    location: z.string().min(2, {
      message: "Location must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

interface RegisterFormProps {
  onRegister: (userData: Omit<User, "id">) => void
}

export function RegisterForm({ onRegister }: RegisterFormProps) {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "farmer",
      location: "",
    },
  })

  async function onSubmit(data: z.infer<typeof RegisterFormSchema>) {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to email verification
      navigate("/verify-email", {
        state: {
          email: data.email,
          userData: {
            name: data.name,
            email: data.email,
            role: data.role,
            location: data.location,
          },
        },
      })

      toast.success("Account created!", {
        description: "Please check your email to verify your account.",
      })
    } catch (error) {
      toast.error("Registration failed", {
        description: "Please try again later.",
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
            Join CropAlert
          </CardTitle>
          <CardDescription>Create your account to start receiving agricultural alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" disabled={isLoading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>I am a...</FormLabel>
                    <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col sm:flex-row gap-4"
                        >
                          {/* Farmer */}
                          <div className="relative flex-1">
                            <RadioGroupItem value="farmer" id="farmer" className="sr-only peer" />
                            <Label
                              htmlFor="farmer"
                              className="cursor-pointer px-6 py-3 border rounded flex items-center gap-2 font-medium transition-colors
                                peer-data-[state=checked]:bg-green-50
                                peer-data-[state=checked]:border-green-600
                                peer-data-[state=checked]:text-green-600
                                peer-data-[state=checked]:ring-1 text-muted-foreground"
                            >
                              <Users className="w-4 h-4" />
                              Farmer
                            </Label>
                          </div>

                          {/* Agronomist */}
                          <div className="relative flex-1">
                            <RadioGroupItem value="agronomist" id="agronomist" className="sr-only peer" />
                            <Label
                              htmlFor="agronomist"
                              className="cursor-pointer px-6 py-3 border rounded flex items-center gap-2 font-medium transition-colors
                                peer-data-[state=checked]:bg-green-50
                                peer-data-[state=checked]:border-green-600
                                peer-data-[state=checked]:text-green-600
                                peer-data-[state=checked]:ring-1 text-muted-foreground"
                            >
                              <Sprout className="w-4 h-4" />
                              Agronomist
                            </Label>
                          </div>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, State/Province" disabled={isLoading} {...field} />
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
                          placeholder="Create a password"
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm your password" disabled={isLoading} {...field} />
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
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <Link to="/login">
              Already have an account?
              <Button variant="link" className="text-green-600 dark:text-green-400 p-1">
                Sign in
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
