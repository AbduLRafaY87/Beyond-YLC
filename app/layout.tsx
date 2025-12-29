'use client'

import { AuthProvider } from '@/lib/AuthContext'
import Navbar from './components/Navbar'
import './globals.css'
import { Poppins } from 'next/font/google'
import Footer from './components/Footer'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image" href="/favicon.png" />
      </head>
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
