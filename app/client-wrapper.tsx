'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Header />}
      <main className={`min-h-screen ${isAdmin ? '' : 'pt-[112px]'}`}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}
