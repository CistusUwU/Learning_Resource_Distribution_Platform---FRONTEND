import { AuthProvider } from '@providers/auth-provider'

import localFont from 'next/font/local'
import type { Metadata } from 'next'
import '@app/globals.css'
import { ThemeProvider } from '@providers/theme-provider'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
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
      <body className = {`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider> 
        </ThemeProvider>
      </body>
    </html>
  )
}