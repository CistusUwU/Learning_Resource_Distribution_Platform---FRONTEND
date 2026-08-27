import { AuthProvider } from '@providers/auth-provider'

import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import '@app/globals.css'
import { ThemeProvider } from '@providers/theme-provider'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-geist-sans',
})

export const metadata: Metadata = {
  title: 'MedEd Hub',
  description: 'Nền tảng học tập chất lượng cao'
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className = {`${inter.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider> 
        </ThemeProvider>
      </body>
    </html>
  )
}