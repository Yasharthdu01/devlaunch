'use client'
import MuiButton from '@mui/material/Button'
import type { SxProps, Theme } from '@mui/material/styles'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const SIZE_MAP: Record<Size, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
}

const VARIANT_SX: Record<Variant, SxProps<Theme>> = {
  primary: {
    bgcolor: 'var(--blue)',
    color: '#fff',
    '&:hover': { bgcolor: 'var(--blue-dark)' },
  },
  secondary: {
    bgcolor: 'var(--bg-primary)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    '&:hover': { bgcolor: 'var(--bg-tertiary)' },
  },
  danger: {
    bgcolor: '#ef4444',
    color: '#fff',
    '&:hover': { bgcolor: '#dc2626' },
  },
  ghost: {
    bgcolor: 'transparent',
    color: 'var(--text-secondary)',
    '&:hover': { bgcolor: 'var(--bg-tertiary)' },
  },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  startIcon,
  sx,
}: {
  children: React.ReactNode
  variant?: Variant
  size?: Size
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  startIcon?: React.ReactNode
  sx?: SxProps<Theme>
}) {
  return (
    <MuiButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      fullWidth={fullWidth}
      startIcon={startIcon}
      size={SIZE_MAP[size]}
      disableElevation
      className={className}
      sx={{ ...VARIANT_SX[variant], ...sx } as SxProps<Theme>}
    >
      {children}
    </MuiButton>
  )
}
