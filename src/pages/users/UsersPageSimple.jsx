import { useState, useEffect } from 'react'
// import { useTheme } from '../../context/ThemeContext' // No longer needed with unified theme system
import toast from 'react-hot-toast'
import { userService } from '../../services/userService'
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
  XCircle,
  Clock,
  DollarSign,
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
    status: 'Active',
    package: 'Premium Data 50GB',
    joinDate: '2024-01-15',
    lastOrder: '2024-01-20',
    totalOrders: 5,
    totalSpent: 750.00,
    supportTickets: 2,
    lastActivity: '2024-01-22'
  },
  {
    id: 2,
    name: 'Fatima Al-Zahra',
    email: 'fatima.alzahra@outlook.com',
    phone: '+971-55-987-6543',
    address: 'Jumeirah, Dubai, UAE',
    city: 'Dubai',
    status: 'Active',
    package: 'Standard Data 20GB',
    joinDate: '2024-01-10',
    lastOrder: '2024-01-18',
    totalOrders: 3,
    totalSpent: 450.00,
    supportTickets: 0,
    lastActivity: '2024-01-21'
  },
  {
    id: 3,
    name: 'Mohammed Al-Rashid',
    email: 'mohammed.rashid@yahoo.com',
    phone: '+971-52-456-7890',
    address: 'Al Ain, Abu Dhabi, UAE',
    city: 'Al Ain',
    status: 'Blocked',
    package: 'Basic Data 10GB',
    joinDate: '2023-12-20',
    lastOrder: '2024-01-05',
    totalOrders: 8,
    totalSpent: 320.00,
    supportTickets: 5,
    lastActivity: '2024-01-15'
  },
  {
    id: 4,
    name: 'Sarah Abdullah',
    email: 'sarah.abdullah@gmail.com',
    phone: '+971-56-234-5678',
    address: 'Sharjah City, Sharjah, UAE',
    city: 'Sharjah',
    status: 'Active',
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
    status: 'Inactive',
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
  // const { resolvedTheme } = useTheme() // No longer needed with unified theme system
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
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

  // Fetch users from API
  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true)
      console.log('🔄 Fetching users from API:', params)

      const response = await userService.getAllUsers({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        search: params.search || searchTerm,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        ordering: params.ordering || '-date_joined'
      })

      if (response.success) {
        const formattedUsers = userService.formatUsersList(response.data.results)
        setUsers(formattedUsers)
        setPagination(response.data.pagination)
        console.log('✅ Users loaded successfully:', formattedUsers.length, 'users')
      } else {
        // Fallback to sample data if API fails
        console.warn('User API failed, using sample data:', response.error)
        const fallbackUsers = sampleUsers.map(user => ({
          ...user,
          role: 'public_user',
          roleDisplay: 'Public User',
          statusDisplay: user.status,
          joinDate: user.joinDate,
          phone: user.phone,
          name: user.name,
          email: user.email
        }))
        setUsers(fallbackUsers)
        toast.error('Failed to load users from server, showing sample data')
      }
    } catch (error) {
      console.error('❌ Failed to fetch users:', error)
      // Fallback to sample data
      const fallbackUsers = sampleUsers.map(user => ({
        ...user,
        role: 'public_user',
        roleDisplay: 'Public User',
        statusDisplay: user.status,
        joinDate: user.joinDate,
        phone: user.phone,
        name: user.name,
        email: user.email
      }))
      setUsers(fallbackUsers)
      toast.error('Failed to load users, showing sample data')
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
      const matchesStatus = user.status.toLowerCase() === statusFilter.toLowerCase()
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

  const handleToggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      const response = await userService.updateUser(userId, {
        is_active: newStatus === 'active'
      })

      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(u =>
          u.id === userId
            ? { ...u, status: newStatus, statusDisplay: newStatus === 'active' ? 'Active' : 'Inactive' }
            : u
        ))
        toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
        console.log('✅ User status updated:', userId, newStatus)
      } else {
        toast.error(response.error || 'Failed to update user status')
        console.error('❌ Failed to update user status:', response.error)
      }
    } catch (error) {
      console.error('❌ Failed to toggle user status:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return
    }

    try {
      const response = await userService.deleteUser(userId)

      if (response.success) {
        // Remove from local state
        setUsers(prev => prev.filter(u => u.id !== userId))
        toast.success('User deleted successfully')
        console.log('✅ User deleted:', userId)
      } else {
        toast.error(response.error || 'Failed to delete user')
        console.error('❌ Failed to delete user:', response.error)
      }
    } catch (error) {
      console.error('❌ Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleEditUser = (user) => {
    // TODO: Implement edit user modal or navigate to edit page
    toast.info('Edit user functionality coming soon')
    console.log('Edit user:', user)
  }

  const handleRefresh = async () => {
    await fetchUsers({ page: 1 })
    await fetchUserStats()
    toast.success('Users list refreshed')
    console.log('🔄 Users list refreshed')
  }

  const handleViewOrders = (user) => {
    // TODO: Implement view orders functionality
    toast.info('View orders functionality coming soon')
    console.log('View orders for user:', user)
  }

  const handleViewTickets = (user) => {
    // TODO: Implement view tickets functionality
    toast.info('View tickets functionality coming soon')
    console.log('View tickets for user:', user)
  }

  const handleBlockUser = async (userId) => {
    try {
      const user = users.find(u => u.id === userId)
      if (!user) return

      const newStatus = user.status === 'blocked' ? 'active' : 'blocked'
      const response = await userService.updateUser(userId, {
        is_active: newStatus === 'active'
      })

      if (response.success) {
        // Update local state
        setUsers(prev => prev.map(u =>
          u.id === userId
            ? { ...u, status: newStatus, statusDisplay: newStatus === 'active' ? 'Active' : 'Blocked' }
            : u
        ))
        toast.success(`User ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`)
        console.log('✅ User status updated:', userId, newStatus)
      } else {
        toast.error(response.error || 'Failed to update user status')
        console.error('❌ Failed to update user status:', response.error)
      }
    } catch (error) {
      console.error('❌ Failed to block/unblock user:', error)
      toast.error('Failed to update user status')
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                {/* User Details */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="text-xs text-muted-foreground">Joined: {user.joinDate}</div>
                    </div>
                  </div>
                </td>

                {/* Contact & Location */}
                <td className="px-6 py-4">
                  <div className="text-sm text-foreground">
                    <div className="flex items-center mb-1">
                      <Phone className="h-3 w-3 text-muted-foreground mr-1" />
                      {user.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs">{user.address}</span>
                    </div>
                  </div>
                </td>

                {/* Package & Status */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs text-foreground">{user.package}</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active'
                        ? 'bg-success/10 text-success border border-success/20'
                        : user.status === 'Blocked'
                        ? 'bg-destructive/10 text-destructive border border-destructive/20'
                        : 'bg-warning/10 text-warning border border-warning/20'
                    }`}>
                      {user.status === 'Active' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {user.status === 'Blocked' && <XCircle className="h-3 w-3 mr-1" />}
                      {user.status === 'Inactive' && <Clock className="h-3 w-3 mr-1" />}
                      {user.status}
                    </span>
                  </div>
                </td>

                {/* Activity & Orders */}
                <td className="px-6 py-4">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center">
                      <ShoppingBag className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs">{user.totalOrders} orders</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 text-muted-foreground mr-1" />
                      <span className="text-xs font-medium">${user.totalSpent}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Last: {user.lastActivity}</div>
                  </div>
                </td>

                {/* Support */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 text-muted-foreground mr-1" />
                    <span className={`text-xs ${user.supportTickets > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      {user.supportTickets} tickets
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
                      onClick={() => handleToggleUserStatus(user.id)}
                      className={`p-1 transition-colors ${
                        user.status === 'active'
                          ? 'text-destructive hover:text-destructive/80'
                          : 'text-success hover:text-success/80'
                      }`}
                      title={user.status === 'active' ? 'Deactivate User' : 'Activate User'}
                    >
                      {user.status === 'active' ? <UserX className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
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
            ))}
          </tbody>
        </table>
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
                    <p className="text-foreground">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-foreground">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground">{selectedUser.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                    <p className="text-foreground">{selectedUser.joinDate}</p>
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
                      selectedUser.status === 'Active' ? 'text-success' :
                      selectedUser.status === 'Blocked' ? 'text-destructive' : 'text-warning'
                    }`}>
                      {selectedUser.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Package</label>
                    <p className="text-foreground">{selectedUser.package}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Orders</label>
                    <p className="text-foreground">{selectedUser.totalOrders}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Spent</label>
                    <p className="text-foreground font-medium">${selectedUser.totalSpent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Support Tickets</label>
                    <p className={`font-medium ${selectedUser.supportTickets > 0 ? 'text-destructive' : 'text-success'}`}>
                      {selectedUser.supportTickets}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                    <p className="text-foreground">{selectedUser.lastActivity}</p>
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
                  selectedUser.status === 'Blocked'
                    ? 'bg-success hover:bg-success/90 text-success-foreground'
                    : 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                }`}
              >
                {selectedUser.status === 'Blocked' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                <span>{selectedUser.status === 'Blocked' ? 'Unblock User' : 'Block User'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPageSimple
