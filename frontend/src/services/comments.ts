import { apiClient } from './api'
import { Comment, CreateCommentData } from '../types'
import { API_ENDPOINTS } from '../constants'

// Backend comment response format
interface BackendCommentResponse {
  id: string
  user: {
    id: string
    first_name: string
    last_name: string
    profile_picture?: string
  }
  content: string
  created_at: string
  can_delete: boolean
}

// Transform backend comment response to frontend Comment type
const transformBackendComment = (backendComment: BackendCommentResponse): Comment => {
  return {
    id: backendComment.id,
    postId: '', // Will be set by the caller
    authorId: backendComment.user.id,
    author: {
      id: backendComment.user.id,
      email: '', // Not provided by backend
      first_name: backendComment.user.first_name,
      last_name: backendComment.user.last_name,
      profile_picture: backendComment.user.profile_picture,
      bio: '', // Not provided by backend
      languages: [], // Not provided by backend
      place: '', // Not provided by backend
      district: '', // Not provided by backend
      state: '', // Not provided by backend
      email_notifications: true, // Default value
      created_at: '' // Not provided by backend
    },
    content: backendComment.content,
    likesCount: 0, // Not implemented yet
    isLiked: false, // Not implemented yet
    createdAt: backendComment.created_at,
    updatedAt: backendComment.created_at
  }
}

export class CommentsService {
  async getComments(postId: string): Promise<Comment[]> {
    console.log('CommentsService: Getting comments for post', postId)
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.COMMENTS.LIST(postId))
      console.log('CommentsService: Comments response', response)
      
      if (response.data?.data?.comments) {
        const comments = response.data.data.comments.map((comment: BackendCommentResponse) => ({
          ...transformBackendComment(comment),
          postId
        }))
        console.log('CommentsService: Transformed comments', comments)
        return comments
      }
      
      console.log('CommentsService: No comments found in response')
      return []
    } catch (error) {
      console.error('CommentsService: Error getting comments', error)
      throw error
    }
  }

  async createComment(postId: string, content: string): Promise<Comment> {
    console.log('CommentsService: Creating comment for post', postId, 'with content:', content)
    try {
      const response = await apiClient.post<any>(
        API_ENDPOINTS.COMMENTS.CREATE(postId),
        { content }
      )
      console.log('CommentsService: Create comment response', response)
      
      if (response.data?.data) {
        const comment = {
          ...transformBackendComment(response.data.data),
          postId
        }
        console.log('CommentsService: Transformed created comment', comment)
        return comment
      }
      
      throw new Error('Failed to create comment')
    } catch (error) {
      console.error('CommentsService: Error creating comment', error)
      throw error
    }
  }

  async deleteComment(commentId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.COMMENTS.DELETE(commentId))
  }
}

// Create singleton instance
export const commentsService = new CommentsService()
