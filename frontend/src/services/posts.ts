import { apiClient } from './api'
import { Post, CreatePostData, UpdatePostData, PaginatedResponse, SearchFilters, SearchResult } from '../types'
import { API_ENDPOINTS } from '../constants'

export class PostsService {
  async getPosts(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.POSTS.LIST}?page=${page}&limit=${limit}`
    )
    return response.data
  }

  async getPost(id: string): Promise<Post> {
    const response = await apiClient.get<Post>(`${API_ENDPOINTS.POSTS.LIST}/${id}`)
    return response.data
  }

  async getUserPosts(userId: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.POSTS.LIST}?author=${userId}&page=${page}&limit=${limit}`
    )
    return response.data
  }

  async getFeedPosts(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.POSTS.LIST}/feed?page=${page}&limit=${limit}`
    )
    return response.data
  }

  async searchPosts(filters: SearchFilters, page: number = 1, limit: number = 20): Promise<SearchResult<Post>> {
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            acc[key] = value.join(',')
          } else {
            acc[key] = value.toString()
          }
        }
        return acc
      }, {} as Record<string, string>)
    })

    const response = await apiClient.get<SearchResult<Post>>(
      `${API_ENDPOINTS.POSTS.LIST}/search?${searchParams}`
    )
    return response.data
  }

  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await apiClient.post<Post>(API_ENDPOINTS.POSTS.CREATE, postData)
    return response.data
  }

  async updatePost(id: string, postData: UpdatePostData): Promise<Post> {
    const response = await apiClient.patch<Post>(API_ENDPOINTS.POSTS.UPDATE(id), postData)
    return response.data
  }

  async deletePost(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id))
  }

  async likePost(id: string): Promise<Post> {
    const response = await apiClient.post<Post>(API_ENDPOINTS.POSTS.LIKE(id))
    return response.data
  }

  async unlikePost(id: string): Promise<Post> {
    const response = await apiClient.delete<Post>(API_ENDPOINTS.POSTS.UNLIKE(id))
    return response.data
  }

  async uploadPostMedia(file: File): Promise<{ url: string; type: string }> {
    const response = await apiClient.uploadFile<{ url: string; type: string }>(
      '/upload/post-media',
      file
    )
    return response.data
  }

  // Bookmark functionality
  async bookmarkPost(id: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.POSTS.LIST}/${id}/bookmark`)
  }

  async unbookmarkPost(id: string): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.POSTS.LIST}/${id}/bookmark`)
  }

  async getBookmarkedPosts(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      `${API_ENDPOINTS.POSTS.LIST}/bookmarks?page=${page}&limit=${limit}`
    )
    return response.data
  }

  // Share functionality
  async sharePost(id: string): Promise<Post> {
    const response = await apiClient.post<Post>(`${API_ENDPOINTS.POSTS.LIST}/${id}/share`)
    return response.data
  }

  // Report functionality
  async reportPost(id: string, reason: string): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.POSTS.LIST}/${id}/report`, { reason })
  }
}

// Create singleton instance
export const postsService = new PostsService()