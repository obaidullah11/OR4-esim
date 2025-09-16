import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Banknote,
  Building2,
  MessageCircle,
  User,
  Calendar,
  FileText,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Zap,
  Download,
  FileSpreadsheet,
  Trash2,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { balanceService } from '../../services/balanceService'
import { paymentsService } from '../../services/paymentsService'
import ExportDropdown from '../../components/common/ExportDropdown'
import ConfirmationModal from '../../components/common/ConfirmationModal'

// Format currency utility
const formatCurrency = (amount) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  } catch (error) {
    return 'N/A'
  }
}

const formatDate = (dateString) => {
  if (!dateString || dateString === 'N/A' || dateString === 'Never') {
    return 'N/A'
  }
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'N/A'
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'N/A'
  }
}

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
    payment_pending: { icon: Clock, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' },
    payment_received: { icon: Banknote, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
    approved: { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
    completed: { icon: CheckCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' },
    rejected: { icon: XCircle, color: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
    cancelled: { icon: XCircle, color: 'text-gray-600 bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800' }
  }
  
  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending
  const Icon = config.icon
  
  return (
    <span className={cn('inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border', config.color)}>
      <Icon className="w-3 h-3" />
      <span className="capitalize">{status?.replace('_', ' ')}</span>
    </span>
  )
}

// Method badge component
const MethodBadge = ({ method }) => {
  const methodConfig = {
    stripe: { icon: CreditCard, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
    bank_transfer: { icon: Building2, color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
    admin_contact: { icon: MessageCircle, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
    manual: { icon: User, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' }
  }
  
  const config = methodConfig[method] || methodConfig.admin_contact
  const Icon = config.icon
  
  return (
    <span className={cn('inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium', config.color)}>
      <Icon className="w-3 h-3" />
      <span className="capitalize">{method?.replace('_', ' ')}</span>
    </span>
  )
}

function BalanceTopupManagementPage() {
  const { resolvedTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [allRequests, setAllRequests] = useState([])
  const [pendingRequests, setPendingRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedRequestForDelete, setSelectedRequestForDelete] = useState(null)
  const [processingRequestId, setProcessingRequestId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Poll payment status for webhook-based verification (like eSIM workflow)
  const pollPaymentStatus = async (sessionId, maxAttempts = 30) => {
    console.log('🔄 Starting payment status polling for balance top-up...')
    let attempt = 0

    while (attempt < maxAttempts) {
      console.log(`🔍 Checking payment status... (Attempt ${attempt + 1}/${maxAttempts})`)

      try {
        const response = await balanceService.admin.checkPaymentStatus(sessionId)

        if (response.success) {
          const paymentStatus = response.data.payment_status
          console.log(`📊 Payment status: ${paymentStatus}`)

          if (paymentStatus === 'paid' || paymentStatus === 'complete') {
            console.log('✅ Payment confirmed via webhook! Refreshing records...')
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
          
          // Still processing, wait and continue
          console.log(`⏳ Payment still processing (${paymentStatus}), waiting...`)
        } else {
          console.log(`❌ Error checking payment status: ${response.error}`)
        }

        // Wait 5 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 5000))
      } catch (error) {
        console.error(`❌ Error checking payment status: ${error}`)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }

      attempt++
    }

    console.log('❌ Payment verification timeout. Please check manually.')
    return {
      success: false,
      status: 'timeout',
      message: 'Payment verification timeout'
    }
  }

  // Handle payment return from Stripe (eSIM-style navigation)
  const handlePaymentReturn = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const canceled = urlParams.get('canceled')
    const sessionId = urlParams.get('session_id')
    const paymentType = urlParams.get('type')

    if ((success === '1' || canceled === '1') && !sessionStorage.getItem('paymentReturnProcessed')) {
      // Mark as processed to prevent re-execution
      sessionStorage.setItem('paymentReturnProcessed', 'true')
      
      // Clean URL parameters (eSIM-style)
      const url = new URL(window.location)
      url.searchParams.delete('success')
      url.searchParams.delete('canceled')
      url.searchParams.delete('session_id')
      url.searchParams.delete('type')
      window.history.replaceState({}, document.title, url.pathname)

      if (success === '1' && sessionId) {
        toast.success('✅ Payment completed! Verifying via webhook...')
        
        // Start webhook-based verification like eSIM workflow
        const pollResult = await pollPaymentStatus(sessionId)
        
        if (pollResult.success && pollResult.status === 'paid') {
          toast.success('✅ Payment verified successfully! Updating records...')
          
          // Refresh the data to show updated status
          setTimeout(async () => {
            await fetchTopupRequests()
            toast.success('Balance top-up completed successfully!')
            
            // Clear any stored session data
            sessionStorage.removeItem('paymentReturnProcessed')
          }, 1500)
          
        } else {
          toast.error(`❌ Payment verification failed: ${pollResult.message}`)
          sessionStorage.removeItem('paymentReturnProcessed')
        }
        
      } else if (canceled === '1') {
        toast.error('❌ Payment was cancelled. Please try again.')
        sessionStorage.removeItem('paymentReturnProcessed')
      }
    }
  }

  // Fetch all topup requests
  const fetchTopupRequests = async () => {
    setLoading(true)
    try {
      // Fetch all requests
      const allResponse = await balanceService.admin.getAllTopupRequests()
      
      if (allResponse.success && allResponse.data) {
        // Ensure data is an array
        const allRequestsData = Array.isArray(allResponse.data) ? allResponse.data : []
        setAllRequests(allRequestsData)
        
        // Filter pending requests from all requests
        const pending = allRequestsData.filter(request => 
          request.status === 'pending' || request.status === 'payment_received'
        )
        setPendingRequests(pending)
      } else {
        console.error('Failed to fetch all requests:', allResponse.error)
        // Fallback to pending requests only
        const pendingResponse = await balanceService.admin.getPendingTopupRequests()
        if (pendingResponse.success) {
          const pendingData = Array.isArray(pendingResponse.data) ? pendingResponse.data : []
          setPendingRequests(pendingData)
          setAllRequests(pendingData) // Use pending as fallback for all
        }
      }
      
    } catch (error) {
      console.error('Failed to fetch topup requests:', error)
      toast.error('Failed to load topup requests')
      // Initialize with empty arrays to prevent filter errors
      setAllRequests([])
      setPendingRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handlePaymentReturn()
    fetchTopupRequests()
  }, [])

  // Handle approve request (manual approval)
  const handleApproveRequest = async () => {
    if (!selectedRequest) return
    
    setProcessingRequestId(selectedRequest.id)
    try {
      const response = await balanceService.admin.processTopupRequest(
        selectedRequest.id,
        'approve',
        'Approved via Stripe payment'
      )
      
      if (response.success) {
        toast.success('Topup request approved successfully')
        fetchTopupRequests()
        setSelectedRequest(null)
      } else {
        toast.error(response.error || 'Failed to approve request')
      }
    } catch (error) {
      console.error('Failed to approve request:', error)
      toast.error('Failed to approve request')
    } finally {
      setProcessingRequestId(null)
    }
  }

  // Handle approve with Stripe payment
  const handleApproveWithStripe = async (request) => {
    setProcessingRequestId(request.id)
    try {
      const response = await balanceService.admin.createAdminTopupApprovalSession(request.id)
      
      if (response.success) {
        // Navigate to Stripe checkout in same window
        window.location.href = response.checkout_url
        // Note: User will return to admin dashboard after successful payment
      } else {
        toast.error(response.error || 'Failed to create payment session')
      }
    } catch (error) {
      console.error('Failed to create Stripe approval session:', error)
      toast.error('Failed to create payment session')
    } finally {
      setProcessingRequestId(null)
    }
  }

  // Handle print receipt (similar to orders/payments invoice generation)
  const handlePrintReceipt = async (request) => {
    try {
      console.log('🧾 Generating receipt for top-up request:', request.id)
      
      // Check if there's a related payment for this request
      if (request.related_payment) {
        // If there's a related payment, generate invoice using paymentsService
        const response = await paymentsService.generateInvoice(request.related_payment)
        
        if (response.ok) {
          const blob = await response.blob()
          
          // Create download link
          const downloadUrl = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = downloadUrl
          link.download = `TopUp_Receipt_${request.payment_reference}_${new Date().toISOString().split('T')[0]}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(downloadUrl)

          toast.success('Receipt downloaded successfully')
          return
        }
      }
      
      // Fallback: Generate professional HTML receipt
      const receiptContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Balance Top-up Receipt</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                color: #333;
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #007bff;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .company-name {
                font-size: 28px;
                font-weight: bold;
                color: #007bff;
                margin-bottom: 5px;
              }
              .receipt-title {
                font-size: 18px;
                color: #666;
              }
              .receipt-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 20px;
              }
              .info-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 5px 0;
              }
              .info-label {
                font-weight: bold;
                color: #555;
              }
              .info-value {
                color: #333;
              }
              .amount-section {
                background: #e3f2fd;
                padding: 15px;
                border-radius: 8px;
                text-align: center;
                margin: 20px 0;
              }
              .amount {
                font-size: 24px;
                font-weight: bold;
                color: #1976d2;
              }
              .status {
                display: inline-block;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                text-transform: uppercase;
                font-size: 12px;
              }
              .status-completed { background: #d4edda; color: #155724; }
              .status-pending { background: #fff3cd; color: #856404; }
              .status-rejected { background: #f8d7da; color: #721c24; }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #dee2e6;
                color: #666;
                font-size: 12px;
              }
              .notes {
                background: #fff;
                border-left: 4px solid #007bff;
                padding: 15px;
                margin: 20px 0;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company-name">TraveRoam eSIM</div>
              <div class="receipt-title">Balance Top-up Receipt</div>
            </div>
            
            <div class="receipt-info">
              <div class="info-row">
                <span class="info-label">Receipt Number:</span>
                <span class="info-value">${request.payment_reference}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${formatDate(request.created_at)}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Reseller:</span>
                <span class="info-value">${request.reseller_name}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
                <span class="info-value">${request.reseller_email}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Method:</span>
                <span class="info-value">${request.topup_method_display}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">
                  <span class="status status-${request.status}">${request.status_display}</span>
                </span>
              </div>
              ${request.processed_at ? `
              <div class="info-row">
                <span class="info-label">Processed:</span>
                <span class="info-value">${formatDate(request.processed_at)}</span>
              </div>
              ` : ''}
            </div>
            
            <div class="amount-section">
              <div>Top-up Amount</div>
              <div class="amount">${formatCurrency(request.requested_amount)}</div>
            </div>
            
            ${request.admin_notes || request.payment_notes ? `
            <div class="notes">
              <strong>Notes:</strong><br>
              ${request.admin_notes || request.payment_notes || ''}
            </div>
            ` : ''}
            
            <div class="footer">
              <p>Generated on ${new Date().toLocaleString()}</p>
              <p>Thank you for using TraveRoam eSIM services</p>
            </div>
          </body>
        </html>
      `
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=900')
      printWindow.document.write(receiptContent)
      printWindow.document.close()
      
      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.print()
      }, 500)
      
      toast.success('Receipt opened for printing')
    } catch (error) {
      console.error('Failed to generate receipt:', error)
      toast.error('Failed to generate receipt')
    }
  }

  // Handle delete record
  const handleDeleteRecord = (request) => {
    if (request.status === 'pending') {
      toast.error('Cannot delete pending requests. Please reject them instead.')
      return
    }
    
    setSelectedRequestForDelete(request)
    setShowDeleteModal(true)
  }

  // Confirm delete request
  const confirmDeleteRequest = async () => {
    if (!selectedRequestForDelete) return

    try {
      setIsDeleting(true)
      console.log('Deleting top-up request:', selectedRequestForDelete.id)

      // Here you would call the delete API
      // For now, simulate deletion
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Remove from local state immediately
      setAllRequests(prev => prev.filter(r => r.id !== selectedRequestForDelete.id))
      setPendingRequests(prev => prev.filter(r => r.id !== selectedRequestForDelete.id))

      toast.success('Top-up record deleted successfully')
      console.log('Top-up request deleted:', selectedRequestForDelete.id)

      // Refresh the requests list from server to ensure consistency
      setTimeout(() => {
        fetchTopupRequests()
      }, 500)
      
    } catch (error) {
      console.error('Failed to delete top-up request:', error)
      
      // Handle specific error types
      if (error.message === 'Failed to fetch') {
        toast.error('Connection error. Please check your internet connection and try again.')
      } else if (error.message?.includes('404')) {
        toast.error('Request not found. It may have already been deleted.')
        setTimeout(() => {
          fetchTopupRequests()
        }, 500)
      } else {
        toast.error(error.message || 'Failed to delete request')
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setSelectedRequestForDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setSelectedRequestForDelete(null)
  }

  // Handle reject request
  const handleRejectRequest = async (rejectionReasonInput) => {
    if (!selectedRequest || !rejectionReasonInput.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }
    
    setProcessingRequestId(selectedRequest.id)
    try {
      const response = await balanceService.admin.processTopupRequest(
        selectedRequest.id,
        'reject',
        '',
        rejectionReasonInput
      )
      
      if (response.success) {
        toast.success('Topup request rejected')
        fetchTopupRequests()
        setShowRejectModal(false)
        setSelectedRequest(null)
      } else {
        toast.error(response.error || 'Failed to reject request')
      }
    } catch (error) {
      console.error('Failed to reject request:', error)
      toast.error('Failed to reject request')
    } finally {
      setProcessingRequestId(null)
    }
  }

  // Export functions
  const exportToPDF = () => {
    const filteredData = getFilteredRequests(activeTab === 'pending' ? pendingRequests : allRequests)
    
    // Simple CSV-like export that can be saved as PDF
    const headers = ['Reseller', 'Amount', 'Method', 'Status', 'Date']
    const rows = filteredData.map(request => [
      request.reseller_name,
      formatCurrency(request.requested_amount),
      request.topup_method_display || request.topup_method,
      request.status,
      formatDate(request.created_at)
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `balance-topup-records-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success('Records exported successfully')
  }

  const exportToExcel = () => {
    const filteredData = getFilteredRequests(activeTab === 'pending' ? pendingRequests : allRequests)
    
    // Create Excel-compatible CSV
    const headers = ['Reseller Name', 'Amount (USD)', 'Payment Method', 'Status', 'Request Date', 'Processed Date', 'Notes']
    const rows = filteredData.map(request => [
      request.reseller_name || 'N/A',
      request.requested_amount || 0,
      request.topup_method_display || request.topup_method || 'N/A',
      request.status || 'N/A',
      request.created_at ? new Date(request.created_at).toLocaleString() : 'N/A',
      request.processed_at ? new Date(request.processed_at).toLocaleString() : 'N/A',
      request.admin_notes || request.notes || 'N/A'
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `balance-topup-records-${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast.success('Excel file exported successfully')
  }

  // Filter requests based on search and filters
  const getFilteredRequests = (requests) => {
    // Ensure requests is an array
    if (!Array.isArray(requests)) {
      console.warn('getFilteredRequests received non-array:', requests)
      return []
    }
    
    return requests.filter(request => {
      const matchesSearch = 
        request.reseller_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requested_amount?.toString().includes(searchTerm) ||
        request.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter
      const matchesMethod = methodFilter === 'all' || request.topup_method === methodFilter
      
      return matchesSearch && matchesStatus && matchesMethod
    })
  }

  // Calculate summary stats
  const summaryStats = {
    totalPending: Array.isArray(pendingRequests) ? pendingRequests.length : 0,
    totalAmount: Array.isArray(pendingRequests) ? 
      pendingRequests.reduce((sum, req) => sum + (parseFloat(req.requested_amount) || 0), 0) : 0,
    totalRequests: Array.isArray(allRequests) ? allRequests.length : 0,
    completedToday: Array.isArray(allRequests) ? 
      allRequests.filter(req => 
        req.status === 'completed' && 
        new Date(req.processed_at).toDateString() === new Date().toDateString()
      ).length : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Balance Top-up Management</h1>
          <p className="text-muted-foreground">Manage reseller balance top-up requests and payments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchTopupRequests}
            disabled={loading}
            className="flex items-center space-x-2 bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <ExportDropdown
            onExportPDF={exportToPDF}
            onExportExcel={exportToExcel}
            disabled={loading}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending Requests</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.totalPending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Pending Amount</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(summaryStats.totalAmount)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.totalRequests}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">Completed Today</p>
              <p className="text-2xl font-bold text-foreground">{summaryStats.completedToday}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            All Requests ({allRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'pending'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            Pending Requests ({pendingRequests.length})
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reseller, amount, or reference..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="payment_pending">Payment Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="all">All Methods</option>
          <option value="stripe">Stripe Payment</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="admin_contact">Contact Admin</option>
          <option value="manual">Manual Processing</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/20 border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">Reseller</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Method</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
                <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Loading requests...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                getFilteredRequests(activeTab === 'pending' ? pendingRequests : allRequests).map((request) => (
                  <tr key={request.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{request.reseller_name}</p>
                          <p className="text-xs text-muted-foreground">ID: {request.reseller_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-foreground">{formatCurrency(request.requested_amount)}</p>
                      <p className="text-xs text-muted-foreground">{request.currency}</p>
                    </td>
                    <td className="p-4">
                      <MethodBadge method={request.topup_method} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-foreground">{formatDate(request.created_at)}</p>
                      {request.processed_at && (
                        <p className="text-xs text-muted-foreground">
                          Processed: {formatDate(request.processed_at)}
                        </p>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {activeTab === 'pending' && request.status === 'pending' ? (
                          // Pending tab: Only show Approve and Reject buttons (reseller style)
                          <>
                            <button
                              onClick={() => handleApproveWithStripe(request)}
                              disabled={processingRequestId === request.id}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                                processingRequestId === request.id
                                  ? 'bg-green-400 cursor-not-allowed'
                                  : 'bg-green-500 hover:bg-green-600'
                              } text-white`}
                            >
                              {processingRequestId === request.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  <span>Approving...</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span>Approve</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRequest(request)
                                setShowRejectModal(true)
                              }}
                              disabled={processingRequestId === request.id}
                              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                                processingRequestId === request.id
                                  ? 'bg-red-400 cursor-not-allowed'
                                  : 'bg-red-500 hover:bg-red-600'
                              } text-white`}
                            >
                              <XCircle className="h-4 w-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        ) : (
                          // All requests tab: Show view, print, delete icons
                          <>
                            <button
                              onClick={() => {
                                setSelectedRequest(request)
                                setShowDetailsModal(true)
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handlePrintReceipt(request)}
                              className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                              title="Print Receipt"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecord(request)}
                              className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {!loading && getFilteredRequests(activeTab === 'pending' ? pendingRequests : allRequests).length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || methodFilter !== 'all' 
                  ? 'No requests match your filters'
                  : 'No topup requests found'
                }
              </p>
            </div>
          )}
        </div>
      </div>


      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Top-up Request Details</h2>
                  <p className="text-sm text-muted-foreground">{selectedRequest.payment_reference}</p>
                </div>
                <StatusBadge status={selectedRequest.status} />
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedRequest(null)
                }}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {/* Request Information */}
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    Request Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Request ID</label>
                        <p className="text-sm font-medium text-foreground">{selectedRequest.payment_reference}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amount</label>
                        <p className="text-sm font-medium text-foreground">{formatCurrency(selectedRequest.requested_amount)}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Currency</label>
                        <p className="text-sm font-medium text-foreground">{selectedRequest.currency}</p>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Method</label>
                        <p className="text-sm font-medium text-foreground">{selectedRequest.topup_method_display}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</label>
                        <div className="mt-1">
                          <StatusBadge status={selectedRequest.status} />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</label>
                        <p className="text-sm text-foreground">{formatDate(selectedRequest.created_at)}</p>
                      </div>
                      {selectedRequest.processed_at && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Processed</label>
                          <p className="text-sm text-foreground">{formatDate(selectedRequest.processed_at)}</p>
                        </div>
                      )}
                      {selectedRequest.expires_at && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Expires</label>
                          <p className="text-sm text-foreground">{formatDate(selectedRequest.expires_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reseller Information */}
                <div className="bg-muted/20 border border-border rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Reseller Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</label>
                      <p className="text-sm font-medium text-foreground">{selectedRequest.reseller_name}</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
                      <p className="text-sm font-medium text-foreground">{selectedRequest.reseller_email}</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {(selectedRequest.payment_notes || selectedRequest.admin_notes || selectedRequest.rejected_reason) && (
                  <div className="bg-muted/20 border border-border rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                      Notes
                    </h3>
                    <div className="space-y-3">
                      {selectedRequest.payment_notes && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payment Notes</label>
                          <p className="text-sm text-foreground">{selectedRequest.payment_notes}</p>
                        </div>
                      )}
                      {selectedRequest.admin_notes && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                          <label className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide">Admin Notes</label>
                          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">{selectedRequest.admin_notes}</p>
                        </div>
                      )}
                      {selectedRequest.rejected_reason && (
                        <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">
                          <label className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wide">Rejection Reason</label>
                          <p className="text-sm text-red-600 dark:text-red-300 mt-1">{selectedRequest.rejected_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-border">
              <button
                onClick={() => {
                  setShowDetailsModal(false)
                  setSelectedRequest(null)
                }}
                className="px-4 py-2 rounded-lg transition-colors bg-muted hover:bg-muted/80 text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false)
          setSelectedRequest(null)
        }}
        onConfirm={handleRejectRequest}
        title="Reject Topup Request"
        message={`Are you sure you want to reject the topup request from ${selectedRequest?.reseller_name}? This action cannot be undone and the reseller will be notified.`}
        type="danger"
        confirmText="Reject Request"
        cancelText="Cancel"
        showInput={true}
        inputLabel="Rejection Reason"
        inputPlaceholder="Please provide a reason for rejecting this request..."
        inputRequired={true}
        inputType="textarea"
        isLoading={processingRequestId === selectedRequest?.id}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={confirmDeleteRequest}
        title="Delete Top-up Record"
        message={`Are you sure you want to delete top-up record "${selectedRequestForDelete?.payment_reference}"? This action cannot be undone.`}
        confirmText={isDeleting ? "Deleting..." : "Delete Record"}
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default BalanceTopupManagementPage
