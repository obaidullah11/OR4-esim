import { 
  CLIENTS_URL,
  CLIENT_DETAIL_URL,
  CLIENT_CREATE_URL,
  CLIENT_UPDATE_URL,
  CLIENT_DELETE_URL,
  MY_CLIENTS_URL,
  RESELLER_CLIENTS_URL,
  RESELLER_MY_PROFILE_URL,
  ESIM_RESELLER_CLIENTS_URL,
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

// Comprehensive client service
export const clientService = {
  // Get all clients with pagination and filtering
  async getAllClients(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.ordering) queryParams.append('ordering', params.ordering)
      if (params.status) queryParams.append('status', params.status)
      if (params.client_type) queryParams.append('client_type', params.client_type)
      if (params.reseller) queryParams.append('reseller', params.reseller)
      
      const url = queryParams.toString() ? `${CLIENTS_URL}?${queryParams.toString()}` : CLIENTS_URL
      
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
      console.error('❌ Failed to fetch clients:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch clients',
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

  // Get specific client by ID
  async getClientById(id) {
    try {
      const url = replaceUrlParams(CLIENT_DETAIL_URL, { id })
      const response = await apiService.get(url, { requiresAuth: true })
      
      // Handle both response formats
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to fetch client ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to fetch client'
      }
    }
  },

  // Get clients for current reseller
  async getMyClients(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination and filtering parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.ordering) queryParams.append('ordering', params.ordering)
      if (params.status) queryParams.append('status', params.status)
      
      const url = queryParams.toString() ? `${MY_CLIENTS_URL}?${queryParams.toString()}` : MY_CLIENTS_URL
      
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
      console.error('❌ Failed to fetch my clients:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch clients',
        data: {
          count: 0,
          results: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
        }
      }
    }
  },

  // Create new client
  async createClient(clientData) {
    try {
      const response = await apiService.post(CLIENT_CREATE_URL, clientData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Client created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create client:', error)
      return {
        success: false,
        error: error.message || 'Failed to create client'
      }
    }
  },

  // Create new reseller client (uses different endpoint and payload format)
  async createResellerClient(clientData) {
    try {
      // Transform the payload to match the reseller client service expectations
      const resellerClientData = {
        full_name: clientData.full_name,
        phone_number: clientData.phone_number,
        email: clientData.email,
        passport_id: clientData.national_id || clientData.passport_number || '', // Backend expects passport_id
        date_of_travel: clientData.date_of_travel,
        country_of_travel: clientData.country_of_travel || 'Unknown',
        // Note: plan field removed - plan assignment is handled separately
      }

      const response = await apiService.post(ESIM_RESELLER_CLIENTS_URL, resellerClientData, { requiresAuth: true })
      
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

  // Update existing client
  async updateClient(id, clientData) {
    try {
      const url = replaceUrlParams(CLIENT_UPDATE_URL, { id })
      const response = await apiService.put(url, clientData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data,
        message: 'Client updated successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to update client ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to update client'
      }
    }
  },

  // Delete client
  async deleteClient(id) {
    try {
      const url = replaceUrlParams(CLIENT_DELETE_URL, { id })
      await apiService.delete(url, { requiresAuth: true })
      
      return {
        success: true,
        message: 'Client deleted successfully'
      }
    } catch (error) {
      console.error(`❌ Failed to delete client ${id}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to delete client'
      }
    }
  },

  // Validate client data
  validateClientData(clientData) {
    const errors = {}

    if (!clientData.full_name || clientData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters'
    }

    if (!clientData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      errors.email = 'Valid email address is required'
    }

    if (!clientData.phone_number || clientData.phone_number.trim().length < 10) {
      errors.phone_number = 'Valid phone number is required'
    }

    if (clientData.passport_number && clientData.passport_number.trim().length < 6) {
      errors.passport_number = 'Passport number must be at least 6 characters'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Advanced client validation
  async validateClientAdvanced(clientData) {
    try {
      // Basic validation first
      const basicValidation = this.validateClientData(clientData)
      if (!basicValidation.isValid) {
        return basicValidation
      }

      const errors = {}
      const warnings = []

      // Email format validation (more strict)
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      if (!emailRegex.test(clientData.email)) {
        errors.email = 'Please enter a valid email address'
      }

      // Phone number validation (international format)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      const cleanPhone = clientData.phone_number.replace(/[\s\-\(\)]/g, '')
      if (!phoneRegex.test(cleanPhone)) {
        errors.phone_number = 'Please enter a valid international phone number'
      }

      // Passport number validation
      if (clientData.passport_number) {
        const passportRegex = /^[A-Z0-9]{6,12}$/i
        if (!passportRegex.test(clientData.passport_number.replace(/[\s\-]/g, ''))) {
          errors.passport_number = 'Passport number should be 6-12 alphanumeric characters'
        }
      }

      // National ID validation (basic)
      if (clientData.national_id) {
        const nationalIdRegex = /^[A-Z0-9]{5,20}$/i
        if (!nationalIdRegex.test(clientData.national_id.replace(/[\s\-]/g, ''))) {
          errors.national_id = 'National ID should be 5-20 alphanumeric characters'
        }
      }

      // Date validation
      if (clientData.date_of_travel) {
        const travelDate = new Date(clientData.date_of_travel)
        const today = new Date()
        const oneYearFromNow = new Date()
        oneYearFromNow.setFullYear(today.getFullYear() + 1)

        if (travelDate < today) {
          warnings.push('Travel date is in the past')
        } else if (travelDate > oneYearFromNow) {
          warnings.push('Travel date is more than a year in the future')
        }
      }

      // Check for duplicate email (if creating new client)
      if (!clientData.id) {
        try {
          const existingClients = await this.getAllClients({ search: clientData.email, limit: 1 })
          if (existingClients.success && existingClients.data.results.length > 0) {
            errors.email = 'A client with this email address already exists'
          }
        } catch (error) {
          console.warn('Could not check for duplicate email:', error)
          warnings.push('Could not verify email uniqueness')
        }
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors,
        warnings
      }

    } catch (error) {
      console.error('Advanced validation failed:', error)
      return {
        isValid: false,
        errors: { general: 'Validation failed due to system error' },
        warnings: []
      }
    }
  },

  // Verify client data with external services
  async verifyClientData(clientData) {
    try {
      const verificationResults = {
        email: { status: 'pending', message: 'Email verification pending' },
        phone: { status: 'pending', message: 'Phone verification pending' },
        passport: { status: 'pending', message: 'Passport verification pending' },
        overall: { status: 'pending', score: 0 }
      }

      // Email verification (basic format check)
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)
      verificationResults.email = {
        status: emailValid ? 'verified' : 'failed',
        message: emailValid ? 'Email format is valid' : 'Invalid email format'
      }

      // Phone verification (basic format check)
      const phoneValid = /^\+?[1-9]\d{1,14}$/.test(clientData.phone_number.replace(/[\s\-\(\)]/g, ''))
      verificationResults.phone = {
        status: phoneValid ? 'verified' : 'failed',
        message: phoneValid ? 'Phone format is valid' : 'Invalid phone format'
      }

      // Passport verification (basic format check)
      if (clientData.passport_number) {
        const passportValid = /^[A-Z0-9]{6,12}$/i.test(clientData.passport_number.replace(/[\s\-]/g, ''))
        verificationResults.passport = {
          status: passportValid ? 'verified' : 'failed',
          message: passportValid ? 'Passport format is valid' : 'Invalid passport format'
        }
      } else {
        verificationResults.passport = {
          status: 'skipped',
          message: 'No passport number provided'
        }
      }

      // Calculate overall verification score
      const verifiedCount = Object.values(verificationResults)
        .filter(result => result.status === 'verified').length
      const totalChecks = Object.keys(verificationResults).length - 1 // Exclude 'overall'
      const score = Math.round((verifiedCount / totalChecks) * 100)

      verificationResults.overall = {
        status: score >= 80 ? 'verified' : score >= 50 ? 'partial' : 'failed',
        score: score,
        message: `${score}% of verifications passed`
      }

      return {
        success: true,
        data: verificationResults
      }

    } catch (error) {
      console.error('Client verification failed:', error)
      return {
        success: false,
        error: 'Verification failed due to system error'
      }
    }
  },

  // Format client data for frontend consumption
  formatClientData(client) {
    if (!client) return null
    
    return {
      id: client.id,
      fullName: client.full_name || `${client.user?.first_name || ''} ${client.user?.last_name || ''}`.trim(),
      email: client.email || client.user?.email,
      phone: client.phone_number || client.user?.phone_number,
      passportNumber: client.passport_number || '',
      nationalId: client.national_id || '',
      countryOfTravel: client.country_of_travel || '',
      dateOfTravel: client.date_of_travel || '',
      status: client.status || 'active',
      statusDisplay: client.status_display || 'Active',
      clientType: client.client_type || 'reseller_client',
      clientTypeDisplay: client.client_type_display || 'Reseller Client',
      tier: client.tier || 'basic',
      tierDisplay: client.tier_display || 'Basic',
      isActive: client.is_active !== undefined ? client.is_active : true,
      isBlocked: client.is_blocked || false,
      lastActivity: client.last_activity,
      totalEsims: client.total_esims || 0,
      activeEsims: client.active_esims || 0,
      totalOrders: client.total_orders || 0,
      totalSpent: client.total_spent || client.statistics?.total_spent || 0, // Add totalSpent with fallback
      currentPlan: client.current_plan,
      isPlanActive: client.is_plan_active || false,
      preferredPackage: client.preferred_package,
      preferredNetwork: client.preferred_network,
      adminNotes: client.admin_notes || '',
      createdAt: client.created_at,
      updatedAt: client.updated_at,
      reseller: client.reseller,
      user: client.user
    }
  },

  // Format clients list for frontend consumption
  formatClientsList(clients) {
    if (!Array.isArray(clients)) {
      return []
    }
    
    return clients.map(client => this.formatClientData(client))
  },

  // Get current reseller profile
  async getResellerProfile() {
    try {
      const response = await apiService.get(RESELLER_MY_PROFILE_URL, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error('❌ Failed to fetch reseller profile:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch reseller profile'
      }
    }
  }
}

export default clientService
