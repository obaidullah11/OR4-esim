import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Smartphone, Shield, UserPlus } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { Button, Input, FormField, cn } from '../../components/common/UI'
import ImageUpload from '../../components/common/ImageUpload/ImageUpload'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import DotMap from '../../components/auth/DotMap'
import PhoneInput from '../../components/common/PhoneInput'
import { countries } from '../../data/countries'
import toast from 'react-hot-toast'
import { authService } from '../../services/authService'

function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'public_user',
    phone_country_code: 'PK', // Default to Pakistan since user mentioned +92
    phone_number: '',
    password: '',
    confirm_password: '',
    profile_image: null,
    max_clients: 100,
    max_sims: 1000,
    credit_limit: 1000.00
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()

  // Helper function to get full phone number
  const getFullPhoneNumber = () => {
    const selectedCountry = countries.find(country => country.code === formData.phone_country_code)
    if (selectedCountry && formData.phone_number) {
      return `${selectedCountry.phoneCode} ${formData.phone_number}`
    }
    return ''
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNumberInputChange = (e) => {
    const { name, value } = e.target
    const numValue = value === '' ? '' : parseFloat(value)
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }))
  }

  const handleImageSelect = (file) => {
    setFormData(prev => ({
      ...prev,
      profile_image: file
    }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.first_name || !formData.last_name || !formData.phone_number || !formData.password || !formData.confirm_password) {
      toast.error('Please fill in all required fields')
      return false
    }

    if (formData.password !== formData.confirm_password) {
      toast.error('Passwords do not match')
      return false
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return false
    }

    // Phone number validation
    if (!formData.phone_number.trim()) {
      toast.error('Please enter a valid phone number')
      return false
    }
    
    // Basic phone number format validation (at least 7 digits)
    const phoneRegex = /^[\d\s\-\(\)]{7,}$/
    if (!phoneRegex.test(formData.phone_number)) {
      toast.error('Please enter a valid phone number (at least 7 digits)')
      return false
    }

    // Get the selected country for phone code
    const selectedCountry = countries.find(country => country.code === formData.phone_country_code)
    if (!selectedCountry) {
      toast.error('Please select a valid country code')
      return false
    }

    // Validate reseller fields if role is reseller
    if (formData.role === 'reseller') {
      if (formData.max_clients < 1) {
        toast.error('Maximum clients must be at least 1')
        return false
      }
      if (formData.max_sims < 1) {
        toast.error('Maximum SIMs must be at least 1')
        return false
      }
      if (formData.credit_limit < 0) {
        toast.error('Credit limit cannot be negative')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await authService.signup(formData)
      
      if (formData.role === 'reseller') {
        toast.success(`Registration successful! Your request has been sent for admin approval. You will be notified at ${formData.email} once approved.`)
        // Small delay to show the toast before navigation
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        toast.success(`Registration successful! You can now login with your credentials using ${formData.email}`)
        // Small delay to show the toast before navigation
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn(
      'min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300',
      resolvedTheme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    )}>
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle variant="dropdown" />
      </div>

      <div className="flex w-full h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
                      className={cn(
              'w-full max-w-6xl h-[800px] rounded-2xl flex shadow-xl transition-colors duration-300',
              resolvedTheme === 'dark'
                ? 'bg-slate-800 border border-slate-700'
                : 'bg-white'
            )}
        >
          {/* Left side - Animated Map */}
          <div className={cn(
            'hidden lg:block w-1/2 h-[800px] relative overflow-hidden transition-colors duration-300',
            resolvedTheme === 'dark'
              ? 'border-r border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900'
              : 'border-r border-gray-100 bg-gradient-to-br from-blue-50 to-indigo-100'
          )}>
            <DotMap />

            {/* Logo and text overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-6"
              >
                <div className={cn(
                  'h-12 w-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300',
                  resolvedTheme === 'dark'
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-900/50'
                    : 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-200'
                )}>
                  <UserPlus className="text-white h-6 w-6" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={cn(
                  'text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r transition-colors duration-300',
                  resolvedTheme === 'dark'
                    ? 'from-green-400 to-emerald-400'
                    : 'from-green-600 to-emerald-600'
                )}
              >
                SIM Admin Panel
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className={cn(
                  'text-sm text-center max-w-xs transition-colors duration-300',
                  resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                )}
              >
                Create your account to access SIM management services and start your journey
              </motion.p>
            </div>
          </div>

          {/* Right side - Sign Up Form */}
          <div className={cn(
            'w-full lg:w-1/2 p-6 lg:p-8 flex flex-col transition-colors duration-300 overflow-y-auto max-h-[800px] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent relative',
            resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'
          )}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="min-h-full flex flex-col justify-start pt-4"
            >
              <div className="flex items-center mb-6">
                <UserPlus className={cn(
                  'h-8 w-8 mr-3 transition-colors duration-300',
                  resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                )} />
                <div>
                  <h1 className={cn(
                    'text-2xl md:text-3xl font-bold transition-colors duration-300',
                    resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
                  )}>
                    Create Account
                  </h1>
                  <p className={cn(
                    'transition-colors duration-300',
                    resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  )}>
                    Join our SIM management platform
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 pb-8">
                {/* First Name and Last Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="First Name"
                    required
                    className="space-y-2"
                  >
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                      required
                      className={cn(
                        'transition-colors duration-300',
                        resolvedTheme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'
                      )}
                    />
                  </FormField>

                  <FormField
                    label="Last Name"
                    required
                    className="space-y-2"
                  >
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                      required
                      className={cn(
                        'transition-colors duration-300',
                        resolvedTheme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'
                      )}
                    />
                  </FormField>
                </div>

                {/* Email */}
                <FormField
                  label="Email Address"
                  required
                  className="space-y-2"
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                    className={cn(
                      'transition-colors duration-300',
                      resolvedTheme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                        : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'
                    )}
                  />
                </FormField>

                {/* Phone Number */}
                <FormField
                  label="Phone Number"
                  required
                  className="space-y-2"
                >
                  <PhoneInput
                    countryCode={formData.phone_country_code}
                    phoneNumber={formData.phone_number}
                    onCountryChange={(countryCode) => setFormData(prev => ({ ...prev, phone_country_code: countryCode }))}
                    onPhoneChange={(phoneNumber) => setFormData(prev => ({ ...prev, phone_number: phoneNumber }))}
                    placeholder="Enter your phone number"
                    className="transition-colors duration-300"
                  />
                  {formData.phone_number && (
                    <p className={cn(
                      'text-xs transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600'
                    )}>
                      📞 Full number: {getFullPhoneNumber()}
                    </p>
                  )}
                </FormField>

                {/* Role Selection */}
                <FormField
                  label="Account Type"
                  required
                  className="space-y-2"
                >
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className={cn(
                      'w-full px-3 py-2 border rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500',
                      resolvedTheme === 'dark'
                        ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-400'
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:ring-blue-500'
                    )}
                  >
                    <option value="public_user">Public User</option>
                    <option value="reseller">Reseller (Requires Approval)</option>
                  </select>
                  {formData.role === 'reseller' && (
                    <p className={cn(
                      'text-xs transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    )}>
                      ⓘ Reseller accounts require admin approval before activation
                    </p>
                  )}
                </FormField>

                {/* Reseller-specific fields */}
                {formData.role === 'reseller' && (
                  <div className="space-y-4 p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                    <h3 className={cn(
                      'text-sm font-medium transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                    )}>
                      Reseller Configuration
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        label="Max Clients"
                        className="space-y-2"
                      >
                        <Input
                          id="max_clients"
                          name="max_clients"
                          type="number"
                          min="1"
                          value={formData.max_clients}
                          onChange={handleNumberInputChange}
                          placeholder="100"
                          className={cn(
                            'transition-colors duration-300',
                            resolvedTheme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                              : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'
                          )}
                        />
                      </FormField>

                      <FormField
                        label="Max SIMs"
                        className="space-y-2"
                      >
                        <Input
                          id="max_sims"
                          name="max_sims"
                          type="number"
                          min="1"
                          value={formData.max_sims}
                          onChange={handleNumberInputChange}
                          placeholder="1000"
                          className={cn(
                            'transition-colors duration-300',
                            resolvedTheme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                              : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'
                          )}
                        />
                      </FormField>

                      <FormField
                        label="Credit Limit ($)"
                        className="space-y-2"
                      >
                        <Input
                          id="credit_limit"
                          name="credit_limit"
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.credit_limit}
                          onChange={handleNumberInputChange}
                          placeholder="1000.00"
                          className={cn(
                            'transition-colors duration-300',
                            resolvedTheme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                              : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'
                          )}
                        />
                      </FormField>
                    </div>
                  </div>
                )}

                {/* Profile Image Upload */}
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  label="Profile Image (Optional)"
                  required={false}
                  className="transition-colors duration-300"
                />

                {/* Password */}
                <FormField
                  label="Password"
                  required
                  className="space-y-2"
                >
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      required
                      className={cn(
                        'pr-10 transition-colors duration-300',
                        resolvedTheme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'
                      )}
                    />
                    <button
                      type="button"
                      className={cn(
                        'absolute inset-y-0 right-0 flex items-center pr-3 transition-colors duration-300',
                        resolvedTheme === 'dark'
                          ? 'text-slate-400 hover:text-slate-300'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>

                {/* Confirm Password */}
                <FormField
                  label="Confirm Password"
                  required
                  className="space-y-2"
                >
                  <div className="relative">
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type={isConfirmPasswordVisible ? 'text' : 'password'}
                      value={formData.confirm_password}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      required
                      className={cn(
                        'pr-10 transition-colors duration-300',
                        resolvedTheme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                          : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'
                      )}
                    />
                    <button
                      type="button"
                      className={cn(
                        'absolute inset-y-0 right-0 flex items-center pr-3 transition-colors duration-300',
                        resolvedTheme === 'dark'
                          ? 'text-slate-400 hover:text-slate-300'
                          : 'text-gray-500 hover:text-gray-700'
                      )}
                      onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    >
                      {isConfirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormField>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                  className="pt-2"
                >
                  <Button
                    type="submit"
                    loading={isLoading}
                    className={cn(
                      'w-full bg-gradient-to-r relative overflow-hidden from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg transition-all duration-300',
                      isHovered ? (resolvedTheme === 'dark' ? 'shadow-lg shadow-green-900/50' : 'shadow-lg shadow-green-200') : ''
                    )}
                  >
                    <span className="flex items-center justify-center">
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </span>
                    {isHovered && !isLoading && (
                      <motion.span
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 1, ease: 'easeInOut' }}
                        className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        style={{ filter: 'blur(8px)' }}
                      />
                    )}
                  </Button>
                </motion.div>

                <div className="text-center mt-6">
                  <p className={cn(
                    'text-sm transition-colors duration-300',
                    resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  )}>
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      className={cn(
                        'font-medium transition-colors duration-300',
                        resolvedTheme === 'dark'
                          ? 'text-green-400 hover:text-green-300'
                          : 'text-green-600 hover:text-green-700'
                      )}
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignupPage
