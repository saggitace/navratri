// pages/api/cleanup-expired-bookings.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Secure with CRON_SECRET
  const authHeader = req.headers.authorization;
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  if (!authHeader || authHeader !== expectedAuth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const { db } = await connectToDatabase();
    const bookings = db.collection("bookings");

    // Expire stale bookings (past expiresAt, still pending)
    const result = await bookings.updateMany(
      { status: "pending", expiresAt: { $lt: new Date() } },
      { $set: { status: "expired", expiredAt: new Date() } }
    );

    res.json({
      success: true,
      message: `Cleanup completed: ${result.modifiedCount} bookings expired`,
    });
  } catch (error) {
    console.error("Cleanup error:", error);
    res.status(500).json({ error: "Cleanup failed" });
  }
}
