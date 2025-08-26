"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Mail, Phone, MapPin, Calendar, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    ticketType: "Female",
    quantity: 1,
    totalAmount: 0,
  })

  const ticketTypes = [
    { id: "Female", name: "Female Entry", price: 1, description: "For individual female guests." },
    { id: "Male", name: "Male Entry", price: 499, description: "For individual male guests." },
    { id: "Couple", name: "Couple Entry", price: 799, description: "For one male and one female." },
    { id: "Family", name: "Family Package", price: 1299, description: "For families (up to 4 members including 1 children less than 10 years of Age)." },
  ]

  const selectedTicket = ticketTypes.find((t) => t.id === bookingData.ticketType)

  const updateBookingData = (field: string, value: string | number) => {
    const updated = { ...bookingData, [field]: value }
    if (field === "ticketType" || field === "quantity") {
      const ticket = ticketTypes.find((t) => t.id === updated.ticketType)
      updated.totalAmount = ticket ? ticket.price * updated.quantity : 0
    }
    setBookingData(updated)
  }

  // Step 3 -> create booking + Razorpay order
  const handleCreateBooking = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })
      const data = await res.json()
      if (data.success) {
        setPaymentData(data)
        setCurrentBookingId(data.bookingId) // Store bookingId for payment verification
        setStep(4) // payment step
      } else {
        alert(data.error)
      }
    } catch {
      console.log("Error creating booking");
      alert("Network error")
    }
    setIsSubmitting(false)
  }

  // Open Razorpay Checkout
  const handleRazorpayPayment = async () => {
    if (!paymentData || !currentBookingId) return
    const loaded = await loadRazorpayScript()
    if (!loaded) {
      alert("Failed to load Razorpay SDK. Please try again.")
      return
    }
    // @ts-ignore
    const rzp = new window.Razorpay({
      key: paymentData.key,
      amount: paymentData.amount * 100,
      currency: "INR",
      name: "Dandiya Night 2025",
      description: "Ticket Booking",
      order_id: paymentData.orderId,
      prefill: {
        name: bookingData.name,
        email: bookingData.email,
        contact: bookingData.phone,
      },
      theme: { color: "#F59E0B" },
      handler: async function (response: any) {
        try {
          // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
          setStep(5)
            //  startStatusPolling(currentBookingId);
        } catch (err) {
          console.error("Verification error", err)
          alert("Something went wrong while verifying payment")
        } finally {
          setTimeout(() => {
            onClose()
            resetModal()
          }, 2000)
        }
      },
    })
    rzp.open()
  }

  const resetModal = () => {
    setStep(1)
    setPaymentData(null)
    setCurrentBookingId(null)
    setBookingData({
      name: "",
      email: "",
      phone: "",
      address: "",
      ticketType: "Female",
      quantity: 1,
      totalAmount: 0,
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return bookingData.name && bookingData.email && bookingData.phone && bookingData.address
      case 2:
        return bookingData.ticketType && bookingData.quantity > 0
      case 3:
        return true
      default:
        return false
    }
  }

  function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-yellow-400/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ...steps 1,2,3 unchanged */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  🎫 Book Your Tickets
                </h2>
                <p className="text-yellow-200 mt-1">Dandiya Night 2025 - Patna</p>
              </div>
              <button
                onClick={onClose}
                className="bg-red-500/20 hover:bg-red-500/40 rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            {step <= 3 && (
              <div className="mb-8">
                <>
                  <div className="flex justify-between items-center mb-2">
                    {[1, 2, 3].map((stepNum) => (
                      <div
                        key={stepNum}
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                          step >= stepNum
                            ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-black"
                            : "bg-gray-600 text-gray-300"
                        }`}
                      >
                        {stepNum}
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((step - 1) / 2) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-1">
                    <span>Personal Info</span>
                    <span>Ticket Selection</span>
                    <span>Review</span>
                  </div>
                </>
              </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-white mb-4">👤 Personal Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-yellow-300 font-semibold mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={bookingData.name}
                        onChange={(e) => updateBookingData("name", e.target.value)}
                        className="w-full bg-black/40 border border-yellow-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-yellow-300 font-semibold mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => updateBookingData("email", e.target.value)}
                        className="w-full bg-black/40 border border-yellow-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-yellow-300 font-semibold mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => updateBookingData("phone", e.target.value)}
                        className="w-full bg-black/40 border border-yellow-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-yellow-300 font-semibold mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Address *
                      </label>
                      <textarea
                        value={bookingData.address}
                        onChange={(e) => updateBookingData("address", e.target.value)}
                        className="w-full bg-black/40 border border-yellow-400/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none h-20 resize-none"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-white mb-4">🎟 Select Your Tickets</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ticketTypes.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => updateBookingData("ticketType", ticket.id)}
                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                          bookingData.ticketType === ticket.id
                            ? "border-yellow-400 bg-yellow-400/10"
                            : "border-gray-600 bg-black/20 hover:border-yellow-400/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white">{ticket.name}</h4>
                          <span className="text-yellow-300 font-bold">₹{ticket.price}</span>
                        </div>
                        <p className="text-gray-300 text-sm">{ticket.description}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <label className="block text-yellow-300 font-semibold mb-2">
                      <Users className="w-4 h-4 inline mr-2" />
                      Number of Tickets
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => updateBookingData("quantity", Math.max(1, bookingData.quantity - 1))}
                        className="bg-red-500/20 hover:bg-red-500/40 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold"
                      >
                        -
                      </button>
                      <span className="text-2xl font-bold text-white w-12 text-center">{bookingData.quantity}</span>
                      <button
                        onClick={() => updateBookingData("quantity", Math.min(10, bookingData.quantity + 1))}
                        className="bg-green-500/20 hover:bg-green-500/40 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {selectedTicket && (
                    <div className="bg-black/40 rounded-xl p-4 border border-yellow-400/30">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold">{selectedTicket.name}</p>
                          <p className="text-gray-300 text-sm">Quantity: {bookingData.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-yellow-300 font-bold text-xl">₹{bookingData.totalAmount}</p>
                          <p className="text-gray-400 text-sm">Total Amount</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-4"
                >
                  <h3 className="text-xl font-bold text-white mb-4">📋 Booking Summary</h3>

                  <div className="bg-black/40 rounded-xl p-6 border border-yellow-400/30 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Name:</span>
                      <span className="text-white font-semibold">{bookingData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Email:</span>
                      <span className="text-white">{bookingData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Phone:</span>
                      <span className="text-white">{bookingData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Ticket Type:</span>
                      <span className="text-white">{selectedTicket?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Quantity:</span>
                      <span className="text-white">{bookingData.quantity}</span>
                    </div>
                    <hr className="border-gray-600" />
                    <div className="flex justify-between text-xl">
                      <span className="text-yellow-300 font-bold">Total Amount:</span>
                      <span className="text-yellow-300 font-bold">₹{bookingData.totalAmount}</span>
                    </div>
                  </div>

                  <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-300" />
                      <span className="text-blue-300 font-semibold">Event Details</span>
                    </div>
                    <p className="text-white">📅 September 28, 2025 | 5:00 PM – 10:00 PM</p>
                    <p className="text-white">📍 B.N. Club, Ramnagri Ashiyana, Patna</p>
                  </div>
                </motion.div>
              )}

            {step === 4 && paymentData && (
              <motion.div key="step4" className="space-y-6 text-center">
                <h3 className="text-2xl font-bold text-yellow-300">💳 Complete Payment</h3>
                <p className="text-white">Click the button below to pay securely with Razorpay.</p>
                <Button
                  onClick={handleRazorpayPayment}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white"
                >
                  Pay ₹{paymentData.amount} with Razorpay
                </Button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-green-400">🎉 Payment Successful!</h3>
                <p className="text-white">Your booking is confirmed. Check your email for ticket details.</p>
              </motion.div>
            )}
            </AnimatePresence>
            {/* Navigation Buttons */}
            {step <= 3 && (
              <div className="flex justify-between mt-8">
                <Button
                  onClick={prevStep}
                  disabled={step === 1}
                  variant="outline"
                  className="bg-gray-600/20 border-gray-500 text-white hover:bg-gray-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>

                {step < 3 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={handleCreateBooking}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Booking...</span>
                      </div>
                    ) : (
                      "Create Booking 🎫"
                    )}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
