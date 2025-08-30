import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../utils/theme'
import { toast } from 'react-hot-toast'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  Database,
  Users,
  Smartphone,
  Globe,
  Settings
} from 'lucide-react'

// Import all our services
import { clientService } from '../../services/clientService'
import { esimService } from '../../services/esimService'
import { traveRoamService } from '../../services/traveRoamService'

function ApiTestPage() {
  const { resolvedTheme } = useTheme()
  const [testResults, setTestResults] = useState({})
  const [isRunning, setIsRunning] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Define all API tests
  const apiTests = {
    clients: {
      name: 'Client Management APIs',
      icon: Users,
      color: 'blue',
      tests: [
        {
          id: 'clients-list',
          name: 'Get All Clients',
          description: 'Test /api/v1/clients/ endpoint',
          test: () => clientService.getAllClients({ limit: 5 })
        },
        {
          id: 'clients-my',
          name: 'Get My Clients',
          description: 'Test /api/v1/clients/my_clients/ endpoint',
          test: () => clientService.getMyClients({ limit: 5 })
        },
        {
          id: 'clients-create',
          name: 'Create Client (Test)',
          description: 'Test client creation with sample data',
          test: () => clientService.createClient({
            full_name: 'Test Client API',
            email: `test-${Date.now()}@example.com`,
            phone_number: '+1234567890',
            client_type: 'reseller_client',
            status: 'active'
          })
        }
      ]
    },
    esims: {
      name: 'eSIM Management APIs',
      icon: Smartphone,
      color: 'green',
      tests: [
        {
          id: 'esims-list',
          name: 'Get All eSIMs',
          description: 'Test /api/v1/esim/esims/ endpoint',
          test: () => esimService.getAllEsims({ limit: 5 })
        },
        {
          id: 'esim-plans',
          name: 'Get eSIM Plans',
          description: 'Test /api/v1/esim/esim-plans/ endpoint',
          test: () => esimService.getAllPlans({ limit: 5 })
        },
        {
          id: 'esim-usage',
          name: 'Get eSIM Usage',
          description: 'Test /api/v1/esim/esim-usage/ endpoint',
          test: () => esimService.getEsimUsage({ limit: 5 })
        },
        {
          id: 'available-plans',
          name: 'Get Available Plans',
          description: 'Test /api/v1/esim/esim-plans/available_plans/ endpoint',
          test: () => esimService.getAvailablePlans()
        }
      ]
    },
    reseller: {
      name: 'Reseller Workflow APIs',
      icon: Settings,
      color: 'purple',
      tests: [
        {
          id: 'reseller-dashboard',
          name: 'Get Reseller Dashboard',
          description: 'Test /api/v1/esim/reseller/dashboard/ endpoint',
          test: () => esimService.getResellerDashboard()
        },
        {
          id: 'reseller-clients',
          name: 'Get Reseller Clients',
          description: 'Test /api/v1/esim/reseller/clients/ endpoint',
          test: () => esimService.getResellerClients({ limit: 5 })
        },
        {
          id: 'reseller-esims',
          name: 'Get Reseller eSIMs',
          description: 'Test /api/v1/esim/reseller/esims/ endpoint',
          test: () => esimService.getResellerEsims({ limit: 5 })
        },
        {
          id: 'reseller-plans',
          name: 'Get Reseller Plans',
          description: 'Test /api/v1/esim/reseller/plans/ endpoint',
          test: () => esimService.getResellerPlans()
        }
      ]
    },
    traveroam: {
      name: 'TraveRoam Integration APIs',
      icon: Globe,
      color: 'orange',
      tests: [
        {
          id: 'traveroam-plans',
          name: 'Get TraveRoam Plans',
          description: 'Test /api/v1/traveroam/plans/ endpoint',
          test: () => traveRoamService.getAvailablePlans()
        },
        {
          id: 'traveroam-networks',
          name: 'Get TraveRoam Networks',
          description: 'Test /api/v1/traveroam/networks/ endpoint',
          test: () => traveRoamService.getNetworks({ countries: 'US,CA', returnall: false })
        },
        {
          id: 'traveroam-catalogue',
          name: 'Get TraveRoam Catalogue',
          description: 'Test TraveRoam catalogue endpoint',
          test: () => traveRoamService.getCatalogue()
        },
        {
          id: 'traveroam-all-networks',
          name: 'Get All Networks',
          description: 'Test getting all available networks',
          test: () => traveRoamService.getAllNetworks()
        }
      ]
    }
  }

  // Run a single test
  const runSingleTest = async (categoryKey, test) => {
    const testKey = `${categoryKey}-${test.id}`
    
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

  // Run all tests in a category
  const runCategoryTests = async (categoryKey) => {
    const category = apiTests[categoryKey]
    setIsRunning(true)

    for (const test of category.tests) {
      await runSingleTest(categoryKey, test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true)
    
    for (const categoryKey of Object.keys(apiTests)) {
      await runCategoryTests(categoryKey)
    }
    
    setIsRunning(false)
    toast.success('🎉 All API tests completed!')
  }

  // Clear all results
  const clearResults = () => {
    setTestResults({})
    toast.success('Test results cleared')
  }

  // Get test status
  const getTestStatus = (categoryKey, testId) => {
    const testKey = `${categoryKey}-${testId}`
    return testResults[testKey]
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

  // Filter categories
  const filteredCategories = selectedCategory === 'all' 
    ? Object.entries(apiTests)
    : Object.entries(apiTests).filter(([key]) => key === selectedCategory)

  return (
    <div className={cn(
      "min-h-screen p-6",
      resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-7xl mx-auto">
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
                API Integration Test Suite
              </h1>
              <p className={cn(
                "text-sm",
                resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                Test all backend API integrations to ensure proper connectivity
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={clearResults}
                disabled={isRunning}
                className={cn(
                  "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                  "border border-gray-300 hover:bg-gray-50",
                  resolvedTheme === 'dark' ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'text-gray-700',
                  isRunning && 'opacity-50 cursor-not-allowed'
                )}
              >
                <RefreshCw className="w-4 h-4" />
                Clear Results
              </button>
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
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors",
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : resolvedTheme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              )}
            >
              All Categories
            </button>
            {Object.entries(apiTests).map(([key, category]) => {
              const IconComponent = category.icon
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={cn(
                    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                    selectedCategory === key
                      ? `bg-${category.color}-600 text-white`
                      : resolvedTheme === 'dark'
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Test Categories */}
        <div className="space-y-6">
          {filteredCategories.map(([categoryKey, category]) => {
            const IconComponent = category.icon
            return (
              <div
                key={categoryKey}
                className={cn(
                  "rounded-lg border",
                  resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                )}
              >
                {/* Category Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className={cn("w-5 h-5", `text-${category.color}-500`)} />
                      <h2 className={cn(
                        "text-lg font-semibold",
                        resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                      )}>
                        {category.name}
                      </h2>
                    </div>
                    <button
                      onClick={() => runCategoryTests(categoryKey)}
                      disabled={isRunning}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2",
                        `bg-${category.color}-600 hover:bg-${category.color}-700 text-white`,
                        isRunning && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <Play className="w-4 h-4" />
                      Run Category
                    </button>
                  </div>
                </div>

                {/* Tests */}
                <div className="p-4">
                  <div className="space-y-3">
                    {category.tests.map((test) => {
                      const testStatus = getTestStatus(categoryKey, test.id)
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
                                onClick={() => runSingleTest(categoryKey, test)}
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
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ApiTestPage
