"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Settings, 
  Users, 
  AlertCircle, 
  Infinity, 
  Edit, 
  Trash2, 
  Plus,
  RefreshCw
} from "lucide-react"
import { toast } from "sonner"

interface ApiUsage {
  id: string
  user_id: string
  api_type: string
  usage_date: string
  daily_count: number
  daily_limit: number
  is_unlimited: boolean
  last_used_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface ApiUserLimit {
  id: string
  user_id: string
  api_type: string
  daily_limit: number
  is_unlimited: boolean
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

export default function ApiLimitsPage() {
  const [usageData, setUsageData] = useState<ApiUsage[]>([])
  const [userLimits, setUserLimits] = useState<ApiUserLimit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLimit, setEditingLimit] = useState<ApiUserLimit | null>(null)
  
  // Form states
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedApiType, setSelectedApiType] = useState<"address_generator" | "email2name">("address_generator")
  const [dailyLimit, setDailyLimit] = useState(200)
  const [isUnlimited, setIsUnlimited] = useState(false)

  const fetchUsageData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/api-usage-stats')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUsageData(data.usage || [])
        }
      }
    } catch (error) {
      console.error('Error fetching usage data:', error)
      toast.error('Failed to fetch usage data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserLimits = async () => {
    try {
      const response = await fetch('/api/admin/api-user-limits')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserLimits(data.limits || [])
        }
      }
    } catch (error) {
      console.error('Error fetching user limits:', error)
      toast.error('Failed to fetch user limits')
    }
  }

  const saveUserLimit = async () => {
    try {
      const endpoint = editingLimit ? '/api/admin/api-user-limits' : '/api/admin/api-user-limits'
      const method = editingLimit ? 'PUT' : 'POST'
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingLimit?.id,
          user_id: selectedUserId,
          api_type: selectedApiType,
          daily_limit: isUnlimited ? 999999 : dailyLimit,
          is_unlimited: isUnlimited
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          toast.success(editingLimit ? 'User limit updated' : 'User limit created')
          setIsDialogOpen(false)
          resetForm()
          fetchUserLimits()
        } else {
          toast.error(data.error || 'Failed to save user limit')
        }
      }
    } catch (error) {
      console.error('Error saving user limit:', error)
      toast.error('Failed to save user limit')
    }
  }

  const deleteUserLimit = async (limitId: string) => {
    if (!confirm('Are you sure you want to delete this limit?')) return

    try {
      const response = await fetch('/api/admin/api-user-limits', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: limitId })
      })

      if (response.ok) {
        toast.success('User limit deleted')
        fetchUserLimits()
      } else {
        toast.error('Failed to delete user limit')
      }
    } catch (error) {
      console.error('Error deleting user limit:', error)
      toast.error('Failed to delete user limit')
    }
  }

  const resetUserDailyUsage = async (userId: string, apiType: string) => {
    if (!confirm('Are you sure you want to reset this user\'s daily usage?')) return

    try {
      const response = await fetch('/api/admin/reset-daily-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, api_type: apiType })
      })

      if (response.ok) {
        toast.success('Daily usage reset successfully')
        fetchUsageData()
      } else {
        toast.error('Failed to reset daily usage')
      }
    } catch (error) {
      console.error('Error resetting daily usage:', error)
      toast.error('Failed to reset daily usage')
    }
  }

  const resetForm = () => {
    setSelectedUserId("")
    setSelectedApiType("address_generator")
    setDailyLimit(200)
    setIsUnlimited(false)
    setEditingLimit(null)
  }

  const openEditDialog = (limit: ApiUserLimit) => {
    setEditingLimit(limit)
    setSelectedUserId(limit.user_id)
    setSelectedApiType(limit.api_type as "address_generator" | "email2name")
    setDailyLimit(limit.daily_limit)
    setIsUnlimited(limit.is_unlimited)
    setIsDialogOpen(true)
  }

  useEffect(() => {
    fetchUsageData()
    fetchUserLimits()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Limits Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user API limits and monitor daily usage
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => { fetchUsageData(); fetchUserLimits(); }}
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add User Limit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingLimit ? 'Edit User Limit' : 'Add User Limit'}
                </DialogTitle>
                <DialogDescription>
                  Set custom API limits for specific users
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    placeholder="Enter user UUID"
                    disabled={!!editingLimit}
                  />
                </div>
                
                <div>
                  <Label htmlFor="apiType">API Type</Label>
                  <select
                    id="apiType"
                    value={selectedApiType}
                    onChange={(e) => setSelectedApiType(e.target.value as any)}
                    className="w-full p-2 border rounded-md"
                    disabled={!!editingLimit}
                  >
                    <option value="address_generator">Address Generator</option>
                    <option value="email2name">Email to Name</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unlimited"
                    checked={isUnlimited}
                    onCheckedChange={setIsUnlimited}
                  />
                  <Label htmlFor="unlimited">Unlimited Access</Label>
                </div>
                
                {!isUnlimited && (
                  <div>
                    <Label htmlFor="dailyLimit">Daily Limit</Label>
                    <Input
                      id="dailyLimit"
                      type="number"
                      value={dailyLimit}
                      onChange={(e) => setDailyLimit(Number(e.target.value))}
                      min="1"
                      max="10000"
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button onClick={saveUserLimit} className="flex-1">
                    {editingLimit ? 'Update' : 'Create'} Limit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Today's Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Today's API Usage
          </CardTitle>
          <CardDescription>
            Current daily usage by users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : usageData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No usage data for today
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>API Type</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Used</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageData.map((usage) => (
                    <TableRow key={usage.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {usage.profiles?.full_name || 'Unknown'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {usage.profiles?.email || usage.user_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {usage.api_type === 'address_generator' ? 'Address Gen' : 'Email2Name'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {usage.daily_count} / {usage.is_unlimited ? '∞' : usage.daily_limit}
                        </div>
                      </TableCell>
                      <TableCell>
                        {usage.is_unlimited ? (
                          <Badge className="bg-purple-100 text-purple-700">
                            <Infinity className="w-3 h-3 mr-1" />
                            Unlimited
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {usage.daily_limit} daily
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {usage.is_unlimited ? (
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        ) : usage.daily_count >= usage.daily_limit ? (
                          <Badge className="bg-red-100 text-red-700">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Exceeded
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(usage.last_used_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetUserDailyUsage(usage.user_id, usage.api_type)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Reset
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

      {/* User Limits Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Custom User Limits
          </CardTitle>
          <CardDescription>
            Special limits assigned to specific users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userLimits.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No custom limits configured
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>API Type</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userLimits.map((limit) => (
                    <TableRow key={limit.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {limit.profiles?.full_name || 'Unknown'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {limit.profiles?.email || limit.user_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {limit.api_type === 'address_generator' ? 'Address Gen' : 'Email2Name'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {limit.is_unlimited ? (
                          <Badge className="bg-purple-100 text-purple-700">
                            <Infinity className="w-3 h-3 mr-1" />
                            Unlimited
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            {limit.daily_limit} daily
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(limit.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(limit)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteUserLimit(limit.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Default daily limit is 200 for both Address Generator and Email2Name APIs. 
          Custom limits override the default for specific users. Usage resets daily at midnight.
        </AlertDescription>
      </Alert>
    </div>
  )
}
