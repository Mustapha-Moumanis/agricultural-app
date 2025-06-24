"use client"
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Loader2, AlertCircle, CheckCircle, Globe, Satellite, Crosshair } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CountrySelect, StateSelect, CitySelect } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import { userApi } from "@/lib/api";
import type { User } from "@/types";

const LocationFormSchema = z.object({
  country: z.string().min(1, {
    message: "Country is required.",
  }),
  region: z.string().min(1, {
    message: "Region/State is required.",
  }),
  city: z.string().min(1, {
    message: "City is required.",
  }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

interface LocationSetupModalProps {
  user: User
  isOpen: boolean
  onClose: () => void
  onLocationUpdated: (user: User) => void
}

interface LocationOption {
  id: number
  name: string
  iso2?: string
}

interface GeocodingResult {
  country: string
  region: string
  city: string
  address: string
  provider: string
  countryCode?: string
  postcode?: string
}

export function LocationSetupModal({ user, isOpen, onClose, onLocationUpdated }: LocationSetupModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string>("")
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({})
  const [generalError, setGeneralError] = useState<string>("")
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number
    longitude: number
    accuracy?: number
    address?: string
  } | null>(null)

  // State for location selectors
  const [selectedCountry, setSelectedCountry] = useState<LocationOption | null>(null)
  const [selectedState, setSelectedState] = useState<LocationOption | null>(null)
  const [selectedCity, setSelectedCity] = useState<LocationOption | null>(null)

  const form = useForm<z.infer<typeof LocationFormSchema>>({
    resolver: zodResolver(LocationFormSchema),
    defaultValues: {
      country: user.country || "",
      region: user.region || "",
      city: user.city || "",
      latitude: user.latitude,
      longitude: user.longitude,
    },
  })

  // Helper function to format field errors
  const getFieldError = (fieldName: string) => {
    if (apiErrors[fieldName]) {
      return apiErrors[fieldName].join(", ")
    }
    return undefined
  }

  // const handleCountrySelect = (country: LocationOption) => {
  //   setSelectedCountry(country)
  //   setSelectedState(null)
  //   setSelectedCity(null)
  //   form.setValue("country", country.name)
  //   form.setValue("region", "")
  //   form.setValue("city", "")
  // }

  // const handleStateSelect = (state: LocationOption) => {
  //   setSelectedState(state)
  //   setSelectedCity(null)
  //   form.setValue("region", state.name)
  //   form.setValue("city", "")
  // }

  // const handleCitySelect = (city: LocationOption) => {
  //   setSelectedCity(city)
  //   form.setValue("city", city.name)
  // }
  const handleCountrySelect = (e: LocationOption | ChangeEvent<HTMLInputElement>) => {
    if ('target' in e) {
      // It's a ChangeEvent - ignore or handle differently
      return
    }
    const country = e as LocationOption
    setSelectedCountry(country)
    setSelectedState(null)
    setSelectedCity(null)
    form.setValue("country", country.name)
    form.setValue("region", "")
    form.setValue("city", "")
  }

  const handleStateSelect = (e: LocationOption | ChangeEvent<HTMLInputElement>) => {
    if ('target' in e) {
      return
    }
    const state = e as LocationOption
    setSelectedState(state)
    setSelectedCity(null)
    form.setValue("region", state.name)
    form.setValue("city", "")
  }

  const handleCitySelect = (e: LocationOption | ChangeEvent<HTMLInputElement>) => {
    if ('target' in e) {
      return
    }
    const city = e as LocationOption
    setSelectedCity(city)
    form.setValue("city", city.name)
  }

  // Enhanced reverse geocoding with fallback providers
  const reverseGeocodeWithBigDataCloud = async (latitude: number, longitude: number): Promise<GeocodingResult | null> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Build address string more robustly
      const addressParts = [
        data.city || data.locality || data.localityInfo?.administrative?.[3]?.name,
        data.principalSubdivision || data.principalSubdivisionCode,
        data.countryName || data.countryCode
      ].filter(Boolean) // Remove empty/null values
      
      const address = addressParts.join(', ')
      
      if (address) {
        return {
          country: data.countryName || "",
          region: data.principalSubdivision || data.locality || "",
          city: data.city || data.locality || "",
          address: address,
          provider: 'bigdatacloud',
          countryCode: data.countryCode,
          postcode: data.postcode
        }
      }
      
      return null
    } catch (error) {
      console.warn('BigDataCloud geocoding failed:', error)
      return null
    }
  }

  // Fallback reverse geocoding with Nominatim (OpenStreetMap)
  const reverseGeocodeWithNominatim = async (latitude: number, longitude: number): Promise<GeocodingResult | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=en`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Agricultural-Alert-System/1.0' // Required by Nominatim
          },
          signal: AbortSignal.timeout(10000)
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data && data.address) {
        const addressParts = [
          data.address.city || data.address.town || data.address.village,
          data.address.state || data.address.region,
          data.address.country
        ].filter(Boolean)
        
        const address = addressParts.join(', ')
        
        return {
          country: data.address.country || "",
          region: data.address.state || data.address.region || "",
          city: data.address.city || data.address.town || data.address.village || "",
          address: data.display_name || address,
          provider: 'nominatim',
          countryCode: data.address.country_code?.toUpperCase(),
          postcode: data.address.postcode
        }
      }
      
      return null
    } catch (error) {
      console.warn('Nominatim geocoding failed:', error)
      return null
    }
  }

  // Enhanced getCurrentLocation with better error handling and fallback
  const getCurrentLocation = async () => {
    setIsGettingLocation(true)
    setLocationError("")

    // Check geolocation support
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.")
      setIsGettingLocation(false)
      toast.error("Geolocation not supported", {
        description: "Please enter your location manually."
      })
      return
    }

    // Enhanced geolocation options
    const options = {
      enableHighAccuracy: true,  // Use GPS if available
      timeout: 15000,           // 15 second timeout
      maximumAge: 300000        // Accept cached position up to 5 minutes old
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords
        
        // Set current location immediately
        setCurrentLocation({ 
          latitude, 
          longitude, 
          accuracy: accuracy ? Math.round(accuracy) : undefined 
        })

        try {
          // Try BigDataCloud first, then Nominatim as fallback
          let geocodingResult = await reverseGeocodeWithBigDataCloud(latitude, longitude)
          
          if (!geocodingResult) {
            geocodingResult = await reverseGeocodeWithNominatim(latitude, longitude)
          }

          if (geocodingResult) {
            // Update current location with address
            setCurrentLocation(prev => ({
              ...prev!,
              address: geocodingResult!.address
            }))

            // Update form with location data
            if (geocodingResult.country) {
              form.setValue("country", geocodingResult.country)
            }
            if (geocodingResult.region) {
              form.setValue("region", geocodingResult.region)
            }
            if (geocodingResult.city) {
              form.setValue("city", geocodingResult.city)
            }
            form.setValue("latitude", Number(latitude))
            form.setValue("longitude", Number(longitude))

            toast.success("Location detected!", {
              description: `${geocodingResult.city}, ${geocodingResult.region}, ${geocodingResult.country}`,
              duration: 4000,
            })
          } else {
            // Fallback: coordinates only
            form.setValue("latitude", Number(latitude))
            form.setValue("longitude", Number(longitude))

            toast.success("GPS coordinates obtained!", {
              description: "Please fill in your location details manually.",
              duration: 4000,
            })
          }
          
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          
          // Always save coordinates even if reverse geocoding fails
          form.setValue("latitude", Number(latitude))
          form.setValue("longitude", Number(longitude))

          toast.success("GPS coordinates obtained!", {
            description: "Please fill in your location details manually.",
            duration: 4000,
          })
        }
        
        setIsGettingLocation(false)
      },
      (error) => {
        // Enhanced error handling with specific messages
        let errorMessage = "Failed to get location"
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions in your browser settings."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please check your GPS or internet connection."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or enter your location manually."
            break
          default:
            errorMessage = "An unknown error occurred while getting location. Please try again."
        }
        
        setLocationError(errorMessage)
        setIsGettingLocation(false)

        toast.error("Location Error", {
          description: errorMessage,
          duration: 6000,
        })
      },
      options
    )
  }

  // Check location permission status
  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        
        if (permission.state === 'denied') {
          toast.error('Location access blocked', {
            description: 'Please enable location access in your browser settings.',
            duration: 6000,
          })
          return false
        }
        
        if (permission.state === 'prompt') {
          toast.info('Location permission needed', {
            description: 'Please allow location access when prompted.',
            duration: 4000,
          })
        }
        
        return true
      } catch (error) {
        console.warn('Permission API not supported:', error)
        return true // Proceed anyway
      }
    }
    return true
  }

  // Enhanced location handler with permission check
  const handleGetLocation = async () => {
    const hasPermission = await checkLocationPermission()
    if (hasPermission) {
      await getCurrentLocation()
    }
  }

  const onSubmit = async (data: z.infer<typeof LocationFormSchema>) => {
    setIsLoading(true)
    setApiErrors({})
    setGeneralError("")
    console.log(data)
    try {
      const locationData = {
        country: data.country,
        region: data.region,
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude,
      }
      console.log(locationData)
      const updatedUser = await userApi.updateLocation(locationData)

      toast.success("Location updated!", {
        description: "Your location information has been saved successfully.",
        duration: 4000,
      })

      onLocationUpdated(updatedUser)
      onClose()
    } catch (error: any) {
      console.error("Location update error:", error)

      if (error.response?.data) {
        const errorData = error.response.data

        // Handle field-specific errors
        if (typeof errorData === "object" && !errorData.detail && !errorData.non_field_errors) {
          setApiErrors(errorData)

          // Set form errors for each field
          Object.keys(errorData).forEach((field) => {
            if (form.getValues(field as any) !== undefined) {
              form.setError(field as any, {
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
          setGeneralError("Failed to update location. Please try again.")
        }
      } else {
        setGeneralError(error.message || "Failed to update location. Please try again.")
      }

      toast.error("Update failed", {
        description: "Please check the form for errors and try again.",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Set Your Location
          </CardTitle>
          <CardDescription className="text-base">
            Help us provide better agricultural insights by sharing your location information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {generalError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{generalError}</AlertDescription>
            </Alert>
          )}

          {locationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {/* Enhanced GPS Location Button */}
          <div className="space-y-3">
            <Button
              type="button"
              onClick={handleGetLocation}
              disabled={isGettingLocation}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isGettingLocation ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Getting your location...
                </>
              ) : (
                <>
                  <Crosshair className="w-5 h-5 mr-2" />
                  Use My Current Location
                </>
              )}
            </Button>

            {currentLocation && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 mb-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Location Detected</span>
                </div>
                
                {currentLocation.address && (
                  <div className="text-sm text-green-600 dark:text-green-400 mb-2">
                    📍 {currentLocation.address}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-xs text-green-600 dark:text-green-400">
                  <span>
                    📊 {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                  </span>
                  {currentLocation.accuracy && (
                    <span className="flex items-center gap-1">
                      <Satellite className="w-3 h-3" />
                      ±{currentLocation.accuracy}m
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                  Or select manually
                </span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Country
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CountrySelect
                          onChange={handleCountrySelect as (country: LocationOption) => void}
                          placeHolder="Select Country"
                          containerClassName="w-full rounded-md border focus-within:ring-2 focus-within:ring-blue-500"
                          inputClassName="w-full !border-none !outline-none bg-transparent px-3 sm:px-4 py-2 sm:py-2.5"
                        />
                        <Input
                          {...field}
                          type="hidden"
                          value={field.value}
                        />
                      </div>
                    </FormControl>
                    <FormMessage>{getFieldError("country")}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region/State</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <StateSelect
                          countryid={selectedCountry?.id ?? 0}
                          onChange={handleStateSelect as (state: LocationOption) => void}
                          placeHolder="Select State"
                          containerClassName="w-full rounded-md border focus-within:ring-2 focus-within:ring-blue-500"
                          inputClassName="w-full !border-none !outline-none bg-transparent px-3 sm:px-4 py-2 sm:py-2.5"
                        />
                        <Input
                          {...field}
                          type="hidden"
                          value={field.value}
                        />
                      </div>
                    </FormControl>
                    <FormMessage>{getFieldError("region")}</FormMessage>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <CitySelect
                          countryid={selectedCountry?.id ?? 0}
                          stateid={selectedState?.id ?? 0}
                          onChange={handleCitySelect}
                          placeHolder="Select City"
                          containerClassName="w-full rounded-md border focus-within:ring-2 focus-within:ring-blue-500"
                          inputClassName="w-full !border-none !outline-none bg-transparent px-3 sm:px-4 py-2 sm:py-2.5"
                        />
                        <Input
                          {...field}
                          type="hidden"
                          value={field.value}
                        />
                      </div>
                    </FormControl>
                    <FormMessage>{getFieldError("city")}</FormMessage>
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose} 
                  disabled={isLoading} 
                  className="flex-1"
                >
                  Skip for now
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Location"
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>Your location helps us provide relevant agricultural alerts and weather updates.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}