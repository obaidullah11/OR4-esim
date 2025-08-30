import React from 'react'

const TablePagination = ({
  pagination,
  onPageChange,
  onLimitChange,
  loading = false,
  showEntries = true,
  showPageInfo = true,
  className = ""
}) => {
  const { page, limit, total, totalPages } = pagination

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      onPageChange(newPage)
    }
  }

  const handleLimitChange = (newLimit) => {
    if (!loading) {
      onLimitChange(parseInt(newLimit))
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i)
        }
      } else if (page >= totalPages - 2) {
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        for (let i = page - 2; i <= page + 2; i++) {
          pages.push(i)
        }
      }
    }
    
    return pages
  }

  return (
    <div className={`bg-card ${className}`}>
      {/* Table Controls */}
      {showEntries && (
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-foreground">Show:</label>
              <select
                value={limit}
                onChange={(e) => handleLimitChange(e.target.value)}
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
            Showing {total > 0 ? ((page - 1) * limit) + 1 : 0} to {Math.min(page * limit, total)} of {total} entries
          </div>
        </div>
      )}

      {/* Pagination Navigation */}
      <div className="px-6 py-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                  page === pageNum
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground bg-background border border-border hover:bg-muted'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="px-3 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
        
        {showPageInfo && (
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
        )}
      </div>
    </div>
  )
}

export default TablePagination
