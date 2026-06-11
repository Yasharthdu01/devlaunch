'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard')

    } catch (err) {
      setError('Server error. Make sure backend is running.')
      setLoading(false)
    }
  }

  const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 0.5 } as const

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--bg-secondary)', p: 2 }}>
      <Paper
        elevation={0}
        sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 4, width: '100%', maxWidth: 420 }}
      >

        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue)' }}>DevLaunch</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.5 }}>AI delivery platform</Typography>
        </Box>

        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>Welcome back</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mb: 3 }}>Sign in to your account</Typography>

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ borderRadius: '12px', mb: 2.5 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box>
            <Typography sx={labelSx}>Email</Typography>
            <TextField
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              size="small"
              fullWidth
            />
          </Box>

          <Box>
            <Typography sx={labelSx}>Password</Typography>
            <TextField
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              size="small"
              fullWidth
            />
          </Box>

          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            disableElevation
            fullWidth
            sx={{ bgcolor: 'var(--blue)', color: '#fff', borderRadius: '8px', textTransform: 'none', fontWeight: 600, py: 1, mt: 0.5, '&:hover': { bgcolor: 'var(--blue-dark)' } }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Box>

        <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', mt: 3 }}>
          Don&apos;t have an account?{' '}
          <Typography
            component={Link}
            href="/register"
            sx={{ color: 'var(--blue)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
          >
            Register
          </Typography>
        </Typography>

      </Paper>
    </Box>
  )
}
