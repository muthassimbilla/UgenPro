"use client"

import type React from "react"
import { useState, useEffect, useCallback, useTransition } from "react"
import ClientOnly from "@/components/client-only"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { getClientFlashMessage, clearClientFlashMessage, type FlashMessage } from "@/lib/flash-messages"
import { useNetwork } from "@/contexts/network-context"
import NoInternet from "@/components/no-internet"
import AuthLayout from "@/components/auth/auth-layout"
import AuthHero from "@/components/auth/auth-hero"
import AuthForm from "@/components/auth/auth-form"
import LoadingOverlay from "@/components/loading-overlay"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user, loading: authLoading } = useAuth()
  const { isOnline, retryConnection, isReconnecting } = useNetwork()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [flashMessage, setFlashMessage] = useState<FlashMessage | null>(null)
  const [pendingApproval, setPendingApproval] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [ipChangeLogout, setIpChangeLogout] = useState(false)
  const [sessionInvalidReason, setSessionInvalidReason] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  const clearSessionData = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("session_token")
        localStorage.removeItem("current_user")

        document.cookie =
          "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=" + window.location.hostname
        document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

        setTimeout(() => {
          window.location.reload()
        }, 100)
      }
      console.log("[v0] Session data cleared for Vercel")
    } catch (error) {
      console.error("[v0] Error clearing session data:", error)
    }
  }

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))

      if (errors.length > 0) {
        setErrors([])
        setPendingApproval(false)
      }
    },
    [errors.length],
  )

  const handleTogglePassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const validateForm = useCallback(() => {
    const newErrors: string[] = []

    if (!formData.email.trim()) {
      newErrors.push("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Please enter a valid email address")
    }

    if (!formData.password.trim()) {
      newErrors.push("Password is required")
    }

    return newErrors
  }, [formData.email, formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    setIsSubmitting(true)
    setLoading(true)
    setErrors([])
    setSuccessMessage("")
    setPendingApproval(false)

    try {
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      const loginResult = await login(formData.email.trim(), formData.password)

      startTransition(() => {
        // The context user might not be updated yet
        const redirectTo = searchParams.get("redirect") || "/tool"
        console.log("[v0] Login successful, redirecting to:", redirectTo)
        router.push(redirectTo)
      })
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      const errorMsg = error.message?.toLowerCase() || ""

      if (errorMsg.includes("deactivated")) {
        setErrors(["Your account has been deactivated. Please contact support."])
      } else if (errorMsg.includes("suspended")) {
        setErrors(["Your account suspended by admin"])
      } else if (errorMsg.includes("invalid") || errorMsg.includes("credentials")) {
        setErrors(["Invalid email or password. Please check your credentials and try again."])
      } else if (errorMsg.includes("email not confirmed")) {
        setErrors(["Please verify your email address before logging in. Check your inbox for the verification link."])
      } else {
        setErrors([error.message || "Login failed. Please try again."])
      }
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const message = searchParams.get("message")
    const reason = searchParams.get("reason")
    const success = searchParams.get("success")

    const flash = getClientFlashMessage()
    if (flash) {
      setFlashMessage(flash)
      clearClientFlashMessage()
      setTimeout(() => {
        setShowSuccessMessage(true)
      }, 100)
      return
    }

    if (message) {
      setSuccessMessage(message)
      setTimeout(() => {
        setShowSuccessMessage(true)
      }, 100)
    } else if (success === "signup") {
      setSuccessMessage("Account created successfully! Please check your email to verify your account.")
      setTimeout(() => {
        setShowSuccessMessage(true)
      }, 100)
    }

    if (reason === "ip_changed") {
      setIpChangeLogout(true)
    }

    if (reason === "session_invalid") {
      setSessionInvalidReason(true)
      clearSessionData()

      if (typeof window !== "undefined") {
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete("reason")
        newUrl.searchParams.delete("message")
        window.history.replaceState({}, "", newUrl.toString())

        setTimeout(() => {
          console.log("[v0] Vercel session cleanup completed")
        }, 50)
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (!authLoading) {
      setIsCheckingAuth(false)
    }
  }, [authLoading])

  useEffect(() => {
    // Initialize component after a brief delay to prevent flashing
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Show loading spinner only when actually checking auth or not initialized
  if (!isInitialized || (isCheckingAuth && authLoading)) {
    return <LoadingOverlay message="Loading..." fullScreen />
  }

  if (!isOnline) {
    return <NoInternet onRetry={retryConnection} isReconnecting={isReconnecting} />
  }

  return (
    <ClientOnly fallback={<LoadingOverlay message="Loading..." fullScreen />}>
      <AuthLayout variant="login">
        <div className="space-y-8 page-transition">
          <AuthHero variant="login" />
          <AuthForm
            variant="login"
            formData={formData}
            errors={errors}
            loading={loading}
            isSubmitting={isSubmitting}
            showPassword={showPassword}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onTogglePassword={handleTogglePassword}
            flashMessage={flashMessage}
            showSuccessMessage={showSuccessMessage}
            successMessage={successMessage}
            sessionInvalidReason={sessionInvalidReason}
            ipChangeLogout={ipChangeLogout}
            pendingApproval={pendingApproval}
          />
        </div>
      </AuthLayout>
    </ClientOnly>
  )
}
