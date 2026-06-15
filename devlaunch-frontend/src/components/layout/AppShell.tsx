'use client'
import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import FloatingWhatsApp from '../FloatingWhatsApp'

const PUBLIC_PAGES = ['/', '/about', '/services', '/portfolio-public', '/pricing-public', '/contact', '/blog', '/audit', '/whatsapp']
const AUTH_PAGES   = ['/login', '/register', '/forgot-password']

// The /whatsapp product page is already WhatsApp-themed, so skip the floating
// button there to avoid redundancy.
const NO_FLOATING = ['/whatsapp']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'var(--bg-primary)' }}>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, bgcolor: 'var(--bg-secondary)' }}>
        <Topbar />
        <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}
