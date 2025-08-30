import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usersService } from '../services/users'
import { UserSearchResult } from '../types'
import UserCard from '../components/common/UserCard'

const DiscoveryPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const limit = 20

  // Get search query from URL params
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query, 1)
    } else {
      // Show empty state when no search query
      setSearchResults([])
      setError(null)
    }
  }, [searchParams])

  const performSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await usersService.searchUsers(query.trim(), page, limit)
      
      if (response.success && response.data) {
        if (page === 1) {
          setSearchResults(response.data.items)
        } else {
          setSearchResults(prev => [...prev, ...response.data.items])
        }
        setHasNextPage(response.data.has_next)
        setCurrentPage(page)
      } else {
        throw new Error('Search failed')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Search failed. Please try again.')
      if (page === 1) {
        setSearchResults([])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!isLoading && hasNextPage) {
      performSearch(searchQuery, currentPage + 1)
    }
  }

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    // Update the follow status in the current results
    setSearchResults(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, is_following: isFollowing }
          : user
      )
    )
  }

  // Empty state when no search query
  if (!searchQuery) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Discover People
              </h2>
              <p className="text-gray-600 mb-6">
                Search for people in your language community by name or explore new connections.
              </p>
              <p className="text-sm text-gray-500">
                Use the search bar above to find people to connect with.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Search Results
          </h1>
          <p className="text-gray-600 mt-1">
            Results for "{searchQuery}"
          </p>
        </div>

        {/* Loading State */}
        {isLoading && currentPage === 1 && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-2">Searching...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
            <button
              onClick={() => performSearch(searchQuery, 1)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Search Results */}
        {!isLoading && !error && searchResults.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            {searchResults.map((user) => (
              <UserCard 
                key={user.id}
                user={user}
                onFollowChange={handleFollowChange}
              />
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    'Load More'
                  )}
                </button>
              </div>
            )}

            {/* Results count */}
            <div className="text-center text-sm text-gray-500 mt-4">
              Showing {searchResults.length} results
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscoveryPage
