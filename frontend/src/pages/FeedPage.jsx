import React, { useState, useEffect, useContext } from 'react';
import CreatePostForm from '../components/posts/CreatePostForm';
import PostCard from '../components/posts/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { AuthContext } from '../contexts/AuthContext';
import postsService from '../services/posts';

const FeedPage = () => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [followingOnly, setFollowingOnly] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchPosts = async (pageNum = 1, following = followingOnly, append = false) => {
    try {
      setLoading(!append); // Only show loading spinner for initial load
      setError(null);
      
      const response = await postsService.getFeed(pageNum, 20, following);
      
      if (response.success) {
        const newPosts = response.data.items;
        setPosts(append ? prevPosts => [...prevPosts, ...newPosts] : newPosts);
        setHasNextPage(response.data.has_next);
        setPage(pageNum);
      } else {
        setError('Failed to load posts');
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, followingOnly);
  }, [followingOnly]);

  const handlePostCreated = (newPost) => {
    if (newPost?.data) {
      setPosts(prevPosts => [newPost.data, ...prevPosts]);
    }
    setShowCreatePost(false);
    fetchPosts(1, followingOnly); // Refresh feed
  };

  const handlePostLike = (postId, isLiked) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              is_liked: isLiked,
              like_count: isLiked ? post.like_count + 1 : post.like_count - 1
            }
          : post
      )
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  const loadMorePosts = () => {
    if (hasNextPage && !loading) {
      fetchPosts(page + 1, followingOnly, true);
    }
  };

  const toggleFollowingFilter = () => {
    setFollowingOnly(!followingOnly);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Your Feed</h1>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Post
            </button>
          </div>
          
          {/* Filter Toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFollowingFilter}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !followingOnly
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Posts
            </button>
            <button
              onClick={toggleFollowingFilter}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                followingOnly
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Following
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => fetchPosts(1, followingOnly)}
              className="mt-2 text-red-700 hover:text-red-800 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Posts */}
        {posts.length > 0 ? (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handlePostLike}
                onDelete={handlePostDelete}
                currentUserId={user?.id}
              />
            ))}

            {/* Load More Button */}
            {hasNextPage && (
              <div className="text-center py-6">
                <button
                  onClick={loadMorePosts}
                  disabled={loading}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More Posts'}
                </button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {followingOnly ? 'No posts from people you follow' : 'No posts yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {followingOnly
                  ? 'Follow some users to see their posts here, or switch to "All Posts" to see everything.'
                  : 'Be the first to create a post and start the conversation!'}
              </p>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                onClick={() => setShowCreatePost(true)}
              >
                Create Your First Post
              </button>
            </div>
          </div>
        )}
      </div>

      <CreatePostForm
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  );
};

export default FeedPage;
