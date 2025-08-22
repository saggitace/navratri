"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Star,
  Phone,
  Mail,
  Crown,
  Music,
  Camera,
  Gift,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import milaanLogo from "../public/milaan-logo.jpg"
import dandiyabeats from "../public/Dandiya-beats.jpg"
import uniquegarden from "../public/Unique-garden.jpg"
const slides = [
  {
    id: 1,
    type: "cover",
    title: "Raas Ki Raat Sab Ke Saath",
    subtitle: "Dandiya Night 2025 – Patna",
    date: "28th September 2025 , Sunday , Shasthi | ⏰ 5:00 PM – 10:00 PM",
    venue: "Venue: Unique Garden Banquet Hall, Near Pillar No. 1, Bailey Road, Patna",
    organizer: "Organized by: Milaan Services",
  },
  {
    id: 2,
    type: "about",
    title: "About the Event",
    points: [
      "A grand Celebration of Culture, Dance & Music",
      "Open to Families, Students, Professionals & Creators",
      "Live Garba & Dandiya with Themed Décor",
      "Celebrity DJ Performance ",
      "Influencer Appearances & Reels Coverage",
    ],
  },
  {
    id: 3,
    type: "schedule",
    title: "Event Schedule",
    schedule: [
      // { date: "Sept 27", time: "6 PM–11 PM", highlight: "Inauguration + Traditional Garba" },
      { date: "Sept 28", time: "6 PM–11 PM", highlight: "Dandiya + Celebrity DJ Night" },
      // { date: "Sept 29", time: "6 PM–11 PM", highlight: "Competitions + Influencer Show + Prize Distribution" },
    ],
  },
  {
    id: 4,
    type: "attractions",
    title: "Main Attractions",
    attractions: [
      { icon: Music, text: "Celebrity DJ Night" },
      { icon: Users, text: "Influencer Meet & Greet Zone" },
      { icon: Crown, text: "Best Dressed Competition" },
      { icon: Star, text: "Dandiya Queen & King Title" },
      { icon: Gift, text: "Fun Zone (Spin the Wheel, Ring Toss, Couple Games)" },
      { icon: Camera, text: "Insta-Worthy Photo Corners" },
    ],
  },
  {
    id: 5,
    type: "food",
    title: "Food, Flea Market & Entertainment",
    features: [
      "Multi-cuisine Food Court",
      "Ethnic Handicrafts & Accessories Flea Market",
      "Kids Play Zone & Couple Corners",
      "Live Anchoring, Spot Games & Lucky Draws",
    ],
  },
  {
    id: 6,
    type: "audience",
    title: "Target Audience",
    audiences: [
      "College Students (Group Bookings)",
      "Working Professionals",
      "Family & Kids",
      "Fashion & Lifestyle Influencers",
      "Local Creators & Dancers",
    ],
  },
  {
  "id": 7,
  "type": "sponsorship-packages",
  "title": "Sponsorship Packages",
  "packages": [
    {
      "name": "Title Sponsor",
      "price": "₹2,50,000",
      "level": "premium",
      "benefits": {
        "Banner Branding (5 km)": "✅",
        "Pamphlet Circulation": "✅",
        "Stall Branding": "✅",
        "Individual Banners": "✅",
        "Print Media Branding": "✅",
        "Influencer Collaborations": "10+",
        "Social Media Promotions": "✅",
        "LED Billboard Ads": "✅",
        "Logo on Screen/Tickets": "✅",
        "Stall Access": "✅",
        "Stage Branding": "✅",
        "Media Coverage & PR": "✅",
        "VIP Tickets": "20"
      }
    },
    {
      "name": "Co-Presenting Sponsor",
      "price": "₹1,50,000",
      "level": "gold",
      "benefits": {
        "Banner Branding (2 km)": "✅",
        "Pamphlet Circulation": "✅",
        "Stall Branding": "✅",
        "Individual Banners": "❌",
        "Print Media Branding": "❌",
        "Influencer Collaborations": "10+",
        "Social Media Promotions": "✅",
        "LED Billboard Ads": "❌",
        "Logo on Screen/Tickets": "✅",
        "Stall Access": "✅",
        "Stage Branding": "✅",
        "Media Coverage & PR": "✅",
        "VIP Tickets": "10"
      }
    },
    {
      "name": "Associate Sponsor",
      "price": "₹75,000",
      "level": "silver",
      "benefits": {
        "Banner Branding ": "❌",
        "Pamphlet Circulation": "❌",
        "Stall Branding": "❌",
        "Individual Banners": "✅",
        "Print Media Branding": "✅",
        "Influencer Collaborations": "5+",
        "Social Media Promotions": "❌",
        "LED Billboard Ads": "✅",
        "Logo on Screen/Tickets": "✅",
        "Stall Access": "✅",
        "Stage Branding": "✅",
        "Media Coverage & PR": "❌",
        "VIP Tickets": "5"
      }
    }
  ]
}
,
  {
    id: 8,
    type: "sponsor",
    title: "Title Sponsor Benefits",
    benefits: [
      'Tagged as "Powered by [Brand Name]"',
      "5 Prime Location Hoardings (Exclusive)",
      "Center Stage Logo + VIP Area Branding",
      "8 VIP All-Access Passes",
      "Stage Appearance + Optional Speech",
      "Premium Stall Space",
      "10+ Social Media Posts/Reels Tagged",
    ],
  },
  {
    id: 9,
    type: "co-sponsor",
    title: "Co-Presenting Sponsor Benefits",
    benefits: [
      'Tagged as "Co-Presented by [Brand]"',
      "2 Hoardings in Key Patna Spots",
      "Stage-side Logo + Emcee Mentions",
      "5 VIP Passes + Stall Space",
      "Product Display/Sampling",
      "5+ Tagged Instagram/Facebook Posts",
    ],
  },
  {
    id: 10,
    type: "organizer",
    title: "Organizer Branding – Milaan Services",
    details: [
      "5 Branded Hoardings in Patna (Organizer)",
      "Logo on Posters, Stage, Tickets, and Gate",
      "Event planned, promoted, and executed by:",
      "Milaan Services – Experts in Events, Marketing & Branding",
    ],
  },
  {
    id: 11,
    type: "contact",
    title: "Contact & Bookings",
    contact: {
      phone: [{name: "Ankit", number: "+91 7370038276"}, {name: "Sanjeev", number: "+91 7488479814"}, {name: "Abhishek", number: "+91 9355477609"}],
      email: "servicesmilaan@gmail.com",
      location: "Venue: Unique Garden Banquet Hall, Near Pillar No. 1, Bailey Road, Patna",
    },
  },
]

export default function DandiyaPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Touch event handlers for swipe functionality
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide()
      } else if (e.key === "ArrowRight") {
        nextSlide()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Multi-layered Navratri Background */}
      <div className="absolute inset-0">
        {/* Base gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-600 via-purple-500 to-indigo-600 opacity-70"></div>

        {/* Goddess Durga Background - Main */}
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E2%80%94Pngtree%E2%80%94hindu%20goddess%20devi%20maa%20durga_17131809.png-5U7H61Wb2Gn6BfyCYlBVFqM1kUcfPf.jpeg"
            alt="Goddess Durga"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

         
        {/* Milaan Services Logo */}
<motion.div
  className="fixed bottom-4 right-4 z-50 mb-20 sm:mb-24" // space above bottom for both mobile & large
  animate={{
    scale: [1, 1.1, 1],
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut",
  }}
>
  <div className="bg-gradient-to-br from-yellow-50/40 via-white/30 to-yellow-100/20 backdrop-blur-md rounded-2xl p-2 sm:p-3 border border-yellow-400/50 shadow-xl">
    <Image
      src={milaanLogo}
      alt="Milaan Logo"
      width={60} // default for mobile
      height={45}
      className="rounded-lg shadow-lg sm:w-[100px] sm:h-[85px]" // larger on sm+
      priority
    />
  </div>
</motion.div>

  

       

        {/* Dancing Couple Background - Left Side */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1/3 h-2/3 opacity-20">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E2%80%94Pngtree%E2%80%94dandiya%20couple%20dancing%20in%20navratri_5498352-Rnd0vBpNKsCLW46lltpzTmU2LiWqzZ.png"
            alt="Dandiya Dancing Couple"
            fill
            className="object-contain object-left"
          />
        </div>

        {/* Garba Dancer Background - Right Side */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/3 h-2/3 opacity-20">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-transparent-dandiya-raas-thumbnail-FKIED8AqrXdz26EmbKK1iyLsHSIZb1.png"
            alt="Garba Dancer"
            fill
            className="object-contain object-right"
          />
        </div>

        {/* Durga Line Art - Top Corners */}
        <div className="absolute top-10 left-10 w-32 h-32 opacity-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-transparent-flower-line-art-kali-durga-navaratri-durga-puja-kadampuzha-devi-temple-dandiya-raas-parvati-thumbnail-GwYi6MQuqLSbGTWWyaQYsubsrxdVuX.png"
            alt="Durga Line Art"
            fill
            className="object-contain"
          />
        </div>
        <div className="absolute top-10 right-10 w-32 h-32 opacity-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/png-transparent-flower-line-art-kali-durga-navaratri-durga-puja-kadampuzha-devi-temple-dandiya-raas-parvati-thumbnail-GwYi6MQuqLSbGTWWyaQYsubsrxdVuX.png"
            alt="Durga Line Art"
            fill
            className="object-contain transform scale-x-[-1]"
          />
        </div>

        

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Animated Traditional Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Diyas */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`diya-${i}`}
            className="absolute"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 6 + i * 0.8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg shadow-yellow-500/60 relative">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mt-1.5"></div>
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-orange-300 rounded-full opacity-80"></div>
            </div>
          </motion.div>
        ))}

        {/* Floating Marigold Petals */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`petal-${i}`}
            className="absolute w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-70 shadow-sm"
            animate={{
              x: [0, 60, -40, 0],
              y: [0, -120, -60, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 0.8, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

        {/* Sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute text-yellow-300"
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header - Responsive */}
        <div className="flex justify-between items-center p-3 sm:p-4 lg:p-6 bg-black/30 backdrop-blur-sm">
          <motion.div
            className="flex items-center space-x-2 sm:space-x-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl">🪔</div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white drop-shadow-lg">Dandiya Night 2025</h1>
          </motion.div>
          <div className="text-white text-sm sm:text-base lg:text-lg bg-black/40 px-3 py-1 sm:px-4 sm:py-2 rounded-full backdrop-blur-sm border border-yellow-400/30">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        {/* Slide Content - Responsive with proper spacing for navigation */}
        <div className="flex-1 flex items-center justify-center p-3 sm:p-4 lg:p-6 pb-24 sm:pb-6 overflow-hidden">
          <div className="w-full max-w-7xl h-full flex items-center justify-center">
            <div className="w-full max-h-full overflow-y-auto scrollbar-hide">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-full"
                >
                  <SlideContent slide={slides[currentSlide]} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation - Fixed and Always Accessible */}
        <div className="relative z-20">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex justify-between items-center p-4 lg:p-6 bg-black/30 backdrop-blur-sm">
            <Button
              onClick={prevSlide}
              variant="outline"
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 border-yellow-400 text-white hover:from-orange-600 hover:to-red-600 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[120px]"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            {/* Slide Indicators */}
            <div className="flex space-x-2 lg:space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full border-2 border-orange-300 ${
                    index === currentSlide
                      ? "w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-yellow-400 to-orange-400 scale-125 shadow-lg shadow-yellow-400/50"
                      : "w-4 h-4 lg:w-5 lg:h-5 bg-white/60 hover:bg-white/80 hover:scale-110"
                  }`}
                >
                  {index === currentSlide && (
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-orange-600 rounded-full mx-auto mt-0.5 lg:mt-1"></div>
                  )}
                </button>
              ))}
            </div>

            <Button
              onClick={nextSlide}
              variant="outline"
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 border-yellow-400 text-white hover:from-orange-600 hover:to-red-600 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[120px]"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Mobile Navigation - Fixed at bottom with safe area */}
          <div className="sm:hidden">
            {/* Mobile Slide Indicators */}
            <div className="flex justify-center space-x-2 p-4 bg-black/30 backdrop-blur-sm">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full border border-orange-300 ${
                    index === currentSlide
                      ? "w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 scale-125 shadow-md shadow-yellow-400/50"
                      : "w-3 h-3 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Mobile Navigation Buttons - Always Accessible */}
      <div className="sm:hidden fixed bottom-4 left-0 right-0 z-[100] pointer-events-none">
        <div className="flex justify-between items-center px-4">
          <Button
            onClick={prevSlide}
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 border-2 border-yellow-400 text-white backdrop-blur-sm shadow-2xl rounded-full w-16 h-16 p-0 pointer-events-auto hover:scale-110 transition-all duration-300 hover:shadow-yellow-400/50"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-red-500 border-2 border-yellow-400 text-white backdrop-blur-sm shadow-2xl rounded-full w-16 h-16 p-0 pointer-events-auto hover:scale-110 transition-all duration-300 hover:shadow-yellow-400/50"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {/* Swipe Instruction for Mobile - Positioned to not interfere with buttons */}
      {/* <div className="sm:hidden fixed top-1/2 left-4 right-4 transform -translate-y-1/2 pointer-events-none z-20">
        <motion.div
          className="text-center text-white/70 text-sm bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 mx-auto max-w-xs"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          👈 Swipe left or right to navigate 👉
        </motion.div>
      </div> */}
    </div>
  )
}

function SlideContent({ slide }: { slide: any }) {
  switch (slide.type) {
    case "cover":
      return <CoverSlide slide={slide} />
    case "about":
      return <AboutSlide slide={slide} />
    case "schedule":
      return <ScheduleSlide slide={slide} />
    case "attractions":
      return <AttractionsSlide slide={slide} />
    case "food":
      return <FoodSlide slide={slide} />
    case "audience":
      return <AudienceSlide slide={slide} />
    case "sponsor":
      return <SponsorSlide slide={slide} />
    case "co-sponsor":
      return <CoSponsorSlide slide={slide} />
    case "organizer":
      return <OrganizerSlide slide={slide} />
    case "contact":
      return <ContactSlide slide={slide} />
    case "sponsorship-packages":
      return <SponsorshipPackagesSlide slide={slide} />
    default:
      return <div>Slide not found</div>
  }
}

function CoverSlide({ slide }: { slide: any }) {
  return (
    <div className="text-center text-white relative">
     {/* Dandiya beats logo */}
<motion.div
  className="fixed left-2 sm:left-6 lg:left-8 top-1/3 -translate-y-1/3 z-50"
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
>
  <div className="bg-gradient-to-br from-yellow-50/40 via-white/30 to-yellow-100/20 
                  backdrop-blur-md rounded-xl p-1 sm:p-2 lg:p-3 border border-yellow-400/50 shadow-xl">
    <Image
      src={dandiyabeats}
      alt="Dandiya Beats"
      width={40}
      height={30}
      className="rounded-lg shadow-lg w-[40px] h-[30px] sm:w-[120px] sm:h-[90px] lg:w-[200px] lg:h-[150px]"
      priority
    />
  </div>
</motion.div>

{/* Unique garden logo */}
<motion.div
  className="fixed right-2 sm:right-6 lg:right-8 top-1/3 -translate-y-1/3 z-50"
  animate={{ scale: [1, 1.1, 1] }}
  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
>
  <div className="bg-gradient-to-br from-yellow-50/40 via-white/30 to-yellow-100/20 
                  backdrop-blur-md rounded-xl p-1 sm:p-2 lg:p-3 border border-yellow-400/50 shadow-xl">
    <Image
      src={uniquegarden}
      alt="Unique Garden"
      width={50}
      height={35}
      className="rounded-lg shadow-lg w-[50px] h-[35px] sm:w-[140px] sm:h-[100px] lg:w-[220px] lg:h-[160px]"
      priority
    />
  </div>
</motion.div>



      <div className="relative z-10 bg-black/40 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 border border-yellow-400/30 shadow-2xl">

      
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex justify-center mb-4 lg:mb-6">
            <div className="text-4xl sm:text-6xl lg:text-8xl">Dandiya Beats</div>
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent drop-shadow-2xl leading-tight">
            {slide.title}
          </h3>
        </motion.div>

        

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-6 lg:mb-8 text-yellow-200 drop-shadow-lg">
            {slide.subtitle}
          </h2>
        </motion.div>

         


        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 lg:space-y-6"
        >
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-sm sm:text-lg lg:text-xl bg-orange-500/20 rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 backdrop-blur-sm border border-yellow-400/30">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-300" />
            <span className="font-semibold">{slide.date}</span>
            <div className="text-xl sm:text-2xl lg:text-3xl">📅</div>
          </div>

          <div className="flex items-center justify-center space-x-2 sm:space-x-4 text-sm sm:text-lg lg:text-xl bg-red-500/20 rounded-full px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 backdrop-blur-sm border border-yellow-400/30">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-yellow-300" />
            <span className="font-semibold">{slide.venue}</span>
            <div className="text-xl sm:text-2xl lg:text-3xl">🏛️</div>
          </div>

          <div className="text-sm sm:text-base lg:text-lg mt-6 lg:mt-8 bg-purple-500/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-sm border border-yellow-400/30">
            <span className="text-yellow-200 font-semibold">{slide.organizer}</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-3xl sm:text-4xl lg:text-6xl">💃🕺</div>
        </motion.div>
      </div>
    </div>
  )
}

function AboutSlide({ slide }: { slide: any }) {
  return (
    <div className="relative">
      <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white relative z-10 shadow-2xl">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <motion.div
            className="text-center mb-6 lg:mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🌟</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {slide.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {slide.points.map((point: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base lg:text-lg bg-orange-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-yellow-400/20"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <span className="font-medium">{point}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex justify-center mt-6 lg:mt-8 space-x-2 sm:space-x-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="text-2xl sm:text-3xl lg:text-4xl">🪔</div>
            <div className="text-2xl sm:text-3xl lg:text-4xl">🌺</div>
            <div className="text-2xl sm:text-3xl lg:text-4xl">🪔</div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

function ScheduleSlide({ slide }: { slide: any }) {
  return (
    <div className="relative">
      <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white relative z-10 shadow-2xl">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <motion.div
            className="text-center mb-6 lg:mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">📅</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {slide.title}
            </h2>
          </motion.div>

          <div className="space-y-4 lg:space-y-6">
            {slide.schedule.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.3 }}
                className="bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-yellow-400/30"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 items-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-300 flex items-center">
                    <div className="text-2xl sm:text-3xl lg:text-4xl mr-2 sm:mr-3">🗓️</div>
                    {item.date}
                  </div>
                  <div className="text-lg sm:text-xl font-semibold text-orange-200 flex items-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl mr-2 sm:mr-3">⏰</div>
                    {item.time}
                  </div>
                  <div className="sm:col-span-2 text-sm sm:text-base lg:text-lg font-medium text-white flex items-center">
                    <div className="text-xl sm:text-2xl lg:text-3xl mr-2 sm:mr-3">✨</div>
                    {item.highlight}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex justify-center mt-6 lg:mt-8"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full border-4 border-yellow-400 bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl">
              🥢
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

function AttractionsSlide({ slide }: { slide: any }) {
  return (
    <div className="relative">
      <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white relative z-10 shadow-2xl">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <motion.div
            className="text-center mb-6 lg:mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🧨</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {slide.title}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {slide.attractions.map((attraction: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-yellow-400/20 hover:scale-105 transition-transform"
              >
                <div className="text-center">
                  <div className="bg-yellow-400/20 rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <attraction.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-400" />
                  </div>
                  <span className="text-sm sm:text-base lg:text-lg font-semibold">{attraction.text}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="flex justify-center mt-6 lg:mt-8 space-x-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="text-3xl sm:text-4xl lg:text-5xl">💃</div>
            <div className="text-3xl sm:text-4xl lg:text-5xl">🕺</div>
            <div className="text-3xl sm:text-4xl lg:text-5xl">💃</div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

function FoodSlide({ slide }: { slide: any }) {
  return (
    <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white shadow-2xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <motion.div
          className="text-center mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🍲</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {slide.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {slide.features.map((feature: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-yellow-400/20 flex items-center space-x-3 sm:space-x-4"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex-shrink-0"></div>
              <span className="text-sm sm:text-base lg:text-lg font-medium">{feature}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex justify-center mt-6 lg:mt-8 space-x-2 sm:space-x-4"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl">🥘</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl">🍛</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl">🧁</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl">🥤</div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

function AudienceSlide({ slide }: { slide: any }) {
  return (
    <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white shadow-2xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <motion.div
          className="text-center mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🧑‍🤝‍🧑</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {slide.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {slide.audiences.map((audience: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-gradient-to-br from-orange-400/30 to-pink-500/30 rounded-xl p-4 sm:p-6 text-center backdrop-blur-sm border border-yellow-400/20 hover:scale-105 transition-transform"
            >
              <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-3 sm:mb-4 text-yellow-400" />
              <span className="text-sm sm:text-base lg:text-lg font-semibold">{audience}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const SponsorshipPackagesSlide = ({ slide }: { slide: any }) => {
  const getPackageIcon = (level: string) => {
    switch (level) {
      case "premium":
        return Crown
      case "gold":
        return Star
      case "silver":
        return Gift
      default:
        return Gift
    }
  }

  const getPackageGradient = (level: string) => {
    switch (level) {
      case "premium":
        return "from-yellow-500/20 to-orange-500/20"
      case "gold":
        return "from-orange-500/20 to-red-500/20"
      case "silver":
        return "from-purple-500/20 to-pink-500/20"
      default:
        return "from-blue-500/20 to-purple-500/20"
    }
  }

  return (
    <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white shadow-2xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <motion.div
          className="text-center mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">💰</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {slide.title}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {slide.packages.map((pkg: any, index: number) => {
            const IconComponent = getPackageIcon(pkg.level)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className={`bg-gradient-to-br ${getPackageGradient(
                  pkg.level,
                )} rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-yellow-400/20 hover:scale-105 transition-transform text-center`}
              >
                {/* Icon + Title */}
                <div className="bg-yellow-400/20 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-300 mb-3">{pkg.name}</h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{pkg.price}</div>
                <div className="text-sm sm:text-base text-gray-300 capitalize mb-4">{pkg.level} Package</div>

                {/* Benefits List */}
                <ul className="text-left space-y-2 text-sm sm:text-base">
                  {Object.entries(pkg.benefits).map(([benefit, value]: any, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center border-b border-white/10 pb-1"
                    >
                      <span className="text-gray-300">{benefit}</span>
                      <span className="font-bold text-lg">{value}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom Animated Icons */}
        <motion.div
          className="flex justify-center mt-6 lg:mt-8 space-x-2 sm:space-x-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl">💼</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl">🤝</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl">💰</div>
        </motion.div>
      </CardContent>
    </Card>
  )
}


function SponsorSlide({ slide }: { slide: any }) {
  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
      <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white shadow-2xl">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <motion.div
            className="text-center mb-6 lg:mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">💼</div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {slide.title}
            </h2>
          </motion.div>

          <div className="space-y-3 sm:space-y-4 pb-8">
            {slide.benefits.map((benefit: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base lg:text-lg bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-yellow-400/20"
              >
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CoSponsorSlide({ slide }: { slide: any }) {
  return (
    <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
      <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white shadow-2xl">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <motion.div
            className="text-center mb-6 lg:mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🤝</div>
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              {slide.title}
            </h2>
          </motion.div>

          <div className="space-y-3 sm:space-y-4 pb-8">
            {slide.benefits.map((benefit: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base lg:text-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-yellow-400/20"
              >
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OrganizerSlide({ slide }: { slide: any }) {
  return (
    <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white shadow-2xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        <motion.div
          className="text-center mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">🛠</div>
          <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {slide.title}
          </h2>
        </motion.div>

        <div className="space-y-4 sm:space-y-6">
          {slide.details.map((detail: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center space-x-3 sm:space-x-4 text-sm sm:text-base lg:text-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-yellow-400/20"
            >
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex-shrink-0"></div>
              <span className="font-medium">{detail}</span>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const ContactSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white shadow-2xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
       

        <motion.div
          className="text-center mb-6 lg:mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4">📞</div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            {slide.title}
          </h2>
        </motion.div>

        {/* Team Contacts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {slide.contact.phone.map((contact: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-yellow-400/20 hover:scale-105 transition-transform text-center"
            >
              <Phone className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-yellow-400" />
              <div className="text-lg sm:text-xl font-bold text-yellow-300 mb-2">{contact.name}</div>
              <div className="text-sm sm:text-base">
                <a href={`tel:${contact.number}`} className="hover:text-yellow-300 transition-colors">
                  📱 {contact.number}
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Email and Location */}
        <div className="space-y-4 lg:space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-yellow-400/20"
          >
            <Mail className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-yellow-400" />
            <div className="text-lg sm:text-xl lg:text-2xl font-semibold">
              <a href={`mailto:${slide.contact.email}`} className="hover:text-yellow-300 transition-colors">
                ✉ {slide.contact.email}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-yellow-400/20"
          >
            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-yellow-400" />
            <div className="text-lg sm:text-xl lg:text-2xl font-semibold">📍 {slide.contact.location}</div>
          </motion.div>

          {/* Social Media */}
         
        </div>

        <motion.div
          className="text-center mt-6 lg:mt-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-2xl sm:text-3xl lg:text-4xl mb-2">🙏</div>
          <div className="text-base sm:text-lg text-yellow-200 font-semibold">{"Jai Mata Di! 🌺"}</div>
        </motion.div>
      </CardContent>
    </Card>
  )
}
