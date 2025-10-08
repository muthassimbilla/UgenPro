"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"

export default function TestSessionFixPage() {
  const { user, loading, refreshUser } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)

  useEffect(() => {
    // Check session info
    const checkSession = async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        
        if (supabase) {
          const { data: { session }, error } = await supabase.auth.getSession()
          setSessionInfo({ session, error })
        }
      } catch (error) {
        setSessionInfo({ error: error.message })
      }
    }

    checkSession()
  }, [])

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleAuthRefresh = async () => {
    await refreshUser()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Test Page</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>User: {user ? user.email : 'Not logged in'}</p>
          <p>Session Status: {sessionInfo?.session ? 'Active' : 'Inactive'}</p>
          
          <div className="mt-4 space-x-2">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Refresh Page
            </button>
            
            <button 
              onClick={handleAuthRefresh}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Refresh Auth
            </button>
          </div>
        </div>
      )}
    </div>
  )
}