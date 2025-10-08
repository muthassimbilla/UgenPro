"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useTransition } from "react"
import type { User } from "./auth-client"
import { AuthService } from "./auth-client"
import { useStatusMiddleware } from "./status-middleware"
import { useStatusNotification } from "@/components/status-notification-provider"
import type { UserStatus } from "./user-status-service"
import { StatusChecker } from "./status-checker"
import { createClient } from "./supabase/client"
import { useSessionRestoration } from "@/hooks/use-session-restoration"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ user: User | null; userStatus: UserStatus | null }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  userStatus: UserStatus | null
  checkUserStatus: () => Promise<UserStatus | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [isLoginInProgress, setIsLoginInProgress] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [initialCheckComplete, setInitialCheckComplete] = useState(false)

  const { showNotification } = useStatusNotification()
  const { session, isRestoring } = useSessionRestoration()

  const checkAuth = async () => {
    if (isLoginInProgress) {
      return
    }

    try {
      setLoading(true)

      const currentUser = await AuthService.getCurrentUser()
      if (currentUser) {
        console.log("[v0] User authenticated successfully:", currentUser.email)
        setUser(currentUser)
      } else {
        console.log("[v0] No authenticated user found")
        setUser(null)
      }
    } catch (error) {
      console.error("[v0] Auth check error:", error)
      setUser(null)
    } finally {
      setLoading(false)
      setInitialCheckComplete(true)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoginInProgress(true)
      setLoading(true)

      const { user: loggedInUser, userStatus } = await AuthService.login({
        email,
        password,
      })

      startTransition(() => {
        setUser(loggedInUser)
        setUserStatus(userStatus)
      })

      return { user: loggedInUser, userStatus }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
      setIsLoginInProgress(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()

      setUser(null)
      setUserStatus(null)

      // Clear all session data
      if (typeof window !== "undefined") {
        sessionStorage.clear()
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("[v0] Logout error:", error)
      setUser(null)
      setUserStatus(null)

      // Clear all session data even on error
      if (typeof window !== "undefined") {
        sessionStorage.clear()
        window.location.href = "/login"
      }
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const handleStatusInvalid = async (status: UserStatus) => {
    setUserStatus(status)

    showNotification(status)

    if (
      status.status === "suspended" ||
      status.status === "expired" ||
      status.status === "inactive" ||
      status.status === "deactivated"
    ) {
      setTimeout(async () => {
        await logout()
      }, 2000)
    }
  }

  const { checkStatus } = useStatusMiddleware(user?.id || null, handleStatusInvalid)

  const checkUserStatus = async (): Promise<UserStatus | null> => {
    const status = await checkStatus()
    if (status) {
      setUserStatus(status)

      if (!status.is_valid) {
        showNotification(status)
      }
    }
    return status
  }

  // Initialize auth when session restoration is complete
  useEffect(() => {
    if (!isRestoring && !initialCheckComplete) {
      const initializeAuth = async () => {
        try {
          console.log("[v0] Initializing auth after session restoration...")
          await checkAuth()
        } catch (error) {
          console.error("[v0] Auth initialization error:", error)
        }
      }
      
      initializeAuth()
    }
  }, [isRestoring, initialCheckComplete])

  // Update user when session is restored
  useEffect(() => {
    if (session && !user) {
      console.log("[v0] Session restored, fetching user data...")
      checkAuth()
    } else if (!session && user) {
      console.log("[v0] Session lost, clearing user data...")
      setUser(null)
      setUserStatus(null)
    }
  }, [session, user])

  // Listen for auth state changes
  useEffect(() => {
    if (typeof window === "undefined") return

    const supabase = createClient()
    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        console.log("[v0] Auth state changed:", event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session) {
          console.log("[v0] User signed in, updating state...")
          await checkAuth()
        } else if (event === 'SIGNED_OUT') {
          console.log("[v0] User signed out, clearing state...")
          setUser(null)
          setUserStatus(null)
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log("[v0] Token refreshed, updating state...")
          await checkAuth()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (user && !loading) {
      const statusChecker = StatusChecker.getInstance()
      statusChecker.startChecking(60000)

      return () => {
        statusChecker.stopChecking()
      }
    }
  }, [user, loading])

  const value: AuthContextType = {
    user,
    loading: loading || isRestoring,
    login,
    logout,
    refreshUser,
    userStatus,
    checkUserStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
