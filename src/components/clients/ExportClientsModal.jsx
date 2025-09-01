import { useState } from 'react'
import { X, Download, Calendar, Filter, FileText, File } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { clientService } from '../../services/clientService'

export default function ExportClientsModal({ isOpen, onClose, currentFilters = {} }) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportFilters, setExportFilters] = useState({
    status: currentFilters.status || 'all',
    client_type: 'all',
    date_from: '',
    date_to: '',
    search: currentFilters.search || ''
  })
  const [exportFormat, setExportFormat] = useState('csv')

  const handleFilterChange = (field, value) => {
    setExportFilters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleExport = async () => {
    if (isExporting) return

    try {
      setIsExporting(true)
      console.log('📄 Exporting clients with filters:', exportFilters)

      // Prepare filters for API
      const filters = {}
      if (exportFilters.status !== 'all') filters.status = exportFilters.status
      if (exportFilters.client_type !== 'all') filters.client_type = exportFilters.client_type
      if (exportFilters.search) filters.search = exportFilters.search
      if (exportFilters.date_from) filters.date_from = exportFilters.date_from
      if (exportFilters.date_to) filters.date_to = exportFilters.date_to

      toast.loading(`Preparing client export as ${exportFormat.toUpperCase()}...`, { duration: 2000 })

      const result = await clientService.exportClients(filters, exportFormat)

      if (result.success) {
        toast.success(result.message || 'Clients exported successfully!')
        console.log('✅ Clients exported successfully')
        onClose() // Close modal on success
      } else {
        toast.error(result.error || 'Failed to export clients')
        console.error('❌ Export failed:', result.error)
      }
    } catch (error) {
      console.error('❌ Failed to export clients:', error)
      toast.error('Failed to export clients. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const resetFilters = () => {
    setExportFilters({
      status: 'all',
      client_type: 'all',
      date_from: '',
      date_to: '',
      search: ''
    })
    setExportFormat('csv')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Download className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Export Clients</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Configure export settings and filters to customize your download.
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setExportFormat('csv')}
                className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                  exportFormat === 'csv'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <File className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">CSV</div>
                  <div className="text-xs text-muted-foreground">Spreadsheet format</div>
                </div>
              </button>
              
              <button
                onClick={() => setExportFormat('pdf')}
                className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors ${
                  exportFormat === 'pdf'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">PDF</div>
                  <div className="text-xs text-muted-foreground">Professional report</div>
                </div>
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Client Status
            </label>
            <select
              value={exportFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Client Type Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Client Type
            </label>
            <select
              value={exportFilters.client_type}
              onChange={(e) => handleFilterChange('client_type', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Types</option>
              <option value="reseller_client">Reseller Client</option>
              <option value="direct_user">Direct User</option>
            </select>
          </div>

          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Search (Name, Email, Phone)
            </label>
            <input
              type="text"
              value={exportFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search clients..."
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                From Date
              </label>
              <input
                type="date"
                value={exportFilters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                To Date
              </label>
              <input
                type="date"
                value={exportFilters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Export Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">
                  {exportFormat === 'pdf' ? 'PDF Report includes:' : 'CSV Export includes:'}
                </p>
                <ul className="mt-1 text-xs space-y-1">
                  <li>• Company header with export details</li>
                  <li>• Applied filters information</li>
                  <li>• Client data: ID (CLT-XXXXXX), Name, Email, Phone</li>
                  <li>• Account Status, Type, Service Tier, Country</li>
                  <li>• Financial: Total Orders, Total Spent (formatted)</li>
                  <li>• Activity: Last Activity, Total Logins, Registration Date</li>
                  <li>• Summary statistics and footer</li>
                  {exportFormat === 'pdf' && (
                    <>
                      <li>• Professional table layout with colors</li>
                      <li>• Landscape orientation for optimal viewing</li>
                      <li>• Page numbers and company branding</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <button
            onClick={resetFilters}
            className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Export {exportFormat.toUpperCase()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
