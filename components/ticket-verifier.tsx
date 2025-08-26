"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { QrCode, Check, X, User, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TicketVerifierProps {
  adminToken: string
}

export function TicketVerifier({ adminToken }: TicketVerifierProps) {
  const [qrData, setQrData] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const verifyTicket = async () => {
    if (!qrData.trim()) {
      setError("Please enter QR code data")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/admin/verify-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ qrData: qrData.trim() }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
        setQrData("") // Clear input after successful verification
      } else {
        setError(data.error || "Verification failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    }

    setLoading(false)
  }

  const clearResult = () => {
    setResult(null)
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 p-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-yellow-400/40 shadow-2xl"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              🎫 Ticket Verifier
            </h1>
            <p className="text-yellow-200 mt-2">Scan or enter QR code data to verify tickets</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-yellow-300 font-semibold mb-2">
                <QrCode className="w-4 h-4 inline mr-2" />
                QR Code Data
              </label>
              <textarea
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                className="w-full bg-black/40 border border-yellow-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none h-32 resize-none"
                placeholder="Paste QR code data here or scan QR code..."
              />
            </div>

            <Button
              onClick={verifyTicket}
              disabled={loading || !qrData.trim()}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </div>
              ) : (
                <>
                  <QrCode className="w-4 h-4 mr-2" />
                  Verify Ticket
                </>
              )}
            </Button>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/20 border border-red-400/30 rounded-xl p-6 text-center"
              >
                <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-400 mb-2">Verification Failed</h3>
                <p className="text-red-300">{error}</p>
                <Button
                  onClick={clearResult}
                  className="mt-4 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-400/30"
                >
                  Try Again
                </Button>
              </motion.div>
            )}

            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 border border-green-400/30 rounded-xl p-6"
              >
                <div className="text-center mb-6">
                  <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-400 mb-2">✅ Ticket Verified!</h3>
                  <p className="text-green-300">{result.message}</p>
                </div>

                <div className="bg-black/20 rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Name:</span>
                    <span className="text-white font-semibold">{result.ticketInfo.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <QrCode className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Type:</span>
                    <span className="text-white">{result.ticketInfo.ticketType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Quantity:</span>
                    <span className="text-white font-bold">{result.ticketInfo.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300">Verified At:</span>
                    <span className="text-white">{new Date(result.ticketInfo.verifiedAt).toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  onClick={clearResult}
                  className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                >
                  Verify Another Ticket
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
