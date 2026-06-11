'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

interface FormData {
  name:         string
  email:        string
  phone:        string
  company:      string
  industry:     string
  budget:       string
  message:      string
  project_type: string
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.875rem',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'var(--blue)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--blue)' },
  },
  '& .MuiInputLabel-root': { color: 'var(--text-muted)', fontSize: '0.875rem' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'var(--blue)' },
} as const

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    name: '', email: '', phone: '', company: '',
    industry: '', budget: '', message: '', project_type: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in name, email and message')
      return
    }
    setLoading(true)
    setError('')

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      await fetch(API_URL + '/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setSubmitted(true)
    } catch {
      // Even if backend fails, show success to user
      setSubmitted(true)
    }
    setLoading(false)
  }

  const contactInfo = [
    {
      icon: <MessageCircle size={20} />,
      label: 'WhatsApp',
      value: '+91 XXXXX XXXXX',
      sub: 'Fastest response — usually within 30 mins',
      href: 'https://wa.me/91XXXXXXXXXX',
      bg: '#f0fdf4',
      fg: '#16a34a',
    },
    {
      icon: <Mail size={20} />,
      label: 'Email',
      value: 'yasharth@devlaunch.in',
      sub: 'For detailed queries and proposals',
      href: 'mailto:yasharth@devlaunch.in',
      bg: 'var(--blue-light)',
      fg: 'var(--blue)',
    },
    {
      icon: <MapPin size={20} />,
      label: 'Location',
      value: 'Kanpur, Uttar Pradesh',
      sub: 'Serving clients across India remotely',
      href: '#',
      bg: '#fef2f2',
      fg: '#ef4444',
    },
    {
      icon: <Clock size={20} />,
      label: 'Working hours',
      value: 'Mon–Sat, 10am–7pm IST',
      sub: 'AI chatbot available 24/7',
      href: '#',
      bg: '#faf5ff',
      fg: '#9333ea',
    },
  ]

  const faqs = [
    { q: 'How long does a project take?',          a: 'Typically 6-10 weeks depending on complexity. Simple websites take 2-3 weeks, full apps with mobile take 8-12 weeks.' },
    { q: 'What is included in the price?',          a: 'Design, frontend, backend, database, deployment, SSL, hosting setup and 30 days post-launch support.' },
    { q: 'Do you work with clients outside Kanpur?', a: 'Yes! We work 100% remotely with clients across India. Most communication happens on our platform + WhatsApp.' },
    { q: 'Can I get a free demo first?',            a: 'Absolutely. You can register and use the platform for free. Our AI wizard gives you an instant cost estimate.' },
    { q: 'What happens after project delivery?',    a: 'We offer monthly maintenance plans starting at ₹3,000/month for bug fixes and minor updates.' },
    { q: 'Do you offer EMI or payment installments?', a: 'Yes. Most projects are split 30% upfront + 40% mid-project + 30% on delivery. We also offer 3-month EMI.' },
  ]

  const eyebrowSx = { fontSize: '0.75rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.1em' } as const

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-primary)' }}>

      {/* Nav */}
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
      <Box component="section" sx={{ py: { xs: 8, md: 8 }, px: 3, bgcolor: 'var(--bg-secondary)', textAlign: 'center' }}>
        <Box sx={{ maxWidth: 672, mx: 'auto' }}>
          <Typography sx={{ ...eyebrowSx, mb: 2 }}>Get in touch</Typography>
          <Typography component="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', mb: 2 }}>
            Let&apos;s build something<br />
            <Box component="span" sx={{ color: 'var(--blue)' }}>great together</Box>
          </Typography>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>
            Fill the form below or WhatsApp us directly. We respond within 30 minutes during business hours.
          </Typography>
        </Box>
      </Box>

      <Box component="section" sx={{ py: 6, px: 3 }}>
        <Box sx={{ maxWidth: 1152, mx: 'auto', display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, gap: 5 }}>

          {/* Contact info */}
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
              {contactInfo.map(c => (
                <Paper
                  key={c.label}
                  component="a"
                  href={c.href}
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    bgcolor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s',
                    '&:hover': { borderColor: 'var(--blue)' },
                  }}
                >
                  <Box sx={{ width: 40, height: 40, borderRadius: '12px', bgcolor: c.bg, color: c.fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {c.icon}
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.25 }}>{c.label}</Typography>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{c.value}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', mt: 0.25 }}>{c.sub}</Typography>
                  </Box>
                </Paper>
              ))}
            </Box>

            {/* Quick action */}
            <Paper elevation={0} sx={{ bgcolor: '#16a34a', borderRadius: '16px', p: 2.5, color: '#fff' }}>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 900, mb: 1 }}>💬 WhatsApp us directly</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.7, mb: 2 }}>
                Fastest way to reach us. Send a message and we&apos;ll get back within 30 minutes.
              </Typography>
              <Button
                component="a"
                href="https://wa.me/91XXXXXXXXXX"
                target="_blank"
                rel="noreferrer"
                fullWidth
                disableElevation
                sx={{ bgcolor: '#fff', color: '#16a34a', fontWeight: 700, py: 1.25, borderRadius: '12px', fontSize: '0.875rem', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}
              >
                Open WhatsApp →
              </Button>
            </Paper>
          </Box>

          {/* Contact form */}
          <Box>
            {submitted ? (
              <Paper elevation={0} sx={{ bgcolor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', p: 6, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '3rem', mb: 2 }}>🎉</Typography>
                <Typography component="h3" sx={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', mb: 1.5 }}>
                  Message received!
                </Typography>
                <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, mb: 3 }}>
                  Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  In the meantime, try our free AI wizard to get an instant cost estimate.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    href="/register"
                    disableElevation
                    variant="contained"
                    endIcon={<ArrowRight size={16} />}
                    sx={{ bgcolor: 'var(--blue)', color: '#fff', fontWeight: 700, px: 3, py: 1.5, borderRadius: '12px', fontSize: '0.875rem', textTransform: 'none', '&:hover': { bgcolor: 'var(--blue-dark)' } }}
                  >
                    Try AI wizard free
                  </Button>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outlined"
                    sx={{ px: 3, py: 1.5, border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'none', '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' } }}
                  >
                    Send another
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 4 }}>
                <Typography component="h2" sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', mb: 3 }}>
                  Tell us about your project
                </Typography>

                {error && (
                  <Box sx={{ bgcolor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: '0.875rem', borderRadius: '12px', px: 2, py: 1.5, mb: 2.5 }}>
                    {error}
                  </Box>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <TextField
                      label="Your name *"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Rajesh Kumar"
                      size="small"
                      fullWidth
                      sx={fieldSx}
                    />
                    <TextField
                      label="Email address *"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="rajesh@clinic.com"
                      size="small"
                      fullWidth
                      sx={fieldSx}
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <TextField
                      label="Phone / WhatsApp"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      size="small"
                      fullWidth
                      sx={fieldSx}
                    />
                    <TextField
                      label="Company name"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Sharma Dental Clinic"
                      size="small"
                      fullWidth
                      sx={fieldSx}
                    />
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
                    <TextField
                      select
                      label="Industry"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      sx={fieldSx}
                    >
                      <MenuItem value="">Select industry...</MenuItem>
                      <MenuItem value="Healthcare / Dental">Healthcare / Dental</MenuItem>
                      <MenuItem value="Real Estate / Builders">Real Estate / Builders</MenuItem>
                      <MenuItem value="Travel & Hospitality">Travel & Hospitality</MenuItem>
                      <MenuItem value="Education / EdTech">Education / EdTech</MenuItem>
                      <MenuItem value="Restaurant / Food">Restaurant / Food</MenuItem>
                      <MenuItem value="E-commerce / Retail">E-commerce / Retail</MenuItem>
                      <MenuItem value="CA / Finance">CA / Finance</MenuItem>
                      <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                    <TextField
                      select
                      label="Budget range"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      size="small"
                      fullWidth
                      sx={fieldSx}
                    >
                      <MenuItem value="">Select budget...</MenuItem>
                      <MenuItem value="Under ₹50,000">Under ₹50,000</MenuItem>
                      <MenuItem value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</MenuItem>
                      <MenuItem value="₹1,00,000 – ₹3,00,000">₹1,00,000 – ₹3,00,000</MenuItem>
                      <MenuItem value="₹3,00,000 – ₹5,00,000">₹3,00,000 – ₹5,00,000</MenuItem>
                      <MenuItem value="Above ₹5,00,000">Above ₹5,00,000</MenuItem>
                    </TextField>
                  </Box>

                  <TextField
                    label="What do you want to build? *"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    placeholder="Tell us about your project — what problem you want to solve, what features you need, any specific requirements..."
                    fullWidth
                    sx={fieldSx}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    fullWidth
                    disableElevation
                    variant="contained"
                    endIcon={!loading && <ArrowRight size={16} />}
                    sx={{ bgcolor: 'var(--blue)', color: '#fff', fontWeight: 700, py: 1.75, borderRadius: '12px', fontSize: '0.875rem', textTransform: 'none', '&:hover': { bgcolor: 'var(--blue-dark)' }, '&.Mui-disabled': { opacity: 0.5, color: '#fff', bgcolor: 'var(--blue)' } }}
                  >
                    {loading ? 'Sending...' : 'Send message'}
                  </Button>

                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Or skip the form —{' '}
                    <Box component={Link} href="/register" sx={{ color: 'var(--blue)', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      try our free AI wizard
                    </Box>
                    {' '}and get an instant estimate
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Box>

      {/* FAQ */}
      <Box component="section" sx={{ py: { xs: 8, md: 10 }, px: 3, bgcolor: 'var(--bg-secondary)' }}>
        <Box sx={{ maxWidth: 768, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography sx={{ ...eyebrowSx, mb: 1.5 }}>FAQ</Typography>
            <Typography component="h2" sx={{ fontSize: { xs: '1.875rem', md: '2.25rem' }, fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Common questions</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {faqs.map((faq, i) => (
              <Paper key={i} elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 3 }}>
                <Typography component="h3" sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', mb: 1 }}>
                  {faq.q}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{faq.a}</Typography>
              </Paper>
            ))}
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
          <Box component={Link} href="/about" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#d1d5db' } }}>About</Box>
          <Box component="span" sx={{ mx: 1.5 }}>·</Box>
          <Box component={Link} href="/register" sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: '#d1d5db' } }}>Get started</Box>
        </Typography>
      </Box>

    </Box>
  )
}
