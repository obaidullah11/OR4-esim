import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '../../../context/ThemeContext'
import { cn, getTransitionClasses } from '../../../utils/theme'
import { useState } from 'react'

function ThemeToggle({ variant = 'button', showLabel = false, className = '' }) {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[0]
  const CurrentIcon = currentTheme.icon

  // Simple toggle button (light/dark only)
  if (variant === 'simple') {
    const toggleTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent',
          getTransitionClasses('colors'),
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </button>
    )
  }

  // Dropdown variant with all theme options
  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center space-x-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent',
            getTransitionClasses('colors'),
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            className
          )}
          aria-label="Theme selector"
        >
          <CurrentIcon className="h-5 w-5" />
          {showLabel && <span className="text-sm">{currentTheme.label}</span>}
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-20 animate-slide-in">
              <div className="py-1">
                {themes.map((themeOption) => {
                  const Icon = themeOption.icon
                  const isSelected = theme === themeOption.value

                  return (
                    <button
                      key={themeOption.value}
                      onClick={() => {
                        setTheme(themeOption.value)
                        setIsOpen(false)
                      }}
                      className={cn(
                        'flex items-center w-full px-4 py-2 text-sm text-left',
                        getTransitionClasses('colors'),
                        isSelected
                          ? 'bg-accent text-accent-foreground'
                          : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <span>{themeOption.label}</span>
                      {isSelected && (
                        <div className="ml-auto h-2 w-2 bg-primary rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Default button variant
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2',
        'text-muted-foreground hover:text-foreground hover:bg-accent',
        getTransitionClasses('colors'),
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className
      )}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={cn(
            'absolute h-5 w-5 rotate-0 scale-100 transition-all',
            theme === 'dark' && '-rotate-90 scale-0'
          )}
        />
        <Moon
          className={cn(
            'absolute h-5 w-5 rotate-90 scale-0 transition-all',
            theme === 'dark' && 'rotate-0 scale-100'
          )}
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-sm">
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </span>
      )}
    </button>
  )
}

export default ThemeToggle
