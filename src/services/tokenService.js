import { REFRESH_URL, VERIFY_URL } from '../config/api'
import { apiService } from './apiService'

class TokenService {
  constructor() {
    this.accessTokenKey = 'access_token'
    this.refreshTokenKey = 'refresh_token'
    this.tokenExpiryKey = 'token_expiry'
    this.refreshTokenExpiryKey = 'refresh_token_expiry'
  }

  // Store tokens in localStorage
  setTokens(accessToken, refreshToken) {
    try {
      // Decode JWT to get expiry
      const accessExpiry = this.getTokenExpiry(accessToken)
      const refreshExpiry = this.getTokenExpiry(refreshToken)

      localStorage.setItem(this.accessTokenKey, accessToken)
      localStorage.setItem(this.refreshTokenKey, refreshToken)
      localStorage.setItem(this.tokenExpiryKey, accessExpiry.toString())
      localStorage.setItem(this.refreshTokenExpiryKey, refreshExpiry.toString())

      console.log('🔐 Tokens stored successfully')
      console.log('📅 Access token expires:', new Date(accessExpiry).toLocaleString())
      console.log('📅 Refresh token expires:', new Date(refreshExpiry).toLocaleString())
    } catch (error) {
      console.error('❌ Error storing tokens:', error)
      throw error
    }
  }

  // Get access token
  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey)
  }

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey)
  }

  // Check if access token is expired
  isAccessTokenExpired() {
    const expiry = localStorage.getItem(this.tokenExpiryKey)
    if (!expiry) return true
    
    const expiryTime = parseInt(expiry)
    const currentTime = Date.now()
    
    // Consider token expired if less than 5 minutes remaining
    return currentTime >= (expiryTime - 5 * 60 * 1000)
  }

  // Check if refresh token is expired
  isRefreshTokenExpired() {
    const expiry = localStorage.getItem(this.refreshTokenExpiryKey)
    if (!expiry) return true
    
    const expiryTime = parseInt(expiry)
    const currentTime = Date.now()
    
    return currentTime >= expiryTime
  }

  // Check if tokens exist and are valid
  hasValidTokens() {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    
    if (!accessToken || !refreshToken) {
      return false
    }

    // If access token is expired but refresh token is valid, we can refresh
    if (this.isAccessTokenExpired() && !this.isRefreshTokenExpired()) {
      return 'refresh_needed'
    }

    // If both tokens are valid
    if (!this.isAccessTokenExpired() && !this.isRefreshTokenExpired()) {
      return 'valid'
    }

    // If refresh token is expired, user needs to login again
    if (this.isRefreshTokenExpired()) {
      return 'expired'
    }

    return false
  }

  // Refresh access token using refresh token
  async refreshAccessToken() {
    try {
      const refreshToken = this.getRefreshToken()
      
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      if (this.isRefreshTokenExpired()) {
        throw new Error('Refresh token has expired')
      }

      console.log('🔄 Refreshing access token...')
      
      const response = await apiService.post(REFRESH_URL, {
        refresh_token: refreshToken
      })

      // Handle both response formats
      const tokens = response.tokens || response
      
      if (tokens.access && tokens.refresh) {
        this.setTokens(tokens.access, tokens.refresh)
        console.log('✅ Access token refreshed successfully')
        return tokens.access
      } else {
        throw new Error('Invalid response format from refresh endpoint')
      }
    } catch (error) {
      console.error('❌ Error refreshing access token:', error)
      // If refresh fails, clear all tokens
      this.clearTokens()
      throw error
    }
  }

  // Verify token with backend
  async verifyToken(token) {
    try {
      const response = await apiService.get(VERIFY_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      return response
    } catch (error) {
      console.error('❌ Token verification failed:', error)
      throw error
    }
  }

  // Clear all tokens
  clearTokens() {
    localStorage.removeItem(this.accessTokenKey)
    localStorage.removeItem(this.refreshTokenKey)
    localStorage.removeItem(this.tokenExpiryKey)
    localStorage.removeItem(this.refreshTokenExpiryKey)
    console.log('🗑️ All tokens cleared')
  }

  // Get token expiry from JWT
  getTokenExpiry(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 // Convert to milliseconds
    } catch (error) {
      console.error('❌ Error decoding token:', error)
      throw new Error('Invalid token format')
    }
  }

  // Get token payload (for debugging)
  getTokenPayload(token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload
    } catch (error) {
      console.error('❌ Error decoding token payload:', error)
      return null
    }
  }

  // Get time until token expires
  getTimeUntilExpiry(token) {
    try {
      const expiry = this.getTokenExpiry(token)
      const currentTime = Date.now()
      const timeLeft = expiry - currentTime
      
      if (timeLeft <= 0) {
        return 'Expired'
      }
      
      const minutes = Math.floor(timeLeft / (1000 * 60))
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
      
      return `${minutes}m ${seconds}s`
    } catch (error) {
      return 'Unknown'
    }
  }

  // Log token status (for debugging)
  logTokenStatus() {
    const accessToken = this.getAccessToken()
    const refreshToken = this.getRefreshToken()
    
    console.log('🔍 Token Status:')
    console.log('Access Token:', accessToken ? 'Present' : 'Missing')
    console.log('Refresh Token:', refreshToken ? 'Present' : 'Missing')
    
    if (accessToken) {
      console.log('Access Token Expiry:', this.getTimeUntilExpiry(accessToken))
      console.log('Access Token Payload:', this.getTokenPayload(accessToken))
    }
    
    if (refreshToken) {
      console.log('Refresh Token Expiry:', this.getTimeUntilExpiry(refreshToken))
    }
    
    console.log('Token Validity:', this.hasValidTokens())
  }
}

// Create and export a single instance
export const tokenService = new TokenService()

// Export the class for custom instances if needed
export { TokenService }
