import './globals.css'
import { ThemeProvider } from 'next-themes'
import AppShell from '@/components/layout/AppShell'
import Providers from '@/components/Providers'
import DemoBanner from '@/components/DemoBanner'

export const metadata = {
  title: 'DevLaunch — AI Delivery Platform',
  description: 'End-to-end software delivery platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <DemoBanner />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="devlaunch-theme"
        >
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}