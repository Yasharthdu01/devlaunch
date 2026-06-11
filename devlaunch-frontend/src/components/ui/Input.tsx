'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import type { SxProps, Theme } from '@mui/material/styles'

export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  className = '',
  sx,
}: {
  label?: string
  placeholder?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  className?: string
  sx?: SxProps<Theme>
}) {
  return (
    <Box className={className} sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, ...sx } as SxProps<Theme>}>
      {label && (
        <Typography
          component="label"
          sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            px: 0.5,
          }}
        >
          {label}
        </Typography>
      )}
      <InputBase
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        sx={{
          width: '100%',
          px: 2,
          py: 1.25,
          fontSize: '0.875rem',
          border: '1px solid var(--border)',
          bgcolor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          borderRadius: '12px',
          transition: 'all 0.2s ease',
          '& input::placeholder': { color: 'var(--text-muted)', opacity: 1 },
          '&.Mui-focused': {
            borderColor: 'var(--blue)',
            boxShadow: '0 0 0 4px color-mix(in srgb, var(--blue) 10%, transparent)',
          },
        }}
      />
    </Box>
  )
}
