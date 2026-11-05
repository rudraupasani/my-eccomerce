'use client'

import React, { useEffect } from 'react'
import { notFound } from 'next/navigation'
import { useAuth } from '@/app/context/auth-context'
import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminHeader } from '@/components/admin-header'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(false)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#FBFBFA] items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C5A059] mx-auto" />
          <p className="text-xs uppercase tracking-widest text-zinc-500">Authenticating Access…</p>
        </div>
      </div>
    )
  }

  if (!user || user.email !== 'rudraupasani2007@gmail.com') {
    notFound()
  }

  return (
    <div className="flex min-h-screen bg-[#FBFBFA] text-zinc-900">
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      {/* Spacer to push content when sidebar is fixed */}
      <div className={`transition-all duration-300 shrink-0 ${collapsed ? 'w-20' : 'w-72'}`} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#FBFBFA]">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
