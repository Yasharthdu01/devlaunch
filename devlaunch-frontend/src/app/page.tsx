'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Sun, Moon, Menu, X, ArrowRight, CheckCircle, Star, ChevronDown } from 'lucide-react'
import { waLink } from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

// ── Nav ────────────────────────────────────────────────
function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted,    setMounted]    = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'WhatsApp AI', href: '/whatsapp'   },
    { label: 'Free Audit',  href: '/audit'      },
    { label: 'Services',    href: '#services'   },
    { label: 'Industries',  href: '#industries' },
    { label: 'Process',     href: '#process'    },
    { label: 'Portfolio',   href: '#portfolio'  },
    { label: 'Pricing',     href: '#pricing'    },
    { label: 'About',       href: '/about'      },
    { label: 'Contact',     href: '/contact'    },
  ]

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s',
        ...(scrolled
          ? {
              bgcolor: 'var(--bg-primary)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              borderBottom: '1px solid var(--border)',
            }
          : { bgcolor: 'transparent' }),
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Typography
          component={Link}
          href="/"
          sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--blue)', letterSpacing: '-0.02em', textDecoration: 'none' }}
        >
          Dev<Box component="span" sx={{ color: 'var(--text-primary)' }}>Launch</Box>
        </Typography>

        {/* Desktop links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
          {navLinks.map(l => (
            <Box
              key={l.href}
              component="a"
              href={l.href}
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s',
                '&:hover': { color: 'var(--blue)' },
              }}
            >
              {l.label}
            </Box>
          ))}
        </Box>

        {/* Right actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {mounted && (
            <Button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              disableElevation
              sx={{
                minWidth: 0,
                width: 36,
                height: 36,
                p: 0,
                borderRadius: '12px',
                bgcolor: 'var(--bg-tertiary)',
                color: theme === 'dark' ? '#facc15' : 'var(--text-secondary)',
                '&:hover': { bgcolor: 'var(--border)' },
              }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          )}
          <Button
            component={Link}
            href="/login"
            disableElevation
            sx={{
              display: { xs: 'none', md: 'block' },
              minWidth: 0,
              p: 0,
              textTransform: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              '&:hover': { color: 'var(--blue)', bgcolor: 'transparent' },
            }}
          >
            Sign in
          </Button>
          <Button
            component={Link}
            href="/register"
            disableElevation
            variant="contained"
            sx={{
              bgcolor: 'var(--blue)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              px: 2,
              py: 1,
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--blue-dark)' },
            }}
          >
            Get started free
          </Button>
          <Button
            onClick={() => setMobileOpen(!mobileOpen)}
            disableElevation
            sx={{
              display: { xs: 'flex', md: 'none' },
              minWidth: 0,
              width: 36,
              height: 36,
              p: 0,
              color: 'var(--text-secondary)',
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </Box>
      </Box>

      {/* Mobile menu */}
      {mobileOpen && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            bgcolor: 'var(--bg-primary)',
            borderTop: '1px solid var(--border)',
            px: 3,
            py: 2,
          }}
        >
          {navLinks.map(l => (
            <Box
              key={l.href}
              component="a"
              href={l.href}
              onClick={() => setMobileOpen(false)}
              sx={{
                display: 'block',
                py: 1.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              {l.label}
            </Box>
          ))}
          <Box sx={{ display: 'flex', gap: 1.5, pt: 2 }}>
            <Button
              component={Link}
              href="/login"
              fullWidth
              variant="outlined"
              disableElevation
              sx={{
                flex: 1,
                py: 1,
                borderColor: 'var(--border)',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              Sign in
            </Button>
            <Button
              component={Link}
              href="/register"
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                flex: 1,
                py: 1,
                bgcolor: 'var(--blue)',
                color: '#fff',
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                '&:hover': { bgcolor: 'var(--blue-dark)' },
              }}
            >
              Get started
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

// ── Hero ───────────────────────────────────────────────
function Hero() {
  return (
    <Box
      component="section"
      sx={{
        pt: 12,
        pb: { xs: 8, md: 10 },
        px: 3,
        bgcolor: 'var(--bg-primary)',
      }}
    >
      <Box sx={{ maxWidth: 1024, mx: 'auto', textAlign: 'center' }}>

        <Chip
          label="🚀 India's AI-powered software delivery platform"
          sx={{
            mb: 4,
            bgcolor: 'var(--bg-tertiary)',
            color: 'var(--blue)',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: '1px solid var(--border)',
            borderRadius: '9999px',
            height: 'auto',
            py: 1,
            '& .MuiChip-label': { px: 2 },
          }}
        />

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.75rem' },
            fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            mb: 3,
          }}
        >
          We Build Digital Products<br />
          <Box component="span" sx={{ color: 'var(--blue)' }}>That Grow Your Business</Box>
        </Typography>

        <Typography
          sx={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            maxWidth: 672,
            mx: 'auto',
            mb: 5,
            lineHeight: 1.7,
          }}
        >
          From dental clinics to real estate — we deliver full-stack web and mobile applications
          with AI automation in 6-10 weeks. Onboard yourself in 10 minutes with our AI wizard.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center', mb: 8 }}>
          <Button
            component={Link}
            href="/register"
            disableElevation
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            sx={{
              bgcolor: 'var(--blue)',
              color: '#fff',
              fontWeight: 700,
              px: 4,
              py: 1.75,
              borderRadius: '16px',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--blue-dark)' },
            }}
          >
            Start project wizard
          </Button>
          <Button
            component="a"
            href="#portfolio"
            disableElevation
            variant="outlined"
            sx={{
              bgcolor: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              fontWeight: 700,
              px: 4,
              py: 1.75,
              borderRadius: '16px',
              fontSize: '1rem',
              textTransform: 'none',
              borderColor: 'var(--border)',
              '&:hover': { borderColor: 'var(--blue)', bgcolor: 'var(--bg-secondary)' },
            }}
          >
            View our work
          </Button>
        </Box>

        {/* New product strip */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center', mb: 8 }}>
          <Box component={Link} href="/whatsapp"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.25, borderRadius: '9999px', textDecoration: 'none',
              bgcolor: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', transition: 'all 0.2s',
              '&:hover': { bgcolor: 'rgba(37,211,102,0.18)' } }}>
            <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#128C7E' }}>
              💬 New: WhatsApp AI receptionist from ₹999/mo
            </Box>
            <ArrowRight size={15} color="#128C7E" />
          </Box>
          <Box component={Link} href="/audit"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2.5, py: 1.25, borderRadius: '9999px', textDecoration: 'none',
              bgcolor: 'var(--bg-tertiary)', border: '1px solid var(--border)', transition: 'all 0.2s',
              '&:hover': { borderColor: 'var(--blue)' } }}>
            <Box component="span" sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--blue)' }}>
              ⚡ Free instant website audit
            </Box>
            <ArrowRight size={15} color="var(--blue)" />
          </Box>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
            gap: 3,
            maxWidth: 768,
            mx: 'auto',
          }}
        >
          {[
            { num: '48+',    label: 'Projects delivered' },
            { num: '40+',    label: 'Happy clients'       },
            { num: '6-10',   label: 'Weeks delivery'      },
            { num: '4.9★',   label: 'Client rating'       },
          ].map(s => (
            <Paper
              key={s.label}
              elevation={0}
              sx={{
                bgcolor: 'var(--bg-secondary)',
                borderRadius: '16px',
                p: 2,
                border: '1px solid var(--border)',
              }}
            >
              <Typography sx={{ fontSize: '1.875rem', fontWeight: 900, color: 'var(--blue)' }}>{s.num}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.5 }}>{s.label}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── Tech strip ────────────────────────────────────────
function TechStrip() {
  const techs = ['⚛️ React / Next.js', '🟢 Node.js', '🐘 PostgreSQL', '📱 React Native', '☁️ AWS / Vercel', '🤖 AI / LLM', '🔥 Firebase', '🐳 Docker']
  return (
    <Box sx={{ bgcolor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', py: 2 }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto', px: 3, display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
        {techs.map(t => (
          <Typography key={t} sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t}</Typography>
        ))}
      </Box>
    </Box>
  )
}

// ── Services ─────────────────────────────────────────
function Services() {
  const services = [
    { icon: '🌐', title: 'Web application',      desc: 'Custom portals, dashboards, booking systems and management platforms.',         tags: ['Next.js', 'Node.js', 'PostgreSQL'],   color: '#eff6ff' },
    { icon: '📱', title: 'Mobile application',   desc: 'iOS and Android apps with offline support and push notifications.',            tags: ['React Native', 'Flutter', 'Firebase'], color: '#f0fdf4' },
    { icon: '🤖', title: 'AI automation',         desc: 'Automate tasks, add AI chatbots, smart recommendations and workflows.',       tags: ['LLM', 'LangChain', 'Ollama'],          color: '#faf5ff' },
    { icon: '🛒', title: 'E-commerce platform',   desc: 'Multi-vendor stores, inventory, payment gateway and order tracking.',         tags: ['Razorpay', 'Stripe', 'Admin panel'],   color: '#fffbeb' },
    { icon: '📣', title: 'Digital marketing',     desc: 'SEO optimization, Google Ads, social media and landing pages.',               tags: ['SEO', 'Google Ads', 'Meta Ads'],       color: '#fdf2f8' },
    { icon: '🔧', title: 'Maintenance & support', desc: 'Monthly plans, bug fixes, feature updates and 24/7 technical support.',       tags: ['₹3,000/mo', 'Support', 'Updates'],     color: '#f0fdfa' },
  ]

  return (
    <Box component="section" id="services" sx={{ py: { xs: 8, md: 10 }, px: 3, bgcolor: 'var(--bg-primary)' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', mb: 7 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>What we build</Typography>
            <Typography component="h2" sx={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>End-to-end software<br />delivery services</Typography>
          </Box>
          <Typography sx={{ color: 'var(--text-muted)', maxWidth: 384, mt: { xs: 2, md: 0 }, lineHeight: 1.7, fontSize: '0.875rem' }}>
            We handle everything — design, development, deployment and maintenance.
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)', lg: 'repeat(3,1fr)' }, gap: 2.5 }}>
          {services.map(s => (
            <Paper
              key={s.title}
              elevation={0}
              sx={{
                bgcolor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                p: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'var(--blue)', boxShadow: '0 10px 15px rgba(0,0,0,0.08)' },
              }}
            >
              <Box sx={{ width: 48, height: 48, bgcolor: s.color, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', mb: 2.5 }}>
                {s.icon}
              </Box>
              <Typography component="h3" sx={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>{s.title}</Typography>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, mb: 2 }}>{s.desc}</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {s.tags.map(t => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    sx={{ bgcolor: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.75rem', borderRadius: '8px' }}
                  />
                ))}
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── Industries ────────────────────────────────────────
function Industries() {
  const industries = [
    { icon: '🏥', name: 'Healthcare & Dental',    desc: 'Appointment booking, patient management, telemedicine'       },
    { icon: '🏗️', name: 'Real Estate & Builders', desc: 'Property listings, lead management, project tracking'        },
    { icon: '✈️', name: 'Travel & Hospitality',   desc: 'Booking systems, itinerary apps, tour management'            },
    { icon: '🎓', name: 'Education & EdTech',      desc: 'LMS platforms, fee management, attendance tracking'          },
    { icon: '🛒', name: 'Retail & E-commerce',     desc: 'Online stores, inventory, multi-vendor marketplace'          },
    { icon: '🍽️', name: 'Restaurant & Food',       desc: 'Online ordering, table booking, kitchen management'          },
    { icon: '💼', name: 'CA & Finance',            desc: 'Client portal, document management, billing system'          },
    { icon: '🏭', name: 'Manufacturing',           desc: 'Inventory tracking, order management, supply chain'          },
  ]

  return (
    <Box component="section" id="industries" sx={{ py: { xs: 8, md: 10 }, px: 3, bgcolor: 'var(--bg-secondary)' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>Industries we serve</Typography>
          <Typography component="h2" sx={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Built for every industry</Typography>
          <Typography sx={{ color: 'var(--text-muted)', mt: 2, maxWidth: 576, mx: 'auto', fontSize: '0.875rem', lineHeight: 1.7 }}>
            From healthcare to real estate — we understand your specific needs and compliance requirements.
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' }, gap: 2 }}>
          {industries.map(ind => (
            <Paper
              key={ind.name}
              elevation={0}
              sx={{
                bgcolor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                p: 2.5,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { borderColor: 'var(--blue)', boxShadow: '0 4px 6px rgba(0,0,0,0.06)' },
              }}
            >
              <Box sx={{ fontSize: '1.875rem', mb: 1.5 }}>{ind.icon}</Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>{ind.name}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{ind.desc}</Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── Process ───────────────────────────────────────────
function Process() {
  const steps = [
    { num: '01', title: 'AI wizard',      desc: 'Fill 6 steps. Get instant tech stack + cost estimate', color: '#2563eb' },
    { num: '02', title: 'Proposal',       desc: 'AI generates full proposal PDF in 30 seconds',         color: '#4f46e5' },
    { num: '03', title: 'Design',         desc: 'Figma prototypes shared for your approval',            color: '#9333ea' },
    { num: '04', title: 'Development',    desc: 'Frontend + backend built in parallel',                 color: '#db2777' },
    { num: '05', title: 'Testing',        desc: 'Full QA + client feedback rounds',                     color: '#ea580c' },
    { num: '06', title: 'Live & support', desc: 'Deployed with CI/CD + monthly maintenance',            color: '#16a34a' },
  ]

  return (
    <Box component="section" id="process" sx={{ py: { xs: 8, md: 10 }, px: 3, bgcolor: 'var(--bg-primary)' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>How it works</Typography>
          <Typography component="h2" sx={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>From idea to live<br />in 6-10 weeks</Typography>
          <Typography sx={{ color: 'var(--text-muted)', mt: 2, maxWidth: 576, mx: 'auto', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Our AI-guided platform captures your requirements and delivers your product — with full transparency at every step.
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(3,1fr)', lg: 'repeat(6,1fr)' }, gap: 2 }}>
          {steps.map((s, i) => (
            <Box key={s.num} sx={{ position: 'relative', textAlign: 'center' }}>
              {i < steps.length - 1 && (
                <Box sx={{ display: { xs: 'none', lg: 'block' }, position: 'absolute', top: 24, left: '75%', width: '50%', height: '1px', bgcolor: 'var(--border)', zIndex: 0 }} />
              )}
              <Box sx={{ bgcolor: s.color, width: 48, height: 48, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '0.875rem', mx: 'auto', mb: 2, position: 'relative', zIndex: 10 }}>
                {s.num}
              </Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>{s.title}</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{s.desc}</Typography>
            </Box>
          ))}
        </Box>

        {/* Why us bullets */}
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            bgcolor: 'var(--blue)',
            borderRadius: '24px',
            p: 4,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' },
            gap: 3,
          }}
        >
          {[
            { icon: '🤖', title: 'AI wizard onboarding', desc: 'No calls, no emails. Clients onboard themselves in 10 minutes with our AI wizard.' },
            { icon: '📊', title: 'Live project tracker', desc: 'Clients see every milestone in real time. Zero black box. Full transparency.'       },
            { icon: '⚡', title: 'Instant proposal PDF', desc: 'AI generates scope, timeline and cost breakdown in 30 seconds — not 5 days.'       },
          ].map(w => (
            <Box key={w.title} sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ fontSize: '1.5rem', flexShrink: 0 }}>{w.icon}</Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', mb: 0.5 }}>{w.title}</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: 'var(--blue-light)', lineHeight: 1.7 }}>{w.desc}</Typography>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  )
}

// ── Portfolio ─────────────────────────────────────────
function Portfolio() {
  const projects = [
    { emoji: '✈️', bg: '#eff6ff',  badge: 'Delivered', badgeBg: '#dcfce7', badgeFg: '#15803d', title: 'TravelNest booking portal',    subtitle: 'Flight + hotel + tour management',  desc: 'Full-stack booking platform with real-time availability, Razorpay payments and admin CMS. Built in 8 weeks.',        tags: ['React', 'Node.js', 'PostgreSQL', 'AWS'] },
    { emoji: '🏥', bg: '#f0fdf4',  badge: 'Live',      badgeBg: '#dbeafe', badgeFg: '#1d4ed8', title: 'MediBook healthcare portal',   subtitle: 'Telemedicine + appointments',        desc: 'Multi-doctor video consultation, e-prescriptions, HIPAA-compliant architecture.',                                   tags: ['Vue.js', 'Django', 'WebRTC'] },
    { emoji: '🛒', bg: '#faf5ff',  badge: 'Growing',   badgeBg: '#f3e8ff', badgeFg: '#7e22ce', title: 'ShopX e-commerce marketplace', subtitle: 'Multi-vendor marketplace',           desc: 'Seller dashboard, AI recommendations, SEO-optimized pages and warehouse integrations.',                             tags: ['Next.js', 'Node.js', 'MongoDB'] },
    { emoji: '🎓', bg: '#fffbeb',  badge: 'Delivered', badgeBg: '#dcfce7', badgeFg: '#15803d', title: 'EdQuest learning platform',    subtitle: 'Full LMS platform',                  desc: 'Video courses, quiz engine, student dashboard, instructor panel and certificate generation.',                        tags: ['React', 'Django', 'AWS S3'] },
  ]

  return (
    <Box component="section" id="portfolio" sx={{ py: { xs: 8, md: 10 }, px: 3, bgcolor: 'var(--bg-secondary)' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'flex-end' }, justifyContent: 'space-between', mb: 7 }}>
          <Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>Our work</Typography>
            <Typography component="h2" sx={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Projects we've delivered</Typography>
          </Box>
          <Typography sx={{ color: 'var(--text-muted)', maxWidth: 384, mt: { xs: 2, md: 0 }, fontSize: '0.875rem', lineHeight: 1.7 }}>
            Real products for real businesses across India.
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2,1fr)' }, gap: 3 }}>
          {projects.map(p => (
            <Paper
              key={p.title}
              elevation={0}
              sx={{
                bgcolor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                overflow: 'hidden',
                transition: 'all 0.2s',
                '&:hover': { boxShadow: '0 10px 15px rgba(0,0,0,0.08)' },
              }}
            >
              <Box sx={{ bgcolor: p.bg, height: 176, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.75rem' }}>
                {p.emoji}
              </Box>
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5, mb: 1.5 }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography component="h3" sx={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{p.title}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25 }}>{p.subtitle}</Typography>
                  </Box>
                  <Chip
                    label={p.badge}
                    size="small"
                    sx={{ bgcolor: p.badgeBg, color: p.badgeFg, fontSize: '0.75rem', fontWeight: 700, borderRadius: '9999px', flexShrink: 0 }}
                  />
                </Box>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, mb: 2 }}>{p.desc}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {p.tags.map(t => (
                    <Chip
                      key={t}
                      label={t}
                      size="small"
                      sx={{ bgcolor: 'var(--bg-tertiary)', color: 'var(--text-muted)', fontSize: '0.75rem', borderRadius: '8px' }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── Pricing ───────────────────────────────────────────
function Pricing() {
  const plans = [
    {
      name: 'Starter', price: '₹19,999', period: '/month',
      desc: 'Perfect for small businesses getting started',
      features: ['Web application (5 pages)', 'Mobile responsive', 'Basic admin panel', 'Contact form + WhatsApp', 'SSL + hosting', 'Email support'],
      cta: 'Get started', featured: false,
    },
    {
      name: 'Professional', price: '₹29,999', period: '/month',
      desc: 'For growing businesses needing full features',
      features: ['Full web application', 'Mobile app (iOS + Android)', 'Advanced admin panel', 'Razorpay payment gateway', 'AI chatbot integration', 'SEO optimization', 'Priority support'],
      cta: 'Get started', featured: true,
    },
    {
      name: 'Enterprise', price: '₹49,999', period: '/month',
      desc: 'For established businesses needing custom solutions',
      features: ['Custom web + mobile app', 'AI automation workflows', 'Multi-location support', 'ERP / CRM integration', 'Dedicated developer', '40 hours/month', '24/7 support'],
      cta: 'Contact us', featured: false,
    },
  ]

  return (
    <Box component="section" id="pricing" sx={{ py: { xs: 8, md: 10 }, px: 3, bgcolor: 'var(--bg-primary)' }}>
      <Box sx={{ maxWidth: 1152, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>Transparent pricing</Typography>
          <Typography component="h2" sx={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Simple monthly plans</Typography>
          <Typography sx={{ color: 'var(--text-muted)', mt: 2, maxWidth: 576, mx: 'auto', fontSize: '0.875rem', lineHeight: 1.7 }}>
            No hidden charges. Cancel anytime. All plans include hosting, SSL and basic support.
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 2.5, alignItems: 'start' }}>
          {plans.map(plan => (
            <Paper
              key={plan.name}
              elevation={0}
              sx={{
                position: 'relative',
                borderRadius: '16px',
                p: 4,
                transition: 'all 0.2s',
                ...(plan.featured
                  ? { bgcolor: 'var(--blue)', color: '#fff', boxShadow: '0 20px 25px rgba(37,99,235,0.25)', transform: { md: 'scale(1.05)' } }
                  : { bgcolor: 'var(--bg-secondary)', border: '1px solid var(--border)', '&:hover': { boxShadow: '0 10px 15px rgba(0,0,0,0.08)' } }),
              }}
            >
              {plan.featured && (
                <Chip
                  label="Most popular"
                  sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#facc15', color: '#713f12', fontSize: '0.75rem', fontWeight: 900, borderRadius: '9999px', height: 'auto', py: 0.5 }}
                />
              )}
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1, color: plan.featured ? 'var(--blue-light)' : 'var(--text-muted)' }}>
                {plan.name}
              </Typography>
              <Typography sx={{ fontSize: '2.25rem', fontWeight: 900, mb: 0.5, color: plan.featured ? '#fff' : 'var(--text-primary)' }}>
                {plan.price}
                <Box component="span" sx={{ fontSize: '1rem', fontWeight: 400, color: plan.featured ? 'var(--blue-light)' : 'var(--text-muted)' }}>
                  {plan.period}
                </Box>
              </Typography>
              <Typography sx={{ fontSize: '0.875rem', mb: 3, color: plan.featured ? 'var(--blue-light)' : 'var(--text-muted)' }}>
                {plan.desc}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, mb: 4, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {plan.features.map(f => (
                  <Box component="li" key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.875rem', color: plan.featured ? '#fff' : 'var(--text-secondary)' }}>
                    <Box component="span" sx={{ flexShrink: 0, display: 'flex', color: plan.featured ? 'var(--blue-light)' : 'var(--blue)' }}>
                      <CheckCircle size={14} />
                    </Box>
                    {f}
                  </Box>
                ))}
              </Box>
              <Button
                component={Link}
                href="/register"
                fullWidth
                disableElevation
                variant="contained"
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  textTransform: 'none',
                  ...(plan.featured
                    ? { bgcolor: '#fff', color: 'var(--blue)', '&:hover': { bgcolor: 'var(--blue-light)' } }
                    : { bgcolor: 'var(--blue)', color: '#fff', '&:hover': { bgcolor: 'var(--blue-dark)' } }),
                }}
              >
                {plan.cta}
              </Button>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── Reviews ───────────────────────────────────────────
function Reviews() {
  const reviews = [
    { initials: 'RK', bg: '#dcfce7', fg: '#166534', name: 'Rajesh Kumar',    company: 'TravelNest Agency, Varanasi',   rating: 5, review: '"They built our entire travel portal in 8 weeks. The AI wizard was incredible — they understood our requirements perfectly. Best tech team in India."' },
    { initials: 'DM', bg: '#dbeafe', fg: '#1e40af', name: 'Dr. Meena Sharma', company: 'Sharma Dental Clinic, Lucknow', rating: 5, review: '"Our clinic\'s appointment system is fully automated now. Patients book online, we get notifications. No more missed appointments. Worth every rupee."' },
    { initials: 'MV', bg: '#f3e8ff', fg: '#6b21a8', name: 'Mohammed Viqar',   company: 'ShopX Marketplace, Delhi',      rating: 5, review: '"Our sales increased 3x after DevLaunch built our platform. The AI product recommendations are amazing. Very professional team."' },
  ]

  return (
    <Box component="section" id="reviews" sx={{ py: { xs: 8, md: 10 }, px: 3, bgcolor: 'var(--bg-secondary)' }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box sx={{ textAlign: 'center', mb: 7 }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em', mb: 1.5 }}>Client reviews</Typography>
          <Typography component="h2" sx={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>What our clients say</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 2 }}>
            {[1,2,3,4,5].map(i => <Box key={i} component="span" sx={{ display: 'flex', color: '#facc15' }}><Star size={18} fill="#facc15" /></Box>)}
            <Typography component="span" sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', ml: 1 }}>4.9 / 5 from 40+ clients</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 3 }}>
          {reviews.map(r => (
            <Paper
              key={r.name}
              elevation={0}
              sx={{
                bgcolor: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                p: 3,
                transition: 'all 0.2s',
                '&:hover': { boxShadow: '0 4px 6px rgba(0,0,0,0.06)' },
              }}
            >
              <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                {[1,2,3,4,5].map(i => <Box key={i} component="span" sx={{ display: 'flex', color: '#facc15' }}><Star size={14} fill="#facc15" /></Box>)}
              </Box>
              <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, fontStyle: 'italic', mb: 3 }}>{r.review}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: r.bg, color: r.fg, fontSize: '0.75rem', fontWeight: 900 }}>
                  {r.initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{r.name}</Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.company}</Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ── CTA ───────────────────────────────────────────────
function CTA() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 10 }, px: 3, bgcolor: 'var(--blue)' }}>
      <Box sx={{ maxWidth: 896, mx: 'auto', textAlign: 'center' }}>
        <Typography component="h2" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', mb: 3 }}>
          Ready to build your product?
        </Typography>
        <Typography sx={{ color: 'var(--blue-light)', fontSize: '1.125rem', mb: 5, lineHeight: 1.7 }}>
          Go through our 6-step AI wizard and get a detailed proposal with timeline
          and cost estimate within 24 hours.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
          <Button
            component={Link}
            href="/register"
            disableElevation
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            sx={{
              bgcolor: '#fff',
              color: 'var(--blue)',
              fontWeight: 700,
              px: 4,
              py: 1.75,
              borderRadius: '16px',
              fontSize: '1rem',
              textTransform: 'none',
              '&:hover': { bgcolor: 'var(--blue-light)' },
            }}
          >
            Start project wizard
          </Button>
          <Button
            component="a"
            href={waLink('Hi DevLaunch, I want to start a project')}
            target="_blank"
            rel="noreferrer"
            disableElevation
            sx={{
              bgcolor: 'transparent',
              color: '#fff',
              fontWeight: 700,
              px: 4,
              py: 1.75,
              borderRadius: '16px',
              fontSize: '1rem',
              textTransform: 'none',
              border: '2px solid rgba(255,255,255,0.4)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.7)', bgcolor: 'transparent' },
            }}
          >
            💬 WhatsApp us
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

// ── Footer ────────────────────────────────────────────
function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#030712', color: '#fff', py: 8, px: 3 }}>
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4,1fr)' }, gap: 5, mb: 6 }}>
          <Box>
            <Typography sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--blue-light)', mb: 1.5 }}>DevLaunch</Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#9ca3af', lineHeight: 1.7, mb: 2.5 }}>
              India's AI-powered software delivery platform for SMEs and growing businesses.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['in', 'tw', 'ig', 'wa'].map(s => (
                <Box
                  key={s}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '8px',
                    bgcolor: '#1f2937',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: '#374151' },
                  }}
                >
                  {s}
                </Box>
              ))}
            </Box>
          </Box>
          {[
            { title: 'Services',   links: ['Web development', 'Mobile apps', 'AI automation', 'E-commerce', 'Digital marketing'] },
            { title: 'Industries', links: ['Healthcare', 'Real estate', 'Travel', 'Education', 'Restaurant'] },
            { title: 'Company',    links: ['About us', 'Portfolio', 'Pricing', 'Blog', 'Contact'] },
          ].map(col => (
            <Box key={col.title}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280', mb: 2 }}>{col.title}</Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {col.links.map(l => (
                  <Box component="li" key={l}>
                    <Box component="a" href="#" sx={{ fontSize: '0.875rem', color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s', '&:hover': { color: '#fff' } }}>{l}</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
        <Box sx={{ borderTop: '1px solid #1f2937', pt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>© 2026 DevLaunch. All rights reserved.</Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box component="a" href="#" sx={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'none', '&:hover': { color: '#d1d5db' } }}>Privacy Policy</Box>
            <Box component="a" href="#" sx={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'none', '&:hover': { color: '#d1d5db' } }}>Terms of Service</Box>
            <Box component="a" href="#" sx={{ fontSize: '0.75rem', color: '#6b7280', textDecoration: 'none', '&:hover': { color: '#d1d5db' } }}>Contact</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ── Main page ─────────────────────────────────────────
export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-primary)' }}>
      <Navbar />
      <Box component="main">
        <Hero />
        <TechStrip />
        <Services />
        <Industries />
        <Process />
        <Portfolio />
        <Pricing />
        <Reviews />
        <CTA />
        <Footer />
      </Box>
    </Box>
  )
}
