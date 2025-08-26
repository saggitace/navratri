"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, QrCode, Calendar, MapPin, User, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import NextImage from "next/image"

interface TicketInfo {
  bookingId: string
  name: string
  email: string
  phone: string
  ticketType: string
  ticketTypeName: string
  quantity: number
  totalAmount: number
  eventDate: string
  eventTime: string
  venue: string
  qrCode: string
  generatedAt: string
}

interface TicketGeneratorProps {
  bookingId: string
  onClose: () => void
}

export function TicketGenerator({ bookingId, onClose }: TicketGeneratorProps) {
  const [ticket, setTicket] = useState<TicketInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateTicket = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/generate-ticket?bookingId=${bookingId}`)
      const data = await response.json()

      if (data.success) {
        console.log("✅ Ticket generated successfully:", data.ticket)
        setTicket(data.ticket)
        setError(null)
      } else {
        setError(data.error || "Failed to generate ticket")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }

    setLoading(false)
  }

  const downloadTicket = () => {
    if (!ticket) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 800
    canvas.height = 1000

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, "#dc2626")
    gradient.addColorStop(0.5, "#ea580c")
    gradient.addColorStop(1, "#eab308")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Header
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, canvas.width, 120)

    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 32px Arial"
    ctx.textAlign = "center"
    ctx.fillText("🪔 DANDIYA NIGHT 2025 🪔", canvas.width / 2, 50)
    ctx.font = "18px Arial"
    ctx.fillText("Raas Ki Raat Sab Ke Saath", canvas.width / 2, 80)

    // Ticket details
    ctx.fillStyle = "#000000"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Name: ${ticket.name}`, 50, 200)
    ctx.fillText(`Ticket Type: ${ticket.ticketTypeName}`, 50, 240)
    ctx.fillText(`Quantity: ${ticket.quantity}`, 50, 280)
    ctx.fillText(`Amount: ₹${ticket.totalAmount}`, 50, 320)

    // Event details
    ctx.font = "bold 20px Arial"
    ctx.fillText(`📅 ${ticket.eventDate}`, 50, 380)
    ctx.fillText(`⏰ ${ticket.eventTime}`, 50, 410)
    ctx.fillText(`📍 ${ticket.venue}`, 50, 440)

    // Booking ID
    ctx.font = "16px Arial"
    ctx.fillText(`Booking ID: ${ticket.bookingId}`, 50, 500)

    // Load QR Code image
    const qrImg = new window.Image()
    qrImg.crossOrigin = "anonymous" // ✅ important for canvas export
    qrImg.src = ticket.qrCode

    qrImg.onload = () => {
      ctx.drawImage(qrImg, 300, 550, 200, 200)

      // Footer
      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 850, canvas.width, 150)
      ctx.fillStyle = "#ffffff"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Present this ticket at the venue for entry", canvas.width / 2, 900)
      ctx.fillText("Organized by Milaan Services", canvas.width / 2, 930)
      ctx.fillText("Contact: +91 7370038276", canvas.width / 2, 960)

      // Trigger download
      const link = document.createElement("a")
      link.download = `dandiya-ticket-${ticket.bookingId}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4" // ✅ changed z-50 → z-60
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-yellow-400/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            🎫 Your Ticket
          </h2>
          <p className="text-yellow-200 mt-1">Dandiya Night 2025 - Patna</p>
        </div>

        {loading && <p className="text-white text-center">Generating your ticket...</p>}

        {error && (
          <div className="text-center space-y-4">
            <p className="text-red-400">{error}</p>
            <Button type="button" onClick={generateTicket} className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && !ticket && (
          <div className="text-center space-y-4">
            <p className="text-white">Generate your downloadable ticket</p>
            <Button
              type="button"
              onClick={generateTicket}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Generate Ticket
            </Button>
          </div>
        )}

        {!loading && !error && ticket && (
          <div className="space-y-6">
            {/* Ticket Preview */}
            <div className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-2xl p-6 border-2 border-yellow-400/30">
              <div className="text-center mb-6 pb-4 border-b border-yellow-400/30">
                <h3 className="text-2xl font-bold text-yellow-300">🪔 DANDIYA NIGHT 2025 🪔</h3>
                <p className="text-orange-200">Raas Ki Raat Sab Ke Saath</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Name:</span>
                    <span className="text-white font-semibold">{ticket.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Email:</span>
                    <span className="text-white">{ticket.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Phone:</span>
                    <span className="text-white">{ticket.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Type:</span>
                    <span className="text-white font-semibold">{ticket.ticketTypeName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Quantity:</span>
                    <span className="text-white font-bold">{ticket.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Amount:</span>
                    <span className="text-yellow-300 font-bold">₹{ticket.totalAmount}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Date:</span>
                    <span className="text-white">{ticket.eventDate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Time:</span>
                    <span className="text-white">{ticket.eventTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Venue:</span>
                    <span className="text-white">{ticket.venue}</span>
                  </div>

                  <div className="bg-white rounded-lg p-4 text-center">
                    <NextImage
                      src={ticket.qrCode || "/placeholder.svg"}
                      alt="Ticket QR Code"
                      width={150}
                      height={150}
                      className="mx-auto"
                      unoptimized
                    />
                    <p className="text-black text-xs mt-2">Scan for verification</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-yellow-400/30 text-center">
                <p className="text-gray-300 text-sm">Booking ID: {ticket.bookingId}</p>
                <p className="text-yellow-200 text-sm mt-2">Present this ticket at the venue for entry</p>
                <p className="text-orange-200 text-xs mt-1">Organized by Milaan Services</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Button
                type="button"
                onClick={downloadTicket}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Ticket
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="bg-gray-600/20 border-gray-500 text-white hover:bg-gray-600/40"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
