'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={login}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Continue with Google
      </button>
    </div>
  )
}
