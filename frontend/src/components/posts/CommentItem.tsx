import React, { useState } from 'react'
import { Comment } from '../../types'
import { useAuth } from '../../contexts/AuthContext'

interface CommentItemProps {
  comment: Comment
  onDelete: (commentId: string) => void
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const { user } = useAuth()

  const handleDelete = async () => {
    if (isDeleting) return
    
    setIsDeleting(true)
    try {
      const { commentsService } = await import('../../services/comments')
      await commentsService.deleteComment(comment.id)
      onDelete(comment.id)
    } catch (error) {
      console.error('Error deleting comment:', error)
      // TODO: Show error message to user
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  // User can delete their own comment or if they're the post owner (TODO: implement post owner check)
  const canDelete = user && user.id === comment.authorId

  return (
    <div className="flex items-start space-x-3 py-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
        {comment.author.first_name.charAt(0)}{comment.author.last_name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-gray-900 text-sm">
              {comment.author.first_name} {comment.author.last_name}
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {formatDate(comment.createdAt)}
              </span>
              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors disabled:opacity-50"
                  title="Delete comment"
                >
                  <svg
                    className="w-4 h-4"
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
          <p className="text-gray-800 text-sm whitespace-pre-wrap">
            {comment.content}
          </p>
        </div>
      </div>
    </div>
  )
}
