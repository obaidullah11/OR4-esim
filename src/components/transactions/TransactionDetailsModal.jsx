import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { 
  X, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Receipt,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Building,
  Smartphone,
  FileText,
  Activity
} from 'lucide-react'

const TransactionDetailsModal = ({ isOpen, onClose, transaction, onDownloadInvoice }) => {
  const { resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('details')

  if (!isOpen || !transaction) return null

  const getStatusDisplay = (status) => {
    const statusConfig = {
      completed: { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle, label: 'Completed' },
      pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock, label: 'Pending' },
      pending_approval: { color: 'text-orange-500', bg: 'bg-orange-500/10', icon: AlertCircle, label: 'Pending Approval' },
      failed: { color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle, label: 'Failed' },
      refunded: { color: 'text-purple-500', bg: 'bg-purple-500/10', icon: ArrowUpRight, label: 'Refunded' }
    }
    return statusConfig[status] || statusConfig.pending
  }

  const getTypeDisplay = (type) => {
    const typeConfig = {
      payment: { icon: ArrowDownLeft, color: 'text-green-500', label: 'Payment' },
      refund: { icon: ArrowUpRight, color: 'text-red-500', label: 'Refund' },
      credit_adjustment: { icon: Wallet, color: 'text-blue-500', label: 'Credit Adjustment' }
    }
    return typeConfig[type] || typeConfig.payment
  }

  const statusDisplay = getStatusDisplay(transaction.status)
  const typeDisplay = getTypeDisplay(transaction.type)
  const StatusIcon = statusDisplay.icon
  const TypeIcon = typeDisplay.icon

  const tabs = [
    { id: 'details', label: 'Transaction Details', icon: CreditCard },
    { id: 'customer', label: 'Customer Info', icon: User },
    { id: 'gateway', label: 'Gateway Response', icon: Activity }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{transaction.transactionId}</h2>
              <p className="text-sm text-muted-foreground">{transaction.customer.name}</p>
            </div>
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusDisplay.bg}`}>
              <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
              <span className={`text-sm font-medium ${statusDisplay.color}`}>
                {statusDisplay.label}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {transaction.invoiceNumber && (
              <button
                onClick={() => onDownloadInvoice(transaction)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Invoice</span>
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
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Transaction Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Transaction Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <span className="font-medium text-foreground">{transaction.transactionId}</span>
                    </div>
                    {transaction.orderId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-medium text-foreground">{transaction.orderId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <div className={`inline-flex items-center space-x-2 px-2 py-1 rounded-full text-sm ${
                        transaction.type === 'payment'
                          ? resolvedTheme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                          : transaction.type === 'refund'
                            ? resolvedTheme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
                            : resolvedTheme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <TypeIcon className="h-3 w-3" />
                        <span>{typeDisplay.label}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source:</span>
                      <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                        transaction.source === 'app_user'
                          ? resolvedTheme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                          : resolvedTheme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                      }`}>
                        {transaction.source === 'app_user' ? <Smartphone className="h-3 w-3" /> : <Building className="h-3 w-3" />}
                        <span>{transaction.customer.type}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium text-foreground">{transaction.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gateway:</span>
                      <span className="font-medium text-foreground">{transaction.paymentGateway}</span>
                    </div>
                    {transaction.invoiceNumber && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Invoice:</span>
                        <span className="font-medium text-foreground">{transaction.invoiceNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Amount Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className={`font-medium ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Fees:</span>
                      <span className="font-medium text-foreground">${Math.abs(transaction.fees).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-semibold text-foreground">Net Amount:</span>
                      <span className="font-bold text-foreground">${transaction.netAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-medium text-foreground">Timestamps</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="text-foreground">
                          {new Date(transaction.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {transaction.processedAt && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Processed:</span>
                          <span className="text-foreground">
                            {new Date(transaction.processedAt).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Description</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-foreground">{transaction.description}</p>
                </div>
              </div>
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
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium text-foreground">{transaction.customer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium text-foreground">{transaction.customer.email}</p>
                      </div>
                    </div>
                    {transaction.customer.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">{transaction.customer.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Type</p>
                        <p className="font-medium text-foreground">{transaction.customer.type}</p>
                      </div>
                    </div>
                    {transaction.customer.reseller && (
                      <div className="flex items-center space-x-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Reseller</p>
                          <p className="font-medium text-foreground">{transaction.customer.reseller}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction Date</p>
                        <p className="font-medium text-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gateway' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Gateway Response</h3>
              <div className="space-y-4">
                {transaction.gatewayResponse && Object.keys(transaction.gatewayResponse).length > 0 ? (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="space-y-3">
                      {Object.entries(transaction.gatewayResponse).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <span className="font-medium text-foreground">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className={`mx-auto h-12 w-12 ${resolvedTheme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
                    <h3 className="mt-2 text-sm font-medium text-foreground">No gateway response</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Gateway response data is not available for this transaction
                    </p>
                  </div>
                )}

                {/* Additional Information */}
                {(transaction.approvalNotes || transaction.rejectionReason) && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Additional Information</h4>
                    {transaction.approvalNotes && (
                      <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-lg">
                        <h5 className="font-medium text-green-700 dark:text-green-400">Approval Notes</h5>
                        <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                          {transaction.approvalNotes}
                        </p>
                      </div>
                    )}
                    {transaction.rejectionReason && (
                      <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-lg">
                        <h5 className="font-medium text-red-700 dark:text-red-400">Rejection Reason</h5>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                          {transaction.rejectionReason}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="flex items-center space-x-3">
            {transaction.invoiceNumber && (
              <button
                onClick={() => onDownloadInvoice(transaction)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  resolvedTheme === 'dark'
                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                <Receipt className="h-4 w-4" />
                <span>Download Receipt</span>
              </button>
            )}
          </div>
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
  )
}

export default TransactionDetailsModal
