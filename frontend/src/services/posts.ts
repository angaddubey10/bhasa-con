import { apiClient } from './api'
import { Post, CreatePostData, UpdatePostData, PaginatedResponse, SearchFilters, SearchResult } from '../types'
import { API_ENDPOINTS, PostType, PostStatus } from '../constants'

// Backend post response format
interface BackendPostResponse {
  id: string
  user: {
    id: string
    first_name: string
    last_name: string
    profile_picture?: string
    bio: string
    place?: string
    state?: string
    is_following: boolean
  }
  content: string
  language: string
  image_url?: string
  like_count: number
  is_liked: boolean
  created_at: string
}

// Transform backend post response to frontend Post type
const transformBackendPost = (backendPost: BackendPostResponse): Post => {
  return {
    id: backendPost.id,
    authorId: backendPost.user.id,
    author: {
      id: backendPost.user.id,
      email: '', // Not provided by backend in post responses
      first_name: backendPost.user.first_name,
      last_name: backendPost.user.last_name,
      profile_picture: backendPost.user.profile_picture,
      bio: backendPost.user.bio,
      languages: [], // Not provided by backend in post responses
      place: backendPost.user.place,
      district: '', // Not provided by backend
      state: backendPost.user.state,
      email_notifications: true, // Default value
      created_at: '' // Not provided by backend in post responses
    },
    content: backendPost.content,
    type: PostType.TEXT, // Default type, backend doesn't specify
    status: PostStatus.PUBLISHED, // Default status
    mediaUrl: backendPost.image_url,
    mediaType: backendPost.image_url ? 'image/jpeg' : undefined,
    linkUrl: undefined, // Backend doesn't provide these yet
    linkTitle: undefined,
    linkDescription: undefined,
    likesCount: backendPost.like_count,
    commentsCount: 0, // Backend doesn't provide this yet
    sharesCount: 0, // Backend doesn't provide this yet
    isLiked: backendPost.is_liked,
    isBookmarked: false, // Backend doesn't provide this yet
    tags: [], // Backend doesn't provide tags yet
    createdAt: backendPost.created_at,
    updatedAt: backendPost.created_at // Use created_at as default
  }
}

export class PostsService {
  async getPosts(page: number = 1, limit: number = 20): Promise<any> {
    const response = await apiClient.get<any>(
      `${API_ENDPOINTS.POSTS.LIST}?page=${page}&limit=${limit}`
    )
    
    // Transform backend response to frontend format
    if (response.data?.data?.items) {
      const transformedItems = response.data.data.items.map(transformBackendPost)
      return {
        ...response.data,
        data: {
          ...response.data.data,
          items: transformedItems
        }
      }
    }
    
    return response.data
  }

  async getPost(id: string): Promise<Post> {
    const response = await apiClient.get<Post>(`${API_ENDPOINTS.POSTS.LIST}/${id}`)
    return response.data
  }

  async getUserPosts(userId: string, page: number = 1, limit: number = 20): Promise<any> {
    const response = await apiClient.get<any>(
      `${API_ENDPOINTS.POSTS.LIST}?author=${userId}&page=${page}&limit=${limit}`
    )
    
    // Transform backend response to frontend format
    if (response.data?.data?.items) {
      const transformedItems = response.data.data.items.map(transformBackendPost)
      return {
        ...response.data,
        data: {
          ...response.data.data,
          items: transformedItems
        }
      }
    }
    
    return response.data
  }

  async getFeedPosts(page: number = 1, limit: number = 20): Promise<any> {
    const response = await apiClient.get<any>(
      `${API_ENDPOINTS.POSTS.LIST}/feed?page=${page}&limit=${limit}`
    )
    
    // Transform backend response to frontend format
    if (response.data?.data?.items) {
      const transformedItems = response.data.data.items.map(transformBackendPost)
      return {
        ...response.data,
        data: {
          ...response.data.data,
          items: transformedItems
        }
      }
    }
    
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
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.')
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum 5MB allowed.')
    }

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      endpoint: API_ENDPOINTS.POSTS.UPLOAD_IMAGE,
      formattedSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`
    })

    try {
      const response = await apiClient.uploadFile<{ success: boolean; data: { image_url: string } }>(
        API_ENDPOINTS.POSTS.UPLOAD_IMAGE,
        file
      )
      
      console.log('Upload response:', response)
      
      if (response.data.success && response.data.data?.image_url) {
        return {
          url: response.data.data.image_url,
          type: file.type
        }
      } else {
        console.error('Invalid response format:', response)
        throw new Error('Upload failed - invalid response format')
      }
    } catch (error: any) {
      console.error('Upload error details:', {
        error,
        message: error.message,
        code: error.code,
        response: error.response
      })
      
      // Handle different error types
      if (error.code === '422') {
        throw new Error('Request validation failed. Please check the file format and ensure it\'s a valid image.')
      } else if (error.code === '400') {
        throw new Error(error.message || 'Invalid file. Please check file type and size.')
      } else if (error.code === '503') {
        throw new Error('Image upload service is currently unavailable. Please try again later.')
      } else if (error.code === '500') {
        throw new Error('Server error during upload. Please try again.')
      } else if (error.message) {
        throw new Error(error.message)
      } else {
        throw new Error('Failed to upload image. Please try again.')
      }
    }
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