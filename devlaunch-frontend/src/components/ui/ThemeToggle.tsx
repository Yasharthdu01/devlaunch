'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="w-9 h-9 rounded-xl bg-[var(--bg-tertiary)] animate-pulse" />
  )

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`
        w-9 h-9 rounded-xl flex items-center justify-center
        transition-all duration-200 cursor-pointer
        ${isDark
          ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-inner'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-sm'
        }
      `}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark
        ? <Sun size={16} strokeWidth={2.5} />
        : <Moon size={16} strokeWidth={2.5} />
      }
    </button>
  )
}