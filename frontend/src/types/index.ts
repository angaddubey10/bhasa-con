import { PostType, PostStatus, NotificationType, Language } from '../constants'

// User types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  profile_picture?: string
  bio?: string
  languages: string[]
  place?: string
  district?: string
  state?: string
  email_notifications: boolean
  created_at: string
}

export interface UserProfile extends User {
  isFollowing?: boolean
  isFollowedBy?: boolean
}

// Post types
export interface Post {
  id: string
  authorId: string
  author: User
  content: string
  type: PostType
  status: PostStatus
  mediaUrl?: string
  mediaType?: string
  linkUrl?: string
  linkTitle?: string
  linkDescription?: string
  likesCount: number
  commentsCount: number
  sharesCount: number
  isLiked: boolean
  isBookmarked: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface CreatePostData {
  content: string
  type: PostType
  mediaUrl?: string
  linkUrl?: string
  tags?: string[]
}

export interface UpdatePostData extends Partial<CreatePostData> {
  status?: PostStatus
}

// Comment types
export interface Comment {
  id: string
  postId: string
  authorId: string
  author: User
  content: string
  likesCount: number
  isLiked: boolean
  parentId?: string
  replies?: Comment[]
  createdAt: string
  updatedAt: string
}

export interface CreateCommentData {
  postId: string
  content: string
  parentId?: string
}

// Authentication types
export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
}

// Backend API response for register
export interface RegisterResponse {
  success: boolean
  message: string
  data: {
    user_id: string
    email: string
  }
}

// Backend API response for login
export interface LoginResponse {
  success: boolean
  message: string
  data: {
    access_token: string
    token_type: string
  }
}

// Backend API response for user profile
export interface ProfileResponse {
  success: boolean
  data: {
    id: string
    email: string
    first_name: string
    last_name: string
    profile_picture?: string
    bio?: string
    languages: string[]
    place?: string
    district?: string
    state?: string
    email_notifications: boolean
    created_at: string
  }
}

// Combined auth response for internal use
export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

export interface RefreshTokenResponse {
  accessToken: string
  expiresIn: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  code?: string
  field?: string
  details?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Form types
export interface FormField {
  name: string
  value: string
  error?: string
  touched: boolean
}

export interface FormState {
  [key: string]: FormField
}

// Notification types
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: string
}

// Search types
export interface SearchFilters {
  query?: string
  author?: string
  tags?: string[]
  type?: PostType
  language?: Language
  dateFrom?: string
  dateTo?: string
}

export interface SearchResult<T> {
  items: T[]
  total: number
  query: string
  filters: SearchFilters
}