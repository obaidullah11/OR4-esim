import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false)
  const { resolvedTheme } = useTheme()

  if (!content) {
    return children
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={cn(
              'absolute z-[9999] px-2 py-1 text-xs font-medium rounded shadow-lg whitespace-nowrap',
              positionClasses[position],
              resolvedTheme === 'dark'
                ? 'bg-gray-800 text-white border border-gray-700'
                : 'bg-gray-900 text-white border border-gray-600'
            )}
            style={{ position: 'absolute', zIndex: 9999 }}
          >
            {content}
            {/* Arrow */}
            <div className={cn(
              'absolute w-2 h-2 transform rotate-45',
              position === 'top' && 'top-full left-1/2 -translate-x-1/2 -mt-1',
              position === 'bottom' && 'bottom-full left-1/2 -translate-x-1/2 -mb-1',
              position === 'left' && 'left-full top-1/2 -translate-y-1/2 -ml-1',
              position === 'right' && 'right-full top-1/2 -translate-y-1/2 -mr-1',
              resolvedTheme === 'dark'
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-900 border-gray-600'
            )} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
