import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
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
  CheckCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import { clientService } from '../../services/clientService'
import { API_CONFIG } from '../../config/api'



function AddClientPage() {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resellerInfo, setResellerInfo] = useState(null)
  const [loadingReseller, setLoadingReseller] = useState(true)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationalId: '',
    dateOfTravel: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Get reseller information on component mount
  useEffect(() => {
    const fetchResellerInfo = async () => {
      if (user && user.role === 'reseller') {
        try {
          setLoadingReseller(true)
          const response = await clientService.getResellerProfile()
          if (response.success) {
            setResellerInfo(response.data)
            console.log('✅ Reseller info loaded:', response.data)
          } else {
            console.error('❌ Failed to load reseller info:', response.error)
            toast.error('Failed to load reseller information')
          }
        } catch (error) {
          console.error('❌ Error loading reseller info:', error)
          toast.error('Error loading reseller information')
        } finally {
          setLoadingReseller(false)
        }
      } else {
        setLoadingReseller(false)
      }
    }

    fetchResellerInfo()
  }, [user])

  // Handle form input changes
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

  // Detect country from phone number
  const detectCountryFromPhone = async (phone) => {
    try {
      const token = localStorage.getItem('access_token')
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/utils/detect-country/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          phone_number: phone,
          validate_esim: false // We don't need eSIM validation for client creation
        })
      })

      // Get response text first to handle both cases
      const responseText = await response.text()
      
      // Check if response is ok
      if (!response.ok) {
        console.error('Country detection API Error:', responseText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Parse JSON response
      let data
      try {
        data = JSON.parse(responseText)
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError)
        console.error('Response Text:', responseText)
        throw new Error('Invalid JSON response from server')
      }

      if (data.success && data.data) {
        return {
          name: data.data.country_name || 'Unknown',
          code: data.data.country_code || '',
          region: data.data.region || ''
        }
      } else {
        throw new Error(data.message || 'Failed to detect country')
      }

    } catch (error) {
      console.error('Error detecting country:', error)
      // Return default country info if detection fails
      return {
        name: 'Unknown',
        code: '',
        region: ''
      }
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Please enter a valid phone number'
    } else if (formData.phone.trim().length > 15) {
      newErrors.phone = 'Phone number must not exceed 15 characters'
    }

    // National ID validation (optional)
    // No specific validation required as it's optional

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
      // Check if reseller info is available
      if (!resellerInfo || !resellerInfo.id) {
        toast.error('Reseller information not available. Please refresh the page.')
        setIsSubmitting(false)
        return
      }

      // Detect country from phone number
      let countryOfTravel = 'Unknown'
      if (formData.phone.trim()) {
        toast.loading('Detecting country from phone number...')
        const countryInfo = await detectCountryFromPhone(formData.phone.trim())
        countryOfTravel = countryInfo.name
        toast.dismiss() // Remove loading message
      }

      // Prepare client data for reseller client API (different format than regular clients)
      const clientData = {
        full_name: formData.fullName,
        email: formData.email,
        phone_number: formData.phone.substring(0, 15), // Ensure max 15 characters
        passport_id: formData.nationalId || '', // Backend expects passport_id (not national_id)
        date_of_travel: formData.dateOfTravel || null,
        country_of_travel: countryOfTravel // Send country name as string (detected from phone)
        // Note: plan field removed - plan assignment should be separate step
      }

      // Basic validation (no need for complex validation as reseller service handles it)
      if (!clientData.full_name || !clientData.email || !clientData.phone_number) {
        toast.error('Please fill in all required fields')
        setIsSubmitting(false)
        return
      }

      console.log('🚀 Creating reseller client with API:', clientData)
      console.log('🔍 Reseller Info:', resellerInfo)

      // Call the reseller client API
      const response = await clientService.createResellerClient(clientData)

      if (response.success) {
        setShowSuccess(true)
        toast.success('Client added successfully!')

        console.log('✅ Client created successfully:', response.data)

        // Reset form after success
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            phone: '',
            nationalId: '',
            dateOfTravel: '',
            notes: ''
          })
          setErrors({})
          setShowSuccess(false)
          // Navigate back to client list
          navigate('/reseller-dashboard/clients')
        }, 2000)
      } else {
        console.error('❌ Client creation failed:', response.error)
        toast.error(response.error || 'Failed to create client')
      }

    } catch (error) {
      console.error('❌ Failed to create client:', error)
      toast.error('Failed to create client. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    navigate(-1) // Go back to previous page
  }

    // Show loading if reseller info is being fetched
  if (loadingReseller) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading reseller information...</p>
        </div>
      </div>
    )
  }

  // Show error if no reseller info
  if (!resellerInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load reseller information</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Retry
          </button>
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
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Add New Client</h1>
            <p className="text-muted-foreground">Register a new client for eSIM services</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Client Added Successfully!
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300">
                The client has been registered and can now be assigned eSIM plans.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.fullName ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-border'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center space-x-1">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-foreground">
                  Phone Number * <span className="text-muted-foreground text-xs">(max 15 characters)</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  maxLength={15}
                  className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  }`}
                />
                <div className="flex justify-between items-center">
                  <div>
                    {errors.phone && (
                      <p className="text-xs text-red-500 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formData.phone.length}/15
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Identification Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Identification</span>
            </h2>

              {/* Passport/National ID */}
              <div className="space-y-2">
                <label htmlFor="nationalId" className="text-sm font-medium text-foreground">
                  Passport/National ID (Optional)
                </label>
                <input
                  type="text"
                  id="nationalId"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleInputChange}
                  placeholder="Enter passport or national ID"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
              </div>
          </div>

          {/* Travel Information Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Travel Information</span>
            </h2>

              {/* Date of Travel */}
              <div className="space-y-2">
                <label htmlFor="dateOfTravel" className="text-sm font-medium text-foreground">
                  Date of Travel (Optional)
                </label>
                <input
                  type="date"
                  id="dateOfTravel"
                  name="dateOfTravel"
                  value={formData.dateOfTravel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                />
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Additional Notes</span>
            </h2>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium text-foreground">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Add any additional notes about the client"
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Creating Client...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Create Client</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddClientPage
