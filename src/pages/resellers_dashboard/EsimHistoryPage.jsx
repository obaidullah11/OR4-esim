import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import {
  Smartphone,
  Search,
  Filter,
  Calendar,
  Globe,
  Activity,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  QrCode,
  Mail,
  Phone,
  Wifi,
  BarChart3
} from 'lucide-react'
import toast from 'react-hot-toast'
import { esimService } from '../../services/esimService'
import { clientService } from '../../services/clientService'

// Sample eSIM history data
const sampleEsimHistory = [
  {
    id: 'esim_001',
    clientId: 1,
    clientName: 'John Smith',
    clientEmail: 'john.smith@email.com',
    planName: 'US 30 Days - 20GB',
    country: 'US',
    countryName: 'United States',
    dataVolume: '20GB',
    validity: 30,
    validityUnit: 'days',
    price: 75.00,
    currency: 'USD',
    status: 'active',
    assignedDate: '2024-01-20T10:30:00Z',
    activatedDate: '2024-01-21T08:15:00Z',
    expiryDate: '2024-02-20T08:15:00Z',
    dataUsed: '12.5GB',
    dataRemaining: '7.5GB',
    usagePercentage: 62.5,
    qrCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-001',
    activationCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-001',
    network: '4G/5G',
    lastActivity: '2 hours ago'
  },
  {
    id: 'esim_002',
    clientId: 2,
    clientName: 'Sarah Johnson',
    clientEmail: 'sarah.johnson@email.com',
    planName: 'Europe 14 Days - 10GB',
    country: 'EU',
    countryName: 'Europe (Multi-country)',
    dataVolume: '10GB',
    validity: 14,
    validityUnit: 'days',
    price: 45.00,
    currency: 'USD',
    status: 'active',
    assignedDate: '2024-01-25T14:20:00Z',
    activatedDate: '2024-01-26T06:45:00Z',
    expiryDate: '2024-02-09T06:45:00Z',
    dataUsed: '3.2GB',
    dataRemaining: '6.8GB',
    usagePercentage: 32,
    qrCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-002',
    activationCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-002',
    network: '4G/5G',
    lastActivity: '1 day ago'
  },
  {
    id: 'esim_003',
    clientId: 3,
    clientName: 'Michael Chen',
    clientEmail: 'michael.chen@email.com',
    planName: 'Asia Pacific 7 Days - 3GB',
    country: 'ASIA',
    countryName: 'Asia Pacific',
    dataVolume: '3GB',
    validity: 7,
    validityUnit: 'days',
    price: 20.00,
    currency: 'USD',
    status: 'expired',
    assignedDate: '2024-01-10T09:15:00Z',
    activatedDate: '2024-01-11T12:30:00Z',
    expiryDate: '2024-01-18T12:30:00Z',
    dataUsed: '2.8GB',
    dataRemaining: '0.2GB',
    usagePercentage: 93.3,
    qrCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-003',
    activationCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-003',
    network: '4G/5G',
    lastActivity: '3 days ago'
  },
  {
    id: 'esim_004',
    clientId: 4,
    clientName: 'Emma Rodriguez',
    clientEmail: 'emma.rodriguez@email.com',
    planName: 'Global 30 Days - 50GB',
    country: 'GLOBAL',
    countryName: 'Global Coverage',
    dataVolume: '50GB',
    validity: 30,
    validityUnit: 'days',
    price: 150.00,
    currency: 'USD',
    status: 'active',
    assignedDate: '2024-01-28T16:45:00Z',
    activatedDate: '2024-01-29T09:20:00Z',
    expiryDate: '2024-02-28T09:20:00Z',
    dataUsed: '18.7GB',
    dataRemaining: '31.3GB',
    usagePercentage: 37.4,
    qrCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-004',
    activationCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-004',
    network: '4G/5G',
    lastActivity: '30 minutes ago'
  },
  {
    id: 'esim_005',
    clientId: 1,
    clientName: 'John Smith',
    clientEmail: 'john.smith@email.com',
    planName: 'US 7 Days - 5GB',
    country: 'US',
    countryName: 'United States',
    dataVolume: '5GB',
    validity: 7,
    validityUnit: 'days',
    price: 25.00,
    currency: 'USD',
    status: 'provisioned',
    assignedDate: '2024-02-01T11:30:00Z',
    activatedDate: null,
    expiryDate: '2024-02-08T11:30:00Z',
    dataUsed: '0GB',
    dataRemaining: '5GB',
    usagePercentage: 0,
    qrCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-005',
    activationCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-005',
    network: '4G/5G',
    lastActivity: 'Not activated'
  },
  {
    id: 'esim_006',
    clientId: 5,
    clientName: 'David Wilson',
    clientEmail: 'david.wilson@email.com',
    planName: 'Australia 14 Days - 8GB',
    country: 'AU',
    countryName: 'Australia',
    dataVolume: '8GB',
    validity: 14,
    validityUnit: 'days',
    price: 40.00,
    currency: 'USD',
    status: 'cancelled',
    assignedDate: '2024-01-05T13:20:00Z',
    activatedDate: null,
    expiryDate: null,
    dataUsed: '0GB',
    dataRemaining: '0GB',
    usagePercentage: 0,
    qrCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-006',
    activationCode: 'LPA:1$rsp-prod.oberthur.net$MGMT-SIM-006',
    network: '4G/5G',
    lastActivity: 'Cancelled'
  }
]

// eSIM Details Modal Component
function EsimDetailsModal({ isOpen, onClose, esim }) {
  const { resolvedTheme } = useTheme()

  if (!isOpen || !esim) return null

  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Active', icon: CheckCircle },
      provisioned: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Provisioned', icon: Clock },
      expired: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Expired', icon: XCircle },
      cancelled: { color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Cancelled', icon: XCircle }
    }
    return statusConfig[status] || statusConfig.provisioned
  }

  const statusDisplay = getStatusDisplay(esim.status)
  const StatusIcon = statusDisplay.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-card border border-border rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
        resolvedTheme === 'dark' ? 'shadow-dark-soft-lg' : 'shadow-soft-lg'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${statusDisplay.bg}`}>
              <Smartphone className={`h-5 w-5 ${statusDisplay.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">eSIM Details</h2>
              <p className="text-sm text-muted-foreground">ID: {esim.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <XCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Status & Plan</h3>
              <div className="space-y-3">
                <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full ${statusDisplay.bg}`}>
                  <StatusIcon className={`h-4 w-4 ${statusDisplay.color}`} />
                  <span className={`text-sm font-medium ${statusDisplay.color}`}>
                    {statusDisplay.label}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Plan:</span> {esim.planName}</p>
                  <p><span className="font-medium">Country:</span> {esim.countryName}</p>
                  <p><span className="font-medium">Data Volume:</span> {esim.dataVolume}</p>
                  <p><span className="font-medium">Validity:</span> {esim.validity} {esim.validityUnit}</p>
                  <p><span className="font-medium">Price:</span> ${esim.price} {esim.currency}</p>
                  <p><span className="font-medium">Network:</span> {esim.network}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Client Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Client:</span> {esim.clientName}</p>
                <p><span className="font-medium">Email:</span> {esim.clientEmail}</p>
                <p><span className="font-medium">Assigned:</span> {new Date(esim.assignedDate).toLocaleString()}</p>
                {esim.activatedDate && (
                  <p><span className="font-medium">Activated:</span> {new Date(esim.activatedDate).toLocaleString()}</p>
                )}
                {esim.expiryDate && (
                  <p><span className="font-medium">Expires:</span> {new Date(esim.expiryDate).toLocaleString()}</p>
                )}
                <p><span className="font-medium">Last Activity:</span> {esim.lastActivity}</p>
              </div>
            </div>
          </div>

          {/* Data Usage */}
          {esim.status === 'active' && (
            <div className="space-y-4">
              <h3 className="font-medium text-foreground">Data Usage</h3>
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">Usage: {esim.dataUsed} / {esim.dataVolume}</span>
                  <span className="text-sm font-medium text-foreground">{esim.usagePercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      esim.usagePercentage >= 90 ? 'bg-red-500' :
                      esim.usagePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${esim.usagePercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Used: {esim.dataUsed}</span>
                  <span>Remaining: {esim.dataRemaining}</span>
                </div>
              </div>
            </div>
          )}

          {/* Activation Codes */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Activation Details</h3>
            <div className="bg-muted/30 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">QR Code / Activation Code:</p>
                <div className="bg-background border border-border rounded p-3 font-mono text-xs break-all">
                  {esim.activationCode}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(esim.activationCode)
                    toast.success('Activation code copied to clipboard')
                  }}
                  className="flex items-center space-x-2 px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors"
                >
                  <QrCode className="h-3 w-3" />
                  <span>Copy Code</span>
                </button>
                <button
                  onClick={() => toast.success('QR code download coming soon')}
                  className="flex items-center space-x-2 px-3 py-1 border border-border rounded text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Download className="h-3 w-3" />
                  <span>Download QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            {esim.status === 'provisioned' && (
              <button
                onClick={() => {
                  // TODO: Resend eSIM details via email
                  toast.success('eSIM details resent to client')
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Resend Details</span>
              </button>
            )}
            {esim.status === 'active' && (
              <button
                onClick={() => {
                  // TODO: Re-issue eSIM if allowed by TraveRoam
                  toast.success('Re-issue functionality coming soon')
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Re-issue eSIM</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EsimHistoryPage() {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const [esimHistory, setEsimHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [selectedEsim, setSelectedEsim] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [sortBy, setSortBy] = useState('assignedDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })

  // Fetch eSIM history from API
  const fetchEsimHistory = async (params = {}) => {
    try {
      setLoading(true)
      console.log('🔄 Fetching eSIM history from API...')

      const response = await esimService.getResellerEsims({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        search: params.search || searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        ordering: params.ordering || '-created_at'
      })

      if (response.success) {
        // Transform API data to match our UI format
        const transformedHistory = response.data.results.map(esim => ({
          id: esim.id,
          clientId: esim.client?.id,
          clientName: esim.client?.full_name || 'Unknown Client',
          clientEmail: esim.client?.email || '',
          planName: esim.plan?.name || 'Unknown Plan',
          country: esim.plan?.country || '',
          countryName: esim.plan?.country || '',
          dataVolume: esim.plan?.data_allowance ? `${esim.plan.data_allowance}GB` : 'N/A',
          validity: esim.plan?.validity_days || 0,
          validityUnit: 'days',
          price: esim.plan?.price || 0,
          currency: esim.plan?.currency || 'USD',
          status: esim.status || 'unknown',
          assignedDate: esim.assigned_at || esim.created_at,
          activatedDate: esim.activated_at,
          expiryDate: esim.expires_at,
          dataUsed: esim.data_used || '0GB',
          dataRemaining: esim.data_remaining || esim.plan?.data_allowance ? `${esim.plan.data_allowance}GB` : 'N/A',
          usagePercentage: esim.usage_percentage || 0,
          qrCode: esim.qr_code || '',
          activationCode: esim.activation_code || '',
          traveroamEsimId: esim.traveroam_esim_id || '',
          iccid: esim.iccid || '',
          msisdn: esim.msisdn || ''
        }))

        setEsimHistory(transformedHistory)
        setPagination(response.data.pagination)
        console.log('✅ eSIM history loaded:', transformedHistory.length, 'records')
      } else {
        // Fallback to sample data if API fails
        console.warn('eSIM API failed, using sample data:', response.error)
        setEsimHistory(sampleEsimHistory)
        toast.error('Failed to load eSIM history from server, showing sample data')
      }
    } catch (error) {
      console.error('❌ Failed to fetch eSIM history:', error)
      // Fallback to sample data
      setEsimHistory(sampleEsimHistory)
      toast.error('Failed to load eSIM history, showing sample data')
    } finally {
      setLoading(false)
    }
  }

  // Load eSIM history on component mount
  useEffect(() => {
    fetchEsimHistory()
  }, [])

  // Reload history when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEsimHistory({ page: 1 })
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  // Filter and sort eSIM history
  const filteredHistory = esimHistory
    .filter(esim => {
      const matchesSearch = esim.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           esim.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           esim.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           esim.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || esim.status === statusFilter
      
      let matchesDate = true
      if (dateRange !== 'all') {
        const now = new Date()
        const esimDate = new Date(esim.assignedDate)
        const daysDiff = Math.floor((now - esimDate) / (1000 * 60 * 60 * 24))
        
        switch (dateRange) {
          case '7days':
            matchesDate = daysDiff <= 7
            break
          case '30days':
            matchesDate = daysDiff <= 30
            break
          case '90days':
            matchesDate = daysDiff <= 90
            break
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy.includes('Date') && aValue && bValue) {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  // Get status display
  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Active', icon: CheckCircle },
      provisioned: { color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Provisioned', icon: Clock },
      expired: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Expired', icon: XCircle },
      cancelled: { color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Cancelled', icon: XCircle }
    }
    return statusConfig[status] || statusConfig.provisioned
  }

  // Handle actions
  const handleViewDetails = (esim) => {
    setSelectedEsim(esim)
    setShowDetailsModal(true)
  }

  const handleRefresh = async () => {
    await fetchEsimHistory({ page: 1 })
    toast.success('eSIM history refreshed')
    console.log('🔄 eSIM history refreshed')
  }

  const handleExportHistory = () => {
    // TODO: Implement export functionality
    toast.success('Export functionality coming soon')
  }

  // Calculate stats
  const stats = {
    total: esimHistory.length,
    active: esimHistory.filter(e => e.status === 'active').length,
    provisioned: esimHistory.filter(e => e.status === 'provisioned').length,
    expired: esimHistory.filter(e => e.status === 'expired').length,
    totalRevenue: esimHistory.reduce((sum, e) => sum + e.price, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">eSIM History</h1>
          <p className="text-muted-foreground">Track eSIM assignments, activations, and usage</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportHistory}
            className="flex items-center space-x-2 px-3 py-2 border border-border text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Smartphone className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total eSIMs</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.active}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50'}`}>
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.provisioned}</p>
              <p className="text-xs text-muted-foreground">Provisioned</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'}`}>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{stats.expired}</p>
              <p className="text-xs text-muted-foreground">Expired</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <DollarSign className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">${stats.totalRevenue.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search eSIMs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-border rounded-lg bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="provisioned">Provisioned</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-border rounded-lg bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-border rounded-lg bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="assignedDate">Assigned Date</option>
                <option value="activatedDate">Activated Date</option>
                <option value="expiryDate">Expiry Date</option>
                <option value="price">Price</option>
                <option value="clientName">Client Name</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredHistory.length} of {esimHistory.length} eSIMs
          </div>
        </div>
      </div>

      {/* eSIM History Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">eSIM ID</th>
                <th className="text-left p-4 font-medium text-foreground">Client</th>
                <th className="text-left p-4 font-medium text-foreground">Plan</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Usage</th>
                <th className="text-left p-4 font-medium text-foreground">Dates</th>
                <th className="text-left p-4 font-medium text-foreground">Price</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Loading eSIM history...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Smartphone className="h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No eSIM history found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHistory.map((esim) => {
                  const statusDisplay = getStatusDisplay(esim.status)
                  const StatusIcon = statusDisplay.icon

                  return (
                    <tr key={esim.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-mono text-sm text-foreground">{esim.id}</p>
                          <p className="text-xs text-muted-foreground">{esim.lastActivity}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{esim.clientName}</p>
                          <p className="text-sm text-muted-foreground">{esim.clientEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{esim.planName}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            <span>{esim.countryName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusDisplay.bg}`}>
                          <StatusIcon className={`h-3 w-3 ${statusDisplay.color}`} />
                          <span className={`text-xs font-medium ${statusDisplay.color}`}>
                            {statusDisplay.label}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        {esim.status === 'active' ? (
                          <div className="space-y-1">
                            <p className="text-sm text-foreground">
                              {esim.dataUsed} / {esim.dataVolume}
                            </p>
                            <div className="w-16 bg-muted rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${
                                  esim.usagePercentage >= 90 ? 'bg-red-500' :
                                  esim.usagePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${esim.usagePercentage}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {esim.usagePercentage.toFixed(1)}%
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {esim.status === 'provisioned' ? 'Not activated' : 'N/A'}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="space-y-1 text-sm">
                          <p className="text-foreground">
                            Assigned: {new Date(esim.assignedDate).toLocaleDateString()}
                          </p>
                          {esim.activatedDate && (
                            <p className="text-muted-foreground">
                              Activated: {new Date(esim.activatedDate).toLocaleDateString()}
                            </p>
                          )}
                          {esim.expiryDate && (
                            <p className="text-muted-foreground">
                              Expires: {new Date(esim.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">${esim.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{esim.currency}</p>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleViewDetails(esim)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* eSIM Details Modal */}
      <EsimDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedEsim(null)
        }}
        esim={selectedEsim}
      />
    </div>
  )
}

export default EsimHistoryPage
