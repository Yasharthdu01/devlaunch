'use client'
import { useState, useRef, useEffect } from 'react'
import API_URL from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'

const quickChips = [
  'What tech stack for a travel booking app?',
  'How long to build a full portal?',
  'What is included in delivery?',
  'How does pricing work?',
  'Do you provide SEO support?',
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the DevLaunch AI assistant. I can help with tech stacks, timelines, cost estimates, and anything about building your application. What would you like to know?",
    },
  ])
  const [input,     setInput]     = useState('')
  const [loading,   setLoading]   = useState(false)
  const [escalated, setEscalated] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const userMsg = text || input.trim()
    if (!userMsg) return

    setInput('')
    const newMessages = [...messages, { role: 'user', content: userMsg }]
    setMessages(newMessages)
    setLoading(true)

    try {
      const history = newMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch(API_URL + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history,
        }),
      })

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])

    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Make sure the backend is running on port 5000.',
      }])
    }

    setLoading(false)
  }

  function handleEscalate() {
    setEscalated(true)
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: 'Connecting you to a human agent now. A team member will reach out to you within 2-5 minutes via email. In the meantime, feel free to continue describing your requirements.',
    }])
  }

  return (
    <Box sx={{ maxWidth: 672, mx: 'auto', width: '100%' }}>

      {/* Header card */}
      <Paper
        elevation={0}
        sx={{
          bgcolor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >

        {/* Chat header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2, borderBottom: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#f3e8ff', color: '#7e22ce', fontSize: '0.875rem', fontWeight: 700, flexShrink: 0 }}>
            AI
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              DevLaunch AI assistant
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#16a34a' }}>
              ● Online · Powered by Claude
            </Typography>
          </Box>
          {!escalated && (
            <Button
              onClick={handleEscalate}
              variant="outlined"
              disableElevation
              sx={{
                fontSize: '0.75rem',
                textTransform: 'none',
                borderRadius: '8px',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                flexShrink: 0,
                '&:hover': { bgcolor: 'var(--bg-tertiary)', borderColor: 'var(--border)' },
              }}
            >
              Talk to human
            </Button>
          )}
        </Box>

        {/* Quick chips */}
        <Box sx={{ px: 2.5, pt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {quickChips.map(chip => (
            <Chip
              key={chip}
              label={chip}
              onClick={() => sendMessage(chip)}
              variant="outlined"
              sx={{
                fontSize: '0.75rem',
                borderColor: 'var(--border)',
                color: 'var(--text-muted)',
                bgcolor: 'transparent',
                '&:hover': { bgcolor: 'var(--blue-light)', color: 'var(--blue)', borderColor: 'var(--blue)' },
              }}
            />
          ))}
        </Box>

        {/* Messages */}
        <Box sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 2, minHeight: 350, maxHeight: 500, overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              {m.role === 'assistant' && (
                <Avatar sx={{ width: 28, height: 28, bgcolor: '#f3e8ff', color: '#7e22ce', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, mt: 0.5 }}>
                  AI
                </Avatar>
              )}
              <Box
                sx={{
                  maxWidth: { xs: '20rem', lg: '28rem' },
                  px: 2,
                  py: 1.25,
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  ...(m.role === 'user'
                    ? {
                        bgcolor: 'var(--blue)',
                        color: '#fff',
                        borderRadius: '16px',
                        borderBottomRightRadius: '4px',
                      }
                    : {
                        bgcolor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        borderRadius: '16px',
                        borderBottomLeftRadius: '4px',
                        border: '1px solid var(--border)',
                      }),
                }}
              >
                {m.content}
              </Box>
            </Box>
          ))}

          {loading && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#f3e8ff', color: '#7e22ce', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                AI
              </Avatar>
              <Box sx={{ bgcolor: 'var(--bg-tertiary)', px: 2, py: 1.5, borderRadius: '16px', borderBottomLeftRadius: '4px', border: '1px solid var(--border)' }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {[0, 150, 300].map(delay => (
                    <Box
                      key={delay}
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: '#9ca3af',
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite',
                        animationDelay: `${delay}ms`,
                        '@keyframes bounce': {
                          '0%, 100%': { transform: 'translateY(0)' },
                          '50%': { transform: 'translateY(-25%)' },
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          )}
          <Box ref={bottomRef} />
        </Box>

        {/* Input */}
        <Box sx={{ px: 2.5, py: 2, borderTop: '1px solid var(--border)', display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
          <TextField
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') sendMessage() }}
            placeholder="Ask anything about your project..."
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                borderRadius: '12px',
                fontSize: '0.875rem',
              },
            }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            variant="contained"
            disableElevation
            sx={{
              px: 2,
              bgcolor: 'var(--blue)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderRadius: '12px',
              textTransform: 'none',
              flexShrink: 0,
              '&:hover': { bgcolor: 'var(--blue-dark)' },
            }}
          >
            Send
          </Button>
        </Box>

      </Paper>
    </Box>
  )
}
