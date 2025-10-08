"use client"

import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"

export default function TestSessionPage() {
  const { user, loading } = useAuth()
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [localStorageData, setLocalStorageData] = useState<any>(null)

  useEffect(() => {
    // Check localStorage for session data
    const checkLocalStorage = () => {
      const supabaseAuth = localStorage.getItem('sb-access-token')
      const supabaseRefresh = localStorage.getItem('sb-refresh-token')
      const supabaseSession = localStorage.getItem('sb-session')
      
      setLocalStorageData({
        'sb-access-token': supabaseAuth,
        'sb-refresh-token': supabaseRefresh,
        'sb-session': supabaseSession
      })
    }

    checkLocalStorage()

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

  const handleClearStorage = () => {
    localStorage.clear()
    sessionStorage.clear()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Session Persistence Test
        </h1>

        <div className="grid gap-6">
          {/* User Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">User Status</h2>
            <div className="space-y-2">
              <p><strong>Loading:</strong> {loading ? "Yes" : "No"}</p>
              <p><strong>User:</strong> {user ? user.email : "Not logged in"}</p>
              <p><strong>User ID:</strong> {user?.id || "N/A"}</p>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Session Info</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </div>

          {/* LocalStorage Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">LocalStorage Data</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Refresh Page
              </button>
              <button
                onClick={handleClearStorage}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Clear Storage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
