'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, MapPin, Github, Linkedin, Globe, Mail, Calendar, UserPlus, MessageCircle, Edit, Briefcase, Award, Twitter, Users, Star, TrendingUp, Target, Zap, Heart, Share2, MoreVertical, ExternalLink, CheckCircle2, Clock, Activity, BookOpen, Code, Coffee, Lightbulb, Rocket, ThumbsUp, MessageSquare, Eye, Download, Camera, Settings, Bell, Shield, Crown } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  avatar_url?: string
  bio?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  twitter?: string
  skills?: string[]
  interests?: string[]
  occupation?: string
  organization?: string
  ylc_batch?: string
  achievements?: string[]
  created_at: string
  updated_at: string
}

export default function EnhancedProfilePage() {
  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'about' | 'activity' | 'connections'>('about')
  const [isFollowing, setIsFollowing] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  useEffect(() => {
    if (id) {
      fetchProfile()
    }
  }, [id])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setError('Profile not found')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysActive = () => {
    if (!profile) return 0
    return Math.floor((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  const handleShare = () => {
    setShowShareMenu(!showShareMenu)
  }

  const copyProfileLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Profile link copied to clipboard!')
    setShowShareMenu(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">😔</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
            <p className="text-gray-600 mb-6">The profile you're looking for doesn't exist or has been removed.</p>
            <Link
              href="/people"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to People
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isOwnProfile = user?.id === profile.id

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 sm:pt-20 pb-8 sm:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Back Button */}
        <Link
          href="/people"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition-colors group text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          Back to People
        </Link>

        {/* Main Profile Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          {/* Cover Image with Gradient */}
          <div className="relative z-0 h-24 sm:h-32 lg:h-40">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 z-0"></div>

            {/* Share Button */}
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6">
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2 sm:p-3 bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-xl"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                </button>
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg sm:rounded-xl shadow-2xl p-2 min-w-[160px] sm:min-w-[180px] z-20 border border-gray-100">
                    <button
                      onClick={copyProfileLink}
                      className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-50 rounded-md sm:rounded-lg text-sm transition-colors"
                    >
                      Copy Link
                    </button>
                    <button className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-50 rounded-md sm:rounded-lg text-sm transition-colors">
                      Share via Email
                    </button>
                    <button className="w-full text-left px-3 sm:px-4 py-2 hover:bg-gray-50 rounded-md sm:rounded-lg text-sm transition-colors">
                      Download QR Code
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-10 pb-6 sm:pb-8">
            {/* Profile Header Section */}
            <div className="-mt-16 sm:-mt-20 lg:-mt-24 mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 xl:w-48 lg:h-40 xl:h-48 rounded-xl sm:rounded-2xl overflow-hidden border-4 border-white bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                    {profile.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-6xl">
                        {profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </div>
                  {/* Online Status */}
                  <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 lg:bottom-3 lg:right-3 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 bg-green-500 rounded-full border-3 sm:border-4 border-white shadow-lg"></div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left pt-2 sm:pt-6">
                  <div className="mb-4">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight">
                      {profile.full_name}
                    </h1>

                    {profile.occupation && (
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base lg:text-lg text-gray-700 mb-3">
                        <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600 flex-shrink-0" />
                        <span className="font-medium">{profile.occupation}</span>
                        {profile.organization && (
                          <>
                            <span className="text-gray-400 hidden sm:inline">at</span>
                            <span className="font-medium text-blue-600">{profile.organization}</span>
                          </>
                        )}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-gray-600">
                      {profile.location && (
                        <div className="flex items-center gap-1 sm:gap-1.5">
                          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{profile.location}</span>
                        </div>
                      )}
                      {profile.ylc_batch && (
                        <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-medium">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                          YLC {profile.ylc_batch}
                        </div>
                      )}
                      <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Joined </span>{formatDate(profile.created_at)}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 sm:gap-3 justify-center sm:justify-start flex-wrap">
                    {isOwnProfile ? (
                      <Link
                        href="/profile"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        Edit Profile
                      </Link>
                    ) : (
                      <>
                        <button
                          onClick={handleFollow}
                          className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base ${isFollowing
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                          {isFollowing ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                              Follow
                            </>
                          )}
                        </button>
                        <button className="inline-flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base">
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                          Message
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl border border-blue-100">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">{profile.skills?.length || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1 sm:gap-1.5">
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  Skills
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">{profile.interests?.length || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1 sm:gap-1.5">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                  Interests
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">{profile.achievements?.length || 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1 sm:gap-1.5">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                  Achievements
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{getDaysActive()}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1 sm:gap-1.5">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  Days Active
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-4 sm:gap-8 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`pb-4 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'about' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  About
                  {activeTab === 'about' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`pb-4 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'activity' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Activity
                  {activeTab === 'activity' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('connections')}
                  className={`pb-4 font-semibold transition-colors relative whitespace-nowrap ${activeTab === 'connections' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Connections
                  {activeTab === 'connections' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'about' && (
              <div className="space-y-6 sm:space-y-8">
                {/* Bio */}
                {profile.bio && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 sm:h-6 bg-blue-600 rounded-full"></div>
                      About
                    </h2>
                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{profile.bio}</p>
                  </div>
                )}

                {/* Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 sm:h-6 bg-blue-600 rounded-full"></div>
                      Skills & Expertise
                    </h2>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {profile.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-blue-200 hover:shadow-md transition-all cursor-pointer hover:scale-105"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {profile.interests && profile.interests.length > 0 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 sm:h-6 bg-purple-600 rounded-full"></div>
                      Interests & Passions
                    </h2>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {profile.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium border border-purple-200 hover:shadow-md transition-all cursor-pointer hover:scale-105"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {profile.achievements && profile.achievements.length > 0 && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 sm:h-6 bg-yellow-600 rounded-full"></div>
                      Achievements & Recognition
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      {profile.achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg sm:rounded-xl hover:shadow-lg transition-all"
                        >
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <span className="text-gray-800 font-medium text-xs sm:text-sm pt-0.5">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {(profile.linkedin || profile.github || profile.website || profile.twitter) && (
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 sm:h-6 bg-green-600 rounded-full"></div>
                      Connect & Follow
                    </h2>
                    <div className="grid grid-cols-1 gap-2 sm:gap-3">
                      {profile.linkedin && (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg sm:rounded-xl hover:shadow-lg transition-all border border-blue-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-medium text-sm sm:text-base">LinkedIn</span>
                          </div>
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {profile.github && (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg sm:rounded-xl hover:shadow-lg transition-all border border-gray-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <Github className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-medium text-sm sm:text-base">GitHub</span>
                          </div>
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {profile.website && (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 rounded-lg sm:rounded-xl hover:shadow-lg transition-all border border-green-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-medium text-sm sm:text-base">Website</span>
                          </div>
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {profile.twitter && (
                        <a
                          href={profile.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-sky-50 to-sky-100 text-sky-700 rounded-lg sm:rounded-xl hover:shadow-lg transition-all border border-sky-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <Twitter className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="font-medium text-sm sm:text-base">Twitter</span>
                          </div>
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <div className="w-1 h-5 sm:h-6 bg-orange-600 rounded-full"></div>
                  Recent Activity
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg sm:rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium text-sm sm:text-base">Updated profile information</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">2 days ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg sm:rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Code className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium text-sm sm:text-base">Contributed to open source project</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">1 week ago</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5 bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg sm:rounded-xl hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium text-sm sm:text-base">Published a new reflection</p>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1">2 weeks ago</p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-6 sm:py-8">
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    View All Activity
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'connections' && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <div className="w-1 h-6 bg-teal-600 rounded-full"></div>
                  Network & Connections
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200 text-center">
                    <Users className="w-10 h-10 text-teal-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-teal-700 mb-1">42</div>
                    <div className="text-sm text-gray-600">Connections</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 text-center">
                    <UserPlus className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-purple-700 mb-1">18</div>
                    <div className="text-sm text-gray-600">Followers</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200 text-center">
                    <Eye className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-orange-700 mb-1">156</div>
                    <div className="text-sm text-gray-600">Profile Views</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Connections</h3>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">JD</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900">John Doe</p>
                          <p className="text-sm text-gray-600">Software Engineer at Tech Corp</p>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Message
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">AS</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Alice Smith</p>
                          <p className="text-sm text-gray-600">Product Manager at Startup Inc</p>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Message
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">MB</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900">Mike Brown</p>
                          <p className="text-sm text-gray-600">UX Designer at Design Studio</p>
                        </div>
                      </div>
                      <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Message
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                    <Users className="w-4 h-4" />
                    View All Connections
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Trophy icon component
const Trophy = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
)