import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import {
  Wallet,
  Plus,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Info,
  Battery,
  BatteryLow,
  Zap
} from 'lucide-react'
import { balanceService } from '../../services/balanceService'
import BalanceDashboard from './BalanceDashboard'

function BalanceDisplay({ variant = 'compact', className = '', autoRefresh = true }) {
  const { resolvedTheme } = useTheme()
  const [balanceData, setBalanceData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Fetch balance data
  const fetchBalance = async () => {
    setLoading(true)
    try {
      const response = await balanceService.getResellerProfile()
      if (response.success) {
        setBalanceData(response.data)
      }
    } catch (error) {
      console.error('Balance fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  // Poll payment status for webhook verification (like eSIM workflow)
  const pollPaymentStatus = async (sessionId, maxAttempts = 30) => {
    console.log('🔄 Starting reseller payment status polling...')
    let attempt = 0

    while (attempt < maxAttempts) {
      console.log(`🔍 Checking payment status... (Attempt ${attempt + 1}/${maxAttempts})`)

      try {
        const response = await balanceService.checkPaymentStatus(sessionId)

        if (response.success) {
          const paymentStatus = response.data.payment_status
          console.log(`📊 Payment status: ${paymentStatus}`)

          if (paymentStatus === 'paid' || paymentStatus === 'complete') {
            console.log('✅ Payment confirmed via webhook! Refreshing balance...')
            return {
              success: true,
              status: 'paid',
              data: response.data
            }
          } else if (paymentStatus === 'expired' || paymentStatus === 'canceled') {
            console.log('❌ Payment expired or cancelled')
            return {
              success: false,
              status: paymentStatus,
              message: `Payment ${paymentStatus}`
            }
          }
        }

        // Wait 5 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        console.error(`❌ Error checking payment status: ${error}`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }

      attempt++
    }

    return {
      success: false,
      status: 'timeout',
      message: 'Payment verification timeout'
    }
  }

  // Check for payment returns and handle webhook verification
  const handlePaymentReturn = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const canceled = urlParams.get('canceled')
    const sessionId = urlParams.get('session_id') || localStorage.getItem('stripeSessionId')
    const topupAmount = localStorage.getItem('topupAmount')

    if (success === '1' && sessionId && !sessionStorage.getItem('resellerPaymentProcessed')) {
      sessionStorage.setItem('resellerPaymentProcessed', 'true')
      
      // Clean URL parameters (eSIM-style)
      const url = new URL(window.location)
      url.searchParams.delete('success')
      url.searchParams.delete('canceled')
      url.searchParams.delete('session_id')
      url.searchParams.delete('type')
      window.history.replaceState({}, document.title, url.pathname)

      console.log('🎉 Reseller payment return detected, verifying...')
      
      // Use toast dynamically imported
      const { default: toast } = await import('react-hot-toast')
      toast.success('✅ Payment completed! Verifying via webhook...')
      
      // Start webhook-based verification
      const pollResult = await pollPaymentStatus(sessionId)
      
      if (pollResult.success && pollResult.status === 'paid') {
        // Get amount from polling response or fallback to localStorage
        const actualAmount = pollResult.data?.amount_total 
          ? pollResult.data.amount_total.toFixed(2) // Already in dollars from backend
          : topupAmount || 'Unknown'
        toast.success(`✅ Balance top-up of $${actualAmount} completed successfully!`)
        
        // Refresh balance data
        setTimeout(() => {
          fetchBalance()
          localStorage.removeItem('stripeSessionId')
          localStorage.removeItem('topupAmount')
          sessionStorage.removeItem('resellerPaymentProcessed')
        }, 1500)
        
      } else {
        toast.error(`❌ Payment verification failed: ${pollResult.message}`)
        sessionStorage.removeItem('resellerPaymentProcessed')
      }
    } else if (canceled === '1') {
      console.log('❌ Reseller payment cancelled')
      
      // Clean URL parameters (eSIM-style)
      const url = new URL(window.location)
      url.searchParams.delete('success')
      url.searchParams.delete('canceled')
      url.searchParams.delete('session_id')
      url.searchParams.delete('type')
      window.history.replaceState({}, document.title, url.pathname)
      
      // Use toast dynamically imported
      const { default: toast } = await import('react-hot-toast')
      toast.error('❌ Payment was cancelled. Please try again.')
      localStorage.removeItem('stripeSessionId')
      localStorage.removeItem('topupAmount')
    }
  }

  useEffect(() => {
    // Check for payment returns on component mount
    handlePaymentReturn()
    
    fetchBalance()
    
    // Auto-refresh every 5 minutes if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchBalance, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const getBalanceStatus = () => {
    if (!balanceData) return 'unknown'
    const balance = balanceData.current_credit || 0
    const limit = balanceData.credit_limit || 0
    
    // Handle case where there's no credit limit set
    if (limit <= 0) {
      if (balance <= 0) return 'critical'
      if (balance <= 50) return 'low'
      if (balance <= 200) return 'medium'
      return 'excellent'
    }
    
    const percentage = (balance / limit) * 100
    
    if (percentage <= 5) return 'critical'      // 0-5%: Critical - needs immediate attention
    if (percentage <= 15) return 'low'          // 5-15%: Low - should top up soon
    if (percentage <= 50) return 'medium'       // 15-50%: Medium - moderate usage
    if (percentage <= 85) return 'good'         // 50-85%: Good - healthy balance
    return 'excellent'                          // 85-100%: Excellent - very healthy
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-500'
      case 'low': return 'text-orange-500'
      case 'medium': return 'text-yellow-500'
      case 'good': return 'text-green-500'
      case 'excellent': return 'text-emerald-500'
      default: return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'critical':
        return AlertCircle        // Critical - alert circle for urgent attention
      case 'low':
        return BatteryLow        // Low - battery low icon to suggest recharging
      case 'medium':
        return Info              // Medium - info icon for moderate status
      case 'good':
        return Battery           // Good - battery icon showing healthy level
      case 'excellent':
        return CheckCircle       // Excellent - check circle for optimal status
      default:
        return Wallet            // Unknown/default - wallet icon
    }
  }

  const getStatusDescription = (status) => {
    switch (status) {
      case 'critical':
        return 'Critical - Immediate top-up required'
      case 'low':
        return 'Low Balance - Consider topping up soon'
      case 'medium':
        return 'Moderate Balance - Monitor usage'
      case 'good':
        return 'Good Balance - Healthy level'
      case 'excellent':
        return 'Excellent Balance - Optimal level'
      default:
        return 'Balance Status'
    }
  }

  if (!balanceData && !loading) {
    return null
  }

  const status = getBalanceStatus()
  const StatusIcon = getStatusIcon(status)
  const balance = balanceData?.current_credit || 0
  const creditLimit = balanceData?.credit_limit || 0
  const usagePercentage = creditLimit > 0 ? (balance / creditLimit) * 100 : 0

  if (variant === 'compact') {
    return (
      <>
        <div className={cn('flex items-center space-x-2', className)}>
          <button
            onClick={() => setShowDashboard(true)}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all hover:bg-muted/80',
              'border border-border bg-card',
              loading && 'opacity-50'
            )}
            title={`${getStatusDescription(status)} - Click to view details`}
          >
            <div className={cn('p-1.5 rounded-md', 
              status === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
              status === 'low' ? 'bg-orange-100 dark:bg-orange-900/20' :
              status === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
              status === 'good' ? 'bg-green-100 dark:bg-green-900/20' :
              status === 'excellent' ? 'bg-emerald-100 dark:bg-emerald-900/20' :
              'bg-muted'
            )}>
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <StatusIcon className={cn('h-4 w-4', getStatusColor(status))} />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">{formatCurrency(balance)}</p>
              <p className="text-xs text-muted-foreground">Balance</p>
            </div>
          </button>

          <button
            onClick={() => setShowDashboard(true)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            title="Top-up Balance"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <BalanceDashboard
          isOpen={showDashboard}
          onClose={() => setShowDashboard(false)}
        />
      </>
    )
  }

  if (variant === 'detailed') {
    return (
      <>
        <div className={cn('bg-card border border-border rounded-lg p-4', className)}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <StatusIcon className={cn('h-5 w-5', getStatusColor(status))} />
              <h3 className="font-semibold text-foreground">Account Balance</h3>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-muted-foreground hover:text-foreground rounded"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-foreground">{formatCurrency(balance)}</span>
              {loading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>

            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  status === 'critical' ? 'bg-red-500' :
                  status === 'low' ? 'bg-orange-500' :
                  status === 'medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                )}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Used: {usagePercentage.toFixed(1)}%</span>
              <span>Limit: {formatCurrency(creditLimit)}</span>
            </div>

            {expanded && (
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Credit:</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(creditLimit - balance)}
                  </span>
                </div>
                
                {balanceData.total_topups !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Top-ups:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(balanceData.total_topups)}
                    </span>
                  </div>
                )}
                
                {balanceData.total_spent !== undefined && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Spent:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(balanceData.total_spent)}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => setShowDashboard(true)}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Top-up</span>
              </button>
              <button
                onClick={() => setShowDashboard(true)}
                className="flex items-center justify-center px-3 py-2 border border-border text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
              >
                <Wallet className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <BalanceDashboard
          isOpen={showDashboard}
          onClose={() => setShowDashboard(false)}
        />
      </>
    )
  }

  return null
}

export default BalanceDisplay
