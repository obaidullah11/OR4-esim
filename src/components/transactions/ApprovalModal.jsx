import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { 
  X, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  User, 
  Calendar,
  CreditCard,
  FileText,
  Building
} from 'lucide-react'

const ApprovalModal = ({ isOpen, onClose, transaction, onApprove, onReject }) => {
  const { resolvedTheme } = useTheme()
  const [action, setAction] = useState('')
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !transaction) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!action) return

    if (action === 'approve' && !notes.trim()) return
    if (action === 'reject' && !rejectionReason.trim()) return

    setIsSubmitting(true)
    
    try {
      if (action === 'approve') {
        await onApprove(transaction.id, notes)
      } else {
        await onReject(transaction.id, rejectionReason)
      }
    } catch (error) {
      console.error('Failed to process approval:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const rejectionReasons = [
    'Insufficient documentation',
    'Invalid payment method',
    'Suspicious activity detected',
    'Amount exceeds limits',
    'Customer verification failed',
    'Duplicate transaction',
    'Policy violation',
    'Technical error',
    'Other'
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
              <AlertCircle className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Transaction Approval</h2>
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
            <h3 className="font-semibold text-foreground mb-3">Transaction Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium text-foreground">{transaction.customer.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Amount:</span>
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
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium text-foreground">{transaction.customer.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Gateway:</span>
                <span className="font-medium text-foreground">{transaction.paymentGateway}</span>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-muted-foreground">Description:</span>
              <p className="font-medium text-foreground">{transaction.description}</p>
            </div>
            
            {/* Gateway Response */}
            {transaction.gatewayResponse && Object.keys(transaction.gatewayResponse).length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-foreground mb-2">Gateway Information</h4>
                <div className="bg-background rounded-lg p-3 space-y-1">
                  {Object.entries(transaction.gatewayResponse).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                      </span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Selection */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Select Action *
              </label>
              <div className="space-y-3">
                <label className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  action === 'approve'
                    ? resolvedTheme === 'dark'
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-green-500 bg-green-50'
                    : resolvedTheme === 'dark'
                      ? 'border-slate-600 hover:border-slate-500'
                      : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="action"
                    value="approve"
                    checked={action === 'approve'}
                    onChange={(e) => setAction(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${
                    action === 'approve'
                      ? 'bg-green-500 text-white'
                      : resolvedTheme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Approve Transaction</p>
                    <p className="text-sm text-muted-foreground">
                      Approve this transaction and process the payment
                    </p>
                  </div>
                </label>

                <label className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  action === 'reject'
                    ? resolvedTheme === 'dark'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-red-500 bg-red-50'
                    : resolvedTheme === 'dark'
                      ? 'border-slate-600 hover:border-slate-500'
                      : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="action"
                    value="reject"
                    checked={action === 'reject'}
                    onChange={(e) => setAction(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`p-2 rounded-lg ${
                    action === 'reject'
                      ? 'bg-red-500 text-white'
                      : resolvedTheme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Reject Transaction</p>
                    <p className="text-sm text-muted-foreground">
                      Reject this transaction and mark it as failed
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Approval Notes */}
            {action === 'approve' && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Approval Notes *
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this approval..."
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  required
                />
              </div>
            )}

            {/* Rejection Reason */}
            {action === 'reject' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rejection Reason *
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select a reason</option>
                    {rejectionReasons.map(reason => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Reason */}
                {rejectionReason === 'Other' && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Custom Reason *
                    </label>
                    <textarea
                      value={rejectionReason === 'Other' ? '' : rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please specify the reason for rejection..."
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {/* Warning for rejection */}
            {action === 'reject' && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-700 dark:text-red-400">Rejection Warning</h4>
                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                      Rejecting this transaction will mark it as failed and the customer will be notified. 
                      This action cannot be undone.
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
            disabled={!action || (action === 'approve' && !notes.trim()) || (action === 'reject' && !rejectionReason.trim()) || isSubmitting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              !action || (action === 'approve' && !notes.trim()) || (action === 'reject' && !rejectionReason.trim()) || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : action === 'approve'
                  ? 'bg-green-500 hover:bg-green-600 text-white'
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
                {action === 'approve' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>{action === 'approve' ? 'Approve Transaction' : 'Reject Transaction'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApprovalModal
