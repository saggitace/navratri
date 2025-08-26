import jwt from "jsonwebtoken"
import type { NextApiRequest } from "next"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function verifyAdminToken(req: NextApiRequest): boolean {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return false
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    return decoded.role === "admin"
  } catch (error) {
    return false
  }
}
