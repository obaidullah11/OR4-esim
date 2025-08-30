import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import ResellerDockSidebar from './ResellerDockSidebar'

function ResellerLayout({ children }) {
  const { resolvedTheme } = useTheme()

  return (
    <div className={cn(
      'min-h-screen transition-colors duration-300',
      resolvedTheme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    )}>
      {/* Header */}
      <header className={cn(
        'border-b transition-colors duration-300',
        resolvedTheme === 'dark' 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200 shadow-sm'
      )}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">Reseller Portal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Welcome back, Reseller
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 pb-20">
        {children}
      </main>

      {/* Dock Sidebar */}
      <ResellerDockSidebar />
    </div>
  )
}

export default ResellerLayout
