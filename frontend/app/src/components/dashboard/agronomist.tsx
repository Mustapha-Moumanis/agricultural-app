"use client"

import { useState, useEffect } from "react"
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
import { alertsApi } from "@/lib/api"

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
 const [alerts, setAlerts] = useState<Alert[]>([
   ])
   const loadAlerts = async () => {
     try {
       const alerts = await alertsApi.getMyAlerts();
       setAlerts(alerts);
     } catch (err) {
       console.error(err)
     }
   }
   useEffect(() => {
     loadAlerts();
   }, [])

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
                <EnhancedMap 
                  userRole="Argonomist"
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

      {/* Modals */}
      {showPublishForm && <AlertCreationForm onClose={() => setShowPublishForm(false)} />}
      {/*showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} onUpdate={onUpdateUser} />*/}
    </div>
  )
}