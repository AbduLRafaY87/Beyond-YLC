'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Users, Globe, Rocket, Heart, Handshake, BarChart3, GraduationCap, Star, Lightbulb, Trophy, Waves, Search, ChevronDown, ArrowRight, CheckCircle2 } from 'lucide-react'


export default function Home() {
  const [scrollY, setScrollY] = useState(0)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [floatingParticles, setFloatingParticles] = useState<Array<{left: string, top: string, animationDelay: string, animationDuration: string}>>([])
  const [twinkleParticles, setTwinkleParticles] = useState<Array<{left: string, top: string, animationDelay: string}>>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const particles = Array.from({ length: 12 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`
    }))
    setFloatingParticles(particles)
  }, [])

  useEffect(() => {
    const particles = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`
    }))
    setTwinkleParticles(particles)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    { number: '7,000+', label: 'Young Leaders', icon: Users },
    { number: '65+', label: 'cities', icon: Globe },
    { number: '1,000+', label: 'Active SAPs', icon: Rocket },
    { number: '5.4M+', label: 'Lives Impacted', icon: Heart }
  ]

  const testimonials = [
    {
      quote: "Beyond YLC connected me with changemakers who turned my local initiative into a regional movement. Together, we've impacted over 10,000 students.",
      author: "Sarah Chen",
      role: "YLC 2023 | Education SAP",
      country: "Singapore"
    },
    {
      quote: "What started as a solo project became a collaborative force. The Beyond YLC community helped me scale my environmental initiative across 5 countries.",
      author: "Ahmed Hassan",
      role: "YLC 2022 | Climate Action SAP",
      country: "Egypt"
    },
    {
      quote: "Finding mentors and collaborators through Beyond YLC transformed my vision into reality. Our mental health project now serves 50+ schools.",
      author: "Maria Rodriguez",
      role: "YLC 2024 | Health & Wellness SAP",
      country: "Mexico"
    }
  ]

  const features = [
    {
      icon: Handshake,
      title: 'Connect & Collaborate',
      description: 'Find changemakers working on similar causes and amplify your impact together',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BarChart3,
      title: 'Showcase Your SAP',
      description: 'Share your Social Action Project and inspire others with your journey',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: GraduationCap,
      title: 'Learn & Grow',
      description: 'Access resources, mentorship, and continuous learning opportunities',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Star,
      title: 'Scale Your Impact',
      description: 'Get support, funding opportunities, and partnerships to grow your project',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Lightbulb,
      title: 'Share Resources',
      description: 'Exchange tools, templates, and best practices with the community',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Trophy,
      title: 'Celebrate Success',
      description: 'Recognize achievements and milestone moments of changemakers worldwide',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Join the Community',
      description: 'Create your profile and tell us about your YLC experience and SAP',
      icon: Waves
    },
    {
      step: '02',
      title: 'Discover Projects',
      description: 'Explore active SAPs and find causes that resonate with your passion',
      icon: Search
    },
    {
      step: '03',
      title: 'Connect & Contribute',
      description: 'Reach out to project leaders and offer your skills or collaborate',
      icon: Handshake
    },
    {
      step: '04',
      title: 'Create Lasting Change',
      description: 'Together, amplify your impact and build a better world',
      icon: Globe
    }
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section with Advanced Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600">
          {/* Animated Gradient Orbs */}
          <div
            className="absolute top-0 left-0 w-[32rem] h-[32rem] bg-blue-400 rounded-full blur-[120px] opacity-40 animate-blob"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />

          <div
            className="absolute top-0 right-0 w-[32rem] h-[32rem] bg-purple-400 rounded-full blur-[120px] opacity-40 animate-blob animation-delay-2000"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />

          <div
            className="absolute bottom-0 left-1/2 w-[32rem] h-[32rem] bg-pink-400 rounded-full blur-[120px] opacity-40 animate-blob animation-delay-4000"
            style={{ transform: `translateY(${scrollY * 0.4}px)` }}
          />


          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.01]"></div>

          {/* Floating Particles */}
          {floatingParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-15 animate-float"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay,
                animationDuration: particle.animationDuration
              }}
            ></div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="mb-6 inline-block">
            <span className="px-3 sm:px-5 py-2 bg-white/10 backdrop-blur-xl rounded-full text-white text-xs sm:text-sm font-medium border border-white/20 shadow-xl shadow-black/30 ring-1 ring-white/10 whitespace-nowrap">
              🌟 Where 6 Days Become a Lifetime of Impact
            </span>
          </div>


          <h1 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight">
            <span className="block text-lg md:text-xl font-normal text-blue-200 mb-3">
              A global, open community where young
            </span>

            <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-gradient">
              change-makers
            </span>

            <span className="block text-base md:text-lg font-normal text-purple-200 mt-3">
              connect, collaborate, and turn inspiration into real-world social action
            </span>
          </h1>


          <p className="text-lg md:text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            The Young Leaders Conference sparked your journey. Now, join a global movement
            where your Social Action Project finds support, collaboration, and exponential impact.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/login"
              className="group relative px-10 py-3 bg-white text-purple-900 rounded-full font-black text-lg shadow-2xl hover:shadow-white/50 transform hover:scale-110 transition-all duration-300"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
            </Link>

            <Link
              href="/projects"
              className="px-10 py-3 bg-transparent text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white hover:text-purple-900 transform hover:scale-110 transition-all duration-300 backdrop-blur-sm"
            >
              Explore Projects
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-white" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-gradient-to-r from-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300"
              >
                <stat.icon className="w-8 h-8 mb-2 text-white" />
                <div className="text-4xl md:text-4xl font-black text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-lg text-purple-200 font-medium">
                  {stat.label}
                </div>
              </div>

            ))}
          </div>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold mb-6">
                THE CHALLENGE
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                Amazing Ideas.<br />Isolated Impact.
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                After YLC, thousands of changemakers return home with powerful Social Action Projects.
                But working in isolation limits what's possible.
              </p>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-2xl">✗</span>
                  <span>No way to find others working on similar causes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-2xl">✗</span>
                  <span>Limited resources and support after the conference</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-2xl">✗</span>
                  <span>Difficulty scaling projects beyond local communities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3 text-2xl">✗</span>
                  <span>Missing opportunities for collaboration and learning</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-bold mb-6">
                THE SOLUTION
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-6 leading-tight">
                One Platform.<br />Infinite Possibilities.
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Beyond YLC brings all YLC alumni and their SAPs together in one powerful ecosystem
                where collaboration multiplies impact.
              </p>
              <ul className="space-y-4 text-lg text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-2xl">✓</span>
                  <span>Connect with changemakers across 150+ countries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-2xl">✓</span>
                  <span>Access ongoing mentorship and learning resources</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-2xl">✓</span>
                  <span>Collaborate to scale projects globally</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 text-2xl">✓</span>
                  <span>Share resources, celebrate wins, and grow together</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      {/* How It Works - Enhanced */}
      <section className="relative py-32 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full text-purple-300 text-sm font-bold border border-purple-400/30">
                SIMPLE PROCESS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-6 leading-tight">
              Your Journey to&nbsp;
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Global Impact
              </span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Four powerful steps to transform your vision into collaborative action
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="relative">
            {/* Connection Line - Desktop */}
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 opacity-30"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative group">
                  {/* Step Card */}
                  <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-400/50 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 h-full">
                    {/* Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-blue-500/10 rounded-3xl transition-all duration-500"></div>
                    
                    {/* Step Number Badge */}
                    <div className="relative mb-6">
                      <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-2xl font-black text-white">{item.step}</span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className="mb-6 relative">
                      <item.icon className="w-12 h-12 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" strokeWidth={1.5} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Hover Arrow */}
                    <div className="mt-6 flex items-center text-purple-400 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span className="text-sm">Get started</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>

                  {/* Connection Arrow - Desktop */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:flex absolute top-24 -right-3 transform -translate-y-1/2 z-20">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Connection Arrow - Mobile */}
                  {index < howItWorks.length - 1 && (
                    <div className="lg:hidden flex justify-center my-4">
                      <ChevronDown className="w-8 h-8 text-purple-400 animate-bounce" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          {/* <div className="text-center mt-16">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
            >
              Begin Your Journey
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div> */}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl md:text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help changemakers collaborate, innovate, and scale their impact
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 overflow-hidden"
              >
                {/* Animated Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                ></div>

                <div className="relative z-10 flex flex-col items-start">
                  {/* Icon with subtle background circle */}
                  <div className="mb-6 relative">
                    <div className="absolute -inset-2 rounded-full bg-white opacity-10 group-hover:opacity-20 transition-all duration-500"></div>
                    <feature.icon className="w-14 h-14 text-gray-900 relative z-10" />
                  </div>

                  {/* Feature Title */}
                  <h3 className="text-2xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  {/* Feature Description */}
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                  {/* CTA Arrow */}
                  <span className="mt-4 inline-flex items-center text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Learn More →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Carousel */}
      {/* <section className="py-32 bg-gradient-to-r from-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Stories of Impact
            </h2>
            <p className="text-xl text-purple-200">
              Hear from changemakers who transformed their vision into reality
            </p>
          </div>

          <div className="relative bg-white rounded-3xl shadow-2xl p-12 md:p-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${activeTestimonial === index ? 'opacity-100' : 'opacity-0 absolute inset-0 p-12 md:p-16'
                  }`}
              >
                <div className="text-6xl text-purple-600 mb-6">"</div>
                <p className="text-2xl text-gray-700 mb-8 leading-relaxed italic">
                  {testimonial.quote}
                </p>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mr-4"></div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-600">{testimonial.role}</div>
                    <div className="text-purple-600 font-medium">{testimonial.country}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTestimonial === index ? 'bg-purple-600 w-8' : 'bg-gray-300'
                    }`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Enhanced Call to Action */}
      {/* Enhanced Call to Action */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 overflow-hidden">
        {/* Enhanced Background with Multiple Layers */}
        <div className="absolute inset-0">
          {/* Base gradient overlay */}
          <div className="absolute inset-0 bg-black opacity-20"></div>

          {/* Animated geometric shapes */}
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white/20 rounded-full animate-spin-slow"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/10 rounded-lg rotate-45 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/15 rounded-full animate-ping"></div>

          {/* Twinkle particles */}
          {twinkleParticles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-twinkle"
              style={{
                left: particle.left,
                top: particle.top,
                animationDelay: particle.animationDelay
              }}
            ></div>
          ))}

          {/* Floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-300/10 rounded-full blur-2xl animate-float animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Enhanced Badge with Animation */}
          <div className="mb-6 inline-block">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-xl rounded-full text-white text-sm md:text-base font-semibold border border-white/30 shadow-2xl ring-1 ring-white/20 hover:bg-white/30 transition-all duration-300">
              <Rocket className="w-4 h-4" />
              Join 7,000+ Changemakers Worldwide
            </span>
          </div>

          {/* Compelling Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight drop-shadow-2xl">
            Ready to{' '}
            <span className="bg-gradient-to-r from-white via-yellow-200 to-pink-200 bg-clip-text text-transparent animate-gradient">
              Transform Your Impact?
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-white/90 mb-10 leading-relaxed max-w-3xl mx-auto">
            Don't let your YLC spark fade away. Join a thriving community where your Social Action Project
            gets the support, collaboration, and resources to create real, lasting change.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center ">
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center px-8 md:px-10 py-3.5 md:py-4 bg-white text-purple-900 font-bold text-base md:text-lg rounded-full shadow-2xl hover:shadow-white/60 transform hover:scale-105 transition-all duration-300 overflow-hidden w-full sm:w-auto"
            >
              <span className="flex items-center gap-2 relative z-10">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Link>

            <Link
              href="/projects"
              className="px-8 md:px-10 py-3.5 md:py-4 bg-transparent text-white border-2 border-white rounded-full font-semibold text-base md:text-lg hover:bg-white hover:text-purple-900 transform hover:scale-105 transition-all duration-300 backdrop-blur-sm shadow-xl hover:shadow-white/30 w-full sm:w-auto"
            >
              Explore Success Stories
            </Link>
          </div>

          {/* Enhanced Benefits Grid */}
          {/* <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-10 h-10 text-green-300 mb-3" />
                <h3 className="text-base md:text-lg font-bold text-white mb-1">100% Free Forever</h3>
                <p className="text-sm text-white/80">No hidden costs, no premium tiers</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-10 h-10 text-green-300 mb-3" />
                <h3 className="text-base md:text-lg font-bold text-white mb-1">Instant Access</h3>
                <p className="text-sm text-white/80">Join in under 2 minutes</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="flex flex-col items-center text-center">
                <CheckCircle2 className="w-10 h-10 text-green-300 mb-3" />
                <h3 className="text-base md:text-lg font-bold text-white mb-1">Global Network</h3>
                <p className="text-sm text-white/80">Connect worldwide</p>
              </div>
            </div>
          </div> */}

          {/* Social Proof */}
          {/* <div className="mt-8">
            <p className="text-white/70 text-sm md:text-base mb-4">Trusted by changemakers from</p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 opacity-70">
              <div className="flex items-center gap-1.5 text-white font-semibold text-sm md:text-base">
                <span></span> Quetta
              </div>
              <div className="flex items-center gap-1.5 text-white font-semibold text-sm md:text-base">
                <span></span> Balochistan
              </div>
              <div className="flex items-center gap-1.5 text-white font-semibold text-sm md:text-base">
                <span></span> Multan
              </div>
              <div className="flex items-center gap-1.5 text-white font-semibold text-sm md:text-base">
                <span></span> Sukkur
              </div>
              <div className="flex items-center gap-1.5 text-white font-semibold text-sm md:text-base">
                <span></span> Karachi
              </div>
              <div className="flex items-center gap-1.5 text-white font-semibold text-sm md:text-base">
                <span></span> Hub
              </div>
            </div>
          </div> */}
        </div>
      </section>


      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.9 ;
        }
      `}</style>
    </div>
  )
}