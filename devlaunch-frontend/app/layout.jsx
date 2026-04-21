import './globals.css'
import AppShell from '@/components/layout/AppShell'

export const metadata = {
  title: 'DevLaunch — AI Delivery Platform',
  description: 'End-to-end software delivery platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}