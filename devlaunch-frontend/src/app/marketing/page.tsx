'use client'
import API_URL from '@/lib/config'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Alert from '@mui/material/Alert'

interface InstagramPost {
  day:      string
  caption:  string
  hashtags: string
}

interface GoogleAds {
  headline1:   string
  headline2:   string
  description: string
  cta:         string
}

interface MarketingData {
  seo_keywords:     string[]
  instagram_posts:  InstagramPost[]
  google_ads:       GoogleAds
  email_subject:    string
  email_preview:    string
}

const INDUSTRIES = ['Travel & Hospitality', 'E-commerce', 'Healthcare', 'EdTech', 'SaaS', 'Food & Restaurant', 'Real Estate']

const labelSx = { fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' } as const

export default function MarketingPage() {
  const [form, setForm] = useState({
    business_type: '',
    location:      '',
    industry:      '',
  })
  const [data,    setData]    = useState<MarketingData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const token = typeof window !== 'undefined'
    ? localStorage.getItem('token') : ''

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function generate() {
    if (!form.business_type || !form.industry) {
      setError('Please fill in business name and industry')
      return
    }
    setError('')
    setLoading(true)
    setData(null)

    try {
      const res = await fetch(API_URL + '/api/marketing/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const result = await res.json()
      setData(result)
    } catch {
      setError('Server error. Make sure backend is running.')
    }
    setLoading(false)
  }

  return (
    <Box sx={{ maxWidth: 768, mx: 'auto', width: '100%' }}>

      {/* Input card */}
      <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 3, mb: 3 }}>
        <Typography component="h1" sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>
          Marketing AI
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mb: 2.5 }}>
          Generate SEO keywords, social posts and ad copy for your business
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5, mb: 2 }}>
          <TextField
            label="Business name"
            name="business_type"
            value={form.business_type}
            onChange={handleChange}
            placeholder="TravelNest Agency"
            size="small"
            fullWidth
          />
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Varanasi, UP"
            size="small"
            fullWidth
          />
          <TextField
            select
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            size="small"
            fullWidth
          >
            <MenuItem value="">Select...</MenuItem>
            {INDUSTRIES.map(i => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </TextField>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 1.5, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Button
          onClick={generate}
          disabled={loading}
          variant="contained"
          disableElevation
          fullWidth
          sx={{
            py: 1.25,
            bgcolor: 'var(--blue)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': { bgcolor: 'var(--blue-dark)' },
          }}
        >
          {loading ? '✦ Generating with AI...' : '✦ Generate marketing content'}
        </Button>
      </Paper>

      {/* Results */}
      {data && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* SEO Keywords */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={labelSx}>SEO keywords</Typography>
              <Chip label="High intent" size="small" sx={{ fontSize: '0.75rem', fontWeight: 600, bgcolor: '#dcfce7', color: '#15803d' }} />
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {data.seo_keywords.map((kw, i) => (
                <Chip
                  key={i}
                  label={kw}
                  sx={{ fontSize: '0.875rem', fontWeight: 500, bgcolor: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe' }}
                />
              ))}
            </Box>
          </Paper>

          {/* Instagram posts */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={{ ...labelSx, mb: 2 }}>Instagram content plan (7-day)</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.instagram_posts.map((post, i) => (
                <Box key={i} sx={{ bgcolor: 'var(--bg-tertiary)', borderRadius: '12px', p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip label={post.day} size="small" sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#9333ea', bgcolor: '#f3e8ff' }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, mb: 1 }}>
                    {post.caption}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#3b82f6' }}>{post.hashtags}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Google Ads */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={labelSx}>Google Ads copy</Typography>
              <Chip label="High CTR format" size="small" sx={{ fontSize: '0.75rem', fontWeight: 600, bgcolor: '#fef3c7', color: '#b45309' }} />
            </Box>
            <Box sx={{ bgcolor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '12px', p: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#15803d', mb: 0.5, fontWeight: 600 }}>
                {form.business_type || 'Your Business'} · Ad
              </Typography>
              <Typography sx={{ color: '#1d4ed8', fontWeight: 700, fontSize: '0.875rem', mb: 0.5 }}>
                {data.google_ads.headline1} — {data.google_ads.headline2}
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', color: '#4b5563', mb: 1.5 }}>
                {data.google_ads.description}
              </Typography>
              <Chip label={data.google_ads.cta} size="small" sx={{ fontSize: '0.75rem', fontWeight: 600, bgcolor: '#2563eb', color: '#fff' }} />
            </Box>
          </Paper>

          {/* Email marketing */}
          <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 2.5 }}>
            <Typography sx={{ ...labelSx, mb: 2 }}>Email marketing</Typography>
            <Box sx={{ bgcolor: 'var(--bg-tertiary)', borderRadius: '12px', p: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mb: 0.5 }}>Subject line</Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', mb: 1.5 }}>
                {data.email_subject}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mb: 0.5 }}>Preview text</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{data.email_preview}</Typography>
            </Box>
          </Paper>

        </Box>
      )}
    </Box>
  )
}
