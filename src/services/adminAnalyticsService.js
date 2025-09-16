import {
  ADMIN_DASHBOARD_URL,
  ADMIN_ANALYTICS_URL,
  ADMIN_ORDERS_ANALYTICS_URL,
  ADMIN_REVENUE_ANALYTICS_URL,
  ADMIN_PAYMENT_ANALYTICS_URL,
  ADMIN_PAYMENT_DASHBOARD_URL,
  ADMIN_RESELLER_ANALYTICS_URL,
  ADMIN_PERFORMANCE_METRICS_URL,
  ADMIN_EVENT_STATISTICS_URL,
  ADMIN_TRAVEROAM_ANALYTICS_URL
} from '../config/api'
import { apiService } from './apiService'

// Helper function to replace URL parameters
const replaceUrlParams = (url, params) => {
  let finalUrl = url
  Object.keys(params).forEach(key => {
    finalUrl = finalUrl.replace(`{${key}}`, params[key])
  })
  return finalUrl
}

// Admin Analytics Service
export const adminAnalyticsService = {
  // ===== MAIN DASHBOARD =====
  
  // Get comprehensive admin dashboard data
  async getDashboard(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      
      const url = queryParams.toString() ? `${ADMIN_DASHBOARD_URL}?${queryParams.toString()}` : ADMIN_DASHBOARD_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Admin dashboard data retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get admin dashboard:', error)
      return {
        success: false,
        error: error.message || 'Failed to get admin dashboard'
      }
    }
  },

  // Get admin analytics (alternative endpoint)
  async getAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.metric_type) queryParams.append('metric_type', params.metric_type)
      
      const url = queryParams.toString() ? `${ADMIN_ANALYTICS_URL}?${queryParams.toString()}` : ADMIN_ANALYTICS_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Admin analytics retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get admin analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get admin analytics'
      }
    }
  },

  // ===== ORDERS ANALYTICS =====
  
  // Get order analytics
  async getOrdersAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.status) queryParams.append('status', params.status)
      if (params.reseller_id) queryParams.append('reseller_id', params.reseller_id)
      
      const url = queryParams.toString() ? `${ADMIN_ORDERS_ANALYTICS_URL}?${queryParams.toString()}` : ADMIN_ORDERS_ANALYTICS_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Orders analytics retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get orders analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get orders analytics'
      }
    }
  },

  // Get revenue analytics
  async getRevenueAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      if (params.reseller_id) queryParams.append('reseller_id', params.reseller_id)
      
      const url = queryParams.toString() ? `${ADMIN_REVENUE_ANALYTICS_URL}?${queryParams.toString()}` : ADMIN_REVENUE_ANALYTICS_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Revenue analytics retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get revenue analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get revenue analytics'
      }
    }
  },

  // ===== PAYMENT ANALYTICS =====
  
  // Get payment analytics
  async getPaymentAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.payment_type) queryParams.append('payment_type', params.payment_type)
      if (params.status) queryParams.append('status', params.status)
      
      const url = queryParams.toString() ? `${ADMIN_PAYMENT_ANALYTICS_URL}?${queryParams.toString()}` : ADMIN_PAYMENT_ANALYTICS_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Payment analytics retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get payment analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get payment analytics'
      }
    }
  },

  // Get payment dashboard
  async getPaymentDashboard(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = queryParams.toString() ? `${ADMIN_PAYMENT_DASHBOARD_URL}?${queryParams.toString()}` : ADMIN_PAYMENT_DASHBOARD_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Payment dashboard retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get payment dashboard:', error)
      return {
        success: false,
        error: error.message || 'Failed to get payment dashboard'
      }
    }
  },

  // ===== RESELLER ANALYTICS =====
  
  // Get reseller analytics
  async getResellerAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.reseller_id) queryParams.append('reseller_id', params.reseller_id)
      if (params.status) queryParams.append('status', params.status)
      
      const url = queryParams.toString() ? `${ADMIN_RESELLER_ANALYTICS_URL}?${queryParams.toString()}` : ADMIN_RESELLER_ANALYTICS_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Reseller analytics retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get reseller analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get reseller analytics'
      }
    }
  },

  // ===== PERFORMANCE METRICS =====
  
  // Get performance metrics
  async getPerformanceMetrics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.metric_type) queryParams.append('metric_type', params.metric_type)
      
      const url = queryParams.toString() ? `${ADMIN_PERFORMANCE_METRICS_URL}?${queryParams.toString()}` : ADMIN_PERFORMANCE_METRICS_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Performance metrics retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get performance metrics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get performance metrics'
      }
    }
  },

  // ===== EVENT STATISTICS =====
  
  // Get event statistics
  async getEventStatistics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.event_type) queryParams.append('event_type', params.event_type)
      
      const url = queryParams.toString() ? `${ADMIN_EVENT_STATISTICS_URL}?${queryParams.toString()}` : ADMIN_EVENT_STATISTICS_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Event statistics retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get event statistics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get event statistics'
      }
    }
  },

  // ===== TRAVEROAM ANALYTICS =====
  
  // Get TravelRoam analytics
  async getTravelRoamAnalytics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.start_date) queryParams.append('start_date', params.start_date)
      if (params.end_date) queryParams.append('end_date', params.end_date)
      if (params.country) queryParams.append('country', params.country)
      if (params.bundle_id) queryParams.append('bundle_id', params.bundle_id)
      
      const url = queryParams.toString() ? `${ADMIN_TRAVEROAM_ANALYTICS_URL}?${queryParams.toString()}` : ADMIN_TRAVEROAM_ANALYTICS_URL
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'TravelRoam analytics retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get TravelRoam analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get TravelRoam analytics'
      }
    }
  },

  // ===== COMPREHENSIVE ANALYTICS =====
  
  // Get all analytics data in one call
  async getAllAnalytics(params = {}) {
    try {
      console.log('🔄 Fetching comprehensive admin analytics...')
      
      const [
        dashboardResponse,
        ordersResponse,
        revenueResponse,
        paymentResponse,
        resellerResponse,
        performanceResponse
      ] = await Promise.allSettled([
        this.getDashboard(params),
        this.getOrdersAnalytics(params),
        this.getRevenueAnalytics(params),
        this.getPaymentDashboard(params),
        this.getResellerAnalytics(params),
        this.getPerformanceMetrics(params)
      ])

      const analytics = {
        dashboard: dashboardResponse.status === 'fulfilled' ? dashboardResponse.value : null,
        orders: ordersResponse.status === 'fulfilled' ? ordersResponse.value : null,
        revenue: revenueResponse.status === 'fulfilled' ? revenueResponse.value : null,
        payments: paymentResponse.status === 'fulfilled' ? paymentResponse.value : null,
        resellers: resellerResponse.status === 'fulfilled' ? resellerResponse.value : null,
        performance: performanceResponse.status === 'fulfilled' ? performanceResponse.value : null
      }

      // Count successful responses
      const successCount = Object.values(analytics).filter(item => item && item.success).length
      
      console.log(`✅ Retrieved ${successCount}/6 analytics sections successfully`)

      return {
        success: true,
        data: analytics,
        message: `Retrieved ${successCount}/6 analytics sections successfully`
      }
    } catch (error) {
      console.error('Failed to get comprehensive analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to get comprehensive analytics'
      }
    }
  }
}

export default adminAnalyticsService
