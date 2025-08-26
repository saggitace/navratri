import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"
import QRCode from "qrcode"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { bookingId } = req.query

  if (!bookingId || typeof bookingId !== "string") {
    return res.status(400).json({ error: "Valid Booking ID is required" })
  }

  try {
     const { db, client } = await connectToDatabase()
    const bookingsCollection = db.collection("bookings")

    // Validate ObjectId format
    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID format" })
    }

    const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({ error: "Booking is not confirmed yet" })
    }

    // Generate ticket verification QR code
    const ticketData = {
      bookingId: booking._id.toString(),
      name: booking.name,
      ticketType: booking.ticketType,
      quantity: booking.quantity,
      eventDate: "2025-09-28",
      venue: "B.N. Club, Ramnagri Ashiyana, Patna",
    }

    const qrCodeData = JSON.stringify(ticketData)
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })

    // Get ticket type name
    const ticketTypeNames = {
      Female: "Female Entry",
      Male: "Male Entry",
      Couple: "Couple Entry",
      Family: "Family Entry",
    }

    const ticketInfo = {
      bookingId: booking._id.toString(),
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      ticketType: booking.ticketType,
      ticketTypeName: ticketTypeNames[booking.ticketType as keyof typeof ticketTypeNames] || booking.ticketType,
      quantity: booking.quantity,
      totalAmount: booking.totalAmount,
      eventDate: "September 28, 2025",
      eventTime: "5:00 PM – 10:00 PM",
      venue: "B.N. Club, Ramnagri Ashiyana, Patna",
      qrCode: qrCodeDataURL,
      generatedAt: new Date().toISOString(),
    }

    return res.status(200).json({
      success: true,
      ticket: ticketInfo,
    })
  } catch (error: any) {
    console.error("Ticket generation error:", error)
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to generate ticket",
    })
  }
}
