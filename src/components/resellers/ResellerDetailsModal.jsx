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
  Users, 
  CreditCard, 
  Smartphone,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  UserX,
  UserCheck
} from 'lucide-react'
import Tooltip from '../common/Tooltip'

const ResellerDetailsModal = ({ isOpen, onClose, reseller, onEdit, onSuspend, onActivate }) => {
  const { resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')

  if (!isOpen || !reseller) return null

  // Sample activity data
  const recentActivities = [
    { id: 1, type: 'order', description: 'New SIM order placed', amount: '$250', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'payment', description: 'Payment received', amount: '$1,500', time: '1 day ago', status: 'completed' },
    { id: 3, type: 'client', description: 'New client registered', amount: null, time: '2 days ago', status: 'completed' },
    { id: 4, type: 'order', description: 'SIM order cancelled', amount: '$180', time: '3 days ago', status: 'cancelled' },
    { id: 5, type: 'payment', description: 'Payment pending', amount: '$750', time: '5 days ago', status: 'pending' }
  ]

  // Sample revenue data (last 6 months)
  const revenueData = [
    { month: 'Jan', revenue: 8500 },
    { month: 'Feb', revenue: 9200 },
    { month: 'Mar', revenue: 7800 },
    { month: 'Apr', revenue: 10500 },
    { month: 'May', revenue: 11200 },
    { month: 'Jun', revenue: 12800 }
  ]

  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: { color: 'text-green-500', bg: 'bg-green-500/10', icon: UserCheck, label: 'Active' },
      suspended: { color: 'text-red-500', bg: 'bg-red-500/10', icon: UserX, label: 'Suspended' },
      pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: AlertCircle, label: 'Pending' }
    }
    return statusConfig[status] || statusConfig.pending
  }

  const getActivityIcon = (type) => {
    const icons = {
      order: Smartphone,
      payment: DollarSign,
      client: Users,
      default: Activity
    }
    return icons[type] || icons.default
  }

  const getActivityColor = (type, status) => {
    if (status === 'cancelled') return 'text-red-500'
    if (status === 'pending') return 'text-yellow-500'
    
    const colors = {
      order: 'text-blue-500',
      payment: 'text-green-500',
      client: 'text-purple-500',
      default: 'text-gray-500'
    }
    return colors[type] || colors.default
  }

  const statusDisplay = getStatusDisplay(reseller.status)
  const StatusIcon = statusDisplay.icon
  const simUsagePercent = Math.round((reseller.simUsed / reseller.simLimit) * 100)
  const creditUsagePercent = Math.round((reseller.creditUsed / reseller.creditLimit) * 100)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'activity', label: 'Activity', icon: Activity }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{reseller.name}</h2>
              <p className="text-sm text-muted-foreground">{reseller.email}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Tooltip 
                content={reseller.status === 'suspended' && reseller.suspensionReason ? `Suspension Reason: ${reseller.suspensionReason}` : null}
                position="top"
              >
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusDisplay.bg} ${reseller.status === 'suspended' && reseller.suspensionReason ? 'cursor-help' : ''}`}>
                  <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
                  <span className={`text-sm font-medium ${statusDisplay.color}`}>
                    {statusDisplay.label}
                  </span>
                </div>
              </Tooltip>
              {reseller.status === 'suspended' && reseller.suspensionReason && (
                <div className="text-xs text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">
                  Reason: {reseller.suspensionReason}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(reseller)}
              className="flex items-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </button>
            {reseller.status === 'active' ? (
              <button
                onClick={() => onSuspend(reseller)}
                className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <UserX className="h-4 w-4" />
                <span>Suspend</span>
              </button>
            ) : (
              <button
                onClick={() => onActivate(reseller)}
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
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{reseller.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{reseller.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{reseller.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">Joined {reseller.joinDate}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Account Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-foreground">Revenue</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">${reseller.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-foreground">Clients</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{reseller.clients}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Usage & Limits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-foreground">SIM Usage</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {reseller.simUsed} / {reseller.simLimit}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full ${
                          simUsagePercent >= 90 ? 'bg-red-500' :
                          simUsagePercent >= 75 ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${simUsagePercent}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{simUsagePercent}% used</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-foreground">Credit Usage</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ${reseller.creditUsed.toLocaleString()} / ${reseller.creditLimit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full ${
                          creditUsagePercent >= 90 ? 'bg-red-500' :
                          creditUsagePercent >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${creditUsagePercent}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{creditUsagePercent}% used</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Revenue Analytics</h3>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {revenueData.map((data, index) => (
                    <div key={data.month} className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">{data.month}</p>
                      <div className="bg-primary/20 rounded-lg p-3">
                        <p className="font-bold text-foreground">${data.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-foreground">Total Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">${reseller.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-500">+15.3% from last month</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-foreground">Avg Monthly</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    ${Math.round(revenueData.reduce((sum, d) => sum + d.revenue, 0) / revenueData.length).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Last 6 months</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-foreground">Best Month</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    ${Math.max(...revenueData.map(d => d.revenue)).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">June 2024</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  const activityColor = getActivityColor(activity.type, activity.status)
                  
                  return (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                      <div className={`p-2 rounded-full bg-background`}>
                        <ActivityIcon className={`h-4 w-4 ${activityColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="font-medium text-foreground">{activity.amount}</p>
                          <p className={`text-xs capitalize ${
                            activity.status === 'completed' ? 'text-green-500' :
                            activity.status === 'pending' ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {activity.status}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResellerDetailsModal
