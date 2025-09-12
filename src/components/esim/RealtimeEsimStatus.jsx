import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import {
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
  Activity,
  AlertTriangle,
  RefreshCw,
  Smartphone,
  Signal,
  Globe
} from 'lucide-react'
import { realtimeService } from '../../services/realtimeService'

function RealtimeEsimStatus({ esimId, onStatusChange, autoStart = true }) {
  const { resolvedTheme } = useTheme()
  const [status, setStatus] = useState('pending')
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [statusHistory, setStatusHistory] = useState([])
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  // Status configuration
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      label: 'Pending',
      description: 'eSIM assignment is being processed'
    },
    provisioning: {
      icon: Loader2,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      label: 'Provisioning',
      description: 'eSIM is being provisioned by TraveRoam',
      animate: true
    },
    ready: {
      icon: Smartphone,
      color: 'text-green-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      label: 'Ready',
      description: 'eSIM is ready for activation'
    },
    active: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      label: 'Active',
      description: 'eSIM is active and connected'
    },
    activated: {
      icon: Signal,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      label: 'Activated',
      description: 'eSIM has been activated by the user'
    },
    failed: {
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      label: 'Failed',
      description: 'eSIM provisioning failed'
    },
    cancelled: {
      icon: XCircle,
      color: 'text-gray-500',
      bg: 'bg-gray-50 dark:bg-gray-900/20',
      border: 'border-gray-200 dark:border-gray-800',
      label: 'Cancelled',
      description: 'eSIM assignment was cancelled'
    },
    expired: {
      icon: AlertTriangle,
      color: 'text-orange-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      label: 'Expired',
      description: 'eSIM has expired'
    }
  }

  // Start monitoring
  const startMonitoring = () => {
    if (!esimId || isMonitoring) return

    setIsMonitoring(true)
    setError(null)
    console.log('Starting real-time eSIM monitoring:', esimId)

    realtimeService.startEsimProvisioning(esimId, {
      onStatusUpdate: (update) => {
        console.log('eSIM status update received:', update)
        setStatus(update.status)
        setLastUpdate(update.timestamp)
        
        // Add to status history
        setStatusHistory(prev => [...prev, {
          status: update.status,
          timestamp: update.timestamp,
          data: update.data
        }].slice(-10)) // Keep last 10 updates

        // Notify parent component
        if (onStatusChange) {
          onStatusChange(update)
        }
      },
      onComplete: (result) => {
        console.log('eSIM provisioning completed:', result)
        setIsMonitoring(false)
        setStatus(result.status)
        setLastUpdate(new Date().toISOString())
        
        if (onStatusChange) {
          onStatusChange({
            ...result,
            completed: true
          })
        }
      },
      onError: (error) => {
        console.error('eSIM monitoring error:', error)
        setIsMonitoring(false)
        setError(error.error || 'Monitoring failed')
        
        if (onStatusChange) {
          onStatusChange({
            ...error,
            error: true
          })
        }
      }
    })
  }

  // Stop monitoring
  const stopMonitoring = () => {
    if (esimId) {
      realtimeService.stopPolling(esimId)
      setIsMonitoring(false)
      console.log('🛑 Stopped eSIM monitoring:', esimId)
    }
  }

  // Auto-start monitoring
  useEffect(() => {
    if (autoStart && esimId) {
      startMonitoring()
    }

    // Cleanup on unmount
    return () => {
      if (esimId) {
        realtimeService.stopPolling(esimId)
      }
    }
  }, [esimId, autoStart])

  // Get current status config
  const currentConfig = statusConfig[status] || statusConfig.pending
  const StatusIcon = currentConfig.icon

  return (
    <div className={`p-4 rounded-lg border ${currentConfig.bg} ${currentConfig.border}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${currentConfig.bg}`}>
            <StatusIcon 
              className={`w-5 h-5 ${currentConfig.color} ${
                currentConfig.animate ? 'animate-spin' : ''
              }`} 
            />
          </div>
          <div>
            <h3 className={`font-semibold ${currentConfig.color}`}>
              {currentConfig.label}
            </h3>
            <p className={`text-sm ${
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {currentConfig.description}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {!isMonitoring && !['active', 'activated', 'failed', 'cancelled'].includes(status) && (
            <button
              onClick={startMonitoring}
              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              title="Start Monitoring"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          
          {isMonitoring && (
            <button
              onClick={stopMonitoring}
              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Stop Monitoring"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* eSIM ID */}
      {esimId && (
        <div className="mb-3 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <span className="font-medium">eSIM ID:</span> {esimId}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Last Update */}
      {lastUpdate && (
        <div className="mb-3 text-xs text-gray-500 dark:text-gray-400">
          Last updated: {new Date(lastUpdate).toLocaleString()}
        </div>
      )}

      {/* Monitoring Status */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <Activity className={`w-4 h-4 ${
            isMonitoring ? 'text-green-500' : 'text-gray-400'
          }`} />
          <span className={
            resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }>
            {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
          </span>
        </div>

        {statusHistory.length > 0 && (
          <span className="text-gray-500">
            {statusHistory.length} update{statusHistory.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Status History (expandable) */}
      {statusHistory.length > 0 && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            View Status History
          </summary>
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
            {statusHistory.slice().reverse().map((entry, index) => {
              const entryConfig = statusConfig[entry.status] || statusConfig.pending
              const EntryIcon = entryConfig.icon
              
              return (
                <div key={index} className="flex items-center space-x-2 text-xs p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <EntryIcon className={`w-3 h-3 ${entryConfig.color}`} />
                  <span className="font-medium">{entryConfig.label}</span>
                  <span className="text-gray-500">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )
            })}
          </div>
        </details>
      )}

      {/* Progress Indicator */}
      {isMonitoring && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300 animate-pulse"
              style={{ width: '60%' }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Monitoring eSIM provisioning status...
          </p>
        </div>
      )}
    </div>
  )
}

export default RealtimeEsimStatus
