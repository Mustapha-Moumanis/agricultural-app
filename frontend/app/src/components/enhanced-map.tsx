import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Navigation, ZoomIn, ZoomOut, Layers, MapPin, Home } from "lucide-react"
import type { Alert, User } from "@/types"

interface EnhancedMapProps {
  userRole: "agronomist" | "farmer"
  user?: User
  alerts?: Alert[]
}

export function EnhancedMap({ userRole, user, alerts = [] }: EnhancedMapProps) {
  const mockAlerts: Alert[] = [
    {
      id: "1",
      title: "Aphid Infestation",
      description: "High aphid activity detected",
      crop: "Wheat",
      location: "Northern Valley",
      coordinates: { lat: 40.7128, lng: -74.006 },
      severity: "High",
      date: "2024-01-15",
      author: "Dr. Sarah Johnson",
      authorId: "1",
    },
    {
      id: "2",
      title: "Optimal Planting",
      description: "Perfect conditions for planting",
      crop: "Corn",
      location: "Eastern Plains",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      severity: "Medium",
      date: "2024-01-14",
      author: "Dr. Mike Chen",
      authorId: "2",
    },
    {
      id: "3",
      title: "Fungal Disease",
      description: "Early signs detected",
      crop: "Soybeans",
      location: "Western Fields",
      coordinates: { lat: 40.6892, lng: -74.0445 },
      severity: "Medium",
      date: "2024-01-13",
      author: "Dr. Emily Rodriguez",
      authorId: "3",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-500 border-red-600 shadow-red-500/50"
      case "Medium":
        return "bg-yellow-500 border-yellow-600 shadow-yellow-500/50"
      case "Low":
        return "bg-green-500 border-green-600 shadow-green-500/50"
      default:
        return "bg-gray-500 border-gray-600 shadow-gray-500/50"
    }
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-xl overflow-hidden border shadow-lg">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.3),transparent_50%)]"></div>
        </div>

        {/* Topographic Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" viewBox="0 0 400 300">
          <defs>
            <pattern id="topo" patternUnits="userSpaceOnUse" width="40" height="40">
              <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topo)" />
          <path
            d="M50 50 Q100 30 150 50 T250 70 L300 90 Q350 100 380 120"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M20 100 Q80 80 140 100 T240 120 L290 140 Q340 150 370 170"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
          <path
            d="M30 200 Q90 180 150 200 T250 220 L300 240 Q350 250 380 270"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.4"
          />
        </svg>

        {/* Farm Location (for farmers) */}
        {userRole === "farmer" && user?.farmLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
            style={{ left: "50%", top: "50%" }}
          >
            <div className="relative">
              <div className="w-8 h-8 bg-blue-600 border-4 border-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -inset-2 bg-blue-400 rounded-full opacity-30 animate-ping"></div>

              {/* Farm Tooltip */}
              <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Card className="w-48 shadow-xl border-blue-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-sm">My Farm</h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.farmLocation.address}</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">Your Location</Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Alert Markers */}
        {mockAlerts.map((alert, index) => (
          <div
            key={alert.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            style={{
              left: `${25 + index * 20}%`,
              top: `${30 + index * 15}%`,
            }}
          >
            <div className="relative">
              <div
                className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${getSeverityColor(alert.severity)} group-hover:scale-125 transition-all duration-200`}
              >
                <div className="absolute inset-0 rounded-full animate-ping opacity-75"></div>
              </div>

              {/* Alert Tooltip */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Card className="w-56 shadow-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{alert.title}</h4>
                      <Badge
                        className={`text-xs ${
                          alert.severity === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : alert.severity === "Medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{alert.crop}</span>
                      <span>{alert.date}</span>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">by {alert.author}</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ))}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button size="icon" variant="secondary" className="w-10 h-10 shadow-lg">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="w-10 h-10 shadow-lg">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="w-10 h-10 shadow-lg">
            <Navigation className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="secondary" className="w-10 h-10 shadow-lg">
            <Layers className="w-4 h-4" />
          </Button>
        </div>

        {/* Scale Indicator */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/90 rounded px-2 py-1 text-xs font-mono">
          0 ——— 5km
        </div>

        {/* Compass */}
        <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 dark:bg-black/90 rounded-full flex items-center justify-center shadow-lg">
          <div className="text-xs font-bold">N</div>
          <div className="absolute w-1 h-4 bg-red-500 rounded-full transform -translate-y-1"></div>
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Map Legend
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Alert Priority</h5>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">High Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Medium Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Low Priority</span>
                </div>
              </div>
            </div>
            {userRole === "farmer" && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Locations</h5>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600 flex items-center justify-center">
                    <Home className="w-2 h-2 text-white" />
                  </div>
                  <span className="text-sm">Your Farm</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map Instructions */}
      <div className="text-center text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
        <p>
          {userRole === "agronomist"
            ? "Hover over markers to view alert details and engagement metrics. Use controls to navigate the map."
            : "Your farm location is marked in blue. Hover over alert markers to view details and save important alerts."}
        </p>
      </div>
    </div>
  )
}
