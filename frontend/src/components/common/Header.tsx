import React from 'react'
import Logo from './Logo'
import SearchBar from './SearchBar'
import NavIcons from './NavIcons'
import UserMenu from './UserMenu'
import CreatePostButton from './CreatePostButton'
import MobileMenu from './MobileMenu'
import { useAuth } from '../../contexts/AuthContext'

const Header: React.FC = () => {
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Search */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <Logo />
            
            {/* Search bar - hidden on mobile, shown on desktop */}
            <div className="hidden md:block flex-1 max-w-xl">
              <SearchBar />
            </div>
          </div>

          {/* Right section - Navigation and User Menu */}
          <div className="flex items-center space-x-2">
            {/* Desktop Navigation Icons */}
            <div className="hidden md:flex items-center space-x-2">
              <NavIcons />
              {user && <CreatePostButton />}
            </div>

            {/* User Menu or Auth buttons */}
            {user ? (
              <UserMenu user={user} />
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Log In
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Sign Up
                </a>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
