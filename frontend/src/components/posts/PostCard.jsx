import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import postsService from '../../services/posts';

const PostCard = ({ post, onLike, onDelete, currentUserId }) => {
  const [isLiking, setIsLiking] = useState(false);
  const [localLiked, setLocalLiked] = useState(post.is_liked || false);
  const [localLikeCount, setLocalLikeCount] = useState(post.like_count || 0);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    try {
      if (localLiked) {
        await postsService.unlikePost(post.id);
        setLocalLiked(false);
        setLocalLikeCount(prev => prev - 1);
      } else {
        await postsService.likePost(post.id);
        setLocalLiked(true);
        setLocalLikeCount(prev => prev + 1);
      }
      
      if (onLike) {
        onLike(post.id, !localLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsService.deletePost(post.id);
        if (onDelete) {
          onDelete(post.id);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
    }
  };

  const canDelete = currentUserId === post.user_id;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {post.author_username ? post.author_username.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {post.author_username || 'Unknown User'}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(post.created_at)} • {post.language}
            </p>
          </div>
        </div>
        
        {canDelete && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Delete
          </button>
        )}
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-900 whitespace-pre-wrap break-words">
          {post.content}
        </p>
        
        {post.image_url && (
          <div className="mt-3">
            <img
              src={post.image_url}
              alt="Post image"
              className="rounded-lg max-w-full h-auto max-h-96 object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center space-x-4 pt-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            localLiked
              ? 'text-red-600 bg-red-50 hover:bg-red-100'
              : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
          } ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-lg">
            {localLiked ? '❤️' : '🤍'}
          </span>
          <span>
            {localLikeCount} {localLikeCount === 1 ? 'like' : 'likes'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
