"use client"

import { useState, useEffect } from "react"
import { AdminLogin } from "@/components/admin-login"
import { TicketVerifier } from "@/components/ticket-verifier"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"dashboard" | "verifier">("dashboard")

  useEffect(() => {
    // Check for existing token in localStorage
    const token = localStorage.getItem("adminToken")
    if (token) {
      setAdminToken(token)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    setAdminToken(null)
  }

  if (!adminToken) {
    return <AdminLogin onLogin={setAdminToken} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-yellow-400/30 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">🔐 Admin Panel</h1>
            <p className="text-yellow-200">Dandiya Night 2025 - Management</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("verifier")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === "verifier"
                  ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                  : "text-white hover:text-yellow-300"
              }`}
            >
              🎫 Ticket Verifier
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/40 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "dashboard" && <AdminDashboard adminToken={adminToken} />}
        {activeTab === "verifier" && <TicketVerifier adminToken={adminToken} />}
      </div>
    </div>
  )
}
