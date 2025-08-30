import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import ScrollableTable from '../../components/common/ScrollableTable'
import { ResellersEmptyState } from '../../components/common/EmptyState'
import { ResellersLoadingState } from '../../components/common/LoadingState'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  Eye,
  DollarSign,
  Users,
  CreditCard,
  Activity,
  Calendar,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react'
import AddEditResellerModal from '../../components/resellers/AddEditResellerModal'
import ResellerDetailsModal from '../../components/resellers/ResellerDetailsModal'
import SuspensionReasonModal from '../../components/resellers/SuspensionReasonModal'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import Tooltip from '../../components/common/Tooltip'
// BACKEND INTEGRATION ACTIVATED
import { resellerService } from '../../services/resellerService'
import toast from 'react-hot-toast'

// Date formatting utilities
const formatDateTime = (dateString) => {
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
      day: 'numeric'
    }) + ' at ' + date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
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
      day: 'numeric'
    })
  } catch (error) {
    return 'N/A'
  }
}

// Phone formatting utility
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber || phoneNumber === 'N/A') {
    return 'No phone'
  }
  
  // If phone already has country code, return as is
  if (phoneNumber.startsWith('+')) {
    return phoneNumber
  }
  
  // If it's just numbers, assume it needs formatting
  return phoneNumber
}

// Sample reseller data
const sampleResellers = [
  {
    id: 1,
    name: 'John Smith',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 555-123-4567',
    countryOfRegistration: 'US',
    status: 'active',
    joinDate: '2024-01-15',
    revenue: 45000,
    clients: 125,
    simLimit: 1000,
    simUsed: 750,
    creditLimit: 50000,
    creditUsed: 35000,
    lastActivity: '2 hours ago',
    location: 'United States'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@globalsim.com',
    phone: '+44 20 7123 4567',
    countryOfRegistration: 'GB',
    status: 'active',
    joinDate: '2024-02-20',
    revenue: 32000,
    clients: 89,
    simLimit: 800,
    simUsed: 520,
    creditLimit: 40000,
    creditUsed: 28000,
    lastActivity: '1 day ago',
    location: 'United Kingdom'
  },
  {
    id: 3,
    name: 'Hans Mueller',
    firstName: 'Hans',
    lastName: 'Mueller',
    email: 'hans.mueller@mobilesol.com',
    phone: '+49 30 12345678',
    countryOfRegistration: 'DE',
    status: 'suspended',
    joinDate: '2023-11-10',
    revenue: 28000,
    clients: 67,
    simLimit: 600,
    simUsed: 580,
    creditLimit: 30000,
    creditUsed: 29500,
    lastActivity: '1 week ago',
    location: 'Germany'
  },
  {
    id: 4,
    name: 'Marie Dubois',
    firstName: 'Marie',
    lastName: 'Dubois',
    email: 'marie.dubois@connectpro.com',
    phone: '+33 1 23 45 67 89',
    countryOfRegistration: 'FR',
    status: 'active',
    joinDate: '2024-03-05',
    revenue: 22000,
    clients: 45,
    simLimit: 500,
    simUsed: 320,
    creditLimit: 25000,
    creditUsed: 18000,
    lastActivity: '3 hours ago',
    location: 'France'
  },
  {
    id: 5,
    name: 'David Chen',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@simmaster.com',
    phone: '+1 555-987-6543',
    countryOfRegistration: 'CA',
    status: 'pending',
    joinDate: '2024-06-01',
    revenue: 5000,
    clients: 12,
    simLimit: 200,
    simUsed: 45,
    creditLimit: 10000,
    creditUsed: 3500,
    lastActivity: '5 minutes ago',
    location: 'Canada'
  }
]

// Sample reseller requests data
const sampleResellerRequests = [
  {
    id: 1,
    firstName: 'Michael',
    lastName: 'Chen',
    name: 'Michael Chen',
    email: 'michael.chen@techstart.com',
    phoneCountryCode: 'US',
    phoneNumber: '555-987-6543',
    countryOfRegistration: 'US',
    companyName: 'TechStart Solutions',
    businessType: 'Technology',
    requestDate: '2024-01-20',
    status: 'pending',
    documents: ['business_license.pdf', 'tax_certificate.pdf']
  },
  {
    id: 2,
    firstName: 'Emma',
    lastName: 'Rodriguez',
    name: 'Emma Rodriguez',
    email: 'emma.rodriguez@globalcom.es',
    phoneCountryCode: 'ES',
    phoneNumber: '612-345-678',
    countryOfRegistration: 'ES',
    companyName: 'GlobalCom España',
    businessType: 'Telecommunications',
    requestDate: '2024-01-18',
    status: 'pending',
    documents: ['company_registration.pdf', 'vat_certificate.pdf']
  },
  {
    id: 3,
    firstName: 'Ahmed',
    lastName: 'Hassan',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@middleeasttech.ae',
    phoneCountryCode: 'AE',
    phoneNumber: '50-123-4567',
    countryOfRegistration: 'AE',
    companyName: 'Middle East Tech',
    businessType: 'IT Services',
    requestDate: '2024-01-16',
    status: 'pending',
    documents: ['trade_license.pdf', 'emirates_id.pdf']
  },
  {
    id: 4,
    firstName: 'Lisa',
    lastName: 'Wang',
    name: 'Lisa Wang',
    email: 'lisa.wang@asiapacific.sg',
    phoneCountryCode: 'SG',
    phoneNumber: '8123-4567',
    countryOfRegistration: 'SG',
    companyName: 'Asia Pacific Networks',
    businessType: 'Networking',
    requestDate: '2024-01-14',
    status: 'pending',
    documents: ['acra_certificate.pdf', 'gst_certificate.pdf']
  }
]

function ResellersPage() {
  const { resolvedTheme } = useTheme()
  const [resellers, setResellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedReseller, setSelectedReseller] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedResellerForDelete, setSelectedResellerForDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showSuspensionModal, setShowSuspensionModal] = useState(false)
  const [selectedResellerForSuspension, setSelectedResellerForSuspension] = useState(null)
  const [isSuspending, setIsSuspending] = useState(false)
  const [activeTab, setActiveTab] = useState('resellers')
  const [resellerRequests, setResellerRequests] = useState([])
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [selectedRequestForRejection, setSelectedRequestForRejection] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Fetch resellers from API
  const fetchResellers = async (params = {}) => {
    // BACKEND INTEGRATION ACTIVATED
    try {
      setLoading(true)

      const response = await resellerService.getAllResellers({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        search: params.search || searchTerm,
        ordering: params.ordering || '-created_at'
      })

      if (response.success) {
        const formattedResellers = resellerService.formatResellersList(response.data.results)
        setResellers(formattedResellers)
        setPagination(response.data.pagination)
      } else {
        // No fallback to sample data - show error
        console.error('API failed to load resellers:', response.error)
        toast.error('Failed to load resellers from server')
        setResellers([])
      }
    } catch (error) {
      console.error('Failed to fetch resellers:', error)
      toast.error('Failed to load resellers from server')
      setResellers([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch activation requests from API
  const fetchActivationRequests = async () => {
    try {
      const response = await resellerService.getActivationRequests({
        ordering: '-created_at'
      })

      if (response.success) {
        const formattedRequests = resellerService.formatActivationRequestsList(response.data.results)
        setResellerRequests(formattedRequests)
        console.log('✅ Activation requests loaded:', formattedRequests.length)
      } else {
        // No fallback to sample data - show error
        console.error('API failed to load activation requests:', response.error)
        toast.error('Failed to load activation requests from server')
        setResellerRequests([])
      }
    } catch (error) {
      console.error('Failed to fetch activation requests:', error)
      toast.error('Failed to load activation requests from server')
      setResellerRequests([])
    }
  }

  // Load resellers and activation requests on component mount
  useEffect(() => {
    fetchResellers()
    fetchActivationRequests()
  }, [])

  // Filter resellers based on search and status (client-side filtering for better UX)
  const filteredResellers = (resellers || []).filter(reseller => {
    const matchesSearch = reseller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reseller.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || reseller.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Get status color and icon
  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: {
        color: 'text-green-500',
        bg: resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
        icon: UserCheck,
        label: 'Active'
      },
      suspended: {
        color: 'text-red-500',
        bg: resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
        icon: UserX,
        label: 'Suspended'
      },
      pending: {
        color: 'text-yellow-500',
        bg: resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
        icon: AlertCircle,
        label: 'Pending'
      }
    }
    return statusConfig[status] || statusConfig.pending
  }

  // Calculate usage percentage
  const getUsagePercentage = (used, limit) => {
    return Math.round((used / limit) * 100)
  }

  // Get usage color based on percentage
  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-500'
    if (percentage >= 75) return 'text-yellow-500'
    return 'text-green-500'
  }

  // Handler functions
  const handleSaveReseller = async (resellerData) => {
    try {
      // The modal now handles the API call directly, so we just need to refresh the list
      if (resellerData && resellerData.success) {
        // Success case - refresh the list
        await fetchResellers()
      } else {
        // Fallback - refresh anyway
        await fetchResellers()
      }
      
      setShowAddModal(false)
      setSelectedReseller(null)
    } catch (error) {
      console.error('Failed to refresh resellers after save:', error)
      toast.error('Reseller saved but failed to refresh the list')
    }
  }

  const handleEditReseller = (reseller) => {
    setSelectedReseller(reseller)
    setShowDetailsModal(false)
    setShowAddModal(true)
  }

  const handleSuspendReseller = (reseller) => {
    setSelectedResellerForSuspension(reseller)
    setShowSuspensionModal(true)
  }

  const handleConfirmSuspension = async (reason) => {
    if (!selectedResellerForSuspension) return

    // BACKEND INTEGRATION ACTIVATED
    try {
      setIsSuspending(true)
      const response = await resellerService.suspendReseller(selectedResellerForSuspension.id, reason)

      if (response.success) {
        toast.success('Reseller suspended successfully')
        setShowSuspensionModal(false)
        setSelectedResellerForSuspension(null)
        // Close details modal and refresh list
        setShowDetailsModal(false)
        setSelectedReseller(null)
        await fetchResellers() // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to suspend reseller')
      }
    } catch (error) {
      console.error('❌ Failed to suspend reseller:', error)
      toast.error('Failed to suspend reseller - using demo mode')
      // Demo mode fallback
      setShowSuspensionModal(false)
      setSelectedResellerForSuspension(null)
      setShowDetailsModal(false)
      setSelectedReseller(null)
    } finally {
      setIsSuspending(false)
    }
  }

  const handleCancelSuspension = () => {
    setShowSuspensionModal(false)
    setSelectedResellerForSuspension(null)
  }

  const handleActivateReseller = async (reseller) => {
    // BACKEND INTEGRATION ACTIVATED
    try {
      const response = await resellerService.activateReseller(reseller.id)

      if (response.success) {
        toast.success('Reseller activated successfully')
        // Close details modal and refresh list
        setShowDetailsModal(false)
        setSelectedReseller(null)
        fetchResellers() // Refresh the list
      } else {
        throw new Error(response.message || 'Failed to activate reseller')
      }
    } catch (error) {
      console.error('❌ Failed to activate reseller:', error)
      toast.error('Failed to activate reseller - using demo mode')
      // Demo mode fallback
      setShowDetailsModal(false)
      setSelectedReseller(null)
    }
  }

  const handleDeleteReseller = (reseller) => {
    setSelectedResellerForDelete(reseller)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedResellerForDelete) return

    try {
      setIsDeleting(true)
      console.log('🗑️ Deleting reseller:', selectedResellerForDelete.id)

      const response = await resellerService.deleteReseller(selectedResellerForDelete.id)
      console.log('📥 Delete response:', response)

      if (response.success) {
        // Remove from local state immediately
        setResellers(prev => prev.filter(r => r.id !== selectedResellerForDelete.id))
        
        // Update pagination total count
        setPagination(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          totalPages: Math.ceil(Math.max(0, prev.total - 1) / prev.limit)
        }))
        
        toast.success('Reseller deleted successfully')
        console.log('✅ Reseller deleted:', selectedResellerForDelete.id)
        
        // Refresh the reseller list from server to ensure consistency
        setTimeout(() => {
          fetchResellers()
        }, 500)
      } else {
        toast.error(response.error || 'Failed to delete reseller')
        console.error('❌ Failed to delete reseller:', response.error)
      }
    } catch (error) {
      console.error('❌ Failed to delete reseller:', error)
      
      // Handle specific error types
      if (error.message === 'Failed to fetch') {
        toast.error('Connection error. Please check your internet connection and try again.')
      } else if (error.message?.includes('404')) {
        toast.error('Reseller not found. It may have already been deleted.')
        // Refresh data on 404 to sync with server state
        setTimeout(() => {
          fetchResellers()
        }, 500)
      } else {
        toast.error(error.message || 'Failed to delete reseller')
      }
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setSelectedResellerForDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
    setSelectedResellerForDelete(null)
  }

  // Refresh function
  const handleRefresh = async () => {
    try {
      setLoading(true)
      // Refresh both resellers and activation requests
      await Promise.all([
        fetchResellers(),
        fetchActivationRequests()
      ])
      toast.success('Data refreshed successfully')
      console.log('🔄 Resellers and activation requests refreshed')
    } catch (error) {
      console.error('Failed to refresh data:', error)
      toast.error('Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }

  // Handle search with debouncing
  const handleSearch = (value) => {
    setSearchTerm(value)
    // Debounce search to avoid too many API calls
    setTimeout(() => {
      fetchResellers({ search: value, page: 1 })
    }, 500)
  }

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    fetchResellers({ page: newPage })
  }

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
    fetchResellers({ page: 1, limit: newLimit })
  }

  // Request handlers
  const handleActivateRequest = async (requestId) => {
    try {
      const request = resellerRequests.find(r => r.id === requestId)
      if (!request) {
        toast.error('Request not found')
        return
      }

      const approvalData = {
        maxClients: 100,
        maxSims: 1000,
        creditLimit: 5000,
        notes: 'Approved via admin panel'
      }

      const response = await resellerService.approveActivationRequest(requestId, approvalData)

      if (response.success) {
        // Refresh both lists to ensure data consistency
        await Promise.all([
          fetchResellers(),
          fetchActivationRequests()
        ])

        toast.success(`Reseller ${request.name} activated successfully`)
        console.log('✅ Reseller activated:', request.name)
      } else {
        toast.error(response.error || 'Failed to activate reseller')
        console.error('❌ Failed to activate reseller:', response.error)
      }
    } catch (error) {
      console.error('❌ Failed to activate reseller:', error)
      toast.error('Failed to activate reseller')
    }
  }

  const handleRejectRequest = (requestId) => {
    const request = resellerRequests.find(r => r.id === requestId)
    if (!request) {
      toast.error('Request not found')
      return
    }
    setSelectedRequestForRejection(request)
    setShowRejectModal(true)
  }

  const confirmRejectRequest = async (rejectionReason) => {
    if (!selectedRequestForRejection) return

    try {
      const response = await resellerService.rejectActivationRequest(selectedRequestForRejection.id, rejectionReason)

      if (response.success) {
        // Refresh activation requests to ensure data consistency
        await fetchActivationRequests()

        toast.success(`Request from ${selectedRequestForRejection.name} rejected`)
        console.log('✅ Reseller request rejected:', selectedRequestForRejection.name)
      } else {
        toast.error(response.error || 'Failed to reject request')
        console.error('❌ Failed to reject request:', response.error)
      }
    } catch (error) {
      console.error('❌ Failed to reject request:', error)
      toast.error('Failed to reject request')
    } finally {
      setShowRejectModal(false)
      setSelectedRequestForRejection(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reseller Management</h1>
          <p className="text-muted-foreground">Manage reseller accounts, limits, and activities</p>

        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 bg-muted text-muted-foreground px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Reseller</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('resellers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'resellers'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            Active Resellers ({resellers.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'requests'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            }`}
          >
            Pending Requests ({resellerRequests.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'resellers' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{resellers.length}</p>
              <p className="text-sm text-muted-foreground">Total Resellers</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {resellers.filter(r => r.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Resellers</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <DollarSign className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ${resellers.reduce((sum, r) => sum + r.revenue, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
              <CreditCard className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {resellers.reduce((sum, r) => sum + r.clients, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>

          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}
              className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Resellers Table */}
      <ScrollableTable
        pagination={pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        loading={loading}
        maxHeight="600px"
        showPagination={true}
        showEntries={true}
        showPageInfo={true}
      >
        <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Reseller</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Revenue</th>
                <th className="text-left p-4 font-medium text-foreground">Clients</th>
                <th className="text-left p-4 font-medium text-foreground">SIM Usage</th>
                <th className="text-left p-4 font-medium text-foreground">Credit Usage</th>
                <th className="text-left p-4 font-medium text-foreground">Last Activity</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <ResellersLoadingState />
              ) : filteredResellers.length === 0 ? (
                <ResellersEmptyState />
              ) : (
                filteredResellers.map((reseller) => {
                const statusDisplay = getStatusDisplay(reseller.status)
                const StatusIcon = statusDisplay.icon
                
                const simUsagePercent = getUsagePercentage(reseller.simUsed || 0, reseller.simLimit || 1000)
                const creditUsagePercent = getUsagePercentage(reseller.creditUsed || 0, reseller.creditLimit || 1000)

                return (
                  <tr key={reseller.id} className={`border-t border-border hover:bg-muted/30 transition-colors`}>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{reseller.name}</p>
                        <p className="text-sm text-muted-foreground">{reseller.email}</p>
                        <p className="text-xs text-muted-foreground flex items-center space-x-1">
                          <span>{formatPhoneNumber(reseller.phone)}</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Tooltip 
                        content={reseller.status === 'suspended' && reseller.suspensionReason ? `Suspension Reason: ${reseller.suspensionReason}` : null}
                        position="top"
                      >
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusDisplay.bg} ${reseller.status === 'suspended' && reseller.suspensionReason ? 'cursor-help' : ''}`}>
                          <StatusIcon className={`h-3 w-3 ${statusDisplay.color}`} />
                          <span className={`text-xs font-medium ${statusDisplay.color}`}>
                            {statusDisplay.label}
                          </span>
                        </div>
                      </Tooltip>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">${(reseller.revenue || 0).toLocaleString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{reseller.clients || 0}</p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">
                          {reseller.simUsed || 0} / {reseller.simLimit || 1000}
                        </p>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              simUsagePercent >= 90 ? 'bg-red-500' :
                              simUsagePercent >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${simUsagePercent}%` }}
                          ></div>
                        </div>
                        <p className={`text-xs ${getUsageColor(simUsagePercent)}`}>
                          {simUsagePercent}%
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <p className="text-sm text-foreground">
                          ${(reseller.creditUsed || 0).toLocaleString()} / ${(reseller.creditLimit || 1000).toLocaleString()}
                        </p>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              creditUsagePercent >= 90 ? 'bg-red-500' :
                              creditUsagePercent >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${creditUsagePercent}%` }}
                          ></div>
                        </div>
                        <p className={`text-xs ${getUsageColor(creditUsagePercent)}`}>
                          {creditUsagePercent}%
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-muted-foreground">{formatDateTime(reseller.lastActivity) || 'Never'}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedReseller(reseller)
                            setShowDetailsModal(true)
                          }}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedReseller(reseller)
                            setShowAddModal(true)
                          }}
                          className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteReseller(reseller)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
            </tbody>
        </table>
      </ScrollableTable>
        </>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Pending Reseller Requests</h3>
            <p className="text-sm text-muted-foreground">Review and approve new reseller applications</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {resellerRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {request.firstName[0]}{request.lastName[0]}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">{request.name}</div>
                          <div className="text-sm text-muted-foreground">{request.businessType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{request.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {request.phone || `+${request.phoneCountryCode === 'US' ? '1' : '86'} ${request.phoneNumber}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{request.countryOfRegistration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">{request.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-foreground">
                        {formatDate(request.requestDate)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.ceil((new Date() - new Date(request.requestDate)) / (1000 * 60 * 60 * 24))} days ago
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleActivateRequest(request.id)}
                          className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600 transition-colors"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Activate</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AddEditResellerModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedReseller(null)
        }}
        reseller={selectedReseller}
        onSave={handleSaveReseller}
      />

      {/* Details Modal */}
      <ResellerDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedReseller(null)
        }}
        reseller={selectedReseller}
        onEdit={handleEditReseller}
        onSuspend={handleSuspendReseller}
        onActivate={handleActivateReseller}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Reseller"
        message={`Are you sure you want to delete "${selectedResellerForDelete?.name || 'this reseller'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        type="danger"
      />

      {/* Suspension Reason Modal */}
      <SuspensionReasonModal
        isOpen={showSuspensionModal}
        onClose={handleCancelSuspension}
        onConfirm={handleConfirmSuspension}
        reseller={selectedResellerForSuspension}
        isLoading={isSuspending}
      />

      {/* Rejection Reason Modal */}
      <ConfirmationModal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false)
          setSelectedRequestForRejection(null)
        }}
        onConfirm={confirmRejectRequest}
        title="Reject Reseller Request"
        message={`Are you sure you want to reject the reseller request from ${selectedRequestForRejection?.name}? This action cannot be undone and the applicant will be notified.`}
        type="danger"
        confirmText="Reject Request"
        cancelText="Cancel"
        showInput={true}
        inputLabel="Rejection Reason"
        inputPlaceholder="Please provide a reason for rejection..."
        inputType="textarea"
        inputRequired={true}
      />
    </div>
  )
}

export default ResellersPage
