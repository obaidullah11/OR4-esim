import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, UserCheck, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'
import { authService } from '../../services/authService'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import DotMap from '../../components/auth/DotMap'

function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [verificationStep, setVerificationStep] = useState('')

  const navigate = useNavigate()
  const { resolvedTheme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      // Show verification steps with delays
      setVerificationStep('Checking email format...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setVerificationStep('Connecting to server...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setVerificationStep('Verifying email in database...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setVerificationStep('Finalizing verification...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Now call the actual API
      console.log('🚀 Calling API to verify email:', email)
      await authService.requestPasswordReset(email)
      console.log('✅ API call successful')
      setIsSubmitted(true)
      toast.success('Email verified successfully! You can now reset your password.')
    } catch (error) {
      toast.error(error.message || 'Failed to verify email. Please try again.')
    } finally {
      setIsLoading(false)
      setVerificationStep('')
    }
  }

  const handleContinueToReset = () => {
    navigate('/reset-password', { 
      state: { email: email }
    })
  }

  const handleBackToLogin = () => {
    navigate('/login')
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
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-900/50'
                    : 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-200'
                )}>
                  <Mail className="text-white h-6 w-6" />
                </div>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={cn(
                  'text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r transition-colors duration-300',
                  resolvedTheme === 'dark'
                    ? 'from-orange-400 to-red-400'
                    : 'from-orange-600 to-red-600'
                )}
              >
                Forgot Password
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
                Don't worry! It happens to the best of us.
              </motion.p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className={cn(
            'w-full lg:w-1/2 p-6 lg:p-8 flex flex-col transition-colors duration-300',
            resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            {/* Back to Login Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              onClick={handleBackToLogin}
              className={cn(
                'flex items-center gap-2 text-sm font-medium transition-colors duration-300 hover:gap-3',
                resolvedTheme === 'dark'
                  ? 'text-slate-400 hover:text-slate-300'
                  : 'text-gray-600 hover:text-gray-800'
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </motion.button>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center">
              {!isSubmitted ? (
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
                      Forgot Your Password?
                    </h1>
                    <p className={cn(
                      'text-sm transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                    )}>
                      Enter your email address and we'll help you reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label 
                        htmlFor="email" 
                        className={cn(
                          'block text-sm font-medium mb-2 transition-colors duration-300',
                          resolvedTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                        )}
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className={cn(
                          'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-300',
                          resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                        )} />
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={cn(
                            'w-full pl-10 pr-4 py-3 border rounded-lg transition-all duration-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent',
                            resolvedTheme === 'dark'
                              ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          )}
                          placeholder="Enter your email"
                          disabled={isLoading}
                        />
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
                            ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
                            : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl',
                        isHovered && !isLoading ? 'scale-105' : 'scale-100'
                      )}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Verifying Email...
                        </div>
                      ) : (
                        'Verify Email'
                      )}
                    </motion.button>
                    
                    {/* Verification Progress Indicator */}
                    {isLoading && verificationStep && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 rounded-lg border-2 border-dashed transition-colors duration-300"
                        style={{
                          borderColor: resolvedTheme === 'dark' ? '#475569' : '#e2e8f0',
                          backgroundColor: resolvedTheme === 'dark' ? '#1e293b' : '#f8fafc'
                        }}
                      >
                        <div className="flex items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                          <span className={cn(
                            'text-sm font-medium transition-colors duration-300',
                            resolvedTheme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                          )}>
                            {verificationStep}
                          </span>
                        </div>
                      </motion.div>
                    )}
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
                            ? 'text-orange-400 hover:text-orange-300'
                            : 'text-orange-600 hover:text-orange-700'
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
                    <UserCheck className="text-white h-8 w-8" />
                  </div>

                  <div>
                    <h2 className={cn(
                      'text-2xl font-bold mb-2 transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-white' : 'text-gray-900'
                    )}>
                      Email Verified!
                    </h2>
                    <p className={cn(
                      'text-sm transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-600'
                    )}>
                      Great! We found your account. You can now proceed to reset your password.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <motion.button
                      onClick={handleContinueToReset}
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
                      Continue to Reset Password
                    </motion.button>

                    <button
                      onClick={handleBackToLogin}
                      className={cn(
                        'w-full py-3 px-4 rounded-lg font-medium transition-all duration-300',
                        resolvedTheme === 'dark'
                          ? 'border border-slate-600 text-slate-300 hover:bg-slate-700'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      Back to Login
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
