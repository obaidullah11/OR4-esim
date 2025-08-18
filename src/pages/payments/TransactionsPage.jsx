import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  CreditCard,
  User,
  UserCheck,
  Calendar,
  AlertCircle,
  RefreshCw,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  Building,
  Receipt,
  Ban,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Wallet
} from 'lucide-react'
import TransactionDetailsModal from '../../components/transactions/TransactionDetailsModal'
import RefundModal from '../../components/transactions/RefundModal'
import ApprovalModal from '../../components/transactions/ApprovalModal'

// Sample transaction data
const sampleTransactions = [
  {
    id: 1,
    transactionId: 'TXN-2024-001',
    orderId: 'ORD-2024-001',
    type: 'payment',
    source: 'app_user',
    customer: {
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      phone: '+971 50 123 4567',
      type: 'App User'
    },
    amount: 173.25,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentGateway: 'Stripe',
    status: 'completed',
    description: 'Premium 30GB Plan Payment',
    createdAt: '2024-03-15T10:30:00Z',
    processedAt: '2024-03-15T10:31:00Z',
    gatewayResponse: {
      transactionId: 'pi_1234567890',
      last4: '4242',
      brand: 'visa'
    },
    fees: 5.20,
    netAmount: 168.05,
    invoiceNumber: 'INV-2024-001'
  },
  {
    id: 2,
    transactionId: 'TXN-2024-002',
    orderId: 'ORD-2024-002',
    type: 'payment',
    source: 'reseller',
    customer: {
      name: 'TechCorp Solutions',
      email: 'billing@techcorp.ae',
      phone: '+971 4 123 4567',
      type: 'Reseller',
      reseller: 'TechCorp Solutions'
    },
    amount: 1050.00,
    currency: 'USD',
    paymentMethod: 'Bank Transfer',
    paymentGateway: 'Manual',
    status: 'pending_approval',
    description: 'Bulk SIM Order Payment - 10 Units',
    createdAt: '2024-03-14T14:20:00Z',
    processedAt: null,
    gatewayResponse: {
      referenceNumber: 'BT-2024-0314-001'
    },
    fees: 0,
    netAmount: 1050.00,
    invoiceNumber: 'INV-2024-002',
    requiresApproval: true
  },
  {
    id: 3,
    transactionId: 'TXN-2024-003',
    orderId: 'ORD-2024-003',
    type: 'refund',
    source: 'app_user',
    customer: {
      name: 'Layla Ibrahim',
      email: 'layla.ibrahim@email.com',
      phone: '+971 55 345 6789',
      type: 'App User'
    },
    amount: -173.25,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentGateway: 'Stripe',
    status: 'completed',
    description: 'Refund for cancelled order',
    createdAt: '2024-03-11T14:20:00Z',
    processedAt: '2024-03-11T14:25:00Z',
    gatewayResponse: {
      refundId: 're_1234567890',
      originalTransaction: 'TXN-2024-006'
    },
    fees: -5.20,
    netAmount: -168.05,
    invoiceNumber: 'REF-2024-001'
  },
  {
    id: 4,
    transactionId: 'TXN-2024-004',
    orderId: 'ORD-2024-004',
    type: 'payment',
    source: 'app_user',
    customer: {
      name: 'Mohammed Ali',
      email: 'mohammed.ali@email.com',
      phone: '+971 52 456 7890',
      type: 'App User'
    },
    amount: 47.25,
    currency: 'USD',
    paymentMethod: 'Digital Wallet',
    paymentGateway: 'PayPal',
    status: 'failed',
    description: 'Basic 5GB Plan Payment',
    createdAt: '2024-03-13T16:45:00Z',
    processedAt: '2024-03-13T16:46:00Z',
    gatewayResponse: {
      errorCode: 'INSUFFICIENT_FUNDS',
      errorMessage: 'Insufficient funds in wallet'
    },
    fees: 0,
    netAmount: 0,
    invoiceNumber: null
  },
  {
    id: 5,
    transactionId: 'TXN-2024-005',
    orderId: 'ORD-2024-005',
    type: 'payment',
    source: 'reseller',
    customer: {
      name: 'Digital Solutions LLC',
      email: 'finance@digitalsolutions.ae',
      phone: '+971 2 987 6543',
      type: 'Reseller',
      reseller: 'Digital Solutions LLC'
    },
    amount: 750.00,
    currency: 'USD',
    paymentMethod: 'Credit Card',
    paymentGateway: 'Stripe',
    status: 'completed',
    description: 'Monthly SIM Package Payment',
    createdAt: '2024-03-12T09:15:00Z',
    processedAt: '2024-03-12T09:16:00Z',
    gatewayResponse: {
      transactionId: 'pi_0987654321',
      last4: '1234',
      brand: 'mastercard'
    },
    fees: 22.50,
    netAmount: 727.50,
    invoiceNumber: 'INV-2024-005'
  },
  {
    id: 6,
    transactionId: 'TXN-2024-006',
    orderId: null,
    type: 'credit_adjustment',
    source: 'reseller',
    customer: {
      name: 'TechCorp Solutions',
      email: 'billing@techcorp.ae',
      phone: '+971 4 123 4567',
      type: 'Reseller',
      reseller: 'TechCorp Solutions'
    },
    amount: 200.00,
    currency: 'USD',
    paymentMethod: 'Credit Adjustment',
    paymentGateway: 'Manual',
    status: 'pending_approval',
    description: 'Credit adjustment for service issues',
    createdAt: '2024-03-10T11:45:00Z',
    processedAt: null,
    gatewayResponse: {
      adjustmentReason: 'Service compensation'
    },
    fees: 0,
    netAmount: 200.00,
    invoiceNumber: null,
    requiresApproval: true
  }
]

function TransactionsPage() {
  const { resolvedTheme } = useTheme()
  const [transactions, setTransactions] = useState(sampleTransactions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showApprovalModal, setShowApprovalModal] = useState(false)

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.orderId && transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    const matchesSource = sourceFilter === 'all' || transaction.source === sourceFilter
    const matchesPaymentMethod = paymentMethodFilter === 'all' || transaction.paymentMethod === paymentMethodFilter

    return matchesSearch && matchesStatus && matchesType && matchesSource && matchesPaymentMethod
  })

  // Get status color and icon
  const getStatusDisplay = (status) => {
    const statusConfig = {
      completed: {
        color: 'text-green-500',
        bg: resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
        icon: CheckCircle,
        label: 'Completed'
      },
      pending: {
        color: 'text-yellow-500',
        bg: resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
        icon: Clock,
        label: 'Pending'
      },
      pending_approval: {
        color: 'text-orange-500',
        bg: resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50',
        icon: AlertCircle,
        label: 'Pending Approval'
      },
      failed: {
        color: 'text-red-500',
        bg: resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
        icon: XCircle,
        label: 'Failed'
      },
      refunded: {
        color: 'text-purple-500',
        bg: resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50',
        icon: RotateCcw,
        label: 'Refunded'
      }
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

  // Handler functions
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
  }

  const handleRefund = (transaction) => {
    setSelectedTransaction(transaction)
    setShowRefundModal(true)
  }

  const handleApproval = (transaction) => {
    setSelectedTransaction(transaction)
    setShowApprovalModal(true)
  }

  const handleApproveTransaction = (transactionId, notes) => {
    setTransactions(prev => prev.map(transaction => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          status: 'completed',
          processedAt: new Date().toISOString(),
          approvalNotes: notes
        }
      }
      return transaction
    }))

    toast.success('Transaction approved successfully')
    setShowApprovalModal(false)
    setSelectedTransaction(null)
  }

  const handleRejectTransaction = (transactionId, reason) => {
    setTransactions(prev => prev.map(transaction => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          status: 'failed',
          processedAt: new Date().toISOString(),
          rejectionReason: reason
        }
      }
      return transaction
    }))

    toast.success('Transaction rejected')
    setShowApprovalModal(false)
    setSelectedTransaction(null)
  }

  const handleProcessRefund = (transactionId, amount, reason) => {
    // Create new refund transaction
    const originalTransaction = transactions.find(t => t.id === transactionId)
    const newRefund = {
      id: Date.now(),
      transactionId: `TXN-${Date.now()}`,
      orderId: originalTransaction.orderId,
      type: 'refund',
      source: originalTransaction.source,
      customer: originalTransaction.customer,
      amount: -amount,
      currency: originalTransaction.currency,
      paymentMethod: originalTransaction.paymentMethod,
      paymentGateway: originalTransaction.paymentGateway,
      status: 'completed',
      description: `Refund: ${reason}`,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      gatewayResponse: {
        refundId: `re_${Date.now()}`,
        originalTransaction: originalTransaction.transactionId
      },
      fees: -(originalTransaction.fees || 0),
      netAmount: -amount + (originalTransaction.fees || 0),
      invoiceNumber: `REF-${Date.now()}`
    }

    setTransactions(prev => [newRefund, ...prev])
    toast.success('Refund processed successfully')
    setShowRefundModal(false)
    setSelectedTransaction(null)
  }

  const downloadInvoice = (transaction) => {
    if (!transaction.invoiceNumber) {
      toast.error('No invoice available for this transaction')
      return
    }

    // Simulate invoice download
    toast.success(`Downloading invoice ${transaction.invoiceNumber}`)
  }

  // Calculate statistics
  const stats = {
    totalTransactions: transactions.length,
    totalRevenue: transactions
      .filter(t => t.status === 'completed' && t.type === 'payment')
      .reduce((sum, t) => sum + t.amount, 0),
    pendingApprovals: transactions.filter(t => t.status === 'pending_approval').length,
    totalRefunds: Math.abs(transactions
      .filter(t => t.status === 'completed' && t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments & Transactions</h1>
          <p className="text-muted-foreground">Manage all payments from app users and resellers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">${stats.totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
              <AlertCircle className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pendingApprovals}</p>
              <p className="text-sm text-muted-foreground">Pending Approvals</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <TrendingDown className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">${stats.totalRefunds.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Total Refunds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by transaction ID, customer, email, or order..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="payment">Payments</option>
              <option value="refund">Refunds</option>
              <option value="credit_adjustment">Credit Adjustments</option>
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="app_user">App Users</option>
              <option value="reseller">Resellers</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={paymentMethodFilter}
              onChange={(e) => setPaymentMethodFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Digital Wallet">Digital Wallet</option>
              <option value="Credit Adjustment">Credit Adjustment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Transaction</th>
                <th className="text-left p-4 font-medium text-foreground">Customer</th>
                <th className="text-left p-4 font-medium text-foreground">Type</th>
                <th className="text-left p-4 font-medium text-foreground">Amount</th>
                <th className="text-left p-4 font-medium text-foreground">Method</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Date</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((transaction) => {
                const statusDisplay = getStatusDisplay(transaction.status)
                const typeDisplay = getTypeDisplay(transaction.type)
                const StatusIcon = statusDisplay.icon
                const TypeIcon = typeDisplay.icon

                return (
                  <tr key={transaction.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{transaction.transactionId}</p>
                        {transaction.orderId && (
                          <p className="text-sm text-muted-foreground">Order: {transaction.orderId}</p>
                        )}
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{transaction.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{transaction.customer.email}</p>
                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                          transaction.source === 'app_user'
                            ? resolvedTheme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                            : resolvedTheme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                        }`}>
                          {transaction.source === 'app_user' ? <Smartphone className="h-3 w-3" /> : <Building className="h-3 w-3" />}
                          <span>{transaction.customer.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                        transaction.type === 'payment'
                          ? resolvedTheme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'
                          : transaction.type === 'refund'
                            ? resolvedTheme === 'dark' ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600'
                            : resolvedTheme === 'dark' ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <TypeIcon className="h-4 w-4" />
                        <span>{typeDisplay.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className={`font-medium ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        {transaction.fees !== 0 && (
                          <p className="text-xs text-muted-foreground">
                            Fees: ${Math.abs(transaction.fees).toFixed(2)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Net: ${transaction.netAmount.toFixed(2)}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{transaction.paymentMethod}</p>
                        <p className="text-sm text-muted-foreground">{transaction.paymentGateway}</p>
                        {transaction.gatewayResponse?.last4 && (
                          <p className="text-xs text-muted-foreground">
                            •••• {transaction.gatewayResponse.last4}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{statusDisplay.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleTimeString()}
                        </p>
                        {transaction.processedAt && (
                          <p className="text-xs text-muted-foreground">
                            Processed: {new Date(transaction.processedAt).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          className={`p-2 rounded-lg transition-colors ${
                            resolvedTheme === 'dark'
                              ? 'hover:bg-slate-700 text-slate-300 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {transaction.invoiceNumber && (
                          <button
                            onClick={() => downloadInvoice(transaction)}
                            className={`p-2 rounded-lg transition-colors ${
                              resolvedTheme === 'dark'
                                ? 'hover:bg-blue-900/20 text-blue-400 hover:text-blue-300'
                                : 'hover:bg-blue-50 text-blue-600 hover:text-blue-700'
                            }`}
                            title="Download Invoice"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}

                        {transaction.status === 'pending_approval' && (
                          <button
                            onClick={() => handleApproval(transaction)}
                            className={`p-2 rounded-lg transition-colors ${
                              resolvedTheme === 'dark'
                                ? 'hover:bg-green-900/20 text-green-400 hover:text-green-300'
                                : 'hover:bg-green-50 text-green-600 hover:text-green-700'
                            }`}
                            title="Approve/Reject"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}

                        {transaction.status === 'completed' && transaction.type === 'payment' && (
                          <button
                            onClick={() => handleRefund(transaction)}
                            className={`p-2 rounded-lg transition-colors ${
                              resolvedTheme === 'dark'
                                ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
                                : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                            }`}
                            title="Process Refund"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}

                        <div className="relative group">
                          <button
                            className={`p-2 rounded-lg transition-colors ${
                              resolvedTheme === 'dark'
                                ? 'hover:bg-slate-700 text-slate-300 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                          {/* Dropdown Menu */}
                          <div className={`absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 ${
                            resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'
                          }`}>
                            <div className="py-1">
                              <button
                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                                  resolvedTheme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <Receipt className="h-4 w-4" />
                                <span>View Receipt</span>
                              </button>
                              <button
                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                                  resolvedTheme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <FileText className="h-4 w-4" />
                                <span>Transaction Log</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className={`mx-auto h-12 w-12 ${resolvedTheme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
            <h3 className="mt-2 text-sm font-medium text-foreground">No transactions found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || sourceFilter !== 'all' || paymentMethodFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No transactions have been processed yet'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedTransaction(null)
          }}
          onDownloadInvoice={downloadInvoice}
        />
      )}

      {showRefundModal && selectedTransaction && (
        <RefundModal
          transaction={selectedTransaction}
          isOpen={showRefundModal}
          onClose={() => {
            setShowRefundModal(false)
            setSelectedTransaction(null)
          }}
          onProcessRefund={handleProcessRefund}
        />
      )}

      {showApprovalModal && selectedTransaction && (
        <ApprovalModal
          transaction={selectedTransaction}
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false)
            setSelectedTransaction(null)
          }}
          onApprove={handleApproveTransaction}
          onReject={handleRejectTransaction}
        />
      )}
    </div>
  )
}

export default TransactionsPage
