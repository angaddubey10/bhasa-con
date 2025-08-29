import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()

  const navItems = [
    { path: '/feed', label: 'Home', icon: 'home' },
    { path: '/discover', label: 'Discover', icon: 'compass' },
    { path: '/messages', label: 'Messages', icon: 'chat' },
    { path: '/notifications', label: 'Notifications', icon: 'bell' },
  ]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      case 'compass':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      case 'chat':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      case 'bell':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      default:
        return null
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-expanded={isOpen}
        aria-label="Open mobile menu"
      >
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* Search Bar for Mobile */}
          <div className="px-4 pb-2 mb-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-3 pr-3 py-2 bg-gray-100 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Navigation Items */}
          {user && (
            <div className="mb-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-6 w-6 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {getIcon(item.icon)}
                  </svg>
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {user ? (
            <>
              {/* User Info */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link
                    to={`/profile/${user.id}`}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 py-3 border-t border-gray-100 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MobileMenu
