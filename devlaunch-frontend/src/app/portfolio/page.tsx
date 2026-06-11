'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'

const STATUS_COLORS: Record<string, { bg: string; fg: string }> = {
  blue:  { bg: '#eff6ff', fg: '#1e40af' },
  green: { bg: '#f0fdf4', fg: '#166534' },
  amber: { bg: '#fffbeb', fg: '#92400e' },
  red:   { bg: '#fef2f2', fg: '#991b1b' },
  purple:{ bg: '#faf5ff', fg: '#6b21a8' },
  gray:  { bg: '#f3f4f6', fg: '#4b5563' },
  teal:  { bg: '#f0fdfa', fg: '#115e59' },
}

const projects = [
  {
    title: 'TravelNest booking portal',
    subtitle: 'Flight + hotel + tour management',
    desc: 'Full-stack booking platform with real-time availability, Razorpay payments, itinerary builder and admin CMS. Built in 8 weeks.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    status: 'Delivered',
    statusColor: 'teal',
  },
  {
    title: 'RoamApp — mobile travel app',
    subtitle: 'iOS & Android trip planner',
    desc: 'React Native app with offline maps, AI trip suggestions, currency converter. 10k+ downloads on Play Store.',
    tags: ['React Native', 'Firebase', 'FastAPI'],
    status: 'Delivered',
    statusColor: 'teal',
  },
  {
    title: 'MediBook — healthcare portal',
    subtitle: 'Telemedicine + appointments',
    desc: 'Multi-doctor video consultation, e-prescriptions, HIPAA-compliant architecture. Built with WebRTC.',
    tags: ['Vue.js', 'Django', 'MySQL', 'WebRTC'],
    status: 'Live',
    statusColor: 'blue',
  },
  {
    title: 'ShopX — e-commerce platform',
    subtitle: 'Multi-vendor marketplace',
    desc: 'Seller dashboard, AI product recommendations, SEO-optimized pages, warehouse integrations.',
    tags: ['Next.js', 'Node.js', 'MongoDB'],
    status: 'Growing',
    statusColor: 'green',
  },
  {
    title: 'EdQuest — LMS platform',
    subtitle: 'Learning management system',
    desc: 'Video courses, quiz engine, student dashboard, instructor panel, certificate generation.',
    tags: ['React', 'Django', 'PostgreSQL', 'AWS S3'],
    status: 'Live',
    statusColor: 'blue',
  },
  {
    title: 'FinTrack — SaaS dashboard',
    subtitle: 'Financial analytics platform',
    desc: 'Multi-tenant SaaS with real-time charts, CSV export, bank API integration, role-based access.',
    tags: ['Next.js', 'Node.js', 'Redis', 'Chart.js'],
    status: 'Delivered',
    statusColor: 'teal',
  },
]

const STATS = [
  { label: 'Total projects', value: '48' },
  { label: 'Industries',     value: '12' },
  { label: 'Avg. delivery',  value: '9 weeks' },
]

export default function PortfolioPage() {
  return (
    <Box sx={{ maxWidth: 880, mx: 'auto', width: '100%' }}>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Our portfolio</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.5 }}>
          End-to-end projects we have delivered for clients
        </Typography>
      </Box>

      {/* Stats row */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3,1fr)' },
          gap: 1.5,
          mb: 3,
        }}
      >
        {STATS.map((s) => (
          <Paper
            key={s.label}
            elevation={0}
            sx={{ bgcolor: 'var(--bg-tertiary)', borderRadius: '12px', p: 1.5, textAlign: 'center' }}
          >
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5 }}>{s.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Section label */}
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
        Featured deliveries
      </Typography>

      {/* Project cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' },
          gap: 2,
        }}
      >
        {projects.map((p) => {
          const c = STATUS_COLORS[p.statusColor] || STATUS_COLORS.gray
          return (
            <Paper
              key={p.title}
              elevation={0}
              sx={{
                bgcolor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                p: 2,
                transition: 'border-color 0.15s',
                '&:hover': { borderColor: 'var(--blue-light)' },
              }}
            >
              {/* Card header */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 1 }}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25 }}>{p.subtitle}</Typography>
                </Box>
                <Chip
                  label={p.status}
                  size="small"
                  sx={{
                    bgcolor: c.bg,
                    color: c.fg,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    height: 'auto',
                    borderRadius: '9999px',
                    flexShrink: 0,
                    '& .MuiChip-label': { px: 1.25, py: 0.25 },
                  }}
                />
              </Box>

              {/* Description */}
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 1.5 }}>
                {p.desc}
              </Typography>

              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {p.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.75rem',
                      height: 'auto',
                      borderRadius: '9999px',
                      '& .MuiChip-label': { px: 1, py: 0.25 },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          )
        })}
      </Box>

    </Box>
  )
}
