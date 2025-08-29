import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User, LoginData, RegisterData } from '../types'
import { authService } from '../services/auth'
import { LoadingState } from '../constants'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loadingState: LoadingState
  error: string | null
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginData) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  clearError: () => void
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: LoadingState }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loadingState: LoadingState.IDLE,
  error: null
}

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loadingState: action.payload,
        error: action.payload === LoadingState.LOADING ? null : state.error
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loadingState: LoadingState.SUCCESS,
        error: null
      }
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loadingState: LoadingState.IDLE,
        error: null
      }
    case 'SET_ERROR':
      return {
        ...state,
        loadingState: LoadingState.ERROR,
        error: action.payload
      }
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'SET_LOADING', payload: LoadingState.LOADING })
      
      try {
        authService.initializeAuth()
        const storedUser = authService.getUser()
        
        if (storedUser && authService.isAuthenticated()) {
          // Verify user is still valid
          const currentUser = await authService.getCurrentUser()
          dispatch({ type: 'SET_USER', payload: currentUser || storedUser })
        } else {
          dispatch({ type: 'SET_LOADING', payload: LoadingState.IDLE })
        }
      } catch (error) {
        console.warn('Auth initialization failed:', error)
        dispatch({ type: 'CLEAR_USER' })
      }
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: LoadingState.LOADING })
    
    try {
      const authResponse = await authService.login(credentials)
      dispatch({ type: 'SET_USER', payload: authResponse.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    }
  }

  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: LoadingState.LOADING })
    
    try {
      const authResponse = await authService.register(userData)
      dispatch({ type: 'SET_USER', payload: authResponse.user })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: LoadingState.LOADING })
    
    try {
      await authService.logout()
      dispatch({ type: 'CLEAR_USER' })
    } catch (error) {
      console.warn('Logout failed:', error)
      // Clear user state even if logout API fails
      dispatch({ type: 'CLEAR_USER' })
    }
  }

  const refreshAuth = async (): Promise<void> => {
    try {
      const token = await authService.refreshToken()
      if (token) {
        const currentUser = await authService.getCurrentUser()
        if (currentUser) {
          dispatch({ type: 'SET_USER', payload: currentUser })
        }
      }
    } catch (error) {
      dispatch({ type: 'CLEAR_USER' })
      throw error
    }
  }

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    clearError
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}