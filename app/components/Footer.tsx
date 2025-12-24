'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Send, Heart, ArrowUp } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = () => {
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const footerLinks = {
    explore: [
      { label: 'Home', href: '/' },
      { label: 'People', href: '/people' },
      { label: 'SAP Hub', href: '/sap-hub' },
      { label: 'Reflections', href: '/reflections' },
    ],
    about: [
      { label: 'Our Story', href: '/about' },
      { label: 'Mission & Vision', href: '/mission' },
      { label: 'Team', href: '/team' },
      { label: 'Careers', href: '/careers' },
    ],
    resources: [
      { label: 'Blog', href: '/blog' },
      { label: 'Events', href: '/events' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <h2 className="text-3xl font-bold">
                <span className="text-blue-400">Be</span>yond YLC
              </h2>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering youth leaders to create meaningful change and build a better tomorrow. Join our community of changemakers.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5 mr-3" />
                <a href="mailto:info@beyondylc.org">info@beyondylc.org</a>
              </div>
              <div className="flex items-center text-gray-300 hover:text-blue-400 transition-colors">
                <Phone className="w-5 h-5 mr-3" />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </div>
              <div className="flex items-start text-gray-300">
                <MapPin className="w-5 h-5 mr-3 mt-1" />
                <span>123 Leadership Ave<br />Innovation City, IC 12345</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Explore</h3>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
            <p className="text-gray-300 mb-6">Subscribe to our newsletter for updates, events, and inspiring stories.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-gray-600 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-white placeholder-gray-400 transition-all"
              />
              <button
                onClick={handleSubscribe}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
            
            {subscribed && (
              <p className="mt-4 text-green-400 animate-pulse">✓ Successfully subscribed!</p>
            )}
          </div>
        </div>

        {/* Social Links & Bottom Bar */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              <p className="flex items-center gap-1 justify-center md:justify-start">
                © {new Date().getFullYear()} Beyond YLC. Made with <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" /> for youth leaders
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4 text-sm">
              {footerLinks.legal.map((link, idx) => (
                <span key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                  {idx < footerLinks.legal.length - 1 && <span className="ml-4 text-gray-600">|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  )
}