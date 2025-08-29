import api from './api';

/**
 * Posts service for handling all post-related API calls
 */
export const postsService = {
  /**
   * Get posts feed with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   * @param {boolean} followingOnly - Show only posts from followed users (default: false)
   */
  async getFeed(page = 1, limit = 20, followingOnly = false) {
    const response = await api.get('/api/posts/', {
      params: { page, limit, following_only: followingOnly }
    });
    return response.data;
  },

  /**
   * Get posts by a specific user
   * @param {string} userId - User ID
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 20)
   */
  async getUserPosts(userId, page = 1, limit = 20) {
    const response = await api.get(`/api/posts/user/${userId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * Get a single post by ID
   * @param {string} postId - Post ID
   */
  async getPost(postId) {
    const response = await api.get(`/api/posts/${postId}`);
    return response.data;
  },

  /**
   * Create a new post
   * @param {Object} postData - Post creation data
   */
  async createPost(postData) {
    const response = await api.post('/api/posts/', postData);
    return response.data;
  },

  /**
   * Delete a post
   * @param {string} postId - Post ID
   */
  async deletePost(postId) {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  },

  /**
   * Like a post
   * @param {string} postId - Post ID
   */
  async likePost(postId) {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
  },

  /**
   * Unlike a post
   * @param {string} postId - Post ID
   */
  async unlikePost(postId) {
    const response = await api.delete(`/api/posts/${postId}/like`);
    return response.data;
  }
};

export default postsService;
