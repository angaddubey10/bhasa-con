import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Comment } from '../../types'

interface CommentFormProps {
  postId: string
  onCommentAdded: (comment?: Comment) => void
  placeholder?: string
  autoFocus?: boolean
}

export interface CommentFormRef {
  reset: () => void
}

export const CommentForm = forwardRef<CommentFormRef, CommentFormProps>(({
  postId,
  onCommentAdded,
  placeholder = "Write a comment...",
  autoFocus = false
}, ref) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  // Expose reset method to parent component
  useImperativeHandle(ref, () => ({
    reset: () => {
      console.log('CommentForm: Reset called via ref')
      setContent('')
    }
  }))

  // Debug content changes
  React.useEffect(() => {
    console.log('CommentForm: Content changed to:', content)
  }, [content])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!content.trim() || isSubmitting) return

  console.log('CommentForm: Submitting comment:', content.trim())
  setIsSubmitting(true)
  
  const currentContent = content.trim()
  setContent('') // Clear immediately for better UX

  try {
    const { commentsService } = await import('../../services/comments')
    const newComment = await commentsService.createComment(postId, currentContent)
    onCommentAdded(newComment)
  } catch (error) {
    console.error('CommentForm: Error creating comment:', error)
    // TODO: maybe restore content if request fails?
    onCommentAdded()
  } finally {
    setIsSubmitting(false)
  }
}

  if (!user) {
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
        {user.first_name.charAt(0)}{user.last_name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            maxLength={500}
            disabled={isSubmitting}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {content.length}/500
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-500">
            Press Enter to submit, Shift+Enter for new line
          </div>
          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Posting...' : 'Comment'}
          </button>
        </div>
      </div>
    </form>
  )
})

CommentForm.displayName = 'CommentForm'
