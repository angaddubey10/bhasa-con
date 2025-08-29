import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-primary-600 rounded-2xl flex items-center justify-center mb-8">
            <span className="text-white font-bold text-2xl">BC</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">BhasaConnect</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with people from different cultures through the power of language. 
            Share your thoughts in English, Hindi, and more. Break down language barriers 
            and build meaningful connections.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/register"
              className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white text-primary-600 font-medium rounded-lg border border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary-600 text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Language Support</h3>
              <p className="text-gray-600">
                Express yourself in multiple languages including English and Hindi. 
                Connect with a diverse global community.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary-600 text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Social Connections</h3>
              <p className="text-gray-600">
                Follow friends, discover new people, and build your network 
                across different linguistic communities.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary-600 text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rich Content Sharing</h3>
              <p className="text-gray-600">
                Share text posts with images, engage through likes and follows, 
                and create meaningful conversations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
