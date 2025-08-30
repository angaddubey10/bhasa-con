import { ApiResponse } from '../types'
import { formatApiUrl } from '../utils'

export class ApiClient {
  private headers: Record<string, string>

  constructor() {
    this.headers = {
      'Content-Type': 'application/json'
    }
  }

  setAuthToken(token: string): void {
    this.headers['Authorization'] = `Bearer ${token}`
  }

  removeAuthToken(): void {
    delete this.headers['Authorization']
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = formatApiUrl(endpoint)
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        }
      }

      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // Backend returns error in { message: "...", detail?: "..." } format
        throw new ApiError(
          data.message || data.detail || 'An error occurred', 
          response.status.toString()
        )
      }

      // Backend response format is the actual response, not wrapped
      return {
        data: data,
        message: data.message,
        success: data.success || true
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred'
      )
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, typeof value === 'string' ? value : JSON.stringify(value))
      })
    }

    // Create headers object with Authorization but without Content-Type 
    // (browser will set Content-Type with proper boundary for multipart/form-data)
    const uploadHeaders: Record<string, string> = {}
    if (this.headers['Authorization']) {
      uploadHeaders['Authorization'] = this.headers['Authorization']
    }

    try {
      const url = formatApiUrl(endpoint)
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: uploadHeaders
      })

      const data = await response.json()

      if (!response.ok) {
        // Backend returns error in { message: "...", detail?: "..." } format
        throw new ApiError(
          data.message || data.detail || data.error || 'An error occurred', 
          response.status.toString()
        )
      }

      // Backend response format is the actual response, not wrapped
      return {
        data: data,
        message: data.message,
        success: data.success || true
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred'
      )
    }
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public field?: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Create singleton instance
export const apiClient = new ApiClient()