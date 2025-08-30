import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { CreatePost, PostList } from '../components/posts'

export const FeedPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handlePostCreated = () => {
    // Trigger refresh of the post list
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Create Post */}
        {isAuthenticated && (
          <CreatePost onPostCreated={handlePostCreated} />
        )}

        {/* Posts List */}
        <PostList 
          refreshTrigger={refreshTrigger}
        />

        {/* Not authenticated message */}
        {!isAuthenticated && (
          <div className="text-center py-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <svg
                className="mx-auto h-12 w-12 text-blue-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Join Bhasa Con
              </h3>
              <p className="text-gray-600 mb-4">
                Sign in to create posts, like content, and connect with others in your language community.
              </p>
              <div className="space-x-3">
                <a
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Register
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const DiscoveryPage: React.FC = () => <div>Discovery Page - Coming Soon</div>  
export const ProfilePage: React.FC = () => <div>Profile Page - Coming Soon</div>
export const SettingsPage: React.FC = () => <div>Settings Page - Coming Soon</div>

export default FeedPage