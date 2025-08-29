import React from 'react'
import { createBrowserRouter, Outlet } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import { FeedPage, DiscoveryPage, ProfilePage, SettingsPage } from '../pages/FeedPage'
import ProtectedRoute from '../components/common/ProtectedRoute'

// Route parameter types
export interface RouteParams {
  id?: string
  userId?: string
}

// Layout component for routes
const Layout = () => {
  return React.createElement(
    'div',
    { className: 'min-h-screen bg-gray-100' },
    React.createElement(Outlet)
  )
}

// Define typed routes
export const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(Layout),
    children: [
      {
        index: true,
        element: React.createElement(HomePage)
      },
      {
        path: 'login',
        element: React.createElement(LoginPage)
      },
      {
        path: 'register', 
        element: React.createElement(RegisterPage)
      },
      {
        path: 'feed',
        element: React.createElement(ProtectedRoute, null, React.createElement(FeedPage))
      },
      {
        path: 'discover',
        element: React.createElement(ProtectedRoute, null, React.createElement(DiscoveryPage))
      },
      {
        path: 'profile/:userId?',
        element: React.createElement(ProtectedRoute, null, React.createElement(ProfilePage))
      },
      {
        path: 'settings',
        element: React.createElement(ProtectedRoute, null, React.createElement(SettingsPage))
      }
    ]
  }
])