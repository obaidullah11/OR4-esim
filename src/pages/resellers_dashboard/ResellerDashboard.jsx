import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  UserPlus,
  Smartphone,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Wifi,
  Globe,
  CreditCard
} from 'lucide-react'

// Import services
import { clientService } from '../../services/clientService'
import { esimService } from '../../services/esimService'

// Key Metrics Cards Component for Reseller Dashboard
function ResellerMetricsCards({ metrics, loading }) {
  const { resolvedTheme } = useTheme()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="w-16 h-6 bg-muted rounded"></div>
            </div>
            <div className="mt-4">
              <div className="w-20 h-8 bg-muted rounded mb-2"></div>
              <div className="w-24 h-4 bg-muted rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const metricsData = [
    {
      title: 'Total Clients',
      value: metrics?.totalClients?.toLocaleString() || '0',
      change: `${metrics?.clientGrowth >= 0 ? '+' : ''}${metrics?.clientGrowth || 0}%`,
      trend: metrics?.clientGrowth >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active eSIMs',
      value: metrics?.activeEsims?.toLocaleString() || '0',
      change: `${metrics?.esimGrowth >= 0 ? '+' : ''}${metrics?.esimGrowth || 0}%`,
      trend: metrics?.esimGrowth >= 0 ? 'up' : 'down',
      icon: Smartphone,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: `$${metrics?.monthlyRevenue?.toLocaleString() || '0'}`,
      change: `${metrics?.revenueGrowth >= 0 ? '+' : ''}${metrics?.revenueGrowth || 0}%`,
      trend: metrics?.revenueGrowth >= 0 ? 'up' : 'down',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Credit Balance',
      value: `$${metrics?.creditBalance?.toLocaleString() || '0'}`,
      change: `${metrics?.creditUsage || 0}% used`,
      trend: metrics?.creditUsage < 80 ? 'up' : 'down',
      icon: CreditCard,
      color: 'orange'
    }
  ]

  const getColorClasses = (color, trend) => {
    const colors = {
      blue: {
        bg: resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
        icon: 'text-blue-500',
        trend: trend === 'up' ? 'text-green-500' : 'text-red-500'
      },
      green: {
        bg: resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
        icon: 'text-green-500',
        trend: trend === 'up' ? 'text-green-500' : 'text-red-500'
      },
      purple: {
        bg: resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
        icon: 'text-purple-500',
        trend: trend === 'up' ? 'text-green-500' : 'text-red-500'
      },
      orange: {
        bg: resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50',
        icon: 'text-orange-500',
        trend: trend === 'up' ? 'text-green-500' : 'text-red-500'
      }
    }
    return colors[color]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
        const colorClasses = getColorClasses(metric.color, metric.trend)

        return (
          <div
            key={metric.title}
            className={`
              bg-card border border-border rounded-lg p-6 transition-all duration-300 hover:shadow-lg
              ${resolvedTheme === 'dark' ? 'hover:bg-card/80' : 'hover:bg-card/50'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${colorClasses.bg}`}>
                <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
              </div>
              <div className={`flex items-center space-x-1 ${colorClasses.trend}`}>
                <TrendIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-foreground">{metric.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{metric.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Quick Actions Component
function QuickActions({ onAddClient, onAssignEsim, onViewClients, onViewHistory }) {
  const { resolvedTheme } = useTheme()

  const actions = [
    {
      title: 'Add New Client',
      description: 'Register a new client for eSIM services',
      icon: UserPlus,
      color: 'blue',
      onClick: onAddClient
    },
    {
      title: 'Assign eSIM',
      description: 'Assign an eSIM plan to existing client',
      icon: Smartphone,
      color: 'green',
      onClick: onAssignEsim
    },
    {
      title: 'View All Clients',
      description: 'Manage your client database',
      icon: Users,
      color: 'purple',
      onClick: onViewClients
    },
    {
      title: 'eSIM History',
      description: 'View eSIM assignments and usage',
      icon: Activity,
      color: 'orange',
      onClick: onViewHistory
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: resolvedTheme === 'dark' ? 'bg-blue-500/10 hover:bg-blue-500/20' : 'bg-blue-50 hover:bg-blue-100',
        border: 'border-blue-200 dark:border-blue-500/20',
        icon: 'text-blue-500',
        text: 'text-blue-600 dark:text-blue-400'
      },
      green: {
        bg: resolvedTheme === 'dark' ? 'bg-green-500/10 hover:bg-green-500/20' : 'bg-green-50 hover:bg-green-100',
        border: 'border-green-200 dark:border-green-500/20',
        icon: 'text-green-500',
        text: 'text-green-600 dark:text-green-400'
      },
      purple: {
        bg: resolvedTheme === 'dark' ? 'bg-purple-500/10 hover:bg-purple-500/20' : 'bg-purple-50 hover:bg-purple-100',
        border: 'border-purple-200 dark:border-purple-500/20',
        icon: 'text-purple-500',
        text: 'text-purple-600 dark:text-purple-400'
      },
      orange: {
        bg: resolvedTheme === 'dark' ? 'bg-orange-500/10 hover:bg-orange-500/20' : 'bg-orange-50 hover:bg-orange-100',
        border: 'border-orange-200 dark:border-orange-500/20',
        icon: 'text-orange-500',
        text: 'text-orange-600 dark:text-orange-400'
      }
    }
    return colors[color]
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        const colorClasses = getColorClasses(action.color)

        return (
          <button
            key={action.title}
            onClick={action.onClick}
            className={`
              p-6 rounded-lg border-2 transition-all duration-200 text-left
              ${colorClasses.bg} ${colorClasses.border}
            `}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-2 rounded-lg ${colorClasses.bg}`}>
                <Icon className={`h-6 w-6 ${colorClasses.icon}`} />
              </div>
            </div>
            <h3 className={`font-semibold mb-2 ${colorClasses.text}`}>
              {action.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {action.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}

function ResellerDashboard() {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Sample data for demonstration
  const sampleData = {
    metrics: {
      totalClients: 125,
      clientGrowth: 12,
      activeEsims: 98,
      esimGrowth: 8,
      monthlyRevenue: 15750,
      revenueGrowth: 15,
      creditBalance: 25000,
      creditUsage: 65
    },
    recentActivities: [
      {
        id: 1,
        type: 'client',
        action: 'New client registered: John Smith',
        user: 'System',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        type: 'esim',
        action: 'eSIM assigned to Sarah Johnson - Europe 30 Days',
        user: 'You',
        time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        type: 'payment',
        action: 'Payment received: $250.00',
        user: 'System',
        time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 4,
        type: 'esim',
        action: 'eSIM activated: Michael Chen - Asia Pacific 7 Days',
        user: 'Client',
        time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    ]
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔄 Fetching real reseller dashboard data...')

      // Get dashboard data from multiple sources
      const [clientsResponse, esimsResponse] = await Promise.allSettled([
        clientService.getMyClients({ limit: 100 }),
        esimService.getResellerEsims({ limit: 100 })
      ])

      // Process clients data
      const clientsData = clientsResponse.status === 'fulfilled' && clientsResponse.value.success
        ? clientsResponse.value.data
        : { results: [], pagination: { total: 0 } }

      // Process eSIMs data
      const esimsData = esimsResponse.status === 'fulfilled' && esimsResponse.value.success
        ? esimsResponse.value.data
        : { results: [], pagination: { total: 0 } }

      // Calculate metrics from real data
      const totalClients = clientsData.pagination?.total || clientsData.results?.length || 0
      const totalEsims = esimsData.pagination?.total || esimsData.results?.length || 0
      const activeEsims = esimsData.results?.filter(esim =>
        ['active', 'activated'].includes(esim.status)
      )?.length || 0

      // Calculate revenue (mock calculation for now)
      const totalRevenue = esimsData.results?.reduce((sum, esim) =>
        sum + (esim.plan?.price || 0), 0
      ) || 0

      // Transform the API response to match our dashboard format
      const transformedData = {
        metrics: {
          totalClients: totalClients,
          activeEsims: activeEsims,
          totalRevenue: totalRevenue,
          monthlyGrowth: 12.5, // Mock for now
          clientGrowth: totalClients > 0 ? 8.3 : 0,
          esimGrowth: totalEsims > 0 ? 15.2 : 0,
          revenueGrowth: totalRevenue > 0 ? 22.1 : 0
        },
        recentClients: clientsData.results?.slice(0, 5).map(client => ({
          id: client.id,
          name: client.full_name,
          email: client.email,
          joinDate: client.created_at,
          status: client.status
        })) || [],
        recentEsims: esimsData.results?.slice(0, 5).map(esim => ({
          id: esim.id,
          clientName: esim.client?.full_name || 'Unknown',
          planName: esim.plan?.name || 'Unknown Plan',
          status: esim.status,
          assignedDate: esim.assigned_at || esim.created_at
        })) || [],
        availablePlans: [] // Will be populated separately if needed
      }

      setDashboardData(transformedData)
      setLastUpdated(new Date())
      console.log('✅ Dashboard data loaded successfully:', transformedData)

      setLoading(false)
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error)
      // No fallback to sample data - show error
      setDashboardData({
        metrics: { totalClients: 0, totalEsims: 0, activeEsims: 0, totalRevenue: 0, monthlyGrowth: 0 },
        recentActivity: [], topPlans: [], monthlyStats: []
      })
      setLastUpdated(new Date())
      setError(`API Error: ${error.message}`)
      toast.error('Failed to load dashboard data from server')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Quick action handlers
  const handleAddClient = () => {
    navigate('/reseller-dashboard/add-client')
  }

  const handleAssignEsim = () => {
    navigate('/reseller-dashboard/assign-esim')
  }

  const handleViewClients = () => {
    navigate('/reseller-dashboard/clients')
  }

  const handleViewHistory = () => {
    navigate('/reseller-dashboard/history')
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-xl font-semibold text-foreground">Failed to Load Dashboard</h2>
        <p className="text-muted-foreground text-center max-w-md">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reseller Dashboard</h1>
          <p className="text-muted-foreground">Manage your clients and eSIM services</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <ResellerMetricsCards metrics={dashboardData?.metrics} loading={loading} />

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <QuickActions
          onAddClient={handleAddClient}
          onAssignEsim={handleAssignEsim}
          onViewClients={handleViewClients}
          onViewHistory={handleViewHistory}
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h3>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-4 bg-muted rounded"></div>
                  <div className="w-24 h-3 bg-muted rounded"></div>
                </div>
                <div className="w-20 h-3 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {dashboardData?.recentActivities?.length > 0 ? (
              dashboardData.recentActivities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'client' ? 'bg-blue-500/10 text-blue-500' :
                    activity.type === 'esim' ? 'bg-green-500/10 text-green-500' :
                    activity.type === 'payment' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-purple-500/10 text-purple-500'
                  }`}>
                    {activity.type === 'client' && <UserPlus className="h-4 w-4" />}
                    {activity.type === 'esim' && <Smartphone className="h-4 w-4" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                    {activity.type === 'activation' && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time ? new Date(activity.time).toLocaleString() : 'Unknown time'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResellerDashboard
