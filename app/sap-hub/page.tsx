'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Users, 
  Target, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  UserPlus, 
  X,
  Loader2,
  TrendingUp,
  Filter,
  ChevronDown,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react'

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
  creator_id: string
  creator: {
    full_name: string
    avatar_url?: string
  }
  isJoined: boolean
}

type ViewMode = 'grid' | 'list'
type SortOption = 'newest' | 'oldest' | 'most_members' | 'least_members'

export default function SAPHubPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [saps, setSaps] = useState<SAP[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('sapHubData')
      return cached ? JSON.parse(cached) : []
    }
    return []
  })
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      const cached = sessionStorage.getItem('sapHubData')
      const fetched = sessionStorage.getItem('sapHubFetched') === 'true'
      return !fetched || !cached
    }
    return true
  })
  const [showFilters, setShowFilters] = useState(false)
  const [hasFetched, setHasFetched] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('sapHubFetched') === 'true'
    }
    return false
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
      return
    }

    if (!user) return

    // Only fetch if we haven't fetched before and we don't have data
    if (!hasFetched && saps.length === 0) {
      fetchSAPs()
    } else {
      setIsLoading(false)
    }
  }, [user, loading, router, hasFetched, saps.length])

  // Reset loading state when component unmounts to prevent stale loading state
  useEffect(() => {
    return () => {
      setIsLoading(false)
    }
  }, [])

  const fetchSAPs = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (projectsError) throw projectsError

      if (!projectsData || projectsData.length === 0) {
        setSaps([])
        setIsLoading(false)
        return
      }

      const projectIds = projectsData.map(project => project.id)
      const creatorIds = [...new Set(projectsData.map(project => project.creator_id))]

      // Fetch members data
      const { data: membersData, error: membersError } = await supabase
        .from('project_members')
        .select('project_id, user_id')
        .in('project_id', projectIds)

      if (membersError) throw membersError

      // Fetch creator profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', creatorIds)

      if (profilesError) throw profilesError

      // Build lookup maps
      const membersCountMap = new Map<string, number>()
      const joinedProjectsSet = new Set<string>()
      
      membersData?.forEach(member => {
        const currentCount = membersCountMap.get(member.project_id) || 0
        membersCountMap.set(member.project_id, currentCount + 1)
        
        if (member.user_id === user.id) {
          joinedProjectsSet.add(member.project_id)
        }
      })

      const profilesMap = new Map(profilesData?.map(profile => [profile.id, profile]) || [])

      // Transform data
      const transformedSAPs: SAP[] = projectsData.map(project => {
        const creatorProfile = profilesMap.get(project.creator_id)
        const memberCount = membersCountMap.get(project.id) || 0
        const isJoined = joinedProjectsSet.has(project.id)

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
          target_members: project.members, // DB field 'members' = target
          creator_id: project.creator_id,
          creator: {
            full_name: creatorProfile?.full_name || 'Anonymous',
            avatar_url: creatorProfile?.avatar_url
          },
          isJoined
        }
      })

      setSaps(transformedSAPs)
      setHasFetched(true)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sapHubData', JSON.stringify(transformedSAPs))
        sessionStorage.setItem('sapHubFetched', 'true')
      }
    } catch (error) {
      console.error('Error fetching SAPs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinSAP = useCallback(async (sapId: string) => {
    if (!user) return

    const sap = saps.find(s => s.id === sapId)
    if (!sap) return

    // Check if target is reached
    if (sap.target_members && sap.members >= sap.target_members) {
      alert('This project has reached its member limit')
      return
    }

    try {
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: sapId,
          user_id: user.id,
          joined_at: new Date().toISOString()
        })

      if (error) throw error

      // Update local state
      const updatedSaps = prevSaps.map(s =>
        s.id === sapId
          ? { ...s, members: s.members + 1, isJoined: true }
          : s
      )
      setSaps(updatedSaps)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sapHubData', JSON.stringify(updatedSaps))
      }
    } catch (error) {
      console.error('Error joining SAP:', error)
      alert('Failed to join project. Please try again.')
    }
  }, [user, saps])

  const handleLeaveSAP = useCallback(async (sapId: string) => {
    if (!user) return

    const confirmLeave = window.confirm('Are you sure you want to leave this project?')
    if (!confirmLeave) return

    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', sapId)
        .eq('user_id', user.id)

      if (error) throw error

      // Update local state
      setSaps(prevSaps =>
        prevSaps.map(s =>
          s.id === sapId
            ? { ...s, members: Math.max(0, s.members - 1), isJoined: false }
            : s
        )
      )
    } catch (error) {
      console.error('Error leaving SAP:', error)
      alert('Failed to leave project. Please try again.')
    }
  }, [user])

  const filteredAndSortedSAPs = useCallback(() => {
    let filtered = saps.filter(sap => {
      const matchesSearch = 
        sap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sap.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sap.problem?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategory === 'all' || sap.category === selectedCategory
      const matchesStatus = selectedStatus === 'all' || sap.status === selectedStatus
      
      return matchesSearch && matchesCategory && matchesStatus
    })

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'most_members':
        filtered.sort((a, b) => b.members - a.members)
        break
      case 'least_members':
        filtered.sort((a, b) => a.members - b.members)
        break
    }

    return filtered
  }, [saps, searchTerm, selectedCategory, selectedStatus, sortBy])

  const categories = ['all', ...Array.from(new Set(saps.map(sap => sap.category)))]
  const statuses = ['all', 'idea', 'active', 'completed']

  const stats = {
    total: saps.length,
    joined: saps.filter(s => s.isJoined).length,
    active: saps.filter(s => s.status === 'active').length,
    completed: saps.filter(s => s.status === 'completed' || s.status === 'complete').length
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      idea: { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Target className="w-3 h-3" />,
        label: 'Idea'
      },
      active: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <TrendingUp className="w-3 h-3" />,
        label: 'Active'
      },
      completed: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Completed'
      },
      complete: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CheckCircle className="w-3 h-3" />,
        label: 'Completed'
      }
    }
    return configs[status as keyof typeof configs] || configs.idea
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  const filteredSAPs = filteredAndSortedSAPs()

  return (
    <div className="mt-17 min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Hero Header */}
      <header className="pt-10 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  SAP Hub
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Discover and join Social Action Projects that make a difference
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/my-saps"
                className="bg-white text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 border border-gray-300 shadow-sm font-medium"
              >
                <Users className="w-4 h-4" />
                My SAPs
              </Link>
              <Link
                href="/sap-hub/new"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all flex items-center gap-2 font-medium"
              >
                <Plus className="w-4 h-4" />
                Start New SAP
              </Link>
            </div>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <StatCard icon={<Target />} value={stats.total} label="Total Projects" color="purple" />
            <StatCard icon={<UserPlus />} value={stats.joined} label="Joined" color="blue" />
            <StatCard icon={<TrendingUp />} value={stats.active} label="Active" color="green" />
            <StatCard icon={<CheckCircle />} value={stats.completed} label="Completed" color="gray" />
          </div> */}
        </div>
      </header>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by title, description, or problem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm bg-gray-50 hover:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition-all font-medium ${
                showFilters 
                  ? 'bg-purple-50 text-purple-600 border-purple-200' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most_members">Most Members</option>
                  <option value="least_members">Least Members</option>
                </select>
              </div>
            </div>
          )}

          {/* View Mode & Results */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600 font-medium">
              {filteredSAPs.length} {filteredSAPs.length === 1 ? 'project' : 'projects'} found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 mr-2">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SAPs Grid/List */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredSAPs.length === 0 ? (
          <EmptyState 
            hasFilters={searchTerm !== '' || selectedCategory !== 'all' || selectedStatus !== 'all'} 
            searchTerm={searchTerm}
          />
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredSAPs.map(sap => (
              <SAPCard
                key={sap.id}
                sap={sap}
                viewMode={viewMode}
                currentUserId={user.id}
                onJoin={handleJoinSAP}
                onLeave={handleLeaveSAP}
                getStatusConfig={getStatusConfig}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// Stat Card Component
function StatCard({ 
  icon, 
  value, 
  label, 
  color 
}: { 
  icon: React.ReactNode
  value: number
  label: string
  color: 'purple' | 'blue' | 'green' | 'gray'
}) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    gray: 'from-gray-500 to-gray-600'
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-600 font-medium">{label}</p>
        </div>
      </div>
    </div>
  )
}

// Empty State Component
function EmptyState({ hasFilters, searchTerm }: { hasFilters: boolean; searchTerm: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Target className="w-10 h-10 text-purple-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {hasFilters ? 'No projects found' : 'No projects yet'}
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        {hasFilters 
          ? `No projects match your search "${searchTerm}". Try adjusting your filters.`
          : 'Be the first to create a Social Action Project and make a difference!'
        }
      </p>
      {!hasFilters && (
        <Link
          href="/sap-hub/new"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Create Your First SAP
        </Link>
      )}
    </div>
  )
}

// SAP Card Component
interface SAPCardProps {
  sap: SAP
  viewMode: ViewMode
  currentUserId: string
  onJoin: (sapId: string) => void
  onLeave: (sapId: string) => void
  getStatusConfig: (status: string) => { color: string; icon: React.ReactNode; label: string }
}

function SAPCard({ sap, viewMode, currentUserId, onJoin, onLeave, getStatusConfig }: SAPCardProps) {
  const isCompleted = sap.status === 'completed' || sap.status === 'complete'
  const isCreator = sap.creator_id === currentUserId
  const isTargetReached = Boolean(sap.target_members && sap.target_members > 0 && sap.members >= sap.target_members)
  const statusConfig = getStatusConfig(sap.status)

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden group ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {viewMode === 'grid' ? (
        <GridView
          sap={sap}
          isCompleted={isCompleted}
          isCreator={isCreator}
          isTargetReached={isTargetReached}
          onJoin={onJoin}
          onLeave={onLeave}
          statusConfig={statusConfig}
        />
      ) : (
        <ListView
          sap={sap}
          isCompleted={isCompleted}
          isCreator={isCreator}
          isTargetReached={isTargetReached}
          onJoin={onJoin}
          onLeave={onLeave}
          statusConfig={statusConfig}
        />
      )}
    </div>
  )
}

// Grid View Component
function GridView({ 
  sap, 
  isCompleted, 
  isCreator, 
  isTargetReached, 
  onJoin, 
  onLeave,
  statusConfig
}: Omit<SAPCardProps, 'viewMode' | 'currentUserId' | 'getStatusConfig'> & { 
  isCompleted: boolean
  isCreator: boolean
  isTargetReached: boolean
  statusConfig: { color: string; icon: React.ReactNode; label: string }
}) {
  const progress = sap.target_members ? (sap.members / sap.target_members) * 100 : 0

  return (
    <>
      {/* Image */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 overflow-hidden">
        {sap.image || sap.banner_image ? (
          <img
            src={sap.image || sap.banner_image}
            alt={sap.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Target className="w-16 h-16 text-purple-300" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusConfig.color} backdrop-blur-md flex items-center gap-1.5 shadow-sm`}>
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        </div>

        {/* Joined Badge */}
        {sap.isJoined && !isCreator && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
              <CheckCircle className="w-3 h-3" />
              Joined
            </span>
          </div>
        )}

        {/* Creator Badge */}
        {isCreator && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 text-white backdrop-blur-md flex items-center gap-1.5 shadow-sm">
              <Star className="w-3 h-3" />
              Your Project
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <Link href={`/sap-hub/${sap.id}`} className="block mb-3 group/title">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover/title:text-purple-600 transition-colors">
            {sap.title}
          </h3>
        </Link>

        {/* Problem */}
        {sap.problem && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {sap.problem}
          </p>
        )}

        {/* Creator */}
        <CreatorInfo creator={sap.creator} />

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">{sap.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(sap.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Progress Bar */}
        {sap.target_members && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-600 font-medium">Team Progress</span>
              <span className="text-gray-900 font-semibold">{sap.members}/{sap.target_members}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  progress >= 100 ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <ActionButtons
          sap={sap}
          isCompleted={isCompleted}
          isCreator={isCreator}
          isTargetReached={isTargetReached}
          onJoin={onJoin}
          onLeave={onLeave}
        />
      </div>
    </>
  )
}

// List View Component
function ListView({ 
  sap, 
  isCompleted, 
  isCreator, 
  isTargetReached, 
  onJoin, 
  onLeave,
  statusConfig
}: Omit<SAPCardProps, 'viewMode' | 'currentUserId' | 'getStatusConfig'> & { 
  isCompleted: boolean
  isCreator: boolean
  isTargetReached: boolean
  statusConfig: { color: string; icon: React.ReactNode; label: string }
}) {
  return (
    <>
      {/* Thumbnail */}
      <div className="w-48 h-full bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 flex-shrink-0 relative overflow-hidden">
        {sap.image || sap.banner_image ? (
          <img
            src={sap.image || sap.banner_image}
            alt={sap.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Target className="w-12 h-12 text-purple-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/sap-hub/${sap.id}`} className="block group/title">
              <h3 className="text-xl font-bold text-gray-900 group-hover/title:text-purple-600 transition-colors mb-2">
                {sap.title}
              </h3>
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${statusConfig.color} flex items-center gap-1.5`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
              {sap.isJoined && !isCreator && (
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-800 border border-green-200 flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3" />
                  Joined
                </span>
              )}
              {isCreator && (
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1.5">
                  <Star className="w-3 h-3" />
                  Your Project
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sap.description}</p>

        <div className="flex items-center gap-6 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{sap.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>{sap.members}{sap.target_members && `/${sap.target_members}`} members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(sap.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-auto">
          <ActionButtons
            sap={sap}
            isCompleted={isCompleted}
            isCreator={isCreator}
            isTargetReached={isTargetReached}
            onJoin={onJoin}
            onLeave={onLeave}
            isListView
          />
        </div>
      </div>
    </>
  )
}

// Creator Info Component
function CreatorInfo({ creator }: { creator: SAP['creator'] }) {
  const initials = creator.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-7 h-7 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
        {creator.avatar_url ? (
          <img
            src={creator.avatar_url}
            alt={creator.full_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-bold text-xs">{initials}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600 truncate">
          <span className="font-medium text-gray-900">{creator.full_name}</span>
        </p>
      </div>
    </div>
  )
}

// Action Buttons Component
interface ActionButtonsProps {
  sap: SAP
  isCompleted: boolean
  isCreator: boolean
  isTargetReached: boolean
  onJoin: (sapId: string) => void
  onLeave: (sapId: string) => void
  isListView?: boolean
}

function ActionButtons({ 
  sap, 
  isCompleted, 
  isCreator, 
  isTargetReached, 
  onJoin, 
  onLeave,
  isListView = false 
}: ActionButtonsProps) {
  const containerClass = isListView ? 'flex gap-2' : 'flex gap-2'

  return (
    <div className={containerClass}>
      {isCompleted ? (
        // Completed Project
        <>
          <div className="flex-1 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold border border-blue-200">
            <CheckCircle className="w-4 h-4" />
            Completed
          </div>
          <Link
            href={`/sap-hub/${sap.id}`}
            className="flex-1 text-purple-600 hover:text-white hover:bg-purple-600 text-sm font-semibold flex items-center justify-center gap-1.5 border-2 border-purple-600 rounded-xl py-2.5 transition-all"
          >
            View Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      ) : isCreator ? (
        // Creator Actions
        <>
          <Link
            href={`/sap-hub/${sap.id}/edit`}
            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-sm hover:shadow-md"
          >
            <span>Manage</span>
          </Link>
          <Link
            href={`/sap-hub/${sap.id}`}
            className="flex-1 text-purple-600 hover:text-white hover:bg-purple-600 text-sm font-semibold flex items-center justify-center gap-1.5 border-2 border-purple-600 rounded-xl py-2.5 transition-all"
          >
            View
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      ) : sap.isJoined ? (
        // Already Joined
        <>
          <button
            onClick={() => onLeave(sap.id)}
            className="flex-1 bg-red-50 text-red-700 px-4 py-2.5 rounded-xl hover:bg-red-600 hover:text-white flex items-center justify-center gap-2 text-sm font-semibold border border-red-200 transition-all"
          >
            <X className="w-4 h-4" />
            Leave
          </button>
          <Link
            href={`/sap-hub/${sap.id}`}
            className="flex-1 text-purple-600 hover:text-white hover:bg-purple-600 text-sm font-semibold flex items-center justify-center gap-1.5 border-2 border-purple-600 rounded-xl py-2.5 transition-all"
          >
            View
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      ) : isTargetReached ? (
        // Full
        <>
          <div className="flex-1 bg-orange-50 text-orange-700 px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold border border-orange-200">
            <Users className="w-4 h-4" />
            Full
          </div>
          <Link
            href={`/sap-hub/${sap.id}`}
            className="flex-1 text-purple-600 hover:text-white hover:bg-purple-600 text-sm font-semibold flex items-center justify-center gap-1.5 border-2 border-purple-600 rounded-xl py-2.5 transition-all"
          >
            View
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      ) : (
        // Available to Join
        <>
          <button
            onClick={() => onJoin(sap.id)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2.5 rounded-xl hover:shadow-lg flex items-center justify-center gap-2 text-sm font-semibold transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Join Now
          </button>
          <Link
            href={`/sap-hub/${sap.id}`}
            className="flex-1 text-purple-600 hover:text-white hover:bg-purple-600 text-sm font-semibold flex items-center justify-center gap-1.5 border-2 border-purple-600 rounded-xl py-2.5 transition-all"
          >
            View
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </div>
  )
}