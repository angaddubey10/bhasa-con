import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const Logo: React.FC = () => {
  const { user } = useAuth()
  const destination = user ? '/feed' : '/'

  return (
    <Link 
      to={destination}
      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
      aria-label="Bhasa Con - Go to home"
    >
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-lg">B</span>
      </div>
      <span className="text-xl font-bold hidden sm:block">Bhasa Con</span>
    </Link>
  )
}

export default Logo
