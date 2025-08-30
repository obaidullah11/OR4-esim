import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/theme'
import { toast } from 'react-hot-toast'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Users,
  UserPlus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react'

// Import services
import { userService } from '../../services/userService'

function UserManagementTest() {
  const { resolvedTheme } = useTheme()
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [testUser, setTestUser] = useState(null)

  // Test data
  const testUserData = {
    email: `test-user-${Date.now()}@example.com`,
    first_name: 'Test',
    last_name: 'User',
    role: 'public_user',
    phone_number: '1234567890',
    country_code: '+1',
    password: 'TestPassword123!',
    is_active: true
  }

  // Define all user management tests
  const userTests = [
    {
      id: 'user-validation',
      name: 'User Data Validation',
      description: 'Test user data validation functions',
      test: async () => {
        const validation = userService.validateUserData(testUserData)
        
        return {
          success: validation.isValid,
          data: validation
        }
      }
    },
    {
      id: 'user-create',
      name: 'Create User',
      description: 'Test user creation via API',
      test: async () => {
        const response = await userService.createUser(testUserData)
        if (response.success) {
          setTestUser(response.data)
        }
        return response
      }
    },
    {
      id: 'user-list',
      name: 'List Users',
      description: 'Test user listing with pagination and filtering',
      test: async () => {
        const response = await userService.getAllUsers({ limit: 10 })
        return response
      }
    },
    {
      id: 'user-search',
      name: 'Search Users',
      description: 'Test user search functionality',
      test: async () => {
        const response = await userService.getAllUsers({ 
          search: 'test', 
          limit: 5 
        })
        return response
      }
    },
    {
      id: 'user-filter-role',
      name: 'Filter Users by Role',
      description: 'Test user filtering by role',
      test: async () => {
        const response = await userService.getAllUsers({ 
          role: 'public_user', 
          limit: 5 
        })
        return response
      }
    },
    {
      id: 'user-filter-status',
      name: 'Filter Users by Status',
      description: 'Test user filtering by status',
      test: async () => {
        const response = await userService.getAllUsers({ 
          status: 'active', 
          limit: 5 
        })
        return response
      }
    },
    {
      id: 'user-get',
      name: 'Get User by ID',
      description: 'Test retrieving specific user',
      test: async () => {
        if (!testUser) {
          return { success: false, error: 'No test user available' }
        }
        const response = await userService.getUserById(testUser.id)
        return response
      }
    },
    {
      id: 'user-update',
      name: 'Update User',
      description: 'Test user update functionality',
      test: async () => {
        if (!testUser) {
          return { success: false, error: 'No test user available' }
        }
        const updateData = {
          first_name: 'Updated Test',
          last_name: 'User Updated'
        }
        const response = await userService.updateUser(testUser.id, updateData)
        return response
      }
    },
    {
      id: 'user-toggle-status',
      name: 'Toggle User Status',
      description: 'Test user activation/deactivation',
      test: async () => {
        if (!testUser) {
          return { success: false, error: 'No test user available' }
        }
        
        // First deactivate
        const deactivateResponse = await userService.updateUser(testUser.id, { is_active: false })
        if (!deactivateResponse.success) {
          return deactivateResponse
        }
        
        // Then reactivate
        const activateResponse = await userService.updateUser(testUser.id, { is_active: true })
        return activateResponse
      }
    },
    {
      id: 'user-statistics',
      name: 'User Statistics',
      description: 'Test user statistics retrieval',
      test: async () => {
        const response = await userService.getUserStatistics()
        return response
      }
    },
    {
      id: 'user-profile',
      name: 'User Profile Operations',
      description: 'Test user profile retrieval and update',
      test: async () => {
        if (!testUser) {
          return { success: false, error: 'No test user available' }
        }
        
        const profileResponse = await userService.getUserProfile(testUser.id)
        return profileResponse
      }
    },
    {
      id: 'user-formatting',
      name: 'Data Formatting',
      description: 'Test user data formatting functions',
      test: async () => {
        if (!testUser) {
          return { success: false, error: 'No test user available' }
        }
        
        const formatted = userService.formatUserData(testUser)
        const roleDisplay = userService.getRoleDisplay(testUser.role)
        const roleColor = userService.getRoleColor(testUser.role)
        const statusColor = userService.getStatusColor('active')
        
        return {
          success: true,
          data: {
            formatted,
            roleDisplay,
            roleColor,
            statusColor
          }
        }
      }
    },
    {
      id: 'user-delete',
      name: 'Delete User',
      description: 'Test user deletion (cleanup)',
      test: async () => {
        if (!testUser) {
          return { success: false, error: 'No test user available' }
        }
        const response = await userService.deleteUser(testUser.id)
        if (response.success) {
          setTestUser(null)
        }
        return response
      }
    }
  ]

  // Run a single test
  const runSingleTest = async (test) => {
    const testKey = test.id
    
    setTestResults(prev => ({
      ...prev,
      [testKey]: { status: 'running', startTime: Date.now() }
    }))

    try {
      const result = await test.test()
      const endTime = Date.now()
      const duration = endTime - testResults[testKey]?.startTime || 0

      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          status: result.success ? 'success' : 'error',
          result: result,
          duration: duration,
          timestamp: new Date().toISOString()
        }
      }))

      if (result.success) {
        toast.success(`✅ ${test.name} passed`)
      } else {
        toast.error(`❌ ${test.name} failed: ${result.error}`)
      }
    } catch (error) {
      const endTime = Date.now()
      const duration = endTime - testResults[testKey]?.startTime || 0

      setTestResults(prev => ({
        ...prev,
        [testKey]: {
          status: 'error',
          error: error.message,
          duration: duration,
          timestamp: new Date().toISOString()
        }
      }))

      toast.error(`❌ ${test.name} failed: ${error.message}`)
    }
  }

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults({})
    
    for (const test of userTests) {
      await runSingleTest(test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsRunning(false)
    toast.success('🎉 User management tests completed!')
  }

  // Get test status
  const getTestStatus = (testId) => {
    return testResults[testId]
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className={cn(
      "min-h-screen p-6",
      resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={cn(
          "rounded-lg p-6 mb-6",
          resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
          "border"
        )}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={cn(
                "text-2xl font-bold mb-2",
                resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                User Management Integration Test
              </h1>
              <p className={cn(
                "text-sm",
                resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                End-to-end testing of user management system integration
              </p>
            </div>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className={cn(
                "px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                "bg-blue-600 hover:bg-blue-700 text-white",
                isRunning && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className={cn(
          "rounded-lg border",
          resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        )}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-500" />
              <h2 className={cn(
                "text-lg font-semibold",
                resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                User Management Tests
              </h2>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-3">
              {userTests.map((test) => {
                const testStatus = getTestStatus(test.id)
                return (
                  <div
                    key={test.id}
                    className={cn(
                      "p-4 rounded-lg border",
                      resolvedTheme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-200'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(testStatus?.status)}
                        <div>
                          <h3 className={cn(
                            "font-medium",
                            resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                          )}>
                            {test.name}
                          </h3>
                          <p className={cn(
                            "text-sm",
                            resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          )}>
                            {test.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {testStatus?.duration && (
                          <span className={cn(
                            "text-xs",
                            resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          )}>
                            {testStatus.duration}ms
                          </span>
                        )}
                        <button
                          onClick={() => runSingleTest(test)}
                          disabled={isRunning}
                          className={cn(
                            "px-3 py-1 rounded text-sm font-medium transition-colors",
                            "bg-gray-600 hover:bg-gray-700 text-white",
                            isRunning && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          Test
                        </button>
                      </div>
                    </div>
                    
                    {/* Test Result Details */}
                    {testStatus && testStatus.status !== 'running' && (
                      <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                        <details className="group">
                          <summary className={cn(
                            "cursor-pointer text-sm font-medium",
                            resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          )}>
                            View Details
                          </summary>
                          <div className="mt-2">
                            <pre className={cn(
                              "text-xs p-3 rounded bg-gray-100 dark:bg-gray-800 overflow-auto max-h-40",
                              resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            )}>
                              {JSON.stringify(testStatus.result || testStatus.error, null, 2)}
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Test User Info */}
        {testUser && (
          <div className={cn(
            "mt-6 rounded-lg border p-4",
            resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <h3 className={cn(
              "font-semibold mb-2",
              resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              Test User Created
            </h3>
            <div className="text-sm space-y-1">
              <p><strong>ID:</strong> {testUser.id}</p>
              <p><strong>Name:</strong> {testUser.first_name} {testUser.last_name}</p>
              <p><strong>Email:</strong> {testUser.email}</p>
              <p><strong>Role:</strong> {testUser.role}</p>
              <p><strong>Status:</strong> {testUser.is_active ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserManagementTest
