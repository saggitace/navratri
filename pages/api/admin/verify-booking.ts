import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../../lib/db"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

// 🔒 Helper to check admin role
function verifyAdmin(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" })
    return null
  }

  const token = authHeader.split(" ")[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { role?: string }
    if (decoded.role !== "admin") {
      res.status(403).json({ error: "Forbidden: Admin access required" })
      return null
    }
    return decoded
  } catch (err) {
    res.status(401).json({ error: "Invalid token" })
    return null
  }
}

// Admin endpoint to manually verify and confirm bookings
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // 🔒 Check admin authentication
  const admin = verifyAdmin(req, res)
  if (!admin) return

  const { bookingId, action, adminNotes } = req.body

  if (!bookingId || !action) {
    return res.status(400).json({ error: "Booking ID and action are required" })
  }

  if (!["confirm", "reject"].includes(action)) {
    return res.status(400).json({ error: "Action must be 'confirm' or 'reject'" })
  }

  try {
    const { db } = await connectToDatabase()
    const bookingsCollection = db.collection("bookings")

    // Validate ObjectId
    if (!ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid booking ID format" })
    }

    const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) })

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" })
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ error: "Booking is not in pending status" })
    }

    const updateData = {
      status: action === "confirm" ? "confirmed" : "rejected",
      verifiedAt: new Date(),
      adminNotes: adminNotes || null,
    }

    // If rejecting, release the reserved tickets
    if (action === "reject") {
      const ticketsCollection = db.collection("tickets")
      await ticketsCollection.updateOne({ _id: "soldCount" as any}, { $inc: { count: -booking.quantity } })
    }

    const updateResult = await bookingsCollection.updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: updateData },
    )

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Booking not found" })
    }

    return res.status(200).json({
      success: true,
      message: `Booking ${action}ed successfully`,
      bookingId,
      status: updateData.status,
    })
  } catch (error: any) {
    console.error("Admin verification error:", error)
    return res.status(500).json({
      success: false,
      error: error.message || "Verification failed",
    })
  }
}
