import { apiService } from './apiService'
import { API_ENDPOINTS } from '../config/api'

/**
 * User Management Service
 * Handles all user-related API operations including CRUD, search, and filtering
 */
export const userService = {
  // ===== User CRUD Operations =====

  /**
   * Get all users with pagination and filtering
   */
  async getAllUsers(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        role = '',
        status = '',
        ordering = '-date_joined'
      } = params

      console.log('Fetching users from API:', params)

      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: limit.toString(),
        ordering
      })

      if (search) queryParams.append('search', search)
      if (role) queryParams.append('role', role)
      if (status) queryParams.append('is_active', status === 'active' ? 'true' : 'false')

      const response = await apiService.get(`${API_ENDPOINTS.USERS.LIST}?${queryParams}`, { requiresAuth: true })
      
      // Check if response has the expected Django REST framework pagination structure
      if (response && (response.results || response.count !== undefined)) {
        return {
          success: true,
          data: {
            results: response.results || [],
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: response.count || 0,
              totalPages: Math.ceil((response.count || 0) / limit)
            }
          }
        }
      }

      // Handle wrapped response format (if it exists)
      if (response && response.success && response.data) {
        return {
          success: true,
          data: {
            results: response.data.results || [],
            pagination: {
              page: parseInt(page),
              limit: parseInt(limit),
              total: response.data.count || 0,
              totalPages: Math.ceil((response.data.count || 0) / limit)
            }
          }
        }
      }

      return {
        success: false,
        error: 'Invalid response format'
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch users'
      }
    }
  },

  /**
   * Get user by ID
   */
  async getUserById(userId) {
    try {
      console.log('Fetching user by ID:', userId)
      const response = await apiService.get(API_ENDPOINTS.USERS.DETAIL.replace('{id}', userId), { requiresAuth: true })
      return response
    } catch (error) {
      console.error('Failed to fetch user:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user'
      }
    }
  },

  /**
   * Create new user
   */
  async createUser(userData) {
    try {
      console.log('Creating user:', userData)
      
      // Validate required fields
      const validation = this.validateUserData(userData)
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Validation failed',
          errors: validation.errors
        }
      }

      const response = await apiService.post(API_ENDPOINTS.USERS.CREATE, userData, { requiresAuth: true })
      
      if (response.success) {
        console.log('User created successfully:', response.data)
      }
      
      return response
    } catch (error) {
      console.error('Failed to create user:', error)
      return {
        success: false,
        error: error.message || 'Failed to create user'
      }
    }
  },

  /**
   * Update user
   */
  async updateUser(userId, userData) {
    try {
      console.log('Updating user:', userId, userData)
      
      const response = await apiService.patch(API_ENDPOINTS.USERS.UPDATE.replace('{id}', userId), userData, { requiresAuth: true })
      
      if (response.success) {
        console.log('User updated successfully:', response.data)
      }
      
      return response
    } catch (error) {
      console.error('Failed to update user:', error)
      return {
        success: false,
        error: error.message || 'Failed to update user'
      }
    }
  },

  /**
   * Delete user
   */
  async deleteUser(userId) {
    try {
      console.log('Deleting user:', userId)
      const response = await apiService.delete(API_ENDPOINTS.USERS.DELETE.replace('{id}', userId), { requiresAuth: true })
      
      if (response.success) {
        console.log('User deleted successfully')
      }
      
      return response
    } catch (error) {
      console.error('Failed to delete user:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete user'
      }
    }
  },

  // ===== User Profile Operations =====

  /**
   * Get user profile
   */
  async getUserProfile(userId) {
    try {
      console.log('Fetching user profile:', userId)
      const response = await apiService.get(API_ENDPOINTS.USERS.PROFILE.replace('{id}', userId), { requiresAuth: true })
      return response
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user profile'
      }
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(userId, profileData) {
    try {
      console.log('Updating user profile:', userId, profileData)
      const response = await apiService.patch(API_ENDPOINTS.USERS.PROFILE_UPDATE.replace('{id}', userId), profileData, { requiresAuth: true })
      
      if (response.success) {
        console.log('User profile updated successfully')
      }
      
      return response
    } catch (error) {
      console.error('Failed to update user profile:', error)
      return {
        success: false,
        error: error.message || 'Failed to update user profile'
      }
    }
  },

  // ===== User Statistics =====

  /**
   * Get user statistics
   */
  async getUserStatistics() {
    try {
      console.log('Fetching user statistics')
      
      // Get users by role
      const [adminUsers, resellerUsers, clientUsers, publicUsers] = await Promise.allSettled([
        this.getAllUsers({ role: 'admin', limit: 1 }),
        this.getAllUsers({ role: 'reseller', limit: 1 }),
        this.getAllUsers({ role: 'client', limit: 1 }),
        this.getAllUsers({ role: 'public_user', limit: 1 })
      ])

      const stats = {
        totalUsers: 0,
        adminUsers: 0,
        resellerUsers: 0,
        clientUsers: 0,
        publicUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0
      }

      // Process results
      if (adminUsers.status === 'fulfilled' && adminUsers.value.success) {
        stats.adminUsers = adminUsers.value.data.pagination.total
      }
      if (resellerUsers.status === 'fulfilled' && resellerUsers.value.success) {
        stats.resellerUsers = resellerUsers.value.data.pagination.total
      }
      if (clientUsers.status === 'fulfilled' && clientUsers.value.success) {
        stats.clientUsers = clientUsers.value.data.pagination.total
      }
      if (publicUsers.status === 'fulfilled' && publicUsers.value.success) {
        stats.publicUsers = publicUsers.value.data.pagination.total
      }

      stats.totalUsers = stats.adminUsers + stats.resellerUsers + stats.clientUsers + stats.publicUsers

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Failed to fetch user statistics:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch user statistics'
      }
    }
  },

  // ===== Data Validation =====

  /**
   * Validate user data
   */
  validateUserData(userData) {
    const errors = {}

    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Valid email address is required'
    }

    if (!userData.first_name || userData.first_name.trim().length < 2) {
      errors.first_name = 'First name must be at least 2 characters'
    }

    if (!userData.last_name || userData.last_name.trim().length < 2) {
      errors.last_name = 'Last name must be at least 2 characters'
    }

    if (!userData.role || !['admin', 'reseller', 'client', 'public_user'].includes(userData.role)) {
      errors.role = 'Valid role is required'
    }

    if (userData.phone_number && !/^\d{9,15}$/.test(userData.phone_number)) {
      errors.phone_number = 'Phone number must be 9-15 digits'
    }

    if (userData.password && userData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // ===== Data Formatting =====

  /**
   * Format user data for display
   */
  formatUserData(user) {
    if (!user) return null

    return {
      id: user.id,
      name: `${user.first_name} ${user.last_name}`.trim(),
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      email: user.email || '',
      phone: user.full_phone_number || `${user.country_code || ''}${user.phone_number || ''}`,
      phoneCountryCode: user.country_code || '',
      phoneNumber: user.phone_number || '',
      role: user.role || 'public_user',
      roleDisplay: this.getRoleDisplay(user.role),
      status: user.is_active ? 'active' : 'inactive',
      statusDisplay: user.is_active ? 'Active' : 'Inactive',
      joinDate: user.date_joined || '',
      lastLogin: user.last_login || '',
      isActive: user.is_active || false,
      createdAt: user.date_joined || '',
      updatedAt: user.updated_at || ''
    }
  },

  /**
   * Format users list
   */
  formatUsersList(users) {
    if (!Array.isArray(users)) return []
    return users.map(user => this.formatUserData(user))
  },

  /**
   * Get role display name
   */
  getRoleDisplay(role) {
    const roleMap = {
      admin: 'Administrator',
      reseller: 'Reseller',
      client: 'Client',
      public_user: 'Public User'
    }
    return roleMap[role] || 'Unknown'
  },

  /**
   * Get role color for UI
   */
  getRoleColor(role) {
    const colorMap = {
      admin: 'red',
      reseller: 'blue',
      client: 'green',
      public_user: 'gray'
    }
    return colorMap[role] || 'gray'
  },

  /**
   * Get status color for UI
   */
  getStatusColor(status) {
    return status === 'active' ? 'green' : 'red'
  }
}

export default userService
