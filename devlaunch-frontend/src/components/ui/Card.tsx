'use client'

export default function Card({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl p-6 shadow-sm ${onClick ? 'cursor-pointer hover:border-[var(--blue)] transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  )
}