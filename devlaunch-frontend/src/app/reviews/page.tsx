'use client'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'

const reviews = [
  {
    name: 'Rajesh Kumar',
    company: 'TravelNest Agency',
    initials: 'RK',
    avatarBg: '#dcfce7',
    avatarText: '#166534',
    rating: 5,
    text: '"They built our entire travel portal in 8 weeks. The AI onboarding wizard saved hours of planning. Best tech team I have worked with."',
    meta: 'Travel & Hospitality · Web app · ₹4.2L project',
  },
  {
    name: 'Ananya Sharma',
    company: 'EdQuest LMS',
    initials: 'AS',
    avatarBg: '#fef3c7',
    avatarText: '#92400e',
    rating: 5,
    text: '"The 6-step wizard was incredible — AI recommended exactly the right tech stack. Deployed in 6 weeks as promised."',
    meta: 'EdTech · Web + Mobile · ₹3.8L project',
  },
  {
    name: 'Mohammed Viqar',
    company: 'ShopX Marketplace',
    initials: 'MV',
    avatarBg: '#f3e8ff',
    avatarText: '#6b21a8',
    rating: 4,
    text: '"AI chatbot resolved most queries instantly. Delivery was on time and the app handles peak load very well."',
    meta: 'E-commerce · Multi-vendor · ₹6.5L project',
  },
  {
    name: 'Priya Mehta',
    company: 'MediBook Health',
    initials: 'PM',
    avatarBg: '#dbeafe',
    avatarText: '#1e40af',
    rating: 5,
    text: '"HIPAA-compliant architecture, WebRTC video calls, e-prescriptions — all delivered perfectly. Highly professional team."',
    meta: 'Healthcare · Web app · ₹5.1L project',
  },
  {
    name: 'Amit Singh',
    company: 'FinTrack SaaS',
    initials: 'AS',
    avatarBg: '#ccfbf1',
    avatarText: '#115e59',
    rating: 5,
    text: '"Multi-tenant SaaS delivered with real-time dashboards, role-based access, and bank API integration. Exceeded expectations."',
    meta: 'SaaS · Dashboard · ₹3.2L project',
  },
  {
    name: 'Sneha Reddy',
    company: 'GrowMore Marketing',
    initials: 'SR',
    avatarBg: '#fce7f3',
    avatarText: '#9d174d',
    rating: 5,
    text: '"The marketing AI module generated perfect SEO keywords and ad copy for our niche. Website traffic increased 3x in 2 months."',
    meta: 'Marketing · Landing page + SEO · ₹1.8L project',
  },
]

const SUMMARY = [
  { label: 'Overall rating',   value: '4.9 / 5' },
  { label: 'Would recommend',  value: '97%' },
  { label: 'On-time delivery', value: '100%' },
]

function Stars({ count }: { count: number }) {
  return (
    <Box sx={{ display: 'flex', gap: 0.25 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          component="span"
          sx={{ fontSize: '0.875rem', color: i <= count ? '#fbbf24' : 'var(--border)' }}
        >
          ★
        </Box>
      ))}
    </Box>
  )
}

export default function ReviewsPage() {
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', width: '100%' }}>

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Client reviews</Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', mt: 0.5 }}>Real feedback from our clients</Typography>
      </Box>

      {/* Summary metrics */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3,1fr)' },
          gap: 1.5,
          mb: 3,
        }}
      >
        {SUMMARY.map((s) => (
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

      {/* Overall stars */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'var(--blue-light)',
          border: '1px solid var(--blue-light)',
          borderRadius: '12px',
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography sx={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--blue)' }}>4.9</Typography>
        <Box>
          <Stars count={5} />
          <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5 }}>Based on 41 client reviews</Typography>
        </Box>
      </Paper>

      {/* Section label */}
      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', mb: 1.5 }}>
        What clients say
      </Typography>

      {/* Review cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {reviews.map((r) => (
          <Paper
            key={r.name}
            elevation={0}
            sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '12px', p: 2 }}
          >
            {/* Reviewer info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: r.avatarBg,
                  color: r.avatarText,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {r.initials}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.name}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.company}
                </Typography>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <Stars count={r.rating} />
              </Box>
            </Box>

            {/* Review text */}
            <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 1, fontStyle: 'italic' }}>
              {r.text}
            </Typography>

            {/* Meta */}
            <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.meta}</Typography>
          </Paper>
        ))}
      </Box>

    </Box>
  )
}
