import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { 
  X, 
  Truck, 
  Package, 
  MapPin, 
  User, 
  Phone, 
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const DeliveryAssignmentModal = ({ isOpen, onClose, order, onAssign }) => {
  const { resolvedTheme } = useTheme()
  const [trackingNumber, setTrackingNumber] = useState('')
  const [deliveryPartner, setDeliveryPartner] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !order) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!trackingNumber.trim()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onAssign(order.id, trackingNumber, deliveryNotes)
      // Reset form
      setTrackingNumber('')
      setDeliveryPartner('')
      setEstimatedDelivery('')
      setDeliveryNotes('')
    } catch (error) {
      console.error('Failed to assign delivery:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const deliveryPartners = [
    'Emirates Post',
    'Aramex',
    'DHL Express',
    'FedEx',
    'UPS',
    'Talabat',
    'Careem',
    'Other'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Truck className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Assign Delivery</h2>
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
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium text-foreground">{order.customer.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium text-foreground">{order.customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-medium text-foreground">{order.planName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-muted-foreground">SIM Type:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  order.simType === 'eSIM'
                    ? resolvedTheme === 'dark' ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
                    : resolvedTheme === 'dark' ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600'
                }`}>
                  {order.simType}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="text-muted-foreground">Delivery Address:</span>
                <p className="font-medium text-foreground">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>

          {/* Delivery Assignment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tracking Number */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tracking Number *
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            {/* Delivery Partner */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Delivery Partner
              </label>
              <select
                value={deliveryPartner}
                onChange={(e) => setDeliveryPartner(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select delivery partner</option>
                {deliveryPartners.map(partner => (
                  <option key={partner} value={partner}>{partner}</option>
                ))}
              </select>
            </div>

            {/* Estimated Delivery Date */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Estimated Delivery Date
              </label>
              <input
                type="date"
                value={estimatedDelivery}
                onChange={(e) => setEstimatedDelivery(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Delivery Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Delivery Notes
              </label>
              <textarea
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Add any special delivery instructions..."
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              />
            </div>

            {/* Special Instructions for eSIM */}
            {order.simType === 'eSIM' && (
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-700 dark:text-blue-400">eSIM Delivery Note</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                      For eSIM orders, the activation code and QR code will be sent via email. 
                      No physical delivery is required unless specifically requested by the customer.
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
            disabled={!trackingNumber.trim() || isSubmitting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              !trackingNumber.trim() || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Assigning...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Assign Delivery</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeliveryAssignmentModal
