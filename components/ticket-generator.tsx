"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import NextImage from "next/image"

interface TicketInfo {
  bookingId: string
  name: string
  email: string
  phone: string
  ticketTypeName: string
  quantity: number
  totalAmount: number
  eventDate: string
  eventTime: string
  venue: string
  qrCode: string
}

interface TicketGeneratorProps {
  bookingId: string
  onClose: () => void
}

export function TicketGenerator({ bookingId, onClose }: TicketGeneratorProps) {
  const [ticket, setTicket] = useState<TicketInfo | null>(null)
  const [loading, setLoading] = useState(false)

  // Generate + set ticket
  const generateTicket = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/generate-ticket?bookingId=${bookingId}`)
      const data = await res.json()
      if (data.success) {
        setTicket(data.ticket)
      } else {
        alert(data.error || "Failed to generate ticket")
      }
    } catch (err) {
      alert("Network error")
    }
    setLoading(false)
  }

  // Download as PNG
  const downloadTicket = () => {
    if (!ticket) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    canvas.width = 800
    canvas.height = 1000

    // Background
    ctx.fillStyle = "#fef3c7"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#000"
    ctx.font = "bold 28px Arial"
    ctx.fillText("🎉 Dandiya Night 2025 🎉", 250, 80)
    ctx.font = "18px Arial"
    ctx.fillText(`Name: ${ticket.name}`, 50, 200)
    ctx.fillText(`Type: ${ticket.ticketTypeName}`, 50, 240)
    ctx.fillText(`Qty: ${ticket.quantity}`, 50, 280)
    ctx.fillText(`Amount: ₹${ticket.totalAmount}`, 50, 320)
    ctx.fillText(`📅 ${ticket.eventDate}`, 50, 380)
    ctx.fillText(`⏰ ${ticket.eventTime}`, 50, 420)
    ctx.fillText(`📍 ${ticket.venue}`, 50, 460)

    // Booking ID
    ctx.font = "14px Arial"
    ctx.fillText(`Booking ID: ${ticket.bookingId}`, 50, 520)

    // QR
    const qrImg = new Image()
    qrImg.src = ticket.qrCode
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 300, 600, 200, 200)

      const link = document.createElement("a")
      link.download = `ticket-${ticket.bookingId}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl p-6 w-full max-w-xl space-y-6">
        <h2 className="text-xl font-bold text-center">🎫 Your Ticket</h2>

        {/* Always show preview box */}
        <div className="border rounded-xl p-4 bg-gray-50 text-center">
          {ticket ? (
            <>
              <p className="font-semibold">{ticket.name}</p>
              <p>{ticket.ticketTypeName} × {ticket.quantity}</p>
              <p className="font-bold">₹{ticket.totalAmount}</p>
              <NextImage
                src={ticket.qrCode || "/placeholder.svg"}
                alt="QR Code"
                width={150}
                height={150}
                unoptimized
                className="mx-auto mt-4"
              />
            </>
          ) : (
            <p className="text-gray-500">No ticket yet. Click below to generate.</p>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <Button onClick={generateTicket} disabled={loading}>
            <QrCode className="w-4 h-4 mr-2" />
            {loading ? "Generating..." : "Generate Ticket"}
          </Button>

          <Button onClick={downloadTicket} disabled={!ticket} className="bg-green-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
