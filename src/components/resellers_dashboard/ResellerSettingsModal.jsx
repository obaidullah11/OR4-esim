import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import { cn } from '../../lib/utils'
import { 
  X, 
  Settings, 
  User, 
  Lock, 
  Palette,
  Sun,
  Moon,
  Monitor,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertCircle
} from 'lucide-react'

const ResellerSettingsModal = ({ isOpen, onClose }) => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('theme')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Form states
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    country_code: user?.country_code || '+971'
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  if (!isOpen) return null

  const tabs = [
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock }
  ]

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Light theme' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme' },
    { id: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' }
  ]

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setMessage({ type: 'success', text: 'Theme updated successfully!' })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const validateProfileData = () => {
    const errors = []

    if (!profileData.first_name.trim()) {
      errors.push('First name is required')
    }

    if (!profileData.last_name.trim()) {
      errors.push('Last name is required')
    }

    if (!profileData.email.trim()) {
      errors.push('Email is required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.push('Please enter a valid email address')
    }

    if (profileData.phone_number && !/^\d{7,15}$/.test(profileData.phone_number.replace(/\s/g, ''))) {
      errors.push('Please enter a valid phone number (7-15 digits)')
    }

    return errors
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    // Validate form data
    const validationErrors = validateProfileData()
    if (validationErrors.length > 0) {
      setMessage({ type: 'error', text: validationErrors.join(', ') })
      setIsLoading(false)
      return
    }

    try {
      const response = await authService.updateProfile(profileData)

      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })

        // Update the local profile data state with the response data if available
        if (response.data && response.data.user) {
          const updatedUser = response.data.user
          setProfileData({
            first_name: updatedUser.first_name || '',
            last_name: updatedUser.last_name || '',
            email: updatedUser.email || '',
            phone_number: updatedUser.phone_number || '',
            country_code: updatedUser.country_code || '+971'
          })
        }

        // Auto-close message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile.' })
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const validatePasswordData = () => {
    const errors = []

    if (!passwordData.current_password.trim()) {
      errors.push('Current password is required')
    }

    if (!passwordData.new_password.trim()) {
      errors.push('New password is required')
    } else {
      if (passwordData.new_password.length < 8) {
        errors.push('Password must be at least 8 characters long')
      }
      if (!/(?=.*[a-z])/.test(passwordData.new_password)) {
        errors.push('Password must contain at least one lowercase letter')
      }
      if (!/(?=.*[A-Z])/.test(passwordData.new_password)) {
        errors.push('Password must contain at least one uppercase letter')
      }
      if (!/(?=.*\d)/.test(passwordData.new_password)) {
        errors.push('Password must contain at least one number')
      }
    }

    if (!passwordData.confirm_password.trim()) {
      errors.push('Password confirmation is required')
    } else if (passwordData.new_password !== passwordData.confirm_password) {
      errors.push('New passwords do not match')
    }

    return errors
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    // Validate form data
    const validationErrors = validatePasswordData()
    if (validationErrors.length > 0) {
      setMessage({ type: 'error', text: validationErrors.join(', ') })
      setIsLoading(false)
      return
    }

    try {
      const response = await authService.changePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      )

      if (response.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' })
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' })

        // Auto-close message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to change password.' })
      }
    } catch (error) {
      console.error('Password change error:', error)
      setMessage({ type: 'error', text: error.message || 'Failed to change password. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={cn(
        'w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300',
        resolvedTheme === 'dark'
          ? 'bg-slate-800 border border-slate-700'
          : 'bg-white border border-gray-200'
      )}>
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-6 border-b',
          resolvedTheme === 'dark' ? 'border-slate-700' : 'border-gray-200'
        )}>
          <div className="flex items-center space-x-3">
            <div className={cn(
              'p-2 rounded-lg',
              resolvedTheme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'
            )}>
              <Settings className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              resolvedTheme === 'dark'
                ? 'hover:bg-slate-700 text-slate-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={cn(
            'mx-6 mt-4 p-3 rounded-lg flex items-center space-x-2',
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
              : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
          )}>
            {message.type === 'success' ? (
              <Check className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <div className="flex">
          {/* Sidebar */}
          <div className={cn(
            'w-48 p-6 border-r',
            resolvedTheme === 'dark' ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50/50'
          )}>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors',
                      activeTab === tab.id
                        ? resolvedTheme === 'dark'
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : resolvedTheme === 'dark'
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Theme Tab */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Theme Preference</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose your preferred theme for the reseller dashboard
                  </p>
                </div>

                <div className="grid gap-3">
                  {themeOptions.map((option) => {
                    const Icon = option.icon
                    const isSelected = theme === option.id
                    
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleThemeChange(option.id)}
                        className={cn(
                          'flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200',
                          isSelected
                            ? resolvedTheme === 'dark'
                              ? 'border-emerald-600 bg-emerald-600/10 text-emerald-400'
                              : 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : resolvedTheme === 'dark'
                              ? 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        )}
                      >
                        <div className={cn(
                          'p-2 rounded-lg',
                          isSelected
                            ? 'bg-emerald-600 text-white'
                            : resolvedTheme === 'dark'
                              ? 'bg-slate-700 text-slate-300'
                              : 'bg-gray-100 text-gray-600'
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-muted-foreground">{option.description}</div>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-emerald-600" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Profile Information</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your personal information and contact details
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.first_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg border transition-colors',
                          resolvedTheme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500'
                        )}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.last_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg border transition-colors',
                          resolvedTheme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500'
                        )}
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      className={cn(
                        'w-full px-3 py-2 rounded-lg border transition-colors',
                        resolvedTheme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500'
                      )}
                      placeholder="Enter email address"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country Code
                      </label>
                      <select
                        value={profileData.country_code}
                        onChange={(e) => setProfileData(prev => ({ ...prev, country_code: e.target.value }))}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg border transition-colors',
                          resolvedTheme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white focus:border-emerald-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-emerald-500'
                        )}
                      >
                        <option value="+971">+971 (UAE)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                        <option value="+91">+91 (India)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                        className={cn(
                          'w-full px-3 py-2 rounded-lg border transition-colors',
                          resolvedTheme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500'
                        )}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        'flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors',
                        'bg-emerald-600 hover:bg-emerald-700 text-white',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      <Save className="w-4 h-4" />
                      <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Change Password</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your account password for better security
                  </p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                        className={cn(
                          'w-full px-3 py-2 pr-10 rounded-lg border transition-colors',
                          resolvedTheme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500'
                        )}
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                        className={cn(
                          'w-full px-3 py-2 pr-10 rounded-lg border transition-colors',
                          resolvedTheme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500'
                        )}
                        placeholder="Enter new password"
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                        className={cn(
                          'w-full px-3 py-2 pr-10 rounded-lg border transition-colors',
                          resolvedTheme === 'dark'
                            ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500'
                            : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-emerald-500'
                        )}
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        'flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors',
                        'bg-emerald-600 hover:bg-emerald-700 text-white',
                        'disabled:opacity-50 disabled:cursor-not-allowed'
                      )}
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isLoading ? 'Changing...' : 'Change Password'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResellerSettingsModal
