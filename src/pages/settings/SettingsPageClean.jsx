import { useState, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import toast from 'react-hot-toast'
import {
  Settings,
  User,
  DollarSign,
  Bell,
  Key,
  Palette,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  Download,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Shield,
  CreditCard,
  Truck,
  Calculator,
  Image,
  Code,
  Webhook,
  Lock,
  AlertCircle,
  CheckCircle,
  Users,
  MapPin,
  PercentCircle,
  FileText,
  Copy,
  TestTube,
  Monitor,
  Plus,
  Trash2,
  Edit,
  Building,
} from 'lucide-react'

function SettingsPageClean() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'SIM Admin Panel',
    siteDescription: 'Professional SIM management system',
    contactEmail: 'admin@simadmin.com',
    supportPhone: '+971-50-123-4567',
    
    // Admin Account Settings
    adminName: 'Admin User',
    adminEmail: 'admin@example.com',
    adminRole: 'super_admin',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePicture: null,
    permissions: {
      manageUsers: true,
      manageOrders: true,
      manageResellers: true,
      manageReports: true,
      manageSettings: true,
      manageBilling: true,
    },
    
    // Delivery Fees & Zones
    deliveryZones: [
      { id: 1, name: 'Zone 1 - Dubai', fee: 15.00, freeThreshold: 200.00 },
      { id: 2, name: 'Zone 2 - Abu Dhabi', fee: 25.00, freeThreshold: 300.00 },
      { id: 3, name: 'Zone 3 - Other Emirates', fee: 35.00, freeThreshold: 400.00 },
    ],
    defaultDeliveryFee: 15.00,
    freeDeliveryThreshold: 200.00,
    expressDeliveryFee: 50.00,
    weekendDeliveryMultiplier: 1.5,
    weightBasedPricing: {
      enabled: true,
      baseWeight: 0.5, // kg
      additionalWeightFee: 5.00, // per 0.5kg
    },
    
    // Tax & Service Charges
    taxSettings: {
      vatRate: 5.0,
      vatEnabled: true,
      serviceCharge: 5.00,
      serviceChargeType: 'percentage', // percentage or fixed
      municipalityTax: 2.0,
      municipalityTaxEnabled: false,
      touismTax: 10.0,
      tourismTaxEnabled: false,
    },
    currency: 'AED',
    
    // Notification Content Management
    notificationTemplates: {
      email: {
        orderConfirmation: {
          subject: 'Order Confirmation - #{order_number}',
          body: 'Dear {customer_name},\n\nYour order #{order_number} has been confirmed.\n\nThank you for your business!'
        },
        orderShipped: {
          subject: 'Order Shipped - #{order_number}',
          body: 'Dear {customer_name},\n\nYour order #{order_number} has been shipped.\n\nTracking: {tracking_number}'
        },
        orderDelivered: {
          subject: 'Order Delivered - #{order_number}',
          body: 'Dear {customer_name},\n\nYour order #{order_number} has been delivered successfully!'
        }
      },
      sms: {
        orderConfirmation: 'Order #{order_number} confirmed. Thank you {customer_name}!',
        orderShipped: 'Order #{order_number} shipped. Track: {tracking_number}',
        orderDelivered: 'Order #{order_number} delivered successfully!'
      }
    },
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderAlerts: true,
    
    // API Keys & Webhooks
    apiKeys: [
      { id: 1, name: 'Production API', key: 'pk_live_***************', status: 'active', lastUsed: '2024-01-15' },
      { id: 2, name: 'Development API', key: 'pk_test_***************', status: 'active', lastUsed: '2024-01-14' },
    ],
    webhooks: [
      { id: 1, name: 'Order Webhook', url: 'https://api.example.com/webhooks/orders', events: ['order.created', 'order.updated'], status: 'active' },
      { id: 2, name: 'Payment Webhook', url: 'https://api.example.com/webhooks/payments', events: ['payment.success', 'payment.failed'], status: 'active' },
    ],
    
    // Branding & Logo
    branding: {
      logo: null,
      favicon: null,
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      brandName: 'SIM Admin Panel',
      tagline: 'Professional SIM Management',
      footer: '© 2024 SIM Admin Panel. All rights reserved.',
    },
    
    // Theme
    selectedTheme: theme || 'light',
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    ipWhitelist: [],
    loginAttempts: 5,
  })

  const fileInputRef = useRef(null)
  const [selectedTemplate, setSelectedTemplate] = useState('orderConfirmation')
  const [selectedNotificationType, setSelectedNotificationType] = useState('email')

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'admin', label: 'Admin Account', icon: Users },
    { id: 'delivery', label: 'Delivery & Fees', icon: Truck },
    { id: 'tax', label: 'Tax & Charges', icon: Calculator },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'api', label: 'API & Webhooks', icon: Code },
    { id: 'branding', label: 'Branding', icon: Building },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'theme', label: 'Theme', icon: Palette },
  ]

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!')
  }

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setSettings(prev => ({ ...prev, selectedTheme: newTheme }))
    toast.success(`Theme changed to ${newTheme}`)
  }

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === 'logo') {
          setSettings(prev => ({
            ...prev,
            branding: { ...prev.branding, logo: e.target.result }
          }))
        } else if (type === 'favicon') {
          setSettings(prev => ({
            ...prev,
            branding: { ...prev.branding, favicon: e.target.result }
          }))
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`)
      }
      reader.readAsDataURL(file)
    }
  }

  const addDeliveryZone = () => {
    const newZone = {
      id: Date.now(),
      name: 'New Zone',
      fee: 0,
      freeThreshold: 0
    }
    setSettings(prev => ({
      ...prev,
      deliveryZones: [...prev.deliveryZones, newZone]
    }))
  }

  const removeDeliveryZone = (id) => {
    setSettings(prev => ({
      ...prev,
      deliveryZones: prev.deliveryZones.filter(zone => zone.id !== id)
    }))
  }

  const updateDeliveryZone = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      deliveryZones: prev.deliveryZones.map(zone =>
        zone.id === id ? { ...zone, [field]: value } : zone
      )
    }))
  }

  const addApiKey = () => {
    const newKey = {
      id: Date.now(),
      name: 'New API Key',
      key: 'pk_' + Math.random().toString(36).substr(2, 20),
      status: 'active',
      lastUsed: new Date().toISOString().split('T')[0]
    }
    setSettings(prev => ({
      ...prev,
      apiKeys: [...prev.apiKeys, newKey]
    }))
  }

  const removeApiKey = (id) => {
    setSettings(prev => ({
      ...prev,
      apiKeys: prev.apiKeys.filter(key => key.id !== id)
    }))
  }

  const addWebhook = () => {
    const newWebhook = {
      id: Date.now(),
      name: 'New Webhook',
      url: '',
      events: [],
      status: 'inactive'
    }
    setSettings(prev => ({
      ...prev,
      webhooks: [...prev.webhooks, newWebhook]
    }))
  }

  const removeWebhook = (id) => {
    setSettings(prev => ({
      ...prev,
      webhooks: prev.webhooks.filter(webhook => webhook.id !== id)
    }))
  }

  const updateWebhook = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      webhooks: prev.webhooks.map(webhook =>
        webhook.id === id ? { ...webhook, [field]: value } : webhook
      )
    }))
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const testWebhook = (webhookUrl) => {
    toast.loading('Testing webhook...')
    setTimeout(() => {
      toast.dismiss()
      toast.success('Webhook test successful!')
    }, 2000)
  }

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your system configuration and preferences</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-card rounded-lg shadow-soft dark:shadow-dark-soft border border-border p-6">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Site Description
                    </label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Admin Account Settings */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Admin Account Settings</h3>
                
                {/* Profile Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Profile Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Admin Name
                    </label>
                    <input
                      type="text"
                      value={settings.adminName}
                      onChange={(e) => setSettings(prev => ({ ...prev, adminName: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={settings.adminEmail}
                      onChange={(e) => setSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                    />
                  </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Role
                      </label>
                      <select
                        value={settings.adminRole}
                        onChange={(e) => setSettings(prev => ({ ...prev, adminRole: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                      >
                        <option value="super_admin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={settings.newPassword}
                        onChange={(e) => setSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Leave blank to keep current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                </div>

                {/* Permissions */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(settings.permissions).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            permissions: { ...prev.permissions, [key]: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Update Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* Delivery & Fees Settings */}
            {activeTab === 'delivery' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Delivery & Fees Configuration</h3>
                
                {/* Delivery Zones */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Delivery Zones</h4>
                    <button
                      onClick={addDeliveryZone}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Zone</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {settings.deliveryZones.map((zone) => (
                      <div key={zone.id} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                          <input
                            type="text"
                            value={zone.name}
                            onChange={(e) => updateDeliveryZone(zone.id, 'name', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Zone name"
                          />
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Fee:</span>
                            <input
                              type="number"
                              value={zone.fee}
                              onChange={(e) => updateDeliveryZone(zone.id, 'fee', parseFloat(e.target.value))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                              step="0.01"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">Free above:</span>
                            <input
                              type="number"
                              value={zone.freeThreshold}
                              onChange={(e) => updateDeliveryZone(zone.id, 'freeThreshold', parseFloat(e.target.value))}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="0.00"
                              step="0.01"
                            />
                          </div>
                          <button
                            onClick={() => removeDeliveryZone(zone.id)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* General Delivery Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">General Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Express Delivery Fee
                      </label>
                      <input
                        type="number"
                        value={settings.expressDeliveryFee}
                        onChange={(e) => setSettings(prev => ({ ...prev, expressDeliveryFee: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Weekend Delivery Multiplier
                      </label>
                      <input
                        type="number"
                        value={settings.weekendDeliveryMultiplier}
                        onChange={(e) => setSettings(prev => ({ ...prev, weekendDeliveryMultiplier: parseFloat(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="0.1"
                      />
                    </div>
                  </div>
                </div>

                {/* Weight-Based Pricing */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      checked={settings.weightBasedPricing.enabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        weightBasedPricing: { ...prev.weightBasedPricing, enabled: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <h4 className="font-medium text-gray-900">Weight-Based Pricing</h4>
                  </div>
                  {settings.weightBasedPricing.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Base Weight (kg)
                        </label>
                        <input
                          type="number"
                          value={settings.weightBasedPricing.baseWeight}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            weightBasedPricing: { ...prev.weightBasedPricing, baseWeight: parseFloat(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Additional Weight Fee (per 0.5kg)
                        </label>
                        <input
                          type="number"
                          value={settings.weightBasedPricing.additionalWeightFee}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            weightBasedPricing: { ...prev.weightBasedPricing, additionalWeightFee: parseFloat(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="0.01"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Delivery Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tax & Service Charges */}
            {activeTab === 'tax' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Tax & Service Charges</h3>
                
                {/* VAT Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      checked={settings.taxSettings.vatEnabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        taxSettings: { ...prev.taxSettings, vatEnabled: e.target.checked }
                      }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <h4 className="font-medium text-gray-900">VAT (Value Added Tax)</h4>
                  </div>
                  {settings.taxSettings.vatEnabled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          VAT Rate (%)
                        </label>
                        <input
                          type="number"
                          value={settings.taxSettings.vatRate}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            taxSettings: { ...prev.taxSettings, vatRate: parseFloat(e.target.value) }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Currency
                        </label>
                        <select
                          value={settings.currency}
                          onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="AED">AED - Dirham</option>
                          <option value="USD">USD - Dollar</option>
                          <option value="EUR">EUR - Euro</option>
                          <option value="SAR">SAR - Riyal</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Service Charges */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Service Charges</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Service Charge
                      </label>
                      <input
                        type="number"
                        value={settings.taxSettings.serviceCharge}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          taxSettings: { ...prev.taxSettings, serviceCharge: parseFloat(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Charge Type
                      </label>
                      <select
                        value={settings.taxSettings.serviceChargeType}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          taxSettings: { ...prev.taxSettings, serviceChargeType: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Taxes */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Additional Taxes</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.taxSettings.municipalityTaxEnabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            taxSettings: { ...prev.taxSettings, municipalityTaxEnabled: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Municipality Tax</span>
                      </div>
                      {settings.taxSettings.municipalityTaxEnabled && (
                        <input
                          type="number"
                          value={settings.taxSettings.municipalityTax}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            taxSettings: { ...prev.taxSettings, municipalityTax: parseFloat(e.target.value) }
                          }))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="0.1"
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.taxSettings.tourismTaxEnabled}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            taxSettings: { ...prev.taxSettings, tourismTaxEnabled: e.target.checked }
                          }))}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Tourism Tax</span>
                      </div>
                      {settings.taxSettings.tourismTaxEnabled && (
                        <input
                          type="number"
                          value={settings.taxSettings.touismTax}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            taxSettings: { ...prev.taxSettings, touismTax: parseFloat(e.target.value) }
                          }))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          step="0.1"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Tax Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Theme Settings */}
            {activeTab === 'theme' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Theme Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Choose Theme
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['light', 'dark', 'system'].map((themeOption) => (
                        <button
                          key={themeOption}
                          onClick={() => handleThemeChange(themeOption)}
                          className={`p-4 border-2 rounded-lg text-center transition-colors ${
                            settings.selectedTheme === themeOption
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="capitalize font-medium">{themeOption}</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {themeOption === 'light' && 'Light theme'}
                            {themeOption === 'dark' && 'Dark theme'}
                            {themeOption === 'system' && 'Follow system'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Content Management */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Notification Content Management</h3>
                
                {/* Template Selection */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Template Editor</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Notification Type
                      </label>
                      <select
                        value={selectedNotificationType}
                        onChange={(e) => setSelectedNotificationType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="email">Email</option>
                        <option value="sms">SMS</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Template
                      </label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="orderConfirmation">Order Confirmation</option>
                        <option value="orderShipped">Order Shipped</option>
                        <option value="orderDelivered">Order Delivered</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Template Content */}
                  {selectedNotificationType === 'email' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          value={settings.notificationTemplates.email[selectedTemplate]?.subject || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notificationTemplates: {
                              ...prev.notificationTemplates,
                              email: {
                                ...prev.notificationTemplates.email,
                                [selectedTemplate]: {
                                  ...prev.notificationTemplates.email[selectedTemplate],
                                  subject: e.target.value
                                }
                              }
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email Body
                        </label>
                        <textarea
                          rows={6}
                          value={settings.notificationTemplates.email[selectedTemplate]?.body || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            notificationTemplates: {
                              ...prev.notificationTemplates,
                              email: {
                                ...prev.notificationTemplates.email,
                                [selectedTemplate]: {
                                  ...prev.notificationTemplates.email[selectedTemplate],
                                  body: e.target.value
                                }
                              }
                            }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedNotificationType === 'sms' && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        SMS Message
                      </label>
                      <textarea
                        rows={3}
                        value={settings.notificationTemplates.sms[selectedTemplate] || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notificationTemplates: {
                            ...prev.notificationTemplates,
                            sms: {
                              ...prev.notificationTemplates.sms,
                              [selectedTemplate]: e.target.value
                            }
                          }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="SMS message content"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Character count: {(settings.notificationTemplates.sms[selectedTemplate] || '').length}/160
                      </p>
                    </div>
                  )}
                  
                  {/* Available Variables */}
                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <h5 className="text-sm font-medium text-blue-900 mb-2">Available Variables:</h5>
                    <div className="flex flex-wrap gap-2">
                      {['{customer_name}', '{order_number}', '{tracking_number}', '{amount}', '{date}'].map(variable => (
                        <span key={variable} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {variable}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Notification Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Enable Email Notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, smsNotifications: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Enable SMS Notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={(e) => setSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Enable Push Notifications</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.orderAlerts}
                        onChange={(e) => setSettings(prev => ({ ...prev, orderAlerts: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Enable Order Alerts</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Notifications</span>
                  </button>
                </div>
              </div>
            )}

            {/* API Keys & Webhooks */}
            {activeTab === 'api' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">API Keys & Webhooks</h3>
                
                {/* API Keys Management */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">API Keys</h4>
                    <button
                      onClick={addApiKey}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Generate Key</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {settings.apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <input
                                type="text"
                                value={apiKey.name}
                                onChange={(e) => setSettings(prev => ({
                                  ...prev,
                                  apiKeys: prev.apiKeys.map(key => 
                                    key.id === apiKey.id ? { ...key, name: e.target.value } : key
                                  )
                                }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="API Key Name"
                              />
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                apiKey.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {apiKey.status}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                                {apiKey.key}
                              </code>
                              <button
                                onClick={() => copyToClipboard(apiKey.key)}
                                className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Last used: {apiKey.lastUsed}</p>
                          </div>
                          <button
                            onClick={() => removeApiKey(apiKey.id)}
                            className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg ml-3"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Webhook Management */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Webhooks</h4>
                    <button
                      onClick={addWebhook}
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Webhook</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {settings.webhooks.map((webhook) => (
                      <div key={webhook.id} className="bg-white p-3 rounded-lg border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                          <div>
                            <input
                              type="text"
                              value={webhook.name}
                              onChange={(e) => updateWebhook(webhook.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Webhook name"
                            />
                          </div>
                          <div>
                            <input
                              type="url"
                              value={webhook.url}
                              onChange={(e) => updateWebhook(webhook.id, 'url', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="https://api.example.com/webhook"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <select
                              value={webhook.status}
                              onChange={(e) => updateWebhook(webhook.id, 'status', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                            <button
                              onClick={() => testWebhook(webhook.url)}
                              className="px-2 py-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Test webhook"
                            >
                              <TestTube className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeWebhook(webhook.id)}
                              className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 mb-1">Events:</p>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save API Settings</span>
                  </button>
                </div>
              </div>
            )}

            {/* Branding & Logo */}
            {activeTab === 'branding' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Branding & Logo Settings</h3>
                
                {/* Logo Upload */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Logo & Favicon</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Company Logo
                      </label>
                      <div className="flex items-center space-x-4">
                        {settings.branding.logo && (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <img 
                              src={settings.branding.logo} 
                              alt="Logo preview" 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e, 'logo')}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload Logo</span>
                          </button>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Favicon
                      </label>
                      <div className="flex items-center space-x-4">
                        {settings.branding.favicon && (
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                            <img 
                              src={settings.branding.favicon} 
                              alt="Favicon preview" 
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <button
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = (e) => handleFileUpload(e, 'favicon')
                              input.click()
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload Favicon</span>
                          </button>
                          <p className="text-xs text-gray-500 mt-1">ICO, PNG 16x16 or 32x32</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brand Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Brand Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        value={settings.branding.brandName}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          branding: { ...prev.branding, brandName: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Tagline
                      </label>
                      <input
                        type="text"
                        value={settings.branding.tagline}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          branding: { ...prev.branding, tagline: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Footer Text
                      </label>
                      <textarea
                        rows={2}
                        value={settings.branding.footer}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          branding: { ...prev.branding, footer: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Color Scheme</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.branding.primaryColor}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            branding: { ...prev.branding, primaryColor: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={settings.branding.primaryColor}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            branding: { ...prev.branding, primaryColor: e.target.value }
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={settings.branding.secondaryColor}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            branding: { ...prev.branding, secondaryColor: e.target.value }
                          }))}
                          className="w-12 h-10 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={settings.branding.secondaryColor}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            branding: { ...prev.branding, secondaryColor: e.target.value }
                          }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Branding</span>
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                
                {/* Authentication Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-4">Authentication & Access</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                        <p className="text-xs text-gray-500">Require 2FA for admin access</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.twoFactorAuth}
                        onChange={(e) => setSettings(prev => ({ ...prev, twoFactorAuth: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.sessionTimeout}
                          onChange={(e) => setSettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="5"
                          max="1440"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          value={settings.passwordExpiry}
                          onChange={(e) => setSettings(prev => ({ ...prev, passwordExpiry: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="30"
                          max="365"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={settings.loginAttempts}
                          onChange={(e) => setSettings(prev => ({ ...prev, loginAttempts: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="3"
                          max="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Security</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPageClean
