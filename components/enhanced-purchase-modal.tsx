"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  Sparkles,
  Tag,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  CreditCard,
  Hash,
  Smartphone,
  Copy,
  Check,
} from "lucide-react"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"

interface EnhancedPurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  planId: string
  planName: string
  planPrice: string
  planDuration: string
}

async function validateCoupon(code: string, planId: string, originalPrice: number) {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single()

    if (error || !coupon) {
      return { isValid: false, message: "Invalid coupon code", discount: 0 }
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { isValid: false, message: "Coupon has expired", discount: 0 }
    }

    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return { isValid: false, message: "Coupon usage limit reached", discount: 0 }
    }

    if (coupon.applicable_plans && coupon.applicable_plans.length > 0) {
      if (!coupon.applicable_plans.includes(planId)) {
        return { isValid: false, message: "Coupon not applicable for this package", discount: 0 }
      }
    }

    let discount = 0
    if (coupon.discount_type === "percentage") {
      discount = (originalPrice * coupon.discount_value) / 100
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount)
      }
    } else {
      discount = coupon.discount_value
    }

    return {
      isValid: true,
      message: `Coupon applied! You save ৳${discount}`,
      discount: discount,
    }
  } catch (error) {
    console.error("[v0] Coupon validation error:", error)
    return { isValid: false, message: "Error validating coupon", discount: 0 }
  }
}

async function createOrder(orderData: any) {
  try {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "User not found" }
    }

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        plan_id: orderData.planId,
        plan_name: orderData.planName,
        original_price: orderData.originalPrice,
        discount_amount: orderData.discountAmount,
        final_price: orderData.finalPrice,
        coupon_code: orderData.couponCode,
        user_name: orderData.userName,
        user_email: orderData.userEmail,
        payment_method: orderData.paymentMethod,
        payment_last_4_digits: orderData.paymentLast4Digits,
        payment_transaction_id: orderData.paymentTransactionId,
        notes: orderData.notes,
        order_status: "pending",
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Order creation error:", error)
      return { success: false, error: "Error creating order" }
    }

    if (orderData.couponCode) {
      await supabase.rpc("increment_coupon_usage", { coupon_code: orderData.couponCode })
    }

    return { success: true, orderId: data.id }
  } catch (error) {
    console.error("[v0] Order creation error:", error)
    return { success: false, error: "Error creating order" }
  }
}

export default function EnhancedPurchaseModal({
  isOpen,
  onClose,
  planId,
  planName,
  planPrice,
  planDuration,
}: EnhancedPurchaseModalProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentLast4Digits, setPaymentLast4Digits] = useState("")
  const [paymentTransactionId, setPaymentTransactionId] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const [couponCode, setCouponCode] = useState("")
  const [isCouponApplied, setIsCouponApplied] = useState(false)
  const [couponMessage, setCouponMessage] = useState("")
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false)
  const [discount, setDiscount] = useState(0)

  const originalPrice = Number.parseFloat(planPrice.replace(/[^0-9.]/g, ""))
  const finalPrice = originalPrice - discount

  const paymentNumbers = {
    bkash: "01700000000",
    nagad: "01800000000",
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("[v0] Failed to copy:", err)
    }
  }

  useEffect(() => {
    checkAuthentication()
  }, [isOpen])

  const checkAuthentication = async () => {
    setIsCheckingAuth(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        onClose()
        router.push("/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

      setCurrentUser(user)
      setUserName(profile?.full_name || user.user_metadata?.full_name || "")
      setUserEmail(user.email || "")
    } catch (error) {
      console.error("[v0] Auth check error:", error)
      onClose()
      router.push("/login")
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage("Please enter a coupon code")
      return
    }

    setIsValidatingCoupon(true)
    setCouponMessage("")

    const result = await validateCoupon(couponCode.trim(), planId, originalPrice)

    if (result.isValid && result.discount) {
      setIsCouponApplied(true)
      setDiscount(result.discount)
      setCouponMessage(result.message)
    } else {
      setIsCouponApplied(false)
      setDiscount(0)
      setCouponMessage(result.message)
    }

    setIsValidatingCoupon(false)
  }

  const handleRemoveCoupon = () => {
    setCouponCode("")
    setIsCouponApplied(false)
    setDiscount(0)
    setCouponMessage("")
  }

  const handleSubmitOrder = async () => {
    if (!userName.trim()) {
      setCouponMessage("Please enter your name")
      return
    }
    if (!userEmail.trim()) {
      setCouponMessage("Please enter your email")
      return
    }
    if (!paymentMethod) {
      setCouponMessage("Please select a payment method")
      return
    }
    if (!paymentLast4Digits.trim() || paymentLast4Digits.length !== 4) {
      setCouponMessage("Please enter the last 4 digits of your payment number")
      return
    }
    if (!paymentTransactionId.trim()) {
      setCouponMessage("Please enter the transaction ID")
      return
    }

    setIsLoading(true)

    const result = await createOrder({
      planId,
      planName,
      originalPrice,
      discountAmount: discount,
      finalPrice,
      couponCode: isCouponApplied ? couponCode : undefined,
      userName,
      userEmail,
      paymentMethod,
      paymentLast4Digits,
      paymentTransactionId,
      notes: "",
    })

    if (!result.success) {
      setCouponMessage(result.error || "Error creating order")
      setIsLoading(false)
      return
    }

    setCouponMessage("Order placed successfully! Admin will verify your payment soon.")

    setTimeout(() => {
      setIsLoading(false)
      onClose()
      setPaymentMethod("")
      setPaymentLast4Digits("")
      setPaymentTransactionId("")
      handleRemoveCoupon()
    }, 2000)
  }

  if (isCheckingAuth) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[650px]">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            Purchase Premium Package
          </DialogTitle>
          <DialogDescription className="text-base">
            Complete your order by filling in the details below
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <Card className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-white">
                  <h3 className="font-bold text-2xl mb-1">{planName}</h3>
                  <p className="text-blue-100 text-sm">{planDuration}</p>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>

              <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-100">Original Price:</span>
                  <span className={`font-semibold ${discount > 0 ? "line-through text-blue-200" : "text-2xl"}`}>
                    ৳{originalPrice}
                  </span>
                </div>

                {discount > 0 && (
                  <>
                    <div className="flex justify-between items-center text-green-300">
                      <span className="text-sm">Discount:</span>
                      <span className="font-semibold">-৳{discount}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/20">
                      <span className="text-sm font-semibold">Final Price:</span>
                      <span className="text-3xl font-bold">৳{finalPrice}</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-bold text-lg">User Information</h4>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="userName" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Full Name
                </Label>
                <Input
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-11"
                  disabled
                />
              </div>

              <div>
                <Label htmlFor="userEmail" className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Email Address
                </Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-11"
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-bold text-lg">Payment Information</h4>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Select Payment Method</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === "bkash"
                        ? "border-pink-500 bg-pink-50 dark:bg-pink-950 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700"
                    }`}
                  >
                    <Smartphone
                      className={`h-5 w-5 ${paymentMethod === "bkash" ? "text-pink-600" : "text-gray-400"}`}
                    />
                    <span
                      className={`font-semibold ${paymentMethod === "bkash" ? "text-pink-600" : "text-gray-600 dark:text-gray-400"}`}
                    >
                      Bkash
                    </span>
                    {paymentMethod === "bkash" && (
                      <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-pink-600" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`relative flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === "nagad"
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950 shadow-md"
                        : "border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700"
                    }`}
                  >
                    <Smartphone
                      className={`h-5 w-5 ${paymentMethod === "nagad" ? "text-orange-600" : "text-gray-400"}`}
                    />
                    <span
                      className={`font-semibold ${paymentMethod === "nagad" ? "text-orange-600" : "text-gray-600 dark:text-gray-400"}`}
                    >
                      Nagad
                    </span>
                    {paymentMethod === "nagad" && (
                      <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-orange-600" />
                    )}
                  </button>
                </div>
              </div>

              {paymentMethod && (
                <Card
                  className={`border-2 ${
                    paymentMethod === "bkash"
                      ? "border-pink-200 bg-pink-50 dark:bg-pink-950 dark:border-pink-800"
                      : "border-orange-200 bg-orange-50 dark:bg-orange-950 dark:border-orange-800"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Smartphone
                          className={`h-5 w-5 ${paymentMethod === "bkash" ? "text-pink-600" : "text-orange-600"}`}
                        />
                        <span className="font-semibold text-sm">
                          Send money to this {paymentMethod === "bkash" ? "Bkash" : "Nagad"} number:
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex-1 p-3 rounded-lg font-mono text-xl font-bold text-center ${
                            paymentMethod === "bkash"
                              ? "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300"
                              : "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300"
                          }`}
                        >
                          {paymentNumbers[paymentMethod as keyof typeof paymentNumbers]}
                        </div>
                        <Button
                          type="button"
                          onClick={() => copyToClipboard(paymentNumbers[paymentMethod as keyof typeof paymentNumbers])}
                          className={`h-12 px-4 ${
                            paymentMethod === "bkash"
                              ? "bg-pink-600 hover:bg-pink-700"
                              : "bg-orange-600 hover:bg-orange-700"
                          }`}
                        >
                          {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        After sending money, enter the last 4 digits and transaction ID below
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {paymentMethod && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <Label htmlFor="paymentLast4Digits" className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      Last 4 Digits of {paymentMethod === "bkash" ? "Bkash" : "Nagad"} Number
                    </Label>
                    <Input
                      id="paymentLast4Digits"
                      value={paymentLast4Digits}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                        setPaymentLast4Digits(value)
                      }}
                      placeholder="1234"
                      maxLength={4}
                      className="h-11 text-lg tracking-wider"
                    />
                  </div>

                  <div>
                    <Label htmlFor="paymentTransactionId" className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      Transaction ID
                    </Label>
                    <Input
                      id="paymentTransactionId"
                      value={paymentTransactionId}
                      onChange={(e) => setPaymentTransactionId(e.target.value)}
                      placeholder="Enter your transaction ID"
                      className="h-11"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-bold text-lg">Have a Coupon Code?</h4>
            </div>

            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                disabled={isCouponApplied || isValidatingCoupon}
                className="flex-1 h-11 uppercase"
              />
              {!isCouponApplied ? (
                <Button
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon || !couponCode.trim()}
                  className="bg-purple-600 hover:bg-purple-700 px-6"
                  size="lg"
                >
                  {isValidatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                </Button>
              ) : (
                <Button
                  onClick={handleRemoveCoupon}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 px-6 bg-transparent"
                  size="lg"
                >
                  Remove
                </Button>
              )}
            </div>

            {couponMessage && (
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${
                  isCouponApplied
                    ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800"
                }`}
              >
                {isCouponApplied ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                )}
                <span className="text-sm font-medium">{couponMessage}</span>
              </div>
            )}
          </div>

          <Button
            onClick={handleSubmitOrder}
            disabled={
              isLoading ||
              !userName.trim() ||
              !userEmail.trim() ||
              !paymentMethod ||
              !paymentLast4Digits ||
              !paymentTransactionId
            }
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing Order...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Place Order - ৳{finalPrice}
              </>
            )}
          </Button>

          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <p className="text-sm text-amber-900 dark:text-amber-100 leading-relaxed">
                <strong className="font-semibold">Important:</strong> After placing your order, our admin team will
                verify your payment details and activate your premium access within 24 hours. You'll receive a
                confirmation email once activated.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
