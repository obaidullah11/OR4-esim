import { DEFAULT_HEADERS, API_TIMEOUT, BASE_URL, DASHBOARD_MAIN_URL, DASHBOARD_TEST_URL_ALT } from '../config/api'
import { tokenService } from './tokenService'

class ApiService {
  constructor() {
    this.baseHeaders = DEFAULT_HEADERS
    this.timeout = API_TIMEOUT
    this.isRefreshing = false
    this.failedQueue = []
  }

  // Get authentication headers with automatic token refresh
  async getAuthHeaders() {
    try {
      const tokenStatus = tokenService.hasValidTokens()
      
      if (tokenStatus === 'valid') {
        const accessToken = tokenService.getAccessToken()
        return { ...this.baseHeaders, 'Authorization': `Bearer ${accessToken}` }
      }
      
      if (tokenStatus === 'refresh_needed') {
        // Only refresh if not already refreshing
        if (!this.isRefreshing) {
          this.isRefreshing = true
          
          try {
            await tokenService.refreshAccessToken()
            this.isRefreshing = false
            
            // Process failed queue
            this.processQueue(null, null)
            
            const accessToken = tokenService.getAccessToken()
            return { ...this.baseHeaders, 'Authorization': `Bearer ${accessToken}` }
          } catch (error) {
            this.isRefreshing = false
            this.processQueue(error, null)
            throw error
          }
        } else {
          // If already refreshing, wait for it to complete
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject })
          })
        }
      }
      
      // No valid tokens
      return this.baseHeaders
    } catch (error) {
      console.error('❌ Error getting auth headers:', error)
      return this.baseHeaders
    }
  }

  // Process failed request queue
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error)
      } else {
        resolve({ ...this.baseHeaders, 'Authorization': `Bearer ${token}` })
      }
    })
    this.failedQueue = []
  }

  // Generic API request method
  async request(url, options = {}) {
    const {
      method = 'GET',
      body = null,
      headers = {},
      requiresAuth = false,
      ...restOptions
    } = options

    let requestHeaders
    if (requiresAuth) {
      try {
        const authHeaders = await this.getAuthHeaders()
        requestHeaders = { ...authHeaders, ...headers }
      } catch (error) {
        console.error('❌ Failed to get auth headers:', error)
        throw new Error('Authentication failed. Please login again.')
      }
    } else {
      requestHeaders = { ...this.baseHeaders, ...headers }
    }

    const requestOptions = {
      method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(this.timeout),
      ...restOptions
    }

    if (body && method !== 'GET') {
      // Don't stringify FormData - let it be sent as is
      if (body instanceof FormData) {
        requestOptions.body = body
        // Ensure no Content-Type header is set for FormData
        delete requestOptions.headers['Content-Type']
        delete requestOptions.headers['Accept']
        

      } else {
        requestOptions.body = JSON.stringify(body)
      }
    }

    try {
      const response = await fetch(url, requestOptions)

      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Request failed: ${response.status}`)
      }

      // For DELETE requests, handle 204 No Content responses
      if (method === 'DELETE' && response.status === 204) {
        return { success: true, message: 'Resource deleted successfully' }
      }

      // For empty responses, return success
      if (response.status === 204 || response.status === 200) {
        const text = await response.text()
        if (!text) {
          return { success: true, message: 'Operation completed successfully' }
        }
        // Try to parse as JSON if there's content
        try {
          const data = JSON.parse(text)
          return data.data || data
        } catch {
          return { success: true, message: text || 'Operation completed successfully' }
        }
      }

      // Parse response for other methods
      const data = await response.json()
      
      // Check if response follows wrapper format
      if (data.success === false) {
        throw new Error(data.message || 'Request failed')
      }

      // Return data (either wrapped or direct response)
      return data.data || data
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.')
      }
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.')
      }
      throw error
    }
  }

  // GET request
  async get(url, options = {}) {
    return this.request(url, { method: 'GET', ...options })
  }

  // POST request
  async post(url, data, options = {}) {
    return this.request(url, { method: 'POST', body: data, ...options })
  }

  // PUT request
  async put(url, data, options = {}) {
    return this.request(url, { method: 'PUT', body: data, ...options })
  }

  // PATCH request
  async patch(url, data, options = {}) {
    return this.request(url, { method: 'PATCH', body: data, ...options })
  }

  // DELETE request
  async delete(url, options = {}) {
    return this.request(url, { method: 'DELETE', ...options })
  }

  // Upload file
  async upload(url, formData, options = {}) {
    // For FormData, we need to completely remove Content-Type header
    // and let the browser set it automatically to multipart/form-data
    const headers = { ...this.baseHeaders }
    delete headers['Content-Type']
    delete headers['Accept'] // Also remove Accept header for FormData
    

    
    return this.request(url, {
      method: 'POST',
      body: formData,
      headers,
      ...options
    })
  }
}

// Create and export a single instance
export const apiService = new ApiService()

// Export the class for custom instances if needed
export { ApiService }

// Dashboard API services
export const dashboardService = {
  // Get main dashboard data (requires authentication)
  async getDashboardData() {
    try {
      const accessToken = localStorage.getItem('access_token')
      
      if (!accessToken) {
        throw new Error('No authentication token');
      }
      
      // Use the correct dashboard endpoint from API configuration
      const response = await fetch(DASHBOARD_MAIN_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Handle specific backend errors
        if (response.status === 500) {
          throw new Error('Backend server error. Please try again later or contact support.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Dashboard request failed');
      }
      
      // Validate and sanitize the data to handle backend type issues
      const sanitizedData = this.sanitizeDashboardData(data.data);
      
      return sanitizedData;
      
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      throw error;
    }
  },

  // Sanitize dashboard data to handle backend type issues
  sanitizeDashboardData(data) {
    if (!data) return data;
    
    try {
      // Deep clone the data to avoid mutating the original
      const sanitized = JSON.parse(JSON.stringify(data));
      
      // Sanitize metrics
      if (sanitized.metrics) {
        const metrics = sanitized.metrics;
        metrics.totalUsers = this.safeNumber(metrics.totalUsers);
        metrics.totalResellers = this.safeNumber(metrics.totalResellers);
        metrics.dailySimOrders = this.safeNumber(metrics.dailySimOrders);
        metrics.revenueGenerated = this.safeNumber(metrics.revenueGenerated);
        metrics.userGrowth = this.safeNumber(metrics.userGrowth);
        metrics.resellerGrowth = this.safeNumber(metrics.resellerGrowth);
        metrics.orderGrowth = this.safeNumber(metrics.orderGrowth);
        metrics.revenueGrowth = this.safeNumber(metrics.revenueGrowth);
      }
      
      // Sanitize top resellers data
      if (sanitized.topResellers && Array.isArray(sanitized.topResellers)) {
        sanitized.topResellers = sanitized.topResellers.map(reseller => ({
          ...reseller,
          revenue: this.safeNumber(reseller.revenue),
          orders: this.safeNumber(reseller.orders),
          growth: this.safeNumber(reseller.growth)
        }));
      }
      
      // Sanitize other chart data
      if (sanitized.salesTrends && Array.isArray(sanitized.salesTrends)) {
        sanitized.salesTrends = sanitized.salesTrends.map(item => ({
          ...item,
          sales: this.safeNumber(item.sales),
          revenue: this.safeNumber(item.revenue)
        }));
      }
      
      if (sanitized.revenueAnalytics && Array.isArray(sanitized.revenueAnalytics)) {
        sanitized.revenueAnalytics = sanitized.revenueAnalytics.map(item => ({
          ...item,
          revenue: this.safeNumber(item.revenue),
          growth: this.safeNumber(item.growth)
        }));
      }
      
      return sanitized;
    } catch (error) {
      console.warn('Failed to sanitize dashboard data:', error);
      return data; // Return original data if sanitization fails
    }
  },

  // Safe number conversion to handle backend type issues
  safeNumber(value) {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    
    // Handle Decimal objects (common in Django)
    if (typeof value === 'object' && value !== null) {
      if (value.toString) {
        value = value.toString();
      } else {
        return 0;
      }
    }
    
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  },

  // Get test admin dashboard (no authentication required)
  async getTestAdminDashboard() {
    try {
      // Use a fallback endpoint for test data
      const response = await fetch(DASHBOARD_TEST_URL_ALT);
      
      if (!response.ok) {
        // Handle specific backend errors
        if (response.status === 500) {
          throw new Error('Backend server error. Please try again later or contact support.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Test dashboard request failed');
      }
      
      // Validate and sanitize the data to handle backend type issues
      const sanitizedData = this.sanitizeDashboardData(data.data);
      
      return sanitizedData;
      
    } catch (error) {
      console.error('Test dashboard fetch error:', error);
      throw error;
    }
  }
};
