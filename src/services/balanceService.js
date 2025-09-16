import { 
  API_ENDPOINTS,
  buildApiUrl
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

// Reseller Balance Management Service
export const balanceService = {
  // Get reseller balance history and summary
  async getBalanceHistory() {
    try {
      const url = buildApiUrl('api/v1/resellers/balance/history/')
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Balance history retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get balance history:', error)
      return {
        success: false,
        error: error.message || 'Failed to get balance history'
      }
    }
  },

  // Get all balance transactions
  async getBalanceTransactions(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.transaction_type) queryParams.append('transaction_type', params.transaction_type)
      if (params.status) queryParams.append('status', params.status)
      
      const url = queryParams.toString() 
        ? `api/v1/resellers/balance/?${queryParams.toString()}`
        : 'api/v1/resellers/balance/'
      
      const response = await apiService.get(buildApiUrl(url), { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Balance transactions retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get balance transactions:', error)
      return {
        success: false,
        error: error.message || 'Failed to get balance transactions'
      }
    }
  },

  // Create a new topup request
  async createTopupRequest(topupData) {
    try {
      const url = buildApiUrl('api/v1/resellers/balance/request_topup/')
      const response = await apiService.post(url, topupData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Topup request created successfully'
      }
    } catch (error) {
      console.error('Failed to create topup request:', error)
      return {
        success: false,
        error: error.message || 'Failed to create topup request'
      }
    }
  },

  // Get topup requests for reseller
  async getTopupRequests() {
    try {
      const url = buildApiUrl('api/v1/resellers/balance/topup_requests/')
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Topup requests retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get topup requests:', error)
      return {
        success: false,
        error: error.message || 'Failed to get topup requests'
      }
    }
  },

  // Create Stripe checkout session for balance topup
  async createStripeTopupSession(topupData) {
    try {
      const checkoutData = {
        amount: topupData.amount || topupData,
        currency: topupData.currency || 'USD'
      }

      const url = buildApiUrl('api/v1/stripe/checkout/balance-topup/')
      const response = await apiService.post(url, checkoutData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        checkout_url: data.checkout_url || data.url,
        session_id: data.session_id || data.id,
        message: 'Stripe checkout session created successfully'
      }
    } catch (error) {
      console.error('Failed to create Stripe topup session:', error)
      return {
        success: false,
        error: error.message || 'Failed to create Stripe checkout session'
      }
    }
  },

  // Get current reseller profile with balance info
  async getResellerProfile() {
    try {
      const url = buildApiUrl('api/v1/resellers/resellers/my_profile/')
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Reseller profile retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to get reseller profile:', error)
      return {
        success: false,
        error: error.message || 'Failed to get reseller profile'
      }
    }
  },

  // Admin functions (for admin panel integration)
  admin: {
    // Get all pending topup requests (admin only)
    async getPendingTopupRequests() {
      try {
        const url = buildApiUrl('api/v1/resellers/admin/balance/pending_requests/')
        const response = await apiService.get(url, { requiresAuth: true })
        
        const data = response.data || response
        
        // Handle different response structures
        // API returns paginated data with 'results' array
        let finalData = data.results || data.data || data
        
        // Ensure we return an array
        if (!Array.isArray(finalData)) {
          console.warn('Pending requests API returned non-array data:', finalData)
          finalData = []
        }
        
        return {
          success: true,
          data: finalData,
          message: 'Pending topup requests retrieved successfully'
        }
      } catch (error) {
        console.error('Failed to get pending topup requests:', error)
        return {
          success: false,
          error: error.message || 'Failed to get pending topup requests',
          data: [] // Ensure we always return an empty array on error
        }
      }
    },

    // Get all topup requests (admin only)
    async getAllTopupRequests() {
      try {
        const url = buildApiUrl('api/v1/resellers/admin/balance/')
        const response = await apiService.get(url, { requiresAuth: true })
        
        const data = response.data || response
        
        // Handle different response structures
        // API returns paginated data with 'results' array
        let finalData = data.results || data.data || data
        
        // Ensure we return an array
        if (!Array.isArray(finalData)) {
          console.warn('API returned non-array data:', finalData)
          finalData = []
        }
        
        return {
          success: true,
          data: finalData,
          message: 'All topup requests retrieved successfully'
        }
      } catch (error) {
        console.error('Failed to get all topup requests:', error)
        return {
          success: false,
          error: error.message || 'Failed to get all topup requests',
          data: [] // Ensure we always return an empty array on error
        }
      }
    },

    // Process topup request (approve/reject)
    async processTopupRequest(requestId, action, notes = '', reason = '') {
      try {
        const url = buildApiUrl(`api/v1/resellers/admin/balance/${requestId}/process_request/`)
        const requestData = {
          action: action, // 'approve' or 'reject'
          notes: notes,
          reason: reason
        }
        
        const response = await apiService.post(url, requestData, { requiresAuth: true })
        
        const data = response.data || response
        
        return {
          success: true,
          data: data.data || data,
          message: `Topup request ${action}d successfully`
        }
      } catch (error) {
        console.error(`Failed to ${action} topup request:`, error)
        return {
          success: false,
          error: error.message || `Failed to ${action} topup request`
        }
      }
    },

    // Create Stripe checkout session for admin-approved topup
    async createAdminTopupApprovalSession(topupRequestId) {
      try {
        const requestData = {
          topup_request_id: topupRequestId
        }

        const url = buildApiUrl('api/v1/stripe/checkout/admin-topup-approval/')
        const response = await apiService.post(url, requestData, { requiresAuth: true })
        
        const data = response.data || response
        
        return {
          success: true,
          data: data.data || data,
          checkout_url: data.checkout_url || data.url,
          session_id: data.session_id || data.id,
          message: 'Admin topup approval session created successfully'
        }
      } catch (error) {
        console.error('Failed to create admin topup approval session:', error)
        return {
          success: false,
          error: error.message || 'Failed to create admin approval session'
        }
      }
    },

    // Get balance overview for all resellers
    async getBalanceOverview() {
      try {
        const url = buildApiUrl('api/v1/resellers/admin/balance/balance_overview/')
        const response = await apiService.get(url, { requiresAuth: true })
        
        const data = response.data || response
        
        return {
          success: true,
          data: data.data || data,
          message: 'Balance overview retrieved successfully'
        }
      } catch (error) {
        console.error('Failed to get balance overview:', error)
        return {
          success: false,
          error: error.message || 'Failed to get balance overview'
        }
      }
    },

    // Check payment status for webhook-based verification (like eSIM workflow)
    async checkPaymentStatus(sessionId) {
      try {
        const url = buildApiUrl(`api/v1/stripe/retrieve-checkout-session/?session_id=${sessionId}`)
        const response = await apiService.get(url, { requiresAuth: true })
        
        return {
          success: true,
          data: response.data || response,
          message: 'Payment status retrieved successfully'
        }
      } catch (error) {
        console.error('Failed to check payment status:', error)
        return {
          success: false,
          error: error.message || 'Failed to check payment status',
          data: null
        }
      }
    }
  },

  // Non-admin payment status check for reseller use
  async checkPaymentStatus(sessionId) {
    try {
      const url = buildApiUrl(`api/v1/stripe/retrieve-checkout-session/?session_id=${sessionId}`)
      const response = await apiService.get(url, { requiresAuth: true })
      
      return {
        success: true,
        data: response.data || response,
        message: 'Payment status retrieved successfully'
      }
    } catch (error) {
      console.error('Failed to check payment status:', error)
      return {
        success: false,
        error: error.message || 'Failed to check payment status',
        data: null
      }
    }
  }
}

export default balanceService
