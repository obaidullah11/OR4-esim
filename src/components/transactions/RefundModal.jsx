import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { 
  X, 
  RotateCcw, 
  DollarSign, 
  AlertCircle, 
  CheckCircle,
  CreditCard,
  User,
  Calendar
} from 'lucide-react'

const RefundModal = ({ isOpen, onClose, transaction, onProcessRefund }) => {
  const { resolvedTheme } = useTheme()
  const [refundAmount, setRefundAmount] = useState(transaction?.amount || 0)
  const [refundReason, setRefundReason] = useState('')
  const [refundType, setRefundType] = useState('full')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !transaction) return null

  const maxRefundAmount = transaction.amount
  const processingFee = transaction.fees || 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!refundReason.trim()) {
      return
    }

    if (refundAmount <= 0 || refundAmount > maxRefundAmount) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await onProcessRefund(transaction.id, refundAmount, refundReason)
    } catch (error) {
      console.error('Failed to process refund:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRefundTypeChange = (type) => {
    setRefundType(type)
    if (type === 'full') {
      setRefundAmount(maxRefundAmount)
    } else if (type === 'partial') {
      setRefundAmount(Math.round(maxRefundAmount * 0.5 * 100) / 100)
    }
  }

  const refundReasons = [
    'Customer requested cancellation',
    'Service not delivered',
    'Technical issues',
    'Billing error',
    'Duplicate payment',
    'Product defect',
    'Customer dissatisfaction',
    'Other'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <RotateCcw className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Process Refund</h2>
              <p className="text-sm text-muted-foreground">Transaction: {transaction.transactionId}</p>
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
          {/* Transaction Summary */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">Transaction Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium text-foreground">{transaction.customer.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Original Amount:</span>
                <span className="font-medium text-foreground">${transaction.amount.toFixed(2)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium text-foreground">{transaction.paymentMethod}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-muted-foreground">Description:</span>
              <p className="font-medium text-foreground">{transaction.description}</p>
            </div>
          </div>

          {/* Refund Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Refund Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Refund Type
              </label>
              <div className="space-y-2">
                <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  refundType === 'full'
                    ? resolvedTheme === 'dark'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-blue-500 bg-blue-50'
                    : resolvedTheme === 'dark'
                      ? 'border-slate-600 hover:border-slate-500'
                      : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="refundType"
                    value="full"
                    checked={refundType === 'full'}
                    onChange={(e) => handleRefundTypeChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    refundType === 'full' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {refundType === 'full' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Full Refund</p>
                    <p className="text-sm text-muted-foreground">
                      Refund the complete amount of ${maxRefundAmount.toFixed(2)}
                    </p>
                  </div>
                </label>

                <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  refundType === 'partial'
                    ? resolvedTheme === 'dark'
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-blue-500 bg-blue-50'
                    : resolvedTheme === 'dark'
                      ? 'border-slate-600 hover:border-slate-500'
                      : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="refundType"
                    value="partial"
                    checked={refundType === 'partial'}
                    onChange={(e) => handleRefundTypeChange(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    refundType === 'partial' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                  }`}>
                    {refundType === 'partial' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Partial Refund</p>
                    <p className="text-sm text-muted-foreground">
                      Refund a custom amount (up to ${maxRefundAmount.toFixed(2)})
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Refund Amount */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Refund Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                  min="0.01"
                  max={maxRefundAmount}
                  step="0.01"
                  disabled={refundType === 'full'}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum refundable amount: ${maxRefundAmount.toFixed(2)}
              </p>
            </div>

            {/* Refund Reason */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Refund Reason *
              </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="">Select a reason</option>
                {refundReasons.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {/* Custom Reason */}
            {refundReason === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Custom Reason *
                </label>
                <textarea
                  value={refundReason === 'Other' ? '' : refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder="Please specify the reason for refund..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
              </div>
            )}

            {/* Processing Fee Notice */}
            {processingFee > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-700 dark:text-yellow-400">Processing Fee Notice</h4>
                    <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                      Original processing fee of ${processingFee.toFixed(2)} will also be refunded. 
                      The customer will receive the full refund amount.
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
            disabled={!refundReason.trim() || refundAmount <= 0 || refundAmount > maxRefundAmount || isSubmitting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              !refundReason.trim() || refundAmount <= 0 || refundAmount > maxRefundAmount || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Process Refund (${refundAmount.toFixed(2)})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RefundModal
