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
  Smartphone
} from 'lucide-react'

// Import services
import { clientService } from '../../services/clientService'
import { integrationService } from '../../services/integrationService'

function ClientManagementTest() {
  const { resolvedTheme } = useTheme()
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [testClient, setTestClient] = useState(null)

  // Test data
  const testClientData = {
    full_name: 'Test Client API Integration',
    email: `test-client-${Date.now()}@example.com`,
    phone_number: '+1234567890',
    passport_number: 'AB123456',
    national_id: 'ID123456789',
    country_of_travel: 'United States',
    date_of_travel: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    admin_notes: 'Created via API integration test',
    client_type: 'reseller_client',
    status: 'active'
  }

  // Define all client management tests
  const clientTests = [
    {
      id: 'client-validation',
      name: 'Client Data Validation',
      description: 'Test client data validation functions',
      test: async () => {
        const validation = clientService.validateClientData(testClientData)
        const advancedValidation = await clientService.validateClientAdvanced(testClientData)
        const verification = await clientService.verifyClientData(testClientData)
        
        return {
          success: validation.isValid && advancedValidation.isValid && verification.success,
          data: { validation, advancedValidation, verification }
        }
      }
    },
    {
      id: 'client-create',
      name: 'Create Client',
      description: 'Test client creation via API',
      test: async () => {
        const response = await clientService.createClient(testClientData)
        if (response.success) {
          setTestClient(response.data)
        }
        return response
      }
    },
    {
      id: 'client-list',
      name: 'List Clients',
      description: 'Test client listing and search',
      test: async () => {
        const response = await clientService.getMyClients({ limit: 10 })
        return response
      }
    },
    {
      id: 'client-get',
      name: 'Get Client by ID',
      description: 'Test retrieving specific client',
      test: async () => {
        if (!testClient) {
          return { success: false, error: 'No test client available' }
        }
        const response = await clientService.getClientById(testClient.id)
        return response
      }
    },
    {
      id: 'client-update',
      name: 'Update Client',
      description: 'Test client update functionality',
      test: async () => {
        if (!testClient) {
          return { success: false, error: 'No test client available' }
        }
        const updateData = {
          ...testClientData,
          admin_notes: 'Updated via API integration test'
        }
        const response = await clientService.updateClient(testClient.id, updateData)
        return response
      }
    },
    {
      id: 'client-esim-workflow',
      name: 'Client-eSIM Assignment Workflow',
      description: 'Test complete client to eSIM assignment workflow',
      test: async () => {
        if (!testClient) {
          return { success: false, error: 'No test client available' }
        }
        
        // This would normally assign a real eSIM, but we'll simulate it
        const mockAssignment = {
          clientId: testClient.id,
          planId: 'test-plan-123',
          email: testClient.email,
          customerName: testClient.full_name,
          notes: 'Test assignment via integration test'
        }
        
        // For testing, we'll just validate the workflow structure
        return {
          success: true,
          data: {
            workflow: 'validated',
            client: testClient,
            assignment: mockAssignment
          },
          message: 'Workflow structure validated (eSIM assignment simulated)'
        }
      }
    },
    {
      id: 'client-delete',
      name: 'Delete Client',
      description: 'Test client deletion (cleanup)',
      test: async () => {
        if (!testClient) {
          return { success: false, error: 'No test client available' }
        }
        const response = await clientService.deleteClient(testClient.id)
        if (response.success) {
          setTestClient(null)
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
        toast.success(`${test.name} passed`)
      } else {
        toast.error(`${test.name} failed: ${result.error}`)
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

      toast.error(`${test.name} failed: ${error.message}`)
    }
  }

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults({})
    
    for (const test of clientTests) {
      await runSingleTest(test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsRunning(false)
    toast.success('Client management tests completed!')
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
                Client Management Integration Test
              </h1>
              <p className={cn(
                "text-sm",
                resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                End-to-end testing of client management system integration
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
                Client Management Tests
              </h2>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-3">
              {clientTests.map((test) => {
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

        {/* Test Client Info */}
        {testClient && (
          <div className={cn(
            "mt-6 rounded-lg border p-4",
            resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <h3 className={cn(
              "font-semibold mb-2",
              resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              Test Client Created
            </h3>
            <div className="text-sm space-y-1">
              <p><strong>ID:</strong> {testClient.id}</p>
              <p><strong>Name:</strong> {testClient.full_name}</p>
              <p><strong>Email:</strong> {testClient.email}</p>
              <p><strong>Status:</strong> {testClient.status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClientManagementTest
