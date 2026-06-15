'use client'
import { useState } from 'react'
import { waLink, WHATSAPP_DISPLAY } from '@/lib/config'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MessageCircle, X } from 'lucide-react'

// Floating WhatsApp call-to-action for public marketing pages.
// Tapping it opens a wa.me chat with a prefilled message.
export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false)

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1300, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1.5 }}>
      {/* Popover card */}
      {open && (
        <Box sx={{ width: 280, bgcolor: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#075E54', px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.8rem' }}>DL</Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem' }}>DevLaunch</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}>Typically replies in minutes</Typography>
            </Box>
            <Box component="button" onClick={() => setOpen(false)} sx={{ cursor: 'pointer', bgcolor: 'transparent', border: 'none', color: 'rgba(255,255,255,0.85)', display: 'flex', p: 0.5 }}>
              <X size={18} />
            </Box>
          </Box>
          <Box sx={{ bgcolor: '#ECE5DD', px: 2, py: 2.5 }}>
            <Box sx={{ bgcolor: '#fff', borderRadius: '10px', borderTopLeftRadius: '2px', p: 1.5, boxShadow: '0 1px 1px rgba(0,0,0,0.08)' }}>
              <Typography sx={{ fontSize: '0.85rem', color: '#111', lineHeight: 1.5 }}>
                👋 Hi there! Want a website, app, or a WhatsApp AI agent? Message us and we'll help you get started.
              </Typography>
            </Box>
          </Box>
          <Box
            component="a"
            href={waLink('Hi DevLaunch! I came from your website and would like to know more.')}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, py: 1.5, bgcolor: '#25D366', color: '#fff', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', '&:hover': { bgcolor: '#1da851' } }}
          >
            <MessageCircle size={18} /> Start chat on WhatsApp
          </Box>
          <Typography sx={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', py: 0.75 }}>
            {WHATSAPP_DISPLAY}
          </Typography>
        </Box>
      )}

      {/* Floating button */}
      <Box
        component="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Chat on WhatsApp"
        sx={{
          cursor: 'pointer', border: 'none', width: 60, height: 60, borderRadius: '50%', bgcolor: '#25D366',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
          boxShadow: '0 6px 20px rgba(37,211,102,0.5)', transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.06)', bgcolor: '#1da851' },
        }}
      >
        {open ? <X size={26} /> : <MessageCircle size={28} />}
      </Box>
    </Box>
  )
}
