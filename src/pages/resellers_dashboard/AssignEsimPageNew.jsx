import { useState, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
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
  UserPlus,
  Zap,
  Star,
  Sparkles,
  User,
  Phone,
  MapPin
} from 'lucide-react'
import toast from 'react-hot-toast'
import { clientService } from '../../services/clientService'
import { traveRoamService } from '../../services/traveRoamService'
import { esimService } from '../../services/esimService'
import { integrationService } from '../../services/integrationService'
import { paymentsService } from '../../services/paymentsService'
import { API_CONFIG } from '../../config/api'
import WorkflowStepIndicator from '../../components/esim/WorkflowStepIndicator'

function AssignEsimPage() {
  const { resolvedTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  
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

  // Handle pre-selected client from navigation state
  useEffect(() => {
    const selectedClient = location.state?.selectedClient
    if (selectedClient) {
      console.log('📋 Pre-selected client detected:', selectedClient)
      
      // Pre-populate user form with client data
      setUserForm({
        fullName: selectedClient.fullName || selectedClient.full_name || '',
        phoneNumber: selectedClient.phone || selectedClient.phone_number || '',
        email: selectedClient.email || '',
        passportId: selectedClient.passportNumber || selectedClient.passport_id || selectedClient.nationalId || selectedClient.national_id || '',
        travelDate: selectedClient.dateOfTravel || selectedClient.date_of_travel || ''
      })

      // Detect proper country and region information from phone number
      const phoneNumber = selectedClient.phone || selectedClient.phone_number
      if (phoneNumber) {
        detectCountryFromPhone(phoneNumber, false)
          .then(countryInfo => {
            console.log('🌍 Detected country info for pre-selected client:', countryInfo)
            
            // Set up workflow data with existing client and proper country info
            const userData = {
              fullName: selectedClient.fullName || selectedClient.full_name,
              phoneNumber: phoneNumber,
              email: selectedClient.email,
              passportId: selectedClient.passportNumber || selectedClient.passport_id || selectedClient.nationalId || selectedClient.national_id || '',
              countryOfTravel: countryInfo,
              travelDate: selectedClient.dateOfTravel || selectedClient.date_of_travel || null,
              clientId: selectedClient.id
            }

            setWorkflowData(prev => ({ ...prev, userData }))
            setCountryInfo(countryInfo)
            setValidationStatus('success')
            
            // Skip to step 2 (Fetch Plans) since client is already selected
            setCurrentStep(2)
            
            toast.success(`Client ${userData.fullName} selected for eSIM assignment`)
          })
          .catch(error => {
            console.warn('Failed to detect country for pre-selected client:', error)
            
            // Fallback: Set up with basic country data
            const countryData = selectedClient.countryOfTravel || selectedClient.country_of_travel || 'Unknown'
            const userData = {
              fullName: selectedClient.fullName || selectedClient.full_name,
              phoneNumber: phoneNumber,
              email: selectedClient.email,
              passportId: selectedClient.passportNumber || selectedClient.passport_id || selectedClient.nationalId || selectedClient.national_id || '',
              countryOfTravel: typeof countryData === 'string' ? { name: countryData, code: countryData, region: 'Unknown' } : countryData,
              travelDate: selectedClient.dateOfTravel || selectedClient.date_of_travel || null,
              clientId: selectedClient.id
            }

            setWorkflowData(prev => ({ ...prev, userData }))
            setValidationStatus('success')
            setCurrentStep(2)
            
            toast.success(`Client ${userData.fullName} selected for eSIM assignment`)
            toast.warning('Could not detect region automatically. Please verify country information before fetching plans.')
          })
      } else {
        // No phone number available, use fallback
        const countryData = selectedClient.countryOfTravel || selectedClient.country_of_travel || 'Unknown'
        const userData = {
          fullName: selectedClient.fullName || selectedClient.full_name,
          phoneNumber: '',
          email: selectedClient.email,
          passportId: selectedClient.passportNumber || selectedClient.passport_id || selectedClient.nationalId || selectedClient.national_id || '',
          countryOfTravel: typeof countryData === 'string' ? { name: countryData, code: countryData, region: 'Unknown' } : countryData,
          travelDate: selectedClient.dateOfTravel || selectedClient.date_of_travel || null,
          clientId: selectedClient.id
        }

        setWorkflowData(prev => ({ ...prev, userData }))
        setValidationStatus('success')
        setCurrentStep(2)
        
        toast.success(`Client ${userData.fullName} selected for eSIM assignment`)
        toast.warning('No phone number available for region detection. Please verify country information.')
      }
    }
  }, [location.state])

  // Handle Stripe checkout success/failure on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    const canceled = urlParams.get('canceled')
    const sessionId = urlParams.get('session_id')

    if (success === '1' && sessionId) {
      // Payment was successful, verify and continue workflow
      handleStripeCheckoutSuccess(sessionId)
    } else if (canceled === '1') {
      // Payment was canceled
      handleStripeCheckoutCancel()
    }
  }, [])

  // Handle successful Stripe checkout
  const handleStripeCheckoutSuccess = async (sessionId) => {
    try {
      console.log('✅ Stripe checkout successful, verifying session:', sessionId)
      
      // Show loading state
      setIsProcessingPayment(true)
      toast.loading('Verifying payment...', { duration: 2000 })

      // Verify the checkout session
      const verificationResponse = await paymentsService.verifyStripeCheckoutSession(sessionId)

      if (verificationResponse.success) {
        console.log('✅ Payment verified successfully:', verificationResponse.data)

        // Restore workflow data from localStorage
        const savedWorkflowData = localStorage.getItem('workflowData')
        const savedCheckoutData = localStorage.getItem('stripeCheckoutData')

        if (savedWorkflowData && savedCheckoutData) {
          const workflowData = JSON.parse(savedWorkflowData)
          const checkoutData = JSON.parse(savedCheckoutData)

          // Update workflow with payment data
          const paymentData = {
            ...checkoutData,
            payment_id: verificationResponse.data.payment_id,
            status: 'completed',
            verified_at: new Date().toISOString()
          }

          setWorkflowData(prev => ({ ...workflowData, paymentData }))
          setCurrentStep(4) // Move to next step (Provision eSIM)
          
          toast.success('Payment completed successfully!')
        }

        // Clean up localStorage
        localStorage.removeItem('stripeSessionId')
        localStorage.removeItem('stripeCheckoutData')
        localStorage.removeItem('workflowData')

        // Clear URL parameters
        window.history.replaceState({}, '', window.location.pathname)

      } else {
        throw new Error(verificationResponse.error || 'Payment verification failed')
      }

    } catch (error) {
      console.error('❌ Payment verification failed:', error)
      toast.error(`Payment verification failed: ${error.message}`)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Handle canceled Stripe checkout
  const handleStripeCheckoutCancel = () => {
    console.log('⚠️ Stripe checkout was canceled')
    toast.error('Payment was canceled. You can try again when ready.')
    
    // Clean up localStorage
    localStorage.removeItem('stripeSessionId')
    localStorage.removeItem('stripeCheckoutData')
    localStorage.removeItem('workflowData')

    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname)
    
    // Stay on payment step
    setCurrentStep(3)
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

  // Process payment function with Stripe Checkout Session
  const processPayment = async () => {
    if (!workflowData.selectedBundle) {
      toast.error('Please select a bundle first.')
      return
    }

    if (!workflowData.userData) {
      toast.error('Please validate user data first.')
      return
    }

    setIsProcessingPayment(true)
    try {
      console.log('💳 Creating Stripe checkout session...')
      
      const basePrice = parseFloat(workflowData.selectedBundle.price) || 0
      const markupAmount = (basePrice * resellerMarkup / 100)
      const finalPrice = basePrice + markupAmount

      // Prepare checkout data for Stripe hosted checkout (console script format)
      const checkoutData = {
        bundle_details: {
          bundle_id: workflowData.selectedBundle.bundle_id || workflowData.selectedBundle.name,
          name: workflowData.selectedBundle.name,
          price: basePrice,
          currency: workflowData.selectedBundle.currency || 'USD',
          country: workflowData.userData.countryOfTravel?.name || 'Unknown'
        },
        client_data: {
          id: workflowData.userData.clientId,
          full_name: workflowData.userData.fullName,
          email: workflowData.userData.email,
          phone: workflowData.userData.phoneNumber,
          country: workflowData.userData.countryOfTravel?.name || 'Unknown'
        },
        markup_percent: resellerMarkup,
        success_url: `${window.location.origin}/reseller-dashboard/assign-esim?success=1&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${window.location.origin}/reseller-dashboard/assign-esim?canceled=1`
      }

      console.log('🔄 Creating Stripe checkout session:', checkoutData)

      // Create Stripe checkout session through backend
      const checkoutResponse = await paymentsService.createStripeCheckoutSession(checkoutData)

      if (checkoutResponse.success) {
        console.log('✅ Checkout session created:', checkoutResponse.data)
        
        // Store checkout session data for verification later
        const checkoutSessionData = {
          session_id: checkoutResponse.data.session_id,
          checkout_url: checkoutResponse.data.checkout_url,
          amount: finalPrice,
          currency: workflowData.selectedBundle.currency || 'USD',
          markup_percent: resellerMarkup,
          base_price: basePrice,
          final_price: finalPrice,
          created_at: new Date().toISOString()
        }

        // Store in localStorage for verification after redirect
        localStorage.setItem('stripeSessionId', checkoutResponse.data.session_id)
        localStorage.setItem('stripeCheckoutData', JSON.stringify(checkoutSessionData))
        localStorage.setItem('workflowData', JSON.stringify(workflowData))

        // Show redirect message
        toast.success('Redirecting to Stripe checkout...', { duration: 2000 })
        
        // Redirect to Stripe hosted checkout after short delay
        setTimeout(() => {
          console.log('🌐 Redirecting to Stripe checkout:', checkoutResponse.data.checkout_url)
          window.location.href = checkoutResponse.data.checkout_url
        }, 1500)
        
      } else {
        throw new Error(checkoutResponse.error || 'Failed to create checkout session')
      }
      
    } catch (error) {
      console.error('❌ Stripe checkout session creation failed:', error)
      
      // Handle specific checkout errors
      let errorMessage = 'Failed to create payment session. Please try again.'
      if (error.message) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.message.includes('authentication')) {
          errorMessage = 'Authentication error. Please refresh the page and try again.'
        } else {
          errorMessage = `Checkout failed: ${error.message}`
        }
      }
      
      toast.error(errorMessage, { duration: 6000 })
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
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative slide-down">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/reseller-dashboard')}
            className={`
              flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 
              hover-scale focus-ring
              ${resolvedTheme === 'dark' 
                ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
              }
            `}
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={resetWorkflow}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 
                hover-scale focus-ring
                ${resolvedTheme === 'dark' 
                  ? 'bg-slate-700/50 hover:bg-slate-600/60 text-slate-300' 
                  : 'bg-gray-100/50 hover:bg-gray-200/60 text-gray-700'
                }
              `}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="font-medium">Reset Workflow</span>
            </button>
            
            <div className={`
              px-4 py-2 rounded-xl border transition-all duration-300
              ${resolvedTheme === 'dark' 
                ? 'bg-slate-800/50 border-slate-700/50 text-slate-300' 
                : 'bg-white/50 border-gray-200/50 text-gray-600'
              }
            `}>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium">Step {currentStep} of 6</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient-colorful mb-2">
            eSIM Assignment Workflow
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete the streamlined workflow for eSIM assignment via TraveRoam
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></div>
              <span className="text-emerald-600 font-medium">Workflow Active</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-purple-600 font-medium">Enhanced Experience</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Progress Steps */}
      <div className="slide-up" style={{ animationDelay: '0.2s' }}>
        <WorkflowStepIndicator 
          currentStep={currentStep}
          completedSteps={Array.from({ length: currentStep - 1 }, (_, i) => i + 1)}
          errorStep={error ? currentStep : null}
          className="mb-8"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Add New User - Enhanced Design */}
      {currentStep === 1 && (
        <div className={cn(
          'relative overflow-hidden rounded-2xl shadow-xl transition-all duration-300',
          resolvedTheme === 'dark'
            ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50'
            : 'bg-gradient-to-br from-white to-gray-50/50 border border-gray-200/50'
        )}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          </div>

          <div className="relative p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className={cn(
                'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg',
                'bg-gradient-to-br from-blue-500 to-purple-600'
              )}>
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Add New Client
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Enter client details to begin the eSIM assignment process
              </p>
            </div>

            {/* Form Section */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Full Name Field */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-foreground mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Full Name</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={userForm.fullName}
                        onChange={(e) => setUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter client's full name"
                        className={cn(
                          'w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300',
                          'bg-background/50 backdrop-blur-sm',
                          'placeholder:text-muted-foreground/70',
                          'focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500',
                          'hover:border-blue-400/50',
                          resolvedTheme === 'dark'
                            ? 'border-slate-600 text-white'
                            : 'border-gray-300 text-gray-900'
                        )}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-foreground mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Phone Number</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-muted-foreground group-focus-within:text-green-500 transition-colors" />
                      </div>
                      <input
                        type="tel"
                        value={userForm.phoneNumber}
                        onChange={(e) => setUserForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        placeholder="+1 234 567 8900"
                        className={cn(
                          'w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300',
                          'bg-background/50 backdrop-blur-sm',
                          'placeholder:text-muted-foreground/70',
                          'focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500',
                          'hover:border-green-400/50',
                          resolvedTheme === 'dark'
                            ? 'border-slate-600 text-white'
                            : 'border-gray-300 text-gray-900'
                        )}
                        required
                      />
                    </div>
                    {countryInfo && (
                      <div className={cn(
                        'mt-3 p-4 rounded-xl border transition-all duration-300',
                        'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
                        'dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-800'
                      )}>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-200">
                              {countryInfo.name} ({countryInfo.code})
                            </p>
                            <p className="text-sm text-green-600 dark:text-green-400">
                              Region: {countryInfo.region}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-foreground mb-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Email Address</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={userForm.email}
                        onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="client@example.com"
                        className={cn(
                          'w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300',
                          'bg-background/50 backdrop-blur-sm',
                          'placeholder:text-muted-foreground/70',
                          'focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500',
                          'hover:border-purple-400/50',
                          resolvedTheme === 'dark'
                            ? 'border-slate-600 text-white'
                            : 'border-gray-300 text-gray-900'
                        )}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Passport/ID Field */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-foreground mb-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span>Passport / National ID</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <CreditCard className="h-5 w-5 text-muted-foreground group-focus-within:text-orange-500 transition-colors" />
                      </div>
                      <input
                        type="text"
                        value={userForm.passportId}
                        onChange={(e) => setUserForm(prev => ({ ...prev, passportId: e.target.value }))}
                        placeholder="Enter passport or ID number"
                        className={cn(
                          'w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300',
                          'bg-background/50 backdrop-blur-sm',
                          'placeholder:text-muted-foreground/70',
                          'focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500',
                          'hover:border-orange-400/50',
                          resolvedTheme === 'dark'
                            ? 'border-slate-600 text-white'
                            : 'border-gray-300 text-gray-900'
                        )}
                        required
                      />
                    </div>
                  </div>

                  {/* Travel Date Field */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-foreground mb-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                      <span>Travel Date</span>
                      <span className="text-xs text-muted-foreground">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="date"
                        value={userForm.travelDate}
                        onChange={(e) => setUserForm(prev => ({ ...prev, travelDate: e.target.value }))}
                        className={cn(
                          'w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300',
                          'bg-background/50 backdrop-blur-sm',
                          'focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500',
                          'hover:border-indigo-400/50',
                          resolvedTheme === 'dark'
                            ? 'border-slate-600 text-white'
                            : 'border-gray-300 text-gray-900'
                        )}
                      />
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className={cn(
                    'p-6 rounded-xl border transition-all duration-300',
                    'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
                    'dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800'
                  )}>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                          Country Detection
                        </h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          We'll automatically detect the destination country from the phone number to show relevant eSIM plans.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={validateUserData}
                    disabled={validationStatus === 'detecting' || validationStatus === 'creating'}
                    className={cn(
                      'flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300',
                      'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                      'hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25',
                      'focus:outline-none focus:ring-4 focus:ring-blue-500/20',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
                      'transform hover:scale-[1.02] active:scale-[0.98]'
                    )}
                  >
                    {validationStatus === 'detecting' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Detecting Country...</span>
                      </>
                    ) : validationStatus === 'creating' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Client...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span>Validate & Continue</span>
                        <ArrowLeft className="h-4 w-4 rotate-180" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Validation Status Display */}
              {validationStatus === 'success' && workflowData.userData && (
                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 dark:bg-green-900/20 dark:border-green-800">
                  <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Client Created Successfully!</span>
                  </div>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>📍 Country: {countryInfo?.name} ({countryInfo?.code})</p>
                    <p>🌍 Region: {countryInfo?.region}</p>
                    {workflowData.userData.clientId && (
                      <p>🆔 Client ID: {workflowData.userData.clientId}</p>
                    )}
                  </div>
                </div>
              )}

              {validationStatus === 'error' && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/20 dark:border-red-800">
                  <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                    <X className="h-5 w-5" />
                    <span className="font-medium">Validation Failed</span>
                  </div>
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">Please check your information and try again.</p>
                </div>
              )}
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
                <div className="space-y-1 text-blue-700">
                  <p><strong>Client:</strong> {workflowData.userData.fullName}</p>
                  <p><strong>Email:</strong> {workflowData.userData.email}</p>
                  <p><strong>Plan:</strong> {workflowData.selectedBundle.name}</p>
                  <p><strong>Country:</strong> {workflowData.userData.countryOfTravel?.name || 'Unknown'}</p>
                  <p><strong>Base Price:</strong> ${workflowData.selectedBundle.price} {workflowData.selectedBundle.currency || 'USD'}</p>
                  <p className="text-sm text-blue-600 mt-2">
                    <strong>Payment Method:</strong> Stripe (Secure Card Processing) 🔒
                  </p>
                </div>
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

            {/* Payment Information */}
            {!workflowData.paymentData && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <div className="text-yellow-600 mt-0.5">ℹ️</div>
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-1">Secure Payment with Stripe</p>
                    <p>You'll be redirected to Stripe's secure checkout page to complete your payment. After successful payment, you'll return here to continue the eSIM provisioning process.</p>
                  </div>
                </div>
              </div>
            )}

            {workflowData.paymentData ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-800 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Payment Completed Successfully!</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Amount:</strong> ${workflowData.paymentData.final_price || workflowData.paymentData.amount}</p>
                  <p><strong>Payment ID:</strong> {workflowData.paymentData.payment_id || 'Generated'}</p>
                  <p><strong>Status:</strong> {workflowData.paymentData.status || 'Completed'}</p>
                  <p><strong>Processed:</strong> {workflowData.paymentData.processed_at ? new Date(workflowData.paymentData.processed_at).toLocaleString() : 'Just now'}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={processPayment}
                disabled={isProcessingPayment || !workflowData.selectedBundle}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Secure Checkout...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Pay with Stripe (Secure Checkout)</span>
                  </>
                )}
              </button>
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
