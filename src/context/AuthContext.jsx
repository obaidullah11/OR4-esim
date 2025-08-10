import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { tokenService } from '../services/tokenService'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: tokenService.getAccessToken(),
  isAuthenticated: false,
  isLoading: true,
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
  }, [])

  // Set up automatic token refresh
  useEffect(() => {
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
  }, [state.isAuthenticated])

  const login = async (credentials) => {
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
  }

  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Even if logout fails, clear local state
      dispatch({ type: 'LOGOUT' })
    }
  }

  // Utility functions for token management
  const refreshTokens = useCallback(async () => {
    try {
      const newToken = await authService.refreshTokens()
      dispatch({ type: 'TOKEN_REFRESHED', payload: newToken })
      return newToken
    } catch (error) {
      console.error('❌ Token refresh failed:', error)
      dispatch({ type: 'TOKEN_EXPIRED' })
      throw error
    }
  }, [])

  const checkTokenValidity = useCallback(() => {
    return authService.checkTokenValidity()
  }, [])

  const getTokenExpiryInfo = useCallback(() => {
    return authService.getTokenExpiryInfo()
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
