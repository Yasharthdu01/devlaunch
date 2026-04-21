'use client'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const noShellPages = ['/login', '/register']

export default function AppShell({ children }) {
  const pathname = usePathname()
  const isAuthPage = noShellPages.includes(pathname)

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-5 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}