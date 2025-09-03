import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../lib/db"
import Razorpay from "razorpay"
import { applyPromo } from "../../lib/promo"

const TOTAL_TICKETS = parseInt(process.env.TOTAL_TICKETS || "2000");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== "POST") {
    console.log("Method not allowed");
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { name, email, phone, address, ticketType, quantity,promoCode } = req.body

  // Server-side validation
  if (!name || !email || !phone || !address || !ticketType || !quantity) {
    return res.status(400).json({ error: "Missing required fields" })
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" })
  }

  // Phone validation (Indian mobile number)
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
  if (!phoneRegex.test(String(phone).replace(/\s+/g, ""))) {
    return res.status(400).json({ error: "Invalid phone number format" })
  }

  const ticketTypes: Record<string, number> = {
    Female: 399,
    Male: 499,
    Couple: 799,
    Family: 1299,
  }

  const ticketQty = Number(quantity)
  if (!ticketTypes[ticketType] || isNaN(ticketQty) || ticketQty < 1 || ticketQty > 10) {
    return res.status(400).json({ error: "Invalid booking details" })
  }

  const totalAmount = ticketTypes[ticketType] * ticketQty

  // Securely apply promo on server (never trust client)
  const promo = applyPromo(totalAmount, promoCode)
  const finalAmount = promo.finalAmount

  try {
    const { db, client } = await connectToDatabase()
    const ticketsCollection = db.collection<{ _id: string; count: number }>("tickets")
    const bookingsCollection = db.collection("bookings")

    const session = client.startSession()
    let bookingId: string = ""

    await session.withTransaction(async () => {
     
   

      // Insert booking
      const bookingData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        address: address.trim(),
        ticketType,
        quantity: ticketQty,
        totalAmount,
         finalAmount,
        originalAmount: totalAmount,
        discountAmount: promo.discountAmount,
        promoCode: promo.applied ? promoCode : null,
        status: "pending",
        paymentMethod: "razorpay",
        createdAt: new Date(),
         expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minute reservation
      }

      const result = await bookingsCollection.insertOne(bookingData, { session })
      bookingId = result.insertedId.toString()
    })

    await session.endSession()

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: finalAmount * 100, // in paise
      currency: "INR",
      receipt: bookingId!,
      notes: { bookingId: bookingId,
         promoCode: promo.applied ? promoCode : null
       },
    })

    return res.status(200).json({
      success: true,
      bookingId,
      orderId: order.id,
       amount: finalAmount, // Return final amount to frontend
      originalAmount: totalAmount, // Also return original amount for display
      discountAmount: promo.discountAmount,
      promoCodeApplied: promo.applied ? promoCode : null,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error: any) {
    console.error("Booking creation error:", error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
