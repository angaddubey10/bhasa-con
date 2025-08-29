import { apiClient } from './api'
import { LoginData, RegisterData, AuthResponse, RefreshTokenResponse, User } from '../types'
import { API_ENDPOINTS } from '../constants'
import { storage } from '../utils'

export class AuthService {
  private readonly TOKEN_KEY = 'authToken'
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'
  private readonly USER_KEY = 'user'

  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )

    if (response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken)
      this.setUser(response.data.user)
      apiClient.setAuthToken(response.data.accessToken)
    }

    return response.data
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    )

    if (response.data) {
      this.setTokens(response.data.accessToken, response.data.refreshToken)
      this.setUser(response.data.user)
      apiClient.setAuthToken(response.data.accessToken)
    }

    return response.data
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error)
    } finally {
      this.clearAuth()
    }
  }

  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      this.clearAuth()
      return null
    }

    try {
      const response = await apiClient.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      )

      if (response.data) {
        this.setToken(response.data.accessToken)
        apiClient.setAuthToken(response.data.accessToken)
        return response.data.accessToken
      }
    } catch (error) {
      this.clearAuth()
      throw error
    }

    return null
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.PROFILE)
      if (response.data) {
        this.setUser(response.data)
        return response.data
      }
    } catch (error) {
      this.clearAuth()
      throw error
    }

    return null
  }

  // Token management
  getToken(): string | null {
    return storage.get<string>(this.TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return storage.get<string>(this.REFRESH_TOKEN_KEY)
  }

  getUser(): User | null {
    return storage.get<User>(this.USER_KEY)
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  private setToken(token: string): void {
    storage.set(this.TOKEN_KEY, token)
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    storage.set(this.TOKEN_KEY, accessToken)
    storage.set(this.REFRESH_TOKEN_KEY, refreshToken)
  }

  private setUser(user: User): void {
    storage.set(this.USER_KEY, user)
  }

  private clearAuth(): void {
    storage.remove(this.TOKEN_KEY)
    storage.remove(this.REFRESH_TOKEN_KEY)
    storage.remove(this.USER_KEY)
    apiClient.removeAuthToken()
  }

  // Initialize auth state from storage
  initializeAuth(): void {
    const token = this.getToken()
    if (token) {
      apiClient.setAuthToken(token)
    }
  }
}

// Create singleton instance
export const authService = new AuthService()