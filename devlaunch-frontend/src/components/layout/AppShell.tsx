'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const PUBLIC_PAGES = ['/', '/about', '/services', '/portfolio-public', '/pricing-public', '/contact', '/blog']
const AUTH_PAGES   = ['/login', '/register', '/forgot-password']

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isPublicPage = PUBLIC_PAGES.includes(pathname) || pathname === '/'
  const isAuthPage   = AUTH_PAGES.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  if (isPublicPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 bg-[var(--bg-secondary)]">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}