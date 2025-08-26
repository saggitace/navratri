// pages/api/razorpay-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next"
import crypto from "crypto"
import { connectToDatabase } from "../../lib/db"
import { ObjectId } from "mongodb"

const TOTAL_TICKETS = 2000

export const config = {
  api: {
    bodyParser: false, // Needed to get raw body for signature verification
  },
}

function buffer(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => resolve(Buffer.concat(chunks)))
    req.on("error", reject)
  })
}

// Function to cancel payment through Razorpay API
async function cancelPayment(paymentId: string) {
  try {
    const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(
          process.env.RAZORPAY_KEY_ID + ':' + process.env.RAZORPAY_KEY_SECRET
        ).toString('base64')
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to cancel payment:', errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error canceling payment:', error);
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return res.status(500).json({ error: "Webhook secret not configured on server" });
  }

  const signature = req.headers["x-razorpay-signature"] as string

  // Get raw body for signature verification
  const rawBody = await buffer(req)
  
  // Verify webhook signature using the raw body
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody.toString())
    .digest("hex")

  if (expectedSignature !== signature) {
    console.error("Webhook signature verification failed");
    return res.status(400).json({ error: "Invalid signature" })
  }

  // Parse the event from raw body
  let event: any
  try {
    event = JSON.parse(rawBody.toString())
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" })
  }

  const { db, client } = await connectToDatabase()
  const bookings = db.collection("bookings")
  const ticketsCollection = db.collection<{ _id: string; count: number }>("tickets")

  if (event.event === "payment.captured") {
    const paymentId = event.payload.payment.entity.id;
    const bookingId = event.payload.payment.entity.notes?.bookingId;
    
    if (!bookingId || !ObjectId.isValid(bookingId)) {
      // Try to cancel the payment since booking ID is invalid
      await cancelPayment(paymentId);
      return res.status(400).json({ error: "Invalid bookingId" })
    }

    const session = client.startSession()
    try {
      await session.withTransaction(async () => {
        // Find the booking and ensure it's still pending
        const booking = await bookings.findOne(
          { _id: new ObjectId(bookingId), status: "pending" },
          { session }
        )
        if (!booking) {
          // Booking not found or already processed, cancel payment
          await cancelPayment(paymentId);
          throw new Error("Booking not found or already confirmed/cancelled")
        }

        // Check ticket availability
        const soldCountDoc = await ticketsCollection.findOne({ _id: "soldCount" }, { session })
        const soldCount = soldCountDoc?.count || 0
        const ticketQty = booking.quantity || 1
        
        if (soldCount + ticketQty > TOTAL_TICKETS) {
          // Mark booking as failed and cancel payment
          await bookings.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { status: "failed", failedAt: new Date(), failReason: "Sold out" } },
            { session }
          );
          
          await cancelPayment(paymentId);
          throw new Error(`Not enough tickets available. Only ${TOTAL_TICKETS - soldCount} left.`)
        }

        // Confirm the booking
        await bookings.updateOne(
          { _id: new ObjectId(bookingId) },
          {
            $set: {
              status: "confirmed",
              paymentId: paymentId,
              verifiedAt: new Date(),
            },
          },
          { session }
        )

        // Increment sold count by the quantity booked
        await ticketsCollection.updateOne(
          { _id: "soldCount" },
          { $inc: { count: ticketQty } },
          { upsert: true, session }
        )
      })
      
      res.json({ status: "ok" })
    } catch (err) {
      // If any error occurs during processing, cancel the payment
      await cancelPayment(paymentId);
      
      // Also update booking status to failed
      await bookings.updateOne(
        { _id: new ObjectId(bookingId) },
        { 
          $set: { 
            status: "failed", 
            failedAt: new Date(), 
            failReason: (err as Error).message 
          } 
        }
      );
      
      res.status(500).json({ error: (err as Error).message })
    } finally {
      await session.endSession()
    }
    return
  }

  // For other events, just return ok
  res.json({ status: "ignored" })
}