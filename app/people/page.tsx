'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { Search, MapPin, Github, Linkedin, Globe, UserPlus, MessageCircle, Filter, X, Users, Briefcase, GraduationCap, Sparkles, TrendingUp, Award } from 'lucide-react'

interface Profile {
  id: string
  full_name: string
  avatar_url?: string
  bio?: string
  location?: string
  linkedin?: string
  github?: string
  website?: string
  skills?: string[]
  interests?: string[]
  occupation?: string
  organization?: string
  ylc_batch?: string
  created_at: string
}

type ViewMode = 'grid' | 'list'
type SortBy = 'recent' | 'name' | 'location'

export default function PeoplePage() {
  const { user } = useAuth()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedBatch, setSelectedBatch] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortBy>('recent')

  useEffect(() => {
    fetchProfiles()
  }, [user])

  useEffect(() => {
    filterProfiles()
  }, [profiles, searchTerm, selectedSkills, selectedBatch, sortBy])

  const fetchProfiles = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select('*')

      if (user?.id) {
        query = query.neq('id', user.id)
      }

      const { data, error } = await query

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProfiles = () => {
    let filtered = profiles

    if (searchTerm) {
      filtered = filtered.filter(profile =>
        profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.occupation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.organization?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedSkills.length > 0) {
      filtered = filtered.filter(profile =>
        profile.skills?.some(skill => selectedSkills.includes(skill))
      )
    }

    if (selectedBatch) {
      filtered = filtered.filter(profile => profile.ylc_batch === selectedBatch)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.full_name || '').localeCompare(b.full_name || '')
        case 'location':
          return (a.location || '').localeCompare(b.location || '')
        case 'recent':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    setFilteredProfiles(filtered)
  }

  const toggleSkillFilter = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const getAllSkills = () => {
    const skills = new Set<string>()
    profiles.forEach(profile => {
      profile.skills?.forEach(skill => skills.add(skill))
    })
    return Array.from(skills).sort()
  }

  const getAllBatches = () => {
    const batches = new Set<string>()
    profiles.forEach(profile => {
      if (profile.ylc_batch) batches.add(profile.ylc_batch)
    })
    return Array.from(batches).sort()
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setSelectedBatch('')
    setSearchTerm('')
  }

  const hasActiveFilters = selectedSkills.length > 0 || selectedBatch || searchTerm

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading community members...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pt-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm mb-4">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">{profiles.length} Community Members</span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Meet Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Community</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with talented individuals, discover shared passions, and build meaningful relationships
            </p>
          </div>

          {/* Stats Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{profiles.length}</div>
                  <div className="text-sm text-gray-600">Total Members</div>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{getAllSkills().length}</div>
                  <div className="text-sm text-gray-600">Unique Skills</div>
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{getAllBatches().length}</div>
                  <div className="text-sm text-gray-600">YLC Batches</div>
                </div>
              </div>
            </div>
          </div> */}

          {/* Search and Controls */}
          <div className="rounded-2xl mb-8 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, bio, location, occupation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold transition-all ${
                    showFilters
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                  Filters
                  {(selectedSkills.length > 0 || selectedBatch) && (
                    <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedSkills.length + (selectedBatch ? 1 : 0)}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="bg-white px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold text-gray-700"
                >
                  <option value="recent">Most Recent</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="location">Location</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-600">Active filters:</span>
                {selectedSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                    <button onClick={() => toggleSkillFilter(skill)} className="hover:text-purple-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedBatch && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Batch: {selectedBatch}
                    <button onClick={() => setSelectedBatch('')} className="hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
                {/* Skills Filter */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Filter by Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {getAllSkills().map(skill => (
                      <button
                        key={skill}
                        onClick={() => toggleSkillFilter(skill)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selectedSkills.includes(skill)
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Batch Filter */}
                {getAllBatches().length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      Filter by YLC Batch
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {getAllBatches().map(batch => (
                        <button
                          key={batch}
                          onClick={() => setSelectedBatch(selectedBatch === batch ? '' : batch)}
                          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            selectedBatch === batch
                              ? 'bg-blue-600 text-white shadow-lg scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {batch}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600 font-medium">
              Showing <span className="text-purple-600 font-bold">{filteredProfiles.length}</span> of <span className="font-bold">{profiles.length}</span> members
            </p>
          </div>

          {/* People Grid */}
          {filteredProfiles.length === 0 ? (
            <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-white/20 hover:scale-105"
                >
                  {/* Profile Header with Gradient */}
                  <div className="h-24 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 relative">
                    <div className="absolute -bottom-10 left-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white p-1 shadow-xl ring-4 ring-white">
                        {profile.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">
                              {profile.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {profile.ylc_batch && (
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-purple-600 flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {profile.ylc_batch}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-14 px-6 pb-6">
                    {/* Name and Info */}
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                        {profile.full_name}
                      </h3>
                      {profile.occupation && (
                        <div className="flex items-center text-gray-600 text-sm mb-1">
                          <Briefcase className="w-4 h-4 mr-1.5 text-purple-500" />
                          <span className="font-medium">{profile.occupation}</span>
                        </div>
                      )}
                      {profile.organization && (
                        <div className="text-gray-600 text-sm mb-1">
                          at <span className="font-medium">{profile.organization}</span>
                        </div>
                      )}
                      {profile.location && (
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-1.5" />
                          {profile.location}
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {profile.bio}
                      </p>
                    )}

                    {/* Skills */}
                    {profile.skills && profile.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg font-semibold border border-purple-100"
                            >
                              {skill}
                            </span>
                          ))}
                          {profile.skills.length > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-semibold">
                              +{profile.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Social Links */}
                    {(profile.linkedin || profile.github || profile.website) && (
                      <div className="flex items-center gap-2 mb-4 pt-4 border-t border-gray-100">
                        {profile.linkedin && (
                          <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {profile.github && (
                          <a
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {profile.website && (
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    )}

                    {/* Action Button */}
                    <Link
                      href={`/profile/${profile.id}`}
                      className="block w-full py-3 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
