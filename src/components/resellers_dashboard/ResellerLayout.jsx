import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'
import ResellerDockSidebar from './ResellerDockSidebar'
import ResellerSettingsModal from './ResellerSettingsModal'
import {
  Bell,
  Search,
  Settings,
  User,
  CreditCard,
  Wifi,
  TrendingUp,
  Star
} from 'lucide-react'

function ResellerLayout({ children }) {
  const { resolvedTheme } = useTheme()
  const { user } = useAuth()
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  return (
    <div className={cn(
      'min-h-screen transition-all duration-500 relative',
      resolvedTheme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    )}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-30 animate-float',
          resolvedTheme === 'dark' 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
            : 'bg-gradient-to-br from-blue-200 to-indigo-300'
        )}></div>
        <div className={cn(
          'absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 animate-float',
          resolvedTheme === 'dark' 
            ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
            : 'bg-gradient-to-br from-purple-200 to-pink-300'
        )} style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Enhanced Header */}
      <header className={cn(
        'border-b backdrop-blur-lg transition-all duration-300 sticky top-0 z-40',
        resolvedTheme === 'dark' 
          ? 'bg-slate-800/80 border-slate-700/50 shadow-xl' 
          : 'bg-white/80 border-gray-200/50 shadow-lg'
      )}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            {/* Enhanced Logo */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-reseller rounded-xl flex items-center justify-center shadow-lg hover-scale transition-smooth status-online">
                <span className="text-white text-lg font-bold">R</span>
              </div>
            </div>
            
            {/* Title with Gradient */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gradient-colorful">
                Reseller Portal
              </h1>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span>Premium Account</span>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse-soft"></div>
                <span>Online</span>
              </div>
            </div>
          </div>

          {/* Enhanced Header Actions */}
          <div className="flex items-center space-x-4">

            {/* Search */}
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Quick search..."
                className={cn(
                  'pl-10 pr-4 py-2 w-64 rounded-lg text-sm transition-all duration-200 focus-ring',
                  resolvedTheme === 'dark'
                    ? 'bg-slate-700/50 border border-slate-600 text-white placeholder:text-slate-400'
                    : 'bg-gray-100/50 border border-gray-300 text-gray-900 placeholder:text-gray-500'
                )}
              />
            </div>

            {/* Settings */}
            <button
              onClick={() => setShowSettingsModal(true)}
              className={cn(
                'relative p-2 rounded-lg transition-all duration-200 hover-scale focus-ring',
                resolvedTheme === 'dark'
                  ? 'hover:bg-slate-700/50'
                  : 'hover:bg-gray-100/50'
              )}
              title="Settings"
            >
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Notifications */}
            <button className={cn(
              'relative p-2 rounded-lg transition-all duration-200 hover-scale focus-ring',
              resolvedTheme === 'dark'
                ? 'hover:bg-slate-700/50'
                : 'hover:bg-gray-100/50'
            )}>
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse-soft"></div>
            </button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-foreground">
                  {user?.first_name || 'Reseller'} {user?.last_name || ''}
                </div>
              </div>
              <div className="w-10 h-10 bg-gradient-reseller rounded-full flex items-center justify-center shadow-lg hover-scale transition-smooth">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Enhanced Styling */}
      <main className="relative z-10 p-6 pb-24">
        <div className="fade-in">
          {children}
        </div>
      </main>

      {/* Enhanced Dock Sidebar */}
      <ResellerDockSidebar />

      {/* Settings Modal */}
      <ResellerSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  )
}

export default ResellerLayout
