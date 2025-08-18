import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { 
  X, 
  Edit, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  Activity, 
  XCircle,
  AlertCircle,
  Bell
} from 'lucide-react'

const StatusUpdateModal = ({ isOpen, onClose, order, onUpdate }) => {
  const { resolvedTheme } = useTheme()
  const [newStatus, setNewStatus] = useState(order?.status || '')
  const [trackingNumber, setTrackingNumber] = useState(order?.deliveryTrackingNumber || '')
  const [updateNotes, setUpdateNotes] = useState('')
  const [sendNotification, setSendNotification] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !order) return null

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-500', description: 'Order is waiting for confirmation' },
    { value: 'confirmed', label: 'Confirmed', icon: CheckCircle, color: 'text-blue-500', description: 'Order has been confirmed and is being processed' },
    { value: 'dispatched', label: 'Dispatched', icon: Truck, color: 'text-purple-500', description: 'Order has been dispatched for delivery' },
    { value: 'delivered', label: 'Delivered', icon: Package, color: 'text-green-500', description: 'Order has been delivered to customer' },
    { value: 'activated', label: 'Activated', icon: Activity, color: 'text-emerald-500', description: 'SIM has been activated and is ready to use' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-500', description: 'Order has been cancelled' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newStatus) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onUpdate(order.id, newStatus, trackingNumber)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (status) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return statusOption ? statusOption.icon : Clock
  }

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status)
    return statusOption ? statusOption.color : 'text-yellow-500'
  }

  const getCurrentStatusInfo = () => {
    return statusOptions.find(option => option.value === order.status)
  }

  const getNewStatusInfo = () => {
    return statusOptions.find(option => option.value === newStatus)
  }

  const currentStatusInfo = getCurrentStatusInfo()
  const newStatusInfo = getNewStatusInfo()
  const CurrentStatusIcon = currentStatusInfo?.icon || Clock
  const NewStatusIcon = newStatusInfo?.icon || Clock

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Edit className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Update Order Status</h2>
              <p className="text-sm text-muted-foreground">Order: {order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Current Status */}
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">Current Status</h3>
            <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
              <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-slate-700' : 'bg-white'}`}>
                <CurrentStatusIcon className={`h-5 w-5 ${currentStatusInfo?.color || 'text-yellow-500'}`} />
              </div>
              <div>
                <p className="font-medium text-foreground">{currentStatusInfo?.label}</p>
                <p className="text-sm text-muted-foreground">{currentStatusInfo?.description}</p>
              </div>
            </div>
          </div>

          {/* Status Update Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Status Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Select New Status
              </label>
              <div className="space-y-2">
                {statusOptions.map((option) => {
                  const OptionIcon = option.icon
                  return (
                    <label
                      key={option.value}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        newStatus === option.value
                          ? resolvedTheme === 'dark'
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-blue-500 bg-blue-50'
                          : resolvedTheme === 'dark'
                            ? 'border-slate-600 hover:border-slate-500'
                            : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={newStatus === option.value}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="sr-only"
                      />
                      <div className={`p-2 rounded-lg ${
                        newStatus === option.value
                          ? resolvedTheme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                          : resolvedTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                      }`}>
                        <OptionIcon className={`h-4 w-4 ${option.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{option.label}</p>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>

            {/* Tracking Number (for dispatched status) */}
            {(newStatus === 'dispatched' || newStatus === 'delivered') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tracking Number {newStatus === 'dispatched' && '*'}
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required={newStatus === 'dispatched'}
                />
              </div>
            )}

            {/* Update Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Update Notes
              </label>
              <textarea
                value={updateNotes}
                onChange={(e) => setUpdateNotes(e.target.value)}
                placeholder="Add any notes about this status update..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Send Notification */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="sendNotification"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="sendNotification" className="flex items-center space-x-2 text-sm text-foreground">
                <Bell className="h-4 w-4" />
                <span>Send notification to customer</span>
              </label>
            </div>

            {/* Status Change Preview */}
            {newStatus && newStatus !== order.status && (
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-400">Status Change Preview</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      Order status will change from <strong>{currentStatusInfo?.label}</strong> to <strong>{newStatusInfo?.label}</strong>
                      {sendNotification && ' and the customer will be notified via email and SMS.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!newStatus || newStatus === order.status || isSubmitting || (newStatus === 'dispatched' && !trackingNumber.trim())}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              !newStatus || newStatus === order.status || isSubmitting || (newStatus === 'dispatched' && !trackingNumber.trim())
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Update Status</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default StatusUpdateModal
