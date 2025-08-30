import React, { useState } from 'react'
import { Post } from '../../types'
import { postsService } from '../../services/posts'

interface PostCardProps {
  post: Post
  onLike?: (postId: string, liked: boolean) => void
  onDelete?: (postId: string) => void
}

export const PostCard: React.FC<PostCardProps> = ({ post, onLike, onDelete }) => {
  const [isLiking, setIsLiking] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  const handleLike = async () => {
    if (isLiking) return
    
    setIsLiking(true)
    try {
      if (post.isLiked) {
        await postsService.unlikePost(post.id)
        onLike?.(post.id, false)
      } else {
        await postsService.likePost(post.id)
        onLike?.(post.id, true)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Author Info */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
          {post.author.first_name.charAt(0)}{post.author.last_name.charAt(0)}
        </div>
        <div className="ml-3">
          <h3 className="font-semibold text-gray-900">
            {post.author.first_name} {post.author.last_name}
          </h3>
          <p className="text-gray-500 text-sm">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
        
        {/* Media */}
        {post.mediaUrl && (
          <div className="mt-3 relative">
            {post.mediaType?.startsWith('image/') || !post.mediaType ? (
              <div className="relative">
                {imageLoading && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {!imageError ? (
                  <img
                    src={post.mediaUrl}
                    alt="Post image"
                    className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                    onLoad={() => setImageLoading(false)}
                    onError={() => {
                      setImageError(true)
                      setImageLoading(false)
                    }}
                    onClick={() => window.open(post.mediaUrl, '_blank')}
                  />
                ) : (
                  <div className="bg-gray-100 rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <p className="text-gray-500 text-sm">Image failed to load</p>
                  </div>
                )}
              </div>
            ) : (
              <video
                src={post.mediaUrl}
                controls
                className="max-w-full h-auto rounded-lg"
              />
            )}
          </div>
        )}

        {/* Link Preview */}
        {post.linkUrl && (
          <div className="mt-3 border rounded-lg p-3 bg-gray-50">
            <a
              href={post.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:bg-gray-100 rounded p-2 -m-2"
            >
              {post.linkTitle && (
                <h4 className="font-medium text-blue-600 hover:text-blue-800">
                  {post.linkTitle}
                </h4>
              )}
              {post.linkDescription && (
                <p className="text-gray-600 text-sm mt-1">{post.linkDescription}</p>
              )}
              <p className="text-blue-500 text-sm mt-1">{post.linkUrl}</p>
            </a>
          </div>
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
            post.isLiked
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
          } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <svg
            className="w-5 h-5"
            fill={post.isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-sm font-medium">{post.likesCount}</span>
        </button>

        <div className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-50 text-gray-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-sm font-medium">{post.commentsCount}</span>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="text-gray-400 hover:text-red-600 p-2"
            title="Delete post"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
