"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle, Clock, Infinity } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { ApiType, RateLimitResult } from "@/lib/api-rate-limiter"

interface ApiUsageCounterProps {
  apiType: ApiType
  className?: string
}

interface UsageData {
  daily_count: number
  daily_limit: number
  remaining: number | 'unlimited'
  unlimited: boolean
  success: boolean
}

export function ApiUsageCounter({ apiType, className }: ApiUsageCounterProps) {
  const { user } = useAuth()
  const [usageData, setUsageData] = useState<UsageData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fetchUsageData = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }
      
      // Add user data header if user is authenticated
      if (user) {
        headers['x-user-data'] = JSON.stringify({
          id: user.id,
          email: user.email,
          full_name: user.full_name
        })
      }
      
      const response = await fetch('/api/user/usage-status', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ apiType })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsageData(data.usage)
        }
      } else if (response.status === 401) {
        // Authentication failed - this is expected for non-authenticated users
        console.log('User not authenticated for usage tracking')
      }
    } catch (error) {
      console.error('Error fetching usage data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsageData()
  }, [user, apiType])

  // API call করার পরে usage data update করার জন্য
  const updateAfterApiCall = (rateLimitResult: RateLimitResult) => {
    if (rateLimitResult) {
      setUsageData({
        daily_count: rateLimitResult.daily_count,
        daily_limit: rateLimitResult.daily_limit,
        remaining: rateLimitResult.remaining,
        unlimited: rateLimitResult.unlimited,
        success: rateLimitResult.success
      })
    }
  }

  // Component expose করি parent component এর জন্য
  React.useImperativeHandle(React.useRef(), () => ({
    updateAfterApiCall
  }))

  if (!user) {
    return (
      <Card className={`border-orange-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-orange-700">Please login to track API usage</span>
            </div>
            <Badge variant="secondary">Login Required</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className={`border-gray-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Loading usage...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!usageData) {
    return (
      <Card className={`border-gray-200 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-700">
                {apiType === 'address_generator' ? 'Address Generator' : 'Email to Name'} - Ready to use
              </span>
            </div>
            <Badge variant="secondary">200 daily limit</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { daily_count, daily_limit, remaining, unlimited } = usageData
  const progressPercentage = unlimited ? 100 : Math.min((daily_count / daily_limit) * 100, 100)
  const isNearLimit = !unlimited && remaining !== 'unlimited' && remaining < 10
  const isAtLimit = !unlimited && remaining === 0

  const getStatusColor = () => {
    if (unlimited) return "text-purple-600"
    if (isAtLimit) return "text-red-600"
    if (isNearLimit) return "text-orange-600"
    return "text-green-600"
  }

  const getStatusIcon = () => {
    if (unlimited) return <Infinity className="w-4 h-4 text-purple-600" />
    if (isAtLimit) return <AlertCircle className="w-4 h-4 text-red-600" />
    if (isNearLimit) return <AlertCircle className="w-4 h-4 text-orange-600" />
    return <CheckCircle className="w-4 h-4 text-green-600" />
  }

  const getBorderColor = () => {
    if (unlimited) return "border-purple-200"
    if (isAtLimit) return "border-red-200"
    if (isNearLimit) return "border-orange-200"
    return "border-green-200"
  }

  const getProgressColor = () => {
    if (unlimited) return "bg-purple-500"
    if (isAtLimit) return "bg-red-500"
    if (isNearLimit) return "bg-orange-500"
    return "bg-green-500"
  }

  return (
    <Card className={`${getBorderColor()} ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">
                {apiType === 'address_generator' ? 'Address Generator' : 'Email to Name'}
              </span>
            </div>
            {unlimited ? (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <Infinity className="w-3 h-3 mr-1" />
                Unlimited
              </Badge>
            ) : (
              <Badge 
                variant={isAtLimit ? "destructive" : isNearLimit ? "secondary" : "default"}
                className={isNearLimit ? "bg-orange-100 text-orange-700" : undefined}
              >
                {remaining} left
              </Badge>
            )}
          </div>

          {!unlimited && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Used: {daily_count}</span>
                <span>Limit: {daily_limit}</span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
                style={{
                  '--progress-foreground': getProgressColor()
                } as React.CSSProperties}
              />
            </div>
          )}

          {unlimited && (
            <div className="text-xs text-purple-600 font-medium">
              আপনার unlimited access আছে
            </div>
          )}

          {isAtLimit && (
            <div className="text-xs text-red-600">
              আজকের লিমিট শেষ হয়েছে। কাল আবার চেষ্টা করুন।
            </div>
          )}

          {isNearLimit && (
            <div className="text-xs text-orange-600">
              সতর্কতা: আপনার লিমিট প্রায় শেষ হয়ে যাচ্ছে
            </div>
          )}

          <div className="text-xs text-gray-400">
            Today's usage • Resets at midnight
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for easier usage
export function useApiUsageCounter(apiType: ApiType) {
  const counterRef = React.useRef<{ updateAfterApiCall: (result: RateLimitResult) => void } | null>(null)

  const updateUsage = React.useCallback((result: RateLimitResult) => {
    if (counterRef.current) {
      counterRef.current.updateAfterApiCall(result)
    }
  }, [])

  const Counter = React.useCallback((props: { className?: string }) => (
    <ApiUsageCounter ref={counterRef} apiType={apiType} {...props} />
  ), [apiType])

  return { Counter, updateUsage }
}
