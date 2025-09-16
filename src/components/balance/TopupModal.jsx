import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import {
  X,
  CreditCard,
  Building2,
  MessageCircle,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader,
  Banknote,
  Upload,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'
import { balanceService } from '../../services/balanceService'

function TopupModal({ isOpen, onClose, onSuccess, currentBalance = 0, creditLimit = 0 }) {
  const { resolvedTheme } = useTheme()
  const [selectedMethod, setSelectedMethod] = useState('stripe')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [paymentProof, setPaymentProof] = useState(null)
  const [loading, setLoading] = useState(false)

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const topupMethods = [
    {
      id: 'stripe',
      name: 'Stripe Payment',
      description: 'Pay instantly with credit/debit card',
      icon: CreditCard,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
      instant: true
    },
    {
      id: 'admin_contact',
      name: 'Contact Admin',
      description: 'Request manual processing by admin',
      icon: MessageCircle,
      color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      instant: false
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Upload proof of bank transfer',
      icon: Building2,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
      instant: false
    }
  ]

  const availableCredit = creditLimit - currentBalance
  const suggestedAmounts = [50, 100, 250, 500].filter(amt => amt <= availableCredit)

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount.toString())
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.error('Please upload an image or PDF file')
        return
      }
      setPaymentProof(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (parseFloat(amount) > availableCredit) {
      toast.error(`Amount exceeds available credit limit. Maximum: $${availableCredit}`)
      return
    }

    if (selectedMethod === 'bank_transfer' && !paymentProof) {
      toast.error('Please upload proof of payment for bank transfer')
      return
    }

    setLoading(true)

    try {
      const topupData = {
        requested_amount: parseFloat(amount),
        currency: 'USD',
        topup_method: selectedMethod,
        payment_notes: notes
      }

      // Add payment proof if bank transfer
      let finalTopupData = topupData
      if (selectedMethod === 'bank_transfer' && paymentProof) {
        const formData = new FormData()
        Object.keys(topupData).forEach(key => {
          formData.append(key, topupData[key])
        })
        formData.append('payment_proof', paymentProof)
        finalTopupData = formData
      }

      if (selectedMethod === 'stripe') {
        // Create Stripe checkout session
        const response = await balanceService.createStripeTopupSession(parseFloat(amount))
        
        if (response.success && response.checkout_url) {
          // Store session ID for webhook verification
          if (response.session_id) {
            localStorage.setItem('stripeSessionId', response.session_id)
            localStorage.setItem('topupAmount', amount)
          }
          
          // Navigate to Stripe checkout in same window
          window.location.href = response.checkout_url
          
          // Note: No need to close modal or show toast as we're navigating away
          // The success/cancel URLs will bring users back to the dashboard
          return
        } else {
          throw new Error(response.error || 'Failed to create Stripe checkout session')
        }
      } else {
        // Create topup request for admin/bank transfer methods
        const response = await balanceService.createTopupRequest(finalTopupData)
        
        if (response.success) {
          onSuccess()
          toast.success(`Topup request submitted successfully! You'll be notified when processed.`)
        } else {
          throw new Error(response.error || 'Failed to create topup request')
        }
      }
    } catch (error) {
      console.error('Topup error:', error)
      toast.error(error.message || 'Failed to process topup request')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setAmount('')
    setNotes('')
    setPaymentProof(null)
    setSelectedMethod('stripe')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-black/70 animate-in fade-in duration-300" onClick={handleClose} />
      <div className={cn(
        'relative bg-card border border-border rounded-xl p-6 w-full max-w-2xl max-h-[90vh]',
        'animate-in zoom-in-95 slide-in-from-bottom-2 duration-300',
        'overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent',
        resolvedTheme === 'dark' ? 'shadow-dark-soft-lg' : 'shadow-soft-lg'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Top-up Balance</h2>
              <p className="text-sm text-muted-foreground">Add funds to your account</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Balance Info */}
        <div className="bg-muted/30 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-lg font-semibold text-foreground">${currentBalance.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credit Limit</p>
              <p className="text-lg font-semibold text-foreground">${creditLimit.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Available Credit</p>
              <p className="text-lg font-semibold text-green-600">${availableCredit.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Method Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Payment Method</label>
            <div className="grid grid-cols-1 gap-3">
              {topupMethods.map((method) => {
                const Icon = method.icon
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={cn(
                      'flex items-center space-x-3 p-4 border rounded-lg text-left transition-all',
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    <div className={cn('p-2 rounded-lg', method.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground flex items-center space-x-2">
                        <span>{method.name}</span>
                        {method.instant && (
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full">
                            Instant
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <div className={cn(
                      'w-4 h-4 border-2 rounded-full transition-colors',
                      selectedMethod === method.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    )}>
                      {selectedMethod === method.id && (
                        <div className="w-full h-full bg-white rounded-full scale-50" />
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">Amount (USD)</label>
            
            {/* Suggested Amounts */}
            {suggestedAmounts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {suggestedAmounts.map((suggestedAmount) => (
                  <button
                    key={suggestedAmount}
                    type="button"
                    onClick={() => handleAmountSelect(suggestedAmount)}
                    className={cn(
                      'px-3 py-1 border rounded-lg text-sm transition-colors',
                      amount === suggestedAmount.toString()
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    )}
                  >
                    ${suggestedAmount}
                  </button>
                ))}
              </div>
            )}
            
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                step="0.01"
                min="1"
                max={availableCredit}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            {amount && parseFloat(amount) > availableCredit && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Amount exceeds available credit limit (${availableCredit.toFixed(2)})</span>
              </div>
            )}
          </div>

          {/* Bank Transfer File Upload */}
          {selectedMethod === 'bank_transfer' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Payment Proof</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="payment-proof"
                />
                <label htmlFor="payment-proof" className="cursor-pointer">
                  <div className="flex flex-col items-center space-y-2">
                    {paymentProof ? (
                      <>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                        <p className="text-sm font-medium text-foreground">{paymentProof.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(paymentProof.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">Upload Payment Proof</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, PDF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Notes {selectedMethod !== 'stripe' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                selectedMethod === 'bank_transfer' 
                  ? 'Include bank transfer details, reference number, etc.'
                  : selectedMethod === 'admin_contact'
                  ? 'Describe your request or provide any additional information'
                  : 'Optional notes for this transaction'
              }
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              required={selectedMethod !== 'stripe'}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-border text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > availableCredit}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {selectedMethod === 'stripe' ? (
                    <CreditCard className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <span>
                    {selectedMethod === 'stripe' ? 'Pay with Stripe' : 'Submit Request'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Processing Times:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><strong>Stripe:</strong> Instant processing</li>
                <li><strong>Admin Contact:</strong> 1-2 business days</li>
                <li><strong>Bank Transfer:</strong> 2-3 business days after verification</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopupModal
