import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { X, Download, FileText, Calendar, CheckCircle, DollarSign, Users, BarChart3, Network, Package } from 'lucide-react'
import reportsService from '../../services/reportsService'
import toast from 'react-hot-toast'

const ExportModal = ({ isOpen, onClose, dateRange }) => {
  const { resolvedTheme } = useTheme()
  const [isExporting, setIsExporting] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)

  if (!isOpen) return null

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '7days': return 'Last 7 Days'
      case '30days': return 'Last 30 Days'
      case '90days': return 'Last 90 Days'
      case '1year': return 'Last Year'
      default: return 'Custom Range'
    }
  }

  const reportTypes = [
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue, payments, and financial analytics',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50'
    },
    {
      id: 'users',
      name: 'Users Report',
      description: 'User growth, activity, and engagement metrics',
      icon: Users,
      color: 'text-blue-600',
      bgColor: resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Revenue trends, country breakdown, and payment methods',
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: resolvedTheme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50'
    },
    {
      id: 'overview',
      name: 'Analytics Overview',
      description: 'Comprehensive business analytics and insights',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: resolvedTheme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'
    },
    {
      id: 'packages',
      name: 'Packages Report',
      description: 'Package sales, performance, and trends',
      icon: Package,
      color: 'text-orange-600',
      bgColor: resolvedTheme === 'dark' ? 'bg-orange-500/10' : 'bg-orange-50'
    },
    {
      id: 'networks',
      name: 'Networks Report',
      description: 'Network performance and connectivity metrics',
      icon: Network,
      color: 'text-indigo-600',
      bgColor: resolvedTheme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-50'
    },
    {
      id: 'transactions',
      name: 'Transactions Report',
      description: 'Transaction history and payment analytics',
      icon: FileText,
      color: 'text-cyan-600',
      bgColor: resolvedTheme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50'
    }
  ]

  const handleExport = async (reportType) => {
    setIsExporting(true)
    setSelectedReport(reportType)
    
    try {
      const params = { period: dateRange }
      
      let result
      switch (reportType) {
        case 'financial':
          result = await reportsService.exportFinancialReport(params)
          break
        case 'users':
          result = await reportsService.exportUserReport(params)
          break
        case 'revenue':
          result = await reportsService.exportRevenueReport(params)
          break
        case 'overview':
          result = await reportsService.exportOverviewReport(params)
          break
        case 'packages':
          result = await reportsService.exportPackagesReport(params)
          break
        case 'networks':
          result = await reportsService.exportNetworksReport(params)
          break
        case 'transactions':
          result = await reportsService.exportTransactionsReport(params)
          break
        default:
          throw new Error('Invalid report type')
      }
      
      if (result.success) {
        toast.success(result.message || 'Report exported successfully!')
      } else {
        toast.error(result.error || 'Failed to export report')
        console.error('Export failed:', result.error)
      }
    } catch (error) {
      toast.error('Failed to export report. Please try again.')
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setSelectedReport(null)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Download className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Export Reports</h2>
              <p className="text-sm text-muted-foreground">Choose a report type to export</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Date Range Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-400">Report Period</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  {getDateRangeLabel()}
                </p>
              </div>
            </div>
          </div>

          {/* Report Options */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Select Report Type</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {reportTypes.map((report) => {
                const IconComponent = report.icon
                const isSelected = selectedReport === report.id
                const isCurrentlyExporting = isExporting && isSelected
                
                return (
                  <button
                    key={report.id}
                    onClick={() => !isExporting && handleExport(report.id)}
                    disabled={isExporting}
                    className={`p-4 rounded-lg border transition-all duration-200 text-left h-full ${
                      isExporting && !isSelected
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:border-primary hover:shadow-sm cursor-pointer'
                    } ${
                      isCurrentlyExporting
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className={`p-3 rounded-lg ${report.bgColor}`}>
                        {isCurrentlyExporting ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        ) : (
                          <IconComponent className={`h-6 w-6 ${report.color}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground text-sm">{report.name}</h5>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
                        {isCurrentlyExporting && (
                          <p className="text-xs text-primary mt-2">Generating PDF...</p>
                        )}
                      </div>
                      <div className="flex items-center">
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            <p>Reports will be downloaded as PDF</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal