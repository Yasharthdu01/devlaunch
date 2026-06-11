'use client'
import { usePathname } from 'next/navigation'
import Box from '@mui/material/Box'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const PUBLIC_PAGES = ['/', '/about', '/services', '/portfolio-public', '/pricing-public', '/contact', '/blog']
const AUTH_PAGES   = ['/login', '/register', '/forgot-password']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isPublicPage = PUBLIC_PAGES.includes(pathname) || pathname === '/'
  const isAuthPage   = AUTH_PAGES.includes(pathname)

  if (isAuthPage || isPublicPage) {
    return <>{children}</>
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
