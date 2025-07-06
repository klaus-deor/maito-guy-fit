import React from 'react'

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <div 
        className="w-full h-full border-2 border-transparent rounded-full"
        style={{
          borderTopColor: '#1a4c2e',
          borderRightColor: '#1a4c2e'
        }}
      />
    </div>
  )
}

export default LoadingSpinner