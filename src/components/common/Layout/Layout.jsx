import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Header from '../Header/Header'
import DockSidebar from '../DockSidebar/DockSidebar'
import { useState } from 'react'
import { useTheme } from '../../../context/ThemeContext'
import { cn } from '../../../utils/theme'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [useDockSidebar, setUseDockSidebar] = useState(true) // Toggle between dock and traditional sidebar
  const { resolvedTheme } = useTheme()

  return (
    <div className={cn(
      'flex h-screen transition-colors duration-300 relative',
      resolvedTheme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
    )}>
      {/* Traditional Sidebar (hidden when using dock) */}
      {!useDockSidebar && (
        <>
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      {/* Main content */}
      <div className={cn(
        'flex-1 flex flex-col overflow-hidden transition-all duration-300',
        !useDockSidebar ? 'lg:ml-64' : ''
      )}>
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          showMenuButton={!useDockSidebar}
          onToggleSidebar={() => setUseDockSidebar(!useDockSidebar)}
          useDockSidebar={useDockSidebar}
        />

        {/* Page content */}
        <main className={cn(
          'flex-1 overflow-x-hidden overflow-y-auto transition-colors duration-300',
          resolvedTheme === 'dark' ? 'bg-slate-900' : 'bg-gray-50',
          useDockSidebar ? 'pb-20' : '' // Add bottom padding for dock
        )}>
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Dock Sidebar */}
      {useDockSidebar && <DockSidebar />}
    </div>
  )
}

export default Layout
