'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  ArrowLeft,
  Target,
  FileText,
  MapPin,
  Users,
  Save,
  AlertCircle,
  CheckCircle,
  Loader,
  TrendingUp
} from 'lucide-react'

type FormData = {
  title: string
  description: string
  category: string
  location: string
  targetMembers: string
  status: string
}

const initialFormData: FormData = {
  title: '',
  description: '',
  category: '',
  location: '',
  targetMembers: '',
  status: 'idea'
}

const categories = [
  'Environment',
  'Education',
  'Social Services',
  'Health',
  'Community Development',
  'Arts & Culture',
  'Technology',
  'Other'
]

const locations = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
  'Larkana',
  'Sheikhupura',
  'Jhang',
  'Rahim Yar Khan',
  'Gujrat',
  'Sahiwal',
  'Wah Cantonment',
  'Mardan',
  'Kasur',
  'Okara',
  'Sadiqabad',
  'Mirpur Khas',
  'Burewala',
  'Kohat',
  'Khanewal',
  'Dera Ismail Khan',
  'Other'
]

const statuses = [
  'idea',
  'active',
  'completed'
]

/* -------------------- SMALL UI HELPERS -------------------- */

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string
  icon?: React.ReactNode
  error?: string
  onChange: (value: string) => void
}

function Input({ label, icon, error, onChange, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label} *</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
        <input
          {...props}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label: string
  icon?: React.ReactNode
  error?: string
  onChange: (value: string) => void
}

function Textarea({ label, icon, error, onChange, ...props }: TextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label} *</label>
      <div className="relative">
        <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
        <textarea
          {...props}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label: string
  options: string[]
  error?: string
  onChange: (value: string) => void
}

function Select({ label, options, error, onChange, ...props }: SelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label} *</label>
      <select
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
          error ? 'border-red-300' : 'border-gray-300'
        }`}
      >
        <option value="">Select</option>
        {options.map((o: string) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  )
}

export default function EditSAPPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)
  const [project, setProject] = useState<any>(null)

  /* -------------------- AUTH GUARD -------------------- */
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
      return
    }

    if (!projectId) {
      router.push('/sap-hub')
      return
    }

    fetchProject()
  }, [user, authLoading, router, projectId])

  /* -------------------- FETCH PROJECT -------------------- */
  const fetchProject = async () => {
    if (!user || !projectId) return

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)

      if (error) {
        console.error('Error fetching project:', error)
        router.push('/sap-hub')
        return
      }

      // Check if project exists
      if (!data || data.length === 0) {
        router.push('/sap-hub')
        return
      }

      const projectData = data[0]

      // Check if user is the creator
      if (projectData.creator_id !== user.id) {
        router.push(`/sap-hub/${projectId}`)
        return
      }

      setProject(projectData)
      setFormData({
        title: projectData.title || '',
        description: projectData.description || '',
        category: projectData.category || '',
        location: projectData.location || '',
        targetMembers: projectData.members?.toString() || '',
        status: projectData.status || 'idea'
      })
    } catch (error) {
      console.error('Error fetching project:', error)
      router.push('/sap-hub')
    } finally {
      setIsLoading(false)
    }
  }

  /* -------------------- VALIDATION -------------------- */
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Project title is required'
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Minimum 50 characters required'
    }
    if (!formData.category) newErrors.category = 'Please select a category'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.targetMembers || Number(formData.targetMembers) < 1) {
      newErrors.targetMembers = 'Must be at least 1 member'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !user || !project) return

    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          location: formData.location.trim(),
          members: Number(formData.targetMembers),
          status: formData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)

      if (error) throw error

      setSubmitMessage({
        type: 'success',
        message: 'SAP updated successfully! Redirecting...'
      })

      setTimeout(() => router.push(`/sap-hub/${projectId}`), 1800)
    } catch (err) {
      console.error(err)
      setSubmitMessage({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  /* -------------------- INPUT HANDLER -------------------- */
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 animate-spin" />
          <span>Loading project...</span>
        </div>
      </div>
    )
  }

  if (!user || !project) return null

  /* -------------------- UI -------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href={`/sap-hub/${projectId}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            Back to Project
          </Link>

          <h1 className="mt-4 text-3xl font-bold">Edit SAP</h1>
          <p className="text-gray-600 mt-1">
            Update your social action project details
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-8 space-y-6"
        >
          {/* Title */}
          <Input
            label="Project Title"
            icon={<Target />}
            error={errors.title}
            value={formData.title}
            onChange={v => handleChange('title', v)}
            placeholder="Clean Water Initiative"
          />

          {/* Description */}
          <Textarea
            label="Project Description"
            icon={<FileText />}
            error={errors.description}
            value={formData.description}
            onChange={v => handleChange('description', v)}
          />

          {/* Category & Location */}
          <div className="grid md:grid-cols-2 gap-6">
            <Select
              label="Category"
              error={errors.category}
              value={formData.category}
              onChange={v => handleChange('category', v)}
              options={categories}
            />
            <Select
              label="Location"
              error={errors.location}
              value={formData.location}
              onChange={v => handleChange('location', v)}
              options={locations}
            />
          </div>

          {/* Target Members & Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Target Members"
              type="number"
              icon={<Users />}
              error={errors.targetMembers}
              value={formData.targetMembers}
              onChange={v => handleChange('targetMembers', v)}
            />
            <Select
              label="Status"
              error={errors.status}
              value={formData.status}
              onChange={v => handleChange('status', v)}
              options={statuses}
            />
          </div>

          {/* Message */}
          {submitMessage && (
            <div
              className={`p-4 rounded-lg flex gap-2 items-center ${
                submitMessage.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {submitMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {submitMessage.message}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end">
            <button
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : <><Save className="w-5 h-5" /> Update SAP</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
