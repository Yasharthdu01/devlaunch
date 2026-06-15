'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import API_URL, { waLink } from '@/lib/config'
import {
  ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Clock, CalendarCheck,
  Zap, Send, Loader2,
} from 'lucide-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

type Msg = { role: 'user' | 'bot'; content: string }

const TEMPLATES = [
  { id: 'dental',     emoji: '🦷', label: 'Dental clinic',  tagline: 'Appointment booking & reminders' },
  { id: 'realestate', emoji: '🏠', label: 'Real estate',    tagline: 'Lead qualifying & site visits'    },
  { id: 'restaurant', emoji: '🍽️', label: 'Restaurant',     tagline: 'Orders, tables & specials'        },
]

const PLANS = [
  { name: 'Starter',  price: '999',   period: '/mo', tagline: 'For solo shops & clinics',
    features: ['1 AI agent', '1 industry template', 'Up to 500 chats/mo', 'Appointment booking', 'WhatsApp number setup'], highlight: false },
  { name: 'Growth',   price: '1,999', period: '/mo', tagline: 'Most popular for SMBs',
    features: ['Everything in Starter', 'Up to 2,000 chats/mo', 'Lead capture to dashboard', 'Custom replies & menu', 'Daily summary on WhatsApp'], highlight: true },
  { name: 'Pro',      price: '2,999', period: '/mo', tagline: 'For busy multi-location teams',
    features: ['Everything in Growth', 'Unlimited chats', 'Multiple agents / branches', 'Payments & order links', 'Priority support'], highlight: false },
]

const HOW = [
  { Icon: MessageCircle, title: 'Customer messages you', text: 'A customer pings your WhatsApp number — day or night, holiday or not.' },
  { Icon: Zap,           title: 'AI replies instantly',  text: 'Your AI receptionist answers questions, shares prices and qualifies the lead.' },
  { Icon: CalendarCheck, title: 'It books & logs',        text: 'It books the appointment or takes the order, then logs the lead to your dashboard.' },
]

export default function WhatsAppProductPage() {
  const [template, setTemplate] = useState('dental')
  const [messages, setMessages] = useState<Msg[]>([])
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Lead form
  const [business, setBusiness] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [plan, setPlan] = useState('Growth')
  const [sent, setSent] = useState(false)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, typing])

  // Load the greeting whenever the template changes.
  useEffect(() => {
    let cancelled = false
    setMessages([]); setQuickReplies([]); setTyping(true)
    fetch(API_URL + '/api/whatsapp/demo', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template }),
    })
      .then(r => r.json())
      .then(d => { if (!cancelled) { setMessages([{ role: 'bot', content: d.reply }]); setQuickReplies(d.quickReplies || []) } })
      .catch(() => { if (!cancelled) setMessages([{ role: 'bot', content: 'Demo unavailable — is the backend running on port 5000?' }]) })
      .finally(() => { if (!cancelled) setTyping(false) })
    return () => { cancelled = true }
  }, [template])

  async function send(text?: string) {
    const msg = (text ?? input).trim()
    if (!msg) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: msg }])
    setTyping(true)
    try {
      const res = await fetch(API_URL + '/api/whatsapp/demo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, message: msg }),
      })
      const d = await res.json()
      // Small delay so it feels like someone typing.
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', content: d.reply }])
        setQuickReplies(d.quickReplies || [])
        setTyping(false)
      }, 600)
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: 'Demo unavailable right now.' }])
      setTyping(false)
    }
  }

  async function submitLead() {
    if (!phone.trim() && !name.trim()) return
    try {
      await fetch(API_URL + '/api/whatsapp/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business, name, phone, industry: template, plan }),
      })
    } catch { /* lead UX shouldn't fail loudly */ }
    setSent(true)
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--bg-primary)' }}>
      {/* Header */}
      <Box sx={{ borderBottom: '1px solid var(--border)', px: 3, py: 2 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component={Link} href="/" sx={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--blue)', textDecoration: 'none' }}>
            Dev<Box component="span" sx={{ color: 'var(--text-primary)' }}>Launch</Box>
          </Typography>
          <Button component={Link} href="/" startIcon={<ArrowLeft size={16} />}
            sx={{ textTransform: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Back to home
          </Button>
        </Box>
      </Box>

      {/* Hero + live demo */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: 3, py: { xs: 5, md: 7 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: { xs: 5, md: 6 }, alignItems: 'center' }}>
          {/* Left: pitch */}
          <Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.75, mb: 3, borderRadius: '9999px', bgcolor: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)' }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#25D366' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#128C7E' }}>Powered by WhatsApp Business</Typography>
            </Box>
            <Typography component="h1" sx={{ fontSize: { xs: '2.25rem', md: '3rem' }, fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.1, letterSpacing: '-0.02em', mb: 2.5 }}>
              Hire a WhatsApp<br />AI receptionist<br />
              <Box component="span" sx={{ color: '#25D366' }}>from ₹999/month</Box>
            </Typography>
            <Typography sx={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6, mb: 4 }}>
              Your customers already message on WhatsApp. Let an AI agent answer instantly,
              24×7 — booking appointments, sharing prices and capturing every lead, even while you sleep.
              No website needed. Live in 48 hours.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 4 }}>
              <Button component="a" href="#pricing" variant="contained" disableElevation endIcon={<ArrowRight size={18} />}
                sx={{ bgcolor: '#25D366', color: '#fff', fontWeight: 700, px: 3, py: 1.5, borderRadius: '14px', textTransform: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#1da851' } }}>
                See pricing
              </Button>
              <Button component="a" href="#demo" variant="outlined" disableElevation
                sx={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', fontWeight: 700, px: 3, py: 1.5, borderRadius: '14px', textTransform: 'none', fontSize: '1rem', '&:hover': { borderColor: '#25D366' } }}>
                Try the live demo ↓
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {[{ Icon: Clock, t: 'Replies in <2s' }, { Icon: CalendarCheck, t: 'Books 24×7' }, { Icon: CheckCircle2, t: 'Never misses a lead' }].map(s => (
                <Box key={s.t} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <s.Icon size={16} color="#25D366" />
                  <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.t}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right: live WhatsApp demo */}
          <Box id="demo">
            {/* Template switcher */}
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
              {TEMPLATES.map(t => (
                <Button key={t.id} onClick={() => setTemplate(t.id)} disableElevation
                  sx={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 600, borderRadius: '10px', px: 1.5, py: 0.75,
                    border: '1px solid', borderColor: template === t.id ? '#25D366' : 'var(--border)',
                    bgcolor: template === t.id ? 'rgba(37,211,102,0.1)' : 'transparent',
                    color: template === t.id ? '#128C7E' : 'var(--text-secondary)' }}>
                  {t.emoji} {t.label}
                </Button>
              ))}
            </Box>

            {/* Phone frame */}
            <Paper elevation={0} sx={{ border: '1px solid var(--border)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.12)' }}>
              {/* WA header */}
              <Box sx={{ bgcolor: '#075E54', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>AI</Box>
                <Box>
                  <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
                    {TEMPLATES.find(t => t.id === template)?.label} agent
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem' }}>
                    {typing ? 'typing…' : 'online'}
                  </Typography>
                </Box>
              </Box>

              {/* Messages */}
              <Box sx={{ bgcolor: '#ECE5DD', px: 2, py: 2, minHeight: 320, maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {messages.map((m, i) => (
                  <Box key={i} sx={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%', px: 1.5, py: 1, borderRadius: '10px', fontSize: '0.85rem', lineHeight: 1.45, whiteSpace: 'pre-wrap',
                    bgcolor: m.role === 'user' ? '#DCF8C6' : '#fff', color: '#111', boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
                    borderTopRightRadius: m.role === 'user' ? '2px' : '10px', borderTopLeftRadius: m.role === 'bot' ? '2px' : '10px' }}>
                    {m.content}
                  </Box>
                ))}
                {typing && (
                  <Box sx={{ alignSelf: 'flex-start', px: 2, py: 1.25, borderRadius: '10px', bgcolor: '#fff', boxShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[0, 150, 300].map(d => (
                        <Box key={d} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#9ca3af', animation: 'wabounce 1s infinite', animationDelay: `${d}ms`,
                          '@keyframes wabounce': { '0%,100%': { transform: 'translateY(0)', opacity: 0.4 }, '50%': { transform: 'translateY(-3px)', opacity: 1 } } }} />
                      ))}
                    </Box>
                  </Box>
                )}
                <Box ref={bottomRef} />
              </Box>

              {/* Quick replies */}
              {quickReplies.length > 0 && (
                <Box sx={{ bgcolor: '#ECE5DD', px: 2, pb: 1.5, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                  {quickReplies.map(q => (
                    <Box key={q} component="button" onClick={() => send(q)}
                      sx={{ cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, color: '#128C7E', bgcolor: '#fff', border: '1px solid #25D366', borderRadius: '14px', px: 1.25, py: 0.5 }}>
                      {q}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Input */}
              <Box sx={{ bgcolor: '#F0F0F0', px: 1.5, py: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send() }}
                  placeholder="Type a message…" size="small" fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: '20px', fontSize: '0.85rem' } }} />
                <Button onClick={() => send()} disableElevation
                  sx={{ minWidth: 0, width: 40, height: 40, p: 0, borderRadius: '50%', bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1da851' } }}>
                  <Send size={18} />
                </Button>
              </Box>
            </Paper>
            <Typography sx={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', mt: 1 }}>
              👆 This is a live demo — type anything or tap a suggestion
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* How it works */}
      <Box sx={{ bgcolor: 'var(--bg-secondary)', py: { xs: 6, md: 8 }, px: 3 }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Typography sx={{ textAlign: 'center', fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 900, color: 'var(--text-primary)', mb: 1, letterSpacing: '-0.02em' }}>
            How it works
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'var(--text-secondary)', mb: 5 }}>
            From customer message to booked appointment — fully automated.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 3 }}>
            {HOW.map((h, i) => (
              <Paper key={h.title} elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', p: 3 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '12px', bgcolor: 'rgba(37,211,102,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  <h.Icon size={24} color="#25D366" />
                </Box>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#25D366', mb: 0.5 }}>STEP {i + 1}</Typography>
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', mb: 1 }}>{h.title}</Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{h.text}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Pricing */}
      <Box id="pricing" sx={{ py: { xs: 6, md: 8 }, px: 3 }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Typography sx={{ textAlign: 'center', fontSize: { xs: '1.75rem', md: '2.25rem' }, fontWeight: 900, color: 'var(--text-primary)', mb: 1, letterSpacing: '-0.02em' }}>
            Simple, honest pricing
          </Typography>
          <Typography sx={{ textAlign: 'center', color: 'var(--text-secondary)', mb: 5 }}>
            No setup fees to start. Cancel anytime. One free month if you switch from another tool.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' }, gap: 3, alignItems: 'start' }}>
            {PLANS.map(p => (
              <Paper key={p.name} elevation={0}
                sx={{ position: 'relative', borderRadius: '18px', p: 3, border: '2px solid', borderColor: p.highlight ? '#25D366' : 'var(--border)',
                  bgcolor: p.highlight ? 'rgba(37,211,102,0.04)' : 'var(--bg-primary)', transform: { md: p.highlight ? 'scale(1.04)' : 'none' } }}>
                {p.highlight && (
                  <Box sx={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', bgcolor: '#25D366', color: '#fff', fontSize: '0.7rem', fontWeight: 800, px: 1.5, py: 0.5, borderRadius: '9999px' }}>
                    MOST POPULAR
                  </Box>
                )}
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{p.name}</Typography>
                <Typography sx={{ fontSize: '0.85rem', color: 'var(--text-muted)', mb: 2 }}>{p.tagline}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 2.5 }}>
                  <Typography sx={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--text-primary)' }}>₹{p.price}</Typography>
                  <Typography sx={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{p.period}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 3 }}>
                  {p.features.map(f => (
                    <Box key={f} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                      <CheckCircle2 size={18} color="#25D366" style={{ flexShrink: 0, marginTop: 1 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{f}</Typography>
                    </Box>
                  ))}
                </Box>
                <Button fullWidth onClick={() => { setPlan(p.name); document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' }) }}
                  variant={p.highlight ? 'contained' : 'outlined'} disableElevation
                  sx={{ py: 1.25, borderRadius: '12px', textTransform: 'none', fontWeight: 700,
                    ...(p.highlight ? { bgcolor: '#25D366', color: '#fff', '&:hover': { bgcolor: '#1da851' } }
                                    : { borderColor: 'var(--border)', color: 'var(--text-primary)', '&:hover': { borderColor: '#25D366' } }) }}>
                  Choose {p.name}
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Get started / lead capture */}
      <Box id="get-started" sx={{ bgcolor: 'var(--bg-secondary)', py: { xs: 6, md: 8 }, px: 3 }}>
        <Box sx={{ maxWidth: 560, mx: 'auto', textAlign: 'center' }}>
          {sent ? (
            <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '18px', p: 5 }}>
              <CheckCircle2 size={48} color="#25D366" style={{ marginBottom: 16 }} />
              <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', mb: 1 }}>You're in! 🎉</Typography>
              <Typography sx={{ color: 'var(--text-secondary)', mb: 3 }}>
                We'll set up your <b>{plan}</b> agent and message you within a few hours to go live.
              </Typography>
              <Button component="a" href={waLink(`Hi! I just signed up for a WhatsApp AI agent (${plan} plan) for my ${template} business. Let's get started!`)} target="_blank"
                variant="contained" disableElevation startIcon={<MessageCircle size={18} />}
                sx={{ bgcolor: '#25D366', color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', px: 3, '&:hover': { bgcolor: '#1da851' } }}>
                Message us now
              </Button>
            </Paper>
          ) : (
            <>
              <Typography sx={{ fontSize: { xs: '1.6rem', md: '2rem' }, fontWeight: 900, color: 'var(--text-primary)', mb: 1, letterSpacing: '-0.02em' }}>
                Get your AI agent live in 48 hours
              </Typography>
              <Typography sx={{ color: 'var(--text-secondary)', mb: 4 }}>
                Tell us about your business — we'll handle the setup and WhatsApp number.
              </Typography>
              <Paper elevation={0} sx={{ bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '18px', p: { xs: 3, md: 4 }, textAlign: 'left' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField value={business} onChange={e => setBusiness(e.target.value)} label="Business name" size="small" fullWidth
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                    <TextField value={name} onChange={e => setName(e.target.value)} label="Your name" size="small" fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                    <TextField value={phone} onChange={e => setPhone(e.target.value)} label="WhatsApp number" size="small" fullWidth
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.8rem', color: 'var(--text-muted)', mb: 1 }}>Selected plan</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {PLANS.map(p => (
                        <Button key={p.name} onClick={() => setPlan(p.name)} disableElevation
                          sx={{ textTransform: 'none', fontSize: '0.8rem', fontWeight: 600, borderRadius: '10px', px: 1.5, border: '1px solid',
                            borderColor: plan === p.name ? '#25D366' : 'var(--border)',
                            bgcolor: plan === p.name ? 'rgba(37,211,102,0.1)' : 'transparent',
                            color: plan === p.name ? '#128C7E' : 'var(--text-secondary)' }}>
                          {p.name} · ₹{p.price}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                  <Button onClick={submitLead} disabled={!phone.trim() && !name.trim()}
                    variant="contained" disableElevation endIcon={<ArrowRight size={18} />}
                    sx={{ py: 1.5, bgcolor: '#25D366', color: '#fff', fontWeight: 700, borderRadius: '12px', textTransform: 'none', fontSize: '1rem', '&:hover': { bgcolor: '#1da851' } }}>
                    Start my AI agent
                  </Button>
                  <Typography sx={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No credit card needed to start · We'll confirm everything on WhatsApp first
                  </Typography>
                </Box>
              </Paper>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}
