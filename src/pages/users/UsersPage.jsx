import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import {
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
  MapPin,
  Phone,
  Mail,
  Package,
  Ban,
  Shield,
  MessageSquare,
  History
} from 'lucide-react'
// TEMPORARILY COMMENTED OUT - Modal causing issues
// import UserDetailsModal from '../../components/users/UserDetailsModal'

// Sample user data
const sampleUsers = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    firstName: 'Ahmed',
    lastName: 'Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+971 50 123 4567',
    city: 'Dubai',
    address: 'Al Barsha, Dubai, UAE',
    status: 'active',
    joinDate: '2024-01-15',
    totalOrders: 5,
    totalSpent: 450,
    currentPackage: 'Premium 30GB',
    lastActivity: '2 hours ago',
    supportTickets: 2,
    paymentMethod: 'Credit Card'
  },
  {
    id: 2,
    name: 'Fatima Al-Zahra',
    firstName: 'Fatima',
    lastName: 'Al-Zahra',
    email: 'fatima.alzahra@email.com',
    phone: '+971 55 987 6543',
    city: 'Abu Dhabi',
    address: 'Khalifa City, Abu Dhabi, UAE',
    status: 'active',
    joinDate: '2024-02-20',
    totalOrders: 3,
    totalSpent: 270,
    currentPackage: 'Standard 15GB',
    lastActivity: '1 day ago',
    supportTickets: 0,
    paymentMethod: 'Digital Wallet'
  },
  {
    id: 3,
    name: 'Mohammed Ali',
    firstName: 'Mohammed',
    lastName: 'Ali',
    email: 'mohammed.ali@email.com',
    phone: '+971 52 456 7890',
    city: 'Sharjah',
    address: 'Al Nahda, Sharjah, UAE',
    status: 'blocked',
    joinDate: '2023-12-10',
    totalOrders: 8,
    totalSpent: 720,
    currentPackage: 'Basic 5GB',
    lastActivity: '1 week ago',
    supportTickets: 5,
    paymentMethod: 'Credit Card'
  },
  {
    id: 4,
    name: 'Sarah Abdullah',
    firstName: 'Sarah',
    lastName: 'Abdullah',
    email: 'sarah.abdullah@email.com',
    phone: '+971 56 234 5678',
    city: 'Dubai',
    address: 'Jumeirah, Dubai, UAE',
    status: 'active',
    joinDate: '2024-03-05',
    totalOrders: 2,
    totalSpent: 180,
    currentPackage: 'Premium 30GB',
    lastActivity: '3 hours ago',
    supportTickets: 1,
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 5,
    name: 'Omar Khalil',
    firstName: 'Omar',
    lastName: 'Khalil',
    email: 'omar.khalil@email.com',
    phone: '+971 50 876 5432',
    city: 'Ajman',
    address: 'Al Nuaimiya, Ajman, UAE',
    status: 'suspended',
    joinDate: '2024-01-30',
    totalOrders: 4,
    totalSpent: 360,
    currentPackage: 'Standard 15GB',
    lastActivity: '2 days ago',
    supportTickets: 3,
    paymentMethod: 'Credit Card'
  },
  {
    id: 6,
    name: 'Layla Ibrahim',
    firstName: 'Layla',
    lastName: 'Ibrahim',
    email: 'layla.ibrahim@email.com',
    phone: '+971 55 345 6789',
    city: 'Ras Al Khaimah',
    address: 'Al Qusaidat, Ras Al Khaimah, UAE',
    status: 'active',
    joinDate: '2024-02-14',
    totalOrders: 6,
    totalSpent: 540,
    currentPackage: 'Premium 30GB',
    lastActivity: '5 hours ago',
    supportTickets: 0,
    paymentMethod: 'Digital Wallet'
  }
]

function UsersPage() {
  const { resolvedTheme } = useTheme()
  const [users, setUsers] = useState(sampleUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesCity = cityFilter === 'all' || user.city === cityFilter
    const matchesPackage = packageFilter === 'all' || user.currentPackage.includes(packageFilter)

    return matchesSearch && matchesStatus && matchesCity && matchesPackage
  })

  // Get unique cities and packages for filters
  const cities = [...new Set(users.map(user => user.city))]
  const packages = [...new Set(users.map(user => user.currentPackage.split(' ')[0]))]

  // Get status color and icon
  const getStatusDisplay = (status) => {
    const statusConfig = {
      active: {
        color: 'text-green-500',
        bg: resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
        icon: UserCheck,
        label: 'Active'
      },
      blocked: {
        color: 'text-red-500',
        bg: resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
        icon: UserX,
        label: 'Blocked'
      },
      suspended: {
        color: 'text-yellow-500',
        bg: resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
        icon: AlertCircle,
        label: 'Suspended'
      }
    }
    return statusConfig[status] || statusConfig.active
  }

  // Handler functions
  const handleViewUser = (user) => {
    setSelectedUser(user)
    // TEMPORARILY COMMENTED OUT - Modal causing issues
    // setShowDetailsModal(true)
    console.log('View user:', user.name)
    alert(`Viewing user: ${user.name} (Demo mode)`)
  }

  const handleBlockUser = (userId) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'blocked' ? 'active' : 'blocked' }
        : user
    ))
  }

  const handleSuspendUser = (userId) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'suspended' ? 'active' : 'suspended' }
        : user
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Public Users</h1>
          <p className="text-muted-foreground">Manage app-based SIM buyers</p>
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
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
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
                {users.filter(u => u.status === 'active').length}
              </p>
              <p className="text-sm text-muted-foreground">Active Users</p>
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
                ${users.reduce((sum, u) => sum + u.totalSpent, 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'}`}>
              <ShoppingCart className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {users.reduce((sum, u) => sum + u.totalOrders, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Orders</p>
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
                placeholder="Search users by name, email, or phone..."
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
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="suspended">Suspended</option>
            </select>

            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {/* Package Filter */}
            <select
              value={packageFilter}
              onChange={(e) => setPackageFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Packages</option>
              {packages.map(pkg => (
                <option key={pkg} value={pkg}>{pkg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">User</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">City</th>
                <th className="text-left p-4 font-medium text-foreground">Package</th>
                <th className="text-left p-4 font-medium text-foreground">Orders</th>
                <th className="text-left p-4 font-medium text-foreground">Total Spent</th>
                <th className="text-left p-4 font-medium text-foreground">Last Activity</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => {
                const statusDisplay = getStatusDisplay(user.status)
                const StatusIcon = statusDisplay.icon

                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                          resolvedTheme === 'dark' ? 'bg-slate-600' : 'bg-gray-400'
                        }`}>
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusDisplay.bg} ${statusDisplay.color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span>{statusDisplay.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{user.city}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{user.currentPackage}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">{user.totalOrders}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-foreground">${user.totalSpent}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{user.lastActivity}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className={`p-2 rounded-lg transition-colors ${
                            resolvedTheme === 'dark'
                              ? 'hover:bg-slate-700 text-slate-300 hover:text-white'
                              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                          }`}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleBlockUser(user.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'blocked'
                              ? resolvedTheme === 'dark'
                                ? 'hover:bg-green-900/20 text-green-400 hover:text-green-300'
                                : 'hover:bg-green-50 text-green-600 hover:text-green-700'
                              : resolvedTheme === 'dark'
                                ? 'hover:bg-red-900/20 text-red-400 hover:text-red-300'
                                : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                          }`}
                          title={user.status === 'blocked' ? 'Unblock User' : 'Block User'}
                        >
                          {user.status === 'blocked' ? <Shield className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        </button>

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
                                onClick={() => handleSuspendUser(user.id)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                                  resolvedTheme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <AlertCircle className="h-4 w-4" />
                                <span>{user.status === 'suspended' ? 'Unsuspend' : 'Suspend'} User</span>
                              </button>
                              <button
                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                                  resolvedTheme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <History className="h-4 w-4" />
                                <span>View Order History</span>
                              </button>
                              <button
                                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center space-x-2 ${
                                  resolvedTheme === 'dark'
                                    ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                              >
                                <MessageSquare className="h-4 w-4" />
                                <span>Support Tickets ({user.supportTickets})</span>
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className={`mx-auto h-12 w-12 ${resolvedTheme === 'dark' ? 'text-slate-600' : 'text-gray-400'}`} />
            <h3 className="mt-2 text-sm font-medium text-foreground">No users found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {searchTerm || statusFilter !== 'all' || cityFilter !== 'all' || packageFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No users have been registered yet'}
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal - TEMPORARILY COMMENTED OUT */}
      {/*
      {showDetailsModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedUser(null)
          }}
          onBlockUser={handleBlockUser}
          onSuspendUser={handleSuspendUser}
        />
      )}
      */}
    </div>
  )
}

export default UsersPage
