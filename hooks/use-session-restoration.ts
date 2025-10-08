"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useSessionRestoration() {
  const [isRestoring, setIsRestoring] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const restoreSession = async () => {
      try {
        console.log("[v0] Starting session restoration...")
        setIsRestoring(true)

        const supabase = createClient()
        if (!supabase) {
          console.log("[v0] Supabase client not available")
          setIsRestoring(false)
          return
        }

        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("[v0] Session restoration error:", error)
          setSession(null)
        } else if (session) {
          console.log("[v0] Session restored successfully:", session.user?.email)
          setSession(session)
        } else {
          console.log("[v0] No session found")
          setSession(null)
        }
      } catch (error) {
        console.error("[v0] Session restoration failed:", error)
        setSession(null)
      } finally {
        setIsRestoring(false)
      }
    }

    restoreSession()
  }, [])

  return { session, isRestoring }
}