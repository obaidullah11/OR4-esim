import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
// BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
// import { authService } from '../services/authService'
// import { tokenService } from '../services/tokenService'

const AuthContext = createContext()

const initialState = {
  user: null,
  // BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
  // token: tokenService.getAccessToken(),
  token: null,
  isAuthenticated: false,
  isLoading: false, // Changed to false for demo mode
}

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'TOKEN_REFRESHED':
      return {
        ...state,
        token: action.payload,
        isLoading: false,
      }
    case 'TOKEN_EXPIRED':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize authentication on mount
  useEffect(() => {
    // BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
    /*
    const initializeAuth = async () => {
      try {
        const tokenStatus = tokenService.hasValidTokens()

        if (tokenStatus === 'valid') {
          // Tokens are valid, fetch user data
          const user = await authService.getCurrentUser()
          dispatch({ type: 'SET_USER', payload: user })
        } else if (tokenStatus === 'refresh_needed') {
          // Access token expired but refresh token is valid
          try {
            await authService.refreshTokens()
            const user = await authService.getCurrentUser()
            dispatch({ type: 'SET_USER', payload: user })
          } catch (error) {
            console.error('❌ Token refresh failed during init:', error)
            dispatch({ type: 'TOKEN_EXPIRED' })
          }
        } else {
          // No valid tokens
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error)
        dispatch({ type: 'TOKEN_EXPIRED' })
      }
    }

    initializeAuth()
    */

    // Demo mode - no backend calls
    dispatch({ type: 'SET_LOADING', payload: false })
  }, [])

  // Set up automatic token refresh
  useEffect(() => {
    // BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
    /*
    if (!state.isAuthenticated) return

    const checkTokenExpiry = async () => {
      const tokenStatus = tokenService.hasValidTokens()

      if (tokenStatus === 'refresh_needed') {
        try {
          const newToken = await authService.refreshTokens()
          dispatch({ type: 'TOKEN_REFRESHED', payload: newToken })
        } catch (error) {
          console.error('❌ Automatic token refresh failed:', error)
          dispatch({ type: 'TOKEN_EXPIRED' })
        }
      } else if (tokenStatus === 'expired') {
        dispatch({ type: 'TOKEN_EXPIRED' })
      }
    }

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000)

    return () => clearInterval(interval)
    */
  }, [state.isAuthenticated])

  const login = async (credentials) => {
    // BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
    /*
    try {
      const response = await authService.login(credentials)

      // Tokens are already stored by authService.login()
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: response.user, token: response.token }
      })

      return response
    } catch (error) {
      throw error
    }
    */

    // Demo mode - simulate successful login
    try {
      const mockUser = {
        id: 1,
        email: credentials.email,
        first_name: 'Demo',
        last_name: 'User',
        role: 'admin'
      }

      const mockResponse = {
        user: mockUser,
        token: 'demo-token-123'
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: mockUser, token: 'demo-token-123' }
      })

      return mockResponse
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    // BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
    /*
    try {
      await authService.logout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Even if logout fails, clear local state
      dispatch({ type: 'LOGOUT' })
    }
    */

    // Demo mode - simple logout
    dispatch({ type: 'LOGOUT' })
  }

  // Utility functions for token management
  const refreshTokens = useCallback(async () => {
    // BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
    /*
    try {
      const newToken = await authService.refreshTokens()
      dispatch({ type: 'TOKEN_REFRESHED', payload: newToken })
      return newToken
    } catch (error) {
      console.error('❌ Token refresh failed:', error)
      dispatch({ type: 'TOKEN_EXPIRED' })
      throw error
    }
    */

    // Demo mode - return mock token
    return 'demo-refreshed-token'
  }, [])

  const checkTokenValidity = useCallback(() => {
    // BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
    // return authService.checkTokenValidity()

    // Demo mode - always return valid
    return 'valid'
  }, [])

  const getTokenExpiryInfo = useCallback(() => {
    // BACKEND INTEGRATION COMMENTED OUT - Uncomment when backend is ready
    // return authService.getTokenExpiryInfo()

    // Demo mode - return mock info
    return { valid: true, message: 'Demo mode - no real tokens' }
  }, [])

  const value = {
    ...state,
    login,
    logout,
    refreshTokens,
    checkTokenValidity,
    getTokenExpiryInfo,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
