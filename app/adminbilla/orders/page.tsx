"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Package,
  CreditCard,
  User,
  Mail,
  Tag,
  FileText,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Order {
  id: string
  user_id: string
  plan_id: string
  plan_name: string
  original_price: number
  discount_amount: number
  final_price: number
  coupon_code: string | null
  user_name: string
  user_email: string
  payment_method: string | null
  payment_last_4_digits: string | null
  payment_transaction_id: string | null
  payment_status: string
  order_status: string
  notes: string | null
  created_at: string
  updated_at: string
}

export default function AdminOrdersPage() {
  const { admin, isLoading: isAuthLoading } = useAdminAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (!isAuthLoading && !admin) {
      router.replace("/404")
    }
  }, [admin, isAuthLoading, router])

  useEffect(() => {
    if (admin) {
      loadOrders()
    }
  }, [admin])

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const sessionToken = localStorage.getItem("admin_session_token")

      if (!sessionToken) {
        console.error("[v0] No admin session token found")
        return
      }

      const response = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      })

      if (!response.ok) {
        console.error("[v0] Failed to fetch orders:", response.statusText)
        return
      }

      const { orders: fetchedOrders } = await response.json()
      setOrders(fetchedOrders || [])
    } catch (error) {
      console.error("[v0] Error loading orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmOrder = async (orderId: string) => {
    setIsUpdating(true)
    try {
      const sessionToken = localStorage.getItem("admin_session_token")

      if (!sessionToken) {
        console.error("[v0] No admin session token found")
        return
      }

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          orderId,
          orderStatus: "confirmed",
          paymentStatus: "completed",
        }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to confirm order:", response.statusText)
        return
      }

      // Reload orders
      await loadOrders()
      setIsDetailsOpen(false)
    } catch (error) {
      console.error("[v0] Error confirming order:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelOrder = async (orderId: string) => {
    setIsUpdating(true)
    try {
      const sessionToken = localStorage.getItem("admin_session_token")

      if (!sessionToken) {
        console.error("[v0] No admin session token found")
        return
      }

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          orderId,
          orderStatus: "cancelled",
          paymentStatus: "failed",
        }),
      })

      if (!response.ok) {
        console.error("[v0] Failed to cancel order:", response.statusText)
        return
      }

      // Reload orders
      await loadOrders()
      setIsDetailsOpen(false)
    } catch (error) {
      console.error("[v0] Error cancelling order:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      pending: { label: "Pending", variant: "secondary" },
      confirmed: { label: "Confirmed", variant: "default" },
      processing: { label: "Processing", variant: "outline" },
      completed: { label: "Completed", variant: "default" },
      cancelled: { label: "Cancelled", variant: "destructive" },
    }

    const config = statusConfig[status] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getPaymentMethodLabel = (method: string | null) => {
    if (!method) return "N/A"
    return method.charAt(0).toUpperCase() + method.slice(1)
  }

  if (!isAuthLoading && !admin) {
    return null
  }

  const pendingOrders = orders.filter((o) => o.order_status === "pending")
  const confirmedOrders = orders.filter((o) => o.order_status === "confirmed")
  const completedOrders = orders.filter((o) => o.order_status === "completed")

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            Order Management
          </h1>
          <p className="text-muted-foreground mt-1">View and manage all customer orders</p>
        </div>
        <Button onClick={loadOrders} variant="outline" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Orders</p>
                <p className="text-3xl font-bold text-orange-600">{pendingOrders.length}</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Confirmed Orders</p>
                <p className="text-3xl font-bold text-green-600">{confirmedOrders.length}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
              </div>
              <Package className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.user_name}</p>
                          <p className="text-xs text-muted-foreground">{order.user_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.plan_name}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-semibold">৳{order.final_price}</p>
                          {order.discount_amount > 0 && (
                            <p className="text-xs text-green-600">-৳{order.discount_amount}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.payment_method ? (
                          <div className="text-sm">
                            <p className="font-medium">{getPaymentMethodLabel(order.payment_method)}</p>
                            <p className="text-xs text-muted-foreground">****{order.payment_last_4_digits}</p>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.order_status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order)
                            setIsDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </DialogTitle>
            <DialogDescription>Order ID: {selectedOrder?.id}</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedOrder.user_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedOrder.user_email}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan:</span>
                    <span className="font-medium">{selectedOrder.plan_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Original Price:</span>
                    <span>৳{selectedOrder.original_price}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-৳{selectedOrder.discount_amount}</span>
                      </div>
                      {selectedOrder.coupon_code && (
                        <div className="flex items-center gap-2 text-sm">
                          <Tag className="h-4 w-4" />
                          <span>Coupon: {selectedOrder.coupon_code}</span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between pt-2 border-t font-bold text-lg">
                    <span>Final Price:</span>
                    <span className="text-blue-600">৳{selectedOrder.final_price}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span className="font-medium">{getPaymentMethodLabel(selectedOrder.payment_method)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last 4 Digits:</span>
                    <span className="font-mono">****{selectedOrder.payment_last_4_digits}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-muted-foreground">Transaction ID:</span>
                    <span className="font-mono text-sm text-right break-all max-w-[60%]">
                      {selectedOrder.payment_transaction_id}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Payment Status:</span>
                    {getStatusBadge(selectedOrder.payment_status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Order Status:</span>
                    {getStatusBadge(selectedOrder.order_status)}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Additional Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              {selectedOrder.order_status === "pending" && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleConfirmOrder(selectedOrder.id)}
                    disabled={isUpdating}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isUpdating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Confirm Order
                  </Button>
                  <Button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={isUpdating}
                    variant="destructive"
                    className="flex-1"
                  >
                    {isUpdating ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
