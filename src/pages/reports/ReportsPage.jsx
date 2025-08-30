import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'
// BACKEND INTEGRATION ACTIVATED
import { reportsService } from '../../services/reportsService'
import {
  Calendar,
  Download,
  FileText,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Smartphone,
  Building,
  Package,
  Activity,
  RefreshCw,
  Filter,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Zap,
  Globe,
  CreditCard
} from 'lucide-react'
import PerformanceChart from '../../components/reports/PerformanceChart'
import RevenueChart from '../../components/reports/RevenueChart'
import UserGrowthChart from '../../components/reports/UserGrowthChart'
import TopPackagesChart from '../../components/reports/TopPackagesChart'
import ExportModal from '../../components/reports/ExportModal'

// Sample analytics data
const sampleAnalytics = {
  overview: {
    totalRevenue: 125750.50,
    totalUsers: 2847,
    totalOrders: 1523,
    activeUsers: 2156,
    revenueGrowth: 12.5,
    userGrowth: 8.3,
    orderGrowth: 15.2,
    activeUserGrowth: 6.7
  },
  revenueBreakdown: {
    appUsers: 78450.30,
    resellers: 47300.20,
    appUsersPercentage: 62.4,
    resellersPercentage: 37.6,
    appUsersGrowth: 15.2,
    resellersGrowth: 8.7
  },
  dailyPerformance: [
    { date: '2024-03-01', revenue: 4250, orders: 23, users: 18, appRevenue: 2650, resellerRevenue: 1600 },
    { date: '2024-03-02', revenue: 3890, orders: 21, users: 16, appRevenue: 2340, resellerRevenue: 1550 },
    { date: '2024-03-03', revenue: 5120, orders: 28, users: 22, appRevenue: 3200, resellerRevenue: 1920 },
    { date: '2024-03-04', revenue: 4680, orders: 25, users: 19, appRevenue: 2890, resellerRevenue: 1790 },
    { date: '2024-03-05', revenue: 5450, orders: 31, users: 24, appRevenue: 3400, resellerRevenue: 2050 },
    { date: '2024-03-06', revenue: 4920, orders: 27, users: 21, appRevenue: 3100, resellerRevenue: 1820 },
    { date: '2024-03-07', revenue: 5680, orders: 33, users: 26, appRevenue: 3550, resellerRevenue: 2130 },
    { date: '2024-03-08', revenue: 5230, orders: 29, users: 23, appRevenue: 3280, resellerRevenue: 1950 },
    { date: '2024-03-09', revenue: 4750, orders: 26, users: 20, appRevenue: 2980, resellerRevenue: 1770 },
    { date: '2024-03-10', revenue: 6120, orders: 35, users: 28, appRevenue: 3850, resellerRevenue: 2270 },
    { date: '2024-03-11', revenue: 5890, orders: 32, users: 25, appRevenue: 3690, resellerRevenue: 2200 },
    { date: '2024-03-12', revenue: 5340, orders: 30, users: 24, appRevenue: 3350, resellerRevenue: 1990 },
    { date: '2024-03-13', revenue: 6450, orders: 37, users: 29, appRevenue: 4050, resellerRevenue: 2400 },
    { date: '2024-03-14', revenue: 5780, orders: 33, users: 26, appRevenue: 3620, resellerRevenue: 2160 },
    { date: '2024-03-15', revenue: 6890, orders: 39, users: 31, appRevenue: 4320, resellerRevenue: 2570 }
  ],
  monthlyPerformance: [
    { month: 'Jan 2024', revenue: 98450, orders: 542, users: 423, appRevenue: 61250, resellerRevenue: 37200 },
    { month: 'Feb 2024', revenue: 112340, orders: 618, users: 487, appRevenue: 69890, resellerRevenue: 42450 },
    { month: 'Mar 2024', revenue: 125750, orders: 693, users: 541, appRevenue: 78450, resellerRevenue: 47300 }
  ],
  userGrowth: [
    { month: 'Sep 2023', total: 1245, active: 987, new: 156 },
    { month: 'Oct 2023', total: 1398, active: 1123, new: 153 },
    { month: 'Nov 2023', total: 1567, active: 1289, new: 169 },
    { month: 'Dec 2023', total: 1743, active: 1456, new: 176 },
    { month: 'Jan 2024', total: 1934, active: 1623, new: 191 },
    { month: 'Feb 2024', total: 2156, active: 1834, new: 222 },
    { month: 'Mar 2024', total: 2398, active: 2067, new: 242 }
  ],
  topPackages: [
    { name: 'Premium 30GB', sales: 342, revenue: 51300, percentage: 22.5, growth: 15.2 },
    { name: 'Standard 15GB', sales: 289, revenue: 26010, percentage: 19.0, growth: 8.7 },
    { name: 'Basic 5GB', sales: 234, revenue: 10530, percentage: 15.4, growth: -2.3 },
    { name: 'Business 50GB', sales: 187, revenue: 37400, percentage: 12.3, growth: 23.1 },
    { name: 'Unlimited', sales: 156, revenue: 31200, percentage: 10.2, growth: 18.9 },
    { name: 'Travel 10GB', sales: 134, revenue: 10720, percentage: 8.8, growth: 12.4 },
    { name: 'Student 8GB', sales: 98, revenue: 4900, percentage: 6.4, growth: 5.6 },
    { name: 'Senior 3GB', sales: 83, revenue: 2490, percentage: 5.4, growth: -1.2 }
  ],
  topNetworks: [
    { name: 'Etisalat', sales: 567, revenue: 85050, percentage: 37.2, growth: 12.8 },
    { name: 'Du', sales: 423, revenue: 63450, percentage: 27.8, growth: 9.4 },
    { name: 'Virgin Mobile', sales: 298, revenue: 44700, percentage: 19.6, growth: 15.6 },
    { name: 'Ooredoo', sales: 235, revenue: 35250, percentage: 15.4, growth: 7.2 }
  ]
}

function ReportsPage() {
  const { resolvedTheme } = useTheme()
  const [dateRange, setDateRange] = useState('30days')
  const [reportType, setReportType] = useState('overview')
  const [showExportModal, setShowExportModal] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [analyticsData, setAnalyticsData] = useState({})
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Helper function to safely get new users count
  const getSafeNewUsersCount = () => {
    try {
      if (!analyticsData) {
        console.warn('analyticsData is null/undefined')
        return '0'
      }

      if (!analyticsData.userGrowth) {
        console.warn('analyticsData.userGrowth is null/undefined')
        return '0'
      }

      if (!Array.isArray(analyticsData.userGrowth)) {
        console.warn('analyticsData.userGrowth is not an array:', typeof analyticsData.userGrowth)
        return '0'
      }

      if (analyticsData.userGrowth.length === 0) {
        console.warn('analyticsData.userGrowth is empty array')
        return '0'
      }

      const lastEntry = analyticsData.userGrowth[analyticsData.userGrowth.length - 1]
      if (!lastEntry) {
        console.warn('Last entry in userGrowth is null/undefined')
        return '0'
      }

      const newCount = lastEntry.new
      if (newCount === null || newCount === undefined) {
        console.warn('new property is null/undefined in last userGrowth entry')
        return '0'
      }

      return newCount.toLocaleString()
    } catch (error) {
      console.error('Error in getSafeNewUsersCount:', error)
      return '0'
    }
  }

  // Fetch analytics data from backend
  const fetchAnalyticsData = async (params = {}) => {
    // BACKEND INTEGRATION ACTIVATED
    try {
      setLoading(true)

      // Get date range for the selected period
      const { startDate, endDate } = reportsService.getDateRange(dateRange)

      // Use dashboard data since analytics endpoint doesn't exist yet
      const response = await reportsService.getDashboardReports()

      if (response.success) {
        const formattedData = reportsService.formatAnalyticsData(response.data)
        setAnalyticsData(formattedData)
        setLastUpdated(new Date())
      } else {
        // No fallback to sample data - show error
        console.error('API failed to load analytics:', response.error)
        toast.error('Failed to load analytics from server')
        setAnalyticsData({})
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics from server')
      // No fallback to sample data - show error
      setAnalyticsData({})
    } finally {
      setLoading(false)
    }
  }

  // Debug analytics data
  useEffect(() => {
    console.log('🔍 Analytics data updated:', {
      hasUserGrowth: !!analyticsData?.userGrowth,
      userGrowthType: typeof analyticsData?.userGrowth,
      userGrowthLength: analyticsData?.userGrowth?.length,
      userGrowthSample: analyticsData?.userGrowth?.[0],
      lastUserGrowth: analyticsData?.userGrowth?.[analyticsData.userGrowth.length - 1]
    })
  }, [analyticsData])

  // Load analytics on component mount
  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  // Reload analytics when date range changes
  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const handleExport = async (format, reportData) => {
    // BACKEND INTEGRATION ACTIVATED
    try {
      const { startDate, endDate } = reportsService.getDateRange(dateRange)
      const response = await reportsService.exportReport(reportData.type, format, {
        date_from: startDate,
        date_to: endDate,
        period: dateRange
      })

      if (response.success) {
        toast.success(`${reportData.type} report exported successfully as ${format.toUpperCase()}`)
        console.log('✅ Report exported:', reportData.type, format)
      } else {
        toast.error('Failed to export report')
        console.error('❌ Export failed:', response.error)
      }
    } catch (error) {
      console.error('Failed to export report:', error)
      toast.error('Failed to export report')
    }

    setShowExportModal(false)
  }

  const handleRefresh = async () => {
    await fetchAnalyticsData()
    toast.success('Reports data refreshed')
    console.log('🔄 Reports data refreshed')
  }

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-500'
    if (growth < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const getGrowthIcon = (growth) => {
    if (growth > 0) return ArrowUpRight
    if (growth < 0) return ArrowDownRight
    return Activity
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              resolvedTheme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowExportModal(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
                <DollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  ${analyticsData.overview.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                {(() => {
                  const GrowthIcon = getGrowthIcon(analyticsData.overview.revenueGrowth)
                  return <GrowthIcon className="h-4 w-4" />
                })()}
                <span className="text-sm font-medium">
                  {Math.abs(analyticsData.overview.revenueGrowth)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {analyticsData.overview.totalUsers.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.overview.userGrowth)}`}>
                {(() => {
                  const GrowthIcon = getGrowthIcon(analyticsData.overview.userGrowth)
                  return <GrowthIcon className="h-4 w-4" />
                })()}
                <span className="text-sm font-medium">
                  {Math.abs(analyticsData.overview.userGrowth)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
                <Package className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {analyticsData.overview.totalOrders.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.overview.orderGrowth)}`}>
                {(() => {
                  const GrowthIcon = getGrowthIcon(analyticsData.overview.orderGrowth)
                  return <GrowthIcon className="h-4 w-4" />
                })()}
                <span className="text-sm font-medium">
                  {Math.abs(analyticsData.overview.orderGrowth)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                <Activity className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {analyticsData.overview.activeUsers.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.overview.activeUserGrowth)}`}>
                {(() => {
                  const GrowthIcon = getGrowthIcon(analyticsData.overview.activeUserGrowth)
                  return <GrowthIcon className="h-4 w-4" />
                })()}
                <span className="text-sm font-medium">
                  {Math.abs(analyticsData.overview.activeUserGrowth)}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Revenue Split</h3>
            <div className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                  <Smartphone className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">App Users</p>
                  <p className="text-sm text-muted-foreground">
                    ${analyticsData.revenueBreakdown.appUsers.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  {analyticsData.revenueBreakdown.appUsersPercentage}%
                </p>
                <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.revenueBreakdown.appUsersGrowth)}`}>
                  {(() => {
                    const GrowthIcon = getGrowthIcon(analyticsData.revenueBreakdown.appUsersGrowth)
                    return <GrowthIcon className="h-3 w-3" />
                  })()}
                  <span className="text-xs">
                    {Math.abs(analyticsData.revenueBreakdown.appUsersGrowth)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
                  <Building className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Resellers</p>
                  <p className="text-sm text-muted-foreground">
                    ${analyticsData.revenueBreakdown.resellers.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-foreground">
                  {analyticsData.revenueBreakdown.resellersPercentage}%
                </p>
                <div className={`flex items-center space-x-1 ${getGrowthColor(analyticsData.revenueBreakdown.resellersGrowth)}`}>
                  {(() => {
                    const GrowthIcon = getGrowthIcon(analyticsData.revenueBreakdown.resellersGrowth)
                    return <GrowthIcon className="h-3 w-3" />
                  })()}
                  <span className="text-xs">
                    {Math.abs(analyticsData.revenueBreakdown.resellersGrowth)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Performance Overview</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
              <option value="users">New Users</option>
            </select>
          </div>
          <PerformanceChart
            data={analyticsData.dailyPerformance}
            metric={selectedMetric}
            theme={resolvedTheme}
          />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">User Growth</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <UserGrowthChart
            data={analyticsData.userGrowth}
            theme={resolvedTheme}
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Monthly Revenue</h3>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <RevenueChart
            data={analyticsData.monthlyPerformance}
            theme={resolvedTheme}
          />
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Packages */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Top-Selling Packages</h3>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-4">
            {analyticsData.topPackages.slice(0, 5).map((pkg, index) => (
              <div key={pkg.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    resolvedTheme === 'dark' ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{pkg.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {pkg.sales} sales • ${pkg.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{pkg.percentage}%</p>
                  <div className={`flex items-center space-x-1 ${getGrowthColor(pkg.growth)}`}>
                    {(() => {
                      const GrowthIcon = getGrowthIcon(pkg.growth)
                      return <GrowthIcon className="h-3 w-3" />
                    })()}
                    <span className="text-xs">
                      {Math.abs(pkg.growth)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Networks */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Top Networks</h3>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-4">
            {analyticsData.topNetworks.map((network, index) => (
              <div key={network.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    resolvedTheme === 'dark' ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{network.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {network.sales} sales • ${network.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">{network.percentage}%</p>
                  <div className={`flex items-center space-x-1 ${getGrowthColor(network.growth)}`}>
                    {(() => {
                      const GrowthIcon = getGrowthIcon(network.growth)
                      return <GrowthIcon className="h-3 w-3" />
                    })()}
                    <span className="text-xs">
                      {Math.abs(network.growth)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Detailed Reports</h3>
          <div className="flex items-center space-x-3">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="overview">Overview</option>
              <option value="revenue">Revenue Analysis</option>
              <option value="users">User Analytics</option>
              <option value="packages">Package Performance</option>
              <option value="networks">Network Analysis</option>
            </select>
          </div>
        </div>

        {reportType === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Key Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Avg. Order Value</span>
                  <span className="font-medium text-foreground">
                    ${(analyticsData.overview.totalRevenue / analyticsData.overview.totalOrders).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">User Conversion Rate</span>
                  <span className="font-medium text-foreground">
                    {((analyticsData.overview.totalOrders / analyticsData.overview.totalUsers) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Active User Rate</span>
                  <span className="font-medium text-foreground">
                    {((analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Revenue Insights</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Daily Avg. Revenue</span>
                  <span className="font-medium text-foreground">
                    ${(analyticsData.dailyPerformance.reduce((sum, day) => sum + day.revenue, 0) / analyticsData.dailyPerformance.length).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Peak Revenue Day</span>
                  <span className="font-medium text-foreground">
                    ${Math.max(...analyticsData.dailyPerformance.map(d => d.revenue)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">Revenue Growth</span>
                  <span className={`font-medium ${getGrowthColor(analyticsData.overview.revenueGrowth)}`}>
                    +{analyticsData.overview.revenueGrowth}%
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-foreground">User Insights</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">New Users (30d)</span>
                  <span className="font-medium text-foreground">
                    {getSafeNewUsersCount()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">User Retention</span>
                  <span className="font-medium text-foreground">87.3%</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-muted-foreground">User Growth</span>
                  <span className={`font-medium ${getGrowthColor(analyticsData.overview.userGrowth)}`}>
                    +{analyticsData.overview.userGrowth}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {reportType === 'packages' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Rank</th>
                    <th className="text-left p-4 font-medium text-foreground">Package</th>
                    <th className="text-left p-4 font-medium text-foreground">Sales</th>
                    <th className="text-left p-4 font-medium text-foreground">Revenue</th>
                    <th className="text-left p-4 font-medium text-foreground">Market Share</th>
                    <th className="text-left p-4 font-medium text-foreground">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analyticsData.topPackages.map((pkg, index) => (
                    <tr key={pkg.name} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          resolvedTheme === 'dark' ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">{pkg.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">{pkg.sales}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">${pkg.revenue.toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-16 h-2 rounded-full ${resolvedTheme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'}`}>
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${pkg.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-foreground">{pkg.percentage}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`flex items-center space-x-1 ${getGrowthColor(pkg.growth)}`}>
                          {(() => {
                            const GrowthIcon = getGrowthIcon(pkg.growth)
                            return <GrowthIcon className="h-4 w-4" />
                          })()}
                          <span className="text-sm font-medium">
                            {Math.abs(pkg.growth)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'networks' && (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Rank</th>
                    <th className="text-left p-4 font-medium text-foreground">Network</th>
                    <th className="text-left p-4 font-medium text-foreground">Sales</th>
                    <th className="text-left p-4 font-medium text-foreground">Revenue</th>
                    <th className="text-left p-4 font-medium text-foreground">Market Share</th>
                    <th className="text-left p-4 font-medium text-foreground">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analyticsData.topNetworks.map((network, index) => (
                    <tr key={network.name} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          resolvedTheme === 'dark' ? 'bg-slate-600 text-slate-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">{network.name}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">{network.sales}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">${network.revenue.toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-16 h-2 rounded-full ${resolvedTheme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'}`}>
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${network.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-foreground">{network.percentage}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`flex items-center space-x-1 ${getGrowthColor(network.growth)}`}>
                          {(() => {
                            const GrowthIcon = getGrowthIcon(network.growth)
                            return <GrowthIcon className="h-4 w-4" />
                          })()}
                          <span className="text-sm font-medium">
                            {Math.abs(network.growth)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          reportType={reportType}
          dateRange={dateRange}
        />
      )}
    </div>
  )
}

export default ReportsPage
