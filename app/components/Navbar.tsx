'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Bell, User, LogOut, Settings, BubblesIcon } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

// Mock supabase for demo - replace with actual import
// const supabase = {
//   auth: {
//     signOut: () => console.log('Signed out')
//   }
// }

type NavLink = {
  label: string
  href: string
}

export default function Navbar() {
  const { user, profileImage, fullName, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const profileRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)

      // Calculate scroll progress
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const trackLength = documentHeight - windowHeight
      const progress = (scrollTop / trackLength) * 100

      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileOpen])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname?.startsWith(href)
  }

  const NAV_LINKS: NavLink[] = [
    { label: 'Home', href: '/' },
    { label: 'People', href: '/people' },
    { label: 'SAP Hub', href: '/sap-hub' },
    { label: 'Reflections', href: '/reflections' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-md'
          : 'bg-white/80 backdrop-blur-md'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="logo"><img className='max-w-10' src="/trans.png" /></div>
                {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div> */}
                {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div> */}
              </div>
              {/* <div className="hidden sm:block"> */}
              {/* <div>
                <span className="text-2xl font-black text-gray-900">
                  Beyond<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">YLC</span>
                </span>
                <div className="text-xs text-gray-500 font-medium -mt-1">Community Platform</div>
              </div> */}
              <div>
                <span className="text-lg sm:text-2xl font-black text-gray-900">
                  Beyond
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    YLC
                  </span>
                </span>
                <div className="text-[10px] sm:text-xs text-gray-500 font-medium -mt-1">
                  Community Platform
                </div>
              </div>

            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 group ${isActive(link.href)
                      ? 'text-purple-600'
                      : 'text-gray-700 hover:text-purple-600'
                    }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ${isActive(link.href)
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                    }`}></span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2.5 rounded-xl text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 group">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                    <span className="absolute inset-0 rounded-xl bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></span>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-purple-50 transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg overflow-hidden ring-2 ring-purple-200 group-hover:ring-purple-400 transition-all duration-200">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="hidden xl:block text-left">
                        <div className="text-sm font-semibold text-gray-900">
                          {fullName || user.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-xs text-gray-500">View Profile</div>
                      </div>
                    </button>

                    {profileOpen && (
                      <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white">
                              {profileImage ? (
                                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                  <User className="w-6 h-6 text-white" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">
                                {fullName || user.email?.split('@')[0] || 'User'}
                              </div>
                              <div className="text-sm text-gray-600 truncate">{user.email}</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50 transition-colors group"
                            onClick={() => setProfileOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <User className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">My Profile</span>
                          </Link>
                          <Link
                            href="/settings"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50 transition-colors group"
                            onClick={() => setProfileOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                              <Settings className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">Settings</span>
                          </Link>
                          <Link
                            href="/my-saps"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-purple-50 transition-colors group"
                            onClick={() => setProfileOpen(false)}
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                              <BubblesIcon className="w-4 h-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">My SAPs</span>
                          </Link>
                        </div>
                        <div className="p-2 border-t border-gray-100">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors w-full text-left group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <LogOut className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="text-sm font-medium text-red-600">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Progress bar for scrolled state */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-150"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="px-4 py-6 space-y-2">
              {/* Mobile Nav Links */}
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3.5 rounded-xl font-semibold transition-all duration-200 ${isActive(link.href)
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 shadow-sm'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={`w-1 h-6 rounded-full mr-3 transition-all duration-200 ${isActive(link.href) ? 'bg-gradient-to-b from-purple-600 to-pink-600' : 'bg-transparent'
                    }`}></span>
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth Actions */}
              <div className="pt-6 mt-6 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <div className="px-4 py-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white">
                          {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                              <User className="w-6 h-6 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">
                            {fullName || user.email?.split('@')[0] || 'User'}
                          </div>
                          <div className="text-sm text-gray-600 truncate">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full text-left transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block px-4 py-3 text-center rounded-xl font-semibold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 border-2 border-gray-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-4 py-3 text-center rounded-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}