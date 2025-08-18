import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  MapPin,
  User,
  UserCheck,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  CreditCard,
  AlertCircle,
  Bell,
  Download,
  RefreshCw,
  ShoppingCart,
  Smartphone,
  Activity,
  FileText,
  Send
} from 'lucide-react'
import OrderDetailsModal from '../../components/orders/OrderDetailsModal'
import DeliveryAssignmentModal from '../../components/orders/DeliveryAssignmentModal'
import StatusUpdateModal from '../../components/orders/StatusUpdateModal'

// Sample order data
const sampleOrders = [
  {
    id: 1,
    orderNumber: 'ORD-2024-001',
    orderType: 'app_user',
    customer: {
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+971 50 123 4567',
      type: 'App User'
    },
    simType: 'eSIM',
    networkProvider: 'Etisalat',
    planName: 'Premium 30GB',
    planPrice: 150,
    deliveryFee: 15,
    taxAmount: 8.25,
    totalAmount: 173.25,
    status: 'pending',
    paymentStatus: 'paid',
    deliveryAddress: 'Al Barsha, Dubai, UAE',
    deliveryTrackingNumber: '',
    notes: 'Customer requested express delivery',
    createdAt: '2024-03-15T10:30:00Z',
    updatedAt: '2024-03-15T10:30:00Z',
    deliveredAt: null,
    activatedAt: null
  },
  {
    id: 2,
    orderNumber: 'ORD-2024-002',
    orderType: 'reseller_client',
    customer: {
      name: 'Fatima Al-Zahra',
      email: 'fatima.alzahra@email.com',
      phone: '+971 55 987 6543',
      type: 'Reseller Client',
      reseller: 'TechCorp Solutions'
    },
    simType: 'Physical SIM',
    networkProvider: 'Du',
    planName: 'Standard 15GB',
    planPrice: 90,
    deliveryFee: 10,
    taxAmount: 5,
    totalAmount: 105,
    status: 'confirmed',
    paymentStatus: 'paid',
    deliveryAddress: 'Khalifa City, Abu Dhabi, UAE',
    deliveryTrackingNumber: 'TRK123456789',
    notes: '',
    createdAt: '2024-03-14T14:20:00Z',
    updatedAt: '2024-03-15T09:15:00Z',
    deliveredAt: null,
    activatedAt: null
  },
  {
    id: 3,
    orderNumber: 'ORD-2024-003',
    orderType: 'app_user',
    customer: {
      name: 'Mohammed Ali',
      email: 'mohammed.ali@email.com',
      phone: '+971 52 456 7890',
      type: 'App User'
    },
    simType: 'eSIM',
    networkProvider: 'Virgin Mobile',
    planName: 'Basic 5GB',
    planPrice: 45,
    deliveryFee: 0,
    taxAmount: 2.25,
    totalAmount: 47.25,
    status: 'dispatched',
    paymentStatus: 'paid',
    deliveryAddress: 'Al Nahda, Sharjah, UAE',
    deliveryTrackingNumber: 'TRK987654321',
    notes: 'eSIM activation code sent via email',
    createdAt: '2024-03-13T16:45:00Z',
    updatedAt: '2024-03-14T11:30:00Z',
    deliveredAt: null,
    activatedAt: null
  },
  {
    id: 4,
    orderNumber: 'ORD-2024-004',
    orderType: 'reseller_client',
    customer: {
      name: 'Sarah Abdullah',
      email: 'sarah.abdullah@email.com',
      phone: '+971 56 234 5678',
      type: 'Reseller Client',
      reseller: 'Digital Solutions LLC'
    },
    simType: 'Physical SIM',
    networkProvider: 'Etisalat',
    planName: 'Premium 30GB',
    planPrice: 150,
    deliveryFee: 15,
    taxAmount: 8.25,
    totalAmount: 173.25,
    status: 'delivered',
    paymentStatus: 'paid',
    deliveryAddress: 'Jumeirah, Dubai, UAE',
    deliveryTrackingNumber: 'TRK456789123',
    notes: 'Delivered to reception',
    createdAt: '2024-03-12T09:15:00Z',
    updatedAt: '2024-03-14T15:45:00Z',
    deliveredAt: '2024-03-14T15:45:00Z',
    activatedAt: null
  },
  {
    id: 5,
    orderNumber: 'ORD-2024-005',
    orderType: 'app_user',
    customer: {
      name: 'Omar Khalil',
      email: 'omar.khalil@email.com',
      phone: '+971 50 876 5432',
      type: 'App User'
    },
    simType: 'eSIM',
    networkProvider: 'Du',
    planName: 'Standard 15GB',
    planPrice: 90,
    deliveryFee: 0,
    taxAmount: 4.5,
    totalAmount: 94.5,
    status: 'activated',
    paymentStatus: 'paid',
    deliveryAddress: 'Al Nuaimiya, Ajman, UAE',
    deliveryTrackingNumber: '',
    notes: 'Customer activated successfully',
    createdAt: '2024-03-11T13:20:00Z',
    updatedAt: '2024-03-13T10:30:00Z',
    deliveredAt: '2024-03-12T16:20:00Z',
    activatedAt: '2024-03-13T10:30:00Z'
  },
  {
    id: 6,
    orderNumber: 'ORD-2024-006',
    orderType: 'app_user',
    customer: {
      name: 'Layla Ibrahim',
      email: 'layla.ibrahim@email.com',
      phone: '+971 55 345 6789',
      type: 'App User'
    },
    simType: 'Physical SIM',
    networkProvider: 'Virgin Mobile',
    planName: 'Premium 30GB',
    planPrice: 150,
    deliveryFee: 15,
    taxAmount: 8.25,
    totalAmount: 173.25,
    status: 'cancelled',
    paymentStatus: 'refunded',
    deliveryAddress: 'Al Qusaidat, Ras Al Khaimah, UAE',
    deliveryTrackingNumber: '',
    notes: 'Customer requested cancellation',
    createdAt: '2024-03-10T11:45:00Z',
    updatedAt: '2024-03-11T14:20:00Z',
    deliveredAt: null,
    activatedAt: null
  }
]

function OrdersPage() {
  const { resolvedTheme } = useTheme()
  const [orders, setOrders] = useState(sampleOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orderTypeFilter, setOrderTypeFilter] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.planName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    const matchesOrderType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.paymentStatus === paymentStatusFilter

    return matchesSearch && matchesStatus && matchesOrderType && matchesPaymentStatus
  })

  // Get status color and icon
  const getStatusDisplay = (status) => {
    const statusConfig = {
      pending: {
        color: 'text-yellow-500',
        bg: resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
        icon: Clock,
        label: 'Pending'
      },
      confirmed: {
        color: 'text-blue-500',
        bg: resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
        icon: CheckCircle,
        label: 'Confirmed'
      },
      dispatched: {
        color: 'text-purple-500',
        bg: resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
        icon: Truck,
        label: 'Dispatched'
      },
      delivered: {
        color: 'text-green-500',
        bg: resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
        icon: Package,
        label: 'Delivered'
      },
      activated: {
        color: 'text-emerald-500',
        bg: resolvedTheme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50',
        icon: Activity,
        label: 'Activated'
      },
      cancelled: {
        color: 'text-red-500',
        bg: resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
        icon: XCircle,
        label: 'Cancelled'
      }
    }
    return statusConfig[status] || statusConfig.pending
  }

  const getPaymentStatusDisplay = (status) => {
    const statusConfig = {
      pending: { color: 'text-yellow-500', label: 'Pending' },
      paid: { color: 'text-green-500', label: 'Paid' },
      failed: { color: 'text-red-500', label: 'Failed' },
      refunded: { color: 'text-orange-500', label: 'Refunded' }
    }
    return statusConfig[status] || statusConfig.pending
  }

  // Handler functions
  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const handleAssignDelivery = (order) => {
    setSelectedOrder(order)
    setShowDeliveryModal(true)
  }

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order)
    setShowStatusModal(true)
  }

  const handleStatusUpdate = (orderId, newStatus, trackingNumber = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString()
        }

        if (trackingNumber) {
          updatedOrder.deliveryTrackingNumber = trackingNumber
        }

        if (newStatus === 'delivered') {
          updatedOrder.deliveredAt = new Date().toISOString()
        }

        if (newStatus === 'activated') {
          updatedOrder.activatedAt = new Date().toISOString()
        }

        return updatedOrder
      }
      return order
    }))

    // Send notification
    toast.success(`Order ${newStatus} successfully`)

    // Close modal
    setShowStatusModal(false)
    setSelectedOrder(null)
  }

  const handleDeliveryAssignment = (orderId, trackingNumber, deliveryNotes) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: 'dispatched',
          deliveryTrackingNumber: trackingNumber,
          notes: deliveryNotes || order.notes,
          updatedAt: new Date().toISOString()
        }
      }
      return order
    }))

    toast.success('Delivery assigned successfully')
    setShowDeliveryModal(false)
    setSelectedOrder(null)
  }

  const sendNotification = (order, type) => {
    // Simulate sending notification
    toast.success(`${type} notification sent to ${order.customer.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">SIM Order Management</h1>
          <p className="text-muted-foreground">Manage orders from app users and resellers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <ShoppingCart className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {orders.filter(o => o.status === 'pending').length}
              </p>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {orders.filter(o => o.status === 'delivered' || o.status === 'activated').length}
              </p>
              <p className="text-sm text-muted-foreground">Completed Orders</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <DollarSign className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search orders by number, customer, email, or plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="activated">Activated</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Order Type Filter */}
            <select
              value={orderTypeFilter}
              onChange={(e) => setOrderTypeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="app_user">App Users</option>
              <option value="reseller_client">Resellers</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="pending">Payment Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Payment Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Order</th>
                <th className="text-left p-4 font-medium text-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-foreground">Plan</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Payment</th>
                <th className="text-left p-4 font-medium text-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-foreground">Date</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => {
                const statusDisplay = getStatusDisplay(order.status)
                const paymentDisplay = getPaymentStatusDisplay(order.paymentStatus)
                const StatusIcon = statusDisplay.icon

                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{order.orderNumber}</p>
                        <div className="flex items-center space-x-2">
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                            order.orderType === 'app_user'
                              ? resolvedTheme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                              : resolvedTheme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                          }`}>
                            {order.orderType === 'app_user' ? <Smartphone className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                            <span>{order.customer.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                        {order.customer.reseller && (
                          <p className="text-xs text-muted-foreground">via {order.customer.reseller}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{order.planName}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.simType === 'eSIM'
                              ? resolvedTheme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
                              : resolvedTheme === 'dark' ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {order.simType}
                          </span>
                          <span className="text-sm text-muted-foreground">{order.networkProvider}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{statusDisplay.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-medium ${paymentDisplay.color}`}>
                        {paymentDisplay.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">${order.totalAmount.toFixed(2)}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className={`p-2 rounded-lg transition-colors ${
                            resolvedTheme === 'dark'
                              ? 'hover:bg-slate-700 text-slate-300 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {(order.status === 'pending' || order.status === 'confirmed') && (
                          <button
                            onClick={() => handleAssignDelivery(order)}
                            className={`p-2 rounded-lg transition-colors ${
                              resolvedTheme === 'dark'
                                ? 'hover:bg-blue-900/20 text-blue-400 hover:text-blue-300'
                                : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700'
                            }`}
                            title="Assign Delivery"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleUpdateStatus(order)}
                          className={`p-2 rounded-lg transition-colors ${
                            resolvedTheme === 'dark'
                              ? 'hover:bg-green-900/20 text-green-400 hover:text-green-300'
                              : 'hover:bg-green-50 text-green-600 hover:text-green-700'
                          }`}
                          title="Update Status"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => sendNotification(order, 'Status Update')}
                          className={`p-2 rounded-lg transition-colors ${
                            resolvedTheme === 'dark'
                              ? 'hover:bg-orange-900/20 text-orange-400 hover:text-orange-300'
                              : 'hover:bg-orange-50 text-orange-600 hover:text-orange-700'
                          }`}
                          title="Send Notification"
                        >
                          <Bell className="h-4 w-4" />
                        </button>

                        <div className="relative group">
                          <button
                            className={`p-2 rounded-lg transition-colors ${
                              resolvedTheme === 'dark'
                                ? 'hover:bg-slate-700 text-slate-300 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {/* Dropdown Menu */}
                          <div className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ${
                            resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'
                          }`}>
                            <div className="py-1">
                              <button
                                onClick={() => sendNotification(order, 'Order Confirmation')}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                                  resolvedTheme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <Send className="h-4 w-4" />
                                <span>Send Confirmation</span>
                              </button>
                              <button
                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                                  resolvedTheme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <FileText className="h-4 w-4" />
                                <span>Generate Invoice</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className={`mx-auto h-12 w-12 ${resolvedTheme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
            <h3 className="mt-2 text-sm font-medium text-foreground">No orders found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || orderTypeFilter !== 'all' || paymentStatusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No orders have been placed yet'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedOrder(null)
          }}
          onStatusUpdate={handleStatusUpdate}
          onSendNotification={sendNotification}
        />
      )}

      {showDeliveryModal && selectedOrder && (
        <DeliveryAssignmentModal
          order={selectedOrder}
          isOpen={showDeliveryModal}
          onClose={() => {
            setShowDeliveryModal(false)
            setSelectedOrder(null)
          }}
          onAssign={handleDeliveryAssignment}
        />
      )}

      {showStatusModal && selectedOrder && (
        <StatusUpdateModal
          order={selectedOrder}
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false)
            setSelectedOrder(null)
          }}
          onUpdate={handleStatusUpdate}
        />
      )}
    </div>
  )
}

export default OrdersPage
