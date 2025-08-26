"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, CheckCircle, DollarSign, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminDashboardProps {
  adminToken: string
}

interface Booking {
  _id: string
  name: string
  email: string
  phone: string
  ticketType: string
  quantity: number
  totalAmount: number
  status: "pending" | "confirmed" | "failed" | "payment_submitted"
  createdAt: string
  transactionId?: string
}

interface Statistics {
  totalTicketsSold: number
  remainingTickets: number
  statusCounts: Array<{
    _id: string
    count: number
    totalAmount: number
    totalQuantity: number
  }>
}

export function AdminDashboard({ adminToken }: AdminDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchBookings = async (status = "all", page = 1) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings?status=${status}&page=${page}&limit=10`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
        setStatistics(data.statistics)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Error fetching bookings:", error)
    }
    setLoading(false)
  }

  const verifyBooking = async (bookingId: string, action: "confirm" | "reject") => {
    try {
      const response = await fetch("/api/admin/verify-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ bookingId, action }),
      })

      if (response.ok) {
        // Refresh bookings after verification
        fetchBookings(selectedStatus, currentPage)
        alert(`Booking ${action}ed successfully!`)
      } else {
        const data = await response.json()
        alert(data.error || `Failed to ${action} booking`)
      }
    } catch (error) {
      alert("Network error")
    }
  }

  useEffect(() => {
    fetchBookings(selectedStatus, currentPage)
  }, [selectedStatus, currentPage, adminToken])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-400 bg-green-500/20"
      case "pending":
        return "text-yellow-400 bg-yellow-500/20"
      case "failed":
        return "text-red-400 bg-red-500/20"
      case "payment_submitted":
        return "text-blue-400 bg-blue-500/20"
      default:
        return "text-gray-400 bg-gray-500/20"
    }
  }

  const getStatusCounts = () => {
    if (!statistics?.statusCounts) return {}
    return statistics.statusCounts.reduce(
      (acc, item) => {
        acc[item._id] = item
        return acc
      },
      {} as Record<string, any>,
    )
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-400/30"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-400/20 rounded-full p-3">
                <Ticket className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <p className="text-blue-300 font-semibold">Total Sold</p>
                <p className="text-2xl font-bold text-white">{statistics.totalTicketsSold}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 border border-green-400/30"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-400/20 rounded-full p-3">
                <Users className="w-8 h-8 text-green-400" />
              </div>
              <div>
                <p className="text-green-300 font-semibold">Remaining</p>
                <p className="text-2xl font-bold text-white">{statistics.remainingTickets}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400/20 rounded-full p-3">
                <CheckCircle className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-yellow-300 font-semibold">Confirmed</p>
                <p className="text-2xl font-bold text-white">{statusCounts.confirmed?.count || 0}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl p-6 border border-red-400/30"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-400/20 rounded-full p-3">
                <DollarSign className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <p className="text-red-300 font-semibold">Revenue</p>
                <p className="text-2xl font-bold text-white">₹{statusCounts.confirmed?.totalAmount || 0}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-yellow-400/30">
        <div className="flex flex-wrap gap-4 items-center">
          <h3 className="text-xl font-bold text-white">📋 Bookings Management</h3>
          <div className="flex space-x-2">
            {["all", "pending", "payment_submitted", "confirmed", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status)
                  setCurrentPage(1)
                }}
                className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                  selectedStatus === status
                    ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                    : "text-white hover:text-yellow-300 border border-gray-600"
                }`}
              >
                {status.replace("_", " ")} ({statusCounts[status]?.count || 0})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-black/30 backdrop-blur-xl rounded-2xl border border-yellow-400/30 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No bookings found for the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-400/10">
                <tr>
                  <th className="text-left p-4 text-yellow-300 font-semibold">Customer</th>
                  <th className="text-left p-4 text-yellow-300 font-semibold">Ticket</th>
                  <th className="text-left p-4 text-yellow-300 font-semibold">Amount</th>
                  <th className="text-left p-4 text-yellow-300 font-semibold">Status</th>
                  <th className="text-left p-4 text-yellow-300 font-semibold">Date</th>
                  <th className="text-left p-4 text-yellow-300 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-600/30 hover:bg-yellow-400/5"
                  >
                    <td className="p-4">
                      <div>
                        <p className="text-white font-semibold">{booking.name}</p>
                        <p className="text-gray-300 text-sm">{booking.email}</p>
                        <p className="text-gray-400 text-sm">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white">{booking.ticketType}</p>
                        <p className="text-gray-300 text-sm">Qty: {booking.quantity}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-yellow-300 font-bold">₹{booking.totalAmount}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}
                      >
                        {booking.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-300 text-sm">{new Date(booking.createdAt).toLocaleString()}</p>
                      {booking.transactionId && <p className="text-blue-300 text-xs">ID: {booking.transactionId}</p>}
                    </td>
                    <td className="p-4">
                      {booking.status === "payment_submitted" && (
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => verifyBooking(booking._id, "confirm")}
                            size="sm"
                            className="bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-400/30"
                          >
                            ✓ Confirm
                          </Button>
                          <Button
                            onClick={() => verifyBooking(booking._id, "reject")}
                            size="sm"
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-400/30"
                          >
                            ✗ Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-600/30 flex justify-center items-center space-x-2">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              size="sm"
              variant="outline"
              className="bg-gray-600/20 border-gray-500 text-white disabled:opacity-50"
            >
              Previous
            </Button>

            <span className="text-white px-4">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              size="sm"
              variant="outline"
              className="bg-gray-600/20 border-gray-500 text-white disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
