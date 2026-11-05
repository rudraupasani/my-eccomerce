'use client'

import React from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminHeader } from '@/components/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = React.useState(false)

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
