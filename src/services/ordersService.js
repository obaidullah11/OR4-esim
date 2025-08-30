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

// Comprehensive orders service
export const ordersService = {
  // Get all orders with pagination and filtering
  async getAllOrders(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page)
      if (params.limit) queryParams.append('limit', params.limit)
      if (params.search) queryParams.append('search', params.search)
      if (params.ordering) queryParams.append('ordering', params.ordering)
      if (params.status) queryParams.append('status', params.status)
      if (params.order_type) queryParams.append('order_type', params.order_type)
      if (params.payment_status) queryParams.append('payment_status', params.payment_status)
      
      const url = queryParams.toString() ? 
        `${buildApiUrl(API_ENDPOINTS.ORDERS.LIST)}?${queryParams.toString()}` : 
        buildApiUrl(API_ENDPOINTS.ORDERS.LIST)
      
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
      console.error('❌ Failed to fetch orders:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch orders',
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

  // Get single order by ID
  async getOrderById(orderId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ORDERS.DETAIL), { id: orderId })
      const response = await apiService.get(url, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('❌ Failed to fetch order:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch order'
      }
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status, trackingNumber = '', notes = '') {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ORDERS.UPDATE), { id: orderId })
      const updateData = {
        status: status,
        updated_at: new Date().toISOString()
      }
      
      if (trackingNumber) {
        updateData.delivery_tracking_number = trackingNumber
      }
      
      if (notes) {
        updateData.notes = notes
      }
      
      if (status === 'delivered') {
        updateData.delivered_at = new Date().toISOString()
      }
      
      if (status === 'activated') {
        updateData.activated_at = new Date().toISOString()
      }
      
      const response = await apiService.patch(url, updateData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Order status updated successfully'
      }
    } catch (error) {
      console.error('❌ Failed to update order status:', error)
      return {
        success: false,
        error: error.message || 'Failed to update order status'
      }
    }
  },

  // Assign delivery tracking
  async assignDeliveryTracking(orderId, trackingNumber, deliveryNotes = '') {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ORDERS.UPDATE), { id: orderId })
      const updateData = {
        status: 'dispatched',
        delivery_tracking_number: trackingNumber,
        updated_at: new Date().toISOString()
      }
      
      if (deliveryNotes) {
        updateData.notes = deliveryNotes
      }
      
      const response = await apiService.patch(url, updateData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Delivery tracking assigned successfully'
      }
    } catch (error) {
      console.error('❌ Failed to assign delivery tracking:', error)
      return {
        success: false,
        error: error.message || 'Failed to assign delivery tracking'
      }
    }
  },

  // Create new order
  async createOrder(orderData) {
    try {
      const url = buildApiUrl(API_ENDPOINTS.ORDERS.CREATE)
      const response = await apiService.post(url, orderData, { requiresAuth: true })
      
      const data = response.data || response
      
      return {
        success: true,
        data: data,
        message: 'Order created successfully'
      }
    } catch (error) {
      console.error('❌ Failed to create order:', error)
      return {
        success: false,
        error: error.message || 'Failed to create order'
      }
    }
  },

  // Delete order
  async deleteOrder(orderId) {
    try {
      const url = replaceUrlParams(buildApiUrl(API_ENDPOINTS.ORDERS.DELETE), { id: orderId })
      await apiService.delete(url, { requiresAuth: true })
      
      return {
        success: true,
        message: 'Order deleted successfully'
      }
    } catch (error) {
      console.error('❌ Failed to delete order:', error)
      return {
        success: false,
        error: error.message || 'Failed to delete order'
      }
    }
  },

  // ===== Order Notifications =====

  /**
   * Send order notification
   */
  async sendOrderNotification(orderId, notificationType, message) {
    try {
      console.log('🔄 Sending order notification:', orderId, notificationType)

      const response = await apiService.post(buildApiUrl(API_ENDPOINTS.ORDERS.NOTIFICATIONS), {
        order_id: orderId,
        notification_type: notificationType,
        message: message
      }, { requiresAuth: true })

      if (response.success) {
        console.log('✅ Order notification sent successfully')
      }

      return response
    } catch (error) {
      console.error('❌ Failed to send order notification:', error)
      return {
        success: false,
        error: error.message || 'Failed to send notification'
      }
    }
  },

  /**
   * Get order notifications
   */
  async getOrderNotifications(orderId) {
    try {
      console.log('🔄 Fetching order notifications:', orderId)

      const response = await apiService.get(buildApiUrl(`${API_ENDPOINTS.ORDERS.NOTIFICATIONS}/by-order/${orderId}`), { requiresAuth: true })

      return response
    } catch (error) {
      console.error('❌ Failed to fetch order notifications:', error)
      return {
        success: false,
        error: error.message || 'Failed to fetch notifications'
      }
    }
  },

  // ===== Order Export =====

  /**
   * Export orders to CSV
   */
  async exportOrders(filters = {}) {
    try {
      console.log('🔄 Exporting orders to CSV')

      const queryParams = new URLSearchParams()

      if (filters.status) queryParams.append('status', filters.status)
      if (filters.order_type) queryParams.append('order_type', filters.order_type)
      if (filters.payment_status) queryParams.append('payment_status', filters.payment_status)
      if (filters.date_from) queryParams.append('date_from', filters.date_from)
      if (filters.date_to) queryParams.append('date_to', filters.date_to)

      const url = queryParams.toString() ?
        `${buildApiUrl(API_ENDPOINTS.ORDERS.EXPORT)}?${queryParams.toString()}` :
        buildApiUrl(API_ENDPOINTS.ORDERS.EXPORT)

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
        link.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)

        console.log('✅ Orders exported successfully')
        return { success: true }
      }

      return response
    } catch (error) {
      console.error('❌ Failed to export orders:', error)
      return {
        success: false,
        error: error.message || 'Failed to export orders'
      }
    }
  },

  // Format orders list for frontend consumption
  formatOrdersList(orders) {
    if (!Array.isArray(orders)) {
      return []
    }

    return orders.map(order => ({
      id: order.id,
      orderNumber: order.order_number || `ORD-${order.id}`,
      orderType: order.order_type || 'app_user',
      customer: {
        name: order.customer_name || order.public_user?.user?.first_name + ' ' + order.public_user?.user?.last_name || 'Unknown Customer',
        email: order.customer_email || order.public_user?.user?.email || 'unknown@email.com',
        phone: order.customer_phone || order.public_user?.user?.phone_number || 'N/A',
        type: order.order_type === 'app_user' ? 'App User' : 'Reseller Client',
        reseller: order.reseller ? `${order.reseller.user?.first_name} ${order.reseller.user?.last_name}` : null
      },
      simType: order.sim_type || 'eSIM',
      networkProvider: order.network_provider || 'Unknown',
      planName: order.plan_name || 'Standard Plan',
      planPrice: parseFloat(order.plan_price || 0),
      deliveryFee: parseFloat(order.delivery_fee || 0),
      taxAmount: parseFloat(order.tax_amount || 0),
      totalAmount: parseFloat(order.total_amount || 0),
      status: order.status || 'pending',
      paymentStatus: order.payment_status || 'pending',
      deliveryAddress: order.delivery_address || 'N/A',
      deliveryTrackingNumber: order.delivery_tracking_number || '',
      notes: order.notes || '',
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      deliveredAt: order.delivered_at,
      activatedAt: order.activated_at
    }))
  }
}

export default ordersService
