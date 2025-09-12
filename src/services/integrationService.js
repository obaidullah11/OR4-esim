import { clientService } from './clientService'
import { esimService } from './esimService'
import { traveRoamService } from './traveRoamService'
import { apiService } from './apiService'
import { buildApiUrl, API_ENDPOINTS } from '../config/api'

/**
 * Integration Service - Unified interface for all backend API integrations
 * This service provides high-level business logic operations that combine multiple services
 */
export const integrationService = {
  // ===== Complete eSIM Assignment Workflow =====
  
  /**
   * Complete eSIM assignment workflow
   * 1. Validate client
   * 2. Get available plans
   * 3. Assign eSIM through TraveRoam
   * 4. Create local eSIM record
   * 5. Update client record
   */
  async assignEsimToClient(assignmentData) {
    try {
      const { clientId, planId, email, customerName, notes } = assignmentData

      // Step 1: Validate client exists
      const clientResponse = await clientService.getClientById(clientId)
      if (!clientResponse.success) {
        return {
          success: false,
          error: 'Client not found',
          step: 'client_validation'
        }
      }

      // Step 2: Get plan details
      const planResponse = await esimService.getPlanById(planId)
      if (!planResponse.success) {
        return {
          success: false,
          error: 'Plan not found',
          step: 'plan_validation'
        }
      }

      // Step 3: Assign eSIM through TraveRoam
      const traveRoamResponse = await traveRoamService.assignEsim({
        client_id: clientId,
        plan_id: planId,
        email: email,
        customer_name: customerName,
        notes: notes
      })

      if (!traveRoamResponse.success) {
        return {
          success: false,
          error: traveRoamResponse.error,
          step: 'traveroam_assignment'
        }
      }

      // Step 4: Create local eSIM record
      const esimData = {
        client: clientId,
        plan: planId,
        status: 'assigned',
        traveroam_esim_id: traveRoamResponse.data.esim_id,
        qr_code: traveRoamResponse.data.qr_code,
        activation_code: traveRoamResponse.data.activation_code,
        notes: notes
      }

      const esimResponse = await esimService.createEsim(esimData)
      if (!esimResponse.success) {
        // Log warning but don't fail the whole process
        console.warn('Failed to create local eSIM record:', esimResponse.error)
      }

      return {
        success: true,
        data: {
          client: clientResponse.data,
          plan: planResponse.data,
          esim: traveRoamResponse.data,
          localEsim: esimResponse.data
        },
        message: 'eSIM assigned successfully'
      }

    } catch (error) {
      console.error('Complete eSIM assignment failed:', error)
      return {
        success: false,
        error: error.message || 'eSIM assignment failed',
        step: 'unknown'
      }
    }
  },

  // ===== Client Management with eSIM Integration =====
  
  /**
   * Create client and optionally assign eSIM
   */
  async createClientWithEsim(clientData, esimAssignment = null) {
    try {
      // Step 1: Create client
      const clientResponse = await clientService.createClient(clientData)
      if (!clientResponse.success) {
        return {
          success: false,
          error: clientResponse.error,
          step: 'client_creation'
        }
      }

      const client = clientResponse.data

      // Step 2: Assign eSIM if requested
      if (esimAssignment) {
        const assignmentResponse = await this.assignEsimToClient({
          clientId: client.id,
          planId: esimAssignment.planId,
          email: client.email,
          customerName: client.full_name,
          notes: esimAssignment.notes
        })

        if (!assignmentResponse.success) {
          // Client was created but eSIM assignment failed
          return {
            success: false,
            error: assignmentResponse.error,
            step: 'esim_assignment',
            data: { client }
          }
        }

        return {
          success: true,
          data: {
            client,
            esimAssignment: assignmentResponse.data
          },
          message: 'Client created and eSIM assigned successfully'
        }
      }

      return {
        success: true,
        data: { client },
        message: 'Client created successfully'
      }

    } catch (error) {
      console.error('Client creation with eSIM failed:', error)
      return {
        success: false,
        error: error.message || 'Client creation failed',
        step: 'unknown'
      }
    }
  },

  // ===== Dashboard Data Aggregation =====
  
  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData() {
    try {
      const [
        resellerDashboard,
        recentClients,
        recentEsims,
        availablePlans
      ] = await Promise.allSettled([
        esimService.getResellerDashboard(),
        clientService.getMyClients({ limit: 5, ordering: '-created_at' }),
        esimService.getResellerEsims({ limit: 5, ordering: '-created_at' }),
        esimService.getAvailablePlans({ limit: 10 })
      ])

      return {
        success: true,
        data: {
          dashboard: resellerDashboard.status === 'fulfilled' ? resellerDashboard.value.data : {},
          recentClients: recentClients.status === 'fulfilled' ? recentClients.value.data.results : [],
          recentEsims: recentEsims.status === 'fulfilled' ? recentEsims.value.data.results : [],
          availablePlans: availablePlans.status === 'fulfilled' ? availablePlans.value.data : []
        }
      }

    } catch (error) {
      console.error('Dashboard data aggregation failed:', error)
      return {
        success: false,
        error: error.message || 'Failed to load dashboard data'
      }
    }
  },

  // ===== Bulk Operations =====
  
  /**
   * Bulk assign eSIMs to multiple clients
   */
  async bulkAssignEsims(assignments) {
    try {
      const results = []

      for (const assignment of assignments) {
        const result = await this.assignEsimToClient(assignment)
        results.push({
          ...assignment,
          result
        })

        // Small delay between assignments to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      const successCount = results.filter(r => r.result.success).length
      const failureCount = results.length - successCount

      return {
        success: failureCount === 0,
        data: results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: failureCount
        },
        message: `Bulk assignment completed: ${successCount} successful, ${failureCount} failed`
      }

    } catch (error) {
      console.error('Bulk eSIM assignment failed:', error)
      return {
        success: false,
        error: error.message || 'Bulk assignment failed'
      }
    }
  },

  // ===== Data Synchronization =====
  
  /**
   * Sync eSIM status with TraveRoam
   */
  async syncEsimStatus(esimId) {
    try {
      // Get local eSIM record
      const localEsim = await esimService.getEsimById(esimId)
      if (!localEsim.success) {
        return {
          success: false,
          error: 'Local eSIM not found'
        }
      }

      // Get status from TraveRoam
      const traveRoamStatus = await traveRoamService.getEsimStatus(localEsim.data.traveroam_esim_id)
      if (!traveRoamStatus.success) {
        return {
          success: false,
          error: 'Failed to get TraveRoam status'
        }
      }

      // Update local record if status changed
      if (localEsim.data.status !== traveRoamStatus.data.status) {
        const updateResponse = await esimService.updateEsim(esimId, {
          status: traveRoamStatus.data.status,
          last_sync: new Date().toISOString()
        })

        if (!updateResponse.success) {
          console.warn('Failed to update local eSIM status:', updateResponse.error)
        }
      }

      return {
        success: true,
        data: {
          localStatus: localEsim.data.status,
          traveRoamStatus: traveRoamStatus.data.status,
          synced: true
        }
      }

    } catch (error) {
      console.error('eSIM status sync failed:', error)
      return {
        success: false,
        error: error.message || 'Status sync failed'
      }
    }
  },

  // ===== Health Check =====
  
  /**
   * Check health of all integrated services
   */
  async healthCheck() {
    try {
      const checks = await Promise.allSettled([
        clientService.getAllClients({ limit: 1 }),
        esimService.getAllEsims({ limit: 1 }),
        esimService.getAllPlans({ limit: 1 }),
        traveRoamService.getAvailablePlans({ limit: 1 }),
        esimService.getResellerDashboard()
      ])

      const results = {
        clientService: checks[0].status === 'fulfilled' && checks[0].value.success,
        esimService: checks[1].status === 'fulfilled' && checks[1].value.success,
        planService: checks[2].status === 'fulfilled' && checks[2].value.success,
        traveRoamService: checks[3].status === 'fulfilled' && checks[3].value.success,
        resellerService: checks[4].status === 'fulfilled' && checks[4].value.success
      }

      const healthyServices = Object.values(results).filter(Boolean).length
      const totalServices = Object.keys(results).length

      return {
        success: healthyServices === totalServices,
        data: {
          services: results,
          summary: {
            healthy: healthyServices,
            total: totalServices,
            percentage: Math.round((healthyServices / totalServices) * 100)
          }
        }
      }

    } catch (error) {
      console.error('Health check failed:', error)
      return {
        success: false,
        error: error.message || 'Health check failed'
      }
    }
  },

  // ===== Email and Communication =====

  /**
   * Send eSIM details to client via email
   */
  async sendEsimEmail(emailData) {
    try {
      const { client_email, client_name, esim_data, plan_data } = emailData

      // Prepare email payload
      const payload = {
        recipient_email: client_email,
        recipient_name: client_name,
        esim_details: {
          qr_code: esim_data.qr_code,
          activation_code: esim_data.activation_code,
          iccid: esim_data.iccid,
          plan_name: plan_data.name,
          data_allowance: plan_data.data_volume,
          validity_days: plan_data.validity_days,
          instructions: esim_data.installation_instructions || 'Scan the QR code with your device to install the eSIM'
        }
      }

      // Use a generic email endpoint - this would need to be implemented in the backend
      const response = await apiService.post(
        buildApiUrl(API_ENDPOINTS.UTILS.SEND_EMAIL),
        payload,
        { requiresAuth: true }
      )

      const data = response.data || response

      return {
        success: true,
        data: data.data || data,
        message: 'eSIM details sent successfully'
      }
    } catch (error) {
      console.error('Failed to send eSIM email:', error)
      return {
        success: false,
        error: error.message || 'Failed to send eSIM email'
      }
    }
  },

  /**
   * Country detection from phone number
   */
  async detectCountryFromPhone(phoneNumber, validateEsim = false) {
    try {
      const response = await apiService.post(
        buildApiUrl(API_ENDPOINTS.UTILS.DETECT_COUNTRY),
        {
          phone_number: phoneNumber,
          validate_esim: validateEsim
        },
        { requiresAuth: false }
      )

      const data = response.data || response

      if (data.data && !data.errors) {
        return {
          success: true,
          data: data.data.country_info || data.data,
          message: 'Country detected successfully'
        }
      } else {
        if (validateEsim && data.errors) {
          throw new Error(data.message || 'Phone number validation failed')
        }
        return {
          success: true,
          data: { name: "Unknown Country", code: "XX", region: "Unknown" },
          message: 'Fallback country used'
        }
      }
    } catch (error) {
      console.warn('Country detection API error:', error)
      if (validateEsim && error.message !== 'Failed to fetch') {
        throw error
      }
      return {
        success: true,
        data: { name: "Unknown Country", code: "XX", region: "Unknown" },
        message: 'Fallback country used due to error'
      }
    }
  }
}

export default integrationService
