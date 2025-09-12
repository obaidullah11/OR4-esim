import { esimService } from './esimService'
import { traveRoamService } from './traveRoamService'

/**
 * Real-time eSIM provisioning and status update service
 */
export const realtimeService = {
  // Active polling intervals
  activePolls: new Map(),
  
  // Event listeners for status updates
  statusListeners: new Map(),

  /**
   * Start real-time monitoring of eSIM provisioning
   */
  async startEsimProvisioning(esimId, options = {}) {
    const {
      onStatusUpdate = () => {},
      onComplete = () => {},
      onError = () => {},
      pollInterval = 5000, // 5 seconds
      maxAttempts = 60 // 5 minutes total
    } = options

    console.log('Starting real-time eSIM provisioning monitoring:', esimId)

    let attempts = 0
    let lastStatus = null

    const pollStatus = async () => {
      try {
        attempts++
        console.log(`Polling eSIM status (attempt ${attempts}/${maxAttempts}):`, esimId)

        // Get eSIM status from backend
        const response = await esimService.getEsimById(esimId)
        
        if (response.success) {
          const currentStatus = response.data.status
          
          // Check if status changed
          if (currentStatus !== lastStatus) {
            lastStatus = currentStatus
            console.log('eSIM status update:', { esimId, status: currentStatus })
            
            onStatusUpdate({
              esimId,
              status: currentStatus,
              data: response.data,
              timestamp: new Date().toISOString()
            })

            // Check if provisioning is complete
            if (['active', 'activated', 'ready'].includes(currentStatus)) {
              console.log('eSIM provisioning completed:', esimId)
              this.stopPolling(esimId)
              onComplete({
                esimId,
                status: currentStatus,
                data: response.data
              })
              return
            }

            // Check if provisioning failed
            if (['failed', 'cancelled', 'expired'].includes(currentStatus)) {
              console.log('eSIM provisioning failed:', esimId)
              this.stopPolling(esimId)
              onError({
                esimId,
                status: currentStatus,
                error: 'Provisioning failed'
              })
              return
            }
          }

          // Continue polling if not complete and within attempt limit
          if (attempts < maxAttempts) {
            const timeoutId = setTimeout(pollStatus, pollInterval)
            this.activePolls.set(esimId, timeoutId)
          } else {
            console.log('⏰ eSIM provisioning monitoring timeout:', esimId)
            this.stopPolling(esimId)
            onError({
              esimId,
              error: 'Monitoring timeout - maximum attempts reached'
            })
          }
        } else {
          console.error('Failed to get eSIM status:', response.error)
          onError({
            esimId,
            error: response.error || 'Failed to get eSIM status'
          })
        }
      } catch (error) {
        console.error('Error polling eSIM status:', error)
        onError({
          esimId,
          error: error.message || 'Polling error'
        })
      }
    }

    // Start polling
    pollStatus()
  },

  /**
   * Stop polling for specific eSIM
   */
  stopPolling(esimId) {
    if (this.activePolls.has(esimId)) {
      clearTimeout(this.activePolls.get(esimId))
      this.activePolls.delete(esimId)
      console.log('🛑 Stopped polling for eSIM:', esimId)
    }
  },

  /**
   * Stop all active polling
   */
  stopAllPolling() {
    this.activePolls.forEach((timeoutId, esimId) => {
      clearTimeout(timeoutId)
      console.log('🛑 Stopped polling for eSIM:', esimId)
    })
    this.activePolls.clear()
    console.log('🛑 All eSIM polling stopped')
  },

  /**
   * Enhanced eSIM assignment with real-time monitoring
   */
  async assignEsimWithRealTimeUpdates(assignmentData, callbacks = {}) {
    const {
      onAssignmentStart = () => {},
      onAssignmentComplete = () => {},
      onStatusUpdate = () => {},
      onProvisioningComplete = () => {},
      onError = () => {}
    } = callbacks

    try {
      console.log('Starting enhanced eSIM assignment with real-time updates')
      
      onAssignmentStart(assignmentData)

      // Step 1: Assign eSIM through TraveRoam
      const assignmentResponse = await traveRoamService.assignEsim(assignmentData)
      
      if (!assignmentResponse.success) {
        onError({
          step: 'assignment',
          error: assignmentResponse.error
        })
        return assignmentResponse
      }

      const esimData = assignmentResponse.data
      console.log('eSIM assigned, starting real-time monitoring:', esimData.esim_id)

      onAssignmentComplete(esimData)

      // Step 2: Start real-time monitoring
      if (esimData.esim_id) {
        this.startEsimProvisioning(esimData.esim_id, {
          onStatusUpdate: (update) => {
            console.log('Real-time status update:', update)
            onStatusUpdate(update)
          },
          onComplete: (result) => {
            console.log('Real-time provisioning completed:', result)
            onProvisioningComplete(result)
          },
          onError: (error) => {
            console.error('Real-time monitoring error:', error)
            onError({
              step: 'monitoring',
              ...error
            })
          }
        })
      }

      return assignmentResponse

    } catch (error) {
      console.error('Enhanced eSIM assignment failed:', error)
      onError({
        step: 'assignment',
        error: error.message || 'Assignment failed'
      })
      return {
        success: false,
        error: error.message || 'Assignment failed'
      }
    }
  },

  /**
   * Sync eSIM status with TraveRoam
   */
  async syncWithTraveRoam(esimId) {
    try {
      console.log('Syncing eSIM with TraveRoam:', esimId)

      // Get local eSIM data
      const localResponse = await esimService.getEsimById(esimId)
      if (!localResponse.success) {
        return {
          success: false,
          error: 'Local eSIM not found'
        }
      }

      const localEsim = localResponse.data
      
      // Get TraveRoam status
      if (localEsim.traveroam_esim_id) {
        const traveRoamResponse = await traveRoamService.getEsimStatus(localEsim.traveroam_esim_id)
        
        if (traveRoamResponse.success) {
          const traveRoamStatus = traveRoamResponse.data
          
          // Update local eSIM if status differs
          if (localEsim.status !== traveRoamStatus.status) {
            console.log('Updating local eSIM status:', {
              esimId,
              oldStatus: localEsim.status,
              newStatus: traveRoamStatus.status
            })

            const updateResponse = await esimService.updateEsim(esimId, {
              status: traveRoamStatus.status,
              last_sync: new Date().toISOString()
            })

            return {
              success: true,
              data: {
                updated: updateResponse.success,
                oldStatus: localEsim.status,
                newStatus: traveRoamStatus.status,
                syncTime: new Date().toISOString()
              }
            }
          } else {
            return {
              success: true,
              data: {
                updated: false,
                status: localEsim.status,
                message: 'Status already in sync'
              }
            }
          }
        }
      }

      return {
        success: false,
        error: 'Unable to sync with TraveRoam'
      }

    } catch (error) {
      console.error('TraveRoam sync failed:', error)
      return {
        success: false,
        error: error.message || 'Sync failed'
      }
    }
  },

  /**
   * Bulk sync multiple eSIMs
   */
  async bulkSyncEsims(esimIds) {
    console.log('Starting bulk eSIM sync:', esimIds.length, 'eSIMs')
    
    const results = []
    
    for (const esimId of esimIds) {
      const result = await this.syncWithTraveRoam(esimId)
      results.push({
        esimId,
        ...result
      })
      
      // Small delay between syncs to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    const successCount = results.filter(r => r.success).length
    const failureCount = results.length - successCount

    console.log('Bulk sync completed:', {
      total: results.length,
      successful: successCount,
      failed: failureCount
    })

    return {
      success: failureCount === 0,
      data: results,
      summary: {
        total: results.length,
        successful: successCount,
        failed: failureCount
      }
    }
  },

  /**
   * Get real-time usage data
   */
  async getRealtimeUsage(esimId) {
    try {
      console.log('Getting real-time usage for eSIM:', esimId)

      const [localUsage, traveRoamUsage] = await Promise.allSettled([
        esimService.getEsimUsageSummary(esimId),
        traveRoamService.getEsimUsage(esimId)
      ])

      const result = {
        local: localUsage.status === 'fulfilled' ? localUsage.value : null,
        traveRoam: traveRoamUsage.status === 'fulfilled' ? traveRoamUsage.value : null,
        timestamp: new Date().toISOString()
      }

      return {
        success: true,
        data: result
      }

    } catch (error) {
      console.error('Failed to get real-time usage:', error)
      return {
        success: false,
        error: error.message || 'Failed to get usage data'
      }
    }
  }
}

export default realtimeService
