import type { Metadata } from 'next'
import { Inter } from 'next/font/google'


import './globals.css'

import { AuthContextProvider } from './(root)/context/AuthContext'
import { ThemeProvider } from '@/providers/theme-provider'
import { ModeToggle } from '@/components/Toogle-theme'
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import Navbar from '@/components/Navbar'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthContextProvider>
                 
            <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Navbar />
              <ModeToggle />
              {children}
              </ThemeProvider>
            </body>
        
      </AuthContextProvider>
    </html>
  )
}
