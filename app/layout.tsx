import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// Temporarily remove the theme provider import until we fix it
// import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
import { AuthProvider } from '@/app/context/AuthContext'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pačonž - Oglasi za nekretnine",
  description: "Pronađite oglase za nekretnine na prodaju i najam",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
        {children}
        </AuthProvider>
        {/* Temporarily remove the ThemeProvider until we fix it */}
        {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem> */}
        
        {/* </ThemeProvider> */}
        <Toaster />
      </body>
    </html>
  )
}
