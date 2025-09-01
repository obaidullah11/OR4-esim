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
  CreditCard,
  Zap
} from 'lucide-react'

// Import services
import { clientService } from '../../services/clientService'
import { esimService } from '../../services/esimService'

// Enhanced Key Metrics Cards Component for Reseller Dashboard
function ResellerMetricsCards({ metrics, loading }) {
  const { resolvedTheme } = useTheme()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-6 shimmer">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 bg-muted rounded-2xl skeleton"></div>
              <div className="w-16 h-6 bg-muted rounded-lg skeleton"></div>
            </div>
            <div className="mt-6">
              <div className="w-24 h-8 bg-muted rounded-lg skeleton mb-3"></div>
              <div className="w-32 h-4 bg-muted rounded skeleton"></div>
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
              bg-card border border-border rounded-2xl p-6 transition-all duration-500 
              card-interactive card-glow group relative overflow-hidden
              ${resolvedTheme === 'dark' ? 'hover:bg-card/90' : 'hover:bg-card/70'}
            `}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Background Gradient Effect */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${colorClasses.bg}`}></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className={`p-4 rounded-2xl ${colorClasses.bg} transition-all duration-300 group-hover:scale-110`}>
                  <Icon className={`h-7 w-7 ${colorClasses.icon} transition-all duration-300`} />
                </div>
                <div className={`flex items-center space-x-2 ${colorClasses.trend} transition-all duration-300 group-hover:scale-105`}>
                  <TrendIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold">{metric.change}</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-3xl font-bold text-foreground transition-all duration-300 group-hover:text-gradient-colorful">
                  {metric.value}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{metric.title}</p>
              </div>
            </div>

            {/* Floating Animation Dots */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-30 transition-opacity duration-500">
              <div className={`w-2 h-2 ${colorClasses.bg} rounded-full animate-float`}></div>
            </div>
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
              <div className={`w-1 h-1 ${colorClasses.bg} rounded-full animate-float`} style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Quick Actions Component
function QuickActions({ onAssignEsim, onViewClients, onViewHistory }) {
  const { resolvedTheme } = useTheme()

  const actions = [

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {actions.map((action, index) => {
        const Icon = action.icon
        const colorClasses = getColorClasses(action.color)

        return (
          <button
            key={action.title}
            onClick={action.onClick}
            className={`
              group relative p-8 rounded-2xl border-2 transition-all duration-500 text-left
              card-interactive card-glow overflow-hidden
              ${colorClasses.bg} ${colorClasses.border}
              hover:border-opacity-60 focus-ring
            `}
            style={{
              animationDelay: `${index * 0.15}s`
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${resolvedTheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'} 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${colorClasses.bg} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <Icon className={`h-8 w-8 ${colorClasses.icon}`} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className={`w-3 h-3 ${colorClasses.bg} rounded-full animate-pulse-soft`}></div>
                </div>
              </div>
              
              <div>
                <h3 className={`text-xl font-bold mb-3 ${colorClasses.text} transition-all duration-300 group-hover:text-gradient-colorful`}>
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className={`w-8 h-8 ${colorClasses.bg} rounded-full flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${colorClasses.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
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
    <div className="space-y-10">
      {/* Enhanced Header */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="slide-down">
            <h1 className="text-4xl font-bold text-gradient-colorful mb-2">
              Reseller Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your clients and eSIM services with ease
            </p>
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
                <span className="text-emerald-600 font-medium">System Online</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Wifi className="w-4 h-4 text-blue-500" />
                <span className="text-blue-600 font-medium">Connected</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4 slide-down" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className={`
                flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 
                focus-ring hover-scale disabled:opacity-50 disabled:hover:scale-100
                ${resolvedTheme === 'dark' 
                  ? 'bg-slate-700/50 hover:bg-slate-600/60 text-slate-300' 
                  : 'bg-gray-100/50 hover:bg-gray-200/60 text-gray-700'
                }
              `}
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="font-medium">Refresh</span>
            </button>
            <div className={`
              flex items-center space-x-3 px-4 py-3 rounded-xl border
              ${resolvedTheme === 'dark' 
                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' 
                : 'bg-white/50 border-gray-200/50 text-gray-600'
              }
            `}>
              <Calendar className="h-5 w-5" />
              <div className="text-sm">
                <div className="font-medium">Last updated</div>
                <div className="text-xs text-muted-foreground">
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics with Enhanced Spacing */}
      <div className="slide-up">
        <ResellerMetricsCards metrics={dashboardData?.metrics} loading={loading} />
      </div>

      {/* Quick Actions with Enhanced Styling */}
      <div className="space-y-6 slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Quick Actions</h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Zap className="w-4 h-4" />
            <span>Fast workflow tools</span>
          </div>
        </div>
        <QuickActions
          onAssignEsim={handleAssignEsim}
          onViewClients={handleViewClients}
          onViewHistory={handleViewHistory}
        />
      </div>

      {/* Enhanced Recent Activities */}
      <div className="slide-up" style={{ animationDelay: '0.4s' }}>
        <div className={`
          bg-card border border-border rounded-2xl p-8 transition-all duration-300
          ${resolvedTheme === 'dark' ? 'bg-slate-800/50' : 'bg-white/50'}
          backdrop-blur-lg
        `}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">Recent Activities</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Live updates</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
            </div>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-xl shimmer">
                  <div className="w-12 h-12 bg-muted rounded-2xl skeleton"></div>
                  <div className="flex-1 space-y-3">
                    <div className="w-40 h-4 bg-muted rounded-lg skeleton"></div>
                    <div className="w-32 h-3 bg-muted rounded skeleton"></div>
                  </div>
                  <div className="w-24 h-3 bg-muted rounded skeleton"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {dashboardData?.recentActivities?.length > 0 ? (
                dashboardData.recentActivities.map((activity, index) => (
                  <div 
                    key={activity.id || index} 
                    className={`
                      group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300
                      hover:bg-muted/20 hover:shadow-md border border-transparent hover:border-border/30
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`
                      p-3 rounded-2xl transition-all duration-300 group-hover:scale-110
                      ${activity.type === 'client' ? 'bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20' :
                        activity.type === 'esim' ? 'bg-green-500/10 text-green-500 group-hover:bg-green-500/20' :
                        activity.type === 'payment' ? 'bg-orange-500/10 text-orange-500 group-hover:bg-orange-500/20' :
                        'bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20'
                      }
                    `}>
                      {activity.type === 'client' && <UserPlus className="h-5 w-5" />}
                      {activity.type === 'esim' && <Smartphone className="h-5 w-5" />}
                      {activity.type === 'payment' && <DollarSign className="h-5 w-5" />}
                      {activity.type === 'activation' && <CheckCircle className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-gradient-colorful transition-all duration-300">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        by {activity.user}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground font-medium">
                        {activity.time ? new Date(activity.time).toLocaleTimeString() : 'Unknown'}
                      </span>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        {activity.time ? new Date(activity.time).toLocaleDateString() : ''}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-muted/20 rounded-2xl mb-4">
                    <Activity className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-lg font-medium text-muted-foreground">No recent activities</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Your activities will appear here as you use the system
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResellerDashboard
