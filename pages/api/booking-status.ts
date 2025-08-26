import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { bookingId } = req.query

  if (!bookingId || typeof bookingId !== "string") {
    return res.status(400).json({ error: "Valid Booking ID is required" })
  }

  try {
    const { db } = await connectToDatabase()
    const bookingsCollection = db.collection("bookings")

    // Validate ObjectId format
    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID format" })
    }

    const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    // Get ticket type name
    const ticketTypeNames = {
      Female: "Female Entry",
      Male: "Male Entry",
      Couple: "Couple Entry",
      Family: "Family Entry",
    }

    return res.status(200).json({
      success: true,
      booking: {
        id: booking._id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        ticketType: booking.ticketType,
        ticketTypeName: ticketTypeNames[booking.ticketType as keyof typeof ticketTypeNames] || booking.ticketType,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        status: booking.status,
        createdAt: booking.createdAt,
        expiresAt: booking.expiresAt,
        transactionId: booking.transactionId || null,
        paymentSubmittedAt: booking.paymentSubmittedAt || null,
        paymentMethod: booking.paymentMethod,
      },
    })
  } catch (error: any) {
    console.error("Booking status fetch error:", error)
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch booking status",
    })
  }
}
