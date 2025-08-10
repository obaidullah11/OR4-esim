import { Menu, Bell, User, LogOut, Layout, Dock } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'
import { cn } from '../../../utils/theme'
import ThemeToggle from '../ThemeToggle/ThemeToggle'

function Header({
  onMenuClick,
  showMenuButton = true,
  onToggleSidebar,
  useDockSidebar = false
}) {
  const { user, logout } = useAuth()
  const { resolvedTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
  }

  return (
    <header className={cn(
      'shadow-sm border-b transition-colors duration-300',
      resolvedTheme === 'dark'
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-gray-200'
    )}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className={cn(
                'p-2 rounded-md transition-colors duration-200 lg:hidden',
                resolvedTheme === 'dark'
                  ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className={cn(
              'p-2 rounded-md transition-colors duration-200 mr-2',
              resolvedTheme === 'dark'
                ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
            title={useDockSidebar ? 'Switch to Traditional Sidebar' : 'Switch to Dock Sidebar'}
          >
            {useDockSidebar ? <Layout className="h-5 w-5" /> : <Dock className="h-5 w-5" />}
          </button>

          <h1 className={cn(
            'ml-2 text-xl font-semibold transition-colors duration-300',
            resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            SIM Admin Panel
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle variant="simple" />

          {/* Notifications */}
          <button className={cn(
            'p-2 rounded-md relative transition-colors duration-200',
            resolvedTheme === 'dark'
              ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          )}>
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                'flex items-center space-x-3 p-2 rounded-md transition-colors duration-200',
                resolvedTheme === 'dark'
                  ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className={cn(
                'hidden md:block text-sm font-medium transition-colors duration-300',
                resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
              )}>
                {user?.first_name || 'Admin'}
              </span>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />

                {/* Dropdown */}
                <div className={cn(
                  'absolute right-0 mt-2 w-48 rounded-md shadow-lg border z-50 animate-slide-in',
                  resolvedTheme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-gray-200'
                )}>
                  <div className="py-1">
                    <div className={cn(
                      'px-4 py-2 text-sm border-b transition-colors duration-300',
                      resolvedTheme === 'dark'
                        ? 'text-slate-300 border-slate-700'
                        : 'text-gray-700 border-gray-200'
                    )}>
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className={cn(
                        'transition-colors duration-300',
                        resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                      )}>
                        {user?.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        'flex items-center w-full px-4 py-2 text-sm transition-colors duration-200',
                        resolvedTheme === 'dark'
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      )}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
