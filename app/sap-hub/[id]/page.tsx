'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  Target,
  MapPin,
  Users,
  Calendar,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Edit,
  Share2,
  Trash2,
  X,
  Loader2,
  Tag,
  Clock,
  Star,
  TrendingUp,
  Award
} from 'lucide-react'

interface SAP {
  id: string
  title: string
  description: string
  problem: string | null
  category: string
  status: 'idea' | 'active' | 'completed' | 'complete'
  location: string
  members: number
  created_at: string
  creator_id: string
  required_skills: string[] | null
  target_members?: number
  image?: string
  banner_image?: string
}

interface Profile {
  full_name: string | null
  bio: string | null
  avatar_url?: string | null
}

interface Member {
  id: string
  user_id: string
  joined_at: string
  profiles: Profile | null
}

type MessageType = 'success' | 'error' | 'info'

interface Message {
  type: MessageType
  message: string
}

export default function SAPDetailPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const { id: sapId } = useParams<{ id: string }>()

  const [sap, setSap] = useState<SAP | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<Message | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (!authLoading && user && sapId) {
      loadSAPData()
    }
  }, [user, authLoading, sapId, router])

  const loadSAPData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        fetchSAPDetails(),
        checkIfJoined()
      ])
    } catch (error) {
      console.error('Error loading SAP data:', error)
      showMessage('error', 'Failed to load project details')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSAPDetails = async () => {
    const { data: sapData, error: sapError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', sapId)
      .single()

    if (sapError) throw sapError

    // Map the database field 'members' to 'target_members' for consistency
    const transformedSap: SAP = {
      ...sapData,
      target_members: sapData.members
    }

    setSap(transformedSap)

    const { data: membersData, error: membersError } = await supabase
      .from('project_members')
      .select(`
        id,
        user_id,
        joined_at,
        profiles (
          full_name,
          bio,
          avatar_url
        )
      `)
      .eq('project_id', sapId)

    if (membersError) throw membersError

    // Fix: Properly type the members data
    const transformedMembers: Member[] = (membersData || []).map(member => {
      // Handle the case where profiles might be an array or a single object
      const profileData = Array.isArray(member.profiles) 
        ? member.profiles[0] 
        : member.profiles

      return {
        id: member.id,
        user_id: member.user_id,
        joined_at: member.joined_at,
        profiles: profileData ? {
          full_name: profileData.full_name,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url
        } : null
      }
    })

    setMembers(transformedMembers)
  }

  const checkIfJoined = async () => {
    if (!user) return

    const { data } = await supabase
      .from('project_members')
      .select('id')
      .eq('project_id', sapId)
      .eq('user_id', user.id)
      .maybeSingle()

    setIsJoined(!!data)
  }

  const showMessage = (type: MessageType, text: string) => {
    setMessage({ type, message: text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleJoinSAP = async () => {
    if (!user || isJoined || isJoining) return

    if (sap?.target_members && members.length >= sap.target_members) {
      showMessage('error', 'This project has reached its member limit')
      return
    }

    setIsJoining(true)

    try {
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: sapId,
          user_id: user.id,
          joined_at: new Date().toISOString()
        })

      if (error) throw error

      setIsJoined(true)
      showMessage('success', 'Successfully joined the project!')
      await fetchSAPDetails()
    } catch (error) {
      console.error('Error joining SAP:', error)
      showMessage('error', 'Failed to join project. Please try again.')
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveSAP = async () => {
    if (!user || !isJoined || isLeaving) return

    const confirmLeave = window.confirm('Are you sure you want to leave this project?')
    if (!confirmLeave) return

    setIsLeaving(true)

    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', sapId)
        .eq('user_id', user.id)

      if (error) throw error

      setIsJoined(false)
      showMessage('success', 'Successfully left the project')
      await fetchSAPDetails()
    } catch (error) {
      console.error('Error leaving SAP:', error)
      showMessage('error', 'Failed to leave project. Please try again.')
    } finally {
      setIsLeaving(false)
    }
  }

  const handleDeleteSAP = async () => {
    if (!user || !isCreator) return

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project? This action cannot be undone and will remove all members.'
    )

    if (!confirmDelete) return

    setIsDeleting(true)

    try {
      await supabase
        .from('project_members')
        .delete()
        .eq('project_id', sapId)

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', sapId)

      if (error) throw error

      showMessage('success', 'Project deleted successfully')

      setTimeout(() => {
        router.push('/sap-hub')
      }, 1000)
    } catch (error) {
      console.error('Error deleting SAP:', error)
      showMessage('error', 'Failed to delete project. Please try again.')
      setIsDeleting(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: sap?.title,
          text: sap?.description || '',
          url: url
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        showMessage('success', 'Link copied to clipboard!')
      } catch (error) {
        showMessage('error', 'Failed to copy link')
      }
    }
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      idea: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Target className="w-4 h-4" />,
        label: 'Idea',
        gradient: 'from-yellow-500 to-orange-500'
      },
      active: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Active',
        gradient: 'from-green-500 to-emerald-500'
      },
      completed: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completed',
        gradient: 'from-blue-500 to-indigo-500'
      },
      complete: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <CheckCircle className="w-4 h-4" />,
        label: 'Completed',
        gradient: 'from-blue-500 to-indigo-500'
      }
    }
    return configs[status as keyof typeof configs] || configs.idea
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (!sap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">Project Not Found</h3>
          <p className="text-gray-600 mb-8 text-lg">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/sap-hub"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg inline-flex items-center gap-2 transition-all font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to SAP Hub
          </Link>
        </div>
      </div>
    )
  }

  const isCreator = user.id === sap.creator_id
  const isCompleted = sap.status === 'completed' || sap.status === 'complete'
  const isTargetReached = Boolean(sap.target_members && sap.target_members > 0 && members.length >= sap.target_members)
  const statusConfig = getStatusConfig(sap.status)
  const progress = sap.target_members ? (members.length / sap.target_members) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-16 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/sap-hub"
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Back to Hub</span>
            </Link>

            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 border border-gray-300 flex items-center gap-2 text-sm transition-all shadow-sm hover:shadow font-medium"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>

              {isCreator && (
                <>
                  <Link
                    href={`/sap-hub/${sapId}/edit`}
                    className="bg-white text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 border border-gray-300 flex items-center gap-2 text-sm transition-all shadow-sm hover:shadow font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={handleDeleteSAP}
                    disabled={isDeleting}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 text-sm transition-all shadow-sm hover:shadow font-medium"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Message Banner */}
      {message && (
        <MessageBanner
          type={message.type}
          message={message.message}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Main Content */}
      <main className="mt-30 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-72 sm:h-96 bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 overflow-hidden">
            {sap.image || sap.banner_image ? (
              <>
                <img
                  src={sap.image || sap.banner_image}
                  alt={sap.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Target className="w-24 h-24 text-purple-300" />
              </div>
            )}

            {/* Floating Status Badge */}
            <div className="absolute top-6 left-6">
              <span className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 ${statusConfig.color} backdrop-blur-md flex items-center gap-2 shadow-lg`}>
                {statusConfig.icon}
                {statusConfig.label}
              </span>
            </div>

            {/* Joined/Creator Badge */}
            {(isJoined || isCreator) && (
              <div className="absolute top-6 right-6">
                {isCreator ? (
                  <span className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 text-white backdrop-blur-md flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4" />
                    Your Project
                  </span>
                ) : (
                  <span className="px-5 py-2.5 rounded-xl text-sm font-bold bg-green-600 text-white backdrop-blur-md flex items-center gap-2 shadow-lg">
                    <CheckCircle className="w-4 h-4" />
                    Joined
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-10">
            {/* Title & Quick Info */}
            <div className="mb-8">
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {sap.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-lg border border-purple-200">
                  <Tag className="w-4 h-4" />
                  <span className="font-semibold">{sap.category}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium">{sap.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{new Date(sap.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            {sap.target_members && (
              <div className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-bold text-gray-900">Team Progress</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {members.length}<span className="text-gray-500">/{sap.target_members}</span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                      progress >= 100 ? 'from-green-500 to-emerald-500' : statusConfig.gradient
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {progress >= 100 ? 'Team is complete!' : `${Math.round(100 - progress)}% more to reach goal`}
                </p>
              </div>
            )}

            {/* Join/Leave Actions */}
            {!isCreator && (
              <JoinLeaveSection
                isCompleted={isCompleted}
                isJoined={isJoined}
                isTargetReached={isTargetReached}
                targetMembers={sap.target_members}
                currentMembers={members.length}
                isJoining={isJoining}
                isLeaving={isLeaving}
                onJoin={handleJoinSAP}
                onLeave={handleLeaveSAP}
              />
            )}

            {/* Description */}
            <Section title="About This Project" icon={<Target className="w-5 h-5" />}>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {sap.description}
              </p>
            </Section>

            {/* Problem Statement */}
            {sap.problem && (
              <Section title="Problem Statement" icon={<AlertCircle className="w-5 h-5" />}>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200">
                  <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
                    {sap.problem}
                  </p>
                </div>
              </Section>
            )}

            {/* Required Skills */}
            {sap.required_skills && sap.required_skills.length > 0 && (
              <Section title="Required Skills" icon={<Award className="w-5 h-5" />}>
                <div className="flex flex-wrap gap-3">
                  {sap.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-5 py-2.5 rounded-xl text-sm font-bold border-2 border-purple-200 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Team Members */}
            <Section
              title="Team Members"
              subtitle={`${members.length} ${members.length === 1 ? 'member' : 'members'}`}
              icon={<Users className="w-5 h-5" />}
            >
              {members.length === 0 ? (
                <EmptyMembers />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      isCreator={member.user_id === sap.creator_id}
                    />
                  ))}
                </div>
              )}
            </Section>

            {/* Project Stats */}
            <div className="border-t-2 border-gray-100 pt-10 mt-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard
                  value={members.length.toString()}
                  label="Team Members"
                  icon={<Users />}
                  color="purple"
                />
                <StatCard
                  value={sap.category}
                  label="Category"
                  icon={<Tag />}
                  color="blue"
                />
                <StatCard
                  value={statusConfig.label}
                  label="Status"
                  icon={statusConfig.icon}
                  color="green"
                />
                <StatCard
                  value={new Date(sap.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  label="Started"
                  icon={<Calendar />}
                  color="orange"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Message Banner Component
function MessageBanner({ type, message, onClose }: { type: MessageType; message: string; onClose: () => void }) {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200'
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  }

  return (
    <div className={`${styles[type]} border-b-2 px-4 py-4 animate-in slide-in-from-top duration-300`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="font-semibold">{message}</span>
        </div>
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Join/Leave Section Component
interface JoinLeaveSectionProps {
  isCompleted: boolean
  isJoined: boolean
  isTargetReached: boolean
  targetMembers?: number
  currentMembers: number
  isJoining: boolean
  isLeaving: boolean
  onJoin: () => void
  onLeave: () => void
}

function JoinLeaveSection({
  isCompleted,
  isJoined,
  isTargetReached,
  targetMembers,
  currentMembers,
  isJoining,
  isLeaving,
  onJoin,
  onLeave
}: JoinLeaveSectionProps) {
  if (isCompleted) {
    return (
      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-blue-900 font-bold text-lg">Project Completed!</p>
            <p className="text-blue-700 text-sm mt-1">Thank you to all amazing contributors!</p>
          </div>
        </div>
      </div>
    )
  }

  if (isJoined) {
    return (
      <div className="mb-8">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-900 font-bold text-lg">You're part of this team!</p>
              <p className="text-green-700 text-sm mt-1">Keep up the amazing work together.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onLeave}
          disabled={isLeaving}
          className="w-full sm:w-auto bg-red-600 text-white px-8 py-3.5 rounded-xl hover:bg-red-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold transition-all"
        >
          {isLeaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Leaving...
            </>
          ) : (
            <>
              <X className="w-5 h-5" />
              Leave Project
            </>
          )}
        </button>
      </div>
    )
  }

  if (isTargetReached) {
    return (
      <div className="mb-8 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-orange-900 font-bold text-lg">Team Complete!</p>
              <p className="text-orange-700 text-sm mt-1">
                This project reached its target ({currentMembers}/{targetMembers} members)
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <button
        onClick={onJoin}
        disabled={isJoining}
        className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 text-white px-10 py-4 rounded-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-bold text-lg transition-all transform hover:scale-105"
      >
        {isJoining ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
            Joining...
          </>
        ) : (
          <>
            <UserPlus className="w-6 h-6" />
            Join This Project
          </>
        )}
      </button>
      {targetMembers && (
        <p className="text-sm text-gray-600 mt-3 font-medium">
          {currentMembers} / {targetMembers} members • {targetMembers - currentMembers} spots remaining
        </p>
      )}
    </div>
  )
}

// Section Component
function Section({
  title,
  subtitle,
  icon,
  children
}: {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {icon && <div className="text-purple-600">{icon}</div>}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {subtitle && <span className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-lg">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

// Empty Members Component
function EmptyMembers() {
  return (
    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl border-2 border-dashed border-gray-300">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-purple-600" />
      </div>
      <p className="text-gray-700 font-bold text-lg mb-1">No members yet</p>
      <p className="text-gray-500 text-sm">Be the first to join this amazing project!</p>
    </div>
  )
}

// Member Card Component
function MemberCard({ member, isCreator }: { member: Member; isCreator: boolean }) {
  const profile = member.profiles
  const fullName = profile?.full_name || 'Anonymous'
  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50/30 rounded-2xl p-5 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden group-hover:scale-110 transition-transform">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-xl">{initials}</span>
            )}
          </div>
          {isCreator && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white">
              <Star className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-gray-900 truncate text-lg">
              {fullName}
            </p>
            {isCreator && (
              <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-2 py-0.5 rounded-md text-xs font-bold border border-purple-200">
                Creator
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Joined {new Date(member.joined_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  value,
  label,
  icon,
  color
}: {
  value: string
  label: string
  icon: React.ReactNode
  color: 'purple' | 'blue' | 'green' | 'orange'
}) {
  const gradients = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600'
  }

  return (
    <div className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradients[color]} rounded-xl flex items-center justify-center text-white mb-3 shadow-md`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  )
}