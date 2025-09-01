import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/authService'
import toast from 'react-hot-toast'
import {
  Settings,
  User,
  Lock,
  Palette,
  Save,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Monitor,
  Check,
  AlertCircle,
  ChevronDown,
  Search,
  X
} from 'lucide-react'

// Comprehensive country codes data
const COUNTRY_CODES = [
  { code: '+93', country: 'Afghanistan', flag: '🇦🇫', name: 'Afghanistan' },
  { code: '+355', country: 'Albania', flag: '🇦🇱', name: 'Albania' },
  { code: '+213', country: 'Algeria', flag: '🇩🇿', name: 'Algeria' },
  { code: '+1', country: 'United States', flag: '🇺🇸', name: 'United States' },
  { code: '+376', country: 'Andorra', flag: '🇦🇩', name: 'Andorra' },
  { code: '+244', country: 'Angola', flag: '🇦🇴', name: 'Angola' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷', name: 'Argentina' },
  { code: '+374', country: 'Armenia', flag: '🇦🇲', name: 'Armenia' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', name: 'Australia' },
  { code: '+43', country: 'Austria', flag: '🇦🇹', name: 'Austria' },
  { code: '+994', country: 'Azerbaijan', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭', name: 'Bahrain' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '+375', country: 'Belarus', flag: '🇧🇾', name: 'Belarus' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪', name: 'Belgium' },
  { code: '+501', country: 'Belize', flag: '🇧🇿', name: 'Belize' },
  { code: '+229', country: 'Benin', flag: '🇧🇯', name: 'Benin' },
  { code: '+975', country: 'Bhutan', flag: '🇧🇹', name: 'Bhutan' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+387', country: 'Bosnia and Herzegovina', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: '+267', country: 'Botswana', flag: '🇧🇼', name: 'Botswana' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', name: 'Brazil' },
  { code: '+673', country: 'Brunei', flag: '🇧🇳', name: 'Brunei' },
  { code: '+359', country: 'Bulgaria', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '+257', country: 'Burundi', flag: '🇧🇮', name: 'Burundi' },
  { code: '+855', country: 'Cambodia', flag: '🇰🇭', name: 'Cambodia' },
  { code: '+237', country: 'Cameroon', flag: '🇨🇲', name: 'Cameroon' },
  { code: '+1', country: 'Canada', flag: '🇨🇦', name: 'Canada' },
  { code: '+238', country: 'Cape Verde', flag: '🇨🇻', name: 'Cape Verde' },
  { code: '+236', country: 'Central African Republic', flag: '🇨🇫', name: 'Central African Republic' },
  { code: '+235', country: 'Chad', flag: '🇹🇩', name: 'Chad' },
  { code: '+56', country: 'Chile', flag: '🇨🇱', name: 'Chile' },
  { code: '+86', country: 'China', flag: '🇨🇳', name: 'China' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴', name: 'Colombia' },
  { code: '+269', country: 'Comoros', flag: '🇰🇲', name: 'Comoros' },
  { code: '+242', country: 'Congo', flag: '🇨🇬', name: 'Congo' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+385', country: 'Croatia', flag: '🇭🇷', name: 'Croatia' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺', name: 'Cuba' },
  { code: '+357', country: 'Cyprus', flag: '🇨🇾', name: 'Cyprus' },
  { code: '+420', country: 'Czech Republic', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰', name: 'Denmark' },
  { code: '+253', country: 'Djibouti', flag: '🇩🇯', name: 'Djibouti' },
  { code: '+1', country: 'Dominican Republic', flag: '🇩🇴', name: 'Dominican Republic' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬', name: 'Egypt' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+240', country: 'Equatorial Guinea', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: '+291', country: 'Eritrea', flag: '🇪🇷', name: 'Eritrea' },
  { code: '+372', country: 'Estonia', flag: '🇪🇪', name: 'Estonia' },
  { code: '+251', country: 'Ethiopia', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '+679', country: 'Fiji', flag: '🇫🇯', name: 'Fiji' },
  { code: '+358', country: 'Finland', flag: '🇫🇮', name: 'Finland' },
  { code: '+33', country: 'France', flag: '🇫🇷', name: 'France' },
  { code: '+241', country: 'Gabon', flag: '🇬🇦', name: 'Gabon' },
  { code: '+220', country: 'Gambia', flag: '🇬🇲', name: 'Gambia' },
  { code: '+995', country: 'Georgia', flag: '🇬🇪', name: 'Georgia' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', name: 'Germany' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭', name: 'Ghana' },
  { code: '+30', country: 'Greece', flag: '🇬🇷', name: 'Greece' },
  { code: '+299', country: 'Greenland', flag: '🇬🇱', name: 'Greenland' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+224', country: 'Guinea', flag: '🇬🇳', name: 'Guinea' },
  { code: '+245', country: 'Guinea-Bissau', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: '+592', country: 'Guyana', flag: '🇬🇾', name: 'Guyana' },
  { code: '+509', country: 'Haiti', flag: '🇭🇹', name: 'Haiti' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳', name: 'Honduras' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '+36', country: 'Hungary', flag: '🇭🇺', name: 'Hungary' },
  { code: '+354', country: 'Iceland', flag: '🇮🇸', name: 'Iceland' },
  { code: '+91', country: 'India', flag: '🇮🇳', name: 'India' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', name: 'Indonesia' },
  { code: '+98', country: 'Iran', flag: '🇮🇷', name: 'Iran' },
  { code: '+964', country: 'Iraq', flag: '🇮🇶', name: 'Iraq' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪', name: 'Ireland' },
  { code: '+972', country: 'Israel', flag: '🇮🇱', name: 'Israel' },
  { code: '+39', country: 'Italy', flag: '🇮🇹', name: 'Italy' },
  { code: '+225', country: 'Ivory Coast', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', name: 'Japan' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴', name: 'Jordan' },
  { code: '+7', country: 'Kazakhstan', flag: '🇰🇿', name: 'Kazakhstan' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪', name: 'Kenya' },
  { code: '+686', country: 'Kiribati', flag: '🇰🇮', name: 'Kiribati' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼', name: 'Kuwait' },
  { code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬', name: 'Kyrgyzstan' },
  { code: '+856', country: 'Laos', flag: '🇱🇦', name: 'Laos' },
  { code: '+371', country: 'Latvia', flag: '🇱🇻', name: 'Latvia' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧', name: 'Lebanon' },
  { code: '+266', country: 'Lesotho', flag: '🇱🇸', name: 'Lesotho' },
  { code: '+231', country: 'Liberia', flag: '🇱🇷', name: 'Liberia' },
  { code: '+218', country: 'Libya', flag: '🇱🇾', name: 'Libya' },
  { code: '+423', country: 'Liechtenstein', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: '+370', country: 'Lithuania', flag: '🇱🇹', name: 'Lithuania' },
  { code: '+352', country: 'Luxembourg', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '+853', country: 'Macao', flag: '🇲🇴', name: 'Macao' },
  { code: '+389', country: 'Macedonia', flag: '🇲🇰', name: 'Macedonia' },
  { code: '+261', country: 'Madagascar', flag: '🇲🇬', name: 'Madagascar' },
  { code: '+265', country: 'Malawi', flag: '🇲🇼', name: 'Malawi' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', name: 'Malaysia' },
  { code: '+960', country: 'Maldives', flag: '🇲🇻', name: 'Maldives' },
  { code: '+223', country: 'Mali', flag: '🇲🇱', name: 'Mali' },
  { code: '+356', country: 'Malta', flag: '🇲🇹', name: 'Malta' },
  { code: '+692', country: 'Marshall Islands', flag: '🇲🇭', name: 'Marshall Islands' },
  { code: '+222', country: 'Mauritania', flag: '🇲🇷', name: 'Mauritania' },
  { code: '+230', country: 'Mauritius', flag: '🇲🇺', name: 'Mauritius' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽', name: 'Mexico' },
  { code: '+691', country: 'Micronesia', flag: '🇫🇲', name: 'Micronesia' },
  { code: '+373', country: 'Moldova', flag: '🇲🇩', name: 'Moldova' },
  { code: '+377', country: 'Monaco', flag: '🇲🇨', name: 'Monaco' },
  { code: '+976', country: 'Mongolia', flag: '🇲🇳', name: 'Mongolia' },
  { code: '+382', country: 'Montenegro', flag: '🇲🇪', name: 'Montenegro' },
  { code: '+212', country: 'Morocco', flag: '🇲🇦', name: 'Morocco' },
  { code: '+258', country: 'Mozambique', flag: '🇲🇿', name: 'Mozambique' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲', name: 'Myanmar' },
  { code: '+264', country: 'Namibia', flag: '🇳🇦', name: 'Namibia' },
  { code: '+674', country: 'Nauru', flag: '🇳🇷', name: 'Nauru' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵', name: 'Nepal' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱', name: 'Netherlands' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿', name: 'New Zealand' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '+227', country: 'Niger', flag: '🇳🇪', name: 'Niger' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬', name: 'Nigeria' },
  { code: '+850', country: 'North Korea', flag: '🇰🇵', name: 'North Korea' },
  { code: '+47', country: 'Norway', flag: '🇳🇴', name: 'Norway' },
  { code: '+968', country: 'Oman', flag: '🇴🇲', name: 'Oman' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰', name: 'Pakistan' },
  { code: '+680', country: 'Palau', flag: '🇵🇼', name: 'Palau' },
  { code: '+970', country: 'Palestine', flag: '🇵🇸', name: 'Palestine' },
  { code: '+507', country: 'Panama', flag: '🇵🇦', name: 'Panama' },
  { code: '+675', country: 'Papua New Guinea', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+51', country: 'Peru', flag: '🇵🇪', name: 'Peru' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭', name: 'Philippines' },
  { code: '+48', country: 'Poland', flag: '🇵🇱', name: 'Poland' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹', name: 'Portugal' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦', name: 'Qatar' },
  { code: '+40', country: 'Romania', flag: '🇷🇴', name: 'Romania' },
  { code: '+7', country: 'Russia', flag: '🇷🇺', name: 'Russia' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼', name: 'Rwanda' },
  { code: '+685', country: 'Samoa', flag: '🇼🇸', name: 'Samoa' },
  { code: '+378', country: 'San Marino', flag: '🇸🇲', name: 'San Marino' },
  { code: '+239', country: 'Sao Tome and Principe', flag: '🇸🇹', name: 'Sao Tome and Principe' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '+221', country: 'Senegal', flag: '🇸🇳', name: 'Senegal' },
  { code: '+381', country: 'Serbia', flag: '🇷🇸', name: 'Serbia' },
  { code: '+248', country: 'Seychelles', flag: '🇸🇨', name: 'Seychelles' },
  { code: '+232', country: 'Sierra Leone', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', name: 'Singapore' },
  { code: '+421', country: 'Slovakia', flag: '🇸🇰', name: 'Slovakia' },
  { code: '+386', country: 'Slovenia', flag: '🇸🇮', name: 'Slovenia' },
  { code: '+677', country: 'Solomon Islands', flag: '🇸🇧', name: 'Solomon Islands' },
  { code: '+252', country: 'Somalia', flag: '🇸🇴', name: 'Somalia' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', name: 'South Africa' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷', name: 'South Korea' },
  { code: '+211', country: 'South Sudan', flag: '🇸🇸', name: 'South Sudan' },
  { code: '+34', country: 'Spain', flag: '🇪🇸', name: 'Spain' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '+249', country: 'Sudan', flag: '🇸🇩', name: 'Sudan' },
  { code: '+597', country: 'Suriname', flag: '🇸🇷', name: 'Suriname' },
  { code: '+268', country: 'Swaziland', flag: '🇸🇿', name: 'Swaziland' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪', name: 'Sweden' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭', name: 'Switzerland' },
  { code: '+963', country: 'Syria', flag: '🇸🇾', name: 'Syria' },
  { code: '+886', country: 'Taiwan', flag: '🇹🇼', name: 'Taiwan' },
  { code: '+992', country: 'Tajikistan', flag: '🇹🇯', name: 'Tajikistan' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿', name: 'Tanzania' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭', name: 'Thailand' },
  { code: '+670', country: 'Timor-Leste', flag: '🇹🇱', name: 'Timor-Leste' },
  { code: '+228', country: 'Togo', flag: '🇹🇬', name: 'Togo' },
  { code: '+676', country: 'Tonga', flag: '🇹🇴', name: 'Tonga' },
  { code: '+1', country: 'Trinidad and Tobago', flag: '🇹🇹', name: 'Trinidad and Tobago' },
  { code: '+216', country: 'Tunisia', flag: '🇹🇳', name: 'Tunisia' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷', name: 'Turkey' },
  { code: '+993', country: 'Turkmenistan', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: '+688', country: 'Tuvalu', flag: '🇹🇻', name: 'Tuvalu' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬', name: 'Uganda' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦', name: 'Ukraine' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪', name: 'United Arab Emirates' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+998', country: 'Uzbekistan', flag: '🇺🇿', name: 'Uzbekistan' },
  { code: '+678', country: 'Vanuatu', flag: '🇻🇺', name: 'Vanuatu' },
  { code: '+379', country: 'Vatican City', flag: '🇻🇦', name: 'Vatican City' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳', name: 'Vietnam' },
  { code: '+967', country: 'Yemen', flag: '🇾🇪', name: 'Yemen' },
  { code: '+260', country: 'Zambia', flag: '🇿🇲', name: 'Zambia' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼', name: 'Zimbabwe' }
].sort((a, b) => {
  // Sort Pakistan first, then alphabetically
  if (a.country === 'Pakistan') return -1
  if (b.country === 'Pakistan') return 1
  return a.country.localeCompare(b.country)
})

function SettingsPageClean() {
  const { theme, setTheme } = useTheme()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('theme')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Country code dropdown states
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Form states
  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    country_code: user?.country_code || '+92'
  })

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  const tabs = [
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'profile', label: 'Edit Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Lock }
  ]

  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun, description: 'Light theme' },
    { id: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme' },
    { id: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' }
  ]

  // Filter countries based on search
  const filteredCountries = COUNTRY_CODES.filter(country =>
    country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.code.includes(countrySearch) ||
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  )

  // Get selected country info
  const selectedCountry = COUNTRY_CODES.find(country => country.code === profileData.country_code)

  // Handle clicks outside dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false)
        setCountrySearch('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (showCountryDropdown && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showCountryDropdown])

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    toast.success(`Theme changed to ${newTheme}`)
  }

  const handleCountrySelect = (country) => {
    setProfileData(prev => ({ ...prev, country_code: country.code }))
    setShowCountryDropdown(false)
    setCountrySearch('')
    toast.success(`Country code changed to ${country.flag} ${country.code}`)
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const response = await authService.updateProfile(profileData)
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
        toast.success('Profile updated successfully!')
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' })
        toast.error(response.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
      toast.error('Failed to update profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: '', text: '' })

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      toast.error('New passwords do not match')
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (passwordData.new_password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' })
      toast.error('Password must be at least 8 characters long')
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
        toast.success('Password changed successfully!')
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to change password' })
        toast.error(response.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Password change error:', error)
      setMessage({ type: 'error', text: 'Failed to change password. Please try again.' })
      toast.error('Failed to change password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

      return (
      <div className="min-h-screen bg-background">
        <div className="h-full w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
          </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
        </div>
        )}

        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden h-[calc(100vh-8rem)]">
          <div className="flex h-full">
        {/* Sidebar */}
            <div className="w-64 bg-muted/30 border-r border-border p-6 flex-shrink-0">
              <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              
              {/* Theme Tab */}
              {activeTab === 'theme' && (
              <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Theme Preferences</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Choose your preferred theme for the admin panel
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {themeOptions.map((option) => {
                      const Icon = option.icon
                      const isActive = theme === option.id
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleThemeChange(option.id)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                            isActive
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-border hover:border-primary/50 hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`p-2 rounded-lg ${
                              isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            }`}>
                              <Icon className="w-4 h-4" />
                    </div>
                  <div>
                              <h4 className="font-medium text-foreground">{option.label}</h4>
                              {isActive && <Check className="w-4 h-4 text-primary inline ml-2" />}
                    </div>
                  </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
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
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="Enter first name"
                          required
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
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="Enter last name"
                          required
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
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                        placeholder="Enter email address"
                        required
                        />
                      </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Country Code
                        </label>
                        <div className="relative" ref={dropdownRef}>
                  <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors flex items-center justify-between"
                          >
                            <span className="flex items-center space-x-2">
                              {selectedCountry ? (
                                <>
                                  <span className="text-lg">{selectedCountry.flag}</span>
                                  <span className="text-sm">{selectedCountry.code}</span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">Select country</span>
                              )}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                          </button>

                                                     {showCountryDropdown && (
                             <div className="absolute top-full left-0 w-96 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
                              {/* Search Input */}
                              <div className="p-3 border-b border-border">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={countrySearch}
                                    onChange={(e) => setCountrySearch(e.target.value)}
                                    placeholder="Search countries..."
                                    className="w-full pl-10 pr-8 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors text-sm"
                                  />
                                  {countrySearch && (
                  <button
                                      type="button"
                                      onClick={() => setCountrySearch('')}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-foreground"
                  >
                                      <X className="w-4 h-4" />
                  </button>
                                  )}
                </div>
              </div>

                                                            {/* Countries List */}
                               <div className="max-h-64 overflow-y-auto">
                                {filteredCountries.length > 0 ? (
                                  filteredCountries.map((country) => (
                        <button
                                      key={country.code + country.country}
                                      type="button"
                                      onClick={() => handleCountrySelect(country)}
                                      className={`w-full px-3 py-2 text-left hover:bg-muted transition-colors flex items-center space-x-3 ${
                                        profileData.country_code === country.code ? 'bg-primary/10 text-primary' : 'text-foreground'
                                      }`}
                                    >
                                      <span className="text-lg">{country.flag}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">{country.country}</div>
                                        <div className="text-xs text-muted-foreground">{country.code}</div>
                          </div>
                                      {profileData.country_code === country.code && (
                                        <Check className="w-4 h-4 text-primary" />
                                      )}
                        </button>
                                  ))
                                ) : (
                                  <div className="px-3 py-4 text-center text-muted-foreground text-sm">
                                    No countries found matching "{countrySearch}"
                    </div>
                                )}
                </div>
              </div>
            )}
                    </div>
                    </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <div className="flex">
                          <div className="flex items-center px-3 py-2 bg-muted border border-r-0 border-border rounded-l-lg">
                            <span className="text-sm text-muted-foreground">
                              {selectedCountry ? selectedCountry.code : '+92'}
                            </span>
                          </div>
                        <input
                            type="tel"
                            value={profileData.phone_number}
                            onChange={(e) => setProfileData(prev => ({ ...prev, phone_number: e.target.value }))}
                            className="flex-1 px-3 py-2 rounded-r-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                            placeholder="Enter phone number"
                        />
                      </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enter phone number without country code
                        </p>
                  </div>
                </div>

                    <div className="flex justify-end pt-4">
                  <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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
                          className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                          placeholder="Enter new password"
                          required
                        />
                          <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                  </div>
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
                          className="w-full px-3 py-2 pr-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
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

                    {/* Password Requirements */}
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <p className="text-sm font-medium text-foreground mb-2">Password Requirements:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center space-x-2">
                          <Check className={`w-3 h-3 ${passwordData.new_password.length >= 8 ? 'text-green-500' : 'text-muted-foreground'}`} />
                          <span>At least 8 characters long</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <Check className={`w-3 h-3 ${passwordData.new_password === passwordData.confirm_password && passwordData.new_password ? 'text-green-500' : 'text-muted-foreground'}`} />
                          <span>Passwords match</span>
                        </li>
                      </ul>
                </div>

                    <div className="flex justify-end pt-4">
                  <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  )
}

export default SettingsPageClean