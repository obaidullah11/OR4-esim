import { useState, useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { ChevronDown, Search, Check } from 'lucide-react'
import { countries, searchCountries } from '../../data/countries'

// Helper function to get country flag emoji
const getCountryFlag = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt())
  return String.fromCodePoint(...codePoints)
}

const CountrySelect = ({ 
  value, 
  onChange, 
  placeholder = "Select country", 
  error = false,
  showPhoneCode = false,
  className = ""
}) => {
  const { resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Filter countries based on search term
  useEffect(() => {
    setFilteredCountries(searchCountries(searchTerm))
  }, [searchTerm])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const selectedCountry = countries.find(country => country.code === value)

  const handleSelect = (country) => {
    onChange(country.code)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm('')
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full px-3 py-2 border rounded-lg bg-background text-foreground 
          focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
          flex items-center justify-between transition-colors
          ${error ? 'border-red-500' : 'border-border hover:border-border/80'}
        `}
      >
        <div className="flex items-center space-x-2">
          {selectedCountry ? (
            <>
              <span className="text-sm font-medium">{selectedCountry.code}</span>
              <span className="text-foreground">{selectedCountry.name}</span>
              {showPhoneCode && (
                <span className="text-muted-foreground ml-1">
                  ({selectedCountry.phoneCode})
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className={`
          absolute top-full left-0 right-0 mt-1 bg-card border border-border 
          rounded-lg shadow-lg z-50 max-h-80 overflow-hidden
          ${resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'}
        `}>
          {/* Search Input */}
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Countries List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              <>
                {filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
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
                      {showPhoneCode && (
                        <div className="ml-auto">
                          <p className="text-sm text-muted-foreground">{country.phoneCode}</p>
                        </div>
                      )}
                    </div>
                    {selectedCountry?.code === country.code && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}

                {/* Others option when search term doesn't match exactly */}
                {searchTerm && !filteredCountries.some(c =>
                  c.name.toLowerCase() === searchTerm.toLowerCase() ||
                  c.code.toLowerCase() === searchTerm.toLowerCase()
                ) && (
                  <>
                    <div className="border-t border-border my-2"></div>
                    <button
                      type="button"
                      onClick={() => handleSelect({
                        code: searchTerm.toUpperCase().slice(0, 3),
                        name: `Others (${searchTerm})`,
                        phoneCode: '+000'
                      })}
                      className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors flex items-center space-x-3"
                    >
                      <div className="flex items-center space-x-2 min-w-[80px]">
                        <span className="text-lg">🌍</span>
                        <span className="text-sm font-medium">OTH</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground font-medium">Others ({searchTerm})</p>
                        <p className="text-sm text-muted-foreground">Custom country entry</p>
                      </div>
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No countries found</p>
                <p className="text-sm">Try a different search term</p>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => handleSelect({
                      code: searchTerm.toUpperCase().slice(0, 3),
                      name: `Others (${searchTerm})`,
                      phoneCode: '+000'
                    })}
                    className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
                  >
                    Add "{searchTerm}" as Others
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CountrySelect
