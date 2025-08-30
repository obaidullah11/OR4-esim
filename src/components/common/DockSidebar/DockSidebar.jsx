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
  LogOut
} from 'lucide-react'
import { Dock, DockIcon, DockItem, DockLabel } from '../../ui/dock'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import { cn } from '../../../lib/utils'
import { USER_ROLES } from '../../../utils/auth'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

// Role-based navigation configuration
const getNavigationData = (userRole) => {
  const adminNavigation = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'text-blue-600 dark:text-blue-400',
      roles: [USER_ROLES.ADMIN]
    },
    {
      title: 'Resellers',
      icon: UserCheck,
      href: '/resellers',
      color: 'text-green-600 dark:text-green-400',
      roles: [USER_ROLES.ADMIN]
    },
    {
      title: 'Users',
      icon: Users,
      href: '/users',
      color: 'text-purple-600 dark:text-purple-400',
      roles: [USER_ROLES.ADMIN]
    },
    {
      title: 'Orders',
      icon: ShoppingCart,
      href: '/orders',
      color: 'text-orange-600 dark:text-orange-400',
      roles: [USER_ROLES.ADMIN]
    },
    {
      title: 'Transactions',
      icon: CreditCard,
      href: '/transactions',
      color: 'text-emerald-600 dark:text-emerald-400',
      roles: [USER_ROLES.ADMIN]
    },
    {
      title: 'Reports',
      icon: BarChart3,
      href: '/reports',
      color: 'text-indigo-600 dark:text-indigo-400',
      roles: [USER_ROLES.ADMIN]
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600 dark:text-gray-400',
      roles: [USER_ROLES.ADMIN]
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

  const isActive = (href) => {
    return location.pathname.startsWith(href)
  }

  return (
    <div className={cn(
      'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
      className
    )}>
      <Dock 
        className={cn(
          'items-end pb-3 transition-colors duration-300',
          resolvedTheme === 'dark' 
            ? 'bg-slate-800/90 backdrop-blur-md border border-slate-700/50' 
            : 'bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-lg'
        )}
        magnification={70}
        distance={120}
        panelHeight={56}
      >
        {/* Logo/Brand */}
        <DockItem className="aspect-square rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
          <DockLabel>SIM Admin</DockLabel>
          <DockIcon>
            <Smartphone className="h-full w-full text-white p-2" />
          </DockIcon>
        </DockItem>

        {/* Navigation Items */}
        {navigationData.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <div
              key={item.href}
              onClick={() => handleNavigation(item.href)}
              className="cursor-pointer"
            >
              <DockItem
                className={cn(
                  'aspect-square rounded-full transition-all duration-200',
                  active
                    ? resolvedTheme === 'dark'
                      ? 'bg-slate-700 ring-2 ring-blue-400 shadow-lg'
                      : 'bg-blue-50 ring-2 ring-blue-500 shadow-lg'
                    : resolvedTheme === 'dark'
                      ? 'bg-slate-700/80 hover:bg-slate-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                )}
              >
                <DockLabel>{item.title}</DockLabel>
                <DockIcon>
                  <Icon
                    className={cn(
                      'h-full w-full p-2 transition-colors duration-200',
                      active
                        ? item.color
                        : resolvedTheme === 'dark'
                          ? 'text-slate-300'
                          : 'text-gray-600'
                    )}
                  />
                </DockIcon>
              </DockItem>
            </div>
          )
        })}

        {/* Theme Toggle */}
        <DockItem className={cn(
          'aspect-square rounded-full transition-all duration-200',
          resolvedTheme === 'dark'
            ? 'bg-slate-700/80 hover:bg-slate-600'
            : 'bg-gray-100 hover:bg-gray-200'
        )}>
          <DockLabel>Theme</DockLabel>
          <DockIcon>
            <div className="h-full w-full p-2 flex items-center justify-center">
              <ThemeToggle variant="simple" className="p-0 h-full w-full" />
            </div>
          </DockIcon>
        </DockItem>

        {/* Logout */}
        <div onClick={handleLogout} className="cursor-pointer">
          <DockItem
            className={cn(
              'aspect-square rounded-full transition-all duration-200',
              resolvedTheme === 'dark'
                ? 'bg-red-900/80 hover:bg-red-800'
                : 'bg-red-100 hover:bg-red-200'
            )}
          >
            <DockLabel>Logout</DockLabel>
            <DockIcon>
              <LogOut className={cn(
                'h-full w-full p-2 transition-colors duration-200',
                resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600'
              )} />
            </DockIcon>
          </DockItem>
        </div>
      </Dock>
    </div>
  )
}

export default DockSidebar
