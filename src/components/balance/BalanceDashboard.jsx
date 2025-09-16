import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  History,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Banknote,
  Wallet,
  MessageCircle,
  Building2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { balanceService } from '../../services/balanceService'

function BalanceDashboard({ isOpen, onClose }) {
  const { resolvedTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [balanceData, setBalanceData] = useState(null)
  const [activeTab, setActiveTab] = useState('overview') // 'overview' or 'topup'

  // Fetch balance data
  const fetchBalanceData = async () => {
    setLoading(true)
    try {
      const response = await balanceService.getBalanceHistory()
      if (response.success) {
        setBalanceData(response.data)
      } else {
        toast.error(response.error || 'Failed to load balance data')
      }
    } catch (error) {
      console.error('Balance fetch error:', error)
      toast.error('Failed to load balance data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchBalanceData()
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
      
      // Handle escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.body.style.overflow = 'unset'
      }
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup':
      case 'Balance Top-up':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'debit':
      case 'Balance Debit (Usage)':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'refund':
        return <RefreshCw className="w-4 h-4 text-blue-500" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { icon: CheckCircle, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
      pending: { icon: Clock, color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' },
      failed: { icon: AlertCircle, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' }
    }
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <span className={cn('inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium', config.color)}>
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </span>
    )
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop - positioned below header to preserve header shadow */}
      <div className="fixed top-[72px] left-0 right-0 bottom-0 z-[45] bg-black/20 animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Slide-down Modal positioned below header */}
      <div className="fixed top-[72px] left-0 right-0 z-[50] flex justify-center p-4">
        <div className={cn(
          'bg-card border border-border rounded-xl w-full max-w-6xl h-[calc(75vh-36px)]',
          'shadow-2xl transform transition-all duration-300',
          'animate-in slide-in-from-top-4 fade-in duration-300',
          'overflow-hidden flex flex-col',
          resolvedTheme === 'dark' ? 'shadow-dark-soft-lg' : 'shadow-soft-lg'
        )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Balance</h2>
              <p className="text-xs text-muted-foreground">Account management</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchBalanceData}
              disabled={loading}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-muted/10">
          <button
            onClick={() => setActiveTab('overview')}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('topup')}
            className={cn(
              'flex-1 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === 'topup'
                ? 'text-primary border-b-2 border-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            Top-up
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading balance data...</span>
              </div>
            </div>
          ) : balanceData ? (
            <div className="space-y-6">
              {/* Balance Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Current Balance</p>
                      <p className="text-2xl font-bold">{formatCurrency(balanceData.current_balance)}</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-100" />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Credit Limit</p>
                      <p className="text-xl font-semibold text-foreground">{formatCurrency(balanceData.credit_limit)}</p>
                    </div>
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Top-ups</p>
                      <p className="text-xl font-semibold text-foreground">{formatCurrency(balanceData.total_topups)}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">Total Spent</p>
                      <p className="text-xl font-semibold text-foreground">{formatCurrency(balanceData.total_spent)}</p>
                    </div>
                    <TrendingDown className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('topup')}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Top-up Balance</span>
                </button>
                <button
                  onClick={fetchBalanceData}
                  className="flex items-center space-x-2 px-4 py-2 border border-border text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Recent Transactions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Recent Transactions</span>
                </h3>

                {balanceData.recent_transactions && balanceData.recent_transactions.length > 0 ? (
                  <div className="space-y-3">
                    {balanceData.recent_transactions.map((transaction, index) => (
                      <div key={transaction.id || index} className="bg-card border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getTransactionIcon(transaction.transaction_type)}
                            <div>
                              <p className="font-medium text-foreground">
                                {transaction.transaction_type_display || transaction.transaction_type}
                              </p>
                              <p className="text-sm text-muted-foreground">{transaction.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(transaction.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn(
                              'font-semibold',
                              transaction.transaction_type?.includes('debit') || transaction.transaction_type?.includes('Debit')
                                ? 'text-red-500'
                                : 'text-green-500'
                            )}>
                              {transaction.transaction_type?.includes('debit') || transaction.transaction_type?.includes('Debit') ? '-' : '+'}
                              {formatCurrency(transaction.amount)}
                            </p>
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <History className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                )}
              </div>

              {/* Pending Top-ups */}
              {balanceData.pending_topups && balanceData.pending_topups.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Pending Top-ups</span>
                  </h3>
                  <div className="space-y-3">
                    {balanceData.pending_topups.map((topup, index) => (
                      <div key={topup.id || index} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Banknote className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="font-medium text-foreground">
                                {formatCurrency(topup.requested_amount)} via {topup.topup_method_display}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Requested: {new Date(topup.created_at).toLocaleString()}
                              </p>
                              {topup.payment_reference && (
                                <p className="text-xs text-muted-foreground">
                                  Reference: {topup.payment_reference}
                                </p>
                              )}
                            </div>
                          </div>
                          {getStatusBadge(topup.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">Failed to load balance data</p>
                  <button
                    onClick={fetchBalanceData}
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'topup' && (
            <TopupForm 
              onSuccess={() => {
                setActiveTab('overview')
                fetchBalanceData()
                toast.success('Top-up request submitted successfully!')
              }}
              currentBalance={balanceData?.current_balance || 0}
              creditLimit={balanceData?.credit_limit || 0}
            />
          )}
        </div>
        </div>
      </div>
    </>
  )
}

// TopupForm component for the integrated top-up functionality
function TopupForm({ onSuccess, currentBalance, creditLimit }) {
  const { resolvedTheme } = useTheme()
  const [selectedMethod, setSelectedMethod] = useState('stripe')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentProof, setPaymentProof] = useState(null)
  const [loading, setLoading] = useState(false)

  const topupMethods = [
    {
      id: 'stripe',
      name: 'Stripe Payment',
      description: 'Pay instantly with credit/debit card',
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    },
    {
      id: 'admin_contact',
      name: 'Contact Admin',
      description: 'Request manual top-up from administrator',
      icon: MessageCircle,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Upload proof of bank transfer payment',
      icon: Building2,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  const selectedMethodData = topupMethods.find(method => method.id === selectedMethod)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setLoading(true)
    try {
      let response

      if (selectedMethod === 'stripe') {
        // Handle Stripe payment
        response = await balanceService.createStripeTopupSession({
          amount: parseFloat(amount)
        })
        
        if (response.success && response.data?.checkout_url) {
          window.open(response.data.checkout_url, '_blank')
          onSuccess()
        } else {
          throw new Error(response.error || 'Failed to create checkout session')
        }
      } else {
        // Handle other methods
        const formData = new FormData()
        formData.append('topup_method', selectedMethod)
        formData.append('requested_amount', amount)
        if (notes) formData.append('notes', notes)
        if (paymentProof) formData.append('payment_proof', paymentProof)

        response = await balanceService.createTopupRequest(formData)
        
        if (response.success) {
          onSuccess()
        } else {
          throw new Error(response.error || 'Failed to submit top-up request')
        }
      }
    } catch (error) {
      console.error('Top-up error:', error)
      toast.error(error.message || 'Failed to process top-up request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Top-up Amount (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                required
              />
            </div>
            <div className="flex space-x-2 mt-2">
              {[50, 100, 250, 500].map((presetAmount) => (
                <button
                  key={presetAmount}
                  type="button"
                  onClick={() => setAmount(presetAmount.toString())}
                  className="px-3 py-1 text-xs border border-border rounded-md hover:bg-muted transition-colors"
                >
                  ${presetAmount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Payment Method
          </label>
          <div className="space-y-3">
            {topupMethods.map((method) => {
              const Icon = method.icon
              return (
                <label
                  key={method.id}
                  className={cn(
                    'flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-all',
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  <input
                    type="radio"
                    name="topupMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    className="sr-only"
                  />
                  <div className={cn('p-2 rounded-lg', method.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                    selectedMethod === method.id
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}>
                    {selectedMethod === method.id && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        </div>

        {/* Method-specific fields */}
        {selectedMethod === 'bank_transfer' && (
          <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Payment Proof
              </label>
              <input
                type="file"
                onChange={(e) => setPaymentProof(e.target.files[0])}
                accept="image/*,.pdf"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload bank transfer receipt (Image or PDF)
              </p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes for this transaction"
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !amount}
          className={cn(
            'w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : selectedMethod === 'stripe' ? (
            <>
              <CreditCard className="h-4 w-4" />
              <span>Pay with Stripe</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Submit Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default BalanceDashboard
