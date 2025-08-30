import { apiClient } from './api'
import { UserSearchResult, PaginatedUserSearchResponse, UserProfileResponse } from '../types'
import { API_ENDPOINTS } from '../constants'

export class UsersService {
  /**
   * Search for users by query string
   * @param query Search query string  
   * @param page Page number (default: 1)
   * @param limit Items per page (default: 20)
   * @returns Promise with paginated search results
   */
  async searchUsers(
    query: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<PaginatedUserSearchResponse> {
    const searchParams = new URLSearchParams({
      q: query.trim(),
      page: page.toString(),
      limit: limit.toString()
    })

    const response = await apiClient.get<PaginatedUserSearchResponse>(
      `${API_ENDPOINTS.USERS.SEARCH}?${searchParams}`
    )

    if (!response.data) {
      throw new Error('No data received from search')
    }

    return response.data
  }

  /**
   * Follow a user
   * @param userId The ID of the user to follow
   * @returns Promise with success status
   */
  async followUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      API_ENDPOINTS.USERS.FOLLOW(userId)
    )

    if (!response.data) {
      throw new Error('No data received from follow request')
    }

    return response.data
  }

  /**
   * Unfollow a user
   * @param userId The ID of the user to unfollow  
   * @returns Promise with success status
   */
  async unfollowUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      API_ENDPOINTS.USERS.UNFOLLOW(userId)
    )

    if (!response.data) {
      throw new Error('No data received from unfollow request')
    }

    return response.data
  }

  /**
   * Get user profile by ID
   * @param userId The ID of the user
   * @returns Promise with user profile data
   */
  async getUserProfile(userId: string): Promise<UserProfileResponse> {
    const response = await apiClient.get<{ success: boolean; data: UserProfileResponse }>(
      API_ENDPOINTS.USERS.PROFILE(userId)
    )

    if (!response.data || !response.data.success) {
      throw new Error('Failed to get user profile')
    }

    return response.data.data
  }
}

// Export a singleton instance
export const usersService = new UsersService()
export default usersService
