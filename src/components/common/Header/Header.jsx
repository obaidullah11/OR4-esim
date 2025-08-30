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
    <header className="bg-card shadow-sm border-b border-border transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side */}
        <div className="flex items-center">
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md transition-colors duration-200 lg:hidden text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}

          {/* Sidebar Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md transition-colors duration-200 mr-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            title={useDockSidebar ? 'Switch to Traditional Sidebar' : 'Switch to Dock Sidebar'}
          >
            {useDockSidebar ? <Layout className="h-5 w-5" /> : <Dock className="h-5 w-5" />}
          </button>

          <h1 className="ml-2 text-xl font-semibold text-foreground transition-colors duration-300">
            SIM Admin Panel
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle variant="simple" />

          {/* Notifications */}
          <button className="p-2 rounded-md relative transition-colors duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-foreground transition-colors duration-300">
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
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-50 animate-slide-in">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm border-b border-border text-popover-foreground transition-colors duration-300">
                      <div className="font-medium">{user?.first_name} {user?.last_name}</div>
                      <div className="text-muted-foreground transition-colors duration-300">
                        {user?.email}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
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
