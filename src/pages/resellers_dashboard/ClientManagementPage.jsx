import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Smartphone,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Download,
  Upload,
  FileText,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { clientService } from '../../services/clientService'
import ExportClientsModal from '../../components/clients/ExportClientsModal'

// Sample client data with eSIM history
const sampleClients = [
  {
    id: 1,
    fullName: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 555-123-4567',
    passportNumber: 'US123456789',
    nationalId: '',
    countryOfTravel: 'US',
    dateOfTravel: '2024-02-15',
    notes: 'Frequent business traveler',
    status: 'active',
    joinDate: '2024-01-10',
    totalEsims: 3,
    activeEsims: 1,
    totalSpent: 175.00,
    lastActivity: '2 hours ago'
  },
  {
    id: 2,
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+44 20 7123 4567',
    passportNumber: 'UK987654321',
    nationalId: '',
    countryOfTravel: 'UK',
    dateOfTravel: '2024-02-20',
    notes: 'Extended stay client',
    status: 'active',
    joinDate: '2024-01-15',
    totalEsims: 2,
    activeEsims: 1,
    totalSpent: 120.00,
    lastActivity: '1 day ago'
  },
  {
    id: 3,
    fullName: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 555-987-6543',
    passportNumber: '',
    nationalId: 'ID123456789',
    countryOfTravel: 'JP',
    dateOfTravel: '2024-02-25',
    notes: 'First time international traveler',
    status: 'active',
    joinDate: '2024-01-20',
    totalEsims: 1,
    activeEsims: 0,
    totalSpent: 45.00,
    lastActivity: '3 days ago'
  },
  {
    id: 4,
    fullName: 'Emma Rodriguez',
    email: 'emma.rodriguez@email.com',
    phone: '+34 612 345 678',
    passportNumber: 'ES456789123',
    nationalId: '',
    countryOfTravel: 'ES',
    dateOfTravel: '2024-03-01',
    notes: 'Corporate account',
    status: 'active',
    joinDate: '2024-01-25',
    totalEsims: 5,
    activeEsims: 2,
    totalSpent: 325.00,
    lastActivity: '30 minutes ago'
  },
  {
    id: 5,
    fullName: 'David Wilson',
    email: 'david.wilson@email.com',
    phone: '+61 2 9876 5432',
    passportNumber: 'AU789123456',
    nationalId: '',
    countryOfTravel: 'AU',
    dateOfTravel: '2024-03-10',
    notes: 'Inactive for 30 days',
    status: 'inactive',
    joinDate: '2023-12-15',
    totalEsims: 1,
    activeEsims: 0,
    totalSpent: 25.00,
    lastActivity: '30 days ago'
  }
]

// Client Details Modal Component
function ClientDetailsModal({ isOpen, onClose, client, onEdit, onAssignEsim }) {
  const { resolvedTheme } = useTheme()

  if (!isOpen || !client) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
        resolvedTheme === 'dark' ? 'shadow-dark-soft-lg' : 'shadow-soft-lg'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Client Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Client Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Personal Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {client.fullName}</p>
                <p><span className="font-medium">Email:</span> {client.email}</p>
                <p><span className="font-medium">Phone:</span> {client.phone}</p>
                <p><span className="font-medium">Join Date:</span> {new Date(client.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-foreground">Identification</h3>
              <div className="space-y-2 text-sm">
                {client.passportNumber && (
                  <p><span className="font-medium">Passport:</span> {client.passportNumber}</p>
                )}
                {client.nationalId && (
                  <p><span className="font-medium">National ID:</span> {client.nationalId}</p>
                )}
                <p><span className="font-medium">Travel Country:</span> {client.countryOfTravel}</p>
                {client.dateOfTravel && (
                  <p><span className="font-medium">Travel Date:</span> {new Date(client.dateOfTravel).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-muted/30 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-foreground">{client.totalEsims}</p>
              <p className="text-xs text-muted-foreground">Total eSIMs</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-500">{client.activeEsims}</p>
              <p className="text-xs text-muted-foreground">Active eSIMs</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg text-center">
              <p className="text-2xl font-bold text-primary">${(client.totalSpent || 0).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Spent</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg text-center">
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                client.status === 'active' 
                  ? 'bg-green-500/10 text-green-500' 
                  : 'bg-red-500/10 text-red-500'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  client.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span>{client.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Status</p>
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Notes</h3>
              <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                {client.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <button
              onClick={() => onEdit(client)}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Client</span>
            </button>
            <button
              onClick={() => onAssignEsim(client)}
              disabled={client.activeEsims > 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                client.activeEsims > 0
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
              title={client.activeEsims > 0 ? "Client already has active eSIM" : "Assign eSIM"}
            >
              <Smartphone className="h-4 w-4" />
              <span>{client.activeEsims > 0 ? 'eSIM Active' : 'Assign eSIM'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ClientManagementPage() {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [sortBy, setSortBy] = useState('joinDate')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedClientForDelete, setSelectedClientForDelete] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  })
  const [isExporting, setIsExporting] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  // Fetch clients from API
  const fetchClients = async (params = {}) => {
    try {
      setLoading(true)

      const response = await clientService.getMyClients({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        search: params.search || searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        ordering: params.ordering || '-created_at'
      })

      if (response.success) {
        const formattedClients = clientService.formatClientsList(response.data.results)
        setClients(formattedClients)
        setPagination(response.data.pagination)
        console.log('✅ Loaded clients from API:', formattedClients.length, 'clients')
      } else {
        // No fallback to sample data - show error
        console.error('API failed to load clients:', response.error)
        toast.error('Failed to load clients from server')
        setClients([])
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      toast.error('Failed to load clients from server')
      setClients([])
    } finally {
      setLoading(false)
    }
  }

  // Load clients on component mount
  useEffect(() => {
    fetchClients()
  }, [])

  // Reload clients when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchClients({ page: 1 })
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter])

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.phone.includes(searchTerm)
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'joinDate' || sortBy === 'dateOfTravel') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  // Handle client actions
  const handleViewClient = (client) => {
    setSelectedClient(client)
    setShowDetailsModal(true)
  }

  const handleEditClient = (client) => {
    console.log('Edit client:', client)
    // TODO: Navigate to edit client page or open edit modal
    navigate(`/reseller-dashboard/edit-client/${client.id}`)
  }

  const handleAssignEsim = (client) => {
    if (client.activeEsims > 0) {
      toast.error(`${client.fullName} already has ${client.activeEsims} active eSIM(s). Cannot assign another eSIM.`)
      return
    }
    console.log('Assign eSIM to client:', client)
    navigate('/reseller-dashboard/assign-esim', { state: { selectedClient: client } })
  }

  const handleDeleteClient = (client) => {
    setSelectedClientForDelete(client)
    setShowDeleteModal(true)
  }

  const confirmDeleteClient = async () => {
    if (!selectedClientForDelete) return

    try {
      const response = await clientService.deleteClient(selectedClientForDelete.id)

      if (response.success) {
        // Remove from local state
        setClients(prev => prev.filter(c => c.id !== selectedClientForDelete.id))
        toast.success('Client deleted successfully')
        console.log('✅ Client deleted:', selectedClientForDelete.fullName)
      } else {
        toast.error(response.error || 'Failed to delete client')
        console.error('❌ Failed to delete client:', response.error)
      }
    } catch (error) {
      console.error('Failed to delete client:', error)
      toast.error('Failed to delete client')
    } finally {
      setShowDeleteModal(false)
      setSelectedClientForDelete(null)
    }
  }



  const handleRefresh = async () => {
    await fetchClients({ page: 1 })
    toast.success('Client list refreshed')
    console.log('🔄 Client list refreshed')
  }

  const handleQuickExport = async (format = 'csv') => {
    if (isExporting) return // Prevent multiple concurrent exports
    
    try {
      setIsExporting(true)
      console.log(`📄 Quick exporting clients as ${format.toUpperCase()}...`)
      
      // Apply current filters to export
      const filters = {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchTerm || undefined
      }

      // Show initial loading toast
      toast.loading(`Preparing client export as ${format.toUpperCase()}...`, { duration: 2000 })

      const result = await clientService.exportClients(filters, format)
      
      if (result.success) {
        toast.success(result.message || 'Clients exported successfully!')
        console.log('✅ Clients exported successfully')
      } else {
        toast.error(result.error || 'Failed to export clients')
        console.error('❌ Export failed:', result.error)
      }
    } catch (error) {
      console.error('❌ Failed to export clients:', error)
      toast.error('Failed to export clients. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  // Get status display
  const getStatusDisplay = (status) => {
    return {
      active: { color: 'text-green-500', bg: 'bg-green-500/10', label: 'Active' },
      inactive: { color: 'text-red-500', bg: 'bg-red-500/10', label: 'Inactive' }
    }[status] || { color: 'text-gray-500', bg: 'bg-gray-500/10', label: 'Unknown' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">Manage your client database and eSIM assignments</p>
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
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleQuickExport('csv')}
              disabled={isExporting}
              className="flex items-center space-x-2 px-3 py-2 border border-border text-muted-foreground rounded-l-lg hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Quick CSV</span>
                </>
              )}
            </button>
            <button
              onClick={() => handleQuickExport('pdf')}
              disabled={isExporting}
              className="flex items-center space-x-2 px-3 py-2 border border-l-0 border-border text-muted-foreground rounded-r-lg hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-4 w-4" />
              <span>Quick PDF</span>
            </button>
          </div>
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center space-x-2 px-3 py-2 border border-border text-muted-foreground rounded-lg hover:text-foreground hover:bg-muted transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Export</span>
          </button>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{clients.length}</p>
              <p className="text-sm text-muted-foreground">Total Clients</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {clients.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Clients</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'}`}>
              <Smartphone className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {clients.reduce((sum, c) => sum + c.totalEsims, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total eSIMs</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
              <Activity className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {clients.reduce((sum, c) => sum + c.activeEsims, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Active eSIMs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search clients..."
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
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-border rounded-lg bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="joinDate">Join Date</option>
                <option value="fullName">Name</option>
                <option value="totalSpent">Total Spent</option>
                <option value="totalEsims">Total eSIMs</option>
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
            Showing {filteredClients.length} of {clients.length} clients
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Client</th>
                <th className="text-left p-4 font-medium text-foreground">Contact</th>
                <th className="text-left p-4 font-medium text-foreground">Travel Info</th>
                <th className="text-left p-4 font-medium text-foreground">eSIM Stats</th>
                <th className="text-left p-4 font-medium text-foreground">Spending</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="text-muted-foreground">Loading clients...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <Users className="h-12 w-12 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No clients found</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const statusDisplay = getStatusDisplay(client.status)

                  return (
                    <tr key={client.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-foreground">{client.fullName}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(client.joinDate).toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground">{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground">{client.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-sm">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span className="text-foreground">{client.countryOfTravel}</span>
                          </div>
                          {client.dateOfTravel && (
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {new Date(client.dateOfTravel).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{client.totalEsims}</span> total
                          </p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-green-500">
                              <span className="font-medium">{client.activeEsims}</span> active
                            </p>
                            {client.activeEsims > 0 && (
                              <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                eSIM Active
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-foreground">${(client.totalSpent || 0).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Total spent</p>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusDisplay.bg}`}>
                            <div className={`w-2 h-2 rounded-full ${statusDisplay.color.replace('text-', 'bg-')}`} />
                            <span className={`text-xs font-medium ${statusDisplay.color}`}>
                              {statusDisplay.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{client.lastActivity}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewClient(client)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditClient(client)}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            title="Edit Client"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleAssignEsim(client)}
                            disabled={client.activeEsims > 0}
                            className={`p-2 rounded-lg transition-colors ${
                              client.activeEsims > 0 
                                ? 'text-muted-foreground/50 cursor-not-allowed' 
                                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                            }`}
                            title={client.activeEsims > 0 ? `Client has ${client.activeEsims} active eSIM(s) - Cannot assign more` : "Assign eSIM to this client"}
                          >
                            <Smartphone className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClient(client)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Client"
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
        </div>
      </div>

      {/* Client Details Modal */}
      <ClientDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false)
          setSelectedClient(null)
        }}
        client={selectedClient}
        onEdit={handleEditClient}
        onAssignEsim={handleAssignEsim}
      />

      {/* Delete Client Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedClientForDelete(null)
        }}
        onConfirm={confirmDeleteClient}
        title="Delete Client"
        message={`Are you sure you want to delete ${selectedClientForDelete?.fullName}? This action cannot be undone and will permanently remove all client data including their eSIM history.`}
        type="danger"
        confirmText="Delete Client"
        cancelText="Cancel"
      />

      {/* Export Modal */}
      <ExportClientsModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        currentFilters={{
          status: statusFilter,
          search: searchTerm
        }}
      />
    </div>
  )
}

export default ClientManagementPage
