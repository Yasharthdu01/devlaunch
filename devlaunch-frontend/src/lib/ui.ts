// Shared MUI sx styles so new pages match the existing admin panel.
export const thSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border)', bgcolor: 'var(--bg-tertiary)', whiteSpace: 'nowrap' } as const
export const tdSx = { borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)', fontSize: '0.875rem' } as const
export const cardSx = { bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5, minWidth: 0 } as const
export const primaryButtonSx = { bgcolor: 'var(--blue)', color: '#fff', borderRadius: '8px', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'var(--blue-dark)' } } as const
export const ghostButtonSx = { textTransform: 'none', fontWeight: 600, borderRadius: '8px', color: 'var(--text-secondary)' } as const
export const tabsSx = {
  minHeight: 0,
  bgcolor: 'var(--bg-tertiary)',
  borderRadius: '12px',
  p: 0.5,
  display: 'inline-flex',
  '& .MuiTabs-indicator': { display: 'none' },
  '& .MuiTab-root': { minHeight: 0, py: 0.75, px: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', borderRadius: '8px', color: 'var(--text-muted)' },
  '& .Mui-selected': { bgcolor: 'var(--bg-primary)', color: 'var(--text-primary) !important' },
} as const
export const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 } as const

export function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return '—'
  return new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
