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

// Comprehensive payments service
export const paymentsService = {
  // Get all payments/transactions with pagination and filtering
  async getAllPayments(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.ordering) queryParams.append('ordering', params.ordering)
      if (params.status) queryParams.append('status', params.status)
      if (params.payment_method) queryParams.append('payment_method', params.payment_method)
      if (params.amount_min) queryParams.append('amount_min', params.amount_min)
      if (params.amount_max) queryParams.append('amount_max', params.amount_max)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = queryParams.toString() ? 
        `${buildApiUrl(API_ENDPOINTS.PAYMENTS.LIST)}?${queryParams.toString()}` : 
        buildApiUrl(API_ENDPOINTS.PAYMENTS.LIST)
      
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
      console.error('❌ Failed to fetch payments:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch payments',
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

  // Get single payment by ID
  async getPaymentById(paymentId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.PAYMENTS.DETAIL), { id: paymentId })
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch payment:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch payment'
      }
    }
  },

  // Process payment
  async processPayment(paymentData) {
    try {
      const url = buildApiUrl(API_ENDPOINTS.PAYMENTS.CREATE)
      const response = await apiService.post(url, paymentData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Payment processed successfully'
      }
    } catch (error) {
      console.error('❌ Failed to process payment:', error)
      return {
        success: false,
        error: error.message || 'Failed to process payment'
      }
    }
  },

  // Create Stripe checkout session
  async createStripeCheckoutSession(checkoutData) {
    try {
      // Use the correct Stripe bundle checkout endpoint
      const url = buildApiUrl('api/v1/stripe/checkout/bundle/')
      const response = await apiService.post(url, checkoutData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Checkout session created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create Stripe checkout session:', error)
      return {
        success: false,
        error: error.message || 'Failed to create checkout session'
      }
    }
  },

  // Verify Stripe checkout session
  async verifyStripeCheckoutSession(sessionId) {
    try {
      const url = buildApiUrl(`api/v1/stripe/payment-status/?session_id=${sessionId}`)
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Session verified successfully'
      }
    } catch (error) {
      console.error('❌ Failed to verify checkout session:', error)
      return {
        success: false,
        error: error.message || 'Failed to verify session'
      }
    }
  },

  // Test Stripe service connectivity
  async testStripeService() {
    try {
      // Test endpoint to verify Stripe service is working
      const url = buildApiUrl('api/v1/stripe/payment-status/')
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Stripe service is operational'
      }
    } catch (error) {
      console.error('❌ Stripe service test failed:', error)
      return {
        success: false,
        error: error.message || 'Stripe service test failed'
      }
    }
  },

  // Update payment status
  async updatePaymentStatus(paymentId, status, notes = '') {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.PAYMENTS.UPDATE), { id: paymentId })
      const updateData = {
        status: status,
        updated_at: new Date().toISOString()
      }
      
      if (notes) {
        updateData.notes = notes
      }
      
      const response = await apiService.patch(url, updateData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Payment status updated successfully'
      }
    } catch (error) {
      console.error('❌ Failed to update payment status:', error)
      return {
        success: false,
        error: error.message || 'Failed to update payment status'
      }
    }
  },

  // Process refund
  async processRefund(paymentId, refundAmount, reason) {
    try {
      // This would typically be a custom endpoint for refunds
      const url = `${buildApiUrl(API_ENDPOINTS.PAYMENTS.DETAIL.replace('{id}', paymentId))}/refund/`
      const response = await apiService.post(url, {
        refund_amount: refundAmount,
        reason: reason,
        processed_at: new Date().toISOString()
      }, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Refund processed successfully'
      }
    } catch (error) {
      console.error('❌ Failed to process refund:', error)
      return {
        success: false,
        error: error.message || 'Failed to process refund'
      }
    }
  },

  // Approve payment (for manual approvals)
  async approvePayment(paymentId, notes = '') {
    try {
      return await this.updatePaymentStatus(paymentId, 'approved', notes)
    } catch (error) {
      console.error('❌ Failed to approve payment:', error)
      return {
        success: false,
        error: error.message || 'Failed to approve payment'
      }
    }
  },

  // Reject payment
  async rejectPayment(paymentId, reason) {
    try {
      return await this.updatePaymentStatus(paymentId, 'rejected', reason)
    } catch (error) {
      console.error('❌ Failed to reject payment:', error)
      return {
        success: false,
        error: error.message || 'Failed to reject payment'
      }
    }
  },

  // Get payment statistics
  async getPaymentStatistics(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      if (params.period) queryParams.append('period', params.period)
      
      const url = queryParams.toString() ? 
        `${buildApiUrl('payments/statistics/')}?${queryParams.toString()}` : 
        buildApiUrl('payments/statistics/')
      
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch payment statistics:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch payment statistics',
        data: {
          totalAmount: 0,
          totalTransactions: 0,
          successfulTransactions: 0,
          pendingTransactions: 0,
          failedTransactions: 0,
          refundedAmount: 0
        }
      }
    }
  },

  // Format payments list for frontend consumption
  formatPaymentsList(payments) {
    if (!Array.isArray(payments)) {
      return []
    }
    
    return payments.map(payment => ({
      id: payment.id,
      transactionId: payment.transaction_id || `TXN-${payment.id}`,
      orderId: payment.order?.order_number || payment.order_id || `ORD-${payment.order_id || payment.id}`,
      type: payment.payment_type || 'payment',
      source: payment.source || 'app_user',
      customer: {
        name: payment.customer_name || 
              (payment.order?.customer_name) ||
              (payment.user ? `${payment.user.first_name || ''} ${payment.user.last_name || ''}`.trim() : 'Unknown Customer'),
        email: payment.customer_email || payment.order?.customer_email || payment.user?.email || 'unknown@email.com',
        phone: payment.customer_phone || payment.order?.customer_phone || payment.user?.phone_number || 'N/A',
        type: payment.customer_type || (payment.order?.order_type === 'reseller' ? 'Reseller' : 'App User'),
        reseller: payment.reseller_name || payment.order?.reseller?.user?.first_name + ' ' + payment.order?.reseller?.user?.last_name || null
      },
      amount: parseFloat(payment.amount || 0),
      currency: payment.currency || 'USD',
      paymentMethod: payment.payment_method || 'Unknown',
      paymentGateway: payment.payment_gateway || 'Unknown',
      status: payment.status || 'pending',
      description: payment.description || payment.order?.plan_name || 'Payment',
      createdAt: payment.created_at,
      processedAt: payment.processed_at,
      updatedAt: payment.updated_at,
      gatewayResponse: payment.gateway_response || {},
      fees: parseFloat(payment.processing_fee || 0),
      netAmount: parseFloat(payment.amount || 0) - parseFloat(payment.processing_fee || 0),
      invoiceNumber: payment.invoice_number || `INV-${payment.id}`,
      requiresApproval: payment.requires_approval || false,
      notes: payment.notes || '',
      refundAmount: parseFloat(payment.refund_amount || 0),
      refundReason: payment.refund_reason || '',
      refundedAt: payment.refunded_at
    }))
  },

  // ===== Export Functions =====

  /**
   * Export transactions to CSV
   */
  async exportTransactions(filters = {}) {
    try {
      console.log('🔄 Exporting transactions to CSV')

      const queryParams = new URLSearchParams()

      if (filters.status) queryParams.append('status', filters.status)
      if (filters.payment_method) queryParams.append('payment_method', filters.payment_method)
      if (filters.payment_type) queryParams.append('payment_type', filters.payment_type)
      if (filters.date_from) queryParams.append('date_from', filters.date_from)
      if (filters.date_to) queryParams.append('date_to', filters.date_to)

      const url = queryParams.toString() ?
        `${buildApiUrl('payments/export/')}?${queryParams.toString()}` :
        buildApiUrl('payments/export/')

      const response = await apiService.get(url, {
        requiresAuth: true,
        responseType: 'blob'
      })

      if (response.success || response instanceof Blob) {
        // Create download link
        const blob = response instanceof Blob ? response : new Blob([response.data])
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `transactions-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)

        console.log('✅ Transactions exported successfully')
        return { success: true }
      }

      return response
    } catch (error) {
      console.error('❌ Failed to export transactions:', error)
      return {
        success: false,
        error: error.message || 'Failed to export transactions'
      }
    }
  },

  // ===== Analytics Functions =====

  /**
   * Get payment analytics
   */
  async getPaymentAnalytics(period = '30d') {
    try {
      console.log('🔄 Fetching payment analytics for period:', period)

      const response = await apiService.get(buildApiUrl(`payments/analytics/?period=${period}`), { requiresAuth: true })

      if (response.success) {
        return response
      }

      // Fallback: Generate basic analytics from payments
      const paymentsResponse = await this.getAllPayments({ limit: 100 })
      if (paymentsResponse.success) {
        const analytics = this.generatePaymentAnalytics(paymentsResponse.data.results, period)
        return {
          success: true,
          data: analytics
        }
      }

      return response
    } catch (error) {
      console.error('❌ Failed to fetch payment analytics:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch analytics'
      }
    }
  },

  /**
   * Generate basic payment analytics from data
   */
  generatePaymentAnalytics(payments, period) {
    const now = new Date()
    const periodDays = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30
    const startDate = new Date(now.getTime() - (periodDays * 24 * 60 * 60 * 1000))

    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.createdAt || payment.created_at)
      return paymentDate >= startDate
    })

    const analytics = {
      totalTransactions: filteredPayments.length,
      totalRevenue: filteredPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
      averageTransactionValue: 0,
      successRate: 0,
      statusBreakdown: {},
      methodBreakdown: {},
      dailyRevenue: [],
      refundRate: 0,
      processingFees: filteredPayments.reduce((sum, payment) => sum + (payment.fees || 0), 0)
    }

    // Calculate average transaction value
    if (analytics.totalTransactions > 0) {
      analytics.averageTransactionValue = analytics.totalRevenue / analytics.totalTransactions
    }

    // Calculate success rate
    const completedPayments = filteredPayments.filter(payment => payment.status === 'completed')
    if (analytics.totalTransactions > 0) {
      analytics.successRate = (completedPayments.length / analytics.totalTransactions) * 100
    }

    // Status breakdown
    filteredPayments.forEach(payment => {
      const status = payment.status
      analytics.statusBreakdown[status] = (analytics.statusBreakdown[status] || 0) + 1
    })

    // Payment method breakdown
    filteredPayments.forEach(payment => {
      const method = payment.paymentMethod
      analytics.methodBreakdown[method] = (analytics.methodBreakdown[method] || 0) + 1
    })

    // Daily revenue for the period
    for (let i = 0; i < periodDays; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000))
      const dateStr = date.toISOString().split('T')[0]
      const dayPayments = filteredPayments.filter(payment => {
        const paymentDate = new Date(payment.createdAt || payment.created_at)
        return paymentDate.toISOString().split('T')[0] === dateStr
      })

      analytics.dailyRevenue.push({
        date: dateStr,
        revenue: dayPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0),
        transactions: dayPayments.length,
        fees: dayPayments.reduce((sum, payment) => sum + (payment.fees || 0), 0)
      })
    }

    // Calculate refund rate
    const refundedPayments = filteredPayments.filter(payment => payment.status === 'refunded')
    if (analytics.totalTransactions > 0) {
      analytics.refundRate = (refundedPayments.length / analytics.totalTransactions) * 100
    }

    return analytics
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

  // Format currency
  formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  },

    // Generate invoice for a payment
  async generateInvoice(paymentId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.PAYMENTS.GENERATE_INVOICE), { id: paymentId })

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate invoice')
      }

      return response // Return the response for blob handling
    } catch (error) {
      console.error('❌ Failed to generate invoice:', error)
      throw error
    }
  },

  // Export payments to PDF
  async exportPayments(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (params.status) queryParams.append('status', params.status)
      if (params.payment_type) queryParams.append('payment_type', params.payment_type)
      if (params.date_from) queryParams.append('date_from', params.date_from)
      if (params.date_to) queryParams.append('date_to', params.date_to)
      
      const url = queryParams.toString() ? 
        `${buildApiUrl(API_ENDPOINTS.PAYMENTS.EXPORT)}?${queryParams.toString()}` : 
        buildApiUrl(API_ENDPOINTS.PAYMENTS.EXPORT)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to export payments')
      }

      // Handle PDF download
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `Transactions_Report_${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)

      return { success: true }
    } catch (error) {
      console.error('❌ Failed to export payments:', error)
      throw error
    }
  },

  // Delete payment record
  async deletePayment(paymentId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.PAYMENTS.DELETE), { id: paymentId })
      const response = await apiService.delete(url, { requiresAuth: true })
      
      return {
        success: true,
        data: response.data || response
      }
    } catch (error) {
      console.error('❌ Failed to delete payment:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete payment'
      }
    }
  },

  // Format payments list for frontend display
  formatPaymentsList(payments) {
    return payments.map(payment => ({
      id: payment.id,
      transactionId: payment.transaction_id || `PAY-${payment.id}`,
      orderId: payment.order?.order_number || null,
      type: 'payment',
      source: payment.order?.order_source || 'direct',
      customer: {
        name: this.getCustomerName(payment),
        email: this.getCustomerEmail(payment),
        phone: this.getCustomerPhone(payment),
        type: payment.order?.reseller ? 'Reseller' : 'App User',
        reseller: payment.order?.reseller ? this.getResellerName(payment) : null
      },
      amount: parseFloat(payment.amount || 0),
      currency: payment.currency || 'USD',
      paymentMethod: this.formatPaymentMethod(payment.payment_method),
      paymentGateway: payment.payment_type === 'stripe' ? 'Stripe' : 'Manual',
      status: payment.status,
      description: this.getPaymentDescription(payment),
      createdAt: payment.created_at,
      processedAt: payment.completed_at,
      gatewayResponse: payment.gateway_response || {},
      fees: parseFloat(payment.reseller_markup_amount || 0),
      netAmount: parseFloat(payment.amount || 0) - parseFloat(payment.reseller_markup_amount || 0),
      invoiceNumber: payment.invoice_number,
      requiresApproval: payment.status === 'manual_approval'
    }))
  },

  // Helper methods for formatting
  getCustomerName(payment) {
    if (payment.order?.client?.full_name) {
      return payment.order.client.full_name
    }
    if (payment.order?.client?.user) {
      const user = payment.order.client.user
      return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown'
    }
    return payment.customer_name || 'Unknown Customer'
  },

  getCustomerEmail(payment) {
    if (payment.order?.client?.email) {
      return payment.order.client.email
    }
    if (payment.order?.client?.user?.email) {
      return payment.order.client.user.email
    }
    return 'No email'
  },

  getCustomerPhone(payment) {
    if (payment.order?.client?.phone_number) {
      return payment.order.client.phone_number
    }
    if (payment.order?.client?.user?.phone_number) {
      return payment.order.client.user.phone_number
    }
    return 'No phone'
  },

  getResellerName(payment) {
    if (payment.order?.reseller?.user) {
      const user = payment.order.reseller.user
      return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Unknown Reseller'
    }
    return payment.reseller_name || 'Unknown Reseller'
  },

  formatPaymentMethod(method) {
    const methodMap = {
      'stripe': 'Credit Card',
      'credit_card': 'Credit Card',
      'debit_card': 'Debit Card',
      'bank_transfer': 'Bank Transfer',
      'digital_wallet': 'Digital Wallet',
      'cash': 'Cash',
      'crypto': 'Cryptocurrency'
    }
    return methodMap[method] || method?.replace('_', ' ')?.replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'
  },

  getPaymentDescription(payment) {
    if (payment.order?.product_name) {
      return `${payment.order.product_name} Payment`
    }
    return payment.bundle_name || 'eSIM Service Payment'
  }
}

export default paymentsService
