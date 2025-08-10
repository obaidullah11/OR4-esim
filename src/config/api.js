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
    PASSWORD_RESET_CONFIRM: 'api/v1/auth/password-reset-confirm/',
    VERIFY_EMAIL: 'api/v1/auth/verify-email/',
    GET_CURRENT_USER: 'api/v1/auth/me/',
  },
  USERS: {
    LIST: 'api/v1/users/',
    DETAIL: 'api/v1/users/{id}/',
    CREATE: 'api/v1/users/',
    UPDATE: 'api/v1/users/{id}/',
    DELETE: 'api/v1/users/{id}/',
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
  },
  ORDERS: {
    LIST: 'api/v1/orders/',
    DETAIL: 'api/v1/orders/{id}/',
    CREATE: 'api/v1/orders/',
    UPDATE: 'api/v1/orders/{id}/',
    DELETE: 'api/v1/orders/{id}/',
  },
  PAYMENTS: {
    LIST: 'api/v1/payments/',
    DETAIL: 'api/v1/payments/{id}/',
    CREATE: 'api/v1/payments/',
    UPDATE: 'api/v1/payments/{id}/',
  },
  REPORTS: {
    DASHBOARD: 'api/v1/reports/dashboard/',
    DASHBOARD_TEST: 'api/v1/reports/dashboard/test/',
    SALES: 'api/v1/reports/sales/',
    USERS: 'api/v1/reports/users/',
    RESELLERS: 'api/v1/reports/resellers/',
  },
  DASHBOARD: {
    MAIN: 'api/v1/reports/dashboard/',
    TEST: 'api/v1/reports/dashboard/test/',
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
export const DASHBOARD_REPORTS_URL = buildApiUrl(API_ENDPOINTS.REPORTS.DASHBOARD)
export const DASHBOARD_TEST_URL = buildApiUrl(API_ENDPOINTS.REPORTS.DASHBOARD_TEST)
export const DASHBOARD_MAIN_URL = buildApiUrl(API_ENDPOINTS.DASHBOARD.MAIN)
export const DASHBOARD_TEST_URL_ALT = buildApiUrl(API_ENDPOINTS.DASHBOARD.TEST)
