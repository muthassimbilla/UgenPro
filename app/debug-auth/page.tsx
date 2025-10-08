"use client"

import { useAuth } from "@/lib/auth-context"
import { useSessionRestoration } from "@/hooks/use-session-restoration"
import { useEffect, useState } from "react"

export default function DebugAuthPage() {
  const { user, loading } = useAuth()
  const { session, isRestoring } = useSessionRestoration()
  const [localStorageData, setLocalStorageData] = useState<any>(null)
  const [cookiesData, setCookiesData] = useState<any>(null)

  useEffect(() => {
    // Check localStorage
    const checkLocalStorage = () => {
      const data: any = {}
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('sb-')) {
          data[key] = localStorage.getItem(key)
        }
      }
      setLocalStorageData(data)
    }

    // Check cookies
    const checkCookies = () => {
      const cookies: any = {}
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=')
        if (name && name.startsWith('sb-')) {
          cookies[name] = value
        }
      })
      setCookiesData(cookies)
    }

    checkLocalStorage()
    checkCookies()

    // Update every 2 seconds
    const interval = setInterval(() => {
      checkLocalStorage()
      checkCookies()
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleClearAll = () => {
    // Clear localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key)
      }
    })
    
    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=')
      if (name && name.startsWith('sb-')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      }
    })
    
    window.location.reload()
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          🔍 Auth Debug Center
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Auth Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🔐 Auth Status
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Loading:</span>
                <span className={`px-2 py-1 rounded text-sm ${loading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {loading ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Restoring:</span>
                <span className={`px-2 py-1 rounded text-sm ${isRestoring ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {isRestoring ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User:</span>
                <span className={`px-2 py-1 rounded text-sm ${user ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user ? user.email : 'Not logged in'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">User ID:</span>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {user?.id || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📋 Session Info
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Session:</span>
                <span className={`px-2 py-1 rounded text-sm ${session ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {session ? 'Active' : 'None'}
                </span>
              </div>
              {session && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">User Email:</span>
                    <span className="text-sm">{session.user?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Expires:</span>
                    <span className="text-sm">
                      {session.expires_at ? new Date(session.expires_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Access Token:</span>
                    <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {session.access_token ? `${session.access_token.substring(0, 20)}...` : 'N/A'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* LocalStorage Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              💾 LocalStorage Data
            </h2>
            {localStorageData && Object.keys(localStorageData).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(localStorageData).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-blue-600">{key}:</span>
                    <span className="ml-2 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {typeof value === 'string' && value.length > 50 
                        ? `${value.substring(0, 50)}...` 
                        : String(value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No Supabase data in localStorage</p>
            )}
          </div>

          {/* Cookies Data */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🍪 Cookies Data
            </h2>
            {cookiesData && Object.keys(cookiesData).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(cookiesData).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-blue-600">{key}:</span>
                    <span className="ml-2 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {typeof value === 'string' && value.length > 50 
                        ? `${value.substring(0, 50)}...` 
                        : String(value)
                      }
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No Supabase cookies found</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            ⚡ Actions
          </h2>
          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              🔄 Refresh Page
            </button>
            <button
              onClick={handleClearAll}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              🗑️ Clear All Auth Data
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
            📝 How to Test Session Persistence:
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-700 dark:text-blue-300">
            <li>Login to your account</li>
            <li>Check that you see "Active" session and user email above</li>
            <li>Refresh the page (F5 or Ctrl+R)</li>
            <li>Verify that session and user data persist after refresh</li>
            <li>If session is lost, check console logs for errors</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
