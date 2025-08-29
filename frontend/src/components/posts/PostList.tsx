import React, { useState, useEffect, useCallback } from 'react'
import { Post } from '../../types'
import { postsService } from '../../services/posts'
import { PostCard } from './PostCard'
import { LoadingSpinner } from '../common/LoadingSpinner'

interface PostListProps {
  feedType?: 'all' | 'following'
  userId?: string
  refreshTrigger?: number
}

export const PostList: React.FC<PostListProps> = ({ 
  feedType = 'all', 
  userId, 
  refreshTrigger = 0 
}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadPosts = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setLoading(true)
        setError(null)
      } else {
        setLoadingMore(true)
      }

      let response: any

      if (userId) {
        // Load user's posts
        response = await postsService.getUserPosts(userId, page)
      } else if (feedType === 'following') {
        // Load feed posts (from followed users)
        response = await postsService.getFeedPosts(page)
      } else {
        // Load all posts
        response = await postsService.getPosts(page)
      }

      // Handle backend response format: { success: true, data: { items: Post[], has_next: boolean } }
      const newPosts = response.data?.items || []
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }

      // Check if there are more pages
      const hasNext = response.data?.has_next ?? (newPosts.length === 20)
      setHasMore(hasNext)
      
      if (page === 1) {
        setCurrentPage(1)
      }
    } catch (error: any) {
      console.error('Error loading posts:', error)
      setError(error.response?.data?.message || 'Failed to load posts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [feedType, userId])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    
    const nextPage = currentPage + 1
    await loadPosts(nextPage, true)
    setCurrentPage(nextPage)
  }, [loadPosts, currentPage, loadingMore, hasMore])

  const handleLike = useCallback((postId: string, liked: boolean) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: liked, 
            likesCount: liked ? post.likesCount + 1 : post.likesCount - 1 
          }
        : post
    ))
  }, [])

  const handleDelete = useCallback(async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await postsService.deletePost(postId)
      setPosts(prev => prev.filter(post => post.id !== postId))
    } catch (error: any) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }, [])

  // Refresh posts when refreshTrigger changes
  useEffect(() => {
    loadPosts(1)
  }, [loadPosts, refreshTrigger])

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000
      ) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 text-red-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-red-600">{error}</p>
        </div>
        <button
          onClick={() => loadPosts(1)}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-500">
          {feedType === 'following' 
            ? "Posts from people you follow will appear here"
            : userId 
              ? "This user hasn't posted anything yet"
              : "Be the first to share something!"
          }
        </p>
      </div>
    )
  }

  return (
    <div>
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onDelete={userId ? handleDelete : undefined}
        />
      ))}

      {loadingMore && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          You've reached the end!
        </div>
      )}
    </div>
  )
}
