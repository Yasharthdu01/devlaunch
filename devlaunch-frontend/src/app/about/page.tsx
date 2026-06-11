'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'

const values = [
  {
    icon: '🎯',
    title: 'Transparency first',
    desc: 'No black box. Clients see every milestone, every task, every update in real time. We believe trust is built through visibility.',
  },
  {
    icon: '⚡',
    title: 'Speed without compromise',
    desc: 'We deliver in 6-10 weeks because we run frontend and backend in parallel — not sequentially like traditional agencies.',
  },
  {
    icon: '🤖',
    title: 'AI-powered everything',
    desc: 'From onboarding to proposals to chatbot support — AI reduces our overhead so we can charge less and deliver more.',
  },
  {
    icon: '🤝',
    title: 'Long-term partnership',
    desc: 'We dont disappear after delivery. Monthly maintenance plans, support tickets, and feature updates — we grow with you.',
  },
]

const team = [
  {
    name:    'Yasharth Dubey',
    role:    'Founder & Lead Developer',
    bio:     '1.5+ years as SDE at Hackett Group. Full-stack engineer specializing in Next.js, Node.js, PostgreSQL and AI integrations. Built DevLaunch from scratch.',
    initials: 'YD',
    skills:  ['Next.js', 'Node.js', 'PostgreSQL', 'AI/LLM', 'AWS'],
  },
]

const milestones = [
  { year: '2024', event: 'Started as a freelance developer building websites for local businesses in Kanpur' },
  { year: 'Early 2025', event: 'Joined Hackett Group as SDE — built AI-powered SaaS platforms for enterprise clients' },
  { year: 'Mid 2025', event: 'Identified the gap — Indian SMBs need software but agencies are slow, opaque and expensive' },
  { year: 'Late 2025', event: 'Started building DevLaunch — an AI-powered delivery platform with full client transparency' },
  { year: '2026', event: 'DevLaunch launched publicly — 40+ clients onboarded, 48+ projects delivered across India' },
]

const stats = [
  { num: '48+',  label: 'Projects delivered'    },
  { num: '40+',  label: 'Happy clients'          },
  { num: '12',   label: 'Industries served'      },
  { num: '4.9★', label: 'Average client rating'  },
  { num: '6-10', label: 'Weeks avg. delivery'    },
  { num: '100%', label: 'On-time delivery rate'  },
]

const comparisons = [
  { them: 'Call/email to get started — takes days',       us: 'AI wizard onboarding — done in 10 minutes'          },
  { them: 'Quote takes 3-7 days to arrive',               us: 'Instant AI cost estimate on the platform'           },
  { them: 'No visibility into what is happening',          us: 'Live project tracker — every milestone visible'     },
  { them: 'Proposal is a vague Word document',            us: 'AI-generated PDF with scope, timeline, cost'        },
  { them: 'Communication only on WhatsApp groups',        us: 'Built-in tasks, comments, file uploads'             },
  { them: 'Support ends after delivery',                   us: 'Monthly maintenance + 24/7 AI chatbot support'     },
  { them: '6+ months delivery timeline',                   us: '6-10 weeks — frontend + backend in parallel'       },
  { them: 'Hidden charges surprise you at the end',       us: 'Transparent pricing — no surprises ever'            },
]

const eyebrowSx = { fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em' } as const
const sectionPy = { py: { xs: 8, md: 10 }, px: 3 }

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-primary)' }}>

      {/* Simple nav */}
      <Box
        component="nav"
        sx={{
          borderBottom: '1px solid var(--border)',
          bgcolor: 'var(--bg-primary)',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Typography component={Link} href="/" sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--blue)', textDecoration: 'none' }}>
          Dev<Box component="span" sx={{ color: 'var(--text-primary)' }}>Launch</Box>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography
            component={Link}
            href="/"
            sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', '&:hover': { color: 'var(--blue)' } }}
          >
            ← Back to home
          </Typography>
          <Button
            component={Link}
            href="/register"
            disableElevation
            variant="contained"
            sx={{ bgcolor: 'var(--blue)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, px: 2, py: 1, borderRadius: '12px', textTransform: 'none', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
          >
            Get started free
          </Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box component="section" sx={{ ...sectionPy, py: { xs: 10, md: 12 }, bgcolor: 'var(--bg-secondary)', textAlign: 'center' }}>
        <Box sx={{ maxWidth: 768, mx: 'auto' }}>
          <Chip
            label="🇮🇳 Built in India, for India"
            sx={{ bgcolor: 'var(--blue-light)', color: 'var(--blue)', fontSize: '0.75rem', fontWeight: 700, mb: 4, border: '1px solid var(--blue)', borderRadius: '9999px' }}
          />
          <Typography
            component="h1"
            sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', mb: 3, lineHeight: 1.1 }}
          >
            We exist because Indian SMBs<br />
            <Box component="span" sx={{ color: 'var(--blue)' }}>deserve better software</Box>
          </Typography>
          <Typography sx={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: 1.7, mb: 5 }}>
            Most agencies take your money, disappear for months and deliver something you didn&apos;t ask for.
            DevLaunch is built differently — transparent, fast, AI-powered and client-first.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/register"
              disableElevation
              variant="contained"
              endIcon={<ArrowRight size={16} />}
              sx={{ bgcolor: 'var(--blue)', color: '#fff', fontWeight: 700, px: 3, py: 1.5, borderRadius: '12px', fontSize: '0.875rem', textTransform: 'none', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
            >
              Start your project
            </Button>
            <Button
              component={Link}
              href="/contact"
              disableElevation
              variant="outlined"
              sx={{ bgcolor: 'var(--bg-primary)', color: 'var(--text-secondary)', fontWeight: 700, px: 3, py: 1.5, borderRadius: '12px', fontSize: '0.875rem', textTransform: 'none', borderColor: 'var(--border)', '&:hover': { borderColor: 'var(--blue)', bgcolor: 'var(--bg-primary)' } }}
            >
              Talk to us
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Box component="section" sx={{ py: 6, px: 3, bgcolor: 'var(--bg-primary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <Box sx={{ maxWidth: 1024, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' }, gap: 3 }}>
          {stats.map(s => (
            <Box key={s.label} sx={{ textAlign: 'center' }}>
              <Typography sx={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--blue)' }}>{s.num}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5, lineHeight: 1.2 }}>{s.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Story */}
      <Box component="section" sx={{ ...sectionPy, bgcolor: 'var(--bg-secondary)' }}>
        <Box sx={{ maxWidth: 1152, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 6, md: 8 }, alignItems: 'center' }}>
          <Box>
            <Typography sx={{ ...eyebrowSx, mb: 2 }}>Our story</Typography>
            <Typography component="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', mb: 3 }}>
              Why we built DevLaunch
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.7, mb: 2, fontSize: '0.875rem' }}>
              After working as an SDE at Hackett Group and building AI-powered SaaS platforms for enterprise clients, I noticed something painful — the same technology that large companies use was completely out of reach for small Indian businesses.
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.7, mb: 2, fontSize: '0.875rem' }}>
              A dental clinic owner in Lucknow has to manage appointments on paper. A travel agency in Varanasi still takes bookings over phone calls. A builder in Kanpur tracks leads in a notebook. They all know they need software — but agencies are expensive, slow and zero accountability.
            </Typography>
            <Typography sx={{ color: 'var(--text-muted)', lineHeight: 1.7, mb: 3, fontSize: '0.875rem' }}>
              So I built DevLaunch — a platform where clients onboard themselves in 10 minutes with an AI wizard, get an instant proposal, track their project live, and get their product delivered in 6-10 weeks. No black box. No surprises.
            </Typography>
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, bgcolor: 'var(--blue-light)', borderRadius: '12px', border: '1px solid var(--blue)' }}>
              <Avatar sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'var(--blue)', color: '#fff', fontSize: '0.875rem', fontWeight: 900, flexShrink: 0 }}>
                YD
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Yasharth Dubey</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Founder, DevLaunch</Typography>
              </Box>
            </Paper>
          </Box>

          {/* Timeline */}
          <Box>
            <Typography sx={{ ...eyebrowSx, mb: 3 }}>Our journey</Typography>
            <Box>
              {milestones.map((m, i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2, pb: 3, position: 'relative' }}>
                  {i < milestones.length - 1 && (
                    <Box sx={{ position: 'absolute', left: 16, top: 32, bottom: 0, width: '1px', bgcolor: 'var(--border)' }} />
                  )}
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: 'var(--blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 900, flexShrink: 0, zIndex: 1 }}>
                    {i + 1}
                  </Box>
                  <Box sx={{ flex: 1, pt: 0.5, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', mb: 0.5 }}>{m.year}</Typography>
                    <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{m.event}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Values */}
      <Box component="section" sx={{ ...sectionPy, bgcolor: 'var(--bg-primary)' }}>
        <Box sx={{ maxWidth: 1152, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography sx={{ ...eyebrowSx, mb: 1.5 }}>Our values</Typography>
            <Typography component="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              What we believe in
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.5 }}>
            {values.map(v => (
              <Paper
                key={v.title}
                elevation={0}
                sx={{ bgcolor: 'var(--bg-secondary)', borderRadius: '16px', p: 3, border: '1px solid var(--border)', transition: 'border-color 0.2s', '&:hover': { borderColor: 'var(--blue)' } }}
              >
                <Typography sx={{ fontSize: '1.875rem', mb: 2 }}>{v.icon}</Typography>
                <Typography component="h3" sx={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>{v.title}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{v.desc}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Team */}
      <Box component="section" sx={{ ...sectionPy, bgcolor: 'var(--bg-secondary)' }}>
        <Box sx={{ maxWidth: 896, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography sx={{ ...eyebrowSx, mb: 1.5 }}>The team</Typography>
            <Typography component="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Who builds DevLaunch
            </Typography>
          </Box>
          {team.map(member => (
            <Paper
              key={member.name}
              elevation={0}
              sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'flex-start' }}
            >
              <Avatar variant="rounded" sx={{ width: 80, height: 80, borderRadius: '16px', bgcolor: 'var(--blue-light)', color: 'var(--blue)', fontSize: '1.5rem', fontWeight: 900, flexShrink: 0 }}>
                {member.initials}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography component="h3" sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', mb: 0.5 }}>{member.name}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--blue)', fontWeight: 600, mb: 1.5 }}>{member.role}</Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7, mb: 2 }}>{member.bio}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {member.skills.map(skill => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ fontSize: '0.75rem', bgcolor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', borderRadius: '9999px', fontWeight: 500 }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* What makes us different */}
      <Box component="section" sx={{ ...sectionPy, bgcolor: 'var(--bg-primary)' }}>
        <Box sx={{ maxWidth: 1152, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography sx={{ ...eyebrowSx, mb: 1.5 }}>Why choose us</Typography>
            <Typography component="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              DevLaunch vs traditional agencies
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
            {comparisons.map((row, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 1.5 }}>
                <Paper elevation={0} sx={{ bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', p: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#f87171', mb: 1 }}>❌ Others</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6 }}>{row.them}</Typography>
                </Paper>
                <Paper elevation={0} sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', p: 2 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', mb: 1 }}>✅ DevLaunch</Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>{row.us}</Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* CTA */}
      <Box component="section" sx={{ ...sectionPy, bgcolor: 'var(--blue)', textAlign: 'center' }}>
        <Box sx={{ maxWidth: 672, mx: 'auto' }}>
          <Typography component="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 900, color: '#fff', mb: 2 }}>Ready to get started?</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '1rem', mb: 4, lineHeight: 1.7 }}>
            Join 40+ businesses who chose DevLaunch for transparent, fast and AI-powered delivery.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              href="/register"
              disableElevation
              variant="contained"
              endIcon={<ArrowRight size={16} />}
              sx={{ bgcolor: '#fff', color: 'var(--blue)', fontWeight: 700, px: 4, py: 2, borderRadius: '16px', fontSize: '0.875rem', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
            >
              Start project wizard
            </Button>
            <Button
              component={Link}
              href="/contact"
              disableElevation
              variant="outlined"
              sx={{ bgcolor: 'transparent', color: '#fff', fontWeight: 700, px: 4, py: 2, borderRadius: '16px', fontSize: '0.875rem', textTransform: 'none', border: '2px solid rgba(255,255,255,0.4)', '&:hover': { border: '2px solid rgba(255,255,255,0.7)', bgcolor: 'transparent' } }}
            >
              Contact us
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: '#030712', color: '#fff', py: 4, px: 3, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>
          © 2026 DevLaunch · Built in Kanpur, India 🇮🇳
          <Box component="span" sx={{ mx: 1.5 }}>·</Box>
          <Box component={Link} href="/" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#d1d5db' } }}>Home</Box>
          <Box component="span" sx={{ mx: 1.5 }}>·</Box>
          <Box component={Link} href="/contact" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#d1d5db' } }}>Contact</Box>
          <Box component="span" sx={{ mx: 1.5 }}>·</Box>
          <Box component={Link} href="/register" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#d1d5db' } }}>Get started</Box>
        </Typography>
      </Box>

    </Box>
  )
}
