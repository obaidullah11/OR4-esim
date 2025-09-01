// API Configuration
export const API_CONFIG = {
  // Base URL for all API endpoints
  BASE_URL: 'http://127.0.0.1:8000',
  
  // API version (if needed)
  API_VERSION: 'v1',
  
  // Timeout for API requests (in milliseconds)
  TIMEOUT: 30000,
  
  // Headers that will be sent with every request
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'api/v1/auth/login/',
    SIGNUP: 'api/v1/auth/signup/',
    LOGOUT: 'api/v1/auth/logout/',
    REFRESH: 'api/v1/auth/refresh/',
    VERIFY: 'api/v1/auth/verify/',
    PASSWORD_RESET_REQUEST: 'api/v1/auth/password-reset-request/',
    OTP_VERIFY: 'api/v1/auth/otp-verify/',
    RESEND_OTP: 'api/v1/auth/resend-otp/',
    PASSWORD_RESET_CONFIRM: 'api/v1/auth/password-reset-confirm/',
    PASSWORD_CHANGE: 'api/v1/auth/password-change/',
    PROFILE: 'api/v1/auth/profile/',
    UPDATE_PROFILE: 'api/v1/auth/update-profile/',
    EDIT_PROFILE: 'api/v1/auth/edit-profile/{email}/',
    VERIFY_EMAIL: 'api/v1/auth/verify-email/',
    GET_CURRENT_USER: 'api/v1/auth/me/',
  },
  USERS: {
    LIST: 'api/v1/accounts/users/',
    DETAIL: 'api/v1/accounts/users/{id}/',
    CREATE: 'api/v1/accounts/users/',
    UPDATE: 'api/v1/accounts/users/{id}/',
    DELETE: 'api/v1/accounts/users/{id}/',
    PROFILE: 'api/v1/accounts/user-profiles/{id}/',
    PROFILE_UPDATE: 'api/v1/accounts/user-profiles/{id}/',
  },
  RESELLERS: {
    LIST: 'api/v1/resellers/resellers/',
    DETAIL: 'api/v1/resellers/resellers/{id}/',
    CREATE: 'api/v1/resellers/resellers/',
    UPDATE: 'api/v1/resellers/resellers/{id}/',
    DELETE: 'api/v1/resellers/resellers/{id}/',
    MY_PROFILE: 'api/v1/resellers/resellers/my_profile/',
    STATISTICS: 'api/v1/resellers/resellers/statistics/',
    SUSPEND: 'api/v1/resellers/resellers/{id}/suspend_reseller/',
    ACTIVATE: 'api/v1/resellers/resellers/{id}/activate_reseller/',
    CHANGE_STATUS: 'api/v1/resellers/resellers/{id}/change_status/',
    AVAILABLE_USERS: 'api/v1/resellers/resellers/available_users/',
    ACTIVATION_REQUESTS: 'api/v1/resellers/reseller-activation-requests/',
  },
  ORDERS: {
    LIST: 'api/v1/orders/orders/',
    DETAIL: 'api/v1/orders/orders/{id}/',
    CREATE: 'api/v1/orders/orders/',
    UPDATE: 'api/v1/orders/orders/{id}/',
    DELETE: 'api/v1/orders/orders/{id}/',
    EXPORT: 'api/v1/orders/orders/export_pdf/',
    NOTIFICATIONS: 'api/v1/orders/order-notifications/',
  },
  PAYMENTS: {
    LIST: 'api/v1/payments/payments/',
    DETAIL: 'api/v1/payments/payments/{id}/',
    CREATE: 'api/v1/payments/payments/',
    UPDATE: 'api/v1/payments/payments/{id}/',
    DELETE: 'api/v1/payments/payments/{id}/',
    GENERATE_INVOICE: 'api/v1/payments/payments/{id}/generate_invoice/',
    EXPORT: 'api/v1/payments/payments/export_pdf/',
  },
  REPORTS: {
    DASHBOARD: 'api/v1/reports/dashboard/',
    DASHBOARD_TEST: 'api/v1/reports/dashboard/test/',
    ANALYTICS: 'api/v1/reports/reports/analytics_report/',
    EXPORT: 'api/v1/reports/reports/export/',

    // Updated export endpoints to match working backend
    EXPORT_OVERVIEW_PDF: 'api/v1/reports/reports/export_overview_pdf/',
    EXPORT_REVENUE_PDF: 'api/v1/reports/reports/export_revenue_pdf/',
    EXPORT_USERS_PDF: 'api/v1/reports/reports/export_users_pdf/',
    EXPORT_PACKAGES_PDF: 'api/v1/reports/reports/export_packages_pdf/',
    EXPORT_NETWORKS_PDF: 'api/v1/reports/reports/export_networks_pdf/',
    EXPORT_TRANSACTIONS_PDF: 'api/v1/reports/reports/export_transactions_pdf/',
    EXPORT_FINANCIAL: 'api/v1/reports/reports/export_financial/',
    
    // Data endpoints
    FINANCIAL_REPORT: 'api/v1/reports/reports/financial_report/',
    USER_REPORT: 'api/v1/reports/reports/user_report/',
    REVENUE_REPORT: 'api/v1/reports/reports/revenue_report/',
    USER_GROWTH_REPORT: 'api/v1/reports/reports/user_growth_report/',
    SALES_REPORT: 'api/v1/reports/reports/sales_report/',
    SYSTEM_PERFORMANCE: 'api/v1/reports/performance-metrics/system_performance/',
    SALES: 'api/v1/reports/sales/',
    USERS: 'api/v1/reports/users/',
    RESELLERS: 'api/v1/reports/resellers/',
  },
  DASHBOARD: {
    MAIN: 'api/v1/reports/dashboard/',
    TEST: 'api/v1/reports/dashboard/test/',
  },
  CLIENTS: {
    LIST: 'api/v1/clients/',
    DETAIL: 'api/v1/clients/{id}/',
    CREATE: 'api/v1/clients/',
    UPDATE: 'api/v1/clients/{id}/',
    DELETE: 'api/v1/clients/{id}/',
    MY_CLIENTS: 'api/v1/clients/my_clients/',
    RESELLER_CLIENTS: 'api/v1/clients/reseller-clients/',
    EXPORT_CLIENTS: 'api/v1/clients/reseller-clients/export_clients/',
    EXPORT_CLIENTS_PDF: 'api/v1/clients/reseller-clients/export_pdf/',
    SUPPORT_TICKETS: 'api/v1/clients/support-tickets/',
  },
  ESIM: {
    LIST: 'api/v1/esim/esims/',
    DETAIL: 'api/v1/esim/esims/{id}/',
    CREATE: 'api/v1/esim/esims/',
    UPDATE: 'api/v1/esim/esims/{id}/',
    DELETE: 'api/v1/esim/esims/{id}/',
    ACTIVATE: 'api/v1/esim/esims/{id}/activate_esim/',
    DEACTIVATE: 'api/v1/esim/esims/{id}/deactivate_esim/',
    PLANS: 'api/v1/esim/esim-plans/',
    PLAN_DETAIL: 'api/v1/esim/esim-plans/{id}/',
    AVAILABLE_PLANS: 'api/v1/esim/esim-plans/available_plans/',
    USAGE: 'api/v1/esim/esim-usage/',
    USAGE_DETAIL: 'api/v1/esim/esim-usage/{id}/',
    DELIVERIES: 'api/v1/esim/esim-deliveries/',
    WEBHOOKS: 'api/v1/esim/traveroam-webhooks/',
  },
  ESIM_RESELLER: {
    CLIENTS: 'api/v1/esim/reseller/clients/',
    CLIENT_DETAIL: 'api/v1/esim/reseller/clients/{id}/',
    ESIMS: 'api/v1/esim/reseller/esims/',
    ESIM_DETAIL: 'api/v1/esim/reseller/esims/{id}/',
    PLANS: 'api/v1/esim/reseller/plans/',
    DASHBOARD: 'api/v1/esim/reseller/dashboard/',
  },
  TRAVEROAM: {
    PLANS: 'api/v1/traveroam/plans/',
    NETWORKS: 'api/v1/traveroam/networks/',
    ESIM_ASSIGN: 'api/v1/traveroam/esim/assign/',
    ESIM_STATUS: 'api/v1/traveroam/esim/{esim_id}/status/',
    ESIM_USAGE: 'api/v1/traveroam/esim/{esim_id}/usage/',
    ORDER_PROCESS: 'api/v1/traveroam/orders/process/',
    CLIENT_VALIDATE: 'api/v1/traveroam/client/validate/',
    ANALYTICS: 'api/v1/traveroam/analytics/',
    BULK_OPERATIONS: 'api/v1/traveroam/bulk/',
  },
  UTILS: {
    DETECT_COUNTRY: 'api/v1/utils/detect-country/',
    SEND_EMAIL: 'api/v1/esim/reseller/esims/send_email/',
    ASSIGN_ESIM_TO_CLIENT: 'api/v1/esim/reseller/clients/{id}/assign_esim/',
  }
}

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  // Remove leading slash if endpoint has one
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  // If endpoint already includes the full URL, return as is
  if (endpoint.startsWith('http')) {
    return endpoint
  }
  
  return `${API_CONFIG.BASE_URL}/${cleanEndpoint}`
}

// Helper function to get API versioned URL
export const getVersionedApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.API_VERSION}/${cleanEndpoint}`
}

// Export individual constants for direct use
export const BASE_URL = API_CONFIG.BASE_URL
export const API_TIMEOUT = API_CONFIG.TIMEOUT
export const DEFAULT_HEADERS = API_CONFIG.DEFAULT_HEADERS

// Export commonly used endpoints
export const LOGIN_URL = buildApiUrl(API_ENDPOINTS.AUTH.LOGIN)
export const SIGNUP_URL = buildApiUrl(API_ENDPOINTS.AUTH.SIGNUP)
export const LOGOUT_URL = buildApiUrl(API_ENDPOINTS.AUTH.LOGOUT)
export const REFRESH_URL = buildApiUrl(API_ENDPOINTS.AUTH.REFRESH)
export const VERIFY_URL = buildApiUrl(API_ENDPOINTS.AUTH.VERIFY)
export const PASSWORD_RESET_REQUEST_URL = buildApiUrl(API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST)
export const PASSWORD_RESET_CONFIRM_URL = buildApiUrl(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM)
export const GET_CURRENT_USER_URL = buildApiUrl(API_ENDPOINTS.AUTH.GET_CURRENT_USER)
export const USERS_URL = buildApiUrl(API_ENDPOINTS.USERS.LIST)
export const RESELLERS_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.LIST)
export const RESELLER_DETAIL_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.DETAIL)
export const RESELLER_CREATE_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.CREATE)
export const RESELLER_UPDATE_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.UPDATE)
export const RESELLER_DELETE_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.DELETE)
export const RESELLER_MY_PROFILE_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.MY_PROFILE)
export const RESELLER_STATISTICS_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.STATISTICS)
export const RESELLER_SUSPEND_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.SUSPEND)
export const RESELLER_ACTIVATE_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.ACTIVATE)
export const RESELLER_CHANGE_STATUS_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.CHANGE_STATUS)
export const RESELLER_AVAILABLE_USERS_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.AVAILABLE_USERS)
export const RESELLER_ACTIVATION_REQUESTS_URL = buildApiUrl(API_ENDPOINTS.RESELLERS.ACTIVATION_REQUESTS)
export const DASHBOARD_REPORTS_URL = buildApiUrl(API_ENDPOINTS.REPORTS.DASHBOARD)
export const DASHBOARD_TEST_URL = buildApiUrl(API_ENDPOINTS.REPORTS.DASHBOARD_TEST)
export const DASHBOARD_MAIN_URL = buildApiUrl(API_ENDPOINTS.DASHBOARD.MAIN)
export const DASHBOARD_TEST_URL_ALT = buildApiUrl(API_ENDPOINTS.DASHBOARD.TEST)

// Client Management URLs
export const CLIENTS_URL = buildApiUrl(API_ENDPOINTS.CLIENTS.LIST)
export const CLIENT_DETAIL_URL = buildApiUrl(API_ENDPOINTS.CLIENTS.DETAIL)
export const CLIENT_CREATE_URL = buildApiUrl(API_ENDPOINTS.CLIENTS.CREATE)
export const CLIENT_UPDATE_URL = buildApiUrl(API_ENDPOINTS.CLIENTS.UPDATE)
export const CLIENT_DELETE_URL = buildApiUrl(API_ENDPOINTS.CLIENTS.DELETE)
export const MY_CLIENTS_URL = buildApiUrl(API_ENDPOINTS.CLIENTS.MY_CLIENTS)
export const RESELLER_CLIENTS_URL = buildApiUrl(API_ENDPOINTS.CLIENTS.RESELLER_CLIENTS)
export const EXPORT_CLIENTS_URL = buildApiUrl(API_ENDPOINTS.CLIENTS.EXPORT_CLIENTS)

// eSIM Management URLs
export const ESIMS_URL = buildApiUrl(API_ENDPOINTS.ESIM.LIST)
export const ESIM_DETAIL_URL = buildApiUrl(API_ENDPOINTS.ESIM.DETAIL)
export const ESIM_CREATE_URL = buildApiUrl(API_ENDPOINTS.ESIM.CREATE)
export const ESIM_ACTIVATE_URL = buildApiUrl(API_ENDPOINTS.ESIM.ACTIVATE)
export const ESIM_DEACTIVATE_URL = buildApiUrl(API_ENDPOINTS.ESIM.DEACTIVATE)
export const ESIM_PLANS_URL = buildApiUrl(API_ENDPOINTS.ESIM.PLANS)
export const ESIM_AVAILABLE_PLANS_URL = buildApiUrl(API_ENDPOINTS.ESIM.AVAILABLE_PLANS)
export const ESIM_USAGE_URL = buildApiUrl(API_ENDPOINTS.ESIM.USAGE)

// eSIM Reseller URLs
export const ESIM_RESELLER_CLIENTS_URL = buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.CLIENTS)
export const ESIM_RESELLER_ESIMS_URL = buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.ESIMS)
export const ESIM_RESELLER_PLANS_URL = buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.PLANS)
export const ESIM_RESELLER_DASHBOARD_URL = buildApiUrl(API_ENDPOINTS.ESIM_RESELLER.DASHBOARD)

// TraveRoam URLs
export const TRAVEROAM_PLANS_URL = buildApiUrl(API_ENDPOINTS.TRAVEROAM.PLANS)
export const TRAVEROAM_NETWORKS_URL = buildApiUrl(API_ENDPOINTS.TRAVEROAM.NETWORKS)
export const TRAVEROAM_ESIM_ASSIGN_URL = buildApiUrl(API_ENDPOINTS.TRAVEROAM.ESIM_ASSIGN)
export const TRAVEROAM_ORDER_PROCESS_URL = buildApiUrl(API_ENDPOINTS.TRAVEROAM.ORDER_PROCESS)
export const TRAVEROAM_CLIENT_VALIDATE_URL = buildApiUrl(API_ENDPOINTS.TRAVEROAM.CLIENT_VALIDATE)
