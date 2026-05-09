import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import Providers from '@/components/Providers'
import './globals.css'
import AppShell from '@/components/layout/AppShell'
import { Inter } from 'next/font/google'
import React from 'react'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <AppRouterCacheProvider>
          <Providers>
            <AppShell>{children}</AppShell>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}