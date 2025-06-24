"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { LogOut, Search, MapPin, Bookmark, Check, Settings } from "lucide-react"
import { EnhancedMap } from "../enhanced-map"
import { LocationSetupModal } from "@/components/location/location-setup-modal"
import { NotificationBell } from "../notifications/notification-bell"
// import { ProfileModal } from "./profile-modal"
import { ThemeToggle } from "../theme-toggle"
import type { User, Alert } from "@/types"
import { userApi } from "@/lib/api"
// Import the new components
// import { WeatherWidget } from "../weather-widget"
// import { QuickActions } from "../quick-actions"
// import { RecentActivity } from "../recent-activity"
import { alertsApi } from "@/lib/api"
import { alertCategories, severityLevels } from "../alerts/alert-creation-form"

export function FarmerDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [savedAlerts, setSavedAlerts] = useState<string[]>([])
  const [showProfile, setShowProfile] = useState(false)
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [activeTab, setActiveTab] = useState("feed")

  const { user, logout, shouldShowLocationSetup, setShouldShowLocationSetup, updateUser } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const handleLocationUpdated = (updatedUser: any) => {
    updateUser(updatedUser)
  }

  const [alerts, setAlerts] = useState<Alert[]>([
  ])
  const loadAlerts = async () => {
    try {
      const alerts = await alertsApi.getAlerts(user.latitude, user.longitude, 2000);
      setAlerts(alerts);
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    loadAlerts();
  }, [])

    // Add more comprehensive filtering options
  const cropOptions = [
    { value: "all", label: "All Crops" },
    { value: "wheat", label: "Wheat" },
    { value: "corn", label: "Corn" },
    { value: "soybeans", label: "Soybeans" },
    { value: "tomatoes", label: "Tomatoes" },
    { value: "vegetables", label: "Vegetables" },
    { value: "rice", label: "Rice" },
    { value: "cotton", label: "Cotton" },
  ]

  const severityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200"
    }
  }
  const selectedSeverity1 = severityLevels.find((s) => s.value === alert.severity)
  const selectedCategory = alertCategories.find((c) => c.value === alert.category)
  const getSeverity = (item: string) => {
    return severityLevels.find((s) => s.value === item);
  }
  const getCategory = (item: string) => {
    return alertCategories.find((s) => s.value === item);
  }
  const toggleSaveAlert = (alertId: string) => {
    setSavedAlerts((prev) => (prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]))
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())
      // alert.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCrop = selectedCrop === "all" || alert.crop.toLowerCase() === selectedCrop
    const matchesSeverity = selectedSeverity === "all" || alert.severity.toLowerCase() === selectedSeverity
    return matchesSearch && matchesCrop && matchesSeverity
  })

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="font-semibold text-foreground">CropAlert</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.username} - Role : {user.role}</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            {/*<Button variant="ghost" size="icon" onClick={() => setShowProfile(true)}>
              <Settings className="w-4 h-4" />
            </Button>*/}
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="p-4 bg-card border-b">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search alerts, crops, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="flex h-10 w-32 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cropOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="flex h-10 w-32 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {severityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Quick filter chips */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedSeverity === "high" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeverity(selectedSeverity === "high" ? "all" : "high")}
            className="h-7 text-xs"
          >
            🚨 High Priority
          </Button>
          <Button
            variant={selectedSeverity === "low" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeverity(selectedSeverity === "low" ? "all" : "low")}
            className="h-7 text-xs"
          >
            🟢 Low Priority
          </Button>
          <Button
            variant={selectedSeverity === "medium" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeverity(selectedSeverity === "medium" ? "all" : "medium")}
            className="h-7 text-xs"
          >
            🟠 Medium Priority
          </Button>
          <Button
            variant={selectedSeverity === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeverity(selectedSeverity === "critical" ? "all" : "critical")}
            className="h-7 text-xs"
          >
            🔴 Critical Priority
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Quick Actions and Weather Row */}
        {/*<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
           <QuickActions
            userRole="farmer"
            onViewMap={() => setActiveTab("map")}
            onTakePhoto={() => console.log("Take photo")}
          />
          <WeatherWidget />
          <RecentActivity userRole="farmer" />
        </div>*/}

        {/* Existing Tabs content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Alert Feed</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Alerts ({filteredAlerts.length})</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {filteredAlerts.filter((a) => a.isNew).length} New
              </Badge>
            </div>

            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                        <Card className="w-full  max-h-[90vh] overflow-y-auto" key={alert.id}>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverity(alert.severity)?.color}>{getSeverity(alert.severity)?.label.toUpperCase()}</Badge>
                                <Badge variant="outline" className={getCategory(alert.category)?.color}>
                                  {getCategory(alert.category)?.icon} {getCategory(alert.category)?.label}
                                </Badge>
                            </div>
                
                            <h3 className="text-xl font-bold">{alert.title}</h3>
                
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>🌾 {alert.crop}</span>
                              <span>📍 {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}</span>
                              <span>📏 {alert.radius / 1000}km radius</span>
                            </div>
                
                            <div className="prose max-w-none">
                              <p className="whitespace-pre-wrap">{alert.description}</p>
                            </div>
                
                          </CardContent>
                        </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Nearby Alerts & Your Farm</CardTitle>
                <CardDescription>
                  View alerts in your area and your farm location on the interactive map
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedMap 
                  userRole="Farmer"
                  user={user} 
                  alerts={alerts}
                  onAlertClick={(alert) => console.log('Alert clicked:', alert)}
                  websocketUrl="ws://localhost:8000/ws/alerts/"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {/* Location Setup Modal */}
      {user && (
        <LocationSetupModal
          user={user}
          isOpen={shouldShowLocationSetup}
          onClose={() => setShouldShowLocationSetup(false)}
          onLocationUpdated={handleLocationUpdated}
        />
      )}
      {/* Profile Modal */}
      {/*showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onUpdate={userApi} />*/}

    </div>
  )
}
