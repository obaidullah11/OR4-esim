import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  ShoppingCart,
  CreditCard,
  BarChart3,
  Settings,
  Smartphone,
  LogOut,
  Shield,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import { EnhancedDock } from '../../ui/dock-two'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import { cn } from '../../../lib/utils'
import { USER_ROLES } from '../../../utils/auth'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

// Role-based navigation configuration
const getNavigationData = (userRole) => {
  const adminNavigation = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-cyan-500',
      roles: [USER_ROLES.ADMIN],
      onClick: () => {}
    },
    {
      label: 'Resellers',
      icon: UserCheck,
      href: '/resellers',
      color: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-teal-500',
      roles: [USER_ROLES.ADMIN],
      onClick: () => {}
    },
    {
      label: 'Balance Top-ups',
      icon: DollarSign,
      href: '/balance-topups',
      color: 'text-yellow-600 dark:text-yellow-400',
      gradient: 'from-yellow-500 to-orange-500',
      roles: [USER_ROLES.ADMIN],
      onClick: () => {}
    },
    {
      label: 'Users',
      icon: Users,
      href: '/users',
      color: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500 to-pink-500',
      roles: [USER_ROLES.ADMIN],
      onClick: () => {}
    },
    {
      label: 'Orders',
      icon: ShoppingCart,
      href: '/orders',
      color: 'text-orange-600 dark:text-orange-400',
      gradient: 'from-orange-500 to-red-500',
      roles: [USER_ROLES.ADMIN],
      onClick: () => {}
    },
    {
      label: 'Transactions',
      icon: CreditCard,
      href: '/transactions',
      color: 'text-green-600 dark:text-green-400',
      gradient: 'from-green-500 to-emerald-500',
      roles: [USER_ROLES.ADMIN],
      onClick: () => {}
    },
    {
      label: 'Analytics',
      icon: TrendingUp,
      href: '/reports',
      color: 'text-indigo-600 dark:text-indigo-400',
      gradient: 'from-indigo-500 to-blue-500',
      roles: [USER_ROLES.ADMIN],
      onClick: () => {}
    },
    {
      label: 'Settings',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600 dark:text-gray-400',
      gradient: 'from-gray-500 to-slate-500',
      roles: [USER_ROLES.ADMIN],
      onClick: () => {}
    },
  ]

  // Return navigation items based on user role
  return adminNavigation.filter(item =>
    !item.roles || item.roles.includes(userRole)
  )
}

function DockSidebar({ className }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const { resolvedTheme } = useTheme()

  // Get navigation items based on user role
  const navigationData = getNavigationData(user?.role)

  const handleNavigation = (href) => {
    navigate(href)
  }

  const handleLogout = () => {
    logout()
  }

  // Add onClick handlers to navigation items
  const enhancedNavigationData = navigationData.map(item => ({
    ...item,
    onClick: () => handleNavigation(item.href)
  }))

  return (
    <div className={cn(
      'fixed bottom-2 left-1/2 transform -translate-x-1/2 z-40',
      className
    )}>
      <EnhancedDock
        items={enhancedNavigationData}
        activeItem={location.pathname}
        className="transition-all duration-300"
      />
    </div>
  )
}

export default DockSidebar
