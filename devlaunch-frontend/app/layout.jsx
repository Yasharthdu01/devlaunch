import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export const metadata = {
  title: 'DevLaunch — AI Delivery Platform',
  description: 'End-to-end software delivery platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 min-w-0">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-5 bg-gray-50">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}