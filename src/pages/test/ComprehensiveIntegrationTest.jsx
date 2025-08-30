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
  ShoppingCart,
  CreditCard,
  BarChart3,
  UserCheck,
  Download,
  RefreshCw
} from 'lucide-react'

// Import services
import { userService } from '../../services/userService'
import { ordersService } from '../../services/ordersService'
import { paymentsService } from '../../services/paymentsService'
import { reportsService } from '../../services/reportsService'
import { resellerService } from '../../services/resellerService'

function ComprehensiveIntegrationTest() {
  const { resolvedTheme } = useTheme()
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  // Define comprehensive test suites
  const testSuites = [
    {
      id: 'users-management',
      name: 'Users Management',
      icon: Users,
      color: 'blue',
      tests: [
        {
          id: 'users-list',
          name: 'List Users',
          test: () => userService.getAllUsers({ limit: 5 })
        },
        {
          id: 'users-search',
          name: 'Search Users',
          test: () => userService.getAllUsers({ search: 'test', limit: 3 })
        },
        {
          id: 'users-filter',
          name: 'Filter Users by Role',
          test: () => userService.getAllUsers({ role: 'public_user', limit: 3 })
        },
        {
          id: 'users-stats',
          name: 'User Statistics',
          test: () => userService.getUserStatistics()
        }
      ]
    },
    {
      id: 'orders-management',
      name: 'Orders Management',
      icon: ShoppingCart,
      color: 'green',
      tests: [
        {
          id: 'orders-list',
          name: 'List Orders',
          test: () => ordersService.getAllOrders({ limit: 5 })
        },
        {
          id: 'orders-filter',
          name: 'Filter Orders by Status',
          test: () => ordersService.getAllOrders({ status: 'pending', limit: 3 })
        },
        {
          id: 'orders-stats',
          name: 'Order Statistics',
          test: () => ordersService.getOrderStatistics()
        },
        {
          id: 'orders-export',
          name: 'Export Orders',
          test: () => ordersService.exportOrders({ status: 'completed' })
        }
      ]
    },
    {
      id: 'transactions-management',
      name: 'Transactions Management',
      icon: CreditCard,
      color: 'purple',
      tests: [
        {
          id: 'payments-list',
          name: 'List Payments',
          test: () => paymentsService.getAllPayments({ limit: 5 })
        },
        {
          id: 'payments-filter',
          name: 'Filter Payments by Status',
          test: () => paymentsService.getAllPayments({ status: 'completed', limit: 3 })
        },
        {
          id: 'payments-stats',
          name: 'Payment Statistics',
          test: () => paymentsService.getPaymentStatistics()
        },
        {
          id: 'payments-analytics',
          name: 'Payment Analytics',
          test: () => paymentsService.getPaymentAnalytics('30d')
        },
        {
          id: 'payments-export',
          name: 'Export Transactions',
          test: () => paymentsService.exportTransactions({ status: 'completed' })
        }
      ]
    },
    {
      id: 'reports-analytics',
      name: 'Reports & Analytics',
      icon: BarChart3,
      color: 'orange',
      tests: [
        {
          id: 'dashboard-reports',
          name: 'Dashboard Reports',
          test: () => reportsService.getDashboardReports()
        },
        {
          id: 'analytics-data',
          name: 'Analytics Data',
          test: () => reportsService.getAnalyticsData('30d')
        },
        {
          id: 'comprehensive-analytics',
          name: 'Comprehensive Analytics',
          test: () => reportsService.getComprehensiveAnalytics({ period: '30d' })
        },
        {
          id: 'export-reports',
          name: 'Export Reports',
          test: () => reportsService.exportReport('dashboard', 'csv', { period: '30d' })
        }
      ]
    },
    {
      id: 'resellers-management',
      name: 'Resellers Management',
      icon: UserCheck,
      color: 'indigo',
      tests: [
        {
          id: 'resellers-list',
          name: 'List Resellers',
          test: () => resellerService.getAllResellers({ limit: 5 })
        },
        {
          id: 'resellers-search',
          name: 'Search Resellers',
          test: () => resellerService.getAllResellers({ search: 'test', limit: 3 })
        },
        {
          id: 'activation-requests',
          name: 'Activation Requests',
          test: () => resellerService.getActivationRequests({ limit: 5 })
        },
        {
          id: 'reseller-stats',
          name: 'Reseller Statistics',
          test: () => resellerService.getResellerStatistics()
        }
      ]
    }
  ]

  // Run a single test
  const runSingleTest = async (suiteId, test) => {
    const testKey = `${suiteId}-${test.id}`
    
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

      return result.success
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

      return false
    }
  }

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults({})
    setOverallProgress(0)
    
    let totalTests = 0
    let completedTests = 0
    
    // Count total tests
    testSuites.forEach(suite => {
      totalTests += suite.tests.length
    })
    
    for (const suite of testSuites) {
      for (const test of suite.tests) {
        await runSingleTest(suite.id, test)
        completedTests++
        setOverallProgress((completedTests / totalTests) * 100)
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }
    
    setIsRunning(false)
    toast.success('🎉 Comprehensive integration tests completed!')
  }

  // Run suite tests
  const runSuiteTests = async (suite) => {
    setIsRunning(true)
    
    for (const test of suite.tests) {
      await runSingleTest(suite.id, test)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsRunning(false)
    toast.success(`✅ ${suite.name} tests completed!`)
  }

  // Get test status
  const getTestStatus = (suiteId, testId) => {
    return testResults[`${suiteId}-${testId}`]
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

  // Get suite progress
  const getSuiteProgress = (suite) => {
    const suiteTests = suite.tests.map(test => getTestStatus(suite.id, test.id))
    const completed = suiteTests.filter(test => test && test.status !== 'running').length
    const total = suite.tests.length
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 }
  }

  return (
    <div className={cn(
      "min-h-screen p-6",
      resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-6xl mx-auto">
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
                Comprehensive Integration Test Suite
              </h1>
              <p className={cn(
                "text-sm",
                resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                Complete end-to-end testing of all integrated systems
              </p>
              {isRunning && (
                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-blue-500">Overall Progress:</span>
                    <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              )}
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

        {/* Test Suites */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testSuites.map((suite) => {
            const progress = getSuiteProgress(suite)
            const IconComponent = suite.icon
            
            return (
              <div
                key={suite.id}
                className={cn(
                  "rounded-lg border",
                  resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                )}
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-5 h-5 text-${suite.color}-500`} />
                      <h2 className={cn(
                        "text-lg font-semibold",
                        resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {suite.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {progress.completed}/{progress.total}
                      </span>
                      <button
                        onClick={() => runSuiteTests(suite)}
                        disabled={isRunning}
                        className={cn(
                          "px-3 py-1 rounded text-sm font-medium transition-colors",
                          `bg-${suite.color}-600 hover:bg-${suite.color}-700 text-white`,
                          isRunning && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        Test
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`bg-${suite.color}-500 h-1.5 rounded-full transition-all duration-300`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    {suite.tests.map((test) => {
                      const testStatus = getTestStatus(suite.id, test.id)
                      return (
                        <div
                          key={test.id}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg",
                            resolvedTheme === 'dark' ? 'bg-gray-750' : 'bg-gray-50'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {getStatusIcon(testStatus?.status)}
                            <div>
                              <h3 className={cn(
                                "font-medium",
                                resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                              )}>
                                {test.name}
                              </h3>
                              {testStatus?.duration && (
                                <p className="text-xs text-gray-500">
                                  {testStatus.duration}ms
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() => runSingleTest(suite.id, test)}
                            disabled={isRunning}
                            className={cn(
                              "px-2 py-1 rounded text-xs font-medium transition-colors",
                              "bg-gray-600 hover:bg-gray-700 text-white",
                              isRunning && 'opacity-50 cursor-not-allowed'
                            )}
                          >
                            Run
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ComprehensiveIntegrationTest
