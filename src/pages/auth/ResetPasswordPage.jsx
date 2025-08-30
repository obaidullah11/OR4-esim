import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import { authService } from '../../services/authService'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import DotMap from '../../components/auth/DotMap'

function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { resolvedTheme } = useTheme()

  // Get email from navigation state
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      toast.error('Please go through the forgot password process first')
      navigate('/forgot-password')
    }
  }, [email, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    if (!formData.newPassword.trim()) {
      toast.error('Please enter your new password')
      return false
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return false
    }

    if (!formData.confirmPassword.trim()) {
      toast.error('Please confirm your new password')
      return false
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return false
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
      await authService.confirmPasswordReset(
        email,
        formData.newPassword,
        formData.confirmPassword
      )
      setIsSuccess(true)
      toast.success('Password reset successfully! You can now login with your new password.')
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  const handleBackToForgotPassword = () => {
    navigate('/forgot-password')
  }

  if (!email) {
    return null
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
            'w-full max-w-4xl h-[600px] overflow-hidden rounded-2xl flex shadow-xl transition-colors duration-300',
            resolvedTheme === 'dark'
              ? 'bg-slate-800 border border-slate-700'
              : 'bg-white'
          )}
        >
          {/* Left side - Animated Map */}
          <div className={cn(
            'hidden lg:block w-1/2 h-[600px] relative overflow-hidden transition-colors duration-300',
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
                  <Lock className="text-white h-6 w-6" />
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
                Reset Password
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className={cn(
                  'text-center text-lg transition-colors duration-300',
                  resolvedTheme === 'dark' ? 'text-slate-300' : 'text-gray-600'
                )}
              >
                Create a new secure password for your account.
              </motion.p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className={cn(
            'w-full lg:w-1/2 p-6 lg:p-8 flex flex-col transition-colors duration-300',
            resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {/* Back to Forgot Password Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onClick={handleBackToForgotPassword}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors duration-300 hover:gap-3',
                resolvedTheme === 'dark'
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-gray-600 hover:text-gray-800'
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Forgot Password
            </motion.button>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center">
              {!isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h1 className={cn(
                      'text-2xl font-bold mb-2 transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      Create New Password
                    </h1>
                    <p className={cn(
                      'text-sm transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                    )}>
                      Enter your new password below. Make sure it's secure and memorable.
                    </p>
                    <p className={cn(
                      'text-xs mt-2 p-2 rounded-lg transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'
                    )}>
                      Resetting password for: <span className="font-medium">{email}</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label 
                        htmlFor="newPassword" 
                        className={cn(
                          'block text-sm font-medium mb-2 transition-colors duration-300',
                          resolvedTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                        )}
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className={cn(
                          'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300',
                          resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                        )} />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={cn(
                            'w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent',
                            resolvedTheme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          )}
                          placeholder="Enter new password"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className={cn(
                            'absolute right-3 top-1/2 transform -translate-y-1/2 p-1 transition-colors duration-300',
                            resolvedTheme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
                          )}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className={cn(
                        'text-xs mt-1 transition-colors duration-300',
                        resolvedTheme === 'dark' ? 'text-slate-500' : 'text-gray-500'
                      )}>
                        Must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <label 
                        htmlFor="confirmPassword" 
                        className={cn(
                          'block text-sm font-medium mb-2 transition-colors duration-300',
                          resolvedTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                        )}
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className={cn(
                          'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300',
                          resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                        )} />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={cn(
                            'w-full pl-10 pr-12 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-green-500 focus:border-transparent',
                            resolvedTheme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          )}
                          placeholder="Confirm new password"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className={cn(
                            'absolute right-3 top-1/2 transform -translate-y-1/2 p-1 transition-colors duration-300',
                            resolvedTheme === 'dark' ? 'text-slate-400 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600'
                          )}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      className={cn(
                        'w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform',
                        isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : resolvedTheme === 'dark'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl',
                        isHovered && !isLoading ? 'scale-105' : 'scale-100'
                      )}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Resetting Password...
                        </div>
                      ) : (
                        'Reset Password'
                      )}
                    </motion.button>
                  </form>

                  <div className="text-center">
                    <p className={cn(
                      'text-sm transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                    )}>
                      Remember your password?{' '}
                      <Link 
                        to="/login"
                        className={cn(
                          'font-medium hover:underline transition-colors duration-300',
                          resolvedTheme === 'dark'
                            ? 'text-green-400 hover:text-green-300'
                            : 'text-green-600 hover:text-green-700'
                        )}
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-6"
                >
                  <div className={cn(
                    'h-16 w-16 rounded-full flex items-center justify-center mx-auto transition-colors duration-300',
                    resolvedTheme === 'dark'
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-900/50'
                      : 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-200'
                  )}>
                    <CheckCircle className="text-white h-8 w-8" />
                  </div>

                  <div>
                    <h2 className={cn(
                      'text-2xl font-bold mb-2 transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      Password Reset Successfully!
                    </h2>
                    <p className={cn(
                      'text-sm transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                    )}>
                      Your password has been updated. You can now login with your new password.
                    </p>
                  </div>

                  <motion.button
                    onClick={handleBackToLogin}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                      'w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 transform',
                      resolvedTheme === 'dark'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl',
                      isHovered ? 'scale-105' : 'scale-100'
                    )}
                  >
                    Continue to Login
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
