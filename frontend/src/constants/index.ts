// API constants
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/me'
  },
  POSTS: {
    LIST: '/api/posts/',
    CREATE: '/api/posts/',
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    LIKE: (id: string) => `/api/posts/${id}/like`,
    UNLIKE: (id: string) => `/api/posts/${id}/like`
  },
  COMMENTS: {
    LIST: (postId: string) => `/api/posts/${postId}/comments`,
    CREATE: (postId: string) => `/api/posts/${postId}/comments`,
    DELETE: (commentId: string) => `/api/comments/${commentId}`
  },
  USERS: {
    PROFILE: (id: string) => `/api/users/${id}`,
    FOLLOW: (id: string) => `/api/users/${id}/follow`,
    UNFOLLOW: (id: string) => `/api/users/${id}/unfollow`
  }
} as const

// UI constants
export const THEME_COLORS = {
  PRIMARY: '#3B82F6',
  SECONDARY: '#64748B', 
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  INFO: '#0EA5E9'
} as const

// Application constants
export const APP_CONFIG = {
  NAME: 'Bhasa Con',
  VERSION: '1.0.0',
  MAX_POST_LENGTH: 500,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB
  PAGINATION_SIZE: 20,
  DEBOUNCE_DELAY: 300
} as const

// Enums
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator', 
  ADMIN = 'admin'
}

export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  LINK = 'link'
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  MENTION = 'mention'
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// String literal types
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'hi' | 'zh' | 'ja' | 'ko'
export type Theme = 'light' | 'dark' | 'system'
export type SortOrder = 'asc' | 'desc'
export type PostSortBy = 'created_at' | 'updated_at' | 'likes_count' | 'comments_count'