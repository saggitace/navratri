import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" })
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username, role: "admin" }, JWT_SECRET, { expiresIn: "24h" })

    return res.status(200).json({
      success: true,
      token,
      message: "Login successful",
    })
  }

  return res.status(401).json({ error: "Invalid credentials" })
}
