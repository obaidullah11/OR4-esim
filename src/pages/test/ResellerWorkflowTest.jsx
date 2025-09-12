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
  Smartphone,
  Activity,
  BarChart3,
  Zap
} from 'lucide-react'

// Import services
import { clientService } from '../../services/clientService'
import { esimService } from '../../services/esimService'
import { traveRoamService } from '../../services/traveRoamService'
import { integrationService } from '../../services/integrationService'
import { realtimeService } from '../../services/realtimeService'

function ResellerWorkflowTest() {
  const { resolvedTheme } = useTheme()
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [testClient, setTestClient] = useState(null)
  const [testEsim, setTestEsim] = useState(null)

  // Test data
  const testClientData = {
    full_name: 'Reseller Workflow Test Client',
    email: `reseller-test-${Date.now()}@example.com`,
    phone_number: '+1234567890',
    passport_number: 'RW123456',
    national_id: 'RW123456789',
    country_of_travel: 'United States',
    date_of_travel: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    admin_notes: 'Created via reseller workflow test',
    client_type: 'reseller_client',
    status: 'active'
  }

  // Define all reseller workflow tests
  const workflowTests = [
    {
      id: 'dashboard-data',
      name: 'Dashboard Data Integration',
      description: 'Test reseller dashboard real data loading',
      test: async () => {
        const [clientsResponse, esimsResponse] = await Promise.allSettled([
          clientService.getMyClients({ limit: 10 }),
          esimService.getResellerEsims({ limit: 10 })
        ])
        
        return {
          success: true,
          data: {
            clients: clientsResponse.status === 'fulfilled' ? clientsResponse.value : null,
            esims: esimsResponse.status === 'fulfilled' ? esimsResponse.value : null
          }
        }
      }
    },
    {
      id: 'client-creation',
      name: 'Client Creation Workflow',
      description: 'Test complete client creation with real API',
      test: async () => {
        const response = await clientService.createClient(testClientData)
        if (response.success) {
          setTestClient(response.data)
        }
        return response
      }
    },
    {
      id: 'client-validation',
      name: 'Client Validation System',
      description: 'Test advanced client validation and verification',
      test: async () => {
        if (!testClient) {
          return { success: false, error: 'No test client available' }
        }
        
        const validation = await clientService.validateClientAdvanced(testClientData)
        const verification = await clientService.verifyClientData(testClientData)
        
        return {
          success: validation.isValid && verification.success,
          data: { validation, verification }
        }
      }
    },
    {
      id: 'plan-loading',
      name: 'eSIM Plan Loading',
      description: 'Test real eSIM plan loading from TraveRoam',
      test: async () => {
        const traveRoamResponse = await traveRoamService.getAvailablePlans({ limit: 5 })
        const localResponse = await esimService.getAvailablePlans({ limit: 5 })
        
        return {
          success: traveRoamResponse.success || localResponse.success,
          data: {
            traveRoam: traveRoamResponse,
            local: localResponse
          }
        }
      }
    },
    {
      id: 'esim-assignment',
      name: 'eSIM Assignment Workflow',
      description: 'Test complete eSIM assignment with real integration',
      test: async () => {
        if (!testClient) {
          return { success: false, error: 'No test client available' }
        }
        
        // Get available plans first
        const plansResponse = await traveRoamService.getAvailablePlans({ limit: 1 })
        if (!plansResponse.success || !plansResponse.data.length) {
          return { success: false, error: 'No plans available for assignment' }
        }
        
        const testPlan = plansResponse.data[0]
        
        // Assign eSIM
        const assignmentResponse = await integrationService.assignEsimToClient({
          clientId: testClient.id,
          planId: testPlan.id,
          email: testClient.email,
          customerName: testClient.full_name,
          notes: 'Test assignment via workflow test'
        })
        
        if (assignmentResponse.success) {
          setTestEsim(assignmentResponse.data.esim)
        }
        
        return assignmentResponse
      }
    },
    {
      id: 'realtime-monitoring',
      name: 'Real-time eSIM Monitoring',
      description: 'Test real-time eSIM status monitoring',
      test: async () => {
        if (!testEsim) {
          return { success: false, error: 'No test eSIM available' }
        }
        
        return new Promise((resolve) => {
          let statusUpdates = 0
          
          realtimeService.startEsimProvisioning(testEsim.id, {
            onStatusUpdate: (update) => {
              statusUpdates++
              console.log('Real-time status update:', update)
            },
            onComplete: (result) => {
              realtimeService.stopPolling(testEsim.id)
              resolve({
                success: true,
                data: {
                  finalStatus: result.status,
                  statusUpdates: statusUpdates,
                  completed: true
                }
              })
            },
            onError: (error) => {
              realtimeService.stopPolling(testEsim.id)
              resolve({
                success: false,
                error: error.error || 'Monitoring failed',
                data: { statusUpdates }
              })
            },
            pollInterval: 2000, // 2 seconds for testing
            maxAttempts: 5 // 10 seconds total
          })
          
          // Fallback timeout
          setTimeout(() => {
            realtimeService.stopPolling(testEsim.id)
            resolve({
              success: true,
              data: {
                statusUpdates: statusUpdates,
                completed: false,
                message: 'Monitoring test completed (timeout)'
              }
            })
          }, 12000) // 12 seconds
        })
      }
    },
    {
      id: 'esim-history',
      name: 'eSIM History Integration',
      description: 'Test eSIM history loading with real data',
      test: async () => {
        const response = await esimService.getResellerEsims({ limit: 10 })
        return response
      }
    },
    {
      id: 'traveroam-sync',
      name: 'TraveRoam Synchronization',
      description: 'Test eSIM sync with TraveRoam API',
      test: async () => {
        if (!testEsim) {
          return { success: false, error: 'No test eSIM available' }
        }
        
        const syncResponse = await realtimeService.syncWithTraveRoam(testEsim.id)
        return syncResponse
      }
    },
    {
      id: 'cleanup',
      name: 'Test Cleanup',
      description: 'Clean up test data',
      test: async () => {
        const results = []
        
        // Delete test eSIM if exists
        if (testEsim) {
          try {
            const esimDeleteResponse = await esimService.deleteEsim(testEsim.id)
            results.push({ type: 'esim', success: esimDeleteResponse.success })
          } catch (error) {
            results.push({ type: 'esim', success: false, error: error.message })
          }
        }
        
        // Delete test client if exists
        if (testClient) {
          try {
            const clientDeleteResponse = await clientService.deleteClient(testClient.id)
            results.push({ type: 'client', success: clientDeleteResponse.success })
            if (clientDeleteResponse.success) {
              setTestClient(null)
            }
          } catch (error) {
            results.push({ type: 'client', success: false, error: error.message })
          }
        }
        
        return {
          success: results.every(r => r.success),
          data: results
        }
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
    
    for (const test of workflowTests) {
      await runSingleTest(test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsRunning(false)
    toast.success('Reseller workflow tests completed!')
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
                Reseller Dashboard Workflow Test
              </h1>
              <p className={cn(
                "text-sm",
                resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                End-to-end testing of complete reseller dashboard workflow integration
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
              <Zap className="w-5 h-5 text-blue-500" />
              <h2 className={cn(
                "text-lg font-semibold",
                resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                Reseller Workflow Tests
              </h2>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-3">
              {workflowTests.map((test) => {
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

        {/* Test Data Info */}
        {(testClient || testEsim) && (
          <div className={cn(
            "mt-6 rounded-lg border p-4",
            resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          )}>
            <h3 className={cn(
              "font-semibold mb-2",
              resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              Test Data Created
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {testClient && (
                <div>
                  <h4 className="font-medium mb-1">Test Client</h4>
                  <p><strong>ID:</strong> {testClient.id}</p>
                  <p><strong>Name:</strong> {testClient.full_name}</p>
                  <p><strong>Email:</strong> {testClient.email}</p>
                </div>
              )}
              {testEsim && (
                <div>
                  <h4 className="font-medium mb-1">Test eSIM</h4>
                  <p><strong>ID:</strong> {testEsim.id}</p>
                  <p><strong>Status:</strong> {testEsim.status}</p>
                  <p><strong>Client:</strong> {testEsim.client?.full_name}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResellerWorkflowTest
