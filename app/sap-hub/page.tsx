'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { Plus, Search, Filter, Grid, List, Users, Target, Calendar, MapPin, ArrowRight, UserPlus } from 'lucide-react'

interface SAP {
  id: string
  title: string
  description: string
  category: string
  status: 'active' | 'completed' | 'planning'
  location: string
  members: number
  createdAt: string
  image?: string
}

export default function SAPHubPage() {
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

    // Mock data - replace with actual API call
    const mockSAPs: SAP[] = [
      {
        id: '1',
        title: 'Community Garden Initiative',
        description: 'Creating sustainable urban gardens to promote local food production and community engagement',
        category: 'Environment',
        status: 'active',
        location: 'New York City',
        members: 15,
        createdAt: '2024-01-15',
        image: '/api/placeholder/400/250'
      },
      {
        id: '2',
        title: 'Youth Mentorship Program',
        description: 'Connecting young people with professionals for career guidance and personal development',
        category: 'Education',
        status: 'active',
        location: 'Los Angeles',
        members: 8,
        createdAt: '2024-02-01',
        image: '/api/placeholder/400/250'
      },
      {
        id: '3',
        title: 'Homeless Shelter Support',
        description: 'Providing essential supplies and volunteer support to local homeless shelters',
        category: 'Social Services',
        status: 'planning',
        location: 'Chicago',
        members: 5,
        createdAt: '2024-01-28',
        image: '/api/placeholder/400/250'
      },
      {
        id: '4',
        title: 'Digital Literacy for Seniors',
        description: 'Teaching older adults essential digital skills to bridge the technology gap',
        category: 'Education',
        status: 'active',
        location: 'Miami',
        members: 12,
        createdAt: '2024-02-10',
        image: '/api/placeholder/400/250'
      }
    ]

    setSaps(mockSAPs)

    setSaps(mockSAPs)
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
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'planning': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleJoinSAP = (sapId: string) => {
    // TODO: Implement join functionality
    console.log(`Joining SAP with ID: ${sapId}`)
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
              <h1 className="text-3xl font-bold text-gray-900">SAP Hub</h1>
              <p className="text-gray-600 mt-1">Join or start your own Social Action Project</p>
            </div>
            <Link
              href="/sap-hub/new"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Start New SAP
            </Link>
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
                placeholder="Search SAPs..."
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

      {/* SAPs Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSAPs.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SAPs found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first Social Action Project</p>
            <Link
              href="/sap-hub/new"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create SAP
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
                    <div className="aspect-video bg-gray-100 rounded-t-xl flex items-center justify-center">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{sap.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(sap.status)}`}>
                          {sap.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sap.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {sap.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {sap.members}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleJoinSAP(sap.id)}
                          className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-1 text-sm"
                        >
                          <UserPlus className="w-4 h-4" />
                          Join
                        </button>
                        <Link
                          href={`/sap-hub/${sap.id}`}
                          className="flex-1 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center justify-center gap-1 border border-purple-600 rounded-lg py-2"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4" />
                        </Link>
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
                      <button
                        onClick={() => handleJoinSAP(sap.id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-1 text-sm"
                      >
                        <UserPlus className="w-4 h-4" />
                        Join
                      </button>
                      <Link
                        href={`/sap-hub/${sap.id}`}
                        className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
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
