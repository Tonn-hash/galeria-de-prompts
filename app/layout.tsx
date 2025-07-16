import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthActions } from "@/components/AuthActions" // Named import
import { SessionProvider } from "@/components/SessionProvider"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Prompt Gallery",
  description: "Explore and share AI prompts",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
                <Link
                  href="/"
                  className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
                >
                  PromptGallery
                </Link>
                <div className="flex items-center gap-4">
                  <Link href="/submit" className="text-gray-300 hover:text-white transition-colors">
                    Enviar Prompt
                  </Link>
                  <AuthActions />
                </div>
              </nav>
              <main className="flex-grow">{children}</main>
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
