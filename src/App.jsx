import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

// Import role-based route protection
import ProtectedRoute, { AdminRoute, ResellerRoute, ClientRoute } from './components/auth/ProtectedRoute'
import { USER_ROLES } from './utils/auth'

// Import the real pages
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ResellersPage from './pages/resellers/ResellersPage'
import UsersPageSimple from './pages/users/UsersPageSimple'
import OrdersPage from './pages/orders/OrdersPage'
import TransactionsPage from './pages/payments/TransactionsPage'
import ReportsPage from './pages/reports/ReportsPage'
import SettingsPage from './pages/settings/SettingsPageClean'
import DockSidebar from './components/common/DockSidebar/DockSidebar'

// Import reseller dashboard pages
import {
  ResellerDashboard,
  EditClientPage,
  AssignEsimPage,
  ClientManagementPage,
  EsimHistoryPage
} from './pages/resellers_dashboard'
import ResellerLayout from './components/resellers_dashboard/ResellerLayout'

// Import test pages
import ApiTestPage from './pages/test/ApiTestPage'
import ClientManagementTest from './pages/test/ClientManagementTest'
import ResellerWorkflowTest from './pages/test/ResellerWorkflowTest'
import UserManagementTest from './pages/test/UserManagementTest'
import ComprehensiveIntegrationTest from './pages/test/ComprehensiveIntegrationTest'
import RoleBasedAuthTest from './pages/test/RoleBasedAuthTest'

// Auto-redirect component
function AutoRedirect() {
  const { isAuthenticated, isLoading, defaultDashboard } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={defaultDashboard} replace />
  }

  return <Navigate to="/login" replace />
}

// Layout component for pages with navigation
function DashboardLayout({ children }) {
  const { logout, user, roleDisplay } = useAuth()

  const handleLogout = async () => {
    await logout()
  }
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <h1 className="text-xl font-semibold text-foreground">SIM Admin Panel</h1>
            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              {roleDisplay}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.first_name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive/90 transition-colors"
            >
              Logout
            </button>
          </div>
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
  <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
    <div className="bg-card p-8 rounded-lg shadow-soft dark:shadow-dark-soft max-w-md w-full border border-border">
      <h1 className="text-2xl font-bold text-foreground mb-4">Login Page</h1>
      <p className="text-muted-foreground mb-4">This is the login page test.</p>
      <button
        onClick={() => window.location.href = '/dashboard'}
        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 transition-colors"
      >
        Go to Dashboard (Test)
      </button>
    </div>
  </div>
)

const TestDashboard = () => (
  <div className="min-h-screen bg-background p-6 transition-colors duration-300">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-soft dark:shadow-dark-soft border border-border">
          <h3 className="text-lg font-semibold text-foreground">Total Users</h3>
          <p className="text-3xl font-bold text-primary">1,234</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-soft dark:shadow-dark-soft border border-border">
          <h3 className="text-lg font-semibold text-foreground">Active Orders</h3>
          <p className="text-3xl font-bold text-success">567</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-soft dark:shadow-dark-soft border border-border">
          <h3 className="text-lg font-semibold text-foreground">Revenue</h3>
          <p className="text-3xl font-bold text-primary">$89,012</p>
        </div>
      </div>
      <div className="mt-6">
        <nav className="flex space-x-4">
          <a href="/resellers" className="text-primary hover:text-primary/80 transition-colors">Resellers</a>
          <a href="/users" className="text-primary hover:text-primary/80 transition-colors">Users</a>
          <a href="/orders" className="text-primary hover:text-primary/80 transition-colors">Orders</a>
          <a href="/" className="text-destructive hover:text-destructive/80 transition-colors">Back to Login</a>
        </nav>
      </div>
    </div>
  </div>
)

const TestPage = ({ title }) => (
  <div className="min-h-screen bg-background p-6 transition-colors duration-300">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-foreground mb-6">{title}</h1>
      <div className="bg-card p-6 rounded-lg shadow-soft dark:shadow-dark-soft border border-border">
        <p className="text-muted-foreground mb-4">This is the {title.toLowerCase()} page.</p>
        <nav className="flex space-x-4">
          <a href="/dashboard" className="text-primary hover:text-primary/80 transition-colors">Dashboard</a>
          <a href="/resellers" className="text-primary hover:text-primary/80 transition-colors">Resellers</a>
          <a href="/users" className="text-primary hover:text-primary/80 transition-colors">Users</a>
          <a href="/orders" className="text-primary hover:text-primary/80 transition-colors">Orders</a>
          <a href="/" className="text-destructive hover:text-destructive/80 transition-colors">Back to Login</a>
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
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Forgot Password Route */}
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Admin Dashboard Routes - Protected for Admin users only */}
            <Route path="/dashboard" element={
              <AdminRoute>
                <DashboardLayout><DashboardPage /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/resellers" element={
              <AdminRoute>
                <DashboardLayout><ResellersPage /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/users" element={
              <AdminRoute>
                <DashboardLayout><UsersPageSimple /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/orders" element={
              <AdminRoute>
                <DashboardLayout><OrdersPage /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/transactions" element={
              <AdminRoute>
                <DashboardLayout><TransactionsPage /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/reports" element={
              <AdminRoute>
                <DashboardLayout><ReportsPage /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/settings" element={
              <AdminRoute>
                <DashboardLayout><SettingsPage /></DashboardLayout>
              </AdminRoute>
            } />
            
            {/* Reseller Dashboard Routes - Protected for Reseller users only */}
            <Route path="/reseller-dashboard" element={
              <ResellerRoute>
                <ResellerLayout><ResellerDashboard /></ResellerLayout>
              </ResellerRoute>
            } />

            <Route path="/reseller-dashboard/assign-esim" element={
              <ResellerRoute>
                <ResellerLayout><AssignEsimPage /></ResellerLayout>
              </ResellerRoute>
            } />
            <Route path="/reseller-dashboard/clients" element={
              <ResellerRoute>
                <ResellerLayout><ClientManagementPage /></ResellerLayout>
              </ResellerRoute>
            } />
            <Route path="/reseller-dashboard/edit-client/:id" element={
              <ResellerRoute>
                <ResellerLayout><EditClientPage /></ResellerLayout>
              </ResellerRoute>
            } />
            <Route path="/reseller-dashboard/history" element={
              <ResellerRoute>
                <ResellerLayout><EsimHistoryPage /></ResellerLayout>
              </ResellerRoute>
            } />
            <Route path="/reseller-dashboard/reports" element={
              <ResellerRoute>
                <ResellerLayout>
                  <ReportsPage isResellerView={true} />
                </ResellerLayout>
              </ResellerRoute>
            } />

            {/* Test Pages - Protected for Admin users only */}
            <Route path="/test/api" element={
              <AdminRoute>
                <DashboardLayout><ApiTestPage /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/test/client-management" element={
              <AdminRoute>
                <DashboardLayout><ClientManagementTest /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/test/reseller-workflow" element={
              <AdminRoute>
                <DashboardLayout><ResellerWorkflowTest /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/test/user-management" element={
              <AdminRoute>
                <DashboardLayout><UserManagementTest /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/test/comprehensive" element={
              <AdminRoute>
                <DashboardLayout><ComprehensiveIntegrationTest /></DashboardLayout>
              </AdminRoute>
            } />
            <Route path="/test/role-auth" element={
              <ProtectedRoute>
                <DashboardLayout><RoleBasedAuthTest /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Auto-redirect to appropriate dashboard */}
            <Route path="/" element={<AutoRedirect />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'bg-card text-card-foreground border border-border shadow-soft dark:shadow-dark-soft',
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                borderColor: 'hsl(var(--border))',
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}



export default App
