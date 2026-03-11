import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/app/context/cart-context'
import { AuthProvider } from '@/app/context/auth-context'
import { WishlistProvider } from '@/app/context/wishlist-context'
import ClientWrapper from './client-wrapper'
import './globals.css'

const inter = Inter({ 
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
})

const playfairDisplay = Playfair_Display({ 
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Luxora — Exquisite Jewelry',
  description: 'Discover our curated collection of luxury jewelry, crafted with precision and elegance.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className="antialiased">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <ClientWrapper>{children}</ClientWrapper>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
