import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../../lib/db"

// Admin endpoint to get all bookings
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  // In production, add proper admin authentication here

  try {
    const { db } = await connectToDatabase()
    const bookingsCollection = db.collection("bookings")
    const ticketsCollection = db.collection("tickets")

    const { status, page = 1, limit = 20 } = req.query

    // Build query
    const query: any = {}
    if (status && status !== "all") {
      query.status = status
    }

    // Get bookings with pagination
    const skip = (Number.parseInt(page as string) - 1) * Number.parseInt(limit as string)
    const bookings = await bookingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit as string))
      .toArray()

    // Get total count
    const totalBookings = await bookingsCollection.countDocuments(query)
 
//     interface soldCountDoc {
//   _id: string;
//   count: number;
// }

    // Get ticket statistics
    const soldCountDoc = await ticketsCollection.findOne({ _id: "soldCount" as any })

    const soldCount = soldCountDoc ? soldCountDoc.count : 0

    // Get status counts
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
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch bookings",
    })
  }
}
