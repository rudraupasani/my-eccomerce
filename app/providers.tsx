'use client'

import { CartProvider } from '@/app/context/cart-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>
}
