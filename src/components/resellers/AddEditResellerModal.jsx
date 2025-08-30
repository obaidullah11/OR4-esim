import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { X, User, Mail, Phone, MapPin, DollarSign, CreditCard, Users, Smartphone, Lock, Eye, EyeOff, FileText, CheckCircle, Edit } from 'lucide-react'
import CountrySelect from '../common/CountrySelect'
import PhoneInput from '../common/PhoneInput'
import { countries } from '../../data/countries'
import { resellerService } from '../../services/resellerService'
import toast from 'react-hot-toast'

const AddEditResellerModal = ({ isOpen, onClose, reseller, onSave }) => {
  const { resolvedTheme } = useTheme()
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    countryOfRegistration: '',
    phoneCountryCode: 'US',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    status: 'pending',
    simLimit: 100,
    creditLimit: 5000,
    notes: '',
    acceptTerms: false
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Populate form when editing
  useEffect(() => {
    if (reseller) {
      // Parse existing phone number to extract country code and number
      const phoneMatch = reseller.phone?.match(/^(\+\d+)\s*(.*)$/)
      const phoneCountryCode = phoneMatch ?
        countries.find(c => c.phoneCode === phoneMatch[1])?.code || 'US' : 'US'
      const phoneNumber = phoneMatch ? phoneMatch[2] : reseller.phone || ''

      setFormData({
        email: reseller.email || '',
        firstName: reseller.firstName || reseller.name?.split(' ')[0] || '',
        lastName: reseller.lastName || reseller.name?.split(' ').slice(1).join(' ') || '',
        countryOfRegistration: reseller.countryOfRegistration || reseller.location || '',
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        password: '', // Never populate password fields
        confirmPassword: '',
        status: reseller.status || 'pending',
        simLimit: reseller.simLimit || 100,
        creditLimit: reseller.creditLimit || 5000,
        notes: reseller.notes || '',
        acceptTerms: true // Assume existing resellers have accepted terms
      })
    } else {
      // Reset form for new reseller
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        countryOfRegistration: '',
        phoneCountryCode: 'US',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        status: 'pending',
        simLimit: 100,
        creditLimit: 5000,
        notes: '',
        acceptTerms: false
      })
    }
    setErrors({})
    setShowPassword(false)
    setShowConfirmPassword(false)
  }, [reseller, isOpen])

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

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    // Country validation
    if (!formData.countryOfRegistration.trim()) {
      newErrors.countryOfRegistration = 'Country is required'
    }

    // Phone validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    }

    // Password validation (only for new resellers)
    if (!reseller) {
      if (!formData.password) {
        newErrors.password = 'Password is required'
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = 'Password must contain uppercase, lowercase, and number'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }

      // Terms acceptance
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions'
      }
    }

    // SIM limit validation
    if (!formData.simLimit || formData.simLimit < 1) {
      newErrors.simLimit = 'SIM limit must be at least 1'
    }

    // Credit limit validation
    if (!formData.creditLimit || formData.creditLimit < 100) {
      newErrors.creditLimit = 'Credit limit must be at least $100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      if (reseller) {
        // Update existing reseller using PUT endpoint
        const updateData = {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          country_code: countries.find(c => c.code === formData.phoneCountryCode)?.phoneCode || formData.phoneCountryCode,
          phone_number: formData.phoneNumber,
          max_clients: parseInt(formData.simLimit) || 0,
          max_sims: parseInt(formData.simLimit) || 0,
          credit_limit: parseFloat(formData.creditLimit).toFixed(2)
        }
        
        const response = await resellerService.updateReseller(reseller.id, updateData)
        
        if (response.success) {
          toast.success('Reseller updated successfully')
          onSave(response.data)
          onClose()
        } else {
          throw new Error(response.message || 'Failed to update reseller')
        }
      } else {
        // Create new reseller directly using the reseller creation API
        const resellerData = {
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          password: formData.password,
          max_clients: parseInt(formData.simLimit) || 0,
          max_sims: parseInt(formData.simLimit) || 0,
          credit_limit: parseFloat(formData.creditLimit).toFixed(2),
          country_code: countries.find(c => c.code === formData.phoneCountryCode)?.phoneCode || formData.phoneCountryCode,
          phone_number: formData.phoneNumber
        }
        
        const resellerResponse = await resellerService.createReseller(resellerData)
        
        if (resellerResponse.success) {
          toast.success('Reseller created successfully')
          onSave(resellerResponse.data)
          onClose()
        } else {
          throw new Error(resellerResponse.message || 'Failed to create reseller')
        }
      }
    } catch (error) {
      console.error('Error saving reseller:', error)
      
      // Show more specific error messages
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail)
      } else if (error.message) {
        toast.error(error.message)
      } else {
        toast.error('Failed to save reseller')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">
            {reseller ? 'Edit Reseller' : 'Add New Reseller'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </h3>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.email ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.firstName ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.lastName ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                {/* Country of Registration */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Country of Registration *
                  </label>
                  <CountrySelect
                    value={formData.countryOfRegistration}
                    onChange={(countryCode) => {
                      setFormData(prev => ({
                        ...prev,
                        countryOfRegistration: countryCode,
                        phoneCountryCode: countryCode // Auto-sync phone country code
                      }))
                    }}
                    error={!!errors.countryOfRegistration}
                    placeholder="Select country"
                  />
                  {errors.countryOfRegistration && <p className="text-red-500 text-sm mt-1">{errors.countryOfRegistration}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                    {formData.countryOfRegistration && formData.phoneCountryCode === formData.countryOfRegistration && (
                      <span className="ml-2 text-xs text-green-500 font-normal">
                        🔄 Auto-synced with registration country
                      </span>
                    )}
                  </label>
                  <PhoneInput
                    countryCode={formData.phoneCountryCode}
                    phoneNumber={formData.phoneNumber}
                    registrationCountryCode={formData.countryOfRegistration}
                    onCountryChange={(countryCode) => setFormData(prev => ({ ...prev, phoneCountryCode: countryCode }))}
                    onPhoneChange={(phoneNumber) => setFormData(prev => ({ ...prev, phoneNumber }))}
                    error={!!errors.phoneNumber}
                    placeholder="Enter phone number"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                  <p className="text-xs text-muted-foreground mt-1">
                    💡 Country code automatically matches your registration country. You can change it manually if needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Password Section (only for new resellers) */}
              {!reseller && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                    <Lock className="h-5 w-5" />
                    <span>Security</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.password ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        Must be at least 8 characters with uppercase, lowercase, and number
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-12 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                            errors.confirmPassword ? 'border-red-500' : 'border-border'
                          }`}
                          placeholder="Confirm password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Business Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Business Settings</span>
                </h3>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    SIM Limit
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      name="simLimit"
                      value={formData.simLimit}
                      onChange={handleInputChange}
                      min="1"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.simLimit ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter SIM limit"
                    />
                  </div>
                  {errors.simLimit && <p className="text-red-500 text-sm mt-1">{errors.simLimit}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Credit Limit ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      name="creditLimit"
                      value={formData.creditLimit}
                      onChange={handleInputChange}
                      min="100"
                      step="100"
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                        errors.creditLimit ? 'border-red-500' : 'border-border'
                      }`}
                      placeholder="Enter credit limit"
                    />
                  </div>
                  {errors.creditLimit && <p className="text-red-500 text-sm mt-1">{errors.creditLimit}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Full-width sections */}
          <div className="space-y-6 mt-8">
            {/* Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Additional Information</span>
              </h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter any additional notes..."
                />
              </div>
            </div>

            {/* Terms and Conditions (only for new resellers) */}
            {!reseller && (
              <div className="space-y-4">
                <div className="border-t border-border pt-4">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                      className={`mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded ${
                        errors.acceptTerms ? 'border-red-500' : ''
                      }`}
                    />
                    <div className="flex-1">
                      <label htmlFor="acceptTerms" className="text-sm text-foreground cursor-pointer">
                        I accept the{' '}
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => {
                            // Open terms modal or navigate to terms page
                            window.open('/terms-and-conditions', '_blank')
                          }}
                        >
                          Terms and Conditions
                        </button>
                        {' '}and{' '}
                        <button
                          type="button"
                          className="text-primary hover:underline"
                          onClick={() => {
                            // Open privacy policy modal or navigate to privacy page
                            window.open('/privacy-policy', '_blank')
                          }}
                        >
                          Privacy Policy
                        </button>
                        {' '}*
                      </label>
                      {errors.acceptTerms && <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>}
                    </div>
                  </div>
                </div>

                {/* Reseller Request Information */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Reseller Application Process</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Your application will be reviewed within 24-48 hours</li>
                        <li>• You will receive an email confirmation once approved</li>
                        <li>• Initial account limits can be adjusted after approval</li>
                        <li>• All reseller accounts start with "Pending" status</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || (!reseller && !formData.acceptTerms)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  {reseller ? <Edit className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  <span>{reseller ? 'Update Reseller' : 'Submit Application'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddEditResellerModal
