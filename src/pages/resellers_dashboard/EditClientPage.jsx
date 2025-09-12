import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Globe,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { clientService } from '../../services/clientService'
import ClientVerification from '../../components/clients/ClientVerification'
import { extractFieldErrors, getErrorToastConfig } from '../../utils/errorHandler'

function EditClientPage() {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    passportNumber: '',
    nationalId: '',
    countryOfTravel: '',
    dateOfTravel: '',
    notes: '',
    status: 'active'
  })
  const [errors, setErrors] = useState({})

  // Load client data
  useEffect(() => {
    const loadClient = async () => {
      try {
        setLoading(true)
        const response = await clientService.getClientById(id)
        
        if (response.success) {
          const client = response.data
          setFormData({
            fullName: client.full_name || '',
            email: client.email || '',
            phone: client.phone_number || '',
            passportNumber: client.passport_number || '',
            nationalId: client.national_id || '',
            countryOfTravel: client.country_of_travel || '',
            dateOfTravel: client.date_of_travel || '',
            notes: client.admin_notes || '',
            status: client.status || 'active'
          })
          console.log('Loaded client data:', client)
        } else {
          toast.error('Failed to load client data')
          navigate('/reseller-dashboard/clients')
        }
      } catch (error) {
        console.error('Failed to load client:', error)
        toast.error('Failed to load client data')
        navigate('/reseller-dashboard/clients')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadClient()
    }
  }, [id, navigate])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the form errors before submitting')
      return
    }

    setIsSubmitting(true)

    try {
      // Prepare client data for API
      const clientData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone,
        passport_number: formData.passportNumber || '',
        national_id: formData.nationalId || '',
        country_of_travel: formData.countryOfTravel || '',
        date_of_travel: formData.dateOfTravel || null,
        admin_notes: formData.notes || '',
        status: formData.status
      }

      // Validate data before sending
      const validation = clientService.validateClientData(clientData)
      if (!validation.isValid) {
        setErrors(validation.errors)
        toast.error('Please fix the form errors before submitting')
        setIsSubmitting(false)
        return
      }

      console.log('Updating client with data:', clientData)

      // Call the real API
      const response = await clientService.updateClient(id, clientData)
      
      if (response.success) {
        setShowSuccess(true)
        toast.success('Client updated successfully!')
        
        console.log('Client updated successfully:', response.data)
        
        // Navigate back after success
        setTimeout(() => {
          navigate('/reseller-dashboard/clients')
        }, 2000)
      } else {
        console.error('Client update failed:', response.error)
        
        // Handle field-specific errors from the API
        if (response.details) {
          const fieldErrors = extractFieldErrors(response.details)
          setErrors(fieldErrors)
        }
        
        // Show user-friendly error message
        const toastConfig = getErrorToastConfig(response)
        toast.error(toastConfig.message, { duration: toastConfig.duration })
      }
      
    } catch (error) {
      console.error('Failed to update client:', error)
      
      // Handle field-specific errors from the API
      if (error.details) {
        const fieldErrors = extractFieldErrors(error.details)
        setErrors(fieldErrors)
      }
      
      // Show user-friendly error message
      const toastConfig = getErrorToastConfig(error)
      toast.error(toastConfig.message, { duration: toastConfig.duration })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    navigate('/reseller-dashboard/clients')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          <span className="text-lg">Loading client data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Client
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update client information and details
            </p>
          </div>
        </div>
        
        {showSuccess && (
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Client updated successfully!</span>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Additional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Passport Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Passport Number
                </label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter passport number"
                />
              </div>

              {/* National ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  National ID
                </label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter national ID"
                />
              </div>

              {/* Country of Travel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country of Travel
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="countryOfTravel"
                    value={formData.countryOfTravel}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter destination country"
                  />
                </div>
              </div>

              {/* Date of Travel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Travel
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="dateOfTravel"
                    value={formData.dateOfTravel}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Admin Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add any additional notes about this client..."
              />
            </div>
          </div>

          {/* Client Verification */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <ClientVerification
              clientData={{
                id: id, // Include ID for edit mode
                full_name: formData.fullName,
                email: formData.email,
                phone_number: formData.phone,
                passport_number: formData.passportNumber,
                national_id: formData.nationalId,
                country_of_travel: formData.countryOfTravel,
                date_of_travel: formData.dateOfTravel
              }}
              onVerificationComplete={(results) => {
                console.log('Verification results:', results)
              }}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{isSubmitting ? 'Updating...' : 'Update Client'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditClientPage
