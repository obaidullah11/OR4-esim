import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import { forgotPasswordService } from '../../services/forgotPasswordService'
import { Button, Input, FormField, cn } from '../../components/common/UI'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import DotMap from '../../components/auth/DotMap'
import toast from 'react-hot-toast'
import {
  Mail,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
  Loader2,
  Shield,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  ArrowRight,
  Smartphone
} from 'lucide-react'

const ForgotPasswordPage = () => {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1) // 1: Email, 2: OTP, 3: Password
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Step 1: Email
  const [email, setEmail] = useState('')
  
  // Step 2: OTP
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeRemaining, setTimeRemaining] = useState(60) // 1 minute for resend
  const [otpTimeRemaining, setOtpTimeRemaining] = useState(600) // 10 minutes for OTP expiry
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])
  const requestInProgress = useRef(false)
  
  // Step 3: Password
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false
  })
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: []
  })

  // Timer for resend button
  useEffect(() => {
    if (currentStep === 2 && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      setCanResend(true)
    }
  }, [timeRemaining, currentStep])

  // Timer for OTP expiry
  useEffect(() => {
    if (currentStep === 2 && otpTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setOtpTimeRemaining(otpTimeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [otpTimeRemaining, currentStep])

  // Password validation
  useEffect(() => {
    if (formData.newPassword) {
      const validation = forgotPasswordService.validatePassword(formData.newPassword)
      setPasswordValidation(validation)
    } else {
      setPasswordValidation({ isValid: false, errors: [] })
    }
  }, [formData.newPassword])

  // Focus first OTP input when step changes
  useEffect(() => {
    if (currentStep === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [currentStep])

  const validateEmail = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!forgotPasswordService.validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}
    const passwordValidation = forgotPasswordService.validatePassword(formData.newPassword)
    if (!passwordValidation.isValid) {
      newErrors.newPassword = passwordValidation.errors[0] || 'Invalid password'
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (!forgotPasswordService.passwordsMatch(formData.newPassword, formData.confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()

    if (!validateEmail()) return

    if (isLoading || requestInProgress.current) {
      return
    }

    requestInProgress.current = true
    setIsLoading(true)
    setErrors({})

    try {
      const response = await forgotPasswordService.requestPasswordReset(email)
      
      if (response.success) {
        toast.success('OTP sent to your email address!')
        setCurrentStep(2)
        setOtpTimeRemaining(response.data?.otp_expires_in || 600)
        setTimeRemaining(60)
        setCanResend(false)
      } else {
        setErrors({ submit: response.message || 'Failed to send OTP' })
        toast.error(response.message || 'Failed to send OTP')
      }
    } catch (error) {
      console.error('Password reset request error:', error)
      
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message })
        toast.error(error.response.data.message)
      } else if (error.response?.status === 404) {
        setErrors({ email: 'No account found with this email address' })
        toast.error('No account found with this email address')
      } else {
        setErrors({ submit: 'Network error. Please try again.' })
        toast.error('Network error. Please try again.')
      }
    } finally {
      setIsLoading(false)
      requestInProgress.current = false
    }
  }

  // Step 2: OTP handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setErrors({})

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerifyOtp(newOtp.join(''))
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      setErrors({})
      inputRefs.current[5]?.focus()
      handleVerifyOtp(pastedData)
    }
  }

  const handleVerifyOtp = async (otpCode = otp.join('')) => {
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit OTP' })
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      const response = await forgotPasswordService.verifyOTP(email, otpCode)
      
      if (response.success) {
        toast.success('OTP verified successfully!')
        setCurrentStep(3)
      } else {
        setErrors({ otp: response.message || 'Invalid OTP' })
        toast.error(response.message || 'Invalid OTP')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      
      if (error.response?.data?.message) {
        setErrors({ otp: error.response.data.message })
        toast.error(error.response.data.message)
      } else {
        setErrors({ otp: 'Failed to verify OTP. Please try again.' })
        toast.error('Failed to verify OTP. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    setErrors({})

    try {
      const response = await forgotPasswordService.resendOTP(email)
      
      if (response.success) {
        toast.success('New OTP sent to your email!')
        setOtp(['', '', '', '', '', ''])
        setTimeRemaining(60)
        setCanResend(false)
        setOtpTimeRemaining(response.data?.otp_expires_in || 600)
        inputRefs.current[0]?.focus()
      } else {
        setErrors({ resend: response.message || 'Failed to resend OTP' })
        toast.error(response.message || 'Failed to resend OTP')
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      
      if (error.response?.data?.message) {
        setErrors({ resend: error.response.data.message })
        toast.error(error.response.data.message)
      } else {
        setErrors({ resend: 'Failed to resend OTP. Please try again.' })
        toast.error('Failed to resend OTP. Please try again.')
      }
    } finally {
      setIsResending(false)
    }
  }

  // Step 3: Password reset
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    if (field === 'confirmPassword' && errors.confirmPassword) {
      if (value === formData.newPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: '' }))
      }
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    
    if (!validatePasswordForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const otpCode = otp.join('')

      
      const response = await forgotPasswordService.resetPassword(
        email,
        otpCode,
        formData.newPassword,
        formData.confirmPassword
      )
      
      if (response.success) {
        toast.success('Password updated successfully!')
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Password updated successfully. Please login with your new password.',
              type: 'success'
            },
            replace: true
          })
        }, 2000)
      } else {
        setErrors({ submit: response.message || 'Failed to update password' })
        toast.error(response.message || 'Failed to update password')
      }
    } catch (error) {
      console.error('Password reset error:', error)
      
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message })
        toast.error(error.response.data.message)
      } else if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        const newErrors = {}
        
        if (apiErrors.new_password) {
          newErrors.newPassword = Array.isArray(apiErrors.new_password) 
            ? apiErrors.new_password[0] 
            : apiErrors.new_password
        }
        if (apiErrors.confirm_password) {
          newErrors.confirmPassword = Array.isArray(apiErrors.confirm_password) 
            ? apiErrors.confirm_password[0] 
            : apiErrors.confirm_password
        }
        if (apiErrors.otp_code) {
          newErrors.submit = Array.isArray(apiErrors.otp_code) 
            ? apiErrors.otp_code[0] 
            : apiErrors.otp_code
        }
        
        if (apiErrors.non_field_errors) {
          newErrors.submit = Array.isArray(apiErrors.non_field_errors) 
            ? apiErrors.non_field_errors[0] 
            : apiErrors.non_field_errors
        }
        
        setErrors(newErrors)
        
        const firstError = Object.values(newErrors)[0]
        toast.error(firstError || 'Please check the form for errors')
        

      } else {
        setErrors({ submit: 'Network error. Please try again.' })
        toast.error('Network error. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setErrors({})
    } else {
      navigate('/login')
    }
  }

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return Mail
      case 2: return Shield
      case 3: return Lock
      default: return Mail
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Forgot Password?'
      case 2: return 'Verify OTP'
      case 3: return 'Reset Password'
      default: return 'Forgot Password?'
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return 'Enter your email address and we\'ll send you an OTP to reset your password'
      case 2: return `Enter the 6-digit code sent to ${email}`
      case 3: return 'Create a new secure password for your account'
      default: return ''
    }
  }

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.newPassword.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { text: 'One lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { text: 'One number', met: /\d/.test(formData.newPassword) }
  ]

  const isOtpExpired = otpTimeRemaining <= 0

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
            'w-full max-w-4xl overflow-hidden rounded-2xl flex shadow-xl transition-colors duration-300',
            resolvedTheme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-white'
          )}
        >
          {/* Left side - Animated Map */}
          <div className={cn(
            'hidden md:block w-1/2 h-[600px] relative overflow-hidden transition-colors duration-300',
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
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-900/50'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-200'
                )}>
                  <Smartphone className="text-white h-6 w-6" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-center"
              >
                <h2 className={cn(
                  'text-2xl font-bold mb-3 transition-colors duration-300',
                  resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                )}>
                  Secure Password Recovery
                </h2>
                <p className={cn(
                  'text-sm leading-relaxed transition-colors duration-300',
                  resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                )}>
                  We'll send you a secure OTP to verify your identity and help you reset your password safely.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="w-full md:w-1/2 h-[600px] flex flex-col">
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="min-h-full flex flex-col justify-center">
                      {/* Header */}
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h1 
                  className={cn(
                    'text-2xl font-bold mb-2 text-center',
                    resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  )}
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {getStepTitle()}
                </motion.h1>
                <motion.p 
                  className={cn(
                    'text-sm text-center',
                    resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                  )}
                  key={`desc-${currentStep}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {getStepDescription()}
                </motion.p>
              </motion.div>

                      {/* Forms */}
          <AnimatePresence mode="wait">
            {/* Step 1: Email Input */}
            {currentStep === 1 && (
              <motion.form
                key="email-form"
                onSubmit={handleSendOtp}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <FormField label="Email Address" error={errors.email}>
                  <div className="relative">
                    <Mail className={cn(
                      'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    )} />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errors.email) {
                          setErrors(prev => ({ ...prev, email: '' }))
                        }
                      }}
                      className="pl-12"
                      placeholder="Enter your email address"
                      disabled={isLoading}
                      error={!!errors.email}
                    />
                  </div>
                </FormField>

                {errors.submit && (
                  <motion.div 
                    className={cn(
                      'p-4 rounded-lg flex items-center space-x-2',
            resolvedTheme === 'dark'
                        ? 'bg-red-500/10 border border-red-500/20' 
                        : 'bg-red-50 border border-red-200'
                    )}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-500">{errors.submit}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={!email}
                  className="w-full"
                >
                  <Send className="w-5 h-5 mr-2" />
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </motion.form>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 2 && (
              <motion.div
                key="otp-form"
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* OTP Expiry Timer */}
                <div className={cn(
                  'p-3 rounded-lg text-center',
                  isOtpExpired
                    ? resolvedTheme === 'dark'
                      ? 'bg-red-500/10 border border-red-500/20'
                      : 'bg-red-50 border border-red-200'
                    : resolvedTheme === 'dark'
                      ? 'bg-blue-500/10 border border-blue-500/20'
                      : 'bg-blue-50 border border-blue-200'
                )}>
                  <div className="flex items-center justify-center space-x-2">
                    <Clock className={cn(
                      'w-4 h-4',
                      isOtpExpired ? 'text-red-500' : 'text-blue-500'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      isOtpExpired 
                        ? 'text-red-500' 
                        : resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                    )}>
                      {isOtpExpired 
                        ? 'OTP Expired' 
                        : `OTP expires in ${forgotPasswordService.formatTimeRemaining(otpTimeRemaining)}`
                      }
                    </span>
                  </div>
                </div>

                {/* OTP Input */}
                <div>
                  <label className={cn(
                    'block text-sm font-medium mb-4 text-center',
                    resolvedTheme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                  )}>
                    Enter 6-Digit OTP
                  </label>
                  <div className="flex justify-center space-x-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={isLoading || isOtpExpired}
                className={cn(
                          'w-12 h-12 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200',
                          errors.otp
                            ? resolvedTheme === 'dark'
                              ? 'border-red-500 bg-red-500/10 text-red-400'
                              : 'border-red-500 bg-red-50 text-red-900'
                            : digit
                              ? resolvedTheme === 'dark'
                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                : 'border-green-500 bg-green-50 text-green-900'
                              : resolvedTheme === 'dark'
                                ? 'border-slate-600 bg-slate-700/50 text-white focus:border-blue-500'
                                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500',
                          (isLoading || isOtpExpired) ? 'opacity-50 cursor-not-allowed' : ''
                        )}
                      />
                    ))}
                  </div>
                  {errors.otp && (
                    <div className="flex items-center justify-center space-x-2 mt-3">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">{errors.otp}</span>
                    </div>
                  )}
          </div>

                {/* Manual Verify Button */}
                {otp.join('').length === 6 && !isLoading && (
                  <Button
                    onClick={() => handleVerifyOtp()}
                    disabled={isOtpExpired}
                    className="w-full"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Verify OTP
                  </Button>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <span className={cn(
                      'ml-2 text-sm',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                    )}>
                      Verifying OTP...
                    </span>
                  </div>
                )}

                {/* Resend OTP */}
                <div className="text-center">
                  <p className={cn(
                    'text-sm mb-3',
                    resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                  )}>
                    Didn't receive the code?
                  </p>
                  <button
                    onClick={handleResendOtp}
                    disabled={!canResend || isResending || isOtpExpired}
                        className={cn(
                      'inline-flex items-center space-x-2 text-sm font-medium transition-colors',
                      !canResend || isResending || isOtpExpired
                        ? resolvedTheme === 'dark'
                          ? 'text-slate-500 cursor-not-allowed'
                          : 'text-gray-400 cursor-not-allowed'
                        : resolvedTheme === 'dark'
                          ? 'text-blue-400 hover:text-blue-300'
                          : 'text-blue-600 hover:text-blue-500'
                    )}
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        <span>
                          {canResend ? 'Resend OTP' : `Resend in ${timeRemaining}s`}
                        </span>
                      </>
                    )}
                  </button>
                  {errors.resend && (
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-500">{errors.resend}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Password Reset */}
            {currentStep === 3 && (
              <motion.form
                key="password-form"
                onSubmit={handleResetPassword}
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* New Password */}
                <FormField label="New Password" error={errors.newPassword}>
                  <div className="relative">
                    <Lock className={cn(
                      'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    )} />
                    <Input
                      type={showPasswords.newPassword ? 'text' : 'password'}
                      value={formData.newPassword}
                      onChange={(e) => handleInputChange('newPassword', e.target.value)}
                      className="pl-12 pr-12"
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      error={!!errors.newPassword}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className={cn(
                        'absolute right-3 top-1/2 transform -translate-y-1/2',
                        resolvedTheme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
                      )}
                    >
                      {showPasswords.newPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                        </div>
                </FormField>
                    
                {/* Password Requirements */}
                {formData.newPassword && (
                      <motion.div
                    className={cn(
                      'p-4 rounded-lg',
                      resolvedTheme === 'dark' 
                        ? 'bg-slate-700/30 border border-slate-600/30' 
                        : 'bg-gray-50 border border-gray-200'
                    )}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <p className={cn(
                      'text-sm font-medium mb-3',
                      resolvedTheme === 'dark' ? 'text-slate-200' : 'text-gray-700'
                    )}>
                      Password Requirements:
                    </p>
                    <div className="space-y-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className={cn(
                            'w-4 h-4',
                            req.met ? 'text-green-500' : 'text-gray-400'
                          )} />
                          <span className={cn(
                            'text-sm',
                            req.met 
                              ? 'text-green-500' 
                              : resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                          )}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                        </div>
                      </motion.div>
                )}

                {/* Confirm Password */}
                <FormField label="Confirm New Password" error={errors.confirmPassword}>
                  <div className="relative">
                    <Lock className={cn(
                      'absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    )} />
                    <Input
                      type={showPasswords.confirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-12 pr-12"
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      error={!!errors.confirmPassword}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className={cn(
                        'absolute right-3 top-1/2 transform -translate-y-1/2',
                        resolvedTheme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
                      )}
                    >
                      {showPasswords.confirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && forgotPasswordService.passwordsMatch(formData.newPassword, formData.confirmPassword) && (
                    <div className="flex items-center space-x-2 mt-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-500">Passwords match</span>
                    </div>
                  )}
                </FormField>

                {/* Submit Error */}
                {errors.submit && (
                  <motion.div 
                    className={cn(
                      'p-4 rounded-lg flex items-center space-x-2',
                      resolvedTheme === 'dark' 
                        ? 'bg-red-500/10 border border-red-500/20' 
                        : 'bg-red-50 border border-red-200'
                    )}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-sm text-red-500">{errors.submit}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={!passwordValidation.isValid || !forgotPasswordService.passwordsMatch(formData.newPassword, formData.confirmPassword)}
                  className="w-full"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  {isLoading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </motion.form>
            )}
                        </AnimatePresence>

              {/* Back Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={goBack}
                  className={cn(
                    'inline-flex items-center space-x-2 text-sm font-medium transition-colors',
                    resolvedTheme === 'dark' 
                      ? 'text-slate-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  )}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{currentStep === 1 ? 'Back to Login' : 'Back'}</span>
                </button>
              </div>

              {/* Help Text */}
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {currentStep === 1 && (
                  <p className={cn(
                    'text-xs',
                    resolvedTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                  )}>
                    Remember your password?{' '}
                    <Link
                      to="/login"
                      className={cn(
                        'font-medium',
                        resolvedTheme === 'dark' 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-500'
                      )}
                    >
                      Sign in here
                    </Link>
                  </p>
                )}
                {currentStep === 2 && (
                  <p className={cn(
                    'text-xs',
                    resolvedTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                  )}>
                    Check your spam folder if you don't see the email
                  </p>
                )}
                {currentStep === 3 && (
                  <p className={cn(
                    'text-xs',
                    resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  )}>
                    🔒 Your password will be encrypted and stored securely
                  </p>
                )}
              </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage