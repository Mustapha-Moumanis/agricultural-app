"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X, MapPin, Send } from "lucide-react"

interface AlertPublishFormProps {
  onClose: () => void
}

export function AlertPublishForm({ onClose }: AlertPublishFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    crop: "",
    severity: "",
    location: "",
    coordinates: { lat: 0, lng: 0 },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would call your Django API
    console.log("Publishing alert:", formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Publish New Alert</CardTitle>
              <CardDescription>Share important agricultural information with farmers in your area</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Alert Title</Label>
              <Input
                id="title"
                placeholder="e.g., Aphid Infestation Warning"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed information about the alert..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="crop">Crop Type</Label>
                <select
                  id="crop"
                  value={formData.crop}
                  onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="corn">Corn</option>
                  <option value="soybeans">Soybeans</option>
                  <option value="tomatoes">Tomatoes</option>
                  <option value="rice">Rice</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Priority Level</Label>
                <select
                  id="severity"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select priority</option>
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter location or click map"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
                <Button type="button" variant="outline" size="icon">
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Map Picker Placeholder */}
            <div className="space-y-2">
              <Label>Select Location on Map</Label>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center text-muted-foreground">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p>Interactive map would go here</p>
                  <p className="text-sm">Click to select alert location</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <Send className="w-4 h-4 mr-2" />
                Publish Alert
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
