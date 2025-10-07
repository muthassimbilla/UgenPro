"use client"

import { useEffect, useState } from "react"

interface HydrationSafeProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * HydrationSafe component prevents hydration mismatches by only rendering
 * children after the component has mounted on the client side.
 * This is useful for components that depend on browser APIs or have
 * different server/client rendering behavior.
 */
export default function HydrationSafe({ children, fallback = null }: HydrationSafeProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

/**
 * Hook to check if component is mounted on client side
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}

/**
 * Hook to safely access window object
 */
export function useWindow() {
  const [windowObj, setWindowObj] = useState<Window | null>(null)

  useEffect(() => {
    setWindowObj(window)
  }, [])

  return windowObj
}

/**
 * Hook to safely access document object
 */
export function useDocument() {
  const [documentObj, setDocumentObj] = useState<Document | null>(null)

  useEffect(() => {
    setDocumentObj(document)
  }, [])

  return documentObj
}
