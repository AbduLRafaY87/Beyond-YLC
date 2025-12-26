'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  LogOut,
  Edit3,
  Save,
  X,
  Camera,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Target,
  Settings,
  Shield,
  Bell,
  Lock,
  TrendingUp,
  Award,
  Heart,
  CheckCircle
} from 'lucide-react'

export default function Profile() {
  const { user: authUser, updateProfileImage } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [interestsInput, setInterestsInput] = useState('')
  const [skillsInput, setSkillsInput] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    ylcBatch: '',
    interests: [] as string[],
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    occupation: '',
    organization: '',
    skills: [] as string[],
    privacy: 'public' as 'public' | 'private',
    notifications: {
      email: true,
      push: true,
      marketing: false
    }
  })
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const getProfile = async () => {
    if (!authUser?.id) return

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, ylc_batch, interests, bio, location, website, github, linkedin, twitter, occupation, organization, skills, privacy, notifications, avatar_url, created_at, updated_at')
        .eq('id', authUser.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error)
        // Don't throw, just set user to null and continue with defaults
      }

      setUser(profile || null)

      setFormData({
        fullName: profile?.full_name || authUser.user_metadata?.full_name || '',
        email: authUser.email || '',
        ylcBatch: profile?.ylc_batch || '',
        interests: profile?.interests || [],
        bio: profile?.bio || '',
        location: profile?.location || '',
        website: profile?.website || '',
        github: profile?.github || '',
        linkedin: profile?.linkedin || '',
        twitter: profile?.twitter || '',
        occupation: profile?.occupation || '',
        organization: profile?.organization || '',
        skills: profile?.skills || [],
        privacy: profile?.privacy || 'public',
        notifications: profile?.notifications || {
          email: true,
          push: true,
          marketing: false
        }
      })

      setProfileImage(profile?.avatar_url || null)
    } catch (error) {
      console.error('Error loading profile:', error)
      // Set user to null and continue with defaults
      setUser(null)
      setFormData({
        fullName: authUser.user_metadata?.full_name || '',
        email: authUser.email || '',
        ylcBatch: '',
        interests: [],
        bio: '',
        location: '',
        website: '',
        github: '',
        linkedin: '',
        twitter: '',
        occupation: '',
        organization: '',
        skills: [],
        privacy: 'public',
        notifications: {
          email: true,
          push: true,
          marketing: false
        }
      })
      setProfileImage(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authUser) return
    getProfile()
  }, [authUser])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tab = searchParams.get('tab')
    if (tab && tabs.some((t: any) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [])

  // ProtectedRoute handles authentication, so we can assume user is authenticated here

  const handleUpdateProfile = async () => {
    try {
      // Update or insert profile in profiles table
      const result = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          full_name: formData.fullName,
          ylc_batch: formData.ylcBatch,
          interests: formData.interests,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          occupation: formData.occupation,
          organization: formData.organization,
          skills: formData.skills,
          privacy: formData.privacy,
          notifications: formData.notifications
        })

      if (result.error) throw result.error

      setEditing(false)
      await getProfile() // Refresh profile data
    } catch (error: unknown) {
      console.error('Error updating profile:', error)
    }
  }
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      // First, get the current profile to store the old avatar URL for deletion
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', authUser.id)
        .single()

      const oldAvatarUrl = currentProfile?.avatar_url

      // Upload the new image
      const fileExt = file.name.split('.').pop()
      const fileName = `${authUser.id}-${Math.random()}.${fileExt}`
      const filePath = fileName

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)


      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', authUser.id)

      if (updateError) throw updateError

      // Update local state immediately with timestamp to avoid caching
      setProfileImage(data.publicUrl + '?t=' + Date.now())

      // Update AuthContext to reflect the change in Navbar
      updateProfileImage(data.publicUrl + '?t=' + Date.now())

      // Refresh the profile data to update AuthContext
      await getProfile()

      // Now delete the old image (after successful upload and update)
      if (oldAvatarUrl && oldAvatarUrl !== data.publicUrl) {
        // Extract the file path from the public URL, removing any query parameters
        // URL format: https://[project].supabase.co/storage/v1/object/public/avatars/[filename]?t=...
        const urlWithoutQuery = oldAvatarUrl.split('?')[0] // Remove query parameters
        const urlParts = urlWithoutQuery.split('/')
        const oldFileName = urlParts[urlParts.length - 1]
        const oldFilePath = `avatars/${oldFileName}`

        // Delete the old file (don't fail if this errors)
        try {
          await supabase.storage
            .from('avatars')
            .remove([oldFilePath])
        } catch (deleteError) {
          console.warn('Failed to delete old avatar:', deleteError)
        }
      }

    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-8">
            {/* Profile Header with Avatar Upload */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 sm:px-8 py-8 sm:py-12 text-white relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Failed to load profile image:', profileImage)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <User className="w-10 h-10 sm:w-12 sm:h-12" />
                    )}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="absolute -bottom-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl font-black">
                    {formData.fullName || 'Anonymous User'}
                  </h2>
                  <p className="text-purple-200 mt-1 text-sm sm:text-base">{formData.email}</p>
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-200">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      Member since {user ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                    </div>
                    {formData.location && (
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-purple-200">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formData.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="px-4 sm:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleUpdateProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full sm:w-auto"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.fullName || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900">{formData.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., New York, NY"
                      />
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">{formData.location || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.occupation}
                        onChange={(e) => setFormData(prev => ({ ...prev, occupation: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Software Engineer"
                      />
                    ) : (
                      <div className="flex items-center gap-2 py-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <p className="text-gray-900">{formData.occupation || 'Not provided'}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Tech Corp"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.organization || 'Not provided'}</p>
                    )}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Additional Information
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YLC Batch</label>
                    {editing ? (
                      <input
                        type="text"
                        value={formData.ylcBatch}
                        onChange={(e) => setFormData(prev => ({ ...prev, ylcBatch: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., YLC 2023, YLC 2024"
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.ylcBatch || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    {editing ? (
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900 py-2">{formData.bio || 'No bio provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
                    {editing ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={interestsInput}
                            onChange={(e) => setInterestsInput(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Add an interest"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                if (interestsInput.trim()) {
                                  setFormData(prev => ({
                                    ...prev,
                                    interests: [...prev.interests, interestsInput.trim()]
                                  }))
                                  setInterestsInput('')
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (interestsInput.trim()) {
                                setFormData(prev => ({
                                  ...prev,
                                  interests: [...prev.interests, interestsInput.trim()]
                                }))
                                setInterestsInput('')
                              }
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                            >
                              {interest}
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  interests: prev.interests.filter((_, i) => i !== index)
                                }))}
                                className="ml-1 text-purple-600 hover:text-purple-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 py-2">
                        {formData.interests.length > 0 ? (
                          formData.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                            >
                              {interest}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No interests provided</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    {editing ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={skillsInput}
                            onChange={(e) => setSkillsInput(e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Add a skill"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault()
                                if (skillsInput.trim()) {
                                  setFormData(prev => ({
                                    ...prev,
                                    skills: [...prev.skills, skillsInput.trim()]
                                  }))
                                  setSkillsInput('')
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (skillsInput.trim()) {
                                setFormData(prev => ({
                                  ...prev,
                                  skills: [...prev.skills, skillsInput.trim()]
                                }))
                                setSkillsInput('')
                              }
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  skills: prev.skills.filter((_, i) => i !== index)
                                }))}
                                className="ml-1 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2 py-2">
                        {formData.skills.length > 0 ? (
                          formData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500">No skills provided</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Social Links
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
                    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
                    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
                    { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' }
                  ].map(({ key, label, icon: Icon, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {label}
                      </label>
                      {editing ? (
                        <input
                          type="url"
                          value={formData[key as keyof typeof formData] as string}
                          onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={placeholder}
                        />
                      ) : (
                        <p className="text-gray-900 py-2">
                          {formData[key as keyof typeof formData] ? (
                            <a
                              href={formData[key as keyof typeof formData] as string}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-700 hover:underline"
                            >
                              {formData[key as keyof typeof formData] as string}
                            </a>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'settings':
        return (
          <div className="px-8 py-8 space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">Account Settings</h3>

            {/* Privacy Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Settings
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Profile Visibility</p>
                    <p className="text-sm text-gray-600">Control who can see your profile</p>
                  </div>
                  <select
                    value={formData.privacy}
                    onChange={(e) => setFormData(prev => ({ ...prev, privacy: e.target.value as 'public' | 'private' }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpdateProfile}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Privacy Settings
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h4>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                  { key: 'push', label: 'Push Notifications', description: 'Receive push notifications in browser' },
                  { key: 'marketing', label: 'Marketing Communications', description: 'Receive promotional content and updates' }
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{label}</p>
                      <p className="text-sm text-gray-600">{description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.notifications[key as keyof typeof formData.notifications]}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [key]: e.target.checked
                          }
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpdateProfile}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Settings
                </button>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Actions
              </h4>
              <div className="space-y-4">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Lock className="w-4 h-4" />
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )



      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-8 sm:pb-12">
        {/* Header */}
        {/* <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">My Profile</h1>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div> */}

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg overflow-hidden">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
