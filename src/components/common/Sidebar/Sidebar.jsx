import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  Settings, 
  X,
  Smartphone,
  DollarSign
} from 'lucide-react'
import { cn } from '../../../utils/theme'
import { useTheme } from '../../../context/ThemeContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Resellers', href: '/resellers', icon: UserCheck },
  { name: 'Balance Top-ups', href: '/balance-topups', icon: DollarSign },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
]

function Sidebar({ isOpen, onClose }) {
  // const { resolvedTheme } = useTheme() // No longer needed with unified theme system

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border transition-colors duration-300">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-4">
            <div className={cn(
              'h-8 w-8 rounded-lg flex items-center justify-center mr-3',
              'bg-gradient-to-br from-blue-500 to-indigo-600'
            )}>
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground transition-colors duration-300">
              SIM Admin
            </span>
          </div>
          
          {/* Navigation */}
          <nav className="mt-8 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200',
                    isActive
                      ? 'bg-accent text-accent-foreground border-r-2 border-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'lg:hidden fixed inset-0 z-40 flex transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card border-r border-border transition-colors duration-300">
          {/* Close button */}
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={onClose}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 px-4">
              <div className={cn(
                'h-8 w-8 rounded-lg flex items-center justify-center mr-3',
                'bg-gradient-to-br from-blue-500 to-indigo-600'
              )}>
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-foreground transition-colors duration-300">
                SIM Admin
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="mt-8 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={({ isActive }) => cn(
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="mr-4 h-6 w-6 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
