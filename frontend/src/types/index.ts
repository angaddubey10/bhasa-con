import { UserRole, PostType, PostStatus, NotificationType, Language } from '../constants'

// User types
export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  bio?: string
  role: UserRole
  language: Language
  isVerified: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  createdAt: string
  updatedAt: string
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
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  language?: Language
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
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