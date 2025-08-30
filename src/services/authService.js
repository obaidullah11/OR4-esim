import { LOGIN_URL, SIGNUP_URL, LOGOUT_URL, REFRESH_URL, VERIFY_URL, GET_CURRENT_USER_URL, PASSWORD_RESET_REQUEST_URL, PASSWORD_RESET_CONFIRM_URL } from '../config/api'
import { apiService } from './apiService'
import { tokenService } from './tokenService'

// API-based auth service
export const authService = {
  login: async (credentials) => {
    try {
      console.log('🔐 Attempting login for:', credentials.email)
      
      const response = await apiService.post(LOGIN_URL, {
        email: credentials.email,
        password: credentials.password
      })
      
      // Handle both response formats (wrapped and direct)
      const data = response.data || response
      
      if (data.tokens && data.tokens.access && data.tokens.refresh) {
        // Store JWT tokens
        tokenService.setTokens(data.tokens.access, data.tokens.refresh)
        console.log('✅ Login successful, tokens stored')
        
        return {
          user: data.user,
          token: data.tokens.access, // Keep for backward compatibility
          tokens: data.tokens
        }
      } else if (data.access && data.refresh) {
        // Alternative response format
        tokenService.setTokens(data.access, data.refresh)
        console.log('✅ Login successful, tokens stored')
        
        return {
          user: data.user,
          token: data.access, // Keep for backward compatibility
          tokens: { access: data.access, refresh: data.refresh }
        }
      } else {
        throw new Error('Invalid response format from login endpoint')
      }
    } catch (error) {
      console.error('❌ Login failed:', error)
      throw error
    }
  },

  signup: async (userData) => {
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData()
      
      // Add basic user data
      formData.append('email', userData.email)
      formData.append('first_name', userData.first_name)
      formData.append('last_name', userData.last_name)
      formData.append('role', userData.role)
      formData.append('phone_country_code', userData.phone_country_code)
      formData.append('phone_number', userData.phone_number)
      formData.append('password', userData.password)
      formData.append('confirm_password', userData.confirm_password)
      
      // Add profile image if exists
      if (userData.profile_image) {
        formData.append('profile_image', userData.profile_image)
      }
      
      // Add reseller-specific fields if role is reseller
      if (userData.role === 'reseller') {
        formData.append('max_clients', userData.max_clients || 100)
        formData.append('max_sims', userData.max_sims || 1000)
        formData.append('credit_limit', userData.credit_limit || 1000.00)
      }
      

      
      // Use the upload method for multipart data
      const response = await apiService.upload(SIGNUP_URL, formData)
      
      return response
    } catch (error) {
      throw error
    }
  },

  getCurrentUser: async () => {
    try {
      const tokenStatus = tokenService.hasValidTokens()
      
      if (tokenStatus === false || tokenStatus === 'expired') {
        throw new Error('No valid tokens found')
      }

      // Use the verify endpoint to get current user info
      const response = await apiService.get(VERIFY_URL, { requiresAuth: true })
      
      // Handle both response formats
      const userData = response.data || response
      
      if (userData.user) {
        console.log('✅ Current user fetched successfully')
        return userData.user
      } else {
        throw new Error('Invalid response format from verify endpoint')
      }
    } catch (error) {
      console.error('❌ Failed to get current user:', error)
      throw error
    }
  },

  logout: async () => {
    try {
      const refreshToken = tokenService.getRefreshToken()
      
      if (refreshToken) {
        console.log('🚪 Attempting logout...')
        
        // Call backend logout endpoint to blacklist tokens
        try {
          await apiService.post(LOGOUT_URL, {
            refresh_token: refreshToken
          }, { requiresAuth: true })
          
          console.log('✅ Backend logout successful')
        } catch (error) {
          console.warn('⚠️ Backend logout failed, but continuing with local cleanup:', error)
        }
      }
    } catch (error) {
      console.error('❌ Logout error:', error)
    } finally {
      // Always clear local tokens regardless of backend response
      tokenService.clearTokens()
      console.log('🗑️ Local tokens cleared')
    }
  },

  // Password reset functionality
  requestPasswordReset: async (email) => {
    try {
      const response = await apiService.post(PASSWORD_RESET_REQUEST_URL, { email })
      return response
    } catch (error) {
      throw error
    }
  },

  confirmPasswordReset: async (email, newPassword, confirmPassword) => {
    try {
      const response = await apiService.post(PASSWORD_RESET_CONFIRM_URL, {
        email,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Manual token refresh
  refreshTokens: async () => {
    try {
      console.log('🔄 Manually refreshing tokens...')
      const newAccessToken = await tokenService.refreshAccessToken()
      console.log('✅ Manual token refresh successful')
      return newAccessToken
    } catch (error) {
      console.error('❌ Manual token refresh failed:', error)
      throw error
    }
  },

  // Check token validity
  checkTokenValidity: () => {
    return tokenService.hasValidTokens()
  },

  // Get token expiry info
  getTokenExpiryInfo: () => {
    const accessToken = tokenService.getAccessToken()
    const refreshToken = tokenService.getRefreshToken()
    
    if (!accessToken || !refreshToken) {
      return { valid: false, message: 'No tokens found' }
    }
    
    return {
      valid: true,
      accessTokenExpiry: tokenService.getTimeUntilExpiry(accessToken),
      refreshTokenExpiry: tokenService.getTimeUntilExpiry(refreshToken),
      status: tokenService.hasValidTokens()
    }
  }
}
