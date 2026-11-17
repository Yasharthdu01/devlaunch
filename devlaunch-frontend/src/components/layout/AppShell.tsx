'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import FloatingWhatsApp from '../FloatingWhatsApp'

const PUBLIC_PAGES = ['/', '/about', '/services', '/portfolio-public', '/pricing-public', '/contact', '/blog', '/audit', '/whatsapp']
const AUTH_PAGES   = ['/login', '/register', '/forgot-password', '/invite']

// The /whatsapp product page is already WhatsApp-themed, so skip the floating
// button there to avoid redundancy.
const NO_FLOATING = ['/whatsapp']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the mobile menu whenever the page changes.
  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isPublicPage = PUBLIC_PAGES.includes(pathname) || pathname === '/'
  const isAuthPage   = AUTH_PAGES.includes(pathname)

  if (isAuthPage || isPublicPage) {
    return (
      <>
        {children}
        {isPublicPage && !NO_FLOATING.includes(pathname) && <FloatingWhatsApp />}
      </>
    )
  }

  return (
    <Box sx={{ display: 'flex', height: 'calc(100dvh - var(--banner-h, 0px))', overflow: 'hidden', bgcolor: 'var(--bg-primary)' }}>
      {/* Desktop: fixed sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, height: '100%' }}>
        <Sidebar />
      </Box>

      {/* Mobile: slide-in menu, closed by default */}
      <Drawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
        slotProps={{ paper: { sx: { bgcolor: 'var(--sidebar-bg)', backgroundImage: 'none' } } }}
      >
        <Sidebar onClose={() => setMenuOpen(false)} onNavigate={() => setMenuOpen(false)} />
      </Drawer>

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, bgcolor: 'var(--bg-secondary)' }}>
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <Box component="main" sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
