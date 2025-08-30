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

// Comprehensive users service
export const usersService = {
  // Get all users with pagination and filtering
  async getAllUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.ordering) queryParams.append('ordering', params.ordering)
      if (params.role) queryParams.append('role', params.role)
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active)
      
      const url = queryParams.toString() ? 
        `${buildApiUrl(API_ENDPOINTS.USERS.LIST)}?${queryParams.toString()}` : 
        buildApiUrl(API_ENDPOINTS.USERS.LIST)
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      // Handle both wrapped and direct response formats
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
      console.error('❌ Failed to fetch users:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch users',
        data: {
          count: 0,
          results: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0
          }
        }
      }
    }
  },

  // Get single user by ID
  async getUserById(userId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.USERS.DETAIL), { id: userId })
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch user:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user'
      }
    }
  },

  // Create new user
  async createUser(userData) {
    try {
      const url = buildApiUrl(API_ENDPOINTS.USERS.CREATE)
      const response = await apiService.post(url, userData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'User created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create user:', error)
      return {
        success: false,
        error: error.message || 'Failed to create user'
      }
    }
  },

  // Update user
  async updateUser(userId, userData) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.USERS.UPDATE), { id: userId })
      const response = await apiService.patch(url, userData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'User updated successfully'
      }
    } catch (error) {
      console.error('❌ Failed to update user:', error)
      return {
        success: false,
        error: error.message || 'Failed to update user'
      }
    }
  },

  // Delete user
  async deleteUser(userId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.USERS.DELETE), { id: userId })
      await apiService.delete(url, { requiresAuth: true })
      
      return {
        success: true,
        message: 'User deleted successfully'
      }
    } catch (error) {
      console.error('❌ Failed to delete user:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete user'
      }
    }
  },

  // Block/Unblock user
  async toggleUserStatus(userId, isActive) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.USERS.UPDATE), { id: userId })
      const response = await apiService.patch(url, { is_active: isActive }, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: `User ${isActive ? 'activated' : 'blocked'} successfully`
      }
    } catch (error) {
      console.error('❌ Failed to update user status:', error)
      return {
        success: false,
        error: error.message || 'Failed to update user status'
      }
    }
  },

  // Format users list for frontend consumption
  formatUsersList(users) {
    if (!Array.isArray(users)) {
      return []
    }
    
    return users.map(user => ({
      id: user.id,
      name: user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email,
      phone: user.full_phone_number || `${user.country_code || ''} ${user.phone_number || ''}`.trim() || 'N/A',
      phoneNumber: user.phone_number || '',
      countryCode: user.country_code || '',
      city: user.city || 'N/A',
      address: user.address || 'N/A',
      status: user.is_active ? 'active' : 'blocked',
      role: user.role || 'public_user',
      joinDate: user.date_joined ? new Date(user.date_joined).toISOString().split('T')[0] : 'N/A',
      lastLogin: user.last_login ? new Date(user.last_login).toISOString().split('T')[0] : 'Never',
      isActive: user.is_active,
      isStaff: user.is_staff || false,
      isSuperuser: user.is_superuser || false,
      // Additional computed fields for frontend compatibility
      totalOrders: user.total_orders || 0,
      totalSpent: user.total_spent || 0,
      currentPackage: user.current_package || 'No active package',
      lastActivity: user.last_login ? this.getRelativeTime(user.last_login) : 'Never',
      supportTickets: user.support_tickets_count || 0,
      paymentMethod: user.preferred_payment_method || 'Not set'
    }))
  },

  // Helper function to get relative time
  getRelativeTime(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now - date) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
    return date.toLocaleDateString()
  },

  // Get user statistics
  async getUserStatistics() {
    try {
      // This would be a custom endpoint for user statistics
      const response = await apiService.get(`${buildApiUrl('users/statistics/')}`, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch user statistics:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user statistics',
        data: {
          totalUsers: 0,
          activeUsers: 0,
          blockedUsers: 0,
          newUsersThisMonth: 0
        }
      }
    }
  }
}

export default usersService