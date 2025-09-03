import type { NextApiRequest, NextApiResponse } from "next"
import { applyPromo, validatePromoCode } from "../../lib/promo"

// This endpoint is for UI preview only.
// The FINAL discount is always applied in /api/create-booking on the server.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { promoCode, totalAmount } = req.body as { promoCode?: string; totalAmount?: number }

    if (typeof totalAmount !== "number" || totalAmount < 0) {
      return res.status(400).json({ error: "Invalid total amount" })
    }

    const result = applyPromo(totalAmount, promoCode)
    const validation = validatePromoCode(promoCode)

    return res.status(200).json({
      success: true,
      valid: validation.valid,
      discountPercent: result.applied ? result.discountPercent : 0,
      discountAmount: result.discountAmount,
      finalAmount: result.finalAmount,
      code: result.applied ? result.code : "",
    })
  } catch (error: any) {
    console.error("Validate promo error:", error)
    return res.status(500).json({ error: "Failed to validate promo code" })
  }
}
