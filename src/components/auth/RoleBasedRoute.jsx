import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner/LoadingSpinner'
import { hasRole } from '../../utils/auth'

/**
 * RoleBasedRoute component that protects routes based on user roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if access is granted
 * @param {string|string[]} props.allowedRoles - Role(s) that can access this route
 * @param {string} props.redirectTo - Where to redirect if access is denied (default: /login)
 * @param {boolean} props.requireAuth - Whether authentication is required (default: true)
 */
function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  redirectTo = '/login',
  requireAuth = true 
}) {
  const { user, isAuthenticated, isLoading } = useAuth()
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

  // If no role restrictions, just check authentication
  if (!allowedRoles) {
    return requireAuth && !isAuthenticated ? 
      <Navigate to="/login" state={{ from: location }} replace /> : 
      children
  }

  // Check if user has required role
  if (!hasRole(user, allowedRoles)) {
    // Redirect to appropriate dashboard based on user's role
    const userDefaultDashboard = user ? getUserDefaultDashboard(user) : '/login'
    return <Navigate to={redirectTo === '/login' ? userDefaultDashboard : redirectTo} replace />
  }

  return children
}

// Helper function to get user's default dashboard
function getUserDefaultDashboard(user) {
  switch (user?.role) {
    case 'admin':
      return '/dashboard'
    case 'reseller':
      return '/reseller-dashboard'
    case 'client':
      return '/client-dashboard'
    case 'public_user':
      return '/public-dashboard'
    default:
      return '/login'
  }
}

export default RoleBasedRoute
