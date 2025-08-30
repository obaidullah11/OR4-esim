import React from 'react'

const ScrollableTable = ({
  children,
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
  maxHeight = '600px',
  showPagination = true,
  showEntries = true,
  showPageInfo = true,
  className = ""
}) => {
  return (
    <div className={`bg-card rounded-lg shadow-soft dark:shadow-dark-soft border border-border overflow-hidden ${className}`}>
      {/* Table Controls (Top) */}
      {showEntries && (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Show:</label>
              <select
                value={pagination.limit}
                onChange={(e) => onLimitChange(parseInt(e.target.value))}
                disabled={loading}
                className="px-3 py-1 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {pagination.total > 0 ? ((pagination.page - 1) * pagination.limit) + 1 : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
        </div>
      )}

      {/* Scrollable Table Container */}
      <div 
        className="overflow-x-auto overflow-y-auto"
        style={{ maxHeight }}
      >
        {children}
      </div>

      {/* Pagination Navigation (Bottom) */}
      {showPagination && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1 || loading}
              className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    disabled={loading}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                      pagination.page === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground bg-background border border-border hover:bg-muted'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages || loading}
              className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
          
          {showPageInfo && (
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ScrollableTable
