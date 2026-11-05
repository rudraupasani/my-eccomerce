'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const isHome = pathname === '/'

  return (
    <>
      {!isAdmin && <Header />}
      <main className={`min-h-screen ${isAdmin ? '' : 'pb-16 lg:pb-0'} ${isAdmin || isHome ? '' : 'pt-20'}`}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  )
}
