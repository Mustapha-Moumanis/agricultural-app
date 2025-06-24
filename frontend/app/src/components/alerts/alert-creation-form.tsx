"use client"

import { useState } from "react"
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
