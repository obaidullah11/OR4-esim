import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Package,
  CreditCard,
  Truck,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Smartphone,
  UserCheck,
  Bell,
  FileText,
  Send
} from 'lucide-react'

const OrderDetailsModal = ({ isOpen, onClose, order, onStatusUpdate, onSendNotification }) => {
  const { resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('details')

  if (!isOpen || !order) return null

  const getStatusDisplay = (status) => {
    const statusConfig = {
      pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock, label: 'Pending' },
      confirmed: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: CheckCircle, label: 'Confirmed' },
      dispatched: { color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Truck, label: 'Dispatched' },
      delivered: { color: 'text-green-500', bg: 'bg-green-500/10', icon: Package, label: 'Delivered' },
      activated: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: Activity, label: 'Activated' },
      cancelled: { color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle, label: 'Cancelled' }
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

  const statusDisplay = getStatusDisplay(order.status)
  const paymentDisplay = getPaymentStatusDisplay(order.paymentStatus)
  const StatusIcon = statusDisplay.icon

  const tabs = [
    { id: 'details', label: 'Order Details', icon: Package },
    { id: 'customer', label: 'Customer Info', icon: User },
    { id: 'timeline', label: 'Timeline', icon: Activity }
  ]

  const timeline = [
    { 
      status: 'Order Placed', 
      date: order.createdAt, 
      completed: true,
      description: 'Order was successfully placed'
    },
    { 
      status: 'Payment Confirmed', 
      date: order.paymentStatus === 'paid' ? order.createdAt : null, 
      completed: order.paymentStatus === 'paid',
      description: 'Payment has been processed'
    },
    { 
      status: 'Order Confirmed', 
      date: ['confirmed', 'dispatched', 'delivered', 'activated'].includes(order.status) ? order.updatedAt : null, 
      completed: ['confirmed', 'dispatched', 'delivered', 'activated'].includes(order.status),
      description: 'Order confirmed and ready for processing'
    },
    { 
      status: 'Dispatched', 
      date: ['dispatched', 'delivered', 'activated'].includes(order.status) ? order.updatedAt : null, 
      completed: ['dispatched', 'delivered', 'activated'].includes(order.status),
      description: 'Order has been dispatched for delivery'
    },
    { 
      status: 'Delivered', 
      date: order.deliveredAt, 
      completed: order.deliveredAt !== null,
      description: 'Order has been delivered to customer'
    },
    { 
      status: 'Activated', 
      date: order.activatedAt, 
      completed: order.activatedAt !== null,
      description: 'SIM has been activated and is ready to use'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Package className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{order.orderNumber}</h2>
              <p className="text-sm text-muted-foreground">{order.customer.name}</p>
            </div>
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusDisplay.bg}`}>
              <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
              <span className={`text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.label}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSendNotification(order, 'Status Update')}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span>Notify</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const TabIcon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Order Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Number:</span>
                      <span className="font-medium text-foreground">{order.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Type:</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                        order.orderType === 'app_user'
                          ? resolvedTheme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                          : resolvedTheme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                      }`}>
                        {order.orderType === 'app_user' ? <Smartphone className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                        <span>{order.customer.type}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SIM Type:</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.simType === 'eSIM'
                          ? resolvedTheme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
                          : resolvedTheme === 'dark' ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {order.simType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Network:</span>
                      <span className="font-medium text-foreground">{order.networkProvider}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan:</span>
                      <span className="font-medium text-foreground">{order.planName}</span>
                    </div>
                    {order.deliveryTrackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tracking:</span>
                        <span className="font-medium text-foreground">{order.deliveryTrackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Payment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Plan Price:</span>
                      <span className="font-medium text-foreground">${order.planPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delivery Fee:</span>
                      <span className="font-medium text-foreground">${order.deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax:</span>
                      <span className="font-medium text-foreground">${order.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-semibold text-foreground">Total Amount:</span>
                      <span className="font-bold text-foreground">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status:</span>
                      <span className={`font-medium ${paymentDisplay.color}`}>
                        {paymentDisplay.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Delivery Information</h3>
                <div className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Delivery Address</p>
                    <p className="text-muted-foreground">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Notes</h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-foreground">{order.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customer' && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium text-foreground">{order.customer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{order.customer.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">{order.customer.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Type</p>
                        <p className="font-medium text-foreground">{order.customer.type}</p>
                      </div>
                    </div>
                    {order.customer.reseller && (
                      <div className="flex items-center space-x-3">
                        <UserCheck className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Reseller</p>
                          <p className="font-medium text-foreground">{order.customer.reseller}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Order Date</p>
                        <p className="font-medium text-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Order Timeline</h3>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      item.completed
                        ? 'bg-green-500 text-white'
                        : resolvedTheme === 'dark'
                          ? 'bg-slate-600 text-slate-400'
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      {item.completed ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-medium ${item.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.status}
                        </p>
                        {item.date && (
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onSendNotification(order, 'Order Confirmation')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                resolvedTheme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>Send Confirmation</span>
            </button>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                resolvedTheme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Generate Invoice</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors ${
                resolvedTheme === 'dark'
                  ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetailsModal
