import type { Metadata } from 'next'
import Image from 'next/image'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Navratri - Dandiya Beats 2k25',
  description: 'Created with Milaan Services',
  generator: 'Milaan Services',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <header style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
          <Image src="/Dandiya-beats.jpg" alt="Milaan Services Logo" width={120} height={40} />
        </header>
        {children}
      </body>
    </html>
  )
}
