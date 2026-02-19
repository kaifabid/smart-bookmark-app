'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <p className="p-6">Loading...</p>

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button
          onClick={() => router.push('/login')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Welcome, {user.email}
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  )
}
