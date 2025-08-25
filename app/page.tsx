"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Users,
  Star,
  Crown,
  Music,
  Camera,
  Gift,
  Menu,
  X,
  Play,
  ChevronLeft,
  ChevronRight,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

function ArtistVideoCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [playingVideos, setPlayingVideos] = useState<{ [key: number]: boolean }>({})
  const [mutedVideos, setMutedVideos] = useState<{ [key: number]: boolean }>({})
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const artists = [
    {
      id: 1,
      name: "R Maan",
      role: "Singer",
      videoUrl: "/artist-videos/System Pe System _ R Maan.mp4",
      thumbnail: "/artist-thumbnails/R_maan.jpg",
      description:
        "R. Maan is a star in Indian Pop and Haryanvi music, loved for his vibrant melodies and energetic performances",
      speciality: "Haryanvi & Electronic Beats",
      social: { instagram: "@its_rmaan", followers: "275M" },
      duration: "3:03",
    },
    {
      id: 2,
      name: "Shiva Choudhary",
      role: "Singer",
      videoUrl: "/artist-videos/Jale 2_shiva.mp4",
      thumbnail: "/artist-thumbnails/shiva chaudry.jpg",
      description: "Professional Singer known for her hit tracks in Haryanvi music",
      speciality: "Haryanvi & Electronic Beats",
      social: { instagram: "@shivachoudharyofficial", followers: "537M" },
      duration: "3:07",
    },
    {
      id: 3,
      name: "Jassi Karikot",
      role: "Singer",
      videoUrl: "/artist-videos/THAR_jassiKarikot.mp4",
      thumbnail: "/artist-thumbnails/jassi kirakot.jpg",
      description: "Singer known for his powerful voice and emotive performances",
      speciality: "Haryanvi & Electronic Beats",
      social: { instagram: "@jassikirakot", followers: "89M" },
      duration: "2:43",
    },
    {
      id: 4,
      name: "Sukh Deswal",
      role: "Singer",
      videoUrl: "/artist-videos/CHAI CHURMA_ Sukh Deswal.mp4",
      thumbnail: "/artist-thumbnails/sukh deswal.jpg",
      description: "Enthusiastic Singer known for his vibrant performances",
      speciality: "Haryanvi & Electronic Beats",
      social: { instagram: "@sukhdeswal", followers: "1.2M" },
      duration: "3:10",
    },
    {
      id: 5,
      name: "Deepty",
      role: "Singer",
      videoUrl: "/artist-videos/DAMRU ALA _ Deepty.mp4",
      thumbnail: "/artist-thumbnails/deepty.jpg",
      description: "Talented Singer and Music Producer known for his unique sound",
      speciality: "Haryanvi & Electronic Beats",
      social: { instagram: "@amitmusician", followers: "161M" },
      duration: "3:36",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(artists.length / 3))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(artists.length / 3)) % Math.ceil(artists.length / 3))
  }

  const toggleVideo = (artistId: number) => {
    setPlayingVideos((prev) => ({
      ...prev,
      [artistId]: !prev[artistId],
    }))
  }

  const toggleMute = (artistId: number) => {
    setMutedVideos((prev) => ({
      ...prev,
      [artistId]: !prev[artistId],
    }))
  }

  const getVisibleArtists = () => {
   

    if (isMobile) {
      return artists
    }

    const startIndex = currentSlide * 3
    return artists.slice(startIndex, startIndex + 3)
  }

  // Show navigation only if more than 5 artists and not on mobile
  const showNavigation = artists.length > 3 && !isMobile

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div className="overflow-hidden">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {getVisibleArtists().map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-yellow-400/20 hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              {/* Video Container */}
              <div className="relative h-64 overflow-hidden group">
                {!playingVideos[artist.id] ? (
                  // Video Thumbnail with Play Button
                  <div className="relative w-full h-full">
                    <Image
                      src={artist.thumbnail || "/placeholder.svg"}
                      alt={`${artist.name} Performance`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

                    {/* Play Button Overlay */}
                    <button
                      onClick={() => toggleVideo(artist.id)}
                      className="absolute inset-0 flex items-center justify-center group-hover:bg-black/20 transition-all duration-300"
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <Play className="w-12 h-12 text-white ml-1" />
                      </div>
                    </button>

                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                      ⏱️ {artist.duration}
                    </div>

                    {/* Social Badge */}
                    <div className="absolute top-4 right-4 bg-pink-500/80 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                      📱 {artist.social.followers}
                    </div>
                  </div>
                ) : (
                  // Video Player
                  <div className="relative w-full h-full">
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted={mutedVideos[artist.id]}
                      poster={artist.thumbnail}
                    >
                      <source src={artist.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>

                    {/* Video Controls Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                        <button
                          onClick={() => toggleVideo(artist.id)}
                          className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-300"
                        >
                          <Pause className="w-5 h-5 text-white" />
                        </button>

                        <button
                          onClick={() => toggleMute(artist.id)}
                          className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-all duration-300"
                        >
                          {mutedVideos[artist.id] ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Live Indicator */}
                    <div className="absolute top-4 left-4 bg-red-500 rounded-full px-3 py-1 text-white text-sm font-semibold flex items-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span>LIVE</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Artist Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-yellow-300 mb-1">{artist.name}</h3>
                  <p className="text-orange-200 font-semibold text-lg">{artist.role}</p>
                </div>

                <p className="text-gray-300 mb-4 text-sm leading-relaxed">{artist.description}</p>

                <div className="mb-4">
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg p-3 border border-yellow-400/20">
                    <div className="text-yellow-400 font-semibold text-sm mb-1">Speciality:</div>
                    <div className="text-white text-sm">{artist.speciality}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">📷</span>
                    </div>
                    <span className="text-gray-300 text-sm">{artist.social.instagram}</span>
                  </div>

                  {/* Video Action Button */}
                  <button
                    onClick={() => toggleVideo(artist.id)}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                  >
                    {playingVideos[artist.id] ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Watch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Conditional Navigation Buttons - Only show if more than 5 artists and not mobile */}
      {showNavigation && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <Button
            onClick={prevSlide}
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-yellow-400/50 text-white hover:from-orange-500/40 hover:to-red-500/40 backdrop-blur-sm rounded-full w-12 h-12 p-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(artists.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlide
                    ? "w-8 h-3 bg-gradient-to-r from-yellow-400 to-orange-400"
                    : "w-3 h-3 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            variant="outline"
            size="lg"
            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-yellow-400/50 text-white hover:from-orange-500/40 hover:to-red-500/40 backdrop-blur-sm rounded-full w-12 h-12 p-0"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  )
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Event date: September 28, 2025, 5:00 PM
    const eventDate = new Date("2025-09-28T17:00:00").getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = eventDate - now

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24))
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)

        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(timer)
      }
      }, 1000)
  
      // Cleanup interval on unmount
      return () => clearInterval(timer)
    }, [])
  
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border-2 border-yellow-400/40 shadow-2xl mb-8"
      >
        {/* Countdown Header */}
        <motion.div
          className="text-center mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="text-4xl sm:text-5xl mb-2">⏰</div>
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
            Event Starts In
          </h3>
          <p className="text-yellow-200 text-lg mt-2">Don't miss the celebration!</p>
        </motion.div>

        {/* Countdown Display */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: "Days", value: timeLeft.days, icon: "📅" },
            { label: "Hours", value: timeLeft.hours, icon: "⏰" },
            { label: "Minutes", value: timeLeft.minutes, icon: "⏱️" },
            { label: "Seconds", value: timeLeft.seconds, icon: "⚡" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-yellow-400/30 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className="text-2xl sm:text-3xl mb-2">{item.icon}</div>
              <motion.div
                key={item.value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2"
              >
                {item.value.toString().padStart(2, "0")}
              </motion.div>
              <div className="text-yellow-300 font-semibold text-sm sm:text-base uppercase tracking-wider">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative Elements */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="text-2xl"
          >
            🎪
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="text-yellow-300 font-bold text-lg"
          >
            Get Ready to Dance!
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="text-2xl"
          >
            💃
          </motion.div>
        </div>

        {/* Urgency Message */}
        {timeLeft.days <= 7 && timeLeft.days > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 bg-red-500/20 rounded-full px-4 py-2 border border-red-400/30"
          >
            <span className="text-red-300 font-bold text-sm">🔥 Only {timeLeft.days} days left! Book now! 🔥</span>
          </motion.div>
        )}

        {timeLeft.days === 0 && timeLeft.hours <= 12 && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
            className="text-center mt-4 bg-red-500/30 rounded-full px-4 py-2 border border-red-400/50"
          >
            <span className="text-red-200 font-bold">🚨 EVENT STARTING SOON! 🚨</span>
          </motion.div>
        )}
      </motion.div>
    )
}

export default function NavratriWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-600 via-purple-500 to-indigo-600 opacity-70"></div>

        {/* Goddess Durga Background */}
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%E2%80%94Pngtree%E2%80%94hindu%20goddess%20devi%20maa%20durga_17131809.png-5U7H61Wb2Gn6BfyCYlBVFqM1kUcfPf.jpeg"
            alt="Goddess Durga"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Floating Diyas */}
        {[...Array(8)].map((_, i) => (
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
            <div className="w-4 h-4 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg shadow-yellow-500/60"></div>
          </motion.div>
        ))}

        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 bg-black/30 backdrop-blur-md border-b border-yellow-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🪔</div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Dandiya Night 2025</h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {["home", "artists", "about", "schedule", "attractions", "sponsors", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="text-white hover:text-yellow-300 transition-colors capitalize font-medium"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-black/50 backdrop-blur-md rounded-lg p-4 mb-4"
            >
              {["home", "artists", "about", "schedule", "attractions", "sponsors", "contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left text-white hover:text-yellow-300 transition-colors capitalize font-medium py-2"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Enhanced Dandiya Beats Branding */}
          <div className="flex justify-center items-center mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative group"
            >
              {/* Elegant Container with Premium Design */}
              <div className="relative bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-red-400/20 backdrop-blur-xl rounded-3xl p-8 border-2 border-yellow-400/40 shadow-2xl hover:shadow-yellow-400/30 transition-all duration-500">
                {/* Decorative Corner Elements */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                <div
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                ></div>

                {/* Premium Title */}
                <motion.div
                  className="mb-4"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent mb-2">
                    🎵 PROUDLY PRESENTS 🎵
                  </h3>
                </motion.div>

                {/* Logo Container with Enhanced Effects */}
                <div className="relative">
                  {/* Glow Effect Behind Logo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-red-400/30 rounded-2xl blur-xl animate-pulse"></div>

                  {/* Logo */}
                  <motion.div
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-yellow-400/50"
                  >
                    <Image
                      src="/Dandiya-beats.jpg"
                      alt="Dandiya Beats"
                      width={380}
                      height={120}
                      className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  </motion.div>
                </div>

                {/* Elegant Subtitle */}
                {/* <motion.div
                  className="mt-4"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <p className="text-lg font-semibold text-yellow-200 tracking-wider">✨ Official Music Partner ✨</p>
                </motion.div> */}

                {/* Floating Musical Notes */}
                <div className="absolute top-4 left-4 text-yellow-400 animate-bounce">🎵</div>
                <div
                  className="absolute top-8 right-6 text-orange-400 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                >
                  🎶
                </div>
                <div className="absolute bottom-6 left-8 text-red-400 animate-bounce" style={{ animationDelay: "1s" }}>
                  🎼
                </div>
                <div
                  className="absolute bottom-4 right-4 text-pink-400 animate-bounce"
                  style={{ animationDelay: "1.5s" }}
                >
                  🎤
                </div>
              </div>

              {/* Premium Border Animation */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 opacity-20 animate-pulse -z-10 blur-sm"></div>
            </motion.div>
          </div>

          {/* Countdown Timer */}
          <CountdownTimer />

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/50 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border border-yellow-400/30 shadow-2xl"
          >
            <div className="text-6xl sm:text-8xl mb-6">🪔</div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
              Raas Ki Raat Sab Ke Saath
            </h1>
            <h2 className="text-2xl sm:text-4xl font-semibold mb-8 text-yellow-200">Dandiya Night 2025 – Patna</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-3 bg-orange-500/20 rounded-full px-6 py-4 backdrop-blur-sm border border-yellow-400/30">
                <Calendar className="w-6 h-6 text-yellow-300" />
                <span className="font-semibold text-white">September 28, 2025 | 5:00 PM – 10:00 PM</span>
              </div>
              <div className="flex items-center justify-center space-x-3 bg-red-500/20 rounded-full px-6 py-4 backdrop-blur-sm border border-yellow-400/30">
                <MapPin className="w-6 h-6 text-yellow-300" />
                <span className="font-semibold text-white"> Venue: B.N. Club, Ramnagri Ashiyana, Patna</span>
              </div>
            </div>

            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Book Your Tickets Now! 🎫
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Promotional Video Section - AUTOPLAY */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Experience the Magic ✨</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-black/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-yellow-400/30 shadow-2xl"
          >
            <div className="aspect-video relative">
              {/* Autoplay Video - No Play/Pause Controls */}
              <video
                className="w-full h-full object-cover rounded-2xl"
                autoPlay
                loop
                muted
                playsInline
                poster="/navratri-video-poster.png"
              >
                <source src="/navratri-promotional-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Decorative Elements */}
              <div className="absolute top-6 left-6 text-4xl animate-bounce">🪔</div>
              <div className="absolute top-20 left-8 text-2xl animate-pulse">✨</div>
              <div className="absolute top-6 left-20 text-3xl animate-spin" style={{ animationDuration: "3s" }}>
                🌟
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Artists Video Section */}
      <section id="artists" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-6xl mb-6">🎬</div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-4">
              Featured Artists
            </h2>
            <p className="text-xl text-yellow-200">Watch exclusive performances from our talented artists</p>
          </motion.div>

          <ArtistVideoCarousel />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-6xl mb-6">🌟</div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-6">
              About the Event
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "A grand Celebration of Culture, Dance & Music",
              "Open to Families, Students, Professionals & Creators",
              "Live Garba & Dandiya with Themed Décor",
              "Celebrity DJ Performance",
              "Influencer Appearances & Reels Coverage",
            ].map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/20 hover:scale-105 transition-transform"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-medium text-lg">{point}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-6xl mb-6">📅</div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Event Schedule
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black/50 backdrop-blur-lg rounded-2xl p-8 border border-yellow-400/30 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center text-center">
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-3">🗓️</div>
                <div className="text-2xl font-bold text-yellow-300 mb-2">Sept 28</div>
                <div className="text-gray-300">Sunday</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-3">⏰</div>
                <div className="text-xl font-semibold text-orange-200 mb-2">5 PM – 10 PM</div>
                <div className="text-gray-300">Duration</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-3">✨</div>
                <div className="text-lg font-medium text-white">Dandiya + Celebrity DJ Night</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Attractions Section */}
      <section id="attractions" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-6xl mb-6">🎉</div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Main Attractions
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Music, text: "Celebrity DJ Night" },
              { icon: Users, text: "Influencer Meet & Greet Zone" },
              { icon: Crown, text: "Best Dressed Competition" },
              { icon: Star, text: "Dandiya Queen & King Title" },
              { icon: Gift, text: "Fun Zone (Games & Activities)" },
              { icon: Camera, text: "Insta-Worthy Photo Corners" },
            ].map((attraction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/20 hover:scale-105 transition-transform text-center"
              >
                <div className="bg-yellow-400/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <attraction.icon className="w-8 h-8 text-yellow-400" />
                </div>
                <span className="text-white font-semibold text-lg">{attraction.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsorship Packages Section */}
      <section id="sponsors" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-6xl mb-6">💰</div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Sponsorship Packages
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Title Sponsor",
                price: "₹2,50,000",
                level: "Premium Package",
                icon: Crown,
                gradient: "from-yellow-600/30 to-orange-600/30",
                borderColor: "border-yellow-400/40",
                features: [
                  { name: "Banner Branding (5 km)", included: true },
                  { name: "Pamphlet Circulation", included: true },
                  { name: "Stall Branding", included: true },
                  { name: "Individual Banners", included: true },
                  { name: "Print Media Branding", included: true },
                  { name: "Influencer Collaborations", included: true, value: "10+" },
                  { name: "Social Media Promotions", included: true },
                  { name: "LED Billboard Ads", included: true },
                  { name: "Logo on Screen/Tickets", included: true },
                  { name: "Stall Access", included: true },
                  { name: "Stage Branding", included: true },
                  { name: "Media Coverage & PR", included: true },
                  { name: "VIP Tickets", included: true, value: "20" },
                ],
              },
              {
                name: "Co-Presenting Sponsor",
                price: "₹1,50,000",
                level: "Gold Package",
                icon: Star,
                gradient: "from-orange-600/30 to-red-600/30",
                borderColor: "border-orange-400/40",
                features: [
                  { name: "Banner Branding (2 km)", included: true },
                  { name: "Pamphlet Circulation", included: true },
                  { name: "Stall Branding", included: true },
                  { name: "Individual Banners", included: false },
                  { name: "Print Media Branding", included: false },
                  { name: "Influencer Collaborations", included: true, value: "10+" },
                  { name: "Social Media Promotions", included: true },
                  { name: "LED Billboard Ads", included: false },
                  { name: "Logo on Screen/Tickets", included: true },
                  { name: "Stall Access", included: true },
                  { name: "Stage Branding", included: true },
                  { name: "Media Coverage & PR", included: true },
                  { name: "VIP Tickets", included: true, value: "10" },
                ],
              },
              {
                name: "Associate Sponsor",
                price: "₹75,000",
                level: "Silver Package",
                icon: Gift,
                gradient: "from-purple-600/30 to-pink-600/30",
                borderColor: "border-purple-400/40",
                features: [
                  { name: "Banner Branding", included: false },
                  { name: "Pamphlet Circulation", included: false },
                  { name: "Stall Branding", included: false },
                  { name: "Individual Banners", included: true },
                  { name: "Print Media Branding", included: true },
                  { name: "Influencer Collaborations", included: true, value: "5+" },
                  { name: "Social Media Promotions", included: false },
                  { name: "LED Billboard Ads", included: true },
                  { name: "Logo on Screen/Tickets", included: true },
                  { name: "Stall Access", included: true },
                  { name: "Stage Branding", included: true },
                  { name: "Media Coverage & PR", included: false },
                  { name: "VIP Tickets", included: true, value: "5" },
                ],
              },
            ].map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`bg-gradient-to-br ${pkg.gradient} rounded-2xl p-6 backdrop-blur-sm border-2 ${pkg.borderColor} hover:scale-105 transition-all duration-300 shadow-2xl`}
              >
                {/* Package Header */}
                <div className="text-center mb-6">
                  <div className="bg-yellow-400/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <pkg.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-white mb-2">{pkg.price}</div>
                  <div className="text-sm text-gray-300">{pkg.level}</div>
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center justify-between text-sm">
                      <span className="text-gray-200 flex-1">{feature.name}</span>
                      <div className="flex items-center space-x-2">
                        {feature.value && (
                          <span className="text-yellow-300 font-semibold text-xs">{feature.value}</span>
                        )}
                        {feature.included ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  Choose Package
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 border border-yellow-400/20">
              <h4 className="text-2xl font-bold text-yellow-300 mb-4">🤝 Partnership Benefits</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Brand Visibility to 1000+ Attendees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Social Media Reach 50K+ Impressions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Professional Event Photography</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="text-6xl mb-6">📞</div>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              Contact & Bookings
            </h2>
          </motion.div>

          {/* Milaan Services Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
              <Image
                src="/milaan-logo.jpg"
                alt="Milaan Services Logo"
                width={200}
                height={120}
                className="rounded-xl"
              />
            </div>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { name: "Ankit", phone: "+91 7370038276" },
              { name: "Sanjeev", phone: "+91 7488479814" },
              { name: "Abhishek", phone: "+91 9355477609" },
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/20 hover:scale-105 transition-transform text-center"
              >
                <Phone className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
                <div className="text-xl font-bold text-yellow-300 mb-2">{contact.name}</div>
                <a href={`tel:${contact.phone}`} className="text-white hover:text-yellow-300 transition-colors">
                  {contact.phone}
                </a>
              </motion.div>
            ))}
          </div>

          {/* Email and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/20 text-center"
            >
              <Mail className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <div className="text-xl font-semibold">
                <a
                  href="mailto:servicesmilaan@gmail.com"
                  className="text-white hover:text-yellow-300 transition-colors"
                >
                  servicesmilaan@gmail.com
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-black/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-400/20 text-center"
            >
              <MapPin className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
              <div className="text-xl font-semibold text-white">B.N. Club, Ramnagri Ashiyana, Patna</div>
            </motion.div>
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="text-4xl mb-4">🙏</div>
            <div className="text-2xl text-yellow-200 font-semibold mb-8">Jai Mata Di! 🌺</div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Join the Celebration! 🎉
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-lg border-t border-yellow-400/30 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="text-2xl">🪔</div>
            <span className="text-white font-semibold">Dandiya Night 2025 - Organized by Milaan Services</span>
          </div>
          <p className="text-gray-300">© 2025 Milaan Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
