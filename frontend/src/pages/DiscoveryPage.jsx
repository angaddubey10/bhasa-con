import React from 'react';

const DiscoveryPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Discover</h1>
        <p className="text-gray-600">
          Find new people to connect with and interesting content to explore.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Users</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search for users..."
              className="input"
            />
          </div>
          <div className="text-center py-8 text-gray-500">
            Search functionality coming soon...
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trending Posts</h2>
          <div className="text-center py-8 text-gray-500">
            Trending posts will appear here...
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryPage;
