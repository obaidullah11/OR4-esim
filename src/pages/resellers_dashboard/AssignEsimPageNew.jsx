import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Users,
  Smartphone,
  Globe,
  Calendar,
  DollarSign,
  Wifi,
  Search,
  Filter,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Mail,
  QrCode,
  RefreshCw,
  CreditCard,
  UserPlus
} from 'lucide-react'
import toast from 'react-hot-toast'
import { clientService } from '../../services/clientService'
import { traveRoamService } from '../../services/traveRoamService'
import { esimService } from '../../services/esimService'
import { integrationService } from '../../services/integrationService'
import { API_CONFIG } from '../../config/api'

function AssignEsimPage() {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  
  // Workflow state - matching HTML test file structure (6 steps)
  const [workflowData, setWorkflowData] = useState({
    userData: null,
    selectedBundle: null,
    paymentData: null,
    esimData: null,
    currentStep: 1,
    availableBundles: []
  })
  
  const [currentStep, setCurrentStep] = useState(1) // 1: Add User, 2: Fetch Plans, 3: Payment, 4: Provision, 5: QR & Email, 6: Save DB
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isProvisioning, setIsProvisioning] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isSavingToDb, setIsSavingToDb] = useState(false)
  const [error, setError] = useState(null)
  const [resellerMarkup, setResellerMarkup] = useState(0)
  
  // Form data for new user creation
  const [userForm, setUserForm] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    passportId: '',
    travelDate: ''
  })
  
  const [countryInfo, setCountryInfo] = useState(null)
  const [validationStatus, setValidationStatus] = useState(null)

  // Validation functions from HTML file
  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(email)
  }

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    return cleanPhone.startsWith('+') && cleanPhone.length >= 10
  }

  // Helper function for authenticated API requests (matching HTML logic)
  const makeAuthenticatedRequest = async (url, options = {}) => {
    const token = localStorage.getItem('access_token')  // Fix: use correct token key
    
    if (!token) {
      throw new Error('No authentication token available. Please login first.')
    }

    // Ensure URL has correct base URL
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }

    const response = await fetch(fullUrl, {
      ...options,
      headers
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Request failed: ${response.status}`)
    }

    return response
  }

  // Country detection function using backend API (matching HTML logic)
  const detectCountryFromPhone = async (phone, validateEsim = false) => {
    try {
      // Use backend API for accurate country detection and eSIM validation
      const token = localStorage.getItem('access_token')
      const headers = {
        'Content-Type': 'application/json'
      }
      
      // Add authorization header if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/v1/utils/detect-country/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          phone_number: phone,
          validate_esim: validateEsim
        })
      })

      // Get response text first to handle both cases
      const responseText = await response.text()
      
      // Check if response is ok
      if (!response.ok) {
        console.error('API Error Response:', responseText)
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (jsonError) {
        console.error('JSON Parse Error:', jsonError)
        console.error('Response Text:', responseText)
        throw new Error('Invalid JSON response from server')
      }
      
      if (data.data && !data.errors) {
        // Check if this is validation response with country_info
        if (data.data.country_info) {
          return data.data.country_info
        }
        // Legacy response format
        return data.data
      } else {
        console.warn('Backend country detection failed:', data.message)
        // If validation failed, throw error to show to user
        if (validateEsim && data.errors) {
          throw new Error(data.message || 'Phone number validation failed')
        }
        // Fallback to basic detection
        return { name: "Unknown Country", code: "XX", region: "Unknown" }
      }
    } catch (error) {
      console.warn('Country detection API error:', error)
      // If validation was requested and failed, re-throw the error
      if (validateEsim && error.message !== 'Failed to fetch') {
        throw error
      }
      // Fallback to basic detection
      return { name: "Unknown Country", code: "XX", region: "Unknown" }
    }
  }

  // User validation and client creation function
  const validateUserData = async () => {
    const { fullName, phoneNumber, email, passportId, travelDate } = userForm

    // Validation
    if (fullName.length < 2) {
      toast.error('Name must be at least 2 characters long.')
      return false
    }

    if (!validatePhone(phoneNumber)) {
      toast.error('Please enter a valid phone number with country code (e.g., +92XXXXXXXXX)')
      return false
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.')
      return false
    }

    if (passportId.length < 3) {
      toast.error('Please enter a valid passport/ID number.')
      return false
    }

    setValidationStatus('detecting')

    try {
      // Detect country using backend API and validate eSIM eligibility
      const countryInfo = await detectCountryFromPhone(phoneNumber, true)

      // Create client data (matching HTML logic - send country name as string)
      const clientData = {
        fullName,
        phoneNumber,
        email,
        passportId,
        countryOfTravel: countryInfo.name,  // Send only country name as string
        travelDate: travelDate || null
      }

      // Debug: Log the payload being sent (remove in production)
      console.log('🔍 Client data payload:', clientData)

      setValidationStatus('creating')

      // Create client through backend API using same endpoint as HTML
      const clientResult = await traveRoamService.createClient(clientData)

      if (!clientResult.success) {
        throw new Error(clientResult.error || 'Failed to create client')
      }

      // Store user data with client ID (preserve full country object for frontend use)
      const userData = {
        fullName,
        phoneNumber,
        email,
        passportId,
        countryOfTravel: countryInfo,  // Store full country object for frontend workflow
        travelDate: travelDate || null,
        clientId: clientResult.data.id
      }

      setWorkflowData(prev => ({ ...prev, userData }))
      setCountryInfo(countryInfo)
      setValidationStatus('success')
      toast.success('Client created and validated successfully!')
      return true

    } catch (error) {
      console.error('User validation error:', error)
      setValidationStatus('error')
      
      // Handle specific error types with better user messages
      let errorMessage = error.message
      if (error.message && error.message.includes('already exists')) {
        errorMessage = 'A client with this email already exists. Please use a different email address or check if the client is already registered.'
        toast.error(errorMessage, { duration: 6000 })
      } else if (error.message && error.message.includes('Network error')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.'
        toast.error(errorMessage, { duration: 6000 })
      } else {
        toast.error('Validation failed: ' + errorMessage)
      }
      
      return false
    }
  }

  // Fetch available bundles function using TraveRoam plans API (matching HTML logic)
  const fetchAvailableBundles = async () => {
    if (!workflowData.userData) {
      toast.error('Please validate user data first.')
      return
    }

    setIsLoadingPlans(true)
    try {
      console.log('🔄 Fetching available bundles from TraveRoam plans API...')

      // Use traveRoamService which handles authentication properly (matching HTML logic)
      const country = workflowData.userData.countryOfTravel
      const params = {
        countries: country.code,
        region: country.region
      }
      
      console.log('🔍 Bundle fetch params:', params)
      const response = await traveRoamService.getAvailablePlans(params)
      console.log('📦 Bundle response:', response)

      const data = response

      if (data.success && data.data) {
        const bundles = Array.isArray(data.data) ? data.data : data.data.plans || []

        const formattedBundles = bundles.map(bundle => ({
          bundle_id: bundle.id || bundle.name || bundle.bundle_name,
          name: bundle.name || bundle.description || bundle.bundle_name,
          country: bundle.country_code || bundle.country,
          country_name: bundle.country_name || bundle.countryName || bundle.country,
          data_volume: bundle.data_volume || bundle.dataVolume || bundle.data_allowance,
          validity_days: bundle.validity_days || bundle.validity || 30,
          price: parseFloat(bundle.price || bundle.cost || 0),
          currency: bundle.currency || 'USD',
          network: bundle.network || 'Multiple',
          coverage: bundle.coverage || 'Standard',
          description: bundle.description || '',
          features: bundle.features || []
        }))

        setWorkflowData(prev => ({ ...prev, availableBundles: formattedBundles }))
        console.log('✅ Loaded bundles:', formattedBundles.length)
        toast.success(`Found ${formattedBundles.length} available plans`)
      } else {
        throw new Error(response.error || 'Failed to load eSIM plans')
      }
    } catch (error) {
      console.error('❌ Failed to load eSIM plans:', error)
      toast.error('Failed to load eSIM plans: ' + error.message)
    } finally {
      setIsLoadingPlans(false)
    }
  }

  // Process payment function from HTML file
  const processPayment = async () => {
    if (!workflowData.selectedBundle) {
      toast.error('Please select a bundle first.')
      return
    }

    setIsProcessingPayment(true)
    try {
      console.log('💳 Processing payment...')
      
      const basePrice = parseFloat(workflowData.selectedBundle.price) || 0
      const markupAmount = (basePrice * resellerMarkup / 100)
      const finalPrice = basePrice + markupAmount

      const paymentData = {
        amount: finalPrice,
        currency: workflowData.selectedBundle.currency,
        bundle_id: workflowData.selectedBundle.bundle_id,
        user_data: workflowData.userData,
        markup_percentage: resellerMarkup
      }

      // For now, simulate successful payment
      // In real implementation, this would integrate with Stripe
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setWorkflowData(prev => ({ ...prev, paymentData }))
      toast.success('Payment processed successfully!')
      
    } catch (error) {
      console.error('❌ Payment processing failed:', error)
      toast.error('Payment failed: ' + error.message)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Provision eSIM function using TraveRoam orders endpoint (matching HTML logic)
  const provisionESIM = async () => {
    if (!workflowData.paymentData) {
      toast.error('Please complete payment first.')
      return
    }

    setIsProvisioning(true)
    try {
      console.log('🚀 Processing order with TraveRoam (matching HTML line 2262)...')

      // Step 1: Validate bundle assignment
      const validationResponse = await makeAuthenticatedRequest('/api/v1/traveroam/client/validate/', {
        method: 'POST',
        body: JSON.stringify({
          phone_number: workflowData.userData.phoneNumber,
          bundle_name: workflowData.selectedBundle.bundle_id || workflowData.selectedBundle.name
        })
      })

      const validationData = await validationResponse.json()
      
      if (!validationData.success || !validationData.data.valid) {
        throw new Error(validationData.data.message || 'Phone number already has an active bundle')
      }

      console.log('✅ Validation passed! Proceeding with eSIM provisioning...')

      // Step 2: Process order with TraveRoam (exact same as HTML)
      // Step 2: Check for duplicate assignments
      const duplicateResponse = await makeAuthenticatedRequest('/api/v1/traveroam/client/validate/', {
        method: 'POST',
        body: JSON.stringify({
          phone_number: workflowData.userData.phoneNumber,
          bundle_name: workflowData.selectedBundle.bundle_id || workflowData.selectedBundle.name,
          check_duplicate: true
        })
      })

      const duplicateData = await duplicateResponse.json()
      
      if (duplicateData.success && duplicateData.data.duplicate) {
        throw new Error(duplicateData.data.message || 'Duplicate assignment detected')
      }

      console.log('✅ No duplicate assignments found. Proceeding with provisioning...')

      // Step 3: Process order with TraveRoam (matching HTML line 2262)
      const response = await makeAuthenticatedRequest('/api/v1/traveroam/orders/process/', {
        method: 'POST',
        body: JSON.stringify({
          bundle_data: workflowData.selectedBundle,
          user_data: workflowData.userData,
          payment_data: workflowData.paymentData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        const esimData = data.data // Enhanced response structure
        
        setWorkflowData(prev => ({ ...prev, esimData }))
        toast.success('eSIM provisioned successfully!')
        
      } else {
        throw new Error(data.message || 'Failed to provision eSIM')
      }

    } catch (error) {
      console.error('❌ eSIM provisioning failed:', error)
      toast.error('Provisioning failed: ' + error.message)
    } finally {
      setIsProvisioning(false)
    }
  }

  // Send eSIM email function using same endpoint as HTML (line 2510)
  const sendESIMEmail = async () => {
    if (!workflowData.esimData) {
      toast.error('Please provision eSIM first.')
      return
    }

    setIsSendingEmail(true)
    try {
      console.log('📧 Sending eSIM delivery email (matching HTML logic)...')
      
      const response = await makeAuthenticatedRequest('/api/v1/esim/esim-deliveries/send_delivery_email/', {
        method: 'POST',
        body: JSON.stringify({
          user_data: workflowData.userData,
          bundle_data: workflowData.selectedBundle,
          esim_data: workflowData.esimData,
          payment_data: workflowData.paymentData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('eSIM details sent to client!')
      } else {
        throw new Error(data.error || 'Email delivery failed')
      }
      
    } catch (error) {
      console.error('❌ Failed to send email:', error)
      toast.error('Email sending failed: ' + error.message)
    } finally {
      setIsSendingEmail(false)
    }
  }

  // Save to database function using same endpoint as HTML (line 2605)
  const saveToDatabase = async () => {
    if (!workflowData.esimData) {
      toast.error('Please complete all previous steps first.')
      return
    }

    setIsSavingToDb(true)
    try {
      console.log('💾 Saving complete workflow data to database (matching HTML logic)...')

      const response = await makeAuthenticatedRequest('/api/v1/workflow/save-complete/', {
        method: 'POST',
        body: JSON.stringify({
          user_data: workflowData.userData,
          bundle_data: workflowData.selectedBundle,
          esim_data: workflowData.esimData,
          payment_data: workflowData.paymentData
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('🎉 Workflow completed successfully! All data saved to database.')
        
        // Mark workflow as complete
        setWorkflowData(prev => ({
          ...prev,
          workflowComplete: true,
          completedAt: new Date().toISOString(),
          databaseIds: {
            client_id: data.client_id,
            esim_id: data.esim_id,
            order_id: data.order_id,
            payment_id: data.payment_id
          }
        }))
      } else {
        throw new Error(data.error || 'Database save failed')
      }

    } catch (error) {
      console.error('❌ Failed to save to database:', error)
      toast.error('Database save failed: ' + error.message)
    } finally {
      setIsSavingToDb(false)
    }
  }

  // Step navigation functions
  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
      setWorkflowData(prev => ({ ...prev, currentStep: currentStep + 1 }))
    }
  }

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setWorkflowData(prev => ({ ...prev, currentStep: currentStep - 1 }))
    }
  }

  const resetWorkflow = () => {
    setWorkflowData({
      userData: null,
      selectedBundle: null,
      paymentData: null,
      esimData: null,
      currentStep: 1,
      availableBundles: []
    })
    setCurrentStep(1)
    setUserForm({
      fullName: '',
      phoneNumber: '',
      email: '',
      passportId: '',
      travelDate: ''
    })
    setCountryInfo(null)
    setValidationStatus(null)
    setResellerMarkup(0)
    toast.success('Workflow reset successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/reseller-dashboard')}
            className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">eSIM Assignment Workflow</h1>
            <p className="text-muted-foreground">Complete 6-step workflow for eSIM assignment via TraveRoam</p>
          </div>
        </div>
        <button
          onClick={resetWorkflow}
          className="flex items-center space-x-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reset Workflow</span>
        </button>
      </div>

      {/* Progress Steps - 6 steps like HTML file */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'Add New User', icon: UserPlus },
            { step: 2, title: 'Fetch eSIM Plans', icon: Smartphone },
            { step: 3, title: 'Payment Processing', icon: CreditCard },
            { step: 4, title: 'Provision eSIM', icon: Wifi },
            { step: 5, title: 'QR & Email Delivery', icon: QrCode },
            { step: 6, title: 'Save to Database', icon: CheckCircle }
          ].map((item, index) => {
            const Icon = item.icon
            const isActive = currentStep === item.step
            const isCompleted = currentStep > item.step
            const isLast = index === 5

            return (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center space-x-3 ${
                  isActive ? 'text-primary' : 
                  isCompleted ? 'text-green-500' : 
                  'text-muted-foreground'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'border-primary bg-primary/10' :
                    isCompleted ? 'border-green-500 bg-green-500/10' :
                    'border-muted-foreground/30 bg-muted/30'
                  }`}>
                    {isCompleted ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
                {!isLast && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    isCompleted ? 'bg-green-500' : 'bg-muted-foreground/30'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-muted-foreground/20 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Add New User */}
      {currentStep === 1 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Step 1: Add New User</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    👤 Full Name *
                  </label>
                  <input
                    type="text"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    📞 Phone Number (with country code) *
                  </label>
                  <input
                    type="tel"
                    value={userForm.phoneNumber}
                    onChange={(e) => setUserForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+91XXXXXXXXXX"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                  {countryInfo && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                      🌍 Detected Country: {countryInfo.name} ({countryInfo.code}) - Region: {countryInfo.region}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    📧 Email *
                  </label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    🛂 Passport Number / National ID *
                  </label>
                  <input
                    type="text"
                    value={userForm.passportId}
                    onChange={(e) => setUserForm(prev => ({ ...prev, passportId: e.target.value }))}
                    placeholder="Passport or ID number"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    📅 Date of Travel (optional)
                  </label>
                  <input
                    type="date"
                    value={userForm.travelDate}
                    onChange={(e) => setUserForm(prev => ({ ...prev, travelDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={validateUserData}
                    disabled={validationStatus === 'detecting' || validationStatus === 'creating'}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {validationStatus === 'detecting' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Detecting Country...</span>
                      </>
                    ) : validationStatus === 'creating' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        <span>Creating Client...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Validate User Data</span>
                      </>
                    )}
                  </button>

                  {/* Validation Status Display */}
                  {validationStatus === 'success' && workflowData.userData && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Client Created Successfully!</span>
                      </div>
                      <div className="mt-2 text-sm text-green-700">
                        <p>📍 Country: {countryInfo?.name} ({countryInfo?.code})</p>
                        <p>🌍 Region: {countryInfo?.region}</p>
                        {workflowData.userData.clientId && (
                          <p>🆔 Client ID: {workflowData.userData.clientId}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {validationStatus === 'error' && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-red-800">
                        <X className="h-5 w-5" />
                        <span className="font-medium">Validation Failed</span>
                      </div>
                      <p className="text-red-600 text-sm mt-1">Please check your information and try again.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <div></div>
              <button
                onClick={nextStep}
                disabled={!workflowData.userData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span>Next: Fetch eSIM Plans</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Fetch Available eSIM Plans */}
      {currentStep === 2 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Step 2: Available eSIM Plans</span>
            </h2>

            {workflowData.userData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-medium text-blue-900">🌍 Destination: {workflowData.userData.countryOfTravel.name} ({workflowData.userData.countryOfTravel.code})</h5>
                <p className="text-blue-700">Region: {workflowData.userData.countryOfTravel.region}</p>
                <p className="text-blue-600 text-sm">Click "Fetch eSIM Plans" to see available bundles for this destination.</p>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <button
                onClick={fetchAvailableBundles}
                disabled={isLoadingPlans || !workflowData.userData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isLoadingPlans ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>Fetching Plans...</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4" />
                    <span>Fetch eSIM Plans</span>
                  </>
                )}
              </button>
            </div>

            {workflowData.availableBundles.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Available Plans:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workflowData.availableBundles.map((bundle, index) => (
                    <button
                      key={bundle.bundle_id}
                      onClick={() => {
                        setWorkflowData(prev => ({ ...prev, selectedBundle: bundle }))
                        toast.success('Bundle selected!')
                      }}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        workflowData.selectedBundle?.bundle_id === bundle.bundle_id
                          ? 'border-green-500 bg-green-50'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-foreground">{bundle.name}</h4>
                          <span className="text-lg font-bold text-primary">${bundle.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Data: {bundle.data_volume}</p>
                        <p className="text-sm text-muted-foreground">Validity: {bundle.validity_days} days</p>
                        <p className="text-sm text-muted-foreground">Network: {bundle.network}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={previousStep}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={nextStep}
                disabled={!workflowData.selectedBundle}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span>Next: Payment Processing</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Payment Processing */}
      {currentStep === 3 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Step 3: Payment Processing</span>
            </h2>

            {workflowData.selectedBundle && workflowData.userData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">💳 Payment Summary</h4>
                <p className="text-blue-700"><strong>Client:</strong> {workflowData.userData.fullName} ({workflowData.userData.email})</p>
                <p className="text-blue-700"><strong>Plan:</strong> {workflowData.selectedBundle.name}</p>
                <p className="text-blue-700"><strong>Base Price:</strong> ${workflowData.selectedBundle.price} {workflowData.selectedBundle.currency}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Reseller Markup Percentage (0-50%)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={resellerMarkup}
                onChange={(e) => setResellerMarkup(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {workflowData.selectedBundle && (
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Pricing Breakdown:</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span>${workflowData.selectedBundle.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Markup ({resellerMarkup}%):</span>
                    <span>${((workflowData.selectedBundle.price * resellerMarkup) / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-1">
                    <span>Total:</span>
                    <span>${(workflowData.selectedBundle.price + (workflowData.selectedBundle.price * resellerMarkup) / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={processPayment}
              disabled={isProcessingPayment || !workflowData.selectedBundle}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  <span>Process Payment</span>
                </>
              )}
            </button>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={previousStep}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={nextStep}
                disabled={!workflowData.paymentData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span>Next: Provision eSIM</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Provision eSIM */}
      {currentStep === 4 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Step 4: Provision eSIM</span>
            </h2>

            {workflowData.paymentData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700">✅ Payment completed successfully. Ready to provision eSIM via TraveRoam.</p>
              </div>
            )}

            <button
              onClick={provisionESIM}
              disabled={isProvisioning || !workflowData.paymentData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isProvisioning ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  <span>Provisioning eSIM...</span>
                </>
              ) : (
                <>
                  <Wifi className="h-4 w-4" />
                  <span>Provision eSIM via TraveRoam</span>
                </>
              )}
            </button>

            {workflowData.esimData && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">✅ eSIM Provisioned Successfully!</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>eSIM ID:</strong> {workflowData.esimData.esim_id}</p>
                  <p><strong>ICCID:</strong> {workflowData.esimData.iccid}</p>
                  <p><strong>Status:</strong> {workflowData.esimData.status}</p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={previousStep}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={nextStep}
                disabled={!workflowData.esimData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span>Next: QR & Email Delivery</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: QR Code & Email Delivery */}
      {currentStep === 5 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <QrCode className="h-5 w-5" />
              <span>Step 5: QR Code & Email Delivery</span>
            </h2>

            {workflowData.esimData && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-blue-900 mb-2">📱 QR Code for eSIM Installation</h4>
                  {workflowData.esimData.qr_code && (
                    <div className="bg-card border border-border p-4 rounded-lg inline-block">
                      <div className="text-xs font-mono break-all text-muted-foreground max-w-md">
                        {workflowData.esimData.qr_code}
                      </div>
                    </div>
                  )}
                  <p className="text-blue-600 text-sm mt-2">Scan this QR code with your device to install the eSIM</p>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-2">eSIM Details:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Activation Code:</strong> {workflowData.esimData.activation_code}</p>
                    <p><strong>ICCID:</strong> {workflowData.esimData.iccid}</p>
                    <p><strong>Status:</strong> {workflowData.esimData.status}</p>
                    <p><strong>Expiry Date:</strong> {workflowData.esimData.expiry_date ? new Date(workflowData.esimData.expiry_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={sendESIMEmail}
              disabled={isSendingEmail || !workflowData.esimData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSendingEmail ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending Email...</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Send eSIM Details to Client</span>
                </>
              )}
            </button>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={previousStep}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <button
                onClick={nextStep}
                disabled={!workflowData.esimData}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <span>Next: Save to Database</span>
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Save to Database */}
      {currentStep === 6 && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Step 6: Save to Database</span>
            </h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💾 Database Operation Summary</h4>
              <p className="text-blue-700">All eSIM data will be saved to the database for future reference and management.</p>
            </div>

            <button
              onClick={saveToDatabase}
              disabled={isSavingToDb || !workflowData.esimData}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isSavingToDb ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Save to Database</span>
                </>
              )}
            </button>

            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">🎉 Workflow Completed Successfully!</h3>
              <p className="text-muted-foreground mb-4">All data has been saved to the database and the eSIM has been delivered to the client.</p>

              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={resetWorkflow}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Start New Workflow</span>
                </button>
                <button
                  onClick={() => navigate('/reseller-dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <button
                onClick={previousStep}
                className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssignEsimPage
