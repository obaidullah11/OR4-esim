import { 
  RESELLERS_URL, 
  RESELLER_DETAIL_URL, 
  RESELLER_CREATE_URL, 
  RESELLER_UPDATE_URL, 
  RESELLER_DELETE_URL,
  RESELLER_MY_PROFILE_URL,
  RESELLER_STATISTICS_URL,
  RESELLER_SUSPEND_URL,
  RESELLER_ACTIVATE_URL,
  RESELLER_CHANGE_STATUS_URL,
  RESELLER_AVAILABLE_USERS_URL
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

// Comprehensive reseller service
export const resellerService = {
  // Get all resellers with pagination and filtering
  async getAllResellers(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.ordering) queryParams.append('ordering', params.ordering)
      
      const url = queryParams.toString() ? `${RESELLERS_URL}?${queryParams.toString()}` : RESELLERS_URL
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      // Handle both wrapped and direct response formats
      const data = response.data || response
      
      return {
        success: true,
        data: {
          count: data.count,
          next: data.next,
          previous: data.previous,
          results: data.results || data,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 20,
            total: data.count,
            totalPages: Math.ceil(data.count / (params.limit || 20))
          }
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch resellers:', error)
      throw error
    }
  },

  // Get specific reseller by ID
  async getResellerById(id) {
    try {
      const url = replaceUrlParams(RESELLER_DETAIL_URL, { id })
      const response = await apiService.get(url, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to fetch reseller ${id}:`, error)
      throw error
    }
  },

  // Create new reseller
  async createReseller(resellerData) {
    try {
      const response = await apiService.post(RESELLER_CREATE_URL, resellerData, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error('❌ Failed to create reseller:', error)
      throw error
    }
  },

  // Update reseller (PUT - full update)
  async updateReseller(id, resellerData) {
    try {
      const url = replaceUrlParams(RESELLER_UPDATE_URL, { id })
      const response = await apiService.put(url, resellerData, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to update reseller ${id}:`, error)
      throw error
    }
  },

  // Patch reseller (PATCH - partial update)
  async patchReseller(id, resellerData) {
    try {
      const url = replaceUrlParams(RESELLER_UPDATE_URL, { id })
      const response = await apiService.patch(url, resellerData, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to patch reseller ${id}:`, error)
      throw error
    }
  },

  // Delete reseller
  async deleteReseller(id) {
    try {
      const url = replaceUrlParams(RESELLER_DELETE_URL, { id })
      console.log('🌐 DELETE request URL:', url)
      
      const response = await apiService.delete(url, { requiresAuth: true })
      console.log('📥 API response:', response)
      
      // Handle different response formats
      if (response.success !== undefined) {
        // Response already has success property
        return response
      } else {
        // Response is direct data
        return {
          success: true,
          message: response.message || 'Reseller deleted successfully'
        }
      }
    } catch (error) {
      console.error(`❌ Failed to delete reseller ${id}:`, error)
      throw error
    }
  },

  // Get current reseller profile
  async getMyProfile() {
    try {
      const response = await apiService.get(RESELLER_MY_PROFILE_URL, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error('❌ Failed to fetch my profile:', error)
      throw error
    }
  },

  // Get reseller statistics
  async getStatistics() {
    try {
      const response = await apiService.get(RESELLER_STATISTICS_URL, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error('❌ Failed to fetch statistics:', error)
      throw error
    }
  },

  // Suspend reseller
  async suspendReseller(id, reason = '') {
    try {
      const url = replaceUrlParams(RESELLER_SUSPEND_URL, { id })
      const response = await apiService.post(url, { reason }, { requiresAuth: true })
      
      // Handle both response formats
      if (response.success !== undefined) {
        // Response already has success property
        return response
      } else {
        // Response is direct data
        return {
          success: true,
          message: response.message || 'Reseller suspended successfully'
        }
      }
    } catch (error) {
      console.error(`❌ Failed to suspend reseller ${id}:`, error)
      throw error
    }
  },

  // Activate reseller
  async activateReseller(id) {
    try {
      const url = replaceUrlParams(RESELLER_ACTIVATE_URL, { id })
      const response = await apiService.post(url, {}, { requiresAuth: true })
      
      // Handle both response formats
      if (response.success !== undefined) {
        // Response already has success property
        return response
      } else {
        // Response is direct data
        return {
          success: true,
          message: response.message || 'Reseller activated successfully'
        }
      }
    } catch (error) {
      console.error(`❌ Failed to activate reseller ${id}:`, error)
      throw error
    }
  },

  // Change reseller status
  async changeResellerStatus(id, statusData) {
    try {
      const url = replaceUrlParams(RESELLER_CHANGE_STATUS_URL, { id })
      const response = await apiService.post(url, statusData, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to change status for reseller ${id}:`, error)
      throw error
    }
  },

  // Get available users for reseller creation
  async getAvailableUsers() {
    try {
      const response = await apiService.get(RESELLER_AVAILABLE_USERS_URL, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error('❌ Failed to fetch available users:', error)
      throw error
    }
  },

  // Helper function to format reseller data for frontend
  formatResellerData(reseller) {
    if (!reseller) return null
    
    return {
      id: reseller.id,
      email: reseller.user?.email || reseller.email,
      firstName: reseller.user?.first_name || reseller.firstName || reseller.first_name,
      lastName: reseller.user?.last_name || reseller.lastName || reseller.last_name,
      name: reseller.user?.first_name && reseller.user?.last_name 
        ? `${reseller.user.first_name} ${reseller.user.last_name}`
        : reseller.name || reseller.user?.email,
      phone: reseller.user?.full_phone_number || reseller.phone,
      phone_country_code: reseller.user?.country_code || reseller.phone_country_code,
      phone_number: reseller.user?.phone_number || reseller.phone_number,
      countryOfRegistration: reseller.user?.country_code || reseller.countryOfRegistration,
      status: reseller.is_suspended ? 'suspended' : 'active',
      joinDate: reseller.user?.date_joined || reseller.created_at || reseller.joinDate,
      lastLogin: reseller.user?.last_login || reseller.lastLogin,
      maxClients: reseller.max_clients || reseller.maxClients,
      maxSims: reseller.max_sims || reseller.maxSims,
      creditLimit: reseller.credit_limit || reseller.creditLimit,
      currentCredit: reseller.current_credit || reseller.currentCredit,
      totalClients: reseller.total_clients || reseller.totalClients,
      totalOrders: reseller.total_orders || reseller.totalOrders,
      isActive: reseller.user?.is_active !== false,
      isSuspended: reseller.is_suspended || false,
      suspensionReason: reseller.suspension_reason || reseller.suspensionReason || reseller.blockReason || '',
      createdAt: reseller.created_at || reseller.createdAt,
      updatedAt: reseller.updated_at || reseller.updatedAt,
      notes: reseller.notes || '',
      // Additional fields for compatibility
      simLimit: reseller.max_sims || reseller.maxSims || reseller.simLimit,
      creditLimit: reseller.credit_limit || reseller.creditLimit,
      location: reseller.user?.country_code || reseller.countryOfRegistration,
      // Frontend display fields with defaults
      revenue: reseller.revenue || reseller.total_revenue || 0,
      clients: reseller.total_clients || reseller.clients || 0,
      simUsed: reseller.sim_used || reseller.simUsed || 0,
      creditUsed: reseller.credit_used || reseller.creditUsed || 0,
      lastActivity: reseller.last_activity || reseller.lastActivity || 'Just now'
    }
  },

  // Helper function to format multiple resellers
  formatResellersList(resellers) {
    if (!Array.isArray(resellers)) return []
    return resellers.map(reseller => this.formatResellerData(reseller))
  }
}

export default resellerService
