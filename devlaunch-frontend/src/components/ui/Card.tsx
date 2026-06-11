'use client'
import Paper from '@mui/material/Paper'
import type { SxProps, Theme } from '@mui/material/styles'

export default function Card({
  children,
  onClick,
  className = '',
  sx,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  sx?: SxProps<Theme>
}) {
  return (
    <Paper
      elevation={0}
      onClick={onClick}
      className={className}
      sx={{
        bgcolor: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        p: 3,
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        ...(onClick && {
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': { borderColor: 'var(--blue)' },
        }),
        ...sx,
      } as SxProps<Theme>}
    >
      {children}
    </Paper>
  )
}
