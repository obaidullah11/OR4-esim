import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRole } from '../../hooks/useRole'
import { USER_ROLES, getDefaultDashboardRoute, canAccessRoute } from '../../utils/auth'

function RoleBasedAuthTest() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const {
    role,
    isAdmin,
    isReseller,
    isClient,
    isPublicUser,
    hasManagementRole,
    roleDisplay,
    defaultDashboard,
    hasRole,
    canAccessRoute: checkRouteAccess
  } = useRole()

  const [testCredentials, setTestCredentials] = useState({
    email: '',
    password: ''
  })

  const testRoutes = [
    '/dashboard',
    '/resellers',
    '/users',
    '/orders',
    '/reseller-dashboard',
    '/reseller-dashboard/clients',
    '/client-dashboard',
    '/settings'
  ]

  const handleTestLogin = async (testRole) => {
    // Mock credentials for different roles
    const mockCredentials = {
      [USER_ROLES.ADMIN]: { email: 'admin@test.com', password: 'admin123' },
      [USER_ROLES.RESELLER]: { email: 'reseller@test.com', password: 'reseller123' },
      [USER_ROLES.CLIENT]: { email: 'client@test.com', password: 'client123' },
      [USER_ROLES.PUBLIC_USER]: { email: 'user@test.com', password: 'user123' }
    }

    try {
      const credentials = mockCredentials[testRole]
      await login(credentials)
    } catch (error) {
      console.error('Test login failed:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Role-Based Authentication Test</h1>
        
        {/* Authentication Status */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-sm font-medium">Authenticated</p>
              <p className="text-xs text-gray-600">{isAuthenticated ? 'Yes' : 'No'}</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xs font-bold text-blue-600">R</span>
              </div>
              <p className="text-sm font-medium">Role</p>
              <p className="text-xs text-gray-600">{roleDisplay}</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xs font-bold text-purple-600">U</span>
              </div>
              <p className="text-sm font-medium">User</p>
              <p className="text-xs text-gray-600">{user?.email || 'None'}</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xs font-bold text-green-600">D</span>
              </div>
              <p className="text-sm font-medium">Dashboard</p>
              <p className="text-xs text-gray-600">{defaultDashboard}</p>
            </div>
          </div>
        </div>

        {/* Role Checks */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Role Checks</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isAdmin ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <p className="text-sm font-medium">Admin</p>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isReseller ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <p className="text-sm font-medium">Reseller</p>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isClient ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <p className="text-sm font-medium">Client</p>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${isPublicUser ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <p className="text-sm font-medium">Public User</p>
            </div>
            <div className="text-center">
              <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${hasManagementRole ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <p className="text-sm font-medium">Management</p>
            </div>
          </div>
        </div>

        {/* Test Login Buttons */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Login (Mock)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <button
              onClick={() => handleTestLogin(USER_ROLES.ADMIN)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Login as Admin
            </button>
            <button
              onClick={() => handleTestLogin(USER_ROLES.RESELLER)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Login as Reseller
            </button>
            <button
              onClick={() => handleTestLogin(USER_ROLES.CLIENT)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Login as Client
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Route Access Test */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Route Access Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testRoutes.map(route => (
              <div key={route} className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="font-mono text-sm">{route}</span>
                <div className={`w-4 h-4 rounded-full ${checkRouteAccess(route) ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Raw User Data */}
        {user && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Raw User Data</h2>
            <pre className="text-xs bg-gray-800 text-green-400 p-4 rounded overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default RoleBasedAuthTest
