import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Navratri - Dandiya Beats 2k25',
  description: 'Created with Milaan Services',
  generator: 'Milaan Services',
  icons: {
    icon: "/Dandiya-beats.jpg", // 👈 your file name here
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        {/* <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style> */}
      </head>
      <body>{children}</body>
    </html>
  )
}
