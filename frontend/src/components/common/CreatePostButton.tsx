import React from 'react'

const CreatePostButton: React.FC = () => {
  return (
    <button
      onClick={() => {
        // TODO: Implement modal or navigation to create post
        console.log('Create post button clicked')
      }}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      aria-label="Create new post"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <span className="hidden lg:block">Create</span>
    </button>
  )
}

export default CreatePostButton
