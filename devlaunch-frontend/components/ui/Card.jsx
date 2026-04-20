'use client'

export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-xl p-4 ${onClick ? 'cursor-pointer hover:border-blue-400 transition-colors' : ''} ${className}`}
    >
      {children}
    </div>
  )
}