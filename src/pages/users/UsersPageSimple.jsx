import { useState } from 'react'
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
  ShoppingBag
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
  const [users, setUsers] = useState(sampleUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('all')
  const [packageFilter, setPackageFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  // Get unique values for filters
  const cities = [...new Set(users.map(user => user.city))]
  const packages = [...new Set(users.map(user => user.package))]

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm)

    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesCity = cityFilter === 'all' || user.city === cityFilter
    const matchesPackage = packageFilter === 'all' || user.package === packageFilter

    return matchesSearch && matchesStatus && matchesCity && matchesPackage
  })

  // Handler functions
  const handleViewUser = (user) => {
    setSelectedUser(user)
    setShowUserDetails(true)
  }

  const handleBlockUser = (userId) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'Blocked' ? 'Active' : 'Blocked' }
        : user
    ))
  }

  const handleViewOrders = (user) => {
    alert(`Order History for ${user.name}:\n\nTotal Orders: ${user.totalOrders}\nTotal Spent: $${user.totalSpent}\nLast Order: ${user.lastOrder}`)
  }

  const handleViewTickets = (user) => {
    alert(`Support Tickets for ${user.name}:\n\nTotal Tickets: ${user.supportTickets}\nStatus: ${user.supportTickets > 0 ? 'Has open tickets' : 'No tickets'}`)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Public Users Management</h1>
            <p className="text-gray-600">App SIM Buyers - {filteredUsers.length} users</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
          </select>

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>

          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Packages</option>
            {packages.map(pkg => (
              <option key={pkg} value={pkg}>{pkg}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact & Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package & Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity & Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Support
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
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
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">Joined: {user.joinDate}</div>
                    </div>
                  </div>
                </td>

                {/* Contact & Location */}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center mb-1">
                      <Phone className="h-3 w-3 text-gray-400 mr-1" />
                      {user.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs">{user.address}</span>
                    </div>
                  </div>
                </td>

                {/* Package & Status */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Package className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs text-gray-900">{user.package}</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'Blocked'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
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
                      <ShoppingBag className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs">{user.totalOrders} orders</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="text-xs font-medium">${user.totalSpent}</span>
                    </div>
                    <div className="text-xs text-gray-500">Last: {user.lastActivity}</div>
                  </div>
                </td>

                {/* Support */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 text-gray-400 mr-1" />
                    <span className={`text-xs ${user.supportTickets > 0 ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                      {user.supportTickets} tickets
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewOrders(user)}
                      className="text-green-600 hover:text-green-900 p-1"
                      title="Order History"
                    >
                      <History className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleViewTickets(user)}
                      className="text-purple-600 hover:text-purple-900 p-1"
                      title="Support Tickets"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleBlockUser(user.id)}
                      className={`p-1 ${user.status === 'Blocked' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                      title={user.status === 'Blocked' ? 'Unblock User' : 'Block User'}
                    >
                      {user.status === 'Blocked' ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
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
          <p className="text-gray-500">No users found matching your search.</p>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">User Details</h2>
              <button
                onClick={() => setShowUserDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-gray-900">{selectedUser.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Join Date</label>
                    <p className="text-gray-900">{selectedUser.joinDate}</p>
                  </div>
                </div>
              </div>

              {/* Account & Activity */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Account & Activity</h3>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className={`font-medium ${
                      selectedUser.status === 'Active' ? 'text-green-600' :
                      selectedUser.status === 'Blocked' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {selectedUser.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Package</label>
                    <p className="text-gray-900">{selectedUser.package}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Orders</label>
                    <p className="text-gray-900">{selectedUser.totalOrders}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Spent</label>
                    <p className="text-gray-900 font-medium">${selectedUser.totalSpent}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Support Tickets</label>
                    <p className={`font-medium ${selectedUser.supportTickets > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedUser.supportTickets}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Activity</label>
                    <p className="text-gray-900">{selectedUser.lastActivity}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
              <button
                onClick={() => handleViewOrders(selectedUser)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <History className="h-4 w-4" />
                <span>View Orders</span>
              </button>
              <button
                onClick={() => handleViewTickets(selectedUser)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>View Tickets</span>
              </button>
              <button
                onClick={() => {
                  handleBlockUser(selectedUser.id)
                  setShowUserDetails(false)
                }}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  selectedUser.status === 'Blocked'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
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
