import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { ordersService } from '../../services/ordersService'
import ExportDropdown from '../../components/common/ExportDropdown'
import { paymentsService } from '../../services/paymentsService'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import ScrollableTable from '../../components/common/ScrollableTable'
import { OrdersEmptyState } from '../../components/common/EmptyState'
import { OrdersLoadingState } from '../../components/common/LoadingState'
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  CreditCard,
  AlertCircle,
  Download,
  RefreshCw,
  ShoppingCart,
  Smartphone,
  Activity,
  FileText,
  Send,
  X,
  Ban
} from 'lucide-react'

function OrdersPage() {
  // Utility functions for formatting (same as UsersPageSimple)
  const formatDateTime = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === 'Never') {
      return 'N/A'
    }
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'N/A'
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) + ' at ' + date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    } catch (error) {
      return 'N/A'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === 'Never') {
      return 'N/A'
    }
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'N/A'
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'N/A'
    }
  }

  // State management
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [orderTypeFilter, setOrderTypeFilter] = useState('')
  const [orderSourceFilter, setOrderSourceFilter] = useState('')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedOrderForDelete, setSelectedOrderForDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    status: '',
    delivery_address: '',
    delivery_city: '',
    delivery_country: '',
    delivery_phone: '',
    notes: ''
  })

  // Status update state
  const [statusUpdateData, setStatusUpdateData] = useState({
    status: '',
    notes: '',
    tracking_number: ''
  })

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true)
      console.log('Fetching orders...')

      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        order_type: orderTypeFilter || undefined,
        order_source: orderSourceFilter || undefined,
        ordering: '-created_at'
      }

      const response = await ordersService.getAllOrders(params)
      console.log('📥 Orders response:', response)

      if (response.success) {
        const ordersData = response.data.results || response.data || []
        console.log('Raw orders data:', ordersData)
        setOrders(ordersData)
        setPagination(prev => ({
          ...prev,
          total: response.data.count || ordersData.length || 0,
          totalPages: response.data.pagination?.totalPages || Math.ceil((response.data.count || ordersData.length || 0) / prev.limit)
        }))
        console.log('Orders loaded:', ordersData.length)
      } else {
        console.error('Failed to fetch orders:', response.error)
        toast.error(response.error || 'Failed to fetch orders')
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      if (error.message === 'Failed to fetch') {
        toast.error('Connection error. Please check your internet connection and try again.')
      } else if (error.message?.includes('404')) {
        toast.error('Orders API not found. Please check the backend configuration.')
      } else {
        toast.error(error.message || 'Failed to fetch orders')
      }
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Initial load and search/filter effects
  useEffect(() => {
    fetchOrders()
  }, [pagination.page, pagination.limit])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.page === 1) {
        fetchOrders()
      } else {
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, orderTypeFilter, orderSourceFilter])

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
  }

  // Handle order actions
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleGenerateInvoice = async (order) => {
    try {
      console.log('🧾 Generating invoice for order:', order.id, order)
      
      // Find the payment associated with this order
      // Check multiple possible locations for payment data
      let paymentId = null
      
      if (order.payments && Array.isArray(order.payments) && order.payments.length > 0) {
        // Use the most recent completed payment
        const completedPayment = order.payments.find(p => p.status === 'completed')
        paymentId = completedPayment?.id || order.payments[0]?.id
      } else if (order.payment_id) {
        paymentId = order.payment_id
      } else if (order.payment) {
        paymentId = order.payment.id
      }
      
      console.log('💳 Found payment ID:', paymentId)
      
      if (!paymentId) {
        toast.error('No payment found for this order. Please ensure the order has been paid.')
        return
      }

      // Call the invoice generation API using paymentsService
      const response = await paymentsService.generateInvoice(paymentId)

      if (response.ok) {
        const blob = await response.blob()
        
        // Create download link
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = `Invoice_${order.order_number || `ORD-${order.id}`}_${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)

        toast.success('Invoice generated successfully')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to generate invoice')
      }
    } catch (error) {
      console.error('Failed to generate invoice:', error)
      toast.error('Failed to generate invoice: ' + (error.message || 'Unknown error'))
    }
  }

  const handleDeleteOrder = (order) => {
    setSelectedOrderForDelete(order)
    setShowDeleteModal(true)
  }

  // Confirm delete order
  const confirmDeleteOrder = async () => {
    if (!selectedOrderForDelete) return

    try {
      setIsDeleting(true)
      console.log('Deleting order:', selectedOrderForDelete.id)

      const response = await ordersService.deleteOrder(selectedOrderForDelete.id)
      console.log('📥 Delete response:', response)

      if (response.success) {
        // Remove from local state immediately
        setOrders(prev => prev.filter(o => o.id !== selectedOrderForDelete.id))

        // Update pagination total count
        setPagination(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          totalPages: Math.ceil(Math.max(0, prev.total - 1) / prev.limit)
        }))

        toast.success('Order deleted successfully')
        console.log('Order deleted:', selectedOrderForDelete.id)

        // Refresh the order list from server to ensure consistency
        setTimeout(() => {
          fetchOrders()
        }, 500)
      } else {
        toast.error(response.error || 'Failed to delete order')
        console.error('Failed to delete order:', response.error)
      }
    } catch (error) {
      console.error('Failed to delete order:', error)

      // Handle specific error types
      if (error.message === 'Failed to fetch') {
        toast.error('Connection error. Please check your internet connection and try again.')
      } else if (error.message?.includes('404')) {
        toast.error('Order not found. It may have already been deleted.')
        // Refresh data on 404 to sync with server state
        setTimeout(() => {
          fetchOrders()
        }, 500)
      } else {
        toast.error(error.message || 'Failed to delete order')
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setSelectedOrderForDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setSelectedOrderForDelete(null)
  }

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!selectedOrder) return

    try {
      console.log('Updating order:', selectedOrder.id, editFormData)

      const response = await ordersService.updateOrderStatus(
        selectedOrder.id,
        editFormData.status,
        editFormData.tracking_number || '',
        editFormData.notes || ''
      )

      if (response.success) {
        toast.success('Order updated successfully')
        setShowEditModal(false)
        setSelectedOrder(null)
        fetchOrders() // Refresh the list
      } else {
        toast.error(response.error || 'Failed to update order')
      }
    } catch (error) {
      console.error('Failed to update order:', error)
      toast.error('Failed to update order')
    }
  }

  // Handle status update submission
  const handleStatusSubmit = async (e) => {
    e.preventDefault()
    if (!selectedOrder) return

    try {
      console.log('Updating order status:', selectedOrder.id, statusUpdateData)

      const response = await ordersService.updateOrderStatus(
        selectedOrder.id,
        statusUpdateData.status,
        statusUpdateData.tracking_number || '',
        statusUpdateData.notes || ''
      )

      if (response.success) {
        toast.success('Order status updated successfully')
        setShowStatusModal(false)
    setSelectedOrder(null)
        fetchOrders() // Refresh the list
      } else {
        toast.error(response.error || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Failed to update order status:', error)
      toast.error('Failed to update order status')
    }
  }

  // Export functions
  const exportToPDF = async () => {
    try {
      console.log('📤 Exporting orders as PDF...')
      
      const filters = {
        status: statusFilter || undefined,
        order_type: orderTypeFilter || undefined,
        order_source: orderSourceFilter || undefined
      }

      const response = await ordersService.exportOrders({ ...filters, format: 'pdf' })

      if (response.success) {
        toast.success('Orders exported as PDF successfully')
      } else {
        toast.error(response.error || 'Failed to export orders as PDF')
      }
    } catch (error) {
      console.error('Failed to export orders as PDF:', error)
      toast.error('Failed to export orders as PDF')
    }
  }

  const exportToExcel = async () => {
    try {
      console.log('📤 Exporting orders as Excel...')
      
      const filters = {
        status: statusFilter || undefined,
        order_type: orderTypeFilter || undefined,
        order_source: orderSourceFilter || undefined
      }

      const response = await ordersService.exportOrders({ ...filters, format: 'excel' })

      if (response.success) {
        toast.success('Orders exported as Excel successfully')
      } else {
        toast.error(response.error || 'Failed to export orders as Excel')
      }
    } catch (error) {
      console.error('Failed to export orders as Excel:', error)
      toast.error('Failed to export orders as Excel')
    }
  }

  // Get status badge styling (same as UsersPageSimple pattern)
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle },
      processing: { bg: 'bg-purple-100', text: 'text-purple-800', icon: Activity },
      dispatched: { bg: 'bg-indigo-100', text: 'text-indigo-800', icon: Truck },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      activated: { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle },
      completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
      refunded: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle }
    }

    const config = statusConfig[status] || statusConfig.pending
    const IconComponent = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    )
  }

  // Get order type badge
  const getOrderTypeBadge = (orderType) => {
    const typeConfig = {
      sim: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'SIM' },
      esim: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'eSIM' }
    }

    const config = typeConfig[orderType] || typeConfig.esim

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        <Smartphone className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  // Get order source badge
  const getOrderSourceBadge = (orderSource) => {
    const sourceConfig = {
      app: { bg: 'bg-green-100', text: 'text-green-800', label: 'Mobile App', icon: Smartphone },
      reseller: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Reseller', icon: User },
      admin: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Admin', icon: User }
    }

    const config = sourceConfig[orderSource] || sourceConfig.app
    const IconComponent = config.icon

  return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    )
  }

  // Table columns configuration
  const columns = [
    {
      key: 'order_number',
      label: 'Order Number',
      render: (order) => (
        <div className="font-medium text-gray-900">
          {order.order_number || `ORD-${order.id}`}
            </div>
      )
    },
    {
      key: 'client',
      label: 'Customer',
      render: (order) => (
            <div>
          <div className="font-medium text-gray-900">
            {order.client?.full_name || (order.client?.user?.first_name && order.client?.user?.last_name ? `${order.client.user.first_name} ${order.client.user.last_name}` : 'Unknown Customer')}
            </div>
          <div className="text-sm text-gray-500">
            {order.client?.email || order.client?.user?.email || 'No email'}
          </div>
        </div>
      )
    },
    {
      key: 'product_name',
      label: 'Product',
      render: (order) => (
            <div>
          <div className="font-medium text-gray-900">
            {order.product_name || 'eSIM Service'}
            </div>
          <div className="text-sm text-gray-500">
            Qty: {order.quantity || 1}
          </div>
        </div>
      )
    },
    {
      key: 'total_amount',
      label: 'Amount',
      render: (order) => (
        <div className="font-medium text-gray-900">
          ${parseFloat(order.total_amount || 0).toFixed(2)}
            </div>
      )
    },
    {
      key: 'order_type',
      label: 'Type',
      render: (order) => getOrderTypeBadge(order.order_type)
    },
    {
      key: 'order_source',
      label: 'Source',
      render: (order) => getOrderSourceBadge(order.order_source)
    },
    {
      key: 'status',
      label: 'Status',
      render: (order) => getStatusBadge(order.status)
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (order) => (
        <div className="text-sm text-gray-500">
          {formatDate(order.created_at)}
            </div>
      )
    },
        {
      key: 'actions',
      label: 'Actions',
      render: (order) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleViewOrder(order)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="View Order Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleGenerateInvoice(order)}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Generate Invoice"
          >
            <FileText className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteOrder(order)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete Order"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
            <div>
          <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track all orders in the system
              </p>
            </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <ExportDropdown
            onExportPDF={exportToPDF}
            onExportExcel={exportToExcel}
            disabled={loading}
          />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
            <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
            placeholder="Search by order number, customer name, or product..."
                value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              />
          </div>

          {/* Filters */}
        <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-ring bg-background text-foreground"
            >
            <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="activated">Activated</option>
            <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
            </select>

            <select
              value={orderTypeFilter}
              onChange={(e) => setOrderTypeFilter(e.target.value)}
            className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="">All Types</option>
            <option value="sim">SIM Card</option>
            <option value="esim">eSIM</option>
            </select>

            <select
            value={orderSourceFilter}
            onChange={(e) => setOrderSourceFilter(e.target.value)}
            className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="">All Sources</option>
            <option value="app">Mobile App</option>
            <option value="reseller">Reseller</option>
            <option value="admin">Admin</option>
            </select>

          {/* Clear Filters */}
          {(searchTerm || statusFilter || orderTypeFilter || orderSourceFilter) && (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('')
                setOrderTypeFilter('')
                setOrderSourceFilter('')
              }}
              className="inline-flex items-center px-3 py-1 border border-border rounded-md text-sm font-medium text-muted-foreground bg-background hover:bg-muted"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <ScrollableTable
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        loading={loading}
        maxHeight="600px"
        showPagination={true}
        showEntries={true}
        showPageInfo={true}
      >
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
              {columns.map((column) => (
                <th key={column.key} className="text-left p-4 font-medium text-foreground">
                  {column.label}
                </th>
              ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <OrdersLoadingState />
              ) : orders.length === 0 ? (
                <OrdersEmptyState />
              ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  {columns.map((column) => (
                    <td key={column.key} className="p-4">
                      {column.render(order)}
                  </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ScrollableTable>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Order Details</h2>
                      <p className="text-sm text-muted-foreground">
                    {selectedOrder.order_number || `ORD-${selectedOrder.id}`}
                      </p>
                    </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Order Information */}
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Order Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Order Number</label>
                      <p className="text-sm font-medium text-foreground">{selectedOrder.order_number || `ORD-${selectedOrder.id}`}</p>
                          </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                        </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</label>
                      <div className="mt-1">{getOrderTypeBadge(selectedOrder.order_type)}</div>
                      </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Source</label>
                      <div className="mt-1">{getOrderSourceBadge(selectedOrder.order_source)}</div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</label>
                      <p className="text-sm text-foreground">{formatDateTime(selectedOrder.created_at)}</p>
                    </div>
                    {selectedOrder.delivered_at && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Delivered</label>
                        <p className="text-sm text-foreground">{formatDateTime(selectedOrder.delivered_at)}</p>
                      </div>
                        )}
                      </div>
                        </div>

                {/* Customer Information */}
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Customer Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
                      <p className="text-sm font-medium text-foreground">{selectedOrder.client?.full_name || 'Unknown Customer'}</p>
                      </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                      <p className="text-sm text-foreground">{selectedOrder.client?.email || 'No email'}</p>
                      </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
                      <p className="text-sm text-foreground">{selectedOrder.client?.phone_number || 'No phone'}</p>
                      </div>
                    {selectedOrder.reseller && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reseller</label>
                        <p className="text-sm text-foreground">{selectedOrder.reseller.user?.first_name} {selectedOrder.reseller.user?.last_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Information */}
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Package className="h-5 w-5 mr-2 text-primary" />
                    Product Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product Name</label>
                      <p className="text-sm font-medium text-foreground">{selectedOrder.product_name || 'eSIM Service'}</p>
                    </div>
                    {selectedOrder.product_description && (
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</label>
                        <p className="text-sm text-foreground">{selectedOrder.product_description}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quantity</label>
                      <p className="text-sm text-foreground">{selectedOrder.quantity || 1}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Unit Price</label>
                      <p className="text-sm font-medium text-foreground">${parseFloat(selectedOrder.unit_price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    Pricing Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Subtotal</label>
                      <p className="text-sm text-foreground">${parseFloat(selectedOrder.subtotal || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tax Amount</label>
                      <p className="text-sm text-foreground">${parseFloat(selectedOrder.tax_amount || 0).toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Delivery Fee</label>
                      <p className="text-sm text-foreground">${parseFloat(selectedOrder.delivery_fee || 0).toFixed(2)}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-border">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Amount</label>
                      <p className="text-lg font-bold text-primary">${parseFloat(selectedOrder.total_amount || 0).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Information */}
              {(selectedOrder.delivery_address || selectedOrder.delivery_city || selectedOrder.delivery_country) && (
                <div className="mt-6">
                  <div className="bg-muted/20 border border-border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <Truck className="h-5 w-5 mr-2 text-primary" />
                      Delivery Information
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {selectedOrder.delivery_address && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</label>
                          <p className="text-sm text-foreground">{selectedOrder.delivery_address}</p>
                        </div>
                      )}
                      {selectedOrder.delivery_city && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">City</label>
                          <p className="text-sm text-foreground">{selectedOrder.delivery_city}</p>
                        </div>
                      )}
                      {selectedOrder.delivery_country && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Country</label>
                          <p className="text-sm text-foreground">{selectedOrder.delivery_country}</p>
                        </div>
                      )}
                      {selectedOrder.delivery_phone && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</label>
                          <p className="text-sm text-foreground">{selectedOrder.delivery_phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="mt-6">
                  <div className="bg-muted/20 border border-border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <FileText className="h-5 w-5 mr-2 text-primary" />
                      Notes
                    </h3>
                    <p className="text-sm text-foreground">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit Order</h2>
                        <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                        </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="activated">Activated</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                  <textarea
                    value={editFormData.delivery_address}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, delivery_address: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter delivery address..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editFormData.delivery_city}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, delivery_city: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter city..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      value={editFormData.delivery_country}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, delivery_country: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter country..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Phone</label>
                  <input
                    type="tel"
                    value={editFormData.delivery_phone}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, delivery_phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter delivery phone..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={editFormData.notes}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                              <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                              </button>
                              <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Order
                              </button>
                            </div>
            </form>
                          </div>
                        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <form onSubmit={handleStatusSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Update Status</h2>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
        </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                  <select
                    value={statusUpdateData.status}
                    onChange={(e) => setStatusUpdateData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="delivered">Delivered</option>
                    <option value="activated">Activated</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
      </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number (Optional)</label>
                  <input
                    type="text"
                    value={statusUpdateData.tracking_number}
                    onChange={(e) => setStatusUpdateData(prev => ({ ...prev, tracking_number: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter tracking number..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                  <textarea
                    value={statusUpdateData.notes}
                    onChange={(e) => setStatusUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter status update notes..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={confirmDeleteOrder}
        title="Delete Order"
        message={`Are you sure you want to delete order "${selectedOrderForDelete?.order_number || `ORD-${selectedOrderForDelete?.id}`}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        type="danger"
      />
    </div>
  )
}

export default OrdersPage
