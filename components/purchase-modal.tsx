"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  ExternalLink,
  Crown,
  Sparkles
} from "lucide-react"

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  planPrice: string
  planDuration: string
}

export default function PurchaseModal({
  isOpen,
  onClose,
  planName,
  planPrice,
  planDuration,
}: PurchaseModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleTelegramContact = () => {
    setIsLoading(true)
    
    // Create predefined message with package data
    const message = `Hello! I want to purchase the ${planName} premium package.

📦 Package Details:
• Plan: ${planName}
• Price: ${planPrice}
• Duration: ${planDuration}

Please provide me with the payment details and process.

Thank you!`
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)
    
    // Open Telegram bot with predefined message
    window.open(`https://t.me/ugenpro_admin?text=${encodedMessage}`, "_blank")
    
    setTimeout(() => {
      setIsLoading(false)
      onClose()
    }, 1000)
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="h-6 w-6 text-yellow-500" />
            Purchase Premium Package
          </DialogTitle>
          <DialogDescription>
            Contact the admin to purchase this premium package.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Details */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{planName}</h3>
                  <p className="text-sm text-muted-foreground">{planDuration}</p>
                </div>
                <Badge variant="secondary" className="text-lg font-bold px-3 py-1">
                  {planPrice}
                </Badge>
              </div>
              <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  📦 This package information will be automatically sent to the admin
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Options */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Contact Admin
            </h4>
            
            <div className="grid gap-3">
              {/* Telegram Bot */}
              <Button
                onClick={handleTelegramContact}
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {isLoading ? "Opening Telegram..." : "Contact Admin"}
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> After contacting the admin, you will receive payment instructions and your premium access will be activated within 24 hours.
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
