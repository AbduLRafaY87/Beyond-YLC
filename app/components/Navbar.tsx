'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function Navbar({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors">
              Beyond YLC
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Home
                </Link>
                <Link href="/people" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  People
                </Link>
                <Link href="/sap-hub" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  SAP Hub
                </Link>
                <Link href="/reflections" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Reflections
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {session ? (
                <>
                  <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-200 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Home
            </Link>
            <Link href="/people" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              People
            </Link>
            <Link href="/sap-hub" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              SAP Hub
            </Link>
            <Link href="/reflections" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
              Reflections
            </Link>
            {session ? (
              <>
                <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                  Profile
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
