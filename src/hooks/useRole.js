import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  isAdmin, 
  isReseller, 
  isClient, 
  isPublicUser, 
  hasRole, 
  hasManagementRole,
  getUserRoleDisplay,
  getDefaultDashboardRoute,
  canAccessRoute,
  USER_ROLES
} from '../utils/auth'

// Custom hook for role-based functionality
export const useRole = () => {
  const { user } = useAuth()

  const roleInfo = useMemo(() => {
    if (!user) {
      return {
        user: null,
        role: null,
        isAdmin: false,
        isReseller: false,
        isClient: false,
        isPublicUser: false,
        hasManagementRole: false,
        roleDisplay: 'Not Authenticated',
        defaultDashboard: '/login'
      }
    }

    return {
      user,
      role: user.role,
      isAdmin: isAdmin(user),
      isReseller: isReseller(user),
      isClient: isClient(user),
      isPublicUser: isPublicUser(user),
      hasManagementRole: hasManagementRole(user),
      roleDisplay: getUserRoleDisplay(user),
      defaultDashboard: getDefaultDashboardRoute(user)
    }
  }, [user])

  // Helper functions
  const checkRole = (roles) => hasRole(user, roles)
  const checkRouteAccess = (route) => canAccessRoute(user, route)

  return {
    ...roleInfo,
    hasRole: checkRole,
    canAccessRoute: checkRouteAccess,
    USER_ROLES
  }
}

// Hook specifically for checking if user has admin role
export const useIsAdmin = () => {
  const { user } = useAuth()
  return useMemo(() => isAdmin(user), [user])
}

// Hook specifically for checking if user has reseller role
export const useIsReseller = () => {
  const { user } = useAuth()
  return useMemo(() => isReseller(user), [user])
}

// Hook specifically for checking if user has client role
export const useIsClient = () => {
  const { user } = useAuth()
  return useMemo(() => isClient(user), [user])
}

// Hook for checking if user has management role (admin or reseller)
export const useHasManagementRole = () => {
  const { user } = useAuth()
  return useMemo(() => hasManagementRole(user), [user])
}
