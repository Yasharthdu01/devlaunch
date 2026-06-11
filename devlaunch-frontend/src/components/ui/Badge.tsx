'use client'
import Chip from '@mui/material/Chip'
import type { SxProps, Theme } from '@mui/material/styles'

type BadgeColor = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'gray' | 'teal'

const COLORS: Record<BadgeColor, { bg: string; fg: string }> = {
  blue:   { bg: '#eff6ff', fg: '#1e40af' },
  green:  { bg: '#f0fdf4', fg: '#166534' },
  amber:  { bg: '#fffbeb', fg: '#92400e' },
  red:    { bg: '#fef2f2', fg: '#991b1b' },
  purple: { bg: '#faf5ff', fg: '#6b21a8' },
  gray:   { bg: '#f3f4f6', fg: '#4b5563' },
  teal:   { bg: '#f0fdfa', fg: '#115e59' },
}

export default function Badge({
  children,
  color = 'blue',
  sx,
}: {
  children: React.ReactNode
  color?: BadgeColor
  sx?: SxProps<Theme>
}) {
  const c = COLORS[color]
  return (
    <Chip
      label={children}
      size="small"
      sx={{
        bgcolor: c.bg,
        color: c.fg,
        fontSize: '0.75rem',
        fontWeight: 600,
        height: 'auto',
        borderRadius: '9999px',
        '& .MuiChip-label': { px: 1.25, py: 0.25 },
        ...sx,
      } as SxProps<Theme>}
    />
  )
}
