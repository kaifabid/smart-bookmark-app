'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000',
      },
    })
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Login with Google
      </button>
    </div>
  )
}
