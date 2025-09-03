// global.d.ts
export {}

declare global {
  interface RazorpayOptions {
    key: string
    amount: number
    currency: string
    name: string
    description: string
    order_id: string
    prefill: {
      name: string
      email: string
      contact: string
    }
    notes?: Record<string, string>
    theme?: { color?: string }
    handler: (response: any) => void
  }

  interface RazorpayInstance {
    open: () => void
  }

  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
    alert: (message: string, type?: "success" | "error" | "info") => void
  }
}
