import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { router } from './router'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App