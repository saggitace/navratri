import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import AlertProvider from '@/components/AlertProvider'

export const metadata: Metadata = {
  title: 'Navratri - Dandiya Beats 2k25',
  description: 'Created with Milaan Services',
  generator: 'Milaan Services',
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
        <AlertProvider /> {/* 👈 Runs on client, overrides alert */}
      </body>
    </html>
  )
}
