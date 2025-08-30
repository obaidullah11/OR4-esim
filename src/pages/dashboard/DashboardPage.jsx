import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
// BACKEND INTEGRATION ACTIVATED
import { dashboardService } from '../../services/apiService'
import {
  Users,
  UserCheck,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

// Import chart components
import SalesTrendsChart from '../../components/dashboard/SalesTrendsChart'
import TopResellersChart from '../../components/dashboard/TopResellersChart'
import MonthlyOrdersChart from '../../components/dashboard/MonthlyOrdersChart'
import RevenueChart from '../../components/dashboard/RevenueChart'

// Key Metrics Cards Component
function MetricsCards({ metrics, loading }) {
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
      title: 'Total Users',
      value: metrics?.totalUsers?.toLocaleString() || '0',
      change: `${metrics?.userGrowth >= 0 ? '+' : ''}${metrics?.userGrowth || 0}%`,
      trend: metrics?.userGrowth >= 0 ? 'up' : 'down',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Resellers',
      value: metrics?.totalResellers?.toLocaleString() || '0',
      change: `${metrics?.resellerGrowth >= 0 ? '+' : ''}${metrics?.resellerGrowth || 0}%`,
      trend: metrics?.resellerGrowth >= 0 ? 'up' : 'down',
      icon: UserCheck,
      color: 'green'
    },
    {
      title: 'Daily SIM Orders',
      value: metrics?.dailySimOrders?.toLocaleString() || '0',
      change: `${metrics?.orderGrowth >= 0 ? '+' : ''}${metrics?.orderGrowth || 0}%`,
      trend: metrics?.orderGrowth >= 0 ? 'up' : 'down',
      icon: ShoppingCart,
      color: 'purple'
    },
    {
      title: 'Revenue Generated',
      value: `$${metrics?.revenueGenerated?.toLocaleString() || '0'}`,
      change: `${metrics?.revenueGrowth >= 0 ? '+' : ''}${metrics?.revenueGrowth || 0}%`,
      trend: metrics?.revenueGrowth >= 0 ? 'up' : 'down',
      icon: DollarSign,
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

function DashboardPage() {
  const { resolvedTheme } = useTheme()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchDashboardData = async () => {
    // BACKEND INTEGRATION ACTIVATED
    try {
      setLoading(true)
      setError(null)

      // Try to get authenticated dashboard first, fallback to test dashboard
      let data
      try {
        data = await dashboardService.getDashboardData()
      } catch (authError) {
        console.log('Auth failed, using test dashboard:', authError.message)
        data = await dashboardService.getTestAdminDashboard()
      }

      setDashboardData(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDashboardData()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

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
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the SIM Admin Panel</p>
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
      <MetricsCards metrics={dashboardData?.metrics} loading={loading} />

      {/* Charts Section - Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trends Chart */}
        <SalesTrendsChart 
          data={dashboardData?.salesTrends} 
          loading={loading} 
        />

        {/* Top Performing Resellers Chart */}
        <TopResellersChart 
          data={dashboardData?.topResellers} 
          loading={loading} 
        />
      </div>

      {/* Charts Section - Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Orders Chart */}
        <MonthlyOrdersChart 
          data={dashboardData?.ordersOverview} 
          loading={loading} 
        />

        {/* Revenue Chart */}
        <RevenueChart 
          data={dashboardData?.revenueAnalytics} 
          loading={loading} 
        />
      </div>

      {/* Latest Activities */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Latest Activities</h3>
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
            {dashboardData?.latestActivities?.length > 0 ? (
              dashboardData.latestActivities.map((activity, index) => (
                <div key={`activity-${activity.id || index}-${activity.timestamp || Date.now()}`} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'user' ? 'bg-blue-500/10 text-blue-500' :
                    activity.type === 'order' ? 'bg-green-500/10 text-green-500' :
                    activity.type === 'payment' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-purple-500/10 text-purple-500'
                  }`}>
                    {activity.type === 'user' && <Users className="h-4 w-4" />}
                    {activity.type === 'order' && <ShoppingCart className="h-4 w-4" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                    {activity.type === 'reseller' && <UserCheck className="h-4 w-4" />}
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

export default DashboardPage
