export interface User {
  id: string
  username: string
  email: string
  role: "Agronomist" | "Farmer"
  avatar?: string
}
// location?: string
// farmLocation?: {
//   lat: number
//   lng: number
//   address: string
// }
// bio?: string
// phone?: string
// specialization?: string
// cropTypes?: string[]

export interface Alert {
  id: string
  title: string
  description: string
  crop: string
  location: string
  coordinates: {
    lat: number
    lng: number
  }
  distance?: string
  severity: "High" | "Medium" | "Low"
  date: string
  author: string
  authorId: string
  views?: number
  status?: "Active" | "Expired"
  isNew?: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  isNew: boolean
  type: "alert" | "weather" | "system"
}
export interface WeatherUpdate {
  id: string
  location: string
  temperature: number
  humidity: number
  windSpeed: number
  condition: "Sunny" | "Rainy" | "Cloudy" | "Stormy"
  date: string
}