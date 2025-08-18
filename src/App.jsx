import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

// Import the real pages
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ResellersPage from './pages/resellers/ResellersPage'
import UsersPageSimple from './pages/users/UsersPageSimple'
import OrdersPage from './pages/orders/OrdersPage'
import TransactionsPage from './pages/payments/TransactionsPage'
import ReportsPage from './pages/reports/ReportsPage'
import SettingsPage from './pages/settings/SettingsPageClean'
import DockSidebar from './components/common/DockSidebar/DockSidebar'

// Layout component for pages with navigation
function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">SIM Admin Panel</h1>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 pb-20">
        {children}
      </main>

      {/* Dock Sidebar */}
      <DockSidebar />
    </div>
  )
}

// Simple test components for remaining pages
const TestLogin = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Login Page</h1>
      <p className="text-gray-600 mb-4">This is the login page test.</p>
      <button
        onClick={() => window.location.href = '/dashboard'}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Go to Dashboard (Test)
      </button>
    </div>
  </div>
)

const TestDashboard = () => (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Orders</h3>
          <p className="text-3xl font-bold text-green-600">567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">$89,012</p>
        </div>
      </div>
      <div className="mt-6">
        <nav className="flex space-x-4">
          <a href="/resellers" className="text-blue-600 hover:text-blue-800">Resellers</a>
          <a href="/users" className="text-blue-600 hover:text-blue-800">Users</a>
          <a href="/orders" className="text-blue-600 hover:text-blue-800">Orders</a>
          <a href="/" className="text-red-600 hover:text-red-800">Back to Login</a>
        </nav>
      </div>
    </div>
  </div>
)

const TestPage = ({ title }) => (
  <div className="min-h-screen bg-gray-100 p-6">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600 mb-4">This is the {title.toLowerCase()} page.</p>
        <nav className="flex space-x-4">
          <a href="/dashboard" className="text-blue-600 hover:text-blue-800">Dashboard</a>
          <a href="/resellers" className="text-blue-600 hover:text-blue-800">Resellers</a>
          <a href="/users" className="text-blue-600 hover:text-blue-800">Users</a>
          <a href="/orders" className="text-blue-600 hover:text-blue-800">Orders</a>
          <a href="/" className="text-red-600 hover:text-red-800">Back to Login</a>
        </nav>
      </div>
    </div>
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardLayout><DashboardPage /></DashboardLayout>} />
            <Route path="/resellers" element={<DashboardLayout><ResellersPage /></DashboardLayout>} />
            <Route path="/users" element={<DashboardLayout><UsersPageSimple /></DashboardLayout>} />
            <Route path="/orders" element={<DashboardLayout><OrdersPage /></DashboardLayout>} />
            <Route path="/transactions" element={<DashboardLayout><TransactionsPage /></DashboardLayout>} />
            <Route path="/reports" element={<DashboardLayout><ReportsPage /></DashboardLayout>} />
            <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}



export default App
