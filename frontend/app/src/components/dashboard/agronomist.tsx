"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { LogOut, Search, Plus, ChevronDown, UserRoundPen } from "lucide-react"
import { EnhancedMap } from "../enhanced-map"
import { NotificationBell } from "../notifications/notification-bell"
import { ThemeToggle } from "../theme-toggle"
import type { Alert } from "@/types"
import { alertsApi } from "@/lib/api"
import { alertCategories, AlertCreationForm, severityLevels } from "../alerts/alert-creation-form"

export function AgronomistDashboard() {
  const [showPublishForm, setShowPublishForm] = useState(false)
  {/*const [showProfile, setShowProfile] = useState(false)*/}
  const [activeTab, setActiveTab] = useState("alerts")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  // Update alerts data with more comprehensive information
  const [alerts, setAlerts] = useState<Alert[]>([])

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

  const getSeverity = (item: string) => {
    return severityLevels.find((s) => s.value === item);
  }
  const getCategory = (item: string) => {
    return alertCategories.find((s) => s.value === item);
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCrop = selectedCrop === "all" || 
      (alert.crop && alert.crop.toLowerCase() === selectedCrop);
    
    const matchesSeverity = selectedSeverity === "all" || 
      (alert.severity && alert.severity.toLowerCase() === selectedSeverity);
    
    return matchesSearch && matchesCrop && matchesSeverity;
  });

  return (
    <div className="min-h-screen bg-background transition-colors">
      {/* Header */}
      <header className="bg-card border-b px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage 
                  src="/agri-icon.png" 
                  alt="agri logo" 
                  className="object-cover"
                />
              </Avatar>
              <h1 className="font-semibold text-foreground">CropAlert</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            {/*<Button variant="ghost" size="icon" onClick={() => setShowProfile(true)}>
              <Settings className="w-4 h-4" />
            </Button>*/}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-3 h-10 pl-2 pr-0 py-2 hover:bg-accent focus:bg-accent transition-colors rounded-lg"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user?.avatar} 
                      alt={user?.username || 'User avatar'} 
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="hidden sm:flex flex-col items-start min-w-0">
                    <span className="text-sm font-medium truncate max-w-[120px]">
                      {user?.username || 'User'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {user?.role || 'No role'}
                    </span>
                  </div>

                  <ChevronDown className="h-4 w-4 text-muted-foreground cursor-pointer rounded-lg hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto">
                <DropdownMenuLabel className="font-normal sm:hidden">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.role || 'No role assigned'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="sm:hidden" />
                
                <DropdownMenuGroup>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => setShowProfile(true)}>
                    <UserRoundPen className="mr-2 h-4 w-4"/>
                    <span>Profile</span>
                  </DropdownMenuItem>
                   
                  {/*<DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                   
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Team</span>
                  </DropdownMenuItem>*/}
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        {/* Existing Tabs content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts">My Alerts</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Published Alerts ({filteredAlerts.length})</h2>
              <Button
                onClick={() => setShowPublishForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Alert
              </Button>
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
                <CardTitle>Alert Locations</CardTitle>
                <CardDescription>View all your published alerts on the interactive map</CardDescription>
              </CardHeader>
              <CardContent>
                <EnhancedMap 
                  userRole="Farmer"
                  user={user || undefined}
                  alerts={alerts}
                  onAlertClick={(alert) => console.log('Alert clicked:', alert)}
                  websocketUrl="ws://localhost:8000/ws/notifications/"
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