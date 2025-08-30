import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner'
import { USER_ROLES } from '../../utils/auth'

/**
 * Enhanced ProtectedRoute component that handles both authentication and role-based access
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if access is granted
 * @param {string|string[]} props.roles - Role(s) that can access this route
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 * @param {string} props.fallbackRoute - Custom fallback route (optional)
 */
function ProtectedRoute({ 
  children, 
  roles, 
  requireAuth = true,
  fallbackRoute 
}) {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    hasRole, 
    defaultDashboard 
  } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If no role restrictions, allow access for authenticated users
  if (!roles) {
    return children
  }

  // Check if user has required role(s)
  if (!hasRole(roles)) {
    // Determine where to redirect based on user's role
    let redirectTo = fallbackRoute || defaultDashboard

    // If user is trying to access admin routes but is not admin
    if (location.pathname.startsWith('/dashboard') && !hasRole(USER_ROLES.ADMIN)) {
      redirectTo = defaultDashboard
    }
    
    // If user is trying to access reseller routes but is not reseller
    if (location.pathname.startsWith('/reseller-dashboard') && !hasRole(USER_ROLES.RESELLER)) {
      redirectTo = defaultDashboard
    }

    return <Navigate to={redirectTo} replace />
  }

  return children
}

// Convenience components for specific roles
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute roles={USER_ROLES.ADMIN} {...props}>
    {children}
  </ProtectedRoute>
)

export const ResellerRoute = ({ children, ...props }) => (
  <ProtectedRoute roles={USER_ROLES.RESELLER} {...props}>
    {children}
  </ProtectedRoute>
)

export const ClientRoute = ({ children, ...props }) => (
  <ProtectedRoute roles={USER_ROLES.CLIENT} {...props}>
    {children}
  </ProtectedRoute>
)

export const ManagementRoute = ({ children, ...props }) => (
  <ProtectedRoute roles={[USER_ROLES.ADMIN, USER_ROLES.RESELLER]} {...props}>
    {children}
  </ProtectedRoute>
)

export default ProtectedRoute
