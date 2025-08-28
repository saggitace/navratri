import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../../lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET! // store securely in .env

// Admin endpoint to get all bookings
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // 🔒 Verify JWT
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token missing" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }

    // Check admin role
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access only" })
    }

    // ✅ Authenticated as admin → fetch bookings
    const { db } = await connectToDatabase()
    const bookingsCollection = db.collection("bookings")
    const ticketsCollection = db.collection("tickets")

    const { status, page = 1, limit = 20 } = req.query

    // Build query
    const query: any = {}
    if (status && status !== "all") {
      query.status = status
    }

    // Pagination
    const skip = (Number.parseInt(page as string) - 1) * Number.parseInt(limit as string)
    const bookings = await bookingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit as string))
      .toArray()

    // Total count
    const totalBookings = await bookingsCollection.countDocuments(query)

    // Ticket stats
    const soldCountDoc = await ticketsCollection.findOne({ _id: "soldCount" as any })
    const soldCount = soldCountDoc ? soldCountDoc.count : 0

    // Status counts
    const statusCounts = await bookingsCollection
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
            totalQuantity: { $sum: "$quantity" },
          },
        },
      ])
      .toArray()

    return res.status(200).json({
      success: true,
      bookings,
      pagination: {
        currentPage: Number.parseInt(page as string),
        totalPages: Math.ceil(totalBookings / Number.parseInt(limit as string)),
        totalBookings,
        limit: Number.parseInt(limit as string),
      },
      statistics: {
        totalTicketsSold: soldCount,
        remainingTickets: 2000 - soldCount,
        statusCounts,
      },
    })
  } catch (error: any) {
    console.error("Admin bookings fetch error:", error)
    return res.status(401).json({
      success: false,
      error: error.message || "Invalid or expired token",
    })
  }
}
