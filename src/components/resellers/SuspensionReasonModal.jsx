import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { X, AlertTriangle, UserX, User } from 'lucide-react'
import { cn } from '../../lib/utils'

const SuspensionReasonModal = ({ isOpen, onClose, onConfirm, reseller, isLoading = false }) => {
  const { resolvedTheme } = useTheme()
  const [reason, setReason] = useState('')

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim())
    }
  }

  const handleClose = () => {
    setReason('')
    onClose()
  }

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    } else if (e.key === 'Enter' && reason.trim() && !isLoading) {
      handleConfirm()
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "relative w-full max-w-md rounded-2xl shadow-2xl transition-colors duration-300",
            resolvedTheme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-white border border-gray-200'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-full",
                resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50'
              )}>
                <UserX className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Suspend Reseller</h2>
                <p className="text-sm text-muted-foreground">Provide a reason for suspension</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className={cn(
                "p-2 rounded-lg transition-colors duration-200",
                resolvedTheme === 'dark' 
                  ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200'
                  : 'hover:bg-gray-100 text-gray-400 hover:text-gray-600'
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Warning Message */}
            <div className={cn(
              "p-4 rounded-lg border",
              resolvedTheme === 'dark' 
                ? 'bg-red-500/5 border-red-500/20 text-red-400'
                : 'bg-red-50 border-red-200 text-red-700'
            )}>
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium mb-1">Suspension Warning</p>
                  <p>Suspending this reseller will block their access to the system. They will not be able to perform any operations until reactivated.</p>
                </div>
              </div>
            </div>

            {/* Reseller Info */}
            {reseller && (
              <div className={cn(
                "p-4 rounded-lg border",
                resolvedTheme === 'dark' 
                  ? 'bg-slate-700/50 border-slate-600'
                  : 'bg-gray-50 border-gray-200'
              )}>
                <h3 className="font-medium text-foreground mb-3">Reseller Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{reseller.name}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {reseller.email}
                  </div>
                  {reseller.phone && (
                    <div className="text-muted-foreground">
                      {reseller.phone}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reason Input */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-foreground">
                Suspension Reason *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter the reason for suspending this reseller..."
                rows={4}
                className={cn(
                  "w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none",
                  resolvedTheme === 'dark'
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500'
                )}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                This reason will be recorded and visible to the reseller.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-colors duration-200",
                resolvedTheme === 'dark'
                  ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!reason.trim() || isLoading}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                reason.trim() && !isLoading
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-xl'
                  : resolvedTheme === 'dark'
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Suspending...</span>
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4" />
                  <span>Suspend Reseller</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SuspensionReasonModal
