import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { AdminUserService, type AdminUser } from "@/lib/admin-user-service"

// Query keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: string) => [...userKeys.lists(), { filters }] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Hooks
export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => AdminUserService.getAllUsers(),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: string; userData: Partial<AdminUser> }) =>
      AdminUserService.updateUser(data.id, data.userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => AdminUserService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: string; isActive: boolean }) =>
      AdminUserService.toggleUserStatus(data.userId, data.isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useApproveUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { userId: string; expirationDate: string }) =>
      AdminUserService.approveUser(data.userId, undefined, data.expirationDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useRejectUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => AdminUserService.rejectUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData: {
      full_name: string
      email: string
      is_active: boolean
      account_status: "active" | "suspended"
      expiration_date?: string | null
    }) => AdminUserService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}

export function useUpdateUserSecurity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      userId: string
      securityData: {
        status?: "active" | "suspended"
        expirationDate?: string | null
        activateAccount?: boolean
      }
    }) => AdminUserService.handleSecurityUpdate(data.userId, data.securityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
