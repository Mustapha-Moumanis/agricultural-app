// "use client"

// import type React from "react"

// import { useState, useRef } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { toast } from "sonner"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   MapPin,
//   Navigation,
//   Upload,
//   Eye,
//   Save,
//   Send,
//   AlertTriangle,
//   Phone,
//   Mail,
//   ImageIcon,
//   X,
//   Search,
// } from "lucide-react"
// import { useAuth } from "@/hooks/use-auth"
// import { alertsApi } from "@/lib/api"
// import type { Alert } from "@/types"

// const AlertFormSchema = z.object({
//   title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title too long"),
//   cropType: z.string().min(1, "Please select a crop type"),
//   category: z.enum(["pest_outbreak", "disease", "weather_damage", "harvest_ready", "equipment_sharing", "general"]),
//   severity: z.enum(["low", "medium", "high", "critical"]),
//   description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description too long"),
//   contactPhone: z.string().optional(),
//   contactEmail: z.string().email().optional().or(z.literal("")),
//   validityDays: z.number().min(1).max(30),
//   location: z.object({
//     lat: z.number(),
//     lng: z.number(),
//     address: z.string(),
//     radius: z.number().min(500).max(50000), // 500m to 50km
//   }),
//   tags: z.array(z.string()).optional(),
// })

// const CROP_TYPES = [
//   { id: "wheat", name: "Wheat", category: "Grains" },
//   { id: "corn", name: "Corn/Maize", category: "Grains" },
//   { id: "rice", name: "Rice", category: "Grains" },
//   { id: "soybeans", name: "Soybeans", category: "Legumes" },
//   { id: "tomatoes", name: "Tomatoes", category: "Vegetables" },
//   { id: "potatoes", name: "Potatoes", category: "Vegetables" },
//   { id: "onions", name: "Onions", category: "Vegetables" },
//   { id: "carrots", name: "Carrots", category: "Vegetables" },
//   { id: "lettuce", name: "Lettuce", category: "Leafy Greens" },
//   { id: "spinach", name: "Spinach", category: "Leafy Greens" },
//   { id: "apples", name: "Apples", category: "Fruits" },
//   { id: "oranges", name: "Oranges", category: "Fruits" },
//   { id: "grapes", name: "Grapes", category: "Fruits" },
//   { id: "cotton", name: "Cotton", category: "Fiber" },
//   { id: "sugarcane", name: "Sugarcane", category: "Sugar" },
// ]

// const CATEGORIES = [
//   { id: "pest_outbreak", name: "Pest Outbreak", icon: "🐛", color: "bg-red-100 text-red-800" },
//   { id: "disease", name: "Plant Disease", icon: "🦠", color: "bg-orange-100 text-orange-800" },
//   { id: "weather_damage", name: "Weather Damage", icon: "⛈️", color: "bg-blue-100 text-blue-800" },
//   { id: "harvest_ready", name: "Harvest Ready", icon: "🌾", color: "bg-green-100 text-green-800" },
//   { id: "equipment_sharing", name: "Equipment Sharing", icon: "🚜", color: "bg-purple-100 text-purple-800" },
//   { id: "general", name: "General Alert", icon: "📢", color: "bg-gray-100 text-gray-800" },
// ]

// const SEVERITY_LEVELS = [
//   { id: "low", name: "Low", color: "bg-green-100 text-green-800 border-green-300" },
//   { id: "medium", name: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
//   { id: "high", name: "High", color: "bg-orange-100 text-orange-800 border-orange-300" },
//   { id: "critical", name: "Critical", color: "bg-red-100 text-red-800 border-red-300" },
// ]

// const RADIUS_OPTIONS = [
//   { value: 500, label: "500m" },
//   { value: 1000, label: "1km" },
//   { value: 2000, label: "2km" },
//   { value: 5000, label: "5km" },
//   { value: 10000, label: "10km" },
//   { value: 25000, label: "25km" },
//   { value: 50000, label: "50km" },
// ]

// interface AlertCreationFormProps {
//   onSuccess?: (alert: Alert) => void
//   onCancel?: () => void
//   initialData?: Partial<Alert>
// }

// export function AlertCreationForm({ onSuccess, onCancel, initialData }: AlertCreationFormProps) {
//   const { user } = useAuth()
//   const [isLoading, setIsLoading] = useState(false)
//   const [isDraft, setIsDraft] = useState(false)
//   const [showPreview, setShowPreview] = useState(false)
//   const [images, setImages] = useState<File[]>([])
//   const [cropSearch, setCropSearch] = useState("")
//   const [isGettingLocation, setIsGettingLocation] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const form = useForm<z.infer<typeof AlertFormSchema>>({
//     resolver: zodResolver(AlertFormSchema),
//     defaultValues: {
//       title: initialData?.title || "",
//       cropType: initialData?.cropType || "",
//       category: initialData?.category || "general",
//       severity: initialData?.severity || "medium",
//       description: initialData?.description || "",
//       contactPhone: initialData?.contactInfo?.phone || "",
//       contactEmail: initialData?.contactInfo?.email || "",
//       validityDays: 7,
//       location: {
//         lat: initialData?.location?.lat || user?.latitude || 0,
//         lng: initialData?.location?.lng || user?.longitude || 0,
//         address: initialData?.location?.address || user?.address || "",
//         radius: initialData?.location?.radius || 5000,
//       },
//       tags: initialData?.tags || [],
//     },
//   })

//   const filteredCrops = CROP_TYPES.filter((crop) => crop.name.toLowerCase().includes(cropSearch.toLowerCase()))

//   const getCurrentLocation = async () => {
//     setIsGettingLocation(true)

//     if (!navigator.geolocation) {
//       toast.error("Geolocation not supported")
//       setIsGettingLocation(false)
//       return
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords

//         try {
//           // Reverse geocoding
//           const response = await fetch(
//             `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
//           )
//           const data = await response.json()

//           const address =
//             `${data.city || data.locality || ""}, ${data.principalSubdivision || ""}, ${data.countryName || ""}`.replace(
//               /^,\s*|,\s*$/g,
//               "",
//             )

//           form.setValue("location.lat", latitude)
//           form.setValue("location.lng", longitude)
//           form.setValue("location.address", address)

//           toast.success("Location updated!")
//         } catch (error) {
//           form.setValue("location.lat", latitude)
//           form.setValue("location.lng", longitude)
//           toast.success("GPS coordinates obtained!")
//         }

//         setIsGettingLocation(false)
//       },
//       (error) => {
//         toast.error("Failed to get location")
//         setIsGettingLocation(false)
//       },
//     )
//   }

//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(event.target.files || [])
//     const validFiles = files.filter((file) => {
//       const isValidType = file.type.startsWith("image/")
//       const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

//       if (!isValidType) {
//         toast.error(`${file.name} is not a valid image file`)
//         return false
//       }
//       if (!isValidSize) {
//         toast.error(`${file.name} is too large (max 5MB)`)
//         return false
//       }
//       return true
//     })

//     setImages((prev) => [...prev, ...validFiles].slice(0, 5)) // Max 5 images
//   }

//   const removeImage = (index: number) => {
//     setImages((prev) => prev.filter((_, i) => i !== index))
//   }

//   const saveDraft = async () => {
//     setIsDraft(true)
//     // Save to localStorage for now
//     localStorage.setItem("alert-draft", JSON.stringify(form.getValues()))
//     toast.success("Draft saved!")
//     setIsDraft(false)
//   }

//   const onSubmit = async (data: z.infer<typeof AlertFormSchema>) => {
//     setIsLoading(true)

//     try {
//       const alertData = {
//         title: data.title,
//         description: data.description,
//         cropType: data.cropType,
//         category: data.category,
//         severity: data.severity,
//         location: data.location,
//         contactInfo: {
//           phone: data.contactPhone,
//           email: data.contactEmail,
//         },
//         validUntil: new Date(Date.now() + data.validityDays * 24 * 60 * 60 * 1000).toISOString(),
//         tags: data.tags,
//         images: images, // Will be handled by backend
//       }

//       const newAlert = await alertsApi.createAlert(alertData)

//       toast.success("Alert published successfully!", {
//         description: `Alert ID: ${newAlert.id}`,
//       })

//       // Clear draft
//       localStorage.removeItem("alert-draft")

//       onSuccess?.(newAlert)
//     } catch (error: any) {
//       console.error("Failed to create alert:", error)
//       toast.error("Failed to publish alert", {
//         description: error.message || "Please try again",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const selectedCategory = CATEGORIES.find((cat) => cat.id === form.watch("category"))
//   const selectedSeverity = SEVERITY_LEVELS.find((sev) => sev.id === form.watch("severity"))

//   if (showPreview) {
//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//         <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle>Alert Preview</CardTitle>
//               <Button variant="outline" onClick={() => setShowPreview(false)}>
//                 <X className="w-4 h-4 mr-2" />
//                 Close Preview
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <Badge className={selectedCategory?.color}>
//                   {selectedCategory?.icon} {selectedCategory?.name}
//                 </Badge>
//                 <Badge className={selectedSeverity?.color}>{selectedSeverity?.name}</Badge>
//               </div>

//               <h2 className="text-2xl font-bold">{form.watch("title")}</h2>

//               <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                 <span>🌾 {CROP_TYPES.find((c) => c.id === form.watch("cropType"))?.name}</span>
//                 <span>📍 {form.watch("location.address")}</span>
//                 <span>⏰ Valid for {form.watch("validityDays")} days</span>
//               </div>

//               <p className="whitespace-pre-wrap">{form.watch("description")}</p>

//               {images.length > 0 && (
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                   {images.map((image, index) => (
//                     <img
//                       key={index}
//                       src={URL.createObjectURL(image) || "/placeholder.svg"}
//                       alt={`Preview ${index + 1}`}
//                       className="w-full h-32 object-cover rounded-lg"
//                     />
//                   ))}
//                 </div>
//               )}

//               <div className="flex gap-2 pt-4">
//                 <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
//                   {isLoading ? "Publishing..." : "Publish Alert"}
//                 </Button>
//                 <Button variant="outline" onClick={() => setShowPreview(false)}>
//                   Edit
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

//     <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <AlertTriangle className="w-5 h-5" />
//           Create Agricultural Alert
//         </CardTitle>
//         <CardDescription>
//           Share important information with farmers and agricultural professionals in your area
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Basic Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Basic Information</h3>

//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Alert Title *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Brief, descriptive title for your alert" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="cropType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Crop Type *</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select crop type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <div className="p-2">
//                             <div className="relative">
//                               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                               <Input
//                                 placeholder="Search crops..."
//                                 value={cropSearch}
//                                 onChange={(e) => setCropSearch(e.target.value)}
//                                 className="pl-8"
//                               />
//                             </div>
//                           </div>
//                           {filteredCrops.map((crop) => (
//                             <SelectItem key={crop.id} value={crop.id}>
//                               {crop.name} <span className="text-muted-foreground">({crop.category})</span>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="category"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Alert Category *</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select category" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {CATEGORIES.map((category) => (
//                             <SelectItem key={category.id} value={category.id}>
//                               <div className="flex items-center gap-2">
//                                 <span>{category.icon}</span>
//                                 {category.name}
//                               </div>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="severity"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Severity Level *</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select severity" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {SEVERITY_LEVELS.map((level) => (
//                             <SelectItem key={level.id} value={level.id}>
//                               <Badge className={level.color} variant="outline">
//                                 {level.name}
//                               </Badge>
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="validityDays"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Valid for (days) *</FormLabel>
//                       <Select
//                         onValueChange={(value) => field.onChange(Number.parseInt(value))}
//                         value={field.value?.toString()}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select duration" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {[1, 3, 7, 14, 30].map((days) => (
//                             <SelectItem key={days} value={days.toString()}>
//                               {days} {days === 1 ? "day" : "days"}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* Description */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Description</h3>

//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Detailed Description *</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Provide detailed information about the alert. Include symptoms, affected areas, recommended actions, etc."
//                         className="min-h-32"
//                         {...field}
//                       />
//                     </FormControl>
//                     <div className="text-sm text-muted-foreground">{field.value?.length || 0}/2000 characters</div>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Image Upload */}
//               <div className="space-y-2">
//                 <label className="text-sm font-medium">Images (Optional)</label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
//                   <div className="text-center">
//                     <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
//                     <div className="mt-2">
//                       <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
//                         <Upload className="w-4 h-4 mr-2" />
//                         Upload Images
//                       </Button>
//                     </div>
//                     <p className="text-sm text-muted-foreground mt-2">PNG, JPG up to 5MB each (max 5 images)</p>
//                   </div>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </div>

//                 {images.length > 0 && (
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
//                     {images.map((image, index) => (
//                       <div key={index} className="relative">
//                         <img
//                           src={URL.createObjectURL(image) || "/placeholder.svg"}
//                           alt={`Upload ${index + 1}`}
//                           className="w-full h-24 object-cover rounded-lg"
//                         />
//                         <Button
//                           type="button"
//                           variant="destructive"
//                           size="sm"
//                           className="absolute top-1 right-1 h-6 w-6 p-0"
//                           onClick={() => removeImage(index)}
//                         >
//                           <X className="w-3 h-3" />
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Location */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Location & Coverage</h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="location.address"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Location Address *</FormLabel>
//                       <FormControl>
//                         <div className="flex gap-2">
//                           <Input placeholder="Enter location address" {...field} />
//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={getCurrentLocation}
//                             disabled={isGettingLocation}
//                           >
//                             {isGettingLocation ? (
//                               <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
//                             ) : (
//                               <Navigation className="w-4 h-4" />
//                             )}
//                           </Button>
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="location.radius"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Coverage Radius *</FormLabel>
//                       <Select
//                         onValueChange={(value) => field.onChange(Number.parseInt(value))}
//                         value={field.value?.toString()}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select radius" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {RADIUS_OPTIONS.map((option) => (
//                             <SelectItem key={option.value} value={option.value.toString()}>
//                               {option.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {form.watch("location.lat") !== 0 && form.watch("location.lng") !== 0 && (
//                 <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
//                   <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
//                     <MapPin className="w-4 h-4" />
//                     <span>
//                       GPS Coordinates: {form.watch("location.lat").toFixed(6)}, {form.watch("location.lng").toFixed(6)}
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Contact Information */}
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Contact Information (Optional)</h3>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="contactPhone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone Number</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                           <Input placeholder="+1 (555) 123-4567" className="pl-10" {...field} />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="contactEmail"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Email Address</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                           <Input type="email" placeholder="contact@example.com" className="pl-10" {...field} />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
//               <Button type="button" variant="outline" onClick={saveDraft} disabled={isDraft} className="flex-1">
//                 <Save className="w-4 h-4 mr-2" />
//                 {isDraft ? "Saving..." : "Save Draft"}
//               </Button>

//               <Button type="button" variant="outline" onClick={() => setShowPreview(true)} className="flex-1">
//                 <Eye className="w-4 h-4 mr-2" />
//                 Preview
//               </Button>

//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//               >
//                 <Send className="w-4 h-4 mr-2" />
//                 {isLoading ? "Publishing..." : "Publish Alert"}
//               </Button>

//               {onCancel && (
//                 <Button type="button" variant="ghost" onClick={onCancel}>
//                   Cancel
//                 </Button>
//               )}
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//     </div>
//   )
// }
"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { X, Send, Eye, Clock, AlertTriangle, Loader2, Target } from "lucide-react"
import { alertsApi } from "@/lib/api"

const AlertFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  cropType: z.string().min(1, "Please select a crop type"),
  category: z.string().min(1, "Please select an alert category"),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  description: z.string().min(20, "Description must be at least 20 characters"),
  validityPeriod: z.string().min(1, "Please select validity period"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radius: z.number().min(500).max(50000),
})

interface AlertCreationFormProps {
  onClose: () => void
  onSuccess?: (alert: any) => void
}

const cropTypes = [
  "Wheat", "Corn", "Rice", "Soybeans", "Tomatoes", "Potatoes", "Cotton",
  "Barley", "Oats", "Sorghum", "Sunflower", "Canola", "Sugar Beet", "Alfalfa",
  "Lettuce", "Carrots", "Onions", "Peppers", "Cucumbers", "Beans", "Peas", "Spinach",
]

export const alertCategories = [
  { value: "pest", label: "Pest Outbreak", icon: "🐛", color: "bg-red-100 text-red-800" },
  { value: "disease", label: "Plant Disease", icon: "🦠", color: "bg-orange-100 text-orange-800" },
  { value: "weather", label: "Weather Alert", icon: "🌪️", color: "bg-blue-100 text-blue-800" },
  { value: "harvest", label: "Harvest Ready", icon: "🌾", color: "bg-green-100 text-green-800" },
  { value: "equipment", label: "Equipment Share", icon: "🚜", color: "bg-purple-100 text-purple-800" },
  { value: "advisory", label: "Advisory", icon: "💡", color: "bg-yellow-100 text-yellow-800" },
]

export const severityLevels = [
  { value: "Low", label: "Low", color: "bg-green-500" },
  { value: "Medium", label: "Medium", color: "bg-yellow-500" },
  { value: "High", label: "High", color: "bg-orange-500" },
  { value: "Critical", label: "Critical", color: "!bg-red-500" },
]

const radiusOptions = [
  { value: 1000, label: "1km" },
  { value: 5000, label: "5km" },
  { value: 10000, label: "10km" },
  { value: 25000, label: "25km" },
]

const validityPeriods = [
  { value: "1d", label: "1 Day" },
  { value: "3d", label: "3 Days" },
  { value: "1w", label: "1 Week" },
  { value: "2w", label: "2 Weeks" },
  { value: "1m", label: "1 Month" },
]

export function AlertCreationForm({ onClose, onSuccess }: AlertCreationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const form = useForm<z.infer<typeof AlertFormSchema>>({
    resolver: zodResolver(AlertFormSchema),
    defaultValues: {
      title: "",
      cropType: "",
      category: "",
      severity: "Medium",
      description: "",
      validityPeriod: "1w",
      latitude: 0,
      longitude: 0,
      radius: 5000,
    },
  })

  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        })
      })

      const { latitude, longitude } = position.coords
      form.setValue("latitude", latitude)
      form.setValue("longitude", longitude)
      toast.success("Location detected successfully!")
    } catch (error) {
      toast.error("Could not get location. Please enter coordinates manually.")
    } finally {
      setIsGettingLocation(false)
    }
  }

  const handleSubmit = async (data: z.infer<typeof AlertFormSchema>) => {
    setIsLoading(true)

    try {
      const alertData = {
        title: data.title,
        description: data.description,
        crop: data.cropType,
        latitude: data.latitude,
        longitude: data.longitude,
        severity: data.severity,
        date: new Date().toISOString().split("T")[0],
        // date: '2025-06-03',
        category: data.category,
        radius: data.radius,
      }


      const newAlert = await alertsApi.createAlert(alertData)
      
      toast.success("Alert published successfully!", {
        description: `Alert ID: ${newAlert.id} - Farmers in your area will be notified.`,
      })

      onSuccess?.(newAlert)
      onClose()
    } catch (error: any) {
      let errorMessage = "Failed to publish alert"
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error("Failed to publish alert", {
        description: errorMessage
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async () => {
    const isValid = await form.trigger()
    
    if (isValid) {
      const formData = form.getValues()
      await handleSubmit(formData)
    } else {
      toast.error("Please check the form for errors")
    }
  }

  if (showPreview) {
    const formData = form.getValues()
    const selectedCategory = alertCategories.find((c) => c.value === formData.category)
    const selectedSeverity = severityLevels.find((s) => s.value === formData.severity)

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preview Alert</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={selectedSeverity?.color}>{selectedSeverity?.label.toUpperCase()}</Badge>
              {selectedCategory && (
                <Badge variant="outline" className={selectedCategory.color}>
                  {selectedCategory.icon} {selectedCategory.label}
                </Badge>
              )}
            </div>

            <h3 className="text-xl font-bold">{formData.title}</h3>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>🌾 {formData.cropType}</span>
              <span>📍 {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
              <span>📏 {formData.radius / 1000}km radius</span>
              <span>⏰ Valid for {validityPeriods.find(p => p.value === formData.validityPeriod)?.label}</span>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{formData.description}</p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
                Edit
              </Button>
              <Button onClick={() => handleSubmit(form.getValues())} className="flex-1" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Publish Alert
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Create New Alert</CardTitle>
              <CardDescription>Share important information with farmers in your area</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <div className="space-y-6">
              {/* Quick Setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crop Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select crop" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cropTypes.map((crop) => (
                            <SelectItem key={crop} value={crop}>
                              {crop}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {alertCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.icon} {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alert Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Urgent: Aphid outbreak in wheat fields" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Severity */}
              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity Level *</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-4 gap-2">
                        {severityLevels.map((level) => (
                          <Button
                            key={level.value}
                            type="button"
                            variant={field.value === level.value ? "default" : "outline"}
                            className={`h-12 ${field.value === level.value ? `${level.color} text-white` : ""}`}
                            onClick={() => field.onChange(level.value)}
                          >
                            <div className="text-center">
                              <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
                              <div className="text-xs">{level.label}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Coordinates */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Location Coordinates *</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Target className="w-4 h-4 mr-2" />
                    )}
                    Use GPS
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="e.g., 40.7128"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="any"
                            placeholder="e.g., -74.0060"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Coverage Radius */}
              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coverage Area</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-4 gap-2">
                        {radiusOptions.map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={field.value === option.value ? "default" : "outline"}
                            onClick={() => field.onChange(option.value)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the situation, symptoms, recommended actions, etc."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Validity Period */}
              <FormField
                control={form.control}
                name="validityPeriod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid For</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {validityPeriods.map((period) => (
                          <SelectItem key={period.value} value={period.value}>
                            <Clock className="w-4 h-4 mr-2 inline" />
                            {period.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button 
                  type="button" 
                  className="flex-1" 
                  disabled={isLoading}
                  onClick={onSubmit}
                >
                  {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Publish Alert
                </Button>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

// "use client"

// import type React from "react"

// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"
// import { z } from "zod"
// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Textarea } from "@/components/ui/textarea"
// import { X, MapPin, Send, Eye, Clock, AlertTriangle, Loader2, Camera, Target } from "lucide-react"
// import type { Alert, User } from "@/types"
// import { alertsApi } from "@/lib/api"

// const AlertFormSchema = z.object({
//   title: z.string().min(5, "Title must be at least 5 characters"),
//   cropType: z.string().min(1, "Please select a crop type"),
//   category: z.string().min(1, "Please select an alert category"),
//   severity: z.enum(["low", "medium", "high", "critical"]),
//   description: z.string().min(20, "Description must be at least 20 characters"),
//   contactPhone: z.string().optional(),
//   contactEmail: z.string().email().optional().or(z.literal("")),
//   validityPeriod: z.string().min(1, "Please select validity period"),
//   location: z.string().min(1, "Location is required"),
//   radius: z.number().min(500).max(50000),
// })

// interface AlertCreationFormProps {
//   onClose: () => void
//   onSuccess?: (alert: Alert) => void
//   user: User
// }

// const cropTypes = [
//   "Wheat",
//   "Corn",
//   "Rice",
//   "Soybeans",
//   "Tomatoes",
//   "Potatoes",
//   "Cotton",
//   "Barley",
//   "Oats",
//   "Sorghum",
//   "Sunflower",
//   "Canola",
//   "Sugar Beet",
//   "Alfalfa",
//   "Lettuce",
//   "Carrots",
//   "Onions",
//   "Peppers",
//   "Cucumbers",
//   "Beans",
//   "Peas",
//   "Spinach",
// ]

// const alertCategories = [
//   { value: "pest", label: "Pest Outbreak", icon: "🐛", color: "bg-red-100 text-red-800" },
//   { value: "disease", label: "Plant Disease", icon: "🦠", color: "bg-orange-100 text-orange-800" },
//   { value: "weather", label: "Weather Alert", icon: "🌪️", color: "bg-blue-100 text-blue-800" },
//   { value: "harvest", label: "Harvest Ready", icon: "🌾", color: "bg-green-100 text-green-800" },
//   { value: "equipment", label: "Equipment Share", icon: "🚜", color: "bg-purple-100 text-purple-800" },
//   { value: "advisory", label: "Advisory", icon: "💡", color: "bg-yellow-100 text-yellow-800" },
// ]

// const severityLevels = [
//   { value: "low", label: "Low", color: "bg-green-500", textColor: "text-green-700" },
//   { value: "medium", label: "Medium", color: "bg-yellow-500", textColor: "text-yellow-700" },
//   { value: "high", label: "High", color: "bg-orange-500", textColor: "text-orange-700" },
//   { value: "critical", label: "Critical", color: "bg-red-500", textColor: "text-red-700" },
// ]

// const radiusOptions = [
//   { value: 1000, label: "1km" },
//   { value: 5000, label: "5km" },
//   { value: 10000, label: "10km" },
//   { value: 25000, label: "25km" },
// ]

// export function AlertCreationForm({ onClose, onSuccess, user }: AlertCreationFormProps) {
//   const [isLoading, setIsLoading] = useState(false)
//   const [showPreview, setShowPreview] = useState(false)
//   const [images, setImages] = useState<string[]>([])
//   const [locationSuggestions, setLocationSuggestions] = useState<string[]>([])
//   const [isGettingLocation, setIsGettingLocation] = useState(false)

//   const form = useForm<z.infer<typeof AlertFormSchema>>({
//     resolver: zodResolver(AlertFormSchema),
//     defaultValues: {
//       title: "",
//       cropType: "",
//       category: "",
//       severity: "medium",
//       description: "",
//       validityPeriod: "1d",
//       radius: 5000,
//     },
//   })

//   // Auto-save draft
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const formData = form.getValues()
//       if (formData.title || formData.description) {
//         localStorage.setItem("alert-draft", JSON.stringify(formData))
//       }
//     }, 30000)
//     return () => clearInterval(interval)
//   }, [form])

//   // Smart location suggestions
//   const handleLocationSearch = async (query: string) => {
//     if (query.length < 3) return

//     try {
//       // Mock location suggestions - in real app, use geocoding API
//   //      country?: string
//   //      region?: string
//   //      city?: string
//       const suggestions = [
//         `${query}`,
//         `${query} Farm`,
//         `${query} Agricultural District`,
//         `Near ${query}`,
//       ]
//       setLocationSuggestions(suggestions)
//     } catch (error) {
//       console.error("Location search failed:", error)
//     }
//   }

//   const getCurrentLocation = async () => {
//     setIsGettingLocation(true)
//     try {
//       const position = await new Promise<GeolocationPosition>((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject, {
//           enableHighAccuracy: true,
//           timeout: 10000,
//         })
//       })

//       const { latitude, longitude } = position.coords

//       // Use reverse geocoding to get readable address
//       const address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
//       form.setValue("location", address)

//       toast.success("Location detected successfully!")
//     } catch (error) {
//       toast.error("Could not get location. Please enter manually.")
//     } finally {
//       setIsGettingLocation(false)
//     }
//   }

//   async function onSubmit(data: z.infer<typeof AlertFormSchema>) {
//     setIsLoading(true)

//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000))

//       const alertData: Alert = {
//         id: Date.now().toString(),
//         title: data.title,
//         description: data.description,
//         crop: data.cropType,
//         location: data.location,
//         latitude: 40.7128,
//         longitude: -74.006,
//         severity: (data.severity.charAt(0).toUpperCase() + data.severity.slice(1)) as any,
//         date: new Date().toISOString().split("T")[0],
//         author: user.username,
//         category: data.category,
//         radius: data.radius,
//       }
      
//       const newAlert = await alertsApi.createAlert(alertData)

//       toast.success("Alert published successfully!", {
//         description: `Alert ID: ${newAlert.id}`,
//       }) 
//       localStorage.removeItem("alert-draft")

//       toast.success("Alert published successfully!", {
//         description: "Farmers in your area will be notified.",
//       })

//       onSuccess?.(newAlert)
//       onClose()
//     } catch (error) {
//       toast.error("Failed to publish alert")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   if (showPreview) {
//     const formData = form.getValues()
//     const selectedCategory = alertCategories.find((c) => c.value === formData.category)
//     const selectedSeverity = severityLevels.find((s) => s.value === formData.severity)

//     return (
//       <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//         <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <CardTitle>Preview Alert</CardTitle>
//               <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
//                 <X className="w-4 h-4" />
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center gap-2">
//               <Badge className={selectedSeverity?.color}>{selectedSeverity?.label.toUpperCase()}</Badge>
//               {selectedCategory && (
//                 <Badge variant="outline" className={selectedCategory.color}>
//                   {selectedCategory.icon} {selectedCategory.label}
//                 </Badge>
//               )}
//             </div>

//             <h3 className="text-xl font-bold">{formData.title}</h3>

//             <div className="flex items-center gap-4 text-sm text-muted-foreground">
//               <span>🌾 {formData.cropType}</span>
//               <span>📍 {formData.location}</span>
//               <span>📏 {formData.radius / 1000}km radius</span>
//             </div>

//             <div className="prose max-w-none">
//               <p className="whitespace-pre-wrap">{formData.description}</p>
//             </div>

//             {images.length > 0 && (
//               <div className="grid grid-cols-2 gap-2">
//                 {images.map((image, index) => (
//                   <img
//                     key={index}
//                     src={image || "/placeholder.svg"}
//                     alt={`Alert image ${index + 1}`}
//                     className="rounded-lg object-cover h-32 w-full"
//                   />
//                 ))}
//               </div>
//             )}

//             <div className="flex gap-2 pt-4">
//               <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
//                 Edit
//               </Button>
//               <Button onClick={form.handleSubmit(onSubmit)} className="flex-1" disabled={isLoading}>
//                 {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
//                 Publish Alert
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//         <CardHeader>
//           <div className="flex items-center justify-between">
//             <div>
//               <CardTitle>Create New Alert</CardTitle>
//               <CardDescription>Share important information with farmers in your area</CardDescription>
//             </div>
//             <Button variant="ghost" size="icon" onClick={onClose}>
//               <X className="w-4 h-4" />
//             </Button>
//           </div>
//         </CardHeader>

//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               {/* Quick Setup */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <FormField
//                   control={form.control}
//                   name="cropType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Crop Type *</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select crop" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {cropTypes.map((crop) => (
//                             <SelectItem key={crop} value={crop}>
//                               {crop}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="category"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Alert Type *</FormLabel>
//                       <Select onValueChange={field.onChange} value={field.value}>
//                         <FormControl  className="w-full">
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {alertCategories.map((category) => (
//                             <SelectItem key={category.value} value={category.value}>
//                               {category.icon} {category.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               {/* Title */}
//               <FormField
//                 control={form.control}
//                 name="title"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Alert Title *</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g., Urgent: Aphid outbreak in wheat fields" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Severity */}
//               <FormField
//                 control={form.control}
//                 name="severity"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Severity Level *</FormLabel>
//                     <FormControl>
//                       <div className="grid grid-cols-4 gap-2">
//                         {severityLevels.map((level) => (
//                           <Button
//                             key={level.value}
//                             type="button"
//                             variant={field.value === level.value ? "default" : "outline"}
//                             className={`h-12 ${field.value === level.value ? `${level.color} text-white` : ""}`}
//                             onClick={() => field.onChange(level.value)}
//                           >
//                             <div className="text-center">
//                               <AlertTriangle className="w-4 h-4 mx-auto mb-1" />
//                               <div className="text-xs">{level.label}</div>
//                             </div>
//                           </Button>
//                         ))}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Location - Super Easy */}
//               <FormField
//                 control={form.control}
//                 name="location"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Location *</FormLabel>
//                     <FormControl>
//                       <div className="space-y-2">
//                         <div className="flex gap-2">
//                           <Input
//                             placeholder="Enter location or use GPS"
//                             {...field}
//                             onChange={(e) => {
//                               field.onChange(e)
//                               handleLocationSearch(e.target.value)
//                             }}
//                             className="flex-1"
//                           />
//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={getCurrentLocation}
//                             disabled={isGettingLocation}
//                           >
//                             {isGettingLocation ? (
//                               <Loader2 className="w-4 h-4 animate-spin" />
//                             ) : (
//                               <Target className="w-4 h-4" />
//                             )}
//                           </Button>
//                         </div>

//                         {/* Quick location suggestions */}
//                         {locationSuggestions.length > 0 && (
//                           <div className="flex flex-wrap gap-1">
//                             {locationSuggestions.slice(0, 3).map((suggestion, index) => (
//                               <Button
//                                 key={index}
//                                 type="button"
//                                 variant="ghost"
//                                 size="sm"
//                                 className="h-8 text-xs"
//                                 onClick={() => {
//                                   field.onChange(suggestion)
//                                   setLocationSuggestions([])
//                                 }}
//                               >
//                                 <MapPin className="w-3 h-3 mr-1" />
//                                 {suggestion}
//                               </Button>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Coverage Radius */}
//               <FormField
//                 control={form.control}
//                 name="radius"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Coverage Area</FormLabel>
//                     <FormControl>
//                       <div className="grid grid-cols-4 gap-2">
//                         {radiusOptions.map((option) => (
//                           <Button
//                             key={option.value}
//                             type="button"
//                             variant={field.value === option.value ? "default" : "outline"}
//                             onClick={() => field.onChange(option.value)}
//                           >
//                             {option.label}
//                           </Button>
//                         ))}
//                       </div>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Description */}
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description *</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Describe the situation, symptoms, recommended actions, etc."
//                         className="min-h-[100px]"
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />


//               {/* Validity Period */}
//               {/*<FormField
//                 control={form.control}
//                 name="validityPeriod"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Valid For</FormLabel>
//                     <Select onValueChange={field.onChange} value={field.value}>
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {validityPeriods.map((period) => (
//                           <SelectItem key={period.value} value={period.value}>
//                             <Clock className="w-4 h-4 mr-2 inline" />
//                             {period.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />*/}

//               {/* Action Buttons */}
//               <div className="flex gap-3 pt-6 border-t">
//                 <Button type="button" variant="outline" onClick={onClose}>
//                   Cancel
//                 </Button>
//                 <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
//                   <Eye className="w-4 h-4 mr-2" />
//                   Preview
//                 </Button>
//                 <Button type="submit" className="flex-1" disabled={isLoading}>
//                   {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
//                   Publish Alert
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
