'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export default function ProtectedRoute({
  children,
  requireAuth = true,
  redirectTo
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return // Still loading, don't redirect yet

    if (requireAuth && !user) {
      // User needs to be authenticated but isn't - redirect to login
      router.push(redirectTo || '/login')
    } else if (!requireAuth && user) {
      // User is authenticated but shouldn't be (on login/signup pages) - redirect to profile
      router.push(redirectTo || '/profile')
    }
  }, [user, loading, requireAuth, redirectTo, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // If user needs to be authenticated but isn't, show loading until redirect completes
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // If user is authenticated but shouldn't be, show loading until redirect completes
  if (!requireAuth && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return <>{children}</>
}
