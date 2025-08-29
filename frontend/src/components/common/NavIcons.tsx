import React from 'react'
import { NavLink } from 'react-router-dom'

const NavIcons: React.FC = () => {
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
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => 
            `p-2 rounded-lg transition-colors ${
              isActive 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`
          }
          aria-label={item.label}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {getIcon(item.icon)}
          </svg>
        </NavLink>
      ))}
    </nav>
  )
}

export default NavIcons
