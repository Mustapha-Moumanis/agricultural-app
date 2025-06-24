// "use client"

// import { useAuth } from "@/hooks/use-auth"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { LogOut, User } from "lucide-react"

// export function FarmerDashboard() {
//   const { user, logout } = useAuth()

//   const handleLogout = async () => {
//     try {
//       await logout()
//     } catch (error) {
//       console.error("Logout failed:", error)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-background transition-colors p-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
//           <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
//             <LogOut className="w-4 h-4" />
//             Logout
//           </Button>
//         </div>

//         <div className="grid gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <User className="w-5 h-5" />
//                 Profile Information
//               </CardTitle>
//               <CardDescription>Your account details</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <p>
//                 <strong>Name:</strong> {user?.username}
//               </p>
//               <p>
//                 <strong>Email:</strong> {user?.email}
//               </p>
//               <p>
//                 <strong>Role:</strong> {user?.role}
//               </p>

//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarImage } from "@/components/ui/avatar"
// import { Input } from "@/components/ui/input"
// import { LogOut, Search, MapPin, Bookmark, Check, Settings } from "lucide-react"
// import { LocationSetupModal } from "@/components/location/location-setup-modal"
// import { NotificationBell } from "./notification-bell"
// import { ProfileModal } from "./profile-modal"
// import { ThemeToggle } from "../theme-toggle"
// import type { User, Alert } from "@/types"
// import { useAuth } from "@/hooks/use-auth"
// import { userApi } from "@/lib/api"
// export function FarmerDashboard() {
//   const [searchTerm, setSearchTerm] = useState("")
//   const [selectedCrop, setSelectedCrop] = useState("all")
//   const [savedAlerts, setSavedAlerts] = useState<string[]>([])
//   const [showProfile, setShowProfile] = useState(false)

//   const { user, logout, shouldShowLocationSetup, setShouldShowLocationSetup, updateUser } = useAuth()

//   const handleLogout = async () => {
//     try {
//       await logout()
//     } catch (error) {
//       console.error("Logout failed:", error)
//     }
//   }

//   const handleLocationUpdated = (updatedUser: any) => {
//     updateUser(updatedUser)
//   }

//   const [alerts] = useState<Alert[]>([
//     {
//       id: "1",
//       title: "Aphid Infestation Warning",
//       description: "High aphid activity detected in wheat fields. Immediate action recommended.",
//       crop: "Wheat",
//       location: "Northern Valley",
//       coordinates: { lat: 40.7128, lng: -74.006 },
//       distance: "2.3 km",
//       severity: "High",
//       date: "2024-01-15",
//       author: "Dr. Sarah Johnson",
//       authorId: "1",
//       isNew: true,
//     },
//     {
//       id: "2",
//       title: "Optimal Planting Conditions",
//       description: "Weather conditions are ideal for corn planting in the next 48 hours.",
//       crop: "Corn",
//       location: "Eastern Plains",
//       coordinates: { lat: 40.7589, lng: -73.9851 },
//       distance: "5.1 km",
//       severity: "Medium",
//       date: "2024-01-14",
//       author: "Dr. Mike Chen",
//       authorId: "2",
//       isNew: true,
//     },
//     {
//       id: "3",
//       title: "Fungal Disease Alert",
//       description: "Early signs of rust disease detected. Monitor crops closely.",
//       crop: "Soybeans",
//       location: "Western Fields",
//       coordinates: { lat: 40.6892, lng: -74.0445 },
//       distance: "8.7 km",
//       severity: "Medium",
//       date: "2024-01-13",
//       author: "Dr. Emily Rodriguez",
//       authorId: "3",
//       isNew: false,
//     },
//     {
//       id: "4",
//       title: "Irrigation Advisory",
//       description: "Soil moisture levels are optimal. Reduce irrigation frequency.",
//       crop: "Tomatoes",
//       location: "Southern Region",
//       coordinates: { lat: 40.7282, lng: -73.7949 },
//       distance: "12.4 km",
//       severity: "Low",
//       date: "2024-01-12",
//       author: "Dr. James Wilson",
//       authorId: "4",
//       isNew: false,
//     },
//   ])

//   const getSeverityColor = (severity: string) => {
//     switch (severity) {
//       case "High":
//         return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200"
//       case "Medium":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200"
//       case "Low":
//         return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200"
//     }
//   }

//   const toggleSaveAlert = (alertId: string) => {
//     setSavedAlerts((prev) => (prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]))
//   }

//   const filteredAlerts = alerts.filter((alert) => {
//     const matchesSearch =
//       alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       alert.description.toLowerCase().includes(searchTerm.toLowerCase())
//     const matchesCrop = selectedCrop === "all" || alert.crop.toLowerCase() === selectedCrop
//     return matchesSearch && matchesCrop
//   })

//   return (
//     <>
//     <div className="min-h-screen bg-background transition-colors">
//       {/* Header */}
//       <header className="bg-card border-b px-4 py-3 shadow-sm">
//         <div className="flex items-center justify-between">
//           <div className="flex flex-col sm:flex-row sm:items-center gap-3">
//             <h1 className="font-semibold text-foreground">CropAlert</h1>
//             <p className="text-sm text-muted-foreground">Welcome, {user.username} - Role : {user.role}</p>
//           </div>
//           <div className="flex items-center gap-2">
//             <ThemeToggle />
//             <NotificationBell />
//             <Button variant="ghost" size="icon" onClick={() => setShowProfile(true)}>
//               <Settings className="w-4 h-4" />
//             </Button>
//             <Button variant="ghost" size="icon" onClick={handleLogout}>
//               <LogOut className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </header>

//       {/* Search and Filters */}
//       <div className="p-4 bg-card border-b">
//         <div className="flex gap-2 mb-3">
//           <div className="flex-1 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
//             <Input
//               placeholder="Search alerts..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//           <select
//             value={selectedCrop}
//             onChange={(e) => setSelectedCrop(e.target.value)}
//             className="flex h-10 w-32 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <option value="all">All Crops</option>
//             <option value="wheat">Wheat</option>
//             <option value="corn">Corn</option>
//             <option value="soybeans">Soybeans</option>
//             <option value="tomatoes">Tomatoes</option>
//           </select>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="p-4">
//         <Tabs defaultValue="feed" className="space-y-4">
//           {/*<TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="feed">Alert Feed</TabsTrigger>
//             <TabsTrigger value="map">Map View</TabsTrigger>
//           </TabsList>*/}

//           <TabsContent value="feed" className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h2 className="text-lg font-semibold">Recent Alerts ({filteredAlerts.length})</h2>
//               <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
//                 {filteredAlerts.filter((a) => a.isNew).length} New
//               </Badge>
//             </div>

//             <div className="space-y-3">
//               {filteredAlerts.map((alert) => (
//                 <Card
//                   key={alert.id}
//                   className={`hover:shadow-md transition-shadow ${alert.isNew ? "ring-2 ring-green-200 dark:ring-green-800" : ""}`}
//                 >
//                   <CardContent className="p-4">
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <h3 className="font-medium text-foreground">{alert.title}</h3>
//                           {alert.isNew && (
//                             <Badge
//                               variant="secondary"
//                               className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"
//                             >
//                               New
//                             </Badge>
//                           )}
//                         </div>
//                         <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
//                       </div>
//                       <Button variant="ghost" size="icon" onClick={() => toggleSaveAlert(alert.id)} className="ml-2">
//                         {savedAlerts.includes(alert.id) ? (
//                           <div className="relative">
//                             <Bookmark className="w-4 h-4 text-green-600 dark:text-green-400 fill-current" />
//                             <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
//                           </div>
//                         ) : (
//                           <Bookmark className="w-4 h-4" />
//                         )}
//                       </Button>
//                     </div>

//                     <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
//                       <span className="flex items-center gap-1">
//                         <MapPin className="w-3 h-3" />
//                         {alert.location} • {alert.distance}
//                       </span>
//                       <span>Crop: {alert.crop}</span>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <Badge className={getSeverityColor(alert.severity)}>{alert.severity} Priority</Badge>
//                         <span className="text-xs text-muted-foreground">by {alert.author}</span>
//                       </div>
//                       <span className="text-sm text-muted-foreground">{alert.date}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>

//           <TabsContent value="map">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Nearby Alerts & Your Farm</CardTitle>
//                 <CardDescription>
//                   View alerts in your area and your farm location on the interactive map
//                 </CardDescription>
//               </CardHeader>
//               {/*<CardContent>
//                 <EnhancedMap userRole="farmer" user={user} alerts={alerts} />
//               </CardContent>*/}
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Location Setup Modal */}
//       {user && (
//         <LocationSetupModal
//           user={user}
//           isOpen={shouldShowLocationSetup}
//           onClose={() => setShouldShowLocationSetup(false)}
//           onLocationUpdated={handleLocationUpdated}
//         />
//       )}
//       {/* Profile Modal */}
//       {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onUpdate={userApi} />}
//     </div>
//     </>
//   )
// }



"use client"

import { useState } from "react"
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

  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      title: "Critical: Aphid Infestation Detected",
      description:
        "Massive aphid colonies found in wheat fields. Immediate pesticide application recommended. Economic threshold exceeded by 300%. Yield loss estimated at 15-25% if untreated.",
      crop: "Wheat",
      location: "Northern Valley Farm District",
      coordinates: { lat: 40.7128, lng: -74.006 },
      distance: "2.3 km",
      severity: "High",
      date: "2024-01-15",
      author: "Dr. Sarah Johnson",
      authorId: "1",
      isNew: true,
      views: 156,
      status: "Active",
    },
    {
      id: "2",
      title: "Optimal Planting Window Open",
      description:
        "Perfect soil temperature (12-15°C) and moisture conditions detected. Weather forecast shows 7-day dry period ideal for corn planting. Act within 48 hours for best results.",
      crop: "Corn",
      location: "Eastern Plains Agricultural Zone",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      distance: "5.1 km",
      severity: "Medium",
      date: "2024-01-14",
      author: "Dr. Mike Chen",
      authorId: "2",
      isNew: true,
      views: 89,
      status: "Active",
    },
    {
      id: "3",
      title: "Rust Disease Early Warning",
      description:
        "Initial symptoms of stripe rust detected in neighboring fields. High humidity and temperature conditions favor rapid spread. Preventive fungicide application recommended.",
      crop: "Soybeans",
      location: "Western Fields Cooperative",
      coordinates: { lat: 40.6892, lng: -74.0445 },
      distance: "8.7 km",
      severity: "Medium",
      date: "2024-01-13",
      author: "Dr. Emily Rodriguez",
      authorId: "3",
      isNew: false,
      views: 234,
      status: "Active",
    },
    {
      id: "4",
      title: "Irrigation Optimization Alert",
      description:
        "Soil moisture sensors indicate optimal levels reached. Reduce irrigation by 30% to prevent waterlogging. Current conditions support natural rainfall absorption.",
      crop: "Tomatoes",
      location: "Southern Greenhouse Complex",
      coordinates: { lat: 40.7282, lng: -73.7949 },
      distance: "12.4 km",
      severity: "Low",
      date: "2024-01-12",
      author: "Dr. James Wilson",
      authorId: "4",
      isNew: false,
      views: 67,
      status: "Active",
    },
    {
      id: "5",
      title: "Frost Warning - Immediate Action Required",
      description:
        "Temperatures expected to drop to -2°C tonight. Protect sensitive crops with covers or heating systems. Frost damage risk is extremely high for exposed plants.",
      crop: "Vegetables",
      location: "Valley Organic Farms",
      coordinates: { lat: 40.7456, lng: -74.0234 },
      distance: "6.8 km",
      severity: "High",
      date: "2024-01-11",
      author: "Dr. Lisa Park",
      authorId: "5",
      isNew: false,
      views: 312,
      status: "Active",
    },
    {
      id: "6",
      title: "Nutrient Deficiency Detected",
      description:
        "Nitrogen deficiency symptoms observed in corn fields. Leaf yellowing and stunted growth indicate need for immediate fertilizer application. Soil test results available.",
      crop: "Corn",
      location: "Central Farm District",
      coordinates: { lat: 40.7234, lng: -73.9876 },
      distance: "4.2 km",
      severity: "Medium",
      date: "2024-01-10",
      author: "Dr. Robert Kim",
      authorId: "6",
      isNew: false,
      views: 145,
      status: "Expired",
    },
  ])

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

  const toggleSaveAlert = (alertId: string) => {
    setSavedAlerts((prev) => (prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]))
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.author.toLowerCase().includes(searchTerm.toLowerCase())
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
            variant={savedAlerts.length > 0 ? "default" : "outline"}
            size="sm"
            onClick={() => {
              // Toggle showing only saved alerts
              if (savedAlerts.length > 0) {
                // Show logic for saved alerts filter
              }
            }}
            className="h-7 text-xs"
          >
            📌 Saved ({savedAlerts.length})
          </Button>
          <Button
            variant={filteredAlerts.filter((a) => a.isNew).length > 0 ? "default" : "outline"}
            size="sm"
            onClick={() => {
              // Toggle showing only new alerts
            }}
            className="h-7 text-xs"
          >
            ✨ New ({filteredAlerts.filter((a) => a.isNew).length})
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
                <Card
                  key={alert.id}
                  className={`hover:shadow-md transition-shadow ${alert.isNew ? "ring-2 ring-green-200 dark:ring-green-800" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{alert.title}</h3>
                          {alert.isNew && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs"
                            >
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => toggleSaveAlert(alert.id)} className="ml-2">
                        {savedAlerts.includes(alert.id) ? (
                          <div className="relative">
                            <Bookmark className="w-4 h-4 text-green-600 dark:text-green-400 fill-current" />
                            <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                          </div>
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location} • {alert.distance}
                      </span>
                      <span>Crop: {alert.crop}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(alert.severity)}>{alert.severity} Priority</Badge>
                        <span className="text-xs text-muted-foreground">by {alert.author}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{alert.date}</span>
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
                <EnhancedMap userRole="farmer" user={user} alerts={alerts} />
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
