import {
  TRAVEROAM_PLANS_URL,
  TRAVEROAM_NETWORKS_URL,
  TRAVEROAM_ORDER_PROCESS_URL,
  TRAVEROAM_CLIENT_VALIDATE_URL,
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

// TraveRoam API integration service
export const traveRoamService = {
  // ===== Plans and Bundles =====
  
  // Get available plans from TraveRoam
  async getAvailablePlans(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.countries) queryParams.append('countries', params.countries)
      if (params.region) queryParams.append('region', params.region)
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)

      const url = queryParams.toString() ? `${TRAVEROAM_PLANS_URL}?${queryParams.toString()}` : TRAVEROAM_PLANS_URL

      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Plans retrieved successfully'
      }
    } catch (error) {
      console.error('❌ Failed to fetch TraveRoam plans:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch plans',
        data: []
      }
    }
  },

  // Get TraveRoam catalogue (alternative endpoint)
  async getCatalogue(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.countries) queryParams.append('countries', params.countries)
      if (params.region) queryParams.append('region', params.region)

      const url = queryParams.toString() ? `${TRAVEROAM_PLANS_URL}?${queryParams.toString()}` : TRAVEROAM_PLANS_URL

      const response = await apiService.get(url, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Catalogue retrieved successfully'
      }
    } catch (error) {
      console.error('❌ Failed to fetch TraveRoam catalogue:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch catalogue',
        data: []
      }
    }
  },

  // Get networks for countries
  async getNetworks(networkData) {
    try {
      // Prepare network request payload
      const payload = {
        countries: networkData.countries || '',
        isos: networkData.isos || '',
        returnall: networkData.returnall || false
      }

      const response = await apiService.post(TRAVEROAM_NETWORKS_URL, payload, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Networks retrieved successfully'
      }
    } catch (error) {
      console.error('❌ Failed to fetch TraveRoam networks:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch networks',
        data: []
      }
    }
  },

  // Get networks by country codes
  async getNetworksByCountries(countryCodes) {
    try {
      const countries = Array.isArray(countryCodes) ? countryCodes.join(',') : countryCodes

      return await this.getNetworks({
        countries: countries,
        returnall: false
      })
    } catch (error) {
      console.error('❌ Failed to fetch networks by countries:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch networks by countries',
        data: []
      }
    }
  },

  // Get all available networks
  async getAllNetworks() {
    try {
      return await this.getNetworks({
        returnall: true
      })
    } catch (error) {
      console.error('❌ Failed to fetch all networks:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch all networks',
        data: []
      }
    }
  },

  // ===== eSIM Assignment and Management =====

  // Assign eSIM to client using reseller workflow
  async assignEsim(assignmentData) {
    try {
      // Validate assignment data
      const validation = this.validateAssignmentData(assignmentData)
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Invalid assignment data',
          errors: validation.errors
        }
      }

      // Use the reseller client assign_esim endpoint
      const clientId = assignmentData.client_id
      const payload = {
        bundle_name: assignmentData.bundle_name || assignmentData.plan_id,
        notes: assignmentData.notes || ''
      }

      const url = buildApiUrl(API_ENDPOINTS.UTILS.ASSIGN_ESIM_TO_CLIENT.replace('{id}', clientId))
      const response = await apiService.post(url, payload, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'eSIM assigned successfully'
      }
    } catch (error) {
      console.error('❌ Failed to assign eSIM:', error)
      return {
        success: false,
        error: error.message || 'Failed to assign eSIM'
      }
    }
  },

  // Provision eSIM through TraveRoam workflow
  async provisionEsim(provisionData) {
    try {
      console.log('🚀 Provisioning eSIM via TraveRoam API...')

      // Use the TraveRoam order processing endpoint
      const payload = {
        bundle_name: provisionData.bundle_data.bundle_id || provisionData.bundle_data.name,
        client_data: provisionData.client_data,
        payment_data: provisionData.payment_data
      }

      const response = await apiService.post(TRAVEROAM_ORDER_PROCESS_URL, payload, { requiresAuth: true })
      const data = response.data || response

      if (data.success) {
        return {
          success: true,
          data: data.data || data,
          message: 'eSIM provisioned successfully'
        }
      } else {
        throw new Error(data.message || 'Provisioning failed')
      }
    } catch (error) {
      console.error('❌ Failed to provision eSIM:', error)
      return {
        success: false,
        error: error.message || 'Failed to provision eSIM'
      }
    }
  },

  // Bulk assign eSIMs
  async bulkAssignEsims(assignmentDataList) {
    try {
      const results = []

      for (const assignmentData of assignmentDataList) {
        const result = await this.assignEsim(assignmentData)
        results.push({
          ...assignmentData,
          result
        })
      }

      const successCount = results.filter(r => r.result.success).length
      const failureCount = results.length - successCount

      return {
        success: failureCount === 0,
        data: results,
        message: `Bulk assignment completed: ${successCount} successful, ${failureCount} failed`
      }
    } catch (error) {
      console.error('❌ Failed to bulk assign eSIMs:', error)
      return {
        success: false,
        error: error.message || 'Failed to bulk assign eSIMs'
      }
    }
  },

  // Get eSIM status
  async getEsimStatus(esimId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.TRAVEROAM.ESIM_STATUS), { esim_id: esimId })
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to get eSIM status for ${esimId}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to get eSIM status'
      }
    }
  },

  // Get eSIM usage
  async getEsimUsage(esimId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.TRAVEROAM.ESIM_USAGE), { esim_id: esimId })
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to get eSIM usage for ${esimId}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to get eSIM usage'
      }
    }
  },

  // ===== Order Processing =====

  // Process order through TraveRoam
  async processOrder(orderData) {
    try {
      // Validate order data
      const validation = this.validateOrderData(orderData)
      if (!validation.isValid) {
        return {
          success: false,
          error: 'Invalid order data',
          errors: validation.errors
        }
      }

      // Prepare order payload according to backend API
      const payload = {
        bundle_id: orderData.bundle_id,
        customer_email: orderData.customer_email,
        customer_name: orderData.customer_name,
        quantity: orderData.quantity || 1,
        customer_phone: orderData.customer_phone,
        notes: orderData.notes,
        reference: orderData.reference || `order_${Date.now()}`
      }

      const response = await apiService.post(TRAVEROAM_ORDER_PROCESS_URL, payload, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Order processed successfully'
      }
    } catch (error) {
      console.error('❌ Failed to process order:', error)
      return {
        success: false,
        error: error.message || 'Failed to process order'
      }
    }
  },

  // Get order status
  async getOrderStatus(orderId) {
    try {
      const response = await apiService.get(`${TRAVEROAM_ORDER_PROCESS_URL}${orderId}/`, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data
      }
    } catch (error) {
      console.error(`❌ Failed to get order status for ${orderId}:`, error)
      return {
        success: false,
        error: error.message || 'Failed to get order status'
      }
    }
  },

  // ===== Client Management =====

  // Create client through reseller workflow
  async createClient(clientData) {
    try {
      const payload = {
        full_name: clientData.fullName,
        phone_number: clientData.phoneNumber,
        email: clientData.email,
        passport_number: clientData.passportId,  // Fix: use passport_number (not passport_id)
        country_of_travel: clientData.countryOfTravel,
        date_of_travel: clientData.travelDate
      }

      // Debug: Log the final payload being sent to backend (remove in production)
      console.log('🚀 Final backend payload:', payload)

      const response = await apiService.post(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENTS), payload, { requiresAuth: true })
      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Client created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create client:', error)
      
      // Handle specific validation errors from backend
      let errorMessage = error.message || 'Failed to create client'
      
      // Check if it's a validation error with specific field errors
      if (error.message && error.message.includes('already exists')) {
        errorMessage = 'A client with this email address already exists. Please use a different email or check if the client is already registered.'
      } else if (error.message && error.message.includes('Network error')) {
        errorMessage = 'Network error. Please check your connection and ensure the backend server is running.'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  },

  // Get reseller clients
  async getResellerClients(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)

      const url = queryParams.toString()
        ? `${buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENTS)}?${queryParams.toString()}`
        : buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENTS)

      const response = await apiService.get(url, { requiresAuth: true })
      const data = response.data || response

      return {
        success: true,
        data: data.results || data.data || data,
        message: 'Clients retrieved successfully'
      }
    } catch (error) {
      console.error('❌ Failed to get reseller clients:', error)
      return {
        success: false,
        error: error.message || 'Failed to get clients',
        data: []
      }
    }
  },

  // Validate client data
  async validateClient(clientData) {
    try {
      const response = await apiService.post(TRAVEROAM_CLIENT_VALIDATE_URL, clientData, { requiresAuth: true })

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'Client validated successfully'
      }
    } catch (error) {
      console.error('❌ Failed to validate client:', error)
      return {
        success: false,
        error: error.message || 'Failed to validate client'
      }
    }
  },

  // ===== Data Validation =====
  
  // Validate eSIM assignment data
  validateAssignmentData(assignmentData) {
    const errors = {}

    if (!assignmentData.client_id) {
      errors.client_id = 'Client ID is required'
    }

    if (!assignmentData.bundle_name && !assignmentData.plan_id) {
      errors.bundle_name = 'Bundle name or Plan ID is required'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Validate client creation data
  validateClientData(clientData) {
    const errors = {}

    if (!clientData.fullName || clientData.fullName.trim().length < 2) {
      errors.fullName = 'Full name is required (minimum 2 characters)'
    }

    if (!clientData.phoneNumber || !this.validatePhone(clientData.phoneNumber)) {
      errors.phoneNumber = 'Valid phone number with country code is required'
    }

    if (!clientData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientData.email)) {
      errors.email = 'Valid email address is required'
    }

    if (!clientData.passportId || clientData.passportId.trim().length < 3) {
      errors.passportId = 'Passport/ID number is required (minimum 3 characters)'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // Validate phone number format
  validatePhone(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    return cleanPhone.startsWith('+') && cleanPhone.length >= 10
  },

  // Validate order data
  validateOrderData(orderData) {
    const errors = {}
    
    if (!orderData.bundle_id) {
      errors.bundle_id = 'Bundle ID is required'
    }
    
    if (!orderData.customer_email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.customer_email)) {
      errors.customer_email = 'Valid customer email is required'
    }
    
    if (!orderData.customer_name || orderData.customer_name.trim().length < 2) {
      errors.customer_name = 'Customer name is required'
    }
    
    if (!orderData.quantity || orderData.quantity < 1) {
      errors.quantity = 'Quantity must be at least 1'
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  },

  // ===== Data Formatting =====
  
  // Format TraveRoam plan data for frontend
  formatPlanData(plan) {
    if (!plan) return null
    
    return {
      id: plan.id || plan.bundle_id,
      name: plan.name || plan.bundle_name,
      description: plan.description || '',
      country: plan.country || plan.countries?.[0] || '',
      countries: plan.countries || [],
      region: plan.region || '',
      dataAllowance: plan.data_allowance || plan.data || 0,
      validityDays: plan.validity_days || plan.validity || 0,
      price: plan.price || plan.cost || 0,
      currency: plan.currency || 'USD',
      networks: plan.networks || [],
      features: plan.features || [],
      isActive: plan.is_active !== undefined ? plan.is_active : true,
      traveroamId: plan.traveroam_id || plan.bundle_id,
      type: plan.type || 'data'
    }
  },

  // Format network data
  formatNetworkData(network) {
    if (!network) return null
    
    return {
      id: network.id,
      name: network.name || '',
      country: network.country || '',
      countryCode: network.country_code || '',
      operator: network.operator || '',
      technology: network.technology || '',
      coverage: network.coverage || '',
      isActive: network.is_active !== undefined ? network.is_active : true
    }
  },

  // Format plans list
  formatPlansList(plans) {
    if (!Array.isArray(plans)) {
      return []
    }
    
    return plans.map(plan => this.formatPlanData(plan))
  },

  // Format networks list
  formatNetworksList(networks) {
    if (!Array.isArray(networks)) {
      return []
    }
    
    return networks.map(network => this.formatNetworkData(network))
  },

  // ===== Utility Functions =====
  
  // Get countries list from plans
  getCountriesFromPlans(plans) {
    if (!Array.isArray(plans)) return []
    
    const countries = new Set()
    plans.forEach(plan => {
      if (plan.country) countries.add(plan.country)
      if (plan.countries && Array.isArray(plan.countries)) {
        plan.countries.forEach(country => countries.add(country))
      }
    })
    
    return Array.from(countries).sort()
  },

  // Filter plans by country
  filterPlansByCountry(plans, country) {
    if (!Array.isArray(plans) || !country || country === 'all') {
      return plans
    }
    
    return plans.filter(plan => 
      plan.country === country || 
      (plan.countries && plan.countries.includes(country)) ||
      plan.country === 'GLOBAL'
    )
  }
}

export default traveRoamService
