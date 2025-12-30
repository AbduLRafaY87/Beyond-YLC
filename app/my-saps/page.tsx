'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Grid, List, Users, Target, Calendar, MapPin, ArrowRight } from 'lucide-react'

interface SAP {
  id: string
  title: string
  description: string
  problem?: string
  category: string
  status: 'idea' | 'active' | 'completed' | 'complete'
  location: string
  members: number
  createdAt: string
  image?: string
  banner_image?: string
  target_members?: number
  working_for?: string
  idea?: string
  creator_id: string
  creator: {
    full_name: string
    avatar_url?: string
  }
  isJoined: boolean
}

export default function MySAPsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [saps, setSaps] = useState<SAP[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (!user) return

    const fetchMySAPs = async () => {
      if (!user) return
      try {
        // Fetch projects created by the current user
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('creator_id', user!.id)
          .order('created_at', { ascending: false })

        if (projectsError) {
          console.error('Error fetching projects:', projectsError)
          return
        }

        // Fetch project members count for each project
        const projectIds = projectsData.map(project => project.id)
        const { data: membersData, error: membersError } = await supabase
          .from('project_members')
          .select('project_id, user_id')
          .in('project_id', projectIds)

        if (membersError) {
          console.error('Error fetching members:', membersError)
          return
        }

        // Count members per project
        const membersCountMap = new Map()
        membersData.forEach(member => {
          membersCountMap.set(member.project_id, (membersCountMap.get(member.project_id) || 0) + 1)
        })

        // Transform the data to match SAP interface
        const transformedSAPs: SAP[] = projectsData.map(project => {
          const memberCount = membersCountMap.get(project.id) || 0
          return {
            id: project.id,
            title: project.title,
            description: project.description,
            problem: project.problem,
            category: project.category,
            status: project.status,
            location: project.location,
            members: memberCount,
            createdAt: project.created_at,
            image: project.image,
            banner_image: project.banner_image,
            target_members: project.target_members,
            working_for: project.working_for,
            idea: project.idea,
            creator_id: project.creator_id,
            creator: {
              full_name: user!.user_metadata?.full_name || 'Anonymous',
              avatar_url: user!.user_metadata?.avatar_url
            },
            isJoined: true // Creator is always "joined"
          }
        })

        setSaps(transformedSAPs)
      } catch (error) {
        console.error('Error fetching SAPs:', error)
      }
    }

    fetchMySAPs()
  }, [user, loading, router])

  const filteredSAPs = saps.filter(sap => {
    const matchesSearch = sap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sap.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || sap.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(saps.map(sap => sap.category)))]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idea': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My SAPs</h1>
              <p className="text-gray-600 mt-1">Manage your Social Action Projects</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/sap-hub"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                All SAPs
              </Link>
              <Link
                href="/sap-hub/new"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New SAP
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your SAPs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My SAPs Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Projects</h2>
        {filteredSAPs.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">You haven't created any Social Action Projects yet</p>
            <Link
              href="/sap-hub/new"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First SAP
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredSAPs.map(sap => (
              <div
                key={sap.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="aspect-video bg-gray-100 rounded-t-xl flex items-center justify-center overflow-hidden">
                      {sap.image ? (
                        <img
                          src={sap.image}
                          alt={sap.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Target className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{sap.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sap.status)}`}>
                          {sap.status}
                        </span>
                      </div>

                      {/* Problem Statement */}
                      {sap.problem && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          <strong>Problem:</strong> {sap.problem}
                        </p>
                      )}

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{sap.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {sap.members} members
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {sap.location}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {(sap.status === 'completed' || sap.status === 'complete') ? (
                          // Project completed
                          <>
                            <button
                              disabled
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-1 text-sm cursor-not-allowed"
                            >
                              Completed
                            </button>
                            <Link
                              href={`/sap-hub/${sap.id}`}
                              className="flex-1 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center justify-center gap-1 border border-purple-600 rounded-lg py-2"
                            >
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        ) : (
                          // Active project - show edit
                          <>
                            <Link
                              href={`/sap-hub/${sap.id}/edit`}
                              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 text-sm"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/sap-hub/${sap.id}`}
                              className="flex-1 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center justify-center gap-1 border border-purple-600 rounded-lg py-2"
                            >
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  // List View
                  <>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{sap.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sap.status)}`}>
                          {sap.status}
                        </span>
                      </div>

                      {/* Problem Statement */}
                      {sap.problem && (
                        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
                          <strong>Problem:</strong> {sap.problem}
                        </p>
                      )}

                      <p className="text-gray-600 text-sm mb-3 line-clamp-1">{sap.description}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {sap.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {sap.members} members
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(sap.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 flex items-center gap-2">
                      {(sap.status === 'completed' || sap.status === 'complete') ? (
                        // Project completed
                        <>
                          <button
                            disabled
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1 text-sm cursor-not-allowed"
                          >
                            Completed
                          </button>
                          <Link
                            href={`/sap-hub/${sap.id}`}
                            className="flex-1 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </>
                      ) : (
                        // Active project - show edit
                        <>
                          <Link
                            href={`/sap-hub/${sap.id}/edit`}
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/sap-hub/${sap.id}`}
                            className="flex-1 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
