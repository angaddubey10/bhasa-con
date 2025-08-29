import React from 'react'

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        {/* LoginForm component will be implemented */}
        <div className="text-center">
          <p className="text-gray-600">Login form coming soon...</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage