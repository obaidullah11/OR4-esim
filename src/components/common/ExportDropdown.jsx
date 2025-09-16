import { useState, useRef, useEffect } from 'react'
import { Download, FileText, FileSpreadsheet, ChevronDown } from 'lucide-react'

const ExportDropdown = ({ onExportPDF, onExportExcel, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleExportPDF = () => {
    setIsOpen(false)
    onExportPDF()
  }

  const handleExportExcel = () => {
    setIsOpen(false)
    onExportExcel()
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={handleExportPDF}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="h-4 w-4 mr-3 text-red-600" />
              Export as PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 mr-3 text-green-600" />
              Export as Excel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExportDropdown
