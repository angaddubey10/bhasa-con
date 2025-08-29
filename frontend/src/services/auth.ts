import { apiClient } from './api'
import { LoginData, RegisterData, AuthResponse, LoginResponse, ProfileResponse, RegisterResponse, RefreshTokenResponse, User } from '../types'
import { API_ENDPOINTS } from '../constants'
import { storage } from '../utils'

export class AuthService {
  private readonly TOKEN_KEY = 'authToken'
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'
  private readonly USER_KEY = 'user'

  async login(credentials: LoginData): Promise<AuthResponse> {
    // Step 1: Get access token
    const loginResponse = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )

    if (!loginResponse.data || !loginResponse.data.success) {
      throw new Error(loginResponse.data?.message || 'Login failed')
    }

    const accessToken = loginResponse.data.data.access_token

    // Step 2: Set token and get user profile
    this.setToken(accessToken)
    apiClient.setAuthToken(accessToken)

    // Step 3: Get user profile
    const profileResponse = await apiClient.get<ProfileResponse>(
      API_ENDPOINTS.AUTH.PROFILE
    )

    if (!profileResponse.data || !profileResponse.data.success) {
      this.clearAuth()
      throw new Error('Failed to get user profile')
    }

    const userData = profileResponse.data.data
    const user: User = {
      id: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      profile_picture: userData.profile_picture,
      bio: userData.bio,
      languages: userData.languages,
      place: userData.place,
      district: userData.district,
      state: userData.state,
      email_notifications: userData.email_notifications,
      created_at: userData.created_at
    }

    this.setUser(user)

    return {
      user,
      accessToken,
      // Note: Backend doesn't provide refresh token yet
      refreshToken: undefined,
      expiresIn: undefined
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    // Step 1: Register user
    const registerResponse = await apiClient.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    )

    if (!registerResponse.data || !registerResponse.data.success) {
      throw new Error(registerResponse.data?.message || 'Registration failed')
    }

    // Step 2: Login with the same credentials
    const loginData: LoginData = {
      email: userData.email,
      password: userData.password
    }

    return await this.login(loginData)
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
      const response = await apiClient.get<ProfileResponse>(API_ENDPOINTS.AUTH.PROFILE)
      if (response.data && response.data.success) {
        const userData = response.data.data
        const user: User = {
          id: userData.id,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          profile_picture: userData.profile_picture,
          bio: userData.bio,
          languages: userData.languages,
          place: userData.place,
          district: userData.district,
          state: userData.state,
          email_notifications: userData.email_notifications,
          created_at: userData.created_at
        }
        this.setUser(user)
        return user
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