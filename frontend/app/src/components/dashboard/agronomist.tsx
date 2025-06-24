"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, Plus, MapPin, Calendar, Users, TrendingUp, Settings } from "lucide-react"
// import { AlertPublishForm } from "./alert-publish-form"
import { AlertCreationForm } from "../alerts/alert-creation-form"
import { useAuth } from "@/hooks/use-auth"
import { EnhancedMap } from "../enhanced-map"
import { NotificationBell } from "../notifications/notification-bell"

import { ProfileModal } from "./profile-modal"
import { ThemeToggle } from "../theme-toggle"
import type { User, Alert } from "@/types"

export function AgronomistDashboard() {
  const [showPublishForm, setShowPublishForm] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [activeTab, setActiveTab] = useState("alerts")
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Update alerts data with more comprehensive information
  const [alerts] = useState<Alert[]>([
    {
      id: "1",
      title: "Critical: Aphid Infestation Warning",
      description:
        "Massive aphid colonies detected in wheat fields across Northern Valley. Economic threshold exceeded by 300%. Immediate systemic insecticide application recommended. Estimated yield loss: 15-25% if untreated within 48 hours.",
      crop: "Wheat",
      location: "Northern Valley Farm District",
      coordinates: { lat: 40.7128, lng: -74.006 },
      severity: "High",
      date: "2024-01-15",
      author: "Dr. Sarah Johnson",
      authorId: user.id,
      views: 156,
      status: "Active",
    },
    {
      id: "2",
      title: "Optimal Planting Conditions Detected",
      description:
        "Perfect soil temperature (12-15°C) and moisture conditions for corn planting. 7-day dry weather window forecasted. Soil compaction minimal after recent rains. Plant within 48 hours for optimal germination rates.",
      crop: "Corn",
      location: "Eastern Plains Agricultural Zone",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      severity: "Medium",
      date: "2024-01-14",
      author: "Dr. Sarah Johnson",
      authorId: user.id,
      views: 89,
      status: "Active",
    },
    {
      id: "3",
      title: "Preventive Fungicide Application Recommended",
      description:
        "Weather conditions (high humidity 85%+ and temperatures 20-25°C) are creating ideal environment for stripe rust development. Neighboring fields showing initial symptoms. Preventive treatment recommended.",
      crop: "Soybeans",
      location: "Western Fields Cooperative",
      coordinates: { lat: 40.6892, lng: -74.0445 },
      severity: "High",
      date: "2024-01-13",
      author: "Dr. Sarah Johnson",
      authorId: user.id,
      views: 234,
      status: "Active",
    },
    {
      id: "4",
      title: "Irrigation Schedule Optimization",
      description:
        "Soil moisture sensors indicate saturation levels reached. Reduce irrigation frequency by 30% to prevent root rot and nutrient leaching. Natural rainfall expected to supplement water needs.",
      crop: "Tomatoes",
      location: "Southern Greenhouse Complex",
      coordinates: { lat: 40.7282, lng: -73.7949 },
      severity: "Low",
      date: "2024-01-12",
      author: "Dr. Sarah Johnson",
      authorId: user.id,
      views: 67,
      status: "Active",
    },
    {
      id: "5",
      title: "Frost Protection Protocol Activated",
      description:
        "Temperature forecast shows -2°C overnight. Activate frost protection systems immediately. Cover sensitive crops, run irrigation systems, or deploy heating units. Critical 6-hour window for action.",
      crop: "Vegetables",
      location: "Valley Organic Farms",
      coordinates: { lat: 40.7456, lng: -74.0234 },
      severity: "High",
      date: "2024-01-11",
      author: "Dr. Sarah Johnson",
      authorId: user.id,
      views: 312,
      status: "Expired",
    },
  ])

  // Add engagement metrics
  const totalViews = alerts.reduce((sum, alert) => sum + (alert.views || 0), 0)
  const activeAlerts = alerts.filter((alert) => alert.status === "Active").length
  const highPriorityAlerts = alerts.filter((alert) => alert.severity === "High").length

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

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">CA</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Welcome, {user.username} | Role: {user.role} </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{activeAlerts}</p>
                <p className="text-sm text-green-600 dark:text-green-400">Active Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalViews.toLocaleString()}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{highPriorityAlerts}</p>
                <p className="text-sm text-red-600 dark:text-red-400">High Priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                  {alerts.filter((a) => new Date(a.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </p>
                <p className="text-sm text-orange-600 dark:text-orange-400">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="p-4">

        {/* Existing Tabs content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">My Alerts</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Published Alerts</h2>
              <Button
                onClick={() => setShowPublishForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Alert
              </Button>
            </div>

            <div className="space-y-3">
              {alerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-foreground">{alert.title}</h3>
                      <Badge variant={alert.status === "Active" ? "default" : "secondary"}>{alert.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </span>
                      <span>Crop: {alert.crop}</span>
                      <span>{alert.views} views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className={getSeverityColor(alert.severity)}>{alert.severity} Priority</Badge>
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
                <CardTitle>Alert Locations</CardTitle>
                <CardDescription>View all your published alerts on the interactive map</CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedMap userRole="agronomist" user={user} alerts={alerts} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showPublishForm && <AlertCreationForm onClose={() => setShowPublishForm(false)} />}
      {/*showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onUpdate={onUpdateUser} />*/}
    </div>
  )
}
// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Plus, MapPin, Bell, TrendingUp, Users, AlertTriangle, Eye, Bookmark, Settings } from "lucide-react"
// import { useAuth } from "@/hooks/use-auth"
// import { AlertForm } from "../create/alert-form"
// import { AlertList } from "../feed/alert-list"
// import { AlertMap } from "../alert-map"
// import { NotificationCenter, useNotifications } from "../../notifications/notification-center"
// import { LocationSetupModal } from "../../location/location-setup-modal"
// import type { Alert } from "@/types"
// import { toast } from "sonner"

// export function AlertDashboard() {
//   const { user, shouldShowLocationSetup, setShouldShowLocationSetup, updateUser } = useAuth()
//   const { notifications, unreadCount } = useNotifications()
//   const [activeTab, setActiveTab] = useState("feed")
//   const [showCreateForm, setShowCreateForm] = useState(false)
//   const [showNotifications, setShowNotifications] = useState(false)
//   const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
//   const [isMapFullscreen, setIsMapFullscreen] = useState(false)
//   const [recentAlerts, setRecentAlerts] = useState<Alert[]>([])
//   const [userStats, setUserStats] = useState({
//     totalPublished: 0,
//     totalViews: 0,
//     totalBookmarks: 0,
//     responseRate: 0,
//   })

//   useEffect(() => {
//     loadDashboardData()
//   }, [])

//   const loadDashboardData = async () => {
//     try {
//       // Load recent alerts and user stats
//       // This would typically come from API calls
//       setRecentAlerts([])
//       setUserStats({
//         totalPublished: 12,
//         totalViews: 1247,
//         totalBookmarks: 89,
//         responseRate: 85,
//       })
//     } catch (error) {
//       console.error("Failed to load dashboard data:", error)
//     }
//   }

//   const handleCreateAlert = (alert: Alert) => {
//     setShowCreateForm(false)
//     setActiveTab("feed")
//     toast.success("Alert created successfully!")
//   }

//   const handleLocationUpdated = (updatedUser: any) => {
//     updateUser(updatedUser)
//     setShouldShowLocationSetup(false)
//   }

//   const QuickActions = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <Button
//         onClick={() => setShowCreateForm(true)}
//         className="h-20 flex flex-col gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
//       >
//         <Plus className="w-6 h-6" />
//         <span>Create Alert</span>
//       </Button>

//       <Button variant="outline" onClick={() => setActiveTab("map")} className="h-20 flex flex-col gap-2">
//         <MapPin className="w-6 h-6" />
//         <span>View Map</span>
//       </Button>

//       <Button
//         variant="outline"
//         onClick={() => setShowNotifications(true)}
//         className="h-20 flex flex-col gap-2 relative"
//       >
//         <Bell className="w-6 h-6" />
//         <span>Notifications</span>
//         {unreadCount > 0 && (
//           <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center">
//             {unreadCount}
//           </Badge>
//         )}
//       </Button>

//       <Button variant="outline" onClick={() => setShouldShowLocationSetup(true)} className="h-20 flex flex-col gap-2">
//         <Settings className="w-6 h-6" />
//         <span>Settings</span>
//       </Button>
//     </div>
//   )

//   const StatsOverview = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center">
//             <TrendingUp className="h-4 w-4 text-blue-500" />
//             <div className="ml-2">
//               <p className="text-sm font-medium">Alerts Published</p>
//               <p className="text-2xl font-bold">{userStats.totalPublished}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center">
//             <Eye className="h-4 w-4 text-green-500" />
//             <div className="ml-2">
//               <p className="text-sm font-medium">Total Views</p>
//               <p className="text-2xl font-bold">{userStats.totalViews}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center">
//             <Bookmark className="h-4 w-4 text-yellow-500" />
//             <div className="ml-2">
//               <p className="text-sm font-medium">Bookmarks</p>
//               <p className="text-2xl font-bold">{userStats.totalBookmarks}</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center">
//             <Users className="h-4 w-4 text-purple-500" />
//             <div className="ml-2">
//               <p className="text-sm font-medium">Response Rate</p>
//               <p className="text-2xl font-bold">{userStats.responseRate}%</p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )

//   if (showCreateForm) {
//     return (
//       <div className="container mx-auto p-4">
//         <div className="mb-6">
//           <Button variant="outline" onClick={() => setShowCreateForm(false)}>
//             ← Back to Dashboard
//           </Button>
//         </div>
//         <AlertForm onSuccess={handleCreateAlert} onCancel={() => setShowCreateForm(false)} />
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="container mx-auto p-4 space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">Agricultural Alert Dashboard</h1>
//             <p className="text-muted-foreground">
//               Welcome back, {user?.name}! Manage and monitor agricultural alerts in your area.
//             </p>
//           </div>

//           <div className="flex items-center gap-2">
//             <Button variant="outline" onClick={() => setShowNotifications(true)} className="relative">
//               <Bell className="w-4 h-4 mr-2" />
//               Notifications
//               {unreadCount > 0 && (
//                 <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
//                   {unreadCount}
//                 </Badge>
//               )}
//             </Button>

//             <Button onClick={() => setShowCreateForm(true)}>
//               <Plus className="w-4 h-4 mr-2" />
//               Create Alert
//             </Button>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//             <CardDescription>Common tasks and shortcuts</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <QuickActions />
//           </CardContent>
//         </Card>

//         {/* Stats Overview */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Your Impact</CardTitle>
//             <CardDescription>Statistics about your contributions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <StatsOverview />
//           </CardContent>
//         </Card>

//         {/* Main Content Tabs */}
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//           <TabsList className="grid w-full grid-cols-3">
//             <TabsTrigger value="feed">Alert Feed</TabsTrigger>
//             <TabsTrigger value="map">Map View</TabsTrigger>
//             <TabsTrigger value="my-alerts">My Alerts</TabsTrigger>
//           </TabsList>

//           <TabsContent value="feed" className="space-y-4">
//             <AlertList />
//           </TabsContent>

//           <TabsContent value="map" className="space-y-4">
//             <AlertMap
//               alerts={recentAlerts}
//               selectedAlert={selectedAlert}
//               onAlertSelect={setSelectedAlert}
//               isFullscreen={isMapFullscreen}
//               onFullscreenToggle={() => setIsMapFullscreen(!isMapFullscreen)}
//               className={isMapFullscreen ? "fixed inset-0 z-50" : ""}
//             />
//           </TabsContent>

//           <TabsContent value="my-alerts" className="space-y-4">
//             <Card>
//               <CardHeader>
//                 <CardTitle>My Published Alerts</CardTitle>
//                 <CardDescription>Alerts you've created and their performance</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-8">
//                   <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">No alerts yet</h3>
//                   <p className="text-muted-foreground mb-4">
//                     Start by creating your first agricultural alert to help farmers in your area.
//                   </p>
//                   <Button onClick={() => setShowCreateForm(true)}>
//                     <Plus className="w-4 h-4 mr-2" />
//                     Create Your First Alert
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Notification Center */}
//       <NotificationCenter isOpen={showNotifications} onClose={() => setShowNotifications(false)} />

//       {/* Location Setup Modal */}
//       {user && (
//         <LocationSetupModal
//           user={user}
//           isOpen={shouldShowLocationSetup}
//           onClose={() => setShouldShowLocationSetup(false)}
//           onLocationUpdated={handleLocationUpdated}
//         />
//       )}
//     </>
//   )
// }