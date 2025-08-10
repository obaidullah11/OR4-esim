import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, ArrowRight, Smartphone, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { Button, Input, FormField, cn } from '../../components/common/UI'
import ThemeToggle from '../../components/common/ThemeToggle/ThemeToggle'
import DotMap from '../../components/auth/DotMap'
import toast from 'react-hot-toast'

function LoginPage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { resolvedTheme } = useTheme()

  const from = location.state?.from?.pathname || '/dashboard'

  // Show success message if coming from signup
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message)
      // Clear the message from state
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state?.message, navigate, location.pathname])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)

    try {
      await login({ email, password })
      toast.success('Login successful!')
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(error.message || 'Login failed')
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
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={cn(
                  'text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r transition-colors duration-300',
                  resolvedTheme === 'dark'
                    ? 'from-blue-400 to-indigo-400'
                    : 'from-blue-600 to-indigo-600'
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
                Secure access to your SIM management dashboard and comprehensive admin controls
              </motion.p>
            </div>
          </div>

          {/* Right side - Sign In Form */}
          <div className={cn(
            'w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center transition-colors duration-300',
            resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-white'
          )}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-6">
                <Shield className={cn(
                  'h-8 w-8 mr-3 transition-colors duration-300',
                  resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                )} />
                <div>
                  <h1 className={cn(
                    'text-2xl md:text-3xl font-bold transition-colors duration-300',
                    resolvedTheme === 'dark' ? 'text-white' : 'text-gray-800'
                  )}>
                    Welcome back
                  </h1>
                  <p className={cn(
                    'transition-colors duration-300',
                    resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                  )}>
                    Sign in to your admin account
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <FormField
                  label="Email Address"
                  required
                  className="space-y-2"
                >
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

                <FormField
                  label="Password"
                  required
                  className="space-y-2"
                >
                  <div className="relative">
                    <Input
                      id="password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      'w-full bg-gradient-to-r relative overflow-hidden from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-lg transition-all duration-300',
                      isHovered ? (resolvedTheme === 'dark' ? 'shadow-lg shadow-blue-900/50' : 'shadow-lg shadow-blue-200') : ''
                    )}
                  >
                    <span className="flex items-center justify-center">
                      {isLoading ? 'Signing in...' : 'Sign in'}
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
                  <Link
                    to="/forgot-password"
                    className={cn(
                      'text-sm transition-colors duration-300',
                      resolvedTheme === 'dark'
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-700'
                    )}
                  >
                    Forgot password?
                  </Link>
                  <div className="mt-3">
                    <p className={cn(
                      'text-sm transition-colors duration-300',
                      resolvedTheme === 'dark' ? 'text-slate-400' : 'text-gray-500'
                    )}>
                      Don't have an account?{' '}
                      <Link
                        to="/signup"
                        className={cn(
                          'font-medium transition-colors duration-300',
                          resolvedTheme === 'dark'
                            ? 'text-blue-400 hover:text-blue-300'
                            : 'text-blue-600 hover:text-blue-700'
                        )}
                      >
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage
