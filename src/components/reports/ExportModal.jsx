import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { 
  X, 
  Download, 
  FileText, 
  File, 
  Calendar, 
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const ExportModal = ({ isOpen, onClose, onExport, reportType, dateRange }) => {
  const { resolvedTheme } = useTheme()
  const [selectedFormat, setSelectedFormat] = useState('pdf')
  const [selectedReports, setSelectedReports] = useState(['overview'])
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeRawData, setIncludeRawData] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  if (!isOpen) return null

  const exportFormats = [
    { 
      value: 'pdf', 
      label: 'PDF Report', 
      icon: FileText, 
      description: 'Professional formatted report with charts and tables',
      recommended: true
    },
    { 
      value: 'excel', 
      label: 'Excel Spreadsheet', 
      icon: File, 
      description: 'Detailed data in Excel format for further analysis'
    },
    { 
      value: 'csv', 
      label: 'CSV Data', 
      icon: File, 
      description: 'Raw data in CSV format for custom processing'
    }
  ]

  const reportOptions = [
    { value: 'overview', label: 'Overview Report', description: 'Key metrics and performance summary' },
    { value: 'revenue', label: 'Revenue Analysis', description: 'Detailed revenue breakdown and trends' },
    { value: 'users', label: 'User Analytics', description: 'User growth and engagement metrics' },
    { value: 'packages', label: 'Package Performance', description: 'Top-selling packages and market share' },
    { value: 'networks', label: 'Network Analysis', description: 'Network provider performance comparison' },
    { value: 'transactions', label: 'Transaction Details', description: 'Complete transaction history and details' }
  ]

  const handleReportToggle = (reportValue) => {
    setSelectedReports(prev => 
      prev.includes(reportValue)
        ? prev.filter(r => r !== reportValue)
        : [...prev, reportValue]
    )
  }

  const handleExport = async () => {
    if (selectedReports.length === 0) {
      return
    }

    setIsExporting(true)
    
    try {
      const exportData = {
        type: selectedReports.join(', '),
        format: selectedFormat,
        dateRange,
        includeCharts,
        includeRawData,
        reports: selectedReports
      }
      
      await onExport(selectedFormat, exportData)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '7days': return 'Last 7 Days'
      case '30days': return 'Last 30 Days'
      case '90days': return 'Last 90 Days'
      case '1year': return 'Last Year'
      default: return 'Custom Range'
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
              <Download className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Export Reports</h2>
              <p className="text-sm text-muted-foreground">Generate and download analytics reports</p>
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
        <div className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
          {/* Date Range Info */}
          <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium text-blue-700 dark:text-blue-400">Export Period</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Reports will include data for: {getDateRangeLabel()}
                </p>
              </div>
            </div>
          </div>

          {/* Export Format Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Export Format
            </label>
            <div className="space-y-3">
              {exportFormats.map((format) => {
                const FormatIcon = format.icon
                return (
                  <label
                    key={format.value}
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedFormat === format.value
                        ? resolvedTheme === 'dark'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-blue-500 bg-blue-50'
                        : resolvedTheme === 'dark'
                          ? 'border-slate-600 hover:border-slate-500'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={selectedFormat === format.value}
                      onChange={(e) => setSelectedFormat(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-2 rounded-lg ${
                      selectedFormat === format.value
                        ? resolvedTheme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'
                        : resolvedTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
                    }`}>
                      <FormatIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground">{format.label}</p>
                        {format.recommended && (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{format.description}</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Report Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Select Reports to Include
            </label>
            <div className="space-y-2">
              {reportOptions.map((report) => (
                <label
                  key={report.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReports.includes(report.value)
                      ? resolvedTheme === 'dark'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-blue-500 bg-blue-50'
                      : resolvedTheme === 'dark'
                        ? 'border-slate-600 hover:border-slate-500'
                        : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.value)}
                    onChange={() => handleReportToggle(report.value)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{report.label}</p>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Export Options
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeCharts}
                  onChange={(e) => setIncludeCharts(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Include charts and visualizations</span>
                </div>
              </label>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeRawData}
                  onChange={(e) => setIncludeRawData(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Include raw data tables</span>
                </div>
              </label>
            </div>
          </div>

          {/* Export Preview */}
          {selectedReports.length > 0 && (
            <div className="p-4 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-700 dark:text-green-400">Export Preview</h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Your export will include {selectedReports.length} report(s) in {selectedFormat.toUpperCase()} format
                    {includeCharts && ', with charts'}
                    {includeRawData && ', with raw data tables'}.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${
              resolvedTheme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={selectedReports.length === 0 || isExporting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedReports.length === 0 || isExporting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Export Reports</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExportModal
