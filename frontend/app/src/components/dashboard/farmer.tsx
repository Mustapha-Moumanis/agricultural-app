"use client"

import type { User } from "@/types"

interface FarmerDashboardProps {
  user: User
  onLogout: () => void
  onUpdateUser: (updates: Partial<User>) => void
}

export function FarmerDashboard({ user, onLogout, onUpdateUser }: FarmerDashboardProps) {
  
  return (
    <div className="min-h-screen bg-background transition-colors">
        FarmerDashboard
        {user.name}
        <button onClick={onLogout} className="p-2 bg-red-500 text-white rounded">
          Logout
        </button>
        <button onClick={() => onUpdateUser({ name: "Updated Name" })} className="p-2 bg-blue-500 text-white rounded ml-2">
          Update Name
        </button>
        <div className="mt-4">
          <h2 className="text-xl font-bold">User Details</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          {user.location && <p><strong>Location:</strong> {user.location}</p>}
          {user.farmLocation && (
            <div>
              <p><strong>Farm Location:</strong></p>
              <p>Address: {user.farmLocation.address}</p>
              <p>Coordinates: {user.farmLocation.lat}, {user.farmLocation.lng}</p>
            </div>
          )}
        </div>
    </div>)
}
