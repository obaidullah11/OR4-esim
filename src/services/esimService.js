import { 
  ESIMS_URL,
  ESIM_DETAIL_URL,
  ESIM_CREATE_URL,
  ESIM_ACTIVATE_URL,
  ESIM_DEACTIVATE_URL,
  ESIM_PLANS_URL,
  ESIM_AVAILABLE_PLANS_URL,
  ESIM_USAGE_URL,
  ESIM_RESELLER_CLIENTS_URL,
  ESIM_RESELLER_ESIMS_URL,
  ESIM_RESELLER_PLANS_URL,
  ESIM_RESELLER_DASHBOARD_URL,
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

// Comprehensive eSIM service
export const esimService = {
  // ===== eSIM Management =====
  
  // Get all eSIMs with pagination and filtering
  async getAllEsims(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.ordering) queryParams.append('ordering', params.ordering)
      if (params.status) queryParams.append('status', params.status)
      if (params.client) queryParams.append('client', params.client)
      if (params.reseller) queryParams.append('reseller', params.reseller)
      if (params.plan) queryParams.append('plan', params.plan)
      
      const url = queryParams.toString() ? `${ESIMS_URL}?${queryParams.toString()}` : ESIMS_URL
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: {
          count: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
          next: data.next,
          previous: data.previous,
          results: data.results || data || [],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
            totalPages: data.count ? Math.ceil(data.count / (params.limit || 20)) : 1
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch eSIMs:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch eSIMs',
        data: {
          count: 0,
          results: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        }
      }
    }
  },

  // Get specific eSIM by ID
  async getEsimById(id) {
    try {
      const url = replaceUrlParams(ESIM_DETAIL_URL, { id })
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to fetch eSIM ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to fetch eSIM'
      }
    }
  },

  // Create new eSIM
  async createEsim(esimData) {
    try {
      // Validate required fields for eSIM creation
      if (!esimData.plan) {
        return {
          success: false,
          error: 'Plan is required for eSIM creation'
        }
      }

      const response = await apiService.post(ESIM_CREATE_URL, esimData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'eSIM created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create eSIM:', error)
      return {
        success: false,
        error: error.message || 'Failed to create eSIM'
      }
    }
  },

  // Update existing eSIM
  async updateEsim(id, esimData) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM.UPDATE), { id })
      const response = await apiService.put(url, esimData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'eSIM updated successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to update eSIM ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to update eSIM'
      }
    }
  },

  // Delete eSIM
  async deleteEsim(id) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM.DELETE), { id })
      await apiService.delete(url, { requiresAuth: true })

      return {
        success: true,
        message: 'eSIM deleted successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to delete eSIM ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to delete eSIM'
      }
    }
  },

  // Activate eSIM
  async activateEsim(id) {
    try {
      const url = replaceUrlParams(ESIM_ACTIVATE_URL, { id })
      const response = await apiService.post(url, {}, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'eSIM activated successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to activate eSIM ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to activate eSIM'
      }
    }
  },

  // Deactivate eSIM
  async deactivateEsim(id) {
    try {
      const url = replaceUrlParams(ESIM_DEACTIVATE_URL, { id })
      const response = await apiService.post(url, {}, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'eSIM deactivated successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to deactivate eSIM ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to deactivate eSIM'
      }
    }
  },

  // ===== eSIM Plans Management =====
  
  // Get all eSIM plans
  async getAllPlans(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.country) queryParams.append('country', params.country)
      if (params.region) queryParams.append('region', params.region)
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active)
      if (params.plan_type) queryParams.append('plan_type', params.plan_type)
      if (params.ordering) queryParams.append('ordering', params.ordering)

      const url = queryParams.toString() ? `${ESIM_PLANS_URL}?${queryParams.toString()}` : ESIM_PLANS_URL

      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: {
          count: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
          next: data.next,
          previous: data.previous,
          results: data.results || data || [],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
            totalPages: data.count ? Math.ceil(data.count / (params.limit || 20)) : 1
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch eSIM plans:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch eSIM plans',
        data: { count: 0, results: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
      }
    }
  },

  // Get specific eSIM plan by ID
  async getPlanById(id) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM.PLAN_DETAIL), { id })
      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to fetch eSIM plan ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to fetch eSIM plan'
      }
    }
  },

  // Create new eSIM plan
  async createPlan(planData) {
    try {
      const response = await apiService.post(ESIM_PLANS_URL, planData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'eSIM plan created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create eSIM plan:', error)
      return {
        success: false,
        error: error.message || 'Failed to create eSIM plan'
      }
    }
  },

  // Update existing eSIM plan
  async updatePlan(id, planData) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM.PLAN_DETAIL), { id })
      const response = await apiService.put(url, planData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'eSIM plan updated successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to update eSIM plan ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to update eSIM plan'
      }
    }
  },

  // Delete eSIM plan
  async deletePlan(id) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM.PLAN_DETAIL), { id })
      await apiService.delete(url, { requiresAuth: true })

      return {
        success: true,
        message: 'eSIM plan deleted successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to delete eSIM plan ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to delete eSIM plan'
      }
    }
  },

  // Get available eSIM plans
  async getAvailablePlans(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.country) queryParams.append('country', params.country)
      if (params.region) queryParams.append('region', params.region)
      
      const url = queryParams.toString() ? `${ESIM_AVAILABLE_PLANS_URL}?${queryParams.toString()}` : ESIM_AVAILABLE_PLANS_URL
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error('❌ Failed to fetch available plans:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch available plans',
        data: []
      }
    }
  },

  // ===== eSIM Usage Management =====

  // Get eSIM usage data
  async getEsimUsage(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.esim) queryParams.append('esim', params.esim)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.location) queryParams.append('location', params.location)
      if (params.ordering) queryParams.append('ordering', params.ordering)

      const url = queryParams.toString() ? `${ESIM_USAGE_URL}?${queryParams.toString()}` : ESIM_USAGE_URL

      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: {
          count: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
          next: data.next,
          previous: data.previous,
          results: data.results || data || [],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
            totalPages: data.count ? Math.ceil(data.count / (params.limit || 20)) : 1
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch eSIM usage:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch eSIM usage',
        data: { count: 0, results: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
      }
    }
  },

  // Get specific eSIM usage record by ID
  async getUsageById(id) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM.USAGE_DETAIL), { id })
      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to fetch eSIM usage ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to fetch eSIM usage'
      }
    }
  },

  // Create new eSIM usage record
  async createUsageRecord(usageData) {
    try {
      const response = await apiService.post(ESIM_USAGE_URL, usageData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'eSIM usage record created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create eSIM usage record:', error)
      return {
        success: false,
        error: error.message || 'Failed to create eSIM usage record'
      }
    }
  },

  // Get usage summary for specific eSIM
  async getEsimUsageSummary(esimId) {
    try {
      const response = await this.getEsimUsage({ esim: esimId, limit: 1000 })

      if (response.success) {
        const usageRecords = response.data.results || []

        const summary = {
          totalDataUsed: usageRecords.reduce((total, record) => total + (record.data_used || 0), 0),
          usageCount: usageRecords.length,
          lastUsage: usageRecords.length > 0 ? usageRecords[0].timestamp : null,
          locations: [...new Set(usageRecords.map(record => record.location).filter(Boolean))],
          dailyUsage: this.groupUsageByDay(usageRecords)
        }

        return {
          success: true,
          data: summary
        }
      } else {
        return response
      }
    } catch (error) {
      console.error(`❌ Failed to get eSIM usage summary for ${esimId}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to get eSIM usage summary'
      }
    }
  },

  // Helper function to group usage by day
  groupUsageByDay(usageRecords) {
    const dailyUsage = {}

    usageRecords.forEach(record => {
      const date = new Date(record.timestamp).toISOString().split('T')[0]
      if (!dailyUsage[date]) {
        dailyUsage[date] = 0
      }
      dailyUsage[date] += record.data_used || 0
    })

    return dailyUsage
  },

  // ===== Reseller eSIM Management =====
  
  // Get reseller eSIMs
  async getResellerEsims(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)
      if (params.client) queryParams.append('client', params.client)
      if (params.plan) queryParams.append('plan', params.plan)
      if (params.ordering) queryParams.append('ordering', params.ordering)

      const url = queryParams.toString() ? `${ESIM_RESELLER_ESIMS_URL}?${queryParams.toString()}` : ESIM_RESELLER_ESIMS_URL

      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: {
          count: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
          results: data.results || data || [],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
            totalPages: data.count ? Math.ceil(data.count / (params.limit || 20)) : 1
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch reseller eSIMs:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reseller eSIMs',
        data: { count: 0, results: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
      }
    }
  },

  // Get specific reseller eSIM
  async getResellerEsimById(id) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.ESIM_DETAIL), { id })
      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to fetch reseller eSIM ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reseller eSIM'
      }
    }
  },

  // Create reseller eSIM
  async createResellerEsim(esimData) {
    try {
      const response = await apiService.post(ESIM_RESELLER_ESIMS_URL, esimData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Reseller eSIM created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create reseller eSIM:', error)
      return {
        success: false,
        error: error.message || 'Failed to create reseller eSIM'
      }
    }
  },

  // Update reseller eSIM
  async updateResellerEsim(id, esimData) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.ESIM_DETAIL), { id })
      const response = await apiService.put(url, esimData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Reseller eSIM updated successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to update reseller eSIM ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to update reseller eSIM'
      }
    }
  },

  // Delete reseller eSIM
  async deleteResellerEsim(id) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.ESIM_DETAIL), { id })
      await apiService.delete(url, { requiresAuth: true })

      return {
        success: true,
        message: 'Reseller eSIM deleted successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to delete reseller eSIM ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to delete reseller eSIM'
      }
    }
  },

  // Get reseller plans
  async getResellerPlans(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.country) queryParams.append('country', params.country)
      if (params.region) queryParams.append('region', params.region)
      
      const url = queryParams.toString() ? `${ESIM_RESELLER_PLANS_URL}?${queryParams.toString()}` : ESIM_RESELLER_PLANS_URL
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error('❌ Failed to fetch reseller plans:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reseller plans',
        data: []
      }
    }
  },

  // Get reseller dashboard data
  async getResellerDashboard() {
    try {
      const response = await apiService.get(ESIM_RESELLER_DASHBOARD_URL, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error('❌ Failed to fetch reseller dashboard:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reseller dashboard',
        data: {}
      }
    }
  },

  // ===== Reseller Client Management =====

  // Get reseller clients
  async getResellerClients(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.status) queryParams.append('status', params.status)
      if (params.ordering) queryParams.append('ordering', params.ordering)

      const url = queryParams.toString() ? `${buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENTS)}?${queryParams.toString()}` : buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENTS)

      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: {
          count: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
          results: data.results || data || [],
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: data.count || (Array.isArray(data.results || data) ? (data.results || data).length : 0),
            totalPages: data.count ? Math.ceil(data.count / (params.limit || 20)) : 1
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch reseller clients:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reseller clients',
        data: { count: 0, results: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }
      }
    }
  },

  // Get specific reseller client
  async getResellerClientById(id) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENT_DETAIL), { id })
      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to fetch reseller client ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reseller client'
      }
    }
  },

  // Create reseller client
  async createResellerClient(clientData) {
    try {
      const response = await apiService.post(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENTS), clientData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Reseller client created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create reseller client:', error)
      return {
        success: false,
        error: error.message || 'Failed to create reseller client'
      }
    }
  },

  // Update reseller client
  async updateResellerClient(id, clientData) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENT_DETAIL), { id })
      const response = await apiService.put(url, clientData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Reseller client updated successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to update reseller client ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to update reseller client'
      }
    }
  },

  // Delete reseller client
  async deleteResellerClient(id) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENT_DETAIL), { id })
      await apiService.delete(url, { requiresAuth: true })

      return {
        success: true,
        message: 'Reseller client deleted successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to delete reseller client ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to delete reseller client'
      }
    }
  },

  // ===== Export Functions =====

  // Export eSIM history data
  async exportHistory(filters = {}, format = 'csv') {
    try {
      const queryParams = new URLSearchParams()

      // Add filters
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.date_from) queryParams.append('date_from', filters.date_from)
      if (filters.date_to) queryParams.append('date_to', filters.date_to)

      // Determine the endpoint based on format
      const endpoint = format === 'pdf' ? 'export_pdf' : 'export_esims'
      const url = queryParams.toString() ? 
        `${ESIM_RESELLER_ESIMS_URL}${endpoint}/?${queryParams.toString()}` : 
        `${ESIM_RESELLER_ESIMS_URL}${endpoint}/`

      console.log(`📄 Exporting eSIM history as ${format.toUpperCase()} from:`, url)

      // Make request with blob response type for file download
      const response = await apiService.request(url, {
        method: 'GET',
        responseType: 'blob',
        requiresAuth: true
      })

      // Create download link
      const blob = new Blob([response], {
        type: format === 'pdf' ? 'application/pdf' : 'text/csv'
      })
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:\-T]/g, '')
      const filename = format === 'pdf' 
        ? `esim_history_report_${timestamp}.pdf`
        : `esim_history_export_${timestamp}.csv`
      
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      console.log(`✅ eSIM history exported successfully as ${filename}`)

      return {
        success: true,
        message: `eSIM history exported successfully as ${format.toUpperCase()}`,
        filename: filename
      }
    } catch (error) {
      console.error('❌ Failed to export eSIM history:', error)
      return {
        success: false,
        error: error.message || 'Failed to export eSIM history'
      }
    }
  },

  // Quick export eSIM history with current filters
  async quickExportHistory(currentFilters = {}, format = 'csv') {
    try {
      console.log(`📄 Quick export eSIM history as ${format.toUpperCase()}...`)

      const filters = {}
      if (currentFilters.status && currentFilters.status !== 'all') {
        filters.status = currentFilters.status
      }
      if (currentFilters.search) {
        filters.search = currentFilters.search
      }

      return await this.exportHistory(filters, format)
    } catch (error) {
      console.error('❌ Failed to quick export eSIM history:', error)
      return {
        success: false,
        error: error.message || 'Failed to export eSIM history'
      }
    }
  },

  // ===== Data Formatting and Validation =====

  // Format eSIM data for frontend consumption
  formatEsimData(esim) {
    if (!esim) return null

    return {
      id: esim.id,
      status: esim.status || 'pending',
      statusDisplay: esim.status_display || 'Pending',
      qrCode: esim.qr_code || '',
      activationCode: esim.activation_code || '',
      traveroamEsimId: esim.traveroam_esim_id || '',
      iccid: esim.iccid || '',
      msisdn: esim.msisdn || '',
      bundleName: esim.bundle_name || '',
      bundlePrice: esim.bundle_price || 0,
      bundleCurrency: esim.bundle_currency || 'USD',
      dataAllowance: esim.data_allowance || 0,
      validityDays: esim.validity_days || 0,
      countries: esim.countries || [],
      client: esim.client,
      reseller: esim.reseller,
      plan: esim.plan,
      createdAt: esim.created_at,
      assignedAt: esim.assigned_at,
      activatedAt: esim.activated_at,
      deliveredAt: esim.delivered_at,
      expiresAt: esim.expires_at,
      cancelledAt: esim.cancelled_at,
      updatedAt: esim.updated_at
    }
  },

  // Format eSIM plan data
  formatPlanData(plan) {
    if (!plan) return null

    return {
      id: plan.id,
      name: plan.name || '',
      description: plan.description || '',
      country: plan.country || '',
      region: plan.region || '',
      dataAllowance: plan.data_allowance || 0,
      validityDays: plan.validity_days || 0,
      price: plan.price || 0,
      currency: plan.currency || 'USD',
      isActive: plan.is_active !== undefined ? plan.is_active : true,
      traveroamPlanId: plan.traveroam_plan_id || '',
      networks: plan.networks || [],
      features: plan.features || [],
      createdAt: plan.created_at,
      updatedAt: plan.updated_at
    }
  },

  // Format eSIMs list for frontend consumption
  formatEsimsList(esims) {
    if (!Array.isArray(esims)) {
      return []
    }

    return esims.map(esim => this.formatEsimData(esim))
  },

  // Format plans list for frontend consumption
  formatPlansList(plans) {
    if (!Array.isArray(plans)) {
      return []
    }

    return plans.map(plan => this.formatPlanData(plan))
  },

  // Validate eSIM assignment data
  validateEsimAssignment(assignmentData) {
    const errors = {}

    if (!assignmentData.client_id) {
      errors.client_id = 'Client is required'
    }

    if (!assignmentData.plan_id) {
      errors.plan_id = 'Plan is required'
    }

    if (!assignmentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assignmentData.email)) {
      errors.email = 'Valid email address is required'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Get eSIM status color for UI
  getStatusColor(status) {
    const statusColors = {
      'pending': 'yellow',
      'provisioned': 'blue',
      'assigned': 'purple',
      'activated': 'green',
      'expired': 'red',
      'cancelled': 'gray'
    }

    return statusColors[status] || 'gray'
  },

  // Get eSIM status icon
  getStatusIcon(status) {
    const statusIcons = {
      'pending': 'Clock',
      'provisioned': 'Package',
      'assigned': 'UserCheck',
      'activated': 'CheckCircle',
      'expired': 'XCircle',
      'cancelled': 'Ban'
    }

    return statusIcons[status] || 'Circle'
  }
}

export default esimService
