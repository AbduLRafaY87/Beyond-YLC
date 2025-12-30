'use client'

import { AuthProvider } from '@/lib/AuthContext'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
  )
}
