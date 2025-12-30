'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { createMissingProfiles, createProfileForUser } from '@/lib/create-missing-profiles'
import ProtectedRoute from '@/app/components/ProtectedRoute'
import { Users, UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function CreateProfilesPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCreateProfiles = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Since we can't directly access auth.users from client,
      // we'll need to use a different approach

      // Option 1: Try to create profiles for common user IDs
      // This is a workaround since we can't query auth.users directly

      const result = await createMissingProfiles()
      setResult(result)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createSampleProfiles = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // This is a temporary solution - in production, you'd want server-side admin access
      const sampleUserIds: string[] = [
        // Add known user IDs here that you see in Supabase but don't have profiles
        // You'll need to get these from your Supabase dashboard
      ]

      const results = []
      for (const userId of sampleUserIds) {
        const result = await createProfileForUser(userId)
        results.push(result)
      }

      setResult({ success: true, message: `Processed ${results.length} users`, results })

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm mb-4">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Admin Tools</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Create Missing <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Profiles</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Create profile records for users who have accounts but no profiles
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="p-8">
              <div className="space-y-6">
                {/* Info Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">Why are profiles missing?</h3>
                      <ul className="text-blue-800 space-y-1 text-sm">
                        <li>• Users signed up before profile creation was implemented</li>
                        <li>• Google OAuth users may not have triggered profile creation</li>
                        <li>• System only creates profiles during email signup (after recent fix)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleCreateProfiles}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    Auto-Create Profiles
                  </button>

                  <button
                    onClick={createSampleProfiles}
                    disabled={loading}
                    className="flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Users className="w-5 h-5" />
                    Create Sample Profiles
                  </button>
                </div>

                {/* Results */}
                {result && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Success!</h3>
                        <pre className="text-green-800 text-sm whitespace-pre-wrap">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                      <div>
                        <h3 className="text-lg font-semibold text-red-900 mb-2">Error</h3>
                        <p className="text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Manual Instructions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-3">Manual Solution</h3>
                  <p className="text-yellow-800 text-sm mb-4">
                    Since client-side code can't access auth.users directly, here's how to manually create profiles:
                  </p>
                  <ol className="text-yellow-800 text-sm space-y-2 list-decimal list-inside">
                    <li>Go to your Supabase dashboard → Authentication → Users</li>
                    <li>Copy user IDs from users who don't have profiles</li>
                    <li>Use the SQL editor to run INSERT statements:</li>
                  </ol>
                  <div className="mt-4 bg-yellow-100 rounded-lg p-4">
                    <code className="text-yellow-900 text-xs block">
                      INSERT INTO profiles (id, full_name, created_at, updated_at)<br />
                      VALUES ('user-id-here', 'User Name', NOW(), NOW());
                    </code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
