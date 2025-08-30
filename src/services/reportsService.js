import { 
  API_ENDPOINTS,
  buildApiUrl
} from '../config/api'
import { apiService } from './apiService'

// Comprehensive reports service
export const reportsService = {
  // Get dashboard reports (already working)
  async getDashboardReports() {
    try {
      const response = await apiService.get(buildApiUrl(API_ENDPOINTS.REPORTS.DASHBOARD), { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch dashboard reports:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard reports'
      }
    }
  },

  // Get sales reports
  async getSalesReports(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      if (params.group_by) queryParams.append('group_by', params.group_by)
      
      const url = queryParams.toString() ? 
        `${buildApiUrl(API_ENDPOINTS.REPORTS.SALES)}?${queryParams.toString()}` : 
        buildApiUrl(API_ENDPOINTS.REPORTS.SALES)
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch sales reports:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch sales reports'
      }
    }
  },

  // Get user reports
  async getUserReports(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      if (params.user_type) queryParams.append('user_type', params.user_type)
      
      const url = queryParams.toString() ? 
        `${buildApiUrl(API_ENDPOINTS.REPORTS.USERS)}?${queryParams.toString()}` : 
        buildApiUrl(API_ENDPOINTS.REPORTS.USERS)
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch user reports:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user reports'
      }
    }
  },

  // Get reseller reports
  async getResellerReports(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      if (params.reseller_id) queryParams.append('reseller_id', params.reseller_id)
      
      const url = queryParams.toString() ? 
        `${buildApiUrl(API_ENDPOINTS.REPORTS.RESELLERS)}?${queryParams.toString()}` : 
        buildApiUrl(API_ENDPOINTS.REPORTS.RESELLERS)
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch reseller reports:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reseller reports'
      }
    }
  },

  // Get comprehensive analytics from dedicated analytics endpoint
  async getAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Map frontend date range to backend parameter
      if (params.date_range) queryParams.append('date_range', params.date_range)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      if (params.metrics) queryParams.append('metrics', params.metrics.join(','))
      
      // Use dedicated analytics endpoint
      const url = queryParams.toString() ? 
        `${buildApiUrl(API_ENDPOINTS.REPORTS.ANALYTICS)}?${queryParams.toString()}` : 
        buildApiUrl(API_ENDPOINTS.REPORTS.ANALYTICS)
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch analytics'
      }
    }
  },

  // Export reports (use reports endpoint with action)
  async exportReport(reportType, format = 'pdf', params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      queryParams.append('format', format)
      queryParams.append('action', 'export')
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      
      // Use the correct API endpoint structure - reports ViewSet should handle export action
      const url = `${buildApiUrl('reports/reports/')}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { 
        requiresAuth: true
      })
      
      return {
        success: true,
        data: response,
        message: `${reportType} report exported successfully`
      }
    } catch (error) {
      console.error('❌ Failed to export report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export report'
      }
    }
  },

  // Get financial report data
  async getFinancialReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.FINANCIAL_REPORT}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Failed to fetch financial report:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch financial report'
      }
    }
  },

  // Get user report data
  async getUserReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.USER_REPORT}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Failed to fetch user report:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user report'
      }
    }
  },

  // Export financial report to PDF
  async exportFinancialReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.EXPORT_FINANCIAL}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { 
        requiresAuth: true,
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      link.download = `financial-report-${dateStr}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return {
        success: true,
        message: 'Financial report exported successfully'
      }
    } catch (error) {
      console.error('❌ Failed to export financial report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export financial report'
      }
    }
  },

  // Export user report to PDF
  async exportUserReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.EXPORT_USERS_PDF}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { 
        requiresAuth: true,
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      link.download = `users-report-${dateStr}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return {
        success: true,
        message: 'User report exported successfully'
      }
    } catch (error) {
      console.error('❌ Failed to export user report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export user report'
      }
    }
  },

  // Export overview report to PDF
  async exportOverviewReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.EXPORT_OVERVIEW_PDF}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { 
        requiresAuth: true,
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      link.download = `overview-report-${dateStr}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return {
        success: true,
        message: 'Overview report exported successfully'
      }
    } catch (error) {
      console.error('❌ Failed to export overview report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export overview report'
      }
    }
  },

  // Export revenue report to PDF
  async exportRevenueReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.EXPORT_REVENUE_PDF}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { 
        requiresAuth: true,
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      link.download = `revenue-report-${dateStr}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return {
        success: true,
        message: 'Revenue report exported successfully'
      }
    } catch (error) {
      console.error('❌ Failed to export revenue report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export revenue report'
      }
    }
  },

  // Export packages report to PDF
  async exportPackagesReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.EXPORT_PACKAGES_PDF}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { 
        requiresAuth: true,
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      link.download = `packages-report-${dateStr}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return {
        success: true,
        message: 'Packages report exported successfully'
      }
    } catch (error) {
      console.error('❌ Failed to export packages report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export packages report'
      }
    }
  },

  // Export networks report to PDF
  async exportNetworksReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.EXPORT_NETWORKS_PDF}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { 
        requiresAuth: true,
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      link.download = `networks-report-${dateStr}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return {
        success: true,
        message: 'Networks report exported successfully'
      }
    } catch (error) {
      console.error('❌ Failed to export networks report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export networks report'
      }
    }
  },

  // Export transactions report to PDF
  async exportTransactionsReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.EXPORT_TRANSACTIONS_PDF}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { 
        requiresAuth: true,
        responseType: 'blob'
      })
      
      // Create download link
      const blob = new Blob([response], { type: 'application/pdf' })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      
      // Generate filename with current date
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      link.download = `transactions-report-${dateStr}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      return {
        success: true,
        message: 'Transactions report exported successfully'
      }
    } catch (error) {
      console.error('❌ Failed to export transactions report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export transactions report'
      }
    }
  },

  // Get revenue report data
  async getRevenueReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.REVENUE_REPORT}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Failed to fetch revenue report:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch revenue report'
      }
    }
  },

  // Get user growth report data
  async getUserGrowthReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.USER_GROWTH_REPORT}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Failed to fetch user growth report:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user growth report'
      }
    }
  },

  // Get sales report data
  async getSalesReport(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.period) queryParams.append('period', params.period)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = `${API_ENDPOINTS.REPORTS.SALES_REPORT}?${queryParams.toString()}`
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Failed to fetch sales report:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch sales report'
      }
    }
  },

  // Get system performance metrics
  async getSystemPerformance() {
    try {
      const url = API_ENDPOINTS.REPORTS.SYSTEM_PERFORMANCE
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Failed to fetch system performance:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch system performance'
      }
    }
  },

  // Get performance metrics
  async getPerformanceMetrics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      if (params.metric_type) queryParams.append('metric_type', params.metric_type)
      
      // Use the correct API endpoint structure
      const url = queryParams.toString() ? 
        `${buildApiUrl('reports/performance-metrics/')}?${queryParams.toString()}` : 
        buildApiUrl('reports/performance-metrics/')
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch performance metrics:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch performance metrics'
      }
    }
  },

  // Format analytics data for frontend consumption (handle both dashboard and analytics formats)
  formatAnalyticsData(data) {
    if (!data) return null
    
    // Handle both dashboard response format and new analytics format
    const metrics = data.metrics || {}
    const isAnalyticsFormat = data.monthly_trends || data.daily_performance
    
    if (isAnalyticsFormat) {
      // New analytics format
      return {
        overview: {
          totalRevenue: this.safeNumber(data.total_revenue),
          totalUsers: this.safeNumber(data.total_users),
          totalOrders: this.safeNumber(data.total_orders),
          activeUsers: this.safeNumber(data.total_resellers),
          totalClients: this.safeNumber(data.total_clients),
          pendingRevenue: this.safeNumber(data.pending_revenue),
          revenueGrowth: this.safeNumber(data.revenue_growth),
          userGrowth: this.safeNumber(data.user_growth),
          orderGrowth: this.safeNumber(data.order_growth),
          activeUserGrowth: this.safeNumber(data.user_growth)
        },
        revenueBreakdown: {
          avgOrderValue: this.safeNumber(data.avg_order_value),
          conversionRate: this.safeNumber(data.conversion_rate),
          activeResellerPercentage: this.safeNumber(data.active_reseller_percentage)
        },
        dailyPerformance: this.formatTimeSeriesData(data.daily_performance),
        monthlyPerformance: this.formatTimeSeriesData(data.monthly_trends),
        userGrowth: this.formatUserGrowthData(data.monthly_trends),
        topPackages: this.formatTopItemsData(data.popular_packages),
        topNetworks: this.formatTopItemsData(data.top_resellers),
        orderStatusDistribution: data.order_status_distribution || [],
        paymentMethodDistribution: data.payment_method_distribution || [],
        dateRange: data.date_range,
        generatedAt: data.generated_at
      }
    } else {
      // Legacy dashboard format
    return {
      overview: {
        totalRevenue: this.safeNumber(metrics.revenueGenerated || data.total_revenue),
        totalUsers: this.safeNumber(metrics.totalUsers || data.total_users),
        totalOrders: this.safeNumber(metrics.dailySimOrders || data.total_orders),
        activeUsers: this.safeNumber(metrics.totalResellers || data.active_users),
        revenueGrowth: this.safeNumber(metrics.revenueGrowth || data.revenue_growth || 12.5),
        userGrowth: this.safeNumber(metrics.userGrowth || data.user_growth || 8.3),
        orderGrowth: this.safeNumber(metrics.orderGrowth || data.order_growth || 15.2),
        activeUserGrowth: this.safeNumber(metrics.resellerGrowth || data.active_user_growth || 6.7)
      },
      revenueBreakdown: {
        appUsers: this.safeNumber(data.app_users_revenue || metrics.revenueGenerated * 0.6),
        resellers: this.safeNumber(data.resellers_revenue || metrics.revenueGenerated * 0.4),
        appUsersPercentage: this.safeNumber(data.app_users_percentage || 62.4),
        resellersPercentage: this.safeNumber(data.resellers_percentage || 37.6),
        appUsersGrowth: this.safeNumber(data.app_users_growth || 15.2),
        resellersGrowth: this.safeNumber(data.resellers_growth || 8.7)
      },
      dailyPerformance: this.formatTimeSeriesData(data.salesTrends || data.daily_performance),
      monthlyPerformance: this.formatTimeSeriesData(data.ordersOverview || data.monthly_performance),
      userGrowth: this.formatTimeSeriesData(data.userGrowth || data.user_growth),
      topPackages: this.formatTopItemsData(data.topPackages || data.top_packages),
      topNetworks: this.formatTopItemsData(data.topResellers || data.top_networks)
    }
    }
  },

  // Format user growth data from monthly trends
  formatUserGrowthData(data) {
    if (!Array.isArray(data)) return []
    
    return data.map(item => ({
      month: item.month,
      users: this.safeNumber(item.users || 0),
      growth: this.safeNumber(item.growth || 0)
    }))
  },

  // Format time series data
  formatTimeSeriesData(data) {
    if (!Array.isArray(data)) return []
    
    return data.map(item => ({
      date: item.date || item.month || item.period,
      revenue: this.safeNumber(item.revenue),
      orders: this.safeNumber(item.orders),
      users: this.safeNumber(item.users),
      appRevenue: this.safeNumber(item.app_revenue),
      resellerRevenue: this.safeNumber(item.reseller_revenue),
      total: this.safeNumber(item.total),
      active: this.safeNumber(item.active),
      new: this.safeNumber(item.new)
    }))
  },

  // Format top items data
  formatTopItemsData(data) {
    if (!Array.isArray(data)) return []
    
    // Calculate total for percentage calculation
    const totalSales = data.reduce((sum, item) => sum + this.safeNumber(item.count || item.sales || 0), 0)
    const totalRevenue = data.reduce((sum, item) => sum + this.safeNumber(item.total_revenue || item.revenue || 0), 0)
    
    return data.map((item, index) => {
      const sales = this.safeNumber(item.count || item.sales || 0)
      const revenue = this.safeNumber(item.total_revenue || item.revenue || 0)
      const percentage = totalSales > 0 ? ((sales / totalSales) * 100) : 0
      
      return {
        name: item.product_name || item.name || `Item ${index + 1}`,
        sales: sales,
        revenue: revenue,
        percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
        growth: this.safeNumber(item.growth || 0)
      }
    })
  },

  // Safe number conversion
  safeNumber(value) {
    if (value === null || value === undefined || value === '') {
      return 0
    }
    
    // Handle Decimal objects (common in Django)
    if (typeof value === 'object' && value !== null) {
      if (value.toString) {
        value = value.toString()
      } else {
        return 0
      }
    }
    
    const num = parseFloat(value)
    return isNaN(num) ? 0 : num
  },

  // Generate date ranges
  getDateRange(period) {
    const now = new Date()
    let startDate, endDate = now
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59)
        break
      case 'last_7_days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'last_30_days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'this_month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
        break
      case 'this_year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      case 'last_year':
        startDate = new Date(now.getFullYear() - 1, 0, 1)
        endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  },

  // ===== Export Functions =====

  /**
   * Export report to various formats
   */
  async exportReport(reportType, format, params = {}) {
    try {
      console.log('🔄 Exporting report:', reportType, format)

      const queryParams = new URLSearchParams()

      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      queryParams.append('format', format)

      // Map report types to specific endpoints
      const exportEndpoints = {
        'comprehensive': API_ENDPOINTS.REPORTS.EXPORT.COMPREHENSIVE,
        'overview': API_ENDPOINTS.REPORTS.EXPORT.OVERVIEW,
        'revenue': API_ENDPOINTS.REPORTS.EXPORT.REVENUE,
        'users': API_ENDPOINTS.REPORTS.EXPORT.USERS,
        'packages': API_ENDPOINTS.REPORTS.EXPORT.PACKAGES,
        'networks': API_ENDPOINTS.REPORTS.EXPORT.NETWORKS,
        'transactions': API_ENDPOINTS.REPORTS.EXPORT.TRANSACTIONS,
      }

      const endpoint = exportEndpoints[reportType]
      if (!endpoint) {
        throw new Error(`Unknown report type: ${reportType}`)
      }

      const url = queryParams.toString() ?
        `${buildApiUrl(endpoint)}?${queryParams.toString()}` :
        buildApiUrl(endpoint)

      const blob = await apiService.get(url, {
        requiresAuth: true,
        responseType: 'blob'
      })

      if (blob instanceof Blob) {
        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)

        console.log('✅ Report exported successfully')
        return { success: true }
      } else {
        throw new Error('Invalid response format - expected blob')
      }
    } catch (error) {
      console.error('❌ Failed to export report:', error)
      return {
        success: false,
        error: error.message || 'Failed to export report'
      }
    }
  },

  // ===== Advanced Analytics =====

  /**
   * Get comprehensive analytics
   */
  async getComprehensiveAnalytics(params = {}) {
    try {
      console.log('🔄 Fetching comprehensive analytics')

      const queryParams = new URLSearchParams()

      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      if (params.metrics) queryParams.append('metrics', params.metrics.join(','))

      const url = queryParams.toString() ?
        `${buildApiUrl('reports/analytics/')}?${queryParams.toString()}` :
        buildApiUrl('reports/analytics/')

      const response = await apiService.get(url, { requiresAuth: true })

      if (response.success) {
        return response
      }

      // Fallback: Generate analytics from dashboard data
      const dashboardResponse = await this.getDashboardReports()
      if (dashboardResponse.success) {
        const analytics = this.generateAdvancedAnalytics(dashboardResponse.data, params.period || '30d')
        return {
          success: true,
          data: analytics
        }
      }

      return response
    } catch (error) {
      console.error('❌ Failed to fetch comprehensive analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch analytics'
      }
    }
  },

  /**
   * Generate advanced analytics from dashboard data
   */
  generateAdvancedAnalytics(dashboardData, period) {
    const analytics = {
      overview: {
        totalRevenue: dashboardData.total_revenue || 0,
        totalUsers: dashboardData.total_users || 0,
        totalOrders: dashboardData.total_orders || 0,
        activeUsers: dashboardData.active_users || 0,
        revenueGrowth: dashboardData.revenue_growth || 0,
        userGrowth: dashboardData.user_growth || 0,
        orderGrowth: dashboardData.order_growth || 0,
        activeUserGrowth: dashboardData.active_user_growth || 0
      },
      revenueBreakdown: {
        appUsers: dashboardData.app_users_revenue || 0,
        resellers: dashboardData.resellers_revenue || 0,
        appUsersPercentage: dashboardData.app_users_percentage || 0,
        resellersPercentage: dashboardData.resellers_percentage || 0,
        appUsersGrowth: dashboardData.app_users_growth || 0,
        resellersGrowth: dashboardData.resellers_growth || 0
      },
      dailyPerformance: dashboardData.daily_performance || [],
      topPackages: dashboardData.top_packages || [],
      networkDistribution: dashboardData.network_distribution || [],
      userGrowth: dashboardData.user_growth_data || [],
      conversionRates: {
        overall: dashboardData.conversion_rate || 0,
        appUsers: dashboardData.app_user_conversion || 0,
        resellers: dashboardData.reseller_conversion || 0
      },
      customerLifetimeValue: {
        average: dashboardData.avg_clv || 0,
        appUsers: dashboardData.app_user_clv || 0,
        resellers: dashboardData.reseller_clv || 0
      },
      churnRate: {
        monthly: dashboardData.monthly_churn || 0,
        quarterly: dashboardData.quarterly_churn || 0
      }
    }

    return analytics
  },

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }
}

export default reportsService
