// Define all promo codes with discounts
export const PROMO_CODES: Record<string, number> = {
  AYUSH018: 4,  // 5% discount
  NAVRATRI05: 5, // 10% discount
  VBH05: 10, // 10% discount
  NEWYAMINIGIRL:10,
  MAA25: 15,
}

// Normalize and validate promo code
export function validatePromoCode(code?: string) {
  const normalized = (code || "").trim().toUpperCase()
  if (!normalized) {
    return { valid: false as const, code: "", discountPercent: 0 }
  }

  const discountPercent = PROMO_CODES[normalized]
  if (discountPercent) {
    return { valid: true as const, code: normalized, discountPercent }
  }

  return { valid: false as const, code: normalized, discountPercent: 0 }
}

// Calculate discount server-side and return final amount
export function applyPromo(totalAmount: number, code?: string) {
  const { valid, discountPercent, code: normalized } = validatePromoCode(code)

  if (!valid) {
    return {
      applied: false as const,
      code: "",
      discountPercent: 0,
      discountAmount: 0,
      finalAmount: totalAmount,
    }
  }

  // Round to nearest rupee
  const discountAmount = Math.max(0, Math.round((discountPercent / 100) * totalAmount))
  const finalAmount = Math.max(0, totalAmount - discountAmount)

  return {
    applied: true as const,
    code: normalized,
    discountPercent,
    discountAmount,
    finalAmount,
  }
}
