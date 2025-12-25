'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, Bell, User, LogOut, Settings } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'

// Mock supabase for demo - replace with actual import
const supabase = {
  auth: {
    signOut: () => console.log('Signed out')
  }
}

type NavLink = {
  label: string
  href: string
  subLinks?: { label: string; href: string; description?: string }[]
}

export default function Navbar() {
  const { user, profileImage, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const profileRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
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
    { 
      label: 'People', 
      href: '/people',
      subLinks: [
        { label: 'All Members', href: '/people', description: 'Browse our community' },
        { label: 'Leadership', href: '/people/leadership', description: 'Meet our leaders' },
        { label: 'Alumni', href: '/people/alumni', description: 'Our success stories' },
      ]
    },
    { 
      label: 'SAP Hub', 
      href: '/sap-hub',
      subLinks: [
        { label: 'Programs', href: '/sap-hub/programs', description: 'Explore our programs' },
        { label: 'Resources', href: '/sap-hub/resources', description: 'Learning materials' },
        { label: 'Events', href: '/sap-hub/events', description: 'Upcoming activities' },
      ]
    },
    { 
      label: 'Reflections', 
      href: '/reflections',
      subLinks: [
        { label: 'Blog', href: '/reflections/blog', description: 'Latest insights' },
        { label: 'Stories', href: '/reflections/stories', description: 'Member experiences' },
        { label: 'Gallery', href: '/reflections/gallery', description: 'Photo memories' },
      ]
    },
  ]

  const handleSearch = () => {
    console.log('Search functionality removed')
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
          : 'bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                scrolled 
                  ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
                  : 'bg-white/20'
              } group-hover:scale-110 group-hover:rotate-3`}>
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <span className={`text-2xl font-bold transition-colors hidden sm:block ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                <span className={scrolled ? 'text-blue-600' : 'text-blue-200'}>Be</span>yond YLC
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {NAV_LINKS.map(link => (
                <div 
                  key={link.href} 
                  className="relative"
                  onMouseEnter={() => link.subLinks && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                      isActive(link.href)
                        ? scrolled
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-white bg-white/20'
                        : scrolled 
                          ? 'text-gray-700 hover:text-blue-600 hover:bg-blue-50' 
                          : 'text-white hover:bg-white/20'
                    }`}
                  >
                    {link.label}
                    {link.subLinks && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  {/* Dropdown Menu */}
                  {link.subLinks && activeDropdown === link.label && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {link.subLinks.map((subLink, idx) => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className={`block px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all ${
                            idx !== link.subLinks!.length - 1 ? 'border-b border-gray-100' : ''
                          }`}
                        >
                          <div className="font-medium text-gray-900">{subLink.label}</div>
                          {subLink.description && (
                            <div className="text-sm text-gray-500 mt-0.5">{subLink.description}</div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <button
                    className={`p-2 rounded-lg transition-all duration-200 relative ${
                      scrolled
                        ? 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        : 'text-white hover:bg-white/20'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen(!profileOpen)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                        scrolled
                          ? 'text-gray-700 hover:bg-blue-50'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {profileOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="font-medium text-gray-900">
                            {user.user_metadata?.first_name} {user.user_metadata?.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors">
                          <User className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">Profile</span>
                        </Link>
                        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors">
                          <Settings className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-700">Settings</span>
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left border-t border-gray-100"
                        >
                          <LogOut className="w-4 h-4 text-red-600" />
                          <span className="text-red-600">Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                    scrolled
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
                      : 'bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl'
                  } hover:scale-105`}
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                scrolled ? 'text-gray-700 hover:bg-blue-50' : 'text-white hover:bg-white/20'
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bottom-0 bg-white overflow-y-auto">
            <div className="px-4 py-6 space-y-1">
              {/* Mobile Nav Links */}
              {NAV_LINKS.map(link => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg font-medium ${
                      isActive(link.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                    onClick={() => !link.subLinks && setIsOpen(false)}
                  >
                    {link.label}
                    {link.subLinks && <ChevronDown className="w-4 h-4" />}
                  </Link>
                  {link.subLinks && (
                    <div className="ml-4 mt-1 space-y-1">
                      {link.subLinks.map(subLink => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className="block px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setIsOpen(false)}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth Actions */}
              <div className="pt-6 mt-6 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="w-5 h-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-3 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}