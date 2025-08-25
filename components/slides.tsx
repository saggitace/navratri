"use client"

import { MapPin, Phone, Mail, Crown, Star, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import Image from "next/image"

export const CoverSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">{slide.title}</h1>
        <h2 className="text-2xl text-yellow-300 drop-shadow-md">{slide.subtitle}</h2>
        <p className="text-lg text-gray-200 drop-shadow-sm mt-4">{slide.date}</p>
        <p className="text-lg text-gray-200 drop-shadow-sm">{slide.venue}</p>
        <p className="text-lg text-gray-200 drop-shadow-sm">{slide.organizer}</p>
      </CardContent>
    </Card>
  )
}

export const AboutSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center">{slide.title}</h2>
        <ul className="list-disc list-inside text-lg text-gray-200 drop-shadow-sm mt-4">
          {slide.points.map((point: string, index: number) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export const ScheduleSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center">{slide.title}</h2>
        <div className="mt-4">
          {slide.schedule.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-gray-700 last:border-none"
            >
              <span className="text-lg text-gray-200 drop-shadow-sm">{item.date}</span>
              <span className="text-lg text-gray-200 drop-shadow-sm">{item.time}</span>
              <span className="text-lg font-semibold text-yellow-300 drop-shadow-md">{item.highlight}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const AttractionsSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center">{slide.title}</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {slide.attractions.map((attraction: any, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <attraction.icon className="w-6 h-6 text-yellow-400" />
              <span className="text-lg text-gray-200 drop-shadow-sm">{attraction.text}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export const FoodSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center">{slide.title}</h2>
        <ul className="list-disc list-inside text-lg text-gray-200 drop-shadow-sm mt-4">
          {slide.features.map((feature: string, index: number) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export const AudienceSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center">{slide.title}</h2>
        <ul className="list-disc list-inside text-lg text-gray-200 drop-shadow-sm mt-4">
          {slide.audiences.map((audience: string, index: number) => (
            <li key={index}>{audience}</li>
          ))}
        </ul>
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
        return DollarSign
      default:
        return DollarSign
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
                <div className="bg-yellow-400/20 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-300 mb-3">{pkg.name}</h3>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{pkg.price}</div>
                <div className="text-sm sm:text-base text-gray-300 capitalize">{pkg.level} Package</div>
              </motion.div>
            )
          })}
        </div>

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

export const SponsorSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center">{slide.title}</h2>
        <ul className="list-disc list-inside text-lg text-gray-200 drop-shadow-sm mt-4">
          {slide.benefits.map((benefit: string, index: number) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export const CoSponsorSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center">{slide.title}</h2>
        <ul className="list-disc list-inside text-lg text-gray-200 drop-shadow-sm mt-4">
          {slide.benefits.map((benefit: string, index: number) => (
            <li key={index}>{benefit}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export const OrganizerSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="w-full bg-transparent shadow-none">
      <CardContent className="p-6">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg text-center">{slide.title}</h2>
        <ul className="list-disc list-inside text-lg text-gray-200 drop-shadow-sm mt-4">
          {slide.details.map((detail: string, index: number) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export const ContactSlide = ({ slide }: { slide: any }) => {
  return (
    <Card className="bg-black/50 backdrop-blur-lg border-yellow-400/30 text-white shadow-2xl">
      <CardContent className="p-4 sm:p-6 lg:p-8">
        {/* Milaan Services Logo */}
        <motion.div
          className="flex justify-center mb-6 lg:mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-400/30">
            <Image
              src="/images/milaan-logo.jpg"
              alt="Milaan Services Logo"
              width={200}
              height={120}
              className="rounded-xl shadow-lg"
              priority
            />
          </div>
        </motion.div>

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
          {slide.contacts.map((contact: any, index: number) => (
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
                <a href={`tel:+91${contact.phone}`} className="hover:text-yellow-300 transition-colors">
                  📱 +91 {contact.phone}
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
              <a href={`mailto:${slide.email}`} className="hover:text-yellow-300 transition-colors">
                ✉️ {slide.email}
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
            <div className="text-lg sm:text-xl lg:text-2xl font-semibold">📍 {slide.location}</div>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-yellow-400/20"
          >
            <div className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2">🌐 Follow Us</div>
            <div className="flex justify-center space-x-4 text-2xl">
              <span className="hover:scale-110 transition-transform cursor-pointer">📘</span>
              <span className="hover:scale-110 transition-transform cursor-pointer">📷</span>
              <span className="hover:scale-110 transition-transform cursor-pointer">🐦</span>
              <span className="hover:scale-110 transition-transform cursor-pointer">💬</span>
            </div>
          </motion.div>
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
