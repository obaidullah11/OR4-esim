// Role-based authentication utilities
export const USER_ROLES = {
  ADMIN: 'admin',
  RESELLER: 'reseller', 
  CLIENT: 'client',
  PUBLIC_USER: 'public_user'
}

// Role checking utilities
export const isAdmin = (user) => {
  return user?.role === USER_ROLES.ADMIN
}

export const isReseller = (user) => {
  return user?.role === USER_ROLES.RESELLER
}

export const isClient = (user) => {
  return user?.role === USER_ROLES.CLIENT
}

export const isPublicUser = (user) => {
  return user?.role === USER_ROLES.PUBLIC_USER
}

// Check if user has any of the specified roles
export const hasRole = (user, roles) => {
  if (!user?.role) return false
  const roleArray = Array.isArray(roles) ? roles : [roles]
  return roleArray.includes(user.role)
}

// Check if user has admin or reseller role (management roles)
export const hasManagementRole = (user) => {
  return hasRole(user, [USER_ROLES.ADMIN, USER_ROLES.RESELLER])
}

// Get user's display role
export const getUserRoleDisplay = (user) => {
  const roleDisplayMap = {
    [USER_ROLES.ADMIN]: 'Administrator',
    [USER_ROLES.RESELLER]: 'Reseller',
    [USER_ROLES.CLIENT]: 'Client',
    [USER_ROLES.PUBLIC_USER]: 'Public User'
  }
  return roleDisplayMap[user?.role] || 'Unknown'
}

// Get default dashboard route for user role
export const getDefaultDashboardRoute = (user) => {
  switch (user?.role) {
    case USER_ROLES.ADMIN:
      return '/dashboard'
    case USER_ROLES.RESELLER:
      return '/reseller-dashboard'
    case USER_ROLES.CLIENT:
      return '/client-dashboard'
    case USER_ROLES.PUBLIC_USER:
      return '/public-dashboard'
    default:
      return '/dashboard'
  }
}

// Check if user can access a specific route
export const canAccessRoute = (user, route) => {
  if (!user?.role) return false

  // Admin routes
  const adminRoutes = ['/dashboard', '/resellers', '/users', '/orders', '/transactions', '/reports', '/settings']
  
  // Reseller routes  
  const resellerRoutes = ['/reseller-dashboard', '/reseller-dashboard/add-client', '/reseller-dashboard/assign-esim', '/reseller-dashboard/clients', '/reseller-dashboard/history']
  
  // Client routes
  const clientRoutes = ['/client-dashboard', '/client-dashboard/orders', '/client-dashboard/esims']
  
  // Public routes (accessible to all authenticated users)
  const publicRoutes = ['/profile', '/settings']

  switch (user.role) {
    case USER_ROLES.ADMIN:
      return adminRoutes.some(r => route.startsWith(r)) || publicRoutes.some(r => route.startsWith(r))
    case USER_ROLES.RESELLER:
      return resellerRoutes.some(r => route.startsWith(r)) || publicRoutes.some(r => route.startsWith(r))
    case USER_ROLES.CLIENT:
      return clientRoutes.some(r => route.startsWith(r)) || publicRoutes.some(r => route.startsWith(r))
    case USER_ROLES.PUBLIC_USER:
      return publicRoutes.some(r => route.startsWith(r))
    default:
      return false
  }
}
