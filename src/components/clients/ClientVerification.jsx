import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Mail,
  Phone,
  CreditCard,
  Loader2
} from 'lucide-react'
import { clientService } from '../../services/clientService'

function ClientVerification({ clientData, onVerificationComplete }) {
  const { resolvedTheme } = useTheme()
  const [verificationResults, setVerificationResults] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Auto-verify when client data changes
  useEffect(() => {
    if (clientData && clientData.email && clientData.phone_number) {
      verifyClient()
    }
  }, [clientData])

  const verifyClient = async () => {
    if (!clientData) return

    setIsVerifying(true)
    try {
      const result = await clientService.verifyClientData(clientData)
      
      if (result.success) {
        setVerificationResults(result.data)
        if (onVerificationComplete) {
          onVerificationComplete(result.data)
        }
      }
    } catch (error) {
      console.error('Verification failed:', error)
    } finally {
      setIsVerifying(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />
      case 'skipped':
        return <Clock className="w-4 h-4 text-gray-400" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'partial':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'pending':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'skipped':
        return 'text-gray-500 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  if (!clientData || (!clientData.email && !clientData.phone_number)) {
    return (
      <div className={`p-4 rounded-lg border ${
        resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-2 text-gray-500">
          <Shield className="w-5 h-5" />
          <span>Enter client details to enable verification</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border ${
      resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-blue-500" />
          <h3 className={`font-semibold ${
            resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Client Verification
          </h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {isVerifying && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
          <button
            onClick={verifyClient}
            disabled={isVerifying}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isVerifying ? 'Verifying...' : 'Re-verify'}
          </button>
        </div>
      </div>

      {/* Overall Status */}
      {verificationResults && (
        <div className={`p-3 rounded-lg border mb-4 ${getStatusColor(verificationResults.overall.status)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(verificationResults.overall.status)}
              <span className="font-medium">
                Overall Verification: {verificationResults.overall.score}%
              </span>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm underline hover:no-underline"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          <p className="text-sm mt-1">{verificationResults.overall.message}</p>
        </div>
      )}

      {/* Detailed Results */}
      {verificationResults && showDetails && (
        <div className="space-y-3">
          {/* Email Verification */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationResults.email.status)}
                  <span className="font-medium">Email Verification</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {verificationResults.email.message}
                </p>
              </div>
            </div>
          </div>

          {/* Phone Verification */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-500" />
              <div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(verificationResults.phone.status)}
                  <span className="font-medium">Phone Verification</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {verificationResults.phone.message}
                </p>
              </div>
            </div>
          </div>

          {/* Passport Verification */}
          {clientData.passport_number && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-4 h-4 text-gray-500" />
                <div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(verificationResults.passport.status)}
                    <span className="font-medium">Passport Verification</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {verificationResults.passport.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verification Tips */}
      {verificationResults && verificationResults.overall.score < 80 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                Verification Tips
              </h4>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                {verificationResults.email.status !== 'verified' && (
                  <li>• Ensure email address is in correct format (user@domain.com)</li>
                )}
                {verificationResults.phone.status !== 'verified' && (
                  <li>• Use international phone format (+1234567890)</li>
                )}
                {verificationResults.passport.status === 'failed' && (
                  <li>• Passport should be 6-12 alphanumeric characters</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {verificationResults && verificationResults.overall.score >= 80 && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">
              Client data verification passed! Ready for eSIM assignment.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClientVerification
