import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Activity,
  Zap,
  BarChart3,
  LogOut
} from 'lucide-react'
import { EnhancedDock } from '../ui/dock-two'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import ThemeToggle from '../common/ThemeToggle/ThemeToggle'

const resellerNavigationData = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/reseller-dashboard',
    color: 'text-blue-600 dark:text-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
    onClick: () => {}
  },
  {
    label: 'Assign eSIM',
    icon: Zap,
    href: '/reseller-dashboard/assign-esim',
    color: 'text-purple-600 dark:text-purple-400',
    gradient: 'from-purple-500 to-pink-500',
    onClick: () => {}
  },
  {
    label: 'Clients',
    icon: Users,
    href: '/reseller-dashboard/clients',
    color: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
    onClick: () => {}
  },
  {
    label: 'eSIM History',
    icon: Activity,
    href: '/reseller-dashboard/history',
    color: 'text-orange-600 dark:text-orange-400',
    gradient: 'from-orange-500 to-red-500',
    onClick: () => {}
  },
  {
    label: 'Reports',
    icon: BarChart3,
    href: '/reseller-dashboard/reports',
    color: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-blue-500',
    onClick: () => {}
  },
  {
    label: 'Logout',
    icon: LogOut,
    href: '#',
    color: 'text-red-600 dark:text-red-400',
    gradient: 'from-red-500 to-pink-500',
    onClick: () => {}
  },
]

function ResellerDockSidebar({ className }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const { resolvedTheme } = useTheme()

  const handleNavigation = (href) => {
    navigate(href)
  }

  const handleLogout = () => {
    logout()
  }

  // Add onClick handlers to navigation items
  const enhancedNavigationData = resellerNavigationData.map(item => ({
    ...item,
    onClick: item.label === 'Logout' ? handleLogout : () => handleNavigation(item.href)
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
export default ResellerDockSidebar
