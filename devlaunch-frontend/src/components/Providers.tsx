'use client'

import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme/theme'
import React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
