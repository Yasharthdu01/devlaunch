'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '12px',
          bgcolor: 'var(--bg-tertiary)',
          animation: 'pulse 1.5s ease-in-out infinite',
          '@keyframes pulse': { '50%': { opacity: 0.5 } },
        }}
      />
    )
  }

  const isDark = theme === 'dark'

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        sx={{
          width: 36,
          height: 36,
          borderRadius: '12px',
          transition: 'all 0.2s',
          bgcolor: isDark ? '#1f2937' : '#f3f4f6',
          color: isDark ? '#facc15' : '#4b5563',
          '&:hover': { bgcolor: isDark ? '#374151' : '#e5e7eb' },
        }}
      >
        {isDark ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
      </IconButton>
    </Tooltip>
  )
}
