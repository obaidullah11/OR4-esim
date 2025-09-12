import { useState, useEffect } from 'react'
// import { useTheme } from '../../context/ThemeContext' // No longer needed with unified theme system
import toast from 'react-hot-toast'
import { userService } from '../../services/userService'
import { clientService } from '../../services/clientService'
import ConfirmationModal from '../../components/common/ConfirmationModal'
import ScrollableTable from '../../components/common/ScrollableTable'
import PhoneInput from '../../components/common/PhoneInput'
import { UsersEmptyState } from '../../components/common/EmptyState'
import { UsersLoadingState } from '../../components/common/LoadingState'
import { API_CONFIG, API_ENDPOINTS, buildApiUrl } from '../../config/api'
import {
  Search,
  Users,
  Eye,
  Edit,
  Trash2,
  Filter,
  Phone,
  MapPin,
  Package,
  CreditCard,
  MessageSquare,
  History,
  Ban,
  CheckCircle,
  RefreshCw,
  XCircle,
  Clock,
  DollarSign,
  X,
  ShoppingBag,
  UserX
} from 'lucide-react'

// Enhanced sample data for Public Users (App SIM Buyers)
const sampleUsers = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@gmail.com',
    phone: '+971-50-123-4567',
    address: 'Al Karama, Dubai, UAE',
    city: 'Dubai',
    status: 'active',
    package: 'Premium Data 50GB',
    joinDate: '2024-01-15T10:30:00Z',
    lastOrder: '2024-01-20',
    totalOrders: 5,
    totalSpent: 750.00,
    supportTickets: 2,
    lastActivity: '2024-01-22T14:45:00Z'
  },
  {
    id: 2,
    name: 'Fatima Al-Zahra',
    email: 'fatima.alzahra@outlook.com',
    phone: '+971-55-987-6543',
    address: 'Jumeirah, Dubai, UAE',
    city: 'Dubai',
    status: 'active',
    package: 'Standard Data 20GB',
    joinDate: '2024-01-10',
    lastOrder: '2024-01-18',
    totalOrders: 3,
    totalSpent: 450.00,
    supportTickets: 0,
    lastActivity: '2024-01-21T09:15:00Z'
  },
  {
    id: 3,
    name: 'Mohammed Al-Rashid',
    email: 'mohammed.rashid@yahoo.com',
    phone: '+971-52-456-7890',
    address: 'Al Ain, Abu Dhabi, UAE',
    city: 'Al Ain',
    status: 'blocked',
    package: 'Basic Data 10GB',
    joinDate: '2023-12-20',
    lastOrder: '2024-01-05',
    totalOrders: 8,
    totalSpent: 320.00,
    supportTickets: 5,
    lastActivity: '2024-01-15T16:20:00Z'
  },
  {
    id: 4,
    name: 'Sarah Abdullah',
    email: 'sarah.abdullah@gmail.com',
    phone: '+971-56-234-5678',
    address: 'Sharjah City, Sharjah, UAE',
    city: 'Sharjah',
    status: 'active',
    package: 'Premium Data 50GB',
    joinDate: '2024-01-08',
    lastOrder: '2024-01-19',
    totalOrders: 4,
    totalSpent: 600.00,
    supportTickets: 1,
    lastActivity: '2024-01-22'
  },
  {
    id: 5,
    name: 'Omar Al-Mansoori',
    email: 'omar.mansoori@hotmail.com',
    phone: '+971-50-345-6789',
    address: 'Ras Al Khaimah, UAE',
    city: 'Ras Al Khaimah',
    status: 'inactive',
    package: 'Standard Data 20GB',
    joinDate: '2023-11-25',
    lastOrder: '2023-12-30',
    totalOrders: 2,
    totalSpent: 200.00,
    supportTickets: 3,
    lastActivity: '2024-01-10'
  }
]

function UsersPageSimple() {
  // Utility function to format dates and times
  const formatDateTime = (dateString) => {
    if (!dateString || dateString === 'N/A' || dateString === 'Never') {
      return 'N/A'
    }
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'N/A'
      }
      
      // Format as "Jan 15, 2024 at 2:30 PM"
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
      
      // Format as "Jan 15, 2024"
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'N/A'
    }
  }

  // const { resolvedTheme } = useTheme() // No longer needed with unified theme system
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUserForDelete, setSelectedUserForDelete] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showOrdersModal, setShowOrdersModal] = useState(false)
  const [showTicketsModal, setShowTicketsModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [selectedUserForBlock, setSelectedUserForBlock] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null)
  const [editFormData, setEditFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    country_code: 'PK', // Default to Pakistan
    address: '',
    city: '',
    country: '',
    passport_number: '',
    national_id: '',
    country_of_travel: '',
    date_of_travel: '',
    preferred_package: '',
    preferred_network: ''
  })
  const [availablePlans, setAvailablePlans] = useState([])
  const [availableNetworks, setAvailableNetworks] = useState([])
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [userOrders, setUserOrders] = useState([])
  const [userTickets, setUserTickets] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    resellerUsers: 0,
    clientUsers: 0,
    publicUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0
  })

  // Extract unique cities and packages from sample data for filters
  const cities = [...new Set(sampleUsers.map(user => user.city))]
  const packages = [...new Set(sampleUsers.map(user => user.package))]

  // Fetch clients from API
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true)
      console.log('Fetching clients from API:', params)

      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.CLIENTS.LIST)}?page=${params.page || pagination.page}&page_size=${params.limit || pagination.limit}${params.search ? `&search=${params.search}` : ''}${params.status && params.status !== 'all' ? `&status=${params.status}` : ''}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.results) {
        const formattedUsers = data.results.map(client => ({
          id: client.id,
          name: client.full_name || 'N/A',
          firstName: client.full_name ? client.full_name.split(' ')[0] : 'N/A',
          lastName: client.full_name ? client.full_name.split(' ').slice(1).join(' ') : 'N/A',
          email: client.email || 'N/A',
          phone: client.phone_number || 'N/A',
          phoneCountryCode: client.phone_number ? '+92' : 'N/A', // Default to Pakistan
          phoneNumber: client.phone_number || 'N/A',
          role: 'client',
          roleDisplay: 'Client',
          status: client.status || 'active',
          statusDisplay: client.status === 'active' ? 'Unblocked' : 'Blocked',
          isActive: client.status === 'active',
          joinDate: formatDate(client.created_at),
          lastLogin: formatDateTime(client.last_activity),
          address: 'N/A', // Not in this response, will be loaded in edit
          city: 'N/A', // Not in this response, will be loaded in edit
          country: 'Pakistan', // Default for Pakistani clients
          package: client.current_plan || 'N/A',
          totalOrders: client.statistics?.total_orders || 0,
          totalSpent: client.statistics?.total_spent || 0,
          supportTickets: 0, // Will be loaded separately
          lastActivity: formatDateTime(client.last_activity),
          createdAt: client.created_at,
          updatedAt: client.updated_at,
          // Client-specific fields for editing
          clientData: {
            full_name: client.full_name,
            email: client.email,
            phone_number: client.phone_number,
            address: '', // Will be loaded when editing
            city: '', // Will be loaded when editing
            country: 'Pakistan', // Default
            passport_number: '', // Will be loaded when editing
            national_id: '', // Will be loaded when editing
            country_of_travel: '', // Will be loaded when editing
            date_of_travel: '', // Will be loaded when editing
            preferred_package: client.current_plan || '',
            preferred_network: '',
            tier: client.tier,
            client_type: client.client_type,
            reseller: client.reseller
          }
        }))
        
        setUsers(formattedUsers)
        setPagination(prev => ({
          ...prev,
          page: params.page || prev.page,
          limit: params.limit || prev.limit,
          total: data.count || 0,
          totalPages: Math.ceil((data.count || 0) / (params.limit || prev.limit))
        }))
        console.log('Clients loaded successfully:', formattedUsers.length, 'clients')
      } else {
        console.error('Client API failed:', data.message || 'Unknown error')
        toast.error('Failed to load clients from server')
        setUsers([])
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      
      // Handle specific error cases
      if (error.message && error.message.includes('404')) {
        console.log('Some users may have been deleted, continuing with available data')
        // Don't show error toast for 404s as they might be expected after deletions
      } else {
        toast.error('Network error. Please check your connection.')
      }
      
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      const response = await userService.getUserStatistics()
      if (response.success) {
        setUserStats(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch user statistics:', error)
    }
  }

  // Load users on component mount
  useEffect(() => {
    fetchUsers()
    fetchUserStats()
  }, [])

  // Reload users when search or filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers({ page: 1 })
    }, 500) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, roleFilter])

  // Filter users (now handled by backend, but keep for local fallback)
  const filteredUsers = users.filter(user => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = user.name.toLowerCase().includes(searchLower) ||
                           user.email.toLowerCase().includes(searchLower) ||
                           user.phone.includes(searchTerm)
      if (!matchesSearch) return false
    }

    if (statusFilter !== 'all') {
      let matchesStatus = false
      if (statusFilter === 'blocked') {
        // Match both 'blocked' and 'inactive' statuses for blocked filter
        matchesStatus = user.status.toLowerCase() === 'blocked' || user.status.toLowerCase() === 'inactive'
      } else {
        matchesStatus = user.status.toLowerCase() === statusFilter.toLowerCase()
      }
      if (!matchesStatus) return false
    }

    if (roleFilter !== 'all') {
      const matchesRole = user.role === roleFilter
      if (!matchesRole) return false
    }

    if (cityFilter !== 'all') {
      const matchesCity = user.city === cityFilter
      if (!matchesCity) return false
    }

    if (packageFilter !== 'all') {
      const matchesPackage = user.package === packageFilter
      if (!matchesPackage) return false
    }

    return true
  })

  // Handler functions
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }



  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    
    setSelectedUserForDelete(user)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!selectedUserForDelete) return

    try {
      const response = await clientService.deleteClient(selectedUserForDelete.id)

      if (response.success) {
        // Remove from local state immediately
        setUsers(prev => prev.filter(u => u.id !== selectedUserForDelete.id))
        
        // Update pagination total count
        setPagination(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
          totalPages: Math.ceil(Math.max(0, prev.total - 1) / prev.limit)
        }))
        
        toast.success('User deleted successfully')
        console.log('User deleted:', selectedUserForDelete.id)
        
        // Refresh the user list from server to ensure consistency
        setTimeout(() => {
          fetchUsers({ page: pagination.page })
        }, 500)
      } else {
        toast.error(response.error || 'Failed to delete user')
        console.error('Failed to delete user:', response.error)
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    } finally {
      setShowDeleteModal(false)
      setSelectedUserForDelete(null)
    }
  }

  // Fetch available plans for dropdown
  const fetchAvailablePlans = async () => {
    try {
      setLoadingPlans(true)
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ESIM.AVAILABLE_PLANS), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const plans = data.success ? data.plans || data.data : []
        
        // Format plans for dropdown
        const formattedPlans = plans.map(plan => ({
          value: plan.name || plan.bundle_name || plan.id,
          label: `${plan.name || plan.bundle_name} - ${plan.country} (${plan.data_volume || plan.dataVolume})`
        }))
        
        setAvailablePlans(formattedPlans)
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error)
      // Set some default plans if API fails
      setAvailablePlans([
        { value: 'Basic Data 1GB', label: 'Basic Data 1GB - Global' },
        { value: 'Standard Data 5GB', label: 'Standard Data 5GB - Regional' },
        { value: 'Premium Data 10GB', label: 'Premium Data 10GB - Global' },
        { value: 'Unlimited Data', label: 'Unlimited Data - Premium' }
      ])
    } finally {
      setLoadingPlans(false)
    }
  }

  // Fetch available networks for dropdown
  const fetchAvailableNetworks = async () => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.PLANS) + 'networks/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const networks = data.success ? data.networks || data.data : []
        
        // Format networks for dropdown
        const formattedNetworks = networks.map(network => ({
          value: network.name || network.network_name || network.id,
          label: `${network.name || network.network_name} - ${network.country || 'Global'}`
        }))
        
        setAvailableNetworks(formattedNetworks)
      }
    } catch (error) {
      console.error('Failed to fetch networks:', error)
      // Set some default networks if API fails
      setAvailableNetworks([
        { value: 'Vodafone', label: 'Vodafone - Global' },
        { value: 'Orange', label: 'Orange - Europe' },
        { value: 'T-Mobile', label: 'T-Mobile - Americas' },
        { value: 'Telefonica', label: 'Telefonica - LATAM' },
        { value: 'MTN', label: 'MTN - Africa' }
      ])
    }
  }

  const handleEditUser = async (user) => {
    setSelectedUserForEdit(user)
    setShowEditModal(true)
    
    // Fetch plans and networks for dropdowns
    fetchAvailablePlans()
    fetchAvailableNetworks()
    
    try {
      // Fetch full client details for editing
      console.log('Fetching full client details for editing:', user.id)
      
      const response = await fetch(buildApiUrl(API_ENDPOINTS.CLIENTS.DETAIL.replace('{id}', user.id)), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const clientDetails = data.success ? data.data : data // Handle both response formats
      
      // Extract country code and phone number
      const fullPhone = clientDetails.phone_number || user.phone || ''
      let countryCode = 'PK' // Default to Pakistan
      let phoneNumber = fullPhone
      
      // Try to extract country code from full phone number
      if (fullPhone.startsWith('+92')) {
        countryCode = 'PK'
        phoneNumber = fullPhone.replace('+92', '').trim()
      } else if (fullPhone.startsWith('+1')) {
        countryCode = 'US'
        phoneNumber = fullPhone.replace('+1', '').trim()
      } else if (fullPhone.startsWith('+44')) {
        countryCode = 'GB'
        phoneNumber = fullPhone.replace('+44', '').trim()
      } else if (fullPhone.startsWith('+91')) {
        countryCode = 'IN'
        phoneNumber = fullPhone.replace('+91', '').trim()
      }
      // Add more country codes as needed
      
      // Populate form with full client details
      setEditFormData({
        full_name: clientDetails.full_name || user.name || '',
        email: clientDetails.email || user.email || '',
        phone_number: phoneNumber,
        country_code: countryCode,
        address: clientDetails.address || '',
        city: clientDetails.city || '',
        country: clientDetails.country || 'Pakistan',
        passport_number: clientDetails.passport_number || '',
        national_id: clientDetails.national_id || '',
        country_of_travel: clientDetails.country_of_travel || '',
        date_of_travel: clientDetails.date_of_travel || '',
        preferred_package: clientDetails.preferred_package || clientDetails.current_plan || '',
        preferred_network: clientDetails.preferred_network || ''
      })
      
      console.log('Client details loaded for editing:', clientDetails.full_name)
    } catch (error) {
      console.error('Failed to fetch client details:', error)
      // Fallback to basic data from the list
      const clientData = user.clientData || {}
      
      // Extract country code and phone number for fallback
      const fallbackPhone = clientData.phone_number || user.phone || ''
      let fallbackCountryCode = 'PK' // Default to Pakistan
      let fallbackPhoneNumber = fallbackPhone
      
      // Try to extract country code from full phone number
      if (fallbackPhone.startsWith('+92')) {
        fallbackCountryCode = 'PK'
        fallbackPhoneNumber = fallbackPhone.replace('+92', '').trim()
      } else if (fallbackPhone.startsWith('+1')) {
        fallbackCountryCode = 'US'
        fallbackPhoneNumber = fallbackPhone.replace('+1', '').trim()
      } else if (fallbackPhone.startsWith('+44')) {
        fallbackCountryCode = 'GB'
        fallbackPhoneNumber = fallbackPhone.replace('+44', '').trim()
      } else if (fallbackPhone.startsWith('+91')) {
        fallbackCountryCode = 'IN'
        fallbackPhoneNumber = fallbackPhone.replace('+91', '').trim()
      }
      
      setEditFormData({
        full_name: clientData.full_name || user.name || '',
        email: clientData.email || user.email || '',
        phone_number: fallbackPhoneNumber,
        country_code: fallbackCountryCode,
        address: '',
        city: '',
        country: 'Pakistan',
        passport_number: '',
        national_id: '',
        country_of_travel: '',
        date_of_travel: '',
        preferred_package: clientData.preferred_package || user.package || '',
        preferred_network: ''
      })
      toast.error('Could not load full client details, using basic information')
    }
  }

  const handleEditFormSubmit = async () => {
    if (!selectedUserForEdit) return

    // Validate that at least one ID (passport or national ID) is provided
    if (!editFormData.passport_number.trim() && !editFormData.national_id.trim()) {
      toast.error('Please provide either a Passport Number or National ID/CNIC for identification.')
      return
    }

    try {
      console.log('Updating client:', selectedUserForEdit.id, editFormData)
      
      // Prepare data with full phone number and proper date format
      const updateData = {
        ...editFormData,
        phone_number: editFormData.country_code && editFormData.phone_number 
          ? `+${editFormData.country_code === 'PK' ? '92' : 
               editFormData.country_code === 'US' ? '1' :
               editFormData.country_code === 'GB' ? '44' :
               editFormData.country_code === 'IN' ? '91' : '92'}${editFormData.phone_number}`
          : editFormData.phone_number,
        // Ensure date_of_travel is in YYYY-MM-DD format
        date_of_travel: editFormData.date_of_travel || null
      }
      
      const response = await fetch(buildApiUrl(API_ENDPOINTS.CLIENTS.UPDATE.replace('{id}', selectedUserForEdit.id)), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success || response.ok) {
        // Update local state
        setUsers(prev => prev.map(u =>
          u.id === selectedUserForEdit.id
            ? { 
                ...u, 
                name: editFormData.full_name,
                firstName: editFormData.full_name ? editFormData.full_name.split(' ')[0] : '',
                lastName: editFormData.full_name ? editFormData.full_name.split(' ').slice(1).join(' ') : '',
                email: editFormData.email,
                phone: editFormData.phone_number,
                address: editFormData.address,
                city: editFormData.city,
                country: editFormData.country,
                package: editFormData.preferred_package,
                clientData: {
                  ...u.clientData,
                  ...editFormData
                }
              }
            : u
        ))
        toast.success('Client updated successfully')
        console.log('Client updated successfully:', selectedUserForEdit.email)
        setShowEditModal(false)
        setSelectedUserForEdit(null)
      } else {
        toast.error(data.message || 'Failed to update client')
        console.error('Failed to update client:', data.message)
      }
    } catch (error) {
      console.error('Failed to update client:', error)
      toast.error('Failed to update client')
    }
  }

  const handleRefresh = async () => {
    await fetchUsers({ page: 1 })
    await fetchUserStats()
    toast.success('Users list refreshed')
    console.log('Users list refreshed')
  }

  const handleViewOrders = async (user) => {
    setSelectedUser(user)
    setShowOrdersModal(true)
    setLoadingOrders(true)
    
    try {
      // Fetch real orders from backend API
      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.ORDERS.LIST)}?user_id=${user.id}`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Format orders data for display
        const formattedOrders = data.data.map(order => ({
          id: order.id,
          orderNumber: order.order_number || `ORD-${order.id}`,
          date: formatDate(order.created_at),
          amount: parseFloat(order.total_amount || 0),
          status: order.status,
          items: order.items ? order.items.map(item => item.name || item.description) : ['eSIM Package']
        }))
        
        setUserOrders(formattedOrders)
        console.log('Loaded orders for user:', user.email, formattedOrders.length, 'orders')
      } else {
        console.warn('API returned success=false:', data.message)
        setUserOrders([])
      }
    } catch (error) {
      console.error('Failed to load user orders:', error)
      toast.error('Failed to load user orders')
      setUserOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  const handleViewTickets = async (user) => {
    setSelectedUser(user)
    setShowTicketsModal(true)
    setLoadingTickets(true)
    
    try {
      // First, we need to get the client profile for this user, then fetch support tickets
      // The correct endpoint is /api/v1/clients/{client_id}/support_tickets/
      // Since we have user data, we need to find their client profile first
      const clientResponse = await fetch(`${buildApiUrl(API_ENDPOINTS.CLIENTS.LIST)}?user_id=${user.id}`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      if (!clientResponse.ok) {
        throw new Error(`Failed to find client profile: ${clientResponse.status}`)
      }
      
      const clientData = await clientResponse.json()
      
      if (!clientData.success || !clientData.data || clientData.data.length === 0) {
        // No client profile found - user might not have support tickets
        setUserTickets([])
        setLoadingTickets(false)
        return
      }
      
      const clientId = clientData.data[0].id
      
      // Now fetch support tickets for this client
      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.CLIENTS.DETAIL.replace('{id}', clientId))}support_tickets/`, {
        method: 'GET',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Format tickets data for display
        const formattedTickets = data.data.map(ticket => ({
          id: ticket.id,
          ticketNumber: ticket.ticket_number || `TKT-${ticket.id}`,
          subject: ticket.subject || 'Support Request',
          status: ticket.status || 'open',
          priority: ticket.priority || 'medium',
          createdAt: formatDate(ticket.created_at),
          lastUpdate: formatDate(ticket.updated_at)
        }))
        
        setUserTickets(formattedTickets)
        console.log('Loaded tickets for user:', user.email, formattedTickets.length, 'tickets')
      } else {
        console.warn('API returned success=false:', data.message)
        setUserTickets([])
      }
    } catch (error) {
      console.error('Failed to load user tickets:', error)
      toast.error('Failed to load user tickets')
      setUserTickets([])
    } finally {
      setLoadingTickets(false)
    }
  }

  const handleBlockUser = (userId) => {
    const user = users.find(u => u.id === userId)
    if (!user) return
    
    setSelectedUserForBlock(user)
    setShowBlockModal(true)
  }

  const confirmBlockUser = async (reason) => {
    if (!selectedUserForBlock) return

    try {
      console.log('Blocking/Unblocking user:', selectedUserForBlock)
      const isCurrentlyBlocked = selectedUserForBlock.status === 'blocked' || !selectedUserForBlock.isActive
      
      // Call the appropriate user blocking/unblocking API
      const action = isCurrentlyBlocked ? 'unblock_user' : 'block_user'
      const response = await fetch(`${buildApiUrl(API_ENDPOINTS.USERS.DETAIL.replace('{id}', selectedUserForBlock.id))}${action}/`, {
        method: 'POST',
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          reason: reason || (isCurrentlyBlocked ? 'Unblocked by administrator' : 'Blocked by administrator')
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Block/Unblock response:', result)

      if (result.success) {
        // Update local state based on the API response
        const newStatus = result.data.is_active ? 'active' : 'blocked'
        setUsers(prev => prev.map(u =>
          u.id === selectedUserForBlock.id
            ? { 
                ...u, 
                status: newStatus, 
                statusDisplay: newStatus === 'active' ? 'Unblocked' : 'Blocked',
                isActive: result.data.is_active
              }
            : u
        ))
        toast.success(result.message || `User ${isCurrentlyBlocked ? 'unblocked' : 'blocked'} successfully`)
        console.log('User status updated:', selectedUserForBlock.email, newStatus)
      } else {
        toast.error(result.error || 'Failed to update user status')
        console.error('Failed to update user status:', result.error)
      }
    } catch (error) {
      console.error('Failed to toggle user status:', error)
      
      // Handle specific error cases
      if (error.message && error.message.includes('Failed to fetch')) {
        toast.error('Connection error. Please check if the server is running.')
      } else if (error.message && error.message.includes('404')) {
        toast.error('User not found. It may have been deleted.')
        // Refresh the user list to remove stale data
        fetchUsers({ page: pagination.page })
      } else {
        toast.error('Failed to update user status: ' + (error.message || 'Unknown error'))
      }
    } finally {
      setShowBlockModal(false)
      setSelectedUserForBlock(null)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Public Users Management</h1>
            <p className="text-muted-foreground">App SIM Buyers - {filteredUsers.length} users</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
            <option value="active">Unblocked</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-3 py-1 border border-border rounded-md text-sm focus:ring-2 focus:ring-ring bg-background text-foreground"
          >
            <option value="all">All Packages</option>
            {packages.map(pkg => (
              <option key={pkg} value={pkg}>{pkg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg shadow-soft dark:shadow-dark-soft border border-border overflow-hidden">
        {/* Table Controls */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Show:</label>
              <select
                value={pagination.limit}
                onChange={(e) => {
                  const newLimit = parseInt(e.target.value)
                  setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }))
                  fetchUsers({ page: 1, limit: newLimit })
                }}
                className="px-3 py-1 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                User Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Contact & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Package & Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Activity & Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Support
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {loading ? (
              <UsersLoadingState />
            ) : filteredUsers.length === 0 ? (
              <UsersEmptyState />
            ) : (
            filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                {/* User Details */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'NA'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">{user.name || 'N/A'}</div>
                      <div className="text-sm text-muted-foreground">{user.email || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">Joined: {user.joinDate || 'N/A'}</div>
                    </div>
                  </div>
                </td>

                {/* Contact & Location */}
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    <div className="flex items-center mb-1">
                      <Phone className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs">{user.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs">{user.address || 'N/A'}</span>
                    </div>
                  </div>
                </td>

                {/* Package & Status */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs text-foreground">{user.package || 'N/A'}</span>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'active' || user.status === 'Active'
                        ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                        : user.status === 'blocked' || user.status === 'Blocked' || user.status === 'inactive' || user.status === 'Inactive'
                        ? 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800'
                    }`}>
                      {(user.status === 'active' || user.status === 'Active') && <CheckCircle className="h-3 w-3 mr-1" />}
                      {(user.status === 'blocked' || user.status === 'Blocked' || user.status === 'inactive' || user.status === 'Inactive') && <XCircle className="h-3 w-3 mr-1" />}
                      {user.status === 'active' || user.status === 'Active' ? 'Unblocked' :
                       user.status === 'blocked' || user.status === 'Blocked' ? 'Blocked' :
                       user.status === 'inactive' || user.status === 'Inactive' ? 'Blocked' : 
                       user.status || 'Unknown'}
                    </span>
                  </div>
                </td>

                {/* Activity & Orders */}
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center">
                      <ShoppingBag className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs">{user.totalOrders || 0} orders</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs font-medium">${user.totalSpent || '0.00'}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last: {user.lastActivity || 'N/A'}</div>
                  </div>
                </td>

                {/* Support */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className={`text-xs ${(user.supportTickets || 0) > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      {user.supportTickets || 0} tickets
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="p-1 text-primary hover:text-primary/80 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-1 text-success hover:text-success/80 transition-colors"
                      title="Edit User"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleBlockUser(user.id)}
                      className={`p-1 transition-colors ${
                        user.status === 'blocked' || !user.isActive
                          ? 'text-success hover:text-success/80'
                          : 'text-destructive hover:text-destructive/80'
                      }`}
                      title={user.status === 'blocked' || !user.isActive ? 'Unblock User' : 'Block User'}
                    >
                      {user.status === 'blocked' || !user.isActive ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-destructive hover:text-destructive/80 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
        </div>

        {/* Pagination Navigation */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const newPage = pagination.page - 1
                setPagination(prev => ({ ...prev, page: newPage }))
                fetchUsers({ page: newPage, limit: pagination.limit })
              }}
              disabled={pagination.page <= 1}
              className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setPagination(prev => ({ ...prev, page: pageNum }))
                      fetchUsers({ page: pageNum, limit: pagination.limit })
                    }}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      pagination.page === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground bg-background border border-border hover:bg-muted'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => {
                const newPage = pagination.page + 1
                setPagination(prev => ({ ...prev, page: newPage }))
                fetchUsers({ page: newPage, limit: pagination.limit })
              }}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No users found matching your search.</p>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-border shadow-soft dark:shadow-dark-soft">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">User Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b border-border pb-2">Personal Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-foreground">{selectedUser.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{selectedUser.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground">{selectedUser.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground">{selectedUser.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                    <p className="text-foreground">{selectedUser.joinDate || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Account & Activity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground border-b border-border pb-2">Account & Activity</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <p className={`font-medium ${
                      selectedUser.status === 'active' || selectedUser.status === 'Active' ? 'text-green-600' :
                      selectedUser.status === 'blocked' || selectedUser.status === 'Blocked' || selectedUser.status === 'inactive' || selectedUser.status === 'Inactive' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {selectedUser.status === 'active' || selectedUser.status === 'Active' ? 'Unblocked' :
                       selectedUser.status === 'blocked' || selectedUser.status === 'Blocked' ? 'Blocked' :
                       selectedUser.status === 'inactive' || selectedUser.status === 'Inactive' ? 'Blocked' : 
                       selectedUser.status || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Package</label>
                    <p className="text-foreground">{selectedUser.package || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                    <p className="text-foreground">{selectedUser.totalOrders || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Spent</label>
                    <p className="text-foreground font-medium">${selectedUser.totalSpent || '0.00'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Support Tickets</label>
                    <p className={`font-medium ${(selectedUser.supportTickets || 0) > 0 ? 'text-destructive' : 'text-success'}`}>
                      {selectedUser.supportTickets || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                    <p className="text-foreground">{selectedUser.lastActivity || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={() => handleViewOrders(selectedUser)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center space-x-2 transition-colors"
              >
                <History className="h-4 w-4" />
                <span>View Orders</span>
              </button>
              <button
                onClick={() => handleViewTickets(selectedUser)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 flex items-center space-x-2 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                <span>View Tickets</span>
              </button>
              <button
                onClick={() => {
                  handleBlockUser(selectedUser.id)
                  setShowUserDetails(false)
                }}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  selectedUser.status === 'blocked' || selectedUser.status === 'Blocked' || selectedUser.status === 'inactive'
                    ? 'bg-success hover:bg-success/90 text-success-foreground'
                    : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                }`}
              >
                {(selectedUser.status === 'blocked' || selectedUser.status === 'Blocked' || selectedUser.status === 'inactive') ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                <span>{(selectedUser.status === 'blocked' || selectedUser.status === 'Blocked' || selectedUser.status === 'inactive') ? 'Unblock User' : 'Block User'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedUserForDelete(null)
        }}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUserForDelete?.fullName || 'this user'}? This action cannot be undone and will permanently remove all user data.`}
        type="danger"
        confirmText="Delete User"
        cancelText="Cancel"
      />

      {/* Block User Modal */}
      <ConfirmationModal
        isOpen={showBlockModal}
        onClose={() => {
          setShowBlockModal(false)
          setSelectedUserForBlock(null)
        }}
        onConfirm={confirmBlockUser}
        title={(selectedUserForBlock?.status === 'blocked' || selectedUserForBlock?.status === 'inactive' || !selectedUserForBlock?.isActive) ? 'Unblock User' : 'Block User'}
        message={(selectedUserForBlock?.status === 'blocked' || selectedUserForBlock?.status === 'inactive' || !selectedUserForBlock?.isActive)
          ? `Are you sure you want to unblock ${selectedUserForBlock?.fullName}? They will regain access to their account.`
          : `Are you sure you want to block ${selectedUserForBlock?.fullName}? They will lose access to their account.`
        }
        type={(selectedUserForBlock?.status === 'blocked' || selectedUserForBlock?.status === 'inactive' || !selectedUserForBlock?.isActive) ? 'info' : 'warning'}
        confirmText={(selectedUserForBlock?.status === 'blocked' || selectedUserForBlock?.status === 'inactive' || !selectedUserForBlock?.isActive) ? 'Unblock User' : 'Block User'}
        cancelText="Cancel"
        showInput={!(selectedUserForBlock?.status === 'blocked' || selectedUserForBlock?.status === 'inactive' || !selectedUserForBlock?.isActive)}
        inputLabel="Reason for blocking"
        inputPlaceholder="Please provide a reason for blocking this user..."
        inputType="textarea"
        inputRequired={!(selectedUserForBlock?.status === 'blocked' || selectedUserForBlock?.status === 'inactive' || !selectedUserForBlock?.isActive)}
      />

      {/* Edit Client Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Edit className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Edit Client Information</h3>
                  <p className="text-sm text-muted-foreground">Update client details and preferences</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUserForEdit(null)
                }}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[calc(95vh-140px)] overflow-y-auto">
              <form onSubmit={(e) => { e.preventDefault(); handleEditFormSubmit(); }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-3 border-b border-border">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Personal Information</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={editFormData.full_name}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Enter full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-foreground">
                        Phone Number
                      </label>
                      <PhoneInput
                        countryCode={editFormData.country_code}
                        phoneNumber={editFormData.phone_number}
                        onCountryChange={(countryCode) => setEditFormData(prev => ({ ...prev, country_code: countryCode }))}
                        onPhoneChange={(phoneNumber) => setEditFormData(prev => ({ ...prev, phone_number: phoneNumber }))}
                        placeholder="Enter phone number"
                        className="transition-colors duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-3 border-b border-border">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Address Information</h4>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Address
                      </label>
                      <textarea
                        value={editFormData.address}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
                        placeholder="Enter full address"
                        rows="3"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          City
                        </label>
                        <input
                          type="text"
                          value={editFormData.city}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="Enter city"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Country
                        </label>
                        <input
                          type="text"
                          value={editFormData.country}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="Enter country"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Travel Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-3 border-b border-border">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Travel Information</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                      <strong>Note:</strong> Please provide either a Passport Number OR National ID (at least one is required for identification).
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Passport Number
                        </label>
                        <input
                          type="text"
                          value={editFormData.passport_number}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, passport_number: e.target.value }))}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="Enter passport number (optional if National ID provided)"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          National ID / CNIC
                        </label>
                        <input
                          type="text"
                          value={editFormData.national_id}
                          onChange={(e) => setEditFormData(prev => ({ ...prev, national_id: e.target.value }))}
                          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          placeholder="Enter national ID/CNIC (optional if Passport provided)"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Country of Travel
                      </label>
                      <input
                        type="text"
                        value={editFormData.country_of_travel}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, country_of_travel: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        placeholder="Enter travel destination"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Date of Travel
                      </label>
                      <input
                        type="date"
                        value={editFormData.date_of_travel}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, date_of_travel: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferences Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-3 border-b border-border">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground">Preferences</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Preferred Package
                      </label>
                      <select
                        value={editFormData.preferred_package}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, preferred_package: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        disabled={loadingPlans}
                      >
                        <option value="">Select preferred package</option>
                        {availablePlans.map((plan) => (
                          <option key={plan.value} value={plan.value}>
                            {plan.label}
                          </option>
                        ))}
                      </select>
                      {loadingPlans && (
                        <p className="text-xs text-muted-foreground">Loading packages...</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Preferred Network
                      </label>
                      <select
                        value={editFormData.preferred_network}
                        onChange={(e) => setEditFormData(prev => ({ ...prev, preferred_network: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                        disabled={loadingPlans}
                      >
                        <option value="">Select preferred network</option>
                        {availableNetworks.map((network) => (
                          <option key={network.value} value={network.value}>
                            {network.label}
                          </option>
                        ))}
                      </select>
                      {loadingPlans && (
                        <p className="text-xs text-muted-foreground">Loading networks...</p>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border bg-muted/20">
              <div className="text-sm text-muted-foreground">
                * Required fields | Either Passport OR National ID required
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedUserForEdit(null)
                  }}
                  className="px-6 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleEditFormSubmit}
                  className="px-6 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Update Client</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Orders Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <History className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">User Orders</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser?.fullName} ({selectedUser?.email})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowOrdersModal(false)
                  setSelectedUser(null)
                  setUserOrders([])
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingOrders ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading orders...</span>
                </div>
              ) : userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-foreground">{order.orderNumber}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <span className="font-semibold text-foreground">${order.amount}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        Date: {order.date}
                      </div>
                      <div className="text-sm text-foreground">
                        Items: {order.items.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found for this user</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Tickets Modal */}
      {showTicketsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Support Tickets</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser?.fullName} ({selectedUser?.email})</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTicketsModal(false)
                  setSelectedUser(null)
                  setUserTickets([])
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {loadingTickets ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading tickets...</span>
                </div>
              ) : userTickets.length > 0 ? (
                <div className="space-y-4">
                  {userTickets.map((ticket) => (
                    <div key={ticket.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-foreground">{ticket.ticketNumber}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.status === 'open' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            ticket.status === 'resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            ticket.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-foreground mb-2">
                        {ticket.subject}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Created: {ticket.createdAt} | Last Update: {ticket.lastUpdate}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No support tickets found for this user</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPageSimple
