/**
 * Error handling utilities for improved user experience
 * 
 * This module provides consistent error message extraction and formatting
 * to ensure users see meaningful error messages instead of generic ones.
 */

/**
 * Extract user-friendly error message from API error response
 * 
 * @param {Error|Object|string} error - The error object or message
 * @returns {string} User-friendly error message
 */
export function extractErrorMessage(error) {
  if (!error) return 'An unknown error occurred'
  
  // If it's already a string, return it
  if (typeof error === 'string') return error
  
  // If it has a message property, check if we should prefer error details
  if (error.message && error.details) {
    // Try to extract specific error messages from details first
    const detailMessages = extractErrorDetails(error.details)
    if (detailMessages.length > 0) {
      return detailMessages.join('. ')
    }
    // Fall back to the general message
    return error.message
  }
  
  // If it only has a message property, return it
  if (error.message) return error.message
  
  // If it's an error object with details, extract the first meaningful message
  if (error.details && typeof error.details === 'object') {
    const detailMessages = extractErrorDetails(error.details)
    if (detailMessages.length > 0) {
      return detailMessages.join('. ')
    }
  }
  
  return 'An error occurred'
}

/**
 * Extract detailed error messages from error details object
 * 
 * @param {Object} details - Error details object from API response
 * @returns {string[]} Array of error messages
 */
export function extractErrorDetails(details) {
  if (!details || typeof details !== 'object') return []
  
  const errorMessages = []
  
  for (const [field, messages] of Object.entries(details)) {
    if (Array.isArray(messages)) {
      // Handle array format: {"email": ["User with this email already exists"]}
      errorMessages.push(...messages.filter(msg => typeof msg === 'string'))
    } else if (typeof messages === 'string') {
      // Handle string format: {"email": "User with this email already exists"}
      errorMessages.push(messages)
    } else if (typeof messages === 'object' && messages !== null) {
      // Handle nested errors recursively
      const nestedMessages = extractErrorDetails(messages)
      errorMessages.push(...nestedMessages)
    }
  }
  
  return errorMessages
}

/**
 * Format error response for service methods
 * 
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default error message to use if extraction fails
 * @returns {Object} Formatted error response
 */
export function formatErrorResponse(error, defaultMessage = 'Operation failed') {
  const errorMessage = extractErrorMessage(error) || defaultMessage
  
  return {
    success: false,
    error: errorMessage,
    details: error?.details || null,
    statusCode: error?.statusCode || null
  }
}

/**
 * Handle field-specific validation errors for forms
 * 
 * @param {Object} errorDetails - Error details object from API response
 * @returns {Object} Field errors object suitable for form libraries
 */
export function extractFieldErrors(errorDetails) {
  if (!errorDetails || typeof errorDetails !== 'object') return {}
  
  const fieldErrors = {}
  
  for (const [field, messages] of Object.entries(errorDetails)) {
    if (Array.isArray(messages)) {
      fieldErrors[field] = messages[0] // Take first error message for the field
    } else if (typeof messages === 'string') {
      fieldErrors[field] = messages
    }
  }
  
  return fieldErrors
}

/**
 * Check if an error is a validation error (400 status)
 * 
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a validation error
 */
export function isValidationError(error) {
  return error?.statusCode === 400 || 
         (error?.message && error.message.includes('validation')) ||
         (error?.details && typeof error.details === 'object')
}

/**
 * Check if an error is a network/connectivity error
 * 
 * @param {Error} error - The error object
 * @returns {boolean} True if it's a network error
 */
export function isNetworkError(error) {
  return error?.name === 'TypeError' && error.message.includes('fetch') ||
         error?.name === 'AbortError' ||
         error?.message?.includes('Network error') ||
         error?.message?.includes('timeout')
}

/**
 * Get user-friendly error category for better UX
 * 
 * @param {Error} error - The error object
 * @returns {string} Error category
 */
export function getErrorCategory(error) {
  if (isNetworkError(error)) return 'network'
  if (isValidationError(error)) return 'validation'
  if (error?.statusCode === 401) return 'authentication'
  if (error?.statusCode === 403) return 'authorization'
  if (error?.statusCode === 404) return 'not_found'
  if (error?.statusCode >= 500) return 'server'
  return 'unknown'
}

/**
 * Get appropriate toast message based on error category
 * 
 * @param {Error} error - The error object
 * @returns {Object} Toast configuration
 */
export function getErrorToastConfig(error) {
  const category = getErrorCategory(error)
  const message = extractErrorMessage(error)
  
  const configs = {
    network: {
      title: 'Connection Problem',
      message: 'Please check your internet connection and try again.',
      duration: 5000
    },
    validation: {
      title: 'Invalid Input',
      message: message,
      duration: 6000
    },
    authentication: {
      title: 'Authentication Required',
      message: 'Please log in again to continue.',
      duration: 4000
    },
    authorization: {
      title: 'Access Denied',
      message: 'You do not have permission to perform this action.',
      duration: 4000
    },
    not_found: {
      title: 'Not Found',
      message: 'The requested resource was not found.',
      duration: 4000
    },
    server: {
      title: 'Server Error',
      message: 'An unexpected server error occurred. Please try again later.',
      duration: 5000
    },
    unknown: {
      title: 'Error',
      message: message,
      duration: 4000
    }
  }
  
  return configs[category] || configs.unknown
}

export default {
  extractErrorMessage,
  extractErrorDetails,
  formatErrorResponse,
  extractFieldErrors,
  isValidationError,
  isNetworkError,
  getErrorCategory,
  getErrorToastConfig
}
