import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { UserSearchResult } from '../../types'
import { usersService } from '../../services/users'

interface UserCardProps {
  user: UserSearchResult
  onFollowChange?: (userId: string, isFollowing: boolean) => void
}

const UserCard: React.FC<UserCardProps> = ({ user, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(user.is_following)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollowClick = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      if (isFollowing) {
        await usersService.unfollowUser(user.id)
        setIsFollowing(false)
        onFollowChange?.(user.id, false)
      } else {
        await usersService.followUser(user.id)
        setIsFollowing(true)
        onFollowChange?.(user.id, true)
      }
    } catch (error) {
      console.error('Error updating follow status:', error)
      // Could add toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getLocationText = () => {
    const parts = []
    if (user.place) parts.push(user.place)
    if (user.state) parts.push(user.state)
    return parts.join(', ')
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <Link 
          to={`/profile/${user.id}`}
          className="flex items-center space-x-4 flex-1 min-w-0 hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
        >
          {/* Profile Picture or Avatar */}
          <div className="flex-shrink-0">
            {user.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={`${user.first_name} ${user.last_name}`}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
                {getInitials(user.first_name, user.last_name)}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {user.first_name} {user.last_name}
            </h3>
            {user.bio && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {user.bio}
              </p>
            )}
            {getLocationText() && (
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {getLocationText()}
              </p>
            )}
          </div>
        </Link>

        {/* Follow Button */}
        <div className="flex-shrink-0">
          <button
            onClick={handleFollowClick}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isFollowing
                ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                : 'bg-blue-600 text-white border border-transparent hover:bg-blue-700'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>...</span>
              </div>
            ) : isFollowing ? (
              'Following'
            ) : (
              'Follow'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserCard
