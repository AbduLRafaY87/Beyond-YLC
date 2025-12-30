'use client'

import Link from 'next/link'
import { Home, Search, ArrowLeft, Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mt-35 min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
            404
          </div>
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
          The page you're looking for seems to have wandered off into the digital void.
          Don't worry, it happens to the best of us!
        </p>

        {/* Illustration */}
        <div className="mb-12">
          <div className="w-64 h-64 mx-auto bg-white/60 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="w-12 h-12 text-white" />
              </div>
              <p className="text-gray-600 font-medium">Lost in Space</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 rounded-2xl font-semibold hover:bg-white transition-all shadow-lg hover:shadow-xl border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4">Need help finding something?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/people"
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              Browse Community
            </Link>
            <Link
              href="/projects"
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              View Projects
            </Link>
            <Link
              href="/reflections"
              className="text-purple-600 hover:text-purple-700 font-medium hover:underline"
            >
              Read Reflections
            </Link>
          </div>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20">
          <p className="text-sm text-gray-600 italic">
            &ldquo;In the vast universe of the internet, even the best explorers get lost sometimes.
            But every wrong turn leads to new discoveries!&rdquo;
          </p>
        </div>
      </div>
    </div>
  )
}
