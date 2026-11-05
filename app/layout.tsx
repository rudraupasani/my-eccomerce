import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
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

const cormorant = Cormorant_Garamond({ 
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Luméa - High Fine Jewelry & Quiet Luxury',
  description: 'Jewelry That Speaks In Quiet Luxury. Handcrafted with precious metals and natural gemstones.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="antialiased bg-white text-zinc-900 selection:bg-[#C5A059] selection:text-white">
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <ClientWrapper>{children}</ClientWrapper>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
        <Analytics />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </body>
    </html>
  )
}
