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
    console.error("Webhook secret not configured on server");
    return res.status(500).json({ error: "Webhook secret not configured on server" });
  }

  const signature = req.headers["x-razorpay-signature"] as string
      // console.log("Webhook signature:", signature);
  // Get raw body for signature verification
  const rawBody = await buffer(req)
  // console.log("Raw body:", rawBody.toString());
  
  // Verify webhook signature using the raw body
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)   
    .digest("hex")
        
    // console.log("Expected signature:", expectedSignature);
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

         if (booking.expiresAt < new Date()) {
          await bookings.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { status: "expired", expiredAt: new Date() } },
            { session }
          )
          throw new Error("Booking expired before payment confirmation")
        }

        // ✅ Increment sold tickets here
        const soldCountDoc = await ticketsCollection.findOneAndUpdate(
          { _id: "soldCount" },
          { $inc: { count: booking.quantity }, $setOnInsert: { _id: "soldCount"} },
          { upsert: true, returnDocument: "after", session }
        )

        const newSoldCount = soldCountDoc?.count || 0;

  // 2. Check if we've exceeded capacity
  if (newSoldCount > TOTAL_TICKETS) {
    throw new Error(`Sorry, all ${TOTAL_TICKETS} tickets have been sold out!`);
  }

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
      );

            });
      
      res.json({ status: "ok" })
    } catch (err) {
      // If any error occurs during processing, cancel the payment
       console.error("Error processing payment.captured:", err)
      res.status(500).json({ error: (err as Error).message })
      
      // // Also update booking status to failed
      // await bookings.updateOne(
      //   { _id: new ObjectId(bookingId) },
      //   { 
      //     $set: { 
      //       status: "failed", 
      //       failedAt: new Date(), 
      //       failReason: (err as Error).message 
      //     } 
      //   }
      // );
      
      res.status(500).json({ error: (err as Error).message })
    } finally {
      await session.endSession()
    }
    return
  }

 
// Add payment.failed handler to release reservations
  if (event.event === "payment.failed") {
    const bookingId = event.payload.payment.entity.notes?.bookingId
    if (bookingId && ObjectId.isValid(bookingId)) {
      await bookings.updateOne(
        { _id: new ObjectId(bookingId), status: "pending" },
        { $set: { status: "failed", failedAt: new Date() } }
      )
    }
    res.json({ status: "ok" })
    return
  }

  res.json({ status: "ignored" })
}