import { API_ENDPOINTS, API_CONFIG } from '../config/api'
import { apiService } from './apiService'

/**
 * Forgot Password Service
 * Handles the complete forgot password flow with OTP verification
 */
export const forgotPasswordService = {
  /**
   * Step 1: Request OTP for password reset
   * @param {string} email - User's email address
   * @returns {Promise} API response
   */
  requestPasswordReset: async (email) => {
    try {
      console.log('🔐 Requesting password reset OTP for:', email)
      
      const response = await apiService.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST, {
        email: email
      })
      
      console.log('Password reset OTP request successful')
      
      return response
    } catch (error) {
      console.error('Password reset OTP request failed:', error)
      throw error
    }
  },

  /**
   * Step 2: Verify OTP (optional step for validation)
   * @param {string} email - User's email address
   * @param {string} otpCode - 6-digit OTP code
   * @returns {Promise} API response
   */
  verifyOTP: async (email, otpCode) => {
    try {
      console.log('🔐 Verifying OTP for:', email)
      
      const response = await apiService.post(API_ENDPOINTS.AUTH.OTP_VERIFY, {
        email: email,
        otp_code: otpCode
      })
      
      console.log('OTP verification successful')
      return response
    } catch (error) {
      console.error('OTP verification failed:', error)
      throw error
    }
  },

  /**
   * Step 3: Reset password with OTP verification
   * @param {string} email - User's email address
   * @param {string} otpCode - 6-digit OTP code
   * @param {string} newPassword - New password
   * @param {string} confirmPassword - Confirm new password
   * @returns {Promise} API response
   */
  resetPassword: async (email, otpCode, newPassword, confirmPassword) => {
    try {
      console.log('🔐 Resetting password for:', email)
      
      const response = await apiService.post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
        email: email,
        otp_code: otpCode,
        new_password: newPassword,
        confirm_password: confirmPassword
      })
      
      console.log('Password reset successful')
      return response
    } catch (error) {
      console.error('Password reset failed:', error)
      throw error
    }
  },

  /**
   * Resend OTP for password reset
   * @param {string} email - User's email address
   * @returns {Promise} API response
   */
  resendOTP: async (email) => {
    try {
      console.log('🔐 Resending OTP for:', email)
      
      const response = await apiService.post(API_ENDPOINTS.AUTH.RESEND_OTP, {
        email: email
      })
      
      console.log('OTP resend successful')
      return response
    } catch (error) {
      console.error('OTP resend failed:', error)
      throw error
    }
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email format
   */
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate OTP format
   * @param {string} otp - OTP to validate
   * @returns {boolean} True if valid OTP format (6 digits)
   */
  validateOTP: (otp) => {
    const otpRegex = /^\d{6}$/
    return otpRegex.test(otp)
  },

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} Validation result with isValid and errors
   */
  validatePassword: (password) => {
    const errors = []
    
    if (!password) {
      errors.push('Password is required')
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long')
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
      }
      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
      }
      if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number')
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors
    }
  },

  /**
   * Check if passwords match
   * @param {string} password - First password
   * @param {string} confirmPassword - Confirmation password
   * @returns {boolean} True if passwords match
   */
  passwordsMatch: (password, confirmPassword) => {
    return password === confirmPassword
  },

  /**
   * Format time remaining for OTP expiry
   * @param {number} seconds - Seconds remaining
   * @returns {string} Formatted time string (MM:SS)
   */
  formatTimeRemaining: (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  },

  /**
   * Calculate OTP expiry time
   * @param {number} expiresInSeconds - Expiry time in seconds (default 600 = 10 minutes)
   * @returns {Date} Expiry date
   */
  calculateExpiryTime: (expiresInSeconds = 600) => {
    return new Date(Date.now() + (expiresInSeconds * 1000))
  }
}

export default forgotPasswordService
