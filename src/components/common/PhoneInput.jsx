import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { Phone, ChevronDown, Check } from 'lucide-react'
import { countries } from '../../data/countries'

// Helper function to get example phone numbers
const getExampleNumber = (phoneCode) => {
  const examples = {
    '+1': '555-123-4567',
    '+44': '20 7123 4567',
    '+49': '30 12345678',
    '+33': '1 23 45 67 89',
    '+39': '06 1234 5678',
    '+34': '91 123 45 67',
    '+31': '20 123 4567',
    '+32': '2 123 45 67',
    '+41': '44 123 45 67',
    '+43': '1 234 56 78',
    '+45': '12 34 56 78',
    '+46': '8 123 456 78',
    '+47': '12 34 56 78',
    '+48': '12 345 67 89',
    '+351': '21 123 4567',
    '+7': '495 123-45-67',
    '+86': '138 0013 8000',
    '+81': '3-1234-5678',
    '+82': '2-123-4567',
    '+91': '98765 43210',
    '+61': '2 1234 5678',
    '+64': '21 123 4567',
    '+27': '11 123 4567',
    '+55': '11 91234-5678',
    '+52': '55 1234 5678',
    '+54': '11 1234-5678'
  }
  return examples[phoneCode] || '123456789'
}

const PhoneInput = ({
  countryCode = 'US',
  phoneNumber = '',
  onCountryChange,
  onPhoneChange,
  registrationCountryCode = null,
  error = false,
  placeholder = "Enter phone number",
  className = ""
}) => {
  const { resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const selectedCountry = countries.find(country => country.code === countryCode) || countries[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-sync with registration country when it changes
  useEffect(() => {
    if (registrationCountryCode && registrationCountryCode !== countryCode) {
      const registrationCountry = countries.find(c => c.code === registrationCountryCode)
      if (registrationCountry) {
        onCountryChange(registrationCountryCode)
      }
    }
  }, [registrationCountryCode, countryCode, onCountryChange])

  const handleCountrySelect = (country) => {
    onCountryChange(country.code)
    setIsOpen(false)
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }
  const handlePhoneNumberChange = (e) => {
    // Remove any non-numeric characters except spaces, dashes, and parentheses
    const cleaned = e.target.value.replace(/[^\d\s\-\(\)]/g, '')
    onPhoneChange(cleaned)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Phone Input Container - With Dropdown */}
      <div className={`
        flex border rounded-lg bg-background
        focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent
        ${error ? 'border-red-500' : 'border-border'}
      `}>
        {/* Country Code Selector (Clickable) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={handleToggle}
            className="flex items-center space-x-2 px-3 py-2 border-r border-border hover:bg-muted/50 transition-colors min-w-[120px]"
          >
            {selectedCountry.code === 'CUSTOM' ? (
              <>
                <span className="text-sm font-medium">XX</span>
                <span className="text-sm text-muted-foreground font-mono">{selectedCountry.phoneCode}</span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium">{selectedCountry.code}</span>
                <span className="text-sm text-muted-foreground font-mono">{selectedCountry.phoneCode}</span>
              </>
            )}
            <ChevronDown
              className={`h-3 w-3 text-muted-foreground transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Country Code Dropdown - Simple List */}
          {isOpen && (
            <div className={`
              absolute top-full left-0 mt-1 bg-card border border-border
              rounded-lg shadow-xl z-[9999] w-80 max-h-80 overflow-hidden
              ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            `} style={{ position: 'absolute', zIndex: 9999 }}>
              {/* Header */}
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <h4 className="text-sm font-medium text-foreground">Select Country Code</h4>
                <p className="text-xs text-muted-foreground">Choose your country for phone number</p>
              </div>

              {/* Countries List - Scrollable */}
              <div className="max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountrySelect(country)}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors
                      flex items-center justify-between group
                      ${selectedCountry?.code === country.code ? 'bg-primary/10' : ''}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium min-w-[40px]">{country.code}</span>
                        <span className="text-foreground font-medium">{country.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-mono text-primary font-bold">{country.phoneCode}</p>
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="h-4 w-4 text-primary ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            placeholder={placeholder || `e.g. ${getExampleNumber(selectedCountry.phoneCode)}`}
            className="w-full pl-10 pr-4 py-2 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>

      {/* Full Phone Number Display */}
      {phoneNumber && (
        <div className="mt-1 text-xs text-muted-foreground">
          Full number: {selectedCountry.phoneCode} {phoneNumber}
        </div>
      )}
    </div>
  )
}

export default PhoneInput
