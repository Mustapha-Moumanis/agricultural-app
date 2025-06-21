// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Sprout, Users, Eye, EyeOff } from "lucide-react"
// import type { User } from "@/types"
// import { Link } from "react-router-dom"

// interface LoginFormProps {
//   onLogin: (userData: Omit<User, "id">) => void
// }

// export function LoginForm({ onLogin }: LoginFormProps) {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     role: "farmer" as "agronomist" | "farmer",
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsLoading(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1000))

//     onLogin({
//       name: formData.email.split("@")[0],
//       email: formData.email,
//       role: formData.role,
//       location: "New York, NY",
//     })

//     setIsLoading(false)
//   }

//   return (
//     // <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//     //   <Card className="w-full max-w-md">
//     //     <CardHeader className="text-center">
//     //       <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
//     //         <Sprout className="w-8 h-8 text-white" />
//     //       </div>
//     //       <CardTitle className="text-2xl font-bold text-green-800">CropAlert</CardTitle>
//     //       <CardDescription>Connect agronomists and farmers for real-time agricultural insights</CardDescription>
//     //     </CardHeader>
//     //     <CardContent>
//     //       <form onSubmit={handleSubmit} className="space-y-4">
//     //         <div className="space-y-2">
//     //           <Label htmlFor="email">Email</Label>
//     //           <Input
//     //             id="email"
//     //             type="email"
//     //             placeholder="Enter your email"
//     //             className="rounded focus:!border-green-500 focus:!ring-green-500 focus:!ring-1"
//     //             autoComplete="email"
//     //             autoFocus
//     //             value={formData.email}
//     //             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//     //             required
//     //           />
//     //         </div>
//     //         <div className="space-y-2">
//     //           <Label htmlFor="password">Password</Label>
//     //           <div className="relative">
//     //             <Input
//     //               id="password"
//     //               type={showPassword ? "text" : "password"}
//     //               placeholder="Create a password"
//     //               value={formData.password}
//     //               className="rounded focus:!border-green-500 focus:!ring-green-500 focus:!ring-1"
//     //               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//     //               required
//     //               disabled={isLoading}
//     //             />
//     //             <Button
//     //               type="button"
//     //               variant="ghost"
//     //               size="icon"
//     //               className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//     //               onClick={() => setShowPassword(!showPassword)}
//     //               disabled={isLoading}
//     //             >
//     //               {showPassword ? (
//     //                 <EyeOff className="h-4 w-4 text-muted-foreground" />
//     //               ) : (
//     //                 <Eye className="h-4 w-4 text-muted-foreground" />
//     //               )}
//     //             </Button>
//     //           </div>
//     //           {/* <Input
//     //             id="password"
//     //             type={showPassword ? "text" : "password"}
//     //             placeholder="Create a password"
//     //             className="rounded focus:!border-green-500 focus:!ring-green-500 focus:!ring-1"
//     //             value={formData.password}
//     //             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//     //             required
//     //             disabled={isLoading}
//     //           /> */}
//     //         </div>
//     //         <div className="space-y-2">
//     //           <Label htmlFor="role">I am a...</Label>
//     //           <RadioGroup
//     //             value={formData.role}
//     //             onValueChange={(value: "agronomist" | "farmer") => setFormData({ ...formData, role: value })}
//     //             className="flex gap-4"
//     //           >
//     //           {/* Farmer */}
//     //           <div className="relative flex-1">
//     //             <RadioGroupItem
//     //               value="farmer"
//     //               id="farmer"
//     //               className="sr-only peer"
//     //             />
//     //             <Label
//     //               htmlFor="farmer"
//     //               className="cursor-pointer px-6 py-3 border rounded flex items-center gap-2 font-medium transition-colors
//     //                 peer-data-[state=checked]:bg-green-50
//     //                 peer-data-[state=checked]:border-green-600
//     //                 peer-data-[state=checked]:text-green-600
//     //                 peer-data-[state=checked]:!ring-1
//     //                 text-muted-foreground"
//     //             >
//     //               <Users className="w-4 h-4" />
//     //               Farmer
//     //             </Label>
//     //           </div>

//     //           {/* Agronomist */}
//     //           <div className="relative flex-1">
//     //             <RadioGroupItem
//     //               value="agronomist"
//     //               id="agronomist"
//     //               className="sr-only peer"
//     //             />
//     //             <Label
//     //               htmlFor="agronomist"
//     //               className="cursor-pointer px-6 py-3 border rounded flex items-center gap-2 font-medium transition-colors
//     //                 peer-data-[state=checked]:bg-green-50
//     //                 peer-data-[state=checked]:border-green-600
//     //                 peer-data-[state=checked]:text-green-600
//     //                 peer-data-[state=checked]:!ring-1
//     //                 text-muted-foreground"
//     //             >
//     //               <Sprout className="w-4 h-4" />
//     //               Agronomist
//     //             </Label>
//     //           </div>
//     //         </RadioGroup>
//     //         </div>
//     //         <Button
//     //           type="submit"
//     //           className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//     //           disabled={isLoading}
//     //         >
//     //           {isLoading ? "Signing in..." : "Sign In"}
//     //         </Button>
//     //       </form>
//     //       <div className="mt-4 text-center">
//     //         <Link to="/register">
//     //           Don't have an account?
//     //           <Button variant="link" className="cursor-pointer font-bold text-green-600 p-2 ">
//     //             Sign up
//     //           </Button>
//     //         </Link>
//     //       </div>
//     //     </CardContent>
//     //   </Card>
//     // </div>
//     // <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-50 flex flex-col md:flex-row items-stretch justify-center items-center p-4">
//     //   {/* Left Panel */}
//     //   <div className="w-full md:w-1/2 bg-green-600 text-white p-8 flex flex-col justify-between">
//     //     <div>
//     //       <h1 className="text-4xl font-bold mb-4">🌾 CropAlert</h1>
//     //       <h2 className="text-2xl font-semibold">Let’s get you started</h2>
//     //       <p className="mt-4 text-green-100">
//     //         Agronomists publish alerts. Farmers receive real-time crop notifications.
//     //       </p>
//     //     </div>
//     //     <div className="mt-10 hidden md:block">
//     //       <blockquote className="italic text-sm">“This platform helps us reach farmers instantly during critical crop stages.”</blockquote>
//     //       <p className="mt-2 font-semibold">– Dr. Lina, Agronomist</p>
//     //     </div>
//     //   </div>

//     //   {/* Right Panel */}
//     //   <Card className="w-full md:w-1/2 bg-white p-8 md:p-10">
//     //     <CardHeader className="text-center">
//     //       <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
//     //         <Sprout className="w-8 h-8 text-white" />
//     //       </div>
//     //       <CardTitle className="text-2xl font-bold text-green-800">CropAlert</CardTitle>
//     //       <CardDescription>
//     //         Connect agronomists and farmers for real-time agricultural insights
//     //       </CardDescription>
//     //     </CardHeader>
//     //     <CardContent>
//     //       <form onSubmit={handleSubmit} className="space-y-4">
//     //         {/* Email */}
//     //         <div className="space-y-2">
//     //           <Label htmlFor="email">Email</Label>
//     //           <Input
//     //             id="email"
//     //             type="email"
//     //             placeholder="Enter your email"
//     //             className="rounded focus:border-green-500 focus:ring-green-500 focus:ring-1"
//     //             autoComplete="email"
//     //             autoFocus
//     //             value={formData.email}
//     //             onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//     //             required
//     //           />
//     //         </div>

//     //         {/* Password */}
//     //         <div className="space-y-2">
//     //           <Label htmlFor="password">Password</Label>
//     //           <div className="relative">
//     //             <Input
//     //               id="password"
//     //               type={showPassword ? "text" : "password"}
//     //               placeholder="Create a password"
//     //               value={formData.password}
//     //               className="rounded focus:border-green-500 focus:ring-green-500 focus:ring-1"
//     //               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//     //               required
//     //               disabled={isLoading}
//     //             />
//     //             <Button
//     //               type="button"
//     //               variant="ghost"
//     //               size="icon"
//     //               className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//     //               onClick={() => setShowPassword(!showPassword)}
//     //               disabled={isLoading}
//     //             >
//     //               {showPassword ? (
//     //                 <EyeOff className="h-4 w-4 text-muted-foreground" />
//     //               ) : (
//     //                 <Eye className="h-4 w-4 text-muted-foreground" />
//     //               )}
//     //             </Button>
//     //           </div>
//     //         </div>

//     //         {/* Role Selection */}
//     //         <div className="space-y-2">
//     //           <Label htmlFor="role">I am a...</Label>
//     //           <RadioGroup
//     //             value={formData.role}
//     //             onValueChange={(value: "agronomist" | "farmer") => setFormData({ ...formData, role: value })}
//     //             className="flex flex-col sm:flex-row gap-4"
//     //           >
//     //             {/* Farmer */}
//     //             <div className="relative flex-1">
//     //               <RadioGroupItem value="farmer" id="farmer" className="sr-only peer" />
//     //               <Label
//     //                 htmlFor="farmer"
//     //                 className="cursor-pointer px-6 py-3 border rounded flex items-center gap-2 font-medium transition-colors
//     //                   peer-data-[state=checked]:bg-green-50
//     //                   peer-data-[state=checked]:border-green-600
//     //                   peer-data-[state=checked]:text-green-600
//     //                   peer-data-[state=checked]:ring-1 text-muted-foreground"
//     //               >
//     //                 <Users className="w-4 h-4" />
//     //                 Farmer
//     //               </Label>
//     //             </div>

//     //             {/* Agronomist */}
//     //             <div className="relative flex-1">
//     //               <RadioGroupItem value="agronomist" id="agronomist" className="sr-only peer" />
//     //               <Label
//     //                 htmlFor="agronomist"
//     //                 className="cursor-pointer px-6 py-3 border rounded flex items-center gap-2 font-medium transition-colors
//     //                   peer-data-[state=checked]:bg-green-50
//     //                   peer-data-[state=checked]:border-green-600
//     //                   peer-data-[state=checked]:text-green-600
//     //                   peer-data-[state=checked]:ring-1 text-muted-foreground"
//     //               >
//     //                 <Sprout className="w-4 h-4" />
//     //                 Agronomist
//     //               </Label>
//     //             </div>
//     //           </RadioGroup>
//     //         </div>

//     //         {/* Submit */}
//     //         <Button
//     //           type="submit"
//     //           className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//     //           disabled={isLoading}
//     //         >
//     //           {isLoading ? "Signing in..." : "Sign In"}
//     //         </Button>
//     //       </form>

//     //       <div className="mt-4 text-center">
//     //         <Link to="/register">
//     //           Don't have an account?
//     //           <Button variant="link" className="cursor-pointer font-bold text-green-600 p-2 ">
//     //             Sign up
//     //           </Button>
//     //         </Link>
//     //       </div>
//     //     </CardContent>
//     //   </Card>
//     // </div>
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
//         {/* Left Panel */}
//         <div className="w-full md:w-1/2 bg-green-600 text-white p-8 flex flex-col justify-between">
//           <div>
//             <h1 className="text-4xl font-bold mb-4">🌾 CropAlert</h1>
//             <h2 className="text-2xl font-semibold">Let’s get you started</h2>
//             <p className="mt-4 text-green-100">
//               Agronomists publish alerts. Farmers receive real-time crop notifications.
//             </p>
//           </div>
//           <div className="mt-10 hidden md:block">
//             <blockquote className="italic text-sm">“This platform helps us reach farmers instantly during critical crop stages.”</blockquote>
//             <p className="mt-2 font-semibold">– Dr. Lina, Agronomist</p>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <Card className="w-full md:w-1/2 bg-white p-8 md:p-10">
//           <CardHeader className="text-center">
//             <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
//               <Sprout className="w-8 h-8 text-white" />
//             </div>
//             <CardTitle className="text-2xl font-bold text-green-800">CropAlert</CardTitle>
//             <CardDescription>
//               Connect agronomists and farmers for real-time agricultural insights
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="Enter your email"
//                   className="rounded focus:border-green-500 focus:ring-green-500 focus:ring-1"
//                   autoComplete="email"
//                   autoFocus
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                 />
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Create a password"
//                     value={formData.password}
//                     className="rounded focus:border-green-500 focus:ring-green-500 focus:ring-1"
//                     onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                     required
//                     disabled={isLoading}
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                     disabled={isLoading}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-4 w-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="h-4 w-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               {/* Role Selection */}
//               <div className="space-y-2">
//                 <Label htmlFor="role">I am a...</Label>
//                 <RadioGroup
//                   value={formData.role}
//                   onValueChange={(value: "agronomist" | "farmer") => setFormData({ ...formData, role: value })}
//                   className="flex flex-col sm:flex-row gap-4"
//                 >
//                   {/* Farmer */}
//                   <div className="relative flex-1">
//                     <RadioGroupItem value="farmer" id="farmer" className="sr-only peer" />
//                     <Label
//                       htmlFor="farmer"
//                       className="cursor-pointer px-6 py-3 border rounded flex items-center gap-2 font-medium transition-colors
//                         peer-data-[state=checked]:bg-green-50
//                         peer-data-[state=checked]:border-green-600
//                         peer-data-[state=checked]:text-green-600
//                         peer-data-[state=checked]:ring-1 text-muted-foreground"
//                     >
//                       <Users className="w-4 h-4" />
//                       Farmer
//                     </Label>
//                   </div>

//                   {/* Agronomist */}
//                   <div className="relative flex-1">
//                     <RadioGroupItem value="agronomist" id="agronomist" className="sr-only peer" />
//                     <Label
//                       htmlFor="agronomist"
//                       className="cursor-pointer px-6 py-3 border rounded flex items-center gap-2 font-medium transition-colors
//                         peer-data-[state=checked]:bg-green-50
//                         peer-data-[state=checked]:border-green-600
//                         peer-data-[state=checked]:text-green-600
//                         peer-data-[state=checked]:ring-1 text-muted-foreground"
//                     >
//                       <Sprout className="w-4 h-4" />
//                       Agronomist
//                     </Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Submit */}
//               <Button
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//                 disabled={isLoading}
//               >
//                 {isLoading ? "Signing in..." : "Sign In"}
//               </Button>
//             </form>

//             <div className="mt-4 text-center">
//               <Link to="/register">
//                 Don't have an account?
//                 <Button variant="link" className="cursor-pointer font-bold text-green-600 p-2 ">
//                   Sign up
//                 </Button>
//               </Link>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>

//   )
// }


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
import type { User } from "@/types"

const LoginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

interface LoginFormProps {
  onLogin: (userData: Omit<User, "id">) => void
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onLogin({
        name: data.email.split("@")[0],
        email: data.email,
        location: "New York, NY",
        role: "agronomist"
      })

      toast.success("Welcome back!", {
        description: "You have successfully signed in to CropAlert.",
      })
    } catch (error) {
      toast.error("Sign in failed", {
        description: "Please check your credentials and try again.",
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
                    {/* TODO:  */}
                    {/* <Link to="/reset-password">
                      <div className="text-right">
                        <Button variant="link" className="text-green-600 dark:text-green-400 p-0">
                          Forgot your password?
                        </Button>
                      </div>
                    </Link> */}
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
