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
  ShoppingCart, 
  CreditCard, 
  Package,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  UserX,
  UserCheck,
  Ban,
  Shield,
  MessageSquare,
  History
} from 'lucide-react'

const UserDetailsModal = ({ isOpen, onClose, user, onBlockUser, onSuspendUser }) => {
  const { resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')

  if (!isOpen || !user) return null

  // Sample order history data
  const orderHistory = [
    { id: 1, package: 'Premium 30GB', amount: 150, date: '2024-03-15', status: 'completed' },
    { id: 2, package: 'Standard 15GB', amount: 90, date: '2024-02-20', status: 'completed' },
    { id: 3, package: 'Basic 5GB', amount: 45, date: '2024-01-25', status: 'completed' },
    { id: 4, package: 'Premium 30GB', amount: 150, date: '2024-01-10', status: 'refunded' },
    { id: 5, package: 'Standard 15GB', amount: 90, date: '2023-12-15', status: 'completed' }
  ]

  // Sample support tickets data
  const supportTickets = [
    { id: 1, subject: 'SIM not working', status: 'resolved', date: '2024-03-10', priority: 'high' },
    { id: 2, subject: 'Data speed issue', status: 'open', date: '2024-03-08', priority: 'medium' },
    { id: 3, subject: 'Billing inquiry', status: 'resolved', date: '2024-02-25', priority: 'low' }
  ]

  // Sample payment history
  const paymentHistory = [
    { id: 1, amount: 150, method: 'Credit Card', date: '2024-03-15', status: 'completed' },
    { id: 2, amount: 90, method: 'Digital Wallet', date: '2024-02-20', status: 'completed' },
    { id: 3, amount: 45, method: 'Bank Transfer', date: '2024-01-25', status: 'completed' },
    { id: 4, amount: 150, method: 'Credit Card', date: '2024-01-10', status: 'refunded' }
  ]

  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: { color: 'text-green-500', bg: 'bg-green-500/10', icon: UserCheck, label: 'Active' },
      blocked: { color: 'text-red-500', bg: 'bg-red-500/10', icon: UserX, label: 'Blocked' },
      suspended: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertCircle, label: 'Suspended' }
    }
    return statusConfig[status] || statusConfig.active
  }

  const getOrderStatusColor = (status) => {
    const colors = {
      completed: 'text-green-500',
      refunded: 'text-red-500',
      pending: 'text-yellow-500',
      cancelled: 'text-gray-500'
    }
    return colors[status] || colors.pending
  }

  const getTicketStatusColor = (status) => {
    const colors = {
      open: 'text-yellow-500',
      resolved: 'text-green-500',
      closed: 'text-gray-500'
    }
    return colors[status] || colors.open
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-500',
      medium: 'text-yellow-500',
      low: 'text-green-500'
    }
    return colors[priority] || colors.medium
  }

  const statusDisplay = getStatusDisplay(user.status)
  const StatusIcon = statusDisplay.icon

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'support', label: 'Support', icon: MessageSquare }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
              resolvedTheme === 'dark' ? 'bg-slate-600' : 'bg-gray-400'
            }`}>
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            </div>
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusDisplay.bg}`}>
              <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
              <span className={`text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.label}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {user.status === 'active' ? (
              <>
                <button
                  onClick={() => onSuspendUser(user.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>Suspend</span>
                </button>
                <button
                  onClick={() => onBlockUser(user.id)}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Ban className="h-4 w-4" />
                  <span>Block</span>
                </button>
              </>
            ) : user.status === 'blocked' ? (
              <button
                onClick={() => onBlockUser(user.id)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Shield className="h-4 w-4" />
                <span>Unblock</span>
              </button>
            ) : (
              <button
                onClick={() => onSuspendUser(user.id)}
                className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <UserCheck className="h-4 w-4" />
                <span>Activate</span>
              </button>
            )}
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
                  {tab.id === 'support' && user.supportTickets > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {user.supportTickets}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* User Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium text-foreground">{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium text-foreground">{user.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Address</p>
                        <p className="font-medium text-foreground">{user.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Join Date</p>
                        <p className="font-medium text-foreground">{new Date(user.joinDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Account Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{user.totalOrders}</p>
                          <p className="text-sm text-muted-foreground">Total Orders</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">${user.totalSpent}</p>
                          <p className="text-sm text-muted-foreground">Total Spent</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.currentPackage}</p>
                          <p className="text-sm text-muted-foreground">Current Package</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-5 w-5 text-orange-500" />
                        <div>
                          <p className="text-2xl font-bold text-foreground">{user.supportTickets}</p>
                          <p className="text-sm text-muted-foreground">Support Tickets</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Order History</h3>
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                        <Package className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{order.package}</p>
                        <p className="text-sm text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${order.amount}</p>
                      <p className={`text-sm capitalize ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Payment History</h3>
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
                        <CreditCard className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{payment.method}</p>
                        <p className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">${payment.amount}</p>
                      <p className={`text-sm capitalize ${getOrderStatusColor(payment.status)}`}>
                        {payment.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Support Tickets</h3>
              <div className="space-y-3">
                {supportTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
                          <MessageSquare className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground">#{ticket.id} • {new Date(ticket.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(ticket.priority)} ${
                          resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTicketStatusColor(ticket.status)} ${
                          resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal
