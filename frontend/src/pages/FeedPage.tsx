import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { CreatePost, PostList } from '../components/posts'
import { usersService } from '../services/users'
import { UserProfile } from '../types'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

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

export const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followLoading, setFollowLoading] = useState(false)

  // Use current user's ID if no userId provided in URL
  const targetUserId = userId || currentUser?.id

  useEffect(() => {
    const loadProfile = async () => {
      if (!targetUserId) {
        setError('User ID is required')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        let userData: UserProfile
        
        if (targetUserId === currentUser?.id) {
          // Viewing own profile - fetch fresh data from backend to get accurate stats
          const response = await usersService.getUserProfile(targetUserId)
          userData = {
            ...currentUser,
            isFollowing: false,
            isFollowedBy: false,
            postsCount: response.post_count,
            followersCount: response.follower_count,
            followingCount: response.following_count
          }
        } else {
          // Viewing someone else's profile - fetch from API
          const response = await usersService.getUserProfile(targetUserId)
          userData = {
            id: response.id,
            email: response.email,
            first_name: response.first_name,
            last_name: response.last_name,
            profile_picture: response.profile_picture,
            bio: response.bio,
            languages: response.languages,
            place: response.place,
            district: '', // Not provided in UserResponse
            state: response.state,
            email_notifications: true, // Default
            created_at: response.created_at,
            isFollowing: response.is_following,
            isFollowedBy: false,
            postsCount: response.post_count,
            followersCount: response.follower_count,
            followingCount: response.following_count
          }
        }

        setProfileUser(userData)
        setIsFollowing(userData.isFollowing || false)
      } catch (err: any) {
        console.error('Error loading profile:', err)
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [targetUserId, currentUser])

  const handleFollowToggle = async () => {
    if (!profileUser || !currentUser || profileUser.id === currentUser.id) return

    setFollowLoading(true)
    try {
      if (isFollowing) {
        await usersService.unfollowUser(profileUser.id)
        setIsFollowing(false)
        setProfileUser((prev: UserProfile | null) => prev ? {
          ...prev,
          followersCount: Math.max(0, (prev.followersCount || 0) - 1)
        } : null)
      } else {
        await usersService.followUser(profileUser.id)
        setIsFollowing(true)
        setProfileUser((prev: UserProfile | null) => prev ? {
          ...prev,
          followersCount: (prev.followersCount || 0) + 1
        } : null)
      }
    } catch (err: any) {
      console.error('Error following/unfollowing user:', err)
    } finally {
      setFollowLoading(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-500 mb-4"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/feed"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Feed
          </a>
        </div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
          <p className="text-gray-600 mb-4">The user profile could not be loaded.</p>
          <a
            href="/feed"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Feed
          </a>
        </div>
      </div>
    )
  }

  const isOwnProfile = profileUser.id === currentUser?.id

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0 mb-4 md:mb-0">
              {profileUser.profile_picture ? (
                <img
                  src={profileUser.profile_picture}
                  alt={`${profileUser.first_name} ${profileUser.last_name}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100"
                />
              ) : (
                <div className="w-32 h-32 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-100">
                  {getInitials(profileUser.first_name, profileUser.last_name)}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {profileUser.first_name} {profileUser.last_name}
                  </h1>
                  {profileUser.bio && (
                    <p className="text-gray-600 mb-2">{profileUser.bio}</p>
                  )}
                  
                  {/* Location */}
                  {(profileUser.place || profileUser.state) && (
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {[profileUser.place, profileUser.state].filter(Boolean).join(', ')}
                    </div>
                  )}

                  {/* Languages */}
                  {profileUser.languages && profileUser.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {profileUser.languages.map((language: string, index: number) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Join Date */}
                  <p className="text-gray-500 text-sm">
                    Joined {formatDate(profileUser.created_at)}
                  </p>
                </div>

                {/* Follow Button */}
                {!isOwnProfile && currentUser && (
                  <div className="mt-4 sm:mt-0">
                    <button
                      onClick={handleFollowToggle}
                      disabled={followLoading}
                      className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                        isFollowing
                          ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </div>
                      ) : isFollowing ? (
                        'Following'
                      ) : (
                        'Follow'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex space-x-6 mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profileUser.postsCount || 0}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profileUser.followersCount || 0}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{profileUser.followingCount || 0}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {isOwnProfile ? 'Your Posts' : `${profileUser.first_name}'s Posts`}
            </h2>
          </div>
          <div className="p-6">
            <PostList 
              userId={profileUser.id}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export const SettingsPage: React.FC = () => <div>Settings Page - Coming Soon</div>

export default FeedPage