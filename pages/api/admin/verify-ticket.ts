import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../../lib/db"
import { verifyAdminToken } from "../../../lib/auth"
import { ObjectId } from "mongodb"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // Verify admin authentication
  if (!verifyAdminToken(req)) {
    return res.status(401).json({ error: "Unauthorized. Admin access required." })
  }

  const { qrData } = req.body

  if (!qrData) {
    return res.status(400).json({ error: "QR data is required" })
  }

  try {
    // Parse QR code data
    let ticketData
    try {
      ticketData = JSON.parse(qrData)
    } catch {
      return res.status(400).json({ error: "Invalid QR code format" })
    }

    const { bookingId } = ticketData

    if (!bookingId || !ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID in QR code" })
    }

     const { db, client } = await connectToDatabase()
    const bookingsCollection = db.collection("bookings")
    const verifiedTicketsCollection = db.collection("verified_tickets")

    // Check if ticket already verified (used)
    const alreadyVerified = await verifiedTicketsCollection.findOne({ bookingId })
    if (alreadyVerified) {
      return res.status(400).json({
        error: "Ticket already used",
        verifiedAt: alreadyVerified.verifiedAt,
        verifiedBy: alreadyVerified.verifiedBy,
      })
    }

    // Find the booking
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({ error: "Booking is not confirmed" })
    }

    // Verify ticket data matches booking
    if (
      ticketData.name !== booking.name ||
      ticketData.ticketType !== booking.ticketType ||
      ticketData.quantity !== booking.quantity
    ) {
      return res.status(400).json({ error: "Ticket data mismatch" })
    }

    // Mark ticket as verified and remove booking details for security
    const session = client.startSession()

    try {
      await session.withTransaction(async () => {
        // Add to verified tickets collection
        await verifiedTicketsCollection.insertOne(
          {
            bookingId,
            name: booking.name,
            ticketType: booking.ticketType,
            quantity: booking.quantity,
            originalAmount: booking.totalAmount,
            verifiedAt: new Date(),
            verifiedBy: "admin", // In production, get from JWT token
            eventDate: "2025-09-28",
          },
          { session },
        )

        // Remove sensitive booking details but keep basic record
        await bookingsCollection.updateOne(
          { _id: new ObjectId(bookingId) },
          {
            $unset: {
              email: "",
              phone: "",
              address: "",
              paymentId: "",
              transactionId: "",
            },
            $set: {
              status: "used",
              usedAt: new Date(),
            },
          },
          { session },
        )
      })
    } finally {
      await session.endSession()
    }

    // Get ticket type name for response
    const ticketTypeNames = {
      Female: "Female Entry",
      Male: "Male Entry",
      Couple: "Couple Entry",
      Family: "Family Entry",
    }

    return res.status(200).json({
      success: true,
      message: "Ticket verified successfully",
      ticketInfo: {
        name: booking.name,
        ticketType: ticketTypeNames[booking.ticketType as keyof typeof ticketTypeNames] || booking.ticketType,
        quantity: booking.quantity,
        verifiedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error("Ticket verification error:", error)
    return res.status(500).json({
      success: false,
      error: error.message || "Ticket verification failed",
    })
  }
}
