"use client"

import { useEffect } from "react"
import { toast } from "react-hot-toast"

export default function AlertProvider() {
  useEffect(() => {
    window.alert = (message: string, type: "success" | "error" | "info" = "info") => {
      switch (type) {
        case "success":
          toast.success(message, { duration: 3000 })
          break
        case "error":
          toast.error(message, { duration: 3000 })
          break
        default:
          toast(message, {
            duration: 3000,
            style: { background: "#333", color: "#fff" },
          })
      }
    }
  }, [])

  return null
}
