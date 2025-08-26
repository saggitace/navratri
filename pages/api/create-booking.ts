import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../lib/db"
import Razorpay from "razorpay"

const TOTAL_TICKETS = 2000

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { name, email, phone, address, ticketType, quantity } = req.body

  const ticketTypes: Record<string, number> = {
    Female: 1,
    Male: 499,
    Couple: 799,
    Family: 1299,
  }

  const ticketQty = Number(quantity)
  if (!ticketTypes[ticketType] || isNaN(ticketQty) || ticketQty < 1 || ticketQty > 10) {
    return res.status(400).json({ error: "Invalid booking details" })
  }

  const totalAmount = ticketTypes[ticketType] * ticketQty

  try {
    const { db, client } = await connectToDatabase()
    const ticketsCollection = db.collection<{ _id: string; count: number }>("tickets")
    const bookingsCollection = db.collection("bookings")

    const session = client.startSession()
    let bookingId: string = ""

    await session.withTransaction(async () => {
      // Check availability (optional, for user feedback)
      const soldCountDoc = await ticketsCollection.findOne({ _id: "soldCount" }, { session })
      const soldCount = soldCountDoc?.count || 0
      if (soldCount + ticketQty > TOTAL_TICKETS) {
        throw new Error(`Only ${TOTAL_TICKETS - soldCount} tickets remaining`)
      }

      // DO NOT increment sold count here!

      // Insert booking
      const bookingData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address.trim(),
        ticketType,
        quantity: ticketQty,
        totalAmount,
        status: "pending",
        paymentMethod: "razorpay",
        createdAt: new Date(),
      }

      const result = await bookingsCollection.insertOne(bookingData, { session })
      bookingId = result.insertedId.toString()
    })

    await session.endSession()

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount * 100, // in paise
      currency: "INR",
      receipt: bookingId!,
      notes: { bookingId: bookingId! },
    })

    return res.status(200).json({
      success: true,
      bookingId,
      orderId: order.id,
      amount: totalAmount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error("Booking creation error:", error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
