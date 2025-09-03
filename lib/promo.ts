export const ACTIVE_PROMO_CODE = "NAVRATRI5"

// Normalize and validate promo code
export function validatePromoCode(code?: string) {
  const normalized = (code || "").trim().toUpperCase()
  if (!normalized) {
    return { valid: false as const, code: "", discountPercent: 0 }
  }

  // Single active code with 5% discount
  if (normalized === ACTIVE_PROMO_CODE) {
    return { valid: true as const, code: normalized, discountPercent: 5 }
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
