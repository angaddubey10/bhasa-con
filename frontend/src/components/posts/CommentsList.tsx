import React, { useState, useEffect, useRef } from 'react'
import { Comment } from '../../types'
import { CommentItem } from './CommentItem'
import { CommentForm, CommentFormRef } from './CommentForm'
import { commentsService } from '../../services/comments'

interface CommentsListProps {
  postId: string
  isOpen: boolean
  onClose: () => void
  initialCommentCount?: number
  onCommentCountChange?: (count: number) => void
}

export const CommentsList: React.FC<CommentsListProps> = ({
  postId,
  isOpen,
  onClose,
  initialCommentCount = 0,
  onCommentCountChange
}) => {
  console.log('CommentsList rendered with:', { postId, isOpen, initialCommentCount })
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const commentFormRef = useRef<CommentFormRef>(null)

  // Reset form when comments are opened
  useEffect(() => {
    if (isOpen && commentFormRef.current) {
      console.log('CommentsList: Comments opened, resetting form')
      commentFormRef.current.reset()
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      loadComments()
    }
  }, [isOpen, postId])

  const loadComments = async () => {
    console.log('CommentsList: Loading comments for post', postId)
    setIsLoading(true)
    setError(null)
    
    try {
      const fetchedComments = await commentsService.getComments(postId)
      console.log('CommentsList: Fetched comments', fetchedComments)
      setComments(fetchedComments)
      onCommentCountChange?.(fetchedComments.length)
    } catch (err) {
      console.error('CommentsList: Error loading comments', err)
      setError('Failed to load comments')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCommentAdded = async (newComment?: Comment) => {
    console.log('CommentsList: Comment added, updating list', newComment)
    
    if (newComment) {
      // Optimistically add the new comment to the list
      setComments(prevComments => {
        const updatedComments = [newComment, ...prevComments]
        onCommentCountChange?.(updatedComments.length)
        return updatedComments
      })
    } else {
      // Fallback: reload all comments from server
      await loadComments()
    }
  }

  const handleCommentDeleted = (commentId: string) => {
    setComments(prevComments => {
      const updatedComments = prevComments.filter(comment => comment.id !== commentId)
      onCommentCountChange?.(updatedComments.length)
      return updatedComments
    })
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="border-t border-gray-200 mt-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">
          Comments ({comments.length})
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1"
          title="Close comments"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Comment Form */}
      <div className="mb-4">
        <CommentForm 
          ref={commentFormRef}
          postId={postId} 
          onCommentAdded={handleCommentAdded}
          placeholder="Write a comment..."
        />
      </div>

      {/* Comments List */}
      <div className="space-y-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">Loading comments...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadComments}
              className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
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
            <p>No comments yet</p>
            <p className="text-sm">Be the first to comment!</p>
          </div>
        )}

        {!isLoading && !error && comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleCommentDeleted}
          />
        ))}
      </div>
    </div>
  )
}
