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
  Tag
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

interface Member {
  id: string
  user_id: string
  joined_at: string
  profiles: {
    full_name: string
    bio: string | null
    avatar_url?: string
  } | null
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
    const transformedSap = {
      ...sapData,
      target_members: sapData.members // Database field is 'members', we use 'target_members' in the app
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

    setMembers((membersData || []) as Member[])
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

    // Check if target is reached
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
      // Delete project members first (cascade should handle this, but being explicit)
      await supabase
        .from('project_members')
        .delete()
        .eq('project_id', sapId)

      // Delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', sapId)

      if (error) throw error

      showMessage('success', 'Project deleted successfully')
      
      // Redirect after a brief delay
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
          text: sap?.description,
          url: url
        })
      } catch (error) {
        // User cancelled or share failed
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        showMessage('success', 'Link copied to clipboard!')
      } catch (error) {
        showMessage('error', 'Failed to copy link')
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      idea: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      active: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-blue-100 text-blue-800 border-blue-200',
      complete: 'bg-blue-100 text-blue-800 border-blue-200'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (!sap) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h3>
          <p className="text-gray-600 mb-8">
            The project you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/sap-hub"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 inline-flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to SAP Hub
          </Link>
        </div>
      </div>
    )
  }

  const isCreator = user.id === sap.creator_id
  const isCompleted = sap.status === 'completed' || sap.status === 'complete'
  const isTargetReached = Boolean(sap.target_members && sap.target_members > 0 && members.length >= sap.target_members)

  return (
    <div className="mt-30 min-h-screen bg-gray-50">
      {/* Header */}
      <header className=" w-5xl m-auto z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/sap-hub"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to SAP Hub</span>
            </Link>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className="bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-300 flex items-center gap-2 text-sm transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              
              {isCreator && (
                <>
                  <Link
                    href={`/sap-hub/${sapId}/edit`}
                    className="bg-white text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 border border-gray-300 flex items-center gap-2 text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={handleDeleteSAP}
                    disabled={isDeleting}
                    className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 text-sm transition-colors"
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-64 sm:h-80 bg-gradient-to-br from-purple-100 via-purple-200 to-blue-100">
            {sap.image || sap.banner_image ? (
              <img
                src={sap.image || sap.banner_image}
                alt={sap.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Target className="w-20 h-20 text-purple-400" />
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(sap.status)} backdrop-blur-sm`}>
                {getStatusLabel(sap.status)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Title & Meta */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {sap.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">{sap.category}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{sap.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>
                    {members.length}
                    {sap.target_members && ` / ${sap.target_members}`} members
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>Started {new Date(sap.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

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
            <Section title="About This Project">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {sap.description}
              </p>
            </Section>

            {/* Problem Statement */}
            {sap.problem && (
              <Section title="Problem Statement">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {sap.problem}
                  </p>
                </div>
              </Section>
            )}

            {/* Required Skills */}
            {sap.required_skills && sap.required_skills.length > 0 && (
              <Section title="Required Skills">
                <div className="flex flex-wrap gap-2">
                  {sap.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium border border-purple-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* Members Section */}
            <Section 
              title="Team Members" 
              subtitle={`${members.length} member${members.length !== 1 ? 's' : ''}`}
            >
              {members.length === 0 ? (
                <EmptyMembers />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {members.map((member) => (
                    <MemberCard key={member.id} member={member} isCreator={member.user_id === sap.creator_id} />
                  ))}
                </div>
              )}
            </Section>

            {/* Project Stats */}
            <div className="border-t pt-8 mt-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <StatCard
                  value={members.length.toString()}
                  label="Members"
                  icon={<Users className="w-5 h-5 text-purple-600" />}
                />
                <StatCard
                  value={sap.category}
                  label="Category"
                  icon={<Tag className="w-5 h-5 text-purple-600" />}
                />
                <StatCard
                  value={getStatusLabel(sap.status)}
                  label="Status"
                  icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
                />
                <StatCard
                  value={new Date(sap.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  label="Created"
                  icon={<Calendar className="w-5 h-5 text-purple-600" />}
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
    <div className={`${styles[type]} border-b px-4 py-3`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {icons[type]}
          <span className="font-medium">{message}</span>
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
  // Log for debugging
  console.log('JoinLeaveSection:', { 
    isCompleted, 
    isJoined, 
    isTargetReached, 
    targetMembers, 
    currentMembers 
  })

  if (isCompleted) {
    return (
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-blue-900 font-semibold">This project has been completed</p>
            <p className="text-blue-700 text-sm mt-1">Thank you to all contributors!</p>
          </div>
        </div>
      </div>
    )
  }

  // ✅ CRITICAL: Check if user is joined FIRST
  if (isJoined) {
    return (
      <div className="mb-8">
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-green-900 font-semibold">You're a member of this project</p>
              <p className="text-green-700 text-sm mt-1">Great! Keep up the amazing work.</p>
            </div>
          </div>
        </div>
        
        <button
          onClick={onLeave}
          disabled={isLeaving}
          className="w-full sm:w-auto bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
        >
          {isLeaving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Leaving...
            </>
          ) : (
            <>
              <X className="w-5 h-5" />
              Leave This Project
            </>
          )}
        </button>
      </div>
    )
  }

  // ✅ THEN check if target is reached (for users NOT joined)
  if (isTargetReached) {
    return (
      <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-orange-900 font-semibold">Target members reached</p>
              <p className="text-orange-700 text-sm mt-1">
                This project is currently full ({currentMembers}/{targetMembers} members)
              </p>
            </div>
          </div>
          <button
            disabled
            className="bg-orange-500 text-white px-6 py-2 rounded-lg cursor-not-allowed opacity-75 whitespace-nowrap text-sm font-medium"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    )
  }

  // ✅ Default: Available to join
  return (
    <div className="mb-8">
      <button
        onClick={onJoin}
        disabled={isJoining}
        className="w-full sm:w-auto bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-colors"
      >
        {isJoining ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Joining...
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            Join This Project
          </>
        )}
      </button>
      {targetMembers && (
        <p className="text-sm text-gray-600 mt-2">
          {currentMembers} / {targetMembers} members joined
        </p>
      )}
    </div>
  )
}

// Section Component
function Section({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string
  subtitle?: string
  children: React.ReactNode 
}) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <span className="text-sm text-gray-500">{subtitle}</span>}
      </div>
      {children}
    </div>
  )
}

// Empty Members Component
function EmptyMembers() {
  return (
    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
      <p className="text-gray-600 font-medium">No members yet</p>
      <p className="text-gray-500 text-sm mt-1">Be the first to join this project!</p>
    </div>
  )
}

// Member Card Component
function MemberCard({ member, isCreator }: { member: Member; isCreator: boolean }) {
  const initials = (member.profiles?.full_name || 'Anonymous')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-200 hover:bg-purple-50/50 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {member.profiles?.avatar_url ? (
            <img
              src={member.profiles.avatar_url}
              alt={member.profiles.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-lg">{initials}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 truncate">
              {member.profiles?.full_name || 'Anonymous'}
            </p>
            {isCreator && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                Project Initiator
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
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
  icon 
}: { 
  value: string
  label: string
  icon: React.ReactNode 
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-50 rounded-lg mb-2">
        {icon}
      </div>
      <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}