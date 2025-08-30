import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { 
  X, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Trash2,
  UserX,
  AlertCircle,
  MessageSquare
} from 'lucide-react'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  type = "warning", // warning, danger, info, success
  confirmText = "Confirm",
  cancelText = "Cancel",
  showInput = false,
  inputLabel = "Reason",
  inputPlaceholder = "Enter reason...",
  inputRequired = false,
  inputType = "text", // text, textarea, select
  inputOptions = [], // for select type
  isLoading = false
}) => {
  const { resolvedTheme } = useTheme()
  const [inputValue, setInputValue] = useState('')

  if (!isOpen) return null

  const handleConfirm = () => {
    if (showInput && inputRequired && !inputValue.trim()) {
      return
    }
    onConfirm(inputValue)
    setInputValue('')
  }

  const handleClose = () => {
    setInputValue('')
    onClose()
  }

  // Get icon and colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 className="h-6 w-6 text-red-500" />,
          bgColor: resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
          borderColor: resolvedTheme === 'dark' ? 'border-red-500/20' : 'border-red-200',
          textColor: resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-700',
          buttonColor: 'bg-red-600 hover:bg-red-700 text-white'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          bgColor: resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
          borderColor: resolvedTheme === 'dark' ? 'border-yellow-500/20' : 'border-yellow-200',
          textColor: resolvedTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
      case 'info':
        return {
          icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
          bgColor: resolvedTheme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-50',
          borderColor: resolvedTheme === 'dark' ? 'border-blue-500/20' : 'border-blue-200',
          textColor: resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-700',
          buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white'
        }
      case 'success':
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          bgColor: resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
          borderColor: resolvedTheme === 'dark' ? 'border-green-500/20' : 'border-green-200',
          textColor: resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-700',
          buttonColor: 'bg-green-600 hover:bg-green-700 text-white'
        }
      default:
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          bgColor: resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
          borderColor: resolvedTheme === 'dark' ? 'border-yellow-500/20' : 'border-yellow-200',
          textColor: resolvedTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-700',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        }
    }
  }

  const typeConfig = getTypeConfig()

  const renderInput = () => {
    if (!showInput) return null

    switch (inputType) {
      case 'textarea':
        return (
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            rows={3}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            required={inputRequired}
          />
        )
      case 'select':
        return (
          <select
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required={inputRequired}
          >
            <option value="">Select an option</option>
            {inputOptions.map(option => (
              <option key={option.value || option} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
        )
      default:
        return (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputPlaceholder}
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required={inputRequired}
          />
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`
        bg-card border border-border rounded-lg shadow-xl max-w-md w-full
        ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            {typeConfig.icon}
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          </div>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Warning/Info Box */}
          <div className={`p-4 rounded-lg border ${typeConfig.bgColor} ${typeConfig.borderColor}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {typeConfig.icon}
              </div>
              <div className={`text-sm ${typeConfig.textColor}`}>
                <p>{message}</p>
              </div>
            </div>
          </div>

          {/* Input Field */}
          {showInput && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                {inputLabel} {inputRequired && <span className="text-red-500">*</span>}
              </label>
              {renderInput()}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
              resolvedTheme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || (showInput && inputRequired && !inputValue.trim())}
            className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${typeConfig.buttonColor}`}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
