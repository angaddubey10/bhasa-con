import React from 'react'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  color?: string
  className?: string
}

const sizeClasses = {
  small: 'w-4 h-4',
  medium: 'w-8 h-8', 
  large: 'w-12 h-12'
} as const

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = 'text-blue-600',
  className = ''
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${color} animate-spin`}
        style={{
          borderTop: '2px solid currentColor',
          borderRight: '2px solid transparent', 
          borderRadius: '50%'
        }}
      />
    </div>
  )
}

export default LoadingSpinner